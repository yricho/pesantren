# 📚 API Documentation - Pondok Imam Syafi'i System

## Base URL
```
Production: https://pesantren-coconut.vercel.app/api
Development: http://localhost:3030/api
```

## Authentication
All protected endpoints require JWT token in Authorization header:
```
Authorization: Bearer <token>
```

## Response Format
All responses follow this format:
```json
{
  "success": true|false,
  "data": {},
  "message": "Success message",
  "error": "Error message if any"
}
```

---

## 🔐 Authentication Endpoints

### POST /api/auth/signin
Login to system
```json
Request:
{
  "username": "admin",
  "password": "admin123"
}

Response:
{
  "success": true,
  "data": {
    "user": {
      "id": "123",
      "username": "admin",
      "name": "Administrator",
      "role": "SUPER_ADMIN"
    },
    "token": "jwt-token-here",
    "expiresIn": 86400
  }
}
```

### POST /api/auth/signout
Logout from system
```
Headers: Authorization: Bearer <token>
Response: { "success": true, "message": "Logged out successfully" }
```

### POST /api/auth/change-password
Change user password
```json
Request:
{
  "currentPassword": "old123",
  "newPassword": "new123"
}
```

### POST /api/auth/2fa/enable
Enable two-factor authentication
```json
Response:
{
  "success": true,
  "data": {
    "secret": "BASE32SECRET",
    "qrCode": "data:image/png;base64,...",
    "backupCodes": ["ABC123", "DEF456", ...]
  }
}
```

### POST /api/auth/2fa/verify
Verify 2FA code
```json
Request:
{
  "code": "123456"
}
```

---

## 👨‍🎓 Student Management

### GET /api/students
Get all students with pagination
```
Query Parameters:
- page: number (default: 1)
- limit: number (default: 10)
- search: string
- institutionLevel: TK|SD|SMP|PONDOK
- grade: string
- status: ACTIVE|GRADUATED|INACTIVE

Response:
{
  "success": true,
  "data": {
    "students": [...],
    "total": 100,
    "page": 1,
    "totalPages": 10
  }
}
```

### GET /api/students/:id
Get single student details
```json
Response:
{
  "success": true,
  "data": {
    "id": "123",
    "nisn": "1234567890",
    "nis": "2024001",
    "fullName": "Ahmad Ibrahim",
    "grade": "7A",
    "institutionLevel": "SMP",
    "status": "ACTIVE",
    "birthDate": "2010-05-15",
    "gender": "MALE",
    "address": "...",
    "parents": [...],
    "bills": [...],
    "attendance": [...],
    "grades": [...]
  }
}
```

### POST /api/students
Create new student
```json
Request:
{
  "nisn": "1234567890",
  "nis": "2024001",
  "fullName": "Ahmad Ibrahim",
  "nickname": "Ahmad",
  "birthPlace": "Blitar",
  "birthDate": "2010-05-15",
  "gender": "MALE",
  "institutionLevel": "SMP",
  "grade": "7A",
  "bloodType": "O",
  "address": "Jl. Imam Syafi'i No. 123",
  "village": "Sumberagung",
  "district": "Gandusari",
  "city": "Blitar",
  "province": "Jawa Timur",
  "postalCode": "66187",
  "email": "ahmad@example.com",
  "phone": "081234567890",
  "fatherName": "Ibrahim",
  "motherName": "Fatimah"
}
```

### PUT /api/students/:id
Update student data
```json
Request: Same as POST but partial updates allowed
```

### DELETE /api/students/:id
Delete student (soft delete)

### POST /api/students/bulk-import
Import students from Excel/CSV
```
Form Data:
- file: Excel/CSV file
- institutionLevel: TK|SD|SMP|PONDOK

Response:
{
  "success": true,
  "data": {
    "imported": 50,
    "failed": 2,
    "errors": [...]
  }
}
```

---

## 💰 SPP & Billing

