type ToolId = "remove-bg" | "image-compressor" | "video-compressor" | "passport-photo";
type Route = "/" | "/remove-bg" | "/image-compressor" | "/video-compressor" | "/passport-photo" | "/features" | "/about" | "/faq" | "/privacy" | "/terms" | "/contact" | "/support" | "/blogs" | "/blogs/remove-background-online-privacy" | "/blogs/compress-images-in-browser" | "/blogs/webm-video-compression-guide" | "/code-of-conduct" | "/accessibility" | "/security" | "/cookies" | "/changelog";

const VIDEO="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4";
const POSTER="https://d2ol7oe51mr4n9d.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg";
const GITHUB_REPO="StackPilotMAX/flythebg";
const GITHUB_URL="https://github.com/StackPilotMAX/flythebg";
const COFFEE_URL="https://www.buymeacoffee.com/flythebg";
const FLYTHEBG_INSTAGRAM="https://www.instagram.com/flythebg/";
const OWNER_INSTAGRAM="https://www.instagram.com/aadarshf1/";
const GITHUB_PROFILE="https://github.com/StackPilotMAX";
const state:Record<ToolId,boolean>={"remove-bg":false,"image-compressor":false,"video-compressor":false,"passport-photo":false};
const pendingFiles:Partial<Record<ToolId,File>>={};

function setSeo(title:string,description:string):void{
 const path=window.location.pathname;
 const canonical=window.location.origin+(path.replace(/\/+$/,"")||"/");
 const keywords:Record<string,string>={
  "/":"remove background online, image compressor, video compressor, free media tools",
  "/remove-bg":"remove background online, remove image background, transparent PNG, background remover",
  "/image-compressor":"compress image online, compress JPG, compress PNG, image compressor",
  "/video-compressor":"compress video online, WebM compressor, reduce video size, video compression",
  "/features":"image tools, background remover, image compressor, video compressor",
  "/about":"FlyThe BG, privacy-first media tools, browser image tools",
  "/faq":"FlyThe BG FAQ, background removal, image compression, video compression",
  "/blogs":"image processing guides, background removal guide, image compression guide",
  "/blogs/remove-background-online-privacy":"remove background online privacy, background remover privacy",
  "/blogs/compress-images-in-browser":"compress images in browser, local image compression",
  "/blogs/webm-video-compression-guide":"WebM video compression, browser video compression",
  "/privacy":"FlyThe BG privacy policy, image processing privacy",
  "/terms":"FlyThe BG terms, media tools terms",
  "/contact":"FlyThe BG contact, support",
  "/support":"FlyThe BG support, open source media tools",
  "/security":"FlyThe BG security, vulnerability reporting",
  "/accessibility":"FlyThe BG accessibility",
  "/cookies":"FlyThe BG cookies",
  "/code-of-conduct":"FlyThe BG code of conduct",
  "/changelog":"FlyThe BG changelog"
 };
 document.title=title;

 const desc=document.querySelector<HTMLMetaElement>('meta[name="description"]');
 if(desc)desc.content=description;

 let keywordsEl=document.querySelector<HTMLMetaElement>('meta[name="keywords"]');
 if(!keywordsEl){
  keywordsEl=document.createElement("meta");
  keywordsEl.name="keywords";
  document.head.appendChild(keywordsEl);
 }
 keywordsEl.content=keywords[path]||"FlyThe BG, media tools";

 let canonicalEl=document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
 if(!canonicalEl){
  canonicalEl=document.createElement("link");
  canonicalEl.rel="canonical";
  document.head.appendChild(canonicalEl);
 }
 canonicalEl.href=canonical;

 const ogTitle=document.querySelector<HTMLMetaElement>('meta[property="og:title"]');
 if(ogTitle)ogTitle.content=title;
 const ogDescription=document.querySelector<HTMLMetaElement>('meta[property="og:description"]');
 if(ogDescription)ogDescription.content=description;

 let ogUrl=document.querySelector<HTMLMetaElement>('meta[property="og:url"]');
 if(!ogUrl){
  ogUrl=document.createElement("meta");
  ogUrl.setAttribute("property","og:url");
  document.head.appendChild(ogUrl);
 }
 ogUrl.content=canonical;

 const twitterTitle=document.querySelector<HTMLMetaElement>('meta[name="twitter:title"]');
 if(twitterTitle)twitterTitle.content=title;
 const twitterDescription=document.querySelector<HTMLMetaElement>('meta[name="twitter:description"]');
 if(twitterDescription)twitterDescription.content=description;

 const siteUrl="https://flythebg.com/";
 const organizationId=siteUrl+"#organization";
 const websiteId=siteUrl+"#website";
 const toolRoutes=new Set<string>(["/remove-bg","/image-compressor","/video-compressor","/passport-photo"]);
 const isArticle=path.startsWith("/blogs/")&&path!=="/blogs";

 const organization={
  "@type":"Organization",
  "@id":organizationId,
  "name":"FlyThe BG",
  "url":siteUrl,
  "description":"Independent privacy-focused media tools and background-removal project.",
  "email":"support@flythebg.com",
  "sameAs":[GITHUB_URL,FLYTHEBG_INSTAGRAM]
 };
 const website={
  "@type":"WebSite",
  "@id":websiteId,
  "name":"FlyThe BG",
  "url":siteUrl,
  "description":"Media tools for background removal, image compression and browser-based video compression.",
  "inLanguage":"en",
  "publisher":{"@id":organizationId}
 };

 const graph:Array<Record<string,unknown>>=[organization,website];

 if(path==="/"){
  graph.push({
   "@type":"SoftwareApplication",
   "@id":siteUrl+"#application",
   "name":"FlyThe BG",
   "url":canonical,
   "description":description,
   "applicationCategory":"MultimediaApplication",
   "operatingSystem":"Web",
   "browserRequirements":"Requires JavaScript and a modern web browser.",
   "isAccessibleForFree":true,
   "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
   "publisher":{"@id":organizationId}
  });
 }else if(toolRoutes.has(path)){
  graph.push({
   "@type":"SoftwareApplication",
   "@id":canonical,
   "name":title.replace(" | FlyThe BG","").replace(" — FlyThe BG",""),
   "url":canonical,
   "description":description,
   "applicationCategory":"MultimediaApplication",
   "operatingSystem":"Web",
   "browserRequirements":"Requires JavaScript and a modern web browser.",
   "isAccessibleForFree":true,
   "offers":{"@type":"Offer","price":"0","priceCurrency":"USD"},
   "publisher":{"@id":organizationId}
  });
 }

 if(isArticle){
  graph.push({
   "@type":"BlogPosting",
   "@id":canonical+"#article",
   "headline":title,
   "description":description,
   "url":canonical,
   "inLanguage":"en",
   "mainEntityOfPage":canonical,
   "author":{"@id":organizationId},
   "publisher":{"@id":organizationId},
   "articleSection":"FlyThe BG Journal"
  });
 }else if(path!=="/"){
  graph.push({
   "@type":"WebPage",
   "@id":canonical+"#webpage",
   "name":title,
   "description":description,
   "url":canonical,
   "inLanguage":"en",
   "isPartOf":{"@id":websiteId},
   "publisher":{"@id":organizationId}
  });
 }

 if(path!=="/"){
  const itemList:Array<Record<string,unknown>>=[
   {"@type":"ListItem","position":1,"name":"Home","item":siteUrl}
  ];
  if(isArticle){
   itemList.push({"@type":"ListItem","position":2,"name":"Blogs","item":siteUrl+"blogs"});
  }else if(toolRoutes.has(path)){
   itemList.push({"@type":"ListItem","position":2,"name":"Tools","item":siteUrl+"features"});
  }
  itemList.push({"@type":"ListItem","position":isArticle||toolRoutes.has(path)?3:2,"name":title,"item":canonical});

  graph.push({
   "@type":"BreadcrumbList",
   "@id":canonical+"#breadcrumb",
   "itemListElement":itemList
  });
 }

 const schema={
  "@context":"https://schema.org",
  "@graph":graph
 };

 let schemaEl=document.querySelector<HTMLScriptElement>('script[type="application/ld+json"]');
 if(!schemaEl){
  schemaEl=document.createElement("script");
  schemaEl.type="application/ld+json";
  document.head.appendChild(schemaEl);
 }
 schemaEl.dataset.flySchema="1";
 const nonce=document.querySelector<HTMLMetaElement>('meta[name="csp-nonce"]')?.content;
 if(nonce)schemaEl.nonce=nonce;
 schemaEl.textContent=JSON.stringify(schema);
}

function shell(content:string,title:string):string{
 const path=window.location.pathname;
 const descriptions:Record<string,string>={
  "/":"Remove backgrounds with protected AI, compress images locally and create smaller videos with FlyThe BG.",
  "/features":"Explore FlyThe BG media tools for background removal, image compression and browser-based video compression.",
  "/remove-bg":"Remove an image background with FlyThe BG's protected AI processing route. No account required.",
  "/image-compressor":"Compress images locally in your browser without uploading the original file to FlyThe BG.",
  "/video-compressor":"Create a smaller WebM video locally in your browser with visible processing progress.",
  "/passport-photo":"Create passport, visa and ID photo sheets in one continuous browser workflow.",
  "/about":"Learn how FlyThe BG works, why local processing matters and how its protected AI route is structured.",
  "/faq":"Answers to common FlyThe BG questions about uploads, privacy, downloads, mobile use and processing.",
  "/privacy":"FlyThe BG privacy policy covering local compression, background removal, providers, retention and rights.",
  "/terms":"FlyThe BG terms covering tool use, downloads, third-party services, availability and user responsibilities.",
  "/contact":"Contact FlyThe BG for support, privacy requests, corrections and security reports.",
  "/support":"Optional ways to support the FlyThe BG project through GitHub and Buy Me a Coffee.",
  "/blogs":"FlyThe BG Blogs with practical guides about media files, privacy, compression and browser workflows.",
  "/blogs/remove-background-online-privacy":"A practical guide to what happens when you remove a background online and how to assess privacy boundaries.",
  "/blogs/compress-images-in-browser":"A practical guide to browser-based image compression and what changes when processing stays on your device.",
  "/blogs/webm-video-compression-guide":"A practical guide to WebM video compression in browsers, codecs and compatibility.",
  "/code-of-conduct":"FlyThe BG community standards for respectful, constructive and privacy-conscious participation.",
  "/accessibility":"FlyThe BG accessibility statement covering touch controls, keyboard use, reduced motion and reporting problems.",
  "/security":"FlyThe BG security guidance and private vulnerability reporting process.",
  "/cookies":"FlyThe BG notice about cookies and similar browser or advertising technologies.",
  "/changelog":"Recent FlyThe BG product, privacy, navigation and reliability changes.",
 };
 setSeo(title,descriptions[path]||descriptions["/"]);
 const labels:Record<string,[string,string,string]>={
 "/features":["THE TOOLKIT","Media Tools","Designed To Fly"],
 "/remove-bg":["PROTECTED AI","Remove Background","Designed To Fly"],
 "/image-compressor":["BROWSER-LOCAL","Compress Images","Designed To Fly"],
 "/video-compressor":["BROWSER-LOCAL","Compress Videos","Designed To Fly"],
 "/passport-photo":["PRINT STUDIO","Passport & Visa Photos","Designed To Print"],
 "/about":["OUR PROJECT","Built For Creators","Designed To Fly"],
 "/faq":["HELP CENTER","Clear Answers","Designed To Fly"],
 "/privacy":["YOUR PRIVACY","Privacy First","Designed To Fly"],
 "/terms":["OUR TERMS","Simple Terms","Designed To Fly"],
 "/contact":["GET IN TOUCH","Talk To Us","Designed To Fly"],
 "/support":["KEEP IT GOING","Support The Project","Designed To Fly"],
 "/blogs":["FLYTHE BG BLOGS","Practical Guides","Designed To Work"],
 "/blogs/remove-background-online-privacy":["GUIDE","Background Removal","Without the Guesswork"],
 "/blogs/compress-images-in-browser":["GUIDE","Compress Images","Without Uploading"],
 "/blogs/webm-video-compression-guide":["GUIDE","Smaller Video","In Your Browser"],
 "/code-of-conduct":["OPEN SOURCE","Code of Conduct","Build With Respect"],
 "/accessibility":["ACCESSIBILITY","Designed For More People","Less Friction"],
 "/security":["SECURITY","Report A Problem","Protect The Project"],
 "/cookies":["PRIVACY","Cookies & Similar Technologies","Clear Choices"],
 "/changelog":["PROJECT LOG","What Changed","Recent Work"]
 };
 const [eyebrow,line1,line2]=labels[path]||labels["/features"];
 const active=(route:string)=>path===route?' class="is-active" aria-current="page"':'';
 return `<div class="fly-site ${path==="/support"?"fly-site-support":""}">
 <section class="fly-site-hero">
  <div class="fly-bg" aria-hidden="true"><video class="fly-bg-video" muted loop playsinline preload="none" poster="${POSTER}" data-deferred-video aria-hidden="true"><source data-src="${VIDEO}" type="video/mp4"></video><div class="fly-bg-shade"></div></div>
  <div class="fly-page">
   <header class="fly-header"><a class="fly-logo" href="/" aria-label="FlyThe BG home"><img src="/assets/flythebg-logo.png" alt="FlyThe BG" class="site-logo"></a><nav class="fly-nav" aria-label="Primary navigation"><a href="/"${active("/")}>Home</a><a href="/features"${active("/features")}>Tools</a><a href="/about"${active("/about")}>About</a><a href="/contact"${active("/contact")}>Contact</a></nav><a class="fly-signin" href="/features">Get Started</a><button class="fly-burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="fly-mobile-menu"><i></i><i></i><i></i></button></header>
   <div class="fly-mobile-overlay" data-menu-close></div><nav class="fly-mobile-menu" id="fly-mobile-menu" hidden aria-label="Mobile navigation"><a href="/">Home</a><a href="/features">Tools</a><a href="/remove-bg">Remove BG</a><a href="/image-compressor">Images</a><a href="/video-compressor">Videos</a><a href="/passport-photo">Passport Photos</a><a href="/about">About</a><a href="/faq">FAQ</a><a href="/contact">Contact</a><a href="/support">Support</a><a href="/blogs">Blogs</a><a href="/code-of-conduct">Code</a><a href="/accessibility">Accessibility</a><a href="/security">Security</a><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a><a href="/terms">Terms</a></nav>
   <section class="fly-hero"><div class="fly-trust anim" style="--d:.05s"><div class="fly-avatars" aria-hidden="true"><span><span class="fly-avatar-inner">✦</span></span><span><span class="fly-avatar-inner">◌</span></span><span><span class="fly-avatar-inner">↗</span></span></div><div class="fly-trust-pill">${eyebrow}</div></div><h2 class="fly-headline"><span>${line1}</span><span>${line2}</span></h2><p class="fly-subhead anim" style="--d:.28s">FlyThe BG brings practical media tools together in one focused experience.</p><a class="fly-cta anim" style="--d:.4s" href="#page-content">Explore ${line1} ↓</a></section>
   <div class="fly-stats"><div class="fly-stat anim" style="--d:.5s"><span class="fly-stat-icon">&lt;</span><span class="fly-stat-value">15 MB</span><span class="fly-stat-label">Background upload limit</span></div><div class="fly-stat anim" style="--d:.58s"><span class="fly-stat-icon">%</span><span class="fly-stat-value">2</span><span class="fly-stat-label">Browser-local tools</span></div><div class="fly-stat anim" style="--d:.66s"><span class="fly-stat-icon">*</span><span class="fly-stat-value">0</span><span class="fly-stat-label">Accounts required</span></div><div class="fly-stat anim" style="--d:.74s"><span class="fly-stat-icon">#</span><span class="fly-stat-value">1</span><span class="fly-stat-label">Protected AI route</span></div></div>
  </div>
 </section>
 <div class="fly-site-content" id="page-content">${content}</div>
 <footer class="fly-site-footer"><a class="fly-footer-brand" href="/">FlyThe BG</a><nav aria-label="Footer navigation"><a href="/features">Tools</a><a href="/remove-bg">Remove BG</a><a href="/image-compressor">Images</a><a href="/video-compressor">Videos</a><a href="/about">About</a><a href="/faq">FAQ</a><a href="/blogs">Blogs</a><a href="/support">Support</a><a href="/contact">Contact</a><a href="/code-of-conduct">Code of Conduct</a><a href="/accessibility">Accessibility</a><a href="/security">Security</a><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a><a href="/terms">Terms</a></nav><div class="fly-social-links"><a href="${FLYTHEBG_INSTAGRAM}" target="_blank" rel="noopener noreferrer" aria-label="FlyThe BG on Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i> @flythebg</a><a href="${GITHUB_REPO}" target="_blank" rel="noopener noreferrer" aria-label="FlyThe BG GitHub repository"><i class="fa-brands fa-github" aria-hidden="true"></i> FlyThe BG repo</a><a href="${GITHUB_PROFILE}" target="_blank" rel="noopener noreferrer" aria-label="StackPilotMAX GitHub profile"><i class="fa-brands fa-github" aria-hidden="true"></i> StackPilotMAX</a><a href="${OWNER_INSTAGRAM}" target="_blank" rel="noopener noreferrer" aria-label="Project owner on Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i> @aadarshf1</a></div><small>By using FlyThe BG, you accept our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>. This website contains advertising. FlyThe BG is an independent, non-registered website/project and is not operated as a registered company or business entity. © 2026 FlyThe BG · support@flythebg.com</small></footer>
 </div>`;
}

