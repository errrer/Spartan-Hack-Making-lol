/* ######## controls.js ######## */
/* ===================== controls.js ===================== */
/* ---------- full control scheme shared by keyboard + mouse, controller and VR: aim down sights, stances (crouch, slide, prone, dive), walk, auto-run, tactical sprint,
   lethal and tactical equipment, field upgrade, armor plates, fire mode, weapon mount, steady aim, ping, night vision, scoreboard and map ---------- */
const ST={ads:0,adsIn:0,ax:0,ay:-.12,az:-.4,zoom:.2,eye:1.65,crouch:0,prone:0,slide:0,dive:0,walk:0,auto:0,tac:0,tacCd:0,lastShift:-9,mount:0,steady:0,nv:0,tN:2,field:0,fieldCd:0,fm:{},sj:0,flash:0,sc:0,mapOn:0,sbOn:0,pings:[],qi:0};
function ctlReset(){mvReset();Object.assign(ST,{ads:0,adsIn:0,eye:1.65,crouch:0,prone:0,slide:0,dive:0,walk:0,auto:0,tac:0,tacCd:0,mount:0,steady:0,tN:2,field:0,fieldCd:0,sj:0,flash:0});for(const p of ST.pings)S.remove(p.m);ST.pings=[];const e=$('#flash');if(e)e.style.opacity=0}
/* ---------- ADS: put the sight line of the current weapon on the camera axis ---------- */
const _sgC=setGun;setGun=function(){_sgC.apply(this,arguments);const w=cw();if(!w)return;const k=w.k,l=(WG[k]||WG.AR)[0],pz=-.14+.1*l;let s=null,rel_=.22,zm=.2;
 if(k=='AR'){const t=knG.userData.sight;if(t)s={yt:t.yt,zr:t.zr-.12}}else if(k=='VMP')s=vmpG.userData.sight;else if(k=='RG')s=rgG.userData.sight;else if(k=='SN'){s={yt:.11,zr:pz-(l*.35-.14)};rel_=.1}else s=fpG.userData.sight;
 if(['CT','MG','MP'].includes(k))rel_=.3;zm=k=='SN'?.62:k=='RL'?.25:['SMG','VMP','MP'].includes(k)?.16:k=='SG'?.14:['CT','MG'].includes(k)?.12:.22;
 ST.zoom=zm;ST.ax=0;if(s){ST.ay=-s.yt;ST.az=-rel_-s.zr}else{ST.ay=-.1;ST.az=-.4};ST.mount=0};
/* ---------- movement: stances, slide, dive, walk, auto-run, tactical sprint ---------- */
function moveCalc(dt){let f=(key.KeyW?1:0)-(key.KeyS?1:0),s=(key.KeyD?1:0)-(key.KeyA?1:0);if(key.KeyS)ST.auto=0;if(ST.auto&&!key.KeyS)f=1;
 const sh=key.ShiftLeft||key.ShiftRight;let spt=sh&&f>0&&!ST.adsIn&&!ST.prone&&ST.slide<=0&&ST.dive<=0;if(spt&&ST.crouch)ST.crouch=0;
 if(ST.slide>0||ST.dive>0){f=1;s=0;spt=false}
 let spd=7;if(spt)spd=ST.tac>0?10.2:9;else if(ST.slide>0)spd=4+7*(ST.slide/.85);else if(ST.dive>0)spd=2+9*(ST.dive/.5);else if(ST.prone)spd=1.8;else if(ST.crouch)spd=3.8;else if(ST.walk)spd=3.6;
 if(ST.ads>.3&&!ST.slide&&!ST.dive)spd*=1-.35*ST.ads;if(ST.field>0)spd*=1.25;return{f,s,spt,spd}}
function ctlTick(dt){meleeTick(dt);if(P.dead){ST.adsIn=0;ST.ads=0;ST.slide=ST.dive=0}
 const sh=key.ShiftLeft||key.ShiftRight,tg=ST.adsIn&&rel<=0&&!P.dead&&!P.mt?1:0;ST.ads+=(tg-ST.ads)*Math.min(1,dt*(tg?9*((cw()&&cw().ad)||1):12));if(ST.ads<.002)ST.ads=0;
 if(ST.slide>0){ST.slide-=dt;if(ST.slide<=0)ST.crouch=1}if(ST.dive>0){ST.dive-=dt;if(ST.dive<=0)ST.prone=1}
 if(ST.tac>0&&(P.spr||0)>.5){ST.tac-=dt;if(ST.tac<=0)ST.tacCd=6}if(ST.tacCd>0)ST.tacCd-=dt;
 if(ST.field>0)ST.field-=dt;if(ST.fieldCd>0)ST.fieldCd-=dt;if(ST.steady>0)ST.steady-=dt;
 if(ST.mount&&(ST.ads<.5||Math.hypot(P.mx||0,P.mz||0)>1))ST.mount=0;
 const et=ST.slide>0?.8:ST.prone?.55:ST.crouch?1.15:1.65;ST.eye+=(et-ST.eye)*Math.min(1,dt*10);if(!key.Space)ST.sj=0;
 const sc=$('#scope'),w=cw(),scoped=ST.ads>.85&&w&&w.k=='SN';if(sc)sc.style.display=scoped?'block':'none';katTick(dt);gun.scale.setScalar(scoped||meleeOut()?.01:1);
 if(ST.flash>0){ST.flash-=dt;const e=$('#flash');if(e)e.style.opacity=Math.min(1,ST.flash)}
 for(let i=ST.pings.length-1;i>=0;i--){const p=ST.pings[i];p.t-=dt;p.m.position.y=p.y+Math.sin(t0*4)*.15;p.m.rotation.y+=dt*2;if(p.t<=0){S.remove(p.m);ST.pings.splice(i,1)}}
 if(ST.mapOn)drawMap();if(ST.sbOn&&(ST.sbT=(ST.sbT||0)-dt)<=0){ST.sbT=.5;drawSb()}}
/* ---------- actions ---------- */
const sprinting=()=>(P.spr||0)>.55;
function actCrouch(){if(P.dead)return;if(sprinting()&&ST.slide<=0){ST.slide=.85;ST.crouch=0;ST.prone=0;return}ST.prone=0;ST.crouch=ST.crouch?0:1}
function actProne(){if(P.dead)return;if(sprinting()&&ST.dive<=0){ST.dive=.5;ST.crouch=0;ST.prone=0;P.vy=3.5;P.on=0}else{ST.crouch=0;ST.prone=ST.prone?0:1}}
function actJumpPress(){if(ST.crouch||ST.prone){ST.crouch=ST.prone=0;ST.sj=1}}
function actAds(on){if(on&&typeof cw=='function'&&cw()&&cw().dual&&!(typeof MV!='undefined'&&MV.eq))on=0;ST.adsIn=on?1:0;if(typeof zDashIn=='function')zDashIn(on)}
function actTactical(){if(P.dead||ST.tN<=0)return;ST.tN--;const d=aimDir(),m=new THREE.Mesh(sg,new THREE.MeshLambertMaterial({color:0xeeeeee,emissive:0x555555}));m.scale.setScalar(.1);S.add(m);grs.push({m,p:C.position.clone(),v:d.multiplyScalar(14).add(V(0,3,0)),t:1.3,g:{fuse:1.3,R:0,d:0,imp:0,tac:1}});msg('Flashbang · '+ST.tN+' left',1)}
function flashBoom(p){burst(p,40,0xffffff,9,.5,.25);beep(2400,.5,'sine',.08);for(const b of bots){if(!b.al||(typeof ally=='function'&&ally(b)&&b.team!='z')||b.net)continue;const d=Math.hypot(b.x-p.x,b.z-p.z);if(d<18&&navLos(p.x,p.z,b.x,b.z))b.stun=Math.max(b.stun||0,3.5*(1-d/26))}
 const d=Math.hypot(P.x-p.x,P.z-p.z);if(d<22&&!P.dead){const v=V(p.x-C.position.x,p.y-C.position.y,p.z-C.position.z).normalize(),dot=aimDir().dot(v);ST.flash=Math.max(ST.flash,2.4*(1-d/22)*(dot>0?1:.35))}}
function actField(){if(P.dead)return;if(ST.fieldCd>0){msg('Field upgrade recharging '+Math.ceil(ST.fieldCd)+'s',1);return}ST.field=6;ST.fieldCd=45;P.sh=P.msh;msg('ADRENALINE: faster, shield restored',1.5);beep(500,.2,'sine',.06)}
function actFireMode(){const w=cw();if(!w)return;if(!w.au){msg(w.n+(w.burst?': 3-round burst':': semi-auto only'),1);return}ST.fm[w.k]=ST.fm[w.k]?0:1;msg(w.n+': '+(ST.fm[w.k]?'Single':'Auto'),1)}
function actMount(){if(ST.ads<.5){return}ST.mount=ST.mount?0:1;msg(ST.mount?'Weapon mounted':'Mount released',1)}
function actSteady(){if(ST.ads>.5){ST.steady=3;msg('Steady aim',.8)}}
function actPing(){const o=C.position.clone(),d=aimDir(),t=castW(o,d,120),p=o.add(d.multiplyScalar(Math.min(t,120)));const m=new THREE.Mesh(new THREE.OctahedronGeometry(.3),new THREE.MeshBasicMaterial({color:0xffd24a}));m.scale.y=1.6;m.position.copy(p);m.position.y+=.8;S.add(m);ST.pings.push({m,y:m.position.y,t:8});if(ST.pings.length>3){const q=ST.pings.shift();S.remove(q.m)}msg('Ping placed',.8);beep(900,.1,'sine',.05)}
function actNV(){ST.nv=!ST.nv;R.domElement.style.filter=ST.nv?'brightness(1.9) contrast(1.15) saturate(.4) sepia(1) hue-rotate(65deg)':'';const e=$('#nvo');if(e)e.style.display=ST.nv?'block':'none';msg('Night vision '+(ST.nv?'on':'off'),.8)}
function actInv(){const w=wp.map(x=>x.n).join(' · ');msg(`${w}  |  Frags ${gc}  Flash ${ST.tN}`,2.5)}
function actInteract(){if(mode=='Zombies')zUse()}
function actSwapNext(){if(wp.length>1)swap((cur+1)%wp.length)}function actSwapPrev(){if(wp.length>1)swap((cur+wp.length-1)%wp.length)}
function actSb(on){ST.sbOn=on;const e=$('#sbd');e.style.display=on?'block':'none';if(on){ST.sbT=0;drawSb()}}
function actMap(){ST.mapOn=!ST.mapOn;const e=$('#mapv');e.style.display=ST.mapOn?'block':'none';if(ST.mapOn)drawMap()}
function drawSb(){const rows=finRows(),e=$('#sbd');e.innerHTML='<h3>Scoreboard</h3><table>'+rows.map((r,i)=>`<tr class="${r.me?'me':''}"><td>${i+1}</td><td>${r.nm}</td><td>${r.k}</td><td>${r.d==null?'-':r.d}</td></tr>`).join('')+'</table>'+(typeof teamTxt=='function'?`<p>${teamTxt()}</p>`:'')}
/* ---------- map: top-down view of every wall and object, with allies, objectives and zombie-mode machines ---------- */
function drawMap(){const cv=$('#mapc'),c=cv.getContext('2d'),W=cv.width,M=MAPS[sel.map]||{},k=W/(2*H),tb=M.tb||[-H,-H,H,H],X=x=>(x+H)*k,Z=z=>(z+H)*k;
 /* tactical map: dark satellite-style ground, a red scan-line band just outside the play area, a white outline, buildings as lit blocks */
 c.clearRect(0,0,W,W);const bg_=c.createRadialGradient(W/2,W/2,W*.08,W/2,W/2,W*.78);bg_.addColorStop(0,'#2b2b2d');bg_.addColorStop(1,'#09090a');c.fillStyle=bg_;c.fillRect(0,0,W,W);
 let sd=17;const rn=()=>(sd=(sd*16807)%2147483647)/2147483647;c.fillStyle='rgba(255,255,255,.035)';for(let i=0;i<70;i++)c.fillRect(rn()*W,rn()*W,4+rn()*22,2+rn()*10);c.fillStyle='rgba(0,0,0,.25)';for(let i=0;i<40;i++)c.fillRect(rn()*W,rn()*W,8+rn()*30,4+rn()*14);
 const x0=X(tb[0]),z0=Z(tb[1]),x1=X(tb[2]),z1=Z(tb[3]);
 c.save();c.beginPath();c.rect(x0-W*.05,z0-W*.05,x1-x0+W*.1,z1-z0+W*.1);c.rect(x0,z0,x1-x0,z1-z0);c.clip('evenodd');c.fillStyle='rgba(255,30,30,.12)';c.fillRect(0,0,W,W);c.fillStyle='rgba(255,45,45,.6)';for(let y=0;y<W;y+=4)c.fillRect(0,y,W,1.3);c.restore();
 c.fillStyle='#202022';c.fillRect(x0,z0,x1-x0,z1-z0);c.fillStyle='rgba(255,255,255,.03)';for(let i=0;i<120;i++)c.fillRect(x0+rn()*(x1-x0),z0+rn()*(z1-z0),2+rn()*8,2+rn()*5);
 const rect=b=>[X(b.x0),Z(b.z0),Math.max(1,(b.x1-b.x0)*k),Math.max(1,(b.z1-b.z0)*k)];
 for(const b of bx){if(b.h<=.3||b.h>=13.9)continue;const hi=(b.y0||0)>=2,r=rect(b);if(hi){c.fillStyle='rgba(150,150,156,.45)';c.fillRect(...r);continue}
  if(b.h>3){c.fillStyle='#6f6f73';c.fillRect(...r);c.strokeStyle='rgba(255,255,255,.9)';c.lineWidth=1;c.strokeRect(r[0]+.5,r[1]+.5,r[2],r[3])}else if(b.h>1.2){c.fillStyle='#4e4e52';c.fillRect(...r);c.strokeStyle='rgba(200,200,200,.55)';c.lineWidth=1;c.strokeRect(r[0]+.5,r[1]+.5,r[2],r[3])}else{c.fillStyle='#3a3a3d';c.fillRect(...r)}}
 c.strokeStyle='#fff';c.lineWidth=2;c.strokeRect(x0,z0,x1-x0,z1-z0);
 /* targeting-screen decoration */
 c.strokeStyle='rgba(255,60,60,.8)';c.lineWidth=2;const br=22,m=8;for(const[bx_,by_,sx,sy]of[[m,m,1,1],[W-m,m,-1,1],[m,W-m,1,-1],[W-m,W-m,-1,-1]]){c.beginPath();c.moveTo(bx_,by_+sy*br);c.lineTo(bx_,by_);c.lineTo(bx_+sx*br,by_);c.stroke()}
 c.fillStyle='rgba(255,70,70,.85)';c.font='12px monospace';c.fillText('25.06',W*.58,18);c.fillText('55.77',10,W*.34);c.fillText('23.5',W-48,W*.62);c.beginPath();c.moveTo(W-52,24);c.lineTo(W-44,16);c.lineTo(W-36,24);c.lineTo(W-44,32);c.closePath();c.stroke();c.fillStyle='rgba(255,255,255,.8)';c.fillText('N',W/2-3,16);
 const dot=(x,z,col,r)=>{c.fillStyle=col;c.beginPath();c.arc(X(x),Z(z),r,0,7);c.fill();c.strokeStyle='rgba(0,0,0,.6)';c.lineWidth=1;c.stroke()};
 for(const z of zones)dot(z.x,z.z,z.o=='A'?'#62a8ff':z.o=='B'?'#ff5a3a':'#ddd',Math.max(6,(z.r||5)*k));for(const f of flags)dot(f.x,f.z,f.team=='A'?'#62a8ff':'#ff5a3a',6);
 if(mode=='Zombies'&&typeof zdoors!='undefined'){for(const d of zdoors)if(!d.sink)dot(d.x||d.o&&d.o.x||0,d.z||d.o&&d.o.z||0,'#ffb454',4)}
 for(const b of bots)if(b.al&&(ally(b)||uav>0))dot(b.x,b.z,ally(b)?'#62e0f0':'#ff5a3a',4);
 /* you: the arrow points where you look (world forward is (-sin yaw, -cos yaw); the arrow tip is drawn pointing up, so it is rotated by -yaw) */
 c.save();c.translate(X(P.x),Z(P.z));c.rotate(-yaw);c.fillStyle='#fff';c.strokeStyle='#000';c.lineWidth=1.5;c.beginPath();c.moveTo(0,-10);c.lineTo(-6.5,8);c.lineTo(0,4);c.lineTo(6.5,8);c.closePath();c.fill();c.stroke();c.restore()}
