# LINE Rich Menu Setup Guide

## Rich Menu untuk Bot Pondok Imam Syafii

Rich menu adalah menu persisten yang muncul di bagian bawah chat LINE. Berikut cara setup-nya:

## 1. Design Rich Menu

Buat gambar dengan ukuran **2500x1686 px** atau **2500x843 px** dengan 6 area tap:

```
+----------------+----------------+----------------+
|                |                |                |
|   📚 SISWA     |  👨‍🏫 PENGAJAR   |   💰 KEUANGAN  |
|                |                |                |
+----------------+----------------+----------------+
|                |                |                |
|  📖 AKADEMIK   |   📅 JADWAL     |   ⚙️ SETTINGS  |
|                |                |                |
+----------------+----------------+----------------+
```

## 2. Create Rich Menu via API

```bash
# 1. Create rich menu
curl -X POST https://api.line.me/v2/bot/richmenu \
-H "Authorization: Bearer {CHANNEL_ACCESS_TOKEN}" \
-H "Content-Type: application/json" \
-d '{
  "size": {
    "width": 2500,
    "height": 1686
  },
  "selected": true,
  "name": "Pondok Imam Syafii Menu",
  "chatBarText": "Menu",
  "areas": [
    {
      "bounds": {
        "x": 0,
        "y": 0,
        "width": 833,
        "height": 843
      },
      "action": {
        "type": "message",
        "text": "siswa"
      }
    },
    {
      "bounds": {
        "x": 833,
        "y": 0,
        "width": 834,
        "height": 843
      },
      "action": {
        "type": "message",
        "text": "pengajar"
      }
    },
    {
      "bounds": {
        "x": 1667,
        "y": 0,
        "width": 833,
        "height": 843
      },
      "action": {
        "type": "message",
        "text": "keuangan"
      }
    },
    {
      "bounds": {
        "x": 0,
        "y": 843,
        "width": 833,
        "height": 843
      },
      "action": {
        "type": "message",
        "text": "akademik"
      }
    },
    {
      "bounds": {
        "x": 833,
        "y": 843,
        "width": 834,
        "height": 843
      },
      "action": {
        "type": "message",
        "text": "jadwal"
      }
    },
    {
      "bounds": {
        "x": 1667,
        "y": 843,
        "width": 833,
        "height": 843
      },
      "action": {
        "type": "message",
        "text": "settings"
      }
    }
  ]
}'

# Response: {"richMenuId": "richmenu-xxxxx"}

# 2. Upload image
curl -X POST https://api-data.line.me/v2/bot/richmenu/richmenu-xxxxx/content \
-H "Authorization: Bearer {CHANNEL_ACCESS_TOKEN}" \
-H "Content-Type: image/jpeg" \
--data-binary @rich_menu_image.jpg

# 3. Set as default
curl -X POST https://api.line.me/v2/bot/user/all/richmenu/richmenu-xxxxx \
-H "Authorization: Bearer {CHANNEL_ACCESS_TOKEN}"
```

## 3. Keywords yang Bisa Digunakan

### Menu Utama
- `menu`, `help`, `bantuan` - Tampilkan menu utama

### Data Siswa
- `siswa`, `murid`, `santri` - Menu siswa
- `tambah siswa` - Mulai flow tambah siswa
- `cari siswa` - Cari siswa
- `list siswa` - Tampilkan daftar siswa
- `edit siswa` - Edit data siswa
- `hapus siswa` - Hapus siswa
- **NIS 8 digit** - Auto lookup siswa

### Data Pengajar
- `pengajar`, `guru`, `ustadz` - Menu pengajar
- `tambah pengajar` - Tambah pengajar
- `list pengajar` - Daftar pengajar

### Keuangan
- `keuangan` - Menu keuangan
- `spp` - Cek tagihan SPP
- `bayar` - Input pembayaran
- `tagihan` - Cek semua tagihan
- `laporan keuangan` - Laporan keuangan

