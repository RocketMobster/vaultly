import { Routes, Route } from 'react-router-dom'
import Dashboard from './pages/Dashboard.jsx'
import CollectionDetail from './pages/CollectionDetail.jsx'


function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-gray-900 text-white py-2 px-4 flex items-center justify-between">
        <span className="font-bold text-lg">Vaultly</span>
        <span className="text-sm">v1.0.0 &mdash; RocketMobster Software</span>
      </header>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/collection/:id" element={<CollectionDetail />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
