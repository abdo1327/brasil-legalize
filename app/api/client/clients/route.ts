import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const CLIENTS_FILE = path.join(process.cwd(), 'storage', 'data', 'clients.json');
const APPLICATIONS_FILE = path.join(process.cwd(), 'storage', 'data', 'applications.json');
const LEADS_FILE = path.join(process.cwd(), 'storage', 'data', 'leads.json');

type ClientNote = {
  id: string;
  content: string;
  created_at: string;
  created_by: string;
};

function loadJson(file: string): any[] {
  try {
    if (!fs.existsSync(file)) {
      return [];
    }
    const content = fs.readFileSync(file, 'utf-8');
    return JSON.parse(content) || [];
  } catch {
    return [];
  }
}

function saveJson(file: string, data: any[]): void {
  const dir = path.dirname(file);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(file, JSON.stringify(data, null, 2));
}

function generateClientId(): string {
  const year = new Date().getFullYear();
  const clients = loadJson(CLIENTS_FILE);
  const count = clients.length + 1;
  return `CLT-${year}-${String(count).padStart(5, '0')}`;
}

function getClientById(clients: any[], id: string) {
  return clients.find((c) => c.id === id);
}

function getClientByEmail(clients: any[], email: string) {
  return clients.find((c) => c.email?.toLowerCase() === email?.toLowerCase());
}

function getClientCases(clientId: string) {
  const applications = loadJson(APPLICATIONS_FILE);
  const clients = loadJson(CLIENTS_FILE);
  const client = getClientById(clients, clientId);

  if (!client) return [];

  return applications.filter(
    (app: any) =>
      client.cases?.includes(app.id) ||
      app.email === client.email ||
      app.lead_id === client.lead_id
  );
}

