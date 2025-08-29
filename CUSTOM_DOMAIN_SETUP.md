# Panduan Setup Custom Domain di Vercel

## Ya, Anda Bisa Menggunakan Domain Apapun!

Vercel mendukung semua jenis domain:
- **.com** (ponpesimamsyafii.com)
- **.id** (ponpesimamsyafii.id)
- **.ponpes.id** (imamsyafii.ponpes.id)
- **.or.id** (ponpesimamsyafii.or.id)
- **.sch.id** (imamsyafii.sch.id)
- atau domain apapun yang Anda miliki

## Langkah-Langkah Setup Domain

### 1. Tambahkan Domain di Vercel

1. Buka: https://vercel.com/pendtiumpraz/imam-syafii-blitar/settings/domains
2. Klik **"Add Domain"**
3. Masukkan domain Anda, contoh:
   - `ponpesimamsyafii.com`
   - `imamsyafii.ponpes.id`
   - atau subdomain: `app.ponpesimamsyafii.com`
4. Klik **"Add"**

### 2. Konfigurasi DNS

Setelah menambahkan domain, Vercel akan memberikan instruksi DNS. Ada 2 pilihan:

#### Opsi A: Menggunakan Root Domain (ponpesimamsyafii.com)

**Jika domain provider mendukung ANAME/ALIAS:**
```
Type: ALIAS atau ANAME
Name: @ 
Value: cname.vercel-dns.com
```

**Jika tidak mendukung ANAME/ALIAS, gunakan A Record:**
```
Type: A
Name: @
Value: 76.76.21.21
```

**Dan tambahkan www subdomain:**
```
Type: CNAME
Name: www
Value: cname.vercel-dns.com
```

#### Opsi B: Menggunakan Subdomain (app.ponpesimamsyafii.com)

Lebih mudah, cukup tambahkan CNAME:
```
Type: CNAME
Name: app (atau subdomain yang diinginkan)
Value: cname.vercel-dns.com
```

### 3. Setting DNS di Provider Domain

#### Untuk Domain .ID (PANDI/Registrar Indonesia)

**Jika beli di Rumahweb:**
1. Login ke Client Area Rumahweb
2. Kelola Domain → DNS Management
3. Tambahkan record sesuai instruksi di atas

**Jika beli di Niagahoster:**
1. Login ke Member Area
2. Domain → Kelola Domain → DNS/Nameserver
3. Pilih "Gunakan DNS Niagahoster"
4. Tambahkan record sesuai instruksi

**Jika beli di IDwebhost:**
1. Login ke Client Area
2. Domain Saya → Kelola → DNS Zone Editor
3. Tambahkan record sesuai instruksi

**Jika beli di Domainesia:**
1. Login ke Client Area
2. Domain → DNS Management
3. Tambahkan record sesuai instruksi

#### Untuk Domain Internasional (.com)

**Jika pakai Namecheap:**
1. Login ke Namecheap
2. Domain List → Manage → Advanced DNS
3. Tambahkan record sesuai instruksi

**Jika pakai GoDaddy:**
1. Login ke GoDaddy
2. My Products → DNS → Manage DNS
3. Tambahkan record sesuai instruksi

**Jika pakai Cloudflare:**
1. Login ke Cloudflare
2. Pilih domain → DNS
3. Tambahkan record (pastikan proxy/orange cloud OFF untuk CNAME)

### 4. Tunggu Propagasi DNS

- Biasanya 5-30 menit untuk aktif
- Maksimal 48 jam (jarang terjadi)
- Cek status di: https://dnschecker.org

### 5. Update NEXTAUTH_URL

Setelah domain aktif, update environment variable di Vercel:

1. Buka: https://vercel.com/pendtiumpraz/imam-syafii-blitar/settings/environment-variables
2. Edit `NEXTAUTH_URL` menjadi:
   ```
   https://ponpesimamsyafii.com
   ```
   atau
   ```
   https://imamsyafii.ponpes.id
   ```

## Contoh Konfigurasi Lengkap

### Contoh 1: Domain ponpesimamsyafii.com

