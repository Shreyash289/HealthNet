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
    <div className="bg-white p-6 rounded-xl shadow-md">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-medium">Add Providers</h2>
        <div className="text-sm text-gray-500">Add many providers then click Validate All</div>
      </div>

      <div className="space-y-4">
        {rows.map((r, i) => (
          <div key={i} className="grid grid-cols-12 gap-3 items-center">
            <input className="col-span-3 p-2 border rounded-lg" placeholder="Provider Name" value={r.name} onChange={e=>updateField(i,'name',e.target.value)} />
            <input className="col-span-2 p-2 border rounded-lg" placeholder="Phone" value={r.phone} onChange={e=>updateField(i,'phone',e.target.value)} />
            <input className="col-span-3 p-2 border rounded-lg" placeholder="Website (https://...)" value={r.website} onChange={e=>updateField(i,'website',e.target.value)} />
            <input className="col-span-2 p-2 border rounded-lg" placeholder="NPI (optional)" value={r.npi} onChange={e=>updateField(i,'npi',e.target.value)} />
            <div className="col-span-1 flex gap-2">
              <button onClick={()=>removeRow(i)} className="px-3 py-1 bg-red-50 text-red-700 border rounded">Delete</button>
            </div>
            <input className="col-span-12 p-2 border rounded-lg" placeholder="Address (optional)" value={r.address} onChange={e=>updateField(i,'address',e.target.value)} />
          </div>
        ))}
      </div>

      <div className="mt-4 flex gap-2">
        <button onClick={addRow} className="px-4 py-2 bg-primary-50 text-primary-700 border rounded-lg hover:shadow">+ Add Provider</button>
        <button onClick={handleValidate} className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:shadow">Validate All</button>
      </div>
    </div>
  );
}
