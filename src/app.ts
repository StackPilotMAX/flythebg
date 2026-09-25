type ToolId = "remove-bg" | "image-compressor" | "video-compressor";
type Route = "/" | "/remove-bg" | "/image-compressor" | "/video-compressor" | "/features" | "/about" | "/faq" | "/privacy" | "/terms" | "/contact" | "/support";

const VIDEO="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260912_104303_0c6d60b2-9353-408e-9449-585108a22fb5.mp4";
const POSTER="https://d2ol7oe51mr4n9d.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/130837c4-0244-4f37-9c61-8d801d93fd29.jpg";
const GITHUB_REPO="StackPilotMAX/flythebg";
const GITHUB_URL="https://github.com/StackPilotMAX/flythebg";
const COFFEE_URL="https://www.buymeacoffee.com/flythebg";
const state:Record<ToolId,boolean>={"remove-bg":false,"image-compressor":false,"video-compressor":false};
const pendingFiles:Partial<Record<ToolId,File>>={};

function shell(content:string,title:string):string{
 document.title=title;
 return `<div class="notice">By using FlyThe BG, you accept our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>.</div>
 <header class="nav"><a class="brand" href="/"><span class="brand-mark">F</span><span>FlyThe BG</span></a><nav><a href="/features">Tools</a><a href="/about">About</a><a href="/faq">FAQ</a><a href="/support">☕ Support</a></nav></header><div class="shared-page-frame">${content}</div>
 <footer class="footer"><div><strong>FlyThe BG</strong><span>Practical media tools for images and video.</span><span class="star-count">★ <b data-stars>—</b> GitHub stars</span></div><nav><a href="/features">Get started</a><a href="/support">Support</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/faq">FAQ</a><a href="/contact">Contact</a></nav><small>© 2026 FlyThe BG · AGPL-3.0 · independent project · support@flythebg.com</small></footer>`;
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
 const consent=id==="remove-bg"?`<label class="consent"><input type="checkbox" data-consent="remove-bg"><span>I understand that my selected image will be sent to the FlyThe BG background-removal processor running on Hugging Face Spaces.</span></label>`:"";
 return shell(`<main class="tool-page reveal"><div class="tool-intro"><p class="eyebrow">FLYTHE BG · ${num}</p><h1>${title}</h1><p>${description}</p><div class="pills"><span>${id==="remove-bg"?"PROTECTED AI":"LOCAL-FIRST"}</span><span>${note}</span></div></div><section class="tool-workspace"><div class="workspace-head"><span>${id==="remove-bg"?"PROTECTED UPLOAD":"YOUR DEVICE, YOUR FILE"}</span><span data-progress-label="${id}">0%</span></div>${consent}<label class="big-dropzone" data-dropzone="${id}"><input data-input="${id}" type="file" accept="${accept}"><span class="upload-arrow">↑</span><strong>Drop your file here</strong><small>or tap to browse your device</small><em>${id==="remove-bg"?"PNG · JPG · WEBP · max 15 MB":"nothing leaves your browser"}</em></label><p class="selected-file" data-file-name="${id}">No file selected.</p><button class="button primary process-button" data-process="${id}" type="button" disabled>${id==="remove-bg"?"Remove background →":"Compress file →"}</button><div class="progress-track"><div class="progress-bar" data-progress="${id}"></div></div><p class="status" role="status" aria-live="polite" data-status="${id}">Ready when you are. Processing status will appear here.</p></section><p class="processing-note">${privacy}</p></main>`,`${title} — FlyThe BG`);
}