function aiPulse():string{return `<section class="section ai-section reveal"><div class="section-kicker"><span>AI INTERNET PULSE</span><span>21 SEP 2026</span></div><div class="ai-grid">
<article class="ai-card"><span>OPENAI</span><h3>GPT-6 Astra</h3><p>Hard end-to-end work, coding, research and computer use.</p><small>Tip: specify the output format before the task.</small></article>
<article class="ai-card"><span>ANTHROPIC</span><h3>Claude Sonnet 5</h3><p>Agentic coding and knowledge-work capabilities.</p><small>Tip: give constraints, then let it work inside them.</small></article>
<article class="ai-card"><span>GOOGLE</span><h3>Gemini 3.8 Flash</h3><p>Part of Google's September 2026 model wave.</p><small>Tip: screenshots can provide useful visual context.</small></article>
<article class="ai-card"><span>GROK</span><h3>Grok 4.7</h3><p>Long-running coding and knowledge-work focus.</p><small>Tip: ask it to verify its answer before use.</small></article>
</div><p class="micro-note">Model names and capabilities move fast. Snapshot, not endorsement.</p></section>`;}

function postWork(kind:string):void{
 const modal=document.createElement("div");modal.className="modal-backdrop";modal.innerHTML=`<div class="celebrate" role="dialog" aria-modal="true"><button class="modal-x" aria-label="Close">×</button><div class="confetti">✦ ✨ ✦</div><p class="eyebrow">WORK COMPLETE</p><h2>Processing complete.</h2><p>Your ${kind} is ready. If FlyThe BG saved you time, you can optionally support the project:</p><div class="modal-actions"><a class="button primary" href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer">⭐ Give it a GitHub star</a><a class="button coffee" href="/support">☕ Support the project</a><button class="button ghost dismiss">Maybe later</button></div><small>No pressure. FlyThe BG never assumes or records that a Buy Me a Coffee payment happened.</small></div>`;
 document.body.appendChild(modal);modal.querySelector(".modal-x")?.addEventListener("click",()=>modal.remove());modal.querySelector(".dismiss")?.addEventListener("click",()=>modal.remove());modal.addEventListener("click",e=>{if(e.target===modal)modal.remove()});
}

function toolPage(id:ToolId,num:string,title:string,description:string,accept:string,note:string,privacy:string):string{
 const consent=`<label class="upload-confirm"><input type="checkbox" data-consent="${id}" disabled><span class="upload-confirm-check" aria-hidden="true">✓</span><span class="upload-confirm-copy"><strong>Confirm selected file</strong><small>${id==="remove-bg"?"I agree to send this image to the Hugging Face background-removal processor.":"I confirm this file can be processed locally in my browser."}</small></span></label>`;
 return shell(`<main class="tool-page reveal"><div class="tool-intro"><p class="eyebrow">FLYTHE BG · ${num}</p><h1>${title}</h1><p>${description}</p><div class="pills"><span>${id==="remove-bg"?"PROTECTED AI":"LOCAL-FIRST"}</span><span>${note}</span></div></div><section class="tool-workspace"><div class="workspace-head"><span>${id==="remove-bg"?"PROTECTED UPLOAD":"YOUR DEVICE, YOUR FILE"}</span><span data-progress-label="${id}">0%</span></div><label class="big-dropzone" data-dropzone="${id}"><input data-input="${id}" type="file" accept="${accept}"><span class="upload-arrow">↑</span><strong>Drop one file here</strong><small>or tap to browse your device</small><em>${id==="remove-bg"?"PNG · JPG · WEBP · max 15 MB":"nothing leaves your browser"}</em></label><div class="upload-preview" data-preview="${id}" hidden><div class="upload-preview-media" data-preview-media="${id}"></div><div class="upload-preview-info"><strong data-file-name="${id}">File selected</strong><small data-file-size="${id}"></small><button type="button" class="upload-change" data-change="${id}">Choose a different file</button></div></div>${consent}<button class="button primary process-button" data-process="${id}" type="button" disabled>${id==="remove-bg"?"Remove background →":"Compress file →"}</button><div class="progress-track"><div class="progress-bar" data-progress="${id}"></div></div><p class="status" role="status" aria-live="polite" data-status="${id}">Ready when you are. Processing status will appear here.</p></section><p class="processing-note">${privacy}</p></main>`,`${title} — FlyThe BG`);
}

function home():string{
 setSeo("FlyThe BG — Media Tools Designed To Fly","Remove backgrounds with protected AI, compress images locally and create smaller videos in one focused media toolkit.");
 return `<main class="fly-home">
  <div class="fly-bg" aria-hidden="true">
   <video class="fly-bg-video" muted loop playsinline preload="none" poster="${POSTER}" data-deferred-video aria-hidden="true">
    <source data-src="${VIDEO}" type="video/mp4">
   </video>
   <div class="fly-bg-shade"></div>
  </div>
  <div class="fly-page">
   <header class="fly-header">
    <a class="fly-logo" href="/" aria-label="FlyThe BG home"><img src="/assets/flythebg-logo.png" alt="FlyThe BG" class="site-logo"></a>
    <nav class="fly-nav" aria-label="Primary navigation">
     <a class="is-active" href="/">Home</a>
     <a href="/features">Tools</a>
     <a href="/about">About</a>
     <a href="/contact">Contact</a>
    </nav>
    <a class="fly-signin" href="/features">Get Started</a>
    <button class="fly-burger" type="button" aria-label="Open menu" aria-expanded="false" aria-controls="fly-mobile-menu"><i></i><i></i><i></i></button>
   </header>
   <div class="fly-mobile-overlay" data-menu-close></div>
   <nav class="fly-mobile-menu" id="fly-mobile-menu" hidden aria-label="Mobile navigation">
    <a class="is-active" href="/">Home</a>
    <a href="/features">Tools</a>
    <a href="/remove-bg">Remove BG</a>
    <a href="/image-compressor">Image Compressor</a>
    <a href="/video-compressor">Video Compressor</a>
    <a href="/about">About</a>
    <a href="/faq">FAQ</a>
    <a href="/blogs">Blogs</a>
    <a href="/contact">Contact</a>
    <a href="/support">Support</a>
    <a href="/privacy">Privacy</a>
    <a class="fly-mobile-cta" href="/features">Get Started</a>
   </nav>
   <section class="fly-hero">
    <div class="fly-trust anim" style="--d:.05s">
     <div class="fly-avatars" aria-hidden="true">
      <span><span class="fly-avatar-inner">✦</span></span>
      <span><span class="fly-avatar-inner">◌</span></span>
      <span><span class="fly-avatar-inner">↗</span></span>
     </div>
     <div class="fly-trust-pill">Built for creators &amp; teams</div>
    </div>
    <h1 class="fly-headline" aria-label="Media tools designed to fly"><span>Media Tools</span><span>Designed To Fly</span></h1>
    <p class="fly-subhead anim" style="--d:.28s">Remove backgrounds with protected AI, compress images and create smaller videos with tools designed for fast, focused work.</p>
    <a class="fly-cta anim" style="--d:.4s" href="#home-tools">Get Started</a>
   </section>
   <footer class="fly-stats" aria-label="FlyThe BG highlights">
    <div class="fly-stat anim" style="--d:.5s"><span class="fly-stat-icon">&lt;</span><span class="fly-stat-value" data-count="15" data-decimals="0" data-suffix=" MB">0</span><span class="fly-stat-label">Background upload limit</span></div>
    <div class="fly-stat anim" style="--d:.58s"><span class="fly-stat-icon">%</span><span class="fly-stat-value" data-count="2" data-decimals="0" data-suffix="">0</span><span class="fly-stat-label">Browser-local tools</span></div>
    <div class="fly-stat anim" style="--d:.66s"><span class="fly-stat-icon">*</span><span class="fly-stat-value" data-count="0" data-decimals="0" data-suffix="">0</span><span class="fly-stat-label">Accounts required</span></div>
    <div class="fly-stat anim" style="--d:.74s"><span class="fly-stat-icon">#</span><span class="fly-stat-value" data-count="1" data-decimals="0" data-suffix="">0</span><span class="fly-stat-label">Protected AI route</span></div>
   </footer>
  </div>
  <section class="home-scroll-section home-tools-section" id="home-tools" aria-labelledby="home-tools-title">
   <div class="home-section-heading">
    <p class="eyebrow">START HERE</p>
    <h2 id="home-tools-title">Four tools. Clear boundaries.</h2>
    <p>Open a folder to peek inside. Each tool keeps its processing boundary visible before you start.</p>
   </div>
   <div class="home-folder-grid">
    <article class="home-folder-card">
     <button class="interactive-folder" type="button" data-folder-toggle aria-expanded="false" aria-controls="folder-remove-bg" style="--folder-color:#7C3AED;--folder-back:#5B21B6">
      <span class="folder-canvas" aria-hidden="true">
       <span class="folder-paper paper-one"><span class="paper-icon">✦</span><small>AI</small></span>
       <span class="folder-paper paper-two"><span class="paper-icon">PNG</span><small>JPG · WEBP</small></span>
       <span class="folder-paper paper-three"><span class="paper-icon">↗</span><small>15 MB</small></span>
       <span class="folder-back"><span class="folder-tab"></span></span>
       <span class="folder-flap folder-flap-left"></span><span class="folder-flap folder-flap-right"><span class="folder-label">REMOVE BG</span></span>
      </span>
     </button>
     <div class="home-folder-info" id="folder-remove-bg">
      <span>01 · PROTECTED AI</span><strong>Remove Background</strong><small>Send one image through the protected processing route.</small>
      <a href="/remove-bg" class="text-link">Open tool ↗</a>
     </div>
    </article>
    <article class="home-folder-card">
     <button class="interactive-folder" type="button" data-folder-toggle aria-expanded="false" aria-controls="folder-image-compressor" style="--folder-color:#2563EB;--folder-back:#1D4ED8">
      <span class="folder-canvas" aria-hidden="true">
       <span class="folder-paper paper-one"><span class="paper-icon">IMG</span><small>JPG · PNG</small></span>
       <span class="folder-paper paper-two"><span class="paper-icon">%</span><small>Smaller</small></span>
       <span class="folder-paper paper-three"><span class="paper-icon">↘</span><small>Local</small></span>
       <span class="folder-back"><span class="folder-tab"></span></span>
       <span class="folder-flap folder-flap-left"></span><span class="folder-flap folder-flap-right"><span class="folder-label">COMPRESS</span></span>
      </span>
     </button>
     <div class="home-folder-info" id="folder-image-compressor">
      <span>02 · BROWSER-LOCAL</span><strong>Compress Image</strong><small>Reduce image size directly on your device.</small>
      <a href="/image-compressor" class="text-link">Open tool ↗</a>
     </div>
    </article>
    <article class="home-folder-card">
     <button class="interactive-folder" type="button" data-folder-toggle aria-expanded="false" aria-controls="folder-video-compressor" style="--folder-color:#EF4444;--folder-back:#B91C1C">
      <span class="folder-canvas" aria-hidden="true">
       <span class="folder-paper paper-one"><span class="paper-icon">▶</span><small>VIDEO</small></span>
       <span class="folder-paper paper-two"><span class="paper-icon">WEBM</span><small>Smaller</small></span>
       <span class="folder-paper paper-three"><span class="paper-icon">↘</span><small>Local</small></span>
       <span class="folder-back"><span class="folder-tab"></span></span>
       <span class="folder-flap folder-flap-left"></span><span class="folder-flap folder-flap-right"><span class="folder-label">VIDEO</span></span>
      </span>
     </button>
     <div class="home-folder-info" id="folder-video-compressor">
      <span>03 · BROWSER-LOCAL</span><strong>Compress Video</strong><small>Create a smaller WebM without uploading the original.</small>
      <a href="/video-compressor" class="text-link">Open tool ↗</a>
     </div>
    </article>
    <article class="home-folder-card">
     <button class="interactive-folder" type="button" data-folder-toggle aria-expanded="false" aria-controls="folder-passport-photo" style="--folder-color:#FACC15;--folder-back:#CA8A04">
      <span class="folder-canvas" aria-hidden="true">
       <span class="folder-paper paper-one"><span class="paper-icon">ID</span><small>PHOTO</small></span>
       <span class="folder-paper paper-two"><span class="paper-icon">CM</span><small>INCHES</small></span>
       <span class="folder-paper paper-three"><span class="paper-icon">A4</span><small>PRINT</small></span>
       <span class="folder-back"><span class="folder-tab"></span></span>
       <span class="folder-flap folder-flap-left"></span><span class="folder-flap folder-flap-right"><span class="folder-label">PASSPORT</span></span>
      </span>
     </button>
     <div class="home-folder-info" id="folder-passport-photo">
      <span>04 · PRINT STUDIO</span><strong>Passport Size Visa Photo Maker</strong><small>Crop, background, exact size, paper layout and printable copies.</small>
      <a href="/passport-photo" class="text-link">Open tool ↗</a>
     </div>
    </article>

   </div>
  </section>
  <section class="home-scroll-section home-privacy-section" aria-labelledby="home-privacy-title">
  <section class="home-scroll-section home-faq-section" aria-labelledby="home-faq-title">
   <div class="home-section-heading"><p class="eyebrow">REAL QUESTIONS</p><h2 id="home-faq-title">The things people usually want to know first.</h2><p>Answers are written around the actual decisions people make before uploading a file.</p></div>
   <div class="home-faq-list">
    <details open><summary>Will my image be stored after I remove the background?</summary><p>FlyThe BG does not provide persistent user file storage for the tool. The image is forwarded to the background-removal processor for the requested job and is not intentionally written to a FlyThe BG storage bucket or gallery. Independent infrastructure may have temporary runtime handling or logs; see the privacy policy for the boundary.</p></details>
    <details><summary>Can I use FlyThe BG on my phone?</summary><p>Yes. The interface is designed for touch screens, mobile navigation, file selection and recovery downloads. Browser capabilities can still vary by device and file type.</p></details>
    <details><summary>What happens if I accidentally cancel the download?</summary><p>The result stays available in the current browser tab for recovery. Use the visible download button again rather than re-uploading your source file.</p></details>
    <details><summary>Do I have to create an account?</summary><p>No FlyThe BG account is required for the current tools.</p></details>
    <details><summary>Which tools send a file to a server?</summary><p>Remove Background sends the selected image through the protected FlyThe BG processing route. Image and video compression are designed to stay local in the browser.</p></details>
    <details><summary>Why can background removal sometimes take longer?</summary><p>The protected AI processor can need time to wake from a cold start. The website is built to tolerate that startup rather than treating a short delay as an immediate failure.</p></details>
    <details><summary>Will compressing my image upload it?</summary><p>No. Image compression is performed with browser APIs on your device.</p></details>
    <details><summary>Can I use the result commercially?</summary><p>FlyThe BG does not decide whether you have the rights to the source material or output. Make sure the files, logos, photographs and other content you use are yours or properly licensed for your intended use.</p></details>
   </div>
   <a class="text-link" href="/faq">See the complete FAQ ↗</a>
  </section>
  <section class="home-scroll-section home-blog-section" aria-labelledby="home-blog-title">
   <div class="home-section-heading"><p class="eyebrow">FROM THE JOURNAL</p><h2 id="home-blog-title">Practical guides for real workflows.</h2><p>No filler. Short explanations about files, formats, privacy and browser-based media work.</p></div>
   <div class="home-blog-grid">
    <a href="/blogs/remove-background-online-privacy"><span>GUIDE</span><strong>What actually happens when you remove a background online?</strong><small>Privacy, processing and what to check before uploading.</small></a>
    <a href="/blogs/compress-images-in-browser"><span>GUIDE</span><strong>How browser-based image compression works</strong><small>When local processing is enough and what it changes.</small></a>
    <a href="/blogs/webm-video-compression-guide"><span>GUIDE</span><strong>Why your compressed video may become WebM</strong><small>A practical guide to browser codecs and compatibility.</small></a>
   </div>
   <a class="text-link" href="/blogs">Read the FlyThe BG Blogs ↗</a>
  </section>
  <section class="home-scroll-section home-final-cta">
   <p class="eyebrow">READY WHEN YOU ARE</p><h2>Pick a tool and keep moving.</h2><div class="home-final-actions"><a class="fly-cta" href="/features">Open the toolkit</a><a class="text-link" href="/support">Support the project ↗</a></div>
  </section>
 <footer class="fly-site-footer fly-home-footer"><a class="fly-footer-brand" href="/">FlyThe BG</a><nav aria-label="Footer navigation"><a href="/features">Tools</a><a href="/remove-bg">Remove BG</a><a href="/image-compressor">Images</a><a href="/video-compressor">Videos</a><a href="/about">About</a><a href="/faq">FAQ</a><a href="/blogs">Blogs</a><a href="/support">Support</a><a href="/contact">Contact</a><a href="/code-of-conduct">Code of Conduct</a><a href="/accessibility">Accessibility</a><a href="/security">Security</a><a href="/privacy">Privacy</a><a href="/cookies">Cookies</a><a href="/terms">Terms</a></nav><div class="fly-social-links"><a href="${FLYTHEBG_INSTAGRAM}" target="_blank" rel="noopener noreferrer" aria-label="FlyThe BG on Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i> @flythebg</a><a href="${GITHUB_REPO}" target="_blank" rel="noopener noreferrer" aria-label="FlyThe BG GitHub repository"><i class="fa-brands fa-github" aria-hidden="true"></i> FlyThe BG repo</a><a href="${GITHUB_PROFILE}" target="_blank" rel="noopener noreferrer" aria-label="StackPilotMAX GitHub profile"><i class="fa-brands fa-github" aria-hidden="true"></i> StackPilotMAX</a><a href="${OWNER_INSTAGRAM}" target="_blank" rel="noopener noreferrer" aria-label="Project owner on Instagram"><i class="fa-brands fa-instagram" aria-hidden="true"></i> @aadarshf1</a></div><small>By using FlyThe BG, you accept our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>. This website contains advertising. FlyThe BG is an independent, non-registered website/project and is not operated as a registered company or business entity. © 2026 FlyThe BG · support@flythebg.com</small></footer>
 </main>`;
}

