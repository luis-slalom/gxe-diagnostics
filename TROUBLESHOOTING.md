# Troubleshooting Guide - GXE Diagnostics

## Issue: "Request failed with status code 500"

### Problem
The pollinations.ai API returns a 500 Internal Server Error when trying to generate reports.

### Common Causes

1. **API Overload** - The free pollinations.ai service may be experiencing high traffic
2. **Request Too Large** - The prompt or requested tokens might exceed API limits
3. **Temporary Service Issues** - The external API might be temporarily down

### Solutions

#### Solution 1: Wait and Retry
The 500 error often indicates temporary API overload. Simply wait 1-2 minutes and try again.

#### Solution 2: Reduce Token Limit (Already Implemented)
We've reduced the `max_tokens` parameter from 8000 to 3000 to prevent API overload. This should help in most cases.

#### Solution 3: Check Vercel Function Logs

If deployed to Vercel, check the function logs:
1. Go to your Vercel dashboard
2. Navigate to your project
3. Click on "Functions" tab
4. Click on `/api/generate-report`
5. Check the logs for detailed error messages

The logs will show the exact error from pollinations.ai.

#### Solution 4: Test with Simple Request

Test if the API is working with a simple request using curl:

```bash
curl -X POST https://text.pollinations.ai/openai \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai",
    "messages": [{"role": "user", "content": "Hello"}],
    "temperature": 0.7,
    "max_tokens": 100
  }'
```

If this fails, the pollinations.ai API is down.

#### Solution 5: Use Alternative AI Provider (Advanced)

If pollinations.ai continues to have issues, you can modify the code to use an alternative provider:

**Option A: Use Anthropic Claude API (Paid)**

Update `/api/generate-report.ts`:
```typescript
// Add your Anthropic API key as environment variable
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
const ANTHROPIC_API_URL = 'https://api.anthropic.com/v1/messages';
```

**Option B: Use OpenAI API (Paid)**

Update `/api/generate-report.ts` to use OpenAI's official API instead.

**Option C: Use Ollama (Self-Hosted Free)**

Run a local LLM using Ollama and point the API to your local server.

### Prevention

**Monitor API Status**
- Check pollinations.ai's GitHub: https://github.com/pollinations/pollinations/issues
- Monitor for reported outages or rate limits

**Add Retry Logic**
The code could be enhanced to automatically retry failed requests with exponential backoff.

**Implement Caching**
Cache previously generated reports to reduce API calls.

### Error Messages Explained

| Error | Meaning | Solution |
|-------|---------|----------|
| 500 Internal Server Error | API is overloaded or experiencing issues | Wait and retry |
| 429 Too Many Requests | Rate limit exceeded | Wait 60 seconds and retry |
| 503 Service Unavailable | API is temporarily down | Check API status, wait longer |
| Network Error | Cannot reach the API | Check internet connection |

### Contact Support

If the issue persists after trying these solutions:

1. Check pollinations.ai status
2. Review Vercel function logs
3. Consider using an alternative AI provider
4. File an issue at: https://github.com/pollinations/pollinations/issues

### Quick Fix Commands

```bash
# Rebuild and redeploy
npm run build
git add .
git commit -m "Update API error handling"
git push origin main

# Test locally with Vercel CLI
npm run dev

# View Vercel logs
vercel logs
```

## Other Common Issues

### Issue: Modal stays open after error
**Solution:** Close and reopen the modal, then try again.

### Issue: Word document doesn't download
**Solution:** Check browser's download settings and popup blocker.

### Issue: Local development `/api` endpoint 404
**Solution:** Use `npm run dev` instead of `npm start` to enable serverless functions locally.
