# Deploy Brothers Biriyani to Netlify with GoDaddy Domain
## Complete Step-by-Step Guide

---

## 📋 Prerequisites

Before you start, make sure you have:
- ✅ GoDaddy account with domain purchased
- ✅ Your domain name (e.g., `brothersbiriyani.com`)
- ✅ Built website (the `dist/` folder from `npm run build`)
- ✅ Email access (for verification)

---

## 🚀 Part 1: Deploy to Netlify (Drag & Drop Method)

### **Step 1: Create Netlify Account**

1. Go to **https://www.netlify.com**
2. Click **"Sign up"** in the top right
3. Choose one of these options:
   - **GitHub** (recommended)
   - **GitLab**
   - **Bitbucket**
   - **Email** (manual signup)
4. Complete the signup process
5. Verify your email if required

---

### **Step 2: Build Your Website**

1. Open PowerShell in your project folder:
   ```powershell
   cd C:\data\brothers-biriyani
   ```

2. Run the build command:
   ```powershell
   npm run build
   ```

3. **Verify the build succeeded:**
   - Check that the `dist/` folder exists
   - Should contain:
     - `index.html`
     - `assets/` folder with CSS and JS files
     - `images/` folder
     - `logo.png`
     - `robots.txt`
     - `sitemap.xml`

4. **Check the dist folder:**
   ```powershell
   ls dist
   ```

---

### **Step 3: Deploy to Netlify (Drag & Drop)**

#### **Option A: Drag & Drop (Easiest for First Deploy)**

1. **Log in to Netlify:** https://app.netlify.com

2. **Access the Deploy Page:**
   - You'll see a box that says **"Want to deploy a new site without connecting to Git?"**
   - Or click **"Add new site"** → **"Deploy manually"**

3. **Drag the dist folder:**
   - Open File Explorer: `C:\data\brothers-biriyani\dist`
   - **Drag the ENTIRE `dist` folder** onto the Netlify deploy box
   - **OR** click "Browse to upload" and select the `dist` folder

4. **Wait for deployment:**
   - Netlify will upload and deploy your files
   - This takes 10-30 seconds
   - You'll see a progress indicator

5. **Get your temporary URL:**
   - Once deployed, you'll see a URL like: `https://random-name-12345.netlify.app`
   - Click it to view your live site!

---

#### **Option B: Netlify CLI (For Future Updates)**

If you want to use the command line:

1. **Install Netlify CLI:**
   ```powershell
   npm install -g netlify-cli
   ```

2. **Login to Netlify:**
   ```powershell
   netlify login
   ```
   - This opens your browser for authentication
   - Click "Authorize" in the browser

3. **Deploy your site:**
   ```powershell
   netlify deploy --prod --dir=dist
   ```

4. **Follow the prompts:**
   - Create & configure a new site: **Yes**
   - Team: Select your team
   - Site name: Enter a name (e.g., `brothers-biriyani`)
   - The site will be deployed!

---

### **Step 4: Verify Your Deployment**

1. **Open your Netlify site URL** (e.g., `https://random-name-12345.netlify.app`)

2. **Check these pages:**
   - [ ] Home page loads correctly
   - [ ] All images display (logo, food images)
   - [ ] Navigation works (all links scroll to sections)
   - [ ] Mobile menu toggle works
   - [ ] Gallery lightbox works
   - [ ] All sections visible (Hero, Menu, About, Gallery, etc.)

3. **Test on different devices:**
   - Desktop browser
   - Mobile phone
   - Tablet

4. **Check browser console for errors:**
   - Press `F12` → Console tab
   - Should have no red errors

---

## 🌐 Part 2: Connect Your GoDaddy Domain to Netlify

### **Step 5: Get Netlify Nameservers**

1. **In Netlify Dashboard:**
   - Go to your site (click on it from the Sites list)
   - Click **"Domain settings"** in the top menu
   - Or go to **"Site settings"** → **"Domain management"**

2. **Add your custom domain:**
   - Click **"Add custom domain"** or **"Add domain"**
   - Enter your domain: `brothersbiriyani.com` (replace with your actual domain)
   - Click **"Verify"**

3. **Choose Domain Registration Option:**
   - Netlify will detect you already own the domain
   - Click **"Add domain"**

4. **Get Netlify DNS Nameservers:**
   - Netlify will show you 4 nameservers like:
     ```
     dns1.p01.nsone.net
     dns2.p01.nsone.net
     dns3.p01.nsone.net
     dns4.p01.nsone.net
     ```
   - **Write these down** or keep the tab open!

---

### **Step 6: Update Nameservers in GoDaddy**

#### **6.1: Log in to GoDaddy**

1. Go to **https://www.godaddy.com**
2. Click **"Sign In"** (top right)
3. Enter your GoDaddy username and password

---