/* ---------- keyboard + mouse ---------- */
function kbDown(e){const c=RB(e.code);if(['Space','Tab','AltLeft','F1','F3','F6','ControlLeft'].includes(c)||c.startsWith('Arrow'))e.preventDefault();key[c]=1;
 switch(c){
  case'Space':actJumpPress();break;
  case'ShiftLeft':if(!e.repeat){if(t0-ST.lastShift<.32&&ST.tacCd<=0)ST.tac=4;ST.lastShift=t0}break;
  case'KeyC':if(!e.repeat)actCrouch();break;case'ControlLeft':if(!e.repeat)actProne();break;case'AltLeft':ST.walk=1;break;
  case'KeyH':if(!e.repeat)ST.auto=ST.auto?0:1;break;
  case'KeyR':startRel();break;case'KeyV':if(!e.repeat)mvDown();break;case'KeyY':if(!e.repeat&&typeof actInspect=='function')actInspect();break;case'KeyE':if(!e.repeat)throwG();break;case'KeyQ':if(!e.repeat)actTactical();break;
  case'KeyF':if(!e.repeat)actInteract();break;case'KeyT':if(!e.repeat)actMount();break;case'KeyB':if(!e.repeat)actFireMode();break;
  case'KeyX':if(!e.repeat)actField();break;
  case'Digit1':actSwapNext();break;case'Digit2':actSwapPrev();break;
  case'Digit3':useStreak(0);break;case'Digit4':useStreak(1);break;case'Digit5':useStreak(2);break;case'Digit6':useStreak(3);break;
  case'Tab':if(!e.repeat)actSb(1);break;case'KeyM':case'CapsLock':if(!e.repeat)actMap();break;case'KeyN':if(!e.repeat)actNV();break;
  case'F1':case'F3':case'F6':case'KeyO':paused=1;trig=0;showPause();if(document.exitPointerLock)document.exitPointerLock();break}}
addEventListener('keyup',e=>{const c=RB(e.code);if(c=='KeyV')mvUp();if(c=='Tab'){actSb(0)}if(c=='AltLeft')ST.walk=0});
addEventListener('mousedown',e=>{if(!run||paused||over)return;if(e.button==2){actAds(1)}else if(e.button==1){e.preventDefault();actPing()}else if(e.button==3){e.preventDefault();mvDown()}else if(e.button==4){e.preventDefault();actMount()}});
addEventListener('mouseup',e=>{if(e.button==2)actAds(0);if(e.button==3)mvUp()});
addEventListener('wheel',e=>{if(!run||paused||over)return;if(e.deltaY>0)actSwapNext();else if(e.deltaY<0)actSwapPrev()},{passive:true});
/* menu hot keys while no match is running */
addEventListener('keydown',e=>{if(run)return;const nav=p=>{const b=document.querySelector(`#nav button[data-p="${p}"]`);if(b&&b.offsetParent!==null||b)b.click()};
 if(e.code=='F1'){e.preventDefault();const h=$('#hbtns');if(typeof showHome=='function')showHome()}else if(e.code=='F3'){e.preventDefault();nav('set')}else if(e.code=='F6'){e.preventDefault();nav('load')}else if(e.code=='KeyO'&&document.activeElement.tagName!='INPUT'){nav('priv')}});

/* ---------- Katana: the melee weapon. Hand-built model: single-edged curved blade with a raised ridge line, fuller grooves, a wavy temper line and a pointed tip, gold collar and washers,
   an iron guard with gold studs, a cord-wrapped grip over ray skin with a diamond wrap and ornaments, a gold collar and pommel cap and a red tassel ---------- */
const kat={t:0};
function buildKatana(){const g=new THREE.Group(),L=.7,w=.034,t=.0075,sori=.03,ph=(c,s)=>new THREE.MeshPhongMaterial({color:c,shininess:s,specular:0xffffff}),
 steel=ph(0xcfd6de,140),ridge=ph(0xe4eaf0,200),temper=ph(0xf8fbff,220),groove=new THREE.MeshLambertMaterial({color:0x4a525c}),gold=ph(0xc9a94d,70),iron=ph(0x2a2a30,40),white=new THREE.MeshLambertMaterial({color:0xe6e0d0}),wrap=new THREE.MeshLambertMaterial({color:0x14161a}),red=new THREE.MeshLambertMaterial({color:0x8a1414}),
 cv=y=>sori*Math.pow(y/L,2),N=16,
 ext=(pts,m,th)=>{const s=new THREE.Shape();pts.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));const e=new THREE.Mesh(new THREE.ExtrudeGeometry(s,{depth:th,bevelEnabled:false}),m);e.position.z=-th/2;return e},
 edge=y=>cv(y)+w*(1-.07*(y/L));
 const body=[[0,0]];for(let i=1;i<=N;i++){const y=L*i/N;body.push([cv(y),y])}body.push([cv(L)+w*.5,L+.048],[edge(L)-.004,L-.014]);for(let i=N;i>=0;i--){const y=L*i/N;body.push([edge(y),y])}
 const blade=new THREE.Group();blade.add(ext(body,steel,t));
 const rg=[];for(let i=0;i<=N;i++){const y=.01+(L-.1)*i/N;rg.push([cv(y)+w*.36,y])}for(let i=N;i>=0;i--){const y=.01+(L-.1)*i/N;rg.push([cv(y)+w*.4,y])}blade.add(ext(rg,ridge,t*1.3));
 for(const s of[0]){const gr=[];for(let i=0;i<=8;i++){const y=.07+(L-.2)*i/8;gr.push([cv(y)+.007,y])}for(let i=8;i>=0;i--){const y=.07+(L-.2)*i/8;gr.push([cv(y)+.013,y])}blade.add(ext(gr,groove,t*1.06))}
 const hm=[];for(let i=0;i<=40;i++){const y=.03+(L-.02)*i/40;hm.push([edge(y)-w*.42-.004*Math.sin(y*85)-.003*Math.sin(y*37),y])}for(let i=40;i>=0;i--){const y=.03+(L-.02)*i/40;hm.push([edge(y)-.0008,y])}blade.add(ext(hm,temper,t*1.04));
 blade.position.x=-w/2;g.add(blade);
 const cyl=(r1,r2,h,m,y,sz)=>{const e=new THREE.Mesh(new THREE.CylinderGeometry(r1,r2,h,18),m);e.position.y=y;e.scale.z=sz||1;g.add(e);return e},bx_=(a,b,c,m,x,y,z,rx,ry,rz)=>{const e=new THREE.Mesh(bg,m);e.scale.set(a,b,c);e.position.set(x,y,z);e.rotation.set(rx||0,ry||0,rz||0);g.add(e);return e};
 bx_(w+.006,.022,t+.009,gold,0,.009,0);bx_(w+.012,.004,t+.012,gold,0,.021,0);cyl(.0305,.0305,.004,gold,-.003,1.1).scale.x=1.4;cyl(.0305,.0305,.004,gold,-.0095,1.1).scale.x=1.4;
 const tsuba=cyl(.054,.054,.006,iron,-.015,1);const rim=new THREE.Mesh(new THREE.TorusGeometry(.054,.0035,8,32),iron);rim.rotation.x=Math.PI/2;rim.position.y=-.015;g.add(rim);const inner=new THREE.Mesh(new THREE.TorusGeometry(.038,.0016,6,32),gold);inner.rotation.x=Math.PI/2;inner.position.y=-.0115;g.add(inner);
 for(let i=0;i<4;i++){const a=i*Math.PI/2+Math.PI/4;const s=new THREE.Mesh(new THREE.SphereGeometry(.0055,8,6),gold);s.position.set(Math.cos(a)*.044,-.0115,Math.sin(a)*.044);g.add(s)}
 cyl(.0195,.0195,.016,gold,-.027,.8);
 cyl(.0165,.0155,.27,white,-.165,.8);
 for(let i=0;i<11;i++)cyl(.0172,.0172,.011,wrap,-.044-i*.0215,.8);
 for(let i=0;i<10;i++){for(const sd of[1,-1]){bx_(.0032,.03,.0035,wrap,-.0035,-.052-i*.0215,sd*.0142,0,0,.62);bx_(.0032,.03,.0035,wrap,.0035,-.052-i*.0215,sd*.0142,0,0,-.62)}}
 for(const sd of[1,-1]){bx_(.012,.017,.004,gold,0,-.1,sd*.0148);bx_(.012,.017,.004,gold,0,-.176,sd*.0148);bx_(.006,.008,.0045,gold,0,-.1,sd*.0148)}
 cyl(.0188,.0178,.016,gold,-.3,.8);cyl(.0085,.0085,.018,iron,-.3,.8);const kn=new THREE.Mesh(new THREE.SphereGeometry(.007,8,6),red);kn.position.set(0,-.31,.012);g.add(kn);bx_(.006,.05,.004,red,0,-.338,.012,0,0,.1);bx_(.005,.04,.004,red,.004,-.34,.012,0,0,-.12);
 g.visible=false;return g}
const katG=buildKatana();C.add(katG);
const KF=[{p:0,x:.3,y:-.18,z:-.5,rx:-1.2,rz:-.95,ry:.25},{p:.22,x:.42,y:.12,z:-.42,rx:-1.0,rz:-1.55,ry:.45},{p:.55,x:-.32,y:-.22,z:-.78,rx:-1.25,rz:1.35,ry:-.35},{p:1,x:-.16,y:-.55,z:-.5,rx:-.9,rz:.9,ry:0}];
function katSwing(){kat.t=.5;kat.hit=0}
function katTick(dt){if(xrS||ST.nvv){katG.visible=false;return}if(kat.t>0){kat.t-=dt;const p=cl(1-Math.max(0,kat.t)/.5,0,1);let a=KF[0],b=KF[1];for(let i=0;i<KF.length-1;i++)if(p>=KF[i].p){a=KF[i];b=KF[i+1]}let u=cl((p-a.p)/(b.p-a.p),0,1);u=u*u*(3-2*u);const L=k=>a[k]+(b[k]-a[k])*u;katG.visible=true;katG.position.set(L('x'),L('y'),L('z'));katG.rotation.set(L('rx'),L('ry'),L('rz'))}
 else if(MV.draw>.03&&melName()=='Katana'){const d=1-MV.draw,sw=Math.sin(t0*1.6)*.01;const fp=MV.flair>0?cl(1-MV.flair/.6,0,1):1,sp_=fp*fp*(3-2*fp);katG.visible=true;{const br=Math.sin(t0*1.3)*.006,mvs=Math.min(1,Math.hypot(P.mx||0,P.mz||0)/7);katG.position.set(.17-d*.12+Math.sin(bobP*.5)*.01*mvs,-.1-d*.55+sw+br+(1-sp_)*Math.sin(sp_*3.14)*.12,-.62+Math.cos(bobP)*.006*mvs);katG.rotation.set(-1.0+Math.sin(t0*.9)*.02+(MV.flair>0?Math.sin(sp_*6.283)*.5:0),.12,-.62+d*.6+Math.sin(t0*1.1)*.015+(MV.flair>0?(1-sp_)*-6.283:0))}}else katG.visible=false}
;
/* ######## input.js ######## */
/* ===================== input.js ===================== */
/* ---------- gamepad + WebXR VR: the same actions as keyboard and mouse (see controls.js), full menu navigation with the controller (spatial focus + on-screen keyboard)
   and menus inside the headset (the DOM menus are mirrored onto a panel you point at with the right controller) ---------- */
