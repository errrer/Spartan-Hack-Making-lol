/* ######## lumen.js ######## */
/* ===================== lumen.js ===================== */
/* ---------- LUMEN: the lighting, material and post-processing engine. It loads right after three.js, before the game.
   1  Materials:   every MeshLambert / MeshPhong material the game asks for becomes a physically based MeshStandardMaterial (metal and polymer guns, matte cloth, shiny skin),
                   lit per pixel, with sky reflections, height fog, world-space dirt variation and optional wind sway.
   2  Textures:    procedural albedo + normal + roughness maps for every surface kind (brick, concrete, asphalt, grass, wood ...), built lazily.
   3  Environment: the sky of each map is baked into a prefiltered reflection / ambient map (PMREM), so metal and glass reflect the real sky.
   4  Sky:         an animated cloud and star dome rides on top of the painted sky.
   5  Models:      LX.bevel() swaps the shared unit cube of small parts for a rounded box of the same world size, so edges catch the light.
   6  Post:        the scene is drawn into an MSAA half-float target, then: dual-filter bloom, sun shafts, chromatic aberration, speed blur, sharpening, grading,
                   filmic shoulder, vignette, grain. Every stage has a fallback: broken shaders or missing GPU features switch the effect off instead of breaking the game.
   Quality (Settings > Graphics): high = everything, med = PBR + shadows but no post-processing, low = the original cheap look. Add ?safe=1 to the address to force low. ---------- */
var LX=window.LX={ver:3,fx:{hit:0,boom:0,shot:0,speed:0,flash:0,dmg:0,heal:0,ca:0,pulse:0,blur:0},ctx:'',scale:1,frames:0,rbc:{}};
LX.mblur=1;try{LX.mblur=localStorage.getItem('sdrill-mblur')=='0'?0:1}catch(e){}
LX.bright=1;try{LX.bright=Math.max(.6,Math.min(1.6,parseFloat(localStorage.getItem('sdrill-bright'))||1))}catch(e){}
LX.q='high';try{LX.q=localStorage.getItem('sdrill-gfx')||(matchMedia('(pointer:coarse)').matches?'low':'high')}catch(e){}
if(!/^(high|med|low)$/.test(LX.q))LX.q='high';
LX.safe=/[?&]safe=1/.test(location.search);if(LX.safe)LX.q='low';
LX.pbr=LX.q!='low';LX.postOn=LX.q=='high';LX.postDead=false;
LX.U={time:{value:0},fogH:{value:.05},fogD:{value:.012},fogA:{value:.3},wind:{value:1}};
/* per-map look: ex exposure, bl bloom, sat, con contrast, vig vignette, ray sun shafts, rc shaft colour, ts/th shadow/highlight tint, haze (ground fog amount), hz fog height falloff, env reflection strength, cl clouds [cover, opacity, speed, scale, lit, shade], st stars */
LX.FX={
 Blockfort:{ex:1,bl:.5,sat:1.14,con:1.06,vig:.3,ray:.55,rc:[1,.94,.78],ts:[0,.02,.07],th:[.09,.05,0],haze:.28,hz:.05,env:1,cl:[.52,.55,.6,1.6,[1,1,1],[.62,.7,.84]],st:0},
 Pillars:{ex:1.04,bl:.58,sat:1.2,con:1.07,vig:.26,ray:.6,rc:[1,.97,.85],ts:[0,.03,.08],th:[.08,.05,.01],haze:.22,hz:.06,env:1.1,cl:[.62,.35,.45,1.3,[1,1,1],[.7,.78,.92]],st:0},
 Canyon:{thr:.86,ex:.98,bl:.8,sat:1.26,con:1.08,vig:.36,ray:1.05,rc:[1,.62,.34],ts:[.06,.0,.1],th:[.14,.07,-.02],haze:.34,hz:.04,env:1.1,cl:[.5,.6,.7,1.5,[1,.62,.4],[.5,.28,.38]],st:.3},
 Suburbia:{ex:1,bl:.5,sat:1.14,con:1.05,vig:.26,ray:.45,rc:[1,.96,.85],ts:[0,.02,.06],th:[.07,.05,.01],haze:.22,hz:.06,env:1,cl:[.5,.5,.5,1.7,[1,1,1],[.66,.74,.88]],st:0},
 Boomtown:{ex:.97,bl:.62,sat:.98,con:1.05,vig:.34,ray:.35,rc:[1,.78,.45],ts:[.04,.02,0],th:[.1,.06,-.02],haze:.55,hz:.035,env:.9,cl:[.38,.7,1.1,1.2,[.9,.72,.5],[.5,.38,.28]],st:0},
 Rust:{ex:1.05,bl:.7,sat:.94,con:1.09,vig:.28,ray:.55,rc:[1,.92,.72],ts:[.02,.02,.04],th:[.08,.05,0],haze:.3,hz:.045,env:1.1,cl:[.72,.22,.35,1.2,[1,.97,.9],[.8,.76,.7]],st:0},
 Decay:{thr:.9,ex:.96,bl:.38,sat:.78,con:1.1,vig:.42,ray:0,rc:[.8,.9,.8],ts:[0,.04,.03],th:[.0,.04,.02],haze:.5,hz:.04,env:.8,cl:[.3,.85,.35,1.4,[.62,.68,.64],[.3,.35,.34]],st:0},
 'Hollow Estate':{thr:.68,ex:1.2,bl:.95,sat:1.12,con:1.12,vig:.46,ray:.22,rc:[.55,.65,1],ts:[0,.04,.14],th:[.02,.05,.14],haze:.4,hz:.05,env:1.5,cl:[.56,.5,.3,1.5,[.62,.7,.95],[.1,.13,.22]],st:1}};
