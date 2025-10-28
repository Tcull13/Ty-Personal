# YOUR DEPLOYMENT CHECKLIST
# Let's get you live in 30 minutes! ☑️

## ✅ Already Done:
- [x] Code is on GitHub
- [x] You have OpenAI API key
- [x] You have Amazon tag: printablepear-20

---

## 🎯 STEP 1: Get Free Database (3 minutes)

**Open this link in your browser:**
https://neon.tech

**Do this:**
1. Click "Sign Up" (use your GitHub account - it's faster)
2. Click "Create a project"
3. Name it: `pinautomate`
4. Click "Create Project"

**You'll see a connection string like this:**
```
postgresql://alex:AbC123xyz@ep-cool-morning-123456.us-east-2.aws.neon.tech/neondb
```

**COPY IT!** Save it in a notepad - you'll need it in Step 2.

✅ When done, check here: [ ]

---

## 🚀 STEP 2: Deploy to Vercel (15 minutes)

**Open this link:**
https://vercel.com

**Do this:**
1. Click "Sign Up" (use the same GitHub account)
2. Click "Add New..." → "Project"
3. Find your repo: `Tcull13/Ty-Personal`
4. Click "Import"
5. **IMPORTANT:** Change "Root Directory" to: `affiliate-pin-automation`
6. Framework Preset: Next.js (auto-detected)

**Now the MOST IMPORTANT PART - Environment Variables:**

Click "Environment Variables" and add these ONE BY ONE:

### Required Variables:

**1. DATABASE_URL**
- Name: `DATABASE_URL`
- Value: `<paste your Neon connection string from Step 1>`

**2. NEXTAUTH_URL**
- Name: `NEXTAUTH_URL`
- Value: `https://your-app-name.vercel.app`
- (Replace `your-app-name` with whatever Vercel suggests, or use: `pinautomate-printablepear`)

**3. NEXTAUTH_SECRET**
- Name: `NEXTAUTH_SECRET`
- Value: `<type any random letters/numbers - at least 32 characters>`
- Example: `asjkdh3289hd923h9d82h3d982hd982hd9h23d982hd982`

**4. APP_URL**
- Name: `APP_URL`
- Value: `https://your-app-name.vercel.app` (same as NEXTAUTH_URL)

**5. NODE_ENV**
- Name: `NODE_ENV`
- Value: `production`

**6. OPENAI_API_KEY** ⭐ (This is the magic!)
- Name: `OPENAI_API_KEY`
- Value: `<paste your OpenAI API key>`
- Should start with: `sk-...`

**7. AMAZON_ASSOCIATE_TAG** ⭐
- Name: `AMAZON_ASSOCIATE_TAG`
- Value: `printablepear-20`

**LEAVE THESE BLANK (we'll add later):**
- PINTEREST_APP_ID (leave blank)
- PINTEREST_APP_SECRET (leave blank)
- STRIPE_SECRET_KEY (leave blank)
- GOOGLE_CLIENT_ID (leave blank)

**8. Click "Deploy"!**

Wait 2-3 minutes... ☕

Your app will be live at: `https://your-app-name.vercel.app`

✅ When done, check here: [ ]

---

## 🗄️ STEP 3: Initialize Database (5 minutes)

**In your terminal, run these commands:**

```bash
# Go to your project
cd /home/user/Ty-Personal/affiliate-pin-automation

# Install Vercel CLI (if you don't have it)
npm install -g vercel

# Login to Vercel
vercel login
# (Follow the prompts - it will open your browser)

# Link to your project
vercel link
# Choose: Yes
# Choose your team/account
# Choose: Ty-Personal
# Choose: affiliate-pin-automation

# Pull your environment variables
vercel env pull

# Set up the database
npx prisma generate
npx prisma db push
```

**You should see:**
```
✔ Generated Prisma Client
🚀 Your database is now in sync with your Prisma schema.
```

✅ When done, check here: [ ]

---

## 🎉 STEP 4: TEST IT! (5 minutes)

**Open your Vercel URL:**
`https://your-app-name.vercel.app`

**What you should see:**
1. 🎨 Beautiful landing page
2. Click "Get Started"
3. Create an account (use any email/password)
4. You're in the dashboard! 🎉

**Generate Your First AI Pin:**
1. Click the **"AI Generation"** tab
2. Paste any Amazon product URL, like:
   ```
   https://www.amazon.com/dp/B08N5WRWNW
   ```
3. Click "Generate Pin"
4. Wait ~30 seconds...
5. **BOOM! Your first AI-generated pin!** 🤖✨

✅ When done, check here: [ ]

---

## 🎯 STEP 5: Post to Pinterest (2 minutes)

For now, you'll post manually:

1. Download the pin image from your dashboard
2. Go to Pinterest.com
3. Create a pin
4. Upload the image
5. Use the title and description from your app
6. **Use your affiliate link!**
7. Post it!

**Your first affiliate link is LIVE!** 💰

✅ When done, check here: [ ]

---

## 🎊 YOU'RE DONE!

You now have:
- ✅ Live web app on the internet
- ✅ AI-powered pin generation
- ✅ Dashboard to track everything
- ✅ First affiliate pin posted
- ✅ Ready to start earning!

---

## 💰 Next Steps to Start Earning:

**This Week:**
- Create 3-5 pins per day (~10 min with AI)
- Post to Pinterest
- Track which products get traction

**This Month:**
- 100+ pins created
- Find your best niches
- Start seeing affiliate sales

**Next Month:**
- Apply for Pinterest API (auto-posting)
- Add Stripe (charge other users)
- Scale to $500-1000/month

---

## 🆘 Need Help?

**If something breaks:**
1. Check Vercel logs (Project → Deployments → Click on deployment → Logs)
2. Check OpenAI has credits: https://platform.openai.com/usage
3. Verify all environment variables are set correctly

**Common Issues:**

**"Cannot connect to database"**
- Check DATABASE_URL is correct in Vercel
- Redeploy after adding it

**"Invalid API key"**
- Check your OpenAI key is correct
- Make sure it starts with `sk-`

**"Module not found"**
- Run: `npm install --legacy-peer-deps`

**App won't load:**
- Check the Root Directory is set to: `affiliate-pin-automation`
- Redeploy

---

## 📊 Track Your Progress:

- [ ] Step 1: Database (3 min)
- [ ] Step 2: Vercel Deploy (15 min)
- [ ] Step 3: Initialize DB (5 min)
- [ ] Step 4: Test & First Pin (5 min)
- [ ] Step 5: Post to Pinterest (2 min)

**Total Time: 30 minutes**

---

## 🎯 YOU CAN DO THIS!

Every step is simple. Just follow along. By the end you'll have a real money-making app live on the internet!

Let's go! 🚀💰
