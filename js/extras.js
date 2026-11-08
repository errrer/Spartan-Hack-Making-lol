/* ===================== extras.js ===================== */
/* ---------- Twin SMG (dual wield) ----------
   Multiplayer: an attachment on the SMG, "Dual Wield", turns it into two compact SMGs (the weapon becomes 'DS' when the match starts).
   Zombies: its own weapon (wall buy and Mystery Box). Hip fire only. Mouse and keyboard: the fire button alternates the two guns.
   Controller: LEFT trigger fires the LEFT gun, RIGHT trigger fires the RIGHT gun, both together fire both. */
W.DS={n:'Twin SMG',d:21,r:.044,m:60,sp:.034,rc:.62,pel:1,au:1,rl:2.3,len:.4,col:0x33363b,dual:1};
WG.DS=[.55,0x33363b,0,0xffd27a];
GS.DS=GS.SMG;
const ATT_ONLY={'Dual Wield':'SMG'};
A['Dual Wield']={t:'SMG only: wield two SMGs at once. Hip fire only, double the magazine. Controller: left trigger fires the left gun, right trigger the right gun'};
UNL['Dual Wield']=14;
if(typeof CLS!='undefined')CLS.DS='PRIMARY';
const DS={k:[0,0],h:0,L:false,R:false};
/* one compact SMG facing +z, built around its pistol grip at z=0: boxy receiver with a slotted top rail, bolt window with a steel slider, knurled collar and muzzle tube,
   round side lug, textured pistol grip with a collar plate, a long magazine in the grip and a second one hanging under the shroud */
function dsUnit(side,rm,mags){const u=new THREE.Group(),k=gunKit(u,rm),M=k.M,body=rm||M(0x34373c),dk=M(0x14161a),gm=M(0x23262b),steel=M(0x8c9298),rub=M(0x0c0d0f),acc=M(0x4a4e55);
 k.box(.064,.072,.31,0,0,.13,body);k.box(.056,.014,.29,0,.043,.13,gm);k.box(.068,.03,.11,0,.03,.015,body);k.box(.05,.02,.07,0,.05,-.02,gm);
 for(let i=0;i<5;i++)k.box(.05,.011,.013,0,.052,.02+i*.036,dk);
 k.box(.004,.03,.085,side*.033,.012,.1,dk);k.box(.008,.016,.032,side*.034,.014,.115,steel);k.box(.005,.008,.06,side*.034,-.006,.1,steel);
 k.box(.005,.05,.1,side*.033,-.012,.2,gm);for(let i=0;i<3;i++)k.box(.005,.011,.026,side*.034,.03,.2+i*.032,dk,0,0,-.5*side);
 for(const y of[.03,-.02])for(const z of[.04,.21])k.cylY(.005,.008,side*.035,y,z,steel,0,Math.PI/2*side);
 k.box(.074,.088,.13,0,0,.31,gm);k.box(.07,.012,.12,0,.05,.31,dk);for(let i=0;i<4;i++)k.box(.075,.007,.02,0,-.036,.27+i*.03,dk);
 k.cyl(.039,.024,0,.005,.385,acc);for(let i=0;i<10;i++){const a=i/10*6.283;k.box(.012,.012,.026,Math.cos(a)*.04,.005+Math.sin(a)*.04,.385,steel,0,0,a)}
 k.cyl(.0185,.15,0,.006,.47,dk);k.cyl(.022,.022,0,.006,.54,gm);k.cyl(.0125,.012,0,.006,.552,M(0x050506));
 const d=new THREE.Mesh(new THREE.CylinderGeometry(.024,.024,.018,16),gm);d.rotation.z=Math.PI/2;d.position.set(side*.04,-.012,.345);u.add(d);const d2=new THREE.Mesh(new THREE.CylinderGeometry(.015,.015,.02,12),dk);d2.rotation.z=Math.PI/2;d2.position.set(side*.045,-.012,.345);u.add(d2);
 k.box(.042,.115,.052,0,-.088,.012,rub,.3);for(let i=0;i<5;i++)k.box(.044,.006,.054,0,-.05-i*.018,.012-i*.0055,dk,.3);k.box(.056,.018,.066,0,-.15,-.01,steel,.3);k.box(.05,.012,.06,0,-.168,-.016,gm,.3);
 mags.push(k.box(.04,.17,.064,0,-.245,-.026,dk,.3));mags.push(k.box(.046,.016,.07,0,-.333,-.05,gm,.3));
 k.box(.006,.034,.1,0,-.05,.115,steel);k.box(.007,.034,.012,0,-.055,.07,steel);k.box(.005,.026,.008,0,-.04,.09,steel);
 mags.push(k.box(.036,.125,.058,0,-.105,.285,dk,.05));mags.push(k.box(.042,.014,.064,0,-.172,.282,gm,.05));
 k.box(.05,.014,.05,0,-.045,.255,gm);
 return u}
MODELS.DS=function(g,rm){const mags=[],units=[];for(const side of[-1,1]){const u=dsUnit(side,rm,mags);u.position.x=side*.105;u.rotation.y=-side*.035;g.add(u);units.push(u)}
 /* units[0] is the gun on the shooter's right (a character facing +z has its right hand on -x) */
 g.userData.a={r:[-.105,-.09,.01],l:[.105,-.09,.01],m:[0,-.17,.0]};g.userData.mags=mags;g.userData.units=units;return g};
