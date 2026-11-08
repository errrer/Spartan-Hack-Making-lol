/* ######## zombies.js ######## */
/* ===================== zombies.js ===================== */
/* ---------- Zombies: rounds of undead that arrive in waves, points for every shot and kill, locked doors, mystery boxes, wall weapons, ammo crates,
   Pack-a-Punch (guns AND melee) and soda perk machines. Solo or up to 4 player co-op through a private lobby.
   The mode has its own fixed equipment: a 1911, bare Fists, 2 frags and 2 flashbangs, no perks and no attachments. Nothing from the Multiplayer loadout carries over.
   Ammo is never restored for free: it is bought at the wall (half price when you already own the gun) or at an Ammo Crate (500 / 2000 / 4000 by Pack-a-Punch tier).
   Co-op: the host simulates every zombie, round and door; guests see the zombies as puppets, report their hits to the host and get their kill points back.
   Points, perks, weapons and wall purchases belong to each player; doors, boxes and the Revive Soda stock are shared. Teammates revive you by holding F.
   The map itself (the Hollow Estate mansion, its props, machines and animation) is in js/estate.js. ---------- */
let zq=null,zG=null,zi=[],zdoors=[],zboxes=[],zgr=null,zfls={},zdead=[],zhc='',zbT=0,zsT=0;
const PERKS={vit:{n:'Vitality Cola',c:0xd8332a,cost:2500,t:'+50 max health'},spd:{n:'Quick Fizz',c:0x39c85a,cost:3000,t:'Reload twice as fast'},dbl:{n:'Double Pop',c:0xf0c21e,cost:2000,t:'Double damage, faster fire'},rev:{n:'Revive Soda',c:0x2f7de0,cost:500,t:'Revive yourself once and revive teammates twice as fast'},stam:{n:'Stamin Fizz',c:0xa04ad8,cost:2000,t:'Run 20% faster and shoot while sprinting'},mule:{n:'Mule Soda',c:0xf08a2a,cost:4000,t:'Carry a third weapon'}};
/* perk hooks used by the weapon code (all neutral outside Zombies) */
const zrl=()=>zq&&mode=='Zombies'&&zq.perks.spd?0.5:1,zfr=()=>zq&&mode=='Zombies'&&zq.perks.dbl?0.75:1,zsm=()=>zq&&mode=='Zombies'&&zq.perks.stam?1.2:1,
 ZB={SG:1.8,TRB:2.4,BR:1.15,TEA:2.6},zmul=w=>mode=='Zombies'&&zq?ZW*(w.pm||1)*(ZB[w.k]||1)*(zq.perks.dbl&&!w.ex&&w.k!='RG'?2:1):1;
const zHp=r=>{const bs=n=>100+30*(n-1)+5*n*(n-1);return Math.round(r<=10?bs(r):bs(10)*Math.pow(1.07,r-10))},zDm=r=>Math.min(55,18+r*1.3),zAc=r=>Math.max(.7,1.1-r*.015),zTot=r=>Math.min(56,Math.round(5+r*2.4)),ZW=2.2,ZE=3,RGB=3000,FACE={s:0,n:Math.PI,e:Math.PI/2,w:-Math.PI/2};
const zMe=()=>netOn?myId:'solo',zCli=()=>netOn&&!isHost;

/* ---------- the arsenal: everything in the weapon table except the streak-only guns and the starter pistol can come out of the box, so a weapon added to the game later shows up here by itself ---------- */
const ZSKIP=['MNG','GL','FT','CT'],zPoolKeys=()=>Object.keys(W).filter(k=>!ZSKIP.includes(k)&&k!='RG');
const ZWP={MP:600,MG:800,SG:1000,SMG:1000,DS:1750,AR:1500,VMP:1500,BR:1800,MVR:1800,TRB:2000,TUR:2250,CY:2500,SN:2800,RL:4500};
const zWallCost=k=>ZWP[k]||Math.round(Math.max(1000,Math.min(3000,W[k].d*(1/W[k].r)*8)));
const ZMELEE={NF:'Nitrogen Fists',KT:'Katana'},ZMELCOST={KT:1500};
const zItemName=k=>ZMELEE[k]||(W[k]?W[k].n:k);
const zAmmoTier=w=>[500,2000,4000][Math.min(2,w.pap||0)];
const zAmmoFull=w=>w.mag>=w.m&&w.res>=w.m*(w.rs==null?4:w.rs);
const zAmmoPrice=(w,wall)=>(w.pap||0)>0?zAmmoTier(w):wall?Math.max(250,Math.round(zWallCost(w.k)/2)):zAmmoTier(w);


/* ---------- power-ups: zombies drop glowing pickups when they die. Walk into one to take it (in co-op it helps everybody).
   Max Ammo (all weapons and frags refilled), Insta-Kill (30s: any hit kills), Double Points (30s), Nuke (every zombie dies, +400 points for everyone),
   Fire Sale (30s: the Mystery Box costs 10) and Full Restore (health and shield maxed).
   Drop rate: about 3% per kill, climbing by 0.35% for every kill without a drop (so roughly one drop per 12 to 16 kills), never closer than 15s apart and at most 4 a round.
   The host rolls the drops and decides who picked them up; every client applies the effect to itself. Drops vanish after 30s (they blink for the last 8). ---------- */
const ZPU={ammo:{n:'MAX AMMO',s:'All weapons refilled',c:0x40ff70,w:22,i:'A'},insta:{n:'INSTA-KILL',s:'Every hit kills for 30 seconds',c:0xff3040,w:22,i:'☠'},dbl:{n:'DOUBLE POINTS',s:'Double points for 30 seconds',c:0xffd040,w:22,i:'2X'},
 nuke:{n:'NUKE',s:'Every zombie dies · +400 points',c:0xffa020,w:12,i:'☢'},fire:{n:'FIRE SALE',s:'Mystery Box costs 10 for 30 seconds',c:0xff4aa0,w:8,i:'$'},heal:{n:'FULL RESTORE',s:'Health and shield maxed',c:0x4ac8ff,w:10,i:'+'}};
const zBoxCost=()=>zq&&zq.pu&&zq.pu.fire>0?10:950,zGain=n=>{zq.pts+=zq.pu&&zq.pu.dbl>0?n*2:n};
let zPuKit=null;
function zPuGear(){if(zPuKit)return zPuKit;const gl=zTex(64,64,(g,w,h)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.35,'rgba(255,255,255,.35)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,w,h)});
 return zPuKit={gl,orb:new THREE.SphereGeometry(.52,20,14),ring:new THREE.TorusGeometry(.66,.02,6,44),beam:new THREE.CylinderGeometry(.14,.46,9,16,1,true),disc:new THREE.CircleGeometry(1.15,24),bx:new THREE.BoxGeometry(1,1,1),sp:new THREE.SphereGeometry(1,12,9),cy:new THREE.CylinderGeometry(1,1,1,12),cone:new THREE.ConeGeometry(1,1,10),pl:new THREE.PlaneGeometry(1,1)}}
const zPuMat=(c,o)=>new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:o,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide});
function zPuIcon(k,c){const K=zPuGear(),g=new THREE.Group(),Lm=(col,em)=>new THREE.MeshLambertMaterial({color:col,emissive:em==null?0:em}),
 add=(geo,mat,x,y,z,sx,sy,sz,rx,ry,rz)=>{const m=new THREE.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);m.scale.set(sx==null?1:sx,sy==null?1:sy,sz==null?1:sz);m.rotation.set(rx||0,ry||0,rz||0);g.add(m);return m};
 if(k=='ammo'){add(K.bx,Lm(0x4a5a2a,0x0a1004),0,-.12,0,.56,.28,.38);add(K.bx,Lm(0x2e3a1a),0,.03,0,.6,.04,.42);for(const x of[-.26,.26])add(K.bx,Lm(0x2a2a22),x,-.12,0,.04,.3,.4);for(let i=0;i<6;i++){const x=-.23+i*.092;add(K.cy,Lm(0xc9a23a,0x3a2a08),x,.18,0,.032,.17,.032);add(K.cone,Lm(0xb06a2a,0x2a1004),x,.32,0,.032,.11,.032)}add(K.bx,Lm(0x40ff70,0x40ff70),0,-.12,.196,.3,.07,.01);add(K.bx,Lm(0x40ff70,0x40ff70),0,-.12,-.196,.3,.07,.01);add(K.bx,Lm(0x9a9a8a),0,.05,.215,.1,.04,.02)}
 else if(k=='insta'){const bone=Lm(0xe4dcc4,0x201c14);add(K.sp,bone,0,.06,0,.22,.2,.23);add(K.sp,bone,0,-.07,.06,.15,.1,.13);add(K.bx,bone,0,-.17,.04,.17,.07,.15);for(const s of[-1,1]){add(K.sp,Lm(0x050505),s*.075,.04,.19,.06,.07,.04);add(K.sp,Lm(0xff2030,0xff2030),s*.075,.04,.215,.025,.025,.02)}add(K.cone,Lm(0x050505),0,-.03,.21,.03,.06,.025,Math.PI);for(let i=0;i<6;i++)add(K.bx,Lm(0xf4efe0),-.065+i*.026,-.19,.115,.022,.04,.02);add(K.cy,bone,-.3,-.12,0,.03,.34,.03,0,0,.9);add(K.cy,bone,.3,-.12,0,.03,.34,.03,0,0,-.9);add(K.sp,bone,-.4,.04,0,.05,.05,.05);add(K.sp,bone,.4,.04,0,.05,.05,.05)}
 else if(k=='dbl'){const t=zTex(256,160,(x,w,h)=>{x.font='900 130px Teko,Impact,sans-serif';x.textAlign='center';x.textBaseline='middle';x.lineWidth=14;x.strokeStyle='#5a3a00';x.strokeText('2X',128,86);const gr=x.createLinearGradient(0,20,0,150);gr.addColorStop(0,'#fff6b0');gr.addColorStop(1,'#ffb000');x.fillStyle=gr;x.fillText('2X',128,86)});const pm=new THREE.MeshBasicMaterial({map:t,transparent:true,side:THREE.DoubleSide,depthWrite:false});add(K.pl,pm,0,.05,0,.82,.5,1);add(K.pl,pm,0,.05,0,.82,.5,1,0,Math.PI/2,0);for(const[a,y]of[[0,-.26],[2.1,-.3],[4.2,-.22]])add(K.cy,Lm(0xe0b020,0x5a3a00),Math.cos(a)*.26,y,Math.sin(a)*.26,.12,.025,.12,.5,a,0)}
 else if(k=='nuke'){add(K.cy,Lm(0x14140e),0,0,0,.34,.03,.34,Math.PI/2);add(K.cy,Lm(0x14140e),0,0,0,.34,.03,.34,Math.PI/2,0,0).position.z=-.02;const y=Lm(0xffcc20,0xffa010);for(let i=0;i<3;i++){const m=new THREE.Mesh(new THREE.RingGeometry(.1,.3,18,1,i*Math.PI*2/3+.2,Math.PI/3*1.15),new THREE.MeshBasicMaterial({color:0xffcc20,side:THREE.DoubleSide}));m.position.z=.02;g.add(m);const m2=m.clone();m2.position.z=-.04;g.add(m2)}add(K.sp,Lm(0xffcc20,0xffa010),0,0,.03,.07,.07,.02);add(K.sp,Lm(0xffcc20,0xffa010),0,0,-.05,.07,.07,.02);const ring=new THREE.Mesh(new THREE.TorusGeometry(.36,.025,6,30),new THREE.MeshBasicMaterial({color:0xffcc20}));g.add(ring);add(K.cy,Lm(0x3a3a30),0,-.34,0,.1,.18,.1);add(K.cone,Lm(0xb0b0a0),0,-.5,0,.1,.14,.1,Math.PI)}
 else if(k=='fire'){add(K.bx,Lm(0x5a3a1a,0x100804),0,-.15,0,.5,.22,.34);add(K.cy,Lm(0x6a4a24,0x100804),0,-.04,0,.17,.5,.17,0,0,Math.PI/2);for(const x of[-.18,.18])add(K.bx,Lm(0xc9a23a,0x3a2a08),x,-.12,0,.045,.3,.36);add(K.bx,Lm(0xc9a23a,0x3a2a08),0,-.06,.17,.07,.07,.02);const t=zTex(128,128,(x,w,h)=>{x.font='900 120px Teko,Impact,sans-serif';x.textAlign='center';x.textBaseline='middle';x.lineWidth=12;x.strokeStyle='#4a0020';x.strokeText('$',64,70);x.fillStyle='#ff6ab8';x.fillText('$',64,70)});const pm=new THREE.MeshBasicMaterial({map:t,transparent:true,side:THREE.DoubleSide,depthWrite:false});add(K.pl,pm,0,.28,0,.4,.4,1);add(K.pl,pm,0,.28,0,.4,.4,1,0,Math.PI/2,0)}
 else{const m=Lm(0xe8f8ff,0x40a8e0);add(K.bx,m,0,0,0,.42,.13,.13);add(K.bx,m,0,0,0,.13,.42,.13);add(K.bx,Lm(0x40c8ff,0x40c8ff),0,0,.07,.3,.06,.02);add(K.bx,Lm(0x40c8ff,0x40c8ff),0,0,.07,.06,.3,.02)}
 return g}
