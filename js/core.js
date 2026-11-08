/* ######## core.js ######## */
/* ===================== data.js ===================== */
const $=q=>document.querySelector(q),V=(x,y,z)=>new THREE.Vector3(x,y,z),cl=(v,a,b)=>Math.max(a,Math.min(b,v));
/* ---------- data ---------- */
const W={AR:{n:'KN-115',d:30,r:.075,m:32,sp:.012,rc:1,pel:1,au:1,rl:2,len:.55,col:0x3a4a52},
SMG:{n:'SMG',d:22,r:.055,m:40,sp:.022,rc:.7,pel:1,au:1,rl:1.8,len:.4,col:0x5a4a40},
BR:{n:'Battle Rifle',d:36,r:.24,m:12,sp:.004,rc:2.5,pel:1,au:0,rl:2.2,len:.65,col:0x2f4a3a},
SG:{n:'Shotgun',d:22,r:.62,m:8,sp:.045,rc:5,pel:10,au:0,rl:2.4,len:.5,col:0x555a62},
MG:{n:'Magnum',d:36,r:.26,m:8,sp:.005,rc:3,pel:1,au:0,rl:1.5,len:.5,col:0x1b2027},
MP:{n:'Machine Pistol',d:24,r:.07,m:24,sp:.03,rc:.6,pel:1,au:1,rl:1.4,len:.25,col:0x3a3a4a}};
const PRI=['AR','SMG','BR','SG'],SEC=['MG','MP'];
const A={'Extended Mag':{m:1.5,t:'+50% magazine'},'Compensator':{rc:.55,t:'Less kick'},'Laser Sight':{sp:.5,t:'Tighter spread'},'Long Barrel':{d:1.12,t:'+12% damage'},'Fast Hands':{rl:.65,t:'Faster reload'},'Hollow Point':{d:1.18,rc:1.25,t:'+18% damage, more kick'},'Quickdraw Grip':{ad:1.9,t:'Aim down sights almost twice as fast'}};
const K={'Marathon':'Move 15% faster','Overshield':'+50 shield','Scavenger':'Kills refill ammo','Spring Legs':'Jump higher','Second Wind':'Shield recharges much faster','Hardline':'Killstreaks need 1 fewer kill','Run & Gun':'Shoot while sprinting','Quick Fix':'Kills instantly restore health and shield'};
const GR={'Frag':{fuse:1.8,R:7,d:110,imp:0,t:'Bounces, 1.8s fuse'},'Impact':{fuse:4,R:5,d:85,imp:1,t:'Explodes on contact'},'Semtex':{fuse:2.6,R:6,d:105,imp:0,stk:1,t:'Sticks to walls, floors and enemies, 2.6s fuse'}};
const MODES={'Slayer':'First to 20 kills. Bots respawn.','One in the Chamber':'A pistol with one bullet and three lives. Every hit kills and every kill earns a bullet, melee kills too. Last one standing wins.','Survival':'One life. Endless waves.','Time Attack':'Most kills in 90 seconds.','Team Deathmatch':'5v5 with bot teammates. First team to 50 kills wins.','Capture the Flag':'5v5 with bot teams. Steal the red flag, bring it to your base. First to 3 captures.','Kill Confirmed':'5v5 with bot teams, or with your friends in a private match. Every fallen fighter drops a tag: grab enemy tags to bank the kill, grab your own side\'s tags to deny theirs. First team to 100 confirms.','Hardpoint':'Hold the rotating zone to score. First team to 250 wins.','Domination':'5v5 with bot teams. Hold the three zones: every owned zone earns points. First team to 350 wins.','Zombies':'Survive endless rounds of the undead. Earn points, open doors, use the mystery box, Pack-a-Punch and perks. Solo.'};
/* open maps have no tall walls: the play area is enclosed by one continuous fence (with an invisible tall collision wall above it) */
function barrierLine(a,x0,z0,x1,z1,seed){const hz=Math.abs(x1-x0)>=Math.abs(z1-z0),L=hz?Math.abs(x1-x0):Math.abs(z1-z0),cx=(x0+x1)/2,cz=(z0+z1)/2;
 /* one continuous painted fence with a top rail, plus an invisible tall collision wall above it so nobody can mantle, wall jump or squeeze over */
 a.push([cx,cz,hz?L:.3,hz?.3:L,2.3,0,0xd9d3c0,'plank']);a.push([cx,cz,hz?L:.5,hz?.5:L,2.55,2.3,0x8a7d68,'plank']);a.push([cx,cz,hz?L:.5,hz?.5:L,14,0,0,'n'])}
