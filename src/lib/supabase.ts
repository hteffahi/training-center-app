import { createClient } from '@supabase/supabase-js';
import type { Session, Candidate, Payment } from '../types';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Sessions
export const fetchSessions = async () => {
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return data as Session[];
};

export const createSession = async (session: Omit<Session, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('sessions')
    .insert([session])
    .select();
  if (error) throw error;
  return data[0] as Session;
};

// Candidates
export const fetchCandidates = async (sessionId?: string) => {
  let query = supabase.from('candidates').select('*');
  if (sessionId) {
    query = query.eq('session_id', sessionId);
  }
  const { data, error } = await query.order('created_at', { ascending: false });
  if (error) throw error;
  return data as Candidate[];
};

export const createCandidate = async (candidate: Omit<Candidate, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('candidates')
    .insert([candidate])
    .select();
  if (error) throw error;
  return data[0] as Candidate;
};

export const updateCandidate = async (id: string, updates: Partial<Candidate>) => {
  const { data, error } = await supabase
    .from('candidates')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0] as Candidate;
};

export const deleteCandidate = async (id: string) => {
  const { error } = await supabase
    .from('candidates')
    .delete()
    .eq('id', id);
  if (error) throw error;
};

// Payments
export const fetchPayments = async (candidateId?: string) => {
  let query = supabase.from('payments').select('*');
  if (candidateId) {
    query = query.eq('candidate_id', candidateId);
  }
  const { data, error } = await query.order('date', { ascending: false });
  if (error) throw error;
  return data as Payment[];
};

export const createPayment = async (payment: Omit<Payment, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('payments')
    .insert([payment])
    .select();
  if (error) throw error;
  return data[0] as Payment;
};

export const updatePayment = async (id: string, updates: Partial<Payment>) => {
  const { data, error } = await supabase
    .from('payments')
    .update(updates)
    .eq('id', id)
    .select();
  if (error) throw error;
  return data[0] as Payment;
};

export const deletePayment = async (id: string) => {
  const { error } = await supabase
    .from('payments')
    .delete()
    .eq('id', id);
  if (error) throw error;
};
