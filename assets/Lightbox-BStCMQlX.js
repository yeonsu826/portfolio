import{c as b}from"./createLucideIcon-CshZpKmY.js";import{a as u,j as o}from"./index-DiG76GTn.js";import{X as f}from"./x-BbZTlizc.js";/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const p=[["path",{d:"M20 6 9 17l-5-5",key:"1gmf2c"}]],j=b("check",p);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const w=[["path",{d:"m15 18-6-6 6-6",key:"1wnfg3"}]],m=b("chevron-left",w);/**
 * @license lucide-react v0.487.0 - ISC
 *
 * This source code is licensed under the ISC license.
 * See the LICENSE file in the root directory of this source tree.
 */const k=[["path",{d:"m9 18 6-6-6-6",key:"mthhwq"}]],v=b("chevron-right",k);function N({images:e,index:t,onClose:s,onChange:n,caption:c,loop:l=!1}){const h=e.length-1,a=l||t>0,d=l||t<h;return u.useEffect(()=>{const r=i=>{i.key==="Escape"&&s(),i.key==="ArrowLeft"&&a&&n(l?(t-1+e.length)%e.length:t-1),i.key==="ArrowRight"&&d&&n(l?(t+1)%e.length:t+1)};return window.addEventListener("keydown",r),document.body.style.overflow="hidden",()=>{window.removeEventListener("keydown",r),document.body.style.overflow=""}},[d,a,e.length,t,l,n,s]),o.jsx("div",{className:"fixed inset-0 bg-black/95 backdrop-blur-xl flex items-center justify-center p-4 md:p-8",style:{zIndex:99999},onClick:s,children:o.jsxs("div",{className:"relative w-full max-w-[95vw] h-full flex items-center justify-center",onClick:r=>r.stopPropagation(),children:[o.jsx("button",{type:"button",onClick:s,className:"absolute top-4 right-4 z-50 rounded-full bg-white/10 border border-white/20 p-3 text-white hover:bg-white/20 backdrop-blur-md transition-all cursor-pointer",children:o.jsx(f,{size:24})}),o.jsx("button",{type:"button",disabled:!a,onClick:r=>{r.stopPropagation(),n(l?(t-1+e.length)%e.length:t-1)},className:"absolute left-4 md:left-8 z-50 rounded-full bg-black/50 border border-white/20 p-4 text-white hover:bg-black/80 backdrop-blur-md transition-all disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer",children:o.jsx(m,{size:32})}),o.jsx("img",{src:e[t],alt:c??"Enlarged view",onClick:r=>{r.stopPropagation(),s()},className:"max-w-full max-h-[90vh] object-contain drop-shadow-2xl select-none cursor-zoom-out relative z-40"}),o.jsx("button",{type:"button",disabled:!d,onClick:r=>{r.stopPropagation(),n(l?(t+1)%e.length:t+1)},className:"absolute right-4 md:right-8 z-50 rounded-full bg-black/50 border border-white/20 p-4 text-white hover:bg-black/80 backdrop-blur-md transition-all disabled:opacity-0 disabled:cursor-not-allowed cursor-pointer",children:o.jsx(v,{size:32})}),o.jsxs("div",{className:"absolute bottom-6 left-1/2 -translate-x-1/2 z-50 bg-black/50 backdrop-blur-md border border-white/10 px-4 py-2 rounded-full font-['JetBrains_Mono'] text-white/80 text-sm pointer-events-none",children:[c?`${c} · `:"",t+1," / ",e.length]})]})})}export{j as C,N as L,m as a,v as b};
