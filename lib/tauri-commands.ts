// Tauri command wrappers for frontend

import { invoke } from '@tauri-apps/api/core';

export interface NWMLSCredentials {
  username: string;
  password: string;
}

// Check if running in Tauri
export function isTauri(): boolean {
  return typeof window !== 'undefined' && '__TAURI__' in window;
}

// Credential management
export async function saveCredentials(username: string, password: string): Promise<void> {
  if (!isTauri()) {
    throw new Error('Tauri commands only available in desktop app');
  }
  return invoke('save_credentials', { username, password });
}

export async function getCredentials(): Promise<NWMLSCredentials | null> {
  if (!isTauri()) {
    // In web mode, return null (use mock data)
    return null;
  }
  return invoke('get_credentials');
}

export async function clearCredentials(): Promise<void> {
  if (!isTauri()) {
    return;
  }
  return invoke('clear_credentials');
}

// File operations
export async function savePDFToFile(pdfBytes: Uint8Array, filename: string): Promise<string> {
  if (!isTauri()) {
    throw new Error('Tauri commands only available in desktop app');
  }
  // Convert Uint8Array to Vec<u8> for Rust
  const data = Array.from(pdfBytes);
  return invoke('save_pdf', { data, filename });
}

