# ATC JAPAN – Updated Website

## Included in this version
- Uploaded manufacturer logos are used for Isuzu, Mitsubishi Fuso, Hino, UD Trucks, Daihatsu, Mercedes-Benz and Lexus.
- Uploaded logos are cropped/cleaned so the original blank/black/white background does not appear inside the manufacturer circles.
- ATC JAPAN company logo is used in the website navbar, footer/admin branding.
- Vehicle cards link to a separate `vehicle-details.html?id=...` page.
- Vehicle details page supports multiple vehicle photos, thumbnails, enquiry and WhatsApp actions.
- Admin dashboard supports selecting/uploading multiple vehicle photos from the device/gallery instead of entering image URLs.
- Vehicle images are stored in browser localStorage for this static prototype.

## Important for production
This is a static HTML/JS prototype. Admin data and uploaded photos are stored in the browser's localStorage. For a real multi-user production admin dashboard, connect the admin to a backend/database and cloud image storage (for example MongoDB + Cloudinary).

## Deploy
Upload the contents of `project folder` to Netlify, or drag the folder/ZIP into Netlify Drop.
