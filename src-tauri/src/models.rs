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
    pub created_at: String,
    pub updated_at: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct Setting {
    pub id: Option<i64>,
    pub key: String,
    pub value: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct SshKey {
    pub id: Option<i64>,
    pub name: String,
    pub path: String,
    pub is_default: bool,
    pub created_at: String,
    pub updated_at: String,
}