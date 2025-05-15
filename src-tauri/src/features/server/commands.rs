use super::service;
use tauri::AppHandle;
use super::model::Server;
use crate::database::connection;

#[tauri::command]
pub fn get_server(app_handle: AppHandle, id: i64) -> Result<Server, String> {
    let conn = connection::get(&app_handle)?;

    service::get_server(&conn, id)
}

#[tauri::command]
pub fn get_servers(app_handle: AppHandle) -> Result<Vec<Server>, String> {
    let conn = connection::get(&app_handle)?;

    service::get_servers(&conn)
}

#[tauri::command]
pub fn add_server(app_handle: AppHandle, server: Server) -> Result<Server, String> {
    let conn = connection::get(&app_handle)?;

    service::add_server(&conn, server)
}

#[tauri::command]
pub fn update_server(app_handle: AppHandle, server: Server) -> Result<(), String> {
    let conn = connection::get(&app_handle)?;

    service::update_server(&conn, server)
}

#[tauri::command]
pub fn delete_server(app_handle: AppHandle, id: i64) -> Result<(), String> {
    let conn = connection::get(&app_handle)?;

    service::delete_server(&conn, id)
}

#[tauri::command]
pub fn update_settings(app_handle: AppHandle, id: i64, settings: serde_json::Value) -> Result<(), String> {
    let conn = connection::get(&app_handle)?;

    service::update_settings(&conn, id, settings)
}