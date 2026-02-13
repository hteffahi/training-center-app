import React from 'react';
import type { Candidate } from '../types';
import { formatDate } from '../lib/utils';

interface CandidateListProps {
  candidates: Candidate[];
  onEdit: (candidate: Candidate) => void;
  onDelete: (id: string) => void;
}

export const CandidateList: React.FC<CandidateListProps> = ({
  candidates,
  onEdit,
  onDelete,
}) => {
  if (candidates.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Aucun candidat dans cette session
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-gray-100 border-b">
          <tr>
            <th className="px-4 py-3 text-left font-semibold">Nom</th>
            <th className="px-4 py-3 text-left font-semibold">Prénom</th>
            <th className="px-4 py-3 text-left font-semibold">Date de naissance</th>
            <th className="px-4 py-3 text-left font-semibold">Lieu</th>
            <th className="px-4 py-3 text-left font-semibold">CNAPS</th>
            <th className="px-4 py-3 text-left font-semibold">Niveau d'études</th>
            <th className="px-4 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {candidates.map((candidate) => (
            <tr key={candidate.id} className="border-b hover:bg-gray-50">
              <td className="px-4 py-3">{candidate.nom}</td>
              <td className="px-4 py-3">{candidate.prenom}</td>
              <td className="px-4 py-3">{formatDate(candidate.date_naissance)}</td>
              <td className="px-4 py-3">{candidate.lieu_naissance}</td>
              <td className="px-4 py-3">{candidate.numero_cnaps}</td>
              <td className="px-4 py-3">{candidate.niveau_etudes}</td>
              <td className="px-4 py-3 flex gap-2 justify-center">
                <button
                  onClick={() => onEdit(candidate)}
                  className="px-3 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600 transition"
                >
                  Modifier
                </button>
                <button
                  onClick={() => {
                    if (confirm('Êtes-vous sûr de vouloir supprimer ce candidat ?')) {
                      onDelete(candidate.id);
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
};
