# FlyThe BG — Processor / Third-Party Register

Updated: 2026-10-03

This register is an engineering inventory, not a substitute for provider contracts or legal review.

| Provider / system | Current use observed in repository | Personal-data role | Website consent gate |
|---|---|---|---|
| Cloudflare Workers / Assets | Hosting, routing, API execution and static delivery | Infrastructure / processor where applicable | Strictly necessary for core service |
| Hugging Face Space | Protected background-removal processing route | Processing provider for images submitted to Remove Background | Tool-specific processing notice/affirmative action; not a marketing-cookie consent |
| Google advertising entry in ads.txt | ads.txt contains a Google publisher entry | Advertising relationship is indicated by the file, but no runtime ad script is assumed solely from ads.txt | Any actual optional advertising/measurement technology must be loaded only after the applicable consent |
| Analytics provider | No runtime provider is intentionally enabled by the consent manager | None currently enabled by this control layer | Analytics category |
| Affiliate/referral provider | No specific affiliate network is currently asserted by the website | None currently enabled by this control layer | Affiliate category |

## Activation rule

Before adding a runtime third-party script, pixel, SDK, referral identifier, or advertising tag:
1. name the provider in the privacy/cookie notice;
2. document its purpose and data categories;
3. document international processing/transfer considerations;
4. review its contractual/privacy terms;
5. connect it to the correct consent category;
6. verify that rejection prevents its optional activation;
7. document retention and deletion behavior.

Do not treat ads.txt as proof that advertising cookies or tracking are active.
