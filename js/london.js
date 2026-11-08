/* ===================== london.js ===================== */
/* ---------- Zombies map 2: WESTMINSTER, LONDON. Big Ben stands over the Palace Yard; the power is OFF until you find the substation switch; its own weapon, The Brew (a teapot blaster that fires scalding tea),
   is unlocked by the Great British Brew easter egg. No Nitrogen Fists on this map: it keeps the RayGun and the Katana. ---------- */

/* ---------- The Brew: a Victorian steam-powered tea cannon. It fires a thick beam of scalding tea that goes right through a line of zombies, then splashes and slows everything it touches.
   Zombies maps only: never in Multiplayer, never in the box until the easter egg is done. ---------- */
W.TEA={n:'The Brew',d:150,r:.3,m:12,rs:3,sp:.003,rc:2,pel:1,au:0,rl:2.1,len:.55,col:0xc98a3b,ex:{R:3.6,d:140,imp:0,w:'TEA',c:0xd9953f}};
WG.TEA=[.6,0xb8733a,0,0xffb040];
GS.TEA={n:[[.3,'bandpass',1200,.4,0,.9,1.8],[.2,'lowpass',520,.35,.04],[.06,'highpass',4800,.12]],o:[['sine',170,70,.2,.3]]};
ZSKIP.push('TEA');ZWP.TEA=0;
RLK.TEA='mag';
/* the model: riveted copper boiler with a teapot lid on top, brass bands, a pressure gauge, a glowing sight-glass tube, a curved brass spout-nozzle with a glowing amber mouth, copper pipes,
   a mahogany stock with a brass butt plate, a leather pistol grip, and a teacup on a saucer as the magazine */
MODELS.TEA=function(g,rm){const k=gunKit(g,rm),M=k.M,E=k.E,cop=rm||M(0xb8733a),brass=M(0xc9a23a),mah=M(0x4a2616),leather=M(0x1d130c),por=M(0xf4efe4),blue=M(0x2b4f9e),dk=M(0x15171a),gun=M(0x2a2d31),steel=M(0x8a9098),amb=E(0xffa530),cream=E(0xfff0c8),mags=[];
 /* boiler: a long copper drum with domed ends, three brass bands and a ring of rivets on each */
 k.cyl(.088,.42,0,.15,.2,cop,.088,22);k.sph(.088,0,.15,.41,cop,1,1,.6);k.sph(.088,0,.15,-.01,cop,1,1,.6);
 for(const z of[.06,.2,.34]){k.cyl(.093,.022,0,.15,z,brass,.093,22);for(let i=0;i<10;i++){const a=i/10*6.283;k.sph(.007,Math.cos(a)*.094,.15+Math.sin(a)*.094,z,steel)}}
 /* the teapot lid on top of the boiler: filler neck, porcelain dome, gold knob, a tiny whistle */
 k.cylY(.05,.03,0,.245,.2,brass);k.cylY(.04,.02,0,.265,.2,por);k.sph(.045,0,.275,.2,por,1,.62,1);k.sph(.014,0,.31,.2,brass);k.cylY(.011,.05,.045,.28,.13,brass);k.sph(.014,.045,.31,.13,brass);
 for(let i=0;i<8;i++){const a=i/8*6.283;k.box(.008,.012,.008,Math.cos(a)*.052,.262,.2+Math.sin(a)*.052,blue)}
 /* pressure gauge on the left, with an emissive face and a needle */
 k.cylY(.045,.02,.1,.15,.13,brass,0,Math.PI/2);k.cylY(.037,.022,.104,.15,.13,cream,0,Math.PI/2);k.box(.003,.03,.003,.109,.152,.13,dk,.9);for(let i=0;i<7;i++){const a=-1.2+i*.4;k.box(.002,.008,.002,.11,.15+Math.cos(a)*.032,.13+Math.sin(a)*.032,dk,a)}k.sph(.007,.11,.15,.13,brass);
 /* sight-glass tube with glowing tea and brass fittings */
 k.cylY(.011,.13,-.098,.14,.3,amb);k.cylY(.016,.02,-.098,.2,.3,brass);k.cylY(.016,.02,-.098,.08,.3,brass);k.cylY(.007,.02,-.092,.2,.3,brass,0,Math.PI/2);k.cylY(.007,.02,-.092,.08,.3,brass,0,Math.PI/2);
 /* frame under the boiler, trigger group, leather pistol grip with a brass backstrap */
 k.box(.072,.07,.32,0,.035,.2,gun);k.box(.06,.012,.28,0,.075,.2,steel);k.box(.1,.03,.1,0,.0,.06,gun);
 k.box(.046,.125,.058,0,-.072,.075,leather,.32);k.box(.012,.12,.06,.0,-.07,.045,brass,.32);k.box(.05,.016,.07,0,-.14,.055,brass,.32);
 k.box(.006,.032,.1,0,-.005,.13,steel);k.box(.007,.034,.012,0,-.012,.095,steel);k.box(.005,.026,.008,0,-.003,.12,steel);
 /* mahogany stock, brass butt plate and a small crest */
 k.box(.056,.1,.2,0,.045,-.13,mah);k.box(.056,.085,.12,0,.02,-.26,mah,-.14);k.box(.058,.11,.014,0,.0,-.332,brass,-.14);k.box(.058,.014,.2,0,.098,-.13,brass);k.box(.003,.05,.05,.029,.04,-.13,blue);k.box(.004,.03,.03,.0305,.04,-.13,brass);
 /* the nozzle: a curved teapot spout in tapering copper and brass sections, a heat sleeve and a glowing amber mouth */
 k.cyl(.052,.1,0,.15,.47,cop,.042,18);k.cyl(.042,.14,0,.152,.59,cop,.034,16);k.cyl(.034,.14,0,.158,.72,brass,.03,14);k.cyl(.03,.1,0,.166,.84,brass,.034,14);
 k.cyl(.046,.016,0,.168,.9,brass,.052,14);k.cyl(.036,.02,0,.168,.912,E(0xffb040),.036,14);k.cyl(.022,.025,0,.168,.92,dk,.022,10);
 for(let i=0;i<8;i++){const a=i/8*6.283;k.box(.007,.007,.05,Math.cos(a)*.044,.152+Math.sin(a)*.044,.62,dk)}
 /* copper pipes from the boiler to the nozzle, with elbows, and a valve wheel */
 for(const s of[-1,1]){k.cyl(.008,.34,s*.062,.2,.55,cop);k.sph(.012,s*.062,.2,.38,brass);k.sph(.012,s*.062,.2,.72,brass);k.cylY(.008,.04,s*.062,.18,.38,cop)}
 k.ring(.026,.005,0,.215,.4,brass);for(let i=0;i<4;i++){const a=i*Math.PI/2;k.box(.004,.05,.004,0,.215,.4,brass,0,0,a)}k.cyl(.007,.04,0,.215,.38,brass);
 /* teacup magazine on its saucer, with a blue band, a gold rim, tea inside and a handle */
 mags.push(k.cylY(.034,.075,0,-.02,.3,por,0,0,.054),k.cylY(.078,.012,0,-.06,.3,por),k.cylY(.056,.012,0,.005,.3,blue),k.cylY(.055,.004,0,.026,.3,brass),k.cylY(.047,.004,0,.021,.3,E(0xb5651d)),k.ring(.022,.006,.063,-.012,.3,por));
 k.box(.052,.016,.052,0,.018,.3,gun);
 /* a lamp that shows the cannon is hot */
 k.sph(.01,0,.083,.44,amb);
 g.userData.a={r:[0,-.07,.075],l:[0,-.02,.36],m:[0,-.05,.3]};g.userData.mags=mags;return g};
