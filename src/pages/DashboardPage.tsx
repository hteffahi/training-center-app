import React, { useEffect, useState } from 'react';
import * as api from '../lib/supabase';
import type { Session, Candidate, Payment } from '../types';
import { calculateTotalPaid, exportToCSV, formatCurrency, formatDate } from '../lib/utils';

interface DashboardPageProps {
  selectedSessionId: string | null;
}

export const DashboardPage: React.FC<DashboardPageProps> = ({ selectedSessionId }) => {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [selectedSessionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const sessionsData = await api.fetchSessions();
      setSessions(sessionsData);

      const candidatesData = await api.fetchCandidates(
        selectedSessionId || undefined
      );
      setCandidates(candidatesData);

      const paymentsData = await api.fetchPayments();
      setPayments(paymentsData);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const paymentsByCandidate = new Map<string, Payment[]>();
  payments.forEach(p => {
    const current = paymentsByCandidate.get(p.candidate_id) || [];
    paymentsByCandidate.set(p.candidate_id, [...current, p]);
  });

  // Stats for selected session
  const sessionStats = (() => {
    const totalCandidates = candidates.length;
    let paidCount = 0;
    let pendingCount = 0;
    let unpaidCount = 0;

    candidates.forEach(candidate => {
      const candidatePayments = paymentsByCandidate.get(candidate.id) || [];
      const totalPaid = calculateTotalPaid(candidatePayments);

      if (totalPaid === 0) {
        unpaidCount++;
      } else if (candidatePayments.some(p => p.status === 'pending')) {
        pendingCount++;
      } else {
        paidCount++;
      }
    });

    return { totalCandidates, paidCount, pendingCount, unpaidCount };
  })();

  // Revenue by mode
  const revenueByMode = (() => {
    const sessionPayments = selectedSessionId
      ? payments.filter(p => {
        const candidate = candidates.find(c => c.id === p.candidate_id);
        return candidate !== undefined;
      })
      : payments;

    const completedPayments = sessionPayments.filter(p => p.status === 'completed');

    const modes = ['CPF', 'Espèces', 'Virement FSIS', 'Habilitation'] as const;
    const result: Record<string, number> = {};

    modes.forEach(mode => {
      result[mode] = completedPayments
        .filter(p => p.mode === mode)
        .reduce((sum, p) => sum + p.amount, 0);
    });

    return result;
  })();

  // Unpaid candidates
  const unpaidCandidates = candidates
    .filter(candidate => {
      const candidatePayments = paymentsByCandidate.get(candidate.id) || [];
      return calculateTotalPaid(candidatePayments) === 0;
    })
    .sort((a, b) => a.nom.localeCompare(b.nom));

  // Export functions
  const handleExportCandidates = () => {
    const data = candidates.map(c => {
      const candidatePayments = paymentsByCandidate.get(c.id) || [];
      const totalPaid = calculateTotalPaid(candidatePayments);

      return {
        'Nom': c.nom,
        'Prénom': c.prenom,
        'Date de naissance': formatDate(c.date_naissance),
        'Lieu de naissance': c.lieu_naissance,
        'Sexe': c.sexe,
        'CNAPS': c.numero_cnaps,
        'Niveau d\'études': c.niveau_etudes,
        'Situation prof.': c.situation_professionnelle,
        'Montant payé': formatCurrency(totalPaid),
      };
    });

    exportToCSV(data, `candidats-${selectedSessionId || 'tous'}.csv`);
  };

  const handleExportPayments = () => {
    const sessionPayments = selectedSessionId
      ? payments.filter(p => {
        const candidate = candidates.find(c => c.id === p.candidate_id);
        return candidate !== undefined;
      })
      : payments;

    const data = sessionPayments.map(p => {
      const candidate = candidates.find(c => c.id === p.candidate_id);
      return {
        'Candidat': candidate ? `${candidate.prenom} ${candidate.nom}` : 'N/A',
        'Date': formatDate(p.date),
        'Type': p.payment_type,
        'Montant': formatCurrency(p.amount),
        'Mode': p.mode,
        'Statut': p.status === 'completed' ? 'Complété' : 'En attente',
        'Notes': p.notes || '',
      };
    });

    exportToCSV(data, `paiements-${selectedSessionId || 'tous'}.csv`);
  };

  if (!selectedSessionId) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>
        <div className="text-center py-8 text-gray-500">
          Sélectionnez une session pour voir le tableau de bord
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Tableau de bord</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <>
          {/* Export buttons */}
          <div className="mb-6 flex gap-4">
            <button
              onClick={handleExportCandidates}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              📥 Exporter les candidats (CSV)
            </button>
            <button
              onClick={handleExportPayments}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
            >
              📥 Exporter les paiements (CSV)
            </button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Total candidats</div>
              <div className="text-3xl font-bold text-blue-600">
                {sessionStats.totalCandidates}
              </div>
            </div>

            <div className="bg-green-50 p-6 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Complètement payés</div>
              <div className="text-3xl font-bold text-green-600">
                {sessionStats.paidCount}
              </div>
            </div>

            <div className="bg-yellow-50 p-6 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Paiement partiel</div>
              <div className="text-3xl font-bold text-yellow-600">
                {sessionStats.pendingCount}
              </div>
            </div>

            <div className="bg-red-50 p-6 rounded-lg">
              <div className="text-sm text-gray-600 mb-2">Non payés</div>
              <div className="text-3xl font-bold text-red-600">
                {sessionStats.unpaidCount}
              </div>
            </div>
          </div>

          {/* Revenue by mode */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-4">Revenus par mode de paiement</h2>
              <div className="space-y-3">
                {Object.entries(revenueByMode).map(([mode, amount]) => (
                  <div key={mode} className="flex justify-between items-center">
                    <span className="text-gray-700">{mode}</span>
                    <span className="font-bold text-lg">
                      {formatCurrency(amount)}
                    </span>
                  </div>
                ))}
                <div className="border-t pt-3 flex justify-between items-center font-bold">
                  <span>Total</span>
                  <span className="text-lg text-green-600">
                    {formatCurrency(
                      Object.values(revenueByMode).reduce((a, b) => a + b, 0)
                    )}
                  </span>
                </div>
              </div>
            </div>

            {/* Session info */}
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-4">Résumé de la session</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-700">Nombre de candidats:</span>
                  <span className="font-semibold">{sessionStats.totalCandidates}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Taux de paiement:</span>
                  <span className="font-semibold">
                    {sessionStats.totalCandidates > 0
                      ? `${Math.round(
                        ((sessionStats.paidCount + sessionStats.pendingCount) /
                          sessionStats.totalCandidates) *
                        100
                      )}%`
                      : '0%'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-700">Candidats non payés:</span>
                  <span className="font-semibold text-red-600">
                    {sessionStats.unpaidCount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Unpaid candidates list */}
          {unpaidCandidates.length > 0 && (
            <div className="bg-white p-6 rounded-lg border">
              <h2 className="text-xl font-bold mb-4">
                Candidats non payés ({unpaidCandidates.length})
              </h2>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-4 py-3 text-left font-semibold">Nom</th>
                      <th className="px-4 py-3 text-left font-semibold">Prénom</th>
                      <th className="px-4 py-3 text-left font-semibold">
                        Date de naissance
                      </th>
                      <th className="px-4 py-3 text-left font-semibold">CNAPS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {unpaidCandidates.map(candidate => (
                      <tr key={candidate.id} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-3">{candidate.nom}</td>
                        <td className="px-4 py-3">{candidate.prenom}</td>
                        <td className="px-4 py-3">
                          {formatDate(candidate.date_naissance)}
                        </td>
                        <td className="px-4 py-3">{candidate.numero_cnaps}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};
