mod database;
mod models;
mod controllers;

use tauri::AppHandle;
use database::connection as conn;

use controllers::{
    ssh_key,
    server,
    setting,
};

#[tauri::command]
fn init_app(app_handle: AppHandle) -> Result<String, String> {
    let db_result = conn::init_database(app_handle.clone())?;

    println!("Tauri SQLite Database Initialization Successful!");

    setting::init_default_settings(app_handle.clone())?;

    println!("Tauri Settings Initialization Successful!");

    ssh_key::init_ssh_keys(app_handle.clone())?;

    println!("Tauri SSH Keys Initialization Successful!");

    Ok(db_result)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            init_app,

            server::add_server,
            server::get_server,
            server::update_server,
            server::delete_server,
            server::get_servers,

            ssh_key::add_ssh_key,
            ssh_key::delete_ssh_key,
            ssh_key::get_ssh_key,
            ssh_key::get_ssh_keys,
            ssh_key::set_default_ssh_key,
            ssh_key::generate_ssh_key,

            setting::get_setting,
            setting::get_settings,
            setting::update_setting, 
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
