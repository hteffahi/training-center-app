import React, { useEffect, useState } from 'react';
import { SessionSelector } from '../components/SessionSelector';
import { CandidateForm } from '../components/CandidateForm';
import { CandidateList } from '../components/CandidateList';
import { NewSessionModal } from '../components/NewSessionModal';
import * as api from '../lib/supabase';
import type { Session, Candidate } from '../types';

interface CandidatesPageProps {
  selectedSessionId: string | null;
  onSessionChange: (sessionId: string) => void;
}

export const CandidatesPage: React.FC<CandidatesPageProps> = ({
  selectedSessionId,
  onSessionChange,
}) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [showNewSession, setShowNewSession] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<Candidate | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    if (selectedSessionId) {
      loadCandidates();
    }
  }, [selectedSessionId]);

  const loadSessions = async () => {
    try {
      setLoading(true);
      const data = await api.fetchSessions();
      setSessions(data);
    } catch (err) {
      setError('Erreur lors du chargement des sessions');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadCandidates = async () => {
    try {
      setLoading(true);
      const data = await api.fetchCandidates(selectedSessionId || undefined);
      setCandidates(data);
    } catch (err) {
      setError('Erreur lors du chargement des candidats');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateSession = async (name: string, date: string) => {
    try {
      const newSession = await api.createSession({ name, date });
      setSessions(prev => [newSession, ...prev]);
      onSessionChange(newSession.id);
      setShowNewSession(false);
    } catch (err) {
      setError('Erreur lors de la création de la session');
      console.error(err);
    }
  };

  const handleAddCandidate = async (candidateData: Omit<Candidate, 'id' | 'created_at'>) => {
    try {
      const newCandidate = await api.createCandidate(candidateData);
      setCandidates(prev => [newCandidate, ...prev]);
      setShowForm(false);
    } catch (err) {
      setError('Erreur lors de l\'ajout du candidat');
      console.error(err);
    }
  };

  const handleUpdateCandidate = async (candidateData: Omit<Candidate, 'id' | 'created_at'>) => {
    if (!editingCandidate) return;
    try {
      const updated = await api.updateCandidate(editingCandidate.id, candidateData);
      setCandidates(prev =>
        prev.map(c => c.id === editingCandidate.id ? updated : c)
      );
      setEditingCandidate(null);
      setShowForm(false);
    } catch (err) {
      setError('Erreur lors de la mise à jour du candidat');
      console.error(err);
    }
  };

  const handleDeleteCandidate = async (id: string) => {
    try {
      await api.deleteCandidate(id);
      setCandidates(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setError('Erreur lors de la suppression du candidat');
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Gestion des candidats</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      <SessionSelector
        sessions={sessions}
        selectedSessionId={selectedSessionId}
        onSelectSession={onSessionChange}
        onCreateSession={() => setShowNewSession(true)}
      />

      <NewSessionModal
        isOpen={showNewSession}
        onClose={() => setShowNewSession(false)}
        onSubmit={handleCreateSession}
      />

      {selectedSessionId && (
        <>
          <div className="mb-6">
            <button
              onClick={() => {
                setEditingCandidate(null);
                setShowForm(!showForm);
              }}
              className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
            >
              {showForm ? '- Annuler' : '+ Ajouter un candidat'}
            </button>
          </div>

          {showForm && (
            <div className="mb-8">
              <CandidateForm
                sessionId={selectedSessionId}
                candidate={editingCandidate || undefined}
                onSubmit={editingCandidate ? handleUpdateCandidate : handleAddCandidate}
                onCancel={() => {
                  setShowForm(false);
                  setEditingCandidate(null);
                }}
              />
            </div>
          )}

          {loading ? (
            <div className="text-center py-8">Chargement...</div>
          ) : (
            <>
              <div className="mb-4 text-sm text-gray-600">
                {candidates.length} candidat{candidates.length !== 1 ? 's' : ''}
              </div>
              <CandidateList
                candidates={candidates}
                onEdit={(candidate) => {
                  setEditingCandidate(candidate);
                  setShowForm(true);
                }}
                onDelete={handleDeleteCandidate}
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
