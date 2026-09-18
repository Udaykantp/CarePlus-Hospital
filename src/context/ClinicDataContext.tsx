import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  SyntheticPatient, 
  AppointmentRecord, 
  MedicalRecordEntry, 
  InventoryItem, 
  LabOrder, 
  BillingInvoice, 
  NurseVitalLog, 
  AuditLogEntry 
} from '../types/management';
import { 
  SEEDED_PATIENTS, 
  SEEDED_APPOINTMENTS, 
  SEEDED_MEDICAL_RECORDS, 
  SEEDED_INVENTORY, 
  SEEDED_LAB_ORDERS, 
  SEEDED_INVOICES, 
  SEEDED_NURSE_LOGS, 
  SEEDED_AUDIT_LOGS 
} from '../data/mockManagementData';
import { useAuth } from './AuthContext';

interface ClinicDataContextType {
  // Tenant-isolated collections
  patients: SyntheticPatient[];
  appointments: AppointmentRecord[];
  medicalRecords: MedicalRecordEntry[];
  inventory: InventoryItem[];
  labOrders: LabOrder[];
  invoices: BillingInvoice[];
  nurseLogs: NurseVitalLog[];
  auditLogs: AuditLogEntry[];

  // Global / un-isolated collections (for Super Admin)
  allPatients: SyntheticPatient[];
  allAppointments: AppointmentRecord[];
  allInvoices: BillingInvoice[];
  allAuditLogs: AuditLogEntry[];

  // Actions
  addPatient: (patient: Omit<SyntheticPatient, 'id' | 'mrn' | 'tenantId' | 'registeredAt'>) => SyntheticPatient;
  updatePatient: (patient: SyntheticPatient) => void;
  addAppointment: (appointment: Omit<AppointmentRecord, 'id' | 'referenceNumber' | 'tenantId'>) => AppointmentRecord;
  updateAppointmentStatus: (id: string, status: AppointmentRecord['status']) => void;
  addMedicalRecord: (record: Omit<MedicalRecordEntry, 'id' | 'tenantId'>) => MedicalRecordEntry;
  updateInventoryStock: (id: string, newQty: number) => void;
  dispensePrescription: (prescriptionId: string, medicineName: string, qty: number) => void;
  addLabOrder: (order: Omit<LabOrder, 'id' | 'orderNumber' | 'tenantId' | 'orderedAt'>) => LabOrder;
  updateLabResult: (orderId: string, results: LabOrder['results'], pathologistNotes?: string, criticalFlag?: boolean) => void;
  addInvoice: (invoice: Omit<BillingInvoice, 'id' | 'invoiceNumber' | 'tenantId' | 'date'>) => BillingInvoice;
  recordPayment: (invoiceId: string, amount: number, method: BillingInvoice['paymentMethod'], notes?: string) => void;
  addNurseVitalLog: (log: Omit<NurseVitalLog, 'id' | 'tenantId' | 'timestamp'>) => NurseVitalLog;
  logAuditAction: (action: string, resourceType: AuditLogEntry['resourceType'], resourceId: string, details: string) => void;
  resetAllDemoData: () => void;
}

const DATA_STORAGE_PREFIX = 'hhmc_platform_state_v1_';

const ClinicDataContext = createContext<ClinicDataContextType | undefined>(undefined);