let usingPad=false,gpEdge={},gpT=0,gpSprint=0,gpTrig=0,gpMenuI=-1,vrMode=0,xrS=null,xrRig=null,rigYaw=0,xrCtl=[],xrGunIn=0,xrSnap=0,xrWrist=null,xrWristT=0,xrEye=null,gpHS={},gpPend={};
const QUEST=/OculusBrowser|Quest/i.test(navigator.userAgent||'');
try{vrMode=localStorage.getItem('sd-vr');vrMode=vrMode==null?(QUEST?1:0):+vrMode}catch(e){}
const gpBtn=(g,i)=>!!(g.buttons[i]&&g.buttons[i].pressed),gpVal=(g,i)=>g&&g.buttons[i]?g.buttons[i].value:0,gpDz=(v,d)=>Math.abs(v)<d?0:(v-Math.sign(v)*d)/(1-d);
function gpGet(){const l=navigator.getGamepads?navigator.getGamepads():[];for(const g of l)if(g&&g.connected&&g.axes.length>=4)return g;return null}
const gpEdgeOf=(k,on)=>{const r=on&&!gpEdge[k];gpEdge[k]=on;return r};
/* tap / hold buttons */
function holdBtn(id,on,dt,tap,hold,thr){thr=thr||.35;const h=gpHS[id]||(gpHS[id]={t:0,d:0,on:0});if(on){if(!h.on){h.on=1;h.t=0;h.d=0}h.t+=dt;if(!h.d&&h.t>=thr){h.d=1;hold&&hold()}}else if(h.on){h.on=0;if(!h.d&&tap)tap()}return h.on&&h.d}
const inMatch=()=>run&&!paused&&!over&&!(typeof fin!='undefined'&&fin);
function pausePad(){if(!run||over)return;paused=1;trig=0;gpTrig=0;gpSprint=0;actAds(0);showPause()}
function resumePad(){paused=0;hidePause();if(xrS)return;try{const p=R.domElement.requestPointerLock&&R.domElement.requestPointerLock();if(p&&p.catch)p.catch(()=>{})}catch(e){}}
const resumeAny=()=>{if(vrMode&&navigator.xr&&!xrS)$('#resume').click();else resumePad()};
/* ---------- shared "both bumpers = field upgrade" logic: single bumper actions fire after a short delay unless the other bumper joins ---------- */
function bumpers(dt,lb,rb,tactical,lethal,field){const e1=gpEdgeOf('bl',lb),e2=gpEdgeOf('br',rb);if((e1||e2)&&lb&&rb){field();gpPend.l=gpPend.r=0;gpPend.combo=1}else{if(e1)gpPend.l=.09;if(e2)gpPend.r=.09}
 if(!lb&&!rb)gpPend.combo=0;for(const k of['l','r'])if(gpPend[k]>0){gpPend[k]-=dt;if(gpPend[k]<=0&&!gpPend.combo)(k=='l'?tactical:lethal)()}}
/* ---------- controller in a match ---------- */
function padPlay(g,dt){const lx=gpDz(g.axes[0],.2),ly=gpDz(g.axes[1],.2),rx=gpDz(g.axes[2],.14),ry=gpDz(g.axes[3],.14);
 key.KeyA=lx<-.2;key.KeyD=lx>.2;key.KeyW=ly<-.2;key.KeyS=ly>.2;if(key.KeyS)ST.auto=0;
 {const l3=gpBtn(g,10);if(gpEdgeOf('l3',l3)){if(ST.ads>.4)actSteady();else{if(t0-ST.lastShift<.32&&ST.tacCd<=0)ST.tac=4;ST.lastShift=t0}}gpSprint=(l3&&ST.ads<=.4)?1:0}key.ShiftLeft=!!gpSprint;
 const cv=v=>Math.sign(v)*Math.pow(Math.abs(v),1.7);yaw-=cv(rx)*dt*3.4*sens*fr;pitch=cl(pitch-cv(ry)*dt*2.5*sens*fr,-1.45,1.45);
 const dw=cw()&&cw().dual&&!MV.eq,lt0=gpVal(g,6)>.4,lt=dw?false:lt0;DS.L=dw&&lt0;DS.R=dw&&gpVal(g,7)>.35;actAds(lt);const rt=dw?(DS.L||DS.R):gpVal(g,7)>.35;if(rt&&!gpTrig){gpTrig=1;trig=1;fresh=1}else if(!rt&&gpTrig){gpTrig=0;trig=0}
 key.Space=gpBtn(g,0);if(gpEdgeOf('a',key.Space))actJumpPress();
 holdBtn('b',gpBtn(g,1),dt,actCrouch,actProne,.4);
 const xh=holdBtn('x',gpBtn(g,2),dt,startRel,actInteract,.35);key.KeyF=!!xh;
 holdBtn('y',gpBtn(g,3),dt,actSwapNext,null,.5);
 bumpers(dt,gpBtn(g,4),gpBtn(g,5),actTactical,throwG,actField);
 {const r3=gpBtn(g,11);if(r3&&!PG.r3){if(lt)actMount();else mvDown()}else if(!r3&&PG.r3&&MV.down)mvUp();PG.r3=r3}
 if(gpEdgeOf('du',gpBtn(g,12)))actPing();holdBtn('dd',gpBtn(g,13),dt,actInv,actNV,.5);if(gpEdgeOf('dl',gpBtn(g,14)))actFireMode();if(gpEdgeOf('dr',gpBtn(g,15)))useStreak(0);
 const vh=holdBtn('v',gpBtn(g,8),dt,actMap,()=>actSb(1),.3);if(!gpBtn(g,8)&&ST.sbOn&&gpHS.v&&!gpHS.v.on)actSb(0);
 if(gpEdgeOf('st',gpBtn(g,9)))pausePad()}
/* ---------- menus with the controller: spatial focus, A press, B back, left/right changes drop-downs and sliders ---------- */
const vis=e=>e.getClientRects().length>0&&e.getBoundingClientRect().width>1;
function menuBox(){return['#osk','#dev','#pause','#end','#home','#menu'].map(s=>document.querySelector(s)).find(c=>c&&vis(c)&&getComputedStyle(c).display!='none')}
function clickables(box){const out=[],cs=e=>getComputedStyle(e).cursor=='pointer';
 for(const e of box.querySelectorAll('*')){if(!vis(e)||e.disabled)continue;const t=e.tagName,nat=t=='BUTTON'||t=='SELECT'||t=='INPUT'||t=='TEXTAREA'||(t=='A'&&e.href);
  /* a native control, or the root of a clickable region (cursor: pointer is inherited, so only the outermost element of a region counts) */
  if(nat||e.onclick||(cs(e)&&!(e.parentElement&&e.parentElement!==box&&cs(e.parentElement)))){if(!nat&&!e.hasAttribute('tabindex'))e.setAttribute('tabindex','-1');out.push(e)}}
 /* things nested inside a native control (a <b> inside a <button>) belong to it; plain clickable wrappers yield to what they contain */
 const nt=e=>e.tagName=='BUTTON'||e.tagName=='SELECT'||e.tagName=='INPUT'||e.tagName=='TEXTAREA'||(e.tagName=='A'&&e.href);
 return out.filter(e=>!out.some(o=>o!==e&&((o.contains(e)&&nt(o))||(e.contains(o)&&!nt(e)))))}
function spatial(els,cur,dx,dy){const r=cur.getBoundingClientRect(),cx=r.left+r.width/2,cy=r.top+r.height/2;let best=null,bs=1e9;for(const e of els){if(e===cur)continue;const q=e.getBoundingClientRect(),vx=q.left+q.width/2-cx,vy=q.top+q.height/2-cy,along=vx*dx+vy*dy;if(along<=2)continue;const s=along+Math.abs(vx*dy-vy*dx)*2.2;if(s<bs){bs=s;best=e}}return best}
function menuAct(el,back){const t=el.tagName;if(t=='SELECT'){el.selectedIndex=(el.selectedIndex+(back?el.options.length-1:1))%el.options.length;el.dispatchEvent(new Event('change',{bubbles:true}))}else if(t=='INPUT'&&el.type=='range'){}else if((t=='INPUT'&&el.type!='checkbox'&&el.type!='range')||t=='TEXTAREA')openOSK(el);else if(el.id=='resume')resumeAny();else el.click()}
function menuNav(g,dt){
 /* podium after a match: the four face buttons are the four emotes */
 {const f=$('#fin');if(f&&typeof fin!='undefined'&&fin&&f.getClientRects().length){for(let i=0;i<4;i++)if(gpEdgeOf('fe'+i,gpBtn(g,i))){const e=f.querySelector('[data-e="'+i+'"]');e&&e.click()}return}}
 const box=menuBox();if(!box)return;const els=clickables(box);if(!els.length)return;
 const OK=PG.type=='ns'?1:0,BK=PG.type=='ns'?0:1;/* Nintendo layout: the right-hand button (A) confirms, the bottom one (B) goes back */
 let cur=els.includes(document.activeElement)?document.activeElement:null;
 if(!cur){cur=els[0];cur.focus()}gpT-=dt;
 const up=gpBtn(g,12)||g.axes[1]<-.6,dn=gpBtn(g,13)||g.axes[1]>.6,lf=gpBtn(g,14)||g.axes[0]<-.6,rt=gpBtn(g,15)||g.axes[0]>.6;
 if(!(up||dn||lf||rt)){gpT=0;PG.rep=0}
 if((up||dn||lf||rt)&&gpT<=0){PG.rep=(PG.rep||0)+1;gpT=PG.rep>5?.06:.2;const isSel=cur.tagName=='SELECT',isRng=cur.type=='range';
  if((lf||rt)&&(isSel||isRng)){if(isSel){cur.selectedIndex=cl(cur.selectedIndex+(rt?1:-1),0,cur.options.length-1);cur.dispatchEvent(new Event('change',{bubbles:true}))}else{const s=(+cur.step||1)*(PG.rep>5?3:1);cur.value=+cur.value+(rt?s:-s);cur.dispatchEvent(new Event('input',{bubbles:true}));cur.dispatchEvent(new Event('change',{bubbles:true}))}}
  else{let n=spatial(els,cur,lf?-1:rt?1:0,up?-1:dn?1:0);
   /* nothing lies in that direction: fall back to the next or previous control in page order, so nothing is ever out of reach */
   if(!n){const i=els.indexOf(cur);n=els[(i+((dn||rt)?1:-1)+els.length)%els.length]}
   if(n){n.focus();n.scrollIntoView({block:'nearest',inline:'nearest'})}}}
 /* LB / RB: previous / next loadout slot, or previous / next main menu tab */
 {const lb=gpEdgeOf('mlb',gpBtn(g,4)),rb=gpEdgeOf('mrb',gpBtn(g,5));if((lb||rb)&&box.id!='osk'){const tabs=[...box.querySelectorAll('.lo-tabs .lt')].filter(vis),nav=box.id=='menu'?[...document.querySelectorAll('#nav button')].filter(b=>vis(b)&&b.id!='back'):[],list=tabs.length?tabs:nav;
   if(list.length){let i=list.findIndex(b=>b.classList.contains('on')||b.classList.contains('act')||b.classList.contains('sel'));if(i<0)i=list.indexOf(document.activeElement);if(i<0)i=PG.tabI||0;i=(i+(rb?1:-1)+list.length)%list.length;PG.tabI=i;list[i].click();if(!tabs.length)setTimeout(()=>{const f=clickables(box).find(e=>e!==list[i]&&!e.closest('#nav'));f&&f.focus&&f.focus()},60)}}}
 if(box.id=='osk'){const k=c=>{const b=box.querySelector('[data-k="'+c+'"]');b&&b.click()};if(gpEdgeOf('ox',gpBtn(g,2)))k('⌫');if(gpEdgeOf('oy',gpBtn(g,3)))k(' ');if(gpEdgeOf('os',gpBtn(g,9)))k('OK')}
 if(gpEdgeOf('a',gpBtn(g,OK)))menuAct(document.activeElement&&els.includes(document.activeElement)?document.activeElement:cur);
 if(gpEdgeOf('b',gpBtn(g,BK))){if(box.id=='osk')closeOSK();else if(box.id=='pause')resumeAny();else{const b=$('#back');if(b&&vis(b))b.click();else{const t=$('#tomenu');if(t&&vis(t))t.click()}}}
 if(gpEdgeOf('s',gpBtn(g,9))&&box.id=='pause')resumeAny()}
/* ---------- on-screen keyboard (used by controller and VR for the name and match code boxes) ---------- */
let oskT=null;
function openOSK(inp){const o=$('#osk');if(!o.dataset.b){o.dataset.b=1;const rows=['1234567890','QWERTYUIOP','ASDFGHJKL','ZXCVBNM'];o.innerHTML=rows.map(r=>'<div class="r">'+[...r].map(c=>`<button data-k="${c}">${c}</button>`).join('')+'</div>').join('')+'<div class="r"><button data-k="-">-</button><button data-k=" " style="min-width:200px">space</button><button data-k="⌫">⌫</button><button data-k="OK" style="min-width:90px">Done</button></div>';
  o.onclick=e=>{const b=e.target.closest('button');if(!b||!oskT)return;const k=b.dataset.k;if(k=='OK')return closeOSK();let v=oskT.value;if(k=='⌫')v=v.slice(0,-1);else if(!oskT.maxLength||oskT.maxLength<0||v.length<oskT.maxLength)v+=(oskT.id=='jc'?k:(v.length?k.toLowerCase():k));oskT.value=v;oskT.dispatchEvent(new Event('input',{bubbles:true}));oskT.dispatchEvent(new Event('change',{bubbles:true}))}}
 oskT=inp;o.style.display='block';const f=o.querySelector('button');f&&f.focus()}
function closeOSK(){const o=$('#osk');o.style.display='none';oskT=null}
function inputTick(dt){if(xrS){vrPre(dt);return}
 const g=gpGet();if(!g){if(usingPad&&gpTrig){gpTrig=0;trig=0}return}
 const any=g.buttons.some(b=>b.pressed)||g.axes.some(a=>Math.abs(a)>.5);
 PG.sync(g,any);
 if(!usingPad)return;if(inMatch())padPlay(g,dt);else{if(gpTrig){gpTrig=0;trig=0}if(ST.adsIn)actAds(0);menuNav(g,dt)}}
