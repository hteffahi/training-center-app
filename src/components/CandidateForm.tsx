import React, { useState, useEffect } from 'react';
import type { Candidate } from '../types';

interface CandidateFormProps {
  sessionId: string;
  candidate?: Candidate;
  onSubmit: (candidate: Omit<Candidate, 'id' | 'created_at'>) => void;
  onCancel: () => void;
}

export const CandidateForm: React.FC<CandidateFormProps> = ({
  sessionId,
  candidate,
  onSubmit,
  onCancel,
}) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    date_naissance: '',
    lieu_naissance: '',
    sexe: 'Masculin' as const,
    numero_cnaps: '',
    niveau_etudes: '',
    situation_professionnelle: '',
  });

  useEffect(() => {
    if (candidate) {
      setFormData({
        nom: candidate.nom,
        prenom: candidate.prenom,
        date_naissance: candidate.date_naissance,
        lieu_naissance: candidate.lieu_naissance,
        sexe: candidate.sexe,
        numero_cnaps: candidate.numero_cnaps,
        niveau_etudes: candidate.niveau_etudes,
        situation_professionnelle: candidate.situation_professionnelle,
      });
    }
  }, [candidate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      session_id: sessionId,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg">
      <h3 className="text-lg font-bold mb-4">
        {candidate ? 'Modifier le candidat' : 'Ajouter un candidat'}
      </h3>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nom *
          </label>
          <input
            type="text"
            name="nom"
            value={formData.nom}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Prénom *
          </label>
          <input
            type="text"
            name="prenom"
            value={formData.prenom}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Date de naissance *
          </label>
          <input
            type="date"
            name="date_naissance"
            value={formData.date_naissance}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Lieu de naissance *
          </label>
          <input
            type="text"
            name="lieu_naissance"
            value={formData.lieu_naissance}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sexe
          </label>
          <select
            name="sexe"
            value={formData.sexe}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option>Masculin</option>
            <option>Féminin</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Numéro CNAPS
          </label>
          <input
            type="text"
            name="numero_cnaps"
            value={formData.numero_cnaps}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Niveau d'études
          </label>
          <input
            type="text"
            name="niveau_etudes"
            value={formData.niveau_etudes}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Situation professionnelle
          </label>
          <input
            type="text"
            name="situation_professionnelle"
            value={formData.situation_professionnelle}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      <div className="flex gap-3 mt-6">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          {candidate ? 'Mettre à jour' : 'Ajouter'}
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
