use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Server {
    pub id: Option<i64>,
    pub name: String,
    pub hostname: String,
    pub ip_address: String,
    pub port: i64,
    pub username: String,
    pub ssh_key_id: Option<i64>,
    pub notes: Option<String>,
    pub settings: serde_json::Value,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}