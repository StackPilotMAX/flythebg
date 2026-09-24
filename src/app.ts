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
 return `<div class="notice">tiny legal brain activated 🧠 · By using FlyThe BG, you accept our <a href="/privacy">Privacy Policy</a> and <a href="/terms">Terms</a>.</div>
 <header class="nav"><a class="brand" href="/"><span class="brand-mark">F</span><span>FlyThe BG</span></a><nav><a href="/features">Tools</a><a href="/about">About</a><a href="/faq">FAQ</a><a href="/support">☕ Support</a></nav></header>${content}
 <footer class="footer"><div><strong>FlyThe BG</strong><span>make media less meh.</span><span class="star-count">★ <b data-stars>—</b> GitHub stars</span></div><nav><a href="/features">Get started</a><a href="/support">Support</a><a href="/privacy">Privacy</a><a href="/terms">Terms</a><a href="/faq">FAQ</a><a href="/contact">Contact</a></nav><small>© 2026 FlyThe BG · AGPL-3.0 · independent project · stackpilotfe@outlook.com</small></footer>`;
}

function aiPulse():string{return `<section class="section ai-section reveal"><div class="section-kicker"><span>AI INTERNET PULSE</span><span>21 SEP 2026</span></div><div class="ai-grid">
<article class="ai-card"><span>OPENAI</span><h3>GPT-6 Astra</h3><p>Hard end-to-end work, coding, research and computer use.</p><small>tip: specify the output format before the task.</small></article>
<article class="ai-card"><span>ANTHROPIC</span><h3>Claude Sonnet 5</h3><p>Agentic coding and knowledge-work energy.</p><small>tip: give constraints, then let it work inside them.</small></article>
<article class="ai-card"><span>GOOGLE</span><h3>Gemini 3.8 Flash</h3><p>Part of Google's September 2026 model wave.</p><small>tip: screenshots can beat a 500-word explanation.</small></article>
<article class="ai-card"><span>GROK</span><h3>Grok 4.7</h3><p>Long-running coding and knowledge-work focus.</p><small>tip: ask it to verify its own answer before shipping.</small></article>
</div><p class="micro-note">Model names and capabilities move fast. Snapshot, not endorsement.</p></section>`;}

function postWork(kind:string):void{
 const modal=document.createElement("div");modal.className="modal-backdrop";modal.innerHTML=`<div class="celebrate" role="dialog" aria-modal="true"><button class="modal-x" aria-label="Close">×</button><div class="confetti">✦ ✨ ✦</div><p class="eyebrow">WORK COMPLETE</p><h2>okay pookie, we cooked. 🫡</h2><p>Your ${kind} is ready. If FlyThe BG saved you time, two tiny ways to keep it alive:</p><div class="modal-actions"><a class="button primary" href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer">⭐ Give it a GitHub star</a><a class="button coffee" href="/support">☕ Support the project</a><button class="button ghost dismiss">Sorry, maybe later</button></div><small>No pressure. FlyThe BG never assumes or records that a Buy Me a Coffee payment happened.</small></div>`;
 document.body.appendChild(modal);modal.querySelector(".modal-x")?.addEventListener("click",()=>modal.remove());modal.querySelector(".dismiss")?.addEventListener("click",()=>modal.remove());modal.addEventListener("click",e=>{if(e.target===modal)modal.remove()});
}

function toolPage(id:ToolId,num:string,title:string,description:string,accept:string,note:string,privacy:string):string{
 const consent=id==="remove-bg"?`<label class="consent"><input type="checkbox" data-consent="remove-bg"><span>I understand that my selected image will be sent to the FlyThe BG background-removal processor running on Hugging Face Spaces.</span></label>`:"";
 return shell(`<main class="tool-page reveal"><div class="tool-intro"><p class="eyebrow">FLYTHE BG · ${num}</p><h1>${title}</h1><p>${description}</p><div class="pills"><span>${id==="remove-bg"?"PROTECTED AI":"LOCAL-FIRST"}</span><span>${note}</span></div></div><section class="tool-workspace"><div class="workspace-head"><span>${id==="remove-bg"?"PROTECTED UPLOAD":"YOUR DEVICE, YOUR FILE"}</span><span data-progress-label="${id}">0%</span></div>${consent}<label class="big-dropzone" data-dropzone="${id}"><input data-input="${id}" type="file" accept="${accept}"><span class="upload-arrow">↑</span><strong>Drop it here, pookie</strong><small>or tap to browse your device</small><em>${id==="remove-bg"?"PNG · JPG · WEBP · max 15 MB":"nothing leaves your browser"}</em></label><p class="selected-file" data-file-name="${id}">No file selected.</p><button class="button primary process-button" data-process="${id}" type="button" disabled>${id==="remove-bg"?"Remove background →":"Compress file →"}</button><div class="progress-track"><div class="progress-bar" data-progress="${id}"></div></div><p class="status" role="status" aria-live="polite" data-status="${id}">Ready when you are. No fake loading screens, promise.</p></section><p class="processing-note">${privacy}</p></main>`,`${title} — FlyThe BG`);
}