LX.FXD={ex:1,bl:.5,sat:1.1,con:1.05,vig:.3,ray:.4,rc:[1,.95,.8],ts:[0,.02,.06],th:[.07,.05,0],haze:.25,hz:.05,env:1,cl:[.5,.5,.5,1.5,[1,1,1],[.66,.74,.88]],st:0};
/* ---------- GLSL building blocks ---------- */
LX.NOISE=`float lxH(vec2 p){p=fract(p*vec2(123.34,456.21));p+=dot(p,p+45.32);return fract(p.x*p.y);}
float lxN(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.0-2.0*f);return mix(mix(lxH(i),lxH(i+vec2(1.0,0.0)),f.x),mix(lxH(i+vec2(0.0,1.0)),lxH(i+vec2(1.0,1.0)),f.x),f.y);}
float lxFbm(vec2 p){float v=0.0,a=0.55;for(int i=0;i<3;i++){v+=a*lxN(p);p=p*2.03+vec2(17.1,9.2);a*=0.5;}return v;}
`;
LX.MACRO=`vec3 lxP0=cameraPosition+(vec4(-vViewPosition,0.0)*viewMatrix).xyz;
float lxMv=lxN(lxP0.xz*0.045+lxP0.y*0.02)*0.78+lxN(lxP0.xz*0.31+lxP0.y*0.1)*0.34;
diffuseColor.rgb*=0.82+0.42*lxMv;
`;
LX.FOGC=`#if defined(USE_FOG) && !defined(FOG_EXP2)
 vec3 lxP1=cameraPosition+(vec4(-vViewPosition,0.0)*viewMatrix).xyz;
 float lxFg=smoothstep(fogNear,fogFar,vFogDepth);
 float lxHz=(1.0-exp(-vFogDepth*uLxFD))*exp(-max(lxP1.y,0.0)*uLxFH)*uLxFA;
 gl_FragColor.rgb=mix(gl_FragColor.rgb,fogColor,clamp(lxFg+lxHz,0.0,1.0));
#else
 #include <fog_fragment>
#endif
`;
LX.SWAY=`float lxS=max(position.y+0.15,0.0);vec4 lxW=modelMatrix*vec4(transformed,1.0);
transformed.x+=sin(uLxT*1.6+lxW.x*0.35+lxW.z*0.21)*0.05*lxS*uLxWind;transformed.z+=cos(uLxT*1.3+lxW.z*0.31+lxW.x*0.17)*0.045*lxS*uLxWind;
`;
/* attach the shared patches (height fog, dirt variation, wind) to a standard material */
LX.patch=function(m,fl){fl=fl||{};const key='lx'+(fl.macro?'m':'')+(fl.sway?'s':'');m.userData.lxFl=fl;
 m.onBeforeCompile=function(sh){if(LX.patchOff)return;sh.uniforms.uLxT=LX.U.time;sh.uniforms.uLxFH=LX.U.fogH;sh.uniforms.uLxFD=LX.U.fogD;sh.uniforms.uLxFA=LX.U.fogA;sh.uniforms.uLxWind=LX.U.wind;
  let vs='uniform float uLxT;\nuniform float uLxWind;\n'+sh.vertexShader,fs='uniform float uLxT;\nuniform float uLxFH;\nuniform float uLxFD;\nuniform float uLxFA;\n'+LX.NOISE+sh.fragmentShader;
  if(fl.sway)vs=vs.replace('#include <begin_vertex>','#include <begin_vertex>\n'+LX.SWAY);
  if(fl.macro)fs=fs.replace('#include <map_fragment>','#include <map_fragment>\n'+LX.MACRO);
  fs=fs.replace('#include <fog_fragment>',LX.FOGC);sh.vertexShader=vs;sh.fragmentShader=fs};
 m.customProgramCacheKey=function(){return LX.patchOff?'lx0':key};return m};
/* ---------- material upgrade ---------- */
LX.OK=['color','map','emissive','emissiveMap','emissiveIntensity','transparent','opacity','side','fog','vertexColors','flatShading','wireframe','alphaTest','depthWrite','depthTest','visible','blending','normalMap','roughnessMap','metalnessMap','envMap','envMapIntensity','roughness','metalness','normalScale','aoMap','alphaMap','premultipliedAlpha','polygonOffset','polygonOffsetFactor','polygonOffsetUnits','name','toneMapped','dithering'];
LX.classify=function(col,ctx){const c=new THREE.Color(col),h=c.getHSL({}),L=h.l,S=h.s,H=h.h;
 if(ctx=='gun'){
  if(L<.24&&S<.4)return[.46,.5];               /* black polymer and parkerized steel */
  if(S<.24)return[L>.6?.26:.34,.88];           /* bare steel and aluminium */
  if(H>.08&&H<.16&&S>.4&&L>.4)return[.26,.95];  /* brass and gold */
  if(H<.1&&H>.03&&S>.3&&L<.45)return[.58,0];    /* wood */
  if(S>.35)return[.5,.15];                       /* painted metal, tinted polymer */
  return[.55,.35]}
 if(ctx=='char'){if(H>.0&&H<.1&&S>.18&&S<.65&&L>.42)return[.5,0];return[.84,0]}
 return[.78,.03]};
LX.upg=function(p,ph){p=p||{};const o={};for(const k in p)if(LX.OK.includes(k)&&p[k]!==undefined)o[k]=p[k];
 const col=p.color==null?0xffffff:p.color,cam=!!(p.map&&p.map.image&&p.map.image.width===64),cl=cam?[.46,.34]:LX.classify(col,LX.ctx);
 o.roughness=o.roughness!=null?o.roughness:ph&&p.shininess!=null?Math.max(.18,1-Math.min(p.shininess,120)/130):cl[0];o.metalness=o.metalness!=null?o.metalness:cl[1];
 const m=new THREE.MeshStandardMaterial(o);m.envMapIntensity=cam||LX.ctx=='gun'?1.3:LX.ctx=='char'?.55:.65;
 if(p.emissive!=null&&p.emissiveIntensity==null)m.emissiveIntensity=1.15;
 if(m.userData===undefined)m.userData={};return LX.patch(m,{macro:!!p.map&&!LX.ctx})};
if(LX.pbr){const L0=THREE.MeshLambertMaterial,P0=THREE.MeshPhongMaterial;LX.Lambert0=L0;
 THREE.MeshLambertMaterial=function(p){return LX.upg(p,0)};THREE.MeshLambertMaterial.prototype=THREE.MeshStandardMaterial.prototype;
 THREE.MeshPhongMaterial=function(p){return LX.upg(p,1)};THREE.MeshPhongMaterial.prototype=THREE.MeshStandardMaterial.prototype}
/* run fn with a material context so guns get metal, people get cloth and skin */
LX.within=function(ctx,fn){return function(){const o=LX.ctx;LX.ctx=ctx;try{return fn.apply(this,arguments)}finally{LX.ctx=o}}};
/* ---------- rounded boxes for the shared unit cube ---------- */
LX.rb=function(sx,sy,sz,r){const ax=Math.abs(sx),ay=Math.abs(sy),az=Math.abs(sz);r=Math.min(r,.49*Math.min(ax,ay,az));
 const key=[sx,sy,sz,r].map(v=>v.toFixed(3)).join(','),c=LX.rbc[key];if(c)return c;
 const SEG=r<.02?2:3,g=new THREE.BoxGeometry(1,1,1,SEG,SEG,SEG),ps=g.attributes.position,nr=g.attributes.normal,hs=.5/SEG,rx=r/ax,ry=r/ay,rz=r/az,v=new THREE.Vector3(),n=new THREE.Vector3();
 for(let i=0;i<ps.count;i++){v.set(ps.getX(i),ps.getY(i),ps.getZ(i));n.copy(v);n.x-=Math.sign(n.x)*hs;n.y-=Math.sign(n.y)*hs;n.z-=Math.sign(n.z)*hs;n.normalize();
  ps.setXYZ(i,(.5-rx)*Math.sign(v.x)+n.x*rx,(.5-ry)*Math.sign(v.y)+n.y*ry,(.5-rz)*Math.sign(v.z)+n.z*rz);
  n.set(n.x*sx,n.y*sy,n.z*sz).normalize();nr.setXYZ(i,n.x,n.y,n.z)}
 ps.needsUpdate=true;nr.needsUpdate=true;if(Object.keys(LX.rbc).length>900)LX.rbc={};return LX.rbc[key]=g};