/* the guns fire in turn (or the one you chose with the controller triggers); each kicks back on its own */
function dsShot(w){const pad=PG&&PG.on&&(DS.L||DS.R);let h;if(pad&&DS.L!=DS.R)h=DS.L?1:0;else{DS.h^=1;h=DS.h}DS.k[h]=1;gf.position.x=h?-.1:.1;
 if(pad&&DS.L!=DS.R)nf=t0+w.r*2*zfr()}
{const _fu=fpUpdate;fpUpdate=function(dt){const w=cw(),a=fpG.userData&&fpG.userData.a,u=fpG.userData&&fpG.userData.units;
  if(w&&w.dual&&a&&u){if(!a.b0)a.b0={r:a.r.slice(),l:a.l.slice()};for(let i=0;i<2;i++)DS.k[i]=Math.max(0,DS.k[i]-dt*8);
   const kr=DS.k[0],kl=DS.k[1];a.r=[a.b0.r[0],a.b0.r[1],a.b0.r[2]+kr*.04];a.l=[a.b0.l[0],a.b0.l[1],a.b0.l[2]+kl*.04];
   u[0].position.z=-kr*.04;u[1].position.z=-kl*.04;u[0].rotation.x=kr*.1;u[1].rotation.x=kl*.1}
  return _fu.apply(this,arguments)}}

/* ---------- reload sounds ----------
   Every gun reloads with its own sequence, built the way a real gun sounds: nothing here is a pitched tone or a sweep.
   A click or a clack is a burst of noise that excites a few ringing resonances of the material it hits (steel rings high and long, polymer is dull and short, brass casings tinkle, wood knocks).
   Sliding parts are rough filtered noise (stick and slip), drops are low thuds. Each weapon has its own parts, weight, material and order of events:
   a rocking AK magazine, a pistol slap, a revolver's cylinder and rattling casings, a pump's two-part rack, a bolt action, a drum winding, a belt box, a teapot lid and the pour.
   The player's reload follows the animation, bots and other players play the same sequence at their own distance, a little quieter. */
