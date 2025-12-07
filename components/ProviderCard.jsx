export default function ProviderCard({ provider }){
  const confidence = provider.confidence || 0;
  const isVerified = confidence >= 60;
  const isPending = confidence === null;
  
  const getStatusColor = () => {
    if (isPending) return 'from-gray-400 to-gray-500';
    if (isVerified) return 'from-green-400 to-emerald-500';
    return 'from-red-400 to-rose-500';
  };

  const getStatusText = () => {
    if (isPending) return 'Analyzing...';
    if (isVerified) return 'Verified';
    return 'Flagged';
  };

  const getCheckStatus = (check) => {
    if (check === true || check === 'true') return { icon: '✓', color: 'text-green-600', bg: 'bg-green-50' };
    if (check === false || check === 'false') return { icon: '✗', color: 'text-red-600', bg: 'bg-red-50' };
    return { icon: '○', color: 'text-gray-400', bg: 'bg-gray-50' };
  };

  return (
    <div className="group bg-white p-5 rounded-2xl shadow-md border border-gray-100 hover:shadow-xl transition-all duration-300 hover:border-primary-200 relative overflow-hidden">
      {/* Gradient accent */}
      <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${getStatusColor()}`}></div>
      
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-xl font-bold text-gray-900">{provider.name || 'Unnamed Provider'}</h3>
            {isVerified && (
              <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            )}
          </div>
          {provider.address && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {provider.address}
            </div>
          )}
          {provider.phone && (
            <div className="flex items-center gap-1.5 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              {provider.phone}
            </div>
          )}
        </div>
        <div className="text-right ml-4">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${getStatusColor()} text-white font-semibold text-sm shadow-lg`}>
            {isPending ? (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span>{confidence}%</span>
            )}
          </div>
          <div className="text-xs text-gray-500 mt-2 font-mono">{provider.npi || 'No NPI'}</div>
        </div>
      </div>

      {/* AI Verification Checks */}
      <div className="grid grid-cols-3 gap-2 mb-4">
        {provider.checks && (
          <>
            {provider.checks.npi_api !== undefined && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getCheckStatus(provider.checks.npi_api).bg}`}>
                <span className={`font-semibold ${getCheckStatus(provider.checks.npi_api).color}`}>
                  {getCheckStatus(provider.checks.npi_api).icon}
                </span>
                <span className="text-xs font-medium text-gray-700">NPI Verified</span>
              </div>
            )}
            {provider.checks.website_ok !== undefined && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getCheckStatus(provider.checks.website_ok).bg}`}>
                <span className={`font-semibold ${getCheckStatus(provider.checks.website_ok).color}`}>
                  {getCheckStatus(provider.checks.website_ok).icon}
                </span>
                <span className="text-xs font-medium text-gray-700">Website Active</span>
              </div>
            )}
            {provider.checks.phone_format !== undefined && (
              <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${getCheckStatus(provider.checks.phone_format).bg}`}>
                <span className={`font-semibold ${getCheckStatus(provider.checks.phone_format).color}`}>
                  {getCheckStatus(provider.checks.phone_format).icon}
                </span>
                <span className="text-xs font-medium text-gray-700">Phone Valid</span>
              </div>
            )}
          </>
        )}
      </div>

      {/* AI Insights */}
      {provider.checks && (provider.checks.npi_api || provider.checks.website_name_match) && (
        <div className="mb-4 p-3 bg-gradient-to-r from-primary-50 to-purple-50 rounded-lg border border-primary-100">
          <div className="flex items-start gap-2">
            <svg className="w-5 h-5 text-primary-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            <div className="flex-1">
              <p className="text-xs font-semibold text-primary-900 mb-1">AI Analysis</p>
              <p className="text-xs text-primary-700">
                {provider.checks.npi_api && provider.checks.website_name_match 
                  ? 'Provider verified across multiple data sources with high confidence.'
                  : provider.checks.npi_api 
                  ? 'NPI registry confirmed. Additional verification recommended.'
                  : 'Partial verification completed. Review recommended.'}
              </p>
            </div>
          </div>
        </div>
      )}

      <details className="mt-2">
        <summary className="cursor-pointer text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors flex items-center gap-2">
          <span>Technical Details</span>
          <svg className="w-4 h-4 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </summary>
        <div className="mt-3 p-3 bg-gray-50 rounded-lg border border-gray-200">
          <pre className="text-xs max-h-48 overflow-auto text-gray-700 font-mono">{JSON.stringify(provider.checks || {}, null, 2)}</pre>
        </div>
      </details>
    </div>
  )
}
