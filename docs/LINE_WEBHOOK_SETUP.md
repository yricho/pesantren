# LINE Webhook Setup Guide

## Prerequisites

1. LINE Developers Account
2. LINE Messaging API Channel
3. Vercel Account (for deployment)

## Step 1: Get LINE Credentials

1. Go to [LINE Developers Console](https://developers.line.biz/console/)
2. Create or select your channel
3. Get these values from the "Basic settings" tab:
   - **Channel ID**
   - **Channel secret**
4. Get this from the "Messaging API" tab:
   - **Channel access token** (click "Issue" if not yet created)

## Step 2: Set Environment Variables in Vercel

1. Go to your Vercel project dashboard
2. Navigate to Settings → Environment Variables
3. Add these variables:

```env
LINE_CHANNEL_ID=your_channel_id_here
LINE_CHANNEL_SECRET=your_channel_secret_here
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token_here

# Also ensure you have database URL
DATABASE_URL=your_postgresql_connection_string
POSTGRES_URL=your_postgresql_connection_string
```

## Step 3: Configure Webhook URL in LINE

1. In LINE Developers Console, go to "Messaging API" tab
2. In the "Webhook settings" section:
   - **Webhook URL**: `https://imam-syafii-blitar.vercel.app/api/webhooks/line`
   - Click "Update"
   - Enable "Use webhook"
   - Click "Verify" to test the connection

## Step 4: Test the Bot

1. Add the bot as friend using QR code from LINE Console
2. Send one of these commands:
   - `start`
   - `menu`
   - `help`
3. You should receive the visual menu

## Troubleshooting

### Error: 308 Permanent Redirect
- **Solution**: Already fixed by setting `trailingSlash: false` in next.config.js

### Error: 503 Service Unavailable
- **Causes**:
  - Missing environment variables in Vercel
  - Database connection issues
- **Solution**:
  1. Check all environment variables are set in Vercel
  2. Redeploy the project after setting variables
  3. Check database connection string is correct

### Error: 403 Forbidden / Invalid Signature
- **Causes**:
  - Wrong Channel Secret
  - Signature validation failing
- **Solution**:
  - Double-check LINE_CHANNEL_SECRET matches exactly
  - Ensure no extra spaces or characters

### Bot Not Responding
- **Check**:
  1. Webhook is enabled in LINE Console
  2. Bot has been added as friend
  3. Check Vercel function logs for errors

## Testing Locally

For local development:

1. Use ngrok to expose local server:
```bash
ngrok http 3030
```

2. Update webhook URL in LINE Console to ngrok URL:
```
https://xxxxx.ngrok.io/api/webhooks/line
```

3. Set environment variables in `.env.local`:
```env
LINE_CHANNEL_ID=your_channel_id
LINE_CHANNEL_SECRET=your_channel_secret
LINE_CHANNEL_ACCESS_TOKEN=your_channel_access_token
```

## Important Notes

- The webhook always returns HTTP 200 to prevent LINE from retrying
- Database is optional - webhook can work with just environment variables
- All errors are logged but return 200 status to LINE
- Signature validation is required for security

## Support

For issues, check:
- Vercel Function Logs
- LINE Official Account Manager logs
- Browser DevTools Network tab (for local testing)