# Deployment

A project working on the builder's computer is not automatically available to other people.

## Minimal model

```
project
  ↓
production build/runtime
  ↓
hosting/service
  ↓
live URL
  ↓
optional custom domain
```

Hosting is where the product runs. A domain is a readable address. DNS connects a domain to the service that serves the product.

## Before deployment, determine

- Which devices and browsers matter for the intended experience?
- Is the product meant to be opened in a browser, installed like a PWA, or both?
- Who should be able to access it?
- Is it intentionally public?
- Does it have server-side functionality?
- Which environment variables/secrets are required?
- Which database/storage/auth services are production dependencies?
- Can the chosen services generate cost?

## Production verification

Verify the real deployed URL, not only localhost:
- main page loads;
- important interactions work;
- assets and API requests succeed;
- persistent data reads/writes correctly;
- authentication works when relevant;
- mobile behavior works on the intended form factors when relevant;
- install/relaunch behavior works when a PWA-like experience is promised;
- offline or poor-network behavior matches what was promised, if relevant.

A successful deployment means **online**, not automatically **complete** or **secure**.
