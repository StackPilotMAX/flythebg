# FlyThe BG — Personal Data Incident Response

Updated: 2026-10-03

This runbook is for operational response and is not legal advice.

## Trigger

Treat as an incident when there is a suspected unauthorized access, disclosure, loss, alteration, destruction, or other compromise of personal data or credentials.

## First response

1. Preserve relevant security evidence without collecting unnecessary personal data.
2. Contain the affected route, credential, processor or deployment.
3. Rotate exposed secrets where appropriate.
4. Record when the incident was detected and by whom.
5. Identify affected systems, providers, data categories and approximate scope.
6. Notify the project owner/security contact.

## DPDP notification preparation

The notified DPDP Rules require prompt notification to affected Data Principals and notification to the Board when a personal-data breach is known, with detailed Board information due within 72 hours or a longer period if permitted by the Rule.

Prepare:
- nature of the breach;
- timing and affected systems;
- categories and approximate scope of data;
- likely consequences;
- mitigation already taken;
- safety steps for affected people;
- responsible contact details;
- remedial/preventive actions.

Actual notification decisions and legal timing should be confirmed by the responsible legal/compliance operator.

## Provider incident

If Cloudflare, Hugging Face/Gradio, email, analytics, advertising, or affiliate providers report an incident:
- capture the provider incident reference;
- identify FlyThe BG data potentially affected;
- obtain provider containment/remediation details;
- document notification obligations;
- close only after remediation and evidence are recorded.

## Post-incident

Document root cause, corrective actions, secret rotation, affected deployments, provider changes and any required privacy-policy or consent changes.