const MAPS={
'Blockfort':{d:'Walled fort with a raised centre',H:28,sky:0x86b6d8,gr:0x55654f,bc:0x8d99a3,b(){const a=[[-4.5,-7,5,1.2,3],[4.5,-7,5,1.2,3],[-4.5,7,5,1.2,3],[4.5,7,5,1.2,3],[-7,-4.5,1.2,5,3],[-7,4.5,1.2,5,3],[7,-4.5,1.2,5,3],[7,4.5,1.2,5,3],[0,0,5,5,1]];for(const s of[-1,1]){a.push([s*18,18,3,3,1.5],[s*18,-18,3,3,1.5],[s*21,0,2,7,1],[0,s*21,7,2,1]);}return a}},
'Pillars':{d:'Open grid of tall cover',H:34,sky:0xc9a27a,gr:0x6b5a48,bc:0xb09878,b(){const a=[];for(let i=-2;i<=2;i++)for(let j=-2;j<=2;j++){if(i||j)a.push([i*11,j*11,2.2,2.2,5]);if(i<2&&j<2)a.push([i*11+5.5,j*11+5.5,3,1,1]);}return a}},
'Canyon':{d:'Long walls with stepped ledges',H:36,sky:0x6d8fb0,gr:0x4a5a52,bc:0x7a8590,b(){const a=[[-9,-24,2,12,6],[-9,0,2,16,6],[-9,25,2,12,6],[9,-25,2,10,6],[9,-3,2,14,6],[9,22,2,16,6]];for(const s of[-1,1])a.push([s*20,0,3,6,1],[s*23,0,3,6,2],[s*26,0,3,6,3],[s*22,-18,4,4,1.2],[s*22,18,4,4,1.2]);return a}},
'Suburbia':{d:'American suburb: houses, driveways, picket fences, pools and parked cars',H:58,open:1,sky:0x9fd0f0,gr:0x6e9e4c,bc:0xcfc8b8,fb:[[-27,0],[27,0]],zn:[[-27,0],[0,0],[27,0]],
 deco(){const a=[],B=(x,z,w,d,h,y0,c)=>a.push([x,z,w,d,h,y0||0,c]);let s=7;const r=()=>(s=(s*16807)%2147483647)/2147483647,pal=[0xe8e2d0,0x9fb7c9,0xd9b9a0,0xb9c9a0],rf=[0x6b4a3a,0x4a4f58,0x7a3b32,0x58606a];
  for(let k=0;k<44;k++){const side=k%4,t=-96+((k/4)|0)*17.5+r()*5,d=68+r()*26,x=side<2?t:(side==2?-d:d),z=side<2?(side==0?-d:d):t,i=(r()*4)|0,w=8+r()*4,dd=7+r()*3,h=3.6+r()*1.2;B(x,z,w,dd,h,0,pal[i]);B(x,z,w+1,dd+1,h+.8,h,rf[i])}
  for(let k=0;k<110;k++){const ang=r()*6.283,d=62+r()*60,x=Math.cos(ang)*d,z=Math.sin(ang)*d;if(Math.abs(x)<60&&Math.abs(z)<60)continue;B(x,z,.5,.5,3,0,0x6b4a2b);B(x,z,3.4,3.4,6,3,0x4f8a3a)}
  for(let k=0;k<14;k++){const t=k/14*6.283;B(Math.cos(t)*150,Math.sin(t)*150,60,60,14+r()*10,0,0x5a7a4a)}return a},
 b(){
 const a=[],vv=(MAPS.Suburbia._v=MAPS.Suburbia._v||[]),B=(x,z,w,d,h,y0,c,k)=>a.push([x,z,w,d,h,y0||0,c,k]),V=(x,z,w,d,h,y0,c,s,t)=>vv.push([x,z,w,d,h,y0||0,c,s,t]),pal=[0xe8e2d0,0x9fb7c9,0xd9b9a0,0xb9c9a0],rf=[0x6b4a3a,0x4a4f58,0x7a3b32,0x58606a],wh=0xece8dc,cc=[0xb23a2e,0x2f5f9e,0xd9d4c4,0x3a7a4a];
 /* two crossing streets with sidewalks (flat, walk right over them) */
 B(0,0,116,6.4,.05,0,0x3a3d42);B(0,0,6.4,116,.05,0,0x3a3d42);for(const s of[-1,1]){B(0,s*4.1,116,1.4,.1,0,0xbfbfb6);B(s*4.1,0,1.4,116,.1,0,0xbfbfb6);B(0,s*40,116,6.4,.05,0,0x3a3d42);B(s*40,0,6.4,116,.05,0,0x3a3d42);for(const e of[-1,1]){B(0,s*40+e*4.1,116,1.4,.1,0,0xbfbfb6);B(s*40+e*4.1,0,1.4,116,.1,0,0xbfbfb6)}}
 const car=(x,z,az,len,c,van)=>{const w=1.9;if(van){B(x,z,az?2.3:len,az?len:2.3,2.3,0,c,'metal');V(x,z,az?2.35:len+.05,az?len+.05:2.35,1.9,1.2,0x27333c,'g')}else{B(x,z,az?w:len,az?len:w,1,0,c,'metal');B(x,z,az?w*.9:len*.5,az?len*.5:w*.9,1.65,1,0x27333c,'glass')}
  for(const sx of[-1,1]){for(const sy of[-1,1])V(az?x+sx*(w/2+.02):x+sy*len*.3,az?z+sy*len*.3:z+sx*(w/2+.02),az?.14:.6,az?.6:.14,.5,0,0x111111,'b','metal');V(az?x+sx*.6:x+len/2,az?z+len/2:z+sx*.6,az?.3:.06,az?.06:.3,.7,.45,0xfff2b0,'e');V(az?x+sx*.6:x-len/2,az?z-len/2:z+sx*.6,az?.3:.06,az?.06:.3,.7,.45,0xc02020,'e')}},
  tree=(x,z)=>{B(x,z,.5,.5,3,0,0x6b4a2b,'plank');a.push([x,z,3.6,3.6,6.2,3,0,'n']);V(x,z,3.8,3.8,6.2,2.7,0x3f7d34,'s');V(x+1,z+.5,2.8,2.8,5.4,2.5,0x4a8a3a,'s');V(x-.9,z-.6,2.6,2.6,5.3,2.6,0x3a7230,'s')},
  house=(x,z,w,d,i,fx,fz)=>{const nx=fx||0,nz=fz||0,tx=nz?1:0,tz=nx?1:0,px=x+nx*w/2,pz=z+nz*d/2,L=tx?w:d;
   B(x,z,w,d,3.8,0,pal[i%4],'stucco');B(x,z,w+1,d+1,4.5,3.8,rf[i%4],'shingle');V(x+w*.28,z-d*.2,.9,.9,5.9,3.9,0x8a4a3a,'b','brick');
   B(px+nx*.06,pz+nz*.06,nz?1.2:.12,nz?.12:1.2,2.4,0,0x4a2f20,'plank');B(px+nx*.7,pz+nz*.7,nz?2.2:1.4,nz?1.4:2.2,.35,0,0xaaa8a0);V(px+nx*.15,pz+nz*.15,nz?.3:.1,nz?.1:.3,2.8,2.6,0xffe9a0,'e');
   for(const s of[-1,1]){const o=s*L*.28,wx=px+tx*o+nx*.04,wz=pz+tz*o+nz*.04;B(wx,wz,nz?1.8:.08,nz?.08:1.8,2.7,1.2,0x2a3a4a,'glass');V(wx-nx*.03,wz-nz*.03,nz?2.1:.05,nz?.05:2.1,2.95,1.05,0xf2efe6,'b','plank');V(px+tx*(o+s*1.3)+nx*.05,pz+tz*(o+s*1.3)+nz*.05,nz?.4:.06,nz?.06:.4,2.9,1.1,0x3a5a3a,'b','plank');V(px+tx*o*1.15+nx*1.35,pz+tz*o*1.15+nz*1.35,1.3,1.3,1.3,.1,0x3a6a30,'s')}};
 for(const sx of[-1,1])for(const sz of[-1,1]){const q=(sx>0?1:0)+(sz>0?2:0);
  house(sx*16,sz*12,9,8,q,0,-sz);house(sx*27,sz*12,9,8,q+1,0,-sz);house(sx*16,sz*27,9,8,q+2,-sx,0);
  B(sx*9.3,sz*12.5,4.4,6,2.6,0,pal[q%4]);B(sx*9.3,sz*12.5,4.8,6.4,2.9,2.6,rf[q%4]);B(sx*9.3,sz*9.45,3.4,.12,2.2,0,0xd5d5d0);B(sx*9.3,sz*7.2,3.6,4.8,.06,0,0x8a8a86);car(sx*9.3,sz*7.3,1,4.4,cc[q%4]);
  B(sx*8.5,sz*19.5,7,.2,1.2,0,wh);B(sx*27.5,sz*19.5,13,.2,1.2,0,wh);B(sx*21.5,sz*12,.2,8,1.2,0,wh);B(sx*27,sz*5.4,9.5,.15,1,0,wh);
  tree(sx*19.5,sz*6.4);tree(sx*6.6,sz*21);tree(sx*6.6,sz*31);tree(sx*31.5,sz*6.4);
  B(sx*27,sz*27,8.4,6.4,.06,0,0xb59a70);B(sx*27,sz*27,7,5,.1,0,0x3aa0d0);B(sx*32,sz*32,3,3,2.6,0,0x9a4a3a);B(sx*32,sz*32,3.4,3.4,2.9,2.6,0x58606a)}
 /* outer ring: a street of houses on every side, corner parks, and the car + bollard perimeter */
 for(const s of[-1,1])for(const k of[-36,-24,-12,12,24,36]){house(k,s*49.5,9,8,k/12+s+6,0,-s);house(s*49.5,k,9,8,k/12+s+7,-s,0);B(k,s*43.2,3.2,.15,1,0,wh);B(s*43.2,k,.15,3.2,1,0,wh)}
 for(const sx of[-1,1])for(const sz of[-1,1]){tree(sx*50,sz*50);tree(sx*54.5,sz*45);tree(sx*45,sz*54.5);B(sx*50,sz*46,2.2,.6,.5,0,0x7a5a3a)}
 car(-22,38,0,4.4,0xb23a2e);car(22,-38,0,4.4,0x2f5f9e);car(38,-22,1,4.4,0xd9d4c4);car(-38,22,1,4.4,0x3a7a4a);
 /* street furniture: centre lines, crosswalks, lamp posts, stop signs, hydrants */
 for(let k=-54;k<=54;k+=7)if(Math.abs(k)>7){V(k,0,3,.16,.07,0,0xe8c020,'b','asphalt');V(0,k,.16,3,.07,0,0xe8c020,'b','asphalt');for(const s of[-1,1]){V(k,s*40,3,.16,.07,0,0xe8e8e0,'b','asphalt');V(s*40,k,.16,3,.07,0,0xe8e8e0,'b','asphalt')}}
 for(const sx of[-1,1])for(const sz of[-1,1])for(let k=0;k<4;k++){V(sx*7.2,sz*(.4+k*.8),.5,.55,.07,0,0xf0f0e8,'b','asphalt');V(sz*(.4+k*.8),sx*7.2,.55,.5,.07,0,0xf0f0e8,'b','asphalt');V(sx*5.6,sz*5.6,.12,.12,2.6,0,0x777777,'c');V(sx*5.6,sz*5.5,.7,.06,3.2,2.5,0xc02020,'b','metal')}
 for(const k of[-48,-30,-12,12,30,48])for(const s of[-1,1]){V(k,s*5.6,.16,.16,5,0,0x2a2a2e,'c');V(k,s*5.1,.5,.9,5.14,5,0xfff0c0,'e');V(s*5.6,k,.16,.16,5,0,0x2a2a2e,'c');V(s*5.1,k,.9,.5,5.14,5,0xfff0c0,'e')}
 for(const[x,z]of[[14,5.7],[-14,-5.7],[5.7,-14],[-5.7,14],[38,5.7],[-38,-5.7]])V(x,z,.4,.4,.8,0,0xc03030,'c');
 barrierLine(a,-57.6,-56.6,57.6,-56.6,0);barrierLine(a,-57.6,56.6,57.6,56.6,1);barrierLine(a,-56.6,-57.6,-56.6,57.6,2);barrierLine(a,56.6,-57.6,56.6,57.6,0);
 car(-13,2,0,4.4,0xb23a2e);car(13,-2,0,4.4,0x2f5f9e);car(2,-14,1,4.4,0xd9b13b);car(-2,14,1,4.4,0x3a7a4a);car(-18,-2,0,4.4,0x8a8d93);car(18,2,0,4.6,0xd9d4c4,1);
 return a}}};
