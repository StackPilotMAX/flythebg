# FlyThe BG — Data Retention Schedule

Updated: 2026-10-03

This schedule is an engineering baseline and must be reconciled with the actual providers and applicable legal requirements before production use.

| Data / record | Purpose | Baseline retention |
|---|---|---|
| Browser consent record | Remember optional technology choice | 1 year cookie lifetime; user can clear/change it |
| Uploaded image for background removal | Perform the requested transformation | No FlyThe BG media library; do not intentionally retain after the processing workflow |
| Browser-local image/video source | Local compression | Remains on user's device unless the browser/tool itself stores it |
| Application security logs | Detect, investigate and remediate abuse/incidents | Keep only for the documented operational/security period and apply applicable Rule 6 requirements |
| Privacy request record | Handle rights/grievances | Retain only as long as necessary to manage the request, demonstrate handling, and meet applicable legal obligations |
| Consent audit ledger, if later implemented | Demonstrate consent decisions | Define purpose-specific period before enabling; do not store uploaded media |

## Rules

- Never create a general-purpose media archive for uploaded files.
- Do not keep personal data merely because storage is convenient.
- Processor retention periods must be checked against the processor's actual configuration and contract.
- Delete or anonymize records when the documented purpose ends, unless retention is required by law or necessary for a documented legal/security purpose.
