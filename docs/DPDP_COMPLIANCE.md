# FlyThe BG — DPDP / Privacy Compliance Implementation Notes

Updated: 2026-10-03

This document is an engineering compliance checklist, not legal advice. It maps the FlyThe BG implementation to India's Digital Personal Data Protection Act, 2023 (DPDP Act) and the notified Digital Personal Data Protection Rules, 2025.

## Current legal timing

The Rules were notified on 13 November 2025 with phased commencement:
- Rules 1, 2 and 17–21 commenced on publication.
- Rule 4 commences one year after publication: 13 November 2026.
- Rules 3, 5–16, 22 and 23 commence eighteen months after publication: 13 May 2027.

The implementation is being designed ahead of those later dates rather than waiting for the deadlines.

## Implemented in the website

### 1. Granular cookie / similar-technology consent
src/privacy-consent.ts provides:
- Strictly necessary category, always on.
- Preferences category.
- Analytics category.
- Advertising & marketing category.
- Affiliate & referral category.
- Accept all.
- Reject non-essential.
- Save selected.
- Re-openable Privacy choices control.
- Optional categories are not pre-selected in the first request.
- Cookie consent is separate from consent required by a tool to process a user file.

### 2. Consent record
When a user saves a choice, FlyThe BG records in the browser:
- consent version;
- privacy-policy version;
- unique consent ID;
- ISO timestamp (agreedAt);
- source (banner or settings);
- each optional category decision.

A first-party consent cookie mirrors the record so the preference can survive a normal page reload. The record does not contain uploaded media.

### 3. Withdrawal / change of optional consent
The Privacy choices button remains available after the initial choice. A user can switch optional categories off and save again. The website emits a flythebg:consent-changed event and exposes a small client API as window.FlyTheBGConsent so future analytics, advertising and affiliate integrations can be gated consistently.

### 4. No implied optional-cookie consent
The old footer language that could be read as saying that merely using the site accepts the Privacy Policy and Terms has been replaced. The website now states that visiting the site does not itself constitute consent to optional analytics, advertising, marketing or affiliate technologies.

### 5. Cookie policy
The /cookies page now distinguishes:
- necessary storage;
- preferences;
- analytics;
- advertising/marketing;
- affiliate/referral attribution;
- consent records and withdrawal;
- tool processing versus cookie consent.

### 6. Affiliate disclosure
An Affiliate & Referral Disclosure page is available at /affiliates through the SPA and is linked from the footer and consent settings. It does not claim that an affiliate programme is currently active; it establishes the disclosure and consent framework for future referral links.

### 7. DPDP-specific privacy notice
The Privacy Policy now includes a prominent India/DPDP compliance notice covering:
- purpose-specific processing;
- consent where required;
- optional technologies staying off until the relevant choice;
- comparable withdrawal;
- reasonable security safeguards;
- distinction between cookie consent and file-processing consent.

## Legal requirements still requiring operational decisions

These should not be represented as completed merely because the UI is present:

1. Data fiduciary identity and responsible contact
   The Rules require a clearly available contact for processing questions. FlyThe BG currently uses support@flythebg.com. If the project is operated through a legal person/entity, the Privacy Policy should identify that legal entity and address accurately.

2. Children's data
   The Rules provide for verifiable parental/legal-guardian consent for processing children's personal data, subject to specified exemptions. FlyThe BG can receive photographs that may depict children. A legal/compliance decision is required before knowingly processing children's data at scale. A normal checkbox saying "I am a parent" is not equivalent to the Rule's verifiable-consent mechanism.

3. Processor contracts
   Cloudflare, Hugging Face/Gradio, email providers, advertising providers, analytics providers and any affiliate/attribution providers should be inventoried. Where required, contracts/data-processing terms should impose appropriate security and processing obligations.

4. Breach response
   The notified Rules require defined breach handling, including prompt notification to affected Data Principals and notification to the Data Protection Board; the detailed Board notification includes a 72-hour requirement subject to the Rule's terms. FlyThe BG should maintain an incident-response runbook and provider escalation contacts.

5. Retention schedule
   Keep a written purpose-by-purpose retention schedule. Do not use a generic "we keep it as long as necessary" statement where a more precise period can reasonably be defined.

6. International transfers
   Record where Cloudflare, Hugging Face/Gradio, email, analytics, advertising and affiliate providers may process data. Review applicable transfer requirements for the actual providers and jurisdictions.

7. Advertising activation
   ads.txt exists in the repository, but an ads.txt entry is not itself proof that advertising cookies or tracking are active. Any future advertising script must be loaded only after the applicable marketing/advertising consent where required.

8. Analytics activation
   Any analytics script must be added behind the analytics consent gate. Do not put analytics in the initial HTML before consent.

9. Affiliate activation
   Affiliate/referral parameters or identifiers must not be persisted as optional attribution data before the relevant consent where consent is required.

10. Data-subject requests
    Maintain a real operational process for access, correction, erasure, consent withdrawal and grievances. The public contact route should be monitored and have an internal response procedure.

11. Security
    Maintain the existing server-side credential boundary. Do not expose Hugging Face credentials to the browser. Keep upload validation, rate limits, logs and processor security controls under review.

## Important implementation principle

Cookie consent is not the same as consent to process a user-uploaded photograph.

For example:
- Image/video compression is designed to happen locally in the browser.
- Background removal deliberately sends the selected image to the protected FlyThe BG processing route after the tool-specific notice/affirmative action.
- A user rejecting marketing cookies should not be forced to accept marketing cookies merely to use a core tool.

## Evidence / audit limitation

The current consent record is first-party browser storage. It is useful as a user-visible local record, but it is not an immutable server-side audit log and can be deleted by the user, browser, extension or device reset.

If FlyThe BG later needs stronger proof of consent for a particular processing activity or advertising platform, add a controlled server-side consent ledger with:
- purpose/category;
- policy version;
- timestamp;
- consent ID;
- action (accepted/rejected/withdrawn);
- source/interface version;
- minimum technical context needed for integrity;
- access controls and retention rules.

Do not store uploaded images in that ledger.

## Source laws / government material

- Digital Personal Data Protection Act, 2023 — Ministry of Electronics and Information Technology.
- Digital Personal Data Protection Rules, 2025 — notified by MeitY on 13 November 2025.
- MeitY explanatory note to the DPDP Rules, 2025.
