use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct SshKey {
    pub id: Option<i64>,
    pub name: String,
    pub path: String,
    pub password: Option<String>,
    pub is_default: bool,
    pub created_at: Option<String>,
    pub updated_at: Option<String>,
}
