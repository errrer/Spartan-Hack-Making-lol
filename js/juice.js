/* ######## juice.js ######## */
/* ===================== juice.js ===================== */
/* ---------- JUICE: everything that makes the world react. Loads after the game systems and before the anti-cheat in streaks.js, so the functions it extends are wrapped in the same order as everything else.
   - model hooks:  guns get metal / polymer materials, people get cloth and skin, small box parts get rounded edges (see lumen.js)
   - dynamic light: a fixed pool of 3 point lights flashes at muzzles, explosions and kills (the pool never changes size, so shaders never recompile)
   - explosions:   fireball, shockwave ring, rolling smoke, sparks, scorch marks on the ground, camera shake, chromatic kick, lens bloom
   - shooting:     glowing tracers, muzzle flares, ejected shell casings, muzzle smoke, recoil kick in the post-processing
   - feedback:     damage flash, low-health heartbeat, sprint blur, heal glow, kill pulse, hit-marker pop
   - atmosphere:   a per-map cloud of floating dust, pollen, ash, embers or fireflies; waving flags; spinning zone rings
   Everything lives in one function so it adds no globals except JX. Note: inside it `F` is the post-processing state (LX.fx) and `fx` is still the game's own effects array. ---------- */
(function(){
const hi=LX.pbr,V3=THREE.Vector3,JX=window.JX={lights:[],sp:[],rings:[],cas:[],scorch:[]},rnd=(a,b)=>a+Math.random()*(b-a),F=LX.fx,T=()=>LX.U.time.value;
const cv=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);return new THREE.CanvasTexture(c)};
const glowTex=cv(64,64,(g,w,h)=>{const r=g.createRadialGradient(32,32,0,32,32,32);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.2,'rgba(255,255,255,.62)');r.addColorStop(.55,'rgba(255,255,255,.14)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,w,h)});
const puffTex=cv(64,64,(g,w,h)=>{for(let i=0;i<9;i++){const x=32+(Math.random()-.5)*26,y=32+(Math.random()-.5)*26,r=g.createRadialGradient(x,y,0,x,y,16+Math.random()*10);r.addColorStop(0,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,w,h)}});
const flareTex=cv(128,128,(g,w,h)=>{const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.12,'rgba(255,240,200,.9)');r.addColorStop(.4,'rgba(255,170,70,.25)');r.addColorStop(1,'rgba(255,120,30,0)');g.fillStyle=r;g.fillRect(0,0,w,h);
 g.globalCompositeOperation='lighter';for(let i=0;i<4;i++){g.save();g.translate(64,64);g.rotate(i*Math.PI/4+.2);const l=g.createLinearGradient(-64,0,64,0);l.addColorStop(0,'rgba(255,200,120,0)');l.addColorStop(.5,'rgba(255,230,170,.75)');l.addColorStop(1,'rgba(255,200,120,0)');g.fillStyle=l;g.fillRect(-64,-1.6,128,3.2);g.restore()}});
JX.glowTex=glowTex;
/* ---------- sprite pool: fireballs, flares, smoke, glints ---------- */
function addSp(o){if(JX.sp.length>170)return null;const m=new THREE.SpriteMaterial({map:o.tex||glowTex,transparent:true,depthWrite:false,blending:o.add===false?THREE.NormalBlending:THREE.AdditiveBlending,opacity:o.op==null?1:o.op});m.color.setRGB(o.c[0],o.c[1],o.c[2]);if(o.rot!=null)m.rotation=o.rot;
 const s=new THREE.Sprite(m);s.position.copy(o.p);s.scale.setScalar(o.s0);s.renderOrder=3;S.add(s);JX.sp.push({s,m,a:0,L:o.life,s0:o.s0,s1:o.s1==null?o.s0:o.s1,op:o.op==null?1:o.op,v:o.v||null,g:o.g||0,dr:o.dr==null?1:o.dr,rot:o.vr||0,io:!!o.io});return s}
function ring(p,r0,r1,life,col,op){if(JX.rings.length>8)return;const m=new THREE.Mesh(JX.ringG||(JX.ringG=new THREE.RingGeometry(.86,1,56)),new THREE.MeshBasicMaterial({color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,opacity:op}));
 m.position.copy(p);m.rotation.x=-Math.PI/2;m.scale.setScalar(r0);m.renderOrder=3;S.add(m);JX.rings.push({m,a:0,L:life,r0,r1,op})}
function scorch(p,r){if(!hi||p.y>1.2)return;const m=new THREE.Mesh(JX.scG||(JX.scG=new THREE.CircleGeometry(1,28)),new THREE.MeshBasicMaterial({color:0x000000,transparent:true,opacity:.5,depthWrite:false,polygonOffset:true,polygonOffsetFactor:-2,polygonOffsetUnits:-2}));
 m.rotation.x=-Math.PI/2;m.position.set(p.x,.035,p.z);m.scale.setScalar(r);S.add(m);JX.scorch.push({m,a:0,L:11});if(JX.scorch.length>10){const o=JX.scorch.shift();S.remove(o.m);o.m.material.dispose()}}
/* ---------- the light pool ---------- */
if(hi)for(let i=0;i<3;i++){const l=new THREE.PointLight(0xffc070,0,16);l.position.set(0,-99,0);S.add(l);JX.lights.push({l,t:0,d:.1,I:0})}
JX.flash=function(p,col,I,life,dist){if(!JX.lights.length)return;let b=JX.lights[0];for(const x of JX.lights)if(x.t<b.t)b=x;b.l.position.copy(p);b.l.color.setHex(col);b.l.distance=dist;b.I=I;b.d=life;b.t=life};
/* ---------- explosions ---------- */
JX.explode=function(p,g){if(!hi)return;const R_=Math.max(3,g&&g.R||6),near=C.position.distanceTo(p),prox=Math.max(0,1-near/(R_*3.2));
 F.boom=Math.min(1,Math.max(F.boom,.25+prox*.9));F.ca=Math.min(1,F.ca+prox*.8);if(near<R_*1.2)F.flash=Math.max(F.flash,.3*prox);
 JX.flash(p,0xffa545,18,.55,R_*4);
 addSp({p:p.clone(),s0:R_*.5,s1:R_*1.9,life:.5,c:[3.2,1.6,.5],op:1});addSp({p:p.clone(),s0:R_*.25,s1:R_*1.1,life:.28,c:[5,4,3],op:1});
 addSp({p:p.clone().add(V(0,R_*.2,0)),s0:R_*.9,s1:R_*2.4,life:.65,c:[1.6,.55,.12],op:.55,tex:flareTex});
 ring(V(p.x,Math.max(.08,p.y),p.z),.6,R_*1.5,.5,0xffcf8a,.9);ring(V(p.x,Math.max(.1,p.y),p.z),.3,R_*.9,.35,0xffffff,.6);
 for(let i=0;i<9;i++){const a=rnd(0,6.28),d=rnd(.1,R_*.35);addSp({p:V(p.x+Math.cos(a)*d,p.y+rnd(0,R_*.3),p.z+Math.sin(a)*d),s0:R_*.35,s1:R_*rnd(1.2,2),life:rnd(1.6,2.6),c:[.2,.2,.21],op:rnd(.28,.45),add:false,tex:puffTex,v:V(rnd(-.5,.5),rnd(.8,1.8),rnd(-.5,.5)),dr:.96,vr:rnd(-.4,.4),rot:rnd(0,6)})}
 for(let i=0;i<14;i++){const a=rnd(0,6.28),sp=rnd(3,10);addSp({p:p.clone(),s0:.22,s1:.02,life:rnd(.5,1.1),c:[3,1.6,.5],op:1,v:V(Math.cos(a)*sp,rnd(2,9),Math.sin(a)*sp),g:-14,dr:.99})}
 scorch(p,R_*.55)};
/* ---------- RayGun ooze: ONE shared effect for the player, bots, other players and zombie co-op (rgImpact). A small, bright, glossy crimson-pink burst, not blood:
   luminous (it blooms), a hot pale core, round gel blobs that arc out and land as glowing puddles that bubble and shrink away, with a few drifting glowing spores. ---------- */
{const gm=[2.3,1.8,1.35].map(k=>{const m=new THREE.MeshBasicMaterial({color:0xff2f66});m.color.multiplyScalar(k);return m}),
 hot=(()=>{const m=new THREE.MeshBasicMaterial({color:0xffb0c8});m.color.multiplyScalar(2.2);return m})(),
 pt=cv(128,128,(g,w,h)=>{const r=g.createRadialGradient(64,64,3,64,64,62);r.addColorStop(0,'rgba(255,190,205,.95)');r.addColorStop(.3,'rgba(255,60,110,.9)');r.addColorStop(.75,'rgba(215,20,80,.6)');r.addColorStop(.93,'rgba(255,110,150,.5)');r.addColorStop(1,'rgba(160,0,60,0)');g.fillStyle=r;g.fillRect(0,0,w,h)}),
 pm=()=>{const m=new THREE.MeshBasicMaterial({map:pt,transparent:true,depthWrite:false,opacity:.9});m.color.setRGB(1.5,1.1,1.2);return m},
 pg_=new THREE.CircleGeometry(1,18);JX.goops=[];JX.puds=[];
 JX.goop=function(p,g){if(!hi)return;const R_=Math.max(2,(g&&g.R)||3.2),near=C.position.distanceTo(p),prox=Math.max(0,1-near/(R_*3.4));
  F.boom=Math.min(1,Math.max(F.boom,.12+prox*.5));F.ca=Math.min(1,F.ca+prox*.35);if(near<R_*1.2)F.flash=Math.max(F.flash,.18*prox);
  JX.flash(p,0xff3a6a,12,.4,R_*3.6);
  addSp({p:p.clone(),s0:R_*.28,s1:R_*.95,life:.34,c:[3.2,.5,1.1],op:1,tex:flareTex});addSp({p:p.clone(),s0:R_*.14,s1:R_*.55,life:.2,c:[4,2.4,2.8],op:1});
  addSp({p:p.clone().add(V(0,R_*.12,0)),s0:R_*.5,s1:R_*1.2,life:.5,c:[1.5,.2,.55],op:.5,tex:flareTex});
  ring(V(p.x,Math.max(.08,p.y),p.z),.4,R_*1.05,.38,0xff6a98,.85);ring(V(p.x,Math.max(.1,p.y),p.z),.2,R_*.6,.26,0xffd0de,.6);
  const n=Math.min(JX.goops.length>44?6:20,26);for(let i=0;i<n;i++){const a=rnd(0,6.283),sp=rnd(2,6.5),m=new THREE.Mesh(sg,i%5==0?hot:gm[i%3]),s=rnd(.045,.12);m.scale.set(s,s*rnd(.8,1.25),s);m.position.copy(p);S.add(m);JX.goops.push({m,v:V(Math.cos(a)*sp,rnd(2.2,6.8),Math.sin(a)*sp),s,t:0})}
  for(let i=0;i<7;i++){const a=rnd(0,6.283),d=rnd(.1,R_*.4);addSp({p:V(p.x+Math.cos(a)*d,p.y+rnd(0,.5),p.z+Math.sin(a)*d),s0:.1,s1:.34,life:rnd(.9,1.6),c:[2.6,.45,1],op:.8,tex:glowTex,v:V(rnd(-.4,.4),rnd(.5,1.4),rnd(-.4,.4)),dr:.95})}
  JX.pud(p.x,Math.max(.05,Math.min(p.y,.3)),p.z,R_*.55)};
 /* a glowing gel puddle on the floor: it spreads, bubbles, then shrinks away */
 JX.pud=function(x,y,z,r){if(y>.4&&JX.puds.length>10)return;if(JX.puds.length>16){const o=JX.puds.shift();S.remove(o.m);o.m.material.dispose()}const m=new THREE.Mesh(pg_,pm());m.rotation.x=-Math.PI/2;m.rotation.z=rnd(0,6.28);m.position.set(x,.05+rnd(0,.012),z);m.scale.setScalar(.1);S.add(m);JX.puds.push({m,r:r*rnd(.8,1.15),t:0,b:0})};
 JX.tickG=function(dt){const G=JX.goops;for(let i=G.length-1;i>=0;i--){const o=G[i];o.t+=dt;o.v.y-=17*dt;o.m.position.addScaledVector(o.v,dt);o.m.scale.y=o.s*(1+Math.min(.5,Math.abs(o.v.y)*.05));
   let hit=0;const q=o.m.position;if(q.y<=.06){hit=1}else if(o.t>.12&&typeof bx!='undefined'){for(const b of bx){if(b.pl)continue;if(q.x>b.x0&&q.x<b.x1&&q.z>b.z0&&q.z<b.z1&&q.y<b.h&&q.y>(b.y0||0)){hit=2;break}}}
   if(hit||o.t>2.4){S.remove(o.m);G.splice(i,1);if(hit==1&&Math.random()<.5)JX.pud(q.x,.06,q.z,o.s*rnd(5,9));if(hit&&Math.random()<.3)addSp({p:q.clone(),s0:.08,s1:.3,life:.3,c:[3,.9,1.4],op:.9})}}
  const P_=JX.puds;for(let i=P_.length-1;i>=0;i--){const o=P_[i];o.t+=dt;const u=o.t,g=Math.min(1,u/.22),e=1-Math.pow(1-g,3),sh=u<2.2?1:Math.max(0,1-(u-2.2)/1.1);o.m.scale.setScalar(Math.max(.01,o.r*e*(.85+.15*sh)));o.m.material.opacity=.9*sh*(.88+.12*Math.sin(u*11));
   o.b-=dt;if(o.b<=0&&u<2&&u>.2){o.b=rnd(.12,.3);const a=rnd(0,6.28),d=rnd(0,o.r*.8);addSp({p:V(o.m.position.x+Math.cos(a)*d,.14,o.m.position.z+Math.sin(a)*d),s0:.04,s1:.2,life:.28,c:[3,1.2,1.6],op:.85,v:V(0,.5,0),dr:.9})}
   if(sh<=0){S.remove(o.m);o.m.material.dispose();P_.splice(i,1)}}};
 JX.goopClear=function(){for(const o of JX.goops)S.remove(o.m);for(const o of JX.puds){S.remove(o.m);o.m.material.dispose()}JX.goops.length=JX.puds.length=0};
 /* everyone's RayGun impact: the same visual, plus a squelch that fades with distance (the player's own shot gets its sound from boom) */
 window.rgImpact=function(p){try{JX.goop(p,W.RG.ex);const d=C.position.distanceTo(p),v=Math.max(0,1-d/45);if(v>.05){noise(.28,650,.3*v);beep(190,.2,'sawtooth',.06*v);beep(430,.14,'sine',.05*v)}}catch(e){}}}
/* ---------- shooting ---------- */
JX.muzzle=function(p,k){const d=C.position.distanceTo(p);if(d>70)return;const sg_=k=='SG',rg=k=='RG',col=rg?[3.2,.45,.85]:[3,1.9,.8];
 addSp({p:p.clone(),s0:sg_?.7:.42,s1:sg_?1.2:.7,life:.055,c:col,op:1,tex:flareTex,rot:rnd(0,6.28)});
 if(d<45&&d>2.5)JX.flash(p,rg?0xff3a6a:0xffc070,sg_?5:3.2,.075,rg?16:13);
 if(d<30&&!rg)addSp({p:p.clone(),s0:.12,s1:.55,life:rnd(.5,.8),c:[.75,.75,.78],op:.22,add:false,tex:puffTex,v:V(rnd(-.2,.2),rnd(.2,.5),rnd(-.2,.2)),dr:.9,vr:rnd(-.5,.5)})};
JX.tracer=function(o,d,len,col,life,raw){if(!hi||len<1)return;const a=raw?o.clone():o.clone().add(d.clone().multiplyScalar(.6)).add(V(0,-.12,0)),b=o.clone().add(d.clone().multiplyScalar(len)),dv=b.clone().sub(a),L=dv.length();if(L<.3)return;
 const m=new THREE.Mesh(cyHi,new THREE.MeshBasicMaterial({color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.9}));m.material.color.multiplyScalar(2.4);
 m.position.copy(a).add(b).multiplyScalar(.5);m.quaternion.setFromUnitVectors(V(0,1,0),dv.divideScalar(L));m.scale.set(.012,L,.012);S.add(m);fx.push({m,l:life||.06,fade:.85,r:.012})};
/* shell casings fly out of the ejection port, bounce on the floor and fade */
const brass=hi?new THREE.MeshStandardMaterial({color:0xd2a94a,metalness:1,roughness:.28}):new THREE.MeshLambertMaterial({color:0xd2a94a}),shell=new THREE.MeshLambertMaterial({color:0xc4302a});
JX.casing=function(sh){if(JX.cas.length>38){const o=JX.cas.shift();S.remove(o.m)}const m=new THREE.Mesh(cyHi,sh?shell:brass),p=new V3(.2,-.12,-.42);C.localToWorld(p);m.position.copy(p);
 const r=new V3(1,0,0).applyQuaternion(C.quaternion),f=new V3(0,0,-1).applyQuaternion(C.quaternion);m.scale.set(sh?.011:.0045,sh?.05:.02,sh?.011:.0045);m.rotation.set(rnd(0,3),rnd(0,3),rnd(0,3));
 const v=r.multiplyScalar(rnd(1.6,2.8)).add(V(0,rnd(1.4,2.4),0)).add(f.multiplyScalar(rnd(-.3,.8)));S.add(m);JX.cas.push({m,v,a:0,sp:V(rnd(-14,14),rnd(-14,14),rnd(-14,14)),b:0})};
/* ---------- atmosphere: floating motes ---------- */
JX.AMB={Blockfort:{c:[1.5,1.4,1.05],n:300,sz:.011,op:.55,w:[.1,.02,.05],box:[46,11,46],fl:0},Pillars:{c:[1.5,1.5,1.35],n:240,sz:.009,op:.4,w:[.3,.03,.1],box:[50,12,50],fl:0},
 Canyon:{c:[2.2,1.2,.5],n:340,sz:.011,op:.6,w:[.7,.06,.2],box:[50,12,50],fl:.4},Suburbia:{c:[1.5,1.5,1.1],n:240,sz:.01,op:.42,w:[.12,.02,.04],box:[46,10,46],fl:0},
 Boomtown:{c:[1.5,1.05,.6],n:460,sz:.009,op:.6,w:[2.8,.05,.8],box:[48,9,48],fl:0},Rust:{c:[1.6,1.35,.95],n:320,sz:.009,op:.48,w:[1.5,.06,.4],box:[54,10,54],fl:0},
 Decay:{c:[1.1,1.15,1.1],n:420,sz:.01,op:.55,w:[.25,-.5,.1],box:[44,12,44],fl:0},'Hollow Estate':{c:[.7,2.2,.55],n:300,sz:.016,op:1,w:[.05,.03,.04],box:[40,7,40],fl:1}};
JX.setMap=function(name){if(JX.amb){if(JX.amb.parent)JX.amb.parent.remove(JX.amb);JX.amb.geometry.dispose();JX.amb.material.dispose();JX.amb=null}if(!hi)return;const a=JX.AMB[name]||JX.AMB.Blockfort,N=LX.q=='high'?a.n:Math.floor(a.n*.5),pos=new Float32Array(N*3),sd=new Float32Array(N*4);
 for(let i=0;i<N;i++){pos[i*3]=Math.random();pos[i*3+1]=Math.random();pos[i*3+2]=Math.random();sd[i*4]=rnd(.4,1.6);sd[i*4+1]=rnd(.6,1.3);sd[i*4+2]=rnd(.15,.9);sd[i*4+3]=Math.random()}
 const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.BufferAttribute(pos,3));g.setAttribute('aS',new THREE.BufferAttribute(sd,4));
 const m=new THREE.ShaderMaterial({transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,fog:false,uniforms:{uT:LX.U.time,uCam:{value:new V3()},uBox:{value:new V3(a.box[0],a.box[1],a.box[2])},uWind:{value:new V3(a.w[0],a.w[1],a.w[2])},uSize:{value:a.sz},uPx:{value:innerHeight*.62},uOp:{value:a.op},uFlick:{value:a.fl},uCol:{value:new THREE.Color(a.c[0],a.c[1],a.c[2])}},
  vertexShader:`uniform float uT;uniform float uSize;uniform float uPx;uniform float uFlick;uniform vec3 uCam;uniform vec3 uBox;uniform vec3 uWind;attribute vec4 aS;varying float vA;
void main(){vec3 p=position*uBox;p+=uWind*uT*aS.y;p+=vec3(sin(uT*aS.x+aS.w*6.283),cos(uT*aS.x*0.7+aS.w*3.1)*0.5,cos(uT*aS.x*0.9+aS.w*5.0))*aS.z*2.0;
vec3 q=mod(p-uCam+uBox*0.5,uBox)-uBox*0.5;vec3 w=vec3(uCam.x+q.x,mod(p.y,uBox.y),uCam.z+q.z);vec4 mv=viewMatrix*vec4(w,1.0);gl_Position=projectionMatrix*mv;float d=max(0.4,-mv.z);
gl_PointSize=clamp(uSize*(0.5+aS.z)*uPx/d,1.0,26.0);float edge=1.0-smoothstep(uBox.x*0.32,uBox.x*0.5,length(q.xz));float tw=0.5+0.5*sin(uT*aS.x*3.0+aS.w*40.0);vA=edge*mix(1.0,tw,uFlick)*smoothstep(0.3,2.0,d);}`,
  fragmentShader:`uniform vec3 uCol;uniform float uOp;varying float vA;void main(){float d=length(gl_PointCoord-0.5)*2.0;float a=1.0-smoothstep(0.0,1.0,d);a*=a;gl_FragColor=vec4(uCol,a*vA*uOp);}`});
 JX.amb=new THREE.Points(g,m);JX.amb.frustumCulled=false;JX.amb.renderOrder=2;(typeof mapG!='undefined'&&mapG?mapG:S).add(JX.amb)};