function notFound():string{return shell(`<main class="page prose reveal"><p class="eyebrow">404 · PAGE NOT FOUND</p><h1>That page has flown away.</h1><p>The address may be outdated or mistyped. The tools and guides are still here.</p><div class="home-final-actions"><a class="fly-cta" href="/">Back home</a><a class="text-link" href="/features">Open the toolkit ↗</a><a class="text-link" href="/faq">Read the FAQ ↗</a></div></main>`,"404 — FlyThe BG");}

function features():string{return shell(`<main class="page reveal"><div class="page-hero center-heading"><p class="eyebrow">GET STARTED</p><h1>Choose a tool.<br>and get to work.</h1><p>Focused workspaces, visible progress and plain-English privacy boundaries.</p></div><div class="tool-links"><a href="/remove-bg"><span>01</span><div><b>Remove Background</b><small>Protected AI · PNG/JPG/WEBP · 15 MB</small></div><strong>Open ↗</strong></a><a href="/image-compressor"><span>02</span><div><b>Image Compressor</b><small>Runs locally in your browser</small></div><strong>Open ↗</strong></a><a href="/video-compressor"><span>03</span><div><b>Video Compressor</b><small>Local WebM with live progress</small></div><strong>Open ↗</strong></a><a href="/passport-photo"><span>04</span><div><b>Passport Size Visa Photo Maker</b><small>Crop · background · exact size · printable sheets</small></div><strong>Open ↗</strong></a></div><div class="tip-card"><b>Tip:</b> For large video files, close unnecessary browser tabs to keep more memory available.</div></main>`,"Get Started — FlyThe BG");}

function passportPhotoPage():string{return shell(`<main class="passport-page-shell passport-one-page reveal"><section class="passport-hero"><p class="eyebrow">PRINT STUDIO · 04</p><h1>Passport Size Visa Photo Maker</h1><p>Create exact-size passport, visa and ID photo sheets from any source image. One page, clear checks, printable output.</p></section><section class="passport-card"><div class="passport-step-head"><span>01</span><div><p class="eyebrow">START</p><h2>Upload your photo</h2><p>PNG, JPG or WEBP · up to 15 MB</p></div></div><label class="passport-upload-zone" for="passport-input"><input id="passport-input" type="file" accept="image/png,image/jpeg,image/webp" hidden><strong>Drop your photo here</strong><span>or choose a file from your device</span></label><div class="passport-upload-preview" id="passport-upload-preview" hidden><img id="passport-source" alt="Selected source photo" hidden><div><b id="passport-file-name">Photo ready</b><small id="passport-file-meta"></small><button class="button ghost" type="button" id="passport-change">Choose another</button></div></div><label class="passport-consent"><input type="checkbox" id="passport-consent" required><span class="passport-consent-check" aria-hidden="true">✓</span><span>I accept the <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>. If I choose background removal, my image will be sent through FlyThe BG’s protected AI route.</span></label><p class="passport-status" id="passport-status" role="status">Choose a photo to continue.</p></section><section class="passport-card"><div class="passport-step-head"><span>02</span><div><p class="eyebrow">SELECT</p><h2>Select the exact area you need</h2><p>Draw a crop area directly on the image. Any source dimension is supported.</p></div></div><div class="passport-crop-layout"><div class="passport-crop-stage" id="passport-crop-stage"><p class="passport-crop-placeholder" id="passport-crop-placeholder">Upload a photo above to open the crop editor.</p><img id="passport-crop-image" alt="Photo crop editor" hidden><div id="passport-crop-box" class="passport-crop-box" hidden><span>Selected area</span></div></div><div class="passport-crop-controls"><button class="button primary" type="button" id="passport-select-area" disabled>Draw / redraw area</button><button class="button ghost" type="button" id="passport-default-area" disabled>Default passport photo area</button><button class="button ghost" type="button" id="passport-reset-area" disabled>Reset to full photo</button><p>Draw from one corner to another. The final photo is fitted to the requested physical ratio without stretching.</p><div class="passport-selection-readout" id="passport-selection-readout">No area selected yet.</div><div class="passport-step2-ai"><h3>Remove the background</h3><p>Use AI on your selected photo. Accept the privacy notice in Step 1 first.</p><button class="button primary" type="button" id="passport-step2-remove" disabled>Remove background now</button></div><div class="passport-processing" id="passport-processing" hidden role="status" aria-live="polite"><div class="passport-processing-spinner" aria-hidden="true"></div><div class="passport-processing-copy"><strong id="passport-processing-title">Preparing your photo…</strong><p id="passport-processing-detail">Please keep this page open while we process your image.</p><div class="passport-processing-track"><span></span></div><small>AI background removal can take 20–30 seconds or longer when the processor is waking up.</small></div></div><div class="passport-processed-preview" id="passport-processed-preview" hidden><strong>Prepared photo preview</strong><img id="passport-processed-image" alt="Prepared passport photo" hidden></div></div></section><section class="passport-card"><div class="passport-step-head"><span>03</span><div><p class="eyebrow">BACKGROUND</p><h2>Keep or remove the background</h2><p>Remove uses the existing FlyThe BG rembg route and its existing Cloudflare Worker credential. No Hugging Face Space changes are made.</p></div></div><div class="passport-choice-grid"><button type="button" class="passport-choice is-selected" data-bg-choice="keep" aria-pressed="true"><strong>Keep background</strong><span>Use the selected photo as-is.</span></button><button type="button" class="passport-choice" data-bg-choice="remove" aria-pressed="false"><strong>Remove background</strong><span>Uses the same /api/remove-bg endpoint as the existing tool.</span></button></div><button class="button primary passport-bg-action" type="button" id="passport-bg-process" disabled>Prepare background</button></div></section><section class="passport-card"><div class="passport-step-head"><span>04</span><div><p class="eyebrow">PHOTO SIZE</p><h2>Set the physical photo size</h2><p>Use a preset or enter your own dimensions in centimetres or inches.</p></div></div><div class="passport-form-grid"><label>Unit<select id="passport-photo-unit"><option value="cm">Centimetres (cm)</option><option value="in">Inches (in)</option></select></label><label>Preset<select id="passport-photo-preset"><option value="35x45">35 × 45 mm / 3.5 × 4.5 cm</option><option value="2x2in">2 × 2 in</option><option value="33x48">33 × 48 mm / 3.3 × 4.8 cm</option><option value="50x50">50 × 50 mm / 5 × 5 cm</option><option value="custom">Custom</option></select></label><label>Width<input id="passport-photo-width" type="number" min=".1" step=".01" value="3.5"></label><label>Height<input id="passport-photo-height" type="number" min=".1" step=".01" value="4.5"></label></div></section><section class="passport-card"><div class="passport-step-head"><span>05</span><div><p class="eyebrow">BACKGROUND STYLE</p><h2>Choose the final background</h2><p>Start with recommended colours, then use HEX, RGB, a colour picker or your own background image.</p></div></div><div class="passport-swatches" id="passport-swatches"><button type="button" data-bg-color="#FFFFFF" class="is-selected" style="--swatch:#fff"><span>White</span></button><button type="button" data-bg-color="#F5F5F5" style="--swatch:#f5f5f5"><span>Soft white</span></button><button type="button" data-bg-color="#EAF2F8" style="--swatch:#eaf2f8"><span>Cool white</span></button><button type="button" data-bg-color="#DDEBFF" style="--swatch:#ddebff"><span>Light blue</span></button><button type="button" data-bg-color="#E8E8E8" style="--swatch:#e8e8e8"><span>Light grey</span></button></div><div class="passport-color-controls"><label>Colour picker<input id="passport-color" type="color" value="#FFFFFF"></label><label>HEX<input id="passport-hex" value="#FFFFFF" maxlength="7"></label><label>RGB<input id="passport-rgb" value="255, 255, 255"></label></div><label class="passport-image-bg">Optional custom background image<input id="passport-bg-image" type="file" accept="image/png,image/jpeg,image/webp"></label></section><section class="passport-card"><div class="passport-step-head"><span>06</span><div><p class="eyebrow">PAPER</p><h2>Choose your print sheet</h2><p>More than 10 common paper sizes are included. Values can be viewed in cm or inches.</p></div></div><div class="passport-form-grid"><label>Unit<select id="passport-paper-unit"><option value="cm">Centimetres (cm)</option><option value="in">Inches (in)</option></select></label><label>Paper size<select id="passport-paper-preset"></select></label><label>Paper width<input id="passport-paper-width" type="number" min=".1" step=".01"></label><label>Paper height<input id="passport-paper-height" type="number" min=".1" step=".01"></label></div><div class="passport-layout-summary" id="passport-layout-summary">Choose a paper size to calculate the sheet.</div></section><section class="passport-card"><div class="passport-step-head"><span>07</span><div><p class="eyebrow">OUTPUT</p><h2>Choose copies and generate</h2><p>The calculator checks the physical sheet before generation and warns when your requested dimensions cannot fit.</p></div></div><div class="passport-output-controls"><label>Number of photos<input id="passport-copies" type="number" min="1" max="200" value="6"></label><div class="passport-capacity" id="passport-capacity"></div><button class="button primary passport-generate" type="button" id="passport-generate" disabled>Generate printable sheet</button></div><div class="passport-result" id="passport-result" hidden></div></section></main>`,"Passport Size Visa Photo Maker — FlyThe BG");}
function support():string{return shell(`<main class="support-studio reveal"><section class="support-studio-hero"><div class="support-spark">✦ SUPPORT MODE ✦</div><p class="eyebrow">THE ONE PAGE WITH A LITTLE CHAOS</p><h1>FlyThe BG<br><span>runs on vibes &amp; coffee.</span></h1><p>If the tools saved you a tab, a task or a tiny headache, you can keep the project moving. Zero pressure. Seriously.</p><div class="support-actions"><a class="support-btn support-btn-coffee" href="${COFFEE_URL}" target="_blank" rel="noopener noreferrer">☕ Buy me a coffee ↗</a><a class="support-btn support-btn-star" href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer">⭐ Drop a star</a></div><div class="support-disclaimer">Payment happens on Buy Me a Coffee. FlyThe BG never processes your card, receives a payment confirmation, or pretends a redirect means you paid.</div></section><section class="support-chaos-grid"><article><b>01 / FREE SUPPORT</b><h2>Star it.</h2><p>No money. No signup. Just a tiny signal that the project should keep shipping.</p></article><article><b>02 / OPTIONAL IRL</b><h2>Coffee it.</h2><p>Choose your amount on the external Buy Me a Coffee page. Your payment stays there.</p></article><article><b>03 / ABSOLUTELY FINE</b><h2>Skip it.</h2><p>Use FlyThe BG and bounce. “Maybe later” is a completely valid support strategy.</p></article></section><section class="support-marquee" aria-hidden="true"><span>NO GUILT · NO FAKE PAYMENT STATUS · NO ACCOUNT · JUST OPTIONAL SUPPORT · </span><span>NO GUILT · NO FAKE PAYMENT STATUS · NO ACCOUNT · JUST OPTIONAL SUPPORT · </span></section></main>`,"Support FlyThe BG — Buy Me a Coffee");}

function about():string{return shell(`<main class="page prose reveal"><p class="eyebrow">ABOUT FLYTHE BG</p><h1>Useful tools.<br>clear communication.</h1><p>FlyThe BG is an independent project focused on practical media utilities with data minimisation as a design goal. The UI is playful; the security boundary is not.</p><h2>How it works</h2><p>Compression runs locally in your browser. Background removal uses a protected server route so the private AI credential never reaches your device.</p><h2>Independent, non-registered project</h2><p>FlyThe BG is currently not operated as a registered company or business entity. The website may display advertising from third-party advertising providers. Project communication is available through <a href="mailto:support@flythebg.com">support@flythebg.com</a>, Instagram <a href="${OWNER_INSTAGRAM}" target="_blank" rel="noopener noreferrer">@aadarshf1</a>, and the project Instagram <a href="${FLYTHEBG_INSTAGRAM}" target="_blank" rel="noopener noreferrer">@flythebg</a>.</p><p>GitHub: <a href="${GITHUB_REPO}" target="_blank" rel="noopener noreferrer">FlyThe BG repository</a> · <a href="${GITHUB_PROFILE}" target="_blank" rel="noopener noreferrer">StackPilotMAX</a>.</p></main>`,"About — FlyThe BG");}

function faq():string{return shell(`<main class="page prose reveal"><p class="eyebrow">FAQ</p><h1>Questions people ask before they trust a file with a tool.</h1><p>These answers focus on the things that matter before you choose a tool: where the file goes, what stays local, what happens after processing, and what to expect on mobile.</p><details open><summary>Is my uploaded image saved anywhere?</summary><p>FlyThe BG does not provide an account gallery, persistent media library, database record or storage bucket for uploaded media. The background-removal image is forwarded for the requested processing job and is not intentionally written to persistent FlyThe BG storage.</p></details><details><summary>Does Hugging Face keep my image?</summary><p>Hugging Face/Gradio is independent infrastructure used for processing, not a FlyThe BG storage service. Temporary runtime handling can occur while a job executes, and provider logging or retention rules may apply outside FlyThe BG's control. The privacy policy explains this boundary.</p></details><details><summary>What is actually sent to the internet?</summary><p>Remove Background needs a network request to the protected FlyThe BG route. Image and video compression are designed to happen in your browser, so the original media does not need to be uploaded just to compress it.</p></details><details><summary>What if I cancel the download by mistake?</summary><p>The processed result remains available in the current tab for recovery. The page shows a fresh Download button and a recovery action so you can try again without starting the job over.</p></details><details><summary>Can I use FlyThe BG from an iPhone or Android phone?</summary><p>Yes. The interface supports touch-sized controls, mobile navigation and browser file pickers. Exact codec support and browser limits can still differ between devices.</p></details><details><summary>Why can Remove Background take 20–25 seconds sometimes?</summary><p>The AI processor can have a cold start. FlyThe BG keeps the request alive and retries transient startup failures instead of treating a short wake-up delay as a permanent error.</p></details><details><summary>Do I need to sign up or give you my email?</summary><p>No account is required for the current tools. Email is only needed if you choose to contact the project directly.</p></details><details><summary>Are the compressed files stored on FlyThe BG?</summary><p>Image and video compression are designed to run locally in your browser. The source file stays on the device unless your browser or another extension/service independently handles it.</p></details><details><summary>Can I process someone else's photo?</summary><p>Only when you have the necessary rights and permission. FlyThe BG does not grant you rights to photos, trademarks, documents or other content you do not own or have permission to use.</p></details><details><summary>Will you show a fake “payment successful” message after I support the project?</summary><p>No. Buy Me a Coffee is an external service. FlyThe BG only links to it and does not treat a redirect as proof that a payment happened.</p></details></main>`, "FAQ — FlyThe BG");}