/* random picks are rolled when you press Deploy */
/* the zombie map is only for Zombies, and Zombies only plays on it */
function restoreSel(){if(selKeep){Object.assign(sel,selKeep);selKeep=null}fixZM()}
function fixZM(){const z=Object.keys(MAPS).find(k=>MAPS[k].zm);if(sel.mode=='Zombies'){if(!(MAPS[sel.map]&&MAPS[sel.map].zm)&&z)sel.map=(MAPS[sel.zmap]&&MAPS[sel.zmap].zm)?sel.zmap:z;sel.rp=0}else if(MAPS[sel.map]&&MAPS[sel.map].zm)sel.map='Blockfort'}
function rollRandom(){const pick=o=>{const k=Object.keys(o).filter(x=>x!='Zombies');return k[Math.random()*k.length|0]};if(sel.rm)sel.mode=pick(MODES);if(sel.rp){const ks=Object.keys(MAPS).filter(k=>!MAPS[k].zm);sel.map=ks[Math.random()*ks.length|0]}}
/* ---------- state ---------- */
let L={p:'AR',s:'MG',pa:['Extended Mag'],sa:[],g:'Frag',pk:['Scavenger']},sel={mode:'Slayer',map:'Blockfort'};
const PRE={'Balanced':{p:'AR',s:'MG',pa:['Extended Mag'],sa:[],g:'Frag',pk:['Scavenger','Marathon']},'Rusher':{p:'SMG',s:'MP',pa:['Compensator','Fast Hands','Extended Mag'],sa:['Fast Hands'],g:'Impact',pk:['Marathon','Spring Legs','Overshield']},'Sharpshooter':{p:'BR',s:'MG',pa:['Long Barrel','Laser Sight','Compensator'],sa:['Hollow Point'],g:'Frag',pk:['Overshield','Scavenger']},'Brawler':{p:'SG',s:'MP',pa:['Extended Mag','Fast Hands','Laser Sight'],sa:[],g:'Impact',pk:['Overshield','Marathon','Scavenger']}},PD={Balanced:'Good at everything',Rusher:'Fast and fires quickly',Sharpshooter:'Accurate, hits hard',Brawler:'Shotgun for close fights'};
const LIM={pa:3,sa:2,pk:3};
const cost=()=>1+(L.s?1:0)+L.pa.length+L.sa.length+(L.g?1:0)+L.pk.length;
const desc=w=>`${Math.round(w.d)}${w.pel>1?'×'+w.pel:''} dmg · ${Math.round(60/w.r)} rpm · ${w.m} rounds`;
function chip(a,v,n,t,on){const lk=typeof unlocked=='function'&&!unlocked(v);return`<button class="c ${on?'on':''}${lk?' lk':''}" data-a="${a}" data-v="${v}"><b>${n}</b><i>${lk?'Unlocks at level '+UNL[v]+(prof.tok>0?' · tap to use a token':''):t}</i></button>`}
function ui(){
 $('#md').innerHTML=Object.keys(MODES).filter(k=>k!='Zombies').map(k=>chip('mode',k,k,MODES[k],sel.mode==k&&!sel.rm)).join('')+chip('mode','?','Random mode','A different mode every match',sel.rm);
 $('#mp').innerHTML=Object.keys(MAPS).filter(k=>!MAPS[k].zm).map(k=>chip('map',k,k,MAPS[k].d,sel.map==k&&!sel.rp)).join('')+chip('map','?','Random map','A different map every match',sel.rp);
 const at=(a)=>Object.keys(A).map(k=>chip(a,k,k,A[k].t,L[a].includes(k))).join('');
 $('#ld').innerHTML=`<h2>Quick picks (or build your own below)</h2><div class="row">${Object.keys(PRE).map(k=>chip('preset',k,k,PD[k],0)).join('')}</div><h2>Primary weapon</h2><div class="row">${PRI.map(k=>chip('p',k,W[k].n,desc(W[k]),L.p==k)).join('')}</div>
 <h2>Primary attachments (up to 3)</h2><div class="row">${at('pa')}</div>
 <h2>Secondary weapon (optional)</h2><div class="row">${SEC.map(k=>chip('s',k,W[k].n,desc(W[k]),L.s==k)).join('')}</div>
 ${L.s?`<h2>Secondary attachments (up to 2)</h2><div class="row">${at('sa')}</div>`:''}
 <h2>Grenade (optional)</h2><div class="row">${Object.keys(GR).map(k=>chip('g',k,k,GR[k].t,L.g==k)).join('')}</div>
 <h2>Perks (up to 3)</h2><div class="row">${Object.keys(K).map(k=>chip('pk',k,k,K[k],L.pk.includes(k))).join('')}</div>`;
 $('#pts').textContent=cost()+' / 10 points';$('#pts').classList.remove('bad');saveSet();
}
document.addEventListener('click',e=>{const b=e.target.closest('.c');if(!b)return;if(b.classList.contains('lk')){if(b.dataset.v&&typeof tokenSpend=='function')tokenSpend(b.dataset.v);return}const a=b.dataset.a,v=b.dataset.v;
 if(a=='mode'||a=='map'){const f=a=='mode'?'rm':'rp';if(v=='?')sel[f]=1;else{sel[a]=v;sel[f]=0}fixZM();buildMap();return ui()}
 if(a=='preset'){L=JSON.parse(JSON.stringify(PRE[v]));sanitize();return ui()}
 const o=JSON.stringify(L);
 if(a=='p')L.p=v;else if(a=='s'||a=='g'){L[a]=L[a]==v?null:v;if(a=='s'&&!L.s)L.sa=[]}
 else{const r=L[a],i=r.indexOf(v);if(i>=0)r.splice(i,1);else if(r.length<LIM[a])r.push(v)}
 if(cost()>10){L=JSON.parse(o);ui();$('#pts').classList.add('bad');$('#pts').textContent='10 / 10 points: remove something first';return}
 ui()});
function saveSet(){if(!loadedSet)return;try{localStorage.setItem('sd-load',JSON.stringify({L,sel:selKeep||sel,aa:$('#aa').value,sn:$('#sn').value,fv:$('#fv').value}))}catch(e){}}
let loadedSet=0;function loadSet(){try{const sv=JSON.parse(localStorage.getItem('sd-load'));if(sv){if(sv.L&&W[sv.L.p]&&Array.isArray(sv.L.pa)&&Array.isArray(sv.L.sa)&&Array.isArray(sv.L.pk))L=sv.L;if(sv.sel){if(MAPS[sv.sel.map])sel.map=sv.sel.map;if(MODES[sv.sel.mode])sel.mode=sv.sel.mode;sel.rm=sv.sel.rm?1:0;sel.rp=sv.sel.rp?1:0}if(sv.aa!=null)$('#aa').value=sv.aa;if(sv.sn!=null)$('#sn').value=sv.sn;if(sv.fv!=null)$('#fv').value=sv.fv}}catch(e){}
loadedSet=1;try{if(typeof sanitize=='function')sanitize()}catch(e){}ui()}

