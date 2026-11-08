/* ######## gfx.js ######## */
/* ===================== gfx.js ===================== */
/* ---------- graphics: PBR materials, procedural textures, merged level geometry with baked contact shading, shadows, animated sky, window facades, flickering lights.
   Textures, materials, the environment map and post-processing come from lumen.js (LX).
   Map boxes are [x,z,w,d,h,y0,colour,kind]: kind is a texture (brick stucco plank concrete asphalt grass shingle tile metal sand rust cobble), 'glass' / 'glow', or 'n' for collision only.
   Visual-only extras (map._v and map.deco) are [x,z,w,d,h,y0,colour,shape,texture] with shape b box, e glow box, g glass box, s sphere, c cylinder, k cone. ---------- */
let gfxQ=LX.q,skyM=null,skyC=null,gfxL=[],gt_=0;
R.shadowMap.enabled=true;R.shadowMap.type=THREE.PCFShadowMap;
const SHMAX=(()=>{try{return R.capabilities.maxTextureSize||2048}catch(e){return 2048}})(),SHS=2048;
sun.shadow.mapSize.set(SHS,SHS);{const k=sun.shadow.camera;k.left=k.bottom=-46;k.right=k.top=46;k.near=1;k.far=150}sun.shadow.bias=-.0004;sun.shadow.normalBias=.04;S.add(sun.target);
function setGfx(q){gfxQ=q;LX.setQuality(q);sun.castShadow=q!='low'}setGfx(gfxQ);
/* the shadow texel in world units (used to keep shadow edges from shimmering) */
const SH_TEXEL=92/SHS;

/* ---------- surfaces ---------- */
const TS={brick:2.4,stucco:3,plank:1.6,concrete:3,asphalt:4,grass:4,shingle:1.8,tile:2,metal:2,sand:3.2,rust:2,cobble:2.2};
function gTex(kind){return LX.tex(kind).map}
/* normal strength per kind and metalness for the metallic ones */
const KP={brick:[1.5,0],stucco:[.8,0],plank:[1,0],concrete:[.95,0],asphalt:[1,0],grass:[.7,0],shingle:[1.2,0],tile:[.6,.05],metal:[.7,.8],sand:[.7,0],rust:[1,.5],cobble:[1.5,0]};
const GM={};
function gMat(kind,col){const k=kind+col;if(GM[k])return GM[k];let m;
 if(!LX.pbr){m=kind=='glow'?new THREE.MeshBasicMaterial({color:col}):kind=='glass'||kind=='glassL'?new THREE.MeshLambertMaterial({color:col,emissive:0x0a1626}):kind=='flat'||kind=='foliage'?new THREE.MeshLambertMaterial({color:col}):new THREE.MeshLambertMaterial({color:col,map:gTex(kind),vertexColors:true})}
 else{const S_=THREE.MeshStandardMaterial;
  if(kind=='glow')m=LX.patch(new S_({color:0x111111,emissive:col,emissiveIntensity:2.6,roughness:.5,metalness:0}));
  else if(kind=='glass')m=LX.patch(new S_({color:col,emissive:0x0a1626,emissiveIntensity:.7,metalness:.9,roughness:.05,envMapIntensity:2,transparent:true,opacity:.7}));
  else if(kind=='glassL')m=LX.patch(new S_({color:0x2a2418,emissive:col,emissiveIntensity:1.9,metalness:.2,roughness:.12,envMapIntensity:1.2}));
  else if(kind=='flat')m=LX.patch(new S_({color:col,roughness:.78,metalness:.02,envMapIntensity:.6}));
  else if(kind=='foliage')m=LX.patch(new S_({color:col,roughness:.72,metalness:0,envMapIntensity:.5}),{sway:true});
  else{const t=LX.tex(kind),p=KP[kind]||[1,0];m=LX.patch(new S_({color:col,map:t.map,normalMap:t.normalMap,roughnessMap:t.roughnessMap,roughness:1,metalness:p[1],normalScale:new THREE.Vector2(p[0],p[0]),vertexColors:true,envMapIntensity:.75}),{macro:true})}}
 return GM[k]=m}
function texKind(w,d,h,y0,col){const c=new THREE.Color(col),lum=c.r*.3+c.g*.59+c.b*.11,t=h-y0,th=Math.min(w,d);
 if(t<.3)return c.g>c.r*1.1&&c.g>c.b*1.1?'grass':lum<.32?'asphalt':'concrete';
 if(y0>=2.5&&t<1.6)return 'shingle';if(h>3.2&&th<2)return 'brick';
 if(c.r>c.g*1.05&&c.g>c.b*1.1&&lum<.55)return 'plank';if(t<=1.8&&th<.5)return 'plank';
 if(h>=2.2)return lum>.5?'stucco':'brick';return 'concrete'}