function privacy():string{return shell(`<main class="page prose legal reveal"><p class="eyebrow">GLOBAL PRIVACY</p><h1>Privacy Policy</h1><p class="muted">Effective: 26 September 2026 · Global notice</p><p>FlyThe BG is an independent project operated as a non-registered website/project. This global privacy notice explains how FlyThe BG intends to handle personal data when people use the website and its tools. It is designed to address privacy principles relevant to users in India and, where applicable, the European Union, European Economic Area, United Kingdom and other jurisdictions. It is not legal advice and does not by itself establish that every legal requirement is satisfied in every jurisdiction.</p><h2>Who we are and how to contact us</h2><p>FlyThe BG is currently not operated as a registered company or business entity. For privacy requests, complaints, corrections, deletion requests, security reports or questions about this notice, contact <a href="mailto:support@flythebg.com">support@flythebg.com</a>. You can also contact the project through <a href="${OWNER_INSTAGRAM}" target="_blank" rel="noopener noreferrer">@aadarshf1</a>. If a data-protection representative, data protection officer or other local contact is legally required for a particular jurisdiction or activity, FlyThe BG will provide the applicable contact details through an appropriate notice or supplementary information.</p><h2>Scope and applicable privacy laws</h2><p>Privacy laws can apply based on where a user is located, what services are offered, what data is processed and what activities take place. Where applicable, this notice is intended to be read consistently with the EU General Data Protection Regulation (GDPR), the UK GDPR and Data Protection Act 2018 framework, India's Digital Personal Data Protection Act, 2023 (DPDP Act), applicable rules and other mandatory privacy or electronic-communications laws. The fact that FlyThe BG is based or operated from India, or is described as a non-registered project, does not by itself remove obligations imposed by another jurisdiction when those laws apply.</p><h2>Personal data we may process</h2><p>Depending on how you use the website, this may include the information you voluntarily provide in a privacy or support request, such as your email address and message; technical information made available by browsers, hosting or security infrastructure, such as IP address, device or browser information, timestamps and request metadata; and files that you deliberately submit to a processing tool. FlyThe BG does not require an account for its current tools.</p><h2>Why we process data</h2><p>We process information only for purposes connected with operating, securing and improving the website and responding to users. These purposes can include providing requested background removal, responding to support and privacy requests, preventing abuse, maintaining service security and reliability, complying with legal obligations, and operating advertising or measurement features where they are actually enabled.</p><h2>Legal bases where GDPR or UK GDPR applies</h2><p>Where the GDPR or UK GDPR applies, the appropriate lawful basis depends on the specific processing. Depending on the circumstances, FlyThe BG may rely on performance of a requested service or contract, consent where consent is required and obtained, compliance with a legal obligation, or legitimate interests such as security, abuse prevention and service operation, balanced against applicable rights and interests. Where a processing activity requires consent, consent will be requested in a manner intended to be clear and affirmative, and it can be withdrawn through the available mechanism or by contacting us, subject to legal limitations.</p><h2>India — DPDP Act</h2><p>For processing to which India's DPDP Act applies, FlyThe BG intends to process digital personal data for specified purposes, provide appropriate notice, obtain consent where required, respect applicable withdrawal and grievance mechanisms, and apply reasonable security safeguards. Rights and obligations under the DPDP Act and its rules are subject to the law in force at the relevant time, including any commencement dates, exemptions or rules applicable to the processing.</p><h2>Local compression</h2><p>Image and video compression are designed to run locally in your browser. For those tools, the original media does not need to be uploaded to FlyThe BG merely to perform compression. Browser features, operating-system services and third-party extensions can have their own data practices outside FlyThe BG's control.</p><h2>Background removal</h2><p>When you deliberately submit an image to Remove Background, the file is sent through a same-origin Cloudflare Worker to the FlyThe BG background-removal processor running on Hugging Face Spaces. The Hugging Face credential is kept server-side and is not sent to your browser. FlyThe BG does not provide an image gallery, account storage, storage bucket, database record or persistent image library for uploaded media. The Worker forwards the request to perform the requested transformation and does not intentionally write the uploaded image or result to persistent FlyThe BG storage.</p><p>Hugging Face/Gradio is an independent processing infrastructure provider, not a FlyThe BG user-storage service. The processor may necessarily hold request data temporarily in memory or temporary runtime storage while the model executes, and its own logging, security, retention and privacy practices may apply. FlyThe BG does not represent that it controls every transient processing or infrastructure log created by an independent provider. Users should review the provider's current terms and privacy information where relevant.</p><h2>International processing and transfers</h2><p>FlyThe BG uses third-party infrastructure and services that may process information in countries different from the country where you are located. Depending on the service and the applicable law, this may include Cloudflare, Hugging Face/Gradio, email infrastructure, hosting/security providers and, when advertising is enabled, advertising or measurement providers. International transfers can create additional legal requirements under laws such as the GDPR and UK GDPR.</p><p>Where a law governing the processing requires a transfer mechanism or safeguard, FlyThe BG intends to use an applicable mechanism, such as an adequacy decision, standard contractual clauses or another legally available safeguard, as appropriate to the transfer and jurisdiction. The availability and legal status of a particular transfer mechanism can change over time, so this notice does not claim that every provider or transfer is covered by one specific mechanism at all times.</p><h2>Retention</h2><p>FlyThe BG does not intentionally retain submitted background-removal images as a permanent FlyThe BG file after the requested processing flow. Contact and support messages may be retained for as long as reasonably necessary to respond, handle security or privacy issues, maintain appropriate records, or satisfy legal obligations. Technical and security records may be retained by FlyThe BG or its infrastructure providers according to their operational and legal requirements. Where a precise retention period is not stated, the relevant criterion is the purpose for which the information was collected, together with applicable legal and security requirements.</p><h2>Advertising, cookies and similar technologies</h2><p>This website may contain advertising. Advertising providers may process information such as IP address, browser or device characteristics, approximate location, contextual information, identifiers and interaction data, depending on the provider and configuration. FlyThe BG does not currently publish provider-specific advertising identifiers in this notice; when an advertising integration is enabled, the applicable provider details and relevant choices should be reflected in the website's privacy/cookie information.</p><p>Essential cookies or similar technologies may be used where necessary to provide a feature, maintain security, remember a user choice or operate the service. Optional advertising, analytics or measurement technologies will be used only as permitted by applicable law and, where consent is required, after the relevant consent has been obtained. Under laws that require consent for cookies or similar device-access technologies, users should be given an appropriate choice before non-essential technologies are activated. Users can also control cookies through their browser, although disabling some technologies may affect site functionality.</p><h2>Your privacy rights</h2><p>Depending on your location and the law that applies, you may have rights including access to personal data and information about its use; correction of inaccurate data; deletion or erasure; restriction of processing; objection to certain processing; data portability; withdrawal of consent where processing relies on consent; and the right to complain to a relevant data-protection or supervisory authority. Users in India may also have rights and grievance mechanisms provided by the DPDP Act and applicable rules, including applicable access, correction/erasure, withdrawal and grievance rights.</p><p>These rights are not absolute and can be subject to legal exceptions, identity verification, technical limitations, other people's rights, freedom of expression, legal claims, security requirements or statutory retention duties. The exact rights and response deadlines depend on the applicable law.</p><h2>How to make a privacy request</h2><p>Send a request to <a href="mailto:support@flythebg.com">support@flythebg.com</a> with enough information for us to understand the request. We may need to verify identity or ownership of the relevant information before acting, particularly for deletion, access or account-related requests. We will handle requests according to the law that applies to the request. If a request cannot legally or technically be completed, we will explain the applicable limitation where the law permits us to do so.</p><h2>Security and abuse prevention</h2><p>FlyThe BG uses reasonable technical and organisational measures intended to protect the service, including same-origin server routing, server-side handling of the Hugging Face credential, input validation and request-rate controls. No internet service can guarantee absolute security. Security records and infrastructure providers may process technical information to detect abuse, attacks and service failures.</p><h2>Children</h2><p>FlyThe BG is a general-purpose media utility and is not intentionally designed to collect personal data from children. If you believe a child has provided personal data to FlyThe BG in a way that requires action under applicable law, contact <a href="mailto:support@flythebg.com">support@flythebg.com</a>.</p><h2>Third-party services and links</h2><p>FlyThe BG links to or uses independent services, including infrastructure, GitHub, Instagram, Buy Me a Coffee and potentially advertising providers. Those services have their own terms and privacy practices. A link or integration does not mean FlyThe BG controls the third party or endorses every aspect of its processing.</p><h2>Changes to this policy</h2><p>This notice may be updated when the website, providers, processing purposes or applicable law changes. The effective date at the top of this page will be updated when material changes are made. Where applicable law requires advance notice or consent for a material change, FlyThe BG will follow the required process.</p><h2>Mandatory-law limitation</h2><p>Nothing in this Privacy Policy is intended to exclude, waive, reduce or replace any mandatory right, protection, obligation, jurisdiction, regulatory requirement or remedy that applies to you or to FlyThe BG. If a provision of this notice conflicts with mandatory law, the mandatory law prevails to the extent of the conflict. This policy is not a contract that prevents a user or regulator from exercising rights under applicable law, and it does not guarantee that FlyThe BG is exempt from claims, complaints, regulatory action or legal proceedings in any jurisdiction.</p><h2>Project identity</h2><p>FlyThe BG is an independent, non-registered website/project and is not currently operated as a registered company or business entity. Project contact details are <a href="${OWNER_INSTAGRAM}" target="_blank" rel="noopener noreferrer">@aadarshf1</a> and <a href="mailto:support@flythebg.com">support@flythebg.com</a>. Project links: <a href="${FLYTHEBG_INSTAGRAM}" target="_blank" rel="noopener noreferrer">@flythebg</a>, <a href="${GITHUB_REPO}" target="_blank" rel="noopener noreferrer">FlyThe BG GitHub</a>, and <a href="${GITHUB_PROFILE}" target="_blank" rel="noopener noreferrer">StackPilotMAX GitHub</a>.</p><h2>Third-party brands</h2><p>Names, logos, trademarks and product names referenced on FlyThe BG belong to their respective owners. References are descriptive only and do not imply sponsorship, endorsement, partnership or ownership by FlyThe BG.</p></main>`,"Privacy Policy — FlyThe BG");}
function terms():string{return shell(`<main class="page prose legal reveal"><p class="eyebrow">GLOBAL TERMS</p><h1>Terms of Use</h1><p class="muted">Effective: 26 September 2026</p><p>FlyThe BG is an independent, non-registered website/project providing media utilities on an as-available basis. By using the website, you agree to use it lawfully and responsibly and to comply with applicable laws.</p><h2>Using the tools</h2><p>Remove Background sends the file you deliberately submit through the FlyThe BG protected processing route. Image and video compression are designed to run locally in your browser. You are responsible for having the rights and permissions needed for files you process.</p><h2>Service availability</h2><p>Tools may change, be interrupted, become unavailable, or be subject to limits without notice. AI processing can be affected by provider availability and cold starts. No uninterrupted or error-free service is promised.</p><h2>Downloads and results</h2><p>You are responsible for checking downloaded files before using or publishing them. AI-generated or transformed output may contain errors or artifacts.</p><h2>Third-party services</h2><p>FlyThe BG may rely on independent services including Cloudflare, Hugging Face/Gradio, GitHub, Instagram, Buy Me a Coffee and advertising providers. Those services have their own terms, policies and availability.</p><h2>Advertising and support</h2><p>The website may contain third-party advertising. Optional support links redirect to external services. FlyThe BG does not treat a redirect as proof that a payment occurred.</p><h2>Prohibited use</h2><p>Do not use FlyThe BG to upload or process unlawful material, attack or disrupt the service, bypass security controls, abuse the processing route, or infringe another person's rights.</p><h2>Disclaimer</h2><p>To the maximum extent permitted by applicable law, the service and its output are provided without guarantees of uninterrupted availability, accuracy, suitability or fitness for a particular purpose. Nothing here excludes rights or protections that mandatory law does not permit us to exclude.</p><h2>Limitation of liability</h2><p>Any limitation of liability is subject to mandatory law. Nothing in these terms is intended to exclude liability or remedies that cannot lawfully be excluded or limited.</p><h2>Changes</h2><p>These terms may be updated when the service or applicable requirements change. The effective date will be updated when material changes are made.</p><h2>Contact</h2><p>Questions about these terms can be sent to <a href="mailto:support@flythebg.com">support@flythebg.com</a>.</p></main>`,"Terms of Use — FlyThe BG");}

function contact():string{return shell(`<main class="page prose reveal"><p class="eyebrow">CONTACT</p><h1>Talk to FlyThe BG.</h1><p>For support, privacy requests, security reports, corrections, deletion requests or general questions, use <a href="mailto:support@flythebg.com">support@flythebg.com</a>.</p><h2>Project contact</h2><p>Instagram: <a href="${OWNER_INSTAGRAM}" target="_blank" rel="noopener noreferrer">@aadarshf1</a><br>Project Instagram: <a href="${FLYTHEBG_INSTAGRAM}" target="_blank" rel="noopener noreferrer">@flythebg</a><br>GitHub: <a href="${GITHUB_REPO}" target="_blank" rel="noopener noreferrer">FlyThe BG repository</a></p><h2>Privacy requests</h2><p>Include enough detail for us to understand your request. We may need to verify identity or ownership before acting on access, correction or deletion requests, as permitted by applicable law.</p><h2>Security reports</h2><p>Please avoid publicly posting credentials, access tokens or private user information. Send security concerns privately through the support email above.</p></main>`,"Contact — FlyThe BG");}