/* ===================== boomtown.js ===================== */
/* ---------- Boomtown (large): bat-wing layout traced from the reference mini-map; two enterable two-story houses, cars on the central street ---------- */
(()=>{const S1=1.4,N=40,H0=40*S1,CS=2*H0/N;
const PO=[[-29.25,-16.35],[-11.6,-10.1],[-6.4,-13.1],[.75,-15],[8.6,-12.75],[12,-11.6],[29.25,-16.1],[34.9,-7.3],[37.9,2.25],[11.25,9.75],[6.75,8.85],[6.4,15.6],[-4.9,15.75],[-5.25,9.75],[-10.5,7.9],[-11.25,10.5],[-37.5,1.9],[-33.75,-9.75]].map(([x,z])=>[x*S1,z*S1]);
const inside=(x,z)=>{let c=0;for(let i=0,j=PO.length-1;i<PO.length;j=i++){const[a,b]=PO[i],[p,q]=PO[j];if((b>z)!=(q>z)&&x<(p-a)*(z-b)/(q-b)+a)c=!c}return c};
MAPS.Boomtown={d:'Large bat-wing suburb: two 2-story houses, cars on the central street',H:H0,sky:0xe3c9a0,gr:0xb59d6c,bc:0xc2b48f,fb:[[-37.8,-1.4],[43.4,-2.8]],zn:[[-37.8,-1.4],[3,-3],[43.4,-2.8]],inside,open:1,facade:1,
 deco(){const a=[];let s=11;const r=()=>(s=(s*16807)%2147483647)/2147483647,near=(x,z)=>{for(const[dx,dz]of[[0,0],[7,0],[-7,0],[0,7],[0,-7],[5,5],[-5,5],[5,-5],[-5,-5]])if(inside(x+dx,z+dz))return 1;return 0};
  for(let k=0;k<500&&a.length<280;k++){const x=(r()*2-1)*135,z=(r()*2-1)*135;if(near(x,z))continue;if(r()<.4){const w=7+r()*5,d=6+r()*4,h=3.2+r()*1.6;a.push([x,z,w,d,h,0,[0x8a6a45,0x9a7a55,0x7a5a3a][(r()*3)|0]]);a.push([x,z,w+.8,d+.8,h+.6,h,0x5a3a2a])}else{a.push([x,z,.5,.5,3,0,0x6b4a2b]);a.push([x,z,3.4,3.4,6,3,0x5a8a3a])}}
  for(let k=0;k<12;k++){const t=k/12*6.283;a.push([Math.cos(t)*160,Math.sin(t)*160,70,70,16+r()*10,0,0xa08a5a])}return a},
 b(){
 const a=[],bxr=(x0,x1,z0,z1,top,y0,col)=>a.push([(x0+x1)/2,(z0+z1)/2,x1-x0,z1-z0,top,y0,col]);
 /* wall along x (hz=1) or z (hz=0) with openings [centre,width,bottom,top] */
 const wall=(hz,cx,cz,len,t,y0,y1,ops,col)=>{const c0=(hz?cx:cz)-len/2;let cur=c0;const add=(s,e,lo,hi)=>{if(e-s<.02||hi-lo<.02)return;const c=(s+e)/2,l=e-s;a.push(hz?[c,cz,l,t,hi,lo,col]:[cx,c,t,l,hi,lo,col])};
  for(const[c,w,b,tp]of ops.slice().sort((p,q)=>p[0]-q[0])){const s=(hz?cx:cz)+c-w/2,e=s+w;add(cur,s,y0,y1);add(s,e,y0,b);add(s,e,tp,y1);cur=e}add(cur,c0+len,y0,y1)};
 /* two-story house; s=+1 when the street is on the +x side, -1 when on the -x side */
 const house=(cx,cz,w,d,s,col,roof)=>{const T=.4,hx=w/2,hz=d/2,xi=cx+s*hx,xo=cx-s*hx,L=(h,x,z,len,y0,y1,ops)=>wall(h,x,z,len,T,y0,y1,ops,col);
  L(0,xi,cz,d,0,3.2,[[-5.5,2,1,2.4],[0,1.9,0,2.5],[5.5,2,1,2.4]]);L(0,xi,cz,d,3.5,6.5,[[-5.5,2.2,4.5,6],[0,2.2,4.5,6],[5.5,2.2,4.5,6]]);
  L(0,xo,cz,d,0,3.2,[[-4,1.9,0,2.5],[4.5,2,1,2.4]]);L(0,xo,cz,d,3.5,6.5,[[-4,2.2,4.5,6],[4.5,2.2,4.5,6]]);
  for(const zz of[cz-hz,cz+hz]){L(1,cx,zz,w,0,3.2,[[0,2,1,2.4]]);L(1,cx,zz,w,3.5,6.5,[[0,2.2,4.5,6]])}
  const xs=xo+s*1.6,zs=cz+hz-.7,zn=zs-6.05;for(let i=0;i<11;i++)bxr(xs-1.1,xs+1.1,zn+.55*i,zn+.55*(i+1),(i+1)*.3,0,0x8a6a45);
  const hx0=xs-1.1,hx1=xs+1.1,hz0=zn,hz1=zs+.3,x0=cx-hx,x1=cx+hx,z0=cz-hz,z1=cz+hz,fl=0x9a948a;
  bxr(x0,hx0,z0,z1,3.5,3.2,fl);bxr(hx1,x1,z0,z1,3.5,3.2,fl);bxr(hx0,hx1,z0,hz0,3.5,3.2,fl);bxr(hx0,hx1,hz1,z1,3.5,3.2,fl);
  bxr(x0,x1,z0,z1,6.8,6.5,roof);bxr(cx-1.7,cx+1.7,cz+1.45,cz+2.55,.9,0,0x6b5b4b);bxr(cx-1,cx+1,cz-2.6,cz-1.4,4.4,3.5,0x5a4a3a)};
 /* cars: lower body + dark cabin (vans are one tall box) */
 const car=(x,z,alongZ,len,col,van)=>{const W=1.9,bw=alongZ?W:len,bd=alongZ?len:W;if(van){a.push([x,z,alongZ?2.3:len,alongZ?len:2.3,2.3,0,col]);return}
  a.push([x,z,bw,bd,1,0,col]);a.push([x,z,alongZ?W*.9:len*.5,alongZ?len*.5:W*.9,1.65,1,0x27333c])};
 for(const[x,z,w,d,h]of[[-31.4,-7.75,5.8,4.3,4],[-26.25,3.9,4.1,4,3.5],[-23.45,-13.5,2.9,2.2,3],[21.9,-12.3,3.35,3.9,3.5],[27.55,4.3,1.9,2.35,3]])a.push([x*S1,z*S1,w*S1,d*S1,h]);
 for(const[x,z]of[[-6,-3],[7,-6],[24,0],[-24,-3]])a.push([x*S1,z*S1,2.6,2.6,1]);
 for(const[x,z,az,l,c,v]of[[2.7,-.3,1,7,0xd9d4c4,1],[-2,8.7,1,4.6,0xb23a2e],[-1.1,-12.3,1,4.6,0x2f5f9e],[1.2,19.5,0,4.6,0xd9b13b],[7,-4,0,4.6,0x3a7a4a],[-6,3,0,4.6,0x8a8d93],[5,13,1,4.6,0xb23a2e],[-4,-7,0,4.6,0xd9b13b]])car(x,z,az,l,c,v);
 house(-18.2,-.7,15,17,1,0x9fc49a,0x6b7a62);house(21.3,-.7,15,17,-1,0xd9c97c,0x7a5a4a);
 /* perimeter along the traced outline: cars and bollards just outside the playable cells */
 const ins=(i,j)=>i>=0&&i<N&&j>=0&&j<N&&inside(-H0+(i+.5)*CS,-H0+(j+.5)*CS);let sd=0;
 for(let j=-1;j<N;j++){let s0=-1,e0=0;for(let i=0;i<=N;i++){const e=i<N&&ins(i,j)!=ins(i,j+1)?(ins(i,j)?1:-1):0;if(s0>=0&&e!=e0){const zz=-H0+(j+1)*CS+e0*.9;barrierLine(a,-H0+s0*CS-.6,zz,-H0+i*CS+.6,zz,sd++);s0=-1}if(e&&s0<0){s0=i;e0=e}}}
 for(let i=-1;i<N;i++){let s0=-1,e0=0;for(let j=0;j<=N;j++){const e=j<N&&ins(i,j)!=ins(i+1,j)?(ins(i,j)?1:-1):0;if(s0>=0&&e!=e0){const xx=-H0+(i+1)*CS+e0*.9;barrierLine(a,xx,-H0+s0*CS-.6,xx,-H0+j*CS+.6,sd++);s0=-1}if(e&&s0<0){s0=j;e0=e}}}
 return a}};
try{const sv=JSON.parse(localStorage.getItem('sd-load'));if(sv&&sv.sel&&(sv.sel.map=='Boomtown'||sv.sel.map=='Nuketown')){sel.map='Boomtown';ui()}}catch(e){}})();