const FOL=(()=>{let nb=null,bus=null,last=-1,lastEv=0;const R=Math.random;
 const cx=()=>{ac=ac||new AudioContext();if(ac.state=='suspended'){try{ac.resume()}catch(e){}}return ac};
 const buf=()=>{if(nb)return nb;const c=cx(),b=c.createBuffer(1,c.sampleRate,c.sampleRate),a=b.getChannelData(0);for(let i=0;i<a.length;i++)a[i]=Math.random()*2-1;return nb=b};
 /* everything goes through a gentle bus: nothing below 70 Hz, nothing piercing above 6 kHz, a soft compressor so stacked hits never jump out */
 const out=()=>{const c=cx();if(bus&&bus.c===c)return bus.i;const hp=c.createBiquadFilter(),lp=c.createBiquadFilter(),g=c.createGain();hp.type='highpass';hp.frequency.value=70;lp.type='lowpass';lp.frequency.value=6200;lp.Q.value=.4;g.gain.value=.8;hp.connect(lp);lp.connect(g);g.connect(c.destination);bus={c,i:hp};return hp};
 /* one resonance: noise through a narrow filter with an instant attack and an exponential decay */
 const mode=(t,f,q,dec,v,type)=>{const c=cx(),s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=buf();s.loop=true;s.playbackRate.value=.8+R()*.4;fl.type=type||'bandpass';fl.frequency.value=f;fl.Q.value=q;
  g.gain.setValueAtTime(.0001,t);g.gain.linearRampToValueAtTime(Math.max(.0002,v*vol),t+.0008);g.gain.exponentialRampToValueAtTime(.0001,t+dec);s.connect(fl);fl.connect(g);g.connect(out());s.start(t,R()*.4);s.stop(t+dec+.03)};
 const MAT={steel:{f:[1500,2600,4300],q:[12,16,20],d:[.055,.04,.025],g:[1,.7,.4]},poly:{f:[700,1300,2100],q:[5,6,7],d:[.03,.022,.014],g:[1,.7,.4]},alloy:{f:[1100,2000,3400],q:[9,12,15],d:[.045,.03,.02],g:[1,.7,.4]},brass:{f:[3000,4400,5800],q:[20,24,28],d:[.07,.05,.035],g:[.8,.6,.4]},wood:{f:[380,720,1200],q:[4,5,6],d:[.04,.03,.02],g:[1,.6,.3]},cer:{f:[2000,3300,4800],q:[28,32,36],d:[.1,.07,.05],g:[1,.7,.5]}};
 const hit=(t,v,p,m)=>{const M=MAT[m||'steel'];mode(t,2500,.8,.004,v*.14,'highpass');mode(t,520*p,1.3,.035,v*.65,'bandpass');for(let i=0;i<3;i++)mode(t,M.f[i]*p*(.97+R()*.06),M.q[i],M.d[i],v*M.g[i]*(i?.8:1))};
 const thud=(t,v,p,d)=>{d=d||.09;mode(t,260*p,.7,d,v*1.1,'lowpass');mode(t,110*p,.6,d*1.4,v*.8,'lowpass')};
 /* a sliding part: rough band-limited noise whose level flutters (stick and slip) while the band moves */
 const scrape=(t,dur,f0,f1,q,v)=>{const c=cx(),s=c.createBufferSource(),fl=c.createBiquadFilter(),g=c.createGain();s.buffer=buf();s.loop=true;fl.type='bandpass';fl.Q.value=q;fl.frequency.setValueAtTime(f0,t);fl.frequency.linearRampToValueAtTime(f1,t+dur);
  const n=Math.max(8,Math.floor(dur*70)),cv=new Float32Array(n);for(let i=0;i<n;i++)cv[i]=Math.max(.0002,v*vol*(.35+.65*R())*Math.pow(Math.sin(Math.PI*Math.min(1,(i+1)/n)),.5));g.gain.setValueCurveAtTime(cv,t,dur);s.connect(fl);fl.connect(g);g.connect(out());s.start(t,R()*.4);s.stop(t+dur+.03)};
 /* the parts: (time, loudness, pitch, a, b) */
 const S={
  latch:(t,v,p,m)=>{hit(t,v*.8,p,m||'steel');hit(t+.017,v*.45,p*1.15,m||'steel')},
  tick:(t,v,p,m)=>hit(t,v*.6,p,m||'steel'),
  magOut:(t,v,p,d,m)=>{d=d||.14;scrape(t,d,900*p,1900*p,2.2,v*.5);hit(t+d*.9,v*.35,p,m||'steel')},
  magDrop:(t,v,p,m)=>{thud(t,v*.7,p,.08);hit(t+.03,v*.35,p*.85,m||'poly');thud(t+.12,v*.3,p*1.1,.06)},
  magIn:(t,v,p,d,m)=>{d=d||.1;scrape(t,d,1700*p,900*p,2.4,v*.45);hit(t+d,v*.9,p,m||'steel');thud(t+d,v*.5,p,.07)},
  seat:(t,v,p,m)=>{hit(t,v,p,m||'steel');thud(t,v*.7,p,.08)},
  bolt:(t,v,p,m)=>{scrape(t,.11,700*p,1600*p,2,v*.55);hit(t+.11,v*.55,p*.9,m||'steel');scrape(t+.19,.06,1600*p,900*p,2,v*.3);hit(t+.26,v*1.1,p*.8,m||'steel');thud(t+.26,v*.6,p,.09)},
  boltBack:(t,v,p)=>{scrape(t,.2,600*p,1500*p,1.8,v*.6);hit(t+.2,v*.7,p*.85)},
  boltFwd:(t,v,p)=>{scrape(t,.12,1500*p,700*p,1.8,v*.55);hit(t+.12,v*1.1,p*.75);thud(t+.12,v*.6,p,.09)},
  shell:(t,v,p)=>{hit(t,v*.5,p*1.05,'brass');hit(t+.025,v*.35,p,'steel');thud(t+.01,v*.25,p*1.3,.04)},
  pump:(t,v,p)=>{scrape(t,.15,500*p,1300*p,1.8,v*.7);hit(t+.15,v*.7,p*.8);scrape(t+.3,.13,1300*p,600*p,1.8,v*.65);hit(t+.43,v*1.2,p*.75);thud(t+.43,v*.8,p,.1)},
  rattle:(t,v,p,n)=>{for(let i=0;i<(n||6);i++)hit(t+i*.034+R()*.02,v*(.25+R()*.25),p*(.9+R()*.35),'brass')},
  ratchet:(t,v,p,n)=>{n=n||6;let x=t;for(let i=0;i<n;i++){hit(x,v*(.3+.08*(i%2)),p*(1+i*.02),'steel');x+=Math.max(.02,.046-i*.002)}},
  cyl:(t,v,p)=>{hit(t,v*.7,p*1.1);scrape(t+.03,.09,800*p,1500*p,2,v*.4);hit(t+.13,v*.5,p)},
  cylClose:(t,v,p)=>{scrape(t,.08,1500*p,800*p,2,v*.4);hit(t+.08,v*1.1,p*.9);thud(t+.08,v*.5,p,.07)},
  ping:(t,v,p)=>{mode(t,4300*p,60,.45,v*.5);mode(t,6500*p,70,.3,v*.25);hit(t,v*.3,p*1.2)},
  chain:(t,v,p)=>{for(let i=0;i<8;i++)hit(t+i*.04+R()*.015,v*(.2+R()*.2),p*(1+R()*.3),'alloy')},
  rocket:(t,v,p)=>{scrape(t,.34,300*p,900*p,1.5,v*.7);thud(t+.34,v*1.1,p*.7,.14);hit(t+.34,v*.5,p*.6)},
  hum:(t,v,p,d)=>{d=d||.3;scrape(t,d,150*p,170*p,5,v*.45);scrape(t,d,2400*p,1800*p,6,v*.08)},
  spool:(t,v,p,d)=>{scrape(t,d||.3,2600*p,900*p,1.2,v*.35)},
  pour:(t,v,p,d)=>{d=d||.5;scrape(t,d,1100*p,1700*p,1.4,v*.5);for(let i=0;i<10;i++)mode(t+R()*d,1500+R()*1800,16,.025,v*.18)},
  clink:(t,v,p)=>hit(t,v,p,'cer')};
 /* per-weapon sequences: [moment in the reload 0..1, part, loudness, pitch (small and bright high, big and dull low), then the part's own arguments] */
 const mag=(o)=>[[.1,'latch',.85*o.w,o.p*.98,o.m],[.27,'magOut',.8*o.w,o.p,o.d||.14,o.m],[.38,'magDrop',.85*o.w,o.p*1.02,o.m],[.66,'magIn',.8*o.w,o.p,.07,o.m],[.84,'seat',1.05*o.w,o.p*.95,o.m],[.93,o.bolt||'bolt',1*o.w,o.p*.9,o.bm||o.m]];
 const RFS={
  AR:[[.1,'latch',.95,.8],[.27,'magOut',.9,.8,.15],[.38,'magDrop',.9,.85],[.58,'tick',.55,.85],[.67,'magIn',.8,.8,.07],[.84,'seat',1.15,.74],[.92,'bolt',1.15,.72]],
  SMG:mag({p:1.3,w:.62,m:'poly',d:.1,bm:'alloy'}),
  BR:[[.1,'latch',1,.65],[.26,'magOut',1,.65,.2],[.35,'ping',.8,.9],[.42,'magDrop',1,.7],[.66,'magIn',1,.65,.1],[.84,'seat',1.3,.6],[.93,'bolt',1.3,.6]],
  MP:[[.12,'latch',.55,1.45,'poly'],[.3,'magOut',.5,1.45,.08,'poly'],[.4,'magDrop',.5,1.4,'poly'],[.66,'magIn',.55,1.4,.06,'poly'],[.82,'seat',.7,1.4,'poly'],[.92,'tick',.7,1.2,'alloy']],
  CT:[[.1,'latch',.8,1.05],[.28,'magOut',.5,1.1,.07],[.4,'magDrop',.6,1.1],[.64,'magIn',.6,1.1,.06],[.78,'seat',.9,1.05],[.9,'bolt',.75,1.1]],
  MG:[[.08,'cyl',1,.9],[.22,'tick',.8,1],[.27,'tick',.7,.95],[.31,'rattle',1,1.05,6],[.5,'rattle',.8,.95,6],[.62,'ratchet',.7,1,5],[.84,'cylClose',1.2,.85],[.93,'ratchet',.55,1.1,4]],
  SG:[[.9,'pump',1.1,1]],
  SN:[[.06,'latch',.9,.7],[.14,'boltBack',1,.7],[.34,'magOut',.8,.8,.12],[.46,'magDrop',.7,.8],[.66,'magIn',.9,.8,.09],[.8,'boltFwd',1.1,.7],[.9,'seat',.9,.7]],
  RL:[[.1,'latch',1.1,.65],[.26,'rocket',1,.8],[.6,'seat',1.2,.55],[.74,'cylClose',1.1,.6],[.9,'latch',1,.7]],
  RG:[[.1,'latch',.7,1,'alloy'],[.24,'hum',.8,1,.35],[.5,'tick',.6,.9,'alloy'],[.58,'seat',.8,1,'alloy'],[.78,'hum',.9,1.3,.3],[.93,'tick',.7,1.2,'alloy']],
  VMP:mag({p:1.05,w:.85,m:'alloy',bolt:'bolt'}),MVR:mag({p:.9,w:1,m:'steel'}),
  TUR:[[.1,'latch',.9,.9],[.24,'ratchet',.9,.8,9],[.4,'magOut',.7,.85,.12],[.62,'ratchet',.8,.85,10],[.84,'seat',1.1,.8],[.93,'bolt',1,.8]],
  TRB:[[.1,'latch',.8,1,'alloy'],[.26,'magOut',.7,1,.1,'alloy'],[.36,'spool',.6,.8,.3],[.62,'magIn',.7,1,.08,'alloy'],[.82,'seat',1,.95,'alloy'],[.9,'spool',.8,1.2,.3]],
  CY:[[.08,'latch',1.2,.6],[.24,'magOut',1,.6,.18],[.36,'magDrop',1,.65],[.52,'chain',.9,.9],[.7,'magIn',.9,.6,.12],[.84,'seat',1.3,.6],[.93,'bolt',1.3,.55]],
  TEA:[[.1,'clink',.8,.9],[.22,'pour',.9,.9,.5],[.5,'clink',.5,1.1],[.7,'pour',.6,1,.3],[.9,'clink',.9,.85]]};
 RFS.DS=[...mag({p:1.2,w:.6,m:'poly',d:.1,bm:'alloy'}),...mag({p:1.14,w:.58,m:'poly',d:.1,bm:'alloy'}).map(e=>[Math.min(.99,e[0]+.06),...e.slice(1)])];
 const play=(e,v,t)=>{const f=S[e[1]];if(f)f(t==null?cx().currentTime:t,.105*v*(e[2]||1)*(.88+R()*.24),(e[3]||1)*(.97+R()*.06),e[4],e[5])};
 return{
  /* the player's reload: sounds fire as the animation passes their moment; shotguns thumb a shell for every shell the animation loads */
  player(w,k,p,ev){const seq=RFS[k]||RFS.AR;if(p<last-.2||p<=.001)last=-1;
   if(k=='SG'){if(ev>lastEv)S.shell(cx().currentTime,.07*(.9+R()*.2),1);lastEv=ev}
   for(const e of seq)if(e[0]>last&&e[0]<=p)play(e,1);last=p},
  reset(){last=-1;lastEv=0},
  /* bots and other players */
  bot(b,w){try{const d=C.position.distanceTo(b.m?b.m.position:C.position),v=Math.max(0,1-d/38);if(v<.06)return;const dur=Math.max(.5,w.rl),t0=cx().currentTime;
   if(b.wk=='SG'){for(let i=0;i<3;i++)S.shell(t0+.3+i*dur*.2,.1*v,1);S.pump(t0+dur*.88,.15*v,1);return}
   for(const e of RFS[b.wk]||RFS.AR)play(e,v,t0+e[0]*dur)}catch(x){}},
  S};
})();