function home():string{
 const portalStates=[
  {id:"remove-bg",name:"Remove Background",number:"[01]",video:"https://d2ol7oe51mr4n9d.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/3c83091e-4046-4fd6-adbb-2edb728be79a.mp4",facts:[["PROCESSING:","AI background removal through the FlyThe BG Cloudflare Worker."],["MODEL:","rembg running inside Hugging Face Spaces."],["STARTUP:","Cold starts can take around 20–25 seconds."],["UPLOAD:","Only after you choose the file, accept the notice and start processing."]]},
  {id:"image-compressor",name:"Image Compressor",number:"[02]",video:"https://d2ol7oe51mr4n9d.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/fc3ded42-e845-41f3-a830-5cab512d79cd.mp4",facts:[["PROCESSING:","Image compression runs locally in your browser."],["UPLOAD:","Your original image does not need to leave your device."],["OUTPUT:","JPEG output with visible compression progress."],["ACCOUNT:","No FlyThe BG account required."]]},
  {id:"video-compressor",name:"Video Compressor",number:"[03]",video:"https://d2ol7oe51mr4n9d.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/b30f64d9-1637-477a-83df-d0fc6461a422.mp4",facts:[["PROCESSING:","Video compression runs locally in your browser."],["UPLOAD:","Your original video stays on your device."],["OUTPUT:","WebM output with live progress."],["ACCOUNT:","No FlyThe BG account required."]]}
 ];
 return shell(`<main class="space-experience" data-tool="remove-bg">
  <div class="space-backgrounds" aria-hidden="true">
   <video id="space-remove-bg" class="space-background is-visible" muted playsinline preload="auto" src="${portalStates[0].video}"></video>
   <video id="space-image-compressor" class="space-background" muted playsinline preload="auto" src="${portalStates[1].video}"></video>
   <video id="space-video-compressor" class="space-background" muted playsinline preload="auto" src="${portalStates[2].video}"></video>
  </div>
  <div class="space-shade" aria-hidden="true"></div>
  <header class="space-header">
   <a class="space-brand" href="/" aria-label="FlyThe BG home"><span class="space-brand-mark">F</span><span>FlyThe BG</span></a>
   <nav class="space-nav" aria-label="Primary navigation"><a class="active" href="/features">Get Started</a><a href="/about">About</a><a href="/faq">FAQ</a></nav>
   <a class="space-menu" href="/support">Support ↗</a>
  </header>
  <aside class="space-tool-list" aria-label="FlyThe BG tools">
   ${portalStates.map((item,i)=>`<button class="space-tool-item ${i===0?"active":""}" data-space-tool="${item.id}" type="button"><span class="space-dot"></span>${item.name}</button>`).join("")}
  </aside>
  <section class="space-portal-wrap" aria-label="Next FlyThe BG tool">
   <div class="space-portal-heading"><span>Next:</span><span><b id="space-next-number">[02]</b> <strong id="space-next-name">Image Compressor</strong></span></div>
   <button class="space-portal" id="space-portal" type="button" aria-label="Open Image Compressor"><span class="space-portal-ring"></span><span class="space-portal-core">ENTER</span></button>
  </section>
  <section class="space-content" aria-live="polite">
   <p class="space-kicker">FLYTHE BG · MEDIA TOOLS</p>
   <h1 id="space-title">REMOVE<br>BACKGROUND</h1>
   <dl id="space-facts">${portalStates[0].facts.map(([k,v])=>`<div><dt>${k}</dt><dd>${v}</dd></div>`).join("")}</dl>
   <div class="space-actions"><a class="space-primary" id="space-open" href="/remove-bg">Open tool →</a><a class="space-secondary" href="/features">View all tools</a></div>
  </section>
  <div class="space-preloader" id="space-preloader" aria-hidden="true"><span>FLYTHE BG</span><strong id="space-preloader-value">0</strong><small>%</small></div>
  <div class="space-cursor" id="space-cursor" aria-hidden="true"><i></i><b></b><span>Enter</span></div>
 </main>`,`FlyThe BG — Create. Clean. Fly.`);
}
function features():string{return shell(`<main class="page reveal"><div class="page-hero center-heading"><p class="eyebrow">GET STARTED</p><h1>Choose your weapon.<br>metaphorically. 😭</h1><p>Focused workspaces, visible progress and plain-English privacy boundaries.</p></div><div class="tool-links"><a href="/remove-bg"><span>01</span><div><b>Remove Background</b><small>Protected AI · PNG/JPG/WEBP · 15 MB</small></div><strong>Open ↗</strong></a><a href="/image-compressor"><span>02</span><div><b>Image Compressor</b><small>Runs locally in your browser</small></div><strong>Open ↗</strong></a><a href="/video-compressor"><span>03</span><div><b>Video Compressor</b><small>Local WebM with live progress</small></div><strong>Open ↗</strong></a></div><div class="tip-card"><b>pookie tip:</b> close giant tabs before compressing a giant video. Your RAM will send a thank-you note.</div></main>`,"Get Started — FlyThe BG");}

