export interface Session {
  id: string;
  name: string;
  date: string;
  created_at: string;
}

export interface Candidate {
  id: string;
  session_id: string;
  nom: string;
  prenom: string;
  date_naissance: string;
  lieu_naissance: string;
  sexe: 'Masculin' | 'Féminin';
  numero_cnaps: string;
  niveau_etudes: string;
  situation_professionnelle: string;
  created_at: string;
}

export interface Payment {
  id: string;
  candidate_id: string;
  amount: number;
  payment_type: 'acompte' | 'solde';
  mode: 'CPF' | 'Espèces' | 'Virement FSIS' | 'Habilitation';
  date: string;
  status: 'pending' | 'completed';
  notes: string | null;
  created_at: string;
}

export interface CandidateWithPayments extends Candidate {
  payments?: Payment[];
  totalPaid?: number;
  pendingAmount?: number;
}
