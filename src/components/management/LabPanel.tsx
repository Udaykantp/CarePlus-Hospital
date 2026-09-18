import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClinicData } from '../../context/ClinicDataContext';
import { LabOrder } from '../../types/management';
import { PrintableLabReportModal } from './PrintableLabReportModal';
import { 
  FlaskConical, 
  Search, 
  Printer, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Plus, 
  Activity, 
  ShieldCheck, 
  FileText,
  UserCheck
} from 'lucide-react';

export const LabPanel: React.FC = () => {
  const { currentTenant } = useAuth();
  const { labOrders, updateLabResult } = useClinicData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrderForPrint, setSelectedOrderForPrint] = useState<LabOrder | null>(null);
  const [isPrintModalOpen, setIsPrintModalOpen] = useState(false);

  // Result entry modal
  const [activeOrderForEdit, setActiveOrderForEdit] = useState<LabOrder | null>(null);
  const [resultsForm, setResultsForm] = useState<{
    parameter: string;
    value: string;
    unit: string;
    referenceRange: string;
    status: 'Normal' | 'High' | 'Low' | 'Critical';
  }[]>([
    { parameter: 'Serum Analyte', value: '14.2', unit: 'mg/dL', referenceRange: '8.5 - 15.0', status: 'Normal' }
  ]);
  const [pathologistRemarks, setPathologistRemarks] = useState('');
  const [isCritical, setIsCritical] = useState(false);

  const filteredOrders = labOrders.filter(o => 
    o.orderNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.testName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenResultEntry = (order: LabOrder) => {
    setActiveOrderForEdit(order);
    if (order.results && order.results.length > 0) {
      setResultsForm(order.results);
    } else {
      setResultsForm([
        { parameter: `${order.testName} Primary Reading`, value: '12.4', unit: 'g/dL', referenceRange: '11.0 - 15.0', status: 'Normal' },
        { parameter: 'Secondary Marker', value: '88', unit: 'mg/dL', referenceRange: '70 - 110', status: 'Normal' }
      ]);
    }
    setPathologistRemarks(order.pathologistNotes || 'Calibrated analyzer automated run. Microscopic findings correlate with clinical picture.');
    setIsCritical(order.criticalFlag);
  };

  const handleSaveResults = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeOrderForEdit) return;

    updateLabResult(activeOrderForEdit.id, resultsForm, pathologistRemarks, isCritical);
    setActiveOrderForEdit(null);
  };

  return (
    <div className="space-y-6">
      {/* Header matching CarePlus portal layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Laboratory & Diagnostics Reports Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Specimen tracking, analyzer result entry, critical panic alerts, and pathology reporting for {currentTenant.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            {labOrders.length} Total Diagnostic Requisitions
          </span>
        </div>
      </div>

      {/* 4 Stat Cards matching CarePlus portal style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Test Orders Today</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            {labOrders.length}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">Total requisitions</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Results Ready</span>
          <div className="text-2xl font-extrabold mt-1 text-emerald-600 font-heading">
            {labOrders.filter(o => o.sampleStatus === 'Result Ready').length}
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">Approved reports</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">In Processing</span>
          <div className="text-2xl font-extrabold mt-1 text-amber-600 font-heading">
            {labOrders.filter(o => o.sampleStatus === 'Analyzing' || o.sampleStatus === 'Sample Pending').length}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">Samples in analyzer</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Critical Value Flags</span>
          <div className="text-2xl font-extrabold mt-1 text-rose-600 font-heading">
            {labOrders.filter(o => o.criticalFlag).length}
          </div>
          <span className="text-[11px] text-rose-600 font-semibold mt-0.5 block">Doctor alerted</span>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative max-w-sm w-full">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search by order #, patient name, investigation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                <th className="py-3 px-4">Order #</th>
                <th className="py-3 px-4">Patient Particulars</th>
                <th className="py-3 px-4">Investigation & Category</th>
                <th className="py-3 px-4">Sample Type</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOrders.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/70">
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">
                    {ord.orderNumber}
                  </td>

                  <td className="py-3 px-4">
                    <strong className="text-slate-900 block font-bold">{ord.patientName}</strong>
                    <span className="text-slate-500 text-[11px]">Doctor: {ord.doctorName}</span>
                  </td>

                  <td className="py-3 px-4">
                    <strong className="text-teal-900 block font-bold">{ord.testName}</strong>
                    <span className="text-slate-500 text-[10px] uppercase font-semibold">{ord.category}</span>
                  </td>

                  <td className="py-3 px-4 text-slate-600">
                    {ord.sampleType}
                  </td>

                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1.5">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                        ord.sampleStatus === 'Result Ready'
                          ? 'bg-emerald-100 text-emerald-900'
                          : ord.sampleStatus === 'Analyzing'
                          ? 'bg-blue-100 text-blue-900'
                          : 'bg-amber-100 text-amber-900'
                      }`}>
                        {ord.sampleStatus}
                      </span>
                      {ord.criticalFlag && (
                        <span className="px-1.5 py-0.5 rounded bg-red-600 text-white font-bold text-[9px] uppercase">
                          Critical
                        </span>
                      )}
                    </div>
                  </td>

                  <td className="py-3 px-4 text-right space-x-1.5">
                    <button
                      onClick={() => handleOpenResultEntry(ord)}
                      className="px-2.5 py-1 bg-teal-600 hover:bg-teal-700 text-white font-bold rounded-lg text-[11px] transition-colors"
                    >
                      {ord.sampleStatus === 'Result Ready' ? 'Edit Readings' : 'Enter Results'}
                    </button>

                    {ord.sampleStatus === 'Result Ready' && (
                      <button
                        onClick={() => {
                          setSelectedOrderForPrint(ord);
                          setIsPrintModalOpen(true);
                        }}
                        className="px-2.5 py-1 border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold rounded-lg text-[11px] transition-colors inline-flex items-center gap-1"
                      >
                        <Printer className="w-3 h-3" />
                        <span>Print Report</span>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* RESULT ENTRY MODAL */}
      {activeOrderForEdit && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 text-xs">
            <div className="border-b border-slate-200 pb-3 flex justify-between items-center">
              <div>
                <h3 className="text-base font-bold text-slate-900">Document Laboratory Observations</h3>
                <p className="text-slate-500">{activeOrderForEdit.testName} &bull; {activeOrderForEdit.patientName}</p>
              </div>
              <button onClick={() => setActiveOrderForEdit(null)} className="text-slate-400 hover:text-slate-700">Close</button>
            </div>

            <form onSubmit={handleSaveResults} className="space-y-4">
              <div className="space-y-2">
                {resultsForm.map((res, idx) => (
                  <div key={idx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-5 gap-2 items-center">
                    <div className="col-span-2">
                      <label className="block text-[10px] text-slate-500 mb-0.5">Parameter</label>
                      <input
                        type="text"
                        value={res.parameter}
                        onChange={(e) => {
                          const c = [...resultsForm];
                          c[idx].parameter = e.target.value;
                          setResultsForm(c);
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-semibold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Observed Value</label>
                      <input
                        type="text"
                        value={res.value}
                        onChange={(e) => {
                          const c = [...resultsForm];
                          c[idx].value = e.target.value;
                          setResultsForm(c);
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Unit</label>
                      <input
                        type="text"
                        value={res.unit}
                        onChange={(e) => {
                          const c = [...resultsForm];
                          c[idx].unit = e.target.value;
                          setResultsForm(c);
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] text-slate-500 mb-0.5">Flag</label>
                      <select
                        value={res.status}
                        onChange={(e) => {
                          const c = [...resultsForm];
                          c[idx].status = e.target.value as any;
                          setResultsForm(c);
                        }}
                        className="w-full px-2 py-1 bg-white border border-slate-200 rounded text-xs"
                      >
                        <option value="Normal">Normal</option>
                        <option value="High">High</option>
                        <option value="Low">Low</option>
                        <option value="Critical">Critical</option>
                      </select>
                    </div>
                  </div>
                ))}
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pathologist Interpretive Remarks</label>
                <textarea
                  rows={2}
                  value={pathologistRemarks}
                  onChange={(e) => setPathologistRemarks(e.target.value)}
                  className="w-full p-2 border border-slate-200 rounded-lg text-xs"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-xl">
                <input
                  type="checkbox"
                  id="critical-checkbox"
                  checked={isCritical}
                  onChange={(e) => setIsCritical(e.target.checked)}
                  className="h-4 w-4 rounded text-red-600 focus:ring-red-500"
                />
                <label htmlFor="critical-checkbox" className="font-bold text-red-900 cursor-pointer">
                  Mark as Panic / Critical Lab Alert (Dispatches Urgent Notification to Treating Doctor)
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setActiveOrderForEdit(null)}
                  className="px-4 py-2 border border-slate-200 rounded-lg text-slate-700 font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold"
                >
                  Save & Authorize Diagnostic Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PRINTABLE REPORT MODAL */}
      <PrintableLabReportModal
        isOpen={isPrintModalOpen}
        onClose={() => setIsPrintModalOpen(false)}
        order={selectedOrderForPrint}
        tenant={currentTenant}
      />
    </div>
  );
};
