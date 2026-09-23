#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use std::time::Duration;

use tauri::{Manager, WebviewUrl, WebviewWindowBuilder};
use tauri_plugin_shell::process::CommandChild;
use tauri_plugin_shell::ShellExt;

struct SidecarState(Mutex<Option<CommandChild>>);

/// Binds an ephemeral port to find a free one, then releases it immediately.
/// There is a small window between releasing the port here and the sidecar
/// binding it, but that's an acceptable tradeoff for a local dev tool.
fn pick_free_port() -> u16 {
    let listener =
        std::net::TcpListener::bind("127.0.0.1:0").expect("failed to bind ephemeral port");
    let port = listener.local_addr().unwrap().port();
    drop(listener);
    port
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_shell::init())
        .manage(SidecarState(Mutex::new(None)))
        .setup(|app| {
            let handle = app.handle().clone();
            let port = pick_free_port();
            let url = format!("http://127.0.0.1:{port}");

            let sidecar_cmd = handle.shell().sidecar("if-creator")?.args([
                "--port",
                &port.to_string(),
                "--host",
                "127.0.0.1",
                "--no-open",
            ]);
            let (mut _rx, child) = sidecar_cmd.spawn()?;
            handle
                .state::<SidecarState>()
                .0
                .lock()
                .unwrap()
                .replace(child);

            tauri::async_runtime::spawn(async move {
                let health_url = format!("{url}/api/health");
                let client = reqwest::Client::new();
                let mut healthy = false;
                // ~10s at 200ms intervals
                for _ in 0..50 {
                    if let Ok(resp) = client.get(&health_url).send().await {
                        if resp.status().is_success() {
                            healthy = true;
                            break;
                        }
                    }
                    tokio::time::sleep(Duration::from_millis(200)).await;
                }
                if !healthy {
                    eprintln!("if-creator sidecar failed health check at {health_url}");
                    handle.exit(1);
                    return;
                }
                let _ = WebviewWindowBuilder::new(
                    &handle,
                    "main",
                    WebviewUrl::External(url.parse().unwrap()),
                )
                .title("IF-Creator")
                .inner_size(1280.0, 800.0)
                .build();
            });

            Ok(())
        })
        .build(tauri::generate_context!())
        .expect("error building tauri app")
        .run(|app_handle, event| {
            if let tauri::RunEvent::Exit = event {
                if let Some(child) = app_handle.state::<SidecarState>().0.lock().unwrap().take() {
                    let _ = child.kill();
                }
            }
        });
}