function home():string{
 document.title="FlyThe BG — Media Tools Designed To Fly";
 return \`<main class="fly-home">
  <div class="fly-bg" aria-hidden="true">
   <video class="fly-bg-video" autoplay muted loop playsinline preload="auto">
    <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260809_012548_ef22562c-c0ae-4816-ad9d-f8922af4e6a7.mp4" type="video/mp4">
   </video>
   <div class="fly-bg-shade"></div>
  </div>
  <div class="fly-page">
   <header class="fly-header">
    <a class="fly-logo" href="/" aria-label="FlyThe BG home"><span class="brand-mark">F</span></a>
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
    <a href="/about">About</a>
    <a href="/contact">Contact</a>
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
    <a class="fly-cta anim" style="--d:.4s" href="/features">Get Started</a>
   </section>
   <footer class="fly-stats" aria-label="FlyThe BG highlights">
    <div class="fly-stat anim" style="--d:.5s"><span class="fly-stat-icon">&lt;</span><span class="fly-stat-value" data-count="15" data-decimals="0" data-suffix=" MB">0</span><span class="fly-stat-label">Background upload limit</span></div>
    <div class="fly-stat anim" style="--d:.58s"><span class="fly-stat-icon">%</span><span class="fly-stat-value" data-count="2" data-decimals="0" data-suffix="">0</span><span class="fly-stat-label">Browser-local tools</span></div>
    <div class="fly-stat anim" style="--d:.66s"><span class="fly-stat-icon">*</span><span class="fly-stat-value" data-count="0" data-decimals="0" data-suffix="">0</span><span class="fly-stat-label">Accounts required</span></div>
    <div class="fly-stat anim" style="--d:.74s"><span class="fly-stat-icon">#</span><span class="fly-stat-value" data-count="1" data-decimals="0" data-suffix="">0</span><span class="fly-stat-label">Protected AI route</span></div>
   </footer>
  </div>
 </main>\`;
}

function features():string{return shell(`<main class="page reveal"><div class="page-hero center-heading"><p class="eyebrow">GET STARTED</p><h1>Choose a tool.<br>and get to work.</h1><p>Focused workspaces, visible progress and plain-English privacy boundaries.</p></div><div class="tool-links"><a href="/remove-bg"><span>01</span><div><b>Remove Background</b><small>Protected AI · PNG/JPG/WEBP · 15 MB</small></div><strong>Open ↗</strong></a><a href="/image-compressor"><span>02</span><div><b>Image Compressor</b><small>Runs locally in your browser</small></div><strong>Open ↗</strong></a><a href="/video-compressor"><span>03</span><div><b>Video Compressor</b><small>Local WebM with live progress</small></div><strong>Open ↗</strong></a></div><div class="tip-card"><b>Tip:</b> For large video files, close unnecessary browser tabs to keep more memory available.</div></main>`,"Get Started — FlyThe BG");}

function support():string{return shell(`<main class="page support-page reveal"><div class="support-hero"><p class="eyebrow">OPTIONAL SUPPORT</p><h1>Support independent development. ☕</h1><p>If FlyThe BG helped, support is optional. You leave FlyThe BG and complete payment on Buy Me a Coffee's own page.</p><a class="button primary huge" href="${COFFEE_URL}" target="_blank" rel="noopener noreferrer">☕ Buy Me a Coffee ↗</a><small class="payment-note">Payment happens on Buy Me a Coffee. FlyThe BG does not process your card, verify a payment, or mark a donation as completed.</small></div><div class="support-grid"><article><span>01</span><h2>Help for free</h2><p>Give the GitHub repo a star. One click. No wallet required.</p><a class="button ghost" href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer">⭐ Star on GitHub</a></article><article><span>02</span><h2>Send coffee</h2><p>Pick an amount and complete payment on Buy Me a Coffee.</p><a class="button coffee" href="${COFFEE_URL}" target="_blank" rel="noopener noreferrer">☕ Open Buy Me a Coffee</a></article><article><span>03</span><h2>Not today?</h2><p>Totally valid. No guilt, no fake conversion tracking.</p><button class="button ghost" onclick="this.textContent='Maybe later'">Maybe later</button></article></div></main>`,"Support FlyThe BG — Buy Me a Coffee");}

function about():string{return shell(`<main class="page prose reveal"><p class="eyebrow">ABOUT FLYTHE BG</p><h1>Useful tools.<br>clear communication.</h1><p>FlyThe BG is an independent project focused on practical media utilities with data minimisation as a design goal. The UI is playful; the security boundary is not.</p><h2>How it works</h2><p>Compression runs locally in your browser. Background removal uses a protected server route so the private AI credential never reaches your device.</p><h2>Independent project</h2><p>FlyThe BG is currently not operated as a registered company or business entity. Project communication: <a href="mailto:support@flythebg.com">support@flythebg.com</a>.</p></main>`,"About — FlyThe BG");}

function faq():string{return shell(`<main class="page prose reveal"><p class="eyebrow">FAQ</p><h1>Questions,<br>clearly answered.</h1><details open><summary>Why was nothing happening when I uploaded?</summary><p>The new workspaces show visible status, a progress bar where progress can be measured, drag-and-drop and a completion card. Video compression reports live percentage while frames are processed.</p></details><details><summary>Which tools upload my files?</summary><p>Background removal requires a protected network request. Image and video compression are designed to stay inside your browser.</p></details><details><summary>Does Buy Me a Coffee prove I paid?</summary><p>No. The support page only redirects to Buy Me a Coffee. FlyThe BG does not receive or infer payment confirmation.</p></details><details><summary>Are the AI names owned by FlyThe BG?</summary><p>No. OpenAI, GPT, ChatGPT, Anthropic, Claude, Google, Gemini, xAI, Grok, Hugging Face and other names or marks belong to their respective owners. FlyThe BG is independent and references are descriptive only.</p></details><details><summary>Can I use the tools without an account?</summary><p>Yes. No FlyThe BG account is required.</p></details></main>`,"FAQ — FlyThe BG");}

function privacy():string{return shell(`<main class="page prose legal reveal"><p class="eyebrow">PRIVACY</p><h1>Privacy Policy</h1><p class="muted">Effective: 21 September 2026 · India-focused notice</p><p>FlyThe BG is an independent project. This notice explains intended handling of digital personal data and is written with the Digital Personal Data Protection Act, 2023 and notified Digital Personal Data Protection Rules, 2025 in mind. It is not a legal opinion.</p><h2>Data and purpose</h2><p>Background-removal images are received only when deliberately submitted, for producing the requested result. Contact details are used to respond to messages, privacy requests and security reports. Normal technical connection data may be processed by infrastructure providers for delivery and security.</p><h2>Local compression</h2><p>Image and video compression are designed to run locally in your browser, so the original file does not need to be uploaded to FlyThe BG.</p><h2>Background removal</h2><p>Submitted images pass through a same-origin Cloudflare Worker and are forwarded to the FlyThe BG background-removal processor running on Hugging Face Spaces. The Hugging Face credential remains server-side and is never sent to your browser. FlyThe BG does not provide an image gallery, account storage, storage bucket or persistent image library for background-removal uploads. The external Hugging Face/Gradio runtime may create temporary processing files while the request is running; FlyThe BG does not treat those temporary files as a user storage service.</p><h2>Consent and withdrawal</h2><p>The background-removal page displays a purpose-specific notice and requires affirmative confirmation before upload. FlyThe BG does not intentionally retain submitted images after the requested processing flow. Temporary files can exist inside the Hugging Face/Gradio processing runtime while the model works; retention and cleanup at that external processor depend on its runtime configuration. FlyThe BG does not promise zero transient processor storage unless that configuration has been verified. You can stop future processing by not submitting an image.</p><h2>Third-party brands</h2><p>Names, logos, trademarks and product names referenced on FlyThe BG belong to their respective owners. References are descriptive only and do not imply sponsorship, endorsement, partnership or ownership by FlyThe BG.</p><h2>Rights and complaints</h2><p>Subject to applicable law, you may have rights concerning access, correction, erasure, consent withdrawal and grievances. Contact <a href="mailto:support@flythebg.com">support@flythebg.com</a>.</p></main>`,"Privacy Policy — FlyThe BG");}

function terms():string{return shell(`<main class="page prose legal reveal"><p class="eyebrow">TERMS</p><h1>Terms of Service</h1><p class="muted">Effective: 21 September 2026</p><p>FlyThe BG is an independent project, not currently operated as a registered company or business entity.</p><h2>Use</h2><p>Use the tools lawfully and only with content you are permitted to process.</p><h2>Your content</h2><p>You retain your rights in files you submit and are responsible for permissions needed to process them.</p><h2>Third-party names and marks</h2><p>OpenAI, GPT, ChatGPT, Anthropic, Claude, Google, Gemini, xAI, Grok, Hugging Face, Buy Me a Coffee, GitHub and other names or marks referenced by the project belong to their respective owners. FlyThe BG is independent; references do not create an affiliation, endorsement or partnership.</p><h2>Support payments</h2><p>Support links redirect you to Buy Me a Coffee. FlyThe BG does not process, confirm, reconcile or represent that a payment was completed. Any payment relationship is between you and the external provider.</p><h2>Availability</h2><p>The project may change, be rate-limited or become unavailable as infrastructure evolves.</p><h2>Contact</h2><p><a href="mailto:support@flythebg.com">support@flythebg.com</a></p></main>`,"Terms — FlyThe BG");}

function contact():string{return shell(`<main class="page prose reveal"><p class="eyebrow">CONTACT</p><h1>Talk to the project.</h1><p>For privacy requests, security reports, feedback or project communication:</p><a class="contact-card" href="mailto:support@flythebg.com"><span>Email</span><strong>support@flythebg.com</strong></a></main>`,"Contact — FlyThe BG");}

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
 const root=document.querySelector<HTMLElement>(".fly-home");if(!root)return;
 const burger=root.querySelector<HTMLButtonElement>(".fly-burger");
 const menu=root.querySelector<HTMLElement>(".fly-mobile-menu");
 const overlay=root.querySelector<HTMLElement>(".fly-mobile-overlay");
 const closeMenu=()=>{if(!menu||!burger)return;menu.hidden=true;burger.setAttribute("aria-expanded","false");burger.classList.remove("is-open");document.body.classList.remove("fly-menu-open");};
 const openMenu=()=>{if(!menu||!burger)return;menu.hidden=false;burger.setAttribute("aria-expanded","true");burger.classList.add("is-open");document.body.classList.add("fly-menu-open");};
 burger?.addEventListener("click",()=>burger.getAttribute("aria-expanded")==="true"?closeMenu():openMenu());
 overlay?.addEventListener("click",closeMenu);
 menu?.querySelectorAll("a").forEach(a=>a.addEventListener("click",closeMenu));
 document.addEventListener("keydown",e=>{if(e.key==="Escape")closeMenu();},{once:true});
 const mq=matchMedia("(min-width:721px)");
 mq.addEventListener?.("change",e=>{if(e.matches)closeMenu();});
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
function normalizePath():Route{const p=window.location.pathname.replace(/\/+$/,"")||"/";const routes:Record<string,Route>={"/":"/","/remove-bg":"/remove-bg","/image-compressor":"/image-compressor","/video-compressor":"/video-compressor","/features":"/features","/about":"/about","/faq":"/faq","/privacy":"/privacy","/terms":"/terms","/contact":"/contact","/support":"/support"};return routes[p]||"/";}
function downloadBlob(blob:Blob,filename:string):void{const url=URL.createObjectURL(blob);const a=document.createElement("a");a.href=url;a.download=filename;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);}
function setProgress(tool:ToolId,value:number,label?:string):void{const n=Math.max(0,Math.min(100,value));const bar=document.querySelector<HTMLElement>(`[data-progress="${tool}"]`);if(bar)bar.style.width=`${n}%`;const text=document.querySelector<HTMLElement>(`[data-progress-label="${tool}"]`);if(text)text.textContent=label??`${Math.round(n)}%`;}
function updateStatus(tool:ToolId,message:string):void{const el=document.querySelector<HTMLElement>(`[data-status="${tool}"]`);if(el)el.textContent=message;}

