import React from 'react';
import { LabOrder, Tenant } from '../../types/management';
import { X, Printer, AlertTriangle, CheckCircle2, ShieldCheck } from 'lucide-react';

interface PrintableLabReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: LabOrder | null;
  tenant: Tenant;
}

export const PrintableLabReportModal: React.FC<PrintableLabReportModalProps> = ({
  isOpen,
  onClose,
  order,
  tenant
}) => {
  if (!isOpen || !order) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Action Bar */}
        <div className="sticky top-0 bg-slate-900 text-white p-4 flex items-center justify-between z-10 print:hidden">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wider text-teal-400">
              Laboratory Investigation Report
            </span>
            <span className="text-xs text-slate-400">&bull; {order.orderNumber}</span>
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

        {/* Printable Report Content */}
        <div className="p-8 space-y-6 text-slate-900 bg-white" id="printable-lab-area">
          {/* Header */}
          <div className="flex items-start justify-between border-b-2 border-slate-900 pb-5">
            <div>
              <h2 className="text-xl font-black font-heading text-slate-900">{tenant.name}</h2>
              <p className="text-xs font-semibold text-teal-700 tracking-wider uppercase">
                Department of Pathology & Clinical Diagnostics
              </p>
              <p className="text-xs text-slate-500 mt-0.5">{tenant.address}, {tenant.city}</p>
            </div>
            <div className="text-right">
              <span className="inline-block px-2.5 py-1 rounded bg-slate-100 text-slate-800 font-mono text-xs font-bold">
                {order.orderNumber}
              </span>
              <p className="text-[11px] text-slate-500 mt-1">Sample: {order.sampleType}</p>
              <p className="text-[11px] text-slate-500">Ordered: {new Date(order.orderedAt).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Patient Details Banner */}
          <div className="grid grid-cols-3 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Patient Name</span>
              <strong className="text-slate-900 block mt-0.5">{order.patientName}</strong>
              <span className="text-slate-500">ID: {order.patientId}</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Referring Doctor</span>
              <strong className="text-slate-800 block mt-0.5">{order.doctorName}</strong>
              <span className="text-slate-500">Clinical OPD</span>
            </div>
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Investigation</span>
              <strong className="text-teal-900 block mt-0.5">{order.testName}</strong>
              <span className="text-[10px] text-slate-500">{order.category}</span>
            </div>
          </div>

          {/* Critical Value Warning if flagged */}
          {order.criticalFlag && (
            <div className="p-3 bg-red-50 border-l-4 border-red-600 rounded-r-xl text-xs text-red-900 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600 shrink-0" />
              <div>
                <strong className="block font-bold">CRITICAL LABORATORY ALERT:</strong>
                <span>One or more parameters exceed panic threshold values. Immediate clinical physician correlation advised.</span>
              </div>
            </div>
          )}

          {/* Results Table */}
          <div>
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b-2 border-slate-300 text-slate-700 uppercase text-[10px] font-bold">
                  <th className="py-2.5">Test Parameter</th>
                  <th className="py-2.5">Observed Value</th>
                  <th className="py-2.5">Unit</th>
                  <th className="py-2.5">Biological Reference Range</th>
                  <th className="py-2.5 text-right">Flag</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {order.results.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                      Specimen is currently under automated bio-analyzer processing. Final readings pending.
                    </td>
                  </tr>
                ) : (
                  order.results.map((res, i) => {
                    const isAbnormal = res.status === 'High' || res.status === 'Low' || res.status === 'Critical';
                    return (
                      <tr key={i} className={isAbnormal ? 'bg-amber-50/50 font-semibold' : ''}>
                        <td className="py-2.5 text-slate-900">{res.parameter}</td>
                        <td className="py-2.5 font-bold text-slate-900">{res.value}</td>
                        <td className="py-2.5 text-slate-500">{res.unit}</td>
                        <td className="py-2.5 text-slate-600 font-mono text-[11px]">{res.referenceRange}</td>
                        <td className="py-2.5 text-right">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            res.status === 'Critical'
                              ? 'bg-red-600 text-white'
                              : res.status === 'High'
                              ? 'bg-amber-100 text-amber-900'
                              : res.status === 'Low'
                              ? 'bg-blue-100 text-blue-900'
                              : 'bg-slate-100 text-slate-700'
                          }`}>
                            {res.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Pathologist Notes */}
          {order.pathologistNotes && (
            <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
              <span className="text-[10px] uppercase font-bold text-slate-500 block mb-0.5">
                Pathologist Microscopic Remarks:
              </span>
              <p className="text-slate-700 italic leading-relaxed">{order.pathologistNotes}</p>
            </div>
          )}

          {/* Signatures */}
          <div className="pt-8 border-t border-slate-200 flex items-center justify-between text-xs">
            <div>
              <div className="flex items-center gap-1 text-emerald-700 font-semibold text-[11px]">
                <ShieldCheck className="w-4 h-4" />
                <span>NABL Quality Controlled & Calibrated Automated Analyzers</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">Electronically verified report. No physical signature required.</p>
            </div>
            <div className="text-right">
              <div className="h-10 border-b border-slate-300 w-44 mb-1" />
              <strong className="block text-slate-800">{order.verifiedBy || 'Dr. K. S. Murthy, MD'}</strong>
              <span className="text-[10px] text-slate-500">Consultant Pathologist (Reg: DMC-48192)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
