use tauri::AppHandle;
use rusqlite::params;
use crate::database::connection::get;
use crate::models::Server;

#[tauri::command]
pub fn add_server(app_handle: AppHandle, server: Server) -> Result<i64, String> {
    let conn = get(&app_handle)?;

    let now = chrono::Local::now().to_rfc3339();
    let created_at = server.created_at.unwrap_or(now.clone());
    let updated_at = server.updated_at.unwrap_or(now.clone());

    conn.execute(
        "INSERT INTO servers (name, hostname, ip_address, port, username, ssh_key_id, notes, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9)",
        params![
            server.name,
            server.hostname,
            server.ip_address,
            server.port,
            server.username,
            server.ssh_key_id,
            server.notes,
            created_at,
            updated_at
        ],
    ).map_err(|e| e.to_string())?;

    Ok(conn.last_insert_rowid())
}

#[tauri::command]
pub fn get_server(app_handle: AppHandle, id: i64) -> Result<Server, String> {
    let conn = get(&app_handle)?;

    conn.query_row(
        "SELECT id, name, hostname, ip_address, port, username, ssh_key_id, notes, created_at, updated_at
         FROM servers WHERE id = ?1",
        params![id],
        |row| Ok(Server {
            id: Some(row.get(0)?),
            name: row.get(1)?,
            hostname: row.get(2)?,
            ip_address: row.get(3)?,
            port: row.get(4)?,
            username: row.get(5)?,
            ssh_key_id: row.get(6)?,
            notes: row.get(7)?,
            created_at: row.get(8)?,
            updated_at: row.get(9)?,
        })
    ).map_err(|e| e.to_string())
}

#[tauri::command]
pub fn get_servers(app_handle: AppHandle) -> Result<Vec<Server>, String> {
    let conn = get(&app_handle)?;

    let mut stmt = conn.prepare("
        SELECT id, name, hostname, ip_address, port, username, ssh_key_id, notes, created_at, updated_at
        FROM servers
    ").map_err(|e| e.to_string())?;

    let server_iter = stmt.query_map([], |row| {
        Ok(Server {
            id: Some(row.get(0)?),
            name: row.get(1)?,
            hostname: row.get(2)?,
            ip_address: row.get(3)?,
            port: row.get(4)?,
            username: row.get(5)?,
            ssh_key_id: row.get(6)?,
            notes: row.get(7)?,
            created_at: row.get(8)?,
            updated_at: row.get(9)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut servers = Vec::new();
    for server in server_iter {
        servers.push(server.map_err(|e| e.to_string())?);
    }

    Ok(servers)
}

#[tauri::command]
pub fn update_server(app_handle: AppHandle, server: Server) -> Result<(), String> {
    let conn = get(&app_handle)?;
    let id = server.id.ok_or("Server ID is required for update")?;

    // Use current time for updated_at timestamp
    let now = chrono::Local::now().to_rfc3339();
    let updated_at = server.updated_at.unwrap_or(now.clone());

    conn.execute(
        "UPDATE servers SET
         name = ?1,
         hostname = ?2,
         ip_address = ?3,
         port = ?4,
         username = ?5,
         ssh_key_id = ?6,
         notes = ?7,
         updated_at = ?8
         WHERE id = ?9",
        params![
            server.name,
            server.hostname,
            server.ip_address,
            server.port,
            server.username,
            server.ssh_key_id,
            server.notes,
            updated_at,
            id
        ],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
pub fn delete_server(app_handle: AppHandle, id: i64) -> Result<(), String> {
    let conn = get(&app_handle)?;

    conn.execute(
        "DELETE FROM servers WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}