LX.bevel=function(root){if(!LX.pbr||!root||typeof bg=='undefined')return root;
 root.traverse(o=>{if(!o.isMesh||o.geometry!==bg||(o.userData&&o.userData.lxB))return;const s=o.scale,m=Math.min(Math.abs(s.x),Math.abs(s.y),Math.abs(s.z));if(m<.014)return;o.geometry=LX.rb(s.x,s.y,s.z,Math.min(.02,.2*m));o.userData.lxB=1});return root};
/* ---------- procedural PBR textures ---------- */
LX.TT={};
LX.tex=function(kind){if(LX.TT[kind])return LX.TT[kind];const N=LX.q=='low'?128:256,t0=performance.now();
 let sd=kind.length*7919+11;const rnd=()=>(sd=(sd*16807)%2147483647)/2147483647,perm=new Uint8Array(256);for(let i=0;i<256;i++)perm[i]=i;for(let i=255;i>0;i--){const j=(rnd()*(i+1))|0,t=perm[i];perm[i]=perm[j];perm[j]=t}
 const hs=(x,y,px,py)=>perm[(perm[(((x%px)+px)%px)&255]+((((y%py)+py)%py)&255))&255]/255;
 /* tileable value noise: u,v in 0..1 repeat after one tile, px/py are the lattice cells per tile */
 const nz=(u,v,px,py)=>{const x=u*px,y=v*py,ix=Math.floor(x),iy=Math.floor(y);let fx=x-ix,fy=y-iy;fx=fx*fx*(3-2*fx);fy=fy*fy*(3-2*fy);const a=hs(ix,iy,px,py),b=hs(ix+1,iy,px,py),c=hs(ix,iy+1,px,py),d=hs(ix+1,iy+1,px,py);return a+(b-a)*fx+(c-a)*fy+(a-b-c+d)*fx*fy};
 const fb=(u,v,p,o,py)=>{let s=0,a=.5,q=p,qy=py||p,t=0;for(let i=0;i<(o||4);i++){s+=a*nz(u,v,q,qy);t+=a;a*=.5;q*=2;qy*=2}return s/t};
 const sm=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
 const H=new Float32Array(N*N),A=new Uint8ClampedArray(N*N*4),Rg=new Float32Array(N*N),CR=new Float32Array(N*N);
 const crack=(n,len)=>{for(let k=0;k<n;k++){let x=rnd()*N,y=rnd()*N,a=rnd()*6.28;for(let i=0;i<len;i++){a+=(rnd()-.5)*.7;x+=Math.cos(a)*1.3;y+=Math.sin(a)*1.3;const px=((x|0)%N+N)%N,py=((y|0)%N+N)%N;CR[py*N+px]=1;if(i%3==0){CR[((py+1)%N)*N+px]=.5}}}};
 const o={h:0,a:180,r:.8,nrm:1.2};
 const G={
  brick:(u,v,x,y)=>{const R=12,C=5,r=Math.floor(v*R),cu=(((u*C+(r%2?.5:0))%1)+1)%1,cv=(v*R)%1,ci=Math.floor(u*C+(r%2?.5:0)),d=Math.min(Math.min(cu,1-cu)*N/C,Math.min(cv,1-cv)*N/R),face=sm(2.2,5.2,d),rb=hs(ci+7,r+3,256,256),n=fb(u,v,6,4),p=nz(u,v,128,128),soot=fb(u,v,3,2);
   o.h=face*.78+n*.12+p*.07*face;o.a=face?(130+rb*85)*(.86+.28*n)*(.82+.3*soot)-p*18:104+p*46;o.a=o.a*face+(104+p*46)*(1-face);o.r=.9-face*.12+n*.06;o.nrm=2.2},
  stucco:(u,v)=>{const n=fb(u,v,5,5),g=fb(u,v,48,3),st=fb(u*2,v,3,3,1);o.h=.45+.35*n+.2*g;o.a=188+(n-.5)*42+(g-.5)*28-Math.max(0,st-.52)*90;o.r=.88+.08*g;o.nrm=1.2},
  concrete:(u,v,x,y)=>{const n=fb(u,v,6,5),g=nz(u,v,160,160),ag=nz(u,v,40,40),pit=ag>.84?1:0,sx=x%(N/2),sy=y%(N/2),gm=Math.min(Math.min(sx,N/2-1-sx),Math.min(sy,N/2-1-sy)),gr=gm<1.4?1:0,st=fb(u*2,v,3,3,1),tie=(((x%(N/2))-N*.15)**2+((y%(N/2))-N*.15)**2)<4?1:0,c=CR[y*N+x];
   o.h=.55+.2*n+.12*g-pit*.2-gr*.35-tie*.3-c*.35;o.a=172+(n-.5)*34+(g-.5)*30-pit*34-gr*54-tie*50-c*70-Math.max(0,st-.55)*80;o.r=.86+.1*g-c*.1;o.nrm=1.3},
  asphalt:(u,v,x,y)=>{const g=nz(u,v,170,170),ag=nz(u,v,70,70),sp=ag>.86?1:0,n=fb(u,v,4,4),st=fb(u,v,4,3),c=CR[y*N+x];
   o.h=.5+.25*g+sp*.2+.1*n-c*.35;o.a=134+(g-.5)*60+sp*80+(n-.5)*30-c*64-sm(.58,.7,st)*34;o.r=.9-sm(.58,.7,st)*.38-sp*.1;o.nrm=1.5},
  grass:(u,v)=>{const cl=fb(u,v,5,4),b=nz(u,v,230,38),b2=nz(u,v,160,30),dirt=sm(.62,.74,fb(u,v,3,3));o.h=b*.5+b2*.3+cl*.2;o.a=(112+cl*76+(b-.5)*80+(b2-.5)*40)*(1-dirt*.3);o.r=.92;o.nrm=.9},
  plank:(u,v,x,y)=>{const P=8,r=Math.floor(v*P),pv=(v*P)%1,rb=hs(r+9,3,256,256),gap=Math.min(pv,1-pv)*N/P<1.3?1:0,gr=nz(u+rb,v,3,100)*.6+nz(u*2+rb,v,5,60)*.4,seam=Math.abs(((u+rb*.97)%1)-.5)<.004?1:0,kn=Math.hypot(((u*3+rb*5)%1)-.5,(pv-.5)*P*.35)<.1?1:0,nail=(Math.abs(((u+rb*.97)%1)-.04)*N<2.5&&Math.abs(pv-.5)*N/P<5)?1:0;
   o.h=(1-gap)*(.6+gr*.25-seam*.2-kn*.1)+nail*.1;o.a=(gap||seam)?64:(122+rb*92)*(.78+.4*gr)-kn*50+nail*40;o.r=.78+.12*gr;o.nrm=1.4},
  shingle:(u,v,x,y)=>{const R=8,r=Math.floor(v*R),cu=(((u*5+(r%2?.5:0))%1)+1)%1,cv=(v*R)%1,ci=Math.floor(u*5+(r%2?.5:0)),rb=hs(ci+5,r+1,256,256),gx=Math.min(cu,1-cu)*N/5<1.4?1:0,g=nz(u,v,150,150);
   o.h=.25+.7*cv-gx*.3+g*.05;o.a=(118+rb*90)*(.7+.3*cv)*(gx?.5:1)+(g-.5)*30;o.r=.9;o.nrm=2},
  tile:(u,v,x,y)=>{const T=4,cu=(u*T)%1,cv=(v*T)%1,d=Math.min(Math.min(cu,1-cu),Math.min(cv,1-cv))*N/T,face=sm(1.4,3.4,d),ti=Math.floor(u*T)+Math.floor(v*T)*7,rb=hs(ti+3,ti+5,256,256),g=fb(u,v,10,3),c=CR[y*N+x];
   o.h=face*.85+g*.05-c*.2;o.a=face?(186+rb*54)*(.94+.1*g)-c*60:100;o.r=face?.26+g*.18+c*.3:.92;o.nrm=1.1},
  metal:(u,v,x,y)=>{const br=nz(u,v,6,220),n=fb(u,v,5,3),seam=Math.min(((v*2)%1),1-((v*2)%1))*N/2<1.2||Math.min(((u*2)%1),1-((u*2)%1))*N/2<1.2?1:0,rx=((x%(N/8))-N/16),ry=(((y+N/4)%(N/2))-N/4),riv=(Math.abs(rx)<2.4&&Math.abs(Math.abs(ry)-N/4+3)<2.4)?1:0;
   o.h=.55+br*.1+n*.05-seam*.3+riv*.25;o.a=(176+(br-.5)*54+(n-.5)*30)*(seam?.6:1)+riv*30;o.r=.34+br*.2+n*.12;o.nrm=.8},
  sand:(u,v)=>{const w=fb(u,v,3,3),rip=Math.sin((v*14+w*3)*6.283)*.5+.5,g=nz(u,v,210,210);o.h=rip*.5+g*.15+w*.1;o.a=190+(rip-.5)*22+(g-.5)*30+(w-.5)*20;o.r=.95;o.nrm=.8},
  rust:(u,v)=>{const rib=Math.sin(u*22*6.283)*.5+.5,rs=fb(u,v,5,5),ru=sm(.5,.63,rs),stv=nz(u,v,70,3),g=nz(u,v,130,130);o.h=rib*.55+ru*.1+g*.06;o.a=(188-ru*78)*(.88+.2*stv)+(g-.5)*22;o.r=.34+ru*.58;o.nrm=1.5},
  cobble:(u,v,x,y)=>{const K=8,gx=u*K,gy=v*K,ix=Math.floor(gx),iy=Math.floor(gy);let d1=9,d2=9,id=0;for(let j=-1;j<=1;j++)for(let i=-1;i<=1;i++){const cx=ix+i,cy=iy+j,hx=hs(cx,cy,256,256),hy=hs(cx+31,cy+17,256,256),dx=cx+.5+(hx-.5)*.55-gx,dy=cy+.5+(hy-.5)*.55-gy,d=Math.hypot(dx,dy);if(d<d1){d2=d1;d1=d;id=hx*7+hy}else if(d<d2)d2=d}
   const e=d2-d1,f=sm(.02,.2,e),g=nz(u,v,120,120),rb=id%1;o.h=f*(.7+.25*(.5-d1))+g*.06;o.a=f?(138+rb*84)*(.9+.2*g):70;o.r=.9-f*.1;o.nrm=2.4},
  def:(u,v)=>{const n=fb(u,v,6,4);o.h=n;o.a=186+(n-.5)*60;o.r=.8;o.nrm=1}};
 const gen=G[kind]||G.def;if(kind=='concrete'||kind=='asphalt'||kind=='tile')crack(kind=='tile'?3:kind=='asphalt'?5:4,kind=='tile'?60:90);
 let nrm=1;for(let y=0;y<N;y++)for(let x=0;x<N;x++){gen(x/N,y/N,x,y);const i=y*N+x,a=Math.max(0,Math.min(255,o.a));H[i]=o.h;Rg[i]=o.r;A[i*4]=A[i*4+1]=A[i*4+2]=a;A[i*4+3]=255;nrm=o.nrm}
 const mk=(w)=>{const c=document.createElement('canvas');c.width=c.height=N;const g=c.getContext('2d'),im=g.createImageData(N,N);im.data.set(w);g.putImageData(im,0,0);const t=new THREE.CanvasTexture(c);t.wrapS=t.wrapT=THREE.RepeatWrapping;t.anisotropy=Math.min(8,(typeof R!='undefined'&&R.capabilities&&R.capabilities.getMaxAnisotropy?R.capabilities.getMaxAnisotropy():4));return t};
 if(!LX.pbr)return LX.TT[kind]={map:mk(A),ms:performance.now()-t0};
 const NM=new Uint8ClampedArray(N*N*4),RM=new Uint8ClampedArray(N*N*4);
 for(let y=0;y<N;y++)for(let x=0;x<N;x++){const i=y*N+x,xl=y*N+((x+N-1)%N),xr=y*N+((x+1)%N),yu=((y+N-1)%N)*N+x,yd=((y+1)%N)*N+x,dx=(H[xr]-H[xl])*.5*N/16*nrm,dy=(H[yu]-H[yd])*.5*N/16*nrm,l=Math.hypot(dx,dy,1);
  NM[i*4]=(-dx/l*.5+.5)*255;NM[i*4+1]=(-dy/l*.5+.5)*255;NM[i*4+2]=(1/l*.5+.5)*255;NM[i*4+3]=255;const rr=Math.max(0,Math.min(255,Rg[i]*255));RM[i*4]=RM[i*4+1]=RM[i*4+2]=rr;RM[i*4+3]=255}
 const res={map:mk(A),normalMap:mk(NM),roughnessMap:mk(RM),ms:performance.now()-t0};return LX.TT[kind]=res};
