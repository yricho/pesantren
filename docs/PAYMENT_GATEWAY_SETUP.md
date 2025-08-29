# Payment Gateway Integration Setup Guide

This document provides detailed instructions for setting up and configuring the payment gateway integration system using Midtrans.

## Overview

The payment gateway system supports multiple payment methods including:
- Virtual Account (BCA, BNI, BRI, Mandiri, Permata, CIMB)
- E-Wallets (GoPay, OVO, DANA, LinkAja, ShopeePay)
- QRIS (Quick Response Code Indonesian Standard)
- Manual Bank Transfer
- Credit Card (via Snap)

## Environment Variables

Add the following environment variables to your `.env.local` file:

```env
# Midtrans Configuration
MIDTRANS_SERVER_KEY=your_midtrans_server_key
MIDTRANS_CLIENT_KEY=your_midtrans_client_key
MIDTRANS_IS_PRODUCTION=false

# Next.js Public Variables
NEXT_PUBLIC_BASE_URL=http://localhost:3030
NEXT_PUBLIC_MIDTRANS_CLIENT_KEY=your_midtrans_client_key
NEXT_PUBLIC_MIDTRANS_IS_PRODUCTION=false
```

## Midtrans Setup

1. **Create Midtrans Account**
   - Visit [https://midtrans.com](https://midtrans.com)
   - Sign up for a merchant account
   - Complete the verification process

2. **Get API Keys**
   - Login to Midtrans Dashboard
   - Go to Settings → Access Keys
   - Copy Server Key and Client Key
   - For testing, use Sandbox keys

3. **Configure Webhook**
   - In Midtrans Dashboard, go to Settings → Configuration
   - Set Payment Notification URL to: `https://yourdomain.com/api/payment/callback`
   - Set Finish Redirect URL to: `https://yourdomain.com/ppdb/payment/{order_id}/finish`
   - Set Unfinish Redirect URL to: `https://yourdomain.com/ppdb/payment/{order_id}`
   - Set Error Redirect URL to: `https://yourdomain.com/ppdb/payment/{order_id}/error`

## File Structure

```
src/
├── lib/
│   └── payment-gateway.ts          # Core payment gateway integration
├── app/
│   ├── api/
│   │   └── payment/
│   │       ├── create/
│   │       │   └── route.ts        # Create payment endpoint
│   │       ├── callback/
│   │       │   └── route.ts        # Webhook handler
│   │       └── status/
│   │           └── [id]/
│   │               └── route.ts    # Payment status endpoint
│   └── ppdb/
│       └── payment/
│           └── [id]/
│               ├── page.tsx        # Payment page
│               ├── finish/
│               │   └── page.tsx    # Success page
│               ├── error/
│               │   └── page.tsx    # Error page
│               └── pending/
│                   └── page.tsx    # Pending page
└── types/
    └── index.ts                    # TypeScript interfaces
```

## API Endpoints

### 1. Create Payment

**POST** `/api/payment/create`

Creates a new payment record and initiates payment with Midtrans.

**Request Body:**
```json
{
  "registrationId": "string (optional)",
  "studentId": "string (optional)", 
  "amount": 150000,
  "paymentType": "REGISTRATION",
  "description": "Registration fee payment",
  "method": "VA|EWALLET|QRIS|TRANSFER",
  "channel": "bca|gopay|qris|etc (optional)",
  "customerDetails": {
    "firstName": "John",
    "lastName": "Doe",
    "email": "john@example.com",
    "phone": "+6281234567890"
  }
}
```

**Response:**
```json
{
  "payment": {
    "id": "payment_id",
    "paymentNo": "PAY-2024-12-0001",
    "orderId": "PAY-1703123456-ABC123",
    "amount": 150000,
    "method": "VA",
    "channel": "bca",
    "status": "PENDING",
    "vaNumber": "12345678901234567",
    "expiredAt": "2024-12-02T10:00:00.000Z"
  },
  "gateway": {
    "token": "snap_token",
    "redirect_url": "https://app.sandbox.midtrans.com/snap/...",
    "va_numbers": [
      {
        "bank": "bca",
        "va_number": "12345678901234567"
      }
    ]
  }
}
```

### 2. Check Payment Status

**GET** `/api/payment/status/{paymentId}`

Retrieves current payment status and updates from gateway if needed.

**Response:**
```json
{
  "payment": {
    "id": "payment_id",
    "paymentNo": "PAY-2024-12-0001",
    "amount": 150000,
    "status": "SUCCESS",
    "paidAt": "2024-12-01T15:30:00.000Z",
    "registration": {
      "id": "reg_id",
      "fullName": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 3. Payment Actions

**POST** `/api/payment/status/{paymentId}`

Perform actions on payment (cancel, refresh, verify manually).

**Request Body:**
```json
{
  "action": "cancel|refresh|verify_manual",
  "verifiedBy": "admin_id (for manual verification)",
  "proofUrl": "proof_image_url (for manual verification)"
}
```

### 4. Webhook Handler

**POST** `/api/payment/callback`

Receives payment notifications from Midtrans. This endpoint is automatically called by Midtrans when payment status changes.

## Usage Examples

### Create Virtual Account Payment

```typescript
const response = await fetch('/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    registrationId: 'reg_123',
    amount: 150000,
    paymentType: 'REGISTRATION',
    method: 'VA',
    channel: 'bca',
    customerDetails: {
      firstName: 'John',
      lastName: 'Doe', 
      email: 'john@example.com',
      phone: '+6281234567890'
    }
  })
})