/* the beam: a thick stream of tea (a dark outer glow, an amber body, a pale hot core) with droplets and steam along its length */
function teaBeam(o,d,len,raw){const s=raw?o.clone():o.clone().add(d.clone().multiplyScalar(.7)).add(V(0,-.12,0)),e=o.clone().add(d.clone().multiplyScalar(len)),mid=s.clone().add(e).multiplyScalar(.5),L=s.distanceTo(e),dir=e.clone().sub(s).normalize();
 for(const[r,c,op,k]of[[.24,0x6a3a14,.2,1],[.13,0xc98a3b,.5,1.3],[.055,0xffe0b0,.95,2.2]]){const mt=new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:op});mt.color.multiplyScalar(k);const m=new THREE.Mesh(bmG,mt);m.position.copy(mid);m.scale.set(r,L,r);m.quaternion.setFromUnitVectors(V(0,1,0),dir);S.add(m);fx.push({m,l:.26,fade:op,r})}
 try{const dm=TEAB.m||(TEAB.m=(()=>{const q=new THREE.MeshBasicMaterial({color:0xd9953f});q.color.multiplyScalar(1.7);return q})());
  for(let i=0,n=Math.min(24,Math.floor(L/1.3));i<n;i++){const p=s.clone().lerp(e,Math.random());p.x+=(Math.random()-.5)*.4;p.y+=(Math.random()-.5)*.4;p.z+=(Math.random()-.5)*.4;const m=new THREE.Mesh(sg,dm),sc=.035+Math.random()*.06;m.scale.set(sc,sc*1.2,sc);m.position.copy(p);S.add(m);JX.teas.push({m,v:V((Math.random()-.5)*1.2,Math.random()*.8,(Math.random()-.5)*1.2),s:sc,t:0})}
  for(let i=0;i<5;i++)JX.h.addSp({p:s.clone().lerp(e,Math.random()*Math.min(1,10/L)),s0:.3,s1:1.1,life:.9,c:[.9,.88,.84],op:.3,tex:JX.h.puffTex,add:false,v:V(0,.5,0),dr:.9})}catch(x){}}
const TEAB={};
/* the beam goes through everything on its line: every zombie close to it takes a scalding hit of its own (the first one is hit by the shot itself) */
function teaPierce(o,d,len,w,first){if(typeof bots=='undefined')return;const hits=[];for(const b of bots){if(!b.zom||!b.al)continue;const vx=b.x-o.x,vy=(b.y||0)+1-o.y,vz=b.z-o.z,t=vx*d.x+vy*d.y+vz*d.z;if(t<1||t>len)continue;const px=vx-d.x*t,py=vy-d.y*t,pz=vz-d.z*t;if(Math.hypot(px,py,pz)>(b.big?1.7:1.15))continue;if(Math.abs(t-first)<1)continue;hits.push([t,b])}
 hits.sort((a,b)=>a[0]-b[0]);for(const[t,b]of hits.slice(0,5))boom(V(b.x,(b.y||0)+1,b.z),{R:1.6,d:Math.round(w.ex.d*.7),imp:0,w:'TEA',c:0xd9953f})}
/* tea splash: amber droplets, drifting steam and a puddle that steams away (same idea as the RayGun ooze, a different look) */
{const{cv,addSp,rnd,flareTex,puffTex,F,hi}=JX.h,dm=[1.9,1.4,1].map(k=>{const m=new THREE.MeshBasicMaterial({color:0xd9953f});m.color.multiplyScalar(k);return m}),
 pt=cv(128,128,(g,w,h)=>{const r=g.createRadialGradient(64,64,3,64,64,62);r.addColorStop(0,'rgba(240,190,110,.95)');r.addColorStop(.5,'rgba(170,95,35,.85)');r.addColorStop(.9,'rgba(120,60,20,.5)');r.addColorStop(1,'rgba(90,40,10,0)');g.fillStyle=r;g.fillRect(0,0,w,h)}),
 pg_=new THREE.CircleGeometry(1,18);JX.teas=[];JX.tpuds=[];
 JX.tea=function(p,g){if(!hi)return;const R_=Math.max(2,(g&&g.R)||2.6),near=C.position.distanceTo(p),prox=Math.max(0,1-near/(R_*3.4));F.boom=Math.min(1,Math.max(F.boom,.1+prox*.35));JX.flash(p,0xffb060,7,.3,R_*3);
  addSp({p:p.clone(),s0:R_*.2,s1:R_*.8,life:.28,c:[2.2,1.2,.45],op:.9,tex:flareTex});
  for(let i=0;i<6;i++)addSp({p:V(p.x+rnd(-.5,.5),p.y+rnd(.1,.6),p.z+rnd(-.5,.5)),s0:.5,s1:1.9,life:rnd(1.3,2.2),c:[.9,.88,.84],op:.38,tex:puffTex,add:false,v:V(rnd(-.2,.2),rnd(.7,1.5),rnd(-.2,.2)),dr:.9});
  const n=Math.min(JX.teas.length>40?5:16,22);for(let i=0;i<n;i++){const a=rnd(0,6.283),sp=rnd(2,5.5),m=new THREE.Mesh(sg,dm[i%3]),s=rnd(.04,.1);m.scale.set(s,s*rnd(.9,1.3),s);m.position.copy(p);S.add(m);JX.teas.push({m,v:V(Math.cos(a)*sp,rnd(2,6),Math.sin(a)*sp),s,t:0})}
  if(JX.tpuds.length>12){const o=JX.tpuds.shift();S.remove(o.m);o.m.material.dispose()}const m=new THREE.Mesh(pg_,(()=>{const q=new THREE.MeshBasicMaterial({map:pt,transparent:true,depthWrite:false,opacity:.85});q.color.setRGB(1.2,1,.9);return q})());m.rotation.x=-Math.PI/2;m.position.set(p.x,.05,p.z);m.scale.setScalar(.1);S.add(m);JX.tpuds.push({m,r:R_*.5,t:0,b:0})};
 const _tk=JX.tickG;JX.tickG=function(dt){if(_tk)_tk(dt);const G=JX.teas;for(let i=G.length-1;i>=0;i--){const o=G[i];o.t+=dt;o.v.y-=16*dt;o.m.position.addScaledVector(o.v,dt);if(o.m.position.y<=.06||o.t>2){S.remove(o.m);G.splice(i,1)}}
  const P_=JX.tpuds;for(let i=P_.length-1;i>=0;i--){const o=P_[i];o.t+=dt;const u=o.t,e=1-Math.pow(1-Math.min(1,u/.25),3),sh=u<3?1:Math.max(0,1-(u-3)/1.2);o.m.scale.setScalar(Math.max(.01,o.r*e*(.85+.15*sh)));o.m.material.opacity=.85*sh;o.b-=dt;if(o.b<=0&&u<3){o.b=rnd(.2,.4);addSp({p:V(o.m.position.x+rnd(-o.r,o.r)*.6,.15,o.m.position.z+rnd(-o.r,o.r)*.6),s0:.2,s1:.9,life:1.1,c:[.9,.88,.84],op:.3,tex:puffTex,add:false,v:V(0,.8,0),dr:.9})}if(sh<=0){S.remove(o.m);o.m.material.dispose();P_.splice(i,1)}}};
 const _gc=JX.goopClear;JX.goopClear=function(){if(_gc)_gc();for(const o of JX.teas)S.remove(o.m);for(const o of JX.tpuds){S.remove(o.m);o.m.material.dispose()}JX.teas.length=JX.tpuds.length=0}}
