mod database;
mod models;
mod controllers;

use tauri::AppHandle;
use database::connection as conn;
use controllers::ssh_key::{
    init_ssh_keys,
    add_ssh_key,
    delete_ssh_key,
    get_ssh_key,
    get_ssh_keys,
    generate_ssh_key,
    set_default_ssh_key
};

use controllers::server::{
    add_server,
    delete_server,
    get_server,
    get_servers,
    update_server
};

use controllers::setting::{
    init_default_settings,
    get_settings,
    get_setting,
    update_setting
};

#[tauri::command]
fn init_app(app_handle: AppHandle) -> Result<String, String> {
    let db_result = conn::init_database(app_handle.clone())?;

    println!("Tauri SQLite Database Initialization Successful!");

    init_default_settings(app_handle.clone())?;

    println!("Tauri Settings Initialization Successful!");

    init_ssh_keys(app_handle.clone())?;

    println!("Tauri SSH Keys Initialization Successful!");

    Ok(db_result)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            init_app,

            add_server,
            get_server,
            update_server,
            delete_server,
            get_servers,

            add_ssh_key,
            delete_ssh_key,
            get_ssh_key,
            get_ssh_keys,
            set_default_ssh_key,
            generate_ssh_key,

            get_setting,
            get_settings,
            update_setting,
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
