-- Brasil Legalize Database Schema
-- PostgreSQL

-- Drop existing tables if they exist
DROP TABLE IF EXISTS admin_users CASCADE;
DROP TABLE IF EXISTS services CASCADE;
DROP TABLE IF EXISTS packages CASCADE;

-- Packages table
CREATE TABLE packages (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  name_es VARCHAR(255),
  name_pt VARCHAR(255),
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  adults_included INTEGER DEFAULT 2,
  children_included INTEGER DEFAULT 1,
  price_per_extra_adult DECIMAL(10,2) DEFAULT 500,
  price_per_extra_child DECIMAL(10,2) DEFAULT 300,
  is_active BOOLEAN DEFAULT true,
  is_popular BOOLEAN DEFAULT false,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE services (
  id SERIAL PRIMARY KEY,
  slug VARCHAR(50) UNIQUE NOT NULL,
  name_en VARCHAR(255) NOT NULL,
  name_ar VARCHAR(255),
  name_es VARCHAR(255),
  name_pt VARCHAR(255),
  description_en TEXT,
  price DECIMAL(10,2) NOT NULL DEFAULT 0,
  currency VARCHAR(3) DEFAULT 'USD',
  icon VARCHAR(100),
  color VARCHAR(50) DEFAULT 'primary',
  category VARCHAR(50) DEFAULT 'essential',
  included_in_basic BOOLEAN DEFAULT false,
  included_in_complete BOOLEAN DEFAULT true,
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Admin users table
CREATE TABLE admin_users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'admin',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insert packages
INSERT INTO packages (slug, name_en, name_ar, name_es, name_pt, description_en, price, adults_included, children_included, price_per_extra_adult, price_per_extra_child, is_active, is_popular, sort_order) VALUES
('basic', 'Basic Package', 'الباقة الأساسية', 'Paquete Básico', 'Pacote Básico', 'Essential support for expecting parents including all necessary government services', 3000, 2, 1, 500, 300, true, false, 1),
('complete', 'Complete Package', 'الباقة الشاملة', 'Paquete Completo', 'Pacote Completo', 'Comprehensive support with additional services for complete peace of mind', 5000, 2, 1, 500, 300, true, true, 2);

-- Insert services
INSERT INTO services (slug, name_en, name_ar, name_es, name_pt, description_en, price, icon, color, category, included_in_basic, included_in_complete, display_order) VALUES
('cpf', 'CPF Assistance', 'مساعدة CPF', 'Asistencia CPF', 'Assistência CPF', 'Get Brazilian tax number', 150, 'ri-bank-card-line', 'primary', 'essential', true, true, 1),
('sus', 'SUS Enrollment', 'تسجيل SUS', 'Inscripción SUS', 'Inscrição SUS', 'Free public health insurance', 100, 'ri-heart-pulse-line', 'secondary', 'essential', true, true, 2),
('birth_certificate', 'Birth Certificate', 'شهادة الميلاد', 'Certificado de Nacimiento', 'Certidão de Nascimento', 'Register your newborn', 200, 'ri-file-text-line', 'primary', 'essential', true, true, 3),
('rnm', 'RNM Application', 'طلب RNM', 'Solicitud RNM', 'Solicitação RNM', 'National ID for immigrant', 500, 'ri-shield-user-line', 'primary', 'essential', true, true, 4),
('rg', 'RG Services', 'خدمات RG', 'Servicios RG', 'Serviços RG', 'ID card for baby', 150, 'ri-id-card-line', 'primary', 'essential', true, true, 5),
('passport', 'Passport Services', 'خدمات جواز السفر', 'Servicios de Pasaporte', 'Serviços de Passaporte', 'Passport for baby', 300, 'ri-passport-line', 'secondary', 'essential', true, true, 6),
('airport_pickup', 'Airport Pickup', 'استقبال من المطار', 'Recogida en el Aeropuerto', 'Busca no Aeroporto', 'Transportation from airport', 100, 'ri-plane-line', 'accent', 'addon', false, true, 7),
('housing_assistance', 'Housing Assistance', 'المساعدة في السكن', 'Asistencia de Vivienda', 'Assistência de Moradia', 'Find temporary and long-term housing', 200, 'ri-home-4-line', 'accent', 'addon', false, true, 8),
('document_translation', 'Document Translation', 'ترجمة المستندات', 'Traducción de Documentos', 'Tradução de Documentos', 'Professional translation', 50, 'ri-translate-2', 'primary', 'addon', false, true, 9),
('document_legalization', 'Document Legalization', 'تصديق المستندات', 'Legalización de Documentos', 'Legalização de Documentos', 'Official certification', 100, 'ri-file-shield-line', 'primary', 'addon', false, true, 10),
('financial_advice', 'Financial Advice', 'استشارات مالية', 'Asesoría Financiera', 'Assessoria Financeira', 'Financial planning', 150, 'ri-money-dollar-circle-line', 'secondary', 'premium', false, true, 11),
('bank_account', 'Bank Account Setup', 'فتح حساب بنكي', 'Apertura de Cuenta Bancaria', 'Abertura de Conta Bancária', 'Assistance opening account', 100, 'ri-bank-line', 'secondary', 'premium', false, true, 12),
('cultural_orientation', 'Cultural Orientation', 'التوجيه الثقافي', 'Orientación Cultural', 'Orientação Cultural', 'Introduction to Brazilian culture', 100, 'ri-global-line', 'accent', 'premium', false, true, 13),
('language_assistance', 'Language Assistance', 'المساعدة اللغوية', 'Asistencia de Idiomas', 'Assistência de Idioma', 'Portuguese language classes', 150, 'ri-character-recognition-line', 'primary', 'premium', false, true, 14),
('local_guidance', 'Local Guidance', 'الإرشاد المحلي', 'Guía Local', 'Orientação Local', 'Recommendations for amenities', 75, 'ri-map-pin-line', 'accent', 'premium', false, true, 15),
('emergency_247', '24/7 Emergency Support', 'دعم الطوارئ على مدار الساعة', 'Soporte de Emergencia 24/7', 'Suporte de Emergência 24/7', 'Emergency hotline', 300, 'ri-alarm-warning-line', 'secondary', 'premium', false, true, 16),
('emergency_transport', 'Emergency Transport', 'النقل الطارئ', 'Transporte de Emergencia', 'Transporte de Emergência', 'Transportation coordination', 200, 'ri-ambulance-line', 'secondary', 'premium', false, true, 17),
('government_fees', 'Government Fees Coverage', 'تغطية الرسوم الحكومية', 'Cobertura de Tarifas Gubernamentales', 'Cobertura de Taxas Governamentais', 'All official government fees included', 400, 'ri-government-line', 'primary', 'essential', true, true, 18);

-- Insert admin user (password: Admin@123456)
INSERT INTO admin_users (email, password, name, role, is_active) VALUES
('admin@maocean360.com', 'Admin@123456', 'System Administrator', 'super_admin', true);
