# PowerTrack Pro – Deployment Guide
# (Free hosting on Railway + MongoDB Atlas)
# Total time: ~15 minutes

================================================================
PART 1 — SET UP THE DATABASE (MongoDB Atlas)
================================================================

1. Go to https://mongodb.com/cloud/atlas and click "Try Free"

2. Sign up with Google or email (free, no credit card)

3. After signing in, click "Build a Database"
   - Choose "M0 FREE" (the free tier)
   - Provider: AWS, Region: pick the closest to India
     (e.g. Mumbai if available, or Singapore)
   - Cluster name: powertrack  (or anything)
   - Click "Create"

4. Security Quickstart screen:
   - Username: powertrack
   - Password: click "Autogenerate" and COPY the password somewhere
   - Click "Create User"

5. Scroll down to "Where would you like to connect from?"
   - Choose "My Local Environment"
   - In the IP Address box, type:  0.0.0.0/0
     (this allows Railway to connect from any IP)
   - Click "Add Entry"
   - Click "Finish and Close"

6. You'll land on the Database overview page.
   Click "Connect" on your cluster.

7. Click "Drivers"
   - Driver: Node.js
   - Copy the connection string. It looks like:
     mongodb+srv://powertrack:<password>@cluster0.xxxxx.mongodb.net/

8. Replace <password> in that string with the actual password you saved.
   Your final MONGO_URI looks like:
     mongodb+srv://powertrack:abc123xyz@cluster0.xxxxx.mongodb.net/powertrack

   SAVE THIS STRING — you need it in Part 2.

================================================================
PART 2 — DEPLOY THE APP (Railway)
================================================================

1. Go to https://railway.app and click "Start a New Project"
   Sign up with GitHub (free). If you don't have GitHub, make one at github.com

2. First, put the project files on GitHub:
   a. Go to https://github.com/new
   b. Repository name: powertrack-pro
   c. Set to Private
   d. Click "Create repository"
   e. On the next screen, click "uploading an existing file"
   f. Drag and drop ALL the files from the powertrack-pro folder
      (index.html, server.js, package.json, .gitignore, src/ folder, etc.)
   g. Click "Commit changes"

3. Back on Railway:
   - Click "Deploy from GitHub repo"
   - Select your powertrack-pro repository
   - Railway will detect it's a Node.js app automatically
   - Click "Deploy Now"

4. Add the MongoDB connection string:
   - In Railway, click on your project
   - Click the "Variables" tab
   - Click "New Variable"
   - Name:  MONGO_URI
   - Value: (paste your full connection string from Part 1, step 8)
   - Click "Add"
   - Railway will automatically redeploy with the new variable

5. Get your app URL:
   - Click the "Settings" tab in Railway
   - Under "Domains", click "Generate Domain"
   - You'll get a URL like: powertrack-pro-production.up.railway.app
   - This is your app! Open it in the browser to test.

================================================================
PART 3 — GIVE IT TO THE COMPANY
================================================================

1. Send them the Railway URL (e.g. https://powertrack-pro-production.up.railway.app)
2. They bookmark it or save it to their phone's home screen
3. Anyone with the link can use it from any device, anywhere
4. All data is shared and persists forever

To add to phone home screen (feels like an app):
  Android: Open in Chrome > three dots menu > "Add to Home screen"
  iPhone:  Open in Safari > Share button > "Add to Home Screen"

================================================================
NOTES
================================================================

- Railway free tier: 500 hours/month (enough for ~20 days continuous)
  To keep it free permanently, upgrade to the Hobby plan ($5/month)
  OR use Render.com instead (completely free, sleeps after inactivity)

- MongoDB Atlas free tier: 512MB storage — enough for thousands of customers

- To back up data: In MongoDB Atlas > Browse Collections > Export

================================================================
