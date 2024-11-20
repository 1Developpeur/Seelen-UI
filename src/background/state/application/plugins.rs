use std::path::PathBuf;

use seelen_core::{handlers::SeelenEvent, state::Plugin};
use tauri::Emitter;

use crate::{error_handler::Result, seelen::get_app_handle};

use super::FullState;

impl FullState {
    pub(super) fn emit_plugins(&self) -> Result<()> {
        get_app_handle().emit(SeelenEvent::StatePluginsChanged, &self.plugins)?;
        Ok(())
    }

    fn load_plugin_from_file(path: PathBuf) -> Result<Plugin> {
        Ok(serde_yaml::from_str(&std::fs::read_to_string(&path)?)?)
    }

    pub(super) fn load_plugins(&mut self) -> Result<()> {
        let user_path = self.data_dir.join("plugins");
        let bundled_path = self.resources_dir.join("static/plugins");

        let entries = std::fs::read_dir(&bundled_path)?.chain(std::fs::read_dir(&user_path)?);
        for entry in entries.flatten() {
            let path = entry.path();
            if path.is_dir() {
                continue;
            }
            match Self::load_plugin_from_file(path) {
                Ok(plugin) => {
                    self.plugins.insert(plugin.id.clone(), plugin);
                }
                Err(e) => {
                    log::error!("Failed to load plugin: {}", e);
                }
            }
        }
        Ok(())
    }
}