#### **6.2: Access Your Domain Settings**

1. Click your **profile icon** (top right) → **"My Products"**
2. Find your domain in the list (e.g., `brothersbiriyani.com`)
3. Click the **three dots menu (⋮)** next to your domain
4. Click **"Manage DNS"** or **"DNS"**

---

#### **6.3: Change Nameservers**

1. **Scroll to the "Nameservers" section**
   - It's usually at the top of the DNS Management page
   - You'll see current nameservers (probably GoDaddy's default)

2. **Click "Change" or "Manage"** next to Nameservers

3. **Select "Custom" or "Use my own nameservers"**
   - This is usually a radio button or dropdown

4. **Enter Netlify's nameservers:**
   - You'll see 4 input boxes
   - Enter each Netlify nameserver:
     ```
     Nameserver 1: dns1.p01.nsone.net
     Nameserver 2: dns2.p01.nsone.net
     Nameserver 3: dns3.p01.nsone.net
     Nameserver 4: dns4.p01.nsone.net
     ```
   - **Important:** Use the EXACT nameservers Netlify gave you (might be different)

5. **Save Changes:**
   - Click **"Save"** or **"Update Nameservers"**
   - GoDaddy will show a warning about DNS changes
   - Click **"Continue"** or **"Confirm"**

---

#### **6.4: DNS Propagation Wait Time**

⏱️ **Expected Wait Time:** 24-48 hours (usually 2-6 hours)

**What happens during propagation:**
- DNS servers worldwide update with your new nameservers
- Your domain starts pointing to Netlify
- Old DNS records are replaced

**How to check propagation:**
1. Go to: https://www.whatsmydns.net/
2. Enter your domain: `brothersbiriyani.com`
3. Select "NS" (Nameserver) record type
4. Click "Search"
5. You'll see a map showing which servers have updated
6. Green checkmarks = updated to Netlify nameservers

---

### **Step 7: Configure Domain in Netlify**

While waiting for DNS propagation:

1. **Back in Netlify → Domain settings**

2. **Add www subdomain (recommended):**
   - Click **"Add domain alias"**
   - Enter: `www.brothersbiriyani.com`
   - Click **"Add domain"**
   - This ensures both `brothersbiriyani.com` and `www.brothersbiriyani.com` work

3. **Set Primary Domain:**
   - Choose which version is primary:
     - `brothersbiriyani.com` (without www) ← Recommended
     - `www.brothersbiriyani.com` (with www)
   - Click **"Options"** next to your preferred domain
   - Select **"Set as primary domain"**
   - The other will automatically redirect to the primary

---

### **Step 8: Enable HTTPS/SSL (Automatic)**

1. **In Netlify → Domain settings:**
   - Scroll to **"HTTPS"** section

2. **Wait for DNS to verify:**
   - Netlify needs DNS propagation to complete first
   - This can take 2-24 hours after nameserver change

3. **Netlify automatically provisions SSL:**
   - Once DNS is propagated, Netlify will automatically:
     - Request a Let's Encrypt SSL certificate
     - Install it on your domain
     - Enable HTTPS

4. **Force HTTPS redirect:**
   - In HTTPS section, find **"Force HTTPS"** or **"Redirect HTTP to HTTPS"**
   - Turn this **ON**
   - All `http://` traffic will redirect to `https://`

---

### **Step 9: Verify Your Live Domain**

Once DNS has propagated (6-48 hours):

1. **Open your domain in a browser:**
   ```
   https://brothersbiriyani.com
   https://www.brothersbiriyani.com
   ```

2. **Verify both work and redirect:**
   - Both should load your site
   - Non-primary should redirect to primary
   - HTTP should redirect to HTTPS

3. **Check the padlock icon:**
   - You should see a padlock 🔒 in the address bar
   - Click it to verify SSL certificate is valid
   - Certificate should be issued by "Let's Encrypt"

4. **Test thoroughly:**
   - [ ] All pages load correctly
   - [ ] Images display properly
   - [ ] Navigation works
   - [ ] Mobile responsive
   - [ ] Gallery lightbox
   - [ ] Forms (if any) submit
   - [ ] No mixed content warnings (HTTP resources on HTTPS page)

---

## 🔄 Part 3: Update Your Website (Future Changes)

When you need to make changes to your website:

### **Method 1: Drag & Drop (Quick Updates)**

1. **Make your code changes** in VS Code

2. **Rebuild the site:**
   ```powershell
   npm run build
   ```

3. **Log in to Netlify:** https://app.netlify.com

4. **Go to your site** → **"Deploys"** tab

5. **Drag the new dist folder:**
   - Drag the entire `dist` folder onto the "Drag and drop" area
   - Or click "Deploy site" → select `dist` folder

6. **Wait for deployment:**
   - Takes 10-30 seconds
   - Your site updates automatically!

---