function zPuModel(k){const K=zPuGear(),def=ZPU[k],c=def.c,g=new THREE.Group(),core=new THREE.Group();core.add(zPuIcon(k,c));g.add(core);
 const orb=new THREE.Mesh(K.orb,zPuMat(c,.17));g.add(orb);const ring=new THREE.Mesh(K.ring,zPuMat(c,.8));ring.rotation.x=Math.PI/2.6;g.add(ring);const ring2=new THREE.Mesh(K.ring,zPuMat(0xffffff,.45));ring2.scale.setScalar(.82);ring2.rotation.x=-Math.PI/2.8;ring2.rotation.y=.7;g.add(ring2);
 const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:K.gl,color:c,transparent:true,opacity:.75,blending:THREE.AdditiveBlending,depthWrite:false}));halo.scale.set(2.6,2.6,1);g.add(halo);
 return{g,core,orb,ring,ring2,halo}}
function zPuOk(x,z){for(const b of bx){if(b.pl)continue;if(x>b.x0-.3&&x<b.x1+.3&&z>b.z0-.3&&z<b.z1+.3&&b.h>.9&&(b.y0||0)<1.2)return false}return true}
function zPuTry(b){const z=zq;if(!z||zCli())return;z.puKills++;if(z.puCd>0||z.puRound>=4)return;if(Math.random()>.03+.0035*z.puKills)return;
 const pool=Object.keys(ZPU).filter(k=>k!=z.puLast&&!(k=='insta'&&z.pu.insta>0)&&!(k=='dbl'&&z.pu.dbl>0)&&!(k=='fire'&&z.pu.fire>0));let tot=0;for(const k of pool)tot+=ZPU[k].w;let r=Math.random()*tot,k=pool[0];for(const q of pool){r-=ZPU[q].w;if(r<=0){k=q;break}}
 let x=b.x,zz=b.z;if(!zPuOk(x,zz)){let ok=0;for(let i=0;i<10&&!ok;i++){const a=i/10*6.28,d=1+i*.25;if(zPuOk(b.x+Math.cos(a)*d,b.z+Math.sin(a)*d)){x=b.x+Math.cos(a)*d;zz=b.z+Math.sin(a)*d;ok=1}}if(!ok){x=P.x;zz=P.z}}
 z.puKills=0;z.puCd=15;z.puRound++;z.puLast=k;const id=z.puId++;zPuSpawn(id,k,x,zz);if(netOn)netSend({t:'zpu',id,k,x,z:zz})}
function zPuSpawn(id,k,x,z){const m=zPuModel(k),def=ZPU[k];m.g.position.set(x,.2,z);(zG||S).add(m.g);zq.drops.push({id,k,m,x,z,t:0,life:30,y:.2,ph:Math.random()*6,sp:0});
 const p=V(x,.6,z);burst(p,22,def.c,6,.7,.12);burst(p,8,0xffffff,8,.4,.07);beep(700,.08,'triangle',.06);setTimeout(()=>beep(1050,.1,'triangle',.06),70);const d=Math.hypot(P.x-x,P.z-z);if(d<30)msg(def.n+' dropped',1.2)}
function zPuRemove(d){(zG||S).remove(d.m.g);const i=zq.drops.indexOf(d);if(i>=0)zq.drops.splice(i,1)}
function zPuTick(dt){const z=zq;zNukeTick(dt);if(z.puCd>0)z.puCd-=dt;const pu=z.pu;
 for(const k of['insta','dbl','fire'])if(pu[k]>0){pu[k]-=dt;if(pu[k]<=0){pu[k]=0;beep(300,.25,'sawtooth',.07);setTimeout(()=>beep(200,.3,'sawtooth',.07),120);msg(ZPU[k].n+' ended',1.4)}else if(pu[k]<5&&((pu[k]*3)|0)!=((pu[k]*3+dt*3)|0))beep(1200,.03,'square',.03)}
 document.body.classList.toggle('zinsta',pu.insta>0);
 for(let i=z.drops.length-1;i>=0;i--){const d=z.drops[i],m=d.m,c=ZPU[d.k].c;d.t+=dt;d.life-=dt;const u=Math.min(1,d.t/.7),e=1-Math.pow(1-u,3),over=Math.sin(u*Math.PI)*.35;d.y=.2+(1.15-.2)*e+over;
  m.g.position.set(d.x,d.y+Math.sin(d.t*2.6+d.ph)*.1,d.z);m.core.rotation.y=d.t*2.2;m.core.rotation.z=Math.sin(d.t*1.3)*.12;m.ring.rotation.z=d.t*2.8;m.ring2.rotation.z=-d.t*2.1;const pl=1+Math.sin(d.t*5)*.06;m.orb.scale.setScalar(pl*Math.min(1,d.t*4));m.halo.material.opacity=.6+Math.sin(d.t*6+d.ph)*.18;
  d.sp-=dt;if(d.sp<=0){d.sp=.1;const a=Math.random()*6.28;burst(V(d.x+Math.cos(a)*.5,d.y+Math.random()*.8-.3,d.z+Math.sin(a)*.5),1,c,.8,.7,.07)}
  if(d.life<8){const f=d.life<3?9:4.5;m.g.visible=((d.life*f)|0)%2==0}
  if(d.life<=0){zPuRemove(d);continue}
  if(!zCli()){for(const p of zPlayers()){if(Math.hypot(p.x-d.x,p.z-d.z)<1.35&&Math.abs((p.y||0)+.9-d.y)<2.1){zPuCollect(d,p.id);break}}}}}
function zPuCollect(d,by){zPuRemove(d);zPuApply(d.k,by);if(netOn)netSend({t:'zpc',id:d.id,k:d.k,by})}
function zPuApply(k,by){const z=zq,def=ZPU[k],mine=by==zMe(),who=mine?'':' · '+((names&&names[by])||'a teammate');popup(def.n,def.s+who);const c=def.c;const q=V(P.x,1.1,P.z);burst(q,40,c,9,.8,.13);burst(q,16,0xffffff,12,.5,.08);shake=Math.max(shake,.25);LX.fx.pulse=Math.max(LX.fx.pulse,.7);flashL=Math.max(flashL||0,1.2);
 if(k=='ammo'){for(const w of wp){w.mag=w.m;w.res=w.m*(w.rs==null?4:w.rs)}rel=0;gc=3;[523,659,784,1047].forEach((f,i)=>setTimeout(()=>beep(f,.12,'triangle',.08),i*70))}
 else if(k=='insta'){z.pu.insta=30;beep(90,.6,'sawtooth',.14);setTimeout(()=>beep(1400,.25,'square',.07),80);setTimeout(()=>beep(700,.3,'square',.07),220);LX.fx.ca=1}
 else if(k=='dbl'){z.pu.dbl=30;[880,1100,1320,1760].forEach((f,i)=>setTimeout(()=>beep(f,.1,'sine',.08),i*55))}
 else if(k=='fire'){z.pu.fire=30;[660,880,660,880,1320].forEach((f,i)=>setTimeout(()=>beep(f,.14,'triangle',.08),i*90))}
 else if(k=='heal'){P.hp=P.mhp;P.sh=P.msh;LX.fx.heal=1;[392,523,659].forEach((f,i)=>setTimeout(()=>beep(f,.2,'sine',.08),i*100))}
 else if(k=='nuke'){z.pts+=400;floatTxt(V(P.x,2.4,P.z),'+400','#ffa020');noise(.9,120,.7);beep(55,.9,'sawtooth',.18);setTimeout(()=>beep(40,1.1,'square',.12),200);shake=Math.max(shake,.9);LX.fx.flash=1;LX.fx.boom=1;flashL=3;zNuke()}}
/* the nuke: a shockwave of death rolls outwards from whoever grabbed it. Nobody is paid per kill, everybody gets the flat 400 */
function zNuke(){if(zCli())return;const q=zq.nukeQ=zq.nukeQ||[];for(const b of bots){if(!b.zom||!b.al||b.zp)continue;q.push({b,t:Math.min(1.1,Math.hypot(b.x-P.x,b.z-P.z)*.032)})}}
function zNukeTick(dt){const q=zq.nukeQ;if(!q||!q.length)return;for(let i=q.length-1;i>=0;i--){const e=q[i];e.t-=dt;if(e.t>0)continue;q.splice(i,1);const b=e.b;if(!b.al)continue;b.al=0;b.atk=0;b.hp=0;zdead.push({b,t:0});const a=Math.random()*6.28;ragStart(b,Math.cos(a)*5,Math.sin(a)*5,9+Math.random()*4);const p=V(b.x,1.1,b.z);burst(p,22,0xffa020,10,.8,.16);burst(p,10,0xff4020,7,.6,.2);burst(p,8,0x222222,5,1.1,.24)}}

/* ---------- small helpers ---------- */
const zTex=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)};
function zSprite(txt,col,sz,depth){const c=document.createElement('canvas');c.width=256;c.height=64;const t=new THREE.CanvasTexture(c),s=new THREE.Sprite(new THREE.SpriteMaterial({map:t,transparent:true,depthTest:!!depth}));s.scale.set(sz*4,sz,1);s.userData={c,t};zSet(s,txt,col);return s}
function zSet(s,txt,col){const g=s.userData.c.getContext('2d');g.clearRect(0,0,256,64);g.font='700 40px Teko,Impact,sans-serif';g.textAlign='center';g.textBaseline='middle';g.lineWidth=5;g.strokeStyle='#000';g.strokeText(txt,128,34);g.fillStyle=col;g.fillText(txt,128,34);s.userData.t.needsUpdate=true}
const hex=c=>'#'+c.toString(16).padStart(6,'0'),zf=m=>{beep(140,.2,'sawtooth',.07);msg(m,1)};
function zSolid(x,z,w,d,h){const b={x0:x-w/2,x1:x+w/2,z0:z-d/2,z1:z+d/2,h,y0:0};bx.push(b);return b}
function zUnsolid(b){const i=bx.indexOf(b);if(i>=0)bx.splice(i,1);zGrid()}
/* purchase juice: coins fly, a chime rings, the price floats up and the screen pulses */
function zBuyFx(x,y,z,col,txt){const p=V(x,y,z);burst(p,26,col||0xffd24a,6,.7,.1);burst(p,10,0xffffff,9,.4,.06);if(txt)floatTxt(V(x,y+.5,z),txt,'#'+(col||0xffd24a).toString(16).padStart(6,'0'));beep(880,.08,'triangle',.07);setTimeout(()=>beep(1320,.12,'triangle',.07),70);setTimeout(()=>beep(1760,.16,'sine',.05),150);shake=Math.max(shake,.12);flashL=Math.max(flashL||0,.6);if(typeof estBuy=='function')estBuy(x,z)}

