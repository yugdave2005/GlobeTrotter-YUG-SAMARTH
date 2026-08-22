import { Routes, Route, Navigate } from 'react-router-dom';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <nav className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-600">GlobeTrotter 🌍</h1>
      </nav>

      <main className="p-6">
        <Routes>
          <Route path="/" element={
            <div className="text-center mt-20">
              <h2 className="text-4xl font-bold mb-4">Welcome to GlobeTrotter!</h2>
              <p className="text-xl text-gray-600">The modular frontend has been successfully initialized.</p>
            </div>
          } />
          {/* We will map the page modules here! */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default App;
