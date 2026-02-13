import React, { useEffect, useState } from 'react';
import { PaymentForm } from '../components/PaymentForm';
import * as api from '../lib/supabase';
import type { Candidate, Payment } from '../types';
import { calculateTotalPaid, calculateTotalPending, formatDate, formatCurrency } from '../lib/utils';

interface PaymentsPageProps {
  selectedSessionId: string | null;
}

export const PaymentsPage: React.FC<PaymentsPageProps> = ({ selectedSessionId }) => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [payments, setPayments] = useState<Map<string, Payment[]>>(new Map());
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (selectedSessionId) {
      loadData();
    }
  }, [selectedSessionId]);

  const loadData = async () => {
    try {
      setLoading(true);
      const candidatesData = await api.fetchCandidates(selectedSessionId || undefined);
      setCandidates(candidatesData);

      const paymentsData = await api.fetchPayments();
      const paymentsByCandidate = new Map<string, Payment[]>();
      candidatesData.forEach(c => {
        paymentsByCandidate.set(c.id, []);
      });
      paymentsData.forEach(p => {
        const current = paymentsByCandidate.get(p.candidate_id) || [];
        paymentsByCandidate.set(p.candidate_id, [...current, p]);
      });
      setPayments(paymentsByCandidate);
    } catch (err) {
      setError('Erreur lors du chargement des données');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddPayment = async (data: {
    candidate_id: string;
    amount: number;
    payment_type: 'acompte' | 'solde';
    mode: 'CPF' | 'Espèces' | 'Virement FSIS' | 'Habilitation';
    date: string;
    status: 'pending' | 'completed';
    notes: string;
  }) => {
    try {
      const newPayment = await api.createPayment(data);
      setPayments(prev => {
        const updated = new Map(prev);
        const candidatePayments = updated.get(data.candidate_id) || [];
        updated.set(data.candidate_id, [newPayment, ...candidatePayments]);
        return updated;
      });
      setShowForm(false);
    } catch (err) {
      setError('Erreur lors de l\'ajout du paiement');
      console.error(err);
    }
  };

  const handleDeletePayment = async (paymentId: string) => {
    if (!selectedCandidate) return;
    try {
      await api.deletePayment(paymentId);
      setPayments(prev => {
        const updated = new Map(prev);
        const candidatePayments = updated.get(selectedCandidate.id) || [];
        updated.set(
          selectedCandidate.id,
          candidatePayments.filter(p => p.id !== paymentId)
        );
        return updated;
      });
    } catch (err) {
      setError('Erreur lors de la suppression du paiement');
      console.error(err);
    }
  };

  if (!selectedSessionId) {
    return (
      <div className="p-6">
        <h1 className="text-3xl font-bold mb-6">Suivi des paiements</h1>
        <div className="text-center py-8 text-gray-500">
          Sélectionnez une session pour voir les paiements
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-6">Suivi des paiements</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-center py-8">Chargement...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Candidates list */}
          <div className="lg:col-span-1">
            <h2 className="text-xl font-bold mb-4">Candidats</h2>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {candidates.map(candidate => {
                const candidatePayments = payments.get(candidate.id) || [];
                const totalPaid = calculateTotalPaid(candidatePayments);

                return (
                  <button
                    key={candidate.id}
                    onClick={() => {
                      setSelectedCandidate(candidate);
                      setShowForm(false);
                    }}
                    className={`w-full text-left p-3 rounded-lg transition ${
                      selectedCandidate?.id === candidate.id
                        ? 'bg-blue-500 text-white'
                        : 'bg-gray-100 hover:bg-gray-200'
                    }`}
                  >
                    <div className="font-semibold">
                      {candidate.prenom} {candidate.nom}
                    </div>
                    <div className="text-xs opacity-75">
                      Payé: {formatCurrency(totalPaid)}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Payment details */}
          <div className="lg:col-span-2">
            {selectedCandidate ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">
                    {selectedCandidate.prenom} {selectedCandidate.nom}
                  </h2>
                  <button
                    onClick={() => setShowForm(!showForm)}
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition"
                  >
                    {showForm ? '- Annuler' : '+ Ajouter paiement'}
                  </button>
                </div>

                {showForm && (
                  <div className="mb-8">
                    <PaymentForm
                      candidate={selectedCandidate}
                      onSubmit={handleAddPayment}
                      onCancel={() => setShowForm(false)}
                    />
                  </div>
                )}

                {/* Payment stats */}
                {(() => {
                  const candidatePayments = payments.get(selectedCandidate.id) || [];
                  const totalPaid = calculateTotalPaid(candidatePayments);
                  const totalPending = calculateTotalPending(candidatePayments);

                  return (
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-green-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Montant payé</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(totalPaid)}
                        </div>
                      </div>
                      <div className="bg-yellow-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">En attente</div>
                        <div className="text-2xl font-bold text-yellow-600">
                          {formatCurrency(totalPending)}
                        </div>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <div className="text-sm text-gray-600">Total</div>
                        <div className="text-2xl font-bold text-blue-600">
                          {formatCurrency(totalPaid + totalPending)}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Payments table */}
                {(() => {
                  const candidatePayments = payments.get(selectedCandidate.id) || [];

                  if (candidatePayments.length === 0) {
                    return (
                      <div className="text-center py-8 text-gray-500">
                        Aucun paiement enregistré
                      </div>
                    );
                  }

                  return (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-100 border-b">
                          <tr>
                            <th className="px-4 py-3 text-left font-semibold">Date</th>
                            <th className="px-4 py-3 text-left font-semibold">Type</th>
                            <th className="px-4 py-3 text-left font-semibold">Montant</th>
                            <th className="px-4 py-3 text-left font-semibold">Mode</th>
                            <th className="px-4 py-3 text-left font-semibold">Statut</th>
                            <th className="px-4 py-3 text-left font-semibold">Notes</th>
                            <th className="px-4 py-3 text-center font-semibold">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {candidatePayments.map(payment => (
                            <tr key={payment.id} className="border-b hover:bg-gray-50">
                              <td className="px-4 py-3">{formatDate(payment.date)}</td>
                              <td className="px-4 py-3">
                                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                                  {payment.payment_type}
                                </span>
                              </td>
                              <td className="px-4 py-3 font-semibold">
                                {formatCurrency(payment.amount)}
                              </td>
                              <td className="px-4 py-3">{payment.mode}</td>
                              <td className="px-4 py-3">
                                <span
                                  className={`px-2 py-1 text-xs rounded ${
                                    payment.status === 'completed'
                                      ? 'bg-green-100 text-green-800'
                                      : 'bg-yellow-100 text-yellow-800'
                                  }`}
                                >
                                  {payment.status === 'completed' ? 'Complété' : 'En attente'}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-xs">{payment.notes}</td>
                              <td className="px-4 py-3 flex justify-center">
                                <button
                                  onClick={() => {
                                    if (
                                      confirm(
                                        'Êtes-vous sûr de vouloir supprimer ce paiement ?'
                                      )
                                    ) {
                                      handleDeletePayment(payment.id);
                                    }
                                  }}
                                  className="px-3 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600 transition"
                                >
                                  Supprimer
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  );
                })()}
              </>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Sélectionnez un candidat pour voir ses paiements
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