addEventListener('gamepadconnected',e=>{PG.sync(e.gamepad,true)});addEventListener('gamepaddisconnected',()=>{if(!gpGet())PG.setOn(false)});
/* ---------------- VR ---------------- */
if(R.xr)xrCtl=[0,1].map(i=>{const c=R.xr.getController(i);c.addEventListener('connected',e=>{c.userData.hand=e.data.handedness;c.userData.gp=e.data.gamepad});c.addEventListener('disconnected',()=>{c.userData.hand=null;c.userData.gp=null});return c});
const vrHand=h=>xrCtl.find(c=>c.userData.hand==h)||null;
function vrPanel(){const c=document.createElement('canvas');c.width=256;c.height=160;const t=new THREE.CanvasTexture(c),m=new THREE.Mesh(new THREE.PlaneGeometry(.16,.1),new THREE.MeshBasicMaterial({map:t,transparent:true,depthTest:false}));m.renderOrder=999;m.position.set(0,.03,.08);m.rotation.x=-1.1;return{m,c,g:c.getContext('2d'),t}}
/* menu panel: a big canvas that mirrors whatever DOM menu is showing; the right controller is a laser pointer */
let vm=null,vmT=0,vmHover=null,vmLast='',vmLatch=null;
function vrMenuInit(){const cv=document.createElement('canvas');cv.width=1280;cv.height=Math.round(1280*innerHeight/innerWidth);const tex=new THREE.CanvasTexture(cv),w=2.0,h=w*innerHeight/innerWidth,mesh=new THREE.Mesh(new THREE.PlaneGeometry(w,h),new THREE.MeshBasicMaterial({map:tex,transparent:true,side:THREE.DoubleSide,depthTest:false}));mesh.renderOrder=900;
 const dot=new THREE.Mesh(new THREE.SphereGeometry(.012,8,8),new THREE.MeshBasicMaterial({color:0x62e0f0,depthTest:false}));dot.renderOrder=999;const ray=new THREE.Mesh(new THREE.CylinderGeometry(.002,.002,1,6),new THREE.MeshBasicMaterial({color:0x62e0f0,depthTest:false}));ray.renderOrder=999;
 vm={cv,c:cv.getContext('2d'),tex,mesh,dot,ray,w,h,ray_:new THREE.Raycaster(),placed:false}}
function vrMenuPlace(){const cam=R.xr.getCamera(C);cam.updateMatrixWorld(true);const p=new THREE.Vector3().setFromMatrixPosition(cam.matrixWorld),d=new THREE.Vector3(0,0,-1).transformDirection(cam.matrixWorld);d.y=0;if(d.length()<.1)d.set(0,0,-1);d.normalize();
 /* 1.5 m in front of the eyes, centred on eye height; the plane's front (+z) is turned towards the player */
 vm.mesh.position.set(p.x+d.x*1.5,p.y-.05,p.z+d.z*1.5);vm.mesh.rotation.set(0,Math.atan2(p.x-vm.mesh.position.x,p.z-vm.mesh.position.z),0);vm.mesh.updateMatrixWorld(true);vm.placed=true}
function wrapText(c,t,x,y,mw,lh){const ws=t.split(/\s+/);let l='';for(const w of ws){const n=l?l+' '+w:w;if(c.measureText(n).width>mw&&l){c.fillText(l,x,y);y+=lh;l=w}else l=n}if(l)c.fillText(l,x,y);return y}
function vrMirror(box){const c=vm.c,sc=vm.cv.width/innerWidth;c.clearRect(0,0,vm.cv.width,vm.cv.height);c.fillStyle='rgba(6,14,20,.94)';c.fillRect(0,0,vm.cv.width,vm.cv.height);
 for(const e of[box,...box.querySelectorAll('*')]){if(!vis(e))continue;const r=e.getBoundingClientRect();if(r.bottom<0||r.top>innerHeight||r.right<0||r.left>innerWidth)continue;const cs=getComputedStyle(e);if(cs.visibility=='hidden'||cs.opacity==0)continue;const x=r.left*sc,y=r.top*sc,w=r.width*sc,h=r.height*sc;
  const bg=cs.backgroundColor;if(bg&&!/rgba?\(0, 0, 0, 0\)|transparent/.test(bg)){c.fillStyle=bg;c.fillRect(x,y,w,h)}
  if(parseFloat(cs.borderTopWidth)>0&&cs.borderTopStyle!='none'){c.strokeStyle=cs.borderTopColor;c.lineWidth=Math.max(1,parseFloat(cs.borderTopWidth)*sc);c.strokeRect(x,y,w,h)}
  if(e===vmHover&&(e.tagName=='BUTTON'||e.onclick||cs.cursor=='pointer'||e.tagName=='SELECT'||e.tagName=='INPUT')){c.strokeStyle='#62e0f0';c.lineWidth=3;c.strokeRect(x-1,y-1,w+2,h+2)}
  let txt='';if(e.tagName=='SELECT')txt=e.options[e.selectedIndex]?e.options[e.selectedIndex].text:'';else if(e.tagName=='INPUT'&&e.type=='range'){const f=(e.value-e.min)/(e.max-e.min);c.fillStyle='#345';c.fillRect(x,y+h/2-3,w,6);c.fillStyle='#62e0f0';c.fillRect(x,y+h/2-3,w*f,6);c.fillRect(x+w*f-5,y+h/2-9,10,18)}else if(e.tagName=='INPUT'||e.tagName=='TEXTAREA')txt=e.value||e.placeholder;else txt=[...e.childNodes].filter(n=>n.nodeType==3).map(n=>n.textContent.trim()).filter(Boolean).join(' ');
  if(txt){const fs=Math.max(10,parseFloat(cs.fontSize)*sc);c.font=`${cs.fontWeight>=600?'700':'500'} ${fs}px Rajdhani,Teko,sans-serif`;c.fillStyle=cs.color;c.textBaseline='top';if(cs.textTransform=='uppercase')txt=txt.toUpperCase();
   const ctr=cs.textAlign=='center'||e.tagName=='BUTTON'||e.tagName=='SELECT'||(cs.display.includes('flex')&&cs.justifyContent=='center');c.textAlign=ctr?'center':'left';const tx=ctr?x+w/2:x+parseFloat(cs.paddingLeft)*sc;
   if(e.tagName=='BUTTON'||e.tagName=='SELECT'||e.tagName=='INPUT'){c.textBaseline='middle';c.fillText(txt,tx,y+h/2,w)}else wrapText(c,txt,tx,y+parseFloat(cs.paddingTop)*sc,Math.max(20,w-parseFloat(cs.paddingLeft)*sc*2),fs*1.15)}}
 vm.tex.needsUpdate=true}
function vrMenu(dt,gr,gl){const box=menuBox();if(!vm)vrMenuInit();const rh=vrHand('right')||vrHand('left');
 if(!box){if(vm.mesh.parent)vm.mesh.parent.remove(vm.mesh);for(const o of[vm.dot,vm.ray])if(o.parent)o.parent.remove(o);vm.placed=false;return}
 if(!vm.mesh.parent){S.add(vm.mesh);S.add(vm.dot);S.add(vm.ray);vmLast='';vm.placeN=6}
 if(!vm.placed||vm.placeN-->0)vrMenuPlace();vmT-=dt;
 let hit=null;if(rh){xrRig.updateMatrixWorld(true);const m=new THREE.Matrix4().multiplyMatrices(xrRig.matrixWorld,rh.matrix),o=new THREE.Vector3().setFromMatrixPosition(m),d=new THREE.Vector3(0,0,-1).transformDirection(m);vm.ray_.set(o,d);vm.mesh.updateMatrixWorld(true);const h=vm.ray_.intersectObject(vm.mesh)[0];
  vm.ray.position.copy(o).addScaledVector(d,(h?h.distance:3)/2);vm.ray.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),d);vm.ray.scale.set(1,h?h.distance:3,1);
  if(h){hit=h;vm.dot.visible=true;vm.dot.position.copy(h.point)}else vm.dot.visible=false}
 let px=-1,py=-1,el=null;if(hit){px=hit.uv.x*innerWidth;py=(1-hit.uv.y)*innerHeight;el=document.elementFromPoint(px,py);el=el&&(el.closest('button,select,input,textarea,label,[onclick]')||(getComputedStyle(el).cursor=='pointer'?el:el.closest('*')))}
 if(el!==vmHover){vmHover=el;vmT=0}
 const trg=gpVal(gr,0)>.5||gpVal(gl,0)>.5,grip=gpVal(gr,1)>.5;
 if(gpEdgeOf('vmt',trg)&&el&&box.contains(el)){if(el.tagName=='INPUT'&&el.type=='range'){const r=el.getBoundingClientRect(),f=cl((px-r.left)/r.width,0,1),s=+el.step||1;el.value=Math.round((+el.min+(el.max-el.min)*f)/s)*s;el.dispatchEvent(new Event('input',{bubbles:true}));el.dispatchEvent(new Event('change',{bubbles:true}))}else menuAct(el,false)}
 if(gpEdgeOf('vmg',grip)&&el&&el.tagName=='SELECT')menuAct(el,true);
 const sy=gr?gpDz(gr.axes[3]||0,.25):0;if(sy){let s=el;while(s&&s!==document.body){if(s.scrollHeight>s.clientHeight+4&&/auto|scroll/.test(getComputedStyle(s).overflowY)){s.scrollTop+=sy*500*dt;break}s=s.parentElement}}
 if(gpEdgeOf('vmb',b4(gl,5)||b4(gr,5))){if(box.id=='osk')closeOSK();else if(box.id=='pause')resumeAny();else{const b=$('#back');if(b&&vis(b))b.click()}}
 if(vmT<=0){vmT=.25;vrMirror(box)}}
const b4=(g,i)=>!!(g&&g.buttons[i]&&g.buttons[i].pressed);
function vrMenuClear(){if(vm){for(const o of[vm.mesh,vm.dot,vm.ray])if(o&&o.parent)o.parent.remove(o);vm.placed=false;vmHover=null}}
function vrStart(){vrMenuClear();xrRig=xrRig||(()=>{const r=new THREE.Group();S.add(r);return r})();S.remove(C);xrRig.add(C);rigYaw=yaw;for(const c of xrCtl)xrRig.add(c);xrGunIn=0;xrSnap=0;sun.castShadow=false;xrWrist=vrPanel();vmLatch=null;R.setAnimationLoop(gameFrame)}
function vrEnd(){R.setAnimationLoop(null);xrS=null;if(xrRig){xrRig.remove(C);S.add(C);for(const c of xrCtl)xrRig.remove(c);if(vm){for(const o of[vm.mesh,vm.dot,vm.ray])if(o.parent)o.parent.remove(o);vm.placed=false}}C.add(gun);gun.position.set(.2,-.2,-.45);gun.rotation.set(0,0,0);if(xrWrist&&xrWrist.m.parent)xrWrist.m.parent.remove(xrWrist.m);xrWrist=null;sun.castShadow=gfxQ=='high';C.aspect=innerWidth/innerHeight;C.updateProjectionMatrix();trig=0;gpTrig=0;for(const k in key)key[k]=false;if(run&&!over&&!paused)pausePad()}
function vrPre(dt){const rh=vrHand('right'),lh=vrHand('left'),gr=rh&&rh.userData.gp,gl=lh&&lh.userData.gp;
 if(!inMatch()){ /* menus, pause, podium: the rig floats at the camera the menu uses, controllers become a laser pointer */
  for(const k in key)key[k]=false;trig=0;gpTrig=0;actAds(0);const _fin=typeof fin!='undefined'&&fin,_kind=_fin?2:run?1:0;
  /* main menu: stand still at a fixed aerial spot facing the arena (the desktop menu camera orbits, which in VR made the player drift away from the menu panel); podium: follow the podium camera; pause: stay where the match was */
  if(!vmLatch||_fin||vmLatch.k!==_kind){if(_kind==0){const r=H*.75;vmLatch=new THREE.Vector3(Math.cos(ma)*r,Math.max(0,11-1.6),Math.sin(ma)*r);vmLatch.face=Math.atan2(vmLatch.x,vmLatch.z)}else{vmLatch=C.position.clone();vmLatch.y=Math.max(0,vmLatch.y-1.6);vmLatch.face=null}vmLatch.k=_kind;if(vm)vm.placed=false}
  xrRig.position.copy(vmLatch);xrRig.rotation.y=_fin?0:(vmLatch.face!=null?vmLatch.face:rigYaw);vrMenu(dt,gr,gl);return}
 if(vm&&vm.mesh.parent){vm.mesh.parent.remove(vm.mesh);vm.dot.parent&&vm.dot.parent.remove(vm.dot);vm.ray.parent&&vm.ray.parent.remove(vm.ray);vm.placed=false}vmLatch=null;
 xrRig.position.set(P.x,P.y||0,P.z);xrRig.rotation.y=rigYaw;xrRig.updateMatrixWorld(true);
 if(rh){const m=new THREE.Matrix4().multiplyMatrices(xrRig.matrixWorld,rh.matrix),d=new THREE.Vector3(0,0,-1).transformDirection(m);yaw=Math.atan2(-d.x,-d.z);pitch=cl(Math.asin(Math.max(-1,Math.min(1,d.y))),-1.45,1.45)}
 const lx=gl?gpDz(gl.axes[2]||0,.25):0,ly=gl?gpDz(gl.axes[3]||0,.25):0;key.KeyA=lx<-.2;key.KeyD=lx>.2;key.KeyW=ly<-.2;key.KeyS=ly>.2;if(key.KeyS)ST.auto=0;
 {const lsc=!!gl&&!!b4(gl,3);if(gpEdgeOf('lsc',lsc)){if(t0-ST.lastShift<.32&&ST.tacCd<=0)ST.tac=4;ST.lastShift=t0}gpSprint=lsc?1:0}key.ShiftLeft=!!gpSprint;
 const tx=gr?gr.axes[2]||0:0,ty=gr?gr.axes[3]||0:0;if(Math.abs(tx)>.7){if(!xrSnap){rigYaw-=Math.sign(tx)*Math.PI/6;xrSnap=1}}else xrSnap=0;
 if(gpEdgeOf('vru',ty<-.8))actPing();if(gpEdgeOf('vrd',ty>.8))actFireMode();
 const rt=gpVal(gr,0)>.4;if(rt&&!gpTrig){gpTrig=1;trig=1;fresh=1}else if(!rt&&gpTrig){gpTrig=0;trig=0}
 key.Space=b4(gr,4);if(gpEdgeOf('va',key.Space))actJumpPress();
 holdBtn('vb',b4(gr,5),dt,actSwapNext,null,.5);holdBtn('vx',b4(gl,4),dt,actCrouch,actProne,.4);
 const rg=gpVal(gr,1)>.6,lg=gpVal(gl,1)>.6,xh=holdBtn('vrg',rg&&!lg,dt,startRel,actInteract,.35);key.KeyF=!!xh;if(gpEdgeOf('vfld',rg&&lg))actField();else if(lg&&!rg)if(gpEdgeOf('vlg',lg))actTactical();
 if(gpEdgeOf('vlt',gpVal(gl,0)>.5))throwG();if(gpEdgeOf('vrs',b4(gr,3)))melee();
 if(gpEdgeOf('vy',b4(gl,5)))pausePad()}