### GET /api/bills
Get all bills
```
Query Parameters:
- studentId: string
- type: SPP|UANG_GEDUNG|SERAGAM|KITAB|ASRAMA|KEGIATAN|OTHER
- status: PENDING|PAID|OVERDUE|CANCELLED
- month: number (1-12)
- year: number
- dueDate: ISO date
```

### POST /api/bills/generate
Generate monthly SPP bills
```json
Request:
{
  "month": 12,
  "year": 2024,
  "institutionLevel": "SMP",
  "grade": "7A",
  "amount": 500000
}

Response:
{
  "success": true,
  "data": {
    "generated": 30,
    "total": 15000000
  }
}
```

### GET /api/bills/:id
Get bill details with payment history

### PUT /api/bills/:id/pay
Mark bill as paid
```json
Request:
{
  "paymentMethod": "CASH|TRANSFER|ONLINE",
  "paidAmount": 500000,
  "paymentDate": "2024-12-05",
  "receiptNumber": "RCP2024120001",
  "notes": "Paid via BCA transfer"
}
```

### POST /api/bills/send-reminders
Send payment reminders via WhatsApp
```json
Request:
{
  "billIds": ["123", "456"],
  "message": "Custom reminder message (optional)"
}
```

---

## 📖 Hafalan (Quran Memorization)

### GET /api/hafalan/sessions
Get hafalan sessions
```
Query Parameters:
- studentId: string
- teacherId: string
- surahId: number
- status: MEMORIZING|REVISION|COMPLETED
- date: ISO date
```

### POST /api/hafalan/sessions
Create hafalan session
```json
Request:
{
  "studentId": "123",
  "teacherId": "456",
  "surahId": 1,
  "startVerse": 1,
  "endVerse": 7,
  "type": "NEW|REVISION",
  "quality": "EXCELLENT|GOOD|FAIR|POOR",
  "notes": "Tajwid needs improvement"
}
```

### GET /api/hafalan/progress/:studentId
Get student hafalan progress
```json
Response:
{
  "success": true,
  "data": {
    "totalSurahs": 114,
    "completedSurahs": 30,
    "inProgressSurahs": 5,
    "totalVerses": 6236,
    "memorizedVerses": 604,
    "percentage": 9.7,
    "recentSessions": [...],
    "chartData": [...]
  }
}
```

---

## 📚 Academic

### GET /api/academic/classes
Get all classes
```
Query Parameters:
- institutionLevel: TK|SD|SMP
- academicYearId: string
```

### GET /api/academic/subjects
Get all subjects
```
Query Parameters:
- category: UMUM|AGAMA|MUATAN_LOKAL
- institutionLevel: TK|SD|SMP
```

### GET /api/academic/schedules
Get class schedules
```
Query Parameters:
- classId: string
- day: MONDAY|TUESDAY|...|SUNDAY
- teacherId: string
```

### POST /api/academic/attendance
Record attendance
```json
Request:
{
  "classId": "123",
  "date": "2024-12-05",
  "attendance": [
    {
      "studentId": "456",
      "status": "PRESENT|ABSENT|LATE|SICK|EXCUSED"
    }
  ]
}
```

### POST /api/academic/grades
Input student grades
```json
Request:
{
  "studentId": "123",
  "subjectId": "456",
  "semesterId": "789",
  "type": "DAILY|MID|FINAL|ASSIGNMENT",
  "score": 85,
  "notes": "Good performance"
}
```

---

## 📝 PPDB (Student Registration)

### POST /api/ppdb/register
Submit new registration
```json
Request:
{
  "institutionLevel": "SD",
  "fullName": "Ahmad Ibrahim",
  "birthDate": "2017-05-15",
  "gender": "MALE",
  "previousSchool": "TK Islam Blitar",
  "fatherName": "Ibrahim",
  "fatherOccupation": "Wiraswasta",
  "motherName": "Fatimah",
  "motherOccupation": "Ibu Rumah Tangga",
  "phone": "081234567890",
  "email": "parent@example.com",
  "address": "...",
  "documents": {
    "birthCertificate": "base64...",
    "familyCard": "base64...",
    "photo": "base64..."
  }
}
```