/* box with tiled UVs and baked contact shading, appended to a merged geometry accumulator.
   ao = world height of the box's base: side vertices darken toward it (a cheap stand-in for ambient occlusion where a wall meets the ground or a ledge) */
function addBox(a,x,yc,z,sx,sy,sz,ts,ao){const hx=sx/2,hy=sy/2,hz=sz/2,F=[[[0,1,0],[[-hx,hy,-hz],[-hx,hy,hz],[hx,hy,hz],[hx,hy,-hz]],sx,sz,1],[[0,-1,0],[[-hx,-hy,hz],[-hx,-hy,-hz],[hx,-hy,-hz],[hx,-hy,hz]],sx,sz,.5],[[0,0,1],[[-hx,-hy,hz],[hx,-hy,hz],[hx,hy,hz],[-hx,hy,hz]],sx,sy,.93],[[0,0,-1],[[hx,-hy,-hz],[-hx,-hy,-hz],[-hx,hy,-hz],[hx,hy,-hz]],sx,sy,.86],[[1,0,0],[[hx,-hy,hz],[hx,-hy,-hz],[hx,hy,-hz],[hx,hy,hz]],sz,sy,.96],[[-1,0,0],[[-hx,-hy,-hz],[-hx,-hy,hz],[-hx,hy,hz],[-hx,hy,-hz]],sz,sy,.88]],
 tint=.94+Math.random()*.1,c=a.c;
 for(const[n,vs,w,h,fs]of F){const b=a.p.length/3,side=n[1]==0;for(let i=0;i<4;i++){a.p.push(x+vs[i][0],yc+vs[i][1],z+vs[i][2]);a.n.push(n[0],n[1],n[2]);
   let v=fs*tint;if(ao!=null&&side){const q=Math.min(1,Math.max(0,(yc+vs[i][1]-ao)/1.4));v=fs*tint*(.55+.45*q*q*(3-2*q))}
   c.push(v,v,v)}
  a.u.push(0,0,w/ts,0,w/ts,h/ts,0,h/ts);a.i.push(b,b+1,b+2,b,b+2,b+3)}}
const cyHi=new THREE.CylinderGeometry(1,1,1,20),coHi=new THREE.ConeGeometry(1,1,20),sgHi=new THREE.SphereGeometry(1,20,14);
/* lumpy tree crowns: a few variants of a noisy sphere with smooth radial normals */
const leafG=[0,1,2].map(i=>{const g=new THREE.SphereGeometry(1,18,13),p=g.attributes.position,n=g.attributes.normal;let sd=i*977+5;const r=()=>(sd=(sd*16807)%2147483647)/2147483647,ph=[r()*6,r()*6,r()*6,r()*6];
 for(let k=0;k<p.count;k++){const x=p.getX(k),y=p.getY(k),z=p.getZ(k),l=1+.17*(Math.sin(x*3.1+ph[0])*Math.cos(z*2.7+ph[1])+.6*Math.sin(y*4.3+x*2+ph[2])+.4*Math.sin(z*5.7+y*3+ph[3]))*.7,L=Math.hypot(x,y,z)||1;p.setXYZ(k,x*l,y*l,z*l);n.setXYZ(k,x/L,y/L,z/L)}
 p.needsUpdate=true;n.needsUpdate=true;return g});
const isLeaf=col=>{const c=new THREE.Color(col);return c.g>c.r*1.06&&c.g>c.b*1.12};
function gfxVis(e,acc){const[x,z,w,d,h,y0=0,col,sh,tex]=e,t=h-y0,yc=(h+y0)/2;
 if(!sh||sh=='b'){const k=tex||texKind(w,d,h,y0,col);addBox(acc(k+col,gMat(k,col)),x,yc,z,w,t,d,TS[k]||2,y0)}
 else if(sh=='e')addBox(acc('glow'+col,gMat('glow',col)),x,yc,z,w,t,d,1);
 else if(sh=='g')addBox(acc('glass'+col,gMat('glass',col)),x,yc,z,w,t,d,1);
 else{const leaf=sh!='c'&&isLeaf(col),geo=sh=='s'?(leaf&&LX.pbr?leafG[(Math.abs(x*7+z*3)|0)%3]:sgHi):sh=='c'?cyHi:coHi,m=new THREE.Mesh(geo,gMat(leaf?'foliage':'flat',col));m.scale.set(w/2,sh=='s'?t/2:t,d/2);m.position.set(x,sh=='s'?yc:y0+t/2,z);if(sh=='s'&&leaf)m.rotation.y=(x*1.7+z)%6.28;m.castShadow=true;m.receiveShadow=true;mapG.add(m)}}