function blog():string{return shell(`<main class="page prose reveal"><p class="eyebrow">FLYTHE BG BLOGS</p><h1>Practical guides for the work people actually do with media files.</h1><p>Short, useful articles about privacy, compression, formats, downloads and browser-based workflows.</p><div class="blog-index-grid"><a href="/blogs/remove-background-online-privacy"><span>GUIDE · PRIVACY</span><h2>What really happens when you remove a background online?</h2><p>Understand the difference between browser-local tools, server processing and persistent storage.</p></a><a href="/blogs/compress-images-in-browser"><span>GUIDE · IMAGES</span><h2>How browser-based image compression works</h2><p>What changes, what stays local, and when a JPEG output makes sense.</p></a><a href="/blogs/webm-video-compression-guide"><span>GUIDE · VIDEO</span><h2>Why your compressed video may become WebM</h2><p>Learn what browser recording APIs can and cannot do with modern video formats.</p></a></div></main>`, "Blogs — FlyThe BG");}
function blogPrivacy():string{return shell(`<article class="page prose article-page reveal"><p class="eyebrow">GUIDE · PRIVACY</p><h1>What really happens when you remove a background online?</h1><p class="article-meta">Updated 26 September 2026 · FlyThe BG Journal</p><p>“Online” does not automatically mean “stored forever.” The important question is what the service actually does with the file after you press process.</p><h2>There are three different questions</h2><p>First: does the file leave your device? Second: does the service keep a copy after the job? Third: does an outside infrastructure provider handle the request? Those are separate questions, and a useful privacy notice should answer all three.</p><h2>How FlyThe BG works</h2><p>Remove Background sends your chosen image through the protected FlyThe BG route to the background-removal processor. The private credential stays server-side. FlyThe BG does not provide a persistent gallery or account storage for the image.</p><h2>What “not stored” does not mean</h2><p>Independent infrastructure may temporarily hold request data in memory or temporary runtime files while a model runs, and provider logs may exist under the provider's own rules. That is different from FlyThe BG intentionally maintaining a user file library.</p><h2>What to check before uploading anywhere</h2><p>Look for the service's processing boundary, retention language, provider list, account requirements and download behavior. Also check whether you actually have permission to process the image.</p><p><a class="text-link" href="/privacy">Read FlyThe BG's full privacy policy ↗</a></p></article>`, "What Happens During Online Background Removal — FlyThe BG");}
function blogImage():string{return shell(`<article class="page prose article-page reveal"><p class="eyebrow">GUIDE · IMAGES</p><h1>How browser-based image compression works</h1><p class="article-meta">Updated 26 September 2026 · FlyThe BG Journal</p><p>Image compression does not require a server for every workflow. Modern browsers can decode an image, resize it, redraw it onto a canvas and export a smaller file without uploading the original.</p><h2>What changes?</h2><p>Depending on the settings, the browser can reduce dimensions, change the output format or lower JPEG quality. The visual result and file size can move together, but the exact outcome depends on the source image.</p><h2>Why local processing can be useful</h2><p>Keeping compression in the browser avoids an unnecessary upload and can make a simple one-file task feel immediate. It also means memory and CPU limits are determined by the device and browser.</p><h2>What should you check?</h2><p>Open the compressed file, compare quality and confirm that the destination actually accepts the format you created. A smaller file is not automatically a better file.</p><p><a class="text-link" href="/image-compressor">Try image compression ↗</a></p></article>`, "Browser Image Compression Guide — FlyThe BG");}
function blogVideo():string{return shell(`<article class="page prose article-page reveal"><p class="eyebrow">GUIDE · VIDEO</p><h1>Why your compressed video may become WebM</h1><p class="article-meta">Updated 26 September 2026 · FlyThe BG Journal</p><p>Browsers can encode video with MediaRecorder, but the formats a browser can produce depend on the engine and supported codecs. WebM is a practical browser-friendly target for many workflows.</p><h2>Why WebM?</h2><p>WebM is designed for web playback and commonly pairs with modern codecs. A browser may support it even when a particular MP4 encoder is not available through the same API.</p><h2>What about compatibility?</h2><p>Always test the output where you intend to publish or share it. If a destination requires MP4, browser-only compression may need a later conversion step with a dedicated tool.</p><h2>Why can processing use a lot of memory?</h2><p>Local video workflows decode frames in the browser, draw them to a canvas and record the result. Longer or higher-resolution videos can therefore be demanding on phones and laptops.</p><p><a class="text-link" href="/video-compressor">Try video compression ↗</a></p></article>`, "WebM Video Compression Guide — FlyThe BG");}
function codeOfConduct():string{return shell(`<main class="page prose legal reveal"><p class="eyebrow">OPEN SOURCE</p><h1>Code of Conduct</h1><p>FlyThe BG aims to be a useful project for people with different backgrounds, skill levels and viewpoints.</p><h2>Expected behavior</h2><p>Be respectful, specific and constructive. Assume good faith while still addressing security, accessibility and privacy concerns seriously. Give credit for useful contributions.</p><h2>Not welcome</h2><p>Harassment, threats, hateful conduct, sexual harassment, doxxing, credential sharing, malicious disruption, impersonation and targeted abuse are not acceptable.</p><h2>When something goes wrong</h2><p>For a security-sensitive issue, contact <a href="mailto:support@flythebg.com">support@flythebg.com</a> rather than publishing credentials or exploitable details publicly.</p><h2>Enforcement</h2><p>Project maintainers may moderate discussions, remove harmful content or restrict participation when necessary to keep the project usable and safe.</p></main>`, "Code of Conduct — FlyThe BG");}
function accessibility():string{return shell(`<main class="page prose legal reveal"><p class="eyebrow">ACCESSIBILITY</p><h1>Accessibility statement</h1><p>FlyThe BG is built to work with keyboards, touch screens, reduced-motion preferences and responsive layouts. The goal is to keep important actions reachable without relying on tiny controls or hover-only behavior.</p><h2>Current commitments</h2><p>Keyboard focus indicators, semantic headings, labeled controls, live status updates, touch-sized mobile controls and reduced-motion handling are part of the site UI. The download recovery action is intentionally visible after processing so a missed browser download does not force a user to repeat the job.</p><h2>Known limits</h2><p>Third-party browsers, codec support, remote fonts, advertising and external services can introduce experiences FlyThe BG cannot fully control. Some older browsers may not support every media API.</p><h2>Report an issue</h2><p>Tell us what device, browser and page caused the problem at <a href="mailto:support@flythebg.com">support@flythebg.com</a>. Specific reproduction steps are especially helpful.</p></main>`, "Accessibility — FlyThe BG");}
function security():string{return shell(`<main class="page prose legal reveal"><p class="eyebrow">SECURITY</p><h1>Security at FlyThe BG</h1><p>Security issues should be reported responsibly so they can be investigated without exposing users.</p><h2>Report privately</h2><p>Email <a href="mailto:support@flythebg.com">support@flythebg.com</a>. Please include the affected URL, the steps to reproduce, expected behavior, actual behavior and any safe proof that helps us confirm the issue.</p><h2>Never include secrets</h2><p>Do not send passwords, Hugging Face tokens, Cloudflare credentials, session tokens or private user files in a public issue or chat.</p><h2>Security boundaries</h2><p>The FlyThe BG client does not receive the Hugging Face credential. The protected background-removal route validates uploads and is intended to avoid persistent media storage in FlyThe BG-managed storage.</p></main>`, "Security — FlyThe BG");}
function cookies():string{return shell(`<main class="page prose legal reveal"><p class="eyebrow">PRIVACY</p><h1>Cookies &amp; similar technologies</h1><p>FlyThe BG aims to keep essential browser state minimal. The site may also use third-party services whose own technologies operate under their own policies.</p><h2>Essential behavior</h2><p>The application may use in-memory browser state, object URLs and standard browser mechanisms needed to process files, show previews and recover downloads. These do not create a FlyThe BG account profile.</p><h2>Advertising</h2><p>If advertising or measurement technologies are enabled, applicable providers may use cookies or similar identifiers subject to their configuration and the consent requirements of the law that applies to you.</p><h2>Your choices</h2><p>You can control cookies and similar technologies through your browser settings. Disabling some features can affect the way the website behaves.</p><p><a class="text-link" href="/privacy">Read the privacy policy ↗</a></p></main>`, "Cookies — FlyThe BG");}
function changelog():string{return shell(`<main class="page prose reveal"><p class="eyebrow">PROJECT LOG</p><h1>What changed recently.</h1><div class="changelog-list"><article><span>26 SEP 2026</span><h2>Long-form landing + better mobile navigation</h2><p>Expanded the homepage into a scrollable product experience with real FAQs, guides, stronger footer navigation and mobile menu locking.</p></article><article><span>26 SEP 2026</span><h2>Download recovery</h2><p>Processed files now keep a browser-local recovery action when a download is cancelled or missed.</p></article><article><span>26 SEP 2026</span><h2>Professional product UI</h2><p>Core pages use a restrained editorial visual system. The playful style stays reserved for the Support page.</p></article></div></main>`, "Changelog — FlyThe BG");}

function wireSpaceExperience():void{
 const root=document.querySelector<HTMLElement>(".experience");
 if(!root)return;
 type SpaceState={key:"mars"|"earth"|"venus";name:string;next:string;number:string;href:string;portal:string;background:string;facts:[string,string][];image?:string};
 const BASE="https://d2ol7oe51mr4n9d.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P";
 const TO_EARTH=BASE+"/fc3ded42-e845-41f3-a830-5cab512d79cd.mp4";
 const TO_VENUS=BASE+"/b30f64d9-1637-477a-83df-d0fc6461a422.mp4";
 const TO_MARS=BASE+"/5fc5651c-3b5d-4171-b507-87f7e635d1b4.mp4";
 const MERCURY=BASE+"/d6fb8b6b-c15e-4aaa-9cf7-45bbb5e33372.jpg";
 const states:SpaceState[]=[
  {key:"mars",name:"Mars",next:"Earth",number:"[02]",href:"/remove-bg",portal:TO_EARTH,background:"mars-background",facts:[
   ["TOOL:","Remove Background"],["PROCESSING:","AI background removal through the protected FlyThe BG Worker."],["MODEL:","rembg running inside private Hugging Face Spaces."],["STARTUP:","Cold starts can take around 20–25 seconds."]]},
  {key:"earth",name:"Earth",next:"Venus",number:"[03]",href:"/image-compressor",portal:TO_VENUS,background:"earth-background",facts:[
   ["TOOL:","Image Compressor"],["PROCESSING:","Compression runs locally in your browser."],["PRIVACY:","Your original image does not need to leave your device."],["OUTPUT:","JPEG output with visible compression progress."]]},
  {key:"venus",name:"Venus",next:"Mercury",number:"[04]",href:"/video-compressor",portal:MERCURY,background:"venus-background",image:MERCURY,facts:[
   ["TOOL:","Video Compressor"],["PROCESSING:","Compression runs locally in your browser."],["PRIVACY:","Your original video stays on your device."],["NEXT:","Mercury closes the cinematic route; the tool is still one click away."]]}
 ];
 const planets=["Mercury","Venus","Earth","Mars","Jupiter","Saturn","Uranus","Neptune"];
 let current:SpaceState["key"]="mars",busy=false,maskScale=0,expansion=0,rotX=0,rotY=0,targetX=0,targetY=0,last=performance.now(),transitionActive=false,preloaderFinished=false;
 const bgIds=["mars-background","earth-background","venus-background"];
 const canvas=document.getElementById("portal-canvas") as HTMLCanvasElement;
 const scene=document.getElementById("scene-canvas") as HTMLCanvasElement;
 const portal=document.getElementById("portal") as HTMLButtonElement;
 const portalVideo=document.getElementById("portal-video") as HTMLVideoElement;
 const portalImage=document.getElementById("portal-image") as HTMLImageElement;
 const transitionVideo=document.getElementById("transition-video") as HTMLVideoElement;
 const title=document.getElementById("planet-title")!;
 const facts=document.getElementById("facts")!;
 const nextName=document.getElementById("next-name")!;
 const nextNumber=document.getElementById("next-number")!;
 const list=document.querySelector<HTMLElement>(".planet-list")!;
 const experience=root;
 const ctxValue=canvas.getContext("2d");
 const sceneCtxValue=scene.getContext("2d");
 if(!ctxValue||!sceneCtxValue)return;
 const ctx:CanvasRenderingContext2D=ctxValue;
 const sceneCtx:CanvasRenderingContext2D=sceneCtxValue;

 const ease=(t:number)=>t<.5?4*t*t*t:1-Math.pow(-2*t+2,3)/2;
 const currentState=()=>states.find(s=>s.key===current)!;
 const nextState=()=>states.find(s=>s.key===currentState().next.toLowerCase())??currentState();

 function resizeCanvas():void{
  const d=Math.min(window.devicePixelRatio||1,2);
  for(const c of [canvas,scene]){
   c.width=Math.max(1,Math.round(innerWidth*d));c.height=Math.max(1,Math.round(innerHeight*d));
   c.style.width=innerWidth+"px";c.style.height=innerHeight+"px";
   const cctx=c===canvas?ctx:sceneCtx;cctx.setTransform(d,0,0,d,0,0);
  }
 }

 function drawCover(cctx:CanvasRenderingContext2D,media:HTMLVideoElement|HTMLImageElement):void{
  const mw=media instanceof HTMLVideoElement?(media.videoWidth||media.clientWidth):media.naturalWidth;
  const mh=media instanceof HTMLVideoElement?(media.videoHeight||media.clientHeight):media.naturalHeight;
  if(!mw||!mh)return;
  const scale=Math.max(innerWidth/mw,innerHeight/mh),w=mw*scale,h=mh*scale;
  cctx.drawImage(media,(innerWidth-w)/2,(innerHeight-h)/2,w,h);
 }

 function roundedPoints(w:number,h:number,r:number):Array<[number,number]>{
  const points:Array<[number,number]>=[],steps=10;
  const corners:[[number,number,number,number],[number,number,number,number],[number,number,number,number],[number,number,number,number]]=[
   [w/2-r,-h/2+r,-Math.PI/2,0],[w/2-r,h/2-r,0,Math.PI/2],[-w/2+r,h/2-r,Math.PI/2,Math.PI],[-w/2+r,-h/2+r,Math.PI,Math.PI*1.5]
  ];
  for(const [cx,cy,a0,a1] of corners)for(let i=0;i<=steps;i++){const a=a0+(a1-a0)*i/steps;points.push([cx+r*Math.cos(a),cy+r*Math.sin(a)]);}
  return points;
 }

 function project(x:number,y:number,cx:number,cy:number,rx:number,ry:number):[number,number]{
  const ax=rx*Math.PI/180,ay=ry*Math.PI/180,xx=x*Math.cos(ay),yy=y*Math.cos(ax),z=x*Math.sin(ay)-y*Math.sin(ax),p=850/(850+z);
  return [cx+xx*p,cy+yy*p];
 }

 function drawShade(cctx:CanvasRenderingContext2D):void{
  const g=cctx.createLinearGradient(0,innerHeight*.52,0,innerHeight);
  g.addColorStop(0,"rgba(0,0,0,0)");g.addColorStop(1,"rgba(0,0,0,.88)");
  cctx.fillStyle=g;cctx.fillRect(0,innerHeight*.52,innerWidth,innerHeight*.48);
 }

 function render():void{
  const s=currentState(),n=nextState();
  experience.dataset.planet=s.key;
  title.textContent=s.name.toUpperCase();
  nextName.textContent=s.next==="Mercury"?"Mercury":"FlyThe BG · "+n.name;
  nextNumber.textContent=s.number;
  portal.setAttribute("aria-label",s.key==="venus"?"Open Video Compressor":"Travel to "+s.next);
  list.innerHTML=planets.map(p=>`<span class="planet-item ${p.toLowerCase()===s.key?"active":""}"><i class="planet-dot planet-${p.toLowerCase()}"></i><span>${p}</span></span>`).join("");
  if(list.dataset.rendered==="1"){list.classList.remove("is-switching");void list.offsetWidth;list.classList.add("is-switching");}
  list.dataset.rendered="1";
  facts.innerHTML=s.facts.map(([k,v])=>`<div class="fact"><dt>${k}</dt><dd>${v}</dd></div>`).join("");
  document.querySelectorAll<HTMLVideoElement>(".background").forEach(v=>v.classList.toggle("is-visible",v.id===s.background));
  if(s.image){portalImage.style.display="block";portalVideo.style.display="none";}else{portalImage.style.display="none";portalVideo.style.display="block";if(portalVideo.src!==s.portal)portalVideo.src=s.portal;portalVideo.load();portalVideo.muted=true;portalVideo.playsInline=true;}
 }

 function revealMask():Promise<void>{
  experience.classList.remove("mask-revealing");void experience.offsetWidth;experience.classList.add("mask-revealing");maskScale=0;
  const start=performance.now();
  return new Promise(resolve=>{const tick=(now:number)=>{const t=Math.min(1,(now-start)/1050);maskScale=ease(t);if(t<1)requestAnimationFrame(tick);else resolve()};requestAnimationFrame(tick);});
 }

 function revealPlanetContent():void{
  experience.classList.remove("content-revealing");void experience.offsetWidth;experience.classList.add("content-revealing");
 }

 async function waitForMedia(media:HTMLVideoElement|HTMLImageElement,timeout=1600):Promise<void>{
  if(media instanceof HTMLImageElement){if(media.complete&&media.naturalWidth)return;await new Promise<void>(resolve=>{const done=()=>{media.removeEventListener("load",done);media.removeEventListener("error",done);resolve()};media.addEventListener("load",done,{once:true});media.addEventListener("error",done,{once:true});setTimeout(done,timeout);});return;}
  if(media.readyState>=2)return;
  await new Promise<void>(resolve=>{const done=()=>{media.removeEventListener("canplay",done);media.removeEventListener("loadeddata",done);resolve()};media.addEventListener("canplay",done,{once:true});media.addEventListener("loadeddata",done,{once:true});setTimeout(done,timeout);});
 }

 async function travel():Promise<void>{
  if(busy||current==="venus")return;
  busy=true;targetX=0;targetY=0;experience.classList.add("is-loading");
  const s=currentState(),n=nextState();
  transitionVideo.src=s.portal;transitionVideo.load();
  await waitForMedia(transitionVideo,1600);
  experience.classList.remove("is-loading","content-revealing","mask-revealing");experience.classList.add("is-transitioning");
  transitionVideo.currentTime=0;transitionVideo.playbackRate=1.3;transitionActive=true;
  try{await transitionVideo.play();}catch{}
  const start=performance.now();
  await new Promise<void>(resolve=>{const tick=(now:number)=>{const t=Math.min(1,(now-start)/1100);expansion=ease(t);if(t<1)requestAnimationFrame(tick);else resolve()};requestAnimationFrame(tick);});
  if(transitionVideo.readyState>=2){sceneCtx.clearRect(0,0,innerWidth,innerHeight);drawCover(sceneCtx,transitionVideo);}
  current=n.key;experience.classList.add("is-committing");render();await new Promise<void>(resolve=>requestAnimationFrame(()=>requestAnimationFrame(()=>resolve())));
  transitionActive=false;expansion=0;maskScale=0;
  experience.classList.remove("is-transitioning","is-committing");await revealMask();setTimeout(revealPlanetContent,100);
  setTimeout(()=>{transitionVideo.pause();transitionVideo.removeAttribute("src");transitionVideo.load();busy=false;},450);
 }

 function draw(now:number):void{
  const dt=Math.min(40,now-last);last=now;
  rotX+=(targetX-rotX)*Math.min(1,dt*.009);rotY+=(targetY-rotY)*Math.min(1,dt*.009);
  ctx.clearRect(0,0,innerWidth,innerHeight);
  const rect=portal.getBoundingClientRect(),e=expansion,cx=rect.left+rect.width/2+(innerWidth/2-(rect.left+rect.width/2))*e,cy=rect.top+rect.height/2+(innerHeight/2-(rect.top+rect.height/2))*e;
  const baseW=rect.width+(innerWidth-rect.width)*e,baseH=rect.height+(innerHeight-rect.height)*e,scale=e?1:maskScale,w=baseW*scale,h=baseH*scale,r=Math.min(90*(1-e)*scale,w/2,h/2),rx=rotX*(1-e),ry=rotY*(1-e);
  if(w>1&&h>1){const points=roundedPoints(w,h,r);ctx.save();ctx.beginPath();points.forEach(([x,y],i)=>{const [sx,sy]=project(x,y,cx,cy,rx,ry);if(i===0)ctx.moveTo(sx,sy);else ctx.lineTo(sx,sy)});ctx.closePath();ctx.clip();ctx.fillStyle="#030303";ctx.fillRect(0,0,innerWidth,innerHeight);const media=transitionActive?transitionVideo:(currentState().image?portalImage:portalVideo);drawCover(ctx,media);if(transitionActive)drawShade(ctx);ctx.restore();}
  requestAnimationFrame(draw);
 }

 async function runPreloader():Promise<void>{
  if(preloaderFinished)return;preloaderFinished=true;
  const pre=document.getElementById("preloader"),video=document.getElementById("preloader-video") as HTMLVideoElement|null,count=document.getElementById("preloader-count"),value=document.getElementById("preloader-value"),logo=document.getElementById("floating-logo");
  if(!pre||!video||!count||!value||!logo){experience.classList.add("preload-complete");await startExperience();return;}
  let finished=false;
  const finish=async()=>{if(finished)return;finished=true;value.textContent="100";count.classList.add("is-leaving");logo.classList.add("is-docked");pre.classList.add("is-background");document.body.classList.add("preload-complete");await startExperience();setTimeout(()=>count.remove(),750);setTimeout(()=>logo.classList.add("is-settled"),2000);};
  const update=()=>{if(video.duration>0)value.textContent=String(Math.min(100,Math.round(video.currentTime/video.duration*100)));if(!finished)requestAnimationFrame(update);};
  const start=()=>{if(video.duration>0)video.playbackRate=Math.max(.25,video.duration/3);video.play().catch(()=>void finish());requestAnimationFrame(update);};
  if(video.readyState>=1)start();else video.addEventListener("loadedmetadata",start,{once:true});
  video.addEventListener("ended",()=>void finish(),{once:true});
  setTimeout(()=>void finish(),4500);
 }

 async function startExperience():Promise<void>{
  await waitForMedia(currentState().image?portalImage:portalVideo,1600);
  await revealMask();document.body.classList.add("intro-ready");setTimeout(revealPlanetContent,850);
 }

 resizeCanvas();render();requestAnimationFrame(draw);runPreloader();
 window.addEventListener("resize",resizeCanvas);
 const pointerSupported=matchMedia("(pointer:fine)").matches;
 if(pointerSupported){
  experience.addEventListener("pointermove",e=>{targetY=(e.clientX/innerWidth-.5)*37.4;targetX=(e.clientY/innerHeight-.5)*-33;});
  experience.addEventListener("pointerleave",()=>{targetX=0;targetY=0;});
 }
 portal.addEventListener("click",()=>void travel());
}
function wireEditorial():void{
 const rootElement=document.querySelector<HTMLElement>(".editorial");if(!rootElement)return;const root=rootElement;
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
 root.querySelectorAll<HTMLElement>("[data-words]").forEach(el=>{
  Array.from(el.childNodes).forEach(node=>{
   if(node.nodeType!==Node.TEXT_NODE)return;
   const fragment=document.createDocumentFragment();let i=0;
   (node.textContent||"").split(/(\s+)/).forEach(word=>{
    if(!word.trim()){fragment.appendChild(document.createTextNode(word));return;}
    const span=document.createElement("span");span.className="ed-word";span.textContent=word;span.style.setProperty("--d",i++*40+"ms");fragment.appendChild(span);
   });node.parentNode?.replaceChild(fragment,node);
  });
 });
 root.querySelectorAll<HTMLButtonElement>(".ft-folder").forEach(button=>{
  button.addEventListener("click",()=>{const open=button.getAttribute("aria-expanded")!=="true";button.setAttribute("aria-expanded",String(open));button.classList.toggle("is-open",open);});
  button.querySelectorAll<HTMLElement>(".ft-folder-paper").forEach(paper=>{
   paper.addEventListener("pointermove",event=>{if(reduced||button.getAttribute("aria-expanded")!=="true")return;const rect=paper.getBoundingClientRect();paper.style.setProperty("--mx",((event.clientX-rect.left-rect.width/2)*.2)+"px");paper.style.setProperty("--my",((event.clientY-rect.top-rect.height/2)*.2)+"px");});
   paper.addEventListener("pointerleave",()=>{paper.style.setProperty("--mx","0px");paper.style.setProperty("--my","0px");});
  });
 });
 const reveal=root.querySelectorAll<HTMLElement>("[data-rev],.ed-word");
 if(reduced||!("IntersectionObserver" in window))reveal.forEach(el=>el.classList.add("ed-visible"));
 else{const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("ed-visible");observer.unobserve(entry.target);}}),{threshold:.14,rootMargin:"0px 0px -6% 0px"});reveal.forEach(el=>observer.observe(el));}
 const pins=Array.from(root.querySelectorAll<HTMLElement>("[data-pin]"));
 const rows=Array.from(root.querySelectorAll<HTMLElement>(".ed-ladder-row"));
 const number=root.querySelector<HTMLElement>("[data-number-last]");
 const tag=root.querySelector<HTMLElement>("[data-current-tag]");
 const scan=root.querySelector<HTMLCanvasElement>(".ed-scan");
 const ctx=scan?.getContext("2d");
 const plates=Array.from(root.querySelectorAll<HTMLCanvasElement>("[data-plate]"));
 const plateContexts=plates.map(el=>el.getContext("2d"));
 let active=-1,queued=false;
 function update(){
  queued=false;pins.forEach((section,i)=>{
   const rect=section.getBoundingClientRect();
   const p=Math.max(0,Math.min(1,-rect.top/Math.max(1,rect.height-innerHeight)));
   section.style.setProperty("--p",String(p));
   if(i===1){const step=Math.min(3,Math.floor(p*4));if(step!==active){active=step;if(number)number.textContent=String(step+1);if(tag)tag.textContent="0"+(step+1)+" / 04";rows.forEach((row,j)=>row.classList.toggle("ed-active",j<=step));}}
  });
 }
 function onScroll(){if(!queued){queued=true;requestAnimationFrame(update);}}
 addEventListener("scroll",onScroll,{passive:true});addEventListener("resize",onScroll);update();
 function draw(t:number){
  if(!root.isConnected)return;
  if(scan&&ctx){
   const w=scan.clientWidth,h=scan.clientHeight,dpr=Math.min(devicePixelRatio||1,2);
   if(scan.width!==Math.round(w*dpr)||scan.height!==Math.round(h*dpr)){scan.width=Math.round(w*dpr);scan.height=Math.round(h*dpr);}
   ctx.setTransform(dpr,0,0,dpr,0,0);ctx.clearRect(0,0,w,h);
   for(let y=0;y<h;y+=5){ctx.fillStyle="rgba(233,237,242,.055)";ctx.fillRect(Math.sin(y*.041+t*.0003)*13,y,w,1);}
   const center=(reduced?.48:Math.sin(t*.00015)*.32+.5)*w;
   const bloom=ctx.createRadialGradient(center,h*.5,0,center,h*.5,w*.48);
   bloom.addColorStop(0,"rgba(255,77,0,.16)");bloom.addColorStop(1,"rgba(255,77,0,0)");ctx.fillStyle=bloom;ctx.fillRect(0,0,w,h);
  }
  plates.forEach((canvas,i)=>{const c=plateContexts[i];if(!c)return;const w=canvas.width,h=canvas.height;c.fillStyle="#0B0E14";c.fillRect(0,0,w,h);for(let j=0;j<36;j++){const shift=reduced?0:Math.sin(t*.00035+j*.57+i)*17;const length=50+((j*79+i*113)%225);c.fillStyle=j%7===0?"#FF4D00":"rgba(242,244,241,.18)";c.fillRect((w-length)/2+shift,j*11+5,length,j%7===0?3:1);}});
  if(!reduced)requestAnimationFrame(draw);
 }draw(0);
}

