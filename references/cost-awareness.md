# Cost awareness

Every external service should be understood in terms of what causes cost to increase.

Common sources:
- AI API calls;
- hosting/serverless execution;
- databases;
- storage and bandwidth;
- image/video/audio processing;
- email/SMS;
- maps/search APIs;
- monitoring;
- domains;
- payment processing.

## When adding a service, determine

- Is there a free tier?
- Does signup require a payment method?
- Can usage automatically exceed the free tier?
- Is pricing fixed or usage-based?
- Are spending limits, quotas, or alerts available?
- Which user behavior drives the cost?

Do not equate “free tier” with “cannot charge”.

For public AI features, consider request volume, expensive models/media, retries, automation loops, rate limits, and abuse before exposing a paid endpoint without protection.