/* ---------- the per-frame update ---------- */
let lastShots=0,lastTot=null,wasDead=0,lowC=-1,ammoC=-1;
JX.tick=function(dt){const t=T();if(JX.tickG)JX.tickG(dt);
 for(const x of JX.lights){if(x.t>0){x.t-=dt;x.l.intensity=x.I*Math.pow(Math.max(0,x.t/x.d),1.4)}else if(x.l.intensity)x.l.intensity=0}
 for(let i=JX.sp.length-1;i>=0;i--){const o=JX.sp[i];o.a+=dt;const k=o.a/o.L;if(k>=1){S.remove(o.s);o.m.dispose();JX.sp.splice(i,1);continue}
  const e=1-Math.pow(1-k,2.2);o.s.scale.setScalar(o.s0+(o.s1-o.s0)*e);o.m.opacity=o.op*(o.io?Math.min(1,k*5)*(1-k):(1-k)*(1-k)*(k<.08?k/.08:1));
  if(o.v){o.s.position.addScaledVector(o.v,dt);o.v.multiplyScalar(Math.pow(o.dr,dt*60));o.v.y+=o.g*dt}if(o.rot)o.m.rotation+=o.rot*dt}
 for(let i=JX.rings.length-1;i>=0;i--){const o=JX.rings[i];o.a+=dt;const k=o.a/o.L;if(k>=1){S.remove(o.m);o.m.material.dispose();JX.rings.splice(i,1);continue}o.m.scale.setScalar(o.r0+(o.r1-o.r0)*(1-Math.pow(1-k,3)));o.m.material.opacity=o.op*(1-k)}
 for(let i=JX.scorch.length-1;i>=0;i--){const o=JX.scorch[i];o.a+=dt;if(o.a>o.L){S.remove(o.m);o.m.material.dispose();JX.scorch.splice(i,1)}else o.m.material.opacity=.5*Math.min(1,(o.L-o.a)/3)}
 for(let i=JX.cas.length-1;i>=0;i--){const o=JX.cas[i];o.a+=dt;o.v.y-=9.8*dt;o.m.position.addScaledVector(o.v,dt);o.m.rotation.x+=o.sp.x*dt;o.m.rotation.y+=o.sp.y*dt;o.m.rotation.z+=o.sp.z*dt;
  if(o.m.position.y<.03){o.m.position.y=.03;if(o.b<3){o.v.y=Math.abs(o.v.y)*.38;o.v.x*=.55;o.v.z*=.55;o.b++;o.sp.multiplyScalar(.5)}else{o.v.set(0,0,0);o.sp.set(0,0,0)}}
  if(o.a>2.6){o.m.scale.multiplyScalar(.88);if(o.a>3.2){S.remove(o.m);JX.cas.splice(i,1)}}}
 if(JX.amb){const u=JX.amb.material.uniforms;u.uCam.value.copy(C.position);u.uPx.value=(innerHeight||720)*.62}
 if(typeof flags!='undefined'&&flags)for(const f of flags){const c=f.m&&f.m.children&&f.m.children[1];if(c){const b=c.userData.bs||(c.userData.bs=c.scale.x);c.rotation.y=Math.sin(t*2.3+(f.x||0)*.3)*.16;c.rotation.z=Math.sin(t*3.1+(f.z||0)*.2)*.05;c.scale.x=b*(1+.05*Math.sin(t*4.7+(f.x||0)))}}
 if(typeof zones!='undefined'&&zones)for(const z of zones){if(z.base)z.base.rotation.y+=dt*.35;if(z.beam){const b=z.beam.userData.bs||(z.beam.userData.bs=z.beam.scale.x||1);z.beam.scale.x=z.beam.scale.z=b*(1+.07*Math.sin(t*3+(z.x||0)))}}
 if(typeof run!='undefined'&&run&&typeof P!='undefined'&&P&&typeof over!='undefined'&&!over){
  /* shots */
  if(typeof shots!='undefined'){if(shots>lastShots&&typeof cw=='function'){const w=cw(),k=w&&w.k,d=(typeof W!='undefined'&&W[k])||{};F.shot=Math.min(1,F.shot+.55);
    if(hi&&k&&!d.ex&&k!='RG'&&!P.dead)JX.casing(d.pel>1)}lastShots=shots}
  /* damage, healing, heartbeat */
  const tot=P.hp+P.sh;if(lastTot!=null&&!P.dead){const dl=tot-lastTot;if(dl<-1.5){F.dmg=Math.min(1,Math.max(F.dmg,.35+(-dl)/70));F.ca=Math.min(1,F.ca+.45+(-dl)/90);F.pulse=Math.max(F.pulse,.1)}else if(dl>6)F.heal=Math.min(1,F.heal+.55)}lastTot=tot;
  const low=!P.dead&&P.hp<P.mhp*.35;if(low){const hb=Math.pow(Math.max(0,Math.sin(t*5.2)),6);F.pulse=Math.max(F.pulse,hb*.07);F.dmg=Math.max(F.dmg,.2+hb*.14)}
  if(P.dead&&!wasDead){F.dmg=1;F.blur=.5;F.ca=1}if(!P.dead&&wasDead){F.flash=Math.max(F.flash,.3);F.ca=.7}wasDead=P.dead;
  /* sprint / fall blur */
  const tgt=(P.spr||0)*.3+(P.vy<-13?.25:0);F.speed+=(tgt-F.speed)*Math.min(1,dt*6);
  /* HUD state classes (written only when they change) */
  if(low!==lowC){lowC=low;const b=document.getElementById('bars');b&&b.classList.toggle('low',low)}
  if(typeof cw=='function'){const w=cw(),lowAmmo=!!(w&&w.mag<=Math.max(1,w.m*.25)&&!P.dead);if(lowAmmo!==ammoC){ammoC=lowAmmo;const a=document.getElementById('am');a&&a.classList.toggle('low',lowAmmo)}}
 }else{F.speed+=(0-F.speed)*Math.min(1,dt*6);lastTot=null;lastShots=typeof shots!='undefined'?shots:0}};