const data = await response.json()
console.log('VA Number:', data.payment.vaNumber)
```

### Create E-Wallet Payment

```typescript
const response = await fetch('/api/payment/create', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    registrationId: 'reg_123',
    amount: 150000,
    paymentType: 'REGISTRATION',
    method: 'EWALLET',
    channel: 'gopay',
    customerDetails: {
      firstName: 'John',
      lastName: 'Doe',
      email: 'john@example.com', 
      phone: '+6281234567890'
    }
  })
})

const data = await response.json()
// Redirect user to data.gateway.redirect_url
```

### Check Payment Status

```typescript
const response = await fetch(`/api/payment/status/${paymentId}`)
const data = await response.json()

if (data.payment.status === 'SUCCESS') {
  console.log('Payment successful!')
  console.log('Paid at:', data.payment.paidAt)
}
```

## Frontend Integration

### Payment Page

The payment page (`/ppdb/payment/[id]`) provides:

- Real-time payment status updates
- Payment method-specific instructions
- Copy-to-clipboard functionality for VA numbers
- Auto-refresh for pending payments
- QR code display for QRIS payments
- Deep links for e-wallet payments

### Features

1. **Auto-Refresh**: Pending payments are checked every 30 seconds
2. **Payment Instructions**: Dynamic instructions based on payment method
3. **Status Indicators**: Visual status indicators with appropriate colors
4. **Error Handling**: Comprehensive error handling and user feedback
5. **Mobile Responsive**: Optimized for mobile and desktop usage
6. **Accessibility**: ARIA labels and keyboard navigation support

## Security Measures

1. **Signature Verification**: All webhook notifications are validated using SHA512 signature
2. **Input Validation**: Request data is validated using Zod schemas  
3. **Rate Limiting**: Consider implementing rate limiting on payment creation
4. **HTTPS Only**: All payment operations must use HTTPS in production
5. **Environment Isolation**: Separate keys for sandbox and production

## Testing

### Sandbox Testing

Midtrans provides test cards and accounts:

**Test Virtual Accounts:**
- Use any 16-digit number starting with the bank code
- BCA: 1234567890123456
- BNI: 1234567890123456  
- BRI: 1234567890123456

**Test E-Wallets:**
- GoPay: Use any phone number
- OVO: Use any phone number
- DANA: Use any phone number

**Test Credit Cards:**
- Successful: 4811 1111 1111 1114
- Failed: 4911 1111 1111 1113

### Testing Webhooks

Use ngrok or similar tools for local webhook testing:

```bash
# Install ngrok
npm install -g ngrok

# Expose local server
ngrok http 3030

# Use the HTTPS URL for webhook configuration
# https://abc123.ngrok.io/api/payment/callback
```

## Production Deployment

1. **Update Environment Variables**
   - Set `MIDTRANS_IS_PRODUCTION=true`
   - Use production Server Key and Client Key
   - Update `NEXT_PUBLIC_BASE_URL` to production URL

2. **Configure Webhook URL**
   - Update webhook URL in Midtrans Dashboard
   - Test webhook delivery

3. **SSL Certificate**
   - Ensure HTTPS is properly configured
   - Midtrans requires HTTPS for production webhooks

4. **Monitoring**
   - Monitor payment success rates
   - Set up alerts for failed payments
   - Log all payment activities

## Troubleshooting

### Common Issues

1. **Signature Validation Failed**
   - Check server key configuration
   - Ensure webhook payload is not modified
   - Verify SHA512 hash calculation

2. **Payment Not Created**
   - Check API credentials
   - Verify request payload format
   - Check Midtrans dashboard for errors

3. **Webhook Not Received**
   - Verify webhook URL is accessible
   - Check HTTPS configuration
   - Ensure endpoint returns 200 status

4. **Payment Status Not Updated**
   - Check webhook signature validation
   - Verify database connection
   - Check for processing errors in logs

### Debug Tips

1. Enable detailed logging in development
2. Use Midtrans Dashboard to track transactions
3. Test webhook delivery using Midtrans simulator
4. Monitor database for payment record updates

## Support

For technical support:
- Midtrans Documentation: [https://docs.midtrans.com](https://docs.midtrans.com)
- Midtrans Support: [https://support.midtrans.com](https://support.midtrans.com)
- Email: support@midtrans.com

## License

This implementation is part of the Pondok Imam Syafi'i management system and follows the same licensing terms as the main project.