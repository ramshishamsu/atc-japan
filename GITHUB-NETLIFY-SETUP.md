# ATC JAPAN — GitHub + Netlify shared inventory (no MongoDB / Cloudinary)

## What this upgrade does
- Keeps the existing ATC JAPAN website design and pages.
- Admin adds, edits and deletes vehicle records through a Netlify Function.
- Vehicle records and uploaded photos are committed to your private or public GitHub repository.
- All visitors read the same live inventory from the Netlify Function.
- Photos are stored in the repository under `uploads/`; no Cloudinary is used.

## Required setup (one-time)
1. Push this entire project folder to the GitHub repository connected to your Netlify site. Keep the existing repository if possible. Ensure the Netlify build publish directory is the project root (`.`).
2. In GitHub, create a fine-grained Personal Access Token for this repository only. Grant **Contents: Read and write**. Do not paste the token into any HTML or JavaScript file.
3. In Netlify: Site configuration → Environment variables, add:
   - `GITHUB_TOKEN` = the fine-grained GitHub token
   - `GITHUB_OWNER` = GitHub account or organization name
   - `GITHUB_REPO` = repository name (without URL)
   - `GITHUB_BRANCH` = branch deployed by Netlify (usually `main`)
   - `ADMIN_PASSWORD` = a strong, unique admin password
4. Trigger a fresh deploy after adding the environment variables.
5. Open `/admin.html`, enter the `ADMIN_PASSWORD` value, then add a test vehicle. Check the public Stock List from another phone or browser.

## Important limits / notes
- The Netlify Function is the only place that uses the GitHub token; the token is never sent to visitors. Admin authentication is checked server-side.
- Use a private GitHub repository if vehicle photos/data should not be browsable directly through GitHub. The public website can still serve the photos through the function/repository configuration only if raw file access is public; for a private repo, raw.githubusercontent.com links will not work for visitors. Therefore, for this no-image-hosting design, **the repository must be public for public raw photo URLs to load**. Do not put private customer information in it.
- GitHub Contents API supports small file uploads; this dashboard compresses photos and allows up to 8 photos per vehicle. Keep each compressed photo modest (recommended under 700 KB).
- Every photo upload and inventory update creates GitHub commits and triggers the connected Netlify build. Large catalogues or frequent uploads can hit GitHub API / Netlify build limits. This is best for a modest inventory, not a high-volume stock platform.
- Existing browser localStorage records are not automatically migrated. Export the old localStorage backup from the previous admin version and manually import/recreate the vehicles using the new admin, or ask for a migration script before switching.
- The starter `vehicles.json` is empty. If you want the current demo inventory to remain, copy its vehicle records from `js/data.js` into `vehicles.json` before first deployment.
- Set a new, strong admin password directly in Netlify Environment variables. Never write the actual password in this guide or any committed project file.

## Test checklist
1. Visit the public site and confirm vehicle list loads.
2. Log in to `/admin.html`.
3. Add one test vehicle with 2–3 compressed photos.
4. Open the public site on a different device/network and check Stock List and View Details.
5. Edit the test vehicle and confirm the public details update.
6. Delete the test vehicle and confirm it disappears for visitors.

If you see “Inventory service is not configured”, check the five Netlify environment variables and redeploy.
