use rusqlite::{params, Connection};
use super::model::Server;
use super::service;

pub fn add_server(conn: &Connection, server: Server) -> Result<Server, String> {
    let now = chrono::Local::now().to_rfc3339();
    let created_at = server.created_at.unwrap_or(now.clone());
    let updated_at = server.updated_at.unwrap_or(now.clone());
    let settings_json = serde_json::to_string(&server.settings).unwrap_or_else(|_| "{}".to_string());

    conn.execute(
        "INSERT INTO servers (name, hostname, ip_address, port, username, ssh_key_id, notes, settings, created_at, updated_at)
         VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, ?10)",
        params![
            server.name,
            server.hostname,
            server.ip_address,
            server.port,
            server.username,
            server.ssh_key_id,
            server.notes,
            settings_json,
            created_at,
            updated_at
        ],
    ).map_err(|e| e.to_string())?;

    service::get_server(&conn, conn.last_insert_rowid())
}

pub fn get_server(conn: &Connection, id: i64) -> Result<Server, String> {
    conn.query_row(
        "SELECT id, name, hostname, ip_address, port, username, ssh_key_id, notes, settings, created_at, updated_at
         FROM servers WHERE id = ?1",
        params![id],
        |row| {
            let settings_str: String = row.get(8)?;
            let settings = serde_json::from_str(&settings_str).unwrap_or_else(|_| serde_json::json!({}));

            Ok(Server {
                id: Some(row.get(0)?),
                name: row.get(1)?,
                hostname: row.get(2)?,
                ip_address: row.get(3)?,
                port: row.get(4)?,
                username: row.get(5)?,
                ssh_key_id: row.get(6)?,
                notes: row.get(7)?,
                settings,
                created_at: row.get(9)?,
                updated_at: row.get(10)?,
            })
        }
    ).map_err(|e| e.to_string())
}

pub fn get_servers(conn: &Connection) -> Result<Vec<Server>, String> {
    let mut stmt = conn.prepare("
        SELECT id, name, hostname, ip_address, port, username, ssh_key_id, notes, settings, created_at, updated_at
        FROM servers
    ").map_err(|e| e.to_string())?;

    let server_iter = stmt.query_map([], |row| {
        let settings_str: String = row.get(8)?;
        let settings = serde_json::from_str(&settings_str).unwrap_or_else(|_| serde_json::json!({}));

        Ok(Server {
            id: Some(row.get(0)?),
            name: row.get(1)?,
            hostname: row.get(2)?,
            ip_address: row.get(3)?,
            port: row.get(4)?,
            username: row.get(5)?,
            ssh_key_id: row.get(6)?,
            notes: row.get(7)?,
            settings,
            created_at: row.get(9)?,
            updated_at: row.get(10)?,
        })
    }).map_err(|e| e.to_string())?;

    let mut servers = Vec::new();
    for server in server_iter {
        servers.push(server.map_err(|e| e.to_string())?);
    }

    Ok(servers)
}

pub fn update_server(conn: &Connection, server: Server) -> Result<(), String> {
    let id = server.id.ok_or("Server ID is required for update")?;

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

pub fn delete_server(conn: &Connection, id: i64) -> Result<(), String> {
    conn.execute(
        "DELETE FROM servers WHERE id = ?1",
        params![id],
    ).map_err(|e| e.to_string())?;

    Ok(())
}

pub fn update_settings(conn: &Connection, id: i64, settings: serde_json::Value) -> Result<(), String> {
    let now = chrono::Local::now().to_rfc3339();
    let settings_json = serde_json::to_string(&settings).unwrap_or_else(|_| "{}".to_string());

    conn.execute(
        "UPDATE servers SET
         settings = ?1,
         updated_at = ?2
         WHERE id = ?3",
        params![
            settings_json,
            now,
            id
        ],
    ).map_err(|e| e.to_string())?;

    Ok(())
}
