use rusqlite::{params, Connection};
use std::fs;
use crate::common;
use super::model::SshKey;
use common::{hasher};

pub fn init_ssh_keys(conn: &Connection) -> Result<Vec<SshKey>, String> {
    let home_dir = dirs::home_dir().ok_or("Could not get home directory")?;
    let ssh_dir = home_dir.join(".ssh");

    if !ssh_dir.exists() {
        return Ok(Vec::new());
    }

    let entries = fs::read_dir(&ssh_dir).map_err(|e| format!("Failed to read .ssh directory: {}", e))?;

    let mut added_keys = Vec::new();

    for entry in entries {
        let entry = entry.map_err(|e| format!("Failed to read directory entry: {}", e))?;
        let path = entry.path();

        if path.is_dir() || !path.to_string_lossy().ends_with(".pub") {
            continue;
        }

        let key_name = path.file_name()
            .and_then(|name| name.to_str())
            .ok_or_else(|| format!("Invalid filename: {:?}", path))?
            .to_string();

        let path_str = path.to_string_lossy().to_string();

        let mut stmt = conn.prepare("SELECT COUNT(*) FROM ssh_keys WHERE path = ?1")
            .map_err(|e| e.to_string())?;

        let count: i64 = stmt.query_row(&[&path_str], |row| row.get(0))
            .map_err(|e| e.to_string())?;

        if count > 0 {
            continue;
        }

        let now = chrono::Local::now().to_rfc3339();

        conn.execute(
            "INSERT INTO ssh_keys (name, path, is_default, created_at, updated_at)
             VALUES (?1, ?2, 0, ?3, ?4)",
            &[&key_name, &path_str, &now, &now],
        ).map_err(|e| e.to_string())?;

        let id = conn.last_insert_rowid();

        added_keys.push(SshKey {
            id: Some(id),
            name: key_name,
            path: path_str,
            password: None,
            is_default: false,
            created_at: Option::from(now.clone()),
            updated_at: Option::from(now),
        });
    }

    Ok(added_keys)
}

pub fn add_ssh_key(conn: &Connection, name: String, path: String, password: String, is_default: bool) -> Result<SshKey, String> {
    let now = chrono::Local::now().to_rfc3339();
    
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
    
    get_ssh_key(&conn, conn.last_insert_rowid())
}

pub fn get_ssh_key(conn: &Connection, id: i64) -> Result<SshKey, String> {
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

pub fn get_ssh_keys(conn: &Connection) -> Result<Vec<SshKey>, String> {
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

pub fn set_default_ssh_key(conn: &Connection, id: i64) -> Result<(), String> {
    conn.execute(
        "UPDATE ssh_keys SET is_default = 0 WHERE is_default = 1",
        [],
    ).map_err(|e| e.to_string())?;

    conn.execute(
        "UPDATE ssh_keys SET is_default = 1 WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn delete_ssh_key(conn: &Connection, id: i64, delete_file: bool) -> Result<(), String> {
    let path = if delete_file {
        Some(conn.query_row(
            "SELECT path FROM ssh_keys WHERE id = ?1",
            params![id],
            |row| row.get::<_, String>(0)
        ).map_err(|e| e.to_string())?)
    } else {
        None
    };

    conn.execute(
        "DELETE FROM ssh_keys WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

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

pub fn generate_ssh_key(conn: &Connection, name: String, password: String, is_default: bool) -> Result<SshKey, String> {
    let home_dir = dirs::home_dir().ok_or("Could not get home directory")?;
    let ssh_dir = home_dir.join(".ssh");

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

    let key_path = ssh_dir.join(format!("{}", name.clone()));
    let key_path_str = key_path.to_str().ok_or("Invalid path")?.to_string();
    let public_key_name = format!("{}.pub", name.clone());
    let public_key_path = format!("{}.pub", key_path_str.clone());

    use std::process::Command;

    let mut cmd = Command::new("ssh-keygen");
    cmd.arg("-t")
        .arg("ed25519")
        .arg("-f")
        .arg(&key_path);

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
    
    add_ssh_key(&conn, public_key_name, public_key_path, password, is_default)
}