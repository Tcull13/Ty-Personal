# Quick Start Guide - Get Your App Running in 30 Minutes

Don't worry! I'll walk you through every single step. No technical knowledge required.

## What You'll Need (5 minutes to gather)

1. A free database (I'll show you how to get one)
2. An OpenAI API key (for the AI - takes 2 minutes)
3. A Stripe account (for payments - can skip initially)
4. Your Amazon affiliate tag (you probably have this already)

## Step 1: Get a Free Database (5 minutes)

We'll use Neon - it's free and super easy.

1. Go to https://neon.tech
2. Click "Sign Up" (use your GitHub or Google account)
3. Click "Create a Project"
4. Name it: `pinautomate`
5. Click "Create Project"
6. You'll see a connection string that looks like:
   ```
   postgresql://user:password@ep-xxxxx.us-east-2.aws.neon.tech/neondb
   ```
7. **Copy this entire string** - you'll need it in a moment

✅ Done! You now have a database.

## Step 2: Get OpenAI API Key (3 minutes)

1. Go to https://platform.openai.com
2. Sign up or sign in
3. Click your profile (top right) → "API Keys"
4. Click "Create new secret key"
5. Name it: `PinAutomate`
6. **Copy the key** (starts with `sk-...`) - you can't see it again!
7. Add $5-10 to your account (Settings → Billing)

✅ Done! You have AI powers now.

## Step 3: Set Up Your Project (5 minutes)

Open your terminal and run these commands:

```bash
# Go to your project
cd affiliate-pin-automation

# Copy the example environment file
cp .env.example .env

# Open the file to edit
# (Use your favorite text editor, or: nano .env)
```

Now fill in these values in your `.env` file:

```bash
# Paste your Neon database URL here
DATABASE_URL="postgresql://your-connection-string-from-step-1"

# Generate a random secret (just type random letters/numbers, 32+ characters)
NEXTAUTH_SECRET="your-super-secret-random-string-here-make-it-long"

# For local testing
NEXTAUTH_URL="http://localhost:3000"
APP_URL="http://localhost:3000"

# Paste your OpenAI key here
OPENAI_API_KEY="sk-your-key-from-step-2"

# Your Amazon affiliate tag
AMAZON_ASSOCIATE_TAG="youraffiliatetaghere-20"

# Leave these blank for now (we'll add later)
STRIPE_SECRET_KEY=""
PINTEREST_APP_ID=""
```

**Save the file!**

## Step 4: Install & Set Up Database (5 minutes)

Still in your terminal:

```bash
# Install all the packages (this might take 2-3 minutes)
npm install --legacy-peer-deps

# Set up your database tables
npx prisma generate
npx prisma db push
```

You should see:
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema.
```

✅ Database is ready!

## Step 5: Run It! (2 minutes)

```bash
npm run dev
```

You should see:
```
▲ Next.js 15.x.x
- Local:        http://localhost:3000
```

**Open your browser and go to: http://localhost:3000**

You should see your landing page! 🎉

## Step 6: Test It Out (5 minutes)

### Create an Account

1. Click "Get Started" or "Sign Up"
2. Fill in:
   - Name: Your Name
   - Email: your@email.com
   - Password: (make one up)
   - Confirm Password: (same password)
3. Click "Create Account"

You'll be logged in to the dashboard!

### Try Creating a Pin (Without AI for now)

Since AI costs money, let's test without it first:

1. You'll see the dashboard with stats (0 pins)
2. You'll see "Create New Pin" form
3. Paste any Amazon URL (like: `https://www.amazon.com/dp/B08N5WRWNW`)
4. Click "Generate Pin"

**What will happen:**
- ✅ It will scrape the Amazon product info
- ❌ It might fail on AI generation (because it costs $ and OpenAI needs credits)
- ✅ But you'll see it working and creating a database entry!

## What Works Right Now vs. What Needs Setup

### ✅ Works Right Now (Without any API keys):
- Sign up / Login
- Beautiful dashboard UI
- Stats tracking
- Database storage
- Form submissions

### 🔧 Needs API Keys to Work:
- **AI Pin Generation**: Needs OpenAI key + credits ($)
- **Pinterest Posting**: Needs Pinterest Developer App (free but requires approval)
- **Payments**: Needs Stripe account (free)

## Common Issues & Fixes

### "Cannot connect to database"
- Check your `DATABASE_URL` is correct in `.env`
- Make sure you ran `npx prisma db push`

### "Module not found"
- Run `npm install --legacy-peer-deps` again

### "Port 3000 already in use"
- Something else is using port 3000
- Kill it: `lsof -ti:3000 | xargs kill`
- Or use a different port: `PORT=3001 npm run dev`

### Can't create account
- Check the console in your browser (F12)
- Make sure database is set up correctly

## Next Steps - Making It Real

### Option A: Deploy for Free (Test It Live)

**Vercel (Recommended - Takes 20 minutes)**

1. Push your code to GitHub:
   ```bash
   # Create a new repo on github.com, then:
   git remote add origin https://github.com/yourusername/pinautomate.git
   git push -u origin main
   ```

2. Go to https://vercel.com
3. Sign in with GitHub
4. Click "Import Project"
5. Select your repo
6. Add the same environment variables from `.env`
7. Click "Deploy"

🎉 Your app is live at `yourapp.vercel.app`!

### Option B: Add Real Features

#### Add AI Pin Generation (Costs ~$0.05 per pin)

1. Make sure you have OpenAI credits
2. Your `.env` already has `OPENAI_API_KEY`
3. Restart your dev server: `npm run dev`
4. Try creating a pin - it will now generate AI images!

#### Add Pinterest Posting (Free, but needs approval)

1. Go to https://developers.pinterest.com/
2. Create an app (takes 5 minutes)
3. Wait for approval (1-3 days)
4. Add credentials to `.env`:
   ```
   PINTEREST_APP_ID="your-app-id"
   PINTEREST_APP_SECRET="your-secret"
   ```

#### Add Stripe Payments (So you can make money!)

1. Go to https://dashboard.stripe.com
2. Create an account
3. Create 3 products:
   - Basic: $19/month
   - Pro: $49/month
   - Enterprise: $199/month
4. Copy the Price IDs to `.env`
5. Set up webhook endpoint

(Full instructions in `DEPLOYMENT.md`)

## Understanding Your App

Think of your app like a restaurant:

- **Frontend (Landing page, Dashboard)**: The dining room - customers see this
- **Backend (API Routes)**: The kitchen - processes orders
- **Database**: The pantry - stores everything
- **AI (OpenAI)**: The chef - creates the pins
- **Pinterest API**: The delivery service - posts the pins
- **Stripe**: The cash register - handles payments

Right now you have:
- ✅ Beautiful dining room (UI works)
- ✅ Functional kitchen (API works)
- ✅ Stocked pantry (Database works)
- 🔧 Chef waiting for ingredients (OpenAI needs credits)
- 🔧 Delivery service not connected yet (Pinterest needs approval)
- 🔧 Cash register ready to set up (Stripe account needed)

## Test Checklist

Use this to verify everything works:

- [ ] Can visit http://localhost:3000
- [ ] Landing page loads with pricing
- [ ] Can click "Sign Up"
- [ ] Can create an account
- [ ] Redirected to dashboard
- [ ] Can see stats (0 pins)
- [ ] Can paste Amazon link
- [ ] Can click "Generate Pin"
- [ ] Form submits (even if AI fails)
- [ ] Can see error or success message
- [ ] Can click "Settings"
- [ ] Can see current plan (Free)

If all these work: **Your app is functional!** 🎉

The remaining pieces (AI, Pinterest, Stripe) are just API integrations that you can add one by one.

## Need Help?

**Common Questions:**

**Q: Do I need to deploy it?**
A: Not immediately! You can use it locally to test and develop.

**Q: How much does OpenAI cost?**
A: About $0.05 per pin (includes image generation). $10 = ~200 pins.

**Q: Do I need Stripe to test?**
A: No! You can use the free plan yourself and add Stripe later when you want to accept payments.

**Q: What if Pinterest doesn't approve my app?**
A: You can manually post pins to Pinterest until then. The app still generates them for you!

**Q: Is this actually a real app that works?**
A: YES! It's a fully functional SaaS application. You just need to add your API keys for the external services (OpenAI, Pinterest, Stripe).

## What You Have

You have a **complete, working application**. Think of it like buying a car:

- ✅ The car is built (code works)
- ✅ Engine works (app runs)
- ✅ Seats are comfy (UI is nice)
- 🔧 Needs gas (OpenAI credits)
- 🔧 Needs insurance (Pinterest approval)
- 🔧 Needs license plate (Stripe for payments)

The car works! You just need to add the extras to drive it on the highway.

## Ready to Deploy?

When you're ready to make it live for real users, check out `DEPLOYMENT.md` for the full production deployment guide.

But for now, just get it running locally and play with it!

---

**You got this!** 🚀 Start with Step 1 and work through each step. Each one only takes a few minutes.
