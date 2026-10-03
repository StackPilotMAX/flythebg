# FlyThe BG — Privacy Operations Runbook

Updated: 2026-10-03

This is an operational engineering runbook, not legal advice.

## Privacy request intake

Primary contact: support@flythebg.com

Requests to classify:
- access / confirmation of processing
- correction or update
- erasure
- consent withdrawal
- grievance
- child-data concern
- security or personal-data incident
- processor/privacy disclosure question

Do not ask a requester to email an uploaded photograph when a safer description or secure transfer method is sufficient.

## Intake record

For each request, record only what is needed to manage the request:
- received timestamp
- request category
- requester's contact channel
- status
- responsible operator
- outcome and completion timestamp
- relevant legal/policy basis where applicable

Do not store uploaded media in the request ledger.

## Consent

The website's consent UI records a consent ID, policy version, timestamp, source and category choices in browser storage. This is a user-visible preference record, not an immutable audit ledger.

If a processing activity requires stronger evidence, implement a server-side consent ledger before relying on that evidence operationally.

## Children

A checkbox is not treated as verifiable parental/legal-guardian consent. If a request knowingly involves children's personal data, pause the processing decision and route it for manual compliance review unless an applicable documented mechanism/exemption has been established.

## Provider register

Before enabling analytics, advertising, affiliate attribution, email processing, or any new processor:
1. record the provider;
2. document the data categories and purpose;
3. identify where processing occurs;
4. review the provider's contractual/privacy terms;
5. confirm the website consent gate required for the activity;
6. document retention/deletion behavior;
7. record the owner responsible for the integration.

## Review cadence

Review this runbook whenever a new processor, advertising platform, analytics tool, affiliate network, upload workflow, or material privacy-policy change is introduced.
