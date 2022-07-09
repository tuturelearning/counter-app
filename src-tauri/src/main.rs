#![cfg_attr(
  all(not(debug_assertions), target_os = "windows"),
  windows_subsystem = "windows"
)]

use std::{sync::{Arc, Mutex}, time::Duration};
use tauri::{State, Manager};
use tokio::time::sleep;

#[derive(Default)]
struct Counter(Arc<Mutex<i32>>);

fn main() {
  tauri::Builder::default()
  .setup(|app| {
    let app_handler = app.app_handle();
    tauri::async_runtime::spawn(async move {
      loop {
        sleep(Duration::from_millis(1000)).await;
        println!("sending keep-alive");
        app_handler.emit_all("keep-alive", "ping").unwrap();
      }
    });
    Ok(())
  })
  .manage(Counter::default())
  .invoke_handler(tauri::generate_handler![hello, counter_add])
  .run(tauri::generate_context!())
  .expect("error while running tauri application");
}

// invoke hello world
#[tauri::command]
fn hello() -> String {
  "Hello tauri".to_string()
}

#[tauri::command]
fn counter_add(n: i32, counter: State<'_, Counter>) -> String {
  let mut number = counter.0.lock().unwrap();
  *number += n;
  format!("{number}")
}