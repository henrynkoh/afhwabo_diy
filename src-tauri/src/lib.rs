// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use tauri::{Manager, State};
use serde::{Deserialize, Serialize};
use std::sync::Mutex;

#[derive(Debug, Clone, Serialize, Deserialize)]
struct NWMLSCredentials {
    username: String,
    password: String,
}

struct CredentialStore {
    credentials: Mutex<Option<NWMLSCredentials>>,
}

// Secure credential storage using keyring
#[tauri::command]
async fn save_credentials(
    username: String,
    password: String,
    state: State<'_, CredentialStore>,
) -> Result<(), String> {
    // Use keyring for secure storage
    let entry = keyring::Entry::new("afh-renovator-pro", "nwmls-credentials")
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;
    
    let credentials_json = serde_json::to_string(&NWMLSCredentials { 
        username: username.clone(), 
        password: password.clone() 
    })
        .map_err(|e| format!("Failed to serialize credentials: {}", e))?;
    
    entry
        .set_password(&credentials_json)
        .map_err(|e| format!("Failed to save credentials: {}", e))?;
    
    // Also store in memory for current session
    *state.credentials.lock().unwrap() = Some(NWMLSCredentials {
        username,
        password,
    });
    
    Ok(())
}

#[tauri::command]
async fn get_credentials(state: State<'_, CredentialStore>) -> Result<Option<NWMLSCredentials>, String> {
    // Try keyring first
    let entry = keyring::Entry::new("afh-renovator-pro", "nwmls-credentials")
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;
    
    match entry.get_password() {
        Ok(password_json) => {
            let creds: NWMLSCredentials = serde_json::from_str(&password_json)
                .map_err(|e| format!("Failed to deserialize credentials: {}", e))?;
            Ok(Some(creds))
        }
        Err(_) => {
            // Fallback to in-memory store
            Ok(state.credentials.lock().unwrap().clone())
        }
    }
}

#[tauri::command]
async fn clear_credentials(state: State<'_, CredentialStore>) -> Result<(), String> {
    let entry = keyring::Entry::new("afh-renovator-pro", "nwmls-credentials")
        .map_err(|e| format!("Failed to create keyring entry: {}", e))?;
    
    // Try to delete, but don't fail if it doesn't exist
    let _ = entry.delete_password();
    
    *state.credentials.lock().unwrap() = None;
    Ok(())
}

// File operations for PDF export
#[tauri::command]
async fn save_pdf(data: Vec<u8>, filename: String) -> Result<String, String> {
    use std::fs;
    use std::path::PathBuf;
    
    // Get user's Documents folder
    let documents_dir = dirs::document_dir()
        .ok_or("Could not find Documents directory")?;
    
    let projects_dir = documents_dir.join("AFH_Projects");
    let file_path = projects_dir.join(&filename);
    
    // Create directory if it doesn't exist
    fs::create_dir_all(&projects_dir)
        .map_err(|e| format!("Failed to create directory: {}", e))?;
    
    fs::write(&file_path, data)
        .map_err(|e| format!("Failed to write file: {}", e))?;
    
    Ok(file_path.to_string_lossy().to_string())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_store::Builder::default().build())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_shell::init())
        .setup(|app| {
            // Initialize credential store
            app.manage(CredentialStore {
                credentials: Mutex::new(None),
            });
            
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            save_credentials,
            get_credentials,
            clear_credentials,
            save_pdf
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