/* the splash lands: scalded zombies are slowed hard for a few seconds (the explosion damage itself is dealt by boom) */
function teaScald(p,R){if(typeof bots=='undefined')return;for(const b of bots){if(!b.zom||!b.al)continue;if(Math.hypot(b.x-p.x,b.z-p.z)<R)b.stun=Math.max(b.stun||0,2.4)}}

/* ===================== the map ===================== */
MAPS.London={d:'Zombies map: Westminster, London. Big Ben over the Palace Yard, a Tube station, Parliament Square, the Abbey, a pub, a bunker and a dead substation: the power is off until you find the switch. Own weapon: The Brew',
 zm:1,H:56,open:1,facade:1,sky:0x1a2030,gr:0x2c2e34,gt:'asphalt',bc:0x8b7d62,ps:[0,46],skyk:'night',hemi:.78,hemiC:0x9fb0d8,hemiG:0x23283a,sunI:.34,sunC:0xaab8e8,fogF:150,power:1,nf:0,
 outdoor:[[-8,8,8,40],[-30,-30,30,8],[-30,-42,30,-30]],links:[],lights:[],
 zs:[[-4,44,0],[4,44,0],[-5,48,0],[5,48,0],
  [0,30,1],[0,18,1],[-3,13,1],[4,22,1],[3,35,1],
  [-18,-6,2],[18,-6,2],[-20,-22,2],[20,-22,2],[-4,-27,2],[4,-27,2],[-10,2,2],[10,2,2],
  [14,20,3],[24,31,3],[24,18,3],
  [-39,-5,4],[-44,-20,4],[-36,-24,4],[-45,-12,4],
  [36,-14,5],[42,-22,5],[38,-12,5],
  [-24,28,6],[-14,32,6],[-24,34,6],
  [-20,-37,7],[0,-38,7],[-26,-34,7],[24,-33,7]],
 dr:[{x:0,z:40,w:6,d:.5,c:750,a:0,b:1,n:'Station Gate',s:'iron'},{x:0,z:8,w:16,d:.5,c:1000,a:1,b:2,n:'Whitehall Barricade',s:'iron'},{x:8,z:24,w:.5,d:4,c:750,a:1,b:3,n:'The Red Lion',s:'wood'},
  {x:-30,z:-15,w:.5,d:4.6,c:1250,a:2,b:4,n:'Abbey Doors',s:'stone'},{x:30,z:-18,w:.5,d:4,c:1500,a:2,b:5,n:'Substation',s:'iron'},{x:-8,z:30,w:.5,d:4,c:2250,a:1,b:6,n:'War Rooms Bunker',s:'stone'},
  {x:0,z:-30,w:8,d:.6,c:2000,a:2,b:7,n:'Palace Gates',s:'iron'}],
 mc:[{t:'rev',x:-7.2,z:46,f:'e'},{t:'vit',x:-7.2,z:14,f:'e'},{t:'dbl',x:27.2,z:28,f:'w'},{t:'mule',x:-30.9,z:-25,f:'w'},{t:'spd',x:-29.2,z:-36,f:'e'},{t:'stam',x:29.2,z:2,f:'w'},{t:'pap',x:-27.4,z:30,f:'e'},
  {t:'box',x:7.3,z:35,f:'w'},{t:'box',x:-29,z:-5,f:'e'},{t:'box',x:27.3,z:17,f:'w'},{t:'box',x:-28,z:-33,f:'e'},
  {t:'wall',k:'MP',x:-7.4,z:43,f:'e'},{t:'wall',k:'SG',x:7.4,z:43,f:'w'},{t:'wall',k:'SMG',x:-7.4,z:23,f:'e'},{t:'wall',k:'DS',x:-7.4,z:19,f:'e'},{t:'wall',k:'AR',x:7.4,z:12,f:'w'},{t:'wall',k:'MG',x:7.4,z:38,f:'w'},
  {t:'wall',k:'BR',x:-29.4,z:-21,f:'e'},{t:'wall',k:'VMP',x:27.4,z:22,f:'w'},{t:'wall',k:'TRB',x:-29.4,z:-9,f:'e'},{t:'wall',k:'TUR',x:29.4,z:-4,f:'w'},{t:'wall',k:'MVR',x:-29.4,z:-39,f:'e'},
  {t:'wall',k:'SN',x:-47,z:-0.6,f:'n'},{t:'wall',k:'RL',x:-27.4,z:34,f:'e'},{t:'wall',k:'CY',x:-27.4,z:25,f:'e'},{t:'wall',k:'KT',x:29.4,z:-8,f:'w'},
  {t:'ammo',x:-7.3,z:50,f:'e'},{t:'ammo',x:7.3,z:30,f:'w'},{t:'ammo',x:-29.2,z:-2,f:'e'},{t:'ammo',x:28,z:-29.2,f:'s'},{t:'ammo',x:-12,z:-41.2,f:'s'},{t:'ammo',x:-8.8,z:34,f:'w'},{t:'ammo',x:27.2,z:32,f:'w'}],
 b(){return lonBuild()}};
MAPS.London.post=g=>estPost(g);
/* the pooled lights, flicker and storm of the zombies pipeline belong to this map too; only the indoor test is its own */
MAPS.London.rooms=[[-8,40,8,56],[-30,22,-8,38],[8,14,28,34],[-54,-30,-30,0],[30,-26,46,-10]];
const lonIn=(x,z)=>MAPS.London.rooms.some(r=>x>r[0]&&x<r[2]&&z>r[1]&&z<r[3]);

