# LINE Messaging API Documentation

## 📱 Pondok Imam Syafii LINE Bot System

### Overview
Sistem LINE Bot Pondok Imam Syafii memiliki 2 mode operasi:
1. **Public Mode** - Untuk jamaah, orang tua, dan pengunjung umum
2. **Admin Mode** - Untuk admin yayasan dengan full CRUD access

---

## 🌐 Public Mode (`/start` atau `/menu`)

### Cara Menggunakan
1. Tambahkan bot LINE Pondok Imam Syafii sebagai teman
2. Ketik `/start` atau `/menu` untuk memulai
3. Akan muncul menu interaktif dengan pilihan:

### Menu Utama Public
```
📚 Portal Informasi
├── 🏫 PROFIL - Tentang Pondok
├── 🎓 PPDB - Info Pendaftaran
├── 📅 KEGIATAN - Agenda & Event (5 terbaru dari database)
├── 💰 DONASI - Infaq & Wakaf (5 campaign aktif terbaru)
├── 📰 BERITA - Info Terkini
├── 💬 TANYA USTADZ - Konsultasi Syariah
└── 📞 KONTAK - Hubungi Kami
```

### Flow Detail Public Mode

#### 1. PROFIL PONDOK
```
User: /start atau /menu
Bot: [Menampilkan Menu Utama]
User: [Klik PROFIL]
Bot: Menampilkan:
     - Sejarah Pondok
     - Visi & Misi
     - Jumlah Santri
     - Lokasi
     - Link ke Website
     - Tombol Kembali
```

#### 2. INFO PPDB
```
User: [Klik PPDB]
Bot: Menampilkan:
     - Jadwal Pendaftaran
     - Syarat Pendaftaran
     - Biaya Pendaftaran
     - Tombol WhatsApp Panitia PPDB
     - Tombol Kembali
```

#### 3. KEGIATAN
```
User: [Klik KEGIATAN]
Bot: Query database untuk 5 kegiatan terbaru
     Menampilkan carousel:
     - Nama Kegiatan
     - Tanggal & Waktu
     - Lokasi
     - Deskripsi
     - Foto (jika ada)
```

#### 4. DONASI
```
User: [Klik DONASI]
Bot: Query database untuk 5 campaign donasi aktif
     Menampilkan:
     - Nama Campaign
     - Target Donasi
     - Terkumpul
     - Progress Bar
     - Tombol Donasi via Transfer
     - Rekening Pondok
```

#### 5. TANYA USTADZ
```
User: [Klik TANYA USTADZ]
Bot: "Silakan pilih kategori pertanyaan:"
     - Fiqih Ibadah
     - Muamalah
     - Akhlaq
     - Aqidah
     - Tafsir
     - Tahsin
     
User: [Pilih Kategori]
Bot: "Apakah ingin bertanya sebagai:"
     - Nama Asli
     - Anonim
     
User: [Pilih Identitas]
Bot: "Jika nama asli, masukkan nama Anda:"
User: [Input nama atau skip jika anonim]
Bot: "Silakan tulis pertanyaan Anda:"
User: [Input pertanyaan]
Bot: "Pertanyaan berhasil dikirim! Ustadz akan menjawab dalam 1-3 hari kerja."
```

---

## 🔐 Admin Mode (`/admin_yys`)

### Cara Login Admin
1. Admin harus terdaftar terlebih dahulu di database
2. Proses registrasi admin:

#### Registrasi Admin Pertama Kali
```sql
-- Jalankan di database atau Prisma Studio
INSERT INTO LineAdmin (lineUserId, username, password, permissions)
VALUES ('U1234567890abcdef', 'admin_pondok', 'hash_password_here', '["ALL"]');
```

Atau melalui dashboard:
1. Login ke dashboard web sebagai SUPERADMIN
2. Masuk ke Settings > LINE Bot Admin
3. Tambahkan LINE User ID admin baru

#### Flow Login Admin
```
User: /admin_yys
Bot: "🔐 Masukkan username admin:"
User: [Input username]
Bot: "🔑 Masukkan password:"
User: [Input password]
Bot: [Validasi credentials]
     
Jika Valid:
Bot: "✅ Login berhasil! Mode Admin aktif selama 30 menit"
     [Menampilkan Admin Menu]
     
Jika Invalid:
Bot: "❌ Akses ditolak. Username atau password salah."
```

### Menu Admin
```
🔐 ADMIN PANEL
├── 👥 SISWA - CRUD Santri
│   ├── ➕ Tambah Siswa Baru
│   ├── 🔍 Cari Siswa
│   ├── 📋 List Semua Siswa
│   ├── ✏️ Edit Data Siswa
│   └── 🗑️ Hapus Siswa
├── 👨‍🏫 PENGAJAR - CRUD Ustadz
├── 💰 KEUANGAN - SPP & Payment
├── 📊 LAPORAN - Reports
├── 📚 AKADEMIK - Nilai & Absen
├── 🏫 KELAS - Manage Kelas
├── 💬 TANYA USTADZ - Jawab Pertanyaan
├── 📢 BROADCAST - Kirim Pesan
└── ⚙️ SYSTEM - Settings
```

### Flow CRUD Siswa (Contoh Detail)

