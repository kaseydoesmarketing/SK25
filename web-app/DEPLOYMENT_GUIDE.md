# SKTCH Platform Deployment Guide

## Chrome Extension Testing

The Chrome Extension is built and ready for testing:

### Installation Steps:
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select the `/Users/kvimedia/SKTCH/dist` directory
5. The SKTCH extension should appear in your extensions list

### Testing Checklist:
- [ ] Extension loads without errors
- [ ] Icon appears in Chrome toolbar
- [ ] Popup opens when clicking extension icon
- [ ] Voice activation works with Cmd+Shift+V (Mac) or Ctrl+Shift+V
- [ ] Test on supported websites: Gmail, ChatGPT, Claude, Slack, Notion
- [ ] Verify Pulse HUD animations appear correctly
- [ ] Confirm sub-250ms voice processing latency

## Web Application Deployment

### Local Development Setup:

1. **Environment Configuration:**
   ```bash
   cd /Users/kvimedia/SKTCH/web-app
   cp .env.example .env.local
   # Edit .env.local with your actual values
   ```

2. **Required Services:**
   - PostgreSQL database
   - Google OAuth credentials
   - Stripe account (test keys)

3. **Start Development Server:**
   ```bash
   npm run dev
   ```
   Access at: http://localhost:3000

### Production Deployment (Vercel):

1. **Install Vercel CLI:**
   ```bash
   npm i -g vercel
   vercel login
   ```

2. **Deploy to Staging:**
   ```bash
   cd /Users/kvimedia/SKTCH/web-app
   vercel --prod
   ```

3. **Configure Environment Variables:**
   Set these in Vercel Dashboard:
   - NEXTAUTH_URL
   - NEXTAUTH_SECRET  
   - GOOGLE_CLIENT_ID
   - GOOGLE_CLIENT_SECRET
   - DATABASE_URL
   - STRIPE_SECRET_KEY
   - STRIPE_WEBHOOK_SECRET
   - NEXT_PUBLIC_APP_URL
   - NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY

## Database Setup Options:

### Option 1: Local PostgreSQL
```bash
# Install PostgreSQL
createdb sktch_dev
# Update DATABASE_URL in .env.local
npx prisma migrate dev
```

### Option 2: Railway/Render/Supabase
1. Create database service
2. Copy connection string to DATABASE_URL
3. Run migrations: `npx prisma migrate deploy`

## Authentication Setup:

1. **Google OAuth Console:**
   - Go to https://console.cloud.google.com/
   - Create new project or select existing
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - http://localhost:3000/api/auth/callback/google (dev)
     - https://your-domain.com/api/auth/callback/google (prod)

## Payment Setup:

1. **Stripe Dashboard:**
   - Create Stripe account
   - Get test API keys
   - Configure webhook endpoint: `/api/webhooks/stripe`
   - Set webhook events: `checkout.session.completed`, `customer.subscription.updated`

## Testing Verification:

### Chrome Extension:
- [ ] Loads in Chrome Developer Mode
- [ ] Works on target websites
- [ ] Voice processing under 250ms
- [ ] Pulse HUD animations at 60fps
- [ ] Context detection for Note/Prompt/Tasks modes

### Web Application:
- [ ] Google OAuth login works
- [ ] Dashboard loads user data
- [ ] Stripe checkout processes payments
- [ ] Usage tracking functions
- [ ] Responsive design works on mobile

### Integration:
- [ ] Extension connects to web app API
- [ ] User authentication synced
- [ ] Usage limits enforced (60-minute free tier)
- [ ] Pro features unlock with subscription

## Performance Requirements:

- Voice processing latency: < 250ms
- Pulse HUD animations: 60fps consistent
- Page load times: < 2s LCP
- API response times: < 500ms p95

## Monitoring & Observability:

- Vercel Analytics enabled
- Error tracking configured
- Performance monitoring active
- User experience metrics tracked

## Rollback Procedures:

If issues occur:
1. Vercel: `vercel --prod --force` with previous deployment
2. Chrome Extension: Remove from extensions, reload previous build
3. Database: Restore from backup if migrations fail

## Success Criteria:

- [ ] Chrome extension loads and functions flawlessly
- [ ] Web application accessible at production URL
- [ ] All authentication flows work correctly
- [ ] Payment processing handles transactions
- [ ] Performance meets specifications
- [ ] User can complete full onboarding journey