/* after the game has updated: put the gun in the right hand, hide the camera-attached arms, draw the wrist HUD */
function vrAfter(){if(xrS&&xrEye)C.position.copy(xrEye)}
function vrOrg(){if(!xrS||!inMatch())return null;const rh=vrHand('right');if(!rh||!xrRig)return null;xrRig.updateMatrixWorld(true);const m=new THREE.Matrix4().multiplyMatrices(xrRig.matrixWorld,rh.matrix),p=new THREE.Vector3().setFromMatrixPosition(m);return p.add(aimDir().multiplyScalar(.12))}
function vrPost(dt){if(!xrS)return;xrEye=C.position.clone();const rh=vrHand('right'),lh=vrHand('left');
 if(rh&&!xrGunIn){rh.add(gun);xrGunIn=1}else if(rh&&gun.parent!==rh)rh.add(gun);
 if(rh){const _w=cw(),_A=_w&&typeof curAnch=='function'?curAnch(_w.k):null;/* the weapon's right-hand grip point sits exactly on the controller */if(_A&&_A.r)gun.position.set(-_A.r[0],-_A.r[1],-_A.r[2]);else gun.position.set(0,-.025,-.06);gun.rotation.set(0,0,0);gun.visible=inMatch()}
 if(typeof fpArm!='undefined')for(const a of[fpArm.r,fpArm.l])a.up.visible=a.fo.visible=false;
 if(lh&&xrWrist&&inMatch()){if(xrWrist.m.parent!==lh)lh.add(xrWrist.m);xrWristT-=dt;if(xrWristT<=0){xrWristT=.2;const g=xrWrist.g;g.clearRect(0,0,256,160);g.fillStyle='rgba(8,18,24,.78)';g.fillRect(0,0,256,160);g.fillStyle='#fff';g.font='bold 34px sans-serif';g.fillText($('#am').textContent||'',12,44);
   const bar=(y,col,el)=>{g.fillStyle='rgba(255,255,255,.15)';g.fillRect(12,y,232,14);g.fillStyle=col;g.fillRect(12,y,232*Math.max(0,Math.min(1,parseFloat(el.style.width)/100||0)),14)};bar(62,'#62e0f0',$('#sh'));bar(84,'#6bd66b',$('#hp'));
   g.font='24px sans-serif';g.fillStyle='#ffd27a';g.fillText(mode=='Zombies'?('Round '+($('#zr').textContent||'')+'   '+($('#zpt').textContent||'')):('Kills '+kills),12,128);xrWrist.t.needsUpdate=true}}
 else if(xrWrist&&xrWrist.m.parent)xrWrist.m.parent.remove(xrWrist.m)}
function enterVR(){if(!navigator.xr)return false;navigator.xr.requestSession('immersive-vr',{optionalFeatures:['local-floor','bounded-floor']}).then(s=>{xrS=s;s.addEventListener('end',vrEnd);R.xr.enabled=true;R.xr.setReferenceSpaceType('local-floor');return R.xr.setSession(s)}).then(()=>{if(xrS)vrStart()}).catch(()=>{xrS=null;if(run)_lockPtr()});return true}
const _lockPtr=lockPtr;
lockPtr=function(){if(xrS){paused=0;hidePause();return}if(vrMode&&navigator.xr&&run&&!over){enterVR();return}_lockPtr()};
/* auto VR: where WebXR exists (Quest browser), the whole site opens in VR. Browsers only allow starting VR from a user gesture, so the very first click / trigger pull anywhere on the page does it
   (and the browser's own "enter VR" offer is registered where supported) */
if(navigator.xr&&navigator.xr.isSessionSupported)navigator.xr.isSessionSupported('immersive-vr').then(ok=>{if(!ok)return;$('#vrL').style.display='';$('#vrm').value=vrMode;$('#vrm').onchange=e=>{vrMode=+e.target.value;try{localStorage.setItem('sd-vr',vrMode)}catch(_){}};
 try{if(navigator.xr.offerSession)navigator.xr.offerSession('immersive-vr',{optionalFeatures:['local-floor','bounded-floor']}).then(s=>{xrS=s;s.addEventListener('end',vrEnd);R.xr.enabled=true;R.xr.setReferenceSpaceType('local-floor');return R.xr.setSession(s)}).then(()=>{if(xrS)vrStart()}).catch(()=>{})}catch(e){}
 if(vrMode){const sp=document.createElement('div');sp.id='vrsplash';sp.innerHTML='<b>ENTER VR</b><span>Pull the trigger or click anywhere</span>';document.body.appendChild(sp);const go=()=>{sp.remove();if(!xrS)enterVR()};sp.addEventListener('click',go,{once:true});sp.addEventListener('pointerdown',go,{once:true})}}).catch(()=>{});
;
/* ######## melee.js ######## */
/* ===================== melee.js ===================== */
/* ---------- melee: tap V = quick weaker strike with the weapon in your hands (rifle butt), hold V = draw the melee weapon picked in your loadout and hit much harder.
   Melee weapons: Katana (two hands on the base of the grip, long reach, cuts up to 3 enemies) and Fists (fast, two punches alternating).
   Also builds the first-person arms: sleeves in the colour of the player character, cuff, gloved hand with palm, knuckle plate, four curled fingers and a thumb. ---------- */
const MEL={Katana:{n:'Katana',d:100,reach:3.1,cnt:3,cd:.55,zf:1,desc:'Two-handed blade. Long reach, can hit several enemies, very high damage when drawn.'},
 Fists:{n:'Fists',d:72,reach:2.4,cnt:1,cd:.4,zf:.55,desc:'Fast alternating punches. Short reach, but the quickest melee.'},
 'Nitrogen Fists':{n:'Nitrogen Fists',d:96,reach:2.8,cnt:2,cd:.36,zf:.85,desc:'Rocket-assisted gauntlets. Every strike is a thruster-driven forward slash that hits two enemies and gets louder and faster the longer you keep swinging.'}};
const MV={down:0,h:0,f:0,draw:0,hold:0,eq:0,flair:0},MB={t:0,d:.34},FI={t:0,side:0,d:.3};
const melName=()=>zomOn()?zMelKey():(MEL[L.me]?L.me:'Katana');
function mvReset(){MV.down=MV.h=MV.f=MV.hold=MV.eq=MV.flair=0;MV.draw=0;MB.t=0;FI.t=0}
/* V: tap = quick strike with the weapon in your hands (or put the melee weapon away if it is out), hold = whip the melee weapon out; it then stays in your hands like any weapon and the fire button swings it */
function mvDown(){if(!run||paused||over||P.dead)return;MV.down=1;MV.h=0;MV.f=0}
function mvUp(){if(MV.down&&!MV.f){if(MV.eq)MV.eq=0;else if(zomOn())zQuickMelee();else rifleBash()}MV.down=0}
function meleeDraw(){MV.eq=1;MV.flair=.6;noise(.14,2600,.22);beep(1500,.06,'triangle',.05);if(typeof haptic=='function')haptic(.4,90,.5,'right')}
/* damage a cone in front of the player. Returns true when something was hit */
function meleeHit(dmg,reach,cnt,zf,cone){const f=V(-Math.sin(yaw),0,-Math.cos(yaw));let hit=0;
 const list=bots.filter(b=>b.al&&!ally(b)).map(b=>{const dx=b.x-P.x,dz=b.z-P.z,D=Math.hypot(dx,dz);return{b,D,dt:D>0?(dx*f.x+dz*f.z)/D:1}}).filter(o=>o.D<reach&&o.dt>cone&&Math.abs((o.b.y||0)-(P.y||0))<2.2).sort((a,b)=>a.D-b.D);
 for(const o of list){if(hit>=cnt)break;const b=o.b,wk=mode=='Zombies'?zMeleeDmg(b,zf):dmg;hitBot(b,wk,0);beep(1400,.06,'square',.05);if(typeof burst=='function')burst(V(b.x,1.2,b.z),8,0xaa2222,4,.4,.1);hit++}
 return hit}
function meleeLunge(f,s){mv(P,f.x*s,f.z*s,.45)}
/* hold V (and RS click / touch button / VR): the selected melee weapon, strong */
melee=function(){if(t0<mn||P.dead)return;const m=zomOn()?zMeleeStats(MEL[melName()]):MEL[melName()];mn=t0+m.cd;src='Melee';srcK='';noise(.12,2200,.25);const f=V(-Math.sin(yaw),0,-Math.cos(yaw));
 const nitro=melName()=='Nitrogen Fists';if(melName()=='Fists'||nitro){FI.d=nitro?.27:.3;FI.t=FI.d;FI.side^=1}else if(typeof katSwing=='function')katSwing();
 if(nitro)nfStrike();
 const n=meleeHit(m.d,m.reach,m.cnt,m.zf,.2);if(n)kick=Math.max(kick,nitro?.75:.5);meleeLunge(f,nitro?.6:.35);if(nitro&&n)nfImpact(f,n)};
/* tap V: butt-stroke with the weapon in your hands, about a third of the damage */
function rifleBash(){if(t0<mn||P.dead||rel>0)return;mn=t0+.42;src='Melee';srcK='';MB.t=MB.d;noise(.08,1800,.2);const f=V(-Math.sin(yaw),0,-Math.cos(yaw));
 const n=meleeHit(40,2.3,1,.3,.35);if(n)kick=Math.max(kick,.3);meleeLunge(f,.2)}
function meleeTick(dt){if(MB.t>0)MB.t-=dt;if(FI.t>0)FI.t-=dt;if(MV.flair>0)MV.flair-=dt;
 if(MV.down){MV.h+=dt;if(!MV.f&&MV.h>=.2){MV.f=1;if(!MV.eq)meleeDraw()}}
 if(P.dead||paused||over){MV.down=0;MV.eq=0}
 if(MV.eq){ST.adsIn=0;if(trig&&!P.dead&&t0>=mn)melee()}
 MV.hold=MV.eq;MV.draw+=((MV.eq?1:0)-MV.draw)*Math.min(1,dt*(MV.eq?11:9));if(MV.draw<.01)MV.draw=0}
const meleeOut=()=>MV.draw>.03||kat.t>0||FI.t>0;
/* weapon strike offsets used by the camera-held gun (see upd) */
const bashP=()=>MB.t>0?Math.sin(Math.PI*(1-MB.t/MB.d)):0;
const bashZ=()=>-.38*bashP(),bashY=()=>.05*bashP(),bashRot=()=>-.55*bashP();

/* ---------- first-person arms ---------- */
const SLV=0x3d6ad6,GLV=0x151515,CUFF=0x24262b;
function mkFpHand(side,gm,gm2){const h=new THREE.Group(),B=(w,hh,d,x,y,z,m,rx,rz)=>{const o=new THREE.Mesh(bg,m);o.scale.set(w,hh,d);o.position.set(x,y,z);if(rx)o.rotation.x=rx;if(rz)o.rotation.z=rz;h.add(o);return o},
 S=(r,x,y,z,m,sx,sy,sz)=>{const o=new THREE.Mesh(sg,m);o.scale.set(r*(sx||1),r*(sy||1),r*(sz||1));o.position.set(x,y,z);h.add(o);return o};
 /* palm and back of the hand (the back faces local -z) */
 B(.092,.1,.044,0,-.062,0,gm);B(.086,.082,.014,0,-.06,-.027,gm2);S(.034,0,-.012,0,gm,1.25,.7,.9);
 /* knuckles */
 for(let i=0;i<4;i++)S(.0125,(i-1.5)*.0225,-.118,-.02,gm2);
 /* four curled fingers: proximal block, then the tip folded back towards the palm */
 for(let i=0;i<4;i++){const x=(i-1.5)*.0225,L=[.049,.052,.05,.042][i];B(.02,L,.02,x,-.138,-.004,gm,-.55);B(.019,L*.72,.019,x,-.15,.032,gm,-1.5);S(.0095,x,-.133,.052,gm)}
 /* thumb on the inner side, folded across */
 const sx=side>0?-1:1;B(.024,.06,.022,sx*.055,-.082,.026,gm,-.5,sx*.5);B(.021,.04,.02,sx*.04,-.118,.05,gm,-1.2,sx*.4);
 return h}
function mkFpArm(side){const up=new THREE.Group(),fo=new THREE.Group(),L1=.6,L2=.56,sl=new THREE.MeshLambertMaterial({color:SLV}),sl2=new THREE.MeshLambertMaterial({color:0x2f55b0}),gl=new THREE.MeshLambertMaterial({color:GLV}),gl2=new THREE.MeshLambertMaterial({color:0x2a2c32}),cf=new THREE.MeshLambertMaterial({color:CUFF}),
 mk=(g,m,sx,sy,sz,yy,p,x)=>{const o=new THREE.Mesh(g,m);o.scale.set(sx,sy,sz);o.position.set(x||0,yy,0);p.add(o);return o};
 mk(cyU,sl,.082,L1,.082,-L1/2,up);mk(sg,sl,.092,.092,.092,0,up);mk(cyS,sl2,.088,.03,.088,-L1*.55,up);
 mk(sg,sl,.072,.072,.072,0,fo);mk(cyU,sl,.07,L2,.07,-L2/2,fo);mk(cyS,sl2,.078,.025,.078,-L2*.35,fo);
 mk(cyS,cf,.064,.07,.064,-L2+.012,fo);mk(cyS,sl2,.07,.012,.07,-L2+.05,fo);
 const hand=mkFpHand(side,gl,gl2);hand.position.y=-L2+.0;fo.add(hand);
 for(const o of[up,fo])o.traverse(e=>{e.castShadow=false});C.add(up,fo);return{up,fo,L1,L2,hand}}
for(const s of['r','l']){const o=fpArm[s];C.remove(o.up);C.remove(o.fo);fpArm[s]=mkFpArm(s=='r'?1:-1)}

