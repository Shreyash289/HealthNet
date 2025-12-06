export default function ProviderCard({ provider }){
  return (
    <div className="bg-white p-4 rounded-xl shadow-sm border">
      <div className="flex items-start justify-between">
        <div>
          <div className="text-lg font-semibold">{provider.name || '(no name)'}</div>
          <div className="text-sm text-gray-500">{provider.address}</div>
          <div className="mt-2 text-xs text-gray-500">Phone: {provider.phone || '-'}</div>
        </div>
        <div className="text-right">
          <div className={`${provider.flagged ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'} px-3 py-1 rounded text-sm`}>
            {provider.confidence ? `${provider.confidence}%` : 'Pending'}
          </div>
          <div className="text-xs text-gray-500 mt-2">{provider.npi ? `NPI: ${provider.npi}` : ''}</div>
        </div>
      </div>

      <details className="mt-3 text-sm">
        <summary className="cursor-pointer">Validation details</summary>
        <div className="mt-2">
          <pre className="text-xs max-h-48 overflow-auto bg-gray-50 p-2 rounded">{JSON.stringify(provider.checks || {}, null, 2)}</pre>
        </div>
      </details>
    </div>
  )
}