function wireFlyLanding():void{
 const root=document.querySelector<HTMLElement>(".fly-home, .fly-site");if(!root)return;
 const deferredVideo=root.querySelector<HTMLVideoElement>("[data-deferred-video]");
 if(deferredVideo&&!matchMedia("(prefers-reduced-motion: reduce)").matches&&matchMedia("(min-width: 900px)").matches){
  const loadVideo=()=>{const source=deferredVideo.querySelector<HTMLElement>("[data-src]");if(!source||deferredVideo.dataset.loaded==="1")return;source.setAttribute("src",source.dataset.src||"");deferredVideo.dataset.loaded="1";deferredVideo.load();deferredVideo.play().catch(()=>{});};
  const idle=(window as Window&typeof globalThis&{requestIdleCallback?: (cb:()=>void,options?:{timeout:number})=>number}).requestIdleCallback;if(idle)idle(loadVideo,{timeout:2500});else window.setTimeout(loadVideo,1800);
 }
 const burger=root.querySelector<HTMLButtonElement>(".fly-burger");
 const menu=root.querySelector<HTMLElement>(".fly-mobile-menu");
 const overlay=root.querySelector<HTMLElement>(".fly-mobile-overlay");
 const closeMenu=()=>{if(!menu||!burger)return;menu.hidden=true;burger.setAttribute("aria-expanded","false");burger.classList.remove("is-open");document.body.classList.remove("fly-menu-open");document.body.style.removeProperty("overflow");document.documentElement.style.removeProperty("overflow");};
 const openMenu=()=>{if(!menu||!burger)return;menu.hidden=false;burger.setAttribute("aria-expanded","true");burger.classList.add("is-open");document.body.classList.add("fly-menu-open");document.body.style.overflow="hidden";document.documentElement.style.overflow="hidden";};
 burger?.addEventListener("click",()=>burger.getAttribute("aria-expanded")==="true"?closeMenu():openMenu());
 overlay?.addEventListener("click",closeMenu);
 menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();},{once:true});
 const mq=matchMedia("(min-width:721px)");
 mq.addEventListener?.("change",e=>{if(e.matches)closeMenu();});
 const folders=root.querySelectorAll<HTMLButtonElement>("[data-folder-toggle]");
 folders.forEach(folder=>{
  folder.addEventListener("click",()=>{
   const open=folder.classList.toggle("is-open");
   folder.setAttribute("aria-expanded",String(open));
   folders.forEach(other=>{if(other!==folder){other.classList.remove("is-open");other.setAttribute("aria-expanded","false");}});
  });
 });
 const reduced=matchMedia("(prefers-reduced-motion: reduce)").matches;
 const items=root.querySelectorAll<HTMLElement>(".anim");
 items.forEach(el=>{if(!reduced)el.classList.add("fly-reveal");else el.classList.add("fly-reveal-ready");});
 const stats=root.querySelectorAll<HTMLElement>("[data-count]");
 const animate=(el:HTMLElement)=>{
  if(el.dataset.done)return;el.dataset.done="1";
  const target=Number(el.dataset.count||0),dec=Number(el.dataset.decimals||0),suffix=el.dataset.suffix||"";
  if(reduced){el.textContent=target.toFixed(dec)+suffix;return;}
  const start=performance.now(),duration=1500;
  const tick=(now:number)=>{const p=Math.min(1,(now-start)/duration),e=1-Math.pow(1-p,3);el.textContent=(target*e).toFixed(dec)+suffix;if(p<1)requestAnimationFrame(tick);else el.textContent=target.toFixed(dec)+suffix;};
  requestAnimationFrame(tick);
 };
 if("IntersectionObserver"in window){
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){animate(entry.target as HTMLElement);observer.unobserve(entry.target);}}),{threshold:.25});
  stats.forEach(s=>observer.observe(s));
 }else stats.forEach(s=>animate(s));
}
function normalizePath():Route{const p=window.location.pathname.replace(/\/+$/,"")||"/";const routes:Record<string,Route>={"/":"/","/remove-bg":"/remove-bg","/image-compressor":"/image-compressor","/video-compressor":"/video-compressor","/passport-photo":"/passport-photo","/features":"/features","/about":"/about","/faq":"/faq","/privacy":"/privacy","/terms":"/terms","/contact":"/contact","/support":"/support","/blogs":"/blogs","/blogs/remove-background-online-privacy":"/blogs/remove-background-online-privacy","/blogs/compress-images-in-browser":"/blogs/compress-images-in-browser","/blogs/webm-video-compression-guide":"/blogs/webm-video-compression-guide","/code-of-conduct":"/code-of-conduct","/accessibility":"/accessibility","/security":"/security","/cookies":"/cookies","/changelog":"/changelog"};return routes[p]||"/";}
function downloadBlob(blob:Blob,filename:string,tool?:ToolId):void{const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;a.rel="noopener";document.body.appendChild(a);a.click();a.remove();if(tool){const workspace=document.querySelector<HTMLElement>(`[data-dropzone="${tool}"]`)?.closest(".tool-workspace");if(workspace){workspace.querySelector(".download-recovery")?.remove();const recovery=document.createElement("div");recovery.className="download-recovery";recovery.innerHTML=`<span><strong>Your file is ready.</strong> If the browser download was cancelled or missed, use Download again.</span><button type="button" class="button primary">Download again</button>`;recovery.querySelector("button")?.addEventListener("click",()=>{const retry=document.createElement("a");retry.href=url;retry.download=filename;retry.rel="noopener";document.body.appendChild(retry);retry.click();retry.remove();});workspace.appendChild(recovery);}}setTimeout(()=>URL.revokeObjectURL(url),300000);}
function setProgress(tool:ToolId,value:number,label?:string):void{const n=Math.max(0,Math.min(100,value));const bar=document.querySelector<HTMLElement>(`[data-progress="${tool}"]`);if(bar)bar.style.width=`${n}%`;const text=document.querySelector<HTMLElement>(`[data-progress-label="${tool}"]`);if(text)text.textContent=label??`${Math.round(n)}%`;}
function updateStatus(tool:ToolId,message:string):void{const el=document.querySelector<HTMLElement>(`[data-status="${tool}"]`);if(el)el.textContent=message;}

