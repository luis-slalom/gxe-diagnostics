# Deployment Guide - GXE Diagnostics

## CORS Fix Implementation

This application uses a serverless proxy to bypass CORS restrictions when calling the pollinations.ai API from the browser.

### Architecture

```
Browser → /api/generate-report (Serverless Function) → pollinations.ai → Response
```

### Files Changed

1. **[api/generate-report.ts](api/generate-report.ts)** - Serverless proxy function
2. **[src/services/pollinationsApi.ts](src/services/pollinationsApi.ts)** - Updated to use proxy endpoint
3. **[vercel.json](vercel.json)** - Vercel configuration for serverless functions

### Local Development

For local testing with serverless functions, use Vercel CLI:

```bash
# Install Vercel CLI globally (one time)
npm install -g vercel

# Run development server with serverless functions
npm run dev
```

This will start the app on `http://localhost:3000` with the serverless API endpoints available at `http://localhost:3000/api/*`.

**Note:** Using `npm start` will NOT include the serverless functions. Always use `npm run dev` for full local testing.

### Deployment to Vercel

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Fix CORS issue with serverless proxy"
   git push origin main
   ```

2. **Vercel will automatically deploy** (if connected to your repo)

3. **Manual deployment via CLI:**
   ```bash
   vercel --prod
   ```

### How It Works

1. Frontend calls `/api/generate-report` (relative URL)
2. In production (Vercel): This hits the serverless function at `api/generate-report.ts`
3. Serverless function makes the request to pollinations.ai (server-to-server, no CORS)
4. Response is returned to the frontend
5. Word document is generated and downloaded

### Configuration

The serverless function timeout is set to 120 seconds in `vercel.json` to allow for long-running AI generation requests.

### Testing

After deployment, test the functionality:

1. Go to your deployed site (e.g., https://gxe-diagnostics.vercel.app)
2. Click "Create a New Project"
3. Fill in the form and submit
4. The AI report generation should work without CORS errors
5. Word document should download automatically

### Troubleshooting

**Issue:** API endpoint returns 404
- **Solution:** Ensure `vercel.json` is properly configured and deployed

**Issue:** Timeout errors
- **Solution:** The serverless function has a 120-second timeout. Very long reports may need optimization.

**Issue:** Local development API not working
- **Solution:** Use `npm run dev` (not `npm start`) to include serverless functions

### Environment Variables

Currently, no environment variables are required. The pollinations.ai API is free and doesn't require authentication for basic usage.

### Monitoring

Monitor serverless function execution in the Vercel dashboard:
- Function logs
- Execution time
- Error rates
