import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClinicData } from '../../context/ClinicDataContext';
import { BillingInvoice } from '../../types/management';
import { PrintableReceiptModal } from './PrintableReceiptModal';
import { 
  Receipt, 
  DollarSign, 
  CreditCard, 
  Plus, 
  Search, 
  Printer, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  Trash2,
  FileSpreadsheet
} from 'lucide-react';

export const BillingPanel: React.FC = () => {
  const { currentTenant } = useAuth();
  const { invoices, patients, addInvoice, recordPayment } = useClinicData();

  const [activeTab, setActiveTab] = useState<'invoices' | 'create' | 'tpa'>('invoices');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Receipt modal state
  const [selectedInvoiceForPrint, setSelectedInvoiceForPrint] = useState<BillingInvoice | null>(null);
  const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);

  // Quick payment modal state
  const [paymentModalInvoice, setPaymentModalInvoice] = useState<BillingInvoice | null>(null);
  const [payAmount, setPayAmount] = useState<number>(0);
  const [payMethod, setPayMethod] = useState<BillingInvoice['paymentMethod']>('UPI / QR');

  // Invoice creation state
  const [selectedPatientId, setSelectedPatientId] = useState(patients[0]?.id || '');
  const [items, setItems] = useState<{
    description: string;
    category: BillingInvoice['items'][0]['category'];
    unitPrice: number;
    quantity: number;
    total: number;
  }[]>([
    { description: 'Specialist Doctor Consultation', category: 'Consultation', unitPrice: 800, quantity: 1, total: 800 }
  ]);
  const [discount, setDiscount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  const filteredInvoices = invoices.filter(inv => {
    const matchesSearch = inv.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || inv.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalBilled = invoices.reduce((sum, i) => sum + i.totalAmount, 0);
  const totalCollected = invoices.reduce((sum, i) => sum + i.paidAmount, 0);
  const totalOutstanding = invoices.reduce((sum, i) => sum + i.balanceDue, 0);

  const handleAddItem = () => {
    setItems([
      ...items,
      { description: 'Clinical Procedure', category: 'Physiotherapy Procedure', unitPrice: 500, quantity: 1, total: 500 }
    ]);
  };

  const handleRemoveItem = (idx: number) => {
    setItems(items.filter((_, i) => i !== idx));
  };

  const handleItemChange = (idx: number, field: string, val: any) => {
    const copy = [...items];
    (copy[idx] as any)[field] = val;
    if (field === 'unitPrice' || field === 'quantity') {
      copy[idx].total = copy[idx].unitPrice * copy[idx].quantity;
    }
    setItems(copy);
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const totalAmount = Math.max(0, subtotal - discount);

  const handleCreateInvoice = (e: React.FormEvent) => {
    e.preventDefault();
    const pat = patients.find(p => p.id === selectedPatientId);
    if (!pat) return;

    const created = addInvoice({
      patientId: pat.id,
      patientName: `${pat.firstName} ${pat.lastName}`,
      patientPhone: pat.phone,
      dueDate: new Date().toISOString().split('T')[0],
      items,
      subtotal,
      discount,
      taxAmount: 0,
      totalAmount,
      paidAmount: 0,
      balanceDue: totalAmount,
      paymentStatus: 'Unpaid',
      notes: notes || 'Outpatient service invoice.'
    });

    setActiveTab('invoices');
    setSelectedInvoiceForPrint(created);
    setIsReceiptModalOpen(true);
  };

  const handleRecordPayment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentModalInvoice || payAmount <= 0) return;

    recordPayment(paymentModalInvoice.id, payAmount, payMethod);
    setPaymentModalInvoice(null);
  };

  return (
    <div className="space-y-6">
      {/* Header matching CarePlus portal layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Accounts & Billing Counter
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Patient invoices, automated tax calculation, instant payment receipts, and insurance TPA desk claims for {currentTenant.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setActiveTab('create')}
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-xl shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Generate Patient Bill</span>
          </button>
        </div>
      </div>

      {/* 4 Stat Cards matching CarePlus portal style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Total Invoiced</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            ₹{totalBilled.toLocaleString()}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">Gross billed charges</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Collected Revenue</span>
          <div className="text-2xl font-extrabold mt-1 text-emerald-600 font-heading">
            ₹{totalCollected.toLocaleString()}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Settled payments</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Outstanding Balance</span>
          <div className="text-2xl font-extrabold mt-1 text-amber-600 font-heading">
            ₹{totalOutstanding.toLocaleString()}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">Pending collections</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Invoices Issued</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            {invoices.length}
          </div>
          <span className="text-[11px] text-slate-500 font-medium mt-0.5 block">Total patient folios</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'invoices'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Invoices Ledger ({invoices.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('create')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'create'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Plus className="w-3.5 h-3.5" />
          <span>New Bill Generator</span>
        </button>

        <button
          onClick={() => setActiveTab('tpa')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'tpa'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Insurance & TPA Claims</span>
        </button>
      </div>

      {/* TAB 1: INVOICES LEDGER */}
      {activeTab === 'invoices' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by invoice number, patient name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Status:</span>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              >
                <option value="All">All Invoices</option>
                <option value="Paid">Paid</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Unpaid">Unpaid</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                  <th className="py-3 px-4">Invoice #</th>
                  <th className="py-3 px-4">Patient Particulars</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4 text-right">Total</th>
                  <th className="py-3 px-4 text-right">Paid</th>
                  <th className="py-3 px-4 text-right">Balance</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/70">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">
                      {inv.invoiceNumber}
                    </td>

                    <td className="py-3 px-4">
                      <strong className="text-slate-900 block font-bold">{inv.patientName}</strong>
                      <span className="text-slate-500 text-[11px] font-mono">{inv.patientPhone}</span>
                    </td>

                    <td className="py-3 px-4 text-slate-600">{inv.date}</td>

                    <td className="py-3 px-4 text-right font-bold text-slate-900">
                      ₹{inv.totalAmount}
                    </td>

                    <td className="py-3 px-4 text-right text-emerald-700 font-semibold">
                      ₹{inv.paidAmount}
                    </td>

                    <td className="py-3 px-4 text-right font-bold text-amber-800">
                      ₹{inv.balanceDue}
                    </td>

                    <td className="py-3 px-4">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        inv.paymentStatus === 'Paid'
                          ? 'bg-emerald-100 text-emerald-900'
                          : inv.paymentStatus === 'Partially Paid'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-rose-100 text-rose-900'
                      }`}>
                        {inv.paymentStatus}
                      </span>
                    </td>

                    <td className="py-3 px-4 text-right space-x-1.5">
                      {inv.balanceDue > 0 && (
                        <button
                          onClick={() => {
                            setPaymentModalInvoice(inv);
                            setPayAmount(inv.balanceDue);
                          }}
                          className="px-2.5 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                        >
                          Collect
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setSelectedInvoiceForPrint(inv);
                          setIsReceiptModalOpen(true);
                        }}
                        className="px-2.5 py-1 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Receipt</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BILL GENERATOR */}
      {activeTab === 'create' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs max-w-3xl space-y-6 text-xs">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Generate Itemized Patient Invoice</h3>
            <p className="text-slate-500 text-xs">Add clinic consultations, physiotherapy sessions, lab investigations, or drugs.</p>
          </div>

          <form onSubmit={handleCreateInvoice} className="space-y-4">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Select Patient</label>
              <select
                value={selectedPatientId}
                onChange={(e) => setSelectedPatientId(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg text-xs"
              >
                {patients.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.firstName} {p.lastName} &bull; {p.mrn} &bull; {p.phone}
                  </option>
                ))}
              </select>
            </div>

            {/* Line items table */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">Invoice Line Items</span>
                <button
                  type="button"
                  onClick={handleAddItem}
                  className="px-2 py-1 bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 rounded-lg font-bold flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Line Item</span>
                </button>
              </div>

              <div className="space-y-2">
                {items.map((item, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 sm:grid-cols-12 gap-2 items-center">
                    <div className="sm:col-span-5">
                      <label className="block text-[10px] text-slate-500 mb-0.5">Item Description</label>
                      <input
                        type="text"
                        value={item.description}
                        onChange={(e) => handleItemChange(idx, 'description', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="sm:col-span-3">
                      <label className="block text-[10px] text-slate-500 mb-0.5">Category</label>
                      <select
                        value={item.category}
                        onChange={(e) => handleItemChange(idx, 'category', e.target.value)}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      >
                        <option value="Consultation">Consultation</option>
                        <option value="Physiotherapy Procedure">Physiotherapy Procedure</option>
                        <option value="Lab Test">Lab Test</option>
                        <option value="Pharmacy">Pharmacy</option>
                        <option value="Daycare Bed">Daycare Bed</option>
                      </select>
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-500 mb-0.5">Unit Rate (₹)</label>
                      <input
                        type="number"
                        value={item.unitPrice}
                        onChange={(e) => handleItemChange(idx, 'unitPrice', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="sm:col-span-1">
                      <label className="block text-[10px] text-slate-500 mb-0.5">Qty</label>
                      <input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => handleItemChange(idx, 'quantity', Number(e.target.value))}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded-lg text-xs"
                      />
                    </div>

                    <div className="sm:col-span-1 flex justify-end">
                      <button
                        type="button"
                        onClick={() => handleRemoveItem(idx)}
                        className="p-1 text-rose-600 hover:bg-rose-50 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculations */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex justify-end">
              <div className="w-64 space-y-2 text-xs">
                <div className="flex justify-between text-slate-600">
                  <span>Gross Subtotal:</span>
                  <span className="font-bold">₹{subtotal}</span>
                </div>

                <div className="flex items-center justify-between text-emerald-700">
                  <span>Concession / Discount:</span>
                  <input
                    type="number"
                    min={0}
                    value={discount}
                    onChange={(e) => setDiscount(Number(e.target.value))}
                    className="w-24 px-2 py-1 bg-white border border-slate-300 rounded text-right text-xs"
                  />
                </div>

                <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-200 pt-2">
                  <span>Net Payable:</span>
                  <span>₹{totalAmount}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-md cursor-pointer"
              >
                Create Invoice & Issue Receipt
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 3: TPA & INSURANCE CLAIMS */}
      {activeTab === 'tpa' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <h3 className="text-sm font-bold text-slate-900">Third Party Administrator (TPA) & Cashless Claims</h3>
          <p className="text-slate-500">
            Pre-authorizations and cashless claim tracking with empaneled insurance companies (Star Health, HDFC ERGO, Care Health).
          </p>

          <div className="space-y-3">
            {invoices.filter(i => i.insuranceDetails).map(inv => (
              <div key={inv.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold">{inv.insuranceDetails?.tpaName}</strong>
                    <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 font-mono text-[10px]">
                      {inv.insuranceDetails?.claimId}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] mt-0.5">
                    Patient: {inv.patientName} &bull; Invoice: {inv.invoiceNumber}
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs font-bold text-slate-900 block">
                    Claim Amount: ₹{inv.insuranceDetails?.preAuthAmount}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                    {inv.insuranceDetails?.status}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* QUICK PAYMENT RECORD MODAL */}
      {paymentModalInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <h3 className="text-base font-bold text-slate-900">Record Invoice Payment</h3>
            <p className="text-slate-500">
              Invoice: {paymentModalInvoice.invoiceNumber} &bull; Patient: {paymentModalInvoice.patientName}
            </p>

            <form onSubmit={handleRecordPayment} className="space-y-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Amount to Collect (₹)</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={paymentModalInvoice.balanceDue}
                  value={payAmount}
                  onChange={(e) => setPayAmount(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg text-sm font-bold text-slate-900"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Payment Method</label>
                <select
                  value={payMethod}
                  onChange={(e) => setPayMethod(e.target.value as any)}
                  className="w-full px-3 py-2 border border-slate-200 rounded-lg"
                >
                  <option value="UPI / QR">UPI / Dynamic QR Code (GPay/PhonePe)</option>
                  <option value="Cash">Cash at Counter</option>
                  <option value="Credit / Debit Card">Credit / Debit Card POS</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentModalInvoice(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-bold"
                >
                  Confirm & Update Ledger
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE RECEIPT MODAL */}
      <PrintableReceiptModal
        isOpen={isReceiptModalOpen}
        onClose={() => setIsReceiptModalOpen(false)}
        invoice={selectedInvoiceForPrint}
        tenant={currentTenant}
      />
    </div>
  );
};