/* a copy with a different repeat (ground planes) */
LX.texRep=function(kind,rx,ry){const b=LX.tex(kind),o={};for(const k of['map','normalMap','roughnessMap']){const t=b[k].clone();t.needsUpdate=true;t.repeat.set(rx,ry);o[k]=t}return o};
/* ---------- environment (reflections + sky ambient) ---------- */
LX.setEnv=function(cv){if(!LX.pbr||typeof R=='undefined'||!THREE.PMREMGenerator)return;
 try{const f=document.createElement('canvas');f.width=cv.width;f.height=cv.height;const g=f.getContext('2d');g.translate(f.width,0);g.scale(-1,1);g.drawImage(cv,0,0);
  /* the sky sphere runs the opposite way round to an equirectangular map, hence the mirror above; a little extra punch for reflections */
  const tex=new THREE.CanvasTexture(f);tex.mapping=THREE.EquirectangularReflectionMapping;if(!LX.pm)LX.pm=new THREE.PMREMGenerator(R);
  const rt=LX.pm.fromEquirectangular(tex);tex.dispose();if(LX.envRT)LX.envRT.dispose();LX.envRT=rt;S.environment=rt.texture}catch(e){console.warn('LUMEN env map failed',e)}};
/* ---------- animated clouds + stars on a dome over the painted sky ---------- */
LX.skyMat=function(fx,sd){const c=fx.cl,V=a=>new THREE.Color(a[0],a[1],a[2]);
 return new THREE.ShaderMaterial({transparent:true,depthWrite:false,side:THREE.BackSide,fog:false,
  uniforms:{uT:LX.U.time,uCover:{value:c[0]},uOp:{value:c[1]},uWind:{value:new THREE.Vector2(c[2]*.012,c[2]*.004)},uScale:{value:c[3]},uLit:{value:V(c[4])},uShade:{value:V(c[5])},uSunD:{value:new THREE.Vector3(sd[0],sd[1],sd[2])},uStar:{value:fx.st||0}},
  vertexShader:'varying vec3 vD;void main(){vD=position;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}',
  fragmentShader:'uniform float uT;uniform float uCover;uniform float uOp;uniform float uScale;uniform float uStar;uniform vec2 uWind;uniform vec3 uLit;uniform vec3 uShade;uniform vec3 uSunD;varying vec3 vD;\n'+LX.NOISE+
  `float h3(vec3 p){return fract(sin(dot(p,vec3(12.9898,78.233,37.719)))*43758.5453);}
void main(){vec3 d=normalize(vD);float up=d.y;vec2 p=d.xz/(up+0.28)*uScale+uWind*uT*60.0;float n=lxFbm(p);float c=smoothstep(uCover-0.12,uCover+0.22,n);
float n2=lxFbm(p+uSunD.xz*0.07/(up+0.3));float lit=clamp(0.55+(n-n2)*4.2,0.0,1.0);float sa=pow(max(dot(d,uSunD),0.0),6.0);
vec3 col=mix(uShade,uLit,lit)+uLit*sa*0.55*(1.0-c*0.4);float a=c*uOp*smoothstep(0.015,0.22,up);
vec3 sp=d*300.0;float h=h3(floor(sp));vec2 q=fract(sp.xy+sp.z)-0.5;float tw=0.6+0.4*sin(uT*2.5+h*60.0);float star=step(0.9972,h)*tw*uStar*smoothstep(0.05,0.3,up)*(1.0-c)*(1.0-smoothstep(0.1,0.5,length(q)));
gl_FragColor=vec4(mix(col,vec3(1.0),star),clamp(a+star,0.0,1.0));}`})};
/* ---------- the post-processing pipeline ---------- */
LX.GL={};
LX.GL.vs='varying vec2 vUv;void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}';
LX.GL.down=`uniform sampler2D tIn;uniform vec2 uTexel;uniform float uThr;uniform float uKnee;uniform float uPre;varying vec2 vUv;
vec3 pf(vec3 c){c=min(c,vec3(12.0));if(uPre<0.5)return c;float br=max(max(c.r,c.g),c.b);float rq=clamp(br-uThr+uKnee,0.0,2.0*uKnee);rq=rq*rq/(4.0*uKnee+0.0001);float w=max(rq,br-uThr)/max(br,0.0001);return c*w;}
vec3 S(vec2 o){return pf(texture2D(tIn,vUv+o*uTexel).rgb);}
void main(){vec3 a=S(vec2(-2.0,2.0)),b=S(vec2(0.0,2.0)),c=S(vec2(2.0,2.0)),d=S(vec2(-2.0,0.0)),e=S(vec2(0.0,0.0)),f=S(vec2(2.0,0.0)),g=S(vec2(-2.0,-2.0)),h=S(vec2(0.0,-2.0)),i=S(vec2(2.0,-2.0)),j=S(vec2(-1.0,1.0)),k=S(vec2(1.0,1.0)),l=S(vec2(-1.0,-1.0)),m=S(vec2(1.0,-1.0));
vec3 r=e*0.125+(a+c+g+i)*0.03125+(b+d+f+h)*0.0625+(j+k+l+m)*0.125;gl_FragColor=vec4(r,1.0);}`;
LX.GL.up=`uniform sampler2D tLow;uniform sampler2D tHigh;uniform vec2 uTexel;uniform float uScatter;varying vec2 vUv;
vec3 L(vec2 o){return texture2D(tLow,vUv+o*uTexel).rgb;}
void main(){vec3 s=L(vec2(-1.0,1.0))+L(vec2(0.0,1.0))*2.0+L(vec2(1.0,1.0))+L(vec2(-1.0,0.0))*2.0+L(vec2(0.0,0.0))*4.0+L(vec2(1.0,0.0))*2.0+L(vec2(-1.0,-1.0))+L(vec2(0.0,-1.0))*2.0+L(vec2(1.0,-1.0));
gl_FragColor=vec4(texture2D(tHigh,vUv).rgb+s*0.0625*uScatter,1.0);}`;
LX.GL.rays=`uniform sampler2D tScene;uniform vec2 uSun;uniform float uDens;uniform float uDecay;uniform float uThr;varying vec2 vUv;
void main(){vec2 d=(uSun-vUv)*uDens/20.0;vec2 uv=vUv;float ill=1.0;vec3 acc=vec3(0.0);
for(int i=0;i<20;i++){uv+=d;vec3 c=texture2D(tScene,uv).rgb;float l=dot(c,vec3(0.299,0.587,0.114));float m=smoothstep(uThr,uThr+0.3,l);acc+=min(c,vec3(4.0))*m*ill*0.1;ill*=uDecay;}
gl_FragColor=vec4(acc,1.0);}`;
LX.GL.comp=`uniform sampler2D tScene;uniform sampler2D tBloom;uniform sampler2D tRays;uniform vec2 uRes;uniform float uTime;uniform float uExp;uniform float uBloom;uniform float uRay;uniform float uVig;uniform float uGrain;uniform float uCA;uniform float uSharp;uniform float uSpeed;uniform float uDmg;uniform float uHeal;uniform float uFlash;uniform float uPulse;uniform float uSat;uniform float uCon;
uniform vec3 uRayCol;uniform vec3 uTintS;uniform vec3 uTintH;uniform vec3 uFlashCol;varying vec2 vUv;
float h21(vec2 p){p=fract(p*vec2(233.34,851.73));p+=dot(p,p+23.45);return fract(p.x*p.y);}
vec3 filmic(vec3 x){float a=0.74;vec3 over=max(x-a,vec3(0.0));vec3 r=a+(1.0-a)*(1.0-exp(-over/(1.0-a)));return mix(x,r,step(vec3(a),x));}
void main(){vec2 uv=vUv;vec2 c=uv-0.5;float r2=dot(c,c);float rr=sqrt(r2);vec3 col;vec2 off=c*uCA*(0.3+r2*2.4);
if(uSpeed>0.002){vec3 acc=vec3(0.0);for(int i=0;i<6;i++){float k=float(i)/5.0;vec2 p=uv-c*uSpeed*k*0.14;acc+=vec3(texture2D(tScene,p+off).r,texture2D(tScene,p).g,texture2D(tScene,p-off).b);}col=acc/6.0;}
else col=vec3(texture2D(tScene,uv+off).r,texture2D(tScene,uv).g,texture2D(tScene,uv-off).b);
vec2 px=1.0/uRes;vec3 bl=(texture2D(tScene,uv+vec2(px.x,0.0)).rgb+texture2D(tScene,uv-vec2(px.x,0.0)).rgb+texture2D(tScene,uv+vec2(0.0,px.y)).rgb+texture2D(tScene,uv-vec2(0.0,px.y)).rgb)*0.25;
col+=(col-bl)*uSharp;col=max(col,vec3(0.0));
col+=texture2D(tBloom,uv).rgb*uBloom;col+=texture2D(tRays,uv).rgb*uRay*uRayCol;col+=uFlashCol*uFlash;col*=uExp;
float l=dot(col,vec3(0.299,0.587,0.114));col=mix(vec3(l),col,uSat);col=(col-0.5)*uCon+0.5;col+=mix(uTintS,uTintH,smoothstep(0.1,0.9,l))*0.1;col=filmic(max(col,vec3(0.0)));
float lh=dot(col,vec3(0.299,0.587,0.114));col=mix(col,vec3(lh),smoothstep(0.85,1.0,lh)*0.22);
float vg=1.0-smoothstep(0.2,0.85,rr*1.15*(1.0+uPulse));col*=mix(1.0-uVig,1.0,vg);
col=mix(col,col*vec3(1.0,0.34,0.3),uDmg*smoothstep(0.15,0.75,rr*1.4));col+=vec3(0.02,0.1,0.05)*uHeal*smoothstep(0.2,0.8,rr);
float g=h21(uv*uRes+fract(uTime)*91.7)-0.5;col+=g*uGrain;col+=(h21(uv*uRes*1.7+3.1)-0.5)/255.0;
gl_FragColor=vec4(col,1.0);}`;
LX.initPost=function(){if(LX.inited||typeof R=='undefined')return;LX.inited=true;
 try{const gl2=R.capabilities.isWebGL2;LX.hdr=!!(gl2&&R.extensions.has('EXT_color_buffer_float'));LX.msaa=gl2&&!!THREE.WebGLMultisampleRenderTarget?4:0;
  const sh=(f,u)=>new THREE.ShaderMaterial({uniforms:u,vertexShader:LX.GL.vs,fragmentShader:f,depthTest:false,depthWrite:false});
  const T=()=>({value:null}),V2=()=>({value:new THREE.Vector2()}),F=v=>({value:v}),V3=()=>({value:new THREE.Vector3()});
  LX.mDown=sh(LX.GL.down,{tIn:T(),uTexel:V2(),uThr:F(.8),uKnee:F(.45),uPre:F(1)});LX.mUp=sh(LX.GL.up,{tLow:T(),tHigh:T(),uTexel:V2(),uScatter:F(.7)});
  LX.mRays=sh(LX.GL.rays,{tScene:T(),uSun:V2(),uDens:F(.95),uDecay:F(.93),uThr:F(.7)});
  LX.mComp=sh(LX.GL.comp,{tScene:T(),tBloom:T(),tRays:T(),uRes:V2(),uTime:F(0),uExp:F(1),uBloom:F(.5),uRay:F(0),uVig:F(.3),uGrain:F(.03),uCA:F(.0015),uSharp:F(.22),uSpeed:F(0),uDmg:F(0),uHeal:F(0),uFlash:F(0),uPulse:F(0),uSat:F(1.1),uCon:F(1.05),uRayCol:V3(),uTintS:V3(),uTintH:V3(),uFlashCol:V3()});
  LX.quad=new THREE.Mesh(new THREE.PlaneGeometry(2,2),LX.mComp);LX.quad.frustumCulled=false;LX.qs=new THREE.Scene();LX.qs.add(LX.quad);LX.qc=new THREE.OrthographicCamera(-1,1,1,-1,0,1);
  LX.sunV=new THREE.Vector3();LX.mkRT();addEventListener('resize',()=>{if(LX.inited)LX.mkRT()})}catch(e){LX.fail('init',e)}};
