export default function Header(){
  return (
    <header className="bg-gradient-to-r from-primary-600 to-primary-500 text-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">HealthNet Verify</h1>
          <p className="text-sm opacity-90">Fast provider validation — NPI, website & phone checks</p>
        </div>
        <div className="text-sm opacity-90">Hackathon Demo</div>
      </div>
    </header>
  )
}