/* ---------- arm placement while a melee weapon is out ---------- */
const _fpu=fpUpdate;
fpUpdate=function(dt){if(!meleeOut()||!run||P.dead||over){_fpu(dt);return}
 for(const a of[fpArm.r,fpArm.l])a.up.visible=a.fo.visible=true;const pr=gun.userData.prop;if(pr)pr.visible=false;
 const SR=V(.26,-.45,.12),SL=V(-.2,-.45,.12);
 if(melName()=='Fists'||melName()=='Nitrogen Fists'){const nitro=melName()=='Nitrogen Fists',sw=Math.sin(t0*1.8)*.012,pk=FI.t>0?Math.sin(Math.PI*cl(1-FI.t/FI.d,0,1)):0,pr_=FI.side?1:0;
  const R=V(.2,-.3+sw,-.5-(pr_?pk*.6:0)),Lh=V(-.2,-.3-sw,-.5-(pr_?0:pk*.6));if(pr_)R.add(V(-.1*pk,.12*pk,0));else Lh.add(V(.1*pk,.12*pk,0));
  if(nitro){/* a rocket-driven diagonal slash: starts low and wide, whips across and forward, hand rising through the strike */const u=FI.t>0?cl(1-FI.t/FI.d,0,1):0,e=1-Math.pow(1-u,2.6),sl=Math.sin(Math.PI*e);if(FI.t>0){const a=pr_?R:Lh,sd=pr_?1:-1;a.set(sd*(.42-.62*e),-.52+.46*e+sl*.06,-.42-.78*sl)}else{R.x+=Math.sin(t0*2.3)*.006;Lh.x-=Math.sin(t0*2.1)*.006}}
  const dr=1-Math.max(MV.draw,FI.t>0?1:0);R.y-=dr*.4;Lh.y-=dr*.4;ik(SR,R,V(.5,-1,.3),fpArm.r);ik(SL,Lh,V(-.5,-1,.3),fpArm.l);return}
 /* katana: right hand at the pommel end of the grip, left hand just under the guard, both following the blade through every swing */
 katG.updateMatrix();const mt=katG.matrix,Rh=V(0,-.235,0).applyMatrix4(mt),Lh=V(0,-.12,0).applyMatrix4(mt);
 const ka=V(0,1,0).transformDirection(mt);gripArm(SR,Rh,V(.5,-1,.35),fpArm.r,ka,1);gripArm(SL,Lh,V(-.5,-1,.35),fpArm.l,ka,-1)};

/* nothing fires, reloads or swaps while the melee weapon is out: reload (R) or a weapon switch puts it away */
{const _sh=shoot;shoot=function(){if(MV.eq)return;_sh.apply(this,arguments)}}
{const _sr=startRel;startRel=function(){if(MV.eq){MV.eq=0;return}_sr.apply(this,arguments)}}
{const _sw=swap;swap=function(){MV.eq=0;_sw.apply(this,arguments)}}
;
/* ######## strike.js ######## */
/* ===================== strike.js ===================== */
/* ---------- Airstrike killstreak (8 kills): a bomber crosses the whole map high above you and carpet bombs a long line under its flight path.
   The line goes through the spot you are aiming at, in the direction you are facing, from one edge of the map to the other.
   Your own bombs never hurt you (boom() ignores the player when the blast has own:1) and never hurt teammates. ---------- */
const STR={planes:[],bombs:[],marks:[]};
function mkBomber(){const g=new THREE.Group(),M=c=>new THREE.MeshLambertMaterial({color:c}),body=M(0x555c64),dark=M(0x30343a),wing=M(0x6a7078),red=new THREE.MeshBasicMaterial({color:0xff3a2a}),
 box=(w,h,d,x,y,z,m,rz)=>{const e=new THREE.Mesh(bg,m);e.scale.set(w,h,d);e.position.set(x,y,z);if(rz)e.rotation.z=rz;e.castShadow=false;g.add(e);return e};
 box(1.7,1.6,11,0,0,0,body);box(1.2,1.2,2.6,0,.1,6.2,body);box(1.5,.9,1.8,0,.55,-3.6,dark);
 box(15,.3,2.8,0,-.15,.6,wing);box(5.4,.22,1.6,0,.1,-5.2,wing);box(.22,2.2,1.6,0,1.3,-5.2,wing);
 for(const x of[-5.2,-2.4,2.4,5.2]){const e=new THREE.Mesh(new THREE.CylinderGeometry(.42,.42,2,10),dark);e.rotation.x=Math.PI/2;e.position.set(x,-.25,1.7);g.add(e);const p=box(.12,2.1,.12,x,-.25,2.75,dark);p.userData.prop=1}
 box(.5,.12,.5,-7.3,0,.6,red);box(.5,.12,.5,7.3,0,.6,red);box(2.2,.35,3.8,0,-.95,.2,dark);g.scale.setScalar(1.35);return g}
function carpetBomb(){const o=C.position.clone(),d=aimDir(),t=castW(o,d,90),c=o.clone().add(d.clone().multiplyScalar(Math.min(t,90))),f=V(-Math.sin(yaw),0,-Math.cos(yaw)),
 L=H*1.25,sx=c.x-f.x*L,sz=c.z-f.z*L,ex=c.x+f.x*L,ez=c.z+f.z*L,len=2*L,spd=34,ALT=40;
 msg('Carpet bombing inbound',2);beep(200,.5,'sawtooth',.08);
 /* red warning line on the ground along the run */
 const lg=new THREE.BufferGeometry().setFromPoints([V(sx,.25,sz),V(ex,.25,ez)]),ln=new THREE.Line(lg,new THREE.LineBasicMaterial({color:0xff4a2a}));S.add(ln);STR.marks.push({m:ln,t:2.4});
 const pl=mkBomber();pl.position.set(sx,ALT,sz);pl.rotation.y=Math.atan2(f.x,f.z);S.add(pl);
 STR.planes.push({m:pl,x:sx,z:sz,fx:f.x,fz:f.z,spd,run:0,len,nb:0,acc:0,drone:0,ALT,ox:sx,oz:sz,L:H});noise(1.6,260,.22)}
function bombFall(x,z,ALT,fx,fz){const m=new THREE.Group(),b=new THREE.Mesh(sg,new THREE.MeshLambertMaterial({color:0x2c3036}));b.scale.set(.2,.2,.55);m.add(b);const fin=new THREE.Mesh(bg,new THREE.MeshLambertMaterial({color:0x7a3a2a}));fin.scale.set(.3,.03,.18);fin.position.z=-.5;m.add(fin);const fin2=fin.clone();fin2.rotation.z=Math.PI/2;m.add(fin2);
 m.position.set(x,ALT-2,z);m.rotation.x=.3;S.add(m);STR.bombs.push({m,x,z,y:ALT-2,vy:0,vx:fx*34,vz:fz*34,tx:x+fx*0,tz:z+fz*0})}
function strikeTick(dt){
 for(let i=STR.marks.length-1;i>=0;i--){const k=STR.marks[i];k.t-=dt;if(k.t<=0){S.remove(k.m);k.m.geometry.dispose();STR.marks.splice(i,1)}}
 for(let i=STR.planes.length-1;i>=0;i--){const p=STR.planes[i];p.run+=p.spd*dt;p.x=p.ox+p.fx*p.run;p.z=p.oz+p.fz*p.run;p.m.position.set(p.x,p.ALT+Math.sin(t0*3)*.15,p.z);p.m.rotation.z=Math.sin(t0*1.7)*.04;
  p.m.traverse(e=>{if(e.userData.prop)e.rotation.z+=dt*40});
  p.drone-=dt;if(p.drone<=0){p.drone=.5;const dd=Math.hypot(p.x-C.position.x,p.z-C.position.z);beep(70+Math.max(0,40-dd*.5),.45,'sawtooth',Math.max(.01,.07*(1-dd/140)))}
  /* release a bomb every .13 s while the plane is inside the map; slight sideways spread so the line is a band */
  if(Math.abs(p.x)<p.L+2&&Math.abs(p.z)<p.L+2){p.acc+=dt;while(p.acc>=.13){p.acc-=.13;const sd=(Math.random()-.5)*5,px=-p.fz,pz=p.fx;bombFall(p.x+px*sd,p.z+pz*sd,p.ALT,p.fx,p.fz)}}
  if(p.run>p.len){S.remove(p.m);STR.planes.splice(i,1)}}
 for(let i=STR.bombs.length-1;i>=0;i--){const b=STR.bombs[i];b.vy-=26*dt;b.y+=b.vy*dt;b.x+=b.vx*dt*Math.max(0,1-b.y/60)*.5;b.z+=b.vz*dt*Math.max(0,1-b.y/60)*.5;b.vx*=Math.exp(-.8*dt);b.vz*=Math.exp(-.8*dt);
  b.m.position.set(b.x,b.y,b.z);b.m.rotation.x=Math.min(1.45,b.m.rotation.x+dt*1.2);
  if(b.y<=.4){S.remove(b.m);STR.bombs.splice(i,1);const p=V(cl(b.x,-H+1,H-1),.3,cl(b.z,-H+1,H-1));boom(p,{R:5,d:140,own:1,c:0xff8a30});if(typeof gfxCrater=='function')gfxCrater(p)}}}
function strikeReset(){for(const p of STR.planes)S.remove(p.m);for(const b of STR.bombs)S.remove(b.m);for(const k of STR.marks)S.remove(k.m);STR.planes=[];STR.bombs=[];STR.marks=[]}
{const _ft=featTick;featTick=function(dt){_ft(dt);strikeTick(dt)};const _fr=featReset;featReset=function(){_fr();strikeReset()}}
;
/* ######## attach.js ######## */
/* ===================== attach.js ===================== */
/* ---------- attachments that really appear on the weapon: Extended Mag (a longer magazine with a base plate), Compensator (vented muzzle brake), Laser Sight (module on the side with a visible red beam),
   Long Barrel (extended barrel with a sleeve), Fast Hands (rubber wraps on the grip and handguard, a thumb rest), Hollow Point (orange tipped rounds showing in the magazine) and
   Quickdraw Grip (angled foregrip). They are added to whichever model is in use (first person, the loadout and customize previews, other players) and follow the weapon. ---------- */
const ATT_MAT={};
function attM(c,e){const k=c+(e?'e':'');return ATT_MAT[k]||(ATT_MAT[k]=e?new THREE.MeshBasicMaterial({color:c}):new THREE.MeshLambertMaterial({color:c}))}
function attsFor(k){return zomOn()?[]:k==L.p?L.pa:k==L.s?L.sa:[]}
/* y of the barrel at the muzzle, measured from the model itself: the mean height of the parts that reach the front */
function attMuzzle(g,dir){g.updateMatrixWorld(true);const inv=g.matrixWorld.clone().invert(),bb=new THREE.Box3(),tmp=new THREE.Box3(),mm=new THREE.Matrix4(),parts=[];
 /* everything is measured in the weapon's own space (not world space), so it is right in first person, in previews and on other players */
 g.traverse(m=>{if(!m.isMesh||m.userData.att||!m.visible)return;if(!m.geometry.boundingBox)m.geometry.computeBoundingBox();tmp.copy(m.geometry.boundingBox).applyMatrix4(mm.multiplyMatrices(inv,m.matrixWorld));if(!isFinite(tmp.min.x)||!isFinite(tmp.max.x))return;bb.union(tmp);parts.push(tmp.clone())});
 if(bb.isEmpty())bb.set(new THREE.Vector3(-.03,-.1,-.3),new THREE.Vector3(.03,.1,.3));
 const tip=dir>0?bb.max.z:bb.min.z;let sy=0,n=0;for(const p of parts){const ft=dir>0?p.max.z:p.min.z;if(Math.abs(ft-tip)<.045&&(p.max.x-p.min.x)<.12){sy+=(p.min.y+p.max.y)/2;n++}}return{tip,y:n?sy/n:(bb.min.y+bb.max.y)/2,bb,parts}}