function support():string{return shell(`<main class="page support-page reveal"><div class="support-hero"><p class="eyebrow">OPTIONAL SUPPORT</p><h1>Keep the little<br>internet goblin alive. ☕</h1><p>If FlyThe BG helped, support is optional. You leave FlyThe BG and complete payment on Buy Me a Coffee's own page.</p><a class="button primary huge" href="${COFFEE_URL}" target="_blank" rel="noopener noreferrer">☕ Buy Me a Coffee ↗</a><small class="payment-note">Payment happens on Buy Me a Coffee. FlyThe BG does not process your card, verify a payment, or mark a donation as completed.</small></div><div class="support-grid"><article><span>01</span><h2>Help for free</h2><p>Give the GitHub repo a star. One click. No wallet required.</p><a class="button ghost" href="${GITHUB_URL}" target="_blank" rel="noopener noreferrer">⭐ Star on GitHub</a></article><article><span>02</span><h2>Send coffee</h2><p>Pick an amount and complete payment on Buy Me a Coffee.</p><a class="button coffee" href="${COFFEE_URL}" target="_blank" rel="noopener noreferrer">☕ Open Buy Me a Coffee</a></article><article><span>03</span><h2>Not today?</h2><p>Totally valid. No guilt, no fake conversion tracking.</p><button class="button ghost" onclick="this.textContent='respect 🫡'">Sorry, maybe later</button></article></div></main>`,"Support FlyThe BG — Buy Me a Coffee");}

function about():string{return shell(`<main class="page prose reveal"><p class="eyebrow">ABOUT FLYTHE BG</p><h1>Useful tools.<br>unhinged copy.</h1><p>FlyThe BG is an independent project focused on practical media utilities with data minimisation as a design goal. The UI is playful; the security boundary is not.</p><h2>How it works</h2><p>Compression runs locally in your browser. Background removal uses a protected server route so the private AI credential never reaches your device.</p><h2>Independent project</h2><p>FlyThe BG is currently not operated as a registered company or business entity. Project communication: <a href="mailto:stackpilotfe@outlook.com">stackpilotfe@outlook.com</a>.</p></main>`,"About — FlyThe BG");}

function faq():string{return shell(`<main class="page prose reveal"><p class="eyebrow">FAQ</p><h1>Questions,<br>without the yap.</h1><details open><summary>Why was nothing happening when I uploaded?</summary><p>The new workspaces show visible status, a progress bar where progress can be measured, drag-and-drop and a completion card. Video compression reports live percentage while frames are processed.</p></details><details><summary>Which tools upload my files?</summary><p>Background removal requires a protected network request. Image and video compression are designed to stay inside your browser.</p></details><details><summary>Does Buy Me a Coffee prove I paid?</summary><p>No. The support page only redirects to Buy Me a Coffee. FlyThe BG does not receive or infer payment confirmation.</p></details><details><summary>Are the AI names owned by FlyThe BG?</summary><p>No. OpenAI, GPT, ChatGPT, Anthropic, Claude, Google, Gemini, xAI, Grok, Hugging Face and other names or marks belong to their respective owners. FlyThe BG is independent and references are descriptive only.</p></details><details><summary>Can I use the tools without an account?</summary><p>Yes. No FlyThe BG account is required.</p></details></main>`,"FAQ — FlyThe BG");}