LX.mkRT=function(){try{const sz=new THREE.Vector2();R.getDrawingBufferSize(sz);const w=Math.max(2,Math.floor(sz.x*LX.scale)),h=Math.max(2,Math.floor(sz.y*LX.scale));
  const o=ms=>({minFilter:THREE.LinearFilter,magFilter:THREE.LinearFilter,format:THREE.RGBAFormat,type:LX.hdr?THREE.HalfFloatType:THREE.UnsignedByteType,depthBuffer:!!ms,stencilBuffer:false});
  for(const k of['rtS','rtD','rtU','rtR'])if(LX[k]){const a=Array.isArray(LX[k])?LX[k]:[LX[k]];for(const t of a)t.dispose()}
  if(LX.msaa){LX.rtS=new THREE.WebGLMultisampleRenderTarget(w,h,o(1));LX.rtS.samples=LX.msaa}else LX.rtS=new THREE.WebGLRenderTarget(w,h,o(1));
  LX.rtD=[];LX.rtU=[];let cw=w,ch=h;for(let i=0;i<5;i++){cw=Math.max(2,cw>>1);ch=Math.max(2,ch>>1);LX.rtD.push(new THREE.WebGLRenderTarget(cw,ch,o(0)));if(i<4)LX.rtU.push(new THREE.WebGLRenderTarget(cw,ch,o(0)))}
  LX.rtR=new THREE.WebGLRenderTarget(Math.max(2,w>>2),Math.max(2,h>>2),o(0));LX.sw=w;LX.sh=h;LX.mComp.uniforms.uRes.value.set(sz.x,sz.y)}catch(e){LX.fail('targets',e)}};
