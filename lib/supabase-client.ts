// Supabase client for cloud sync and backups

import { createClient } from '@supabase/supabase-js';
import type { RenovationPlan } from '@/types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseClient: ReturnType<typeof createClient> | null = null;

export function getSupabaseClient() {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase credentials not configured. Cloud sync disabled.');
    return null;
  }

  if (!supabaseClient) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return supabaseClient;
}

export async function signIn(email: string, password: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signUp(email: string, password: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const { data, error } = await client.auth.signUp({
    email,
    password,
  });

  if (error) throw error;
  return data;
}

export async function signOut() {
  const client = getSupabaseClient();
  if (!client) return;

  await client.auth.signOut();
}

export async function getCurrentUser() {
  const client = getSupabaseClient();
  if (!client) return null;

  const { data: { user } } = await client.auth.getUser();
  return user;
}

// Project sync functions
export async function savePlanToCloud(plan: RenovationPlan) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const planData = {
    id: plan.property.mlsNumber || plan.property.address,
    user_id: user.id,
    property_data: plan.property,
    compliance_issues: plan.complianceIssues,
    tasks: plan.tasks,
    summary: plan.summary,
    generated_at: plan.generatedAt.toISOString(),
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await client
    .from('renovation_plans')
    .upsert(planData as any)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function loadPlansFromCloud() {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { data, error } = await client
    .from('renovation_plans')
    .select('*')
    .eq('user_id', user.id)
    .order('updated_at', { ascending: false });

  if (error) throw error;
  return data;
}

export async function deletePlanFromCloud(planId: string) {
  const client = getSupabaseClient();
  if (!client) throw new Error('Supabase not configured');

  const user = await getCurrentUser();
  if (!user) throw new Error('Not authenticated');

  const { error } = await client
    .from('renovation_plans')
    .delete()
    .eq('id', planId)
    .eq('user_id', user.id);

  if (error) throw error;
}

// Check if cloud sync is enabled
export function isCloudSyncEnabled(): boolean {
  return !!(supabaseUrl && supabaseAnonKey);
}