### **Method 2: Netlify CLI (Faster)**

```powershell
# Build your site
npm run build

# Deploy to production
netlify deploy --prod --dir=dist
```

That's it! Changes go live immediately.

---

### **Method 3: Git Integration (Automatic, Most Professional)**

If you want automatic deployments when you commit code:

1. **Create a Git repository:**
   ```powershell
   git init
   git add .
   git commit -m "Initial commit"
   ```

2. **Push to GitHub:**
   - Create a repository on GitHub
   - Connect your local repo:
     ```powershell
     git remote add origin https://github.com/yourusername/brothers-biriyani.git
     git push -u origin main
     ```

3. **Connect Netlify to GitHub:**
   - In Netlify, create a new site
   - Choose "Import from Git"
   - Connect your GitHub repository
   - Build command: `npm run build`
   - Publish directory: `dist`

4. **Automatic deployments:**
   - Every time you push to GitHub, Netlify rebuilds and deploys automatically!

---

## 📧 Part 4: Set Up Email with GoDaddy Domain (Optional)

If you want email addresses like `info@brothersbiriyani.com`:

### **Option A: GoDaddy Email (Paid)**

1. **In GoDaddy:**
   - Go to "My Products"
   - Find "Email" section
   - Purchase "Professional Email" or "Microsoft 365"
   - Price: $6-12/month

2. **Set up email addresses:**
   - Create: `info@brothersbiriyani.com`
   - Create: `orders@brothersbiriyani.com`
   - Create: `support@brothersbiriyani.com`

---

### **Option B: Google Workspace (Professional)**

1. **Sign up for Google Workspace:**
   - Go to: https://workspace.google.com
   - Price: $6/user/month

2. **Verify your domain:**
   - Google will provide DNS records
   - Add them in Netlify DNS (since Netlify manages your DNS now)

3. **Set up Gmail with your domain:**
   - Use Gmail interface with your custom domain

---

### **Option C: Free Email Forwarding (Basic)**

If you just need to receive emails (not send):

1. **In Netlify DNS settings:**
   - Add MX records for email forwarding service
   - Free options: ImprovMX, ForwardEmail

2. **Forward to personal email:**
   - `info@brothersbiriyani.com` → forwards to your personal Gmail

---

## 🔧 Part 5: Troubleshooting Common Issues

### **Issue 1: Domain Shows "Site Not Found"**

**Cause:** DNS hasn't propagated yet or nameservers incorrect

**Solution:**
1. Wait 24-48 hours for DNS propagation
2. Verify nameservers in GoDaddy match Netlify's exactly
3. Check propagation: https://www.whatsmydns.net/
4. Clear your browser cache: `Ctrl + Shift + Delete`

---

### **Issue 2: Images Not Loading**

**Cause:** Incorrect paths or missing files

**Solution:**
1. Check `dist/` folder contains `images/` directory and `logo.png`
2. Verify image paths in code start with `/` (e.g., `/images/chicken.jpg`)
3. Rebuild: `npm run build`
4. Redeploy the `dist` folder

---

### **Issue 3: "Not Secure" Warning / No HTTPS**

**Cause:** SSL certificate not yet provisioned

**Solution:**
1. Wait 24-48 hours after DNS propagation
2. In Netlify → Domain settings → HTTPS
3. Click "Verify DNS configuration"
4. If stuck, click "Renew certificate"

---

### **Issue 4: Site Works on netlify.app but Not on Custom Domain**

**Cause:** Nameservers not updated or DNS not propagated

**Solution:**
1. Verify nameservers in GoDaddy are correct
2. Wait for DNS propagation (use whatsmydns.net)
3. Try accessing in incognito/private browser window
4. Clear DNS cache:
   ```powershell
   ipconfig /flushdns
   ```

---

### **Issue 5: CSS or JavaScript Not Loading**

**Cause:** Incorrect asset paths or build issue

**Solution:**
1. Check browser console (F12) for 404 errors
2. Verify `dist/assets/` folder contains CSS and JS files
3. Rebuild:
   ```powershell
   npm run build
   ```
4. Check `index.html` in dist has correct asset paths
5. Redeploy

---

### **Issue 6: Forms Not Submitting**

**Cause:** Form action not configured for Netlify

**Solution:**
1. Add Netlify form attributes to your HTML:
   ```html
   <form name="contact" method="POST" data-netlify="true">
   ```
2. Add hidden input:
   ```html
   <input type="hidden" name="form-name" value="contact">
   ```
3. Rebuild and redeploy

---

### **Issue 7: Page Loads Slowly**

**Solutions:**
1. **Optimize images:**
   - Compress images (use TinyPNG.com)
   - Keep images under 500KB each

2. **Enable Netlify CDN features:**
   - Netlify automatically uses CDN (no setup needed)
   - Images are cached globally