LX.fail=function(why,e){LX.postDead=true;LX.postOn=false;try{console.warn('LUMEN post-processing disabled ('+why+')',e||'')}catch(x){}};
LX.active=function(){return LX.postOn&&!LX.postDead&&LX.inited&&!(R.xr&&R.xr.isPresenting)};
/* every frame: scene -> HDR target -> bloom chain -> sun shafts -> grade to the screen */
LX.render=function(sc,cam){
 if(LX.postOn&&!LX.inited)LX.initPost();
 if(!LX.active()){R.render(sc,cam);LX.frames++;if(LX.frames==4||LX.frames%240==0)LX.verify();return}
 try{const U=LX.mComp.uniforms,fx=LX.fx,m=LX.mp||LX.FXD,qd=(a,b,c,d)=>{LX.quad.material=a;R.setRenderTarget(b);R.render(LX.qs,LX.qc)};
  R.setRenderTarget(LX.rtS);R.render(sc,cam);
  const D=LX.mDown.uniforms,Up=LX.mUp.uniforms;let src=LX.rtS.texture,iw=LX.sw,ih=LX.sh;
  const nd=(LX.gTier|0)>=3?3:LX.rtD.length;for(let i=0;i<nd;i++){const t=LX.rtD[i];D.tIn.value=src;D.uTexel.value.set(1/iw,1/ih);D.uPre.value=i==0?1:0;D.uThr.value=m.thr||.92;qd(LX.mDown,t);src=t.texture;iw=t.width;ih=t.height}
  for(let i=nd-2;i>=0;i--){const low=i==nd-2?LX.rtD[i+1]:LX.rtU[i+1];Up.tLow.value=low.texture;Up.tHigh.value=LX.rtD[i].texture;Up.uTexel.value.set(1/low.width,1/low.height);Up.uScatter.value=.72;qd(LX.mUp,LX.rtU[i])}
  /* sun shafts */
  let ray=0;if(m.ray>0&&(LX.gTier|0)<1&&typeof skyDir=='function'&&typeof C!='undefined'){const d=skyDir(),v=LX.sunV;v.set(C.position.x+d[0]*100,C.position.y+d[1]*100,C.position.z+d[2]*100);v.project(cam);
   if(v.z<1){const e=1-Math.min(1,Math.max(0,(Math.max(Math.abs(v.x),Math.abs(v.y))-.8)/1.2));ray=m.ray*e;const R_=LX.mRays.uniforms;R_.uSun.value.set(v.x*.5+.5,v.y*.5+.5);R_.tScene.value=LX.rtS.texture;qd(LX.mRays,LX.rtR)}}
  U.tScene.value=LX.rtS.texture;U.tBloom.value=LX.rtU[0].texture;U.tRays.value=LX.rtR.texture;U.uTime.value=LX.U.time.value;
  U.uExp.value=m.ex*LX.bright;U.uBloom.value=m.bl*.5*(1+fx.boom*.9+fx.shot*.15);U.uRay.value=ray*(1+fx.flash*.5);U.uVig.value=m.vig+fx.dmg*.12;U.uGrain.value=(m.gr==null?.03:m.gr);U.uCA.value=.0011+fx.ca*.012+fx.boom*.006+fx.dmg*.004;
  U.uSharp.value=.2;U.uSpeed.value=LX.mblur?Math.min(1,fx.speed+fx.blur):0;U.uDmg.value=Math.min(1,fx.dmg);U.uHeal.value=fx.heal;U.uFlash.value=fx.flash;U.uPulse.value=fx.pulse;U.uSat.value=m.sat*(1-fx.dmg*.2);U.uCon.value=m.con;
  U.uRayCol.value.set(m.rc[0],m.rc[1],m.rc[2]);U.uTintS.value.set(m.ts[0],m.ts[1],m.ts[2]);U.uTintH.value.set(m.th[0],m.th[1],m.th[2]);U.uFlashCol.value.set(1,.97,.9);
  LX.quad.material=LX.mComp;R.setRenderTarget(null);R.render(LX.qs,LX.qc);
  LX.frames++;if(LX.frames==4||LX.frames%240==0)LX.verify()}catch(e){R.setRenderTarget(null);LX.fail('render',e);R.render(sc,cam)}};
