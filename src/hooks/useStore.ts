import { useState, useCallback } from 'react';
import type { Session, Candidate, Payment } from '../types';

export const useStore = () => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);

  const addSession = useCallback((session: Session) => {
    setSessions(prev => [session, ...prev]);
  }, []);

  const updateSessions = useCallback((newSessions: Session[]) => {
    setSessions(newSessions);
  }, []);

  const addCandidate = useCallback((candidate: Candidate) => {
    setCandidates(prev => [candidate, ...prev]);
  }, []);

  const updateCandidate = useCallback((id: string, updates: Partial<Candidate>) => {
    setCandidates(prev =>
      prev.map(c => c.id === id ? { ...c, ...updates } : c)
    );
  }, []);

  const removeCandidate = useCallback((id: string) => {
    setCandidates(prev => prev.filter(c => c.id !== id));
  }, []);

  const updateCandidatesList = useCallback((newCandidates: Candidate[]) => {
    setCandidates(newCandidates);
  }, []);

  const addPayment = useCallback((payment: Payment) => {
    setPayments(prev => [payment, ...prev]);
  }, []);

  const updatePaymentsList = useCallback((newPayments: Payment[]) => {
    setPayments(newPayments);
  }, []);

  return {
    sessions,
    candidates,
    payments,
    selectedSessionId,
    setSelectedSessionId,
    addSession,
    updateSessions,
    addCandidate,
    updateCandidate,
    removeCandidate,
    updateCandidatesList,
    addPayment,
    updatePaymentsList,
  };
};
