import React from 'react';
import { BillingInvoice, Tenant } from '../../types/management';
import { X, Printer, Download, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PrintableReceiptModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: BillingInvoice | null;
  tenant: Tenant;
}

export const PrintableReceiptModal: React.FC<PrintableReceiptModalProps> = ({
  isOpen,
  onClose,
  invoice,
  tenant
}) => {
  if (!isOpen || !invoice) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Modal Action Bar (Hidden on print) */}
        <div className="sticky top-0 bg-slate-900 text-white p-4 flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Tax Invoice & Receipt
            </span>
            <span className="text-xs text-slate-400">&bull; {invoice.invoiceNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 bg-teal-600 hover:bg-teal-500 text-white text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Container */}
        <div className="p-8 space-y-6 text-slate-900 bg-white" id="printable-receipt-area">
          {/* Header */}
          <div className="flex items-start justify-between border-b border-slate-200 pb-6">
            <div>
              <h2 className="text-xl font-black font-heading text-slate-900">{tenant.name}</h2>
              <p className="text-xs text-slate-500 mt-0.5">{tenant.legalName}</p>
              <p className="text-xs text-slate-600 mt-1 max-w-xs">{tenant.address}, {tenant.city} - {tenant.postalCode}</p>
              <p className="text-xs text-slate-600">Helpline: {tenant.phone} | Email: {tenant.email}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-3 py-1 rounded bg-teal-100 text-teal-800 text-xs font-bold tracking-wider uppercase mb-1">
                Official Receipt
              </span>
              <p className="text-xs text-slate-500 font-mono mt-1">Invoice: {invoice.invoiceNumber}</p>
              <p className="text-xs text-slate-500">Date: {invoice.date}</p>
              <p className="text-xs font-bold mt-1 text-slate-800">
                Status: <span className={invoice.paymentStatus === 'Paid' ? 'text-emerald-700' : 'text-amber-700'}>{invoice.paymentStatus}</span>
              </p>
            </div>
          </div>

          {/* Patient Details */}
          <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Billed To (Patient)</span>
              <strong className="text-sm text-slate-900 block mt-0.5">{invoice.patientName}</strong>
              <span className="text-slate-600">Patient ID: {invoice.patientId}</span>
              <span className="text-slate-600 block">Phone: {invoice.patientPhone}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Payment Particulars</span>
              <strong className="text-slate-800 block mt-0.5">Method: {invoice.paymentMethod || 'In-Clinic Cash/UPI'}</strong>
              {invoice.insuranceDetails && (
                <p className="text-slate-600 text-[11px] mt-0.5">
                  TPA: {invoice.insuranceDetails.tpaName} (Claim #{invoice.insuranceDetails.claimId})
                </p>
              )}
            </div>
          </div>

          {/* Itemized Table */}
          <div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-600 uppercase text-[10px] font-bold">
                  <th className="py-2">Item / Clinical Service</th>
                  <th className="py-2">Category</th>
                  <th className="py-2 text-right">Qty</th>
                  <th className="py-2 text-right">Unit Rate</th>
                  <th className="py-2 text-right">Total Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoice.items.map((item, idx) => (
                  <tr key={idx} className="text-slate-800">
                    <td className="py-2.5 font-medium">{item.description}</td>
                    <td className="py-2.5 text-slate-500">{item.category}</td>
                    <td className="py-2.5 text-right">{item.quantity}</td>
                    <td className="py-2.5 text-right">₹{item.unitPrice}</td>
                    <td className="py-2.5 text-right font-bold">₹{item.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals Summary */}
          <div className="pt-4 border-t border-slate-200 flex justify-end">
            <div className="w-64 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Subtotal:</span>
                <span>₹{invoice.subtotal}</span>
              </div>
              {invoice.discount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Concession / Discount:</span>
                  <span>-₹{invoice.discount}</span>
                </div>
              )}
              <div className="flex justify-between font-bold text-sm text-slate-900 border-t border-slate-200 pt-1.5">
                <span>Net Total:</span>
                <span>₹{invoice.totalAmount}</span>
              </div>
              <div className="flex justify-between text-teal-800 font-semibold">
                <span>Amount Paid:</span>
                <span>₹{invoice.paidAmount}</span>
              </div>
              <div className="flex justify-between text-slate-900 font-bold border-t border-slate-200 pt-1">
                <span>Balance Due:</span>
                <span>₹{invoice.balanceDue}</span>
              </div>
            </div>
          </div>

          {/* Notes & Computerized Auth */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div className="space-y-1">
              <div className="flex items-center gap-1.5 text-emerald-700 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>Computerized Computer Bill &bull; Authentic Medical Receipt</span>
              </div>
              <p className="text-[10px] text-slate-400">
                Valid for Medical Insurance Reimbursement & Income Tax Sec 80D declaration.
              </p>
            </div>
            <div className="text-right">
              <div className="h-10 border-b border-slate-300 w-36 mb-1" />
              <span className="text-[10px] uppercase font-bold text-slate-400">Authorized Billing Officer</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