/* diagnostics: broken shader programs and GL errors switch the offending feature off instead of blanking the game */
LX.verify=function(){try{const ps=(R.info&&R.info.programs)||[],bad=ps.filter(p=>p.diagnostics&&p.diagnostics.runnable===false);
  if(bad.length){const post=[LX.mDown,LX.mUp,LX.mRays,LX.mComp].some(m=>{try{const pr=R.properties.get(m),cp=pr&&pr.currentProgram;return cp&&cp.diagnostics&&cp.diagnostics.runnable===false}catch(e){return false}});
   if(post)LX.fail('a post-processing shader failed to compile');
   if(bad.some(p=>p.name==='MeshStandardMaterial'||p.name==='MeshPhysicalMaterial')&&!LX.patchOff){LX.patchOff=true;LX.refresh();console.warn('LUMEN: fog/dirt patch disabled (shader error)')}}
  const gl=R.getContext();if(gl&&gl.getError){let er=gl.getError(),n=0;while(er&&n++<4){if(er==1286&&LX.postOn){if(LX.hdr){LX.hdr=false;LX.mkRT();console.warn('LUMEN: half-float target unsupported, using 8-bit')}else LX.fail('framebuffer')}er=gl.getError()}}}catch(e){}};
LX.refresh=function(){try{S.traverse(o=>{const ms=o.material?(Array.isArray(o.material)?o.material:[o.material]):[];for(const m of ms)if(m.onBeforeCompile&&m.userData&&m.userData.lxFl){m.needsUpdate=true}})}catch(e){}};
/* ---------- per-map look + per-frame bookkeeping ---------- */
LX.setMap=function(name){const f=LX.FX[name]||LX.FXD;LX.mp=Object.assign({},f);LX.mp.gr=name=='Hollow Estate'?.05:.028;LX.U.fogA.value=f.haze;LX.U.fogH.value=f.hz*(f.haze>.4?.7:1);LX.U.fogD.value=.012+f.haze*.014;return LX.mp};
LX.tick=function(dt){LX.U.time.value+=dt;const f=LX.fx,k=n=>Math.exp(-n*dt);f.hit*=k(9);f.boom*=k(2.6);f.shot*=k(16);f.flash*=k(3.4);f.ca*=k(7);f.dmg*=k(2.4);f.heal*=k(2.2);f.pulse*=k(5);f.blur*=k(4);
 if(LX.gov&&LX.postOn&&!LX.postDead&&!LX.dynOff)LX.gov(dt)};