/* ---------- wrap the game functions (none of these are on the anti-cheat list) ---------- */
const wrap=(name,fn)=>{try{const o=globalThis[name];if(typeof o=='function')globalThis[name]=fn(o);else console.warn('juice: no function '+name)}catch(e){console.warn('juice hook '+name,e)}};
/* models: guns are metal, people are cloth and skin, small boxes get rounded edges */
const ctxWrap=(ctx,pick)=>o=>function(){const old=LX.ctx;LX.ctx=ctx;try{const r=o.apply(this,arguments);LX.bevel(pick(r,arguments));if(ctx=='char'&&LX.mergeRig)LX.mergeRig(pick(r,arguments),r);return r}finally{LX.ctx=old}};
if(hi){wrap('buildGun',ctxWrap('gun',(r,a)=>r&&r.traverse?r:a[2]));wrap('attFpModel',ctxWrap('gun',r=>r&&r.traverse?r:null));wrap('mkHuman',ctxWrap('char',(r,a)=>a[0]))}
/* particles: hot colours glow (the HDR target keeps values above 1, so bloom picks them up) */
if(hi&&typeof mc!='undefined'){for(const[c,k]of[[0xffd24a,2.6],[0xffffff,1.8],[0xffa040,2.6],[0x62e0f0,2.2],[0xffdd66,2.4],[0xffe08a,2.4],[0xff4040,1.8]])if(!mc[c]){mc[c]=new THREE.MeshBasicMaterial({color:c});mc[c].color.multiplyScalar(k)}}
wrap('muzzleFlash',o=>function(p,k){const r=o.apply(this,arguments);try{JX.muzzle(p,k)}catch(e){}return r});
wrap('tr',o=>function(a,d,len,col,life,raw){const r=o.apply(this,arguments);try{JX.tracer(a,d,len,col,life,raw)}catch(e){}return r});
wrap('boom',o=>function(p,g){const r=o.apply(this,arguments);try{if(g&&!g.tac){if(g.w=='RG')JX.goop(p,g);else if(g.w=='TEA'&&JX.tea)JX.tea(p,g);else JX.explode(p,g)}else if(g&&g.tac)JX.flash(p,0xffffff,10,.25,24)}catch(e){}return r});
wrap('juiceHit',o=>function(b,d,head){const r=o.apply(this,arguments);try{F.hit=1;F.ca=Math.min(1,F.ca+.12);const h=document.getElementById('hm');if(h){h.style.animation='none';void h.offsetWidth;h.style.animation=''}if(hi&&b)addSp({p:V(b.x,head?1.75:1.1,b.z),s0:.3,s1:head?.9:.55,life:.16,c:head?[3,2.2,.6]:[2.2,2.2,2.2],op:.9})}catch(e){}return r});
wrap('juiceKill',o=>function(b,head){const r=o.apply(this,arguments);try{F.pulse=Math.max(F.pulse,.14);F.ca=Math.min(1,F.ca+.5);if(hi&&b){JX.flash(V(b.x,1.2,b.z),head?0xffd24a:0xff9060,5,.2,10);ring(V(b.x,.1,b.z),.3,2.2,.4,head?0xffd24a:0xff7a50,.7);addSp({p:V(b.x,1.1,b.z),s0:.5,s1:1.5,life:.28,c:[3,1.4,.6],op:.8})}}catch(e){}return r});
wrap('gfxTick',o=>function(dt){o.apply(this,arguments);try{JX.tick(dt)}catch(e){if(!JX.err){JX.err=1;console.warn('juice tick',e)}}});
wrap('buildMap',o=>function(){const r=o.apply(this,arguments);try{JX.setMap(sel.map)}catch(e){console.warn('ambient',e)}return r});
wrap('setGfx',o=>function(q){const r=o.apply(this,arguments);document.body.classList.remove('gfx-high','gfx-med','gfx-low');document.body.classList.add('gfx-'+q);return r});
document.body.classList.add('gfx-'+LX.q);LX.initBright();
/* clear the effects of the last match when a new one starts */
wrap('juiceReset',o=>function(){const r=o.apply(this,arguments);try{if(JX.goopClear)JX.goopClear();for(const a of[JX.sp,JX.rings,JX.scorch,JX.cas])for(const x of a)S.remove(x.m||x.s);JX.sp.length=JX.rings.length=JX.scorch.length=JX.cas.length=0;lastTot=null;wasDead=0;lastShots=typeof shots!='undefined'?shots:0;F.dmg=F.boom=F.flash=F.blur=0}catch(e){}return r});
JX.h={cv,addSp,ring,rnd,hi,flareTex,puffTex,glowTex,F};
})();