/* ===================== engine.js ===================== */
/* ---------- engine ---------- */
const R=new THREE.WebGLRenderer({antialias:true,powerPreference:'high-performance'});R.setPixelRatio(Math.min(devicePixelRatio,1.5));R.setSize(innerWidth,innerHeight);document.body.prepend(R.domElement);
const S=new THREE.Scene(),C=new THREE.PerspectiveCamera(78,innerWidth/innerHeight,.03,200);C.rotation.order='YXZ';S.add(C);
const hemi=new THREE.HemisphereLight(0xffffff,0x445566,.85);S.add(hemi);const sun=new THREE.DirectionalLight(0xffffff,.7);sun.position.set(30,50,20);S.add(sun);
addEventListener('resize',()=>{R.setSize(innerWidth,innerHeight);C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix()});
const sg=new THREE.SphereGeometry(1,12,8),bg=new THREE.BoxGeometry(1,1,1);
const gun=new THREE.Group(),gb=new THREE.Mesh(bg,new THREE.MeshLambertMaterial()),gf=new THREE.Mesh(bg,new THREE.MeshBasicMaterial({color:0xffdd66}));
gf.scale.set(.06,.06,.12);gun.add(gb,gf);C.add(gun);
let bobP=0,landD=0,cRoll=0,wasOn=1,selKeep=null,relT=0,mapG,bx=[],H=30,bots=[],fx=[],grs=[],wp=[],cur=0,rel=0,nf=0,P={},yaw=0,pitch=0,kick=0,fr=1,AA=1,sens=1,run=0,paused=0,over=0,mode,t0=0,kills=0,deaths=0,shots=0,hits=0,wave=0,tl=90,gc=0,dmA=0,hmT=0,msT=0,rt=0,lastHit=0,tg=null;
const key={},CONE=.06;let trig=0,fresh=0;
let ac;function beep(f,d,ty,v){try{ac=ac||new AudioContext();const o=ac.createOscillator(),g=ac.createGain();o.type=ty||'square';o.frequency.setValueAtTime(f,ac.currentTime);o.frequency.exponentialRampToValueAtTime(f/2,ac.currentTime+d);g.gain.setValueAtTime((v||.05)*vol,ac.currentTime);g.gain.exponentialRampToValueAtTime(.0001,ac.currentTime+d);o.connect(g).connect(ac.destination);o.start();o.stop(ac.currentTime+d)}catch(e){}}
function eff(k,at){const w={...W[k],ad:1};for(const a of at)for(const p in A[a])if(p!='t')w[p]*=A[a][p];w.m=Math.round(w.m);w.k=k;return w}
/* head and body hit spheres [headPos, bodyPos, headRadius, bodyRadius] that follow the stance of other players (crouch, slide, prone, dive) and the height they are really at */
function hitPts(b){const pc=b.pc||0,psl=b.psl||0,pp=b.pp||0,y=b.y||0,ry=b.ry==null?0:b.ry,fx=Math.sin(ry),fz=Math.cos(ry),sc=b.big?1.35:1;/* brutes are modelled 1.35x larger, so their head sits higher and their body is wider */
 const sh=(1-pp),hy=y+((1.75-.34*pc-.62*psl)*sh+.34*pp)*sc,by=y+((.95-.26*pc-.42*psl)*sh+.26*pp)*sc,hf=.8*pp*sc;
 return[V(b.x+fx*hf,hy,b.z+fz*hf),V(b.x,by,b.z),.3*sc,(.65-.3*pp-.08*pc)*sc]}
function buildMap(){if(mapG){S.remove(mapG);if(typeof gfxDispose=='function')gfxDispose(mapG)}const M=MAPS[sel.map];H=M.H;mapG=new THREE.Group();S.add(mapG);S.background=new THREE.Color(M.sky);S.fog=new THREE.Fog(M.sky,30,M.fogF||(M.open?170:110));bx=[];
 M._v=[];const list=M.b();for(const [x,z,w,d,h,y0=0,_c,_k] of list)bx.push({x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,h,y0,pl:_k=='n'?1:0});
 gfxMap(M,list);if(M.post)M.post(mapG)}
function mv(o,dx,dz,r){o.x+=dx;o.z+=dz;for(const b of bx){if((o.y||0)>=b.h-.31||(o.y||0)+1.8<=(b.y0||0))continue;if(o.x>b.x0-r&&o.x<b.x1+r&&o.z>b.z0-r&&o.z<b.z1+r){const c=[o.x-(b.x0-r),b.x1+r-o.x,o.z-(b.z0-r),b.z1+r-o.z],i=c.indexOf(Math.min(...c));if(i==0)o.x=b.x0-r;else if(i==1)o.x=b.x1+r;else if(i==2)o.z=b.z0-r;else o.z=b.z1+r}}o.x=cl(o.x,-H+r,H-r);o.z=cl(o.z,-H+r,H-r)}
function gnd(o){let g=0;for(const b of bx)if(o.x>b.x0-.3&&o.x<b.x1+.3&&o.z>b.z0-.3&&o.z<b.z1+.3&&b.h<=o.y+.31&&b.h>g)g=b.h;return g}
function rb(o,d,b){let t0=0,t1=1e9,a,c,e;e=d.x;if(Math.abs(e)<1e-8){if(o.x<b.x0||o.x>b.x1)return 1e9}else{a=(b.x0-o.x)/e;c=(b.x1-o.x)/e;if(a>c){e=a;a=c;c=e}if(a>t0)t0=a;if(c<t1)t1=c;if(t0>t1)return 1e9}
 e=d.y;if(Math.abs(e)<1e-8){if(o.y<(b.y0||0)||o.y>b.h)return 1e9}else{a=((b.y0||0)-o.y)/e;c=(b.h-o.y)/e;if(a>c){e=a;a=c;c=e}if(a>t0)t0=a;if(c<t1)t1=c;if(t0>t1)return 1e9}
 e=d.z;if(Math.abs(e)<1e-8){if(o.z<b.z0||o.z>b.z1)return 1e9}else{a=(b.z0-o.z)/e;c=(b.z1-o.z)/e;if(a>c){e=a;a=c;c=e}if(a>t0)t0=a;if(c<t1)t1=c;if(t0>t1)return 1e9}return t0}
function castW(o,d,max){let t=max;if(d.y<0)t=Math.min(t,-o.y/d.y);for(const b of bx){if(b.pl)continue;t=Math.min(t,rb(o,d,b))}return t}
function rs(o,d,c,r){const oc=o.clone().sub(c),b=oc.dot(d),D=b*b-(oc.dot(oc)-r*r);if(D<0)return 1e9;const t=-b-Math.sqrt(D);return t>0?t:1e9}
const aimDir=()=>{const p=pitch+kick;return V(-Math.sin(yaw)*Math.cos(p),Math.sin(p),-Math.cos(yaw)*Math.cos(p))};
function findT(){const o=C.position,d=aimDir();let best=null,ba=9;if(AA<=0)return null;for(const b of bots){if(!b.al||ally(b))continue;const v=V(b.x-o.x,(b.big?1.5:1.1)-o.y,b.z-o.z),D=v.length();if(D>55)continue;v.divideScalar(D);const a=Math.acos(Math.min(1,v.dot(d))),cone=CONE*AA*(1-D/75);if(a<cone&&a<ba&&castW(o,v,D)>=D-.9){ba=a;best={b,v,a,cone}}}return best}
function tr(o,d,len,col,life,raw){const g=new THREE.BufferGeometry().setFromPoints([raw?o.clone():o.clone().add(d.clone().multiplyScalar(.6)).add(V(0,-.12,0)),o.clone().add(d.clone().multiplyScalar(len))]);const m=new THREE.Line(g,new THREE.LineBasicMaterial({color:col}));S.add(m);fx.push({m,l:life||.06,line:1})}