/* ---------- weapons the player holds ---------- */
function zGunObj(k){const w={k,...eff(k,[])};w.mag=w.m;w.rs=k=='RG'?3:(w.rs==null?4:w.rs);w.res=w.m*w.rs;return w}
function zGive(k){if(ZMELEE[k])return zGiveMel(k);const w=zGunObj(k),i=wp.findIndex(x=>x.k==k);MV.eq=0;if(i>=0){wp[i]=w;cur=i}else if(wp.length<zq.cap){wp.push(w);cur=wp.length-1}else wp[cur]=w;rel=0;setGun();msg(W[k].n,1.5)}
function zGiveMel(k){const n=ZMELEE[k];zq.mel={k:n,pap:0};zq.dash.cd=0;zq.dash.t=0;zPaintHands();popup(n.toUpperCase(),k=='NF'?'Hold V to draw them. Aim = DASH':'Hold V to draw it');beep(300,.3,'sawtooth',.1);setTimeout(()=>beep(900,.3,'triangle',.1),150);burst(V(P.x,1.2,P.z),30,k=='NF'?0x55ccff:0xffffff,7,.6,.12);shake=Math.max(shake,.4)}
function zPick(by){const own=by==zMe()?wp.map(w=>w.k):[],rareG=Math.random()<.03&&!own.includes('RG'),rareN=Math.random()<.03&&(!zq||zq.mel.k!='Nitrogen Fists')&&!(MAPS[sel.map]&&MAPS[sel.map].nf===0);if(rareG)return 'RG';if(rareN)return 'NF';if(zq&&zq.tea&&!own.includes('TEA')&&Math.random()<.045)return 'TEA';const pool=zPoolKeys().filter(k=>!own.includes(k));return pool.length?pool[Math.random()*pool.length|0]:'SMG'}
function zPap(w){const B=W[w.k],t=(w.pap||0)+1;w.pap=t;w.pm=t==1?2.2:3.6;if(w.k=='RG')w.pm=t==1?3:6;w.m=Math.round(B.m*(t==1?1.5:2));w.r=B.r*(t==1?.9:.8);w.pn=B.n+(t==1?' PaP':' PaP II');w.mag=w.m;w.res=w.m*w.rs;rel=0;setGun()}
const _zsg=setGun;setGun=function(){_zsg.apply(this,arguments);gf.material.color.setHex(mode=='Zombies'&&cw()&&cw().pap?0xc080ff:0xffdd66)};

/* ---------- Pack-a-Punch camos: unique to the Hollow Estate. Tier I is Haunted Mahogany (polished wood with pulsing violet runes), tier II is Gilded Wraith (black lacquer, gold filigree, drifting spectral fog).
   They are live shaders, applied to the weapon when it comes out of the machine, and they do not touch your Multiplayer camo choices. ---------- */
const PAP_FS=`uniform float t;uniform float k;varying vec3 vN;varying vec3 vV;varying vec3 vP;
float hash(vec3 p){p=fract(p*0.3183099+vec3(0.1,0.2,0.3));p*=17.0;return fract(p.x*p.y*p.z*(p.x+p.y+p.z));}
float noise(vec3 x){vec3 i=floor(x);vec3 f=fract(x);f=f*f*(3.0-2.0*f);
 return mix(mix(mix(hash(i),hash(i+vec3(1.0,0.0,0.0)),f.x),mix(hash(i+vec3(0.0,1.0,0.0)),hash(i+vec3(1.0,1.0,0.0)),f.x),f.y),
 mix(mix(hash(i+vec3(0.0,0.0,1.0)),hash(i+vec3(1.0,0.0,1.0)),f.x),mix(hash(i+vec3(0.0,1.0,1.0)),hash(i+vec3(1.0,1.0,1.0)),f.x),f.y),f.z);}
float fbm(vec3 p){float a=0.5;float s=0.0;for(int i=0;i<4;i++){s+=a*noise(p);p=p*2.03+vec3(1.7,9.2,3.1);a*=0.5;}return s;}
void main(){
 vec3 N=normalize(vN);vec3 V=normalize(vV);
 float nl=0.45+0.55*max(dot(N,normalize(vec3(0.3,0.8,0.6))),0.0);
 float fr=pow(1.0-max(dot(N,V),0.0),3.0);
 vec3 p=vP*7.0;vec3 col=vec3(0.0);
 if(k<0.5){
  float gr=fbm(vec3(p.x*0.7,p.y*5.5,p.z*0.7));
  float ring=0.5+0.5*sin(gr*24.0+p.x*1.5);
  vec3 wood=mix(vec3(0.20,0.06,0.035),vec3(0.52,0.20,0.09),ring*0.8+gr*0.3);
  float vr=smoothstep(0.35,0.9,sin(p.z*1.1+gr*3.0)*0.5+0.5);wood*=0.75+0.35*vr;
  float vein=abs(fbm(p*0.55+vec3(0.0,t*0.12,t*0.05))-0.5);
  float glow=0.018/(vein+0.02);
  float pulse=0.55+0.45*sin(t*1.8+p.x*0.6);
  col=wood*nl*(0.9+0.4*pow(1.0-max(dot(N,V),0.0),1.5));
  col+=vec3(0.55,0.15,1.0)*glow*0.34*pulse+vec3(0.9,0.6,1.0)*pow(glow,2.0)*0.015;
  float sp=0.0;
  col+=vec3(0.45,0.12,0.9)*fr*0.8;
 }else{
  float fil=abs(sin((p.x+sin(p.y*1.7+p.z*0.9)*0.9)*3.2))*abs(sin((p.z+cos(p.y*1.3)*0.8)*3.0));
  float line=smoothstep(0.1,0.0,fil-0.04);
  float leaf=smoothstep(0.55,0.5,abs(sin(p.x*5.0+p.y*3.0)*cos(p.z*4.5-p.y*2.0)));
  vec3 base=vec3(0.015,0.015,0.02)+vec3(0.02,0.03,0.05)*fbm(p*0.7);
  vec3 gold=mix(vec3(0.55,0.36,0.08),vec3(1.0,0.84,0.38),0.5+0.5*sin(p.y*3.0+t*1.2));
  float fog=fbm(p*0.9+vec3(t*0.18,-t*0.1,t*0.12));
  col=base+gold*(line*0.95+leaf*0.35)*nl;
  col+=vec3(0.1,0.7,0.65)*pow(fog,2.2)*0.55;
  float em=0.0;
  col+=vec3(0.9,0.7,0.25)*fr*0.7+vec3(0.1,0.8,0.7)*fr*fr*0.5;
 }
 gl_FragColor=vec4(clamp(col,0.0,1.0),1.0);
}`;
const PAPC=['Haunted Mahogany','Gilded Wraith'];
function zPapMat(t){const n=PAPC[Math.min(2,t)-1];if(!rfm[n])rfm[n]=new THREE.ShaderMaterial({uniforms:{t:{value:0},k:{value:t>1?1:0}},vertexShader:CAMO_VS,fragmentShader:PAP_FS});return rfm[n]}
function zPapCamo(k){const w=typeof cw=='function'?cw():null;return zomOn()&&w&&w.k==k&&w.pap?zPapMat(w.pap):null}
/* the bare hands (and Nitrogen gauntlets) pick up the same camo once the melee weapon is Pack-a-Punched */
function zPaintHands(){const t=zq&&zq.mel?zq.mel.pap||0:0;for(const s of['r','l']){const a=fpArm[s];if(!a||!a.hand)continue;a.hand.traverse(o=>{if(!o.isMesh)return;if(!o.userData.m0)o.userData.m0=o.material;o.material=t?zPapMat(t):o.userData.m0})}}

/* ---------- melee: Fists by default, Nitrogen Fists from the box, a Katana off the wall. All of them can be Pack-a-Punched (tier I and II). ---------- */
const zMelKey=()=>zq&&zq.mel?zq.mel.k:'Fists';
function zMeleeStats(m){const t=zq.mel.pap||0,s={...m};if(!t)return s;s.reach=m.reach+.3*t;s.cnt=m.cnt+t;s.cd=m.cd*(1-.14*t);return s}
function zMeleeDmg(b,zf){const m=zq.mel,t=m.pap||0;if(m.k=='Nitrogen Fists')return Math.round(3200*[1,2.4,5][t]/(b.big?1.6:1));return Math.max(1,Math.ceil(zMel(b)*zf*[1,2.4,5][t]))}
function zQuickMelee(){if(!zq||zq.papT>0)return;melee()}
const _zme=melee;melee=function(){if(zq&&zq.papT>0)return;return _zme.apply(this,arguments)};
{const _sh=shoot;shoot=function(){if(zq&&mode=='Zombies'&&zq.papT>0)return;return _sh.apply(this,arguments)}}
{const _sr=startRel;startRel=function(){if(zq&&mode=='Zombies'&&zq.papT>0)return;return _sr.apply(this,arguments)}}
function zPapMel(){const m=zq.mel,t=(m.pap||0)+1;m.pap=t;m.pn=m.k+(t==1?' PaP':' PaP II');zPaintHands()}

/* ---------- Nitrogen Fists dash: press the aim button while the gauntlets are drawn. A rocket-driven lunge along your view that smashes everything in the way,
   then a cooldown (shorter once Pack-a-Punched). You cannot be hurt while dashing. ---------- */
const ZD={sp:27,dur:.3,r:1.75};
function zDashIn(on){if(!zq)return;if(!on){zq.dashH=0;return}if(zq.dashH)return;zq.dashH=1;
 if(!zomOn()||zMelKey()!='Nitrogen Fists'||!MV.eq||P.dead||over||paused||zq.papT>0||zq.dash.t>0)return;
 const d=zq.dash;if(d.cd>0){beep(220,.07,'square',.05);msg('Dash recharging '+d.cd.toFixed(1)+'s',.7);return}zDash()}
