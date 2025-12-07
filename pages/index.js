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

  const verifiedCount = providers.filter(p => p.confidence >= 60).length;
  const flaggedCount = providers.filter(p => p.confidence !== null && p.confidence < 60).length;
  const avgConfidence = providers.length > 0 && providers.every(p => p.confidence !== null)
    ? Math.round(providers.reduce((sum, p) => sum + (p.confidence || 0), 0) / providers.length)
    : null;

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-50 via-white to-primary-50/30">
      <Header />
      <main className="max-w-7xl mx-auto p-6 space-y-8 flex-1">
        <ProviderForm onAdd={validateMany} />

        {providers.length > 0 && (
          <>
            {/* Stats Dashboard */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-5 rounded-2xl shadow-md border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-600">Total Providers</span>
                  <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-gray-900">{providers.length}</div>
              </div>
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-5 rounded-2xl shadow-md border border-green-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-green-700">Verified</span>
                  <svg className="w-5 h-5 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-green-700">{verifiedCount}</div>
              </div>
              <div className="bg-gradient-to-br from-red-50 to-rose-50 p-5 rounded-2xl shadow-md border border-red-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-red-700">Flagged</span>
                  <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                </div>
                <div className="text-3xl font-bold text-red-700">{flaggedCount}</div>
              </div>
              {avgConfidence !== null && (
                <div className="bg-gradient-to-br from-primary-50 to-purple-50 p-5 rounded-2xl shadow-md border border-primary-100">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-primary-700">Avg Confidence</span>
                    <svg className="w-5 h-5 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="text-3xl font-bold text-primary-700">{avgConfidence}%</div>
                </div>
              )}
            </div>

            {/* Results Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-1">Verification Results</h2>
                <p className="text-sm text-gray-600">
                  {processing ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-primary-600 border-t-transparent rounded-full animate-spin"></div>
                      Processing {progress.done} of {progress.total} providers...
                    </span>
                  ) : (
                    `${providers.length} provider${providers.length !== 1 ? 's' : ''} analyzed`
                  )}
                </p>
              </div>
              <button 
                onClick={downloadCSV} 
                disabled={providers.length===0 || processing}
                className="flex items-center gap-2 px-5 py-3 bg-white border-2 border-primary-600 text-primary-700 rounded-xl hover:bg-primary-50 transition-all font-semibold shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Export CSV
              </button>
            </div>
          </>
        )}

        {/* Results Grid */}
        {providers.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {providers.map((p, idx) => (
              <ProviderCard key={idx} provider={p} />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-md border border-gray-200 p-12 text-center">
            <div className="max-w-md mx-auto">
              <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-primary-100 to-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-primary-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Ready to Verify</h3>
              <p className="text-gray-600 mb-6">Add provider information above and click "Start AI Verification" to begin analysis.</p>
            </div>
          </div>
        )}
      </main>
    </div>
  )
}
