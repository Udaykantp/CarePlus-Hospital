-- ====================================================================
-- Healing Hands Clinic Management Platform - Multi-Tenant PostgreSQL Schema
-- HIPAA-Compliant Architecture with Row-Level Security (RLS) & Tenant Isolation
-- ====================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. TENANTS TABLE (Each clinic entity on the shared infrastructure)
CREATE TABLE IF NOT EXISTS tenants (
    id VARCHAR(64) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    subdomain VARCHAR(64) UNIQUE NOT NULL,
    custom_domain VARCHAR(255),
    tagline VARCHAR(255),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    state VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    emergency_helpline VARCHAR(50),
    email VARCHAR(100) NOT NULL,
    logo_url TEXT,
    tier VARCHAR(50) NOT NULL DEFAULT 'standard', -- standard, pro, enterprise
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    settings JSONB DEFAULT '{}'::jsonb
);

-- 2. USERS TABLE (Role-based access control with tenant isolation)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    email VARCHAR(150) NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(50) NOT NULL, -- super_admin, clinic_admin, doctor, receptionist, nurse, billing_staff, pharmacist, patient
    department VARCHAR(100),
    phone VARCHAR(50),
    qualification VARCHAR(255),
    registration_number VARCHAR(100),
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE,
    CONSTRAINT uq_tenant_user_email UNIQUE (tenant_id, email)
);

CREATE INDEX idx_users_tenant ON users(tenant_id);
CREATE INDEX idx_users_role ON users(role);

-- 3. PATIENTS TABLE (HIPAA Protected Health Information)
CREATE TABLE IF NOT EXISTS patients (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    mrn VARCHAR(64) NOT NULL, -- Medical Record Number e.g. HHMC-MRN-2026-001
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    blood_group VARCHAR(10) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150),
    address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    allergies TEXT[] DEFAULT ARRAY[]::TEXT[],
    chronic_conditions TEXT[] DEFAULT ARRAY[]::TEXT[],
    emergency_contact JSONB NOT NULL DEFAULT '{}'::jsonb,
    insurance_provider VARCHAR(100),
    insurance_policy_number VARCHAR(100),
    status VARCHAR(20) DEFAULT 'active',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_patient_mrn UNIQUE (tenant_id, mrn)
);

CREATE INDEX idx_patients_tenant ON patients(tenant_id);
CREATE INDEX idx_patients_mrn ON patients(mrn);
CREATE INDEX idx_patients_phone ON patients(phone);

-- 4. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(150) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    doctor_id VARCHAR(64) NOT NULL REFERENCES users(id),
    doctor_name VARCHAR(150) NOT NULL,
    department VARCHAR(100) NOT NULL,
    appointment_date DATE NOT NULL,
    time_slot VARCHAR(50) NOT NULL,
    type VARCHAR(30) NOT NULL, -- In-Clinic, Online Video, Home Visit
    chief_complaint TEXT NOT NULL,
    status VARCHAR(30) NOT NULL DEFAULT 'Scheduled', -- Scheduled, Confirmed, Checked In, In Consultation, Completed, Cancelled, No Show
    token_number INT,
    priority VARCHAR(20) DEFAULT 'Routine',
    billing_status VARCHAR(20) DEFAULT 'Unbilled',
    fee NUMERIC(10, 2) NOT NULL DEFAULT 800.00,
    reference_number VARCHAR(64) NOT NULL,
    checked_in_at TIMESTAMP WITH TIME ZONE,
    consultation_started_at TIMESTAMP WITH TIME ZONE,
    consultation_ended_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_appointments_tenant ON appointments(tenant_id);
CREATE INDEX idx_appointments_date ON appointments(appointment_date);
CREATE INDEX idx_appointments_status ON appointments(status);

