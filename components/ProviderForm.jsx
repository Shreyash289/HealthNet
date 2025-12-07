import { useState } from 'react';

export default function ProviderForm({ onAdd }){
  const empty = { name: '', phone: '', website: '', npi: '', address: '' };
  const [rows, setRows] = useState([ { ...empty } ]);

  function updateField(i, field, value){
    const copy = [...rows];
    copy[i][field] = value;
    setRows(copy);
  }
  function addRow(){ setRows(prev => [...prev, { ...empty }]); }
  function removeRow(i){ setRows(prev => prev.filter((_, idx) => idx !== i)); }

  function handleValidate(){
    const toSend = rows
      .map(r => ({
        name: (r.name || '').trim(),
        phone: (r.phone || '').trim(),
        website: (r.website || '').trim(),
        npi: (r.npi || '').trim(),
        address: (r.address || '').trim()
      }))
      .filter(r => r.name || r.phone || r.website || r.npi);
    if(toSend.length === 0){
      alert('Please add at least one provider (name, phone, website or NPI).');
      return;
    }
    onAdd(toSend);
  }

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-primary-100/50 to-purple-100/50 rounded-full blur-3xl -mr-32 -mt-32"></div>
      <div className="relative">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-1">Provider Verification</h2>
            <p className="text-sm text-gray-600">Add provider information for AI-powered validation</p>
          </div>
          <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg border border-primary-100">
            <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="text-sm font-semibold text-primary-700">AI-Powered</span>
          </div>
        </div>

        <div className="space-y-4">
          {rows.map((r, i) => (
            <div key={i} className="bg-gradient-to-br from-gray-50 to-white p-4 rounded-xl border border-gray-200 hover:border-primary-300 transition-all duration-200">
              <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
                <div className="md:col-span-4">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Provider Name *</label>
                  <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" 
                    placeholder="Enter provider name" 
                    value={r.name} 
                    onChange={e=>updateField(i,'name',e.target.value)} 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Phone</label>
                  <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" 
                    placeholder="(555) 123-4567" 
                    value={r.phone} 
                    onChange={e=>updateField(i,'phone',e.target.value)} 
                  />
                </div>
                <div className="md:col-span-3">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Website</label>
                  <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" 
                    placeholder="https://example.com" 
                    value={r.website} 
                    onChange={e=>updateField(i,'website',e.target.value)} 
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">NPI Number</label>
                  <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" 
                    placeholder="1234567890" 
                    value={r.npi} 
                    onChange={e=>updateField(i,'npi',e.target.value)} 
                  />
                </div>
                <div className="md:col-span-1 flex items-end">
                  <button 
                    onClick={()=>removeRow(i)} 
                    className="w-full p-3 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 rounded-lg transition-all font-medium text-sm"
                    disabled={rows.length === 1}
                  >
                    <svg className="w-5 h-5 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
                <div className="md:col-span-12">
                  <label className="block text-xs font-semibold text-gray-700 mb-1.5">Address</label>
                  <input 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" 
                    placeholder="123 Main St, City, State ZIP" 
                    value={r.address} 
                    onChange={e=>updateField(i,'address',e.target.value)} 
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <button 
            onClick={addRow} 
            className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-50 to-purple-50 text-primary-700 border border-primary-200 rounded-xl hover:shadow-lg transition-all font-semibold"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Another Provider
          </button>
          <button 
            onClick={handleValidate} 
            className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-xl hover:shadow-xl hover:from-primary-700 hover:to-primary-800 transition-all font-bold text-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Start AI Verification
          </button>
        </div>
      </div>
    </div>
  );
}
