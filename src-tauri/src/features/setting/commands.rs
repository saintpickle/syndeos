use super::service;
use tauri::AppHandle;
use super::model::Setting;
use crate::common::database::connection;

#[tauri::command]
pub fn init_default_settings(app_handle: AppHandle) -> Result<(), String> {
    let conn = connection::get(&app_handle)?;
    
    service::init_default_settings(conn);
    
    Ok(())
}

#[tauri::command]
pub fn get_setting(app_handle: AppHandle, key: String) -> Result<String, String> {
    let conn = connection::get(&app_handle)?;

    service::get_setting(conn, key)
}

#[tauri::command]
pub fn get_settings(app_handle: AppHandle) -> Result<Vec<Setting>, String> {
    let conn = connection::get(&app_handle)?;

    service::get_settings(conn)
}

#[tauri::command]
pub fn update_setting(app_handle: AppHandle, key: String, value: String) -> Result<(), String> {
    let conn = connection::get(&app_handle)?;

    service::update_setting(conn, key, value)
}

#[tauri::command]
pub fn reset_app(app_handle: AppHandle) -> Result<(), String> {
    service::reset_app(app_handle.clone())
}