3. **Check Lighthouse score:**
   - Press F12 → Lighthouse tab
   - Run audit for performance suggestions

---

## 📊 Part 6: Monitor Your Site

### **Netlify Analytics (Optional, Paid)**

1. **In Netlify → Analytics:**
   - Enable Netlify Analytics ($9/month)
   - Get visitor stats, page views, bandwidth usage

---

### **Google Analytics (Free)**

1. **Create Google Analytics account:**
   - Go to: https://analytics.google.com
   - Create property for your domain

2. **Get tracking code:**
   - Copy the GA4 measurement ID (e.g., `G-XXXXXXXXXX`)

3. **Add to your website:**
   - Add Google Analytics script to `index.html` in `<head>`
   - Or use Google Tag Manager

4. **Rebuild and deploy:**
   ```powershell
   npm run build
   netlify deploy --prod --dir=dist
   ```

---

### **Google Search Console**

1. **Verify your site:**
   - Go to: https://search.google.com/search-console
   - Add your domain
   - Verify ownership (DNS method or HTML file)

2. **Submit sitemap:**
   - Your sitemap is at: `https://brothersbiriyani.com/sitemap.xml`
   - Submit it in Search Console
   - Google will start indexing your pages

---

## ✅ Deployment Checklist

Use this checklist to ensure everything is set up correctly:

### **Pre-Deployment:**
- [ ] Website builds successfully (`npm run build`)
- [ ] `dist/` folder contains all files
- [ ] Tested locally (`npm run dev`)
- [ ] All images display correctly
- [ ] Mobile responsive on all screen sizes

### **Netlify Deployment:**
- [ ] Netlify account created
- [ ] Site deployed via drag & drop or CLI
- [ ] Site loads on Netlify URL (*.netlify.app)
- [ ] All features work on Netlify URL

### **Domain Configuration:**
- [ ] Custom domain added in Netlify
- [ ] Netlify nameservers copied
- [ ] Nameservers updated in GoDaddy
- [ ] DNS propagation verified (whatsmydns.net)
- [ ] Both domain and www subdomain work
- [ ] Primary domain set in Netlify

### **Security & Performance:**
- [ ] HTTPS enabled (padlock in browser)
- [ ] Force HTTPS redirect enabled
- [ ] SSL certificate valid (Let's Encrypt)
- [ ] No mixed content warnings
- [ ] Site loads quickly

### **Testing:**
- [ ] Desktop browser test
- [ ] Mobile phone test
- [ ] Tablet test
- [ ] All navigation links work
- [ ] Gallery lightbox works
- [ ] Forms submit (if applicable)
- [ ] No console errors

### **SEO & Analytics:**
- [ ] Sitemap accessible (/sitemap.xml)
- [ ] Robots.txt accessible (/robots.txt)
- [ ] Google Search Console verified (optional)
- [ ] Google Analytics installed (optional)
- [ ] Meta tags present (title, description)

---

## 🎯 Quick Reference

### **Important URLs:**

| Service | URL |
|---------|-----|
| Netlify Dashboard | https://app.netlify.com |
| GoDaddy Account | https://www.godaddy.com |
| DNS Propagation Checker | https://www.whatsmydns.net/ |
| Google Search Console | https://search.google.com/search-console |
| Google Analytics | https://analytics.google.com |

### **Key Commands:**

```powershell
# Build for production
npm run build

# Deploy with CLI
netlify deploy --prod --dir=dist

# Check DNS
nslookup brothersbiriyani.com

# Clear DNS cache (Windows)
ipconfig /flushdns
```

### **Support:**

- **Netlify Support:** https://answers.netlify.com/
- **GoDaddy Support:** https://www.godaddy.com/help
- **Netlify Docs:** https://docs.netlify.com/

---

## 🎉 Congratulations!

Your Brothers Biriyani website is now live! 🚀

**Your site is accessible at:**
- `https://brothersbiriyani.com`
- `https://www.brothersbiriyani.com`

**Features working:**
- ✅ Custom domain from GoDaddy
- ✅ Fast global CDN delivery
- ✅ Automatic HTTPS/SSL
- ✅ Mobile responsive on all devices
- ✅ Optimized for SEO
- ✅ Production-ready

**Next steps:**
1. Share your website with customers
2. Set up Google Analytics for visitor tracking
3. Submit sitemap to Google Search Console
4. Consider setting up custom email addresses
5. Monitor site performance

---

## 📞 Need Help?

If you encounter any issues:

1. **Check the Troubleshooting section** above
2. **Netlify Community:** https://answers.netlify.com/
3. **Check Netlify Deploy logs** for build errors
4. **Verify DNS propagation** at whatsmydns.net
5. **Clear browser cache** and try incognito mode

---

Made with ❤️ for Brothers Biriyani
Last Updated: 2026-08-14
