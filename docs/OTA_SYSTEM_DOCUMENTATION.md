# OTA (Orang Tua Asuh) System Documentation

## Overview

The OTA (Orang Tua Asuh) System is a comprehensive donation platform designed to connect donors with orphan students at Pondok Imam Syafii. The system allows administrators to manage orphan students, track their needs, and facilitate transparent donations from the public.

## System Architecture

### Database Models

#### 1. Student Model (Updated)
- **New Fields:**
  - `isOrphan`: Boolean flag to mark students as orphans
  - `monthlyNeeds`: Decimal amount representing monthly financial needs
  - `otaProfile`: Text description for public display (anonymized)

#### 2. OTAProgram Model
- **Purpose**: Manages individual OTA programs for each orphan student
- **Key Fields:**
  - `studentId`: Reference to the orphan student
  - `monthlyTarget`: Monthly fundraising goal
  - `currentMonth`: Current month being funded (YYYY-MM format)
  - `totalCollected`: Total amount collected all time
  - `monthlyProgress`: Amount collected for current month
  - `monthsCompleted`: Number of months fully funded
  - `displayOrder`: Order for public display
  - `isActive`: Program status

#### 3. OTASponsor Model
- **Purpose**: Records individual donations/sponsorships
- **Key Fields:**
  - `donorName`: Real name (admin only)
  - `publicName`: Display name for public ("Hamba Allah")
  - `amount`: Donation amount
  - `month`: Month this donation is for
  - `isPaid`: Payment verification status
  - `paymentStatus`: PENDING, PAID, VERIFIED, FAILED
  - `allowPublicDisplay`: Privacy setting

#### 4. OTAReport Model
- **Purpose**: Monthly financial reports and statistics
- **Key Fields:**
  - `month`: Report period (YYYY-MM)
  - `totalTarget`: Total monthly target for all orphans
  - `totalCollected`: Total amount collected
  - `totalDistributed`: Total amount distributed
  - `details`: JSON breakdown by student
  - `carryOverAmount`: Amount from previous month

## Features

### 1. Admin Management Features

#### Student Management
- **Mark as Orphan**: Toggle orphan status for students
- **Set Monthly Needs**: Configure financial requirements
- **OTA Profile**: Create public-friendly descriptions
- **Grade Promotion**: 
  - TK: RA-A → RA-B → Graduate
  - SD: Kelas 1-6 → Graduate  
  - Pondok: Flexible promotion or direct graduation

#### Program Management
- **Create Programs**: Initialize OTA programs for orphans
- **Monitor Progress**: Track monthly funding progress
- **Manage Sponsors**: View and verify donations
- **Generate Reports**: Create monthly financial reports

#### Financial Tracking
- **Real-time Statistics**: Live dashboard with funding metrics
- **Donor Management**: Record and verify payments
- **Monthly Reports**: Automated report generation
- **Carry-over Tracking**: Handle surplus funds between months

### 2. Public Donation Features

#### Student Discovery
- **Anonymous Profiles**: Students shown with initials only
- **Institution Filter**: Filter by TK, SD, or Pondok
- **Progress Tracking**: Visual progress bars and funding status
- **Achievement Display**: Show student accomplishments (hafalan, awards)

#### Donation Process
- **Flexible Amounts**: Minimum Rp 10,000 with quick-select options
- **Multiple Payment Methods**: 
  - Bank Transfer
  - QRIS
  - E-Wallet (GoPay, OVO, DANA)
  - Virtual Account
- **Anonymous Options**: Donors can choose to remain anonymous
- **Personal Messages**: Optional messages to students

#### Transparency Features
- **Real-time Progress**: Live funding updates
- **Donor Recognition**: Public donor wall (anonymized)
- **Monthly Statistics**: Overall program metrics
- **Recent Donations**: Latest contributions display

### 3. Security & Privacy

#### Data Protection
- **Student Anonymity**: No real names or photos on public pages
- **Donor Privacy**: Optional anonymous donations
- **Secure Payments**: Encrypted payment processing
- **Access Control**: Role-based admin permissions

#### Financial Security
- **Payment Verification**: Manual verification process
- **Audit Trail**: Complete transaction history
- **Monthly Reconciliation**: Automated report generation
- **Fraud Prevention**: Payment validation and monitoring

## API Endpoints

### Admin Endpoints

#### OTA Program Management
- `GET /api/ota/admin` - List all OTA programs
- `POST /api/ota/admin` - Create new OTA program
- `PUT /api/ota/admin` - Update OTA program
- `DELETE /api/ota/admin` - Delete OTA program

#### Sponsor Management
- `GET /api/ota/sponsors` - List sponsors with filters
- `POST /api/ota/sponsors` - Add manual donation
- `PUT /api/ota/sponsors` - Update/verify sponsor
- `DELETE /api/ota/sponsors` - Remove sponsor

#### Student Management
- `GET /api/students/ota` - List orphan candidates
- `PUT /api/students/ota` - Update orphan status
- `POST /api/students/promote` - Promote/graduate students
- `GET /api/students/promote` - Get promotion options

#### Reports
- `GET /api/ota/reports` - List monthly reports
- `POST /api/ota/reports` - Generate new report
- `PUT /api/ota/reports` - Update report status
- `DELETE /api/ota/reports` - Delete draft report

### Public Endpoints