/* ---------- building the street ---------- */
function lonBuild(){const M=MAPS.London,a=[],vv=M._v=[];EST.sd=23;EST.cols=[];EST.dyn=[];EST.spots=[];EST.pend=[];EST.fires=[];EST.mach={};EST.pendulum=[];EST.walls=[];EST.holes=[];
 EST.pts={f:{p:[],c:[],f:[],base:[],size:.34},h:{p:[],c:[],f:[],base:[],size:1.7},F:{p:[],c:[],f:[],base:[],size:.9},H:{p:[],c:[],f:[],base:[],size:3.4},s:{p:[],c:[],f:[],base:[],size:2.4}};
 const bk=EST.bk=mkBake(),PI_=Math.PI,B=(x,z,w,d,h,y0,c,k)=>a.push([x,z,w,d,h,y0||0,c,k]),V_=(x,z,w,d,h,y0,c,sh,tex)=>vv.push([x,z,w,d,h,y0||0,c,sh,tex]),
  R=(x0,z0,x1,z1,h,c,k,y0)=>B((x0+x1)/2,(z0+z1)/2,x1-x0,z1-z0,h,y0,c,k),col=(x,z,w,d,h)=>B(x,z,w,d,h,0,0,'n');
 /* a walled room with gaps for doors: gaps = [side,centre,width] */
 const room=(x0,z0,x1,z1,h,t,gaps,c,k)=>{const seg=(side,fixed,from,to)=>{const gs=gaps.filter(g=>g[0]==side).map(g=>[g[1]-g[2]/2,g[1]+g[2]/2]).sort((p,q)=>p[0]-q[0]);let cur=from;
   const add=(u0,u1)=>{if(u1-u0<.05)return;(side=='n'||side=='s')?R(u0,fixed-t/2,u1,fixed+t/2,h,c,k):R(fixed-t/2,u0,fixed+t/2,u1,h,c,k)};for(const g of gs){add(cur,g[0]);cur=g[1]}add(cur,to)};
  seg('n',z0,x0-t/2,x1+t/2);seg('s',z1,x0-t/2,x1+t/2);seg('w',x0,z0+t/2,z1-t/2);seg('e',x1,z0+t/2,z1-t/2)};
 const STN=0xb3a47a,DST=0x8f8260,GLD=0xc9a23a,RED=0xb3121b,IRN=0x1c1d20,lamp=(x,z,ry)=>{bk.at(x,0,z,ry||0,()=>{bk.cyl(0,0,0,.13,.17,.3,IRN,'m',8);bk.rod(0,.3,0,0,4.6,0,.06,.045,IRN,'m',6);bk.rod(0,4.5,0,.7,4.8,0,.04,.03,IRN,'m',5);bk.cyl(.7,4.5,0,.16,.1,.3,IRN,'m',6);bk.cyl(.7,4.52,0,.12,.09,.26,0xffe3a8,'e',6)});col(x,z,.4,.4,4);const w=bk.where(.7,0);eSpot(w[0],4.3,w[1],0xffc880,1.05,13,.9,erand()*9);eHalo(w[0],4.4,w[1],.5,.36,.16,'H')};
 const phone=(x,z,ry)=>{bk.at(x,0,z,ry,()=>{bk.bot(0,0,0,1,.3,1,RED,'m');for(const[sx,sz]of[[-.45,-.45],[.45,-.45],[-.45,.45],[.45,.45]])bk.bot(sx,.3,sz,.1,2,.1,RED,'m');bk.bot(0,2.3,0,1.1,.16,1.1,RED,'m');bk.cyl(0,2.46,0,.1,.5,.18,RED,'m',10);bk.bot(0,2.46,.45,.7,.05,.05,0xf4efe0,'e');bk.box(0,1.2,.47,.8,1.6,.04,0xffe8b0,'gl');bk.box(0,1.2,-.47,.8,1.6,.04,0xffe8b0,'gl');bk.box(-.47,1.2,0,.04,1.6,.8,0xffe8b0,'gl');bk.box(.47,1.2,0,.04,1.6,.8,0xffe8b0,'gl');bk.bot(0,.1,-.2,.3,.9,.3,0x2a2a2a,'m')});col(x,z,1.1,1.1,2.6)};
 const sand=(x,z,len,ry)=>{bk.at(x,0,z,ry||0,()=>{for(let r=0;r<3;r++)for(let i=0;i<Math.floor(len/.7);i++)bk.bot(-len/2+.35+i*.7+(r%2)*.3,r*.34,0,.66,.32,.45+erand()*.05,[0xb7a47a,0xa79568,0xc2b085][(i+r)%3],'f',erand()*.2)});if(Math.abs(Math.sin(ry||0))>.7)col(x,z,.8,len,1.1);else col(x,z,len,.8,1.1)};
 const bus=(x,z,ry)=>{bk.at(x,0,z,ry,()=>{bk.bot(0,.5,0,2.6,1.8,9.6,RED,'m');bk.bot(0,2.3,0,2.5,1.8,9.4,RED,'m');bk.bot(0,4.1,0,2.5,.12,9.4,0x8a0e15,'m');bk.bot(0,.3,0,2.3,.3,9.2,0x2a2a2d,'m');for(let i=0;i<7;i++){bk.box(1.27,2.9,-4+i*1.35,.04,.95,1.0,0x1b2230,'gl');bk.box(-1.27,2.9,-4+i*1.35,.04,.95,1.0,0x1b2230,'gl');bk.box(1.27,1.3,-3.6+i*1.5,.04,.8,1.1,0x1b2230,'gl');bk.box(-1.27,1.3,-3.6+i*1.5,.04,.8,1.1,0x1b2230,'gl')}
   for(const sz of[-3.2,3.2])for(const sx of[-1.3,1.3])bk.cyl(sx,.45,sz,.5,.5,.3,0x0e0e10,'m',12,0,0,PI_/2);bk.bot(0,3.05,4.81,1.8,.4,.04,0xffb040,'e');bk.bot(0,.9,4.81,1.9,.5,.04,0xf4efe0,'e');bk.bot(1.3,1.2,-4.78,.04,2.2,.04,0xd9d9d9,'m')});
  const rot=Math.abs(Math.sin(ry))>.7;col(x,z,rot?9.8:2.8,rot?2.8:9.8,4.3)};
 const taxi=(x,z,ry,c)=>{bk.at(x,0,z,ry,()=>{bk.bot(0,.35,0,1.9,.8,4.4,c,'m');bk.bot(0,1.1,-.2,1.7,.75,2.4,c,'m');bk.box(0,1.5,-.2,1.62,.5,2.2,0x1b2230,'gl');bk.bot(0,1.85,-.2,.8,.2,.4,0xffe8b0,'e');for(const sz of[-1.4,1.4])for(const sx of[-.9,.9])bk.cyl(sx,.32,sz,.33,.33,.22,0x0e0e10,'m',10,0,0,PI_/2)});const rot=Math.abs(Math.sin(ry))>.7;col(x,z,rot?4.6:2.1,rot?2.1:4.6,1.9)};
 const tree=(x,z)=>{bk.at(x,0,z,erand()*6,()=>{bk.cyl(0,0,0,.28,.4,3.4,0x4a4036,'w',8);for(let i=0;i<5;i++){const an=i/5*6.28+erand(),l=1.8+erand()*1.3;bk.rod(0,3.1,0,Math.cos(an)*l,5.2+erand()*1.6,Math.sin(an)*l,.13,.04,0x4a4036,'w',5)}});col(x,z,.8,.8,6)};
 const statue=(x,z,ry)=>{bk.at(x,0,z,ry,()=>{bk.bot(0,0,0,2.4,.5,2.4,DST,'s');bk.bot(0,.5,0,1.8,2.2,1.8,STN,'s');bk.bot(0,2.7,0,2.1,.3,2.1,DST,'s');bk.cyl(0,3,0,.38,.5,1.5,0x2f4a3c,'g',10);bk.sph(0,4.75,0,.3,.34,.3,0x2f4a3c,'g',10);bk.rod(-.3,4.3,0,-.9,3.4,.2,.1,.08,0x2f4a3c,'g',5);bk.rod(.3,4.3,0,.8,3.5,-.2,.1,.08,0x2f4a3c,'g',5);bk.cyl(0,3,0,.5,.6,.1,0x2f4a3c,'g',10)});col(x,z,2.4,2.4,5)};
 const bench=(x,z,ry)=>{bk.at(x,0,z,ry,()=>{bk.bot(0,.45,0,1.8,.08,.5,0x4a2f1c,'w');bk.bot(0,.8,-.22,1.8,.5,.06,0x4a2f1c,'w');for(const s of[-.8,.8])bk.bot(s,0,0,.08,.45,.45,IRN,'m')});const rot=Math.abs(Math.sin(ry))>.7;col(x,z,rot?.6:1.8,rot?1.8:.6,.9)};
 /* ---- the ground-level world ---- */
 V_(0,0,112,112,.02,0,0x2c2e34,'b','asphalt');
 V_(0,-17,34,26,.1,0,0x35432b,'b','grass');                                 /* Parliament Square garden */
 for(const x of[-28,28])V_(x,-14,4,30,.08,0,0x6f6a62,'b','concrete');       /* pavements */
 V_(0,24,16,32,.04,0,0x3a3c42,'b','asphalt');V_(0,-36,60,12,.05,0,0x6b6458,'b','cobble');/* Palace Yard cobbles */
 /* masses: the streets are walled in so the playable world is exactly the streets, the square, the yard and the interiors */
 R(-56,8,-30,56,12,0x6f6048,'brick');R(30,-10,47.5,56,12,0x6f6048,'brick');R(-56,-56,30,-42,16,0xb9ab84,'stucco');R(30,-56,47.5,-26,14,0x7a6a58,'brick');R(-56,-42,-30,-30,12,0xa39a7e,'stucco');R(-56,0,-30,8,10,0x6f6048,'brick');
 R(46,-26,47.5,-10,6,0x59595a,'concrete');R(47.5,-56,56,56,3,0x7a766c,'stone');
 /* terraces, hall, pub, bunker */
 R(-30,8,-8,22,10,0x7b6a52,'brick');R(-30,38,-8,56,10,0x7b6a52,'brick');R(8,8,30,14,9,0x7a5a46,'brick');R(8,34,30,56,10,0x7a5a46,'brick');R(28,14,30,34,6,0x7a5a46,'brick');
 room(-8,40,8,54,5.6,.6,[['n',0,6]],0xcfd2d6,'tile');V_(0,47,17,15,6.2,5.6,0x3a3d42,'b','concrete');V_(0,47,16,14,.03,0,0x8a8f95,'b','tile');
 room(8,14,28,34,5.2,.6,[['w',24,4]],0x6b4a34,'brick');V_(18,24,21,21,5.8,5.2,0x3a2f28,'b','shingle');V_(18,24,19.5,19.5,.03,0,0x4a3322,'b','plank');
 room(-28,22,-8,38,4.6,.6,[['e',30,4]],0x6d6e70,'concrete');V_(-18,30,21,17,5.2,4.6,0x2f3033,'b','concrete');V_(-18,30,19.5,15.5,.03,0,0x55575a,'b','concrete');
 room(-54,-30,-30,0,17,.8,[['e',-15,4.6]],0xa39a7e,'stucco');V_(-42,-15,25,31,17.6,17,0x39424a,'b','shingle');V_(-42,-15,23,29,.03,0,0x6a655a,'b','tile');
 room(30,-26,46,-10,6,.6,[['w',-18,4]],0x5b5d60,'concrete');V_(38,-18,17,17,6.5,6,0x2a2b2e,'b','concrete');V_(38,-18,15.5,15.5,.03,0,0x4a4c50,'b','concrete');
 /* the Palace Yard fence: iron railings with the gate in the middle */
 R(-30,-30.3,-4,-29.7,3.2,IRN,'metal');R(4,-30.3,30,-29.7,3.2,IRN,'metal');
 /* Big Ben stands in the yard, built into the Palace */
 const TX=16,TZ=-38;col(TX,TZ,8.8,8.8,60);
 bk.at(TX,0,TZ,0,()=>{const S=STN,D=DST;bk.bot(0,0,0,9.4,2,9.4,D,'s');bk.bot(0,2,0,8.2,32,8.2,S,'s');
  for(const sx of[-1,1])for(const sz of[-1,1]){bk.bot(sx*4.3,0,sz*4.3,1,36,1,D,'s');bk.cyl(sx*4.3,36,sz*4.3,0,.6,3.4,D,'s',8)}
  for(const y of[12,22,32]){bk.bot(0,y,0,8.9,.5,8.9,D,'s')}
  for(let f=0;f<4;f++)bk.at(0,0,0,f*PI_/2,()=>{for(const px of[-2.2,0,2.2]){bk.bot(px,4,4.12,1.5,6,.14,0x6f6448,'s');bk.bot(px,11,4.12,1.5,9,.14,0x6f6448,'s');bk.bot(px,24,4.12,1.5,7,.14,0x6f6448,'s');bk.bot(px,6,4.2,.5,2.4,.1,0x1b1d22,'gl');bk.bot(px,13.5,4.2,.5,3,.1,0x1b1d22,'gl');bk.bot(px,26,4.2,.5,2.4,.1,0xffd890,'e')}});
  bk.bot(0,34,0,10.6,2,10.6,D,'s');bk.bot(0,36,0,9.4,10.4,9.4,0x5d574c,'s');bk.bot(0,46.2,0,10.6,.9,10.6,D,'s');
  for(let f=0;f<4;f++)bk.at(0,0,0,f*PI_/2,()=>{bk.cyl(0,41.2-.06,4.78,3.55,3.55,.12,0xf3ead0,'e',32,PI_/2);bk.tor(0,41.2,4.8,3.6,.2,GLD,'g',0,0,0,32);for(let h=0;h<12;h++){const an=h/12*6.283,r=2.95;bk.bot(Math.sin(an)*r,41.2+Math.cos(an)*r-.18,4.86,.2,h%3?.34:.5,.06,0x23201a,'m',-an)}
   bk.rod(0,41.2,4.9,.2,43.9,4.9,.09,.05,0x23201a,'m',4);bk.rod(0,41.2,4.95,1.9,42.4,4.95,.07,.04,0x23201a,'m',4);bk.sph(0,41.2,4.95,.22,.22,.1,GLD,'g',8);bk.bot(0,44.9,4.9,2.4,.5,.1,GLD,'g');for(const px of[-3.6,3.6])bk.cyl(px,36,4.85,.18,.18,10.4,GLD,'g',6)});
  bk.bot(0,47.1,0,9.4,.5,9.4,D,'s');for(const sx of[-1,1])for(const sz of[-1,1])bk.bot(sx*3.9,47.6,sz*3.9,1.2,7.2,1.2,S,'s');bk.bot(0,47.6,0,6.8,7.2,6.8,0x14151a,'gl');bk.lathe(0,48.6,0,[[.2,0],[1.1,.2],[1.5,.9],[1.3,2.2],[.5,2.6],[.15,2.7]],GLD,'g',12);
  bk.bot(0,54.8,0,10,.5,10,D,'s');bk.cyl(0,55.3,0,.3,6.6,9.4,0x3d4a52,'m',4,0,PI_/4,0);for(let i=0;i<4;i++)bk.rod(Math.cos(i*PI_/2+PI_/4)*4.6,55.3,Math.sin(i*PI_/2+PI_/4)*4.6,0,64.6,0,.1,.05,GLD,'g',4);bk.rod(0,64.6,0,0,68.2,0,.14,.03,GLD,'g',6);bk.sph(0,64.8,0,.35,.4,.35,GLD,'g',8);
  bk.cyl(0,43,0,0,0,0,0,'s',3);
  for(const sx of[-1,1])for(const sz of[-1,1]){bk.cyl(sx*5,46.9,sz*5,0,.55,3,D,'s',6)}});
 /* the Palace of Westminster: bays of pilasters, windows and pinnacles along its face; Victoria Tower at the far end */
 for(let x=-54;x<=24;x+=6){bk.bot(x,0,-41.7,1.1,16,.7,DST,'s');bk.cyl(x,16,-41.5,0,.6,3.2,DST,'s',6);for(const[y,h]of[[3,4.2],[9,4.2]]){bk.bot(x+3,y,-41.8,1.9,h,.2,0x2a2c30,'gl');bk.bot(x+3,y,-41.75,2.3,.3,.3,DST,'s');if(erand()<.6)bk.bot(x+3,y+.3,-41.7,1.5,h-.8,.1,0xffd890,'e')}bk.bot(x+3,13.6,-41.7,2.4,1.6,.3,0x9a8c68,'s')}
 R(-54,-50,-46,-42,46,0xb4a67e,'stucco');bk.at(-50,0,-46,0,()=>{for(const sx of[-1,1])for(const sz of[-1,1])bk.cyl(sx*3.9,40,sz*3.9,0,.7,5.5,DST,'s',6);bk.bot(0,44.2,0,8.6,.6,8.6,DST,'s');bk.cyl(0,44.8,0,.3,4,6,0x3d4a52,'m',4,0,PI_/4,0)});
 /* the Abbey: pillars, an altar with candles, stained glass */
 for(const x of[-36,-42,-48])for(const z of[-22,-8]){R(x-.6,z-.6,x+.6,z+.6,15,0x8a8478,'stone');bk.bot(x,0,z,1.5,.5,1.5,DST,'s');bk.bot(x,14.5,z,1.5,.5,1.5,DST,'s')}
 R(-53.6,-18,-51,-12,1.2,0x6a655a,'stone');for(const z of[-17,-15,-13])eFlame(-52.3,1.5,z,1,1);
 for(const[z,c]of[[-26,0x3a5fd0],[-14,0xd03a3a],[-4,0xd0a63a]]){V_(-30.2,z,.1,2.6,9,3,c,'e');V_(-53.7,z,.1,2.6,9,3,c,'e');eSpot(-34,7,z,c,.9,14,.5,erand()*9)}
 V_(-42,-29.7,2.6,.1,9,3,0x3aa05a,'e');V_(-42,-.3,2.6,.1,9,3,0x6a3ad0,'e');
 /* pub furniture */
 R(12,15,25,16.4,1.1,0x4a2f1c,'plank');for(const[x,z]of[[15,29],[20,21],[21,28]]){R(x-.8,z-.8,x+.8,z+.8,1,0x5a3a22,'plank')}for(const[x,z]of[[10.4,32.6],[26.6,15.6]]){bk.cyl(x,0,z,.45,.45,1,0x6a4a2a,'w',10);col(x,z,.9,.9,1)}
 for(const[x,z]of[[13,25],[18,25],[17,32],[24,24]])eSpot(x,3.9,z,0xffb866,.85,10,.8,erand()*9);
 /* the Tube station: ticket barriers and machines */
 R(-7.6,43,-2.4,43.5,1.1,0x6b6f76,'metal');R(2.4,43,7.6,43.5,1.1,0x6b6f76,'metal');eSpot(0,5,46,0xcfe0ff,1.15,15,.95,.3);eSpot(0,5,52,0xcfe0ff,1,13,.9,.8);bk.tor(0,3.6,40.35,.8,.12,RED,'m',0,0,0,24);bk.bot(0,3.3,40.4,2.4,.28,.12,0x1c3f94,'e');
 /* substation: transformers, pipes, hazard stripes */
 for(const[x,z]of[[34,-22],[34,-14],[41,-13]]){R(x-1.4,z-1.4,x+1.4,z+1.4,3.4,0x4a5058,'metal');bk.cyl(x-.8,3.4,z,.18,.18,.8,0xcfd2d6,'m',6);bk.cyl(x+.8,3.4,z,.18,.18,.8,0xcfd2d6,'m',6)}
 for(let i=0;i<10;i++)bk.bot(31+i*1.5,.02,-18+.1,.7,.01,.5,i%2?0xd7b92a:0x1c1d20,'f');eSpot(36,5,-18,0xff8a40,.8,12,.7,1);
 /* street furniture */
 for(const[x,z]of[[-7,36],[7,36],[7,16],[-7,12],[-20,3],[20,3],[-26,-24],[26,-24],[-12,-30.8],[12,-30.8],[-22,-35],[0,-35],[-7,-3],[7,-3],[-24,-9],[24,-9]])lamp(x,z,x<0?0:PI_);
 phone(-5.4,10,0);phone(5.4,10,0);phone(24,-12,PI_);phone(-24,6,0);phone(0,-5,PI_/2);phone(27,-27,PI_);
 sand(-4.6,10.4,6,0);sand(4.6,10.4,6,0);sand(-12,-28.2,6,0);sand(12,-28.2,6,0);bus(-3.2,26,0.1);bus(-18,-2,PI_/2);bus(36.6,0,0);taxi(4,32,.3,0x1a1c22);taxi(18,4,PI_/2,0x1a1c22);taxi(-14,2,2.5,0x1a1c22);taxi(10,-26,.2,0x1a1c22);
 for(const[x,z]of[[-12,-8],[12,-8],[-12,-18],[12,-18],[-3,-12],[3,-12],[-22,-18],[22,-20]])tree(x,z);
 for(const[x,z,ry]of[[-5.4,-4.4,0],[5.4,-4.4,0],[-5.4,-19.5,PI_],[5.4,-19.5,PI_]])bench(x,z,ry);
 statue(-8,-8,0);statue(8,-8,PI_);statue(0,-24,PI_/2);
 /* Thames: water beyond the embankment wall with the bridge and the Eye on the far bank */
 V_(52,0,8.5,112,.05,0,0x14283a,'b','asphalt');V_(52,0,8.5,112,.07,.05,0x2a566e,'g');
 for(let i=0;i<=24;i++){const an=i/24*PI_*2;V_(84+Math.sin(an)*26,34+(-Math.cos(an))*0+0,.6,.6,26+Math.cos(an)*24,0,0xe8eef8,'e')}
 for(let i=0;i<12;i++){const an=i/12*6.283;V_(84,20,.5,.5,26+Math.cos(an)*24,0,0xd7dde8,'e')}
 V_(50,-6,6,10,.5,0,0x3a3c42,'b','concrete');for(let i=0;i<4;i++)V_(50,-10.5+i*3,5,.3,1.6,.5,0x24262a,'b','metal');
 /* sodium haze over the Palace Yard and the glow from Big Ben's dials */
 eSpot(TX-6,18,TZ+7,0xffe0a0,1.3,26,.9,2);eSpot(TX,40,TZ+9,0xffe8b8,1.1,40,.95,4);eSpot(-4,6,-36,0xffd890,.9,20,.9,5);
 return a.concat(EST.cols)}

