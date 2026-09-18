import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { 
  SEEDED_TENANTS, 
  SEEDED_USERS, 
  SEEDED_PATIENTS, 
  SEEDED_APPOINTMENTS, 
  SEEDED_MEDICAL_RECORDS, 
  SEEDED_INVENTORY, 
  SEEDED_INVOICES, 
  SEEDED_LAB_ORDERS, 
  SEEDED_AUDIT_LOGS 
} from './src/data/mockManagementData.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory tenant-isolated data stores (mirrored from initial synthetic mock dataset)
  let tenants = [...SEEDED_TENANTS];
  let users = [...SEEDED_USERS];
  let patients = [...SEEDED_PATIENTS];
  let appointments = [...SEEDED_APPOINTMENTS];
  let medicalRecords = [...SEEDED_MEDICAL_RECORDS];
  let inventory = [...SEEDED_INVENTORY];
  let invoices = [...SEEDED_INVOICES];
  let labOrders = [...SEEDED_LAB_ORDERS];
  let auditLogs = [...SEEDED_AUDIT_LOGS];

  // Helper for audit logging
  const logAudit = (tenantId: string, userId: string, userName: string, role: any, action: string, resType: any, resId: string = '', details: string = '') => {
    auditLogs.unshift({
      id: `audit-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
      tenantId,
      userId,
      userName,
      userRole: role,
      action,
      resourceType: resType,
      resourceId: resId,
      details,
      ipAddress: '127.0.0.1',
      status: 'SUCCESS',
      timestamp: new Date().toISOString()
    });
  };

  // ==========================================
  // API ROUTES (Always before Vite middleware)
  // ==========================================

  // Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'healthy',
      system: 'Healing Hands Multi-Speciality Clinic Platform',
      version: '2.0.0-HIPAA',
      tenantsActive: tenants.length,
      timestamp: new Date().toISOString()
    });
  });

  // 1. Auth Endpoint: Login with role detection & JWT simulation
  app.post('/api/auth/login', (req, res) => {
    const { email, tenantId } = req.body;
    const user = users.find(u => 
      u.email.toLowerCase() === (email || '').toLowerCase() &&
      (!tenantId || u.tenantId === tenantId || u.role === 'super_admin')
    );

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials or user not associated with clinic tenant' });
    }

    const tenant = tenants.find(t => t.id === user.tenantId) || tenants[0];

    // Simulated JWT token payload
    const token = `jwt-simulated-${user.id}-${Date.now()}`;

    logAudit(tenant.id, user.id, user.name, user.role, 'User Authenticated', 'AuthSession', user.id, `User logged in from portal`);

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        department: user.department,
        tenantId: user.tenantId,
        specialization: user.specialization
      },
      tenant
    });
  });

  // 2. Tenants Endpoints (Super Admin)
  app.get('/api/tenants', (req, res) => {
    res.json(tenants);
  });

  app.post('/api/tenants', (req, res) => {
    const newTenant = {
      id: `tenant-${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      isActive: true,
      ...req.body
    };
    tenants.push(newTenant);
    logAudit(newTenant.id, 'sys-admin', 'Super Administrator', 'super_admin', 'Tenant Provisioned', 'Tenant', newTenant.id, `Created tenant ${newTenant.name}`);
    res.status(201).json(newTenant);
  });

  // 3. Patients Endpoints
  app.get('/api/patients', (req, res) => {
    const tenantId = (req.headers['x-tenant-id'] as string) || req.query.tenantId as string || 'tenant-delhi-main';
    const tenantPatients = patients.filter(p => p.tenantId === tenantId);
    res.json(tenantPatients);
  });

  app.post('/api/patients', (req, res) => {
    const tenantId = (req.headers['x-tenant-id'] as string) || req.body.tenantId || 'tenant-delhi-main';
    const mrn = `HHMC-MRN-${new Date().getFullYear()}-${String(patients.length + 1).padStart(3, '0')}`;
    const newPatient = {
      id: `pat-${Date.now()}`,
      tenantId,
      mrn,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...req.body
    };
    patients.unshift(newPatient);
    logAudit(tenantId, 'staff-user', 'Front Desk', 'receptionist', 'Patient Registered', 'Patient', newPatient.id, `Registered ${newPatient.firstName} ${newPatient.lastName}`);
    res.status(201).json(newPatient);
  });

  // 4. Appointments Endpoints
  app.get('/api/appointments', (req, res) => {
    const tenantId = (req.headers['x-tenant-id'] as string) || req.query.tenantId as string || 'tenant-delhi-main';
    const tenantAppointments = appointments.filter(a => a.tenantId === tenantId);
    res.json(tenantAppointments);
  });

  app.post('/api/appointments', (req, res) => {
    const tenantId = (req.headers['x-tenant-id'] as string) || req.body.tenantId || 'tenant-delhi-main';
    const ref = `APT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;
    const newApt = {
      id: `apt-${Date.now()}`,
      tenantId,
      referenceNumber: ref,
      createdAt: new Date().toISOString(),
      ...req.body
    };
    appointments.unshift(newApt);
    logAudit(tenantId, 'reception-desk', 'Reception Staff', 'receptionist', 'Appointment Scheduled', 'Appointment', newApt.id, `Token booked for ${newApt.patientName}`);
    res.status(201).json(newApt);
  });

  app.patch('/api/appointments/:id/status', (req, res) => {
    const { status } = req.body;
    const apt = appointments.find(a => a.id === req.params.id);
    if (!apt) return res.status(404).json({ error: 'Appointment not found' });
    apt.status = status;
    res.json(apt);
  });

  // 5. Medical Records (EMR / SOAP Notes)
  app.get('/api/emr', (req, res) => {
    const tenantId = (req.headers['x-tenant-id'] as string) || req.query.tenantId as string || 'tenant-delhi-main';
    const patientId = req.query.patientId as string;
    let records = medicalRecords.filter(m => m.tenantId === tenantId);
    if (patientId) {
      records = records.filter(m => m.patientId === patientId);
    }
    res.json(records);
  });

  app.post('/api/emr', (req, res) => {
    const tenantId = (req.headers['x-tenant-id'] as string) || req.body.tenantId || 'tenant-delhi-main';
    const newRecord = {
      id: `emr-${Date.now()}`,
      tenantId,
      createdAt: new Date().toISOString(),
      ...req.body
    };
    medicalRecords.unshift(newRecord);
    logAudit(tenantId, newRecord.doctorId, newRecord.doctorName, 'doctor', 'EMR SOAP Documented', 'MedicalRecord', newRecord.id, `Documented consultation for patient ${newRecord.patientId}`);
    res.status(201).json(newRecord);
  });

  // 6. Billing & Invoices
  app.get('/api/invoices', (req, res) => {
    const tenantId = (req.headers['x-tenant-id'] as string) || req.query.tenantId as string || 'tenant-delhi-main';
    res.json(invoices.filter(i => i.tenantId === tenantId));
  });

  app.post('/api/invoices', (req, res) => {
    const tenantId = (req.headers['x-tenant-id'] as string) || req.body.tenantId || 'tenant-delhi-main';
    const invNumber = `INV-${new Date().getFullYear()}-${String(invoices.length + 1).padStart(4, '0')}`;
    const newInv = {
      id: `inv-${Date.now()}`,
      tenantId,
      invoiceNumber: invNumber,
      date: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
      ...req.body
    };
    invoices.unshift(newInv);
    logAudit(tenantId, 'billing-desk', 'Accounts Cashier', 'billing_staff', 'Invoice Generated', 'BillingInvoice', newInv.id, `Issued ${newInv.invoiceNumber} for ₹${newInv.totalAmount}`);
    res.status(201).json(newInv);
  });

  app.post('/api/invoices/:id/pay', (req, res) => {
    const { amount, method } = req.body;
    const inv = invoices.find(i => i.id === req.params.id);
    if (!inv) return res.status(404).json({ error: 'Invoice not found' });
    inv.paidAmount += Number(amount);
    inv.balanceDue = Math.max(0, inv.totalAmount - inv.paidAmount);
    inv.paymentStatus = inv.balanceDue === 0 ? 'Paid' : 'Partially Paid';
    inv.paymentMethod = method;
    logAudit(inv.tenantId, 'billing-desk', 'Accounts Cashier', 'billing_staff', 'Payment Recorded', 'BillingInvoice', inv.id, `Collected ₹${amount} via ${method}`);
    res.json(inv);
  });

  // 7. Inventory & Pharmacy
  app.get('/api/inventory', (req, res) => {
    const tenantId = (req.headers['x-tenant-id'] as string) || req.query.tenantId as string || 'tenant-delhi-main';
    res.json(inventory.filter(i => i.tenantId === tenantId));
  });

  app.post('/api/inventory/:id/stock', (req, res) => {
    const { quantity } = req.body;
    const item = inventory.find(i => i.id === req.params.id);
    if (!item) return res.status(404).json({ error: 'Inventory SKU not found' });
    item.stockQuantity = Number(quantity);
    res.json(item);
  });

  // 8. Laboratory & Diagnostics
  app.get('/api/lab-orders', (req, res) => {
    const tenantId = (req.headers['x-tenant-id'] as string) || req.query.tenantId as string || 'tenant-delhi-main';
    res.json(labOrders.filter(l => l.tenantId === tenantId));
  });

  // 9. HIPAA Audit Logs
  app.get('/api/audit-logs', (req, res) => {
    const tenantId = (req.headers['x-tenant-id'] as string) || req.query.tenantId as string || 'tenant-delhi-main';
    res.json(auditLogs.filter(a => a.tenantId === tenantId));
  });

  // ==========================================
  // VITE MIDDLEWARE (Development) or STATIC (Production)
  // ==========================================
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[HHMC Full-Stack Platform] Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