/* ---------- speed: fewer draw calls, no per-frame HUD rebuilds ----------
   1) Every person (bots, zombies, brutes) is built from dozens of small meshes, and each mesh is drawn twice (once for the shadow): hundreds of calls per character.
      LX.mergeRig fuses all the static pieces of each limb that share a material into ONE mesh (the limbs themselves stay separate groups, so every animation is untouched).
   2) The HUD wrote text and markup into the page every frame even when nothing had changed, which forces the browser to re-layout. Writes of an identical value are now skipped. */
LX.mergeRig=function(root,rig){try{if(!root||!root.isObject3D)return;const keep=new Set((rig&&rig.hip)||[]),nm=new THREE.Matrix3();
 const groups=[];root.traverse(n=>{if(n===root||(n.isObject3D&&!n.isMesh&&n.children&&n.children.length))groups.push(n)});
 for(const g of groups){const by=new Map();
  for(const c of g.children){if(!c.isMesh||!c.visible||keep.has(c)||c.userData.noMerge||!c.geometry||!c.geometry.attributes||!c.geometry.attributes.position||!c.geometry.attributes.normal||!c.geometry.attributes.uv||!c.material||Array.isArray(c.material))continue;
   const m0=c.material,mut=rig&&rig.mat&&Object.values(rig.mat).includes(m0),key=mut||!m0.color?m0:'c'+m0.color.getHex()+'|'+(m0.emissive?m0.emissive.getHex():0)+'|'+(m0.roughness||0)+'|'+(m0.metalness||0)+'|'+(m0.transparent?1:0)+'|'+m0.opacity+'|'+(m0.map?1:0)+(m0.type||'');let a=by.get(key);if(!a)by.set(key,a=[]);a.push(c)}
  for(const[key,list]of by){if(list.length<2)continue;const m=list[0].material;let nv=0,ni=0;for(const c of list){nv+=c.geometry.attributes.position.count;ni+=c.geometry.index?c.geometry.index.count:c.geometry.attributes.position.count}
   const P=new Float32Array(nv*3),N=new Float32Array(nv*3),U=new Float32Array(nv*2),I=nv>65000?new Uint32Array(ni):new Uint16Array(ni);let vo=0,io=0;const v=new THREE.Vector3();
   for(const c of list){c.updateMatrix();const gm=c.geometry,pa=gm.attributes.position,na=gm.attributes.normal,ua=gm.attributes.uv;nm.getNormalMatrix(c.matrix);
    for(let i=0;i<pa.count;i++){v.set(pa.getX(i),pa.getY(i),pa.getZ(i)).applyMatrix4(c.matrix);P[(vo+i)*3]=v.x;P[(vo+i)*3+1]=v.y;P[(vo+i)*3+2]=v.z;v.set(na.getX(i),na.getY(i),na.getZ(i)).applyMatrix3(nm).normalize();N[(vo+i)*3]=v.x;N[(vo+i)*3+1]=v.y;N[(vo+i)*3+2]=v.z;U[(vo+i)*2]=ua.getX(i);U[(vo+i)*2+1]=ua.getY(i)}
    if(gm.index){for(let i=0;i<gm.index.count;i++)I[io++]=gm.index.getX(i)+vo}else for(let i=0;i<pa.count;i++)I[io++]=vo+i;vo+=pa.count}
   const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.BufferAttribute(P,3));geo.setAttribute('normal',new THREE.BufferAttribute(N,3));geo.setAttribute('uv',new THREE.BufferAttribute(U,2));geo.setIndex(new THREE.BufferAttribute(I,1));
   const me=new THREE.Mesh(geo,m);me.castShadow=list[0].castShadow;me.receiveShadow=list[0].receiveShadow;me.userData.merged=1;me.frustumCulled=false;
   for(const c of list)g.remove(c);g.add(me)}}}catch(e){try{console.warn('mergeRig skipped',e)}catch(x){}}};