function zDash(){const d=zq.dash,t=zq.mel.pap||0;d.t=ZD.dur;d.cd=[6,4.5,3.2][t];d.max=d.cd;d.hit=new Set();d.n=0;if(typeof nfStrike=='function')nfStrike();
 noise(.5,500,.5);beep(120,.35,'sawtooth',.12);beep(90,.5,'square',.08);fk=Math.max(fk,2.4);shake=Math.max(shake,.55);LX.fx.speed=1;LX.fx.ca=1;LX.fx.pulse=Math.max(LX.fx.pulse,.6);
 const f=V(-Math.sin(yaw),0,-Math.cos(yaw));for(let i=0;i<3;i++)burst(V(P.x-f.x*.4,.9,P.z-f.z*.4),14,i?0xffffff:0x55ccff,8,.5,.12);if(typeof haptic=='function')haptic(.9,200,.9,'both');popup('NITRO DASH','Smash through them')}
{const _mc=moveCalc;moveCalc=function(){const r=_mc.apply(this,arguments);if(zq&&mode=='Zombies'&&zq.dash&&zq.dash.t>0&&!P.dead){r.f=1;r.s=0;r.spt=false;r.spd=ZD.sp}return r}}
function zDashTick(dt){const d=zq.dash;if(d.cd>0)d.cd=Math.max(0,d.cd-dt);if(d.t<=0)return;d.t-=dt;const f=V(-Math.sin(yaw),0,-Math.cos(yaw)),pap=zq.mel.pap||0;
 d.fi=(d.fi||0)-dt;if(d.fi<=0){d.fi=.1;FI.d=.14;FI.t=.14;FI.side^=1}
 burst(V(P.x-f.x*.9,.6+Math.random()*.8,P.z-f.z*.9),3,Math.random()<.5?0x55ccff:0xffffff,3,.35,.1);
 for(const b of bots){if(!b.zom||!b.al||d.hit.has(b.i)||b.rise>0)continue;const dx=b.x-P.x,dz=b.z-P.z,D=Math.hypot(dx,dz);if(D>ZD.r+(b.big?.5:0)||Math.abs((b.y||0)-(P.y||0))>2.2)continue;
  d.hit.add(b.i);d.n++;src='Melee';srcK='';hitBot(b,Math.round(zMeleeDmg(b,1)*.85),0);if(b.al&&!b.zp){b.stun=1;mv(b,f.x*3.5+(dz>0?.9:-.9)*f.z,f.z*3.5-(dx>0?.9:-.9)*f.x,.45)}
  burst(V(b.x,1.2,b.z),18,0x55ccff,9,.5,.12);burst(V(b.x,1.2,b.z),8,0xffffff,12,.3,.07);beep(1500,.06,'square',.06);noise(.2,700,.35);shake=Math.max(shake,.4);if(typeof haptic=='function')haptic(.7,90,.7,'both');if(typeof nfHit=='function')try{nfHit(1)}catch(e){}}
 if(d.t<=0){d.t=0;LX.fx.pulse=Math.max(LX.fx.pulse,.4);burst(V(P.x,1,P.z),24,0x55ccff,8,.6,.12);if(d.n>1)popup('DASH x'+d.n,'Nitrogen Fists')}}

/* ---------- ammo: wall buys and crates. Nothing restocks by itself. ---------- */
function zBuyAmmo(wall,pos){const w=cw();if(!w||P.dead)return;const c=zAmmoPrice(w,wall);if(zAmmoFull(w))return zf('Ammo is full');if(zq.pts<c)return zf('Not enough points');zq.pts-=c;
 w.mag=w.m;w.res=w.m*(w.rs==null?4:w.rs);rel=0;gc=Math.max(gc,3);if(!wall)gc=3;zBuyFx(pos[0],1.3,pos[1],0x7bf08a,'-'+c);popup('AMMO',(w.pn||W[w.k].n)+' · refilled'+(wall?'':' · frags restocked'))}
function zBuyWall(k,pos){const mel=ZMELEE[k],own=!mel&&wp.find(w=>w.k==k);
 if(own){const c=zAmmoPrice(own,1);if(zAmmoFull(own))return zf('Ammo is full');if(zq.pts<c)return zf('Not enough points');zq.pts-=c;own.mag=own.m;own.res=own.m*(own.rs==null?4:own.rs);rel=0;zBuyFx(pos[0],1.4,pos[1],0x7bf08a,'-'+c);popup('AMMO',(own.pn||W[k].n)+' · refilled');return}
 const c=mel?ZMELCOST[k]:zWallCost(k);if(mel&&zq.mel.k==ZMELEE[k])return zf('You already have it');if(zq.pts<c)return zf('Not enough points');zq.pts-=c;zGive(k);zBuyFx(pos[0],1.4,pos[1],0xffd24a,'-'+c);popup('WEAPON BOUGHT',zItemName(k))}
function zWallTxt(k){const mel=ZMELEE[k],own=!mel&&wp.find(w=>w.k==k);if(own)return zAmmoFull(own)?'':'Ammo for '+(own.pn||W[k].n);if(mel&&zq.mel.k==ZMELEE[k])return '';return 'Buy the '+zItemName(k)+(mel?' (melee)':'')}
function zWallCostNow(k){const mel=ZMELEE[k],own=!mel&&wp.find(w=>w.k==k);return own?(zAmmoFull(own)?0:zAmmoPrice(own,1)):mel?ZMELCOST[k]:zWallCost(k)}

/* ---------- Pack-a-Punch: takes 3 seconds, the machine works on the weapon (you cannot fire or swing meanwhile) and it comes out with a map-specific camo ---------- */
function zPapTarget(){return MV.eq?'mel':'gun'}
function zPapTxt(){const k=zPapTarget();if(zq.papT>0)return 'Pack-a-Punch is working…';if(k=='mel'){const m=zq.mel,t=m.pap||0;return t>=2?'Melee fully upgraded':'Pack-a-Punch the '+(m.pn||m.k)}const w=cw(),t=w.pap||0;return t>=2?'Weapon fully upgraded':'Pack-a-Punch the '+(w.pn||W[w.k].n)+'  (draw your melee with V to upgrade it instead)'}
function zPapCost(){if(zq.papT>0)return 0;const k=zPapTarget(),t=k=='mel'?zq.mel.pap||0:cw().pap||0;return [5000,10000][t]||0}
function zPapAct(pos){if(zq.papT>0)return;const k=zPapTarget(),mel=k=='mel',t=mel?zq.mel.pap||0:cw().pap||0,c=[5000,10000][t];if(!c)return zf('Already fully upgraded');if(zq.pts<c)return zf('Not enough points');
 zq.pts-=c;const tg=mel?null:cw();zq.pap={t:0,dur:3,mel,w:tg,tier:t+1,pos};zq.papT=3;MV.eq=0;gun.visible=false;zBuyFx(pos[0],1.8,pos[1],0xb070ff,'-'+c);beep(200,.6,'sawtooth',.1);if(typeof estPap=='function')estPap(1,zq.pap)}
function zPapTick(dt){const p=zq.pap;if(!p)return;p.t+=dt;zq.papT=Math.max(0,p.dur-p.t);gun.visible=false;
 if(Math.random()<dt*14)burst(V(p.pos[0]+(Math.random()-.5)*1.2,1+Math.random()*1.6,p.pos[1]+(Math.random()-.5)*1.2),2,Math.random()<.5?0xb070ff:0x55aaff,3,.5,.08);
 if(p.t>=p.dur){zq.pap=null;zq.papT=0;gun.visible=true;const mel=p.mel;
  if(mel){zPapMel();popup('PACK-A-PUNCHED',zq.mel.pn+' · '+PAPC[(zq.mel.pap||1)-1])}
  else{const w=p.w;if(w&&wp.includes(w)){zPap(w);popup('PACK-A-PUNCHED',(w.pn||W[w.k].n)+' · '+PAPC[w.pap-1])}else popup('PACK-A-PUNCH','The weapon is gone')}
  beep(300,.15,'sawtooth',.1);setTimeout(()=>beep(900,.3,'triangle',.1),120);setTimeout(()=>beep(1500,.4,'sine',.08),260);shake=Math.max(shake,.5);flashL=2;
  const q=V(P.x,1.2,P.z);burst(q,50,0xb070ff,10,.8,.14);burst(q,24,0xffe9a0,12,.6,.08);LX.fx.pulse=Math.max(LX.fx.pulse,.9);LX.fx.flash=Math.max(LX.fx.flash,.35);if(typeof estPap=='function')estPap(0,p)}}

/* ---------- building the level objects: doors, machines, boxes, wall buys and crates are modelled in js/estate.js; this file only holds their rules ---------- */
function zStart(){document.body.classList.toggle('zom',mode=='Zombies');$('#zh').style.display=mode=='Zombies'?'block':'none';$('#zp').textContent='';zhc='';
 if(zG&&zG.parent)zG.parent.remove(zG);zG=null;zi=[];zdoors=[];zboxes=[];zdead=[];zfls={};zbT=zsT=0;if(mode!='Zombies'){zq=null;zHudShow(0);zPaintHands();return}
 const M=MAPS[sel.map];zq={r:0,pts:500,perks:{},cap:2,revBuys:0,revM:null,st:'prep',tm:6,toSpawn:0,spT:0,open:{0:1},fl:0,cur:null,gn:3,brutes:0,down:0,out:0,dnT:0,rvT:0,ad:0,mp:[],pb:{},mel:{k:'Fists',pap:0},dash:{t:0,cd:0,max:6,hit:null},dashH:0,papT:0,pap:null,guts:[],decals:[],elev:{},pu:{insta:0,dbl:0,fire:0},drops:[],puKills:0,puCd:8,puRound:0,puLast:null,puId:1};
 MV.eq=0;wp=[zGunObj('CT')];cur=0;rel=0;gc=2;P.mhp=50;P.hp=50;P.msh=50;P.sh=50;setGun();zPaintHands();
 if(netOn){const k=Object.keys(names).sort().indexOf(myId);P.x+=(k%2?1.6:-1.6);P.z+=(k>1?1.6:0)}
 zG=new THREE.Group();mapG.add(zG);if(typeof estObjects=='function')estObjects(M);zGrid();zHudInit();document.body.classList.remove('zinsta')}
/* doors: the model, hinges and the opening animation are built in estate.js (estDoor); the rules are here */
function zDoorRule(o,d,idx){zdoors.push(o);zi.push({x:d.x,z:d.z,r:3.6,txt:()=>o.open?'':'Open the '+d.n,cost:()=>o.open?0:d.c,act:()=>{if(o.open)return;if(zq.pts<d.c)return zf('Not enough points');if(zCli())return void netSend({t:'zqd',i:idx});zq.pts-=d.c;zOpenDoor(idx,zMe())}})}
function zOpenDoor(i,by){const o=zdoors[i];if(!o||o.open)return;o.open=1;zUnsolid(o.box);const M=MAPS[sel.map];zq.open[o.d.a]=zq.open[o.d.b]=1;for(let n=0;n<3;n++)for(const[p,q]of M.links||[])if(zq.open[p]||zq.open[q])zq.open[p]=zq.open[q]=1;zq.fl=0;
 beep(200,.4,'sawtooth',.09);noise(.6,300,.5);shake=Math.max(shake,.45);msg(o.d.n+' unlocked',1.8);if(typeof estDoorOpen=='function')estDoorOpen(o);if(netOn&&isHost)netSend({t:'zd',i,by})}
function zPerk(t){const p=PERKS[t];if(zq.perks[t])return zf('You already have '+p.n);if(t=='rev'&&zq.revBuys>=4)return zf('Out of stock');if(zq.pts<p.cost)return zf('Not enough points');zq.pts-=p.cost;zq.perks[t]=1;
 if(t=='vit'){P.mhp=100;P.hp=100}if(t=='mule')zq.cap=3;
 if(t=='rev'){if(zCli())netSend({t:'zqr'});else{zq.revBuys++;zRevCount(zq.revBuys);if(netOn)netSend({t:'zrev',n:zq.revBuys})}}
 beep(520,.1,'triangle',.08);setTimeout(()=>beep(780,.15,'triangle',.08),90);popup(p.n.toUpperCase(),p.t);flashL=Math.max(flashL||0,1);LX.fx.heal=Math.max(LX.fx.heal,.5);if(typeof estPerk=='function')estPerk(t)}
/* the Revive Soda machine runs dry after four purchases (counted across every player) */
function zRevCount(n){zq.revBuys=n;const o=zq.revM;if(n>=4&&o&&!o.o.gone){o.g.visible=false;o.o.gone=1;zUnsolid(o.bxo);setTimeout(()=>msg('The Revive Soda machine is empty',2),1800)}}
/* mystery box rules (the chest, its lid and the floating weapon are in estate.js) */
function zBoxAct(o,i){if(o.st==0){const bc=zBoxCost();if(zq.pts<bc)return zf('Not enough points');if(zCli())return void netSend({t:'zqb',i});zq.pts-=bc;zBoxStart(o,i,zMe())}
 else if(o.st==2&&o.by==zMe()){zGive(o.item);if(zCli())netSend({t:'zqe',i});zBoxEnd(o,i)}}
