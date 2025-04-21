use crate::database::connection::get;
use crate::models::SshKey;
use rusqlite::{params};
use std::fs;
use tauri::AppHandle;
use crate::controllers::hasher;

#[tauri::command]
pub fn init_ssh_keys(app_handle: AppHandle) -> Result<Vec<SshKey>, String> {
    // Get the user's home directory
    let home_dir = dirs::home_dir().ok_or("Could not get home directory")?;
    let ssh_dir = home_dir.join(".ssh");

    // Check if .ssh directory exists
    if !ssh_dir.exists() {
        return Ok(Vec::new()); // Return empty vector if no .ssh directory
    }

    // Get database connection
    let conn = get(&app_handle)?;

    // Read directory and filter for private key files
    let entries = fs::read_dir(&ssh_dir).map_err(|e| format!("Failed to read .ssh directory: {}", e))?;

    let mut added_keys = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        let path = entry.path();

        if path.is_dir() || !path.to_string_lossy().ends_with(".pub") {
            continue;
        }

        // Get the filename as the key name
        let key_name = path.file_name()
            .and_then(|name| name.to_str())
            .ok_or_else(|| format!("Invalid filename: {:?}", path))?
            .to_string();

        let path_str = path.to_string_lossy().to_string();

        // Check if this key already exists in the database
        let mut stmt = conn.prepare("SELECT COUNT(*) FROM ssh_keys WHERE path = ?1")
            .map_err(|e| e.to_string())?;

        let count: i64 = stmt.query_row(&[&path_str], |row| row.get(0))
            .map_err(|e| e.to_string())?;

        // Skip if already in database
        if count > 0 {
            continue;
        }

        // Use current time for timestamps
        let now = chrono::Local::now().to_rfc3339();

        // Insert into database - not setting as default
        conn.execute(
            "INSERT INTO ssh_keys (name, path, is_default, created_at, updated_at)
             VALUES (?1, ?2, 0, ?3, ?4)",
            &[&key_name, &path_str, &now, &now],
        ).map_err(|e| e.to_string())?;

        // Get the inserted key's ID
        let id = conn.last_insert_rowid();

        // Add to return list
        added_keys.push(SshKey {
            id: Some(id),
            name: key_name,
            path: path_str,
            password: None,
            is_default: false,
            created_at: now.clone(),
            updated_at: now,
        });
    }

    Ok(added_keys)
}