#### Public Donation
- `GET /api/ota/public` - Get programs for donation page
- `POST /api/ota/public` - Submit public donation

### Automated Endpoints

#### Monthly Reset
- `POST /api/ota/cron/monthly-reset` - Monthly automation

## User Interface

### 1. Admin Interface (`/ota-admin`)

#### Dashboard Features
- **Statistics Cards**: Key metrics overview
- **Tabbed Navigation**: Programs, Students, Reports
- **Advanced Filters**: Institution, status, search
- **Real-time Updates**: Live progress tracking

#### Program Management
- **Student Cards**: Visual program overview
- **Progress Bars**: Monthly funding visualization
- **Donor Lists**: Sponsor management
- **Quick Actions**: Edit, promote, view details

#### Student Management
- **Orphan Listing**: Students needing programs
- **Status Toggle**: Mark/unmark as orphan
- **Program Creation**: Initialize OTA programs
- **Grade Promotion**: Class advancement tools

### 2. Public Interface (`/donasi/ota`)

#### Hero Section
- **Program Statistics**: Total programs, targets, collected
- **Call to Action**: Clear donation invitation
- **Visual Appeal**: Gradient backgrounds and icons

#### Student Cards
- **Anonymous Display**: Initials only
- **Progress Indicators**: Visual funding status
- **Achievement Badges**: Hafalan and academic success
- **Donor Recognition**: Recent contributor display

#### Donation Modal
- **Multi-step Process**: Form → Payment → Confirmation
- **Payment Options**: Multiple methods supported
- **Quick Amounts**: Pre-defined donation buttons
- **Personal Touch**: Optional messages to students

## Monthly Automation

### Automated Reset Process
1. **Report Generation**: Create report for previous month
2. **Progress Reset**: Clear monthly progress counters
3. **Month Advancement**: Update current month
4. **Carry-over Calculation**: Handle surplus funds
5. **Status Updates**: Mark completed months

### Cron Job Configuration
```bash
# Run on 1st of every month at 2 AM
0 2 1 * * curl -X POST -H "Authorization: Bearer YOUR_CRON_SECRET" 
  https://your-domain.com/api/ota/cron/monthly-reset
```

## Installation & Setup

### 1. Database Migration
```bash
# Apply schema changes
npx prisma db push

# Generate Prisma client
npx prisma generate
```

### 2. Environment Variables
```env
# Add to .env
CRON_SECRET=your-secure-cron-secret
```

### 3. Seed Sample Data
```bash
# Run OTA seed (optional for testing)
npx ts-node prisma/seeds/ota-seed.ts
```

### 4. Admin Setup
1. Access admin panel at `/ota-admin`
2. Mark students as orphans
3. Create OTA programs
4. Configure monthly targets

### 5. Public Access
- Public donation page: `/donasi/ota`
- No authentication required
- Mobile-responsive design

## Best Practices

### 1. Data Management
- **Regular Backups**: Automated database backups
- **Privacy Compliance**: GDPR/local privacy laws
- **Data Retention**: Clear retention policies
- **Access Logging**: Track admin activities

### 2. Financial Management
- **Monthly Reconciliation**: Verify all transactions
- **Receipt Generation**: Provide donation receipts
- **Tax Documentation**: Support tax-deductible donations
- **Fraud Monitoring**: Watch for suspicious patterns

### 3. Communication
- **Donor Updates**: Regular program updates
- **Transparency Reports**: Public financial reports
- **Success Stories**: Share student achievements
- **Feedback Collection**: Donor and student feedback

## Troubleshooting

### Common Issues

#### 1. Payment Verification
- **Problem**: Donations stuck in pending
- **Solution**: Check payment proofs, verify manually
- **Prevention**: Automated payment gateway integration

#### 2. Monthly Reset
- **Problem**: Cron job fails
- **Solution**: Check logs, run manual trigger
- **Prevention**: Monitor job status, setup alerts

#### 3. Data Inconsistency
- **Problem**: Progress doesn't match donations
- **Solution**: Recalculate totals, check database
- **Prevention**: Transaction integrity, regular audits

### Monitoring & Alerts
- **Payment Failures**: Alert on failed transactions
- **Progress Monitoring**: Track unusual patterns
- **System Health**: Monitor API response times
- **Database Performance**: Watch query performance

## Future Enhancements

### Planned Features
1. **SMS Notifications**: Payment confirmations
2. **Email Receipts**: Automated tax receipts
3. **Recurring Donations**: Monthly auto-donations
4. **Impact Tracking**: Student progress updates
5. **Mobile App**: Dedicated mobile application

### Integration Opportunities
1. **Payment Gateways**: Midtrans, Xendit integration
2. **Accounting Systems**: Export to accounting software
3. **Communication Tools**: WhatsApp Business API
4. **Analytics**: Google Analytics for donations
5. **Social Media**: Sharing and promotion tools

## Support & Maintenance

### Regular Tasks
- **Monthly Reports**: Generate and distribute
- **Data Cleanup**: Remove old pending donations
- **Performance Optimization**: Query optimization
- **Security Updates**: Keep dependencies updated
- **Backup Verification**: Test backup restoration

### Contact Information
- **Technical Support**: tech@pondokimamsyafii.com
- **Financial Questions**: finance@pondokimamsyafii.com
- **General Inquiries**: info@pondokimamsyafii.com

---

*Last Updated: August 2024*
*Version: 1.0*