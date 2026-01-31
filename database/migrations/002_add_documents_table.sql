-- ============================================
-- DOCUMENTS TABLE
-- Store document metadata for client uploads and admin uploads
-- ============================================
CREATE TABLE IF NOT EXISTS documents (
    id SERIAL PRIMARY KEY,
    client_id INT REFERENCES clients(id) ON DELETE CASCADE,
    case_id INT REFERENCES applications(id) ON DELETE SET NULL,
    request_id INT REFERENCES document_requests(id) ON DELETE SET NULL,
    
    -- File info
    original_name VARCHAR(255) NOT NULL,
    stored_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    
    -- Document metadata
    document_type VARCHAR(100) DEFAULT 'general',
    label VARCHAR(255),
    description TEXT,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- Status: pending, approved, rejected
    rejection_reason TEXT,
    reviewed_by VARCHAR(255),
    reviewed_at TIMESTAMP,
    
    -- Upload info
    uploaded_by_type VARCHAR(20) DEFAULT 'client',
    -- Type: client, admin
    uploaded_by VARCHAR(255),
    
    -- For replacement documents
    replaced_by INT REFERENCES documents(id),
    replaced_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_documents_client ON documents(client_id);
CREATE INDEX IF NOT EXISTS idx_documents_case ON documents(case_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_type ON documents(uploaded_by_type);
CREATE INDEX IF NOT EXISTS idx_documents_time ON documents(created_at DESC);

-- ============================================
-- DOCUMENT REQUESTS TABLE
-- Admin requests for specific documents from clients
-- ============================================
CREATE TABLE IF NOT EXISTS document_requests (
    id SERIAL PRIMARY KEY,
    client_id INT NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    case_id INT REFERENCES applications(id) ON DELETE SET NULL,
    
    document_type VARCHAR(100) NOT NULL,
    label VARCHAR(255) NOT NULL,
    description TEXT,
    instructions TEXT,
    
    is_required BOOLEAN DEFAULT TRUE,
    deadline DATE,
    
    -- Status
    status VARCHAR(50) DEFAULT 'pending',
    -- Status: pending, uploaded, approved, rejected
    
    -- Fulfillment
    fulfilled_by INT REFERENCES documents(id),
    fulfilled_at TIMESTAMP,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_doc_requests_client ON document_requests(client_id);
CREATE INDEX IF NOT EXISTS idx_doc_requests_case ON document_requests(case_id);
CREATE INDEX IF NOT EXISTS idx_doc_requests_status ON document_requests(status);

-- ============================================
-- ADMIN SETTINGS TABLE
-- Store admin preferences and configurations
-- ============================================
CREATE TABLE IF NOT EXISTS admin_settings (
    id SERIAL PRIMARY KEY,
    admin_id INT REFERENCES admins(id) ON DELETE CASCADE,
    setting_key VARCHAR(100) NOT NULL,
    setting_value TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(admin_id, setting_key)
);

CREATE INDEX IF NOT EXISTS idx_admin_settings_admin ON admin_settings(admin_id);
CREATE INDEX IF NOT EXISTS idx_admin_settings_key ON admin_settings(setting_key);