### GET /api/ppdb/applications
Get PPDB applications (Admin only)
```
Query Parameters:
- status: DRAFT|SUBMITTED|REVIEW|INTERVIEW|ACCEPTED|REJECTED
- institutionLevel: TK|SD|SMP
- year: number
```

### PUT /api/ppdb/applications/:id/status
Update application status (Admin only)
```json
Request:
{
  "status": "ACCEPTED",
  "notes": "Congratulations!",
  "interviewDate": "2024-12-10"
}
```

---

## 💸 Payments

### POST /api/payment/create
Create payment transaction
```json
Request:
{
  "billId": "123",
  "amount": 500000,
  "paymentMethod": "bank_transfer|gopay|ovo|dana",
  "customerDetails": {
    "firstName": "Ahmad",
    "lastName": "Ibrahim",
    "email": "ahmad@example.com",
    "phone": "081234567890"
  }
}

Response:
{
  "success": true,
  "data": {
    "transactionId": "TRX123",
    "orderId": "ORD123",
    "paymentUrl": "https://app.midtrans.com/snap/...",
    "vaNumber": "8812345678",
    "expiryTime": "2024-12-06T10:00:00Z"
  }
}
```

### POST /api/payments/notification
Midtrans webhook for payment notification
```json
Request: (From Midtrans)
{
  "transaction_time": "2024-12-05T10:00:00Z",
  "transaction_status": "settlement",
  "transaction_id": "TRX123",
  "order_id": "ORD123",
  "gross_amount": "500000.00",
  "payment_type": "bank_transfer"
}
```

### GET /api/payments/status/:orderId
Check payment status
```json
Response:
{
  "success": true,
  "data": {
    "status": "PENDING|SUCCESS|FAILED|EXPIRED",
    "paidAt": "2024-12-05T10:00:00Z",
    "amount": 500000,
    "paymentMethod": "bank_transfer"
  }
}
```

---

## 📧 Notifications

### POST /api/notifications/send
Send notification to users
```json
Request:
{
  "recipients": ["userId1", "userId2"],
  "channels": ["EMAIL", "WHATSAPP", "SMS", "PUSH"],
  "subject": "Payment Reminder",
  "message": "Your SPP payment is due",
  "templateId": "payment_reminder",
  "data": {
    "amount": 500000,
    "dueDate": "2024-12-10"
  }
}
```

### GET /api/notifications
Get user notifications
```
Query Parameters:
- userId: string
- read: boolean
- type: PAYMENT|ACADEMIC|ANNOUNCEMENT|SYSTEM
```

### PUT /api/notifications/:id/read
Mark notification as read

### POST /api/notifications/subscribe
Subscribe to push notifications
```json
Request:
{
  "subscription": {
    "endpoint": "https://fcm.googleapis.com/...",
    "keys": {
      "p256dh": "...",
      "auth": "..."
    }
  }
}
```

---

## 📊 Reports & Analytics

### GET /api/reports/financial
Get financial reports
```
Query Parameters:
- startDate: ISO date
- endDate: ISO date
- type: INCOME|EXPENSE|DONATION
- groupBy: DAY|MONTH|YEAR
```

### GET /api/reports/academic
Get academic performance reports
```
Query Parameters:
- classId: string
- subjectId: string
- semesterId: string
```

### GET /api/reports/attendance
Get attendance reports
```
Query Parameters:
- classId: string
- studentId: string
- month: number
- year: number
```

### GET /api/analytics/dashboard
Get dashboard analytics
```json
Response:
{
  "success": true,
  "data": {
    "totalStudents": 500,
    "totalTeachers": 50,
    "totalRevenue": 250000000,
    "monthlyGrowth": 5.2,
    "attendanceRate": 95.8,
    "paymentRate": 87.3,
    "recentActivities": [...],
    "charts": {
      "revenue": [...],
      "enrollment": [...],
      "attendance": [...]
    }
  }
}
```

---

## 🔧 Admin Operations

### GET /api/users
Get all users (Admin only)
```
Query Parameters:
- role: SUPER_ADMIN|ADMIN|USTADZ|STAFF|PARENT
- active: boolean
```