function getClientProfile(clientId: string) {
  const clients = loadJson(CLIENTS_FILE);
  const client = getClientById(clients, clientId);

  if (!client) return null;

  // Get all cases
  client.cases_data = getClientCases(clientId);

  // Get lead data if exists
  if (client.lead_id) {
    const leads = loadJson(LEADS_FILE);
    const lead = leads.find((l: any) => l.id === client.lead_id);
    if (lead) {
      client.lead_data = lead;
    }
  }

  return client;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id');
  const action = searchParams.get('action');
  const search = searchParams.get('search');
  const source = searchParams.get('source');
  const historical = searchParams.get('historical');

  try {
    if (clientId) {
      if (action === 'profile') {
        const client = getClientProfile(clientId);
        if (client) {
          return NextResponse.json({ success: true, client });
        } else {
          return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
        }
      } else if (action === 'cases') {
        const cases = getClientCases(clientId);
        return NextResponse.json({ success: true, cases });
      } else {
        const clients = loadJson(CLIENTS_FILE);
        const client = getClientById(clients, clientId);
        if (client) {
          return NextResponse.json({ success: true, client });
        } else {
          return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
        }
      }
    } else {
      // List all clients with filters
      let clients = loadJson(CLIENTS_FILE);

      // Filter out archived
      clients = clients.filter((c: any) => !c.archived);

      if (search) {
        const searchLower = search.toLowerCase();
        clients = clients.filter(
          (c: any) =>
            c.name?.toLowerCase().includes(searchLower) ||
            c.email?.toLowerCase().includes(searchLower) ||
            c.phone?.includes(search) ||
            c.id?.toLowerCase().includes(searchLower)
        );
      }

      if (source) {
        clients = clients.filter((c: any) => c.source === source);
      }

      if (historical !== null) {
        const isHistorical = historical === 'true';
        clients = clients.filter((c: any) => (c.is_historical || false) === isHistorical);
      }

      // Sort by created date (newest first)
      clients.sort((a: any, b: any) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

      return NextResponse.json({
        success: true,
        clients,
        total: clients.length,
      });
    }
  } catch (error) {
    console.error('Error in clients API:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const input = await request.json();

    if (!input.name || !input.email) {
      return NextResponse.json({ success: false, error: 'Name and email are required' }, { status: 400 });
    }

    const clients = loadJson(CLIENTS_FILE);

    // Check if client with email already exists
    const existingClient = getClientByEmail(clients, input.email);
    if (existingClient) {
      return NextResponse.json(
        {
          success: false,
          error: 'Client with this email already exists',
          existing_client_id: existingClient.id,
        },
        { status: 409 }
      );
    }

    const newClient = {
      id: generateClientId(),
      lead_id: input.lead_id || null,
      name: input.name,
      email: input.email,
      phone: input.phone || null,
      whatsapp: input.whatsapp || input.phone || null,
      city: input.city || null,
      country: input.country || null,
      locale: input.locale || 'en',
      avatar_url: input.avatar_url || null,
      service_type: input.service_type || null,
      package: input.package || null,
      family_adults: input.family_adults || 2,
      family_children: input.family_children || 0,
      expected_travel_date: input.expected_travel_date || null,
      expected_due_date: input.expected_due_date || null,
      source: input.source || 'manual',
      referral_source: input.referral_source || null,
      is_historical: input.is_historical || false,
      tags: input.tags || [],
      financial: {
        total_paid: input.total_paid || 0,
        total_due: input.total_due || 0,
        currency: input.currency || 'USD',
        payments: input.payments || [],
      },
      cases: input.cases || [],
      notes: [] as ClientNote[],
      communication: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      created_by: input.created_by || 'admin',
    };

    // Add initial note if provided
    if (input.initial_note) {
      newClient.notes.push({
        id: `note-${Date.now()}`,
        content: input.initial_note,
        created_at: new Date().toISOString(),
        created_by: input.created_by || 'admin',
      });
    }

    clients.push(newClient);
    saveJson(CLIENTS_FILE, clients);

    return NextResponse.json({
      success: true,
      client: newClient,
      message: 'Client created successfully',
    });
  } catch (error) {
    console.error('Error creating client:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id');
  const action = searchParams.get('action');

  if (!clientId) {
    return NextResponse.json({ success: false, error: 'Client ID required' }, { status: 400 });
  }

  try {
    const input = await request.json();
    const clients = loadJson(CLIENTS_FILE);
    let updatedClient = null;

    for (let i = 0; i < clients.length; i++) {
      if (clients[i].id === clientId) {
        if (action === 'add-note') {
          clients[i].notes = clients[i].notes || [];
          clients[i].notes.push({
            id: `note-${Date.now()}`,
            content: input.content,
            created_at: new Date().toISOString(),
            created_by: input.created_by || 'admin',
          });
        } else if (action === 'add-communication') {
          clients[i].communication = clients[i].communication || [];
          clients[i].communication.push({
            id: `comm-${Date.now()}`,
            type: input.type || 'note',
            subject: input.subject || '',
            content: input.content,
            sent_at: new Date().toISOString(),
            sent_by: input.sent_by || 'admin',
          });
        } else if (action === 'add-payment') {
          clients[i].financial = clients[i].financial || { total_paid: 0, total_due: 0, currency: 'USD', payments: [] };
          clients[i].financial.payments = clients[i].financial.payments || [];
          clients[i].financial.payments.push({
            id: `pay-${Date.now()}`,
            amount: input.amount,
            method: input.method || 'other',
            reference: input.reference || null,
            date: input.date || new Date().toISOString().split('T')[0],
            notes: input.notes || '',
            recorded_at: new Date().toISOString(),
            recorded_by: input.recorded_by || 'admin',
          });
          clients[i].financial.total_paid = (clients[i].financial.total_paid || 0) + parseFloat(input.amount);
        } else if (action === 'link-case') {
          clients[i].cases = clients[i].cases || [];
          if (!clients[i].cases.includes(input.case_id)) {
            clients[i].cases.push(input.case_id);
          }
        } else {
          // Regular update
          const updateableFields = [
            'name', 'email', 'phone', 'whatsapp', 'city', 'country',
            'locale', 'avatar_url', 'service_type', 'package',
            'family_adults', 'family_children', 'expected_travel_date',
            'expected_due_date', 'tags', 'is_historical', 'referral_source',
          ];

          for (const field of updateableFields) {
            if (input[field] !== undefined) {
              clients[i][field] = input[field];
            }
          }

          if (input.financial) {
            clients[i].financial = { ...clients[i].financial, ...input.financial };
          }
        }

        clients[i].updated_at = new Date().toISOString();
        updatedClient = clients[i];
        break;
      }
    }

    if (!updatedClient) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    saveJson(CLIENTS_FILE, clients);
    return NextResponse.json({ success: true, client: updatedClient });
  } catch (error) {
    console.error('Error updating client:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get('id');

  if (!clientId) {
    return NextResponse.json({ success: false, error: 'Client ID required' }, { status: 400 });
  }

  try {
    const clients = loadJson(CLIENTS_FILE);
    let found = false;

    for (let i = 0; i < clients.length; i++) {
      if (clients[i].id === clientId) {
        clients[i].archived = true;
        clients[i].archived_at = new Date().toISOString();
        found = true;
        break;
      }
    }

    if (!found) {
      return NextResponse.json({ success: false, error: 'Client not found' }, { status: 404 });
    }

    saveJson(CLIENTS_FILE, clients);
    return NextResponse.json({ success: true, message: 'Client archived successfully' });
  } catch (error) {
    console.error('Error deleting client:', error);
    return NextResponse.json({ success: false, error: 'Internal server error' }, { status: 500 });
  }
}