/* characters far away stop casting shadows (their shadow is a few pixels): the flag is refreshed a few times a second */
LX.shadowLOD=function(list,t){if(t-(LX.slT||0)<.3)return;LX.slT=t;const p=C.position;for(const b of list){if(!b.m)continue;const d=Math.hypot(b.x-p.x,b.z-p.z),on=d<26;if(b._sc!==on){b._sc=on;b.m.traverse(o=>{if(o.isMesh&&o.userData.merged!==2)o.castShadow=on})}}};
{const td=Object.getOwnPropertyDescriptor(Node.prototype,'textContent'),ih=Object.getOwnPropertyDescriptor(Element.prototype,'innerHTML'),hud=e=>e.closest&&e.closest('#hud,#zh,#bars,#kst');
 Object.defineProperty(Node.prototype,'textContent',{configurable:true,enumerable:td.enumerable,get:td.get,set(v){if(this.nodeType==1&&hud(this)&&td.get.call(this)===String(v))return;td.set.call(this,v)}});
 Object.defineProperty(Element.prototype,'innerHTML',{configurable:true,enumerable:ih.enumerable,get:ih.get,set(v){if(hud(this)&&this.__ih===v&&this.childNodes.length===this.__ic)return;ih.set.call(this,v);this.__ih=v;this.__ic=this.childNodes.length}})}

{const _t=LX.tick;LX.tick=function(dt){_t.call(this,dt);if(typeof bots!='undefined'&&bots.length)LX.shadowLOD(bots,performance.now()/1000)}}