function showResultPreview(tool:ToolId,blob:Blob,filename:string):void{
 const workspace=document.querySelector<HTMLElement>(`[data-dropzone="${tool}"]`)?.closest(".tool-workspace");
 if(!workspace)return;
 workspace.querySelector(".result-preview")?.remove();
 const url=URL.createObjectURL(blob);
 const result=document.createElement("section");
 result.className="result-preview";
 result.setAttribute("aria-label","Processed result preview");
 result.innerHTML=`<div class="result-preview-head"><span>RESULT READY</span><strong>Your background-removed image</strong></div><div class="result-preview-media"><img src="${url}" alt="Preview of the background-removed result"></div><div class="result-preview-actions"><a class="button primary" href="${url}" download="${filename}">Download PNG ↓</a><button type="button" class="button ghost" data-result-close>Close preview</button></div><small>The result is kept in this browser tab only so you can preview or download it. It is not uploaded again by the preview.</small></section>`;
 result.querySelector("[data-result-close]")?.addEventListener("click",()=>{result.remove();URL.revokeObjectURL(url);});
 workspace.appendChild(result);
}
async function removeBackground(file:File):Promise<void>{
  updateStatus("remove-bg","Uploading securely…");
  const response=await fetch("/api/remove-bg",{
    method:"POST",
    headers:{"Content-Type":file.type,"Accept":"image/png"},
    body:file
  });
  if(!response.ok){
    let message="Background removal failed.";
    try{const data=await response.json() as {error?:string};if(data.error)message=data.error;}catch{}
    throw new Error(message);
  }
  updateStatus("remove-bg","AI is processing your image…");
  const resultBlob=await response.blob();
  if(!resultBlob.size)throw new Error("The AI processor returned an empty image.");
  const resultName=file.name.replace(/\.[^.]+$/,"")+"-no-bg.png";
  showResultPreview("remove-bg",resultBlob,resultName);
  updateStatus("remove-bg","Done — preview ready. Download it below.");
  postWork("background removal");
}
async function compressImage(file:File):Promise<void>{setProgress("image-compressor",10,"reading");updateStatus("image-compressor","Reading the image locally…");const bitmap=await createImageBitmap(file);setProgress("image-compressor",35,"resizing");const maxSide=2400;const scale=Math.min(1,maxSide/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Canvas is unavailable.");ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();setProgress("image-compressor",68,"compressing");const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(v=>v?resolve(v):reject(new Error("Compression failed.")),"image/jpeg",.72));setProgress("image-compressor",92,"downloading");downloadBlob(blob,file.name.replace(/\.[^.]+$/,"")+"-compressed.jpg","image-compressor");setProgress("image-compressor",100,"done");updateStatus("image-compressor","Done — original stayed in your browser.");postWork("image compression");}

async function compressVideo(file:File):Promise<void>{if(!("MediaRecorder"in window))throw new Error("MediaRecorder is unavailable in this browser.");setProgress("video-compressor",3,"loading");updateStatus("video-compressor","Loading video locally… no upload is happening.");const source=document.createElement("video");source.muted=true;source.playsInline=true;source.src=URL.createObjectURL(file);await new Promise<void>((resolve,reject)=>{source.onloadedmetadata=()=>resolve();source.onerror=()=>reject(new Error("Video could not be read."));});const canvas=document.createElement("canvas");const scale=Math.min(1,1280/Math.max(1,source.videoWidth));canvas.width=Math.max(2,Math.round(source.videoWidth*scale));canvas.height=Math.max(2,Math.round(source.videoHeight*scale));const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Video canvas is unavailable.");const stream=canvas.captureStream(30);const mime=MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm";const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:2000000});const chunks:Blob[]=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};const done=new Promise<void>((resolve,reject)=>{recorder.onstop=()=>resolve();recorder.onerror=()=>reject(new Error("Video compression failed."));});recorder.start(250);await source.play();const draw=()=>{if(source.ended){recorder.stop();return;}ctx.drawImage(source,0,0,canvas.width,canvas.height);const pct=source.duration?Math.min(99,Math.round(source.currentTime/source.duration*100)):0;setProgress("video-compressor",pct,`${pct}%`);updateStatus("video-compressor",`Processing locally… ${pct}%`);requestAnimationFrame(draw)};draw();await done;URL.revokeObjectURL(source.src);setProgress("video-compressor",98,"encoding");downloadBlob(new Blob(chunks,{type:"video/webm"}),file.name.replace(/\.[^.]+$/,"")+"-compressed.webm","video-compressor");setProgress("video-compressor",100,"done");updateStatus("video-compressor","Done — compressed WebM downloaded. Original stayed local.");postWork("video compression");}

function wireTools():void{
 const previewUrls:string[]=[];
 document.querySelectorAll<HTMLInputElement>("[data-input]").forEach(input=>input.addEventListener("change",()=>{
  const tool=input.dataset.input as ToolId|undefined;
  if(!tool||state[tool])return;
  const files=input.files;
  if(!files?.length)return;
  if(files.length!==1){updateStatus(tool,"Select exactly one file.");input.value="";return;}
  const file=files[0];
  if(tool==="remove-bg"&&file.size>15*1024*1024){updateStatus(tool,"This file exceeds the 15 MB upload limit.");input.value="";return;}
  if(tool==="remove-bg"&&!["image/png","image/jpeg","image/webp"].includes(file.type)){updateStatus(tool,"Choose a PNG, JPG or WEBP image.");input.value="";return;}
  if(tool==="image-compressor"&&!file.type.startsWith("image/")||tool==="video-compressor"&&!file.type.startsWith("video/")){updateStatus(tool,"Choose a supported file for this tool.");input.value="";return;}
  pendingFiles[tool]=file;
  const zone=document.querySelector<HTMLElement>(`[data-dropzone="${tool}"]`);
  const preview=document.querySelector<HTMLElement>(`[data-preview="${tool}"]`);
  const media=document.querySelector<HTMLElement>(`[data-preview-media="${tool}"]`);
  const name=document.querySelector<HTMLElement>(`[data-file-name="${tool}"]`);
  const size=document.querySelector<HTMLElement>(`[data-file-size="${tool}"]`);
  const consent=document.querySelector<HTMLInputElement>(`[data-consent="${tool}"]`);
  const button=document.querySelector<HTMLButtonElement>(`[data-process="${tool}"]`);
  zone?.classList.add("has-file");
  if(preview)preview.hidden=false;
  if(name)name.textContent=file.name;
  if(size)size.textContent=(file.size/1048576).toFixed(2)+" MB · One file selected";
  if(media){
   media.querySelectorAll("img,video").forEach(el=>{const src=(el as HTMLImageElement).src;if(src.startsWith("blob:"))URL.revokeObjectURL(src);el.remove();});
   if(file.type.startsWith("image/")||file.type.startsWith("video/")){
    const url=URL.createObjectURL(file);previewUrls.push(url);
    const visual=document.createElement(file.type.startsWith("image/")?"img":"video");
    visual.setAttribute("aria-label","Selected file preview");
    if(visual instanceof HTMLVideoElement){visual.muted=true;visual.controls=true;visual.preload="metadata";}
    visual.src=url;media.appendChild(visual);
   }else media.textContent="Selected file";
  }
  if(consent){consent.checked=false;consent.disabled=false;}
  if(button)button.disabled=true;
  updateStatus(tool,"File ready. Tick the confirmation below the preview to enable processing.");
 }));
 document.querySelectorAll<HTMLInputElement>("[data-consent]").forEach(consent=>consent.addEventListener("change",()=>{
  const tool=consent.dataset.consent as ToolId;
  const button=document.querySelector<HTMLButtonElement>(`[data-process="${tool}"]`);
  if(button)button.disabled=!consent.checked||!pendingFiles[tool]||state[tool];
  updateStatus(tool,consent.checked?"Confirmed. Press the button to begin.":"Tick the confirmation to continue.");
 }));
 document.querySelectorAll<HTMLButtonElement>("[data-change]").forEach(button=>button.addEventListener("click",()=>{
  const tool=button.dataset.change as ToolId;
  if(state[tool])return;
  const input=document.querySelector<HTMLInputElement>(`[data-input="${tool}"]`);
  if(input){input.value="";input.click();}
 }));
 document.querySelectorAll<HTMLButtonElement>("[data-process]").forEach(button=>button.addEventListener("click",async()=>{
  const tool=button.dataset.process as ToolId|undefined,file=tool?pendingFiles[tool]:undefined;
  if(!tool||!file||state[tool])return;
  const consent=document.querySelector<HTMLInputElement>(`[data-consent="${tool}"]`);
  if(!consent?.checked){updateStatus(tool,"Confirm the selected file before processing.");return;}
  state[tool]=true;button.disabled=true;
  const zone=document.querySelector<HTMLElement>(`[data-dropzone="${tool}"]`);
  const change=document.querySelector<HTMLButtonElement>(`[data-change="${tool}"]`);
  zone?.classList.add("is-working");if(change)change.disabled=true;if(consent)consent.disabled=true;
  try{if(tool==="remove-bg")await removeBackground(file);else if(tool==="image-compressor")await compressImage(file);else await compressVideo(file);}
  catch(error){updateStatus(tool,error instanceof Error?error.message:"Something went wrong.");setProgress(tool,0,"retry");}
  finally{
   state[tool]=false;zone?.classList.remove("is-working");if(change)change.disabled=false;
   if(consent){consent.checked=false;consent.disabled=false;}
   button.disabled=true;
  }
 }));
 document.querySelectorAll<HTMLElement>("[data-dropzone]").forEach(zone=>{
  const tool=zone.dataset.dropzone as ToolId;
  ["dragenter","dragover"].forEach(t=>zone.addEventListener(t,e=>{e.preventDefault();if(!state[tool]&&!pendingFiles[tool])zone.classList.add("dragging")}));
  ["dragleave","drop"].forEach(t=>zone.addEventListener(t,e=>{e.preventDefault();zone.classList.remove("dragging")}));
  zone.addEventListener("drop",e=>{
   const files=(e as DragEvent).dataTransfer?.files,input=zone.querySelector<HTMLInputElement>("[data-input]");
   if(!files?.length||!input||state[tool]||pendingFiles[tool])return;
   if(files.length!==1){updateStatus(tool,"Drop exactly one file.");return;}
   const dt=new DataTransfer();dt.items.add(files[0]);input.files=dt.files;input.dispatchEvent(new Event("change",{bubbles:true}));
  });
 });
}


async function loadStars():Promise<void>{
 const targets=document.querySelectorAll<HTMLElement>("[data-stars]");
 if(!targets.length)return;
 try{
  const response=await fetch("https://api.github.com/repos/"+GITHUB_REPO,{headers:{"Accept":"application/vnd.github+json"}});
  if(!response.ok)throw new Error("GitHub request failed");
  const data=await response.json() as {stargazers_count?:number};
  const value=typeof data.stargazers_count==="number"?data.stargazers_count.toLocaleString():"—";
  targets.forEach(el=>el.textContent=value);
 }catch{targets.forEach(el=>el.textContent="★");}
}


