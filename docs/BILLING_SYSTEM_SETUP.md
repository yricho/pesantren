# SPP & Billing System Setup Guide

This document provides comprehensive instructions for setting up and using the SPP (Sumbangan Pembinaan Pendidikan) and billing system for Pondok Pesantren Imam Syafi'i.

## Features Overview

### Admin Features
- **Dashboard**: Real-time billing analytics and statistics
- **Bill Generation**: Automated and manual bill generation for students
- **Payment Management**: Record payments, verify payment proofs
- **Bill Types**: Configure different types of bills (SPP, Registration, Materials, etc.)
- **Reports**: Generate comprehensive financial reports
- **Payment Verification**: Bulk verify payment proofs from parents

### Parent Portal Features
- **Outstanding Bills**: View all unpaid bills for children
- **Payment History**: Track all payment activities
- **Upload Payment Proof**: Submit payment proofs for verification
- **Download Invoices**: Download bill invoices and receipts
- **Payment Status**: Track verification status of payments

### Key Features
- **Automated Bill Generation**: Monthly recurring bills generated automatically
- **Grade-specific Pricing**: Different rates for TK, SD, and Pondok students
- **Sibling Discounts**: Automatic discounts for families with multiple children
- **Late Payment Penalties**: Configurable penalty system
- **Payment Method Support**: Cash, bank transfer, QRIS, virtual accounts
- **Multi-level Verification**: Payment confirmation workflow
- **Comprehensive Reporting**: Financial analytics and insights

## Database Schema

### Core Tables

1. **BillType** - Configuration for different types of bills
2. **Bill** - Individual bills generated for students
3. **BillPayment** - Payment records with verification status
4. **PaymentHistory** - Audit trail for all billing activities
5. **BillingSetting** - System configuration settings
6. **PaymentReminder** - Automated reminder system
7. **BillingReport** - Generated reports and analytics

## Installation & Setup

### 1. Database Migration

First, apply the database schema changes:

```bash
# Generate Prisma client with new schema
npx prisma generate

# Run database migration
npx prisma db push

# Seed initial billing data
npx prisma db seed
```

### 2. Environment Variables

Add the following to your `.env` file:

```env
# Cron job authentication (for automated bill generation)
CRON_SECRET=your-secure-cron-secret-here

# Bank account information
BANK_NAME="Bank BCA"
BANK_ACCOUNT="1234567890"
BANK_ACCOUNT_NAME="Pondok Pesantren Imam Syafi'i"

# QRIS configuration
QRIS_CODE_URL="https://your-domain.com/qris-code.png"

# Email settings for notifications
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=finance@pondokimamsyafii.com
SMTP_PASS=your-app-password

# File upload settings
MAX_FILE_SIZE=5242880  # 5MB
UPLOAD_PATH=/uploads/payment-proofs/
```

### 3. Configure Cron Jobs (Optional)

Set up automated bill generation using cron jobs or services like Vercel Cron:

#### Using Vercel Cron (vercel.json)
```json
{
  "crons": [
    {
      "path": "/api/billing/cron/monthly-bills",
      "schedule": "0 0 1 * *"
    }
  ]
}
```

#### Using System Cron
```bash
# Edit crontab
crontab -e

# Add monthly bill generation (1st of every month at midnight)
0 0 1 * * curl -X POST -H "Authorization: Bearer YOUR_CRON_SECRET" https://your-domain.com/api/billing/cron/monthly-bills
```

## Usage Guide

### For Administrators

#### 1. Setting Up Bill Types

1. Navigate to `/spp` → "Bill Types" tab
2. Click "Add New Bill Type"
3. Configure:
   - **Name**: e.g., "SPP Bulanan", "Daftar Ulang"
   - **Category**: TUITION, REGISTRATION, MATERIAL, ACTIVITY, OTHER
   - **Pricing**: Set different amounts by grade level
   - **Recurrence**: Monthly, Quarterly, Annual, or One-time
   - **Penalties**: Configure late payment penalties
   - **Discounts**: Enable sibling and scholarship discounts

#### 2. Generating Bills

**Manual Generation:**
1. Go to `/spp` → "Generate Bills" tab
2. Select bill type and period
3. Choose target students (by institution, grade, or specific students)
4. Set due date and apply discounts
5. Click "Generate Bills"

**Automated Generation:**
- Monthly SPP bills are generated automatically on the 1st of each month
- Due date is typically set to the 15th of the same month
- Sibling discounts are applied automatically

#### 3. Managing Payments

**Recording Cash Payments:**
1. Go to `/spp` → "Dashboard"
2. Click "Record Payment"
3. Select the bill and enter payment details
4. Payment is automatically verified for cash transactions

**Verifying Payment Proofs:**
1. Navigate to `/spp` → "Payments" tab
2. Filter by "Pending Verification"
3. Review uploaded payment proofs
4. Bulk verify or reject payments
5. System automatically updates bill status

#### 4. Generating Reports

1. Go to `/spp` → "Reports" tab
2. Select report type:
   - **Monthly Collection**: Collection trends by month
   - **Outstanding Bills**: All unpaid bills with student details
   - **Payment Analysis**: Payment method breakdowns
   - **Grade-wise Collection**: Performance by institution/grade
   - **Overdue Analysis**: Late payment patterns