-- 5. MEDICAL RECORDS (EMR / SOAP Notes)
CREATE TABLE IF NOT EXISTS medical_records (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    doctor_id VARCHAR(64) NOT NULL REFERENCES users(id),
    doctor_name VARCHAR(150) NOT NULL,
    appointment_id VARCHAR(64) REFERENCES appointments(id),
    visit_date DATE NOT NULL,
    chief_complaint TEXT NOT NULL,
    soap_subjective TEXT NOT NULL,
    soap_objective TEXT NOT NULL,
    soap_assessment TEXT NOT NULL,
    soap_plan TEXT NOT NULL,
    icd10_diagnosis JSONB NOT NULL DEFAULT '[]'::jsonb,
    vitals JSONB NOT NULL DEFAULT '{}'::jsonb,
    prescriptions JSONB NOT NULL DEFAULT '[]'::jsonb,
    ordered_lab_tests TEXT[] DEFAULT ARRAY[]::TEXT[],
    follow_up_date DATE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_records_tenant ON medical_records(tenant_id);
CREATE INDEX idx_records_patient ON medical_records(patient_id);

-- 6. BILLING INVOICES TABLE
CREATE TABLE IF NOT EXISTS billing_invoices (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    invoice_number VARCHAR(64) NOT NULL,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(150) NOT NULL,
    patient_phone VARCHAR(50) NOT NULL,
    invoice_date DATE NOT NULL,
    due_date DATE NOT NULL,
    items JSONB NOT NULL DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    tax_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL,
    paid_amount NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    balance_due NUMERIC(10, 2) NOT NULL,
    payment_status VARCHAR(30) NOT NULL DEFAULT 'Unpaid', -- Paid, Partially Paid, Unpaid, Refunded
    payment_method VARCHAR(50),
    insurance_details JSONB,
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_invoice_num UNIQUE (tenant_id, invoice_number)
);

CREATE INDEX idx_invoices_tenant ON billing_invoices(tenant_id);
CREATE INDEX idx_invoices_patient ON billing_invoices(patient_id);

-- 7. INVENTORY ITEMS (Pharmacy & Surgical Consumables)
CREATE TABLE IF NOT EXISTS inventory_items (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    name VARCHAR(200) NOT NULL,
    generic_name VARCHAR(200) NOT NULL,
    sku VARCHAR(64) NOT NULL,
    category VARCHAR(100) NOT NULL,
    form VARCHAR(50) NOT NULL,
    dosage_strength VARCHAR(50) NOT NULL,
    unit VARCHAR(30) NOT NULL,
    stock_quantity INT NOT NULL DEFAULT 0,
    min_threshold INT NOT NULL DEFAULT 10,
    reorder_quantity INT NOT NULL DEFAULT 50,
    batch_number VARCHAR(100) NOT NULL,
    expiry_date DATE NOT NULL,
    mrp NUMERIC(10, 2) NOT NULL,
    selling_price NUMERIC(10, 2) NOT NULL,
    supplier_name VARCHAR(150),
    location VARCHAR(100),
    is_prescription_required BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_sku UNIQUE (tenant_id, sku)
);

CREATE INDEX idx_inventory_tenant ON inventory_items(tenant_id);
CREATE INDEX idx_inventory_sku ON inventory_items(sku);

-- 8. LAB ORDERS & DIAGNOSTICS
CREATE TABLE IF NOT EXISTS lab_orders (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    order_number VARCHAR(64) NOT NULL,
    patient_id VARCHAR(64) NOT NULL REFERENCES patients(id) ON DELETE CASCADE,
    patient_name VARCHAR(150) NOT NULL,
    doctor_id VARCHAR(64) NOT NULL REFERENCES users(id),
    doctor_name VARCHAR(150) NOT NULL,
    test_name VARCHAR(200) NOT NULL,
    category VARCHAR(100) NOT NULL,
    sample_type VARCHAR(100) NOT NULL,
    sample_status VARCHAR(50) NOT NULL DEFAULT 'Sample Pending',
    critical_flag BOOLEAN NOT NULL DEFAULT FALSE,
    results JSONB NOT NULL DEFAULT '[]'::jsonb,
    pathologist_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT uq_tenant_lab_order_num UNIQUE (tenant_id, order_number)
);

CREATE INDEX idx_lab_orders_tenant ON lab_orders(tenant_id);

-- 9. AUDIT LOGS (HIPAA Requirement for Access Logging)
CREATE TABLE IF NOT EXISTS audit_logs (
    id VARCHAR(64) PRIMARY KEY,
    tenant_id VARCHAR(64) NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL,
    user_name VARCHAR(150) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    action VARCHAR(150) NOT NULL,
    resource_type VARCHAR(100) NOT NULL,
    resource_id VARCHAR(64),
    details TEXT NOT NULL,
    ip_address VARCHAR(50) NOT NULL,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_audit_tenant ON audit_logs(tenant_id);
CREATE INDEX idx_audit_time ON audit_logs(created_at);

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- Multi-Tenant Data Isolation Enforcement:
-- current_setting('app.current_tenant_id') must match row's tenant_id
-- ====================================================================
ALTER TABLE patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE medical_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE billing_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE lab_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY tenant_isolation_patients ON patients
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_appointments ON appointments
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_records ON medical_records
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_invoices ON billing_invoices
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_inventory ON inventory_items
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_lab ON lab_orders
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));

CREATE POLICY tenant_isolation_audit ON audit_logs
    USING (tenant_id = NULLIF(current_setting('app.current_tenant_id', true), ''));