export const ClinicDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { currentTenant, currentUser } = useAuth();
  const tenantId = currentTenant.id;
  const isSuperAdmin = currentUser?.role === 'super_admin';

  // Base state
  const [allPatients, setAllPatients] = useState<SyntheticPatient[]>(() => {
    const saved = localStorage.getItem(DATA_STORAGE_PREFIX + 'patients');
    return saved ? JSON.parse(saved) : SEEDED_PATIENTS;
  });

  const [allAppointments, setAllAppointments] = useState<AppointmentRecord[]>(() => {
    const saved = localStorage.getItem(DATA_STORAGE_PREFIX + 'appointments');
    return saved ? JSON.parse(saved) : SEEDED_APPOINTMENTS;
  });

  const [allMedicalRecords, setAllMedicalRecords] = useState<MedicalRecordEntry[]>(() => {
    const saved = localStorage.getItem(DATA_STORAGE_PREFIX + 'medical_records');
    return saved ? JSON.parse(saved) : SEEDED_MEDICAL_RECORDS;
  });

  const [allInventory, setAllInventory] = useState<InventoryItem[]>(() => {
    const saved = localStorage.getItem(DATA_STORAGE_PREFIX + 'inventory');
    return saved ? JSON.parse(saved) : SEEDED_INVENTORY;
  });

  const [allLabOrders, setAllLabOrders] = useState<LabOrder[]>(() => {
    const saved = localStorage.getItem(DATA_STORAGE_PREFIX + 'lab_orders');
    return saved ? JSON.parse(saved) : SEEDED_LAB_ORDERS;
  });

  const [allInvoices, setAllInvoices] = useState<BillingInvoice[]>(() => {
    const saved = localStorage.getItem(DATA_STORAGE_PREFIX + 'invoices');
    return saved ? JSON.parse(saved) : SEEDED_INVOICES;
  });

  const [allNurseLogs, setAllNurseLogs] = useState<NurseVitalLog[]>(() => {
    const saved = localStorage.getItem(DATA_STORAGE_PREFIX + 'nurse_logs');
    return saved ? JSON.parse(saved) : SEEDED_NURSE_LOGS;
  });

  const [allAuditLogs, setAllAuditLogs] = useState<AuditLogEntry[]>(() => {
    const saved = localStorage.getItem(DATA_STORAGE_PREFIX + 'audit_logs');
    return saved ? JSON.parse(saved) : SEEDED_AUDIT_LOGS;
  });

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(DATA_STORAGE_PREFIX + 'patients', JSON.stringify(allPatients));
      localStorage.setItem(DATA_STORAGE_PREFIX + 'appointments', JSON.stringify(allAppointments));
      localStorage.setItem(DATA_STORAGE_PREFIX + 'medical_records', JSON.stringify(allMedicalRecords));
      localStorage.setItem(DATA_STORAGE_PREFIX + 'inventory', JSON.stringify(allInventory));
      localStorage.setItem(DATA_STORAGE_PREFIX + 'lab_orders', JSON.stringify(allLabOrders));
      localStorage.setItem(DATA_STORAGE_PREFIX + 'invoices', JSON.stringify(allInvoices));
      localStorage.setItem(DATA_STORAGE_PREFIX + 'nurse_logs', JSON.stringify(allNurseLogs));
      localStorage.setItem(DATA_STORAGE_PREFIX + 'audit_logs', JSON.stringify(allAuditLogs));
    } catch (e) {
      console.error('Error saving state', e);
    }
  }, [allPatients, allAppointments, allMedicalRecords, allInventory, allLabOrders, allInvoices, allNurseLogs, allAuditLogs]);

  // Tenant-isolated views
  const patients = isSuperAdmin ? allPatients : allPatients.filter(p => p.tenantId === tenantId);
  const appointments = isSuperAdmin ? allAppointments : allAppointments.filter(a => a.tenantId === tenantId);
  const medicalRecords = isSuperAdmin ? allMedicalRecords : allMedicalRecords.filter(m => m.tenantId === tenantId);
  const inventory = isSuperAdmin ? allInventory : allInventory.filter(i => i.tenantId === tenantId);
  const labOrders = isSuperAdmin ? allLabOrders : allLabOrders.filter(l => l.tenantId === tenantId);
  const invoices = isSuperAdmin ? allInvoices : allInvoices.filter(i => i.tenantId === tenantId);
  const nurseLogs = isSuperAdmin ? allNurseLogs : allNurseLogs.filter(n => n.tenantId === tenantId);
  const auditLogs = isSuperAdmin ? allAuditLogs : allAuditLogs.filter(al => al.tenantId === tenantId);

  const logAuditAction = (
    action: string,
    resourceType: AuditLogEntry['resourceType'],
    resourceId: string,
    details: string
  ) => {
    const newLog: AuditLogEntry = {
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      tenantId,
      timestamp: new Date().toISOString(),
      userId: currentUser?.id || 'guest',
      userName: currentUser?.name || 'Anonymous User',
      userRole: currentUser?.role || 'patient',
      action,
      resourceType,
      resourceId,
      ipAddress: '103.21.144.90 (HIPAA Audit Log)',
      status: 'SUCCESS',
      details
    };
    setAllAuditLogs(prev => [newLog, ...prev]);
  };

  const addPatient = (patientData: Omit<SyntheticPatient, 'id' | 'mrn' | 'tenantId' | 'registeredAt'>): SyntheticPatient => {
    const count = allPatients.length + 1001;
    const newPat: SyntheticPatient = {
      ...patientData,
      id: `pat-${Date.now()}`,
      tenantId,
      mrn: `HHMC-MRN-${count}`,
      registeredAt: new Date().toISOString()
    };
    setAllPatients(prev => [newPat, ...prev]);
    logAuditAction('CREATE_PATIENT_RECORD', 'Patient', newPat.id, `Created new patient profile for ${newPat.firstName} ${newPat.lastName} (MRN: ${newPat.mrn}).`);
    return newPat;
  };

  const updatePatient = (updated: SyntheticPatient) => {
    setAllPatients(prev => prev.map(p => (p.id === updated.id ? updated : p)));
    logAuditAction('UPDATE_PATIENT_RECORD', 'Patient', updated.id, `Updated patient profile for ${updated.firstName} ${updated.lastName}.`);
  };

  const addAppointment = (aptData: Omit<AppointmentRecord, 'id' | 'referenceNumber' | 'tenantId'>): AppointmentRecord => {
    const count = allAppointments.length + 8810;
    const newApt: AppointmentRecord = {
      ...aptData,
      id: `apt-${Date.now()}`,
      tenantId,
      referenceNumber: `HHMC-2026-${count}`
    };
    setAllAppointments(prev => [newApt, ...prev]);
    logAuditAction('BOOK_APPOINTMENT', 'Patient', newApt.id, `Booked appointment ${newApt.referenceNumber} for ${newApt.patientName} with ${newApt.doctorName}.`);
    return newApt;
  };

  const updateAppointmentStatus = (id: string, status: AppointmentRecord['status']) => {
    setAllAppointments(prev =>
      prev.map(a => {
        if (a.id === id) {
          const updated = { ...a, status };
          if (status === 'Checked In') updated.checkedInAt = new Date().toISOString();
          if (status === 'Completed') updated.completedAt = new Date().toISOString();
          return updated;
        }
        return a;
      })
    );
    logAuditAction('UPDATE_APPOINTMENT_STATUS', 'Patient', id, `Updated appointment status to ${status}.`);
  };

  const addMedicalRecord = (recData: Omit<MedicalRecordEntry, 'id' | 'tenantId'>): MedicalRecordEntry => {
    const newRec: MedicalRecordEntry = {
      ...recData,
      id: `emr-${Date.now()}`,
      tenantId
    };
    setAllMedicalRecords(prev => [newRec, ...prev]);
    logAuditAction('CREATE_EMR_ENTRY', 'EMR', newRec.id, `Physician documented SOAP consultation notes for patient ID: ${newRec.patientId}.`);
    return newRec;
  };

  const updateInventoryStock = (id: string, newQty: number) => {
    setAllInventory(prev =>
      prev.map(i => (i.id === id ? { ...i, stockQuantity: newQty } : i))
    );
    logAuditAction('UPDATE_INVENTORY_STOCK', 'Inventory', id, `Adjusted stock quantity to ${newQty}.`);
  };

  const dispensePrescription = (prescriptionId: string, medicineName: string, qty: number) => {
    // Update inventory
    setAllInventory(prev =>
      prev.map(i => {
        if (i.name.toLowerCase().includes(medicineName.toLowerCase()) || medicineName.toLowerCase().includes(i.name.toLowerCase())) {
          return { ...i, stockQuantity: Math.max(0, i.stockQuantity - qty) };
        }
        return i;
      })
    );
    logAuditAction('DISPENSE_PRESCRIPTION', 'Prescription', prescriptionId, `Dispensed ${qty} units of ${medicineName} from clinic pharmacy.`);
  };

  const addLabOrder = (orderData: Omit<LabOrder, 'id' | 'orderNumber' | 'tenantId' | 'orderedAt'>): LabOrder => {
    const count = allLabOrders.length + 905;
    const newOrder: LabOrder = {
      ...orderData,
      id: `lab-${Date.now()}`,
      tenantId,
      orderNumber: `LAB-ORD-2026-${count}`,
      orderedAt: new Date().toISOString()
    };
    setAllLabOrders(prev => [newOrder, ...prev]);
    logAuditAction('ORDER_LAB_TEST', 'Lab', newOrder.id, `Doctor ordered ${newOrder.testName} for ${newOrder.patientName}.`);
    return newOrder;
  };

  const updateLabResult = (
    orderId: string,
    results: LabOrder['results'],
    pathologistNotes?: string,
    criticalFlag?: boolean
  ) => {
    setAllLabOrders(prev =>
      prev.map(l => {
        if (l.id === orderId) {
          return {
            ...l,
            results,
            pathologistNotes: pathologistNotes || l.pathologistNotes,
            criticalFlag: criticalFlag ?? l.criticalFlag,
            sampleStatus: 'Result Ready',
            resultReadyAt: new Date().toISOString(),
            verifiedBy: 'Dr. K. S. Murthy, MD (Pathology)'
          };
        }
        return l;
      })
    );
    logAuditAction('PUBLISH_LAB_RESULTS', 'Lab', orderId, `Lab results published for order ${orderId}. Critical flag: ${criticalFlag ? 'YES' : 'NO'}.`);
  };

  const addInvoice = (invData: Omit<BillingInvoice, 'id' | 'invoiceNumber' | 'tenantId' | 'date'>): BillingInvoice => {
    const count = allInvoices.length + 704;
    const newInv: BillingInvoice = {
      ...invData,
      id: `inv-${Date.now()}`,
      tenantId,
      invoiceNumber: `HHMC-INV-2026-${count}`,
      date: new Date().toISOString().split('T')[0]
    };
    setAllInvoices(prev => [newInv, ...prev]);
    logAuditAction('GENERATE_BILLING_INVOICE', 'Invoice', newInv.id, `Generated invoice ${newInv.invoiceNumber} for ₹${newInv.totalAmount}.`);
    return newInv;
  };

  const recordPayment = (
    invoiceId: string,
    amount: number,
    method: BillingInvoice['paymentMethod'],
    notes?: string
  ) => {
    setAllInvoices(prev =>
      prev.map(inv => {
        if (inv.id === invoiceId) {
          const newPaid = inv.paidAmount + amount;
          const newBal = Math.max(0, inv.totalAmount - newPaid);
          const status = newBal <= 0 ? 'Paid' : 'Partially Paid';
          return {
            ...inv,
            paidAmount: newPaid,
            balanceDue: newBal,
            paymentStatus: status,
            paymentMethod: method,
            notes: notes ? `${inv.notes ? inv.notes + ' | ' : ''}${notes}` : inv.notes
          };
        }
        return inv;
      })
    );
    logAuditAction('RECORD_INVOICE_PAYMENT', 'Invoice', invoiceId, `Recorded payment of ₹${amount} via ${method}.`);
  };

  const addNurseVitalLog = (logData: Omit<NurseVitalLog, 'id' | 'tenantId' | 'timestamp'>): NurseVitalLog => {
    const newLog: NurseVitalLog = {
      ...logData,
      id: `nurse-log-${Date.now()}`,
      tenantId,
      timestamp: new Date().toISOString()
    };
    setAllNurseLogs(prev => [newLog, ...prev]);
    logAuditAction('LOG_PATIENT_VITALS', 'EMR', newLog.id, `Nurse logged vitals for ${newLog.patientName} (BP: ${newLog.bp}, SpO2: ${newLog.spO2}%).`);
    return newLog;
  };

  const resetAllDemoData = () => {
    localStorage.removeItem(DATA_STORAGE_PREFIX + 'patients');
    localStorage.removeItem(DATA_STORAGE_PREFIX + 'appointments');
    localStorage.removeItem(DATA_STORAGE_PREFIX + 'medical_records');
    localStorage.removeItem(DATA_STORAGE_PREFIX + 'inventory');
    localStorage.removeItem(DATA_STORAGE_PREFIX + 'lab_orders');
    localStorage.removeItem(DATA_STORAGE_PREFIX + 'invoices');
    localStorage.removeItem(DATA_STORAGE_PREFIX + 'nurse_logs');
    localStorage.removeItem(DATA_STORAGE_PREFIX + 'audit_logs');

    setAllPatients(SEEDED_PATIENTS);
    setAllAppointments(SEEDED_APPOINTMENTS);
    setAllMedicalRecords(SEEDED_MEDICAL_RECORDS);
    setAllInventory(SEEDED_INVENTORY);
    setAllLabOrders(SEEDED_LAB_ORDERS);
    setAllInvoices(SEEDED_INVOICES);
    setAllNurseLogs(SEEDED_NURSE_LOGS);
    setAllAuditLogs(SEEDED_AUDIT_LOGS);
  };

  return (
    <ClinicDataContext.Provider
      value={{
        patients,
        appointments,
        medicalRecords,
        inventory,
        labOrders,
        invoices,
        nurseLogs,
        auditLogs,
        allPatients,
        allAppointments,
        allInvoices,
        allAuditLogs,
        addPatient,
        updatePatient,
        addAppointment,
        updateAppointmentStatus,
        addMedicalRecord,
        updateInventoryStock,
        dispensePrescription,
        addLabOrder,
        updateLabResult,
        addInvoice,
        recordPayment,
        addNurseVitalLog,
        logAuditAction,
        resetAllDemoData
      }}
    >
      {children}
    </ClinicDataContext.Provider>
  );
};

export const useClinicData = () => {
  const context = useContext(ClinicDataContext);
  if (!context) {
    throw new Error('useClinicData must be used within a ClinicDataProvider');
  }
  return context;
};