LX.setQuality=function(q){LX.q=q;LX.postOn=q=='high'&&!LX.postDead&&!LX.safe;try{localStorage.setItem('sdrill-gfx',q)}catch(e){}};
/* brightness setting: scales post-processing exposure (or tone-mapping exposure when post-processing is off) */
LX.setBright=function(v){v=Math.max(.6,Math.min(1.6,+v||1));LX.bright=v;try{localStorage.setItem('sdrill-bright',v)}catch(e){}
 if(typeof R!='undefined'&&!LX.active()){const on=Math.abs(v-1)>.01;const tm=on?THREE.LinearToneMapping:THREE.NoToneMapping;if(R.toneMapping!==tm){R.toneMapping=tm;LX.refresh()}R.toneMappingExposure=v}
 for(const id of['br','br2']){const e=document.getElementById(id);if(e)e.value=v}};
LX.initBright=function(){for(const id of['br','br2']){const e=document.getElementById(id);if(e){e.value=LX.bright;e.oninput=()=>LX.setBright(e.value)}}if(Math.abs(LX.bright-1)>.01&&!LX.postOn&&typeof R!='undefined')LX.setBright(LX.bright)};
/* ---------- studio lighting for the weapon / camo / item preview renderers ----------
   Those previews run in their own WebGL contexts (a texture cannot be shared between contexts) with only a hemisphere and two directional lights; metal needs something to reflect or it renders black.
   The first time any renderer other than the main one draws a scene, it gets its own prefiltered studio environment (soft boxes over a grey cyclorama). */
LX.studio=function(){const c=document.createElement('canvas');c.width=512;c.height=256;const g=c.getContext('2d'),gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,'#d6e4f4');gr.addColorStop(.45,'#a3b0bf');gr.addColorStop(.52,'#707884');gr.addColorStop(1,'#2e343b');g.fillStyle=gr;g.fillRect(0,0,512,256);
 const box=(x,y,w,h,a)=>{const r=g.createRadialGradient(x,y,0,x,y,Math.max(w,h));r.addColorStop(0,'rgba(255,255,255,'+a+')');r.addColorStop(.6,'rgba(255,255,255,'+a*.5+')');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(x-w,y-h,w*2,h*2)};
 box(150,70,64,32,1);box(380,92,44,26,.8);box(40,104,54,22,.5);return c};
LX.envFor=function(r){LX._ev=LX._ev||new WeakMap();let t=LX._ev.get(r);if(t!==undefined)return t;LX._pmBusy=true;
 try{const pm=new THREE.PMREMGenerator(r),tex=new THREE.CanvasTexture(LX.studio());tex.mapping=THREE.EquirectangularReflectionMapping;const rt=pm.fromEquirectangular(tex);tex.dispose();t=rt.texture}catch(e){t=null;console.warn('LUMEN studio env failed',e)}
 LX._pmBusy=false;LX._ev.set(r,t);return t};
if(LX.pbr&&THREE.WebGLRenderer){const r0=THREE.WebGLRenderer.prototype.render;
 THREE.WebGLRenderer.prototype.render=function(sc,cam){if(!LX._pmBusy&&sc&&sc.isScene&&!sc.environment){let main=false;try{main=this===R}catch(e){main=true}if(!main){const e=LX.envFor(this);if(e)sc.environment=e}}return r0.apply(this,arguments)}}

/* ---------- frame-rate governor ----------
   Holds 60 fps or better on any device while keeping the Ultra look: it spends resolution first (the HDR target shrinks and grows between 50 % and 100 % of the screen, and the final grade
   plus a sharpen pass keeps it crisp), then, only if that is not enough, drops effects one at a time (sun shafts, shadow resolution, MSAA, bloom depth, shadows). It measures real frame times,
   probes upwards slowly when there is headroom, and backs off for longer each time a probe makes frames slip. High refresh displays that have headroom simply get a sharper picture. ---------- */
LX.gTier=0;
LX.gov=(function(){const B=1/60;let ema=B,warm=0,bad=0,calm=0,backoff=14,since=99,last=0,init=0,minS=.5,raised=-1e9;
 const setScale=s=>{s=Math.max(minS,Math.min(1,s));if(Math.abs(s-LX.scale)<.015)return false;LX.scale=s;LX.mkRT();return true};
 const tier=n=>{LX.gTier=n;try{
  if(typeof sun!='undefined'&&sun&&sun.shadow){const want=n>=2?1024:(typeof SHS!='undefined'?SHS:2048);if(sun.shadow.mapSize.x!==want){sun.shadow.mapSize.set(want,want);if(sun.shadow.map){sun.shadow.map.dispose();sun.shadow.map=null}}sun.castShadow=n<4}
  if(LX.msaa0==null)LX.msaa0=LX.msaa;const w_=n>=3?0:n>=2?Math.min(2,LX.msaa0):LX.msaa0;if(LX.msaa!==w_){LX.msaa=w_;LX.mkRT()}
 }catch(e){}};
 return function(dt){const now=performance.now(),real=last?(now-last)/1000:B;last=now;if(real>.25||document.hidden)return;
  if(!init){init=1;LX.msaa0=LX.msaa;try{const sz=new THREE.Vector2();R.getDrawingBufferSize(sz);/* start near 2.4 megapixels of scene (about 1080p) and let the governor find the rest */const px=sz.x*sz.y;setScale(Math.min(1,Math.sqrt(2.6e6/Math.max(1,px))))}catch(e){}return}
  if(++warm<90)return;ema=ema*.92+real*.08;since+=real;
  if(ema>B*1.1){bad++;calm=0}else{bad=Math.max(0,bad-1);calm+=real}
  /* slipping below roughly 55 fps for a sustained stretch: act */
  if(bad>=20){bad=0;calm=0;if(now-raised<6000)backoff=Math.min(90,backoff*2);since=0;ema=B;
   if(LX.scale>minS+.02)setScale(LX.scale-(real>B*1.8?.14:.07));else if(LX.gTier<4)tier(LX.gTier+1);return}
  /* stable for a while: first win effects back, then resolution, probing one small step at a time */
  const head=ema<B*.62?.5:1;
  if(calm>backoff*head&&ema<B*1.04){calm=0;since=0;raised=now;if(LX.gTier>0)tier(LX.gTier-1);else if(LX.scale<1)setScale(LX.scale+.05)}}})();