function privacy():string{return shell(`<main class="page prose legal reveal"><p class="eyebrow">PRIVACY</p><h1>Privacy Policy</h1><p class="muted">Effective: 21 September 2026 · India-focused notice</p><p>FlyThe BG is an independent project. This notice explains intended handling of digital personal data and is written with the Digital Personal Data Protection Act, 2023 and notified Digital Personal Data Protection Rules, 2025 in mind. It is not a legal opinion.</p><h2>Data and purpose</h2><p>Background-removal images are received only when deliberately submitted, for producing the requested result. Contact details are used to respond to messages, privacy requests and security reports. Normal technical connection data may be processed by infrastructure providers for delivery and security.</p><h2>Local compression</h2><p>Image and video compression are designed to run locally in your browser, so the original file does not need to be uploaded to FlyThe BG.</p><h2>Background removal</h2><p>Submitted images pass through a same-origin Cloudflare Worker and are forwarded to the FlyThe BG background-removal processor running on Hugging Face Spaces. The Hugging Face credential remains server-side and is never sent to your browser. FlyThe BG does not provide an image gallery, account storage, storage bucket or persistent image library for background-removal uploads. The external Hugging Face/Gradio runtime may create temporary processing files while the request is running; FlyThe BG does not treat those temporary files as a user storage service.</p><h2>Consent and withdrawal</h2><p>The background-removal page displays a purpose-specific notice and requires affirmative confirmation before upload. FlyThe BG does not intentionally retain submitted images after the requested processing flow. Temporary files can exist inside the Hugging Face/Gradio processing runtime while the model works; retention and cleanup at that external processor depend on its runtime configuration. FlyThe BG does not promise zero transient processor storage unless that configuration has been verified. You can stop future processing by not submitting an image.</p><h2>Third-party brands</h2><p>Names, logos, trademarks and product names referenced on FlyThe BG belong to their respective owners. References are descriptive only and do not imply sponsorship, endorsement, partnership or ownership by FlyThe BG.</p><h2>Rights and complaints</h2><p>Subject to applicable law, you may have rights concerning access, correction, erasure, consent withdrawal and grievances. Contact <a href="mailto:stackpilotfe@outlook.com">stackpilotfe@outlook.com</a>.</p></main>`,"Privacy Policy — FlyThe BG");}

function terms():string{return shell(`<main class="page prose legal reveal"><p class="eyebrow">TERMS</p><h1>Terms of Service</h1><p class="muted">Effective: 21 September 2026</p><p>FlyThe BG is an independent project, not currently operated as a registered company or business entity.</p><h2>Use</h2><p>Use the tools lawfully and only with content you are permitted to process.</p><h2>Your content</h2><p>You retain your rights in files you submit and are responsible for permissions needed to process them.</p><h2>Third-party names and marks</h2><p>OpenAI, GPT, ChatGPT, Anthropic, Claude, Google, Gemini, xAI, Grok, Hugging Face, Buy Me a Coffee, GitHub and other names or marks referenced by the project belong to their respective owners. FlyThe BG is independent; references do not create an affiliation, endorsement or partnership.</p><h2>Support payments</h2><p>Support links redirect you to Buy Me a Coffee. FlyThe BG does not process, confirm, reconcile or represent that a payment was completed. Any payment relationship is between you and the external provider.</p><h2>Availability</h2><p>The project may change, be rate-limited or become unavailable as infrastructure evolves.</p><h2>Contact</h2><p><a href="mailto:stackpilotfe@outlook.com">stackpilotfe@outlook.com</a></p></main>`,"Terms — FlyThe BG");}

function contact():string{return shell(`<main class="page prose reveal"><p class="eyebrow">CONTACT</p><h1>Talk to the project.</h1><p>For privacy requests, security reports, feedback or project communication:</p><a class="contact-card" href="mailto:stackpilotfe@outlook.com"><span>Email</span><strong>stackpilotfe@outlook.com</strong></a></main>`,"Contact — FlyThe BG");}

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
 loadStars();
 revealElements();
}

wireNavigation();
if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",render,{once:true});
else render();
