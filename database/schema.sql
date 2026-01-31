-- Brasil Legalize Admin Portal Database Schema
-- Compatible with PostgreSQL (dev) and MySQL (production on Hostinger)

-- ============================================
-- ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'admin',
    -- Roles: super_admin, admin, support, finance
    avatar_url VARCHAR(512),
    is_active BOOLEAN DEFAULT TRUE,
    last_login_at TIMESTAMP,
    password_changed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    created_by INT REFERENCES admins(id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_admins_email ON admins(email);
CREATE INDEX IF NOT EXISTS idx_admins_role ON admins(role);

-- ============================================
-- ADMIN SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_sessions (
    id VARCHAR(64) PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES admins(id) ON DELETE CASCADE,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP NOT NULL,
    last_activity_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_trusted BOOLEAN DEFAULT FALSE,
    revoked_at TIMESTAMP DEFAULT NULL
);

CREATE INDEX IF NOT EXISTS idx_sessions_admin ON admin_sessions(admin_id);
CREATE INDEX IF NOT EXISTS idx_sessions_expires ON admin_sessions(expires_at);

-- ============================================
-- ADMIN LOGIN ATTEMPTS (Rate Limiting)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_login_attempts (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    success BOOLEAN NOT NULL,
    failure_reason VARCHAR(50),
    attempted_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_attempts_email ON admin_login_attempts(email);
CREATE INDEX IF NOT EXISTS idx_attempts_ip ON admin_login_attempts(ip_address);
CREATE INDEX IF NOT EXISTS idx_attempts_time ON admin_login_attempts(attempted_at);

-- ============================================
-- ADMIN AUDIT LOG
-- ============================================
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id SERIAL PRIMARY KEY,
    admin_id INT NOT NULL REFERENCES admins(id),
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSONB,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_audit_admin ON admin_audit_log(admin_id);
CREATE INDEX IF NOT EXISTS idx_audit_action ON admin_audit_log(action);
CREATE INDEX IF NOT EXISTS idx_audit_resource ON admin_audit_log(resource_type, resource_id);
CREATE INDEX IF NOT EXISTS idx_audit_time ON admin_audit_log(created_at);

-- ============================================
-- PRICING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pricing (
    id SERIAL PRIMARY KEY,
    package_key VARCHAR(50) UNIQUE NOT NULL,
    -- Package keys: basic, complete
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    name_es VARCHAR(255),
    name_pt VARCHAR(255),
    description_en TEXT,
    description_ar TEXT,
    description_es TEXT,
    description_pt TEXT,
    base_price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    adults_included INT DEFAULT 2,
    children_included INT DEFAULT 1,
    price_per_extra_adult DECIMAL(10, 2) DEFAULT 0,
    price_per_extra_child DECIMAL(10, 2) DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    is_popular BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES admins(id)
);

CREATE INDEX IF NOT EXISTS idx_pricing_key ON pricing(package_key);
CREATE INDEX IF NOT EXISTS idx_pricing_active ON pricing(is_active);

-- ============================================
-- SERVICE PRICING (Individual Services)
-- ============================================
CREATE TABLE IF NOT EXISTS service_pricing (
    id SERIAL PRIMARY KEY,
    service_key VARCHAR(50) UNIQUE NOT NULL,
    -- Service keys: cpf, sus, birthCert, rnm, rg, passport, etc.
    name_en VARCHAR(255) NOT NULL,
    name_ar VARCHAR(255),
    name_es VARCHAR(255),
    name_pt VARCHAR(255),
    description_en TEXT,
    description_ar TEXT,
    description_es TEXT,
    description_pt TEXT,
    price DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(10) DEFAULT 'USD',
    icon VARCHAR(100),
    color VARCHAR(50) DEFAULT 'primary',
    category VARCHAR(50) DEFAULT 'essential',
    -- Categories: essential, premium, addon
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_by INT REFERENCES admins(id)
);

CREATE INDEX IF NOT EXISTS idx_service_key ON service_pricing(service_key);
CREATE INDEX IF NOT EXISTS idx_service_category ON service_pricing(category);
CREATE INDEX IF NOT EXISTS idx_service_active ON service_pricing(is_active);

-- ============================================
-- PACKAGE SERVICES (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS package_services (
    id SERIAL PRIMARY KEY,
    package_id INT NOT NULL REFERENCES pricing(id) ON DELETE CASCADE,
    service_id INT NOT NULL REFERENCES service_pricing(id) ON DELETE CASCADE,
    is_included BOOLEAN DEFAULT TRUE,
    UNIQUE(package_id, service_id)
);

-- ============================================
-- INSERT DEFAULT SUPER ADMIN
-- Password: Admin@123456 (change immediately in production!)
-- ============================================
INSERT INTO admins (email, password_hash, name, role, is_active) VALUES
('admin@maocean360.com', '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgt3ube/GQQ5E9DxJqIo6Ep0qWLhXhZB0', 'System Admin', 'super_admin', TRUE)
ON CONFLICT (email) DO NOTHING;

-- ============================================
-- INSERT DEFAULT PACKAGES
-- ============================================
INSERT INTO pricing (package_key, name_en, name_ar, name_es, name_pt, description_en, description_ar, description_es, description_pt, base_price, is_popular, display_order) VALUES
('basic', 'Basic Package', 'الباقة الأساسية', 'Paquete Básico', 'Pacote Básico', 
 'Essential support for expecting parents including all necessary government services',
 'دعم أساسي للآباء المتوقعين يشمل جميع الخدمات الحكومية الضرورية',
 'Apoyo esencial para futuros padres incluyendo todos los servicios gubernamentales necesarios',
 'Suporte essencial para futuros pais incluindo todos os serviços governamentais necessários',
 3000.00, FALSE, 1),
('complete', 'Complete Package', 'الباقة الشاملة', 'Paquete Completo', 'Pacote Completo',
 'Comprehensive support with additional services for complete peace of mind',
 'دعم شامل مع خدمات إضافية للراحة التامة',
 'Apoyo integral con servicios adicionales para total tranquilidad',
 'Suporte completo com serviços adicionais para total tranquilidade',
 5000.00, TRUE, 2)
ON CONFLICT (package_key) DO NOTHING;

-- ============================================
-- INSERT DEFAULT SERVICES
-- ============================================
INSERT INTO service_pricing (service_key, name_en, name_ar, name_es, name_pt, description_en, price, icon, color, category, display_order) VALUES
('cpf', 'CPF Assistance (Tax Number)', 'مساعدة CPF (رقم الضريبة)', 'Asistencia CPF (Número Fiscal)', 'Assistência CPF (Número Fiscal)', 'Help obtaining your Brazilian CPF tax number', 200.00, 'ri-bank-card-line', 'primary', 'essential', 1),
('sus', 'SUS Enrollment (Health Insurance)', 'التسجيل في SUS (التأمين الصحي)', 'Inscripción SUS (Seguro Médico)', 'Inscrição SUS (Seguro Saúde)', 'Registration in the Brazilian public health system', 150.00, 'ri-heart-pulse-line', 'primary', 'essential', 2),
('birthCert', 'Birth Certificate for Baby', 'شهادة الميلاد للطفل', 'Certificado de Nacimiento', 'Certidão de Nascimento', 'Obtaining an official Brazilian birth certificate', 300.00, 'ri-file-text-line', 'secondary', 'essential', 3),
('rnm', 'RNM Application (Immigrant ID)', 'طلب RNM (هوية المهاجر)', 'Solicitud RNM (ID Inmigrante)', 'Solicitação RNM (ID Imigrante)', 'Obtaining the National Migrant Registration card', 400.00, 'ri-shield-user-line', 'primary', 'essential', 4),
('rg', 'RG Card for Baby', 'بطاقة RG للطفل', 'Tarjeta RG para Bebé', 'Carteira RG para Bebê', 'Obtaining the Brazilian RG identity card', 250.00, 'ri-contacts-book-line', 'secondary', 'essential', 5),
('passport', 'Passport for Baby', 'جواز سفر الطفل', 'Pasaporte para Bebé', 'Passaporte para Bebê', 'Assistance in obtaining a Brazilian passport', 350.00, 'ri-passport-line', 'accent', 'essential', 6),
('govFees', 'Government Fees', 'الرسوم الحكومية', 'Tasas Gubernamentales', 'Taxas Governamentais', 'Coverage of all government fees', 500.00, 'ri-government-line', 'primary', 'essential', 7),
('airport', 'Airport Pickup', 'استقبال من المطار', 'Recogida en Aeropuerto', 'Busca no Aeroporto', 'Personal airport pickup and transfer', 150.00, 'ri-plane-line', 'secondary', 'premium', 8),
('housing', 'Housing Assistance', 'المساعدة في الإسكان', 'Asistencia de Vivienda', 'Assistência Habitacional', 'Help finding suitable accommodation', 200.00, 'ri-home-4-line', 'secondary', 'premium', 9),
('translation', 'Document Translation', 'ترجمة الوثائق', 'Traducción de Documentos', 'Tradução de Documentos', 'Certified translation of documents', 300.00, 'ri-translate-2', 'accent', 'premium', 10),
('legalization', 'Document Legalization', 'تصديق الوثائق', 'Legalización de Documentos', 'Legalização de Documentos', 'Authentication at official agencies', 250.00, 'ri-file-shield-line', 'accent', 'premium', 11),
('financial', 'Financial Advice', 'استشارات مالية', 'Asesoría Financiera', 'Assessoria Financeira', 'Guidance on Brazilian banking', 150.00, 'ri-money-dollar-circle-line', 'accent', 'addon', 12),
('bank', 'Bank Account Setup', 'فتح حساب بنكي', 'Apertura de Cuenta Bancaria', 'Abertura de Conta Bancária', 'Assistance opening a bank account', 200.00, 'ri-bank-line', 'secondary', 'addon', 13),
('emergency', '24/7 Emergency Support', 'دعم طوارئ 24/7', 'Soporte 24/7', 'Suporte 24/7', 'Support line available 24/7', 300.00, 'ri-alarm-warning-line', 'primary', 'addon', 14),
('cultural', 'Cultural Orientation', 'توجيه ثقافي', 'Orientación Cultural', 'Orientação Cultural', 'Information about Brazilian culture', 100.00, 'ri-global-line', 'secondary', 'addon', 15),
('language', 'Language Assistance', 'مساعدة لغوية', 'Asistencia Idiomática', 'Assistência Linguística', 'Interpreter for appointments', 250.00, 'ri-character-recognition-line', 'accent', 'addon', 16),
('rnmDelivery', 'RNM Delivery Worldwide', 'توصيل RNM لأي مكان بالعالم', 'Envío RNM Mundial', 'Entrega RNM Mundial', 'Shipping RNM anywhere in the world', 200.00, 'ri-truck-line', 'primary', 'addon', 17)
ON CONFLICT (service_key) DO NOTHING;

-- ============================================
-- CONSENT LOG TABLE (LGPD Compliance)
-- Stores audit trail of all consent actions
-- ============================================
CREATE TABLE IF NOT EXISTS consent_log (
    id SERIAL PRIMARY KEY,
    visitor_id VARCHAR(64) NOT NULL,
    -- Anonymous identifier (hashed IP + user agent)
    action VARCHAR(20) NOT NULL,
    -- Actions: 'accepted', 'rejected', 'withdrawn'
    consent_status VARCHAR(20) NOT NULL,
    -- Status after action: 'accepted', 'rejected'
    policy_version VARCHAR(20) NOT NULL DEFAULT '1.0',
    ip_address VARCHAR(45),
    user_agent TEXT,
    locale VARCHAR(10),
    referrer TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_consent_visitor ON consent_log(visitor_id);
CREATE INDEX IF NOT EXISTS idx_consent_action ON consent_log(action);
CREATE INDEX IF NOT EXISTS idx_consent_time ON consent_log(created_at);

-- ============================================
-- PRIVACY DATA REQUESTS (LGPD Subject Rights)
-- Tracks data access, deletion, export requests
-- ============================================
CREATE TABLE IF NOT EXISTS privacy_requests (
    id SERIAL PRIMARY KEY,
    request_type VARCHAR(30) NOT NULL,
    -- Types: 'access', 'deletion', 'correction', 'portability', 'objection'
    email VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    phone VARCHAR(50),
    details TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    -- Status: 'pending', 'in_progress', 'completed', 'rejected'
    ip_address VARCHAR(45),
    user_agent TEXT,
    locale VARCHAR(10),
    processed_by INT REFERENCES admins(id),
    processed_at TIMESTAMP,
    response_notes TEXT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_privacy_email ON privacy_requests(email);
CREATE INDEX IF NOT EXISTS idx_privacy_type ON privacy_requests(request_type);
CREATE INDEX IF NOT EXISTS idx_privacy_status ON privacy_requests(status);
CREATE INDEX IF NOT EXISTS idx_privacy_time ON privacy_requests(created_at);

-- ============================================
-- ELIGIBILITY QUESTIONS TABLE
-- Admin-configurable questionnaire steps
-- ============================================
CREATE TABLE IF NOT EXISTS eligibility_questions (
    id SERIAL PRIMARY KEY,
    step_number INT NOT NULL,
    question_key VARCHAR(50) UNIQUE NOT NULL,
    -- Keys: 'service_interest', 'current_status', 'timeline', 'location'
    question_en TEXT NOT NULL,
    question_ar TEXT,
    question_es TEXT,
    question_pt TEXT,
    question_type VARCHAR(20) NOT NULL DEFAULT 'single_select',
    -- Types: 'single_select', 'multi_select', 'text', 'country', 'contact'
    is_required BOOLEAN DEFAULT TRUE,
    is_conditional BOOLEAN DEFAULT FALSE,
    -- If true, only show based on parent_question answer
    parent_question_key VARCHAR(50),
    parent_answer_value VARCHAR(50),
    -- Show this question when parent answer equals this value
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_eq_step ON eligibility_questions(step_number);
CREATE INDEX IF NOT EXISTS idx_eq_key ON eligibility_questions(question_key);
CREATE INDEX IF NOT EXISTS idx_eq_active ON eligibility_questions(is_active);

-- ============================================
-- ELIGIBILITY OPTIONS TABLE
-- Answer options for each question
-- ============================================
CREATE TABLE IF NOT EXISTS eligibility_options (
    id SERIAL PRIMARY KEY,
    question_id INT NOT NULL REFERENCES eligibility_questions(id) ON DELETE CASCADE,
    option_key VARCHAR(50) NOT NULL,
    label_en VARCHAR(255) NOT NULL,
    label_ar VARCHAR(255),
    label_es VARCHAR(255),
    label_pt VARCHAR(255),
    icon VARCHAR(50),
    -- Icon name for UI
    is_active BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(question_id, option_key)
);

CREATE INDEX IF NOT EXISTS idx_eo_question ON eligibility_options(question_id);

-- ============================================
-- ELIGIBILITY RULES TABLE
-- Rules to determine eligibility result
-- ============================================
CREATE TABLE IF NOT EXISTS eligibility_rules (
    id SERIAL PRIMARY KEY,
    rule_name VARCHAR(100) NOT NULL,
    result_type VARCHAR(30) NOT NULL,
    -- Results: 'likely_eligible', 'may_need_review', 'contact_for_assessment'
    conditions JSONB NOT NULL,
    -- JSON: {"service_interest": "citizenship", "current_status": "married_to_brazilian"}
    priority INT DEFAULT 50,
    -- Higher priority rules are checked first
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_er_result ON eligibility_rules(result_type);
CREATE INDEX IF NOT EXISTS idx_er_priority ON eligibility_rules(priority DESC);

-- ============================================
-- ELIGIBILITY RESULTS CONFIG TABLE
-- Configurable result messages and CTAs
-- ============================================
CREATE TABLE IF NOT EXISTS eligibility_results (
    id SERIAL PRIMARY KEY,
    result_type VARCHAR(30) UNIQUE NOT NULL,
    -- Types: 'likely_eligible', 'may_need_review', 'contact_for_assessment'
    icon VARCHAR(50),
    icon_color VARCHAR(50),
    bg_color VARCHAR(50),
    heading_en VARCHAR(255) NOT NULL,
    heading_ar VARCHAR(255),
    heading_es VARCHAR(255),
    heading_pt VARCHAR(255),
    description_en TEXT NOT NULL,
    description_ar TEXT,
    description_es TEXT,
    description_pt TEXT,
    primary_cta_text_en VARCHAR(100),
    primary_cta_text_ar VARCHAR(100),
    primary_cta_text_es VARCHAR(100),
    primary_cta_text_pt VARCHAR(100),
    primary_cta_link VARCHAR(255),
    secondary_cta_text_en VARCHAR(100),
    secondary_cta_text_ar VARCHAR(100),
    secondary_cta_text_es VARCHAR(100),
    secondary_cta_text_pt VARCHAR(100),
    secondary_cta_link VARCHAR(255),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- LEADS TABLE
-- Captures eligibility submissions
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
    -- Full answers JSON
    eligibility_result VARCHAR(30),
    source VARCHAR(50) DEFAULT 'eligibility',
    -- Sources: 'eligibility', 'contact', 'booking'
    status VARCHAR(20) DEFAULT 'new',
    -- Status: 'new', 'contacted', 'qualified', 'converted', 'closed'
    consent BOOLEAN DEFAULT FALSE,
    consent_version VARCHAR(20),
    consent_timestamp TIMESTAMP,
    assigned_to INT REFERENCES admins(id),
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
CREATE INDEX IF NOT EXISTS idx_leads_result ON leads(eligibility_result);
CREATE INDEX IF NOT EXISTS idx_leads_time ON leads(created_at);

-- ============================================
-- APPLICATIONS TABLE
-- CRM: 4 phases × 4 statuses workflow
-- ============================================
CREATE TABLE IF NOT EXISTS applications (
    id SERIAL PRIMARY KEY,
    application_id VARCHAR(50) UNIQUE NOT NULL,
    -- Format: APP-2024-00001
    lead_id INT REFERENCES leads(id) ON DELETE SET NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    locale VARCHAR(10) DEFAULT 'en',
    service_type VARCHAR(50),
    package VARCHAR(50),
    -- Phase: 1=Lead, 2=Potential, 3=Active Client, 4=Completion
    phase INT NOT NULL DEFAULT 1,
    -- Status: 16 statuses across 4 phases
    status VARCHAR(50) NOT NULL DEFAULT 'new',
    -- Token & password for client portal (generated at payment_received)
    token VARCHAR(64),
    password VARCHAR(20),
    -- Payment info
    payment_amount DECIMAL(10, 2),
    payment_method VARCHAR(50),
    payment_date TIMESTAMP,
    -- Timeline/notes stored as JSONB
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
    -- Types: system, lead, application, payment, document
    title VARCHAR(255) NOT NULL,
    message TEXT,
    application_id VARCHAR(50) REFERENCES applications(application_id) ON DELETE SET NULL,
    client_name VARCHAR(255),
    action VARCHAR(100),
    -- Actions: application_created, status_change_*, document_uploaded, etc.
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_notifications_read ON notifications(read);
CREATE INDEX IF NOT EXISTS idx_notifications_type ON notifications(type);
CREATE INDEX IF NOT EXISTS idx_notifications_time ON notifications(created_at DESC);

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

-- ============================================
-- INSERT DEFAULT ELIGIBILITY QUESTIONS
-- ============================================
INSERT INTO eligibility_questions (step_number, question_key, question_en, question_ar, question_es, question_pt, question_type, is_conditional, display_order) VALUES
(1, 'service_interest', 'What type of service are you interested in?', 'ما نوع الخدمة التي تهتم بها؟', '¿Qué tipo de servicio te interesa?', 'Que tipo de serviço você está interessado?', 'single_select', FALSE, 1),
(2, 'visa_status', 'What is your current visa status?', 'ما هي حالة تأشيرتك الحالية؟', '¿Cuál es tu estatus de visa actual?', 'Qual é o seu status de visto atual?', 'single_select', TRUE, 2),
(2, 'residency_status', 'Do you currently have any residency in Brazil?', 'هل لديك إقامة حالية في البرازيل؟', '¿Actualmente tienes residencia en Brasil?', 'Você atualmente tem residência no Brasil?', 'single_select', TRUE, 3),
(2, 'citizenship_status', 'What is your current citizenship status?', 'ما هي حالة جنسيتك الحالية؟', '¿Cuál es tu estatus de ciudadanía actual?', 'Qual é o seu status de cidadania atual?', 'single_select', TRUE, 4),
(2, 'document_type', 'What document service do you need?', 'ما خدمة الوثائق التي تحتاجها؟', '¿Qué servicio de documentos necesitas?', 'Qual serviço de documentos você precisa?', 'single_select', TRUE, 5),
(3, 'timeline', 'When do you need this completed?', 'متى تحتاج إلى إكمال هذا؟', '¿Cuándo necesitas completar esto?', 'Quando você precisa que isso seja concluído?', 'single_select', FALSE, 6),
(4, 'location', 'Where are you currently located?', 'أين تتواجد حالياً؟', '¿Dónde te encuentras actualmente?', 'Onde você está localizado atualmente?', 'country', FALSE, 7),
(5, 'contact', 'How can we reach you?', 'كيف يمكننا التواصل معك؟', '¿Cómo podemos contactarte?', 'Como podemos entrar em contato?', 'contact', FALSE, 8)
ON CONFLICT (question_key) DO NOTHING;

-- Update conditional questions parent references
UPDATE eligibility_questions SET parent_question_key = 'service_interest', parent_answer_value = 'visa' WHERE question_key = 'visa_status';
UPDATE eligibility_questions SET parent_question_key = 'service_interest', parent_answer_value = 'residency' WHERE question_key = 'residency_status';
UPDATE eligibility_questions SET parent_question_key = 'service_interest', parent_answer_value = 'citizenship' WHERE question_key = 'citizenship_status';
UPDATE eligibility_questions SET parent_question_key = 'service_interest', parent_answer_value = 'documents' WHERE question_key = 'document_type';

-- ============================================
-- INSERT DEFAULT ELIGIBILITY OPTIONS
-- ============================================
-- Service Interest Options
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order) 
SELECT id, 'visa', 'Visa Services', 'خدمات التأشيرات', 'Servicios de Visa', 'Serviços de Visto', 'passport', 1 FROM eligibility_questions WHERE question_key = 'service_interest'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'residency', 'Residency', 'الإقامة', 'Residencia', 'Residência', 'home', 2 FROM eligibility_questions WHERE question_key = 'service_interest'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'citizenship', 'Citizenship', 'الجنسية', 'Ciudadanía', 'Cidadania', 'flag', 3 FROM eligibility_questions WHERE question_key = 'service_interest'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'documents', 'Document Services', 'خدمات الوثائق', 'Servicios de Documentos', 'Serviços de Documentos', 'document', 4 FROM eligibility_questions WHERE question_key = 'service_interest'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'not_sure', 'Not Sure', 'غير متأكد', 'No estoy seguro', 'Não tenho certeza', 'question', 5 FROM eligibility_questions WHERE question_key = 'service_interest'
ON CONFLICT (question_id, option_key) DO NOTHING;

-- Visa Status Options
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'tourist', 'Tourist Visa', 'تأشيرة سياحية', 'Visa de Turista', 'Visto de Turista', 'plane', 1 FROM eligibility_questions WHERE question_key = 'visa_status'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'business', 'Business Visa', 'تأشيرة عمل', 'Visa de Negocios', 'Visto de Negócios', 'briefcase', 2 FROM eligibility_questions WHERE question_key = 'visa_status'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'no_visa', 'No Current Visa', 'لا تأشيرة حالية', 'Sin Visa Actual', 'Sem Visto Atual', 'x-circle', 3 FROM eligibility_questions WHERE question_key = 'visa_status'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'other', 'Other', 'أخرى', 'Otro', 'Outro', 'dots', 4 FROM eligibility_questions WHERE question_key = 'visa_status'
ON CONFLICT (question_id, option_key) DO NOTHING;

-- Residency Status Options
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'yes_temporary', 'Yes - Temporary', 'نعم - مؤقتة', 'Sí - Temporal', 'Sim - Temporária', 'clock', 1 FROM eligibility_questions WHERE question_key = 'residency_status'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'yes_permanent', 'Yes - Permanent', 'نعم - دائمة', 'Sí - Permanente', 'Sim - Permanente', 'check-circle', 2 FROM eligibility_questions WHERE question_key = 'residency_status'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'no', 'No', 'لا', 'No', 'Não', 'x-circle', 3 FROM eligibility_questions WHERE question_key = 'residency_status'
ON CONFLICT (question_id, option_key) DO NOTHING;

-- Citizenship Status Options
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'brazilian_descent', 'Brazilian by Descent', 'برازيلي بالنسب', 'Brasileño por Descendencia', 'Brasileiro por Descendência', 'family', 1 FROM eligibility_questions WHERE question_key = 'citizenship_status'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'married_brazilian', 'Married to Brazilian', 'متزوج من برازيلي', 'Casado con Brasileño', 'Casado com Brasileiro', 'heart', 2 FROM eligibility_questions WHERE question_key = 'citizenship_status'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'resident_4_years', 'Resident for 4+ Years', 'مقيم لأكثر من 4 سنوات', 'Residente por 4+ Años', 'Residente por 4+ Anos', 'calendar', 3 FROM eligibility_questions WHERE question_key = 'citizenship_status'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'none', 'None of the Above', 'لا شيء مما سبق', 'Ninguno de los Anteriores', 'Nenhuma das Anteriores', 'x-circle', 4 FROM eligibility_questions WHERE question_key = 'citizenship_status'
ON CONFLICT (question_id, option_key) DO NOTHING;

-- Document Type Options
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'legalization', 'Document Legalization', 'تصديق الوثائق', 'Legalización de Documentos', 'Legalização de Documentos', 'stamp', 1 FROM eligibility_questions WHERE question_key = 'document_type'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'translation', 'Certified Translation', 'ترجمة معتمدة', 'Traducción Certificada', 'Tradução Juramentada', 'language', 2 FROM eligibility_questions WHERE question_key = 'document_type'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'apostille', 'Apostille', 'أبوستيل', 'Apostilla', 'Apostila', 'certificate', 3 FROM eligibility_questions WHERE question_key = 'document_type'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'other', 'Other', 'أخرى', 'Otro', 'Outro', 'dots', 4 FROM eligibility_questions WHERE question_key = 'document_type'
ON CONFLICT (question_id, option_key) DO NOTHING;

-- Timeline Options
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'urgent', 'Urgent (within 1 month)', 'عاجل (خلال شهر)', 'Urgente (dentro de 1 mes)', 'Urgente (dentro de 1 mês)', 'bolt', 1 FROM eligibility_questions WHERE question_key = 'timeline'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'soon', 'Soon (1-3 months)', 'قريباً (1-3 أشهر)', 'Pronto (1-3 meses)', 'Em breve (1-3 meses)', 'clock', 2 FROM eligibility_questions WHERE question_key = 'timeline'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'flexible', 'Flexible (3+ months)', 'مرن (أكثر من 3 أشهر)', 'Flexible (3+ meses)', 'Flexível (3+ meses)', 'calendar', 3 FROM eligibility_questions WHERE question_key = 'timeline'
ON CONFLICT (question_id, option_key) DO NOTHING;
INSERT INTO eligibility_options (question_id, option_key, label_en, label_ar, label_es, label_pt, icon, display_order)
SELECT id, 'not_sure', 'Not Sure', 'غير متأكد', 'No estoy seguro', 'Não tenho certeza', 'question', 4 FROM eligibility_questions WHERE question_key = 'timeline'
ON CONFLICT (question_id, option_key) DO NOTHING;

-- ============================================
-- INSERT DEFAULT ELIGIBILITY RULES
-- ============================================
INSERT INTO eligibility_rules (rule_name, result_type, conditions, priority) VALUES
('Citizenship - Married to Brazilian', 'likely_eligible', '{"service_interest": "citizenship", "citizenship_status": "married_brazilian"}', 100),
('Citizenship - Brazilian Descent', 'likely_eligible', '{"service_interest": "citizenship", "citizenship_status": "brazilian_descent"}', 100),
('Residency - Has Temporary + Soon', 'likely_eligible', '{"service_interest": "residency", "residency_status": "yes_temporary", "timeline": "soon"}', 90),
('Residency - Has Temporary + Flexible', 'likely_eligible', '{"service_interest": "residency", "residency_status": "yes_temporary", "timeline": "flexible"}', 90),
('Visa - Tourist', 'likely_eligible', '{"service_interest": "visa", "visa_status": "tourist"}', 80),
('Citizenship - Resident 4+ Years', 'may_need_review', '{"service_interest": "citizenship", "citizenship_status": "resident_4_years"}', 70),
('Residency - No Current', 'may_need_review', '{"service_interest": "residency", "residency_status": "no"}', 70),
('Documents - Legalization', 'may_need_review', '{"service_interest": "documents", "document_type": "legalization"}', 60),
('Documents - Apostille', 'may_need_review', '{"service_interest": "documents", "document_type": "apostille"}', 60),
('Not Sure - Default', 'contact_for_assessment', '{"service_interest": "not_sure"}', 50),
('Urgent Citizenship', 'contact_for_assessment', '{"service_interest": "citizenship", "timeline": "urgent"}', 50),
('Citizenship - None', 'contact_for_assessment', '{"service_interest": "citizenship", "citizenship_status": "none"}', 50)
ON CONFLICT DO NOTHING;

-- ============================================
-- INSERT DEFAULT ELIGIBILITY RESULTS
-- ============================================
INSERT INTO eligibility_results (result_type, icon, icon_color, bg_color, heading_en, heading_ar, heading_es, heading_pt, description_en, description_ar, description_es, description_pt, primary_cta_text_en, primary_cta_text_ar, primary_cta_text_es, primary_cta_text_pt, primary_cta_link, secondary_cta_text_en, secondary_cta_text_ar, secondary_cta_text_es, secondary_cta_text_pt, secondary_cta_link) VALUES
('likely_eligible', 'check-circle', 'text-green-500', 'bg-green-50', 'Good News! You Likely Qualify', 'أخبار سارة! من المرجح أنك مؤهل', '¡Buenas Noticias! Probablemente Calificas', 'Boas Notícias! Você Provavelmente Se Qualifica', 'Based on your answers, you appear to meet the basic criteria for this service. Book a consultation to discuss the next steps.', 'بناءً على إجاباتك، يبدو أنك تستوفي المعايير الأساسية لهذه الخدمة. احجز استشارة لمناقشة الخطوات التالية.', 'Según tus respuestas, pareces cumplir con los criterios básicos para este servicio. Reserva una consulta para discutir los próximos pasos.', 'Com base nas suas respostas, você parece atender aos critérios básicos para este serviço. Agende uma consulta para discutir os próximos passos.', 'Book Consultation', 'احجز استشارة', 'Reservar Consulta', 'Agendar Consulta', '/book', 'View Packages', 'عرض الباقات', 'Ver Paquetes', 'Ver Pacotes', '/pricing'),
('may_need_review', 'info-circle', 'text-yellow-500', 'bg-yellow-50', 'Your Case Needs Review', 'حالتك تحتاج مراجعة', 'Tu Caso Necesita Revisión', 'Seu Caso Precisa de Revisão', 'Your situation may require additional documentation or verification. Schedule a free assessment to discuss your options.', 'قد يتطلب وضعك وثائق إضافية أو تحقق. حدد موعدًا لتقييم مجاني لمناقشة خياراتك.', 'Tu situación puede requerir documentación adicional o verificación. Programa una evaluación gratuita para discutir tus opciones.', 'Sua situação pode exigir documentação adicional ou verificação. Agende uma avaliação gratuita para discutir suas opções.', 'Schedule Free Assessment', 'حدد موعد تقييم مجاني', 'Programar Evaluación Gratuita', 'Agendar Avaliação Gratuita', '/book', 'Contact Us', 'اتصل بنا', 'Contáctanos', 'Entre em Contato', '/contact'),
('contact_for_assessment', 'chat-bubble', 'text-blue-500', 'bg-blue-50', 'Let''s Discuss Your Options', 'دعنا نناقش خياراتك', 'Hablemos de Tus Opciones', 'Vamos Discutir Suas Opções', 'Your situation is unique and deserves personalized attention. Let us help you understand your options and create a plan.', 'وضعك فريد ويستحق اهتمامًا شخصيًا. دعنا نساعدك على فهم خياراتك وإنشاء خطة.', 'Tu situación es única y merece atención personalizada. Permítenos ayudarte a entender tus opciones y crear un plan.', 'Sua situação é única e merece atenção personalizada. Deixe-nos ajudá-lo a entender suas opções e criar um plano.', 'Book a Consultation', 'احجز استشارة', 'Reservar Consulta', 'Agendar Consulta', '/book', 'WhatsApp Us', 'واتساب', 'WhatsApp', 'WhatsApp', 'https://wa.me/5511999999999')
ON CONFLICT (result_type) DO NOTHING;