/* ===================== the power ===================== */
/* power only matters on maps that say so (London). Revive Soda in the spawn room runs off an emergency generator, so a solo player can always buy their self-revive */
function zPowered(){const M=MAPS[sel.map];return !(M&&M.power)||!!(typeof zq!='undefined'&&zq&&zq.power)}
function noPower(){beep(110,.18,'square',.08);msg('The power is off. Find the switch in the substation',1.8)}
function lonMachFx(on){const O=EST.objs,list=[],skip=new Set();for(const k in O.mach){if(k=='rev')continue;list.push(O.mach[k].g);skip.add(O.mach[k].sign)}if(O.pap)list.push(O.pap.g);const f=on?1:.07;
 for(const g of list)g.traverse(o=>{if(!o.isMesh&&!o.isSprite)return;let m=o.material;if(!m||Array.isArray(m)||!m.color||skip.has(m))return;if(!o.userData.pc){m=o.material=m.clone();o.userData.pc=m.color.clone();if(m.emissive)o.userData.pe=m.emissive.clone()}
  m.color.copy(o.userData.pc).multiplyScalar(m.isMeshBasicMaterial||m.isSpriteMaterial?f:on?1:.4);if(m.emissive&&o.userData.pe)m.emissive.copy(o.userData.pe).multiplyScalar(f)})}