function zBoxStart(o,i,by){o.st=1;o.t=0;o.cy=0;o.by=by;if(typeof EST!='undefined'&&EST.bx&&(!netOn||isHost))EST.bx.uses++;beep(300,.2,'triangle',.08);if(typeof estBoxState=='function')estBoxState(o,1);if(netOn&&isHost)netSend({t:'zbs',i,st:1,by})}
function zBoxEnd(o,i){o.st=0;o.beam.visible=o.lab.visible=false;if(typeof estBoxState=='function')estBoxState(o,0);if(netOn&&isHost)netSend({t:'zbs',i,st:0})}
function zBoxTick(o,i,dt,auth){if(o.st==1){o.t+=dt;o.cy-=dt;o.beam.visible=o.lab.visible=true;if(o.cy<=0){o.cy=.12;const pool=[...zPoolKeys(),'RG',...(MAPS[sel.map]&&MAPS[sel.map].nf===0?[]:['NF']),...(zq.tea?['TEA']:[])],k=pool[Math.random()*pool.length|0];zSet(o.lab,zItemName(k),'#ffd24a');if(typeof estBoxShow=='function')estBoxShow(o,k);beep(500+Math.random()*300,.05,'square',.03)}
  if(auth&&o.t>3.2&&typeof EST!='undefined'&&EST.bx&&EST.bx.uses>=EST.bx.thr&&zboxes.length>1){zBoxMoveStart(o,i);return}
  if(auth&&o.t>3.2){o.item=zPick(o.by);o.st=2;o.t=0;zSet(o.lab,zItemName(o.item),o.item=='RG'||o.item=='NF'?'#ff4a4a':'#7bf08a');if(typeof estBoxShow=='function')estBoxShow(o,o.item,1);beep(900,.2,'triangle',.09);if(netOn&&isHost)netSend({t:'zbs',i,st:2,item:o.item,by:o.by})}}
 else if(o.st==2&&auth){o.t+=dt;if(o.t>9)zBoxEnd(o,i)}
 else if(o.st==3){o.t+=dt;if(auth&&o.t>2.6)zBoxRelocate(o,i)}}
function zBoxMoveStart(o,i){o.st=3;o.t=0;zSet(o.lab,'THE BOX IS MOVING!','#ff4a4a');o.beam.visible=o.lab.visible=true;if(o.by==zMe())zq.pts+=zBoxCost();beep(120,.5,'sawtooth',.1);setTimeout(()=>beep(90,.5,'sawtooth',.1),260);if(netOn&&isHost)netSend({t:'zbs',i,st:3,by:o.by})}
function zBoxRelocate(o,i){const c=zboxes.map((_,j)=>j).filter(j=>j!=i),j=c[Math.random()*c.length|0];o.st=0;o.beam.visible=o.lab.visible=false;estBoxGo(j);msg('The Mystery Box has moved',2.8);if(netOn&&isHost)netSend({t:'zbl',i:j})}

/* ---------- navigation: a coarse grid and a flow field towards each player ---------- */
function zGrid(){navBuild();zgr=NAV}
function zFlow(pl){return navFlow(pl.x,pl.z)}
/* everyone the zombies can attack: the host and every connected player who is on their feet */
function zPlayers(){const a=[];if(!P.dead)a.push({id:zMe(),x:P.x,z:P.z,y:P.y,me:1});if(netOn)for(const b of bots)if(b.net&&!b.hb&&b.al)a.push({id:b.id,x:b.x,z:b.z,y:b.y||0});return a}

/* ---------- zombies ---------- */
function zModel(r,big){const m=new THREE.Group(),t=Math.min(3,r/5|0),pk=a=>a[Math.random()*a.length|0],
 rig=mkHuman(m,{zombie:1,skin:[0xa9b98a,0xb3b58a,0xa89aa8,0xb27a62][t],shirt:big?0x5a1a14:pk([0x5a6a7a,0x6a5a4a,0x4a5a46,0x7a6a5a,0x3a3a44,0x6a4a4a]),pants:pk([0x2f3340,0x3a3a30,0x4a3f35,0x26282c]),hair:pk([0x1a1410,0x2a2018,0x3a342a]),eye:r>=15?0xff9a2a:0xff2a2a});
 S.add(m);if(big)m.scale.setScalar(1.35);return{m,rig}}
const zOutdoor=(M,x,z)=>(M.outdoor||[]).some(o=>x>o[0]&&x<o[2]&&z>o[1]&&z<o[3]);
function mkZombie(x,z,big){const r=zq.r,{m,rig}=zModel(r,big),hp=Math.round(zHp(r)*(big?3:1)),run=r>=25||(r>=6&&Math.random()<Math.min(.6,(r-5)*.06)),M=MAPS[sel.map],out=zOutdoor(M,x,z),
 b={i:botId++,m,rig,x,z,y:0,hp,mhp:hp,sh:0,msh:0,lh:-9,al:1,team:'z',zom:1,big:!!big,nm:big?'Brute':'Zombie',cd:.5,k:0,df:1,dm:Math.min(zDm(r)*(big?1.5:1),big?70:55),ac:zAc(r),run,sp:(Math.min(4.2,1.6+r*.11+Math.random()*.5)+(run?1:0))*(big?.75:1),rise:big?1.3:1,riseD:big?1.3:1,riseY:out?-1.9:0,atk:0,at:0,atd:.7,atype:0};
 m.position.set(x,b.riseY,z);zGutHand(b);bots.push(b);const p=V(x,.4,z);burst(p,big?34:18,out?0x5a4630:0x8a8478,5,.9,.16);burst(p,6,out?0x3a2a1a:0x555049,3,1.1,.22);if(out)noise(.5,160,.3);else noise(.3,420,.18);return b}
function zPuppet(i,x,z,big,r){const{m,rig}=zModel(r,big),b={i,m,rig,x,z,tx:x,tz:z,y:0,hp:1e9,mhp:1e9,sh:0,msh:0,lh:-9,al:1,team:'z',zom:1,zp:1,big:!!big,nm:big?'Brute':'Zombie',df:1,k:0,rise:.8,riseD:.8,riseY:0,atk:0,at:0,atd:.65,atype:0};m.position.set(x,0,z);zGutHand(b);bots.push(b);return b}
/* a spawn point is nudged to the nearest free spot so nobody appears inside a table or a statue */
function zFreeSpot(x,z){const g=NAV.g,n=NAV.n;if(!g)return[x,z];const free=(a,b)=>{const i=Math.floor(a+H),j=Math.floor(b+H);return i>0&&j>0&&i<n-1&&j<n-1&&!g[j*n+i]};if(free(x,z))return[x,z];for(let r=.8;r<=6;r+=.6)for(let a=0;a<14;a++){const t=a/14*6.283,px=x+Math.cos(t)*r,pz=z+Math.sin(t)*r;if(free(px,pz))return[px,pz]}return[x,z]}
function zSpawn(M,big){const open=M.zs.filter(s=>zq.open[s[2]]),pl=zPlayers(),far=open.filter(s=>pl.every(p=>Math.hypot(s[0]-p.x,s[1]-p.z)>12)),s=(far.length?far:open)[Math.random()*(far.length||open.length)|0],[x,z]=zFreeSpot(s[0]+(Math.random()-.5)*3,s[1]+(Math.random()-.5)*3);mkZombie(x,z,big)}
/* damage to a zombie: 10 points per hit, kill 50 (60 explosive), headshot kill 100, melee kill 130; the RayGun kills anything.
   Guests send their hits to the host (zqh) and get the kill points back (zk). */
const _zhb=hitBot;hitBot=function(b,d,head){if(b.zom)return zHit(b,d,head);if(mode=='Zombies')return;_zhb(b,d,head)};
function zHit(b,d,head){if(!b.al)return;const w=wp.find(x=>x.k==srcK);if(srcK=='RG')d=RGB*(w&&w.pm?w.pm:1)*(b.big?2:1);else if(w&&w.ex)d*=ZE*(w.pm||1);else if(!srcK&&src!='Melee')d*=ZE;
 if(b.zp){hits++;juiceHit(b,Math.min(d,9999),head);$('#hm').className='on'+(head?' hd':'');hmT=.12;beep(head?900:600,.05,'square',.04);if(src!='Melee')zGain(10);netSend({t:'zqh',i:b.i,d,h:head?1:0,k:srcK,m:src=='Melee'?1:0});return}
 zDamage(b,d,head,zMe(),srcK,src=='Melee')}
function zDamage(b,d,head,by,k,mel){if(!b.al)return;if(zq.pu.insta>0)d=Math.max(d,b.hp+1);b.hp-=d;b.lh=t0;const mine=by==zMe();
 if(mine){hits++;$('#hm').className='on'+(head?' hd':'');hmT=.12;beep(head?900:600,.05,'square',.04)}juiceHit(b,Math.min(d,9999),head);
 if(b.hp>0){if(mine&&!mel)zGain(10);return}
 b.al=0;b.atk=0;const pt=mel?130:head?100:(k=='RL'||k=='RG')?60:50;zdead.push({b,t:0});if(typeof lonKill=='function')lonKill(b);{const kp=mine?P:bots.find(x=>x.net&&x.id==by);ragStart(b,kp?b.x-kp.x:0,kp?b.z-kp.z:0,b.big?2.2:(mel&&zMelKey()=='Nitrogen Fists')?9:(k=='SG'||k=='RL'||k=='RG'?6:3.4))}
 if(mine){kills++;zGain(pt);floatTxt(V(b.x,2.8,b.z),'+'+(zq.pu.dbl>0?pt*2:pt),'#ffd24a');juiceKill(b,head);wzkill(k);killXP(head)}
 else{const nb=bots.find(x=>x.net&&x.id==by);if(nb)nb.k=(nb.k||0)+1;netSend({t:'zk',to:by,pts:pt,k,h:head?1:0})}zPuTry(b)}

/* ---------- zombie attacks: a zombie walks up, stops at arm's length and plants its feet, winds up (arms rise, torso leans back), strikes (slam, claw swipe or lunge) and only then does the damage land.
   Four attack types: 0 overhead slam, 1 right claw, 2 left claw, 3 lunge bite (runners). Brutes always slam and shake the ground. ---------- */
function zAtkStart(b,pl,ty){b.atk=1;b.at=0;b.ahit=0;b.atd=Math.min(.85,Math.max(.5,b.ac*.75))*(b.big?1.15:1);b.atype=ty!=null?ty:b.big?0:b.run?(Math.random()<.6?3:Math.random()<.5?1:2):(Math.random()*3|0);if(b.atype==4){b.atd=.8*(b.big?1.15:1);b.gcd=Math.max(2.4,4.6-zq.r*.06)+Math.random()*1.2}
 const d=Math.hypot(pl.x-b.x,pl.z-b.z);if(d<14)beep(80+Math.random()*60,.3,'sawtooth',Math.max(.01,.06-d*.004))}