3. Set date range and filters
4. Generate report (available as JSON, PDF, Excel)

### For Parents

#### 1. Viewing Bills

1. Login to Parent Portal
2. Navigate to "Payments"
3. Select child (if multiple children)
4. View outstanding bills in "Outstanding Bills" tab

#### 2. Making Payments

**Bank Transfer:**
1. Transfer to: BCA 1234567890 a.n. Pondok Pesantren Imam Syafi'i
2. Include student NIS and bill number in transfer description
3. Upload payment proof via "Upload Payment Proof" button
4. Fill payment details and attach transfer receipt
5. Wait for admin verification (1-2 business days)

**QRIS Payment:**
1. Scan provided QRIS code
2. Make payment through your e-wallet
3. Upload payment proof with transaction screenshot
4. Include transaction reference number

#### 3. Tracking Payments

- **Payment History** tab shows all payment records
- **Status indicators**:
  - 🟡 Pending Verification: Proof uploaded, awaiting verification
  - 🟢 Verified: Payment confirmed and processed
  - 🔴 Rejected: Payment proof rejected (contact admin)

## API Documentation

### Key Endpoints

#### Bill Management
```http
GET    /api/billing/outstanding        # Get outstanding bills
POST   /api/billing/generate          # Generate bills
GET    /api/billing/bill-types        # Get bill types
POST   /api/billing/bill-types        # Create bill type
PUT    /api/billing/bill-types/{id}   # Update bill type
```

#### Payment Processing
```http
GET    /api/billing/payment           # Get payments
POST   /api/billing/payment           # Record payment
POST   /api/billing/verify-payments   # Bulk verify payments
```

#### Reports & Analytics
```http
GET    /api/billing/analytics/dashboard  # Dashboard statistics
POST   /api/billing/reports             # Generate reports
GET    /api/billing/reports             # List reports
GET    /api/billing/reports?reportId={id} # Get specific report
```

#### Automation
```http
POST   /api/billing/cron/monthly-bills  # Generate monthly bills (cron)
```

### Example API Usage

#### Generate Monthly SPP Bills
```javascript
const response = await fetch('/api/billing/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    billTypeId: 'spp-monthly-bill-type-id',
    period: '2024-12',
    dueDate: '2024-12-15',
    institutionTypes: ['TK', 'SD', 'PONDOK'],
    applyDiscounts: true,
    notes: 'Monthly SPP bills for December 2024'
  })
});
```

#### Record Payment
```javascript
const response = await fetch('/api/billing/payment', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    billId: 'bill-id',
    amount: 300000,
    method: 'BANK_TRANSFER',
    channel: 'BCA',
    reference: 'TXN123456789',
    autoVerify: false // Requires admin verification
  })
});
```

## Troubleshooting

### Common Issues

#### 1. Bills Not Generated Automatically
- Check cron job configuration
- Verify `CRON_SECRET` environment variable
- Check bill type configuration (must be recurring and active)
- Review application logs

#### 2. Payment Verification Issues
- Ensure user has proper permissions (ADMIN, STAFF)
- Check payment status (must be PENDING)
- Verify bill exists and is not already paid

#### 3. Grade-specific Pricing Not Working
- Check bill type's `priceByGrade` JSON format
- Ensure student's grade field matches exactly
- Verify fallback to institution type pricing

#### 4. Sibling Discounts Not Applied
- Check parents have matching phone numbers
- Verify bill type has sibling discount enabled
- Ensure `allowSiblingDiscount` is true

### Performance Optimization

#### 1. Database Indexing
Ensure these indexes exist for optimal performance:
```sql
-- Bills
CREATE INDEX idx_bills_student_status ON bills(student_id, status);
CREATE INDEX idx_bills_type_period ON bills(bill_type_id, period);
CREATE INDEX idx_bills_due_date ON bills(due_date);

-- Payments
CREATE INDEX idx_payments_verification ON bill_payments(verification_status);
CREATE INDEX idx_payments_date ON bill_payments(payment_date);

-- Students
CREATE INDEX idx_students_phones ON students(father_phone, mother_phone);
```

#### 2. Caching Strategy
- Cache bill types (rarely change)
- Cache dashboard statistics (update every 15 minutes)
- Cache payment method configurations

## Security Considerations

### 1. File Upload Security
- Validate file types (images and PDFs only)
- Limit file size (max 5MB)
- Scan uploaded files for malware
- Store files outside web root

### 2. Payment Verification
- Always require admin verification for online payments
- Log all payment activities
- Implement rate limiting for payment submissions
- Validate payment amounts against bill amounts

### 3. Data Protection
- Encrypt sensitive financial data
- Log access to payment information
- Implement role-based access controls
- Regular backup of payment data

## Support & Maintenance

### Regular Tasks
1. **Monthly**: Review outstanding bills and send reminders
2. **Quarterly**: Analyze payment patterns and adjust policies
3. **Annually**: Update bill types and pricing
4. **Ongoing**: Monitor payment verification queue

### Contact Information
- **Technical Support**: tech@pondokimamsyafii.com
- **Finance Department**: finance@pondokimamsyafii.com
- **Phone**: (031) 123-4567

---

## License

This billing system is proprietary software developed specifically for Pondok Pesantren Imam Syafi'i. All rights reserved.