/* ---------- one model per weapon, everywhere ----------
   The KN-115, VMP-X and RayGun you hold in first person are hand-built; bots, other players, the loadout screen and the wall drawings used a different, simpler model.
   Now every one of those places builds a copy of the first-person model, turned to face forward (+z) with the matching hand positions. */
{const cp=o=>{const n=o.isMesh?new THREE.Mesh(o.geometry,o.material):new THREE.Group();n.position.copy(o.position);n.rotation.copy(o.rotation);n.scale.copy(o.scale);n.visible=o.visible;n.castShadow=o.castShadow;n.receiveShadow=o.receiveShadow;for(const c of o.children)n.add(cp(c));return n};
 /* hand positions from FPA, mirrored into the forward-facing model space (x and z flip) */
 const AN={AR:{r:[0,-.115,.14],l:[0,-.075,.62],m:[0,-.2,.32]},VMP:{r:[0,-.1,.08],l:[0,-.06,.38],m:[0,-.2,.15]},RG:{r:[0,-.095,-.08],l:[.02,-.15,-.09],m:[0,-.14,0]}};
 for(const k of['AR','VMP','RG'])MODELS[k]=function(g,rm){const src=k=='AR'?knG:k=='VMP'?vmpG:rgG,A0=[],A1=[];src.traverse(o=>A0.push(o));const c=cp(src);c.traverse(o=>A1.push(o));c.visible=true;
  const mags=(src.userData.mag||[]).map(m=>A1[A0.indexOf(m)]).filter(Boolean),w=new THREE.Group();w.add(c);w.rotation.y=Math.PI;g.add(w);
  g.userData.a=JSON.parse(JSON.stringify(AN[k]));g.userData.mags=mags;if(src.userData.sight)g.userData.sight=src.userData.sight;return g}}

/* bots can use every multiplayer weapon (the sniper, the rocket launcher and the Twin SMG joined the pool; Zombies-only weapons never do) */
for(const k of['SN','RL','DS'])if(!BOTGUNS.includes(k))BOTGUNS.push(k);

/* ===================== three Call of Duty staples =====================
   1  GUN GAME     a new mode: every kill hands you the next weapon, 14 rungs from pistol to Magnum, first to clear the ladder wins
   2  CLAYMORE     lethal equipment: a mine with a laser fan that goes off when an enemy walks in front of it (2 mines, max 4 down)
   3  SMOKE GRENADE equipment: a thick smoke screen for 14 seconds; bots cannot see through it, bullets still pass
   Claymore and Smoke appear in the loadout's lethal slot (E), Gun Game in the mode list. */
const GG={on:0,i:0,lad:['CT','MP','SMG','DS','VMP','AR','TRB','MVR','TUR','BR','SG','CY','SN','MG']};
MODES['Gun Game']='Every kill gives you the next weapon: 14 of them, from a pistol to the Magnum. Finish the ladder to win. Bots fight with their own guns.';
GR.Claymore={fuse:0,R:5.5,d:140,imp:0,mine:1,t:'Place it on the ground: a laser fan sets it off when an enemy walks into it. 2 mines, 4 down at once'};
GR.Smoke={fuse:1.3,R:0,d:0,imp:0,smoke:1,t:'Bursts into a thick smoke screen for 14 seconds. Bots cannot see through it. 2 grenades'};
UNL.Claymore=20;UNL.Smoke=8;
function ggGive(){const k=GG.lad[Math.min(GG.i,GG.lad.length-1)],w={k,...eff(k,[])};w.mag=w.m;w.rs=3;w.res=w.m*3;wp=[w];cur=0;rel=0;MV.eq=0;setGun();$('#ob').textContent=`GUN GAME  ·  weapon ${GG.i+1} / ${GG.lad.length}  ·  ${W[k].n}`}
{const _s=startGame;startGame=function(){const gg=sel.mode=='Gun Game';if(gg)sel.mode='Slayer';/* Gun Game runs on the Slayer rules (spawns, bots, respawns) with the ladder on top */try{_s.apply(this,arguments)}finally{if(gg)sel.mode='Gun Game'}
  GG.on=gg?1:0;CLAY.splice(0).forEach(c=>S.remove(c.g));SMK.splice(0).forEach(s=>s.sp.forEach(p=>S.remove(p)));if(!GG.on)return;GG.i=0;gc=0;ggGive();popup('GUN GAME','Every kill gives you the next weapon. Clear all 14 to win')}}
{const _fk=featKill;featKill=function(){_fk.apply(this,arguments);if(!GG.on||over)return;GG.i++;if(GG.i>=GG.lad.length){endGame('Victory');return}ggGive();popup('WEAPON '+(GG.i+1)+' / '+GG.lad.length,W[GG.lad[GG.i]].n);beep(660,.1,'triangle',.07);setTimeout(()=>beep(990,.15,'triangle',.07),90)}}
{const _rs=respawn;respawn=function(){const r=_rs.apply(this,arguments);if(GG.on)ggGive();return r}}
/* ---- claymores ---- */
const CLAY=[],SMK=[];
function clayPlace(){if(P.dead||gc<=0)return;if(CLAY.filter(c=>!c.dead).length>=4){msg('Four claymores are already down',1.2);return}gc--;const d=aimDir(),yaw=Math.atan2(d.x,d.z),x=P.x+d.x*1.1,z=P.z+d.z*1.1,y=P.y||0,g=new THREE.Group(),
  olive=new THREE.MeshLambertMaterial({color:0x4d5a34}),dk=new THREE.MeshLambertMaterial({color:0x1b1f14}),led=new THREE.MeshBasicMaterial({color:0xff2a1a}),grey=new THREE.MeshLambertMaterial({color:0x9aa09a}),add=(geo,mat,px,py,pz,sx,sy,sz,rx)=>{const m=new THREE.Mesh(geo,mat);m.position.set(px,py,pz);m.scale.set(sx,sy,sz);if(rx)m.rotation.x=rx;g.add(m);return m};
  add(bg,olive,0,.1,0,.36,.11,.05);add(bg,olive,-.13,.1,.03,.11,.11,.05).rotation.y=.35;add(bg,olive,.13,.1,.03,.11,.11,.05).rotation.y=-.35;add(bg,dk,0,.105,.03,.3,.06,.012);add(bg,grey,0,.16,-.005,.12,.014,.045);add(bg,dk,0,.17,.02,.05,.01,.012);
  for(const sx of[-.15,.15]){const l=add(bg,dk,sx,.04,-.01,.012,.09,.012,.4);l.rotation.z=sx>0?.25:-.25}const lamp=add(sg,led,.0,.152,-.02,.02,.02,.02);
  g.position.set(x,y,z);g.rotation.y=yaw;S.add(g);const fan=[];for(const a of[-.45,0,.45]){const f=new THREE.Mesh(new THREE.PlaneGeometry(.015,5.2),new THREE.MeshBasicMaterial({color:0xff2a1a,transparent:true,opacity:0,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide}));f.rotation.x=-Math.PI/2;f.rotation.z=a;f.position.set(Math.sin(a)*-2.6*-1,.1,2.6*Math.cos(a));f.position.x=Math.sin(a)*2.6;g.add(f);fan.push(f)}
  CLAY.push({g,x,y,z,yaw,t:0,lamp,led,fan,dead:0,own:1});beep(300,.08,'square',.05);setTimeout(()=>beep(450,.08,'square',.05),110);msg('Claymore down · '+gc+' left',1.2)}