async function removeBackground(file:File):Promise<void>{setProgress("remove-bg",8,"uploading");updateStatus("remove-bg","Uploading securely… this is the one tool that needs the internet.");const response=await fetch("/api/remove-bg",{method:"POST",headers:{"Content-Type":file.type},body:file});setProgress("remove-bg",72,"AI processing");if(!response.ok){let message="Background removal failed.";try{const data=await response.json() as {error?:string};if(data.error)message=data.error;}catch{}throw new Error(message);}setProgress("remove-bg",92,"preparing");downloadBlob(await response.blob(),file.name.replace(/\.[^.]+$/,"")+"-no-bg.png");setProgress("remove-bg",100,"done");updateStatus("remove-bg","Done — transparent PNG downloaded.");postWork("background removal");}

async function compressImage(file:File):Promise<void>{setProgress("image-compressor",10,"reading");updateStatus("image-compressor","Reading the image locally…");const bitmap=await createImageBitmap(file);setProgress("image-compressor",35,"resizing");const maxSide=2400;const scale=Math.min(1,maxSide/Math.max(bitmap.width,bitmap.height));const canvas=document.createElement("canvas");canvas.width=Math.max(1,Math.round(bitmap.width*scale));canvas.height=Math.max(1,Math.round(bitmap.height*scale));const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Canvas is unavailable.");ctx.drawImage(bitmap,0,0,canvas.width,canvas.height);bitmap.close();setProgress("image-compressor",68,"compressing");const blob=await new Promise<Blob>((resolve,reject)=>canvas.toBlob(v=>v?resolve(v):reject(new Error("Compression failed.")),"image/jpeg",.72));setProgress("image-compressor",92,"downloading");downloadBlob(blob,file.name.replace(/\.[^.]+$/,"")+"-compressed.jpg");setProgress("image-compressor",100,"done");updateStatus("image-compressor","Done — original stayed in your browser.");postWork("image compression");}

async function compressVideo(file:File):Promise<void>{if(!("MediaRecorder"in window))throw new Error("MediaRecorder is unavailable in this browser.");setProgress("video-compressor",3,"loading");updateStatus("video-compressor","Loading video locally… no upload is happening.");const source=document.createElement("video");source.muted=true;source.playsInline=true;source.src=URL.createObjectURL(file);await new Promise<void>((resolve,reject)=>{source.onloadedmetadata=()=>resolve();source.onerror=()=>reject(new Error("Video could not be read."));});const canvas=document.createElement("canvas");const scale=Math.min(1,1280/Math.max(1,source.videoWidth));canvas.width=Math.max(2,Math.round(source.videoWidth*scale));canvas.height=Math.max(2,Math.round(source.videoHeight*scale));const ctx=canvas.getContext("2d");if(!ctx)throw new Error("Video canvas is unavailable.");const stream=canvas.captureStream(30);const mime=MediaRecorder.isTypeSupported("video/webm;codecs=vp9")?"video/webm;codecs=vp9":"video/webm";const recorder=new MediaRecorder(stream,{mimeType:mime,videoBitsPerSecond:2000000});const chunks:Blob[]=[];recorder.ondataavailable=e=>{if(e.data.size)chunks.push(e.data)};const done=new Promise<void>((resolve,reject)=>{recorder.onstop=()=>resolve();recorder.onerror=()=>reject(new Error("Video compression failed."));});recorder.start(250);await source.play();const draw=()=>{if(source.ended){recorder.stop();return;}ctx.drawImage(source,0,0,canvas.width,canvas.height);const pct=source.duration?Math.min(99,Math.round(source.currentTime/source.duration*100)):0;setProgress("video-compressor",pct,`${pct}%`);updateStatus("video-compressor",`Processing locally… ${pct}%`);requestAnimationFrame(draw)};draw();await done;URL.revokeObjectURL(source.src);setProgress("video-compressor",98,"encoding");downloadBlob(new Blob(chunks,{type:"video/webm"}),file.name.replace(/\.[^.]+$/,"")+"-compressed.webm");setProgress("video-compressor",100,"done");updateStatus("video-compressor","Done — compressed WebM downloaded. Original stayed local.");postWork("video compression");}

function wireTools():void{
 document.querySelectorAll<HTMLInputElement>("[data-input]").forEach(input=>input.addEventListener("change",()=>{
  const file=input.files?.[0],tool=input.dataset.input as ToolId|undefined;
  if(!file||!tool||state[tool])return;
  pendingFiles[tool]=file;
  const name=document.querySelector<HTMLElement>(`[data-file-name="${tool}"]`);
  if(name)name.textContent=file.name+" selected — nothing sent yet.";
  const button=document.querySelector<HTMLButtonElement>(`[data-process="${tool}"]`);
  if(button)button.disabled=false;
  updateStatus(tool,tool==="remove-bg"?"Ready. Nothing is uploaded until you press “Remove background” and accept the notice.":"Ready. Nothing is processed until you press the button.");
 }));
 document.querySelectorAll<HTMLButtonElement>("[data-process]").forEach(button=>button.addEventListener("click",async()=>{
  const tool=button.dataset.process as ToolId|undefined,file=tool?pendingFiles[tool]:undefined;
  if(!tool||!file||state[tool])return;
  if(tool==="remove-bg"&&!document.querySelector<HTMLInputElement>('[data-consent="remove-bg"]')?.checked){updateStatus(tool,"Please accept the processing notice before uploading.");return;}
  state[tool]=true;button.disabled=true;const zone=document.querySelector<HTMLElement>(`[data-dropzone="${tool}"]`);zone?.classList.add("is-working");
  try{if(tool==="remove-bg")await removeBackground(file);else if(tool==="image-compressor")await compressImage(file);else await compressVideo(file);}
  catch(error){updateStatus(tool,error instanceof Error?error.message:"Something went wrong.");setProgress(tool,0,"retry");}
  finally{state[tool]=false;delete pendingFiles[tool];button.disabled=true;zone?.classList.remove("is-working");}
 }));
 document.querySelectorAll<HTMLElement>("[data-dropzone]").forEach(zone=>{
  const tool=zone.dataset.dropzone as ToolId;
  ["dragenter","dragover"].forEach(t=>zone.addEventListener(t,e=>{e.preventDefault();zone.classList.add("dragging")}));
  ["dragleave","drop"].forEach(t=>zone.addEventListener(t,e=>{e.preventDefault();zone.classList.remove("dragging")}));
  zone.addEventListener("drop",e=>{
   const file=(e as DragEvent).dataTransfer?.files?.[0],input=zone.querySelector<HTMLInputElement>("[data-input]");
   if(file&&input&&!state[tool]){const dt=new DataTransfer();dt.items.add(file);input.files=dt.files;input.dispatchEvent(new Event("change",{bubbles:true}))}
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
 window.addEventListener("popstate",render);
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
  case "/remove-bg":page=toolPage("remove-bg","01","Remove Background","Remove an image background with the protected FlyThe BG AI route.","image/png,image/jpeg,image/webp","15 MB max","Your image is sent only after you choose a file, accept the notice and press Remove background. It is processed for this request and is not intended to be kept as a permanent FlyThe BG file.");
  break;
  case "/image-compressor":page=toolPage("image-compressor","02","Compress Image","Shrink an image locally in your browser without uploading the original.","image/png,image/jpeg,image/webp,image/gif","local processing","The original image stays in your browser during compression.");
  break;
  case "/video-compressor":page=toolPage("video-compressor","03","Compress Video","Create a smaller WebM locally in your browser with visible progress.","video/*","local processing","The original video stays in your browser during compression.");
  break;
  case "/features":page=features();break;
  case "/about":page=about();break;
  case "/faq":page=faq();break;
  case "/privacy":page=privacy();break;
  case "/terms":page=terms();break;
  case "/contact":page=contact();break;
  case "/support":page=support();break;
  default:page=home();
 }
 app.innerHTML=page;
 wireTools();
 wireSpaceExperience();
 wireFlyLanding();
 wireEditorial();
 loadStars();
 revealElements();
}

wireNavigation();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});
else render();
