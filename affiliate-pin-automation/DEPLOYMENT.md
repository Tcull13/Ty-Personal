# Deployment Guide - PinAutomate

Complete guide to deploy PinAutomate to production.

## Prerequisites

Before deploying, ensure you have:
- [ ] Vercel account (or other hosting platform)
- [ ] PostgreSQL database (Neon, Supabase, or Railway recommended)
- [ ] Stripe account with products/prices created
- [ ] OpenAI API key
- [ ] Pinterest Developer App created
- [ ] Amazon Associates account
- [ ] Domain name (optional but recommended)

## Step 1: Set Up Database

### Option A: Neon (Recommended - Free tier available)

1. Go to [neon.tech](https://neon.tech)
2. Create a new project
3. Copy your connection string (looks like: `postgresql://user:pass@host/db`)
4. Save this as your `DATABASE_URL`

### Option B: Supabase

1. Go to [supabase.com](https://supabase.com)
2. Create new project
3. Go to Settings > Database
4. Copy the connection string (use "Connection pooling" for serverless)
5. Save as `DATABASE_URL`

### Option C: Railway

1. Go to [railway.app](https://railway.app)
2. Create new project > Add PostgreSQL
3. Copy connection string from Variables tab
4. Save as `DATABASE_URL`

## Step 2: Configure Stripe

### 2.1 Create Products

1. Go to [Stripe Dashboard](https://dashboard.stripe.com)
2. Go to Products > Add Product
3. Create 3 products:
   - **Basic Plan**: $19/month recurring
   - **Pro Plan**: $49/month recurring
   - **Enterprise Plan**: $199/month recurring

### 2.2 Copy Price IDs

After creating each product:
1. Click on the product
2. Find the Price ID (starts with `price_...`)
3. Save these for environment variables

### 2.3 Set Up Webhooks

1. Go to Developers > Webhooks
2. Add endpoint: `https://yourdomain.com/api/webhook/stripe`
3. Select events to listen to:
   - `checkout.session.completed`
   - `invoice.payment_succeeded`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. Copy the Webhook Secret (starts with `whsec_...`)

## Step 3: Configure Pinterest API

1. Go to [Pinterest Developers](https://developers.pinterest.com/)
2. Create a new app
3. Set up OAuth:
   - Redirect URI: `https://yourdomain.com/api/auth/pinterest/callback`
   - Scopes: `boards:read`, `pins:read`, `pins:write`
4. Copy App ID and App Secret
5. Submit app for review (may take a few days)

## Step 4: Get OpenAI API Key

1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create account or sign in
3. Go to API Keys
4. Create new secret key
5. Copy the key (starts with `sk-...`)
6. Ensure you have credits added to your account

**Cost Estimate:**
- GPT-4o-mini: ~$0.001 per pin description
- DALL-E 3: ~$0.04-0.08 per image
- Average cost per pin: ~$0.05

## Step 5: Deploy to Vercel

### 5.1 Push to GitHub

```bash
cd affiliate-pin-automation
git init
git add .
git commit -m "Initial commit"
git remote add origin <your-github-repo>
git push -u origin main
```

### 5.2 Import to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Click "Add New..." > Project
3. Import your GitHub repository
4. Configure build settings:
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: (leave default)

### 5.3 Add Environment Variables

In Vercel project settings, add these environment variables:

```bash
# Database
DATABASE_URL="postgresql://..."

# NextAuth
NEXTAUTH_URL="https://your-domain.com"
NEXTAUTH_SECRET="generate-with-openssl-rand-base64-32"

# Google OAuth (optional)
GOOGLE_CLIENT_ID=""
GOOGLE_CLIENT_SECRET=""

# Stripe
STRIPE_PUBLISHABLE_KEY="pk_live_..."
STRIPE_SECRET_KEY="sk_live_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Stripe Price IDs
STRIPE_PRICE_ID_BASIC="price_..."
STRIPE_PRICE_ID_PRO="price_..."
STRIPE_PRICE_ID_ENTERPRISE="price_..."

# Pinterest
PINTEREST_APP_ID="..."
PINTEREST_APP_SECRET="..."
PINTEREST_REDIRECT_URI="https://your-domain.com/api/auth/pinterest/callback"

# OpenAI
OPENAI_API_KEY="sk-..."

# Amazon
AMAZON_ASSOCIATE_TAG="your-tag-20"

# App Settings
APP_URL="https://your-domain.com"
NODE_ENV="production"

# Cron Secret (generate random string)
CRON_SECRET="your-secure-random-string"
```

### 5.4 Generate NEXTAUTH_SECRET

```bash
openssl rand -base64 32
```

Copy the output and use it as `NEXTAUTH_SECRET`.

### 5.5 Deploy

Click "Deploy" and wait for deployment to complete.

## Step 6: Initialize Database

After first deployment:

```bash
# Install dependencies locally
npm install --legacy-peer-deps

# Generate Prisma client
npx prisma generate

# Push schema to database
npx prisma db push

# (Optional) Add seed data if you created a seed script
npx prisma db seed
```

Or use Vercel CLI:
```bash
vercel env pull .env
npx prisma db push
```

## Step 7: Set Up Cron Jobs

For scheduled pin posting, you need to set up a cron job.

### Option A: Vercel Cron (Recommended)

1. Create `vercel.json` in your project root:

```json
{
  "crons": [
    {
      "path": "/api/cron/process-pins",
      "schedule": "*/5 * * * *"
    }
  ]
}
```

2. Commit and push
3. Vercel will automatically run the cron job every 5 minutes

### Option B: External Cron Service

Use a service like [cron-job.org](https://cron-job.org) or [EasyCron](https://www.easycron.com/):

1. Create an account
2. Add a new cron job
3. URL: `https://your-domain.com/api/cron/process-pins`
4. Schedule: Every 5 minutes (`*/5 * * * *`)
5. Add header: `Authorization: Bearer YOUR_CRON_SECRET`

## Step 8: Configure Domain (Optional)

1. In Vercel project settings, go to Domains
2. Add your custom domain
3. Update DNS records as instructed
4. Update environment variables:
   - `NEXTAUTH_URL`
   - `APP_URL`
   - `PINTEREST_REDIRECT_URI`
5. Redeploy

## Step 9: Test Everything

### 9.1 Test Authentication
- [ ] Sign up works
- [ ] Login works
- [ ] Google OAuth works (if configured)

### 9.2 Test Pin Generation
- [ ] Paste Amazon link
- [ ] Pin generates with AI image
- [ ] Pin appears in dashboard

### 9.3 Test Stripe
- [ ] Use Stripe test mode first
- [ ] Upgrade to Basic plan works
- [ ] Webhook receives events
- [ ] User plan updates in database
- [ ] Test card: 4242 4242 4242 4242

### 9.4 Test Pinterest (After API Approval)
- [ ] Connect Pinterest account
- [ ] Post pin manually
- [ ] Check pin appears on Pinterest

### 9.5 Test Scheduling
- [ ] Cron job runs
- [ ] Scheduled pins post automatically

## Step 10: Go Live

### Switch Stripe to Live Mode
1. Toggle from Test to Live mode in Stripe Dashboard
2. Update environment variables with live keys
3. Update webhook endpoint to live mode

### Monitor
- Check Vercel logs for errors
- Monitor Stripe webhook events
- Check OpenAI usage/costs
- Monitor database connections

## Troubleshooting

### Database Connection Issues
- Ensure DATABASE_URL includes SSL parameters if required
- For Neon/Supabase, use connection pooling for serverless

### Prisma Deployment Issues
```bash
# In package.json, add postinstall script:
"scripts": {
  "postinstall": "prisma generate"
}
```

### Pinterest OAuth Fails
- Verify redirect URI matches exactly (with/without trailing slash)
- Check Pinterest app is in live mode
- Ensure scopes are requested correctly

### Images Not Loading
- Check CORS settings
- Verify image URLs are accessible
- For DALL-E images, they expire after some time - consider uploading to permanent storage

### Webhooks Not Working
- Verify webhook secret is correct
- Check webhook endpoint is publicly accessible
- Use Stripe CLI for local testing:
  ```bash
  stripe listen --forward-to localhost:3000/api/webhook/stripe
  ```

## Scaling Considerations

### For High Traffic
1. **Database**: Upgrade to connection pooling (PgBouncer)
2. **Caching**: Add Redis for session storage
3. **Image Storage**: Use Cloudinary/S3 instead of DALL-E URLs
4. **Queue**: Add Bull/BullMQ for background jobs
5. **CDN**: Use Vercel's Edge Network or Cloudflare

### Cost Optimization
1. **OpenAI**: Cache generated content, use GPT-4o-mini instead of GPT-4
2. **Database**: Monitor connection usage
3. **Vercel**: Monitor function invocations and bandwidth

## Security Checklist

- [ ] All secrets are environment variables (never committed)
- [ ] NEXTAUTH_SECRET is strong and random
- [ ] CRON_SECRET is set and validated
- [ ] Rate limiting is enabled (add middleware if needed)
- [ ] CORS is properly configured
- [ ] Stripe webhooks validate signatures
- [ ] User inputs are validated and sanitized
- [ ] SQL injection prevented (using Prisma)

## Backup Strategy

### Database Backups
- Most providers (Neon, Supabase) include automatic backups
- Consider manual backups before major updates:
  ```bash
  pg_dump DATABASE_URL > backup.sql
  ```

### Code Backups
- GitHub provides version control
- Tag releases: `git tag v1.0.0`

## Monitoring & Analytics

### Set Up Monitoring
1. **Vercel Analytics**: Enable in project settings
2. **Error Tracking**: Consider Sentry
3. **Uptime Monitoring**: UptimeRobot or Pingdom
4. **Application Insights**: Add custom analytics

### Key Metrics to Track
- Sign-ups per day
- Conversion rate (free to paid)
- Pins created per user
- OpenAI costs per pin
- API error rates
- Pinterest posting success rate

## Support

For issues:
1. Check Vercel deployment logs
2. Check database logs
3. Review Stripe webhook events
4. Test with Stripe CLI locally
5. Check Pinterest API status

## Updates

To deploy updates:
```bash
git add .
git commit -m "Your update message"
git push
```

Vercel will automatically deploy.

## Environment Variables Quick Reference

| Variable | Required | Description |
|----------|----------|-------------|
| DATABASE_URL | Yes | PostgreSQL connection string |
| NEXTAUTH_URL | Yes | Your production URL |
| NEXTAUTH_SECRET | Yes | Random secret for NextAuth |
| STRIPE_SECRET_KEY | Yes | Stripe API secret key |
| STRIPE_PUBLISHABLE_KEY | Yes | Stripe publishable key |
| STRIPE_WEBHOOK_SECRET | Yes | Stripe webhook signing secret |
| STRIPE_PRICE_ID_* | Yes | Price IDs for each plan tier |
| PINTEREST_APP_ID | Yes | Pinterest App ID |
| PINTEREST_APP_SECRET | Yes | Pinterest App Secret |
| OPENAI_API_KEY | Yes | OpenAI API key |
| AMAZON_ASSOCIATE_TAG | Yes | Your Amazon affiliate tag |
| GOOGLE_CLIENT_ID | No | For Google OAuth |
| GOOGLE_CLIENT_SECRET | No | For Google OAuth |
| CRON_SECRET | Yes | Secret for cron endpoint auth |

---

**Congratulations!** Your PinAutomate app is now live! 🎉
