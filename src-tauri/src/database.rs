pub mod connection {
    use rusqlite::{Connection};
    use std::fs;
    use std::path::PathBuf;
    use tauri::{AppHandle, Manager};

    // Helper function to get app data directory
    fn get_app_data_dir(app_handle: &AppHandle) -> Result<PathBuf, String> {
        app_handle.path().app_data_dir().map_err(|e| e.to_string())
    }

    // Modified to take AppHandle as parameter
    pub fn init_database(app_handle: AppHandle) -> Result<String, String> {
        // Get the app data directory using the new API
        let app_dir = get_app_data_dir(&app_handle)?;

        // Create the directory if it doesn't exist
        if !app_dir.exists() {
            fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;
        }

        let db_path = app_dir.join("syndeos.db");

        // Create or open the database
        let conn = Connection::open(&db_path).map_err(|e| e.to_string())?;

        // Create servers table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS servers (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL,
                hostname TEXT NOT NULL,
                ip_address TEXT NOT NULL,
                port INTEGER NOT NULL DEFAULT 22,
                username TEXT NOT NULL,
                ssh_key_id INTEGER,
                notes TEXT,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL,
                FOREIGN KEY (ssh_key_id) REFERENCES ssh_keys (id)
            )",
            [],
        )
            .map_err(|e| e.to_string())?;

        // Create settings table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS settings (
                id INTEGER PRIMARY KEY,
                key TEXT NOT NULL UNIQUE,
                value TEXT NOT NULL
            )",
            [],
        )
            .map_err(|e| e.to_string())?;

        // Create ssh_keys table
        conn.execute(
            "CREATE TABLE IF NOT EXISTS ssh_keys (
                id INTEGER PRIMARY KEY,
                name TEXT NOT NULL UNIQUE,
                path TEXT NOT NULL,
                is_default BOOLEAN NOT NULL DEFAULT 0,
                created_at TEXT NOT NULL,
                updated_at TEXT NOT NULL
            )",
            [],
        )
            .map_err(|e| e.to_string())?;

        Ok("Database initialized successfully".to_string())
    }

    pub fn get(app_handle: &AppHandle) -> Result<Connection, String> {
        let app_dir = get_app_data_dir(app_handle)?;
        let db_path = app_dir.join("syndeos.db");
        Connection::open(&db_path).map_err(|e| e.to_string())
    }
}
