use super::service;
use tauri::AppHandle;
use super::model::SshKey;
use crate::database::connection;

#[tauri::command]
pub fn init_ssh_keys(app_handle: AppHandle) -> Result<Vec<SshKey>, String> {
    let conn = connection::get(&app_handle)?;

    service::init_ssh_keys(&conn)
}

#[tauri::command]
pub fn set_default_ssh_key(app_handle: AppHandle, id: i64) -> Result<(), String> {
    let conn = connection::get(&app_handle)?;

    service::set_default_ssh_key(&conn, id)
}

#[tauri::command]
pub fn get_ssh_key(app_handle: AppHandle, id: i64) -> Result<SshKey, String> {
    let conn = connection::get(&app_handle)?;

    service::get_ssh_key(&conn, id)
}

#[tauri::command]
pub fn get_ssh_keys(app_handle: AppHandle) -> Result<Vec<SshKey>, String> {
    let conn = connection::get(&app_handle)?;

    service::get_ssh_keys(&conn)
}

#[tauri::command]
pub fn add_ssh_key(app_handle: AppHandle, name: String, path: String, password: String, is_default: bool) -> Result<SshKey, String> {
    let conn = connection::get(&app_handle)?;

    service::add_ssh_key(&conn, name, path, password, is_default)
}

#[tauri::command]
pub fn generate_ssh_key(app_handle: AppHandle, name: String, password: String, is_default: bool) -> Result<SshKey, String> {
    let conn = connection::get(&app_handle)?;

    service::generate_ssh_key(&conn, name, password, is_default)
}

#[tauri::command]
pub fn delete_ssh_key(app_handle: AppHandle, id: i64, delete_file: bool) -> Result<(), String> {
    let conn = connection::get(&app_handle)?;

    service::delete_ssh_key(&conn, id, delete_file)
}
