const CONSENT_KEY = "flythebg_consent_v1";
const CONSENT_COOKIE = "flythebg_consent";
const CONSENT_VERSION = "2026-10-03";
const POLICY_VERSION = "2026-10-03";

type Consent = {
  version: string; policyVersion: string; consentId: string; agreedAt: string;
  source: "banner" | "settings"; necessary: true;
  preferences: boolean; analytics: boolean; marketing: boolean; affiliate: boolean;
};
type OptionalCategory = "preferences" | "analytics" | "marketing" | "affiliate";
const OPTIONAL_CATEGORIES: Array<{key: OptionalCategory; title: string; description: string}> = [
  {key:"preferences",title:"Preferences",description:"Remembers optional interface choices and non-essential convenience settings."},
  {key:"analytics",title:"Analytics",description:"Helps us understand aggregate site usage and improve reliability and usability."},
  {key:"marketing",title:"Advertising & marketing",description:"Allows advertising, campaign measurement, audience features or similar marketing technologies when they are actually enabled."},
  {key:"affiliate",title:"Affiliate & referral",description:"Allows optional referral attribution when you arrive through an affiliate or partner link."}
];

function safeRead(): Consent | null {
  try {
    const raw=localStorage.getItem(CONSENT_KEY); if(!raw)return null;
    const v=JSON.parse(raw) as Partial<Consent>;
    if(v.version!==CONSENT_VERSION||v.necessary!==true||typeof v.agreedAt!=="string")return null;
    return {version:CONSENT_VERSION,policyVersion:String(v.policyVersion||POLICY_VERSION),consentId:String(v.consentId||""),agreedAt:v.agreedAt,source:v.source==="settings"?"settings":"banner",necessary:true,preferences:v.preferences===true,analytics:v.analytics===true,marketing:v.marketing===true,affiliate:v.affiliate===true};
  } catch { return null; }
}
function writeCookie(c:Consent):void {
  try {
    const value=encodeURIComponent(JSON.stringify({version:c.version,policyVersion:c.policyVersion,consentId:c.consentId,agreedAt:c.agreedAt,necessary:true,preferences:c.preferences,analytics:c.analytics,marketing:c.marketing,affiliate:c.affiliate}));
    document.cookie=CONSENT_COOKIE+"="+value+"; Max-Age=31536000; Path=/; SameSite=Lax"+(location.protocol==="https:"?"; Secure":"");
  } catch {}
}
function randomId():string {
  try { if(crypto.randomUUID)return crypto.randomUUID(); } catch {}
  return "consent-"+Date.now().toString(36)+"-"+Math.random().toString(36).slice(2,12);
}
function saveConsent(values:Pick<Consent,OptionalCategory>,source:Consent["source"]):Consent {
  const c:Consent={version:CONSENT_VERSION,policyVersion:POLICY_VERSION,consentId:randomId(),agreedAt:new Date().toISOString(),source,necessary:true,preferences:values.preferences===true,analytics:values.analytics===true,marketing:values.marketing===true,affiliate:values.affiliate===true};
  try{localStorage.setItem(CONSENT_KEY,JSON.stringify(c));}catch{}
  writeCookie(c);
  window.dispatchEvent(new CustomEvent("flythebg:consent-changed",{detail:c}));
  return c;
}
function hasConsent(category:"necessary"|OptionalCategory):boolean {
  const c=safeRead(); return category==="necessary" ? true : !!c?.[category];
}
function injectStyles():void {
  if(document.getElementById("flythebg-consent-styles"))return;
  const s=document.createElement("style");s.id="flythebg-consent-styles";
  s.textContent=String.raw`#fly-consent-banner,#fly-consent-settings{position:fixed;z-index:2147483000;inset:auto 18px 18px 18px;display:flex;justify-content:center;pointer-events:none}.fly-consent-card{width:min(920px,100%);max-height:min(88vh,760px);overflow:auto;background:#101411;color:#f5f7f4;border:1px solid rgba(255,255,255,.16);border-radius:22px;box-shadow:0 24px 80px rgba(0,0,0,.42);padding:22px;pointer-events:auto;font:inherit}.fly-consent-card h2{margin:0 0 8px;font-size:clamp(21px,3vw,30px);letter-spacing:-.03em}.fly-consent-card p{margin:7px 0;color:#cbd2cc;line-height:1.55;font-size:14px}.fly-consent-card a{color:#fff;text-decoration:underline;text-underline-offset:3px}.fly-consent-kicker{font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#9fb2a3;font-weight:700;margin-bottom:8px}.fly-consent-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px;margin:16px 0}.fly-consent-option{display:grid;grid-template-columns:auto 1fr;gap:11px;align-items:start;border:1px solid rgba(255,255,255,.11);border-radius:14px;padding:12px;background:rgba(255,255,255,.035)}.fly-consent-option input{width:18px;height:18px;margin:2px 0;accent-color:#fff}.fly-consent-option input:disabled{opacity:.55}.fly-consent-option strong{display:block;font-size:14px}.fly-consent-option small{display:block;color:#aeb7b0;line-height:1.45;margin-top:3px}.fly-consent-required{font-size:10px;text-transform:uppercase;letter-spacing:.1em;color:#9fb2a3}.fly-consent-actions{display:flex;flex-wrap:wrap;gap:9px;margin-top:15px}.fly-consent-actions button{border:0;border-radius:999px;padding:11px 16px;font:inherit;font-weight:700;cursor:pointer}.fly-consent-primary{background:#f4f6f3;color:#101411}.fly-consent-secondary{background:transparent;color:#f4f6f3;border:1px solid rgba(255,255,255,.2)!important}.fly-consent-note{font-size:11px!important;color:#929c95!important;margin-top:12px!important}.fly-consent-settings-button{position:fixed;z-index:2147482990;right:18px;bottom:18px;border:1px solid rgba(255,255,255,.18);background:#111612;color:#f4f6f3;border-radius:999px;padding:9px 13px;font:inherit;font-size:12px;font-weight:700;box-shadow:0 8px 30px rgba(0,0,0,.24);cursor:pointer}.fly-consent-settings-button:hover{background:#1b211c}.fly-dpdp-callout{margin:0 0 22px;padding:16px 18px;border:1px solid rgba(255,255,255,.13);border-radius:16px;background:rgba(255,255,255,.035)}.fly-dpdp-callout strong{display:block;margin-bottom:5px}.fly-dpdp-callout p{margin:5px 0;font-size:13px;line-height:1.6}.fly-affiliate-box{margin-top:28px;padding:18px;border:1px solid rgba(255,255,255,.12);border-radius:16px;background:rgba(255,255,255,.025)}.fly-inline-button{border:0;background:transparent;color:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer;font:inherit;padding:0}@media(max-width:680px){#fly-consent-banner,#fly-consent-settings{inset:auto 10px 10px 10px}.fly-consent-card{border-radius:18px;padding:16px}.fly-consent-grid{grid-template-columns:1fr}.fly-consent-settings-button{right:10px;bottom:10px}}\`;
  document.head.appendChild(s);
}
function categoryMarkup(c:Consent|null):string {
  const x=c||{preferences:false,analytics:false,marketing:false,affiliate:false};
  return OPTIONAL_CATEGORIES.map(k=>'<label class="fly-consent-option"><input type="checkbox" data-consent-category="'+k.key+'" '+(x[k.key]?"checked":"")+'><span><strong>'+k.title+'</strong><small>'+k.description+'</small></span></label>').join("");
}
function buildCard(mode:"banner"|"settings"):HTMLElement {
  const card=document.createElement("div");card.className="fly-consent-card";card.setAttribute("role","dialog");card.setAttribute("aria-modal","true");
  card.innerHTML=String.raw`<div class="fly-consent-kicker">FLYTHE BG · PRIVACY CONTROLS</div><h2 id="\${mode==="banner"?"fly-consent-title":"fly-consent-settings-title"}">\${mode==="banner"?"Choose how optional technologies may be used.":"Privacy & cookie settings"}</h2><p>Strictly necessary technologies are always available for security, consent storage and core site operation. Optional categories are off until you choose them. Your choices are stored with a timestamp, consent version and unique consent record ID in this browser.</p><div class="fly-consent-grid"><label class="fly-consent-option"><input type="checkbox" checked disabled><span><strong>Strictly necessary</strong><small>Core security, routing, consent storage and essential functionality. This category cannot be switched off here.</small><span class="fly-consent-required">Always on</span></span></label>\${categoryMarkup(safeRead())}</div><p>For marketing, analytics or affiliate technologies, FlyThe BG will only activate the relevant optional category after your choice where consent is required. A later provider may have its own privacy policy and controls.</p><div class="fly-consent-actions"><button type="button" class="fly-consent-primary" data-consent-action="accept-all">Accept all</button><button type="button" class="fly-consent-secondary" data-consent-action="reject">Reject non-essential</button><button type="button" class="fly-consent-secondary" data-consent-action="save">Save selected</button>\${mode==="settings"?'<button type="button" class="fly-consent-secondary" data-consent-action="close">Close</button>':""}</div><p class="fly-consent-note">Consent version \${CONSENT_VERSION} · Policy version \${POLICY_VERSION} · <a href="/privacy">Privacy Policy</a> · <a href="/cookies">Cookies</a> · <a href="/terms">Terms</a> · <a href="/affiliates">Affiliate disclosure</a></p>\`;
  return card;
}
function getSelected(card:HTMLElement):Pick<Consent,OptionalCategory>{
  const v=(k:OptionalCategory)=>!!card.querySelector<HTMLInputElement>('[data-consent-category="'+k+'"]')?.checked;
  return {preferences:v("preferences"),analytics:v("analytics"),marketing:v("marketing"),affiliate:v("affiliate")};
}
function showSettings():void {
  document.getElementById("fly-consent-settings")?.remove();
  const w=document.createElement("div");w.id="fly-consent-settings";w.appendChild(buildCard("settings"));document.body.appendChild(w);
  const card=w.firstElementChild as HTMLElement;
  card.querySelectorAll<HTMLButtonElement>("[data-consent-action]").forEach(b=>b.addEventListener("click",()=>{
    const a=b.dataset.consentAction;
    if(a==="close"){w.remove();return}
    if(a==="accept-all"){saveConsent({preferences:true,analytics:true,marketing:true,affiliate:true},"settings");w.remove();return}
    if(a==="reject"){saveConsent({preferences:false,analytics:false,marketing:false,affiliate:false},"settings");w.remove();return}
    if(a==="save"){saveConsent(getSelected(card),"settings");w.remove();}
  }));
}
function showBanner():void {
  if(safeRead()||document.getElementById("fly-consent-banner"))return;
  const w=document.createElement("div");w.id="fly-consent-banner";w.appendChild(buildCard("banner"));document.body.appendChild(w);
  const card=w.firstElementChild as HTMLElement;
  card.querySelectorAll<HTMLButtonElement>("[data-consent-action]").forEach(b=>b.addEventListener("click",()=>{
    const a=b.dataset.consentAction;
    if(a==="accept-all"){saveConsent({preferences:true,analytics:true,marketing:true,affiliate:true},"banner");w.remove();}
    else if(a==="reject"){saveConsent({preferences:false,analytics:false,marketing:false,affiliate:false},"banner");w.remove();}
    else if(a==="save"){saveConsent(getSelected(card),"banner");w.remove();}
  }));
}
function addSettingsButton():void {
  if(document.getElementById("fly-consent-settings-button"))return;
  const b=document.createElement("button");b.id="fly-consent-settings-button";b.className="fly-consent-settings-button";b.type="button";b.textContent="Privacy choices";b.setAttribute("aria-label","Open privacy and cookie settings");b.addEventListener("click",showSettings);document.body.appendChild(b);
}
function addFooterControls():void {
  document.querySelectorAll<HTMLElement>(".fly-site-footer,.fb-home-footer").forEach(footer=>{
    if(footer.querySelector("[data-fly-privacy-controls]"))return;
    const h=document.createElement("div");h.dataset.flyPrivacyControls="1";h.style.cssText="display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:14px;font-size:12px";
    const s=document.createElement("button");s.type="button";s.textContent="Privacy choices";s.style.cssText="border:0;background:transparent;color:inherit;text-decoration:underline;text-underline-offset:3px;cursor:pointer;font:inherit";s.addEventListener("click",showSettings);h.appendChild(s);
    const a=document.createElement("a");a.href="/affiliates";a.textContent="Affiliate disclosure";a.addEventListener("click",e=>{e.preventDefault();history.pushState({},"","/affiliates");renderAffiliatePage();});h.appendChild(a);
    footer.appendChild(h);
  });
}
function patchFooterLanguage():void {
  document.querySelectorAll<HTMLElement>(".fly-site-footer small").forEach(s=>{
    if(s.dataset.flyLegalCopy)return;
    s.dataset.flyLegalCopy="1";
    s.innerHTML=String.raw`Using FlyThe BG does not by itself constitute consent to optional analytics, advertising, marketing or affiliate technologies. Optional technologies are controlled through <button type="button" data-open-consent class="fly-inline-button">Privacy choices</button>. Please review our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>. This website may contain advertising and referral links. FlyThe BG is an independent, non-registered website/project. © 2026 FlyThe BG · support@flythebg.com\`;
    s.querySelector<HTMLButtonElement>("[data-open-consent]")?.addEventListener("click",showSettings);
  });
}
function renderAffiliatePage():void {
  const c=document.querySelector<HTMLElement>("#page-content");if(!c||c.dataset.flyAffiliatePage==="1")return;
  c.dataset.flyAffiliatePage="1";
  document.title="Affiliate & Referral Disclosure — FlyThe BG";
  document.querySelector<HTMLMetaElement>('meta[name="description"]')?.setAttribute("content","FlyThe BG affiliate and referral disclosure, including how referral links, commissions and consent choices are handled.");
  c.innerHTML=String.raw`<main class="page prose legal reveal"><p class="eyebrow">TRANSPARENCY</p><h1>Affiliate & Referral Disclosure</h1><p class="muted">Effective: \${POLICY_VERSION}</p><div class="fly-affiliate-box"><strong>Plain-English disclosure</strong><p>FlyThe BG may use affiliate or referral links in the future. If an eligible link generates a commission or other benefit, this page will disclose that relationship where required. The presence of a referral link does not change the price you pay unless the linked provider says otherwise.</p></div><h2>Referral attribution</h2><p>Where affiliate or referral tracking is used, FlyThe BG will treat it as an optional technology where consent is required. The <strong>Affiliate & referral</strong> setting in Privacy choices controls future optional referral attribution. If a provider operates its own tracking on its destination site, that provider's privacy policy and consent controls also apply.</p><h2>Advertising and marketing</h2><p>FlyThe BG may display advertising or use campaign measurement. Optional advertising, analytics and marketing technologies are not authorised by simply visiting this website; they are gated by the applicable consent choice where consent is legally required.</p><h2>Independence</h2><p>Affiliate or advertising relationships do not mean FlyThe BG controls the external provider, its product, pricing, privacy practices or availability.</p><h2>Questions</h2><p>For a correction or disclosure question, contact <a href="mailto:support@flythebg.com">support@flythebg.com</a>.</p></main>\`;
  c.querySelectorAll<HTMLElement>(".reveal").forEach(e=>e.classList.add("visible"));
}
function patchLegalPages():void {
  const path=location.pathname.replace(/\/+$/,"")||"/";const c=document.querySelector<HTMLElement>("#page-content");if(!c)return;
  if(path==="/affiliates"){renderAffiliatePage();return;}
  if(path==="/privacy"){
    const main=c.querySelector<HTMLElement>(".legal");
    if(main&&!main.querySelector("[data-dpdp-callout]")){
      const box=document.createElement("section");box.className="fly-dpdp-callout";box.dataset.dpdpCallout="1";
      box.innerHTML=String.raw`<strong>India — DPDP compliance notice</strong><p>For processing covered by India's Digital Personal Data Protection Act, 2023 and the notified Digital Personal Data Protection Rules, 2025, FlyThe BG will use clear purpose-specific notices, obtain consent where consent is required, keep optional technologies off until the relevant choice is made, provide a comparable way to withdraw consent, and maintain reasonable security safeguards appropriate to the processing.</p><p>Cookie preferences are separate from consent to process a file for a requested tool. Choosing or rejecting optional cookies does not prevent a user from using a core tool where the tool's own processing requirements are met.</p><p>See <a href="/cookies">Cookies & similar technologies</a> and <a href="/contact">Contact / privacy requests</a>.</p><p><strong>Privacy requests:</strong> Use <a href="/contact">Contact</a> for access, correction, erasure, consent withdrawal, grievance or privacy questions. Include the request type and enough information for us to understand the request; do not email an uploaded photo unless specifically requested through a secure process.</p><p><strong>Children:</strong> Photos may depict children. A general checkbox is not treated as verifiable parental or legal-guardian consent. Do not knowingly submit a child's personal data where the required verification process is not available. If a child-data request is received, it will be routed for manual compliance review.</p><p><strong>Security and incidents:</strong> FlyThe BG maintains server-side credential boundaries and reasonable technical safeguards. Suspected privacy or security incidents should be reported promptly through <a href="/security">Security</a> or <a href="/contact">Contact</a>.</p>\`;
      main.insertBefore(box,main.firstElementChild?.nextSibling||main.firstChild);
    }
  }
  if(path==="/terms"){
    const main=c.querySelector<HTMLElement>(".legal");
    if(main&&!main.querySelector("[data-affiliate-terms]")){
      const box=document.createElement("section");box.className="fly-affiliate-box";box.dataset.affiliateTerms="1";
      box.innerHTML=String.raw`<h2>Advertising, marketing and affiliate links</h2><p>FlyThe BG may use advertising or referral relationships. Optional analytics, marketing, advertising and affiliate technologies are subject to the Privacy Policy and Cookie settings and will not be treated as accepted merely because you visit the website. External providers have their own terms and privacy practices.</p>\`;main.appendChild(box);
    }
  }
  if(path==="/cookies"){
    if(c.dataset.flyCookiePage==="1")return;
    c.dataset.flyCookiePage="1";
    c.innerHTML=String.raw`<main class="page prose legal reveal"><p class="eyebrow">PRIVACY CONTROLS</p><h1>Cookies & similar technologies</h1><p class="muted">Effective: \${POLICY_VERSION}</p><div class="fly-dpdp-callout"><strong>Default position</strong><p>Strictly necessary storage is limited to what is needed for security, consent storage and core operation. Optional analytics, advertising, marketing and affiliate technologies are off until you choose them through Privacy choices where consent is required.</p></div><h2>1. Strictly necessary</h2><p>FlyThe BG may store a first-party consent record so the website remembers your choice. The record contains a consent version, policy version, timestamp, consent ID and category choices. It does not contain the contents of your uploaded media.</p><h2>2. Preferences</h2><p>If enabled, optional preference technologies may remember convenience settings. They are not required to process your files.</p><h2>3. Analytics</h2><p>If enabled and actually deployed, analytics technologies may collect aggregate or technical usage information according to the provider configuration and applicable law.</p><h2>4. Advertising & marketing</h2><p>If enabled and actually deployed, advertising or marketing technologies may process identifiers, device/browser information, contextual information, interaction data or campaign attribution. Google AdSense and Monetag may be used as advertising providers. Their own policies, cookies and processing terms also apply. FlyThe BG will not describe either provider as active unless its ad code is actually deployed.</p><p><strong>Google AdSense:</strong> Google requires publishers to disclose Google/third-party advertising cookies and data use. For personalized ads served to users in the EEA, UK or Switzerland, Google requires a Google-certified consent management platform integrated with the IAB Transparency &amp; Consent Framework. This site's general privacy-choice UI is not represented as a Google-certified CMP. If AdSense is enabled for those regions, the applicable Google-certified CMP configuration must be enabled before personalized advertising is served.</p><p><strong>Monetag:</strong> Monetag advertising formats and any associated tracking are subject to Monetag's publisher terms and privacy requirements. Any optional Monetag technology will be treated as advertising/marketing technology and gated by the applicable consent configuration where consent is required.</p><p><a href="https://policies.google.com/technologies/partner-sites" rel="noopener noreferrer">How Google uses information from sites and apps</a> · <a href="https://monetag.com/terms" rel="noopener noreferrer">Monetag Terms</a></p><h2>5. Affiliate & referral</h2><p>If enabled and actually deployed, referral technology may remember that a visitor arrived through a partner or affiliate link. It is controlled separately so a visitor can allow or reject referral attribution.</p><h2>6. Consent records and withdrawal</h2><p>When you save a choice, FlyThe BG records the time and consent configuration in this browser. You can reopen Privacy choices at any time. Withdrawing optional consent prevents future activation by FlyThe BG of those optional technologies, subject to provider/browser limitations for technologies already placed by third parties.</p><h2>7. No dark patterns</h2><p>Optional categories are not pre-selected in the initial consent request. Necessary technology is clearly separated from optional categories, and rejecting non-essential categories remains available.</p><h2>8. Advertising provider controls</h2><p>Advertising code must never be inserted into the site merely because an ads.txt entry exists. When an advertising provider is activated, the provider, purpose, relevant technologies and applicable consent requirements must be disclosed before activation. Ad placement must remain clearly distinguishable from site content and must not use misleading labels or encourage ad clicks.</p><h2>9. Tool processing is separate</h2><p>Consent to optional cookies is not the same thing as the tool-specific notice required when you deliberately submit an image to the protected background-removal service. Local image/video compression is designed to run in your browser.</p><p><button type="button" data-open-consent class="fly-inline-button">Open Privacy choices</button> · <a class="text-link" href="/privacy">Read the Privacy Policy ↗</a></p></main>\`;
    c.querySelectorAll<HTMLButtonElement>("[data-open-consent]").forEach(b=>b.addEventListener("click",showSettings));
    c.querySelectorAll<HTMLElement>(".reveal").forEach(e=>e.classList.add("visible"));
  }
}
function mount():void { injectStyles(); addSettingsButton(); addFooterControls(); patchFooterLanguage(); patchLegalPages(); if(!safeRead())showBanner(); }
function watchApp():void {
  const app=document.querySelector("#app");if(!app)return;
  const observer=new MutationObserver(()=>{addFooterControls();patchFooterLanguage();patchLegalPages();});
  observer.observe(app,{childList:true,subtree:true});
}
(window as Window & {FlyTheBGConsent?:unknown}).FlyTheBGConsent={get:safeRead,has:hasConsent,openSettings:showSettings,version:CONSENT_VERSION};
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",()=>{mount();watchApp();},{once:true});else{mount();watchApp();}
export {};
