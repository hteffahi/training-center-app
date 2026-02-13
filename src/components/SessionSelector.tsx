import React from 'react';
import type { Session } from '../types';

interface SessionSelectorProps {
  sessions: Session[];
  selectedSessionId: string | null;
  onSelectSession: (sessionId: string) => void;
  onCreateSession: () => void;
}

export const SessionSelector: React.FC<SessionSelectorProps> = ({
  sessions,
  selectedSessionId,
  onSelectSession,
  onCreateSession,
}) => {
  return (
    <div className="mb-6">
      <div className="flex gap-4 items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Sélectionner une session
          </label>
          <select
            value={selectedSessionId || ''}
            onChange={(e) => onSelectSession(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">-- Choisir une session --</option>
            {sessions.map((session) => (
              <option key={session.id} value={session.id}>
                {session.name} ({new Date(session.date).toLocaleDateString('fr-FR')})
              </option>
            ))}
          </select>
        </div>
        <button
          onClick={onCreateSession}
          className="mt-6 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
        >
          + Nouvelle session
        </button>
      </div>
    </div>
  );
};