function zStrike(b,pl){const dx=pl.x-b.x,dz=pl.z-b.z,D=Math.hypot(dx,dz)||1,reach=1.75*(b.big?1.25:1);if(D>reach||Math.abs(pl.y)>1.6)return;
 if(pl.me){if(zq.dash&&zq.dash.t>0)return;hurt(b.dm,b);mv(P,dx/D*(b.big?.9:.45),dz/D*(b.big?.9:.45),.45);kick+=b.big?.05:.025;shake=Math.max(shake,b.big?.55:.3);LX.fx.dmg=Math.max(LX.fx.dmg,.35);burst(V(P.x,1.3,P.z),8,0x8a1010,4,.4,.08)}
 else netSend({t:'hit',to:pl.id,d:b.dm,bot:b.i});
 if(b.big){const q=V(b.x+dx/D*1.1,.2,b.z+dz/D*1.1);burst(q,16,0x6a6458,5,.7,.2);noise(.4,140,.45)}else noise(.12,900,.18)}
/* arm and body poses for the attack and for crawling out of the ground, used by animBot (systems.js) */
const zsm_=u=>{u=u<0?0:u>1?1:u;return u*u*(3-2*u)},zlr=(a,b,u)=>[a[0]+(b[0]-a[0])*u,a[1]+(b[1]-a[1])*u,a[2]+(b[2]-a[2])*u];
function zAtkPose(b,dt){const N=[.02,-.12,.58],NL=[-.02,-.12,.58],H1=[.6,-1,-.3],H2=[-.6,-1,-.3];
 if(b.rise>0){const u=1-b.rise/(b.riseD||1),wob=Math.sin(t0*15+b.i)*.1;return{lean:-.35+.55*zsm_(u),tw:Math.sin(t0*9+b.i)*.15,bob:0,hx:-.2,hy:Math.sin(t0*7+b.i)*.3,R:[.2,.5+wob,.14],L:[-.2,.5-wob,.14],hR:[.6,1,-.2],hL:[-.6,1,-.2],jaw:.8}}
 if(b.gutM)b.gutM.visible=!!b.atk&&b.atype==4&&b.at<b.atd*.54;if(!b.atk)return null;const p=zsm_(b.at/b.atd>1?1:b.at/b.atd),raw=Math.min(1,b.at/b.atd),wu=zsm_(raw/.5),st=zsm_((raw-.5)/.22),rc=zsm_((raw-.72)/.28),w=wu*(1-st),s=st*(1-rc),k=b.big?1.25:1,ty=b.atype;
 const mix=(a,wi,sr)=>zlr(zlr(zlr(a,wi,wu),sr,st),a,rc);let R,L,lean,tw,hx,jaw,bob;
 if(ty==0){R=mix(N,[.14,.58*k,.1],[.1,-.55,.5]);L=mix(NL,[-.14,.58*k,.1],[-.1,-.55,.5]);lean=-.3*w+.55*s;tw=0;hx=-.3*w+.4*s;jaw=.2+.8*w*(1-st*.8);bob=-.06*s*k}
 else if(ty==4){R=mix(N,[.42,.6,-.3],[-.08,.12,.66]);L=mix(NL,[-.08,-.38,.32],[-.14,-.1,.5]);lean=-.4*w+.5*s;tw=.5*w-.35*s;hx=-.45*w+.4*s;jaw=.25+.95*(w+s*.5);bob=-.04*s}
 else if(ty==3){R=mix(N,[.2,-.3,.2],[.4,-.05,.65]);L=mix(NL,[-.2,-.3,.2],[-.4,-.05,.65]);lean=-.22*w+.8*s;tw=0;hx=-.2*w+.55*s;jaw=.2+.95*(w*.6+s);bob=-.07*s}
 else{const sd=ty==1?1:-1,wi=[.55*sd,.08,.1],sr=[-.5*sd,-.2,.58];const A=mix(ty==1?N:NL,wi,sr),G=mix(ty==1?NL:N,[(ty==1?-.1:.1),-.2,.38],[(ty==1?-.12:.12),-.15,.5]);R=ty==1?A:G;L=ty==1?G:A;lean=.12*w+.3*s;tw=(.55*w-.6*s)*sd;hx=.1*s;jaw=.3+.6*s;bob=-.03*s}
 return{lean,tw,bob,hx,hy:tw*.4,R,L,hR:H1,hL:H2,jaw}}

/* ---------- guts: a player who stands somewhere zombies cannot walk to (a table, a ledge, a crate) for more than a couple of seconds gets bombarded.
   Every zombie that cannot melee them and can see them rips out a handful of gut and lobs it in an arc. A hit does exactly what that zombie's normal attack does,
   so perching is never a way to be safe. At most 4 chunks are in the air at once. The host simulates the hit, guests just see the chunks fly. ---------- */
let zGutKit=null;
const zGutGear=()=>zGutKit||(zGutKit={g:new THREE.SphereGeometry(1,8,6),m:[new THREE.MeshLambertMaterial({color:0x8a1d2a,emissive:0x2a0508}),new THREE.MeshLambertMaterial({color:0x5c2a4a,emissive:0x1a0818}),new THREE.MeshLambertMaterial({color:0x6e7a2e,emissive:0x141a06})],dm:new THREE.MeshBasicMaterial({color:0x5a0c14,transparent:true,opacity:.8,depthWrite:false}),dg:new THREE.CircleGeometry(1,10)});
function zGutMesh(sz){const g=new THREE.Group(),K=zGutGear();for(let i=0;i<3;i++){const m=new THREE.Mesh(K.g,K.m[i]);m.scale.set(sz*(1.15-i*.2),sz*(.8+i*.15),sz*(1.3-i*.25));m.position.set((i-1)*sz*.75,(i%2)*sz*.4,(i-1)*sz*.3);g.add(m)}return g}
function zGutHand(b){const a=b.rig&&b.rig.armR;if(!a||!a.fo)return;const m=zGutMesh(.07);m.position.set(0,-(a.L2||.3),0);m.visible=false;a.fo.add(m);b.gutM=m}
function zSees(b,pl){const f=V(b.x,b.big?2.2:1.5,b.z),t=V(pl.x,(pl.y||0)+1.1,pl.z),d=t.clone().sub(f),L=d.length();if(L<.1)return true;return castW(f,d.multiplyScalar(1/L),L)>=L-.3}
function zThrowGut(b,pl){if(!zq)return;const ry=b.m.rotation.y,from=V(b.x+Math.sin(ry)*.45,b.big?2.5:1.6,b.z+Math.cos(ry)*.45),to=V(pl.x,(pl.y||0)+1.1,pl.z);if(pl.me){to.x+=(P.mx||0)*.22;to.z+=(P.mz||0)*.22}
 const dx=to.x-from.x,dz=to.z-from.z,dy=to.y-from.y,hd=Math.hypot(dx,dz)||1,T=Math.max(.3,hd/15),G=11,vx=dx/T,vz=dz/T,vy=(dy+.5*G*T*T)/T;
 zGutLaunch(from.x,from.y,from.z,vx,vy,vz,b.dm,b.i,b.big,0);if(netOn&&isHost)netSend({t:'zg',x:from.x,y:from.y,z:from.z,vx,vy,vz,big:b.big?1:0});
 beep(150+Math.random()*60,.3,'sawtooth',.08);noise(.25,450,.3);burst(from,6,0x8a1d2a,3,.4,.08)}
function zGutLaunch(x,y,z,vx,vy,vz,dm,bi,big,vis){const sz=big?.2:.13,m=zGutMesh(sz);m.position.set(x,y,z);(zG||S).add(m);zq.guts.push({m,x,y,z,sx:x,sz:z,vx,vy,vz,dm,bi,big,vis,t:0,sz_:sz})}
function zGutSplat(x,y,z,ground,big){const q=V(x,y,z);burst(q,big?32:20,0x8a1d2a,5.5,.7,.12);burst(q,big?12:8,0x6e7a2e,4,.6,.09);burst(q,6,0x5c2a4a,3,.8,.14);noise(.18,280,.3);beep(90,.15,'sawtooth',.05);
 if(ground&&zq.decals){const K=zGutGear(),d=zq.decals;let e;if(d.length>=22){e=d.shift();e.m.visible=true}else{e={m:new THREE.Mesh(K.dg,K.dm.clone())};e.m.rotation.x=-Math.PI/2;(zG||S).add(e.m)}
  const s=(big?1.1:.65)*(.8+Math.random()*.5);e.m.scale.set(s,s*(.7+Math.random()*.5),1);e.m.rotation.z=Math.random()*6.28;e.m.position.set(x,.045+Math.random()*.01,z);e.t=0;e.m.material.opacity=.8;d.push(e)}}
function zGore(){const e=$('#zgore');if(!e)return;e.style.transition='none';e.style.opacity='1';e.style.backgroundPosition=(Math.random()*100|0)+'% '+(Math.random()*100|0)+'%';void e.offsetWidth;e.style.transition='opacity 1.1s ease-out';e.style.opacity='0'}
function zGutTick(dt){const G=11,gs=zq.guts;
 for(let i=gs.length-1;i>=0;i--){const g=gs[i];g.t+=dt;g.vy-=G*dt;const nx=g.x+g.vx*dt,ny=g.y+g.vy*dt,nz=g.z+g.vz*dt;g.m.rotation.x+=dt*9;g.m.rotation.z+=dt*7;
  let hit=0,vic=null;
  if(!g.vis)for(const p of zPlayers()){if(Math.abs(nx-p.x)<.55&&Math.abs(nz-p.z)<.55&&ny>(p.y||0)+.05&&ny<(p.y||0)+1.9){hit=2;vic=p;break}}
  if(!hit){if(ny<=.05)hit=1;else for(const b of bx){if(b.pl)continue;if(nx>b.x0&&nx<b.x1&&nz>b.z0&&nz<b.z1&&ny<b.h&&ny>b.y0){hit=3;break}}}
  if(!hit&&g.t>4)hit=1;
  if(hit){gs.splice(i,1);(zG||S).remove(g.m);zGutSplat(nx,Math.max(.1,ny),nz,hit==1,g.big);
   if(hit==2&&vic){const src_=bots.find(q=>q.i==g.bi)||{x:g.sx,z:g.sz,i:g.bi,nm:'Zombie',zom:1};
    if(vic.me){if(!(zq.dash&&zq.dash.t>0)){hurt(g.dm,src_);kick+=.03;shake=Math.max(shake,.4);LX.fx.dmg=Math.max(LX.fx.dmg,.4);zGore()}}
    else netSend({t:'hit',to:vic.id,d:g.dm,bot:g.bi})}
   continue}
  g.x=nx;g.y=ny;g.z=nz;g.m.position.set(nx,ny,nz);if(Math.random()<dt*30)burst(V(nx,ny,nz),1,0x8a1d2a,1.2,.35,.07)}
 for(const d of zq.decals){d.t+=dt;if(d.t>8)d.m.material.opacity=Math.max(0,.8*(1-(d.t-8)/6));if(d.t>14)d.m.visible=false}}

