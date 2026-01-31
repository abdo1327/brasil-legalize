-- Migration: Add clients table and client_id to applications
-- Date: 2026-01-31

-- ============================================
-- CLIENTS TABLE
-- CRM: Central client records linking leads and applications
-- ============================================
CREATE TABLE IF NOT EXISTS clients (
    id SERIAL PRIMARY KEY,
    client_id VARCHAR(50) UNIQUE NOT NULL,
    -- Format: CLT-2026-00001
    lead_id INT REFERENCES leads(id) ON DELETE SET NULL,
    
    -- Contact Info
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    whatsapp VARCHAR(50),
    city VARCHAR(100),
    country VARCHAR(100),
    locale VARCHAR(10) DEFAULT 'en',
    avatar_url VARCHAR(512),
    
    -- Service Info
    service_type VARCHAR(50),
    package VARCHAR(50),
    family_adults INT DEFAULT 2,
    family_children INT DEFAULT 0,
    expected_travel_date DATE,
    expected_due_date DATE,
    
    -- Source Tracking
    source VARCHAR(50) DEFAULT 'eligibility',
    -- Sources: eligibility, manual, import, booking, referral
    referral_source VARCHAR(255),
    is_historical BOOLEAN DEFAULT FALSE,
    
    -- Tags for filtering
    tags JSONB DEFAULT '[]'::jsonb,
    
    -- Financial summary
    total_paid DECIMAL(10,2) DEFAULT 0,
    total_due DECIMAL(10,2) DEFAULT 0,
    currency VARCHAR(10) DEFAULT 'USD',
    payments JSONB DEFAULT '[]'::jsonb,
    
    -- Documents
    documents JSONB DEFAULT '[]'::jsonb,
    
    -- Notes and communication
    notes JSONB DEFAULT '[]'::jsonb,
    communications JSONB DEFAULT '[]'::jsonb,
    
    -- Status
    status VARCHAR(20) DEFAULT 'active',
    -- Status: active, inactive, archived
    archived BOOLEAN DEFAULT FALSE,
    archived_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_clients_client_id ON clients(client_id);
CREATE INDEX IF NOT EXISTS idx_clients_lead_id ON clients(lead_id);
CREATE INDEX IF NOT EXISTS idx_clients_email ON clients(email);
CREATE INDEX IF NOT EXISTS idx_clients_source ON clients(source);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_time ON clients(created_at);

-- Add client_id to applications table
ALTER TABLE applications 
ADD COLUMN IF NOT EXISTS client_id INT REFERENCES clients(id) ON DELETE SET NULL;

CREATE INDEX IF NOT EXISTS idx_applications_client ON applications(client_id);

-- Function to generate client ID
CREATE OR REPLACE FUNCTION generate_client_id() RETURNS VARCHAR(50) AS $$
DECLARE
    year_str VARCHAR(4);
    count_val INT;
BEGIN
    year_str := EXTRACT(YEAR FROM CURRENT_DATE)::VARCHAR;
    SELECT COUNT(*) + 1 INTO count_val FROM clients WHERE client_id LIKE 'CLT-' || year_str || '-%';
    RETURN 'CLT-' || year_str || '-' || LPAD(count_val::VARCHAR, 5, '0');
END;
$$ LANGUAGE plpgsql;
