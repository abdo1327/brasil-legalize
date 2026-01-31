-- Quick setup for leads, applications, and notifications tables
-- Run this in psql or pgAdmin if you already have the base schema

-- ============================================
-- LEADS TABLE (must be created first)
-- ============================================
CREATE TABLE IF NOT EXISTS leads (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    country VARCHAR(100),
    city VARCHAR(100),
    service_type VARCHAR(50),
    answers JSONB,
    eligibility_result VARCHAR(30),
    source VARCHAR(50) DEFAULT 'eligibility',
    status VARCHAR(20) DEFAULT 'new',
    consent BOOLEAN DEFAULT FALSE,
    consent_version VARCHAR(20),
    consent_timestamp TIMESTAMP,
    assigned_to INT,
    notes TEXT,
    locale VARCHAR(10),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_leads_email ON leads(email);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_service ON leads(service_type);
CREATE INDEX IF NOT EXISTS idx_leads_time ON leads(created_at);

-- ============================================
-- APPLICATIONS TABLE
-- CRM: 4 phases × 4 statuses workflow
-- ============================================
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50) UNIQUE NOT NULL,
    lead_id INT REFERENCES leads(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    locale VARCHAR(10) DEFAULT 'en',
    service_type VARCHAR(50),
    package VARCHAR(50),
    phase INT NOT NULL DEFAULT 1,
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    token VARCHAR(64),
    password VARCHAR(20),
    payment_amount DECIMAL(10, 2),
    payment_method VARCHAR(50),
    payment_date TIMESTAMP,
    timeline JSONB DEFAULT '[]'::jsonb,
    notes JSONB DEFAULT '[]'::jsonb,
    documents JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_applications_app_id ON applications(application_id);
CREATE INDEX IF NOT EXISTS idx_applications_lead ON applications(lead_id);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_phase ON applications(phase);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_token ON applications(token);
CREATE INDEX IF NOT EXISTS idx_applications_time ON applications(created_at);

-- ============================================
-- NOTIFICATIONS TABLE
-- Admin in-app notifications
-- ============================================
CREATE TABLE IF NOT EXISTS notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type VARCHAR(50) NOT NULL DEFAULT 'system',
    title VARCHAR(255) NOT NULL,
    message TEXT,
    application_id VARCHAR(50),
    client_name VARCHAR(255),
    action VARCHAR(100),
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_time ON notifications(created_at DESC);
