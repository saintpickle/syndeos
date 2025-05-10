use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct Setting {
    pub id: Option<i64>,
    pub key: String,
    pub value: String,
    pub value_type: String,
}

#[derive(Debug, Serialize, Deserialize)]
pub enum SettingType {
    String,
    Integer,
    Float,
    Boolean,
}

impl From<&str> for SettingType {
    fn from(s: &str) -> Self {
        match s.to_lowercase().as_str() {
            "integer" => SettingType::Integer,
            "float" => SettingType::Float,
            "boolean" => SettingType::Boolean,
            _ => SettingType::String, // Default to string for unknown types
        }
    }
}