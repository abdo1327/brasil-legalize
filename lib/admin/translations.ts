/**
 * Admin Panel Translations
 * Supports: English (en), Portuguese (pt-br)
 */

export type AdminLocale = 'en' | 'pt-br';

export interface AdminDictionary {
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    add: string;
    search: string;
    filter: string;
    export: string;
    import: string;
    refresh: string;
    actions: string;
    status: string;
    date: string;
    name: string;
    email: string;
    phone: string;
    notes: string;
    all: string;
    none: string;
    yes: string;
    no: string;
    confirm: string;
    success: string;
    error: string;
    warning: string;
    info: string;
  };
  nav: {
    dashboard: string;
    applications: string;
    clients: string;
    documents: string;
    eligibility: string;
    pricing: string;
    notifications: string;
    settings: string;
    logout: string;
  };
  dashboard: {
    welcome: string;
    subtitle: string;
    totalClients: string;
    activeCases: string;
    pendingDocs: string;
    newLeads: string;
    sessions: string;
    casesByPhase: string;
    documentStatus: string;
    recentActivity: string;
    viewAll: string;
    quickLinks: string;
    viewClients: string;
    addClient: string;
  };
  clients: {
    title: string;
    subtitle: string;
    addNew: string;
    searchPlaceholder: string;
    noClients: string;
    clientDetails: string;
    contactInfo: string;
    caseHistory: string;
    documents: string;
    timeline: string;
    tabs: {
      overview: string;
      cases: string;
      documents: string;
      financial: string;
      communication: string;
      notes: string;
    };
    allCases: string;
    newCase: string;
    viewInPipeline: string;
    noService: string;
    noPackage: string;
    created: string;
    lastUpdate: string;
    serviceDetails: string;
    serviceType: string;
    package: string;
    preferredLanguage: string;
    expectedTravel: string;
    accountInfo: string;
    clientSince: string;
    lastUpdated: string;
    referredBy: string;
    totalCases: string;
    totalPaid: string;
    balanceDue: string;
    family: string;
    source: string;
    backToClients: string;
    clientNotFound: string;
    clientNotFoundDesc: string;
    historical: string;
    byClient: string;
    byCase: string;
    allSources: string;
    allClients: string;
    currentClients: string;
    historicalClients: string;
  };
  documents: {
    title: string;
    subtitle: string;
    upload: string;
    clientUploads: string;
    internalDocs: string;
    pending: string;
    approved: string;
    rejected: string;
    review: string;
    approve: string;
    reject: string;
    download: string;
    preview: string;
    noDocuments: string;
  };
  applications: {
    title: string;
    subtitle: string;
    newApplication: string;
    phases: {
      lead: string;
      onboarding: string;
      documents: string;
      completed: string;
    };
    status: {
      new: string;
      contacted: string;
      qualified: string;
      consultation_booked: string;
      consultation_done: string;
      proposal_sent: string;
      contract_signed: string;
      payment_received: string;
      docs_requested: string;
      docs_uploading: string;
      docs_complete: string;
      under_review: string;
      submitted: string;
      in_progress: string;
      approved: string;
      completed: string;
      on_hold: string;
      cancelled: string;
    };
  };
  eligibility: {
    title: string;
    subtitle: string;
    questions: string;
    rules: string;
    results: string;
    leads: string;
    preview: string;
    howToManage: string;
    toggleSwitch: string;
    clickPencil: string;
    conditional: string;
    required: string;
  };
  notifications: {
    title: string;
    markAllRead: string;
    noNotifications: string;
    viewHistory: string;
    unread: string;
    read: string;
    types: {
      client_action: string;
      system: string;
      reminder: string;
      alert: string;
    };
  };
  profile: {
    settings: string;
    changePassword: string;
    activeSessions: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
  };
  sidebar: {
    dashboard: string;
    applications: string;
    clients: string;
    documents: string;
    eligibility: string;
    pricing: string;
    collapse: string;
    openMenu: string;
  };
}

