import { useState } from 'react';
import Header from '../components/Header';
import ProviderForm from '../components/ProviderForm';
import ProviderCard from '../components/ProviderCard';
import axios from 'axios';
import { isPhoneValid } from '../utils/validators';
import { exportToCsv } from '../utils/csv-export';

export default function Home(){
  const [providers, setProviders] = useState([]); // validated providers
  const [processing, setProcessing] = useState(false);
  const [progress, setProgress] = useState({ done: 0, total: 0 });

  async function validateMany(rows){
    setProcessing(true);
    setProgress({ done: 0, total: rows.length });

    const placeholders = rows.map((r, i) => ({ id: i+1, ...r, checks: {}, confidence: null, flagged: false }));
    setProviders(placeholders);

    const concurrency = 6;
    let idx = 0;

    async function worker(){
      while(true){
        const i = idx++;
        if(i >= rows.length) break;
        const original = rows[i];
        const result = await validateOne(original);
        setProviders(prev => {
          const copy = [...prev]; copy[i] = result; return copy;
        });
        setProgress(prev => ({ ...prev, done: prev.done + 1 }));
      }
    }

    const workers = new Array(concurrency).fill(null).map(() => worker());
    await Promise.all(workers);
    setProcessing(false);
  }

  async function validateOne(p){
    const out = { name: p.name || '', phone: p.phone || '', website: p.website || '', npi: p.npi || '', address: p.address || '', checks: {} };

    // NPI check
    if(out.npi){
      try{
        const resp = await axios.get(`/api/npi?number=${encodeURIComponent(out.npi)}`, { timeout: 12000 });
        out.checks.npi_api = Array.isArray(resp.data.results) && resp.data.results.length > 0;
        out.checks.npi_raw = resp.data;
      } catch(err){
        out.checks.npi_api = false;
        out.checks.npi_error = err.message || String(err);
      }
    } else {
      out.checks.npi_api = false;
    }

    // website
    if(out.website){
      try{
        const resp = await axios.post('/api/proxy', { url: out.website }, { timeout: 15000 });
        out.checks.website_status = resp.data.status;
        out.checks.website_ok = !!resp.data.ok;
        out.checks.website_snippet = resp.data.snippet;
        out.checks.website_name_match = out.name && typeof resp.data.snippet === 'string' && resp.data.snippet.toLowerCase().includes(out.name.split(' ')[0].toLowerCase());
      } catch(err){
        out.checks.website_ok = false;
        out.checks.website_error = err.message || String(err);
      }
    }

    // phone
    out.checks.phone_format = isPhoneValid(out.phone);

    // scoring
    const weights = { npi_api: 0.6, website_name_match: 0.25, phone_format: 0.15 };
    let score = 0;
    for(const k in weights){ if(out.checks[k]) score += weights[k]; }
    out.confidence = Math.round(score * 100);
    out.flagged = out.confidence < 60;

    return out;
  }

  function downloadCSV(){
    const rows = providers.map(p => ({ name: p.name, npi: p.npi, phone: p.phone, website: p.website, address: p.address, confidence: p.confidence, flagged: p.flagged, checks: JSON.stringify(p.checks) }));
    exportToCsv('validation_results.csv', rows);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="max-w-6xl mx-auto p-6 space-y-6">
        <ProviderForm onAdd={validateMany} />

        <div className="flex items-center justify-between">
          <h2 className="text-lg font-medium">Results</h2>
          <div className="flex items-center gap-3">
            <div className="text-sm text-gray-600">{processing ? `Processing ${progress.done} / ${progress.total}` : `${providers.length} providers`}</div>
            <button onClick={downloadCSV} disabled={providers.length===0} className="px-3 py-1 bg-primary-600 text-white rounded text-sm">Export CSV</button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {providers.map((p, idx) => (
            <ProviderCard key={idx} provider={p} />
          ))}
          {providers.length === 0 && (
            <div className="col-span-2 text-center text-gray-500 bg-white p-6 rounded">No results yet — add providers and click Validate All.</div>
          )}
        </div>
      </main>
    </div>
  )
}
