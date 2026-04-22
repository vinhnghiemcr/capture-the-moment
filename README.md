# Nghiem Truong Photography Website

## Overview
A professional, responsive one-page photography website featuring portfolio gallery, services/pricing, booking integration, and contact form.

## Features
- **Hero Section** - Eye-catching intro with business tagline
- **About Section** - Photographer bio with experience highlight
- **Portfolio Gallery** - Filterable gallery (Portrait, Graduation, Family, Event)
- **Services/Pricing** - Clear pricing structure with add-ons
- **Booking Section** - Session request workflow with create/update/cancel states
- **Contact Section** - Contact form + direct contact info
- **Dark Mode** - Toggle between light and dark themes
- **Mobile Responsive** - Fully responsive design

## Tech Stack
- **Framework**: Vanilla HTML + Tailwind CSS (CDN)
- **Styling**: Tailwind CSS v3.x
- **Icons**: Heroicons (SVG)
- **Booking**: Google Apps Script + Google Sheets + Gmail workflow scaffold
- **No Build Step Required** - Pure HTML/CSS/JS

## File Structure
```
website/
├── index.html          # Main website file
├── README.md           # This file
└── assets/             # Image assets folder
    ├── hero-placeholder.jpg
    ├── about-placeholder.jpg
    └── portfolio/
        ├── portrait-1.jpg
        ├── portrait-2.jpg
        ├── graduation-1.jpg
        ├── graduation-2.jpg
        ├── family-1.jpg
        ├── family-2.jpg
        ├── event-1.jpg
        └── event-2.jpg
```

## Deployment Options

### Option 1: Netlify (Recommended - Free)
1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag and drop the `website` folder onto the Netlify dashboard
3. Your site will be live instantly at `yoursite.netlify.app`
4. Custom domain: Settings > Domain management > Add custom domain

### Option 2: GitHub Pages (Free)
1. Create a new GitHub repository
2. Upload the `website` folder contents to the repo
3. Go to Settings > Pages
4. Select "Deploy from a branch" and choose `main`
5. Your site will be at `username.github.io/repo-name`

### Option 3: Vercel (Free)
1. Go to [vercel.com](https://vercel.com) and sign up with GitHub
2. Import your repository
3. Vercel will auto-detect and deploy
4. Custom domain available in settings

### Option 4: Traditional Web Hosting
1. Upload `index.html` and the `assets` folder to your web host
2. Via FTP or file manager
3. Access via your domain

## Customization

### Update Business Information
Edit these sections in `index.html`:
- Business name (search for "Nghiem Truong Photography")
- Email: `nghiemtruongcorp@gmail.com`
- Booking request form webhook URL in `index.html` (`BOOKING_API_URL`)
- Location/Service area

### Add Portfolio Photos
1. Add your photos to `assets/portfolio/`
2. Name them: `portrait-1.jpg`, `graduation-1.jpg`, etc.
3. The placeholders will automatically be replaced
4. Supported formats: JPG, PNG, WebP

### Update Pricing
Edit the Services section in `index.html`:
```html
<p class="text-3xl font-bold text-primary-600 mb-4">$YOUR-PRICE</p>
```

### Color Scheme
The site uses a primary blue color scheme. To change:
```javascript
// In the tailwind.config script
colors: {
    primary: {
        600: '#YOUR-COLOR',  // Main brand color
    }
}
```

## SEO Checklist
Before deploying, update:
- [ ] Page title (line 6)
- [ ] Meta description (line 7)
- [ ] Add your city/area to description
- [ ] Create a favicon.ico and add to root
- [ ] Add Google Analytics (optional)

## Image Requirements
For best results:
- **Hero**: 1920x1080px minimum, landscape
- **About**: 800x1000px, portrait
- **Portfolio**: 600x800px minimum, consistent aspect ratio
- Optimize images for web (use TinyPNG or similar)
- Keep file sizes under 500KB each

## Testing Checklist
- [ ] Test on mobile (iPhone/Android)
- [ ] Test on desktop (Chrome, Safari, Firefox)
- [ ] Test dark mode toggle
- [ ] Test portfolio filters
- [ ] Test smooth scrolling navigation
- [ ] Test contact form
- [ ] Test booking request form

## Troubleshooting

### Images not showing?
- Check file paths match exactly (case sensitive)
- Ensure images are in the correct folder
- Check browser console for 404 errors

### Booking form not working?
- Verify `BOOKING_API_URL` points to the deployed Apps Script web app
- Make sure the Google Sheet exists and `SPREADSHEET_ID` is filled in
- Check Apps Script deployment access settings and execution logs

### Dark mode not persisting?
- This is expected behavior - it saves to localStorage
- Check browser settings for JavaScript blocking

## Support
For questions or issues:
- Email: nghiemtruongcorp@gmail.com

---

**Last Updated**: March 2026
**Version**: 1.0