function attMagGrp(G,mag){if(G.userData.mg)return G.userData.mg;const p=new THREE.Group();p.position.set(mag[0],mag[1],mag[2]);p.userData.att=1;p.userData.mb={x:mag[0],y:mag[1],z:mag[2]};G.add(p);G.userData.mg=p;return p}
function attRemove(g){for(let i=g.children.length-1;i>=0;i--)if(g.children[i].userData.att)g.remove(g.children[i])}
function attApply(g,k,list,dir){if(!g)return;attRemove(g);if(!list||!list.length)return;dir=dir||1;let A_=g.userData.a||{};/* the first-person model stores its anchors converted to gun space ([-x,y,pz-z]); the attachments live in the model's own space, so convert them back */
 if(g===fpG&&A_.r){const pz=fpG.position.z,inv=([x,y,z])=>[-x,y,pz-z];A_={r:inv(A_.r),l:inv(A_.l),m:inv(A_.m)}}
 const mz=attMuzzle(g,dir),G=new THREE.Group(),PT=mz.parts;G.userData.att=1;
 /* measurements taken from the real model so attachments sit on it instead of floating: the parts that cover a given z near the centre line */
 const cov=(z,tol)=>PT.filter(p=>p.min.z-tol<=z&&p.max.z+tol>=z&&Math.abs((p.min.x+p.max.x)/2)<.08&&(p.max.x-p.min.x)<.16),
  lowY=(z,t,d)=>{const c=cov(z,t);return c.length?Math.min(...c.map(p=>p.min.y)):d},topY=(z,t,d)=>{const c=cov(z,t);return c.length?Math.max(...c.map(p=>p.max.y)):d},
  halfW=(z,t,d)=>{const c=cov(z,t);return c.length?Math.max(...c.map(p=>Math.max(p.max.x,-p.min.x))):d};
 let TG=G;/* TG: where new parts go. Magazine attachments go into a pivot that rides on the magazine (see attMagGrp) */const tgAdd=e=>{TG.add(e);if(TG!==G)e.position.sub(TG.position)},box=(w,h,d,x,y,z,m,rx)=>{const e=new THREE.Mesh(bg,m);e.scale.set(w,h,d);e.position.set(x,y,z);if(rx)e.rotation.x=rx;e.userData.att=1;tgAdd(e);return e},
  cyl=(r,len,x,y,z,m,rf)=>{const e=new THREE.Mesh(new THREE.CylinderGeometry(rf==null?r:rf,r,len,14),m);e.rotation.x=Math.PI/2;e.position.set(x,y,z);e.userData.att=1;tgAdd(e);return e},
  sph=(r,x,y,z,m)=>{const e=new THREE.Mesh(sg,m);e.scale.setScalar(r);e.position.set(x,y,z);e.userData.att=1;tgAdd(e);return e},
  mag=A_.m||[0,mz.bb.min.y+.1,(mz.bb.min.z+mz.bb.max.z)/2],grip=A_.r||[0,mz.bb.min.y+.1,0],fore=A_.l||[0,mz.y-.04,mz.tip-dir*.25],dk=attM(0x17181b),gm=attM(0x2d2f34),steel=attM(0x9aa0a8),org=attM(0xd9822b),red=attM(0xff2a20,1);
 let tip=mz.tip;
 if(list.includes('Long Barrel')){cyl(.017,.2,0,mz.y,tip+dir*.1,steel);cyl(.026,.07,0,mz.y,tip+dir*.035,gm);cyl(.022,.012,0,mz.y,tip+dir*.205,dk);tip+=dir*.2}
 if(list.includes('Compensator')){cyl(.027,.085,0,mz.y,tip+dir*.0425,gm);for(let i=0;i<3;i++){box(.03,.008,.012,0,mz.y+.0,tip+dir*(.015+i*.02),dk);cyl(.0285,.006,0,mz.y,tip+dir*(.012+i*.024),steel)}box(.056,.006,.04,0,mz.y+.027,tip+dir*.04,dk);box(.056,.006,.04,0,mz.y-.027,tip+dir*.04,dk)}
 if(list.includes('Extended Mag')){TG=attMagGrp(G,mag);const h=.12,mb=lowY(mag[2],.03,mag[1]-.1),mw=Math.max(.045,Math.min(.07,halfW(mag[2],.03,.025)*2+.004));box(mw,h,.082,mag[0],mb-h/2+.012,mag[2]+.004,attM(0x222428),.06*dir);box(mw+.006,.016,.09,mag[0],mb-h+.004,mag[2]+.008,org,.06*dir);for(let i=0;i<3;i++)box(mw+.002,.004,.084,mag[0],mb-.02-i*.034,mag[2]+.006,gm);TG=G}
 if(list.includes('Hollow Point')){TG=attMagGrp(G,mag);const mb=lowY(mag[2],.03,mag[1]-.1),mw=Math.max(.045,Math.min(.07,halfW(mag[2],.03,.025)*2+.004)),my=mb+.03;box(mw,.012,.084,mag[0],my,mag[2],org);box(mw+.002,.004,.086,mag[0],my-.02,mag[2],attM(0x3a3a3e));for(let i=0;i<4;i++){const c=new THREE.Mesh(new THREE.ConeGeometry(.006,.016,8),org);c.position.set(mag[0]+(i-1.5)*.009,my+.012,mag[2]);c.userData.att=1;tgAdd(c)}TG=G}
 if(list.includes('Laser Sight')){const sz=fore[2]-dir*.02,hw=halfW(sz,.04,.035),sx=-(hw+.014),lo=lowY(sz,.04,fore[1]-.03),hi=topY(sz,.04,fore[1]+.03),sy=(lo+hi)/2;box(.024,.03,.07,sx,sy,sz,dk);box(.012,.012,.018,sx,sy,sz+dir*.04,red);box(.03,.008,.05,sx+.004,sy+.018,sz,gm);
  /* faint visible beam */
  const bm=new THREE.Mesh(new THREE.CylinderGeometry(.0016,.0016,14,6),new THREE.MeshBasicMaterial({color:0xff3a2a,transparent:true,opacity:.28,depthWrite:false}));bm.rotation.x=Math.PI/2;bm.position.set(sx,sy,sz+dir*7.04);bm.userData.att=1;G.add(bm)}
 if(list.includes('Fast Hands')){const rub=attM(0x0e0f10);box(.06,.07,.075,grip[0],grip[1]-.02,grip[2]+.0,rub);for(let i=0;i<4;i++)box(.064,.004,.078,grip[0],grip[1]-.045+i*.018,grip[2],gm);box(.066,.04,.012,grip[0],grip[1]+.015,grip[2]+dir*.045,gm);
  {const hw=halfW(fore[2],.04,.04),lo=lowY(fore[2],.04,fore[1]-.025),hi=topY(fore[2],.04,fore[1]+.025),cy=(lo+hi)/2,hh=Math.max(.03,hi-lo)+.01;box(hw*2+.012,hh,.1,fore[0],cy,fore[2],rub);for(let i=0;i<3;i++)box(hw*2+.016,.004,.104,fore[0],lo+.008+i*(hh-.016)/2,fore[2],gm);box(.02,.03,.04,fore[0]+hw+.012,cy,fore[2]+dir*.02,rub)}}
 if(list.includes('Quickdraw Grip')){const x=fore[0],z=fore[2],y=lowY(z,.04,fore[1]-.03)-.012;const a=new THREE.Mesh(new THREE.CylinderGeometry(.015,.019,.12,12),dk);a.position.set(x,y-.04,z+dir*.015);a.rotation.x=.32*dir;a.userData.att=1;G.add(a);box(.04,.02,.07,x,y+.01,z,gm);box(.044,.012,.03,x,y-.1,z+dir*.04,org);for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.TorusGeometry(.017,.0025,6,12),gm);r.position.set(x,y-.025-i*.025,z+dir*(.015+i*.008));r.rotation.x=Math.PI/2+.32*dir;r.userData.att=1;G.add(r)}}
 g.add(G)}
/* first-person model currently in use for weapon k (the AR, VMP and RG have hand-built models, everything else uses fpG) */
function attFpModel(k){return k=='AR'?knG:k=='VMP'?vmpG:k=='RG'?rgG:fpG}
function attRefresh(){const w=cw();if(!w)return;const g=attFpModel(w.k);if(!g)return;attApply(g,w.k,attsFor(w.k),(w.k=='AR'||w.k=='VMP'||w.k=='RG')?-1:1)}
{const _sg=setGun;setGun=function(){_sg.apply(this,arguments);try{attRefresh()}catch(e){}}}
;

/* ---------- Nitrogen Fists: rocket gauntlets with spiked knuckle plates, side thrusters with blue flames, a glowing coolant canister and a swept blade fin. Modelled in hand space (wrist at the origin, fingers towards -y, palm towards +z). ---------- */
function mkNitroFist(side){const g=new THREE.Group(),M=c=>new THREE.MeshLambertMaterial({color:c}),
 B=(w,h,d,x,y,z,m,rx,ry,rz)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.rotation.set(rx||0,ry||0,rz||0);g.add(o);return o},
 C=(rt,rb,h,x,y,z,m,rx,rz,seg)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,seg||14),m);o.position.set(x,y,z);o.rotation.set(rx||0,0,rz||0);g.add(o);return o};
 const tan=M(0x8d805c),tan2=M(0x6c6246),stl=M(0x9aa1a8),stl2=M(0x585e64),dk=M(0x24272b),rub=M(0x15161a),glow=new THREE.MeshBasicMaterial({color:0x37b8ff}),pale=new THREE.MeshBasicMaterial({color:0xd6f5ff}),glass=new THREE.MeshBasicMaterial({color:0x2a86ff,transparent:true,opacity:.5});
 /* cuff and body */
 C(.064,.072,.075,0,.025,0,tan2,0,0,14);C(.068,.068,.014,0,.065,0,stl2,0,0,14);B(.118,.15,.128,0,-.088,-.004,tan);B(.124,.05,.138,0,-.02,-.004,tan2);B(.1,.1,.03,0,-.07,.066,tan2);B(.09,.14,.014,0,-.08,-.07,stl2);
 for(const sx of[-1,1])for(let i=0;i<3;i++)C(.007,.007,.012,sx*.05,-.04-i*.04,-.074,stl,Math.PI/2,0,8);
 for(let i=0;i<4;i++)B(.12,.006,.131,0,-.045-i*.032,-.004,dk);
 /* knuckle plate with ridges and four glowing spikes */
 B(.136,.062,.146,0,-.18,-.004,stl);B(.142,.014,.152,0,-.15,-.004,stl2);B(.13,.012,.14,0,-.212,-.004,stl2);
 for(let i=0;i<4;i++){const x=(i-1.5)*.032;B(.027,.048,.034,x,-.2,-.034,stl);C(.018,.018,.012,x,-.232,-.034,dk,0,0,8);const sp=new THREE.Mesh(new THREE.ConeGeometry(.0175,.13,6),glow);sp.position.set(x,-.305,-.034);sp.rotation.x=Math.PI;g.add(sp);const tip=new THREE.Mesh(new THREE.ConeGeometry(.007,.04,6),pale);tip.position.set(x,-.38,-.034);tip.rotation.x=Math.PI;g.add(tip)}
 B(.14,.008,.016,0,-.152,-.08,glow);
 /* thrusters */
 const fl=[];for(const sx of[-1,1]){const x=sx*.092;C(.032,.032,.14,x,-.07,-.018,stl);C(.036,.036,.018,x,-.12,-.018,stl2);C(.036,.036,.018,x,-.025,-.018,stl2);C(.034,.034,.03,x,-.072,-.018,dk);C(.04,.026,.055,x,.04,-.018,dk);C(.032,.032,.008,x,.068,-.018,glow);for(let i=0;i<5;i++)B(.012,.004,.02,x+sx*.026,-.12+i*.012,-.018,dk);
  const pv=new THREE.Group();pv.position.set(x,.072,-.018);const outer=new THREE.Mesh(new THREE.ConeGeometry(.031,.22,10),new THREE.MeshBasicMaterial({color:0x2d9bff,transparent:true,opacity:.7,depthWrite:false})),inner=new THREE.Mesh(new THREE.ConeGeometry(.017,.14,8),new THREE.MeshBasicMaterial({color:0xe8fbff,transparent:true,opacity:.95,depthWrite:false}));outer.position.y=.11;inner.position.y=.07;pv.scale.y=.5;pv.add(outer,inner);g.add(pv);fl.push({p:pv,ph:Math.random()*6.28})}
 /* coolant canister on the palm side */
 C(.034,.034,.09,0,-.012,.076,glass,0,0,14);C(.038,.038,.014,0,.036,.076,stl2,0,0,14);C(.038,.038,.014,0,-.06,.076,stl2,0,0,14);const core=new THREE.Mesh(sg,glow);core.scale.setScalar(.022);core.position.set(0,-.012,.076);g.add(core);for(const a of[0,2.1,4.2])B(.006,.092,.006,Math.cos(a)*.036,-.012,.076+Math.sin(a)*.036,stl2);
 /* swept blade fin on the outer side */
 const bl=B(.008,.17,.07,side*.098,-.15,.01,stl,0,0,side*.28),bl2=B(.008,.07,.05,side*.118,-.245,.01,stl,0,0,side*.5);B(.012,.05,.05,side*.092,-.075,.01,stl2);
 g.userData={fl,core};return g}
const NF={rev:0,last:-9,boost:0,out:0,al:0,idle:null,rt:0};
function nfBus(){ac=ac||new AudioContext();if(!NF.bus){const c=ac.createDynamicsCompressor();c.threshold.value=-24;c.knee.value=12;c.ratio.value=10;c.attack.value=.003;c.release.value=.15;c.connect(ac.destination);NF.bus=c;const n=ac.sampleRate*1,b=ac.createBuffer(1,n,ac.sampleRate),d=b.getChannelData(0);for(let i=0;i<n;i++)d[i]=Math.random()*2-1;NF.nb=b}return NF.bus}
/* engine: a saw and a square through a rising low-pass with a cylinder-like tremolo, plus an exhaust whoosh; every strike in a chain starts higher and chugs faster */
function nfEngine(rev){try{const bus=nfBus(),t=ac.currentTime,v=vol*.55;if(v<=0)return;const f0=58+rev*14,dur=.3,o=ac.createOscillator(),o2=ac.createOscillator(),lp=ac.createBiquadFilter(),am=ac.createGain(),g=ac.createGain(),lfo=ac.createOscillator(),lg=ac.createGain();
 o.type='sawtooth';o2.type='square';o.frequency.setValueAtTime(f0,t);o.frequency.exponentialRampToValueAtTime(f0*(2.3+rev*.14),t+dur*.8);o2.frequency.setValueAtTime(f0*.5,t);o2.frequency.exponentialRampToValueAtTime(f0*1.15,t+dur*.8);
 lp.type='lowpass';lp.Q.value=2.2;lp.frequency.setValueAtTime(340,t);lp.frequency.exponentialRampToValueAtTime(1200+rev*170,t+dur*.7);
 am.gain.value=.62;lfo.frequency.value=24+rev*5.5;lg.gain.value=.38;lfo.connect(lg).connect(am.gain);
 g.gain.setValueAtTime(.0001,t);g.gain.exponentialRampToValueAtTime(.07*v,t+.035);g.gain.exponentialRampToValueAtTime(.0001,t+dur+.08);
 o.connect(lp);o2.connect(lp);lp.connect(am).connect(g).connect(bus);for(const x of[o,o2,lfo]){x.start(t);x.stop(t+dur+.1)}
 const s=ac.createBufferSource(),bp=ac.createBiquadFilter(),ng=ac.createGain();s.buffer=NF.nb;bp.type='bandpass';bp.Q.value=.9;bp.frequency.setValueAtTime(450+rev*60,t);bp.frequency.exponentialRampToValueAtTime(2300+rev*220,t+.2);ng.gain.setValueAtTime(.0001,t);ng.gain.exponentialRampToValueAtTime(.05*v,t+.03);ng.gain.exponentialRampToValueAtTime(.0001,t+.26);s.connect(bp).connect(ng).connect(bus);s.start(t,Math.random()*.5);s.stop(t+.3)}catch(e){}}
/* demolishing hit: a sub drop, a gated crunch, two inharmonic metal clanks and a few falling bits of rubble */
function nfHit(n){try{const bus=nfBus(),t=ac.currentTime,v=vol*.55;if(v<=0)return;const sub=ac.createOscillator(),sg_=ac.createGain();sub.type='sine';sub.frequency.setValueAtTime(130,t);sub.frequency.exponentialRampToValueAtTime(36,t+.24);sg_.gain.setValueAtTime(.0001,t);sg_.gain.exponentialRampToValueAtTime(.12*v,t+.012);sg_.gain.exponentialRampToValueAtTime(.0001,t+.28);sub.connect(sg_).connect(bus);sub.start(t);sub.stop(t+.3);
 const s=ac.createBufferSource(),bp=ac.createBiquadFilter(),cg=ac.createGain();s.buffer=NF.nb;bp.type='bandpass';bp.frequency.value=1100;bp.Q.value=.7;cg.gain.setValueAtTime(.0001,t);for(let i=0;i<7;i++){const a=t+i*.022;cg.gain.setValueAtTime(.075*v*(1-i*.11),a);cg.gain.exponentialRampToValueAtTime(.006,a+.016)}cg.gain.exponentialRampToValueAtTime(.0001,t+.2);s.connect(bp).connect(cg).connect(bus);s.start(t,Math.random()*.5);s.stop(t+.22);
 for(const[f,d]of[[412,.12],[689,.09]]){const o=ac.createOscillator(),g=ac.createGain();o.type='triangle';o.frequency.value=f*(.96+Math.random()*.08);g.gain.setValueAtTime(.03*v,t);g.gain.exponentialRampToValueAtTime(.0001,t+d);o.connect(g).connect(bus);o.start(t);o.stop(t+d+.02)}
 for(let i=0;i<(n>1?5:3);i++){const a=t+.12+Math.random()*.25,r=ac.createBufferSource(),f=ac.createBiquadFilter(),g=ac.createGain();r.buffer=NF.nb;f.type='highpass';f.frequency.value=2500+Math.random()*2500;g.gain.setValueAtTime(.022*v,a);g.gain.exponentialRampToValueAtTime(.0001,a+.04);r.connect(f).connect(g).connect(bus);r.start(a,Math.random()*.5);r.stop(a+.05)}}catch(e){}}
