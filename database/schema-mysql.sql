-- Brasil Legalize Admin Portal Database Schema
-- MySQL Version for Hostinger Production

-- ============================================
-- ADMINS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255) NOT NULL,
    role ENUM('super_admin', 'admin', 'support', 'finance') NOT NULL DEFAULT 'admin',
    avatar_url VARCHAR(512),
    is_active TINYINT(1) DEFAULT 1,
    last_login_at DATETIME,
    password_changed_at DATETIME,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    created_by INT,
    INDEX idx_admins_email (email),
    INDEX idx_admins_role (role),
    FOREIGN KEY (created_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ADMIN SESSIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS admin_sessions (
    id VARCHAR(64) PRIMARY KEY,
    admin_id INT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    expires_at DATETIME NOT NULL,
    last_activity_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(45),
    user_agent TEXT,
    device_trusted TINYINT(1) DEFAULT 0,
    revoked_at DATETIME DEFAULT NULL,
    INDEX idx_sessions_admin (admin_id),
    INDEX idx_sessions_expires (expires_at),
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ADMIN LOGIN ATTEMPTS (Rate Limiting)
-- ============================================
CREATE TABLE IF NOT EXISTS admin_login_attempts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    ip_address VARCHAR(45) NOT NULL,
    success TINYINT(1) NOT NULL,
    failure_reason VARCHAR(50),
    attempted_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_attempts_email (email),
    INDEX idx_attempts_ip (ip_address),
    INDEX idx_attempts_time (attempted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- ADMIN AUDIT LOG
-- ============================================
CREATE TABLE IF NOT EXISTS admin_audit_log (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    admin_id INT NOT NULL,
    action VARCHAR(50) NOT NULL,
    resource_type VARCHAR(50),
    resource_id INT,
    ip_address VARCHAR(45),
    user_agent TEXT,
    details JSON,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_audit_admin (admin_id),
    INDEX idx_audit_action (action),
    INDEX idx_audit_resource (resource_type, resource_id),
    INDEX idx_audit_time (created_at),
    FOREIGN KEY (admin_id) REFERENCES admins(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PRICING TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_key VARCHAR(50) UNIQUE NOT NULL,
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
    is_active TINYINT(1) DEFAULT 1,
    is_popular TINYINT(1) DEFAULT 0,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    INDEX idx_pricing_key (package_key),
    INDEX idx_pricing_active (is_active),
    FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- SERVICE PRICING (Individual Services)
-- ============================================
CREATE TABLE IF NOT EXISTS service_pricing (
    id INT AUTO_INCREMENT PRIMARY KEY,
    service_key VARCHAR(50) UNIQUE NOT NULL,
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
    category ENUM('essential', 'premium', 'addon') DEFAULT 'essential',
    is_active TINYINT(1) DEFAULT 1,
    display_order INT DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    updated_by INT,
    INDEX idx_service_key (service_key),
    INDEX idx_service_category (category),
    INDEX idx_service_active (is_active),
    FOREIGN KEY (updated_by) REFERENCES admins(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- PACKAGE SERVICES (Many-to-Many)
-- ============================================
CREATE TABLE IF NOT EXISTS package_services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    package_id INT NOT NULL,
    service_id INT NOT NULL,
    is_included TINYINT(1) DEFAULT 1,
    UNIQUE KEY unique_package_service (package_id, service_id),
    FOREIGN KEY (package_id) REFERENCES pricing(id) ON DELETE CASCADE,
    FOREIGN KEY (service_id) REFERENCES service_pricing(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================
-- INSERT DEFAULT SUPER ADMIN
-- Password: Admin@123456 (Argon2ID hash - change immediately in production!)
-- ============================================
INSERT INTO admins (email, password_hash, name, role, is_active) VALUES
('admin@brasillegalize.com', '$argon2id$v=19$m=65536,t=3,p=4$c29tZXNhbHQ$RdescudvJCsgt3ube/GQQ5E9DxJqIo6Ep0qWLhXhZB0', 'System Admin', 'super_admin', 1)
ON DUPLICATE KEY UPDATE email = email;

-- ============================================
-- INSERT DEFAULT PACKAGES
-- ============================================
INSERT INTO pricing (package_key, name_en, name_ar, name_es, name_pt, description_en, description_ar, description_es, description_pt, base_price, is_popular, display_order) VALUES
('basic', 'Basic Package', 'الباقة الأساسية', 'Paquete Básico', 'Pacote Básico', 
 'Essential support for expecting parents including all necessary government services',
 'دعم أساسي للآباء المتوقعين يشمل جميع الخدمات الحكومية الضرورية',
 'Apoyo esencial para futuros padres incluyendo todos los servicios gubernamentales necesarios',
 'Suporte essencial para futuros pais incluindo todos os serviços governamentais necessários',
 3000.00, 0, 1),
('complete', 'Complete Package', 'الباقة الشاملة', 'Paquete Completo', 'Pacote Completo',
 'Comprehensive support with additional services for complete peace of mind',
 'دعم شامل مع خدمات إضافية للراحة التامة',
 'Apoyo integral con servicios adicionales para total tranquilidad',
 'Suporte completo com serviços adicionais para total tranquilidade',
 5000.00, 1, 2)
ON DUPLICATE KEY UPDATE name_en = VALUES(name_en);

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
ON DUPLICATE KEY UPDATE name_en = VALUES(name_en);

-- ============================================
-- ASSIGN SERVICES TO PACKAGES
-- ============================================
-- Basic Package Services (first 7)
INSERT INTO package_services (package_id, service_id, is_included)
SELECT p.id, s.id, 1
FROM pricing p, service_pricing s
WHERE p.package_key = 'basic' 
AND s.service_key IN ('cpf', 'sus', 'birthCert', 'rnm', 'rg', 'passport', 'govFees')
ON DUPLICATE KEY UPDATE is_included = 1;

-- Complete Package Services (all)
INSERT INTO package_services (package_id, service_id, is_included)
SELECT p.id, s.id, 1
FROM pricing p, service_pricing s
WHERE p.package_key = 'complete'
ON DUPLICATE KEY UPDATE is_included = 1;
