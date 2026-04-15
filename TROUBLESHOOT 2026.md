# SETUP PROJECT PESANTREN (GIT + POSTGRES + NODEJS)

## 1. Clone Repo
```bash
git clone https://github.com/yricho/pesantren.git
cd pesantren
```

## 2. Install Dependencies
```bash
npm install
```

---

## 3. Setup ENV (TEST KE SERVER)
Buat file `.env` lalu isi:

```env
DATABASE_URL="postgresql://psrminggu:Passw0rdku01@103.109.0.218:5432/pesantren"
POSTGRES_URL="postgresql://psrminggu:Passw0rdku01@103.109.0.218:5432/pesantren_backup"
```

---

## 4. CREATE BACKUP (MACBOOK / LINUX)
Jalankan:

```bash
pg_dump -U postgres -d pesantren_backup -F c -f backup.backup
```

Jika diminta password → masukkan password postgres.

---

## 5. FIX ERROR: 'psql' NOT RECOGNIZED (WINDOWS)

Tambahkan PostgreSQL ke PATH:

```
C:\Program Files\PostgreSQL\18\bin
```

### Cara:
- Tekan `Windows + S`
- Cari: **Environment Variables**
- Klik **Edit the system environment variables**
- Klik **Environment Variables**
- Pilih **Path → Edit**
- Klik **New → paste path di atas**
- Klik OK semua

Restart CMD / Terminal lalu cek:

```bash
psql --version
```

---

## 6. RESTORE DATABASE

Contoh file backup:
```
D:\App\Pesantren\pesantren\backup.backup
```

Restore:

```bash
pg_restore -U postgres -d pesantren --no-owner --no-privileges D:\App\Pesantren\pesantren\backup.backup
```

---

## 7. FIX ERROR: ROLE DOES NOT EXIST

Kalau muncul error:
```
role "yusufyacobonaola" does not exist
```

Solusi:
```bash
pg_restore -U postgres -d pesantren --no-owner --no-privileges backup.backup
```

ATAU buat role:
```sql
CREATE ROLE yusufyacobonaola WITH LOGIN PASSWORD 'password';
```

---

## 8. GANTI KE DATABASE LOCAL

Update `.env`:

```env
DATABASE_URL="postgresql://admin:admin123@localhost:5432/pesantren"
POSTGRES_URL="postgresql://admin:admin123@localhost:5432/pesantren"
```

---

## 9. SETUP DATABASE (PRISMA)

```bash
npx prisma generate
npx prisma db push
npx prisma db seed
```

---

## 10. RUN PROJECT

```bash
npm run dev
```

---

## 11. CREATE DATABASE MANUAL

Login postgres:

```bash
psql -U postgres -d postgres
```

Buat database:

```sql
CREATE DATABASE pesantren_new;
```

Connect:

```sql
\c pesantren_new
```

Cek data:

```sql
SELECT * FROM "users" LIMIT 5;
```

---

## 12. INSERT ADMIN USER

```sql
INSERT INTO users (
    id,
    username,
    email,
    password,
    name,
    role,
    "isActive",
    "createdAt",
    "updatedAt",
    "backupCodes",
    "isUstadz",
    "phoneVerified",
    "twoFactorEnabled",
    "twoFactorSecret"
) VALUES (
    'cmhetfr940000lg6s5nlad3lm',
    'admin',
    'admin@pondokimamsyafii.com',
    '$2a$10$1lJpqzgNGZkLeN8ijszkFOY.0dDZpGLEpy00LfPN1bLPt9czeGGzi',
    'Administrator',
    'ADMIN',
    TRUE,
    '2025-10-31 12:14:40.313',
    '2025-10-31 12:14:40.313',
    '{}',
    FALSE,
    FALSE,
    FALSE,
    NULL
);
```