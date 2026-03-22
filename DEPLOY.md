# Deployment Guide for Capture the Moment Photography

## Website Status: ✅ Ready to Deploy

The website has been updated with:
- Business Name: Capture the Moment Photography
- Photographer: Nghiem Truong
- Bio: "Nghiem Truong – photographer, coder, tutor, traveler, hiker, and skier. I have a passion for freezing moments through photography, capturing the beauty of scenery, people, and wildlife."
- Email: vinhnghiemcr@gmail.com
- Phone: 571-485-5154
- 10 portfolio images showcasing portraits, kids, graduation, and lifestyle photography

---

## Option 1: Netlify Drop (Easiest - No Account Required!)

**Recommended for immediate deployment without account creation**

1. Go to https://app.netlify.com/drop
2. Drag and drop the entire `website` folder from your computer
3. Netlify will instantly give you a live URL like `https://abc123.netlify.app`
4. Done! Your site is live.

**To update:** Repeat step 1-2 with the updated files.

---

## Option 2: Surge.sh (Quick CLI Deployment)

**Best for tech-savvy users**

1. Install Surge globally: `npm install -g surge`
2. Navigate to the website folder: `cd /path/to/photo-business/website`
3. Run: `surge`
4. Follow prompts to create a free account (email + password)
5. Choose a custom domain like `capture-the-moment-nghiem.surge.sh`

**To update:** Run `surge` again from the same folder.

---

## Option 3: GitHub Pages (Free & Professional)

**Best for long-term hosting with version control**

### Step 1: Create GitHub Repository
1. Go to https://github.com and sign up/login
2. Create a new repository named `capture-the-moment-photo`
3. Make it public

### Step 2: Upload Files
1. Click "Upload an existing file"
2. Drag and drop all files from the `website` folder
3. Commit the changes

### Step 3: Enable GitHub Pages
1. Go to Settings → Pages
2. Source: Deploy from a branch
3. Branch: main, Folder: / (root)
4. Click Save
5. Your site will be at: `https://yourusername.github.io/capture-the-moment-photo`

**To update:** Edit files directly on GitHub or use Git commands.

---

## Option 4: Vercel (Fast & Modern)

1. Go to https://vercel.com and sign up with GitHub
2. Import your GitHub repository (after completing Option 3)
3. Vercel will auto-deploy your site
4. Get a custom URL like `https://capture-the-moment-photo.vercel.app`

---

## Files Included

- `index.html` - Main website with all Nghiem's info
- `images/portfolio/` - 10 portfolio photos
- `DEPLOY.md` - This file

---

## Future Updates

### To Update Content:
1. Open `index.html` in any text editor
2. Find and edit:
   - `<title>` - Page title
   - `.logo` - Business name
   - About section - Bio text
   - Contact section - Email/phone
   - Services section - Pricing/packages
3. Save and redeploy using your chosen method above

### To Add More Photos:
1. Add new images to `images/portfolio/` folder
2. Copy an existing portfolio item in `index.html`:
   ```html
   <div class="portfolio-item">
       <img src="images/portfolio/YOUR-NEW-IMAGE.jpg" alt="Description">
       <div class="portfolio-overlay">
           <h3>Photo Title</h3>
           <p>Category</p>
       </div>
   </div>
   ```
3. Save and redeploy

---

## Custom Domain (Optional)

All services support custom domains:
- Netlify: Settings → Domain management
- Surge: `surge --domain yourdomain.com`
- GitHub Pages: Settings → Pages → Custom domain
- Vercel: Settings → Domains

---

**Recommended:** Start with Netlify Drop for instant results, then migrate to GitHub Pages for long-term management.
