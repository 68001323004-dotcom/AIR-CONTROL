# AIR CONTROL

เว็บควบคุมเครื่องปรับอากาศผ่าน ESP32 — ธีม Dark Premium

## ไฟล์ในโปรเจกต์
- `index.html` หน้าเว็บ
- `style.css` รูปแบบและสี
- `script.js` ปุ่มควบคุมและการเรียก API
- `esp32/air_control_esp32.ino` โค้ดเริ่มต้น ESP32

## เปิดเว็บบน GitHub Pages
1. สร้าง Repository ใหม่ชื่อ `AIR-CONTROL`
2. อัปโหลดไฟล์ทั้งหมด โดยให้ `index.html` อยู่ที่ root ของ repository
3. ไปที่ **Settings → Pages**
4. เลือก **Deploy from a branch**
5. เลือก branch `main` และ folder `/ (root)` แล้วกด Save
6. รอ GitHub สร้างเว็บ แล้วเปิด URL ที่ GitHub Pages แสดงให้

## ตั้งค่า ESP32
1. เปิด `esp32/air_control_esp32.ino` ใน Arduino IDE
2. เลือกบอร์ด ESP32 และใส่ชื่อ Wi-Fi/รหัสผ่านใน `WIFI_SSID` และ `WIFI_PASSWORD`
3. อัปโหลดโค้ด แล้วเปิด Serial Monitor ที่ 115200 baud เพื่อดู IP ของ ESP32
4. เปิด `script.js` แล้วกำหนด `API_BASE` เป็น IP ที่เห็น เช่น `http://192.168.1.50`

## ข้อจำกัดสำคัญ
- ตอนนี้ ESP32 ตัวอย่างนี้รับและเก็บค่าคำสั่งเท่านั้น ยังไม่ได้ส่งสัญญาณ IR ไปยังแอร์
- ต้องทราบยี่ห้อและรุ่นแอร์/รีโมต เพื่อเพิ่มการส่งคำสั่งอินฟราเรดให้ตรงรุ่น
- หน้า GitHub Pages เป็น HTTPS แต่ ESP32 ตัวอย่างให้บริการ HTTP ในเครือข่ายภายใน เบราว์เซอร์อาจบล็อกการเรียก HTTP จากหน้า HTTPS (mixed content) จึงอาจต้องใช้ HTTPS reverse proxy/tunnel หรือโฮสต์หน้าเว็บผ่าน local HTTP server ในเครือข่ายเดียวกันเพื่อทดสอบ.
- อย่าต่อไฟบ้านหรือวงจรคอมเพรสเซอร์เข้ากับ GPIO ของ ESP32 โดยตรง
