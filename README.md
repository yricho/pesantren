# 🕌 Pondok Imam Syafi'i Blitar - Management System

[![Deploy Status](https://img.shields.io/badge/deploy-vercel-success)](https://imam-syafii-blitar-ilpnd0xs2-pendtiumprazs-projects.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Sistem manajemen terpadu untuk Pondok Pesantren Imam Syafi'i Blitar dengan fitur pendaftaran santri online (PPDB), pembayaran SPP, manajemen siswa & alumni, donasi online, unit usaha yayasan, dan perpustakaan digital.

🔗 **Live Demo**: [https://imam-syafii-blitar.vercel.app](https://imam-syafii-blitar-ilpnd0xs2-pendtiumprazs-projects.vercel.app)

## 📊 Project Status & Roadmap Progress

### ✅ Completed Features (Phase 1-2)
- [x] **Core Foundation**
  - [x] Next.js 14 dengan App Router
  - [x] NextAuth authentication
  - [x] Prisma + PostgreSQL (Prisma Accelerate)
  - [x] Deploy ke Vercel
  - [x] Responsive UI dengan Tailwind CSS

- [x] **Basic Features** 
  - [x] Dashboard dengan statistik real-time
  - [x] Manajemen Siswa (TK, SD, Pondok)
  - [x] Manajemen Alumni dengan event tracking
  - [x] Video Kajian dengan copy-paste feature
  - [x] Sidebar navigation untuk semua halaman

### 🚧 In Development (Current Sprint)
- [ ] **PPDB Online** (Phase 3) - 0% 
  - [ ] Form pendaftaran multi-step
  - [ ] Upload dokumen
  - [ ] Tracking status real-time
  - [ ] Seleksi & pengumuman

- [ ] **Payment System** (Phase 4) - 0%
  - [ ] SPP & billing otomatis
  - [ ] Payment gateway (Midtrans/Xendit)
  - [ ] Virtual Account
  - [ ] Laporan keuangan

### 📅 Upcoming Features (Next 2 Months)
- **Phase 5**: Financial Management
- **Phase 6**: Donation & Fundraising Portal
- **Phase 7**: Unit Usaha Yayasan (Koperasi, Kantin)
- **Phase 8**: Academic Features (Nilai, Raport)

### 🎯 Full Roadmap
Lihat [ROADMAP.md](ROADMAP.md) untuk 15 phase development lengkap.

## 🌟 Main Features

### 📚 Modul Pendidikan
- **Data Siswa**: Management siswa TK, SD, dan Pondok
- **Data Alumni**: Database alumni untuk networking
- **Kurikulum**: Integrasi kurikulum formal & diniyah
- **Nilai & Raport**: System penilaian digital
- **Perpustakaan**: E-book dan kitab digital

### 💰 Modul Keuangan
- **SPP**: Billing otomatis dengan reminder
- **Pembayaran**: Multiple payment gateway
- **Donasi**: Portal donasi & wakaf online
- **Laporan**: Financial reporting real-time

### 🏢 Modul Operasional
- **PPDB Online**: Pendaftaran santri baru
- **Kegiatan**: Dokumentasi acara & event
- **Video Kajian**: Library video pembelajaran
- **Unit Usaha**: Koperasi, kantin, katering

### 👥 Modul Pengguna
- **Multi-role**: Admin, Staff, Guru, Orang Tua
- **Parent Portal**: Monitoring progress anak
- **Teacher Portal**: Input nilai & absensi
- **Student Portal**: Akses materi & tugas

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL atau Prisma Accelerate account
- Git

### Installation

```bash
# Clone repository
git clone https://github.com/pendtiumpraz/imam-syafii-blitar.git
cd imam-syafii-blitar

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env.local
# Edit .env.local dengan credentials Anda

# Setup database
npx prisma generate
npx prisma db push

# Run development server
npm run dev
```

Buka [http://localhost:3030](http://localhost:3030)

### Environment Variables

```env
# Database (Prisma Accelerate)
DATABASE_URL="postgres://..."
POSTGRES_URL="postgres://..."
PRISMA_DATABASE_URL="prisma+postgres://..."

# NextAuth
NEXTAUTH_URL="https://your-domain.vercel.app"
NEXTAUTH_SECRET="min-32-characters"

# Optional: Google OAuth
GOOGLE_CLIENT_ID="..."
GOOGLE_CLIENT_SECRET="..."

# Optional: Payment Gateway
MIDTRANS_SERVER_KEY="..."
MIDTRANS_CLIENT_KEY="..."
```

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React, Heroicons
- **Animation**: Framer Motion

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js
- **File Storage**: Cloudinary (planned)
- **Email**: Resend/SendGrid (planned)

### Infrastructure
- **Hosting**: Vercel
- **Database**: Prisma Accelerate
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics

## 📁 Project Structure

```
pondok-imam-syafii/
├── src/
│   ├── app/
│   │   ├── (authenticated)/    # Protected pages with sidebar
│   │   │   ├── dashboard/
│   │   │   ├── siswa/
│   │   │   ├── alumni/
│   │   │   ├── keuangan/
│   │   │   ├── kajian/
│   │   │   └── ...
│   │   ├── api/                # API endpoints
│   │   ├── auth/               # Auth pages
│   │   └── page.tsx            # Public homepage
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   ├── ui/                # Reusable UI components
│   │   └── ...
│   ├── lib/                   # Utilities
│   └── types/                 # TypeScript types
├── prisma/
│   └── schema.prisma          # Database schema
├── public/                    # Static assets
├── docs/                      # Documentation
│   ├── PPDB_SYSTEM_DESIGN.md
│   └── PAYMENT_SYSTEM_DESIGN.md
└── ROADMAP.md                 # Development roadmap
```

## 🧪 Testing

```bash
# Run tests (coming soon)
npm run test
npm run test:e2e
npm run test:coverage
```

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. Push code ke GitHub
2. Import project di Vercel
3. Set environment variables
4. Deploy!

Lihat [DEPLOY_VERCEL.md](DEPLOY_VERCEL.md) untuk panduan lengkap.

### Build for Production

```bash
# Build
npm run build

# Start production server
npm run start
```

## 📚 Documentation

- [ROADMAP.md](ROADMAP.md) - 15 phase development plan
- [PPDB System Design](docs/PPDB_SYSTEM_DESIGN.md) - Registration system
- [Payment System Design](docs/PAYMENT_SYSTEM_DESIGN.md) - Payment integration
- [Deployment Guide](DEPLOY_VERCEL.md) - Vercel deployment

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📊 Progress Tracker

| Module | Status | Progress |
|--------|--------|----------|
| Core System | ✅ Complete | 100% |
| Student Management | ✅ Complete | 100% |
| Alumni Management | ✅ Complete | 100% |
| Video Kajian | ✅ Complete | 100% |
| PPDB Online | 🚧 In Progress | 0% |
| Payment System | 📅 Planned | 0% |
| Financial Management | 📅 Planned | 0% |
| Donation Portal | 📅 Planned | 0% |
| Unit Usaha | 📅 Planned | 0% |
| Academic Features | 📅 Planned | 0% |
| Parent Portal | 📅 Planned | 0% |
| Mobile App (PWA) | 📅 Planned | 0% |

## 🔒 Security

- Authentication dengan NextAuth.js
- Password hashing dengan bcrypt
- Session management dengan JWT
- Input validation dengan Zod
- SQL injection protection dengan Prisma ORM
- XSS protection dengan React

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs](https://github.com/pendtiumpraz/imam-syafii-blitar/issues)
- **Discussions**: [Ask questions](https://github.com/pendtiumpraz/imam-syafii-blitar/discussions)
- **Email**: admin@pondok-imam-syafii.id

## 📄 License

This project is licensed under the MIT License - see [LICENSE](LICENSE) file.

## 🙏 Acknowledgments

- Pondok Pesantren Imam Syafi'i Blitar
- Next.js team for the amazing framework
- Vercel for hosting
- Prisma for database toolkit
- All contributors

---

**Made with ❤️ for Pondok Pesantren Imam Syafi'i Blitar**

*Last updated: December 2024 - Version 1.0.0*