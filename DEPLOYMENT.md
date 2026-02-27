# Just In Joy Coffee Co - Admin Panel

An admin panel for managing content on the Just In Joy Coffee Co website. Built with Next.js 15, TypeScript, and Tailwind CSS.

## 🚀 Deployment Instructions

### Prerequisites
1. GitHub repository with your code pushed
2. Vercel account
3. Your backend API deployed and accessible

### Step 1: Prepare for Deployment

Your project is already configured with:
- ✅ `vercel.json` - Vercel deployment configuration
- ✅ `.env.production` - Production environment variables
- ✅ `next.config.ts` - Optimized Next.js configuration
- ✅ TypeScript configuration without deprecation warnings

### Step 2: Deploy to Vercel

#### Option A: Deploy via Vercel Dashboard
1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "Import Project"
3. Select your GitHub repository: `just-in-joy-coffee-co/http/admin-site/admin-panel`
4. Configure the project:
   - **Framework Preset:** Next.js
   - **Root Directory:** `admin-panel` (if in a monorepo)
   - **Build Command:** `npm run build`
   - **Output Directory:** `.next`
   - **Install Command:** `npm install`

#### Option B: Deploy via Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy from your project directory
cd /path/to/your/admin-panel
vercel

# Follow the prompts:
# - Link to existing project? No
# - What's your project's name? admin-panel
# - In which directory is your code located? ./
```

### Step 3: Set Environment Variables in Vercel

In your Vercel dashboard, go to Project Settings → Environment Variables and add:

```env
NODE_ENV=production
API_USER_ENDPOINT=https://just-in-joy-coffee-co-vmckt7lji-lloyd-boones-projects.vercel.app/v1/users
API_EVENT_ENDPOINT=https://just-in-joy-coffee-co-vmckt7lji-lloyd-boones-projects.vercel.app/v1/events
API_FEATURED_DRINK_ENDPOINT=https://just-in-joy-coffee-co-vmckt7lji-lloyd-boones-projects.vercel.app/v1/featured-drinks
API_GALLERY_ENDPOINT=https://just-in-joy-coffee-co-vmckt7lji-lloyd-boones-projects.vercel.app/v1/gallery
API_HOME_SWIPER_ENDPOINT=https://just-in-joy-coffee-co-vmckt7lji-lloyd-boones-projects.vercel.app/v1/home-swipers
API_SHOUT_OUT_ENDPOINT=https://just-in-joy-coffee-co-vmckt7lji-lloyd-boones-projects.vercel.app/v1/shout-outs
API_SOCIAL_ENDPOINT=https://just-in-joy-coffee-co-vmckt7lji-lloyd-boones-projects.vercel.app/v1/socials
UPLOADTHING_TOKEN=your_token_here
UPLOADTHING_SECRET_KEY=your_secret_here
PINATA_API_KEY=your_api_key_here
PINATA_API_SECRET=your_api_secret_here
PINATA_JWT=your_jwt_here
NEXT_PUBLIC_GATEWAY_URL=maroon-quiet-crab-480.mypinata.cloud
```

**Important:** Replace the placeholder values with your actual credentials from your `.env` file.

### Step 4: Configure Custom Domain (Hostinger + Vercel)

To point `https://just-in-joy-coffee-co.com/admin-panel` to your Vercel deployment:

#### Option A: Subdirectory Path (Recommended)
1. **In Vercel:**
   - Go to Project Settings → Domains
   - Add domain: `admin.just-in-joy-coffee-co.com`
   - Vercel will provide DNS records

2. **In Hostinger DNS:**
   - Add CNAME record: `admin` → `cname.vercel-dns.com`

3. **Update your main site:**
   - Add a redirect from `/admin-panel` to `https://admin.just-in-joy-coffee-co.com`

#### Option B: Proxy Setup (Advanced)
If you want to keep the `/admin-panel` path, you'll need to configure your main site's server to proxy requests to Vercel.

### Step 5: Verify Deployment

1. **Check build logs** in Vercel dashboard
2. **Test the live URL** provided by Vercel
3. **Verify API connectivity** by testing login functionality
4. **Check CORS settings** if you encounter API issues

### Step 6: Post-Deployment Setup

1. **Update CORS settings** in your backend to allow your new domain
2. **Test all admin functionality** (login, file uploads, data management)
3. **Monitor error logs** in Vercel dashboard

## 🔧 Development

### Local Development
```bash
npm run dev
```

### Build for Production
```bash
npm run build
npm start
```

## 📁 Project Structure

```
admin-panel/
├── app/                    # Next.js 15 App Router
├── components/            # React components
├── lib/                   # Utilities and actions
├── types/                 # TypeScript definitions
├── public/               # Static assets
└── migrations/           # Database migrations
```

## 🔒 Security Notes

- Never commit `.env` files with real credentials
- Use environment variables for all sensitive data
- Regularly rotate API keys and tokens
- Monitor Vercel logs for unauthorized access attempts

## 🐛 Troubleshooting

### Common Issues:

1. **API CORS Errors:**
   - Ensure your backend allows requests from your Vercel domain
   - Check the CORS headers in `next.config.ts`

2. **Environment Variables Not Working:**
   - Verify variables are set in Vercel dashboard
   - Redeploy after adding new environment variables

3. **Build Failures:**
   - Check the build logs in Vercel
   - Ensure all dependencies are listed in `package.json`

4. **Image Upload Issues:**
   - Verify UploadThing and Pinata credentials
   - Check domain whitelist in your upload service

For additional support, check the Vercel documentation or contact support.