const LONEGG={got:[0,0,0],boil:0,kills:0,done:0,tt:0,items:[]};
function lonPowerOn(quiet){if(zq.power)return;zq.power=1;lonMachFx(true);const lv=EST.lon&&EST.lon.lever;if(lv){lv.on=1}
 if(!quiet){EST.lt.flash=1;EST.lt.rep=3;LX.fx.pulse=Math.max(LX.fx.pulse,.5);shake=Math.max(shake,.5);noise(1.2,200,.5);beep(60,1.2,'sawtooth',.14);[392,523,659,784].forEach((f,i)=>setTimeout(()=>beep(f,.5,'triangle',.07),300+i*140));
  for(const k in EST.objs.mach){const o=EST.objs.mach[k];burst(V(o.g.position.x,1.6,o.g.position.z),22,0xfff0b0,6,.8,.12)}if(EST.objs.pap)burst(V(EST.objs.pap.g.position.x,1.6,EST.objs.pap.g.position.z),30,0xa070ff,6,.8,.14);
  popup('POWER RESTORED','Perk machines and Pack-a-Punch are live. Something is whistling in the pub…')}}
/* ===================== the easter egg: The Great British Brew =====================
   1 restore the power  2 find the kettle (the pub), the tea tin (the Abbey altar) and a teacup (the Tube station)  3 take them to the foot of Big Ben and brew:
   hold out in the Palace Yard for 70 seconds and put down 16 zombies near the tower. The tea blaster, The Brew, is yours, and it joins the Mystery Box. */