function nfIdle(on){try{if(on&&!NF.idle&&vol>0){const bus=nfBus(),t=ac.currentTime,o=ac.createOscillator(),lp=ac.createBiquadFilter(),g=ac.createGain(),l=ac.createOscillator(),lg=ac.createGain();o.type='sawtooth';o.frequency.value=47;lp.type='lowpass';lp.frequency.value=170;l.frequency.value=9;lg.gain.value=3;l.connect(lg).connect(o.frequency);g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(.012*vol,t+.3);o.connect(lp).connect(g).connect(bus);o.start();l.start();NF.idle={o,l,g}}
 else if(!on&&NF.idle){const t=ac.currentTime,i=NF.idle;NF.idle=null;i.g.gain.cancelScheduledValues(t);i.g.gain.setValueAtTime(i.g.gain.value,t);i.g.gain.linearRampToValueAtTime(.0001,t+.2);i.o.stop(t+.25);i.l.stop(t+.25)}}catch(e){}}
function nfStrike(){NF.rev=t0-NF.last>1.4?0:Math.min(6,NF.rev+1);NF.last=t0;NF.boost=1;nfEngine(NF.rev);kick=Math.max(kick,.4)}
function nfImpact(f,n){setTimeout(()=>{nfHit(n);const q=V(P.x+f.x*1.7,1.25,P.z+f.z*1.7);burst(q,22,0x55ccff,9,.5,.1);burst(q,12,0xffffff,12,.35,.07);burst(q,10,0x555a60,6,.8,.2);shake=Math.max(shake,.5);const fl=$('#flash');if(fl){fl.style.transition='none';fl.style.background='rgba(120,200,255,.25)';fl.style.opacity=1;requestAnimationFrame(()=>{fl.style.transition='opacity .25s';fl.style.opacity=0})}if(typeof haptic=='function')haptic(.7,90,.6,'both')},55)}
/* attach the gauntlets to the first-person hands and animate them */
{const gnt={};const _fx=fpUpdate;fpUpdate=function(dt){_fx.apply(this,arguments);try{const on=melName()=='Nitrogen Fists'&&run&&!P.dead&&!over&&MV.draw>.03&&!(typeof SK!='undefined'&&SK.rc);
  for(const[k,a,s]of[['r',fpArm.r,1],['l',fpArm.l,-1]]){if(!a.hand)continue;if(!gnt[k]){gnt[k]=mkNitroFist(s);a.hand.add(gnt[k]);gnt[k].visible=false}const g=gnt[k];g.visible=on;for(const ch of a.hand.children)if(ch!==g)ch.visible=!on;
   if(on){const u=g.userData,chain=Math.min(1,NF.rev/5),sp=Math.hypot(P.mx||0,P.mz||0)/7;NF.boost=Math.max(0,NF.boost-dt*3.2);const inten=.5+NF.boost*1.5+chain*.35+sp*.2;
    for(const f of u.fl){const fl=inten*(.78+.28*Math.sin(t0*46+f.ph)+.12*Math.sin(t0*83+f.ph*2));f.p.scale.set(.8+NF.boost*.5,Math.max(.25,fl),.8+NF.boost*.5)}u.core.scale.setScalar(.022+Math.sin(t0*5+(s>0?0:1.5))*.004+NF.boost*.012)}}
  if(on!==!!NF.out){NF.out=on?1:0;nfIdle(on);if(on){NF.rev=0;beep(90,.2,'sawtooth',.03)}}
  if(on&&FI.t>0&&NF.al<=0){NF.al=.035;const a=FI.side?fpArm.r.hand:fpArm.l.hand;if(a){const p=new THREE.Vector3();a.getWorldPosition(p);burst(p,2,0x59cdff,3,.22,.05)}}NF.al-=dt}catch(e){}}}

/* ===================== pads.js ===================== */
/* ---------- controller prompts: every on-screen button hint shows the buttons printed on YOUR controller (Xbox, PlayStation, Nintendo or Ouya).
   The type is read from the gamepad id (Settings can force one). The same physical buttons do the same jobs on every pad; only the names and symbols change.
   Nintendo pads also swap confirm and back in the menus (the right-hand button confirms), like every Nintendo game. Hints in the HUD, the menus and the help lists all follow. ---------- */
const PG={on:false,type:'xbox',pref:'auto',tabI:0,rep:0,r3:false,dirty:1,h0:null,
 L:{xbox:{a:'A',b:'B',x:'X',y:'Y',lb:'LB',rb:'RB',lt:'LT',rt:'RT',view:'View',menu:'Menu',ls:'LS',rs:'RS',name:'Xbox'},
  ps:{a:'✕',b:'○',x:'□',y:'△',lb:'L1',rb:'R1',lt:'L2',rt:'R2',view:'Create',menu:'Options',ls:'L3',rs:'R3',name:'PlayStation'},
  ns:{a:'B',b:'A',x:'Y',y:'X',lb:'L',rb:'R',lt:'ZL',rt:'ZR',view:'−',menu:'+',ls:'L-Stick',rs:'R-Stick',name:'Nintendo'},
  ouya:{a:'O',b:'A',x:'U',y:'Y',lb:'L1',rb:'R1',lt:'L2',rt:'R2',view:'System',menu:'Menu',ls:'L3',rs:'R3',name:'Ouya'}},
 /* what each job is bound to (same on every pad): b = button, h = it needs a hold */
 A:{use:{b:'x',h:1},melee:{b:'rs'},reload:{b:'x'},tactical:{b:'lb'},lethal:{b:'rb'},field:{b:'lb+rb'},crouch:{b:'b'},prone:{b:'b',h:1},jump:{b:'a'},sprint:{b:'ls'},fire:{b:'rt'},aim:{b:'lt'},swap:{b:'y'},ks:{b:'dright'},ping:{b:'dup'},mode:{b:'dleft'},nv:{b:'ddown',h:1},map:{b:'view'},sb:{b:'view',h:1},pause:{b:'menu'},mount:{b:'lt+rs'}},
 KBM:{F:'use',V:'melee',R:'reload',Q:'tactical',E:'lethal',X:'field',C:'crouch',Space:'jump',T:'mount',B:'mode',N:'nv',M:'map',Tab:'sb',MMB:'ping',Esc:'pause'},
 detect(g){const id=((g&&g.id)||'').toLowerCase();if(/ouya|2836/.test(id))return'ouya';if(/054c|dualshock|dualsense|playstation|ps[345]|sony|wireless controller/.test(id))return'ps';if(/057e|nintendo|switch|pro controller|joy-?con|wii/.test(id))return'ns';return'xbox'},
 b(s){const l=PG.L[PG.type],d={dup:'D-pad ↑',ddown:'D-pad ↓',dleft:'D-pad ←',dright:'D-pad →'};return s.split('+').map(x=>d[x]||l[x]||x).join(' + ')},
 /* the label of one job, e.g. PG.l('use') = "hold □" on PlayStation */
 l(a){const d=PG.A[a];return d?(d.h?'hold ':'')+PG.b(d.b):a},
 ok(){return PG.L[PG.type][PG.type=='ns'?'b':'a']},back(){return PG.L[PG.type][PG.type=='ns'?'a':'b']},
 /* "Press F to open" -> "Hold □ to open" (only the known key words are touched) */
 t(s){if(!PG.on||typeof s!='string')return s;return s.replace(/\b(Press|Hold|Tap) (F|V|R|E|Q|X|C|T|B|N)\b/g,(m,v,k)=>{const a=PG.KBM[k],d=a&&PG.A[a];return d?(d.h?'Hold ':v+' ')+PG.b(d.b):m})},
 hint(){const l=PG.L[PG.type];return `${l.name} controller: ${l.ls} move · ${l.rs} look · ${l.rt} fire · ${l.lt} aim · ${PG.b('a')} jump · ${PG.b('b')} crouch (hold prone) · ${PG.b('x')} reload (hold use / buy / revive) · ${PG.b('y')} swap · ${l.lb} tactical · ${l.rb} lethal · ${l.lb}+${l.rb} field upgrade · ${l.ls} sprint · ${l.rs} melee (hold: draw it) · D-pad ↑ ping · D-pad ← fire mode · D-pad → killstreak · ${PG.b('view')} map · ${PG.b('menu')} pause`},
 help(){const l=PG.L[PG.type],k=(a,t)=>`<span><kbd class="pg">${a}</kbd> ${t}</span>`;return [k(l.ls,'move'),k(l.rs,'look'),k(l.ls+' held','sprint (click twice: tactical sprint, or steady aim while aiming)'),k(l.rs+' click','tap: melee strike · hold: draw your melee weapon (Nitrogen Fists: then aim = DASH) · '+l.lt+' + '+l.rs+' weapon mount'),k(l.lt,'aim'),k(l.rt,'fire'),k(l.lb,'tactical'),k(l.rb,'lethal'),k(l.lb+' + '+l.rb,'field upgrade'),
  k(PG.b('a'),'jump / stand / mantle'),k(PG.b('b'),'crouch / slide, hold: prone / dive'),k(PG.b('x'),'reload, hold: interact / buy / revive'),k(PG.b('y'),'swap weapon'),k('D-pad ↑','ping'),k('D-pad ↓','inventory, hold: night vision'),k('D-pad ←','fire mode'),k('D-pad →','killstreak'),k(PG.b('view'),'map, hold: scoreboard'),k(PG.b('menu'),'pause'),
  k('D-pad / stick','menus: move'),k(PG.ok(),'menus: press'),k(PG.back(),'menus: back'),k(l.lb+' / '+l.rb,'menus: previous / next tab or loadout slot'),k(PG.b('x')+' / '+PG.b('y'),'on-screen keyboard: backspace / space')].join('')},
 setOn(on){if(on===PG.on)return;PG.on=on;usingPad=on;PG.dirty=1;PG.refresh()},
 sync(g,any){if(g){const t=PG.pref=='auto'?PG.detect(g):PG.pref;if(t!==PG.type){PG.type=t;PG.dirty=1}}if(any&&!PG.on){PG.on=true;usingPad=true;PG.dirty=1}if(PG.dirty)PG.refresh()},
 refresh(){PG.dirty=0;if(PG.busy)return;PG.busy=1;try{const h=$('#hint');if(h){if(PG.h0==null)PG.h0=h.textContent;const w=PG.on?PG.hint():PG.h0;if(h.textContent!==w)h.textContent=w}
  for(const k of document.querySelectorAll('kbd')){if(k.closest('[data-pgskip]'))continue;const o=k.dataset.k0!=null?k.dataset.k0:(k.dataset.k0=k.textContent);let t=o;if(PG.on){const a=PG.KBM[o];if(a&&PG.A[a])t=PG.b(PG.A[a].b);else if(o=='LB'||o=='RB')t=PG.L[PG.type][o.toLowerCase()]}if(k.textContent!==t)k.textContent=t;k.classList.toggle('pg',PG.on&&t!==o)}
  if(PG.ctlB){const w=PG.on?PG.L[PG.type].name:'';PG.ctlH.textContent='Controller'+(w?' · '+w:'');const hh=PG.help();if(PG.ctlB.dataset.t!==hh){PG.ctlB.dataset.t=hh;PG.ctlB.innerHTML=hh}}
  const s=$('#pgs');if(s&&s.value!==PG.pref)s.value=PG.pref}finally{PG.busy=0;if(PG.mo)PG.mo.takeRecords()}},
 init(){const h=$('#hint');if(h)PG.h0=h.textContent;for(const e of document.querySelectorAll('#p-set h2')){const n=e.nextElementSibling;if(!n)continue;if(/Keyboard|VR/.test(e.textContent))n.dataset.pgskip=1;if(/^Controller/.test(e.textContent)){PG.ctlH=e;PG.ctlB=n;n.dataset.pgskip=1}}
  try{const p=localStorage.getItem('sd-pad');if(p&&(p=='auto'||PG.L[p]))PG.pref=p}catch(e){}
  const s=$('#pgs');if(s){s.value=PG.pref;s.addEventListener('change',()=>{PG.pref=s.value;try{localStorage.setItem('sd-pad',PG.pref)}catch(e){}const g=gpGet();PG.type=PG.pref=='auto'?(g?PG.detect(g):'xbox'):PG.pref;PG.dirty=1;PG.refresh()})}
  /* menus and panels re-render themselves: translate their hints again whenever they change */
  let tm=0;PG.mo=new MutationObserver(()=>{if(PG.busy||tm)return;tm=setTimeout(()=>{tm=0;PG.refresh()},80)});PG.mo.observe(document.body,{childList:true,subtree:true});
  /* back to keyboard and mouse: the hints switch back too */
  const off=()=>{if(PG.on)PG.setOn(false)};addEventListener('keydown',e=>{if(e.isTrusted)off()},true);addEventListener('mousedown',off,true);let mx=0;addEventListener('mousemove',e=>{mx+=Math.abs(e.movementX||0)+Math.abs(e.movementY||0);if(mx>40){mx=0;off()}else setTimeout(()=>{mx=0},400)},true);
  const g=gpGet();if(g){PG.type=PG.pref=='auto'?PG.detect(g):PG.pref}PG.refresh()}};
{const _m=msg;msg=function(t,d){return _m(PG.t(t),d)};const _p=popup;popup=function(a,b){return _p(a,PG.t(b))}}
PG.init();