const en: AdminDictionary = {
  common: {
    loading: 'Loading...',
    save: 'Save',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit',
    add: 'Add',
    search: 'Search',
    filter: 'Filter',
    export: 'Export',
    import: 'Import',
    refresh: 'Refresh',
    actions: 'Actions',
    status: 'Status',
    date: 'Date',
    name: 'Name',
    email: 'Email',
    phone: 'Phone',
    notes: 'Notes',
    all: 'All',
    none: 'None',
    yes: 'Yes',
    no: 'No',
    confirm: 'Confirm',
    success: 'Success',
    error: 'Error',
    warning: 'Warning',
    info: 'Info',
  },
  nav: {
    dashboard: 'Dashboard',
    applications: 'Applications',
    clients: 'Clients',
    documents: 'Documents',
    eligibility: 'Eligibility',
    pricing: 'Pricing',
    notifications: 'Notifications',
    settings: 'Settings',
    logout: 'Logout',
  },
  dashboard: {
    welcome: 'Welcome',
    subtitle: 'Brasil Legalize Dashboard',
    totalClients: 'Total Clients',
    activeCases: 'Active Cases',
    pendingDocs: 'Pending Docs',
    newLeads: 'New Leads',
    sessions: 'Sessions',
    casesByPhase: 'Cases by Phase',
    documentStatus: 'Document Status',
    recentActivity: 'Recent Activity',
    viewAll: 'View all',
    quickLinks: 'Quick Links',
    viewClients: 'View Clients',
    addClient: 'Add Client',
  },
  clients: {
    title: 'Clients',
    subtitle: 'Manage your clients and their cases',
    addNew: 'Add Client',
    searchPlaceholder: 'Search clients...',
    noClients: 'No clients found',
    clientDetails: 'Client Details',
    contactInfo: 'Contact Information',
    caseHistory: 'Case History',
    documents: 'Documents',
    timeline: 'Timeline',
    tabs: {
      overview: 'Overview',
      cases: 'Cases',
      documents: 'Documents',
      financial: 'Financial',
      communication: 'Communication',
      notes: 'Notes',
    },
    allCases: 'All Cases',
    newCase: 'New Case',
    viewInPipeline: 'View in Pipeline',
    noService: 'No service',
    noPackage: 'No package',
    created: 'Created',
    lastUpdate: 'Last update',
    serviceDetails: 'Service Details',
    serviceType: 'Service Type',
    package: 'Package',
    preferredLanguage: 'Preferred Language',
    expectedTravel: 'Expected Travel',
    accountInfo: 'Account Info',
    clientSince: 'Client Since',
    lastUpdated: 'Last Updated',
    referredBy: 'Referred By',
    totalCases: 'Total Cases',
    totalPaid: 'Total Paid',
    balanceDue: 'Balance Due',
    family: 'Family',
    source: 'Source',
    backToClients: 'Back to Clients',
    clientNotFound: 'Client not found',
    clientNotFoundDesc: "The client you're looking for doesn't exist.",
    historical: 'Historical',
    byClient: 'By Client',
    byCase: 'By Case',
    allSources: 'All Sources',
    allClients: 'All Clients',
    currentClients: 'Current Clients',
    historicalClients: 'Historical Clients',
  },
  documents: {
    title: 'Documents',
    subtitle: 'Manage client and internal documents',
    upload: 'Upload Document',
    clientUploads: 'Client Uploads',
    internalDocs: 'Internal Documents',
    pending: 'Pending',
    approved: 'Approved',
    rejected: 'Rejected',
    review: 'Review',
    approve: 'Approve',
    reject: 'Reject',
    download: 'Download',
    preview: 'Preview',
    noDocuments: 'No documents found',
  },
  applications: {
    title: 'Applications',
    subtitle: 'Track and manage client applications',
    newApplication: 'New Application',
    phases: {
      lead: 'Lead',
      onboarding: 'Onboarding',
      documents: 'Documents',
      completed: 'Completed',
    },
    status: {
      new: 'New',
      contacted: 'Contacted',
      qualified: 'Qualified',
      consultation_booked: 'Consultation Booked',
      consultation_done: 'Consultation Done',
      proposal_sent: 'Proposal Sent',
      contract_signed: 'Contract Signed',
      payment_received: 'Payment Received',
      docs_requested: 'Docs Requested',
      docs_uploading: 'Docs Uploading',
      docs_complete: 'Docs Complete',
      under_review: 'Under Review',
      submitted: 'Submitted',
      in_progress: 'In Progress',
      approved: 'Approved',
      completed: 'Completed',
      on_hold: 'On Hold',
      cancelled: 'Cancelled',
    },
  },
  eligibility: {
    title: 'Eligibility Flow Manager',
    subtitle: 'Configure the eligibility questionnaire, rules, and outcomes',
    questions: 'Questions',
    rules: 'Rules',
    results: 'Results',
    leads: 'Leads',
    preview: 'Preview Flow',
    howToManage: 'How to manage questions:',
    toggleSwitch: 'Toggle the switch to enable/disable a question in the flow',
    clickPencil: 'Click the pencil icon to edit question text and options',
    conditional: 'Conditional',
    required: 'Required',
  },
  notifications: {
    title: 'Notifications',
    markAllRead: 'Mark all read',
    noNotifications: 'No notifications yet',
    viewHistory: 'View all history',
    unread: 'Unread',
    read: 'Read',
    types: {
      client_action: 'Client',
      system: 'System',
      reminder: 'Reminder',
      alert: 'Alert',
    },
  },
  profile: {
    settings: 'Profile Settings',
    changePassword: 'Change Password',
    activeSessions: 'Active Sessions',
    currentPassword: 'Current Password',
    newPassword: 'New Password',
    confirmPassword: 'Confirm Password',
  },
  sidebar: {
    dashboard: 'Dashboard',
    applications: 'Applications',
    clients: 'Clients',
    documents: 'Documents',
    eligibility: 'Eligibility',
    pricing: 'Pricing',
    collapse: 'Collapse',
    openMenu: 'Open menu',
  },
};

