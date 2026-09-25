// FlyThe BG pill navigation — framework-free adaptation of the supplied React design.
(() => {
 const items=[["Home","/"],["Tools","/features"],["Remove BG","/remove-bg"],["Image Compressor","/image-compressor"],["Video Compressor","/video-compressor"],["About","/about"],["Support","/support"]];
 let busy=false;
 function mount(){
  const old=document.querySelector("header.nav");
  if(!old||old.classList.contains("ft-pill-nav"))return;
  const current=location.pathname.replace(/\/$/,"")||"/";
  const links=items.map(([label,href],i)=>'<li><a class="ft-pill '+(current===href?"is-active":"")+'" href="'+href+'" style="--i:'+i+'" aria-label="'+label+'"><span class="ft-pill-rise" aria-hidden="true"></span><span class="ft-pill-label"><span>'+label+'</span><span aria-hidden="true">'+label+'</span></span></a></li>').join("");
  old.outerHTML='<header class="ft-pill-nav"><a class="ft-pill-logo" href="/" aria-label="FlyThe BG home"><span>F</span></a><nav class="ft-pill-desktop" aria-label="Main navigation"><ul>'+links+'</ul></nav><button class="ft-pill-toggle" type="button" aria-expanded="false" aria-controls="ft-pill-mobile" aria-label="Open navigation"><span></span><span></span><span></span></button><nav class="ft-pill-mobile" id="ft-pill-mobile" aria-label="Mobile navigation" inert><ul>'+items.map(([label,href])=>'<li><a href="'+href+'" '+(current===href?'aria-current="page"':"")+'>'+label+'</a></li>').join("")+'</ul><div class="ft-pill-mobile-foot"><a href="/faq">FAQ</a><a href="/contact">Contact</a></div></nav></header>';
  const nav=document.querySelector(".ft-pill-nav"),button=nav.querySelector(".ft-pill-toggle"),mobile=nav.querySelector(".ft-pill-mobile");
  const close=()=>{button.setAttribute("aria-expanded","false");button.setAttribute("aria-label","Open navigation");mobile.inert=true;nav.classList.remove("ft-pill-open");};
  button.addEventListener("click",()=>{const open=button.getAttribute("aria-expanded")!=="true";button.setAttribute("aria-expanded",String(open));button.setAttribute("aria-label",open?"Close navigation":"Open navigation");mobile.inert=!open;nav.classList.toggle("ft-pill-open",open);});
  document.addEventListener("keydown",e=>{if(e.key==="Escape")close();},{signal:navSignal(nav)});
  nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>close()));
  document.addEventListener("click",e=>{if(!nav.contains(e.target))close();},{signal:navSignal(nav)});
  nav.querySelectorAll(".ft-pill").forEach(pill=>{
   const circle=pill.querySelector(".ft-pill-rise");
   function size(){const {width:w,height:h}=pill.getBoundingClientRect();const r=((w*w)/4+h*h)/(2*h);circle.style.width=Math.ceil(2*r+2)+"px";circle.style.height=Math.ceil(2*r+2)+"px";}
   size();addEventListener("resize",size,{passive:true,signal:navSignal(nav)});
  });
 }
 const controllers=new WeakMap();
 function navSignal(nav){let c=controllers.get(nav);if(!c){c=new AbortController();controllers.set(nav,c)}return c.signal;}
 const observer=new MutationObserver(()=>{if(busy)return;busy=true;queueMicrotask(()=>{busy=false;const current=document.querySelector(".ft-pill-nav");if(current&&!current.isConnected)controllers.get(current)?.abort();mount();});});
 observer.observe(document.documentElement,{childList:true,subtree:true});
 if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",mount,{once:true});else mount();
})();