#### Tambah Siswa Baru
```
Admin: [Klik Tambah Siswa]
Bot: [1/11] "📝 Masukkan nama lengkap siswa:"
Admin: Ahmad Fauzi
Bot: [2/11] "🔢 Masukkan NIS (8 digit):"
Admin: 20240001
Bot: [Validasi NIS tidak duplikat]
     [3/11] "👤 Pilih jenis kelamin:"
     - Laki-laki
     - Perempuan
Admin: Laki-laki
Bot: [4/11] "🏙️ Masukkan tempat lahir:"
Admin: Blitar
Bot: [5/11] "📅 Masukkan tanggal lahir (DD/MM/YYYY):"
Admin: 15/03/2010
Bot: [6/11] "🏠 Masukkan alamat lengkap:"
Admin: Jl. Merdeka No. 123 RT 02 RW 05
Bot: [7/11] "🌆 Masukkan kota/kabupaten:"
Admin: Blitar
Bot: [8/11] "👨 Masukkan nama ayah:"
Admin: Budi Santoso
Bot: [9/11] "📱 Masukkan nomor HP ayah:"
Admin: 081234567890
Bot: [10/11] "👩 Masukkan nama ibu:"
Admin: Siti Aminah
Bot: [11/11] "📱 Masukkan nomor HP ibu (atau 'skip'):"
Admin: 081234567891
Bot: "✅ Data sudah lengkap. Simpan data siswa?"
     [Ya] [Tidak]
Admin: Ya
Bot: "✅ Data siswa berhasil disimpan!"
```

#### Edit Siswa
```
Admin: [Klik Edit Siswa]
Bot: "🔍 Masukkan NIS siswa yang akan diedit:"
Admin: 20240001
Bot: [Query database, tampilkan data siswa]
     "📝 Apa yang ingin diubah?"
     - Nama Lengkap
     - Alamat
     - No. HP Ayah
     - No. HP Ibu
     - Status
Admin: Alamat
Bot: "✏️ Masukkan alamat baru:"
Admin: Jl. Baru No. 456
Bot: "✅ Apakah Anda yakin ingin menyimpan perubahan?"
Admin: Ya
Bot: "✅ Data berhasil diperbarui!"
```

### Session Management
- Admin session berlaku selama 30 menit
- Session auto-expire jika tidak ada aktivitas
- Untuk logout: Klik tombol "🚪 Logout Admin"
- Session tersimpan di database dengan enkripsi

### Perizinan Admin
Admin dapat memiliki permissions berbeda:
- `ALL` - Full access semua modul
- `STUDENT_CREATE` - Buat data siswa
- `STUDENT_EDIT` - Edit data siswa
- `STUDENT_DELETE` - Hapus data siswa
- `FINANCE_MANAGE` - Kelola keuangan
- `BROADCAST` - Kirim broadcast message

---

## 🔧 Troubleshooting

### "Akses ditolak, Anda tidak memiliki hak akses admin"
**Penyebab:**
1. LINE User ID belum terdaftar sebagai admin
2. Session admin expired
3. Belum login dengan `/admin_yys`

**Solusi:**
1. Minta SUPERADMIN untuk mendaftarkan LINE User ID Anda
2. Login ulang dengan `/admin_yys`
3. Pastikan credentials benar

### "Menu tidak muncul saat ketik /start"
**Penyebab:**
1. Bot sedang maintenance
2. Webhook URL tidak aktif
3. Channel Access Token expired

**Solusi:**
1. Cek status bot di LINE Developers Console
2. Verifikasi webhook URL respond 200 OK
3. Generate ulang Channel Access Token

### "Header menu berantakan/tumpang tindih"
**Penyebab:**
1. Image URL tidak valid
2. Ukuran bubble melebihi limit LINE
3. Karakter special tidak ter-escape

**Solusi:**
1. Gunakan image URL yang valid dan accessible
2. Kurangi konten dalam satu bubble
3. Escape karakter special dalam text

---

## 📊 Database Integration

### Kegiatan (Activities)
```typescript
// Query 5 kegiatan terbaru
const activities = await prisma.activity.findMany({
  where: {
    date: {
      gte: new Date() // Upcoming events
    }
  },
  orderBy: {
    date: 'asc'
  },
  take: 5
});
```

### Donasi (Donations)
```typescript
// Query 5 campaign donasi aktif
const donations = await prisma.donationCampaign.findMany({
  where: {
    status: 'ACTIVE',
    endDate: {
      gte: new Date()
    }
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 5
});
```

---

## 🚀 Development & Deployment

### Environment Variables
```env
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
LINE_CHANNEL_SECRET=your_channel_secret
NEXTAUTH_URL=https://your-domain.com
DATABASE_URL=your_database_url
```

### Webhook URL
```
https://your-domain.com/api/webhooks/line
```

### Testing Commands
```bash
# Test public mode
curl -X POST https://your-domain.com/api/webhooks/line \
  -H 'Content-Type: application/json' \
  -d '{"events":[{"type":"message","message":{"type":"text","text":"/start"}}]}'

# Test admin mode
curl -X POST https://your-domain.com/api/webhooks/line \
  -H 'Content-Type: application/json' \
  -d '{"events":[{"type":"message","message":{"type":"text","text":"/admin_yys"}}]}'
```

---

## 📝 Notes
- Semua data disimpan dengan created_by untuk audit trail
- Flow bersifat atomic - complete atau abort
- Session cleanup otomatis setiap 30 menit
- Support multi-language dapat ditambahkan
- Rate limiting 60 requests/minute per user