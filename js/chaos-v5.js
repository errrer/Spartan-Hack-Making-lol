/* Spartan Chaos V5: offline/private sandbox developer panel.
   This file does not patch anti-cheat, progression, weapon tables, or network messages.
   All world-changing controls are disabled while a PeerJS session is active. */
(()=>{
'use strict';
if(window.__SPARTAN_CHAOS_V5__) return;
window.__SPARTAN_CHAOS_V5__=true;
const spawned=new Set();
let open=false,esp=false,raf=0;
const style=document.createElement('style');
style.textContent=`
#sc5{position:fixed;z-index:99999;top:6vh;right:3vw;width:min(420px,94vw);max-height:88vh;overflow:auto;background:rgba(9,13,22,.97);color:#eaf2ff;border:1px solid #4e83bd;border-radius:12px;box-shadow:0 18px 70px #000b;font:14px/1.45 system-ui,sans-serif;display:none}
#sc5 *{box-sizing:border-box}#sc5 header{padding:14px 16px;background:linear-gradient(110deg,#16395d,#101a2b);border-bottom:1px solid #34516f}
#sc5 h2{margin:0;font-size:19px;letter-spacing:1px}#sc5 small{color:#a9bfd8}#sc5 nav{display:flex;gap:6px;padding:9px}
#sc5 button{cursor:pointer;border:1px solid #365575;background:#17283b;color:#eaf2ff;padding:8px 10px;border-radius:7px}
#sc5 button:hover{background:#244668}#sc5 button.active{background:#24598b;border-color:#72baff}
#sc5 main{padding:10px 14px 16px}#sc5 .row{display:flex;gap:8px;flex-wrap:wrap;margin:9px 0}
#sc5 .stat{padding:9px;background:#111d2c;border:1px solid #263e57;border-radius:8px;margin:7px 0}
#sc5 .warn{color:#ffd27a}#sc5 .good{color:#8fe0ad}#sc5 .muted{color:#9aacc0}
#sc5 canvas{display:none}
#sc5 .close{float:right;background:#4a2028;border-color:#85424a}
`;
document.head.appendChild(style);
const panel=document.createElement('section');panel.id='sc5';
panel.innerHTML=`<header><button class="close" data-act="close">Close ×</button><h2>SPARTAN CHAOS <span style="color:#71baff">V5</span></h2><small>Offline sandbox developer tools · F8 to toggle</small></header>
<nav><button class="active" data-tab="home">Overview</button><button data-tab="bots">Bots</button><button data-tab="visuals">Visuals</button></nav>
<main id="sc5body"></main>`;
document.body.appendChild(panel);
const body=panel.querySelector('#sc5body');
const activeMatch=()=>typeof run!=='undefined'&&!!run;
const networked=()=>typeof netOn!=='undefined'&&!!netOn;
const blocked=()=>networked();
const safe=(v)=>String(v??'—');
function status(){
 const p=typeof P!=='undefined'?P:null,bs=typeof bots!=='undefined'?bots:[];
 return {p,bs};
}
function tab(name){
 panel.querySelectorAll('nav button').forEach(b=>b.classList.toggle('active',b.dataset.tab===name));
 if(name==='home'){
  const {p,bs}=status();
  body.innerHTML=`<div class="stat"><b>Session:</b> ${activeMatch()?'Match running':'Main menu'}<br><b>Network:</b> <span class="${blocked()?'warn':'good'}">${blocked()?'Connected, tools locked':'Offline'}</span><br><b>Mode:</b> ${safe(typeof mode!=='undefined'?mode:'—')}</div>
  <div class="stat"><b>Player inspector</b><br>Health: ${p?safe(p.hp)+' / '+safe(p.mhp):'—'}<br>Shield: ${p?safe(p.sh)+' / '+safe(p.msh):'—'}<br>Position: ${p?[p.x,p.y,p.z].map(n=>Number(n||0).toFixed(1)).join(', '):'—'}</div>
  <div class="stat"><b>Bot count:</b> ${bs.length}<br><span class="muted">V5 only manages bots it spawned itself.</span></div>
  <p class="muted">The panel never sends multiplayer commands or edits saved progression.</p>`;
 }else if(name==='bots'){
  const {bs}=status();
  body.innerHTML=`<p class="warn">${blocked()?'Multiplayer session detected. Bot controls are locked.':'Bot controls are available in offline matches only.'}</p>
  <div class="row"><button data-act="spawn1" ${blocked()?'disabled':''}>Spawn 1 bot</button><button data-act="spawn5" ${blocked()?'disabled':''}>Spawn 5 bots</button><button data-act="remove" ${blocked()?'disabled':''}>Remove V5 bots</button></div>
  <div class="stat"><b>Current bots (${bs.length})</b><div id="sc5bots"></div></div>`;
  const list=body.querySelector('#sc5bots');
  list.innerHTML=bs.slice(0,30).map((b,i)=>`<div>${i+1}. ${safe(b.nm||'Bot')} · HP ${safe(b.hp)} · ${b.al?'Alive':'Down'} · ${safe(b.team||'')}</div>`).join('')||'<span class="muted">No bots in the current match.</span>';
 }else{
  body.innerHTML=`<div class="stat"><b>Bot ESP</b><p class="muted">Draws local debug labels over bots in offline matches. It is not transmitted to other players.</p><button data-act="esp">${esp?'Disable':'Enable'} bot ESP</button></div>
  <div class="stat"><b>Debug display</b><p>Health labels, bot names and screen-space markers.</p><span class="muted">ESP automatically switches off if a network session starts.</span></div>`;
 }
}
function spawnBots(n){
 if(blocked())return alert('V5 bot tools are disabled during network matches.');
 if(!activeMatch()||typeof addBot!=='function')return alert('Start an offline match first.');
 for(let i=0;i<n;i++){const b=addBot();if(b)spawned.add(b)}
 tab('bots');
}
function removeSpawned(){
 if(blocked())return alert('V5 bot tools are disabled during network matches.');
 if(typeof S==='undefined'||typeof bots==='undefined')return;
 for(const b of spawned){const i=bots.indexOf(b);if(i!==-1)bots.splice(i,1);if(b.m)S.remove(b.m)}
 spawned.clear();tab('bots');
}
const canvas=document.createElement('canvas');canvas.id='sc5esp';
Object.assign(canvas.style,{position:'fixed',inset:'0',width:'100vw',height:'100vh',zIndex:'99990',pointerEvents:'none'});
document.body.appendChild(canvas);
function drawEsp(){
 const ctx=canvas.getContext('2d'),w=canvas.width=innerWidth,h=canvas.height=innerHeight;
 ctx.clearRect(0,0,w,h);
 if(!esp||!activeMatch()||blocked()||typeof C==='undefined'||typeof bots==='undefined'){if(blocked())esp=false;return}
 ctx.font='12px system-ui';ctx.textAlign='center';
 for(const b of bots){
  if(!b||!b.al||!b.m||b.m.visible===false)continue;
  const v=new THREE.Vector3(b.x||0,(b.y||0)+1.8,b.z||0).project(C);
  if(v.z< -1||v.z>1)continue;
  const x=(v.x*.5+.5)*w,y=(-v.y*.5+.5)*h;
  if(x<0||x>w||y<0||y>h)continue;
  ctx.strokeStyle=b.team==='A'?'#62b6ff':'#ff6a6a';ctx.lineWidth=2;
  ctx.strokeRect(x-13,y-28,26,48);
  ctx.fillStyle='#fff';ctx.fillText((b.nm||'BOT')+' · '+Math.max(0,Math.round(b.hp||0))+' HP',x,y-34);
 }
}
function loop(){drawEsp();raf=requestAnimationFrame(loop)}
loop();
function toggle(){open=!open;panel.style.display=open?'block':'none';if(open)tab('home')}
document.addEventListener('keydown',e=>{if(e.key==='F8'){e.preventDefault();toggle()}});
panel.addEventListener('click',e=>{
 const b=e.target.closest('button');if(!b)return;
 if(b.dataset.tab){tab(b.dataset.tab);return}
 const a=b.dataset.act;
 if(a==='close'){open=false;panel.style.display='none'}
 if(a==='spawn1')spawnBots(1);
 if(a==='spawn5')spawnBots(5);
 if(a==='remove')removeSpawned();
 if(a==='esp'){if(blocked()){esp=false;alert('ESP is offline-only.');}else esp=!esp;tab('visuals')}
});
window.addEventListener('beforeunload',()=>{cancelAnimationFrame(raf)});
console.info('[Spartan Chaos V5] Loaded. Press F8. Offline-only world tools are enabled.');
})();