/* ===================== bots.js ===================== */
/* ---------- bots ---------- */
let botId=0;
function addBot(hp,df){const m=new THREE.Group(),rig=mkHuman(m);S.add(m);
 const b={i:botId++,m,rig,x:0,z:0,y:0,hp:50,mhp:50,sh:50,msh:50,lh:-9,al:0,cd:1,off:1,ot:0,rt:0,df,team:'e',k:0,nm:'Grunt'};bots.push(b);spawn(b);setHeld(b,BOTGUNS[Math.random()*BOTGUNS.length|0]);return b}
function spawnPt(minD,team){const M=MAPS[sel.map];let x,z,vx=null,vz=null;const tm=team&&teamMode(),lo=tm&&team=='B'?H/3:-H,hi=tm&&team=='A'?-H/3:H;for(let i=0;i<400;i++){x=lo+3+Math.random()*(hi-lo-6);z=(Math.random()*2-1)*(H-3);if(M.inside&&!M.inside(x,z))continue;if(typeof navOK=='function'&&!navOK(x,z))continue;if(bx.some(b=>b.h>.5&&x>b.x0-1.2&&x<b.x1+1.2&&z>b.z0-1.2&&z<b.z1+1.2))continue;vx=x;vz=z;if(Math.hypot(x-P.x,z-P.z)>=minD)break}return vx==null?[x,z]:[vx,vz]}
function spawn(b){b.fall=null;if(typeof ragReset=='function')ragReset(b);b.m.rotation.x=0;b.m.position.y=0;[b.x,b.z]=spawnPt(18,b.team);b.hp=b.mhp;b.sh=b.msh;b.lh=-9;b.al=1;b.cd=1+Math.random();b.m.visible=true}
function takeDmg(b,d){b.lh=t0;if(b.sh>0){const a=Math.min(b.sh,d);b.sh-=a;d-=a}b.hp-=d}
function hitBot(b,d,head){takeDmg(b,d);hits++;juiceHit(b,d,head);if(b.net){netSend(b.hb?{t:'bh',i:b.i,d}:{t:'hit',to:b.id,d});return}$('#hm').className='on'+(head?' hd':'');hmT=.12;beep(head?900:600,.05,'square',.04);if(b.hp<=0){b.al=0;b.dc=(b.dc||0)+1;bodyFall(b);b.rt=2.5;kills++;ts[pTeam()]=(ts[pTeam()]||0)+1;announce(b,P);juiceKill(b,head);featKill(b,head);if(L.pk.includes('Scavenger')){for(const w of wp)w.res=Math.min(w.res+Math.ceil(w.m*.4),w.m*(w.rs==null?4:w.rs))}}}
function hurt(d,b){if(P.dead)return;lastBot=b||null;if(b)dirInd(b);lastHit=t0;dmA=.6;shake=Math.max(shake,.3);if(P.sh>0){const a=Math.min(P.sh,d);P.sh-=a;d-=a}P.hp-=d;beep(120,.1,'sawtooth',.06);if(P.hp<=0)die()}
function die(){P.dead=1;deaths++;ks=0;q.length=0;if(mode!='Zombies')startDeath();const by=lastAtk||(lastBot&&!lastBot.net?'b'+lastBot.i:'');botScoreOnMe();if(netOn){if(isHost&&mode!='Private'&&lastAtk)credit(lastAtk);netSend({t:'dead',v:myId,by})}lastAtk='';P.rt=2.5;if(mode=='Survival'&&!netOn)setTimeout(()=>endGame('You were eliminated'),2600);if(mode=='Zombies')zDown()}
function respawn(){endDeath();ctlReset();const[x,z]=spawnPt(20,pTeam());P.x=x;P.z=z;P.y=0;P.vy=0;P.mx=P.mz=0;P.hp=P.mhp;P.sh=P.msh;P.dead=0;for(const w of wp){w.mag=w.m;w.res=w.m*(w.rs==null?4:w.rs)}rel=0}

/* ===================== weapons.js ===================== */
/* ---------- weapons ---------- */
const cw=()=>wp[cur];
function setGun(){const w=cw();applyCamo(w.k);gb.scale.set(.07,.09,w.len);gb.position.z=-w.len/2;gf.position.z=-w.len-.05;gun.position.set(.2,-.2,-.45)}
/* hits inside shoot() are isolated: an exception in the kill chain can no longer cancel the rest of the shot */
function safeHit(){try{return hitBot.apply(null,arguments)}catch(e){console.error('hit error',e)}}
function shoot(){const w=cw();src=W[w.k].n;srcK=w.k;w.mag--;shots++;nf=t0+w.r*zfr();gunSnd(w);/* the shot is heard first, whatever happens to the hit afterwards */const o=(typeof vrOrg=='function'&&vrOrg())||C.position.clone(),base=aimDir();let d0=base;const T=findT();
 if(T)d0=base.clone().lerp(T.v,Math.min(.7,.55*AA*(1-T.a/T.cone*.5))).normalize();
 const mvg=((key.KeyW||key.KeyA||key.KeyS||key.KeyD||ST.auto)?1.6:1)*(1-.65*ST.ads)*(ST.mount?.5:1)*(ST.steady>0?.6:1)*(ST.crouch?.8:1)*(ST.prone?.65:1);
 for(let i=0;i<w.pel;i++){const d=d0.clone().add(V(Math.random()-.5,Math.random()-.5,Math.random()-.5).multiplyScalar(2*w.sp*mvg)).normalize();let tw=castW(o,d,120),bt=1e9,bb=null,hd=0;
  for(const b of bots){if(!b.al||ally(b))continue;const hp_=hitPts(b),th=rs(o,d,hp_[0],hp_[2]),tb=rs(o,d,hp_[1],hp_[3]),t=Math.min(th,tb);if(t<bt){bt=t;bb=b;hd=th<tb}}
  if(w.k=='SN'){let any=0;for(const b of bots.slice()){if(!b.al||ally(b))continue;const hp_=hitPts(b),th=rs(o,d,hp_[0],hp_[2]),tb=rs(o,d,hp_[1],hp_[3]),t=Math.min(th,tb);if(t<tw){any=1;safeHit(b,w.d*zmul(w)*(th<tb?2:1)*falloff(w,t),th<tb)}}if(!any&&tw<119&&i<2)burst(o.clone().add(d.clone().multiplyScalar(tw-.05)),4,0xffd27a,3,.35,.06)}
  else if(bb&&bt<tw){tw=bt;safeHit(bb,w.d*zmul(w)*(hd&&w.k!='RG'?2:1)*falloff(w,bt),hd)}else if(tw<119&&i<2)burst(o.clone().add(d.clone().multiplyScalar(tw-.05)),4,0xffd27a,3,.35,.06);
  if(i==0&&netOn)netShot(w.k,o,d,Math.min(tw,120));if(w.ex)boom(o.clone().add(d.clone().multiplyScalar(Math.max(0,Math.min(tw,120)-.3))),w.ex);if(w.k=='RG')rgBeam(o,d,Math.min(tw,120));else if(w.k=='TEA'&&typeof teaBeam=='function'){const wl=Math.min(castW(o,d,120),120);teaBeam(o,d,wl);teaPierce(o,d,wl,w,Math.min(tw,120))}else if(i==0||w.pel>1&&i<3)tr(o,d,Math.min(tw,w.pw?150:80),w.ex?0xff8040:0xfff0a0)}
 kick+=w.rc*.004*(1-.4*ST.ads)*(ST.mount?.4:1);gun.position.z+=.05;gf.visible=true;setTimeout(()=>gf.visible=false,45);shake=Math.max(shake,w.rc*.014);flashL=1;fk=Math.max(fk,.6);if(w.dual&&typeof dsShot=='function')dsShot(w);if(w.mag<=0)startRel()}