### Akademik
- `akademik` - Menu akademik
- `nilai` - Input/cek nilai
- `absensi` - Input/cek absensi
- `jadwal` - Lihat jadwal
- `raport` - Generate raport

### Quick Actions
- `hadir` - Quick attendance (hadir)
- `izin` - Quick attendance (izin)
- `sakit` - Quick attendance (sakit)

### Control
- `batal`, `cancel` - Batalkan proses
- `reset` - Reset session

## 4. Flow Examples

### Tambah Siswa Flow
```
User: tambah siswa
Bot: Silakan masukkan data siswa:
     1. Nama Lengkap:
User: Ahmad Fauzi
Bot: 2. NIS (8 digit):
User: 20240001
Bot: 3. Tanggal Lahir (DD/MM/YYYY):
User: 15/08/2010
Bot: 4. Jenis Kelamin (L/P):
User: L
Bot: 5. No. HP Orang Tua:
User: 081234567890
Bot: ✅ Siswa berhasil ditambahkan!
     Nama: Ahmad Fauzi
     NIS: 20240001
```

### Cek SPP Flow
```
User: spp
Bot: Masukkan NIS siswa untuk cek tagihan SPP:
User: 20240001
Bot: [Flex Message dengan detail tagihan]
     - Januari 2024: Rp 500.000
     - Februari 2024: Rp 500.000
     TOTAL: Rp 1.000.000
     [Button: Bayar Sekarang]
```

### Quick Search
```
User: 20240001
Bot: [Flex Message detail siswa]
     Ahmad Fauzi
     NIS: 20240001
     Kelas: 7A
     [Button: Edit] [Button: Hapus]
```

## 5. Testing Commands

Test webhook dengan curl:
```bash
curl -X POST http://localhost:3000/api/webhooks/line \
-H "Content-Type: application/json" \
-H "x-line-signature: {signature}" \
-d '{
  "events": [{
    "type": "message",
    "replyToken": "test-reply-token",
    "source": {
      "type": "user",
      "userId": "test-user-id"
    },
    "message": {
      "type": "text",
      "text": "menu"
    }
  }]
}'
```

## 6. Monitoring

Monitor webhook calls di LINE Developers Console:
1. Go to Messaging API tab
2. Check "Webhook settings"
3. View "Webhook URL Verify Status"
4. Check "Statistics" for usage

## 7. Best Practices

1. **Response Time**: Reply dalam 1 detik untuk UX terbaik
2. **Message Limit**: Max 5 messages per reply
3. **Flex Message**: Gunakan untuk UI yang rich
4. **Quick Reply**: Sediakan opsi cepat
5. **Session Management**: Timeout after 10 minutes
6. **Error Handling**: Selalu ada fallback message
7. **Rate Limiting**: Implement rate limiting untuk prevent spam

## 8. Security

1. **Validate Signature**: Selalu validasi x-line-signature
2. **Environment Variables**: Simpan tokens di .env
3. **HTTPS Only**: Webhook harus HTTPS
4. **IP Whitelist**: Optional, whitelist LINE IPs
5. **Audit Log**: Log semua CRUD operations

## 9. Deployment

```bash
# Set webhook URL in production
curl -X PUT https://api.line.me/v2/bot/channel/webhook/endpoint \
-H "Authorization: Bearer {CHANNEL_ACCESS_TOKEN}" \
-H "Content-Type: application/json" \
-d '{
  "endpoint": "https://yourdomain.com/api/webhooks/line"
}'
```

## 10. Troubleshooting

### Webhook tidak terima message
- Check webhook URL di LINE Console
- Verify SSL certificate
- Check signature validation

### Reply token expired
- Reply token valid 30 detik
- Gunakan push message untuk reply delayed

### Flex message error
- Validate JSON structure
- Check image URLs accessible
- Max 5 bubbles in carousel