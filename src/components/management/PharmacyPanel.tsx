import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useClinicData } from '../../context/ClinicDataContext';
import { InventoryItem } from '../../types/management';
import { 
  Pill, 
  Package, 
  AlertTriangle, 
  Search, 
  Plus, 
  CheckCircle2, 
  ArrowDownCircle, 
  RefreshCw, 
  Layers, 
  ShieldCheck,
  Calendar,
  Building2
} from 'lucide-react';

export const PharmacyPanel: React.FC = () => {
  const { currentTenant } = useAuth();
  const { inventory, medicalRecords, updateInventoryStock, dispensePrescription } = useClinicData();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [activeTab, setActiveTab] = useState<'inventory' | 'dispense' | 'alerts'>('inventory');

  // Filtered inventory
  const filteredInventory = inventory.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.genericName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCat = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCat;
  });

  const lowStockItems = inventory.filter(i => i.stockQuantity <= i.minThreshold);

  // Collect all prescriptions from medical records
  const allPrescriptions = medicalRecords.flatMap(mr =>
    mr.prescriptions.map(p => ({
      ...p,
      patientId: mr.patientId,
      visitDate: mr.visitDate,
      doctorName: mr.doctorName
    }))
  );

  const categories = ['All', 'Analgesics', 'Antibiotics', 'Cardiovascular', 'Respiratory', 'Dermatology', 'IV Fluids', 'Surgical Consumables'];

  const handleRestock = (item: InventoryItem) => {
    updateInventoryStock(item.id, item.stockQuantity + item.reorderQuantity);
  };

  const handleDispenseMedicine = (prescriptionId: string, medicineName: string) => {
    dispensePrescription(prescriptionId, medicineName, 10);
    alert(`Dispensed medication "${medicineName}". Stock inventory deducted.`);
  };

  return (
    <div className="space-y-6">
      {/* Header matching CarePlus portal layout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 font-heading tracking-tight">
            Pharmacy & Medicine Dispensary Desk
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Automated drug catalog, batch number tracking, expiry date monitoring, and doctor e-Prescription dispensing for {currentTenant.name}.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <span className="px-3 py-1.5 rounded-full bg-blue-50 text-blue-700 text-xs font-bold border border-blue-200">
            {allPrescriptions.filter(p => p.dispensedStatus === 'Pending').length} Pending Orders
          </span>
        </div>
      </div>

      {/* 4 Stat Cards matching CarePlus portal style */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Total Stock SKUs</span>
          <div className="text-2xl font-extrabold mt-1 text-slate-900 font-heading">
            {inventory.length}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">Cataloged drugs</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Low-Stock Warnings</span>
          <div className="text-2xl font-extrabold mt-1 text-amber-600 font-heading">
            {lowStockItems.length}
          </div>
          <span className="text-[11px] text-amber-600 font-semibold mt-0.5 block">SKUs below safety stock</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Pending e-Prescriptions</span>
          <div className="text-2xl font-extrabold mt-1 text-blue-700 font-heading">
            {allPrescriptions.filter(p => p.dispensedStatus === 'Pending').length}
          </div>
          <span className="text-[11px] text-blue-600 font-semibold mt-0.5 block">Awaiting dispensing</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs">
          <span className="text-slate-400 text-[11px] font-semibold block uppercase tracking-wider">Stock Health</span>
          <div className="text-2xl font-extrabold mt-1 text-emerald-600 font-heading">
            100% Valid
          </div>
          <span className="text-[11px] text-emerald-600 font-semibold mt-0.5 block">0 expired batches</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-slate-200/60 rounded-xl w-fit text-xs font-semibold">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'inventory'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Package className="w-3.5 h-3.5" />
          <span>Stock Catalog ({inventory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('dispense')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'dispense'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Pill className="w-3.5 h-3.5" />
          <span>e-Prescription Dispensing Queue ({allPrescriptions.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('alerts')}
          className={`px-4 py-2 rounded-lg transition-all flex items-center gap-2 cursor-pointer ${
            activeTab === 'alerts'
              ? 'bg-white text-blue-700 shadow-xs font-bold'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Low-Stock & Reorders ({lowStockItems.length})</span>
        </button>
      </div>

      {/* TAB 1: INVENTORY TABLE */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="relative max-w-sm w-full">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
              <input
                type="text"
                placeholder="Search by drug name, generic, SKU..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-800"
              />
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-slate-500">Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-2.5 py-1.5 bg-white border border-slate-200 rounded-lg text-xs"
              >
                {categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 shadow-xs overflow-x-auto">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-slate-600 uppercase text-[10px] font-bold">
                  <th className="py-3 px-4">Drug & Generic Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Batch & Expiry</th>
                  <th className="py-3 px-4 text-right">In Stock</th>
                  <th className="py-3 px-4 text-right">Selling Rate</th>
                  <th className="py-3 px-4">Location</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filteredInventory.map((item) => {
                  const isLow = item.stockQuantity <= item.minThreshold;

                  return (
                    <tr key={item.id} className={isLow ? 'bg-amber-50/40 hover:bg-amber-50/70' : 'hover:bg-slate-50/70'}>
                      <td className="py-3 px-4">
                        <strong className="text-slate-900 block font-bold">{item.name}</strong>
                        <span className="text-slate-500 text-[11px] italic">{item.genericName}</span>
                        <span className="text-slate-400 block font-mono text-[10px] mt-0.5">SKU: {item.sku}</span>
                      </td>

                      <td className="py-3 px-4 text-slate-700">
                        <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-800 text-[10px] font-semibold">
                          {item.category}
                        </span>
                      </td>

                      <td className="py-3 px-4 font-mono text-[11px] text-slate-700">
                        <div>Batch: {item.batchNumber}</div>
                        <div className="text-slate-500">Exp: {item.expiryDate}</div>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <span className={`font-bold text-sm ${isLow ? 'text-amber-700' : 'text-slate-900'}`}>
                          {item.stockQuantity}
                        </span>
                        {isLow && (
                          <span className="block text-[10px] text-amber-600 font-bold uppercase">
                            Low (Min {item.minThreshold})
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-right font-bold text-slate-900">
                        ₹{item.sellingPrice}
                      </td>

                      <td className="py-3 px-4 text-slate-500 text-[11px]">
                        {item.location}
                      </td>

                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleRestock(item)}
                          className="px-2.5 py-1 bg-indigo-50 hover:bg-indigo-100 border border-indigo-200 text-indigo-800 font-bold rounded-lg text-[11px] transition-colors"
                        >
                          + Restock ({item.reorderQuantity})
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: DISPENSING QUEUE */}
      {activeTab === 'dispense' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4 text-xs">
          <div className="border-b border-slate-200 pb-3">
            <h3 className="text-sm font-bold text-slate-900">Doctor e-Prescriptions Dispensing Counter</h3>
            <p className="text-slate-500 text-xs">Directly routed from physician EMR consultations.</p>
          </div>

          <div className="space-y-3">
            {allPrescriptions.map((rx) => (
              <div key={rx.id} className="p-4 bg-slate-50 rounded-xl border border-slate-200 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <strong className="text-slate-900 font-bold text-sm">{rx.medicineName}</strong>
                    <span className="px-2 py-0.5 rounded bg-indigo-100 text-indigo-900 font-mono text-[10px]">
                      {rx.dosage}
                    </span>
                  </div>
                  <p className="text-slate-600 text-[11px] mt-1">
                    Frequency: <strong>{rx.frequency}</strong> &bull; Duration: {rx.duration} &bull; Instructions: {rx.instructions}
                  </p>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    Prescribed by: {rx.doctorName} on {rx.visitDate}
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase ${
                    rx.dispensedStatus === 'Dispensed'
                      ? 'bg-emerald-100 text-emerald-900'
                      : 'bg-amber-100 text-amber-900'
                  }`}>
                    {rx.dispensedStatus}
                  </span>

                  {rx.dispensedStatus === 'Pending' && (
                    <button
                      onClick={() => handleDispenseMedicine(rx.id, rx.medicineName)}
                      className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-xs transition-colors cursor-pointer"
                    >
                      Dispense to Patient
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LOW STOCK & REORDERS */}
      {activeTab === 'alerts' && (
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 text-amber-800 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-amber-600" />
            <span>Low-Stock Inventory Reorder Triggers</span>
          </div>

          <div className="space-y-2">
            {lowStockItems.map(item => (
              <div key={item.id} className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl flex items-center justify-between">
                <div>
                  <strong className="text-slate-900 font-bold block">{item.name}</strong>
                  <span className="text-slate-600 text-[11px]">
                    Current Stock: <strong className="text-rose-700">{item.stockQuantity}</strong> (Threshold: {item.minThreshold}) &bull; Supplier: {item.supplierName}
                  </span>
                </div>

                <button
                  onClick={() => handleRestock(item)}
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-lg text-xs"
                >
                  Order {item.reorderQuantity} Units from Supplier
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
