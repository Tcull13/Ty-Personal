# PinAutomate - Affiliate Marketing Automation Platform

Turn your Amazon affiliate links into Pinterest gold with AI-powered automation.

## Features

- **Paste & Generate**: Simply paste an Amazon affiliate link and AI generates beautiful Pinterest pins
- **Auto-Posting**: Automatically post to Pinterest based on your schedule
- **AI-Powered Design**: Uses OpenAI DALL-E 3 to create eye-catching pin images
- **Compelling Copy**: AI-generated titles and descriptions optimized for clicks
- **Rate Limiting**: Configurable posting frequency with plan-based limits
- **Analytics**: Track clicks, impressions, and conversions
- **Multi-Board Support**: Post to multiple Pinterest boards
- **Subscription Tiers**: Free, Basic, Pro, and Enterprise plans

## Tech Stack

- **Frontend**: Next.js 15, React, TailwindCSS
- **Backend**: Next.js API Routes, Node.js
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (OAuth + Email/Password)
- **Payments**: Stripe subscriptions
- **AI**: OpenAI GPT-4 & DALL-E 3
- **Integrations**: Pinterest API, Amazon Product scraping

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL database
- Stripe account
- OpenAI API key
- Pinterest API credentials
- Amazon Associates account

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd affiliate-pin-automation
   ```

2. **Install dependencies**
   ```bash
   npm install --legacy-peer-deps
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

   Edit `.env` and fill in your credentials:
   - Database URL
   - NextAuth secret and URL
   - Stripe keys (publishable, secret, webhook secret)
   - Stripe Price IDs for each plan tier
   - Pinterest API credentials
   - OpenAI API key
   - Amazon Associate tag

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## Configuration

### Stripe Setup

1. Create products and prices in Stripe Dashboard
2. Copy the Price IDs to your `.env` file
3. Set up webhook endpoint: `/api/webhook/stripe`
4. Add webhook secret to `.env`

### Pinterest API Setup

1. Create a Pinterest App at [Pinterest Developers](https://developers.pinterest.com/)
2. Add OAuth redirect URL: `http://localhost:3000/api/auth/pinterest/callback`
3. Copy App ID and Secret to `.env`
4. Users will connect their Pinterest accounts via OAuth

### OpenAI Setup

1. Get API key from [OpenAI Platform](https://platform.openai.com/)
2. Add to `.env` as `OPENAI_API_KEY`
3. Ensure you have access to GPT-4 and DALL-E 3

## How It Works

### 1. User Flow

1. User signs up and selects a plan
2. User connects Pinterest account via OAuth
3. User pastes Amazon affiliate link
4. System scrapes product info from Amazon
5. AI generates pin image and copy
6. User can post immediately or schedule
7. System auto-posts to Pinterest

### 2. Pin Generation

The app uses two AI models:
- **GPT-4o-mini**: Generates compelling titles and descriptions
- **DALL-E 3**: Creates Pinterest-optimized pin images (1024x1792)

Pin styles available:
- Auto (default)
- Minimal
- Bold
- Elegant

### 3. Rate Limiting

Plans have daily pin limits:
- Free: 3 pins/day
- Basic: 20 pins/day
- Pro: 100 pins/day
- Enterprise: 500 pins/day

### 4. Scheduling (Coming Soon)

Users can set posting frequency and the system will automatically:
- Queue pins for posting
- Respect rate limits
- Post at optimal times
- Retry failed posts

## API Routes

### Authentication
- `POST /api/auth/[...nextauth]` - NextAuth endpoints

### Affiliate Links
- `POST /api/links/create` - Create affiliate link and generate pin

### Pins
- `POST /api/pins/post` - Post pin to Pinterest

### Webhooks
- `POST /api/webhook/stripe` - Handle Stripe events

## Database Schema

Key models:
- **User**: Authentication, subscription, Pinterest connection
- **AffiliateLink**: Amazon product info and affiliate URLs
- **Pin**: Generated pin content and status
- **Analytics**: Performance tracking
- **ScheduledPost**: Queue for auto-posting

See `prisma/schema.prisma` for full schema.

## Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables in Production

Make sure to set all required environment variables in your hosting platform:
- Database connection string
- All API keys and secrets
- Change `APP_URL` to your production domain
- Set `NODE_ENV=production`

### Database

Use a managed PostgreSQL service:
- Vercel Postgres
- Supabase
- Railway
- Neon

## Development

### Project Structure

```
affiliate-pin-automation/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── page.tsx           # Landing page
├── lib/                   # Core logic
│   ├── auth/             # Authentication
│   ├── stripe/           # Stripe integration
│   ├── pinterest/        # Pinterest API client
│   ├── ai/               # AI pin generation
│   ├── amazon-scraper.ts # Amazon product scraping
│   └── prisma.ts         # Prisma client
├── prisma/
│   └── schema.prisma     # Database schema
└── components/           # React components
```

### Adding New Features

1. Update Prisma schema if needed
2. Run `npx prisma generate && npx prisma db push`
3. Add API routes in `app/api/`
4. Add frontend components
5. Test thoroughly

## Troubleshooting

### Common Issues

**Prisma won't generate**
- Check your `DATABASE_URL` is correct
- Ensure PostgreSQL is running
- Try `npx prisma generate --skip-engines`

**Stripe webhooks not working**
- Test with Stripe CLI: `stripe listen --forward-to localhost:3000/api/webhook/stripe`
- Verify webhook secret is correct

**Pinterest auth fails**
- Check redirect URI matches exactly
- Ensure App ID and Secret are correct
- Make sure your app is approved by Pinterest

**AI generation slow**
- DALL-E 3 takes 10-30 seconds
- Consider using quick mode (product image + AI copy only)
- Implement background job queue for better UX

## Monetization

This app itself is monetized via:
1. **Subscription revenue**: Users pay monthly/yearly
2. **Commission**: Users' affiliate commissions grow with automated posting
3. **Upsells**: Premium features like team collaboration, API access

## Future Enhancements

- [ ] Scheduler with queue system
- [ ] Bulk link processing
- [ ] Instagram and TikTok integration
- [ ] A/B testing for pin designs
- [ ] Advanced analytics dashboard
- [ ] Team collaboration features
- [ ] Canva template integration
- [ ] Video pin support
- [ ] Mobile app

## Contributing

Pull requests welcome! Please follow the existing code style.

## License

MIT License - See LICENSE file for details

## Support

For issues and questions:
- Open a GitHub issue
- Email: support@pinsutomate.com

## Credits

Built with:
- [Next.js](https://nextjs.org/)
- [Prisma](https://www.prisma.io/)
- [OpenAI](https://openai.com/)
- [Stripe](https://stripe.com/)
- [Pinterest API](https://developers.pinterest.com/)
