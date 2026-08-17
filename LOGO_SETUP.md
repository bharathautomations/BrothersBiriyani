# 🎨 Logo Integration Guide

## Current Status
✅ Website code is ready to use your logo
⏳ Logo needs to be converted from PDF to PNG

## Quick Steps to Add Your Logo

### Method 1: Using Windows (Easiest)
1. Open `C:\data\BrothersBiriyani\Images\LOGO_BrothersBiriyani.pdf`
2. Press `Windows + Shift + S` to open Snipping Tool
3. Drag to select the logo area
4. Click the save icon
5. Save as: `C:\data\brothers-biriyani\public\logo.png`
6. Refresh your browser - logo will appear!

### Method 2: Using Online Converter
1. Go to: https://www.ilovepdf.com/pdf_to_jpg
2. Upload `LOGO_BrothersBiriyani.pdf`
3. Download the converted image
4. Rename to `logo.png`
5. Move to: `C:\data\brothers-biriyani\public\logo.png`

### Method 3: Using Adobe Acrobat / PDF Reader
1. Open the PDF
2. File → Export To → Image → PNG
3. Choose quality: High (300 DPI)
4. Save to: `C:\data\brothers-biriyani\public\logo.png`

## What I've Done
✅ Updated Navbar to use logo image (with text fallback)
✅ Updated Footer to use logo image (with text fallback)
✅ Set proper sizing: h-12 to h-14 in navbar, h-16 in footer
✅ Added error handling - if logo.png not found, shows text version

## After Adding the Logo
The website will automatically display your logo in:
- Navigation bar (top)
- Footer (bottom)

No code changes needed - just add the `logo.png` file!

## Recommended Logo Specs
- **Format**: PNG with transparent background
- **Width**: 200-400px (will auto-scale)
- **Height**: Proportional to width
- **File size**: < 100KB for fast loading

---

**Current Fallback**: Until logo.png is added, the website shows "Brothers Biriyani" text logo with brand colors.