const ptBr: AdminDictionary = {
  common: {
    loading: 'Carregando...',
    save: 'Salvar',
    cancel: 'Cancelar',
    delete: 'Excluir',
    edit: 'Editar',
    add: 'Adicionar',
    search: 'Pesquisar',
    filter: 'Filtrar',
    export: 'Exportar',
    import: 'Importar',
    refresh: 'Atualizar',
    actions: 'Ações',
    status: 'Status',
    date: 'Data',
    name: 'Nome',
    email: 'E-mail',
    phone: 'Telefone',
    notes: 'Notas',
    all: 'Todos',
    none: 'Nenhum',
    yes: 'Sim',
    no: 'Não',
    confirm: 'Confirmar',
    success: 'Sucesso',
    error: 'Erro',
    warning: 'Aviso',
    info: 'Info',
  },
  nav: {
    dashboard: 'Painel',
    applications: 'Aplicações',
    clients: 'Clientes',
    documents: 'Documentos',
    eligibility: 'Elegibilidade',
    pricing: 'Preços',
    notifications: 'Notificações',
    settings: 'Configurações',
    logout: 'Sair',
  },
  dashboard: {
    welcome: 'Bem-vindo',
    subtitle: 'Painel Brasil Legalize',
    totalClients: 'Total de Clientes',
    activeCases: 'Casos Ativos',
    pendingDocs: 'Docs Pendentes',
    newLeads: 'Novos Leads',
    sessions: 'Sessões',
    casesByPhase: 'Casos por Fase',
    documentStatus: 'Status de Documentos',
    recentActivity: 'Atividade Recente',
    viewAll: 'Ver todos',
    quickLinks: 'Links Rápidos',
    viewClients: 'Ver Clientes',
    addClient: 'Adicionar Cliente',
  },
  clients: {
    title: 'Clientes',
    subtitle: 'Gerencie seus clientes e seus casos',
    addNew: 'Adicionar Cliente',
    searchPlaceholder: 'Pesquisar clientes...',
    noClients: 'Nenhum cliente encontrado',
    clientDetails: 'Detalhes do Cliente',
    contactInfo: 'Informações de Contato',
    caseHistory: 'Histórico de Casos',
    documents: 'Documentos',
    timeline: 'Linha do Tempo',
    tabs: {
      overview: 'Visão Geral',
      cases: 'Casos',
      documents: 'Documentos',
      financial: 'Financeiro',
      communication: 'Comunicação',
      notes: 'Notas',
    },
    allCases: 'Todos os Casos',
    newCase: 'Novo Caso',
    viewInPipeline: 'Ver no Pipeline',
    noService: 'Sem serviço',
    noPackage: 'Sem pacote',
    created: 'Criado',
    lastUpdate: 'Última atualização',
    serviceDetails: 'Detalhes do Serviço',
    serviceType: 'Tipo de Serviço',
    package: 'Pacote',
    preferredLanguage: 'Idioma Preferido',
    expectedTravel: 'Viagem Esperada',
    accountInfo: 'Info da Conta',
    clientSince: 'Cliente Desde',
    lastUpdated: 'Última Atualização',
    referredBy: 'Indicado Por',
    totalCases: 'Total de Casos',
    totalPaid: 'Total Pago',
    balanceDue: 'Saldo Devido',
    family: 'Família',
    source: 'Origem',
    backToClients: 'Voltar para Clientes',
    clientNotFound: 'Cliente não encontrado',
    clientNotFoundDesc: 'O cliente que você procura não existe.',
    historical: 'Histórico',
    byClient: 'Por Cliente',
    byCase: 'Por Caso',
    allSources: 'Todas as Origens',
    allClients: 'Todos os Clientes',
    currentClients: 'Clientes Atuais',
    historicalClients: 'Clientes Históricos',
  },
  documents: {
    title: 'Documentos',
    subtitle: 'Gerencie documentos de clientes e internos',
    upload: 'Enviar Documento',
    clientUploads: 'Uploads de Clientes',
    internalDocs: 'Documentos Internos',
    pending: 'Pendente',
    approved: 'Aprovado',
    rejected: 'Rejeitado',
    review: 'Revisar',
    approve: 'Aprovar',
    reject: 'Rejeitar',
    download: 'Baixar',
    preview: 'Visualizar',
    noDocuments: 'Nenhum documento encontrado',
  },
  applications: {
    title: 'Aplicações',
    subtitle: 'Acompanhe e gerencie aplicações de clientes',
    newApplication: 'Nova Aplicação',
    phases: {
      lead: 'Lead',
      onboarding: 'Onboarding',
      documents: 'Documentos',
      completed: 'Concluído',
    },
    status: {
      new: 'Novo',
      contacted: 'Contactado',
      qualified: 'Qualificado',
      consultation_booked: 'Consulta Agendada',
      consultation_done: 'Consulta Realizada',
      proposal_sent: 'Proposta Enviada',
      contract_signed: 'Contrato Assinado',
      payment_received: 'Pagamento Recebido',
      docs_requested: 'Docs Solicitados',
      docs_uploading: 'Docs em Envio',
      docs_complete: 'Docs Completos',
      under_review: 'Em Revisão',
      submitted: 'Submetido',
      in_progress: 'Em Progresso',
      approved: 'Aprovado',
      completed: 'Concluído',
      on_hold: 'Em Espera',
      cancelled: 'Cancelado',
    },
  },
  eligibility: {
    title: 'Gerenciador de Elegibilidade',
    subtitle: 'Configure o questionário de elegibilidade, regras e resultados',
    questions: 'Perguntas',
    rules: 'Regras',
    results: 'Resultados',
    leads: 'Leads',
    preview: 'Visualizar Fluxo',
    howToManage: 'Como gerenciar perguntas:',
    toggleSwitch: 'Alterne o botão para habilitar/desabilitar uma pergunta no fluxo',
    clickPencil: 'Clique no ícone de lápis para editar o texto e opções da pergunta',
    conditional: 'Condicional',
    required: 'Obrigatório',
  },
  notifications: {
    title: 'Notificações',
    markAllRead: 'Marcar todas como lidas',
    noNotifications: 'Sem notificações ainda',
    viewHistory: 'Ver todo o histórico',
    unread: 'Não lidas',
    read: 'Lidas',
    types: {
      client_action: 'Cliente',
      system: 'Sistema',
      reminder: 'Lembrete',
      alert: 'Alerta',
    },
  },
  profile: {
    settings: 'Configurações do Perfil',
    changePassword: 'Alterar Senha',
    activeSessions: 'Sessões Ativas',
    currentPassword: 'Senha Atual',
    newPassword: 'Nova Senha',
    confirmPassword: 'Confirmar Senha',
  },
  sidebar: {
    dashboard: 'Painel',
    applications: 'Aplicações',
    clients: 'Clientes',
    documents: 'Documentos',
    eligibility: 'Elegibilidade',
    pricing: 'Preços',
    collapse: 'Recolher',
    openMenu: 'Abrir menu',
  },
};

const adminDictionaries: Record<AdminLocale, AdminDictionary> = {
  en,
  'pt-br': ptBr,
};

export function getAdminDictionary(locale: AdminLocale): AdminDictionary {
  return adminDictionaries[locale] || adminDictionaries.en;
}

export const adminLocales: AdminLocale[] = ['en', 'pt-br'];
export const defaultAdminLocale: AdminLocale = 'en';
