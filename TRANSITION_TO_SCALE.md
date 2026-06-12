# ZeroFlow: Transition to Scale (Phase 2 of Business Plan)

## Overview
Once the site reaches consistent profitability from affiliate commissions, we move from 100% free-tier infrastructure to paid tiers. This document outlines the recommended infrastructure upgrades and their justification.

## Current Infrastructure (Phase 1 — Bootstrap)
| Component | Current | Cost |
|-----------|---------|------|
| Hosting | GitHub Pages (Akledo/zeroflow-hub) | $0 |
| Static Site Generator | Eleventy (local build) | $0 |
| Database | Turso (free tier) | $0 |
| Email | Amazon SES via ctomail.io | $0 |
| CDN | GitHub Pages built-in | $0 |
| Analytics | None currently | $0 |

## Recommended Upgrades (Phase 2 — Scale)

### 1. Hosting: Vercel Pro ($20/mo)
**Why:** GitHub Pages works for static sites but lacks:
- **Serverless functions** needed for lead magnet downloads and MailerLite integrations
- **Edge caching** for faster global delivery (especially for image-heavy pages)
- **Automatic image optimization** (WebP conversion, responsive srcset)
- **Preview deployments** for testing landing pages before publishing
- **Analytics** (Vercel Web Analytics included)

**Migration path:** Point the custom domain at Vercel, deploy via `vercel --prod`. The existing Eleventy build outputs to `_site/` which Vercel detects automatically.

### 2. Image CDN: Cloudinary Free Tier → Paid ($0–$89/mo)
**Why:** Our images are 1.5–2.2MB each. Cloudinary provides:
- **Automatic WebP/AVIF conversion** (70% file size reduction)
- **Responsive breakpoints** (serve 400px images on phones)
- **Transformation URLs** (on-the-fly resize, crop, format)
- **Free tier** includes 25GB storage + 25GB CDN bandwidth

**Recommendation:** Use free tier initially. Upgrade when image traffic exceeds 25GB/mo.

### 3. Paid LLM API Access ($20/mo)
**Why:** Free-tier AI APIs have rate limits. For automated content production at scale:
- **OpenAI API** or **Anthropic Claude** for article generation
- Budget: ~$20/mo for 200–300 articles with optimized prompts
- Consider **together.ai** or **groq** for inference at lower cost

### 4. Analytics: Plausible ($9/mo) or Vercel ($0 included)
**Why:** Need analytics for ad network readiness (Mediavine requires traffic data).
- **Vercel Web Analytics:** Free with Pro plan, privacy-friendly
- **Plausible:** $9/mo, self-hostable, GDPR-compliant
- **Alternative:** Umami (free, self-hosted on Vercel)

### 5. Database: Turso Scale ($9–$29/mo)
**Why:** Turso free tier is 500MB — sufficient for current content. When traffic scales:
- **Turso Scalable** at $9/mo for 9GB storage
- Consider **SQLite** for read-only content (Eleventy collections)

### 6. Email: SendGrid/MailerLite ($10–$50/mo)
**Why:** Amazon SES requires manual deliverability management.
- **MailerLite:** $10/mo for up to 1,000 subscribers (lead magnet delivery)
- **SendGrid:** $20/mo for 50K emails/month (transactional)

## Total Projected Monthly Cost at Scale

| Tier | Monthly Cost | Key Benefits |
|------|-------------|--------------|
| **Bootstrap** | $0 | Static site, manual builds |
| **Medium** | ~$50/mo | Vercel Pro + Plausible + MailerLite |
| **Full Scale** | ~$150/mo | + Cloudinary + Database + AI API |

## Traffic Thresholds for Upgrading

| Metric | Threshold | Action |
|--------|-----------|--------|
| Monthly visits | 10,000 | Upgrade to Vercel Pro |
| Image bandwidth | 25GB/mo | Add Cloudinary |
| Subscribers | 1,000 | MailerLite paid |
| Build time | >30s | Split into sub-sites |
| Affiliate revenue | >$200/mo | Reinvest 50% into infrastructure |

## Build Performance Monitoring
Current build: 185 files in 0.60s ✅ (well within thresholds)

## Recommended First Upgrade
**When monthly affiliate revenue exceeds $50**, upgrade to **Vercel Pro ($20/mo)** to unlock:
1. Serverless functions for lead magnet delivery
2. Automatic image optimization
3. Analytics integration
4. Preview deployments