function clayTick(dt,t){for(let i=CLAY.length-1;i>=0;i--){const c=CLAY[i];c.t+=dt;const armed=c.t>1.6;c.led.color.setRGB(armed?(Math.sin(c.t*5)>.6?2.6:.35):(Math.sin(c.t*20)>0?2.4:.2),.1,.08);for(const f of c.fan)f.material.opacity=armed?.35+.15*Math.sin(t*8):0;if(c.t<1.6&&Math.floor(c.t*4)!=Math.floor((c.t-dt)*4))beep(500+c.t*200,.03,'square',.03);
   if(!armed)continue;for(const b of bots){if(!b.al||b.net||b.zom||(typeof ally=='function'&&ally(b)))continue;const dx=b.x-c.x,dz=b.z-c.z,dd=Math.hypot(dx,dz);if(dd>5.2||dd<.3||Math.abs((b.y||0)-c.y)>2)continue;let da=Math.atan2(dx,dz)-c.yaw;da=Math.atan2(Math.sin(da),Math.cos(da));if(Math.abs(da)<.62){clayBlow(c,i);break}}}}
function clayBlow(c,i){c.dead=1;S.remove(c.g);CLAY.splice(i,1);boom(V(c.x,c.y+.3,c.z),{R:5.5,d:140,imp:0,c:0xffa040});beep(120,.2,'sawtooth',.1);burst(V(c.x,c.y+.3,c.z),30,0xffd890,9,.6,.12)}
/* ---- smoke ---- */
function smokeBurst(p){beep(180,.5,'sawtooth',.06);noise(.7,900,.35);if(SMK.length>=3){const o=SMK.shift();o.sp.forEach(q=>S.remove(q))}const tex=JX.h.puffTex,sp=[];for(let i=0;i<26;i++){const m=new THREE.SpriteMaterial({map:tex,transparent:true,depthWrite:false,opacity:0,color:0xc4c8cc}),s=new THREE.Sprite(m);s.position.set(p.x,Math.max(.4,p.y)+.3,p.z);s.userData={a:Math.random()*6.28,r:Math.random(),h:Math.random(),sp:.4+Math.random()*.9,sz:2.2+Math.random()*2.2};s.scale.setScalar(.5);S.add(s);sp.push(s)}SMK.push({x:p.x,y:Math.max(0,p.y),z:p.z,t:0,life:14,r:0,sp})}
function smokeTick(dt){for(let i=SMK.length-1;i>=0;i--){const s=SMK[i];s.t+=dt;const g=Math.min(1,s.t/2.2),fade=s.t>s.life-3?Math.max(0,(s.life-s.t)/3):1;s.r=4.4*(1-Math.pow(1-g,2))*(fade>0?1:0);
   for(const q of s.sp){const u=q.userData;u.a+=dt*.12*u.sp;const rr=s.r*(.25+.75*u.r);q.position.set(s.x+Math.cos(u.a)*rr,s.y+.6+u.h*3.2*g+Math.sin(s.t*.5+u.a)*.15,s.z+Math.sin(u.a)*rr);q.scale.setScalar(u.sz*(.5+.5*g)*1.5);q.material.opacity=.62*fade*Math.min(1,s.t/.5)}
   if(s.t>=s.life){s.sp.forEach(q=>{S.remove(q);q.material.dispose()});SMK.splice(i,1)}}}
/* bots cannot see through smoke: while the bots think, a ray that crosses a smoke cloud ends there as if it hit a wall (the player's bullets are not affected) */
let BOTPASS=0;{const _ub=updBots;updBots=function(){BOTPASS=1;try{return _ub.apply(this,arguments)}finally{BOTPASS=0}};
 const _cw=castW;castW=function(o,d,max){let r=_cw.apply(this,arguments);if(BOTPASS&&SMK.length)for(const s of SMK){if(s.r<1)continue;const ox=o.x-s.x,oy=o.y-(s.y+1.4),oz=o.z-s.z,b=ox*d.x+oy*d.y+oz*d.z,c=ox*ox+oy*oy+oz*oz-s.r*s.r*.8,h=b*b-c;if(h<0)continue;const tt=-b-Math.sqrt(h);if(tt<r&&(tt>0||c<0))r=Math.max(0,tt)}return r}}
{const _t=LX.tick;LX.tick=function(dt){_t.call(this,dt);if(run&&!paused){const t=performance.now()/1000;if(CLAY.length)clayTick(dt,t);if(SMK.length)smokeTick(dt)}}}

