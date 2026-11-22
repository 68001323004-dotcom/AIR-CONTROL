/*
  AIR CONTROL - ESP32 API starter
  Board: ESP32 Dev Module
  Arduino IDE libraries: built-in WiFi.h and WebServer.h

  This sketch exposes an API for the GitHub Pages frontend.
  It stores requested settings only. It DOES NOT yet transmit IR commands
  or switch mains power. Add the correct IR protocol/library for your
  air-conditioner brand/model before expecting the real AC to respond.

  Set your Wi-Fi name and password below.
*/
#include <WiFi.h>
#include <WebServer.h>

const char* WIFI_SSID = "YOUR_WIFI_NAME";
const char* WIFI_PASSWORD = "YOUR_WIFI_PASSWORD";

WebServer server(80);

bool acPower = false;
int acTemperature = 25;
String acMode = "COOL";
String acFan = "AUTO";

void sendCorsHeaders() {
  server.sendHeader("Access-Control-Allow-Origin", "*");
  server.sendHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  server.sendHeader("Access-Control-Allow-Headers", "Content-Type");
}

void handleOptions() {
  sendCorsHeaders();
  server.send(204);
}

void handleStatus() {
  sendCorsHeaders();
  String json = "{";
  json += "\"power\":" + String(acPower ? "true" : "false") + ",";
  json += "\"temperature\":" + String(acTemperature) + ",";
  json += "\"mode\":\"" + acMode + "\",";
  json += "\"fan\":\"" + acFan + "\"";
  json += "}";
  server.send(200, "application/json", json);
}

void handleCommand() {
  sendCorsHeaders();
  String body = server.arg("plain");

  // Simple field extraction for this starter example.
  if (body.indexOf("\"power\":true") >= 0) acPower = true;
  if (body.indexOf("\"power\":false") >= 0) acPower = false;

  int p = body.indexOf("\"temperature\":");
  if (p >= 0) {
    int start = p + 14;
    int end = body.indexOf(",", start);
    if (end < 0) end = body.indexOf("}", start);
    int value = body.substring(start, end).toInt();
    if (value >= 16 && value <= 30) acTemperature = value;
  }

  if (body.indexOf("\"mode\":\"COOL\"") >= 0) acMode = "COOL";
  if (body.indexOf("\"mode\":\"DRY\"") >= 0)  acMode = "DRY";
  if (body.indexOf("\"mode\":\"FAN\"") >= 0)  acMode = "FAN";
  if (body.indexOf("\"mode\":\"AUTO\"") >= 0) acMode = "AUTO";

  if (body.indexOf("\"fan\":\"AUTO\"") >= 0) acFan = "AUTO";
  if (body.indexOf("\"fan\":\"LOW\"") >= 0) acFan = "LOW";
  if (body.indexOf("\"fan\":\"MEDIUM\"") >= 0) acFan = "MEDIUM";
  if (body.indexOf("\"fan\":\"HIGH\"") >= 0) acFan = "HIGH";

  // TODO: Call your air-conditioner IR send function here.
  // Most AC remotes send a complete state frame, not a simple ON/OFF code.

  server.send(200, "application/json", "{\"ok\":true,\"note\":\"Settings stored; IR control not configured\"}");
}

void setup() {
  Serial.begin(115200);
  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }

  Serial.println();
  Serial.print("ESP32 IP address: ");
  Serial.println(WiFi.localIP());

  server.on("/api/status", HTTP_GET, handleStatus);
  server.on("/api/status", HTTP_OPTIONS, handleOptions);
  server.on("/api/command", HTTP_POST, handleCommand);
  server.on("/api/command", HTTP_OPTIONS, handleOptions);
  server.begin();
  Serial.println("AIR CONTROL API started");
}

void loop() {
  server.handleClient();
}
