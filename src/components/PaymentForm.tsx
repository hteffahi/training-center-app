import React, { useState } from 'react';
import type { Candidate } from '../types';

interface PaymentFormProps {
  candidate: Candidate;
  onSubmit: (data: {
    candidate_id: string;
    amount: number;
    payment_type: 'acompte' | 'solde';
    mode: 'CPF' | 'Espèces' | 'Virement FSIS' | 'Habilitation';
    date: string;
    status: 'pending' | 'completed';
    notes: string;
  }) => void;
  onCancel: () => void;
}

export const PaymentForm: React.FC<PaymentFormProps> = ({
  candidate,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    amount: '',
    payment_type: 'acompte' as const,
    mode: 'CPF' as const,
    date: new Date().toISOString().split('T')[0],
    status: 'completed' as const,
    notes: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      candidate_id: candidate.id,
      amount: parseFloat(formData.amount),
      payment_type: formData.payment_type,
      mode: formData.mode,
      date: formData.date,
      status: formData.status,
      notes: formData.notes,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-4">
        Ajouter un paiement - {candidate.prenom} {candidate.nom}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Montant (EUR) *
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleChange}
            step="0.01"
            min="0"
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Type de paiement
          </label>
          <select
            name="payment_type"
            value={formData.payment_type}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="acompte">Acompte</option>
            <option value="solde">Solde</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mode de paiement
          </label>
          <select
            name="mode"
            value={formData.mode}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="CPF">CPF</option>
            <option value="Espèces">Espèces</option>
            <option value="Virement FSIS">Virement FSIS</option>
            <option value="Habilitation">Habilitation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Statut
          </label>
          <select
            name="status"
            value={formData.status}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="completed">Complété</option>
            <option value="pending">En attente</option>
          </select>
        </div>

        <div className="col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Notes
          </label>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          Ajouter paiement
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition"
        >
          Annuler
        </button>
      </div>
    </form>
  );
};
