# Redis WhatsApp Session Setup

Implementasi ini menambahkan session WhatsApp berbasis Redis di route `/api/wa/*`.
Redis dipakai untuk menyimpan auth/session, QR sementara, status koneksi, dan metadata terakhir.

> Catatan: Redis tidak bisa menjamin WhatsApp tidak pernah offline 100%. Redis membantu agar session tidak hilang saat Node/VPS restart dan service bisa auto reconnect. Pastikan VPS, Redis, dan Node process tetap hidup.

## Install dependency

```bash
npm install
```

Jika install Baileys gagal karena dependency GitHub memakai `ssh://git@github.com/...`, jalankan:

```bash
git config --global url."https://github.com/".insteadOf ssh://git@github.com/
npm install
```

## Install Redis di VPS

```bash
sudo apt update
sudo apt install redis-server
sudo systemctl enable redis-server
sudo systemctl start redis-server
```

Aktifkan persistence Redis supaya session tidak hilang saat Redis restart:

```bash
sudo nano /etc/redis/redis.conf
```

Ubah:

```conf
appendonly no
```

Menjadi:

```conf
appendonly yes
```

Lalu restart:

```bash
sudo systemctl restart redis-server
```

## Environment variables

Tambahkan ke `.env`:

```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=
REDIS_DB=0

# Kalau Redis kamu pakai URL, ini akan diprioritaskan
# REDIS_URL=redis://127.0.0.1:6379

# Pakai session Redis/Baileys untuk route baru dan juga booking notification lama
# Opsi lain: watzap (default existing API lama)
WA_PROVIDER=baileys

WA_SESSION_ID=main
WA_AUTO_START=true
WA_RECONNECT_DELAY_MS=5000
WA_QR_TTL_SECONDS=60
WA_PRINT_QR=true
WA_LOG_LEVEL=silent
WA_BROWSER_NAME=VPS WA Bot
WA_BROWSER_TYPE=Chrome
WA_BROWSER_VERSION=1.0.0
```

## Routes baru

Base path sudah terpasang di server sebagai:

```txt
/api/wa
```

### Start session dan tampilkan QR di terminal

```http
POST /api/wa/session/start
```

Atau multi-session:

```http
POST /api/wa/session/main/start
```

Setelah QR muncul di terminal VPS, scan dari:

```txt
WhatsApp -> Linked Devices -> Link a Device
```

### Cek status

```http
GET /api/wa/session/status
```

### Ambil QR sebagai string

```http
GET /api/wa/session/qr
```

### Kirim pesan

```http
POST /api/wa/message/send
Content-Type: application/json

{
  "to": "6281234567890",
  "message": "Halo dari VPS"
}
```

Atau:

```http
POST /api/wa/session/main/message/send
Content-Type: application/json

{
  "phoneNo": "6281234567890",
  "text": "Halo dari VPS"
}
```

### Restart session

```http
POST /api/wa/session/restart
```

### Logout dan hapus auth dari Redis

```http
POST /api/wa/session/logout
```

## Supaya booking notification memakai session Redis/Baileys

Existing helper `sendWhatsAppMessage` sekarang mendukung provider baru.
Set di `.env`:

```env
WA_PROVIDER=baileys
WA_SESSION_ID=main
```

Kalau `WA_PROVIDER` tidak diset, kode lama tetap memakai API Watzap dengan `API_KEY_WA` dan `number_key`.

## PM2 agar Node tetap hidup

```bash
npm install -g pm2
pm2 start src/server.js --name paris-be
pm2 save
pm2 startup
```

## File yang ditambahkan/diubah

- `src/config/redis.js`
- `src/services/redisAuthState.js`
- `src/services/baileysWaService.js`
- `src/controllers/waControllers.js`
- `src/routes/waRoutes.js`
- `src/server.js`
- `package.json`