/* ---------- movement: zombies stop at arm's length instead of walking into you, nobody can stand inside anybody, and attacks are animated ---------- */
function zMove(dt){const zs=bots.filter(b=>b.zom&&b.al),pls=zPlayers(),M=MAPS[sel.map];
 const EL=zq.elev;for(const p of pls)EL[p.id]=(p.y||0)>.55?(EL[p.id]||0)+dt:0;
 zq.gutCD=(zq.gutCD||0)-dt;let gutBusy=zq.guts.length;for(const z_ of zs)if(z_.atk&&z_.atype==4)gutBusy++;
 for(const b of zs){
  if(b.rise>0){b.rise-=dt;const u=Math.min(1,1-b.rise/b.riseD),e=1-Math.pow(1-u,2.2);b.m.position.set(b.x,b.riseY*(1-e),b.z);if(b.riseY&&Math.random()<dt*20)burst(V(b.x,.15,b.z),1,0x5a4630,2,.4,.12);b.tyaw=b.m.rotation.y;continue}
  let pl=null,bd=1e9;for(const p of pls){const d=Math.hypot(p.x-b.x,p.z-b.z);if(d<bd){bd=d;pl=p}}if(!pl)continue;
  const reach=1.5*(b.big?1.25:1),stopD=1.05*(b.big?1.2:1);let sps=b.sp;if(b.stun>0){b.stun-=dt;sps*=.15}
  if(b.atk||bd<stopD)sps=0;
  const D=navMove(b,dt,pl.x,pl.z,sps,zfls[pl.id]);b.m.position.set(b.x,0,b.z);b.tyaw=bd<4||b.atk?Math.atan2(pl.x-b.x,pl.z-b.z):(b.mva==null?b.m.rotation.y:b.mva);
  b.cd-=dt;b.gcd=(b.gcd==null?1+Math.random()*2.5:b.gcd)-dt;const canMelee=bd<reach&&Math.abs(pl.y)<1.4;
  if(b.atk){b.at+=dt;if(b.atype==3&&b.at>b.atd*.3&&b.at<b.atd*.55&&bd>.95){const dx=pl.x-b.x,dz=pl.z-b.z;mv(b,dx/bd*3.4*dt,dz/bd*3.4*dt,.45)}
   if(!b.ahit&&b.at>=b.atd*.52){b.ahit=1;if(b.atype==4)zThrowGut(b,pl);else zStrike(b,pl)}if(b.at>=b.atd){b.atk=0;b.cd=Math.max(.2,b.ac-b.atd)}}
  else if(canMelee&&b.cd<=0&&!(b.stun>0))zAtkStart(b,pl);
  else if(!canMelee&&(EL[pl.id]||0)>2.2&&bd>1.1&&bd<17&&b.gcd<=0&&gutBusy<2&&zq.gutCD<=0&&!(b.stun>0)&&zSees(b,pl)){zAtkStart(b,pl,4);gutBusy++;zq.gutCD=1.8+Math.random()*1.8;b.gcd=Math.max(b.gcd,5+Math.random()*3)}
  else if(bd>=reach)b.cd=Math.max(b.cd,.3)}
 /* zombies are solid to each other */
 for(let i=0;i<zs.length;i++)for(let j=i+1;j<zs.length;j++){const a=zs[i],c=zs[j];if(a.rise>0||c.rise>0)continue;const dx=c.x-a.x,dz=c.z-a.z,d=Math.hypot(dx,dz),R=(a.big||c.big)?1.15:.9;if(d<R&&d>.001){const p=(R-d)*.5/d;mv(a,-dx*p,-dz*p,.45);mv(c,dx*p,dz*p,.45)}}
 zq.gn-=dt;if(zq.gn<=0&&zs.length){zq.gn=2+Math.random()*2;const b=zs[Math.random()*zs.length|0],d=Math.hypot(b.x-P.x,b.z-P.z);if(d<25)beep(70+Math.random()*50,.4,'sawtooth',Math.max(.01,.05-d*.002))}}
/* the player is solid too: zombies cannot be walked through (or walked into) and they shove you when they crowd you; a Nitro dash plows through */
function zPush(dt){if(P.dead||(zq.dash&&zq.dash.t>0))return;const own=isHost||!netOn;
 for(const b of bots){if(!b.zom||!b.al||b.rise>0)continue;const R=b.big?1.15:.95,dx=P.x-b.x,dz=P.z-b.z,d=Math.hypot(dx,dz);if(d>=R||Math.abs((b.y||0)-(P.y||0))>1.6)continue;
  const nx=d>.001?dx/d:1,nz=d>.001?dz/d:0,pen=R-d;if(own){mv(P,nx*pen*.65,nz*pen*.65,.45);if(!b.zp)mv(b,-nx*pen*.35,-nz*pen*.35,.45)}else mv(P,nx*pen,nz*pen,.45);
  const vin=-((P.mx||0)*nx+(P.mz||0)*nz);if(vin>0){P.mx=(P.mx||0)+nx*vin;P.mz=(P.mz||0)+nz*vin}}}
function zAnim(dt){for(let i=zdead.length-1;i>=0;i--){const d=zdead[i];d.t+=dt;ragTick(d.b,dt);if(d.t>6&&d.b.rag)d.b.rag.sink=(d.t-6)*1.4;if(d.t>7.2){S.remove(d.b.m);const j=bots.indexOf(d.b);if(j>=0)bots.splice(j,1);zdead.splice(i,1)}}}

/* ---------- round flow ---------- */
/* what a new round does for every player (host and guests): camo check, bring downed players back. Ammo is NOT restocked: buy it at the wall or at an Ammo Crate. */
function zRoundFx(){const z=zq;zRoundDone(z.r);rel=0;if(netOn&&P.dead)zRespawn();
 msg(z.brutes?'Round '+z.r+' · Brutes incoming':'Round '+z.r,3);beep(110,.5,'sawtooth',.1);setTimeout(()=>beep(80,.6,'sawtooth',.1),250);if(typeof estRound=='function')estRound(z.r,z.brutes)}
function zNewRound(){const z=zq;z.r++;z.puRound=0;z.st='run';z.toSpawn=zTot(z.r);z.brutes=z.r%5==0?Math.floor(z.r/5):0;z.spT=.6;zRoundFx();if(netOn)netSend({t:'zs',r:z.r,st:z.st,tm:0,br:z.brutes})}
function zEndRound(){const z=zq;z.st='prep';z.tm=8;msg('Round '+z.r+' survived',2.5);beep(660,.2,'triangle',.08);setTimeout(()=>beep(880,.3,'triangle',.08),180);if(netOn)netSend({t:'zs',r:z.r,st:z.st,tm:z.tm})}
function zRoundSync(d){const z=zq;if(d.r>z.r){z.r=d.r;z.brutes=d.br||0;zRoundFx()}else if(d.st=='prep'&&z.st!='prep'){msg('Round '+z.r+' survived',2.5);beep(660,.2,'triangle',.08)}z.st=d.st;z.tm=d.tm}
/* per-frame work shared by the host and by guests */
function zCommon(dt){const z=zq;if(!P.dead&&t0-lastHit>6&&P.hp<P.mhp)P.hp=Math.min(P.mhp,P.hp+12*dt);
 if(z.down){z.dnT-=dt;if(z.dnT<=0){z.down=0;z.out=1;msg('You bled out. You return next round',3)}}
 if(z.cur&&z.cur.rv&&key.KeyF&&!P.dead){z.rvT+=dt;const rvN=z.perks.rev?1:2;$('#zp').textContent=`Reviving ${z.cur.rv.nm}… ${Math.min(100,Math.round(z.rvT/rvN*100))}%`;if(z.rvT>=rvN){z.rvT=0;netSend({t:'zqv',to:z.cur.rv.id});z.pts+=100;feed('You revived '+z.cur.rv.nm)}}else z.rvT=0;
 if(P.dead&&z.dash.t>0)z.dash.t=0;zDashTick(dt);zPapTick(dt);zPuTick(dt);zPush(dt);zGutTick(dt);zAnim(dt);zInteract();zMarkers();zProne();if(typeof estTick=='function')estTick(dt)}
function zomTick(dt){const z=zq;if(!z||mode!='Zombies')return;const M=MAPS[sel.map];
 let alive=0;for(const b of bots)if(b.zom&&b.al)alive++;
 if(z.st=='prep'){z.tm-=dt;if(z.tm<=0)zNewRound()}
 else{z.spT-=dt;if(z.toSpawn>0&&z.spT<=0){const room=Math.min(24,6+z.r*2)-alive;if(room>0){const n=Math.min(room,z.toSpawn,2+(z.r>3?1:0)+(z.r>8?1:0));for(let i=0;i<n;i++){const big=z.brutes>0&&(z.toSpawn-i<=z.brutes||Math.random()<.2);if(big)z.brutes--;zSpawn(M,big)}z.toSpawn-=n;z.spT=Math.max(1.2,3.2-z.r*.12)}else z.spT=.4}
  if(z.toSpawn<=0&&alive<=0)zEndRound()}
 z.fl-=dt;if(z.fl<=0&&zgr){z.fl=.35;zfls={};for(const pl of zPlayers())zfls[pl.id]=zFlow(pl)}
 zMove(dt);zCommon(dt);zboxes.forEach((o,i)=>zBoxTick(o,i,dt,1));
 if(netOn){zbT+=dt;if(zbT>.1){zbT=0;netSend({t:'zb',bl:(typeof EST!='undefined'&&EST.bx?EST.bx.loc:-1),lo:(typeof lonPack=='function'?lonPack():0),r:z.r,l:bots.filter(b=>b.zom&&b.al).map(b=>[b.i,+b.x.toFixed(1),+b.z.toFixed(1),b.big?1:0,b.atk?b.atype+1:0])})}
  zsT+=dt;if(zsT>.5){zsT=0;netSend({t:'zs',r:z.r,st:z.st,tm:Math.ceil(z.tm),br:z.brutes})}
  if(!zPlayers().length&&!over){z.ad+=dt;if(z.ad>6)endGame('You reached round '+z.r)}else z.ad=0}
 $('#ob').textContent=z.st=='prep'?(z.r?`Round ${z.r} survived  ·  next round in ${Math.ceil(z.tm)}`:`Get ready  ·  first round in ${Math.ceil(z.tm)}`):`Round ${z.r}  ·  Zombies left ${z.toSpawn+alive}`;zHud()}
/* lying prone in front of a perk machine pays 100 points, once per machine per match and only to the first player who does it (the host decides in co-op) */
function zProne(){const z=zq;if(!z||P.dead||!ST.prone||!z.mp)return;z.pbq=z.pbq||{};for(const m of z.mp){if(z.pb[m.k]||z.pbq[m.k])continue;const a=FACE[m.f],fx=Math.sin(a),fz=Math.cos(a),dx=P.x-m.x,dz=P.z-m.z,fw=dx*fx+dz*fz,lat=Math.abs(dx*fz-dz*fx);
  if(fw>.7&&fw<3.6&&lat<1.8){z.pbq[m.k]=1;if(zCli())netSend({t:'zqp',k:m.k});else zProneGrant(m.k,zMe())}}}
function zProneGrant(k,by){const z=zq,m=z.mp.find(q=>q.k==k);if(!m||z.pb[k])return;z.pb[k]=by;if(by==zMe())zProneGift(k);if(netOn&&isHost)netSend({t:'zpg',k,by})}
function zProneGift(k){const z=zq,m=z.mp.find(q=>q.k==k);z.pts+=100;msg('+100 · '+(m?m.n:'perk machine')+' secret',2.2);beep(1000,.1,'triangle',.07);setTimeout(()=>beep(1500,.12,'triangle',.06),90)}
/* guests: the host runs the world, guests move the puppets and handle their own interactions */
function zcTick(dt){const z=zq;if(!z||mode!='Zombies')return;const k=Math.min(1,dt*10);
 for(const b of bots)if(b.zp&&b.al){const ox=b.x,oz=b.z;if(b.rise>0){b.rise-=dt;b.tyaw=b.m.rotation.y;continue}b.x+=(b.tx-b.x)*k;b.z+=(b.tz-b.z)*k;b.m.position.set(b.x,0,b.z);if(Math.hypot(b.tx-ox,b.tz-oz)>.02)b.tyaw=Math.atan2(b.tx-ox,b.tz-oz);
  if(b.atk){b.at+=dt;if(b.at>=b.atd)b.atk=0}}
 zCommon(dt);zboxes.forEach((o,i)=>zBoxTick(o,i,dt,0));zHud()}
