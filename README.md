# 🕌 Pondok Imam Syafi'i Blitar - Management System

[![Deploy Status](https://img.shields.io/badge/deploy-vercel-success)](https://imam-syafii-blitar-ilpnd0xs2-pendtiumprazs-projects.vercel.app)
[![Next.js](https://img.shields.io/badge/Next.js-14-black)](https://nextjs.org)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748)](https://www.prisma.io/)
[![License](https://img.shields.io/badge/license-MIT-green.svg)](LICENSE)

Sistem manajemen terpadu untuk Pondok Pesantren Imam Syafi'i Blitar dengan fitur pendaftaran santri online (PPDB), pembayaran SPP, manajemen siswa & alumni, donasi online, unit usaha yayasan, dan perpustakaan digital.

🔗 **Live Demo**: [https://imam-syafii-blitar.vercel.app](https://imam-syafii-blitar-ilpnd0xs2-pendtiumprazs-projects.vercel.app)

## 📊 Project Status & Roadmap Progress

### ✅ Completed Features (Phase 1-4)
- [x] **Core Foundation**
  - [x] Next.js 14 dengan App Router
  - [x] NextAuth authentication dengan multi-role
  - [x] Prisma + PostgreSQL (Prisma Accelerate)
  - [x] Deploy ke Vercel
  - [x] Responsive UI dengan Tailwind CSS
  - [x] TypeScript strict mode

- [x] **Student & Academic Management** 
  - [x] Dashboard dengan statistik real-time
  - [x] Manajemen Siswa (TK, SD, Pondok) dengan CRUD lengkap
  - [x] Manajemen Alumni dengan event tracking
  - [x] Academic system (Classes, Subjects, Schedules)
  - [x] Attendance tracking system
  - [x] Grade management & report cards
  - [x] Academic years & semesters

- [x] **Financial Management**
  - [x] Transaction management (Income, Expense, Donation)
  - [x] Financial categories & accounts
  - [x] Donation campaigns
  - [x] Financial reports & analytics
  - [x] Budget tracking

- [x] **Hafalan Al-Quran System**
  - [x] Hafalan progress tracking
  - [x] Setoran system dengan recording
  - [x] Statistics & achievements
  - [x] Teacher evaluation system
  - [x] Student rankings

- [x] **Business Management**
  - [x] Product management
  - [x] Inventory tracking
  - [x] Sales & purchase orders
  - [x] Stock management
  - [x] Supplier management

- [x] **Media & Content**
  - [x] Video Kajian dengan copy-paste feature
  - [x] E-book library
  - [x] Activity documentation
  - [x] Course management

### 🚧 In Development (Current Sprint - 30 Aug 2025)
- [ ] **User Management System** - 20%
  - [x] Multi-role support (SUPER_ADMIN, ADMIN, USTADZ, STAFF)
  - [x] User CRUD API endpoints
  - [ ] User management UI pages
  - [ ] Role-based access control
  - [ ] Password management

- [ ] **Edit Functionality** - 0%
  - [ ] Edit forms for all existing pages
  - [ ] Inline editing where applicable
  - [ ] Batch editing support

- [ ] **Settings & Profile** - 0%
  - [ ] User profile management
  - [ ] Change password functionality
  - [ ] System settings
  - [ ] Notification preferences

- [ ] **Public Landing Page** - 0%
  - [ ] Elegant homepage design
  - [ ] Profile Yayasan page
  - [ ] Unit Usaha showcase
  - [ ] Visi & Misi section
  - [ ] Program Donasi display
  - [ ] Profile Pondok, TK, SD pages
  - [ ] Teacher profiles
  - [ ] Student/Alumni statistics
  - [ ] Digital library access
  - [ ] Activity documentation gallery
  - [ ] Kajian documentation
  - [ ] Responsive navbar
  - [ ] Mobile-first design

### 📅 Upcoming Features (Next Phase)
- **Phase 5**: PPDB Online System
- **Phase 6**: Payment Gateway Integration
- **Phase 7**: Parent & Student Portal
- **Phase 8**: Mobile App (PWA)
- **Phase 9**: Advanced Analytics & AI
- **Phase 10**: Integration with Government Systems

### 🎯 Full Roadmap
Lihat [ROADMAP.md](ROADMAP.md) untuk 15 phase development lengkap.

## 🌟 Main Features

### 📚 Modul Pendidikan
- **Data Siswa**: Management siswa TK, SD, dan Pondok dengan foto & dokumen
- **Data Alumni**: Database alumni untuk networking & tracking
- **Kurikulum**: Integrasi kurikulum formal & diniyah
- **Nilai & Raport**: System penilaian digital dengan export PDF
- **Hafalan**: Tracking hafalan Al-Quran dengan setoran online
- **Perpustakaan**: E-book dan kitab digital dengan reader

### 💰 Modul Keuangan
- **SPP**: Billing otomatis dengan reminder WhatsApp
- **Pembayaran**: Multiple payment gateway (coming soon)
- **Donasi**: Portal donasi & wakaf online dengan campaign
- **Laporan**: Financial reporting real-time dengan export Excel
- **Budget**: Budget planning & tracking

### 🏢 Modul Operasional
- **PPDB Online**: Pendaftaran santri baru (coming soon)
- **Kegiatan**: Dokumentasi acara & event dengan gallery
- **Video Kajian**: Library video pembelajaran dengan streaming
- **Unit Usaha**: Koperasi, kantin, katering dengan POS
- **Inventory**: Stock management dengan barcode

### 👥 Modul Pengguna
- **Multi-role**: SUPER_ADMIN, ADMIN, USTADZ, STAFF, PARENT
- **Parent Portal**: Monitoring progress anak (coming soon)
- **Teacher Portal**: Input nilai & absensi
- **Student Portal**: Akses materi & tugas (coming soon)
- **User Management**: Complete user CRUD with role management

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
npx prisma db seed

# Run development server
npm run dev
```

Buka [http://localhost:3030](http://localhost:3030)

### Default Login Credentials
```
Username: admin
Password: admin123

Username: staff
Password: staff123
```

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

# Optional: Payment Gateway (Coming Soon)
MIDTRANS_SERVER_KEY="..."
MIDTRANS_CLIENT_KEY="..."

# Optional: WhatsApp API (Coming Soon)
WA_API_KEY="..."
```

## 🏗️ Tech Stack

### Frontend
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI, shadcn/ui
- **Icons**: Lucide React, Heroicons
- **Animation**: Framer Motion
- **Charts**: Recharts
- **Forms**: React Hook Form + Zod

### Backend
- **API**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Auth**: NextAuth.js with JWT
- **File Storage**: Cloudinary (planned)
- **Email**: Resend/SendGrid (planned)
- **WhatsApp**: Fonnte/Wablas (planned)

### Infrastructure
- **Hosting**: Vercel
- **Database**: Prisma Accelerate
- **CDN**: Vercel Edge Network
- **Monitoring**: Vercel Analytics
- **Error Tracking**: Sentry (planned)

## 📁 Project Structure

```
pondok-imam-syafii/
├── src/
│   ├── app/
│   │   ├── (authenticated)/    # Protected pages with sidebar
│   │   │   ├── dashboard/
│   │   │   ├── siswa/
│   │   │   ├── alumni/
│   │   │   ├── academic/
│   │   │   ├── hafalan/
│   │   │   ├── keuangan/
│   │   │   ├── business/
│   │   │   ├── kajian/
│   │   │   ├── users/         # User management (NEW)
│   │   │   ├── settings/      # Settings page (NEW)
│   │   │   └── ...
│   │   ├── (public)/          # Public pages (NEW)
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── about/
│   │   │   ├── programs/
│   │   │   └── ...
│   │   ├── api/               # API endpoints
│   │   ├── auth/              # Auth pages
│   │   └── layout.tsx
│   ├── components/
│   │   ├── layout/            # Layout components
│   │   ├── ui/                # Reusable UI components
│   │   ├── forms/             # Form components
│   │   └── ...
│   ├── lib/                   # Utilities
│   └── types/                 # TypeScript types
├── prisma/
│   ├── schema.prisma          # Database schema
│   └── seed.ts                # Database seeder
├── public/                    # Static assets
├── docs/                      # Documentation
└── ROADMAP.md                 # Development roadmap
```

## 🧪 Testing

```bash
# Run tests
npm run test
npm run test:e2e
npm run test:coverage

# Type checking
npm run type-check

# Linting
npm run lint
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
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment guide
- [USER-MANUAL.md](USER-MANUAL.md) - User manual
- [API Documentation](docs/api/) - API endpoints reference

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
| Academic System | ✅ Complete | 100% |
| Hafalan System | ✅ Complete | 100% |
| Financial Management | ✅ Complete | 100% |
| Business Management | ✅ Complete | 100% |
| Video Kajian | ✅ Complete | 100% |
| User Management | 🚧 In Progress | 20% |
| Edit Functionality | 🚧 In Progress | 0% |
| Settings Page | 🚧 In Progress | 0% |
| Public Landing Page | 🚧 In Progress | 0% |
| PPDB Online | 📅 Planned | 0% |
| Payment Gateway | 📅 Planned | 0% |
| Parent Portal | 📅 Planned | 0% |
| Mobile App (PWA) | 📅 Planned | 0% |

## 🔒 Security

- Authentication dengan NextAuth.js
- Password hashing dengan bcrypt
- Session management dengan JWT
- Role-based access control (RBAC)
- Input validation dengan Zod
- SQL injection protection dengan Prisma ORM
- XSS protection dengan React
- CSRF protection
- Rate limiting (planned)

## 📞 Support & Contact

- **GitHub Issues**: [Report bugs](https://github.com/pendtiumpraz/imam-syafii-blitar/issues)
- **Discussions**: [Ask questions](https://github.com/pendtiumpraz/imam-syafii-blitar/discussions)
- **Email**: admin@pondok-imam-syafii.id
- **WhatsApp**: +62 xxx-xxxx-xxxx

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

*Last updated: 30 August 2025 - Version 2.0.0*