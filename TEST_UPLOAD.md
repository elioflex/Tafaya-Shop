# Testing Image Upload Issue

## Steps to Debug

### 1. Test Backend Directly
Open terminal and run:
```bash
curl -X POST https://tafaya-shop.onrender.com/api/upload \
  -F "image=@/path/to/test/image.jpg"
```

Expected response:
```json
{"imageUrl": "https://res.cloudinary.com/..."}
```

### 2. Check Browser Console
1. Open https://tafayashopfront.vercel.app/admin
2. Open browser DevTools (F12)
3. Go to "Console" tab
4. Try uploading an image
5. Look for errors (CORS, network, etc.)

### 3. Check Network Tab
1. In DevTools, go to "Network" tab
2. Try uploading an image
3. Look for the POST request to `/api/upload`
4. Check:
   - Status code (should be 200)
   - Response body
   - Request payload (should contain image file)

### 4. Verify Cloudinary Credentials
Go to https://console.cloudinary.com/settings/account
Check that these match:
- Cloud Name: dyztnskbj
- API Key: 229784152581655
- API Secret: PZ1X-ZXD2-0wwVpoBY9wpGuOvqY

### 5. Check Render Environment Variables
Go to Render dashboard → Environment tab
Verify all three variables are set correctly.