/* windows, frames, sills and a cornice on every tall building of maps flagged facade; on night and dusk maps a share of the windows are lit */
function facade(list,acc){const lp={'Hollow Estate':.4,London:.35,Canyon:.18,Decay:.16,Boomtown:.1}[sel.map]||0,gl=acc('fw',gMat('glass',0x2a3a4a)),gL=acc('fwl',gMat('glassL',0xffb14a)),fr=acc('ff',gMat('plank',0xe8e4d8)),co=acc('fc',gMat('concrete',0x55524c)),sl=acc('fs',gMat('concrete',0x8a867c));
 for(const[x,z,w,d,h,y0,col,kind]of list){if(kind=='n'||(y0||0)>0||h<2.4||w<3.5||d<3.5||h>14)continue;const rows=h>5.2?2:1;
  for(const sd of[[1,0],[-1,0],[0,1],[0,-1]]){const L=sd[0]?d:w,n=Math.max(1,Math.floor(L/3.2));for(let i=0;i<n;i++){const t=((i+.5)/n-.5)*L;for(let r=0;r<rows;r++){const yy=1.9+r*2.5;if(yy+.7>h-.3)continue;
    const cx=sd[0]?x+sd[0]*(w/2+.03):x+t,cz=sd[1]?z+sd[1]*(d/2+.03):z+t,lit=Math.random()<lp;addBox(lit?gL:gl,cx,yy,cz,sd[0]?.06:1.2,1.4,sd[0]?1.2:.06,1);addBox(fr,cx,yy,cz,sd[0]?.04:1.45,1.65,sd[0]?1.45:.04,1.6);
    addBox(sl,sd[0]?x+sd[0]*(w/2+.12):cx,yy-.88,sd[1]?z+sd[1]*(d/2+.12):cz,sd[0]?.28:1.7,.1,sd[0]?1.7:.28,1.2)}}}
  addBox(co,x,h+.15,z,w+.5,.3,d+.5,3,h)}}

/* free GPU memory of a map that is being replaced (materials are cached and shared, geometry and sky textures are not) */
function gfxDispose(g){try{g.traverse(o=>{if(o.geometry&&o.geometry!==sg&&o.geometry!==bg&&o.geometry!==sgHi&&o.geometry!==cyHi&&o.geometry!==coHi&&!leafG.includes(o.geometry))o.geometry.dispose();
 const m=o.material;if(m&&skyM&&(m===skyM.material||(skyC&&m===skyC.material))){if(m.map)m.map.dispose();m.dispose()}});}catch(e){}}