function zSync(d){const seen=new Set();for(const[i,x,z,big,ak]of d.l){seen.add(i);let b=bots.find(q=>q.zp&&q.i==i);if(!b)b=zPuppet(i,x,z,big,d.r);b.tx=x;b.tz=z;if(ak&&!b.atk){b.atk=1;b.at=0;b.atd=(ak==5?.8:.65)*(big?1.15:1);b.atype=ak-1}}
 for(const b of bots)if(b.zp&&b.al&&!seen.has(b.i)){b.al=0;b.atk=0;zdead.push({b,t:0});ragStart(b,b.x-P.x,b.z-P.z,3)}}
function zInteract(){const z=zq;let best=null,bd=1e9;if(!P.dead&&z.papT<=0){for(const it of zi){const d=Math.hypot(P.x-it.x,P.z-it.z);if(d<it.r&&d<bd&&it.txt()){bd=d;best=it}}
  if(netOn)for(const b of bots)if(b.net&&!b.hb&&!b.al&&b.dn){const d=Math.hypot(P.x-b.x,P.z-b.z);if(d<2.6&&d<bd){bd=d;best={rv:b,txt:()=>PG.t('Hold F to revive '+b.nm),cost:()=>0,act:()=>{}}}}}
 z.cur=best;const e=$('#zp');if(P.dead&&z.down){e.textContent=`DOWN · bleeding out in ${Math.ceil(z.dnT)}s · a teammate can revive you`;e.className='bad';return}
 if(z.papT>0){e.textContent=`Pack-a-Punch · ${z.papT.toFixed(1)}s`;e.className='';return}
 if(best){const c=best.cost();e.textContent=best.rv?best.txt():`[${PG.on?PG.l('use'):'F'}] ${best.txt()}${c?'  ['+c+']':''}`;e.className=c>z.pts?'bad':''}else{e.textContent='';e.className=''}}
function zUse(){if(!zq||P.dead||over)return;if(zq.cur)zq.cur.act()}
function zHudInit(){if(!$('#zpus')){const e=document.createElement('div');e.id='zpus';$('#hud').appendChild(e)}if($('#zdash'))return;const d=document.createElement('div');d.id='zdash';d.innerHTML='<svg viewBox="0 0 44 44"><circle class="bg" cx="22" cy="22" r="18"/><circle class="fg" cx="22" cy="22" r="18"/></svg><b>DASH</b><em>AIM</em>';$('#hud').appendChild(d)}
function zHudShow(on){const d=$('#zdash');if(d)d.style.display=on?'block':'none'}
/* what the ammo line shows besides the gun: your melee weapon and, for the Nitrogen Fists, the dash */
function zAmmoX(){if(!zq)return'';const m=zq.mel;return ' · '+(m.pn||m.k)}
function zPuHud(){const z=zq,el=$('#zpus');if(!el)return;let h='';for(const k of['insta','dbl','fire'])if(z.pu[k]>0){const t=z.pu[k],def=ZPU[k];h+=`<div class="pu${t<6?' lo':''}" style="--c:${hex(def.c)}"><span>${def.i}</span><b>${Math.ceil(t)}</b><i style="width:${Math.min(100,t/30*100)}%"></i></div>`}if(el._h!==h){el._h=h;el.innerHTML=h}}
function zHud(){zPuHud();const z=zq,ic=Object.keys(z.perks).filter(k=>z.perks[k]).map(k=>`<i style="background:${hex(PERKS[k].c)}">${PERKS[k].n[0]}</i>`).join(''),tm=netOn?bots.filter(b=>b.net&&!b.hb).map(b=>`${esc(b.nm)} ${b.zpts|0}${b.al?'':b.dn?' ✚':' ✖'}`).join('<br>'):'',k=z.r+'|'+z.pts+'|'+ic+'|'+tm+'|'+(z.down?1:0);
 const dd=$('#zdash');if(dd){const nitro=z.mel.k=='Nitrogen Fists';dd.style.display=nitro?'block':'none';if(nitro){const d=z.dash,u=d.cd>0?d.cd/(d.max||6):0;dd.classList.toggle('rdy',d.cd<=0);dd.classList.toggle('act',d.t>0);dd.querySelector('.fg').style.strokeDashoffset=String(113*u);dd.querySelector('em').textContent=d.cd>0?d.cd.toFixed(1)+'s':MV.eq?'AIM':'V'}}
 if(k==zhc)return;zhc=k;$('#zr').textContent=z.r||'';$('#zpt').textContent=z.pts+(z.down?' · DOWN':'');$('#zpk').innerHTML=ic;$('#zt').innerHTML=tm}
/* downed: Revive Soda brings you back by yourself, a teammate can revive you (co-op), otherwise the run ends */
function zDown(){const z=zq;if(!z)return;P.rt=1e9;const rev=z.perks.rev;z.perks={};P.mhp=50;z.cap=2;z.dash.t=0;z.pap=null;z.papT=0;if(wp.length>2){wp.length=2;if(cur>1){cur=1;setGun()}}gun.visible=false;MV.eq=0;
 if(rev){msg('Reviving in 4…',3);setTimeout(()=>{if(run&&mode=='Zombies'&&!over&&P.dead&&!z.out)zRevive()},4000)}
 else if(netOn){z.down=1;z.dnT=45;msg('You are down. Hold on until a teammate revives you',3);netSend({t:'zdn'})}
 else setTimeout(()=>{if(mode=='Zombies')endGame('You reached round '+z.r)},2600)}
/* knocked: you lie on the floor (low camera, slow crawl) instead of ragdolling */
function zDownCam(dt){const f=(key.KeyW?1:0)-(key.KeyS?1:0),s=(key.KeyD?1:0)-(key.KeyA?1:0);if((f||s)&&zq&&!over){const sy=Math.sin(yaw),cy=Math.cos(yaw),n=Math.hypot(f,s)||1;mv(P,(-sy*f+cy*s)/n*1.5*dt,(-cy*f-sy*s)/n*1.5*dt,.4)}
 C.position.set(P.x,.42+Math.sin(t0*2)*.01,P.z);C.rotation.set(Math.max(-.6,Math.min(.4,pitch*.5))-.1,yaw,.18)}
/* every player on their feet sees a marker over a downed teammate */
function zMarkers(){if(!netOn)return;for(const b of bots){if(!b.net||b.hb)continue;const need=!b.al&&b.dn&&!P.dead;if(need&&!b.zmk){b.zmk=zSprite('','#ff5a3a',.8,0);S.add(b.zmk);b.zmt=0}if(!need&&b.zmk){S.remove(b.zmk);b.zmk=null}
  if(b.zmk){b.zmk.position.set(b.x,2.3,b.z);if(t0>b.zmt){b.zmt=t0+.4;zSet(b.zmk,'✚ '+b.nm+' '+Math.round(Math.hypot(P.x-b.x,P.z-b.z))+'m','#ff5a3a')}}}}
function zRevive(){endDeath();P.dead=0;P.hp=P.mhp*.6;P.sh=P.msh;gun.visible=true;rel=0;zq.down=zq.out=0;if(isHost||!netOn)for(const b of bots)if(b.zom&&b.al){const dx=b.x-P.x,dz=b.z-P.z,d=Math.hypot(dx,dz);if(d<7&&d>.01)mv(b,dx/d*(7-d),dz/d*(7-d),.45)}msg('Revived!',2);beep(660,.2,'triangle',.1)}
/* a downed or bled-out player returns at the start of the next round with a pistol and bare hands (points are kept) */
function zRespawn(){const z=zq,ps=MAPS[sel.map].ps;endDeath();P.dead=0;z.down=z.out=0;z.perks={};z.cap=2;z.mel={k:'Fists',pap:0};z.dash.cd=0;z.dash.t=0;zPaintHands();P.mhp=50;P.hp=50;P.sh=P.msh;wp=[zGunObj('CT')];cur=0;rel=0;gc=Math.max(gc,2);setGun();P.x=ps[0];P.z=ps[1];P.y=0;gun.visible=true;msg('Back in the fight',2)}
/* network messages: types starting with z (longer than one letter) are routed here from onMsg */
function zNet(d){const z=zq;if(!z||mode!='Zombies')return;
 switch(d.t){
 case'zqh':if(isHost){const b=bots.find(x=>x.zom&&!x.zp&&x.i==d.i&&x.al);if(b)zDamage(b,d.d,d.h,d.id,d.k,d.m)}break;
 case'zqd':if(isHost)zOpenDoor(d.i,d.id);break;
 case'zqp':if(isHost)zProneGrant(d.k,d.id);break;
 case'zpg':if(!isHost){z.pb[d.k]=d.by;if(d.by==myId)zProneGift(d.k)}break;
 case'zqb':if(isHost&&zboxes[d.i]&&zboxes[d.i].st==0)zBoxStart(zboxes[d.i],d.i,d.id);break;
 case'zqe':if(isHost){const o=zboxes[d.i];if(o&&o.st==2&&o.by==d.id)zBoxEnd(o,d.i)}break;
 case'zqr':if(isHost){z.revBuys++;zRevCount(z.revBuys);netSend({t:'zrev',n:z.revBuys})}break;
 case'zqv':if(d.to==myId&&P.dead&&z.down)zRevive();break;
 case'zd':if(!isHost){if(d.by==myId&&zdoors[d.i])z.pts-=zdoors[d.i].d.c;zOpenDoor(d.i,d.by)}break;
 case'zbs':if(!isHost){const o=zboxes[d.i];if(!o)break;if(d.st==1){if(d.by==myId)z.pts-=zBoxCost();o.st=1;o.t=0;o.cy=0;o.by=d.by;if(typeof estBoxState=='function')estBoxState(o,1)}else if(d.st==2){o.item=d.item;o.st=2;o.t=0;o.by=d.by;o.beam.visible=o.lab.visible=true;zSet(o.lab,zItemName(d.item),d.item=='RG'||d.item=='NF'?'#ff4a4a':'#7bf08a');if(typeof estBoxShow=='function')estBoxShow(o,d.item,1)}else if(d.st==3){o.st=3;o.t=0;zSet(o.lab,'THE BOX IS MOVING!','#ff4a4a');o.beam.visible=o.lab.visible=true;if(d.by==myId)z.pts+=zBoxCost()}else{o.st=0;o.beam.visible=o.lab.visible=false;if(typeof estBoxState=='function')estBoxState(o,0)}}break;
 case'zbl':if(!isHost){estBoxGo(d.i);msg('The Mystery Box has moved',2.8)}break;
 case'zlon':if(isHost&&typeof lonDo=='function')lonDo(d.a);break;
 case'zdn':if(d.id!=myId){const nm=names[d.id]||'A teammate';popup('PLAYER DOWN',nm+' needs a revive!');feed(nm+' is down');beep(260,.25,'sawtooth',.1);setTimeout(()=>beep(200,.3,'sawtooth',.1),220)}break;
 case'zrev':if(!isHost)zRevCount(d.n);break;
 case'zk':if(!isHost&&d.to==myId){zGain(d.pts);kills++;wzkill(d.k);killXP(d.h);beep(900,.06,'square',.05)}break;
 case'zb':if(!isHost){if(d.bl!=null&&d.bl>=0&&typeof EST!='undefined'&&EST.bx&&d.bl!==EST.bx.loc)estBoxGo(d.bl,1);if(typeof lonSync=='function')lonSync(d);zSync(d)}break;
 case'zpu':if(!isHost)zPuSpawn(d.id,d.k,d.x,d.z);break
 case'zpc':if(!isHost){const q=z.drops.find(x=>x.id==d.id);if(q)zPuRemove(q);zPuApply(d.k,d.by)}break
 case'zg':if(!isHost)zGutLaunch(d.x,d.y,d.z,d.vx,d.vy,d.vz,0,0,d.big,1);break
 case'zs':if(!isHost)zRoundSync(d);break}}
