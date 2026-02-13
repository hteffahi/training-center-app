import React, { useState } from 'react';
import { CandidatesPage } from './pages/CandidatesPage';
import { PaymentsPage } from './pages/PaymentsPage';
import { DashboardPage } from './pages/DashboardPage';

type TabType = 'candidates' | 'payments' | 'dashboard';

function App() {
  const [activeTab, setActiveTab] = useState<TabType>('candidates');
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-2xl font-bold text-gray-900">
            🏢 Centre de Formation - Gestion des candidats
          </h1>
        </div>
      </header>

      {/* Navigation */}
      <nav className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('candidates')}
              className={`px-4 py-4 font-medium border-b-2 transition ${
                activeTab === 'candidates'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              👥 Candidats
            </button>
            <button
              onClick={() => setActiveTab('payments')}
              className={`px-4 py-4 font-medium border-b-2 transition ${
                activeTab === 'payments'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              💳 Paiements
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`px-4 py-4 font-medium border-b-2 transition ${
                activeTab === 'dashboard'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              📊 Tableau de bord
            </button>
          </div>
        </div>
      </nav>

      {/* Main content */}
      <main className="max-w-7xl mx-auto">
        {activeTab === 'candidates' && (
          <CandidatesPage
            selectedSessionId={selectedSessionId}
            onSessionChange={setSelectedSessionId}
          />
        )}
        {activeTab === 'payments' && (
          <PaymentsPage selectedSessionId={selectedSessionId} />
        )}
        {activeTab === 'dashboard' && (
          <DashboardPage selectedSessionId={selectedSessionId} />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center text-sm">
          <p>© 2026 Système de gestion des candidats - Centre de Formation</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