/* build everything visible for a map: ground, sky, merged textured boxes, extras, lights */
function gfxMap(M,list){
 const fx=LX.setMap(sel.map);
 hemi.intensity=(M.hemi||.85)*(LX.pbr?.55:1);hemi.color.setHex(M.hemiC||0xffffff);hemi.groundColor.setHex(M.hemiG||0x445566);sun.intensity=(M.sunI==null?.7:M.sunI)*(LX.pbr?1.2:1);sun.color.setHex(M.sunC||0xffffff);
 const gk=M.gt||(M.skyk=='night'?'concrete':'grass'),gs=TS[gk]||4,GS=H*2+(M.open?360:0);let gm;
 if(LX.pbr){const t=LX.texRep(gk,GS/gs,GS/gs);gm=LX.patch(new THREE.MeshStandardMaterial({color:M.gr,map:t.map,normalMap:t.normalMap,roughnessMap:t.roughnessMap,roughness:1,metalness:0,normalScale:new THREE.Vector2(.9,.9),envMapIntensity:.5}),{macro:true})}
 else{const gt=gTex(gk).clone();gt.needsUpdate=true;gt.repeat.set(GS/gs,GS/gs);gm=new THREE.MeshLambertMaterial({color:M.gr,map:gt})}
 const f=new THREE.Mesh(new THREE.PlaneGeometry(GS,GS),gm);f.rotation.x=-Math.PI/2;f.receiveShadow=true;mapG.add(f);
 gfxSky(M);
 const accs={},acc=(key,mat)=>accs[key]||(accs[key]={mat,p:[],n:[],u:[],i:[],c:[]});
 for(const e of list){const[x,z,w,d,h,y0=0,col,kind]=e;if(kind=='n')continue;const c=col==null?new THREE.Color(M.bc).offsetHSL(0,0,(h-2)*.025).getHex():col;
  if(kind=='glass'||kind=='glow'){addBox(acc(kind+c,gMat(kind,c)),x,(h+y0)/2,z,w,h-y0,d,1);continue}const k=kind||texKind(w,d,h,y0,c);addBox(acc(k+c,gMat(k,c)),x,(h+y0)/2,z,w,h-y0,d,TS[k]||2,y0)}
 /* terrain (dunes, hills, rock mounds) is scenery only and has no collision, so it must never reach into the playable area: any big landform whose footprint overlaps the arena bounds is pushed out past the fence, or dropped if it cannot be moved */
 const tclip=e=>{const tb=M.tb;if(!tb||!e||e[7]!='s')return e;let[x,z,w,d,h,y0=0]=e;if(Math.max(w,d)<9||y0>0)return e;const mg=3,L=tb[0]-mg,Rr=tb[2]+mg,T=tb[1]-mg,Bm=tb[3]+mg;
  const pl=(x+w/2)-L,pr=Rr-(x-w/2),pt=(z+d/2)-T,pb=Bm-(z-d/2);if(pl<=0||pr<=0||pt<=0||pb<=0)return e;
  const m=Math.min(pl,pr,pt,pb),o=e.slice();if(m==pl)o[0]=x-pl;else if(m==pr)o[0]=x+pr;else if(m==pt)o[1]=z-pt;else o[1]=z+pb;return o};
 for(const e of M._v||[])gfxVis(tclip(e),acc);if(M.deco)for(const e of M.deco())gfxVis(tclip(e),acc);if(M.facade)facade(list,acc);
 if(!M.open)for(const[x,z,w,d]of[[0,-H-1,2*H+4,2],[0,H+1,2*H+4,2],[-H-1,0,2,2*H],[H+1,0,2,2*H]])addBox(acc('wall'+M.bc,gMat('brick',M.bc)),x,5,z,w,10,d,TS.brick,0);
 for(const k in accs){const a=accs[k],g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(a.p,3));g.setAttribute('normal',new THREE.Float32BufferAttribute(a.n,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(a.u,2));g.setAttribute('color',new THREE.Float32BufferAttribute(a.c,3));g.setIndex(a.i);const m=new THREE.Mesh(g,a.mat);m.castShadow=m.receiveShadow=true;mapG.add(m)}
 gfxL=[];for(const[x,y,z,col,I,dist]of M.lights||[]){const l=new THREE.PointLight(col,I,dist);l.position.set(x,y,z);mapG.add(l);gfxL.push({l,b:I,p:Math.random()*6})}
}
/* every frame: sky follows the camera, lamps flicker, and the sun's shadow window glides in whole shadow texels so shadow edges stay rock steady while you move */
function gfxTick(dt){gt_+=dt;LX.tick(dt);if(skyM)skyM.position.copy(C.position);if(skyC)skyC.position.copy(C.position);
 const d=skyDir(),cx=C.position.x,cz=C.position.z,Lx=d[0]*60,Ly=Math.max(14,d[1]*60+8),Lz=d[2]*60,ll=Math.hypot(Lx,Ly,Lz),dx=Lx/ll,dy=Ly/ll,dz=Lz/ll,rl=Math.hypot(dz,dx)||1,rx=dz/rl,rz=-dx/rl,ux=rz*dy,uy=-rz*dx+rx*dz,uz=-rx*dy;
 const a=cx*rx+cz*rz,b=cx*ux+cz*uz,aS=Math.round(a/SH_TEXEL)*SH_TEXEL,bS=Math.round(b/SH_TEXEL)*SH_TEXEL,px=cx+(aS-a)*rx+(bS-b)*ux,py=(bS-b)*uy,pz=cz+(aS-a)*rz+(bS-b)*uz;
 sun.target.position.set(px,py,pz);sun.position.set(px+Lx,py+Ly,pz+Lz);sun.target.updateMatrixWorld();
 for(const o of gfxL)o.l.intensity=o.b*(.84+.1*Math.sin(gt_*(7+o.p)+o.p*9)+.06*Math.sin(gt_*23+o.p)+(Math.random()<.008?-.45:0))}

;
/* ######## sky.js ######## */
/* ===================== sky.js ===================== */
/* ---------- a different skybox for every map, drawn at run time on a 1024 x 512 canvas (zenith at the top, horizon in the middle, the horizon colour equals the fog colour so the world fades into it).
   Each map also has its own sun (or moon) direction: the visible disc sits where the light really comes from, so shadows agree with the sky.
   Blockfort: bright medieval day, big cumulus, forested hills, flocks of birds.      Pillars: Mediterranean noon, wispy cirrus, sea haze, pale mountains.
   Canyon: sunset with a huge low sun and long glowing cloud streaks.                  Suburbia: friendly summer sky, small clouds and a jet contrail.
   Boomtown: ochre dust storm, thick dust bands, a dark storm wall, smoke columns.     Rust: bleached desert noon, heat haze, mesas, an oil flare plume.
   Decay: heavy green-grey overcast, smoke columns and a ruined skyline.              Hollow Estate: night with a huge moon, stars, thin moonlit cloud, bats and a red horizon glow. ---------- */
