# Two-Factor Authentication (2FA) Implementation Guide

## Overview

This document describes the comprehensive Two-Factor Authentication (2FA) system implemented for the Pondok Imam Syafi'i application. The system provides multiple authentication factors including TOTP (Time-based One-Time Password), SMS OTP, and backup codes.

## Features

### ✅ Core 2FA Features
- **TOTP Authentication**: Google Authenticator compatible
- **SMS OTP Backup**: SMS-based verification via Twilio
- **Backup Codes**: Recovery codes for account access
- **QR Code Setup**: Easy setup with authenticator apps
- **Rate Limiting**: Protection against brute force attacks
- **Security Audit Logging**: Comprehensive security event tracking
- **Session Management**: 2FA-aware session handling

### ✅ Security Features
- **Rate Limiting**: Multiple attempt protection
- **Account Lockout**: Automatic blocking after failed attempts
- **IP-based Monitoring**: Suspicious activity detection
- **Secure Secret Storage**: Encrypted TOTP secrets
- **Backup Code Consumption**: Single-use backup codes
- **Comprehensive Logging**: All security events tracked

### ✅ User Experience
- **Setup Wizard**: Step-by-step 2FA activation
- **Multiple Verification Methods**: TOTP, SMS, Backup codes
- **Backup Code Management**: Download and regenerate codes
- **Security Dashboard**: View and manage 2FA settings
- **Recovery Options**: Multiple fallback methods

## File Structure

```
src/
├── lib/
│   ├── two-factor-auth.ts          # Main 2FA service
│   ├── security-audit.ts           # Security logging service
│   ├── rate-limiter.ts             # Rate limiting utilities
│   └── auth.ts                     # Updated NextAuth configuration
├── app/
│   ├── api/auth/2fa/
│   │   ├── enable/route.ts         # Enable 2FA endpoint
│   │   ├── disable/route.ts        # Disable 2FA endpoint
│   │   ├── verify/route.ts         # Verify 2FA codes
│   │   ├── backup-codes/route.ts   # Backup codes management
│   │   ├── verify-sms/route.ts     # SMS verification
│   │   └── status/route.ts         # 2FA status check
│   └── (authenticated)/settings/
│       └── security/page.tsx       # Security settings UI
├── components/
│   └── auth/
│       └── TwoFactorVerification.tsx # 2FA verification component
└── types/
    └── next-auth.d.ts              # Extended NextAuth types
```

## Database Schema

### Updated User Model
```prisma
model User {
  // ... existing fields ...
  
  // Two-Factor Authentication fields
  twoFactorEnabled Boolean  @default(false)
  twoFactorSecret  String?
  backupCodes      String[] @default([])
  phoneVerified    Boolean  @default(false)
  
  // Relations
  twoFactorVerification TwoFactorVerification?
  securityAuditLogs     SecurityAuditLog[]
}
```

### New Models
```prisma
model TwoFactorVerification {
  id        String   @id @default(cuid())
  userId    String   @unique
  
  // SMS OTP fields
  smsOtp           String?
  smsOtpExpiresAt  DateTime?
  smsAttempts      Int @default(0)
  
  // Rate limiting fields
  totpAttempts        Int       @default(0)
  totpAttemptsResetAt DateTime?
  smsAttemptsResetAt    DateTime?
  backupAttempts        Int       @default(0)
  backupAttemptsResetAt DateTime?
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model SecurityAuditLog {
  id        String   @id @default(cuid())
  userId    String
  event     String   # Event type (TWO_FACTOR_ENABLED, etc.)
  metadata  Json?    # Additional event data
  ipAddress String   @default("unknown")
  userAgent String   @default("unknown")
  timestamp DateTime @default(now())
  
  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## API Endpoints

### 1. Enable 2FA
**POST** `/api/auth/2fa/enable`

**GET** (Setup initiation) `/api/auth/2fa/enable`
```json
{
  "secret": "JBSWY3DPEHPK3PXP",
  "qrCode": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA...",
  "manualEntryKey": "JBSWY3DPEHPK3PXP",
  "appName": "Pondok Imam Syafi'i"
}
```

**POST** (Complete setup)
```json
{
  "password": "user_password",
  "totpToken": "123456"
}
```

### 2. Disable 2FA
**POST** `/api/auth/2fa/disable`
```json
{
  "password": "user_password"
}
```

### 3. Verify 2FA Code
**POST** `/api/auth/2fa/verify`
```json
{
  "token": "123456",
  "isBackupCode": false
}
```

### 4. Backup Codes Management
**POST** `/api/auth/2fa/backup-codes` (Generate new codes)
```json
{
  "password": "user_password"
}
```

**GET** `/api/auth/2fa/backup-codes` (Get status)

### 5. SMS Verification
**POST** `/api/auth/2fa/verify-sms` (Send SMS)
```json
{
  "phoneNumber": "+1234567890",
  "action": "send"
}
```

**POST** `/api/auth/2fa/verify-sms` (Verify SMS)
```json
{
  "otp": "123456",
  "action": "verify"
}
```

### 6. 2FA Status
**GET** `/api/auth/2fa/status`
```json
{
  "enabled": true,
  "phoneVerified": false,
  "backupCodesCount": 8,
  "canDisable": true
}
```

## Environment Variables

```env
# Required for SMS functionality
TWILIO_ACCOUNT_SID="your-twilio-account-sid"
TWILIO_AUTH_TOKEN="your-twilio-auth-token"
TWILIO_SERVICE_SID="your-twilio-service-sid"