**DNS Records:**
```
A     @      76.76.21.21
CNAME www    cname.vercel-dns.com
```

**Environment Variable:**
```
NEXTAUTH_URL=https://ponpesimamsyafii.com
```

### Contoh 2: Domain imamsyafii.ponpes.id

**DNS Records:**
```
A     @      76.76.21.21
CNAME www    cname.vercel-dns.com
```

**Environment Variable:**
```
NEXTAUTH_URL=https://imamsyafii.ponpes.id
```

### Contoh 3: Subdomain app.ponpesimamsyafii.or.id

**DNS Records:**
```
CNAME app    cname.vercel-dns.com
```

**Environment Variable:**
```
NEXTAUTH_URL=https://app.ponpesimamsyafii.or.id
```

## SSL Certificate (HTTPS)

✅ **GRATIS dan OTOMATIS!**
- Vercel otomatis menyediakan SSL certificate gratis
- Menggunakan Let's Encrypt
- Auto-renewal setiap 3 bulan
- Tidak perlu setup apapun

## Tips Penting

1. **Pilih Subdomain untuk Testing:**
   - Buat subdomain `beta.domain.com` untuk testing
   - Setelah yakin, baru arahkan domain utama

2. **Jangan Hapus Vercel Domain:**
   - Tetap bisa diakses via: imam-syafii-blitar.vercel.app
   - Berguna untuk troubleshooting

3. **Multiple Domain:**
   - Bisa tambahkan beberapa domain sekaligus
   - Contoh: .com dan .id sekaligus

4. **Redirect www ke non-www (atau sebaliknya):**
   - Vercel otomatis handle ini
   - Pilih primary domain di settings

## Troubleshooting

### Domain Tidak Aktif Setelah 48 Jam

1. Cek DNS propagation: https://dnschecker.org
2. Pastikan tidak ada typo di DNS records
3. Cek di Vercel domains page untuk error message

### SSL Error

1. Tunggu 10-15 menit setelah domain aktif
2. Clear browser cache
3. Coba incognito mode

### "Invalid Configuration" di Vercel

1. Pastikan DNS records benar
2. Jangan gunakan proxy Cloudflare (orange cloud) untuk CNAME
3. Hapus dan tambahkan ulang domain di Vercel

## Rekomendasi Domain untuk Pondok Pesantren

### Domain Lokal Indonesia:
- **.ponpes.id** - Khusus untuk pondok pesantren (RESMI)
- **.or.id** - Untuk organisasi
- **.sch.id** - Untuk sekolah/pendidikan
- **.ac.id** - Untuk perguruan tinggi
- **.id** - Domain Indonesia umum

### Cara Daftar Domain .ponpes.id:
1. Siapkan dokumen:
   - Surat Keterangan dari Kemenag
   - SK Pendirian Ponpes
   - KTP Pimpinan Ponpes
2. Daftar melalui registrar resmi PANDI
3. Biaya sekitar Rp 60.000/tahun

### Domain Internasional:
- **.com** - Paling umum
- **.org** - Untuk organisasi
- **.edu** - Untuk pendidikan (perlu verifikasi)

## Biaya Domain (Perkiraan/Tahun)

- **.com**: Rp 150.000 - 200.000
- **.id**: Rp 200.000 - 300.000
- **.ponpes.id**: Rp 60.000 (PALING MURAH!)
- **.or.id**: Rp 60.000
- **.sch.id**: Rp 60.000
- **.org**: Rp 180.000 - 250.000

## Kesimpulan

✅ **Ya, Anda bisa pakai domain apapun di Vercel!**
- Setup mudah (15-30 menit)
- SSL gratis otomatis
- Support semua TLD (.com, .id, .ponpes.id, dll)
- Bisa multiple domain
- Gratis, tidak ada biaya tambahan dari Vercel

**Rekomendasi:** Gunakan **.ponpes.id** karena:
1. Murah (Rp 60.000/tahun)
2. Resmi untuk pondok pesantren
3. Lebih terpercaya untuk institusi pendidikan Islam
4. Mudah diingat