function wirePassportPhoto():void{
 const root=document.querySelector<HTMLElement>(".passport-page-shell"); if(!root)return;
 const q=<T extends HTMLElement>(id:string):T=>{const element=root.querySelector<T>("#"+id);if(!element)throw new Error("Missing passport photo element: "+id);return element;};
 const input=q<HTMLInputElement>("passport-input"),source=q<HTMLImageElement>("passport-source"),preview=q<HTMLElement>("passport-upload-preview"),meta=q<HTMLElement>("passport-file-meta"),name=q<HTMLElement>("passport-file-name"),consent=q<HTMLInputElement>("passport-consent"),status=q<HTMLElement>("passport-status"),cropImg=q<HTMLImageElement>("passport-crop-image"),stage=q<HTMLElement>("passport-crop-stage"),box=q<HTMLElement>("passport-crop-box"),readout=q<HTMLElement>("passport-selection-readout"),selectBtn=q<HTMLButtonElement>("passport-select-area"),defaultBtn=q<HTMLButtonElement>("passport-default-area"),resetBtn=q<HTMLButtonElement>("passport-reset-area"),bgAction=q<HTMLButtonElement>("passport-bg-process"),step2Remove=q<HTMLButtonElement>("passport-step2-remove"),processing=q<HTMLElement>("passport-processing"),processingTitle=q<HTMLElement>("passport-processing-title"),processingDetail=q<HTMLElement>("passport-processing-detail"),processedPreview=q<HTMLElement>("passport-processed-preview"),processedImage=q<HTMLImageElement>("passport-processed-image"),photoUnit=q<HTMLSelectElement>("passport-photo-unit"),photoPreset=q<HTMLSelectElement>("passport-photo-preset"),pw=q<HTMLInputElement>("passport-photo-width"),ph=q<HTMLInputElement>("passport-photo-height"),paperUnit=q<HTMLSelectElement>("passport-paper-unit"),paperPreset=q<HTMLSelectElement>("passport-paper-preset"),paperW=q<HTMLInputElement>("passport-paper-width"),paperH=q<HTMLInputElement>("passport-paper-height"),summary=q<HTMLElement>("passport-layout-summary"),copies=q<HTMLInputElement>("passport-copies"),capacity=q<HTMLElement>("passport-capacity"),generate=q<HTMLButtonElement>("passport-generate"),result=q<HTMLElement>("passport-result"),bgColor=q<HTMLInputElement>("passport-color"),hex=q<HTMLInputElement>("passport-hex"),rgb=q<HTMLInputElement>("passport-rgb"),bgFile=q<HTMLInputElement>("passport-bg-image");
 type PS={file:File|null;image:HTMLImageElement|null;crop:{x:number;y:number;w:number;h:number}|null;bgMode:"keep"|"remove";processed:HTMLImageElement|null;bgColor:string;bgImage:HTMLImageElement|null;selecting:boolean};
 const s:PS={file:null,image:null,crop:null,bgMode:"keep",processed:null,bgColor:"#FFFFFF",bgImage:null,selecting:false};
 let processingActive=false;let requestVersion=0;
 const setStatus=(m:string)=>{if(status)status.textContent=m};
 const cmIn=2.54;
 const toCm=(v:number,u:string)=>u==="in"?v*cmIn:v;
 const fromCm=(v:number,u:string)=>u==="in"?v/cmIn:v;
 const paperSizes=[["A4",21,29.7],["A3",29.7,42],["A5",14.8,21],["A6",10.5,14.8],["A2",42,59.4],["B5",17.6,25],["Letter",21.59,27.94],["Legal",21.59,35.56],["Executive",18.41,26.67],["Ledger",27.94,43.18],["Statement",14,21.59],["Tabloid",27.94,43.18],["4 × 6 in",10.16,15.24],["5 × 7 in",12.7,17.78],["8 × 10 in",20.32,25.4],["11 × 17 in",27.94,43.18]];
 paperSizes.forEach((p,i)=>{const o=document.createElement("option");o.value=String(i);o.textContent=p[0]+" · "+p[1]+" × "+p[2]+" cm";paperPreset.appendChild(o)});
 const updateCrop=()=>{if(!s.image||!s.crop){box.hidden=true;readout.textContent="No area selected yet.";return}const r=cropImg.getBoundingClientRect(),parent=stage.getBoundingClientRect();if(!r.width||!r.height)return;const sx=s.image.naturalWidth/r.width,sy=s.image.naturalHeight/r.height;box.hidden=false;box.style.left=(r.left-parent.left+s.crop.x/sx)+"px";box.style.top=(r.top-parent.top+s.crop.y/sy)+"px";box.style.width=(s.crop.w/sx)+"px";box.style.height=(s.crop.h/sy)+"px";readout.textContent=Math.round(s.crop.w)+" × "+Math.round(s.crop.h)+" px selected";};
 const defaultCrop=()=>{if(!s.image)return;const w=s.image.naturalWidth,h=s.image.naturalHeight;const target=toCm(Number(pw.value),photoUnit.value)/toCm(Number(ph.value),photoUnit.value);if(!Number.isFinite(target)||target<=0){setStatus("Choose valid photo dimensions in Step 4 first.");return}let cw=w,ch=h;if(w/h>target)cw=h*target;else ch=w/target;s.crop={x:(w-cw)/2,y:(h-ch)/2,w:cw,h:ch};s.selecting=false;stage.classList.remove("is-selecting");updateCrop();setStatus("Default centred passport area selected using your Step 4 photo ratio. Drag to adjust it if needed.");};
 const resetCrop=()=>{if(!s.image)return;s.crop={x:0,y:0,w:s.image.naturalWidth,h:s.image.naturalHeight};updateCrop();setStatus("Full photo selected. You can redraw the area whenever you want.")};
 const load=(file:File)=>{if(!["image/png","image/jpeg","image/webp"].includes(file.type)){setStatus("Choose a PNG, JPG or WEBP image.");return}if(file.size>15*1024*1024){setStatus("This photo exceeds the 15 MB limit.");return}s.file=file;requestVersion++;s.processed=null;processedPreview.hidden=true;processing.hidden=true;const previousUrl=source.dataset.objectUrl;if(previousUrl)URL.revokeObjectURL(previousUrl);const url=URL.createObjectURL(file);source.dataset.objectUrl=url;source.src=url;source.hidden=false;cropImg.onload=()=>{s.image=cropImg;cropImg.hidden=false;const placeholder=q<HTMLElement>("passport-crop-placeholder");placeholder.hidden=true;resetCrop();};cropImg.src=url;name.textContent=file.name;meta.textContent=(file.size/1048576).toFixed(2)+" MB";preview.hidden=false;selectBtn.disabled=false;defaultBtn.disabled=false;resetBtn.disabled=false;step2Remove.disabled=!consent.checked;consent.disabled=false;setStatus("Photo loaded. Accept the terms, then select the area you need.")};
 input.addEventListener("change",()=>{const f=input.files?.[0];if(f)load(f)});
 q<HTMLButtonElement>("passport-change")?.addEventListener("click",()=>input.click());
 selectBtn.addEventListener("click",()=>{if(!s.image)return;s.selecting=true;stage.classList.add("is-selecting");setStatus("Drag across the image to draw the exact area you need.")});
 defaultBtn.addEventListener("click",defaultCrop);
 resetBtn.addEventListener("click",resetCrop);
 const point=(e:PointerEvent)=>{const r=cropImg.getBoundingClientRect();return{x:Math.max(0,Math.min(1,(e.clientX-r.left)/Math.max(1,r.width)))*s.image!.naturalWidth,y:Math.max(0,Math.min(1,(e.clientY-r.top)/Math.max(1,r.height)))*s.image!.naturalHeight}};
 window.addEventListener("resize",()=>{if(s.image&&s.crop)updateCrop()});
 let start={x:0,y:0};
 stage.addEventListener("pointerdown",e=>{if(!s.image||!s.selecting)return;start=point(e);s.crop={x:start.x,y:start.y,w:1,h:1};stage.setPointerCapture(e.pointerId);updateCrop()});
 stage.addEventListener("pointermove",e=>{if(!s.image||!s.selecting||!stage.hasPointerCapture(e.pointerId))return;const p=point(e);s.crop={x:Math.min(start.x,p.x),y:Math.min(start.y,p.y),w:Math.abs(p.x-start.x),h:Math.abs(p.y-start.y)};updateCrop()});
 stage.addEventListener("pointercancel",()=>{s.selecting=false;stage.classList.remove("is-selecting");if(s.crop)updateCrop()});
 stage.addEventListener("pointerup",()=>{if(!s.selecting)return;s.selecting=false;stage.classList.remove("is-selecting");if(!s.crop||s.crop.w<10||s.crop.h<10)resetCrop();else{updateCrop();setStatus("Area selected. Continue to background and size settings below.")}});
 root.querySelectorAll<HTMLButtonElement>("[data-bg-choice]").forEach(b=>b.addEventListener("click",()=>{root.querySelectorAll<HTMLButtonElement>("[data-bg-choice]").forEach(x=>{x.classList.remove("is-selected");x.setAttribute("aria-pressed","false")});b.classList.add("is-selected");b.setAttribute("aria-pressed","true");s.bgMode=(b.dataset.bgChoice==="remove"?"remove":"keep");if(s.bgMode==="remove"){if(!consent.checked){setStatus("Accept the Privacy Policy and Terms in Step 1 before AI background removal.");return}void prepare()}else{requestVersion++;processing.hidden=true;setStatus("Keeping the original background. Use Prepare background if you want to crop the photo.")}}));
 consent.addEventListener("change",()=>{bgAction.disabled=!consent.checked||!s.file||!s.crop;step2Remove.disabled=!consent.checked||!s.image;setStatus(consent.checked?"Terms accepted. Choose Keep or Remove Background.":"Please accept the terms before continuing.")});
 const photoPresets:Record<string,[number,number,string]>={"35x45":[3.5,4.5,"cm"],"2x2in":[2,2,"in"],"33x48":[3.3,4.8,"cm"],"50x50":[5,5,"cm"]};
 const updateLayout=()=>{const photoW=toCm(Number(pw.value),photoUnit.value),photoH=toCm(Number(ph.value),photoUnit.value),paperWcm=toCm(Number(paperW.value),paperUnit.value),paperHcm=toCm(Number(paperH.value),paperUnit.value),gap=.3,margin=.5;const cols=Math.floor((paperWcm-2*margin+gap)/(photoW+gap)),rows=Math.floor((paperHcm-2*margin+gap)/(photoH+gap)),rcols=Math.floor((paperWcm-2*margin+gap)/(photoH+gap)),rrows=Math.floor((paperHcm-2*margin+gap)/(photoW+gap)),cap=Math.max(0,cols*rows),want=Math.max(1,Math.min(200,Number(copies.value)||1));summary.textContent=cap?("Maximum capacity: "+cap+" photos · "+cols+" × "+rows+(rcols*rrows>cols*rows?" or rotated "+rcols+" × "+rrows:"")):"These dimensions cannot be used on this paper. Choose a smaller photo or larger paper.";capacity.innerHTML=cap>=want?("<strong>✓ "+want+" photos fit.</strong> Maximum: "+cap+"."):( "<strong>⚠ "+want+" photos do not fit.</strong> Maximum available: "+cap+". Change copies, photo size or paper.");generate.disabled=!(cap>=want&&cap>0&&s.processed&&consent.checked)};
 const updatePhoto=()=>{const p=photoPresets[photoPreset.value];if(p){pw.value=fromCm(toCm(p[0],p[2]),photoUnit.value).toFixed(2);ph.value=fromCm(toCm(p[1],p[2]),photoUnit.value).toFixed(2)}updateLayout()};
 photoPreset.addEventListener("change",updatePhoto);photoUnit.addEventListener("change",updatePhoto);pw.addEventListener("input",()=>{photoPreset.value="custom";updateLayout()});ph.addEventListener("input",()=>{photoPreset.value="custom";updateLayout()});
 const updatePaper=()=>{const p=paperSizes[Number(paperPreset.value)||0];paperW.value=fromCm(Number(p[1]),paperUnit.value).toFixed(2);paperH.value=fromCm(Number(p[2]),paperUnit.value).toFixed(2);updateLayout()};
 paperPreset.addEventListener("change",updatePaper);paperUnit.addEventListener("change",updatePaper);paperW.addEventListener("input",updateLayout);paperH.addEventListener("input",updateLayout);copies.addEventListener("input",updateLayout);
 const setColor=(v:string)=>{if(!/^#[0-9a-f]{6}$/i.test(v))return;s.bgColor=v.toUpperCase();bgColor.value=s.bgColor;hex.value=s.bgColor;const n=parseInt(s.bgColor.slice(1),16);rgb.value=(n>>16)+", "+((n>>8)&255)+", "+(n&255)};
 root.querySelectorAll<HTMLButtonElement>("[data-bg-color]").forEach(b=>b.addEventListener("click",()=>setColor(b.dataset.bgColor||"#FFFFFF")));
 bgColor.addEventListener("input",()=>setColor(bgColor.value));hex.addEventListener("change",()=>setColor(hex.value.startsWith("#")?hex.value:"#"+hex.value));rgb.addEventListener("change",()=>{const a=rgb.value.split(",").map(Number);if(a.length===3&&a.every(n=>Number.isFinite(n)&&n>=0&&n<=255))setColor("#"+a.map(n=>Math.round(n).toString(16).padStart(2,"0")).join(""))});
 bgFile.addEventListener("change",()=>{const f=bgFile.files?.[0];if(!f)return;const url=URL.createObjectURL(f),im=new Image();im.onload=()=>{s.bgImage=im;URL.revokeObjectURL(url);setStatus("Custom background image loaded.");};im.src=url});
 const prepare=async()=>{if(processingActive)return;if(!s.file||!s.crop||!s.image){setStatus("Upload a photo and select an area first.");return}if(!consent.checked){setStatus("Accept the Privacy Policy and Terms in Step 1 before processing.");return}processingActive=true;const thisRequest=++requestVersion;step2Remove.disabled=true;step2Remove.textContent="Removing background…";step2Remove.setAttribute("aria-busy","true");bgAction.disabled=true;bgAction.textContent=s.bgMode==="remove"?"Removing background…":"Preparing photo…";bgAction.setAttribute("aria-busy","true");s.processed=null;processedPreview.hidden=true;processedImage.hidden=true;processing.hidden=false;processing.scrollIntoView({behavior:"smooth",block:"nearest"});processingTitle.textContent=s.bgMode==="remove"?"Removing your photo background…":"Preparing your selected photo…";processingDetail.textContent=s.bgMode==="remove"?"Your selected photo is being processed securely. Please keep this page open.":"Cropping your photo in this browser.";setStatus(s.bgMode==="remove"?"AI background removal is in progress…":"Preparing your selected area locally…");updateLayout();try{const canvas=document.createElement("canvas");const maxSide=1600,scale=Math.min(1,maxSide/Math.max(s.crop.w,s.crop.h));canvas.width=Math.max(1,Math.round(s.crop.w*scale));canvas.height=Math.max(1,Math.round(s.crop.h*scale));const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Image processing is unavailable.");ctx.drawImage(s.image,s.crop.x,s.crop.y,s.crop.w,s.crop.h,0,0,canvas.width,canvas.height);let url:string;if(s.bgMode==="remove"){const blob=await new Promise<Blob>((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error("Could not prepare the selected crop.")),"image/png"));const controller=new AbortController();const timeout=window.setTimeout(()=>controller.abort(),30000);let response:Response;try{response=await fetch("/api/remove-bg",{method:"POST",signal:controller.signal,headers:{"Content-Type":"image/png","Accept":"image/png"},body:blob})}finally{window.clearTimeout(timeout)}if(!response.ok){let msg="Background removal failed.";try{const d=await response.json() as {error?:string};if(d.error)msg=d.error}catch{}throw new Error(msg)}const out=await response.blob();if(!out.size)throw new Error("The background-removal processor returned an empty image.");url=URL.createObjectURL(out)}else{url=canvas.toDataURL("image/png")}const im=new Image();await new Promise<void>((resolve,reject)=>{im.onload=()=>resolve();im.onerror=()=>reject(new Error("Could not display the processed photo."));im.src=url});if(thisRequest!==requestVersion)return;s.processed=im;const oldPreviewUrl=processedImage.dataset.objectUrl;if(oldPreviewUrl)URL.revokeObjectURL(oldPreviewUrl);processedImage.dataset.objectUrl=url.startsWith("blob:")?url:"";processedImage.src=url;processedImage.hidden=false;processedPreview.hidden=false;processing.hidden=true;setStatus(s.bgMode==="remove"?"Background removed successfully. Review your photo below.":"Photo prepared locally. Review your photo below.");updateLayout()}catch(e){if(thisRequest!==requestVersion)return;processing.hidden=true;setStatus(e instanceof Error?(e.name==="AbortError"?"Processing exceeded 30 seconds. Please try again.":e.message):"Could not prepare the photo.");processingDetail.textContent="Processing failed. You can retry.";updateLayout()}finally{processingActive=false;step2Remove.disabled=!consent.checked||!s.image;step2Remove.textContent="Remove background now";step2Remove.removeAttribute("aria-busy");bgAction.disabled=!consent.checked||!s.file||!s.crop;bgAction.removeAttribute("aria-busy");bgAction.textContent="Prepare background"}};
 bgAction.addEventListener("click",prepare);
 step2Remove.addEventListener("click",()=>{s.bgMode="remove";root.querySelectorAll<HTMLButtonElement>("[data-bg-choice]").forEach(b=>{const selected=b.dataset.bgChoice==="remove";b.classList.toggle("is-selected",selected);b.setAttribute("aria-pressed",String(selected))});void prepare()});
 const generateSheet=async()=>{if(!s.processed||!s.crop||!consent.checked)return;const photoW=toCm(Number(pw.value),photoUnit.value),photoH=toCm(Number(ph.value),photoUnit.value),paperWcm=toCm(Number(paperW.value),paperUnit.value),paperHcm=toCm(Number(paperH.value),paperUnit.value),want=Math.max(1,Math.min(200,Number(copies.value)||1)),gap=.3,margin=.5;let dpi=300,W=Math.round(paperWcm*dpi/2.54),H=Math.round(paperHcm*dpi/2.54);if(W>9000||H>9000){dpi=150;W=Math.round(paperWcm*dpi/2.54);H=Math.round(paperHcm*dpi/2.54)}const canvas=document.createElement("canvas");canvas.width=W;canvas.height=H;const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Canvas is unavailable.");ctx.fillStyle=s.bgColor;ctx.fillRect(0,0,W,H);if(s.bgImage){const scale=Math.max(W/s.bgImage.naturalWidth,H/s.bgImage.naturalHeight),iw=s.bgImage.naturalWidth*scale,ih=s.bgImage.naturalHeight*scale;ctx.drawImage(s.bgImage,(W-iw)/2,(H-ih)/2,iw,ih)}const target=photoW/photoH,src=s.processed!,sw=src.naturalWidth,sh=src.naturalHeight;let sx=0,sy=0,cw=sw,ch=sh;if(sw/sh>target){cw=sh*target;sx=(sw-cw)/2}else{ch=sw/target;sy=(sh-ch)/2}const pxW=Math.round(photoW*dpi/2.54),pxH=Math.round(photoH*dpi/2.54),gapPx=Math.round(gap*dpi/2.54),marginPx=Math.round(margin*dpi/2.54),cols=Math.floor((W-2*marginPx+gapPx)/(pxW+gapPx)),rows=Math.floor((H-2*marginPx+gapPx)/(pxH+gapPx));if(cols<1||rows<1||want>cols*rows)throw new Error("The selected photos do not fit on this sheet.");for(let i=0;i<want;i++){const col=i%cols,row=Math.floor(i/cols);ctx.drawImage(src,sx,sy,cw,ch,marginPx+col*(pxW+gapPx),marginPx+row*(pxH+gapPx),pxW,pxH)}const blob=await new Promise<Blob>((res,rej)=>canvas.toBlob(b=>b?res(b):rej(new Error("Could not create the printable sheet.")),"image/jpeg",.96));const url=URL.createObjectURL(blob);result.hidden=false;result.innerHTML="<div class=\"passport-result-head\"><div><p class=\"eyebrow\">READY</p><h3>"+want+" photo"+(want===1?"":"s")+" · "+paperWcm.toFixed(2)+" × "+paperHcm.toFixed(2)+" cm paper · "+dpi+" DPI</h3></div><a class=\"button primary\" href=\""+url+"\" download=\"flythebg-passport-sheet.jpg\">Download printable JPG ↓</a></div><img src=\""+url+"\" alt=\"Generated passport photo sheet\"><small>Generated locally in this browser. For exact physical dimensions, review the print dialogue and disable “fit to page”.</small>";result.hidden=false;result.scrollIntoView({behavior:"smooth",block:"start"})};
 generate.addEventListener("click",()=>generateSheet().catch(e=>setStatus(e instanceof Error?e.message:"Could not generate the sheet.")));
 updatePhoto();updatePaper();setColor("#FFFFFF");updateLayout();
}

function wireNavigation():void{
 document.addEventListener("click",event=>{
  const target=event.target as HTMLElement|null;
  const link=target?.closest<HTMLAnchorElement>('a[href^="/"]');
  if(!link||link.target||event.defaultPrevented)return;
  const url=new URL(link.href,window.location.origin);
  if(url.origin!==window.location.origin)return;
  event.preventDefault();
  history.pushState({}, "", url.pathname);
  render();
 });
 window.addEventListener("popstate",()=>{document.body.classList.remove("fly-menu-open");document.body.style.removeProperty("overflow");document.documentElement.style.removeProperty("overflow");render();});
}

function revealElements():void{
 const items=document.querySelectorAll<HTMLElement>(".reveal");
 if(!("IntersectionObserver" in window)){items.forEach(el=>el.classList.add("visible"));return;}
 const observer=new IntersectionObserver(entries=>{
  entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("visible");observer.unobserve(entry.target);}});
 },{threshold:.08});
 items.forEach(el=>observer.observe(el));
}

function render():void{
 const app=document.querySelector<HTMLElement>("#app");
 if(!app)return;
 const route=normalizePath();
 let page="";
 switch(route){
  case "/remove-bg":page=toolPage("remove-bg","01","Remove Background Online","Remove an image background with the protected FlyThe BG AI route.","image/png,image/jpeg,image/webp","15 MB max","Your image is sent only after you choose a file, accept the notice and press Remove background. It is processed for this request and is not intended to be kept as a permanent FlyThe BG file.");
  break;
  case "/image-compressor":page=toolPage("image-compressor","02","Compress Images Online","Shrink an image locally in your browser without uploading the original.","image/png,image/jpeg,image/webp,image/gif","local processing","The original image stays in your browser during compression.");
  break;
  case "/video-compressor":page=toolPage("video-compressor","03","Compress Video Online","Create a smaller WebM locally in your browser with visible progress.","video/*","local processing","The original video stays in your browser during compression.");
  break;
  case "/passport-photo":page=passportPhotoPage();break;
  case "/features":page=features();break;
  case "/about":page=about();break;
  case "/faq":page=faq();break;
  case "/privacy":page=privacy();break;
  case "/terms":page=terms();break;
  case "/contact":page=contact();break;
  case "/support":page=support();break;
  case "/blogs":page=blog();break;
  case "/blogs/remove-background-online-privacy":page=blogPrivacy();break;
  case "/blogs/compress-images-in-browser":page=blogImage();break;
  case "/blogs/webm-video-compression-guide":page=blogVideo();break;
  case "/code-of-conduct":page=codeOfConduct();break;
  case "/accessibility":page=accessibility();break;
  case "/security":page=security();break;
  case "/cookies":page=cookies();break;
  case "/changelog":page=changelog();break;
  case "/":page=home();break;
  default:page=home();
 }
 app.innerHTML=page;
 wireTools();
 wirePassportPhoto();
 wireSpaceExperience();
 wireFlyLanding();
 wireEditorial();
 loadStars();
 revealElements();
 document.body.classList.remove("app-pending");
}

wireNavigation();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});
else render();