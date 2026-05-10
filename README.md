# Nghiem Truong Photography Website

A refined one-page photography website for portraits, graduation, family, and event sessions.

## Current website highlights

- Editorial-style redesign with a warmer photography-focused visual system
- Stronger hero positioning and clearer booking CTA
- Curated portfolio gallery with category filters
- Click-to-open portfolio lightbox
- Service and investment sections with cleaner package structure
- Client-experience, FAQ, and about sections
- Booking request workflow with new/update/cancel modes
- Calendly booking and direct inquiry links
- Fully static HTML/Tailwind setup with no build step required

## Tech stack

- Vanilla HTML
- Tailwind CSS via CDN
- Small inline JavaScript for filtering, lightbox, and mobile navigation

## Local development

```bash
cd /home/vncr/.openclaw/workspace/main/photo-business/website
python3 -m http.server 8010
# Open http://localhost:8010
```

## Main business links

- Booking: https://calendly.com/nghiemtruongcorp/30min
- Email: nghiemtruongcorp@gmail.com

## Notes

- This version removes the old dark-mode-heavy, generic blue SaaS feel in favor of a more image-led presentation.
- The site now depends more on strong real portfolio images, so image quality and curation matter a lot.
- The booking request form is wired for the deployed Apps Script workflow.

## Status

- Current version: redesigned local build
- Local verification: HTML served on localhost and inline JavaScript syntax checked