#[tauri::command]
pub fn add_ssh_key(app_handle: AppHandle, name: String, path: String, password: String, is_default: bool) -> Result<i64, String> {
    let conn = get(&app_handle)?;

    // Use current time for timestamps
    let now = chrono::Local::now().to_rfc3339();

    // If this key is default, unset any existing default
    if is_default {
        conn.execute(
            "UPDATE ssh_keys SET is_default = 0 WHERE is_default = 1",
            [],
        ).map_err(|e| e.to_string())?;
    }

    let password_hash = if password.trim().is_empty() {
        None
    } else {
        Some(hasher::hash_password(&password).map_err(|e| e.to_string())?)
    };

    conn.execute(
        "INSERT INTO ssh_keys (name, path, password, is_default, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6)",
        params![name, path, password_hash, is_default, now, now],
    ).map_err(|e| e.to_string())?;

    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn get_ssh_key(app_handle: AppHandle, id: i64) -> Result<SshKey, String> {
    let conn = get(&app_handle)?;

    conn.query_row(
        "SELECT id, name, path, is_default, created_at, updated_at
         FROM ssh_keys WHERE id = ?1",
        params![id],
        |row| Ok(SshKey {
            id: Some(row.get(0)?),
            name: row.get(1)?,
            path: row.get(2)?,
            password: None,
            is_default: row.get(3)?,
            created_at: row.get(4)?,
            updated_at: row.get(5)?,
        })
    ).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_ssh_keys(app_handle: AppHandle) -> Result<Vec<SshKey>, String> {
    let conn = get(&app_handle)?;

    let mut stmt = conn.prepare("
        SELECT id, name, path, is_default, created_at, updated_at
        FROM ssh_keys
    ").map_err(|e| e.to_string())?;

    let key_iter = stmt.query_map([], |row| {
        Ok(SshKey {
            id: Some(row.get(0)?),
            name: row.get(1)?,
            path: row.get(2)?,
            password: None,
            is_default: row.get(3)?,
            created_at: row.get(4)?,
            updated_at: row.get(5)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut keys = Vec::new();
    for key in key_iter {
        keys.push(key.map_err(|e| e.to_string())?);
    }

    Ok(keys)
}

#[tauri::command]
pub fn set_default_ssh_key(app_handle: AppHandle, id: i64) -> Result<(), String> {
    let conn = get(&app_handle)?;

    // First, unset any existing default
    conn.execute(
        "UPDATE ssh_keys SET is_default = 0 WHERE is_default = 1",
        [],
    ).map_err(|e| e.to_string())?;

    // Then set the new default
    conn.execute(
        "UPDATE ssh_keys SET is_default = 1 WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn delete_ssh_key(app_handle: AppHandle, id: i64, delete_file: bool) -> Result<(), String> {
    let conn = get(&app_handle)?;

    // Get the file path before deleting the record
    let path = if delete_file {
        Some(conn.query_row(
            "SELECT path FROM ssh_keys WHERE id = ?1",
            params![id],
            |row| row.get::<_, String>(0)
        ).map_err(|e| e.to_string())?)
    } else {
        None
    };

    // Delete the record
    conn.execute(
        "DELETE FROM ssh_keys WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    // Delete the file if requested
    if let Some(file_path) = path {
        if delete_file {
            if let Err(e) = fs::remove_file(&file_path) {
                return Err(format!("Failed to delete key file: {}", e));
            }
            // Try to remove the private file as well
            let private_path = file_path.strip_suffix(".pub").unwrap_or(&file_path).to_string();
            let _ = fs::remove_file(private_path); // It's okay if this fails
        }
    }

    Ok(())
}

#[tauri::command]
pub fn generate_ssh_key(app_handle: AppHandle, name: String, password: String) -> Result<String, String> {
    // Get the user's home directory
    let home_dir = dirs::home_dir().ok_or("Could not get home directory")?;
    let ssh_dir = home_dir.join(".ssh");

    // Create .ssh directory if it doesn't exist
    if !ssh_dir.exists() {
        fs::create_dir_all(&ssh_dir).map_err(|e| e.to_string())?;
        // Set appropriate permissions (unix only)
        #[cfg(unix)]
        {
            use std::os::unix::fs::PermissionsExt;
            let permissions = fs::Permissions::from_mode(0o700);
            fs::set_permissions(&ssh_dir, permissions).map_err(|e| e.to_string())?;
        }
    }

    let key_path = ssh_dir.join(format!("{}", name));
    let key_path_str = key_path.to_str().ok_or("Invalid path")?.to_string();
    let public_key_name = format!("{}.pub", name.clone());
    let public_key_path = format!("{}.pub", key_path_str.clone());

    // Generate key using ssh-keygen via Command
    use std::process::Command;

    let mut cmd = Command::new("ssh-keygen");
    cmd.arg("-t")
        .arg("ed25519")
        .arg("-f")
        .arg(&key_path);

    // Check if password is None OR is Some but empty string
    if password.is_empty() {
        cmd.arg("-N").arg("");
    } else {
        cmd.arg("-N").arg(password.clone());
    }

    let output = cmd.output()
        .map_err(|e| format!("Failed to execute ssh-keygen: {}", e))?;

    if !output.status.success() {
        return Err(format!("ssh-keygen failed: {}", String::from_utf8_lossy(&output.stderr)));
    }

    // Add to database
    add_ssh_key(app_handle, public_key_name, public_key_path, password, false)?;

    Ok(key_path_str)
}