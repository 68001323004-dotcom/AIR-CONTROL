/*
 * AIR CONTROL - Frontend
 * GitHub Pages hosts this website. ESP32 runs its own API on your Wi-Fi.
 *
 * IMPORTANT:
 * 1) Change API_BASE to your ESP32's local IP, e.g. "http://192.168.1.50"
 * 2) GitHub Pages is HTTPS. Browsers may block HTTP API calls from an HTTPS page
 *    (mixed content). For testing, open this page locally over HTTP or use a
 *    secure HTTPS tunnel/backend for remote access.
 */
const API_BASE = ""; // Example: "http://192.168.1.50"; blank = demo mode
let temperature = 25;
let isOn = false;
let currentMode = "COOL";
let fanSpeed = "AUTO";
const $ = id => document.getElementById(id);

function render() {
  $("temp").textContent = temperature;
  $("temp2").textContent = temperature;
  $("powerBtn").textContent = isOn ? "⏻  ปิดเครื่องปรับอากาศ" : "⏻  เปิดเครื่องปรับอากาศ";
  $("powerBtn").classList.toggle("off", !isOn);
  $("stateTag").textContent = isOn ? "เปิดอยู่" : "ปิดอยู่";
  $("powerState").textContent = isOn ? "เปิด" : "ปิด";
  $("modeState").textContent = currentMode;
  $("fanState").textContent = fanSpeed;
}

async function sendCommand() {
  if (!API_BASE) return; // Demo mode
  try {
    const response = await fetch(`${API_BASE}/api/command`, {
      method: "POST",
      headers: { "Content-Type": "text/plain" },
      body: JSON.stringify({
        power: isOn,
        temperature,
        mode: currentMode,
        fan: fanSpeed
      })
    });
    if (!response.ok) throw new Error("ESP32 API error");
    $("connection").textContent = "● ESP32 CONNECTED";
    $("connection").style.color = "#77e9b6";
    $("connectionNote").textContent = "ส่งคำสั่งไปยัง ESP32 แล้ว";
  } catch (error) {
    $("connection").textContent = "● ESP32 OFFLINE";
    $("connection").style.color = "#ffb4a8";
    $("connectionNote").textContent = "เชื่อมต่อ ESP32 ไม่สำเร็จ ตรวจสอบ IP และ Wi-Fi";
  }
}

async function refreshStatus() {
  if (!API_BASE) return;
  try {
    const response = await fetch(`${API_BASE}/api/status`, { cache: "no-store" });
    if (!response.ok) throw new Error("Status request failed");
    const data = await response.json();
    isOn = !!data.power;
    temperature = Number(data.temperature) || 25;
    currentMode = data.mode || "COOL";
    fanSpeed = data.fan || "AUTO";
    $("fan").value = fanSpeed;
    document.querySelectorAll("[data-mode]").forEach(b =>
      b.classList.toggle("active", b.dataset.mode === currentMode)
    );
    $("connection").textContent = "● ESP32 CONNECTED";
    $("connection").style.color = "#77e9b6";
    $("connectionNote").textContent = "เชื่อมต่อ ESP32 แล้ว";
    render();
  } catch {
    $("connection").textContent = "● ESP32 OFFLINE";
    $("connection").style.color = "#ffb4a8";
  }
}

$("minus").addEventListener("click", () => {
  temperature = Math.max(16, temperature - 1); render(); sendCommand();
});
$("plus").addEventListener("click", () => {
  temperature = Math.min(30, temperature + 1); render(); sendCommand();
});
$("powerBtn").addEventListener("click", () => {
  isOn = !isOn; render(); sendCommand();
});
$("fan").addEventListener("change", event => {
  fanSpeed = event.target.value; render(); sendCommand();
});
document.querySelectorAll("[data-mode]").forEach(button => {
  button.addEventListener("click", () => {
    currentMode = button.dataset.mode;
    document.querySelectorAll("[data-mode]").forEach(b =>
      b.classList.toggle("active", b === button)
    );
    render(); sendCommand();
  });
});
render();
refreshStatus();
if (API_BASE) setInterval(refreshStatus, 5000);
