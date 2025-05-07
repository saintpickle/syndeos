use std::fs;
use rusqlite::params;
use tauri::{AppHandle, Manager};
use crate::database::connection::get;
use crate::models::Setting;

#[tauri::command]
pub fn init_default_settings(app_handle: AppHandle) -> Result<(), String> {
    let conn = get(&app_handle)?;

    // Check if settings table is empty
    let mut stmt = conn.prepare("SELECT COUNT(*) FROM settings")
        .map_err(|e| e.to_string())?;
    let count: i64 = stmt.query_row([], |row| row.get(0))
        .map_err(|e| e.to_string())?;

    if count == 0 {
        // Insert default settings
        conn.execute(
            "INSERT INTO settings (key, value) VALUES (?1, ?2)",
            params!["theme", "system"],
        ).map_err(|e| e.to_string())?;

        conn.execute(
            "INSERT INTO settings (key, value) VALUES (?1, ?2)",
            params!["ssh_timeout", "30"],
        ).map_err(|e| e.to_string())?;

        conn.execute(
            "INSERT INTO settings (key, value) VALUES (?1, ?2)",
            params!["default_port", "22"],
        ).map_err(|e| e.to_string())?;
    }

    Ok(())
}

#[tauri::command]
pub fn get_setting(app_handle: AppHandle, key: String) -> Result<String, String> {
    let conn = get(&app_handle)?;

    conn.query_row(
        "SELECT value FROM settings WHERE key = ?1",
        params![key],
        |row| row.get(0)
    ).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_settings(app_handle: AppHandle) -> Result<Vec<Setting>, String> {
    let conn = get(&app_handle)?;

    let mut stmt = conn.prepare("SELECT id, key, value FROM settings")
        .map_err(|e| e.to_string())?;

    let settings_iter = stmt.query_map([], |row| {
        Ok(Setting {
            id: Some(row.get(0)?),
            key: row.get(1)?,
            value: row.get(2)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut settings = Vec::new();
    for setting in settings_iter {
        settings.push(setting.map_err(|e| e.to_string())?);
    }

    Ok(settings)
}

#[tauri::command]
pub fn update_setting(app_handle: AppHandle, key: String, value: String) -> Result<(), String> {
    let conn = get(&app_handle)?;

    conn.execute(
        "INSERT OR REPLACE INTO settings (key, value) VALUES (?1, ?2)",
        params![key, value],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn reset_app(app_handle: AppHandle) -> Result<(), String> {
    let app_dir = app_handle.path().app_data_dir().map_err(|e| e.to_string())?;
    let db_path = app_dir.join("syndeos.db");

    // Check if the file exists
    if db_path.exists() {
        // Delete the database file
        fs::remove_file(&db_path).map_err(|e| format!("Failed to delete database: {}", e))?;
    }

    // Schedule a restart of the application after a short delay
    // This gives the frontend time to receive the response
    std::thread::spawn(move || {
        std::thread::sleep(std::time::Duration::from_millis(500));
        app_handle.restart();
    });

    Ok(())
}