function startRel(){const w=cw();if(rel>0||w.mag>=w.m||w.res<=0)return;rel=relT=w.rl*zrl()}
function swap(i){if(i<0||i>=wp.length||i==cur)return;cur=i;rel=0;setGun()}
function boom(p,g){if(g.smoke)return smokeBurst(p);if(g.tac)return flashBoom(p);if(g.w){src=W[g.w].n;srcK=g.w}else{src='Explosive';srcK=''}if(g.w=='TEA'){beep(260,.3,'sine',.09);noise(.3,900,.35);burst(p,12,0xd9953f,5,.6,.1);if(typeof teaScald=='function')teaScald(p,g.R);shake=Math.max(shake,Math.min(.45,6/(1+p.distanceTo(C.position))));flashL=Math.max(flashL||0,.5)}else if(g.w=='RG'){beep(170,.26,'sawtooth',.09);beep(430,.16,'sine',.06);noise(.3,700,.34);burst(p,14,0xff3a6a,6,.6,.1);shake=Math.max(shake,Math.min(.55,7/(1+p.distanceTo(C.position))));flashL=Math.max(flashL||0,.7)}else{const m=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({color:g.c||0xffa040,transparent:true,opacity:.6}));m.position.copy(p);m.scale.setScalar(.5);S.add(m);fx.push({m,l:.35,grow:g.R*3,sph:1});beep(70,.4,'sawtooth',.12);noise(.5,900,.6);burst(p,40,g.c||0xffa040,9,.7,.18);shake=Math.max(shake,Math.min(1.2,14/(1+p.distanceTo(C.position))));flashL=2}
 for(const b of bots){if(!b.al||ally(b))continue;const D=Math.hypot(b.x-p.x,1-p.y,b.z-p.z);if(D<g.R)hitBot(b,g.d*(1-D/g.R),0)}
 const D=Math.hypot(P.x-p.x,P.y+1-p.y,P.z-p.z);if(D<g.R*.8&&!g.own)hurt(g.d*.4*(1-D/g.R))}
function throwG(){const lg=LG();if(!lg||gc<=0||P.dead)return;if(lg=='Claymore'){clayPlace();return}gc--;const d=aimDir(),m=new THREE.Mesh(sg,new THREE.MeshLambertMaterial({color:lg=='Frag'?0x4a7a3a:lg=='Semtex'?0xd8661c:lg=='Smoke'?0x8a8f96:0x62e0f0}));m.scale.setScalar(.13);if(lg=='Semtex'){const led=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({color:0xff2200}));led.scale.setScalar(.35);led.position.y=.9;m.add(led);m.userData.led=led;beep(900,.08,'square',.05)}S.add(m);grs.push({m,p:C.position.clone(),v:d.multiplyScalar(15).add(V(0,3,0)),t:GR[lg].fuse,g:GR[lg],bt:0,spin:Math.random()*6})}

/* ===================== game.js ===================== */
/* ---------- game flow ---------- */
function startGame(){fixZM();buildMap();ctlReset();for(const b of bots)S.remove(b.m);bots=[];for(const f of fx)S.remove(f.m);fx=[];for(const g of grs)S.remove(g.m);grs=[];
 sanitize();fovBase=+$('#fv').value||80;AA=+$('#aa').value;sens=+$('#sn').value;mode=sel.mode;if(!netOn)myTeam='A';kills=deaths=shots=hits=wave=0;tl=90;t0=0;nf=0;trig=0;fresh=0;hmT=0;msT=0;dmA=0;lastHit=-9;
 P={x:0,y:0,z:0,vy:0,hp:50,mhp:50,sh:50,msh:50+(PK('Overshield')?50:0),dead:0,on:1};P.sh=P.msh;
 wp=[(L.p=='SMG'&&L.pa.includes('Dual Wield'))?{k:'DS',...eff('DS',L.pa.filter(a_=>a_!='Dual Wield'))}:{k:L.p,...eff(L.p,L.pa)}];if(L.s)wp.push({k:L.s,...eff(L.s,L.sa)});for(const w of wp){w.mag=w.m;w.res=w.m*(w.rs==null?4:w.rs)}cur=0;rel=0;gc=LG()?2:0;setGun();
 const[x,z]=mode=='Zombies'&&MAPS[sel.map].ps?MAPS[sel.map].ps:spawnPt(0,pTeam());P.x=x;P.z=z;yaw=pitch=kick=0;
 setupBots();zStart();
 $('#menu').style.display=$('#end').style.display='none';$('#hud').style.display='block';over=0;paused=0;run=1;juiceReset();featReset();endDeath();gun.visible=true;if(typeof finStop=='function')finStop();lockPtr()}
function modeTick(dt){if(mode=='Private')return privTick();if(netOn&&!isHost){$('#ob').textContent=obText;if(mode=='Zombies')zcTick(dt);if(mode=='Kill Confirmed')kcTick(dt);return}
 if(mode=='Zombies')return zomTick(dt);
 if(mode=='One in the Chamber')return oiTick(dt);
 if(mode=='Slayer'||teamMode())return pvpTick(dt);
 if(mode=='Time Attack'){tl-=dt;const l=leader();$('#ob').textContent=`Time ${Math.max(0,Math.ceil(tl))}s  ·  ${netOn?'Leader '+l.nm+' '+l.k:'Kills '+kills}`;if(tl<=0)endGame(l.me?'Victory':netOn?l.nm+' wins':'Defeat')}
 else{const live=bots.filter(b=>b.al&&!b.net).length;$('#ob').textContent=`Wave ${wave}  ·  Kills ${kills}  ·  Enemies ${live}`;if(netOn&&P.dead&&!bots.some(b=>b.net&&b.al))return endGame('You were eliminated');
  if(!live){bots=bots.filter(b=>{if(b.net)return true;S.remove(b.m);return false});wave++;const n=Math.min(12,2+wave*2);for(let i=0;i<n;i++)addBot(50+wave*6,1+wave*.07);msg('Wave '+wave,2.5);gc=Math.min(gc+1,3)}}}