/* ===================== Call of Duty map tuning (each map keeps its own layout) =====================
   The rules the Call of Duty map designers describe, applied to what each map already is rather than to a template:
   simplicity (loose clutter is thinned out; structures, stairs and walls are never touched), cover in PAIRS on both sides of every objective so fights are head-on,
   a spawn shield in front of each team's base so the base is never in view from the far side of the map, and a measured check that no point on the map sees most of the rest.
   Every number comes from the map's own flags, zones and boxes. */
const MAPTUNE={Blockfort:{thin:4},Pillars:{thin:2},Canyon:{thin:4,wings:1},Suburbia:{thin:2},Boomtown:{thin:1},Rust:{thin:3,axis:'z',wings:1},Decay:{thin:5}};
function mapTune(name,cfg){const M=MAPS[name];if(!M||M.zm)return;const ob=M.b,od=M.deco;
 M.b=function(){const L=ob.call(this),rm=M._rm=[],top=L.filter(e=>e[4]>2.6&&(e[5]||0)<.5&&e[7]!='n'),touch=(e)=>{for(const t of top){if(Math.abs(e[0]-t[0])<(e[2]+t[2])/2+.7&&Math.abs(e[1]-t[1])<(e[3]+t[3])/2+.7)return true}return false};
  const out=[];let i=0;
  for(const e of L){const loose=e[4]<2.4&&e[4]>.3&&(e[5]||0)<.4&&Math.max(e[2],e[3])<5.6&&e[7]!='n'&&Math.abs(e[0])<M.H-2&&Math.abs(e[1])<M.H-2;
   if(loose&&cfg.thin>1&&!touch(e)){i++;if(i%cfg.thin!=0){rm.push([e[0]-e[2]/2-.25,e[1]-e[3]/2-.25,e[0]+e[2]/2+.25,e[1]+e[3]/2+.25]);continue}}out.push(e)}
  /* the map's own cover palette: the most common colour and surface among its low pieces, and among its walls */
  const mode=(f)=>{const c={};let best=null,n=0;for(const e of out){if(!f(e))continue;const k=e[6]+'|'+e[7];c[k]=(c[k]||0)+1;if(c[k]>n){n=c[k];best=e}}return best?[best[6],best[7]]:[0x777777,undefined]},cov=mode(e=>e[4]>.9&&e[4]<1.8&&Math.max(e[2],e[3])<4.6&&(e[5]||0)<.4),wal=mode(e=>e[4]>2.6&&e[4]<12&&(e[5]||0)<.4);
  const free=(x,z,w,d,m,ex)=>{if(Math.abs(x)>M.H-3||Math.abs(z)>M.H-3)return false;ex=ex==null?2.6:ex;for(const p of[...M.zn,...M.fb])if(Math.abs(x-p[0])<w/2+ex&&Math.abs(z-p[1])<d/2+ex)return false;for(const e of out){if(e[7]=='n'||(e[5]||0)>2.2)continue;if(e[4]<.3)continue;if(Math.abs(x-e[0])<(w+e[2])/2+m&&Math.abs(z-e[1])<(d+e[3])/2+m)return false}return true};
  const zax=cfg.axis=='z',add=(x,z,w,d,h,c,m,ex)=>{if(!free(x,z,w,d,m==null?.9:m,ex))return false;out.push([x,z,w,d,h,0,c[0],c[1]]);return true};
  /* paired cover at every Domination point: two pieces either side of the line between the teams, on both its sides */
  for(const[zx,zz]of M.zn)for(const s of[-1,1])for(const t of[-1,1]){const dx=zax?t*4.6:s*4.2,dz=zax?s*4.2:t*4.6;add(zx+dx,zz+dz,zax?1.2:2.5,zax?2.5:1.2,1.25,cov)}
  /* spawn shields: a wall between each team's base and the middle of the map, wide enough to break the line down the centre */
  for(const f of M.fb){const L_=Math.hypot(f[0],f[1])||1,vx=-f[0]/L_,vz=-f[1]/L_,qx=zax?1:0,qz=zax?0:1;let ok=false,sx_=0,sz_=0;for(const k of[6.5,5,8,4.2,9.5,3.4,11,13])for(const l of[0,3.2,-3.2,6,-6,9,-9]){if(ok)break;sx_=f[0]+vx*k+qx*l;sz_=f[1]+vz*k+qz*l;ok=add(sx_,sz_,zax?6.5:1.2,zax?1.2:6.5,3.1,wal,.45,1.9)}(M._tune=M._tune||[]).push(ok);
   /* open maps get wings: two shorter walls either side, a shallow U that closes the base off from the long sightlines */
   if(ok&&cfg.wings)for(const s of[-1,1])add(sx_+vx*2.2+qx*s*6.8,sz_+vz*2.2+qz*s*6.8,zax?4.6:1.2,zax?1.2:4.6,2.8,wal,.45,1.9)}
  /* drop the decorations that stood on thinned pieces */
  if(M._v)M._v=M._v.filter(e=>!(e[4]<2.3&&(e[5]||0)<.6&&rm.some(r=>e[0]>r[0]&&e[0]<r[2]&&e[1]>r[1]&&e[1]<r[3])));
  return out};
 M.deco=function(){const d=od?od.call(this):[],rm=M._rm||[];return d.filter(e=>!(e[4]<2.3&&(e[5]||0)<.6&&rm.some(r=>e[0]>r[0]&&e[0]<r[2]&&e[1]>r[1]&&e[1]<r[3])))}}
for(const k in MAPTUNE)mapTune(k,MAPTUNE[k]);
