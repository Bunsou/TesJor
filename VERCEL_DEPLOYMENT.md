# Vercel Deployment Guide

## Required Environment Variables

To deploy this application on Vercel, you need to configure all the required environment variables in your Vercel project settings.

### Steps to Add Environment Variables in Vercel:

1. Go to your Vercel project dashboard
2. Click on **Settings** > **Environment Variables**
3. Add each variable below with its corresponding value

### Required Variables:

#### Database

```
DATABASE_URL=postgresql://user:password@host/database
```

- Get this from your PostgreSQL provider (e.g., Neon, Supabase, Railway)
- Format: `postgresql://username:password@host:port/database?sslmode=require`

#### Authentication (Better Auth)

```
BETTER_AUTH_SECRET=your-secret-key-here-minimum-32-characters
BETTER_AUTH_URL=https://your-vercel-app.vercel.app
```

- `BETTER_AUTH_SECRET`: Generate a random 32+ character string
- `BETTER_AUTH_URL`: Your Vercel deployment URL (e.g., `https://tesjor.vercel.app`)

#### Google OAuth

```
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

- Get these from [Google Cloud Console](https://console.cloud.google.com/)
- Enable Google OAuth API
- Add your Vercel URL to authorized redirect URIs

#### Cloudinary (Image Uploads)

```
CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
CLOUDINARY_API_KEY=your-cloudinary-api-key
CLOUDINARY_API_SECRET=your-cloudinary-api-secret
```

- Get these from [Cloudinary Dashboard](https://cloudinary.com/console)
- Free tier is sufficient for getting started

#### Upstash Redis (Rate Limiting & Caching)

```
UPSTASH_REDIS_REST_URL=https://your-redis-url.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-upstash-redis-token
```

- Get these from [Upstash Console](https://console.upstash.com/)
- Create a Redis database (free tier available)

#### Google Maps

```
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your-google-maps-api-key
```

- Get from [Google Cloud Console](https://console.cloud.google.com/)
- Enable Maps JavaScript API and Places API
- Note: This variable starts with `NEXT_PUBLIC_` so it's exposed to the browser

#### Environment Type

```
NODE_ENV=production
```

- Vercel sets this automatically, but you can override if needed

---

## Important Notes:

### Environment Variable Scopes

When adding variables in Vercel, you can set them for:

- **Production** - Used when deploying to main branch
- **Preview** - Used for pull request previews
- **Development** - Used in local development

**Recommendation**: Set all variables for all environments.

### Security Best Practices:

- ✅ Never commit `.env` or `.env.local` files to Git
- ✅ Use different credentials for production vs development
- ✅ Rotate secrets regularly
- ✅ Use strong, random values for secrets (minimum 32 characters)
- ✅ Enable 2FA on all service providers

### Database Migration:

After deployment, you may need to run migrations:

```bash
# Run migrations on Vercel
npm run db:push
```

Or manually run migrations from your local machine pointing to production database.

---

## Troubleshooting:

### Build Fails with "Invalid environment variables"

- **Solution**: Make sure all variables listed above are added in Vercel project settings
- Check the build logs for which specific variable is missing
- Verify variable names match exactly (case-sensitive)

### Authentication Not Working

- **Solution**: Ensure `BETTER_AUTH_URL` matches your actual Vercel deployment URL
- Add redirect URL to Google OAuth settings
- Check that `BETTER_AUTH_SECRET` is at least 32 characters

### Images Not Uploading

- **Solution**: Verify all three Cloudinary variables are set correctly
- Check Cloudinary dashboard for API key status
- Ensure your Cloudinary cloud name is correct

### Maps Not Loading

- **Solution**: Verify `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` is set
- Check that Maps JavaScript API is enabled in Google Cloud Console
- Verify API key restrictions allow your Vercel domain

---

## Post-Deployment Checklist:

- [ ] All environment variables added in Vercel
- [ ] Database migrations run successfully
- [ ] Google OAuth redirect URIs updated
- [ ] Cloudinary settings configured
- [ ] Maps API restrictions updated for Vercel domain
- [ ] Test authentication flow
- [ ] Test image uploads
- [ ] Test map functionality
- [ ] Monitor error logs in Vercel dashboard

---

## Quick Setup Script:

You can use this checklist to verify all variables:

```bash
# Check if all required variables are set (run locally)
node -e "
const required = [
  'DATABASE_URL',
  'BETTER_AUTH_SECRET',
  'BETTER_AUTH_URL',
  'GOOGLE_CLIENT_ID',
  'GOOGLE_CLIENT_SECRET',
  'CLOUDINARY_CLOUD_NAME',
  'CLOUDINARY_API_KEY',
  'CLOUDINARY_API_SECRET',
  'UPSTASH_REDIS_REST_URL',
  'UPSTASH_REDIS_REST_TOKEN',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY'
];

const missing = required.filter(v => !process.env[v]);

if (missing.length > 0) {
  console.log('❌ Missing variables:', missing.join(', '));
  process.exit(1);
} else {
  console.log('✅ All required environment variables are set!');
}
"
```

---

For more help, check:

- [Vercel Environment Variables Documentation](https://vercel.com/docs/environment-variables)
- [Better Auth Documentation](https://www.better-auth.com/docs)
- [Next.js Environment Variables](https://nextjs.org/docs/pages/building-your-application/configuring/environment-variables)