const SKY_SUN={Blockfort:[.45,.75,-.35],Pillars:[-.2,.92,.3],Canyon:[-.86,.2,.3],Suburbia:[.3,.7,.5],Boomtown:[.6,.5,-.4],Rust:[.1,.85,-.5],Decay:[-.3,.45,.2],'Hollow Estate':[-.5,.55,.4]};
const skyDir=()=>{const d=SKY_SUN[sel.map]||[.45,.7,.3],l=Math.hypot(...d);return d.map(v=>v/l)};
function gfxSky(M){const W=1024,Hh=512,c=document.createElement('canvas');c.width=W;c.height=Hh;const g=c.getContext('2d'),name=sel.map,hz='#'+new THREE.Color(M.sky).getHexString(),hy=Hh/2;let sd=name.length*977+13;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647;
 const sdir=skyDir(),phi0=Math.atan2(sdir[2],-sdir[0]),sx=((phi0<0?phi0+Math.PI*2:phi0)/(Math.PI*2))*W,sy=Math.acos(sdir[1])/Math.PI*Hh;
 const grad=(stops)=>{const gr=g.createLinearGradient(0,0,0,Hh);for(const[p,col]of stops)gr.addColorStop(p,col);g.fillStyle=gr;g.fillRect(0,0,W,Hh)};
 /* wrap helper: things near the left / right seam are drawn twice so the sphere has no visible seam */
 const wrap=(x,w,fn)=>{fn(x);if(x-w<0)fn(x+W);if(x+w>W)fn(x-W)};
 const glow=(x,y,r,stops)=>{wrap(x,r,xx=>{const rg=g.createRadialGradient(xx,y,0,xx,y,r);for(const[p,col]of stops)rg.addColorStop(p,col);g.fillStyle=rg;g.fillRect(xx-r,y-r,r*2,r*2)})};
 const puff=(x,y,w,h,a,col,shade)=>{wrap(x,w,xx=>{for(let i=0;i<14;i++){const px=xx+(rnd()-.5)*w,py=y+(rnd()-.5)*h*.6,r=(.18+rnd()*.28)*Math.max(w,h*2)*.5;const rg=g.createRadialGradient(px,py,0,px,py,r);rg.addColorStop(0,col.replace('A',a));rg.addColorStop(1,col.replace('A',0));g.fillStyle=rg;g.beginPath();g.arc(px,py,r,0,7);g.fill()}if(shade)for(let i=0;i<6;i++){const px=xx+(rnd()-.5)*w*.9,py=y+h*.28+(rnd()-.5)*h*.3,r=(.15+rnd()*.2)*w*.4;const rg=g.createRadialGradient(px,py,0,px,py,r);rg.addColorStop(0,shade.replace('A',a*.8));rg.addColorStop(1,shade.replace('A',0));g.fillStyle=rg;g.beginPath();g.arc(px,py,r,0,7);g.fill()}})};
 const streak=(x,y,len,th,a,col)=>{wrap(x,len,xx=>{g.save();g.translate(xx,y);g.rotate((rnd()-.5)*.12);for(let i=0;i<8;i++){const r=g.createRadialGradient((rnd()-.5)*len*.7,0,0,(rnd()-.5)*len*.7,0,len*.5);r.addColorStop(0,col.replace('A',a));r.addColorStop(1,col.replace('A',0));g.fillStyle=r;g.save();g.scale(1,th/len);g.beginPath();g.arc(0,0,len*.5,0,7);g.fill();g.restore()}g.restore()})};
 const sil=(col,fn)=>{g.fillStyle=col;g.beginPath();g.moveTo(0,hy);for(let x=0;x<=W;x+=4)g.lineTo(x,hy-fn(x));g.lineTo(W,hy);g.closePath();g.fill()};
 const ridge=(amp,f1,f2,ph)=>x=>Math.max(0,amp*(.55+.3*Math.sin(x*f1+ph)+.18*Math.sin(x*f2+ph*2.3)+.1*Math.sin(x*f1*5.1+ph)));
 const bird=(x,y,s)=>{g.strokeStyle='rgba(10,12,16,.75)';g.lineWidth=1.3;g.beginPath();g.moveTo(x-s,y+s*.2);g.quadraticCurveTo(x-s*.4,y-s*.5,x,y);g.quadraticCurveTo(x+s*.4,y-s*.5,x+s,y+s*.2);g.stroke()};
 const stars=(n,a)=>{for(let i=0;i<n;i++){g.fillStyle=`rgba(255,255,255,${(a||1)*(.25+rnd()*.75)})`;const s=rnd()<.06?2:1;g.fillRect(rnd()*W,Math.pow(rnd(),1.4)*hy*.95,s,s)}};
 const column=(x,w,h,col,a)=>{wrap(x,w*3,xx=>{for(let i=0;i<26;i++){const t=i/26,px=xx+Math.sin(t*5+x)*w*(.4+t*2),py=hy-2-t*h,r=w*(.7+t*2.4);const rg=g.createRadialGradient(px,py,0,px,py,r);rg.addColorStop(0,col.replace('A',a*(1-t*.6)));rg.addColorStop(1,col.replace('A',0));g.fillStyle=rg;g.beginPath();g.arc(px,py,r,0,7);g.fill()}})};
 const haze=(col,top,a)=>{const gr=g.createLinearGradient(0,hy-top,0,hy+2);gr.addColorStop(0,col.replace('A',0));gr.addColorStop(1,col.replace('A',a));g.fillStyle=gr;g.fillRect(0,hy-top,W,top+2)};
 if(name=='Blockfort'){grad([[0,'#1d57c4'],[.22,'#3f86e2'],[.4,'#78b2ee'],[.5,hz],[1,hz]]);glow(sx,sy,220,[[0,'rgba(255,250,225,1)'],[.06,'rgba(255,244,200,.95)'],[.18,'rgba(255,236,170,.4)'],[1,'rgba(255,230,160,0)']]);
  for(let i=0;i<20;i++)puff(rnd()*W,hy*(.35+rnd()*.5),150+rnd()*230,60+rnd()*60,.92,'rgba(255,255,255,A)','rgba(150,165,190,A)');
  sil('#7f98b4',ridge(34,.015,.04,1));sil('#5f7e68',ridge(20,.03,.07,4));for(let i=0;i<60;i++){const x=rnd()*W;g.fillStyle='#44624a';g.beginPath();g.moveTo(x,hy);g.lineTo(x+4,hy-12-rnd()*8);g.lineTo(x+8,hy);g.fill()}
  g.fillStyle='#52586a';for(const x of[130,640]){g.fillRect(x,hy-30,22,30);g.fillRect(x-2,hy-34,26,5);g.beginPath();g.moveTo(x+4,hy-34);g.lineTo(x+11,hy-52);g.lineTo(x+18,hy-34);g.fill();g.fillRect(x+30,hy-24,14,24)}
  for(let k=0;k<3;k++){const bx=rnd()*W,by=hy*(.4+rnd()*.3);for(let i=0;i<7;i++)bird(bx+i*14+rnd()*8,by+Math.abs(i-3)*5+rnd()*5,5+rnd()*2)}haze('rgba(200,225,240,A)',46,.75)}
 else if(name=='Pillars'){grad([[0,'#0d5fc7'],[.2,'#2a86de'],[.38,'#7cc0ee'],[.5,hz],[1,hz]]);glow(sx,sy,260,[[0,'rgba(255,255,240,1)'],[.05,'rgba(255,252,225,.95)'],[.2,'rgba(255,246,200,.35)'],[1,'rgba(255,240,190,0)']]);
  for(let i=0;i<16;i++)streak(rnd()*W,hy*(.1+rnd()*.55),280+rnd()*340,10+rnd()*14,.5,'rgba(255,255,255,A)');for(let i=0;i<5;i++)puff(rnd()*W,hy*(.55+rnd()*.25),120+rnd()*120,40,.7,'rgba(255,255,255,A)','rgba(190,205,225,A)');
  g.fillStyle='rgba(255,255,255,.55)';g.beginPath();g.arc((sx+W*.5)%W,hy*.28,13,0,7);g.fill();g.fillStyle='#2a86de';g.beginPath();g.arc((sx+W*.5)%W+6,hy*.28-3,12,0,7);g.fill();
  sil('#a9a3c4',ridge(46,.012,.03,2));sil('#8a86ae',ridge(26,.02,.06,5));g.fillStyle='#6fb4d6';g.fillRect(0,hy-3,W,5);haze('rgba(190,220,240,A)',54,.85)}
 else if(name=='Canyon'){grad([[0,'#16204e'],[.16,'#3a2f78'],[.3,'#a04a7a'],[.42,'#f08a58'],[.5,hz],[1,hz]]);glow(sx,Math.max(sy,hy*.78),380,[[0,'rgba(255,245,200,1)'],[.05,'rgba(255,224,150,.95)'],[.18,'rgba(255,170,90,.55)'],[.5,'rgba(255,110,60,.18)'],[1,'rgba(255,90,50,0)']]);
  for(let i=0;i<22;i++)streak(rnd()*W,hy*(.35+rnd()*.5),300+rnd()*420,12+rnd()*18,.55,rnd()<.5?'rgba(255,170,120,A)':'rgba(255,110,130,A)');for(let i=0;i<8;i++)streak(rnd()*W,hy*(.1+rnd()*.3),260+rnd()*200,10,.35,'rgba(255,200,200,A)');stars(60,.35);
  sil('#7a3a4a',ridge(40,.014,.05,3));sil('#4a2a3a',ridge(24,.03,.08,6));for(let k=0;k<2;k++){const bx=rnd()*W,by=hy*.5+rnd()*40;for(let i=0;i<5;i++)bird(bx+i*16,by+Math.abs(i-2)*6,6)}haze('rgba(255,170,110,A)',60,.6)}
 else if(name=='Suburbia'){grad([[0,'#3a8ee6'],[.25,'#62aef0'],[.42,'#a0d4f6'],[.5,hz],[1,hz]]);glow(sx,sy,200,[[0,'rgba(255,255,235,1)'],[.06,'rgba(255,250,215,.95)'],[.2,'rgba(255,245,200,.3)'],[1,'rgba(255,240,190,0)']]);
  for(let i=0;i<14;i++)puff(rnd()*W,hy*(.25+rnd()*.6),70+rnd()*120,30+rnd()*30,.95,'rgba(255,255,255,A)','rgba(170,190,215,A)');g.save();g.translate(W*.3,hy*.3);g.rotate(-.18);const cg=g.createLinearGradient(0,0,320,0);cg.addColorStop(0,'rgba(255,255,255,0)');cg.addColorStop(.15,'rgba(255,255,255,.7)');cg.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=cg;g.fillRect(0,-2,320,4);g.fillStyle='#fff';g.fillRect(-2,-1.5,6,3);g.restore();
  sil('#7aa08a',ridge(10,.04,.1,2));for(let i=0;i<80;i++){const x=rnd()*W,h=8+rnd()*10;g.fillStyle=rnd()<.5?'#4f7a52':'#5e8a58';g.beginPath();g.arc(x,hy-h*.3,h*.55,0,7);g.fill()}haze('rgba(210,235,250,A)',34,.7)}
 else if(name=='Boomtown'){grad([[0,'#7a5a3a'],[.18,'#a8794a'],[.34,'#d19a5e'],[.5,hz],[1,hz]]);glow(sx,sy,200,[[0,'rgba(255,240,200,.9)'],[.1,'rgba(255,220,160,.55)'],[.4,'rgba(240,190,120,.2)'],[1,'rgba(230,180,110,0)']]);
  for(let i=0;i<26;i++)streak(rnd()*W,hy*(.15+rnd()*.8),300+rnd()*500,14+rnd()*22,.45,rnd()<.5?'rgba(215,160,95,A)':'rgba(140,100,60,A)');
  sil('rgba(96,64,40,.85)',x=>26+30*Math.pow(Math.max(0,Math.sin(x*.012+.6)),2)+10*Math.sin(x*.07));column(W*.22,12,150,'rgba(60,44,34,A)',.7);column(W*.7,10,120,'rgba(70,52,40,A)',.6);haze('rgba(225,185,125,A)',90,.9)}
 else if(name=='Rust'){grad([[0,'#4b86c8'],[.2,'#8cb2d6'],[.38,'#dbd0b4'],[.5,hz],[1,hz]]);glow(sx,sy,320,[[0,'rgba(255,255,248,1)'],[.05,'rgba(255,252,232,.97)'],[.2,'rgba(255,246,208,.5)'],[.6,'rgba(255,236,190,.12)'],[1,'rgba(255,230,180,0)']]);
  for(let i=0;i<8;i++)streak(rnd()*W,hy*(.1+rnd()*.6),260+rnd()*300,8+rnd()*10,.4,'rgba(255,255,255,A)');
  sil('#c7b08a',ridge(30,.011,.04,1));g.fillStyle='#b5a07c';for(const[x,w,h]of[[200,70,34],[300,50,24],[760,90,40],[880,60,28]]){g.fillRect(x,hy-h,w,h);g.fillRect(x+6,hy-h-5,w-12,6)}sil('#a8946e',ridge(14,.03,.08,3));column(W*.52,7,170,'rgba(32,26,22,A)',.75);glow(W*.52,hy-8,26,[[0,'rgba(255,170,70,.9)'],[1,'rgba(255,130,40,0)']]);haze('rgba(235,215,170,A)',70,.9)}
 else if(name=='Decay'){grad([[0,'#3a4644'],[.2,'#586664'],[.38,'#8a9894'],[.5,hz],[1,hz]]);
  for(let i=0;i<34;i++)puff(rnd()*W,hy*(.12+rnd()*.78),220+rnd()*340,70+rnd()*80,.55,'rgba(74,84,82,A)','rgba(40,48,46,A)');for(let i=0;i<14;i++)puff(rnd()*W,hy*(.2+rnd()*.7),180+rnd()*240,50+rnd()*50,.4,'rgba(170,182,176,A)');
  glow(sx,sy,180,[[0,'rgba(240,244,230,.55)'],[.3,'rgba(220,230,215,.2)'],[1,'rgba(210,220,205,0)']]);
  for(const x of[W*.15,W*.4,W*.63,W*.86])column(x,9,200,'rgba(40,44,42,A)',.7);
  g.fillStyle='#3a4240';for(let x=0;x<W;x+=11){const h=10+rnd()*(rnd()<.2?70:34);g.fillRect(x,hy-h,9+rnd()*8,h);if(rnd()<.25)g.fillRect(x+2,hy-h-12-rnd()*18,2,14)}sil('#4a5452',ridge(10,.05,.1,2));haze('rgba(150,165,160,A)',60,.8)}
 else{grad([[0,'#02040a'],[.2,'#070c1c'],[.4,'#0f1a30'],[.5,hz],[1,hz]]);stars(380,1);
  glow(sx,sy,260,[[0,'rgba(235,242,255,.9)'],[.1,'rgba(190,205,255,.45)'],[.4,'rgba(130,150,220,.15)'],[1,'rgba(110,130,200,0)']]);
  g.save();g.beginPath();g.arc(sx,sy,34,0,7);g.clip();const mg=g.createRadialGradient(sx-8,sy-8,2,sx,sy,36);mg.addColorStop(0,'#fbfdff');mg.addColorStop(1,'#c9d4ea');g.fillStyle=mg;g.fillRect(sx-40,sy-40,80,80);g.fillStyle='rgba(120,135,170,.4)';for(let i=0;i<9;i++){g.beginPath();g.arc(sx+(rnd()-.5)*50,sy+(rnd()-.5)*50,2+rnd()*7,0,7);g.fill()}g.restore();
  for(let i=0;i<12;i++)streak(rnd()*W,hy*(.15+rnd()*.7),260+rnd()*320,10+rnd()*14,.32,'rgba(150,170,220,A)');
  glow(W*.5,hy,420,[[0,'rgba(190,40,30,.5)'],[.5,'rgba(110,20,30,.2)'],[1,'rgba(80,10,20,0)']]);
  sil('#05070c',ridge(26,.02,.05,3));for(let i=0;i<40;i++){const x=rnd()*W,h=14+rnd()*30;g.fillStyle='#05070c';g.beginPath();g.moveTo(x-3,hy);g.lineTo(x,hy-h);g.lineTo(x+3,hy);g.fill()}
  for(let i=0;i<9;i++){const bx=rnd()*W,by=hy*(.3+rnd()*.5);g.strokeStyle='rgba(5,5,10,.9)';g.lineWidth=2;g.beginPath();g.moveTo(bx-8,by+2);g.quadraticCurveTo(bx-3,by-6,bx,by);g.quadraticCurveTo(bx+3,by-6,bx+8,by+2);g.stroke()}haze('rgba(40,50,80,A)',50,.6)}
 const tex=new THREE.CanvasTexture(c);tex.anisotropy=4;skyM=new THREE.Mesh(new THREE.SphereGeometry(180,48,24),new THREE.MeshBasicMaterial({map:tex,side:THREE.BackSide,fog:false,depthWrite:false}));skyM.renderOrder=-2;skyM.frustumCulled=false;mapG.add(skyM);
 /* animated clouds and stars ride on top of the painted sky, and the painted sky is baked into the reflection / ambient map */
 skyC=null;if(LX.pbr&&LX.skyMat){skyC=new THREE.Mesh(new THREE.SphereGeometry(176,40,20),LX.skyMat(LX.FX[name]||LX.FXD,skyDir()));skyC.renderOrder=-1;skyC.frustumCulled=false;mapG.add(skyC);LX.setEnv(c)}}


;