function lonAct(a){if(netOn&&!isHost){netSend({t:'zlon',a,by:zMe()});return}lonDo(a)}
function lonDo(a){if(a=='power'){if(zq.power)return;lonPowerOn();return}if(!zq.power)return;const E=LONEGG;
 if(a.startsWith('item')){const i=+a[4];if(E.got[i])return;E.got[i]=1;lonItemFx(i);const n=E.got.reduce((s,v)=>s+v,0);msg(n<3?`Found the ${['kettle','tea tin','teacup'][i]} · tea set ${n}/3`:'The tea set is complete. Take it to Big Ben',2.4);if(n==3)popup('THE TEA SET','Bring it to the foot of Big Ben, in the Palace Yard');return}
 if(a=='brew'){if(E.done||E.boil>0||E.got.some(v=>!v))return;E.boil=70;E.kills=0;E.tt=0;popup('THE KETTLE IS ON','Hold the Palace Yard: 16 kills near the tower in 70 seconds');beep(220,.6,'sine',.1);return}}
function lonItemFx(i){const it=LONEGG.items[i];if(it){it.g.visible=false;burst(V(it.x,it.y,it.z),18,0xfff0b0,3,.8,.08)}beep(660,.2,'triangle',.08);setTimeout(()=>beep(880,.25,'triangle',.07),110)}
function lonKill(b){const E=LONEGG;if(E.boil>0&&Math.hypot(b.x-16,b.z+38)<18)E.kills++}
function lonFinish(){const E=LONEGG;E.boil=0;E.done=1;zq.tea=1;burst(V(16,2,-33),50,0xffd890,7,1.4,.14);EST.lt.flash=1;[196,147,98,196].forEach((f,i)=>setTimeout(()=>{beep(f,1.2,'sine',.12);beep(f*2,.9,'triangle',.05)},i*520));popup('TIME FOR TEA','You unlocked The Brew. It is also in the Mystery Box now');lonGiveTea()}
function lonGiveTea(){if(zq.teaGot)return;zq.teaGot=1;zGive('TEA')}
/* items, the power switch and the tower door are built once the zombies pipeline has made the doors, machines and boxes */
MAPS.London.objs=function(M){const E=LONEGG;E.got=[0,0,0];E.boil=0;E.kills=0;E.done=0;E.items=[];zq.power=0;zq.tea=0;zq.teaGot=0;
 /* machines start dark */
 lonMachFx(false);for(const s of EST.spots)if(Math.hypot(s.x,s.z)>0){for(const m of M.mc)if(m.t&&m.t!='rev'&&m.t!='wall'&&m.t!='ammo'&&m.t!='box'&&Math.hypot(s.x-m.x,s.z-m.z)<3.2){s.pw=1}}
 /* the power switch */
 {const g=new THREE.Group(),f=eFace('w');g.position.set(45.1,0,-18);g.rotation.y=f;const cab=eM(0x2a2d31,0,.5,.7),yel=eM(0xd7b92a,0,.6,.2),red=eM(0xc4261d,0,.4,.3),brass=eM(0xb08a3a,0,.3,1);
  eMk(g,EG.box,cab,0,1.4,0,2.6,2.8,.9);eMk(g,EG.box,yel,0,2.62,.46,2.6,.16,.02);eMk(g,EG.box,eM(0x16181b,0,.6,.4),0,1.5,.47,1.9,1.5,.06);
  const lamp=eBasic(0xc41a14,1);eMk(g,EG.cyl,lamp,-.7,2.1,.52,.1,.04,.1,PI/2);const lamp2=eBasic(0x16c43a,.15);eMk(g,EG.cyl,lamp2,.7,2.1,.52,.1,.04,.1,PI/2);
  const lev=new THREE.Group();lev.position.set(0,1.5,.52);g.add(lev);eMk(lev,EG.cyl,brass,0,0,0,.14,.1,.14,PI/2);const arm=eMk(lev,EG.box,eM(0xcfd2d6,0,.3,.9),0,.55,0,.07,1.1,.07);eMk(lev,EG.sph,red,0,1.15,0,.17,.17,.17);
  eMk(g,EG.pl,eCanvasMat(256,64,(x,w,h)=>{x.fillStyle='#d7b92a';x.fillRect(0,0,w,h);x.fillStyle='#111';x.font='700 38px Teko,Impact,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('MAIN POWER · DANGER',w/2,h/2+2)}),0,.55,.47,1.6,.4,1);
  zG.add(g);const o=EST.lon={lever:{g,lev,lamp,lamp2,on:0,a:-.9}};lev.rotation.z=-.9;col2(45.1,-18,.9,2.6,2.8);
  zi.push({x:44.0,z:-18,r:2.8,txt:()=>zq.power?'':'Throw the main power switch',cost:()=>0,act:()=>lonAct('power')});
  EST.dyn.push({tick(dt,t){const L=o.lever,tg=L.on?.9:-.9;L.a+=(tg-L.a)*Math.min(1,dt*(L.on?9:3));L.lev.rotation.z=L.a;L.lamp.color.setRGB(L.on?.1:1.6+.4*Math.sin(t*6),L.on?.1:.1,.1);L.lamp2.color.setRGB(.1,L.on?1.6:.15,.1);
   for(const s of EST.spots)if(s.pw){if(!zq.power){if(s.I>0){s.I0=s.I;s.I=0}}else if(s.I0){s.I=s.I0;s.I0=0}}
   lonEggTick(dt,t)}})}
 /* the tea set: three small glowing props */
 const mk=(i,x,y,z,build)=>{const g=new THREE.Group();g.position.set(x,y,z);build(g);const h=new THREE.Mesh(EG.sph,eBasic(0xffd890,.14,1));h.scale.setScalar(.5);g.add(h);zG.add(g);const it={g,x,y,z,h};E.items[i]=it;
  zi.push({x,z,r:2.4,txt:()=>!zq.power||E.got[i]?'':['Take the kettle','Take the tea tin','Take the teacup'][i],cost:()=>0,act:()=>lonAct('item'+i)})};
 mk(0,13,1.1,15.7,g=>{const w=eM(0xcfd2d6,0,.25,.9),bl=eM(0x15171a,0,.6,.4);eMk(g,EG.cyl,w,0,.12,0,.14,.2,.14);eMk(g,EG.cyl,w,0,.26,0,.1,.04,.1);eMk(g,EG.sph,bl,0,.3,0,.03,.03,.03);eMk(g,EG.cyl,w,.17,.17,0,.03,.14,.03,0,0,-1);eMk(g,EG.box,bl,-.15,.2,0,.02,.15,.03)});
 mk(1,-52.3,1.3,-11.3,g=>{eMk(g,EG.cyl,eM(0x9c1a1a,0,.4,.6),0,.1,0,.1,.2,.1);eMk(g,EG.cyl,eM(0xc9a23a,0,.3,.9),0,.21,0,.105,.03,.105);eMk(g,EG.cyl,eM(0xf0e8d0,0,.7,0),0,.1,0,.102,.1,.102)});
 mk(2,3.4,1.05,44.3,g=>{const p=eM(0xf2ece0,0,.4,.1);eMk(g,EG.cyl,p,0,.06,0,.08,.1,.08);eMk(g,EG.cyl,eM(0x2b4f9e,0,.4,.1),0,.12,0,.082,.012,.082);eMk(g,EG.cyl,eM(0xb5651d,0,.3,0),0,.115,0,.07,.01,.07);eMk(g,EG.cyl,p,.1,.07,0,.03,.07,.01,PI/2)});
 /* the tower door and a ring on the ground while the tea brews */
 {const ring=new THREE.Mesh(new THREE.RingGeometry(17,17.5,64),new THREE.MeshBasicMaterial({color:0xffc060,transparent:true,opacity:0,depthWrite:false,side:THREE.DoubleSide}));ring.rotation.x=-Math.PI/2;ring.position.set(16,.09,-38);zG.add(ring);E.ring=ring;
  zi.push({x:16,z:-33,r:3.4,txt:()=>!zq.power||E.done||E.boil>0?'':E.got.some(v=>!v)?'The tower door is shut':'Put the kettle on',cost:()=>0,act:()=>{if(E.got.some(v=>!v)){msg('You need the whole tea set first',1.8);return}lonAct('brew')}})}
 /* the HUD line for the brew */
 let h=document.getElementById('egg');if(!h){h=document.createElement('div');h.id='egg';document.getElementById('hud').appendChild(h)}E.hud=h};
const col2=(x,z,w,d,h)=>{zSolid(x,z,w,d,h)};
function lonEggTick(dt,t){const E=LONEGG;for(const it of E.items){if(!it||!it.g.visible)continue;it.g.position.y=it.y+Math.sin(t*2+it.x)*.04;it.g.rotation.y+=dt*.8;it.h.material.opacity=(zq.power?.2:.07)+.08*Math.sin(t*3+it.z)}
 if(E.hud){const on=E.boil>0;E.hud.style.display=on?'block':'none';if(on)E.hud.textContent=`THE BREW  ·  ${Math.min(16,E.kills)} / 16 kills  ·  ${Math.ceil(E.boil)}s`}
 if(E.ring){const on=E.boil>0;E.ring.material.opacity=on?.28+.12*Math.sin(t*4):0}
 if(E.boil>0&&(!netOn||isHost)){E.boil-=dt;E.tt+=dt;if(E.tt>2.4){E.tt=0;const al=bots.filter(b=>b.zom&&b.al).length;if(al<22&&zq.open[7])zSpawn(MAPS.London,false)}
  if(E.kills>=16)lonFinish();else if(E.boil<=0){E.boil=0;popup('THE TEA WENT COLD','Try again: the tea set is still yours');}}
 if(zq.tea&&!zq.teaGot&&LONEGG.done)lonGiveTea()}
/* Big Ben chimes with every new round (the zombies pipeline already rings its own bell: this adds the hour) */
{const _rf=zRoundFx;zRoundFx=function(){const r=_rf.apply(this,arguments);if(sel.map=='London'&&zq){const n=Math.min(8,zq.r);setTimeout(()=>{for(let i=0;i<n;i++)setTimeout(()=>{if(run&&mode=='Zombies'){beep(98,1.6,'sine',.12);beep(196,1.2,'triangle',.04);beep(392,.8,'sine',.02)}},i*1500)},3800)}return r}}
/* co-op: the host shares the power and the brew; guests copy it */
function lonPack(){const E=LONEGG;return typeof zq!='undefined'&&zq?[zq.power?1:0,E.got[0]|E.got[1]<<1|E.got[2]<<2,E.done?1:0,Math.round(E.boil),E.kills,zq.tea?1:0]:0}
function lonSync(d){if(!d.lo||sel.map!='London')return;const[p,g,dn,bo,k,t]=d.lo,E=LONEGG;if(p&&!zq.power)lonPowerOn();for(let i=0;i<3;i++){const h=(g>>i)&1;if(h&&!E.got[i]){E.got[i]=1;lonItemFx(i)}}if(t)zq.tea=1;E.boil=bo;E.kills=k;if(dn&&!E.done){E.done=1;zq.tea=1;lonGiveTea()}}
/* every map is registered now: build the Zombies map screen */
if(typeof zMapScreen=='function')zMapScreen();