/* Zombies has its own fixed equipment: the Multiplayer loadout (perks, grenade, melee, attachments) never leaks into it */
const PK=n=>mode!='Zombies'&&L.pk.includes(n),LG=()=>mode=='Zombies'?'Frag':L.g,zomOn=()=>!!run&&mode=='Zombies';let sprF=0;
const rng=()=>PK('Run & Gun')||(mode=='Zombies'&&zq&&!!zq.perks.stam);
function upd(dt){t0+=dt;ctlTick(dt);
 if(P.dead){P.rt-=dt;if(P.rt<=0&&mode!='Survival'&&mode!='Zombies')respawn()}
 else{const mi=moveCalc(dt),f=mi.f,s=mi.s,spt=mi.spt;phys(dt,f,s,mi.spd*(PK('Marathon')?1.15:1)*zsm());P.spr=(P.spr||0)+((spt?1:0)-(P.spr||0))*Math.min(1,dt*8);
  tg=findT();fr=(tg?Math.max(.4,1-.4*AA):1)*(1-.45*ST.ads);
  const w=cw();if(rel>0){rel-=dt;if(rel<=0){const tk=Math.min(w.m-w.mag,w.res);w.mag+=tk;w.res-=tk}}
  else if(((trig&&((w.au&&!ST.fm[w.k])||fresh))||(BST.n>0&&w.burst))&&t0>=nf&&w.mag>0&&(!spt||rng())){shoot();fresh=0}else if(trig&&w.mag<=0&&!(typeof MV!='undefined'&&MV.eq))startRel();
  if(t0-lastHit>(PK('Second Wind')?2:4))P.sh=Math.min(P.msh,P.sh+(PK('Second Wind')?65:40)*dt)}
 kick*=Math.exp(-9*dt);const mvs=Math.hypot(P.mx||0,P.mz||0),f_=P.dead?0:Math.min(1,mvs/7),spr=P.spr||0;sprF+=(((trig&&rng()&&spr>.15&&!P.dead)?1:0)-sprF)*Math.min(1,dt*12);const sgp=spr*(1-.9*sprF);P.sprG=sgp;bobP+=dt*(6.5+spr*3.5)*f_;if(P.on&&!wasOn)landD=.09;wasOn=P.on;landD*=Math.exp(-9*dt);cRoll+=(-((key.KeyD?1:0)-(key.KeyA?1:0))*.02*(P.on?1:.4)*(P.dead?0:1)-cRoll)*Math.min(1,dt*8);
 if(P.dead){if(mode=='Zombies')zDownCam(dt);else deathCam(dt)}else{C.position.set(P.x,P.y+ST.eye+Math.sin(bobP*2)*.014*f_*(1+spr)-landD,P.z);C.rotation.set(pitch+kick,yaw,cRoll)}
 gun.position.x+=(.2*(1-ST.ads)+ST.ax*ST.ads-rlX()-sgp*.07+Math.cos(bobP)*(.006+.03*spr)*f_-gun.position.x)*10*dt;gun.position.y=-.2*(1-ST.ads)+ST.ay*ST.ads+Math.sin(bobP*2)*(.006+.03*spr)*(1-ST.ads*.8)*f_-sgp*.1+rlY()+bashY();gun.position.z+=(-.45*(1-ST.ads)+ST.az*ST.ads+sgp*(.04+.06*Math.sin(bobP*2+1))+bashZ()-gun.position.z)*12*dt;gun.rotation.x=rlRot()+bashRot()-sgp*(.62+.1*Math.sin(bobP*2));
 juiceTick(dt);gun.rotation.z-=sgp*(.3+.07*Math.cos(bobP));gun.rotation.y+=sgp*(.42+.05*Math.sin(bobP));featTick(dt);fpUpdate(dt);updBots(dt);for(const b of bots)if(b.al)animBot(b,dt);fallTick(dt);gfxTick(dt);modeTick(dt);
 for(let i=grs.length-1;i>=0;i--){const g=grs[i];g.t-=dt;
  if(g.g.stk){const rate=g.stuck?Math.max(.07,.32*g.t/g.g.fuse):.2;g.bt-=dt;if(g.bt<=0){g.bt=rate;g.blk=!g.blk;if(g.blk&&g.stuck)beep(1900-g.t*180,.03,'square',.03)}const led=g.m.userData.led;if(led)led.material.color.setHex(g.blk?0xffe0a0:0xff2200);g.m.scale.setScalar(.13*(1+(g.blk?.12:0)))
   if(g.stuck){if(g.sb){if(!g.sb.al){g.stuck=0;g.sb=null;g.v.set(0,0,0)}else g.p.set(g.sb.x,(g.sb.y||0)+1.1,g.sb.z)}
    if(g.stuck){g.m.position.copy(g.p);if(g.t<=0){boom(g.p,g.g);S.remove(g.m);grs.splice(i,1)}continue}}}
  g.v.y-=18*dt;g.m.rotation.x+=dt*8;g.m.rotation.z+=dt*5;const np=g.p.clone().add(g.v.clone().multiplyScalar(dt));let ex=g.t<=0;
  if(np.y<.13){np.y=.13;g.v.y*=-.35;g.v.x*=.7;g.v.z*=.7;if(g.g.imp)ex=1;if(g.g.stk){g.stuck=1;g.v.set(0,0,0);burst(np.clone(),6,0xffa040,3,.25,.08)}}
  for(const b of bx)if(np.x>b.x0&&np.x<b.x1&&np.z>b.z0&&np.z<b.z1&&np.y<b.h&&np.y>(b.y0||0)){if(g.g.imp)ex=1;else if(g.g.stk){g.stuck=1;g.v.set(0,0,0);np.copy(g.p);burst(np.clone(),6,0xffa040,3,.25,.08)}else{g.v.x*=-.3;g.v.z*=-.3;np.copy(g.p)}}
  if(g.g.imp)for(const b of bots)if(b.al&&Math.hypot(b.x-np.x,b.z-np.z)<.8&&np.y<2)ex=1;
  if(g.g.stk&&!g.stuck)for(const b of bots)if(b.al&&Math.hypot(b.x-np.x,b.z-np.z)<.7&&np.y<2.1&&np.y>(b.y||0)){g.stuck=1;g.sb=b;g.v.set(0,0,0);np.set(b.x,(b.y||0)+1.1,b.z);burst(np.clone(),8,0xff5522,3,.3,.1);msg('STUCK!',1)}
  g.p.copy(np);g.m.position.copy(np);if(ex){boom(np,g.g);S.remove(g.m);grs.splice(i,1)}}
 for(let i=fx.length-1;i>=0;i--){const f=fx[i];f.l-=dt;if(f.grow)f.m.scale.addScalar(f.grow*dt);if(f.sph)f.m.material.opacity=Math.max(0,f.l*1.7);if(f.fade){f.m.material.opacity=f.fade*Math.min(1,f.l/.1);f.m.scale.x=f.m.scale.z=f.r*(.5+f.l/.16)}if(f.l<=0){S.remove(f.m);if(f.fade)f.m.material.dispose();if(f.line)f.m.geometry.dispose();fx.splice(i,1)}}
 hmT-=dt;if(hmT<=0)$('#hm').className='';msT-=dt;if(msT<=0)$('#ms').textContent='';dmA=Math.max(0,dmA-dt*.8);$('#dm').style.opacity=dmA;
 $('#cx').className=(tg?'t':'')+(ST.ads>.4?' h':'');$('#sh').style.width=P.sh/P.msh*100+'%';$('#hp').style.width=Math.max(0,P.hp/P.mhp*100)+'%';
 $('#am').innerHTML=P.dead?(mode=='Zombies'?'Downed':'Respawning…'):`${cw().mag}<small>${rel>0?'Reloading…':'/ '+cw().res} · ${cw().pn||W[cw().k].n}${LG()?' · Grenades '+gc:''}${mode=='Zombies'&&typeof zAmmoX=='function'?zAmmoX():''}</small>`}
const clk=new THREE.Clock();
function gameFrame(){const dt=Math.min(clk.getDelta(),.05);if(typeof inputTick=='function')inputTick(dt);if(run&&(!paused||(typeof netOn!='undefined'&&netOn)))upd(dt);else if(!run&&typeof menuCam=='function')menuCam(dt);if(typeof netOn!='undefined'&&netOn)netTick(dt);if(typeof vrPost=='function')vrPost(dt);if(!document.hidden)LX.render(S,C);if(typeof vrAfter=='function')vrAfter()}
(function loop(){requestAnimationFrame(loop);if(!(R.xr&&R.xr.isPresenting)&&!document.hidden)gameFrame()})();
/* browsers freeze requestAnimationFrame and slow timers in background tabs, which made a host or guest look disconnected. A worker timer is not throttled, so while the tab is hidden it keeps the match (and the network traffic) running */
try{const wk=new Worker(URL.createObjectURL(new Blob(['setInterval(()=>postMessage(0),25)'],{type:'text/javascript'})));wk.onmessage=()=>{if(document.hidden&&typeof netOn!='undefined'&&netOn&&!(R.xr&&R.xr.isPresenting))gameFrame()}}catch(e){}

/* ===================== input.js ===================== */
/* ---------- input ---------- */
$('#go').onclick=()=>{rollRandom();fixZM();startGame()};$('#again').onclick=startGame;$('#tomenu').onclick=()=>{netClose();for(const b of bots)S.remove(b.m);bots=[];clearFlags();buildMap();showRank();$('#end').style.display=$('#hud').style.display='none';$('#menu').style.display='block'};

document.addEventListener('pointerlockchange',()=>{const l=document.pointerLockElement==R.domElement;if(run){paused=!l;(l?hidePause:showPause)()}});
addEventListener('mousemove',e=>{if(!run||paused)return;const k=.0022*sens*fr;yaw-=e.movementX*k;pitch=cl(pitch-e.movementY*k,-1.45,1.45);sw.x=cl(sw.x-e.movementX*.0012,-.1,.1);sw.y=cl(sw.y-e.movementY*.0012,-.08,.08)});
addEventListener('mousedown',e=>{if(e.button==0&&run&&!paused){trig=1;fresh=1}});addEventListener('mouseup',e=>{if(e.button==0)trig=0});
addEventListener('contextmenu',e=>e.preventDefault());
addEventListener('keydown',e=>{if(!run||paused)return;if(typeof kbDown=='function')return kbDown(e);if(e.code=='Space')e.preventDefault();if(!key[e.code]){if(e.code=='KeyF')fresh=1;if(e.code=='KeyR')startRel();if(e.code=='Digit1')swap(0);if(e.code=='Digit2')swap(1);if(e.code=='Digit3')swap(mode=='Zombies'?2:wp.findIndex(w=>w.pw));if(e.code=='KeyV')melee();if(e.code=='KeyE')useStreak();if(e.code=='KeyQ')swap((cur+1)%wp.length)}key[e.code]=1});
addEventListener('keyup',e=>key[RB(e.code)]=0);addEventListener('blur',()=>{for(const k in key)key[k]=0;trig=0});
;