### POST /api/users
Create new user (Admin only)
```json
Request:
{
  "username": "newuser",
  "password": "password123",
  "name": "New User",
  "email": "user@example.com",
  "role": "STAFF",
  "phone": "081234567890"
}
```

### PUT /api/users/:id
Update user (Admin only)

### DELETE /api/users/:id
Deactivate user (Admin only)

### POST /api/backup
Create database backup (Super Admin only)
```json
Response:
{
  "success": true,
  "data": {
    "filename": "backup-2024-12-05.sql",
    "size": "25MB",
    "url": "/api/backup/download/backup-2024-12-05.sql"
  }
}
```

### POST /api/restore
Restore from backup (Super Admin only)
```
Form Data:
- file: SQL backup file
```

---

## 🌐 Public Endpoints (No Auth Required)

### GET /api/public/announcements
Get public announcements

### GET /api/public/activities
Get public activities/events

### GET /api/public/gallery
Get public gallery images

### GET /api/public/kajian
Get public kajian videos

### GET /api/public/donation-campaigns
Get active donation campaigns

### POST /api/public/donation
Submit public donation
```json
Request:
{
  "campaignId": "123",
  "amount": 100000,
  "donorName": "Hamba Allah",
  "donorEmail": "donor@example.com",
  "donorPhone": "081234567890",
  "message": "Semoga bermanfaat"
}
```

---

## 📤 Export Endpoints

### GET /api/export/students
Export students to Excel
```
Query Parameters:
- institutionLevel: TK|SD|SMP|PONDOK
- format: xlsx|csv
```

### GET /api/export/bills
Export bills to Excel
```
Query Parameters:
- month: number
- year: number
- status: PENDING|PAID|OVERDUE
```

### GET /api/export/attendance
Export attendance to Excel
```
Query Parameters:
- classId: string
- month: number
- year: number
```

---

## 🔄 Webhook Endpoints

### POST /api/whatsapp/webhook
WhatsApp Business API webhook

### POST /api/payments/webhook/midtrans
Midtrans payment webhook

### POST /api/sms/webhook
SMS gateway webhook

---

## Error Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Invalid token |
| 403 | Forbidden - Insufficient permissions |
| 404 | Not Found - Resource not found |
| 409 | Conflict - Duplicate resource |
| 422 | Unprocessable Entity - Validation error |
| 429 | Too Many Requests - Rate limited |
| 500 | Internal Server Error |
| 503 | Service Unavailable |

---

## Rate Limiting

API implements rate limiting:
- Public endpoints: 100 requests/minute
- Authenticated endpoints: 1000 requests/minute
- Export endpoints: 10 requests/minute
- Bulk operations: 5 requests/minute

Headers:
```
X-RateLimit-Limit: 1000
X-RateLimit-Remaining: 999
X-RateLimit-Reset: 1701792000
```

---

## Pagination

All list endpoints support pagination:
```
GET /api/students?page=2&limit=20

Response Headers:
X-Total-Count: 500
X-Page-Count: 25
X-Current-Page: 2
X-Per-Page: 20
```

---

## Filtering & Sorting

Most endpoints support filtering and sorting:
```
GET /api/students?
  search=Ahmad&
  institutionLevel=SMP&
  grade=7A&
  status=ACTIVE&
  sortBy=fullName&
  sortOrder=asc
```

---

## WebSocket Events (Real-time)

Connect to: `wss://your-domain.com/socket`

Events:
- `payment:received` - Payment confirmed
- `notification:new` - New notification
- `attendance:marked` - Attendance updated
- `grade:updated` - Grade changed
- `announcement:new` - New announcement

---

## API Testing

Use these tools for testing:
- Postman Collection: [Download](https://api.postman.com/collections/...)
- Swagger UI: https://your-domain.com/api-docs
- cURL examples included in each endpoint

---

## Support

For API support:
- Email: api-support@pesantren-coconut.sch.id
- Documentation: https://docs.pesantren-coconut.sch.id
- GitHub Issues: https://github.com/pendtiumpraz/pesantren-coconut/issues