# NextAuth (existing)
NEXTAUTH_SECRET="your-nextauth-secret"
NEXTAUTH_URL="http://localhost:3030"
```

## Rate Limiting Configuration

The system implements multiple rate limiting strategies:

- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **2FA Verification**: 10 attempts per 15 minutes
- **SMS Sending**: 3 attempts per hour
- **Account Lockout**: 1 attempt per hour after multiple failures

## Security Event Types

The system tracks the following security events:

- `TWO_FACTOR_ENABLED` - 2FA activated
- `TWO_FACTOR_DISABLED` - 2FA deactivated
- `TWO_FACTOR_SUCCESS` - Successful 2FA verification
- `TWO_FACTOR_FAILURE` - Failed 2FA verification
- `BACKUP_CODE_USED` - Backup code consumed
- `SMS_OTP_SENT` - SMS verification code sent
- `SMS_OTP_SUCCESS` - SMS verification successful
- `SMS_OTP_FAILURE` - SMS verification failed
- `RATE_LIMIT_EXCEEDED` - Rate limit triggered
- `SUSPICIOUS_ACTIVITY` - Pattern-based detection
- `LOGIN_SUCCESS` - Successful authentication
- `LOGIN_FAILURE` - Failed authentication

## Usage Guide

### For Users

1. **Enable 2FA**:
   - Go to Settings → Security
   - Click "Enable 2FA"
   - Scan QR code with authenticator app
   - Enter verification code and password
   - Save backup codes securely

2. **Login with 2FA**:
   - Enter username and password
   - Enter 6-digit code from authenticator app
   - Alternative: Use backup code or SMS

3. **Manage 2FA**:
   - View status in Security settings
   - Generate new backup codes
   - Disable 2FA with password

### For Developers

1. **Database Setup**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

2. **Environment Setup**:
   - Configure Twilio credentials for SMS
   - Set NextAuth secret

3. **Testing**:
   - Use authenticator app (Google Authenticator, Authy)
   - Test with valid phone number for SMS
   - Verify backup codes work

## Security Best Practices

### Implemented
- ✅ Secure secret generation and storage
- ✅ Rate limiting and attempt tracking
- ✅ Comprehensive audit logging
- ✅ Backup codes with single-use enforcement
- ✅ IP-based suspicious activity detection
- ✅ Session management integration

### Recommended Additional Measures
- 📧 Email notifications for security events
- 🔒 Geolocation-based access controls
- 📱 Push notification alternatives
- 🛡️ Advanced fraud detection
- 🔐 Hardware security key support

## Troubleshooting

### Common Issues

1. **QR Code Not Scanning**:
   - Check image quality
   - Use manual entry key
   - Try different authenticator app

2. **SMS Not Received**:
   - Verify phone number format
   - Check Twilio configuration
   - Ensure SMS service has credits

3. **Code Always Invalid**:
   - Check device time synchronization
   - Verify secret key accuracy
   - Test with different codes

4. **Rate Limiting Issues**:
   - Wait for rate limit reset
   - Check attempt counters in database
   - Clear rate limit store if needed

### Database Queries

Check 2FA status:
```sql
SELECT id, username, twoFactorEnabled, phoneVerified 
FROM users 
WHERE id = 'user_id';
```

View security events:
```sql
SELECT event, timestamp, ipAddress 
FROM security_audit_logs 
WHERE userId = 'user_id' 
ORDER BY timestamp DESC 
LIMIT 10;
```

Reset rate limiting:
```sql
DELETE FROM two_factor_verifications 
WHERE userId = 'user_id';
```

## Testing

### Manual Testing Checklist

- [ ] Enable 2FA with QR code
- [ ] Enable 2FA with manual entry
- [ ] Verify TOTP codes work
- [ ] Test backup codes
- [ ] Send and verify SMS OTP
- [ ] Test rate limiting
- [ ] Disable 2FA
- [ ] Check audit logging
- [ ] Test suspicious activity detection
- [ ] Verify session management

### Automated Testing

Consider implementing tests for:
- TOTP generation and verification
- SMS OTP flow
- Backup code generation and verification
- Rate limiting functionality
- Security audit logging
- API endpoint responses

## Future Enhancements

### Planned Features
- 📧 Email-based 2FA
- 🔑 Hardware security key support (WebAuthn)
- 📱 Push notification 2FA
- 🌍 Geolocation verification
- 🤖 Advanced bot detection
- 📊 Security analytics dashboard

### Integration Opportunities
- Single Sign-On (SSO)
- LDAP/Active Directory
- Third-party security services
- Mobile app integration
- API authentication

## Support

For implementation questions or issues:
1. Check the troubleshooting section
2. Review security audit logs
3. Verify environment configuration
4. Test with minimal setup
5. Consult NextAuth.js documentation

---

**Note**: This 2FA implementation provides enterprise-grade security features. Ensure all environment variables are properly configured and test thoroughly in a staging environment before production deployment.