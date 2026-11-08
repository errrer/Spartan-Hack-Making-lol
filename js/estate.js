/* ######## estate.js ######## */
/* ===================== estate.js ===================== */
/* ---------- The Hollow Estate: an abandoned Victorian mansion for Zombies.
   Nine rooms inside (Foyer, Dining Hall, Parlor, Ballroom, Library, Billiard Room, Kitchen, Study, Conservatory), a front lawn and a back garden with a graveyard and a crypt.
   Everything is hand-built from primitives: thousands of small parts (furniture, books, chandeliers, tombstones...) are baked into a handful of merged meshes per area, so the detail is cheap.
   Animated things (chandeliers, flames, pendulum, fountain, doors, machines, the box, ammo crates, fog, lightning) are live objects ticked from estTick().
   Only the ten or so lights nearest to you are real point lights (a pool that hands lights over smoothly as you walk), the rest are glow sprites. ---------- */
const EST={sd:1,cols:[],dyn:[],spots:[],pool:[],mach:{},fires:[],flames:[],tm:0,lt:{next:9,flash:0},bk:null,pend:[],walls:[],dust:[],lights:null};
const erand=()=>(EST.sd=(EST.sd*16807)%2147483647)/2147483647,eri=(a,b)=>a+erand()*(b-a),epk=a=>a[erand()*a.length|0],esm=u=>{u=u<0?0:u>1?1:u;return u*u*(3-2*u)};

/* ---------- procedural textures (canvas): floors, wallpaper, rugs, paintings, glow ---------- */
const ET={};
function estTx(n){if(ET[n])return ET[n];const t=ESTX[n]();t.wrapS=t.wrapT=THREE.RepeatWrapping;try{t.anisotropy=4}catch(e){}return ET[n]=t}
const eg=(g,fn)=>{g.save();fn();g.restore()};
function eStain(g,w,h,n,a){for(let i=0;i<n;i++){const x=erand()*w,y=erand()*h,r=8+erand()*40,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,`rgba(0,0,0,${a*erand()})`);gr.addColorStop(1,'rgba(0,0,0,0)');g.fillStyle=gr;g.fillRect(x-r,y-r,r*2,r*2)}}
function eCracks(g,w,h,n){g.strokeStyle='rgba(0,0,0,.35)';g.lineWidth=1;for(let i=0;i<n;i++){let x=erand()*w,y=erand()*h,a=erand()*6.28;g.beginPath();g.moveTo(x,y);for(let k=0;k<14;k++){a+=(erand()-.5)*1.1;x+=Math.cos(a)*9;y+=Math.sin(a)*9;g.lineTo(x,y)}g.stroke()}}
const ESTX={
 marble:()=>zTex(512,512,(g,w,h)=>{const T=64;for(let j=0;j<8;j++)for(let i=0;i<8;i++){const dk=(i+j)%2;const v=dk?34+erand()*10:205+erand()*24;g.fillStyle=dk?`rgb(${v},${v},${v+4})`:`rgb(${v},${v-6},${v-20})`;g.fillRect(i*T,j*T,T,T);
   g.strokeStyle=dk?'rgba(255,255,255,.1)':'rgba(90,80,70,.28)';g.lineWidth=1.2;for(let k=0;k<3;k++){g.beginPath();let x=i*T+erand()*T,y=j*T;g.moveTo(x,y);for(let s=0;s<6;s++){x+=(erand()-.5)*22;y+=T/6;g.lineTo(x,y)}g.stroke()}}
  g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=2;for(let i=0;i<=8;i++){g.beginPath();g.moveTo(i*T,0);g.lineTo(i*T,h);g.moveTo(0,i*T);g.lineTo(w,i*T);g.stroke()}eStain(g,w,h,22,.5);eCracks(g,w,h,5)}),
 parquet:()=>zTex(512,512,(g,w,h)=>{const T=64;for(let j=0;j<8;j++)for(let i=0;i<8;i++){const hz=(i+j)%2,b=[92,58,34];const v=.75+erand()*.5;for(let k=0;k<4;k++){g.fillStyle=`rgb(${b[0]*v|0},${b[1]*v|0},${b[2]*v|0})`;if(hz)g.fillRect(i*T,j*T+k*T/4,T-1,T/4-1);else g.fillRect(i*T+k*T/4,j*T,T/4-1,T-1);
    g.fillStyle='rgba(0,0,0,.18)';if(hz)g.fillRect(i*T+erand()*T,j*T+k*T/4+3,20,1);else g.fillRect(i*T+k*T/4+3,j*T+erand()*T,1,20)}}eStain(g,w,h,34,.45);eCracks(g,w,h,3)}),
 tile:()=>zTex(512,512,(g,w,h)=>{const T=64;for(let j=0;j<8;j++)for(let i=0;i<8;i++){const dk=(i+j)%2,v=dk?70+erand()*14:178+erand()*20;g.fillStyle=dk?`rgb(${v-10},${v+8},${v-6})`:`rgb(${v},${v+4},${v-4})`;g.fillRect(i*T,j*T,T,T)}
  g.strokeStyle='rgba(20,20,20,.55)';g.lineWidth=2;for(let i=0;i<=8;i++){g.beginPath();g.moveTo(i*T,0);g.lineTo(i*T,h);g.moveTo(0,i*T);g.lineTo(w,i*T);g.stroke()}eStain(g,w,h,40,.6);eCracks(g,w,h,6);g.fillStyle='rgba(90,10,10,.5)';for(let i=0;i<5;i++){g.beginPath();g.ellipse(erand()*w,erand()*h,6+erand()*20,4+erand()*12,erand()*3,0,7);g.fill()}}),
 flag:()=>zTex(512,512,(g,w,h)=>{let y=0;while(y<h){const rh=48+erand()*34;let x=-erand()*60;while(x<w){const rw=70+erand()*70,v=84+erand()*34;g.fillStyle=`rgb(${v},${v},${v+4})`;g.fillRect(x,y,rw,rh);g.strokeStyle='rgba(0,0,0,.6)';g.lineWidth=3;g.strokeRect(x,y,rw,rh);x+=rw}y+=rh}eStain(g,w,h,50,.6);eCracks(g,w,h,8);g.fillStyle='rgba(40,70,40,.25)';for(let i=0;i<20;i++)g.fillRect(erand()*w,erand()*h,10+erand()*30,4+erand()*10)}),
 terra:()=>zTex(512,512,(g,w,h)=>{const T=85;for(let j=0;j<7;j++)for(let i=0;i<7;i++){const v=erand();g.fillStyle=`rgb(${150+v*40|0},${78+v*26|0},${48+v*14|0})`;g.fillRect(i*T,j*T,T,T);g.strokeStyle='rgba(20,10,5,.6)';g.lineWidth=3;g.strokeRect(i*T,j*T,T,T)}
  eStain(g,w,h,44,.55);g.fillStyle='rgba(50,90,40,.4)';for(let i=0;i<30;i++)g.fillRect(erand()*w,erand()*h,3+erand()*14,2+erand()*6);eCracks(g,w,h,5)}),
 carpet:()=>zTex(256,256,(g,w,h)=>{g.fillStyle='#5c1a1c';g.fillRect(0,0,w,h);for(let i=0;i<2;i++)for(let j=0;j<2;j++)eg(g,()=>{g.translate(i*128+64,j*128+64);g.strokeStyle='#b08a3a';g.lineWidth=2;g.beginPath();g.moveTo(0,-44);g.lineTo(44,0);g.lineTo(0,44);g.lineTo(-44,0);g.closePath();g.stroke();g.beginPath();g.arc(0,0,22,0,7);g.stroke();g.fillStyle='#8a2a2a';g.beginPath();g.arc(0,0,9,0,7);g.fill()});
  for(let i=0;i<3000;i++){g.fillStyle=`rgba(${erand()<.5?'0,0,0':'255,200,160'},.05)`;g.fillRect(erand()*w,erand()*h,1.5,1.5)}eStain(g,w,h,10,.5)}),
 wpRed:()=>eWall('#4a1618','#6a2326','#8a5a3a'),wpGreen:()=>eWall('#1d3328','#2a4a38','#8a7a4a'),wpBlue:()=>eWall('#1a2640','#27395c','#9a8a6a'),wpCream:()=>eWall('#6e6652','#857b62','#5a4a32'),
 rugA:()=>eRug('#6a1a1c','#c9a24a','#2a0a0c'),rugB:()=>eRug('#1b2c5a','#d8c08a','#0a1228'),
 glow:()=>zTex(128,128,(g,w,h)=>{const r=g.createRadialGradient(64,64,0,64,64,64);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.25,'rgba(255,255,255,.45)');r.addColorStop(.6,'rgba(255,255,255,.1)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,w,h)}),
 smoke:()=>zTex(128,128,(g,w,h)=>{for(let i=0;i<9;i++){const x=40+erand()*48,y=40+erand()*48,r=22+erand()*26,gr=g.createRadialGradient(x,y,0,x,y,r);gr.addColorStop(0,'rgba(255,255,255,.4)');gr.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=gr;g.fillRect(0,0,w,h)}}),
 web:()=>zTex(128,128,(g,w,h)=>{g.strokeStyle='rgba(235,235,235,.75)';g.lineWidth=1;for(let i=0;i<9;i++){const a=i/8*Math.PI*.5;g.beginPath();g.moveTo(0,0);g.lineTo(Math.cos(a)*126,Math.sin(a)*126);g.stroke()}for(let r=14;r<126;r+=14+erand()*8){g.beginPath();for(let i=0;i<=8;i++){const a=i/8*Math.PI*.5,k=r*(.86+erand()*.2);g.lineTo(Math.cos(a)*k,Math.sin(a)*k)}g.stroke()}}),
 gold:()=>zTex(64,64,(g,w,h)=>{g.fillStyle='#b8902f';g.fillRect(0,0,w,h);for(let i=0;i<60;i++){g.fillStyle=`rgba(${erand()<.5?'255,230,150':'60,40,0'},.25)`;g.fillRect(erand()*w,erand()*h,2+erand()*8,1)}})
};
for(let i=0;i<6;i++)ESTX['p'+i]=()=>ePaint(i);
function eWall(a,b,c){return zTex(256,256,(g,w,h)=>{g.fillStyle=a;g.fillRect(0,0,w,h);for(let x=0;x<w;x+=32){g.fillStyle='rgba(255,255,255,.035)';g.fillRect(x,0,14,h)}
 const m=(cx,cy)=>eg(g,()=>{g.translate(cx,cy);g.fillStyle=b;g.beginPath();g.moveTo(0,-34);g.bezierCurveTo(22,-16,22,16,0,34);g.bezierCurveTo(-22,16,-22,-16,0,-34);g.fill();g.fillStyle=c;g.globalAlpha=.5;g.beginPath();g.arc(0,0,6,0,7);g.fill();g.beginPath();g.moveTo(0,-26);g.lineTo(6,-12);g.lineTo(0,-6);g.lineTo(-6,-12);g.closePath();g.fill();g.beginPath();g.moveTo(0,26);g.lineTo(6,12);g.lineTo(0,6);g.lineTo(-6,12);g.closePath();g.fill()});
 for(let i=0;i<2;i++)for(let j=0;j<2;j++){m(i*128+64,j*128+64);m(i*128,j*128+(j?0:0))}
 for(let i=0;i<30;i++){const x=erand()*w,y=erand()*h;g.fillStyle=`rgba(${erand()<.5?'0,0,0':'200,190,170'},.1)`;g.fillRect(x,y,2+erand()*20,12+erand()*60)}eStain(g,w,h,12,.5)})}
function eRug(a,b,c){return zTex(256,256,(g,w,h)=>{g.fillStyle=c;g.fillRect(0,0,w,h);g.fillStyle=a;g.fillRect(10,10,w-20,h-20);g.strokeStyle=b;g.lineWidth=4;g.strokeRect(18,18,w-36,h-36);g.lineWidth=2;g.strokeRect(30,30,w-60,h-60);
 g.translate(w/2,h/2);g.fillStyle=c;g.beginPath();g.moveTo(0,-70);g.lineTo(70,0);g.lineTo(0,70);g.lineTo(-70,0);g.closePath();g.fill();g.strokeStyle=b;g.lineWidth=3;g.stroke();g.fillStyle=b;g.beginPath();g.arc(0,0,26,0,7);g.fill();g.fillStyle=a;g.beginPath();g.arc(0,0,14,0,7);g.fill();
 for(let k=0;k<12;k++){g.save();g.rotate(k*Math.PI/6);g.fillStyle=b;g.fillRect(-2,-110,4,14);g.restore()}g.setTransform(1,0,0,1,0,0);for(let i=0;i<2500;i++){g.fillStyle=`rgba(${erand()<.6?'0,0,0':'255,230,200'},.07)`;g.fillRect(erand()*w,erand()*h,1.5,1.5)}eStain(g,w,h,16,.55)})}
function ePaint(n){return zTex(256,320,(g,w,h)=>{const bg=['#1a1612','#12171c','#1c1418','#14181a','#201a12','#0e1014'][n];g.fillStyle=bg;g.fillRect(0,0,w,h);const gr=g.createLinearGradient(0,0,0,h);gr.addColorStop(0,'rgba(120,100,70,.25)');gr.addColorStop(1,'rgba(0,0,0,.6)');g.fillStyle=gr;g.fillRect(0,0,w,h);
 if(n<3||n==5){const sk=['#cdb59a','#b8a090','#c9b8a0'][n%3];g.fillStyle=n==5?'#0c0c10':['#2a2020','#1c2430','#34202a'][n];g.beginPath();g.moveTo(30,h);g.quadraticCurveTo(40,200,100,190);g.lineTo(156,190);g.quadraticCurveTo(216,200,226,h);g.fill();g.fillStyle=sk;g.beginPath();g.ellipse(128,128,38,50,0,0,7);g.fill();g.fillStyle='#1a1210';g.fillRect(100,176,56,16);
  g.fillStyle='rgba(0,0,0,.75)';g.beginPath();g.ellipse(112,122,9,6,0,0,7);g.ellipse(144,122,9,6,0,0,7);g.fill();g.fillStyle='rgba(0,0,0,.35)';g.beginPath();g.ellipse(128,150,10,5,0,0,7);g.fill();g.fillStyle=n==1?'#cfcfd4':'#2a1a10';g.beginPath();g.ellipse(128,86,42,26,0,Math.PI,0);g.fill();
  if(n==5){g.fillStyle='rgba(255,40,40,.9)';g.beginPath();g.arc(112,122,3,0,7);g.arc(144,122,3,0,7);g.fill()}}
 else if(n==3){g.fillStyle='#e8dcb0';g.beginPath();g.arc(180,70,28,0,7);g.fill();g.fillStyle='#10161c';g.beginPath();g.moveTo(0,240);g.quadraticCurveTo(80,170,150,220);g.quadraticCurveTo(210,190,256,230);g.lineTo(256,h);g.lineTo(0,h);g.fill();g.strokeStyle='#05080a';g.lineWidth=5;g.beginPath();g.moveTo(60,260);g.lineTo(60,190);g.moveTo(60,210);g.lineTo(84,186);g.moveTo(60,226);g.lineTo(36,204);g.stroke()}
 else{g.fillStyle='#3a1a14';g.beginPath();g.ellipse(128,230,70,16,0,0,7);g.fill();g.fillStyle='#8a2a1a';for(let i=0;i<5;i++){g.beginPath();g.arc(88+i*20,208-(i%2)*10,12,0,7);g.fill()}g.fillStyle='#3a5a2a';g.beginPath();g.ellipse(160,200,22,10,.5,0,7);g.fill();g.fillStyle='#c8b070';g.fillRect(60,140,8,70);g.fillRect(52,134,24,8)}
 eStain(g,w,h,14,.7);for(let i=0;i<5;i++){g.strokeStyle='rgba(220,210,190,.18)';g.beginPath();g.moveTo(erand()*w,erand()*h);g.lineTo(erand()*w,erand()*h);g.stroke()}})}

/* ---------- materials for baked geometry (vertex coloured so thousands of parts share a handful of materials) ---------- */
const EMC={};
function eMat(cls){if(EMC[cls])return EMC[cls];const R={s:[.92,0],w:[.52,0],m:[.42,.85],g:[.26,1],f:[1,0],c:[.7,.02],gl:[.06,.1],r:[.95,0]}[cls]||[.9,0];let m;
 if(cls=='e')m=new THREE.MeshBasicMaterial({vertexColors:true});
 else if(!LX.pbr)m=new THREE.MeshLambertMaterial({vertexColors:true});
 else m=LX.patch(new THREE.MeshStandardMaterial({vertexColors:true,roughness:R[0],metalness:R[1],envMapIntensity:cls=='m'||cls=='g'?1.35:.7}),{});
 if(cls=='gl'){m.transparent=true;m.opacity=.3;m.depthWrite=false}return EMC[cls]=m}
const ETM={};
function eTexMat(n){if(ETM[n])return ETM[n];const t=estTx(n);let m;
 if(!LX.pbr)m=new THREE.MeshLambertMaterial({map:t,vertexColors:true});else m=LX.patch(new THREE.MeshStandardMaterial({map:t,vertexColors:true,roughness:n=='gold'?.3:.9,metalness:n=='gold'?.9:0,envMapIntensity:.6}),{});
 if(n=='web'){m.transparent=true;m.depthWrite=false;m.side=THREE.DoubleSide}return ETM[n]=m}

/* ---------- the baker: primitives are transformed into world space and merged per area and material ---------- */
const GB=new THREE.BoxGeometry(1,1,1),GP=new THREE.PlaneGeometry(1,1),GCY={},GSP={},GTO={};
const gCy=(rt,rb,seg)=>{const k=rt.toFixed(3)+'_'+rb.toFixed(3)+'_'+seg;return GCY[k]||(GCY[k]=new THREE.CylinderGeometry(rt,rb,1,seg,1))};
const gSp=seg=>GSP[seg]||(GSP[seg]=new THREE.SphereGeometry(1,seg,Math.max(4,seg*.7|0)));
const gTo=(r,seg)=>{const k=r.toFixed(3)+'_'+seg;return GTO[k]||(GTO[k]=new THREE.TorusGeometry(1,r,6,seg))};
function mkBake(){const acc={},st=[new THREE.Matrix4()],yw=[0],tmp=new THREE.Vector3(),nm=new THREE.Matrix3(),col=new THREE.Color(),Q=new THREE.Quaternion(),E=new THREE.Euler(),Pv=new THREE.Vector3(),Sv=new THREE.Vector3();
 const mat=(x,y,z,sx,sy,sz,rx,ry,rz)=>{E.set(rx||0,ry||0,rz||0,'YXZ');Q.setFromEuler(E);Pv.set(x,y,z);Sv.set(sx,sy,sz);return new THREE.Matrix4().compose(Pv,Q,Sv)};
 const B={area:'x',acc,
  push(x,y,z,ry,rx,rz){const m=new THREE.Matrix4().makeRotationFromEuler(new THREE.Euler(rx||0,ry||0,rz||0,'YXZ'));m.setPosition(x,y,z);st.push(st[st.length-1].clone().multiply(m));yw.push((yw[yw.length-1]||0)+(ry||0))},pop(){if(st.length>1){st.pop();yw.pop()}},
  at(x,y,z,ry,fn,rx,rz){B.push(x,y,z,ry,rx,rz);try{fn()}finally{B.pop()}},yaw(){return yw[yw.length-1]||0},
  geo(g,lm,c,cls,tex,su,sv){const key=B.area+'|'+(tex||cls);let a=acc[key];if(!a)a=acc[key]={cls,tex,p:[],n:[],c:[],u:[],i:[]};
   const m=st[st.length-1].clone().multiply(lm);nm.getNormalMatrix(m);const pos=g.attributes.position,nor=g.attributes.normal,uv=g.attributes.uv,base=a.p.length/3;col.set(c);const tn=1+(erand()-.5)*.1,r=col.r*tn,gg=col.g*tn,b=col.b*tn;
   for(let i=0;i<pos.count;i++){tmp.fromBufferAttribute(pos,i).applyMatrix4(m);a.p.push(tmp.x,tmp.y,tmp.z);tmp.fromBufferAttribute(nor,i).applyMatrix3(nm).normalize();a.n.push(tmp.x,tmp.y,tmp.z);a.c.push(r,gg,b);a.u.push(uv?uv.getX(i)*(su||1):0,uv?uv.getY(i)*(sv||1):0)}
   const ix=g.index;if(ix)for(let i=0;i<ix.count;i++)a.i.push(base+ix.getX(i));else for(let i=0;i<pos.count;i++)a.i.push(base+i)},
  /* centre-positioned box */
  box(x,y,z,w,h,d,c,cls,ry,rx,rz){B.geo(GB,mat(x,y,z,w,h,d,rx,ry,rz),c,cls||'s')},
  /* box standing on y0 */
  bot(x,y0,z,w,h,d,c,cls,ry){B.geo(GB,mat(x,y0+h/2,z,w,h,d,0,ry,0),c,cls||'s')},
  cyl(x,y0,z,rt,rb,h,c,cls,seg,rx,ry,rz){const mx=Math.max(rt,rb,1e-4);B.geo(gCy(rt/mx,rb/mx,seg||10),mat(x,y0+h/2,z,mx,h,mx,rx,ry,rz),c,cls||'s')},
  /* cylinder between two points (beams, pipes, branches) */
  rod(x0,y0,z0,x1,y1,z1,r0,r1,c,cls,seg){const dx=x1-x0,dy=y1-y0,dz=z1-z0,L=Math.hypot(dx,dy,dz)||1e-3,ry=Math.atan2(dx,dz),rx=Math.acos(dy/L);const mx=Math.max(r0,r1,1e-4);B.geo(gCy(r1/mx,r0/mx,seg||6),mat((x0+x1)/2,(y0+y1)/2,(z0+z1)/2,mx,L,mx,rx,ry,0),c,cls||'w')},
  sph(x,y,z,a,b,d,c,cls,seg){B.geo(gSp(seg||8),mat(x,y,z,a,b,d),c,cls||'s')},
  tor(x,y,z,R,t,c,cls,rx,ry,rz,seg){B.geo(gTo(t/R,seg||14),mat(x,y,z,R,R,R,rx,ry,rz),c,cls||'m')},
  lathe(x,y0,z,pts,c,cls,seg,ry){const g=new THREE.LatheGeometry(pts.map(p=>new THREE.Vector2(p[0],p[1])),seg||12);B.geo(g,mat(x,y0,z,1,1,1,0,ry,0),c,cls||'s');g.dispose()},
  ext(shape,depth,x,y,z,c,cls,rx,ry,rz){const g=new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:false,curveSegments:8});g.translate(0,0,-depth/2);B.geo(g,mat(x,y,z,1,1,1,rx,ry,rz),c,cls||'s');g.dispose()},
  quad(x,y,z,w,h,c,cls,rx,ry,tex,su,sv){B.geo(GP,mat(x,y,z,w,h,1,rx,ry,0),c,cls||'s',tex,su,sv)},
  /* collision footprint of the current local rectangle (rotations are multiples of 90 degrees), added to the map as an invisible solid */
  solid(lx,lz,w,d,h,y0){const m=st[st.length-1],xs=[],zs=[];for(const[a,b]of[[-1,-1],[1,-1],[1,1],[-1,1]]){tmp.set(lx+a*w/2,0,lz+b*d/2).applyMatrix4(m);xs.push(tmp.x);zs.push(tmp.z)}
   const x0=Math.min(...xs),x1=Math.max(...xs),z0=Math.min(...zs),z1=Math.max(...zs);EST.cols.push([(x0+x1)/2,(z0+z1)/2,x1-x0,z1-z0,h,y0||0,0,'n']);return[x0,z0,x1,z1]},
  where(lx,lz){tmp.set(lx,0,lz).applyMatrix4(st[st.length-1]);return[tmp.x,tmp.z]},
  build(g){const out=[];for(const k in acc){const a=acc[k];if(!a.p.length)continue;const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(a.p,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(a.n,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(a.c,3));geo.setAttribute('uv',new THREE.Float32BufferAttribute(a.u,2));geo.setIndex(new THREE.BufferAttribute(new Uint32Array(a.i),1));
    const m=new THREE.Mesh(geo,a.tex?eTexMat(a.tex):eMat(a.cls));m.castShadow=m.receiveShadow=a.cls!='e'&&a.cls!='gl'&&!a.tex||a.cls=='r';if(a.cls=='e'||a.cls=='gl'||a.tex=='web'){m.castShadow=false;m.receiveShadow=false}g.add(m);out.push(m)}return out}};
 return B}


/* ---------- glow points (flames, halos), light spots and the live decoration list ---------- */
const EC={wood:0x4a2f1c,dwood:0x2c1b10,lwood:0x6d4a2b,brass:0xb08a3a,iron:0x24262a,stone:0x7a766c,dstone:0x4d4a44,marble:0xcfc8b8,candle:0xe6d9b0,cloth:0xcfc4aa,rust:0x5a3a28,bone:0xd8d0b8,moss:0x35452a,red:0x6a1c24,green:0x2a4632,blue:0x23365a,gold:0xc9a23a,velvet:0x4a1220,black:0x101114};
function eSpot(x,y,z,col,I,dist,fl,ph){EST.spots.push({x,y,z,col,I,d:dist,fl:fl==null?1:fl,ph:ph==null?erand()*50:ph,cur:0,want:0,L:null})}
function ePt(sys,x,y,z,r,g,b,fl){const s=EST.pts[sys];s.p.push(x,y,z);s.c.push(r,g,b);s.f.push(fl==null?1:fl,erand()*50);s.base.push(r,g,b)}
function eFlame(x,y,z,k,light){/* a candle-sized flame: glow + soft halo (+ optionally a real light that is handed over by the pool) */
 ePt('f',x,y,z,1,.62,.26,1);ePt('h',x,y+.05,z,.2*(k||1),.1*(k||1),.04*(k||1),1);if(light)eSpot(x,y+.2,z,0xffa958,light[0],light[1],1)}
function eBig(x,y,z,k,light){/* big fire: fireplace, brazier, torch */
 ePt('F',x,y,z,1,.55,.2,1);ePt('F',x+(erand()-.5)*.2,y+.15,z+(erand()-.5)*.2,1,.7,.3,1);ePt('H',x,y+.3,z,.35*(k||1),.16*(k||1),.05*(k||1),1);EST.fires.push({x,y,z});if(light)eSpot(x,y+.4,z,0xff8a3a,light[0],light[1],1)}
function eHalo(x,y,z,r,g,b,sys){ePt(sys||'H',x,y,z,r,g,b,0)}
function eGlass(x,y,z,w,h,rx,ry,col,o){/* an additive glow quad (moonlight patches, window glow) */const m=new THREE.Mesh(GP,new THREE.MeshBasicMaterial({map:estTx('glow'),color:col,transparent:true,opacity:o||.3,blending:THREE.AdditiveBlending,depthWrite:false,fog:false}));m.scale.set(w,h,1);m.position.set(x,y,z);m.rotation.set(rx||0,ry||0,0);EST.pend.push(m);return m}
const eWor=(lx,ly,lz)=>{const t=new THREE.Vector3(lx,ly,lz).applyMatrix4(EST.bk.top());return t};

/* ---------- furniture. Local origin = the middle of the base, the front faces +z ---------- */
const FUR={
 chair(c,tilt){c=c||EC.wood;BK.bot(0,.43,0,.5,.07,.5,c,'w');BK.bot(0,.5,.01,.42,.06,.42,EC.red,'f');for(const[x,z]of[[-.21,-.21],[.21,-.21],[-.21,.21],[.21,.21]])BK.cyl(x,0,z,.03,.024,.43,c,'w',6);
  for(const x of[-.21,.21])BK.cyl(x,.5,-.23,.026,.026,.62,c,'w',6);BK.bot(0,.98,-.23,.46,.1,.05,c,'w');for(let i=0;i<3;i++)BK.bot(-.12+i*.12,.58,-.23,.045,.4,.03,c,'w');BK.solid(0,0,.5,.5,.9)},
 stool(c){c=c||EC.wood;BK.cyl(0,.4,0,.2,.2,.07,c,'w',10);BK.sph(0,.46,0,.18,.05,.18,EC.red,'f');for(const a of[0,2.1,4.2])BK.rod(Math.cos(a)*.16,0,Math.sin(a)*.16,Math.cos(a)*.1,.4,Math.sin(a)*.1,.025,.02,c,'w');BK.solid(0,0,.4,.4,.5)},
 table(w,d,h,c,cloth){c=c||EC.wood;BK.bot(0,h-.07,0,w,.07,d,c,'w');BK.bot(0,h-.0,0,w+.04,.012,d+.04,EC.lwood,'w');for(const s of[-1,1]){BK.bot(0,h-.2,s*(d/2-.07),w-.2,.13,.04,c,'w');BK.bot(s*(w/2-.07),h-.2,0,.04,.13,d-.2,c,'w')}
  for(const sx of[-1,1])for(const sz of[-1,1])BK.lathe(sx*(w/2-.09),0,sz*(d/2-.09),[[.05,0],[.06,.04],[.035,.3],[.055,h*.55],[.035,h*.7],[.05,h-.2]],c,'w',8);
  if(cloth){BK.bot(0,h+.012,0,w+.1,.016,d+.1,cloth,'f');for(let i=0;i<7;i++){const L=.25+erand()*.45;BK.bot(-w/2-.05+(i+.5)*(w+.1)/7,h-L,d/2+.05,(w+.1)/7-.01,L,.016,cloth,'f')}for(let i=0;i<4;i++){const L=.2+erand()*.4;BK.bot(-w/2-.05,h-L,-d/2-.05+(i+.5)*(d+.1)/4,.016,L,(d+.1)/4-.01,cloth,'f')}}BK.solid(0,0,w,d,h)},
 couch(w,c){c=c||EC.red;const n=Math.max(2,Math.round(w/.8)),cw=(w-.5)/n;BK.bot(0,.12,0,w,.28,.9,EC.dwood,'w');for(let i=0;i<n;i++){BK.bot(-w/2+.25+(i+.5)*cw,.38,.06,cw-.02,.16,.74,c,'f');BK.sph(-w/2+.25+(i+.5)*cw,.57,-.3,cw*.5,.18,.12,c,'f',7)}
  BK.bot(0,.28,-.38,w,.55,.18,c,'f');BK.sph(0,.84,-.38,w*.5,.07,.12,c,'f',8);for(const s of[-1,1]){BK.bot(s*(w/2-.12),.28,0,.24,.34,.9,c,'f');BK.sph(s*(w/2-.12),.62,.05,.13,.1,.4,c,'f',7);BK.sph(s*(w/2-.12),.42,.45,.12,.12,.12,c,'f',7)}
  for(const sx of[-1,1])for(const sz of[-1,1])BK.cyl(sx*(w/2-.08),0,sz*.38,.04,.025,.1,EC.dwood,'w',6);BK.solid(0,0,w,.95,.9)},
 armchair(c){FUR.couch(1.0,c||EC.green)},
 bed(c){BK.bot(0,.25,0,1.6,.35,2.1,EC.dwood,'w');BK.bot(0,.5,.05,1.5,.2,2.0,EC.cloth,'f');BK.bot(0,.4,-1.05,1.65,1.2,.1,EC.wood,'w');BK.solid(0,0,1.7,2.2,.8)},
 bookcase(w,h,rot){w=w||1.4;h=h||2.4;const d=.38;BK.bot(0,0,0,w,h,.04,EC.dwood,'w');for(const s of[-1,1])BK.bot(s*(w/2-.02),0,d/2-.02,.04,h,d,EC.wood,'w');BK.bot(0,h-.04,d/2-.02,w,.07,d,EC.wood,'w');BK.bot(0,0,d/2-.02,w,.12,d,EC.wood,'w');BK.bot(0,h,d/2-.02,w+.06,.06,d+.06,EC.dwood,'w');
  const cols=[0x5a2a1e,0x7a3a22,0x2a3a5a,0x2a4a32,0x1c1c20,0x6a5a2a,0x4a2a3a,0x8a7a5a,0x3a2a1a],rows=Math.floor((h-.15)/.38);
  for(let r=0;r<rows;r++){const y=.14+r*.38;BK.bot(0,y,d/2-.02,w-.06,.025,d-.04,EC.wood,'w');let x=-w/2+.06;while(x<w/2-.08){if(erand()<.08){x+=.1+erand()*.2;continue}const bw=.025+erand()*.04,bh=.22+erand()*.12,tl=erand()<.06?(erand()-.5)*.5:0;BK.bot(x+bw/2,y+.025,d/2,bw,bh,.24,epk(cols),'f',0);if(tl)BK.box(x+bw/2,y+.025+bh/2,d/2,bw,bh,.24,epk(cols),'f',0,0,tl);x+=bw+.002}}
  BK.solid(0,d/2-.02,w,d,h)},
 wardrobe(){BK.bot(0,0,0,1.3,2.2,.6,EC.wood,'w');BK.bot(0,.05,.31,.6,2.0,.03,EC.dwood,'w');BK.bot(.33,.05,.31,.6,2.0,.03,EC.dwood,'w');BK.sph(-.05,1.1,.34,.03,.03,.03,EC.brass,'g',6);BK.sph(.05,1.1,.34,.03,.03,.03,EC.brass,'g',6);BK.bot(0,2.2,0,1.4,.12,.7,EC.dwood,'w');BK.solid(0,0,1.4,.7,2.3)},
 crate(s){s=s||.8;BK.bot(0,0,0,s,s,s,EC.lwood,'w');for(const y of[.04,s-.1])BK.bot(0,y,0,s+.04,.07,s+.04,EC.wood,'w');for(const x of[-1,1])BK.bot(x*(s/2),0,0,.06,s,s+.02,EC.wood,'w');BK.solid(0,0,s,s,s)},
 barrel(){BK.lathe(0,0,0,[[.3,0],[.36,.1],[.4,.45],[.36,.82],[.3,.9]],EC.wood,'w',12);for(const y of[.14,.44,.76])BK.tor(0,y,0,y==.44?.405:.35,.018,EC.iron,'m',Math.PI/2,0,0,12);BK.solid(0,0,.8,.8,.9)},
 sack(){BK.sph(0,.28,0,.3,.3,.26,0x8a7a58,'f',8);BK.sph(0,.55,0,.12,.1,.1,0x8a7a58,'f',6);BK.solid(0,0,.6,.55,.55)},
 urn(c){BK.lathe(0,0,0,[[.12,0],[.2,.08],[.26,.3],[.18,.52],[.12,.6],[.16,.68]],c||EC.marble,'s',10);BK.tor(.26,.28,0,.02,.04,c||EC.marble,'s',0,0,0);BK.solid(0,0,.5,.5,.7)},
 vase(c){BK.lathe(0,0,0,[[.06,0],[.11,.1],[.14,.28],[.08,.5],[.06,.62],[.1,.72]],c||0x2a4a6a,'c',10)},
 rubble(r){r=r||1;for(let i=0;i<7;i++){const a=erand()*6.28,d=erand()*r*.6;BK.sph(Math.cos(a)*d,.12*erand(),Math.sin(a)*d,.18+erand()*.28,.12+erand()*.18,.16+erand()*.26,erand()<.5?EC.dstone:0x6a5a4a,'s',5)}BK.solid(0,0,r*1.3,r*1.3,.55)},
 beam(len,ry){BK.rod(-len/2,.5+erand()*.6,0,len/2,.1,0,.14,.13,EC.dwood,'w',5)},
 candelabra(h,n,light){h=h||1.3;n=n||5;BK.lathe(0,0,0,[[.16,0],[.18,.03],[.06,.08],[.04,.5],[.07,h*.7],[.03,h*.85]],EC.brass,'g',10);const y=h*.78;
  for(let i=0;i<n;i++){const a=(i/n)*Math.PI*2,r=n>1?.2:0,x=Math.cos(a)*r,z=Math.sin(a)*r;BK.rod(0,y-.05,0,x,y+.05,z,.012,.01,EC.brass,'g',5);BK.cyl(x,y+.05,z,.03,.03,.04,EC.brass,'g',6);const ch=.1+erand()*.12;BK.cyl(x,y+.09,z,.016,.018,ch,EC.candle,'c',6);const w=BK.where(x,y+.09+ch+.03);eFlame(w[0],w[1],w[2],1,i==0&&light?light:null)}
  BK.solid(0,0,.4,.4,h)},
 candles(n){for(let i=0;i<(n||4);i++){const x=(erand()-.5)*.5,z=(erand()-.5)*.5,h=.06+erand()*.2;BK.cyl(x,0,z,.02,.022,h,EC.candle,'c',6);BK.sph(x,h*.5,z,.03,h*.3,.03,EC.candle,'c',5);const w=BK.where(x,h+.04);eFlame(w[0],w[1]-.02,w[2],.7)}},
 skull(){BK.sph(0,.08,0,.08,.075,.09,EC.bone,'s',7);BK.box(0,.03,.03,.07,.04,.06,EC.bone,'s');BK.sph(-.03,.09,.07,.02,.025,.02,0x080808,'s',5);BK.sph(.03,.09,.07,.02,.025,.02,0x080808,'s',5)},
 bones(){for(let i=0;i<5;i++)BK.rod((erand()-.5)*.5,.03,(erand()-.5)*.5,(erand()-.5)*.5,.04,(erand()-.5)*.5,.018,.018,EC.bone,'s',5);for(let i=0;i<3;i++)BK.at((erand()-.5)*.4,0,(erand()-.5)*.4,erand()*6,()=>FUR.skull())},
 web(s,ry){BK.quad(0,0,0,s,s,0xffffff,'s',0,ry||0,'web',1,1)},
 painting(w,h,tex,ry){const f=.09;BK.at(0,0,0,ry||0,()=>{BK.box(0,0,-.02,w+.2,h+.2,.05,0x241a10,'w');BK.quad(0,0,.01,w,h,0xffffff,'s',0,0,'p'+tex,1,1);for(const[x,y,a,b]of[[0,h/2+f/2,w+.2,f],[0,-h/2-f/2,w+.2,f],[-w/2-f/2,0,f,h+.2],[w/2+f/2,0,f,h+.2]])BK.box(x,y,.01,a,b,.08,EC.gold,'g');
   BK.box(0,h/2+.2,.04,.5,.07,.07,EC.brass,'g');BK.sph(0,h/2+.2,.1,.09,.09,.05,EC.brass,'g',5)})},
 mirror(w,h,ry){BK.at(0,0,0,ry||0,()=>{BK.box(0,0,-.02,w+.3,h+.3,.06,EC.gold,'g');BK.box(0,0,.02,w,h,.02,0x7c8a94,'g');for(let i=0;i<3;i++)BK.rod((erand()-.5)*w,h/2*(erand()-.5)*2,.04,(erand()-.5)*w,h/2*(erand()-.5)*2,.04,.003,.003,0x0a0a0a,'s')})},
 armor(ry){BK.at(0,0,0,ry||0,()=>{BK.bot(0,0,0,.7,.14,.7,EC.dstone,'s');for(const x of[-.11,.11]){BK.bot(x,.14,0,.14,.06,.28,0x4a4c52,'m');BK.cyl(x,.2,-.02,.065,.075,.4,0x6a6c72,'m',8);BK.sph(x,.62,0,.09,.09,.09,0x7a7c82,'m',7);BK.cyl(x,.64,-.02,.08,.07,.42,0x6a6c72,'m',8)}BK.cyl(0,1.05,0,.2,.15,.1,0x5a5c62,'m',8);BK.lathe(0,1.12,0,[[.14,0],[.27,.15],[.28,.38],[.2,.55],[.1,.62]],0x7a7c82,'m',10);BK.box(0,1.45,.2,.28,.12,.04,0x5a5c62,'m');
   for(const s of[-1,1]){BK.sph(s*.34,1.62,0,.12,.1,.12,0x8a8c92,'m',7);BK.rod(s*.38,1.6,0,s*.4,1.15,.15,.06,.05,0x6a6c72,'m');BK.sph(s*.4,1.1,.17,.06,.06,.06,0x50525a,'m',6)}
   BK.cyl(0,1.74,0,.08,.1,.1,0x6a6c72,'m',8);BK.sph(0,1.92,0,.15,.17,.16,0x8a8c92,'m',9);BK.box(0,1.92,.14,.2,.025,.04,0x050505,'s');BK.rod(0,2.05,-.02,0,2.2,-.12,.03,.01,EC.red,'f',5);BK.rod(.42,.1,.15,.42,2.4,.15,.02,.02,0x4a3a28,'w',5);BK.ext(eShape([[0,0],[.08,.2],[0,.45],[-.08,.2]]),.025,.42,2.5,.15,0x9a9ca2,'m');BK.solid(0,0,.7,.7,2.3)})},
 statue(kind,ry){BK.at(0,0,0,ry||0,()=>{const c=EC.marble;BK.bot(0,0,0,1.0,.18,1.0,EC.dstone,'s');BK.bot(0,.18,0,.8,.7,.8,0x8a867a,'s');BK.bot(0,.88,0,.9,.08,.9,EC.dstone,'s');
   BK.lathe(0,.96,0,[[.28,0],[.3,.2],[.22,.7],[.18,.9],[.1,1.0],[.07,1.1]],c,'s',12);BK.sph(0,2.12,.0,.13,.16,.14,c,'s',9);BK.sph(0,2.2,-.02,.14,.1,.15,c,'s',8);
   if(kind=='angel'){for(const s of[-1,1]){BK.ext(eShape([[0,0],[.5,.5],[.95,1.2],[.9,1.7],[.55,1.35],[.3,.8],[.08,.4]].map(p=>[p[0]*s,p[1]])),.04,s*.05,1.2,-.22,c,'s',0,s*.5,0)}BK.rod(.14,1.8,.05,.3,1.5,.35,.05,.04,c,'s');BK.rod(-.14,1.8,.05,-.2,1.9,.35,.05,.04,c,'s')}
   else{BK.rod(.2,1.8,0,.28,1.35,.2,.055,.045,c,'s');BK.rod(-.2,1.8,0,-.28,1.35,.2,.055,.045,c,'s');BK.sph(0,1.5,.27,.12,.12,.12,c,'s',7)}
   BK.sph(.25,.92,.3,.12,.07,.1,0x4a5a34,'s',6);BK.solid(0,0,1,1,2.4)})},
 clock(ry){BK.at(0,0,0,ry||0,()=>{BK.bot(0,0,0,.6,.22,.4,EC.dwood,'w');BK.bot(0,.22,0,.46,1.4,.32,EC.wood,'w');BK.bot(0,1.62,0,.58,.62,.36,EC.dwood,'w');BK.cyl(0,1.9,.19,.22,.22,.02,0xdcd2b0,'s',16,Math.PI/2);BK.tor(0,1.9,.2,.22,.02,EC.brass,'g',0,0,0,16);BK.box(0,1.9,.2,.015,.15,.01,0x101010,'s');BK.box(.05,1.9,.2,.1,.012,.01,0x101010,'s',0,0,.6);
   BK.bot(0,2.24,0,.64,.1,.4,EC.wood,'w');BK.sph(0,2.4,0,.1,.1,.1,EC.brass,'g',7);BK.bot(0,.5,.17,.3,.9,.02,0x2a1c10,'gl');BK.solid(0,0,.6,.4,2.5);const w=BK.where(0,.62),yw=BK.yaw();EST.pendulum=EST.pendulum||[];EST.pendulum.push({x:w[0],y:w[1]+.9,z:w[2],yaw:yw})})},
 fireplace(f){/* facing +z, against the wall at z=-.45 */BK.bot(0,0,0,2.6,.14,1.0,EC.dstone,'s');for(const s of[-1,1]){BK.bot(s*1.0,.14,-.25,.45,1.5,.45,EC.stone,'s');BK.bot(s*1.0,.14,-.0,.52,.12,.12,EC.dstone,'s');BK.sph(s*1.0,1.68,-.02,.3,.1,.3,EC.stone,'s',6)}
  BK.bot(0,1.55,-.25,2.6,.2,.5,EC.stone,'s');BK.bot(0,1.75,-.28,2.9,.1,.58,EC.dstone,'s');BK.bot(0,1.85,-.35,1.8,2.2,.3,EC.stone,'s');BK.bot(0,.14,-.4,1.6,1.4,.1,0x0e0c0a,'s');BK.bot(0,.14,-.32,1.6,.05,.4,EC.iron,'m');
  for(let i=0;i<3;i++)BK.cyl(-.4+i*.4,.22+(i%2)*.1,-.12,.07,.06,.8,0x2a1a10,'w',6,0,0,Math.PI/2);BK.rod(-.7,.14,.02,-.7,.7,.02,.025,.025,EC.iron,'m');BK.rod(.7,.14,.02,.7,.7,.02,.025,.025,EC.iron,'m');
  BK.at(.8,1.95,-.1,0,()=>FUR.candles(3));BK.at(-.8,1.95,-.1,.5,()=>FUR.skull());BK.solid(0,-.2,2.9,1.2,1.9);const w=BK.where(0,.3);eBig(w[0],w[1],w[2],1.4,[2.4,15])},
 piano(){const sh=new THREE.Shape();sh.moveTo(-.7,-1);sh.lineTo(.7,-1);sh.lineTo(.7,.2);sh.bezierCurveTo(.72,.8,.3,1.15,-.2,1.1);sh.bezierCurveTo(-.5,1,-.7,.8,-.7,.4);sh.lineTo(-.7,-1);BK.ext(sh,.2,0,.88,0,EC.black,'g',-Math.PI/2,0,0);
  const sh2=new THREE.Shape();sh2.moveTo(-.66,-.4);sh2.lineTo(.66,-.4);sh2.lineTo(.66,.2);sh2.bezierCurveTo(.68,.76,.3,1.08,-.2,1.04);sh2.bezierCurveTo(-.46,.95,-.66,.78,-.66,.4);sh2.lineTo(-.66,-.4);BK.ext(sh2,.025,0,1.0,0,0x16161a,'g',-Math.PI/2,0,0);BK.rod(.55,1.0,.05,.55,1.28,.05,.012,.012,EC.black,'g');
  BK.bot(0,.9,1.01,1.3,.1,.14,0xeae2cc,'s');for(let i=0;i<26;i++){BK.bot(-.62+i*.0485,.83,1.02,.044,.06,.2,0xeae2cc,'s');if(i%7!=2&&i%7!=6)BK.bot(-.62+i*.0485+.024,.88,.98,.025,.04,.12,0x101010,'s')}
  BK.bot(0,1.0,.72,1.46,.02,.4,0x0a0a0c,'s');BK.rod(0,1.0,.9,0,1.34,.9,.02,.02,EC.black,'g');BK.bot(0,1.14,.9,.5,.3,.03,EC.black,'g');
  for(const[x,z]of[[-.62,.9],[.62,.9],[0,-.9]])BK.lathe(x,0,z,[[.06,0],[.09,.05],[.05,.2],[.07,.6],[.05,.84]],EC.black,'g',8);BK.rod(0,.1,.9,0,.16,.7,.015,.015,EC.brass,'g');BK.sph(-.1,.12,.75,.04,.02,.05,EC.brass,'g',5);BK.sph(.1,.12,.75,.04,.02,.05,EC.brass,'g',5);
  BK.at(0,0,1.9,0,()=>{BK.cyl(0,.4,0,.22,.22,.07,EC.black,'g',10);BK.sph(0,.45,0,.2,.05,.2,EC.velvet,'f',8);for(const[x,z]of[[-.12,-.12],[.12,-.12],[-.12,.12],[.12,.12]])BK.cyl(x,0,z,.025,.018,.4,EC.black,'g',5)});BK.solid(0,-.1,1.5,2.4,1.0)},
 desk(){FUR.table(1.9,.9,.78,EC.dwood);BK.bot(-.55,.78,.1,.5,.05,.35,0xdad2b8,'s');BK.bot(.5,.78,-.2,.04,.18,.04,EC.brass,'g');BK.bot(.6,.78,.1,.18,.2,.1,0x3a2a18,'f');for(const s of[-1,1])BK.bot(s*.65,.12,0,.5,.55,.7,EC.dwood,'w');FUR.candles(2)},
 billiard(){const L=3.0,W=1.7;BK.bot(0,.74,0,L,.2,W,EC.dwood,'w');BK.bot(0,.93,0,L-.3,.03,W-.3,0x1f5a34,'f');for(const s of[-1,1]){BK.bot(0,.93,s*(W/2-.075),L,.1,.15,EC.wood,'w');BK.bot(s*(L/2-.075),.93,0,.15,.1,W-.3,EC.wood,'w')}
  for(const x of[-1,0,1])for(const z of[-1,1])BK.sph(x*(L/2-.1),.95,z*(W/2-.1),.075,.04,.075,0x050505,'s',6);for(const sx of[-1,1])for(const sz of[-1,1])BK.lathe(sx*(L/2-.2),0,sz*(W/2-.2),[[.11,0],[.15,.08],[.09,.3],[.13,.6],[.17,.74]],EC.dwood,'w',8);
  const cs=[0xe8e0d0,0xd8b020,0x2040c0,0xc02020,0x602090,0xe07020,0x208040,0x601818,0x101010];for(let i=0;i<9;i++)BK.sph(-.6+(i%4)*.11+(i>3?.05:0),.99,(i>3?(i-4)*.11-.2:i*.11-.17),.028,.028,.028,cs[i],'g',6);BK.sph(.9,.99,.1,.028,.028,.028,0xf4f0e0,'g',6);
  BK.rod(1.1,.99,.6,1.6,1.22,.95,.012,.009,0x8a6a3a,'w',5);BK.solid(0,0,L+.2,W+.2,.95)},
 grandChandelierFallen(){BK.tor(0,.35,0,.9,.06,EC.brass,'g',.5,0,.3,14);BK.tor(0,.55,0,.5,.04,EC.brass,'g',.5,0,.3,12);for(let i=0;i<8;i++){const a=i/8*6.28;BK.rod(Math.cos(a)*.9,.3+Math.sin(a)*.2,Math.sin(a)*.9,Math.cos(a)*.9,.6+Math.sin(a)*.2,Math.sin(a)*.9,.012,.012,EC.candle,'c')}for(let i=0;i<24;i++)BK.sph((erand()-.5)*2.4,.04,(erand()-.5)*2.4,.04,.07,.04,0xcfe6f0,'gl',5);BK.rod(0,.4,0,3,2.8,-1,.03,.03,EC.iron,'m');BK.solid(0,0,2.0,2.0,.7)},
 tomb(k,ry){BK.at(0,0,0,ry||0,()=>{const c=epk([0x6e6a62,0x5e5a54,0x7a766c,0x56524c]);BK.bot(0,0,0,.9,.1,.5,EC.dstone,'s');
   if(k==0){BK.bot(0,.1,0,.7,.9,.16,c,'s');BK.cyl(0,.9,0,.35,.35,.16,c,'s',10,Math.PI/2);BK.box(0,.65,.09,.3,.02,.02,0x2a2a28,'s');BK.box(0,.55,.09,.4,.02,.02,0x2a2a28,'s')}
   else if(k==1){BK.bot(0,.1,0,.18,1.3,.14,c,'s');BK.bot(0,.85,0,.7,.16,.14,c,'s')}
   else if(k==2){BK.bot(0,.1,0,.46,.3,.46,c,'s');BK.cyl(0,.4,0,.17,.2,1.2,c,'s',4,0,.78);BK.sph(0,1.65,0,.12,.14,.12,c,'s',6)}
   else{BK.bot(0,.1,0,.8,.55,.2,c,'s');BK.bot(0,.65,0,.62,.14,.2,c,'s');BK.bot(0,.79,0,.4,.12,.2,c,'s')}
   if(erand()<.5)BK.box((erand()-.5)*.4,.015,.45,.5,.03,.6,EC.moss,'f',erand());BK.solid(0,0,.9,.5,k==2?1.6:1)})},
 tree(h){h=h||5+erand()*3;BK.cyl(0,0,0,.14,.4,h*.55,0x2c241c,'w',7);BK.cyl(0,h*.55-.05,0,.1,.14,h*.45,0x2c241c,'w',6);for(let i=0;i<6;i++){const a=i/6*6.28+erand(),y=h*(.5+erand()*.45),L=1.2+erand()*2.2,x=Math.cos(a)*L,z=Math.sin(a)*L,y1=y+.4+erand()*1.4;BK.rod(0,y,0,x,y1,z,.07,.025,0x2c241c,'w',5);for(let k=0;k<2;k++){const b=a+(k?.7:-.7)*erand();BK.rod(x*.6,y+(y1-y)*.6,z*.6,x*.6+Math.cos(b)*L*.5,y1+.5,z*.6+Math.sin(b)*L*.5,.03,.01,0x2c241c,'w',4)}}
  for(let i=0;i<3;i++)BK.rod(0,.1,0,Math.cos(i*2.1)*.7,0,Math.sin(i*2.1)*.7,.12,.03,0x2c241c,'w',5);BK.solid(0,0,.7,.7,3)},
 hedge(w,d,h){h=h||2.9;BK.bot(0,0,0,w,h-.4,d,0x1e3a22,'f');const n=Math.round(w*d/1.2);for(let i=0;i<n;i++)BK.sph((erand()-.5)*w,h-.4+(erand()-.5)*.3,(erand()-.5)*d,.5+erand()*.4,.4,.5+erand()*.4,erand()<.3?0x274a2a:0x1e3a22,'f',6);BK.solid(0,0,w,d,h)},
 lamppost(){BK.lathe(0,0,0,[[.16,0],[.12,.2],[.06,.5],[.05,2.8],[.08,2.95]],EC.iron,'m',8);BK.cyl(0,3,0,.2,.12,.08,EC.iron,'m',6);for(const[x,z]of[[-.15,-.15],[.15,-.15],[-.15,.15],[.15,.15]])BK.cyl(x,3.08,z,.012,.012,.5,EC.iron,'m',4);BK.box(0,3.35,0,.3,.34,.3,0xffd9a0,'e');BK.cyl(0,3.6,0,.02,.26,.2,EC.iron,'m',4);const w=BK.where(0,3.35);eHalo(w[0],w[1],w[2],.5,.34,.14,'H');eSpot(w[0],w[1]-.2,w[2],0xffb870,1.3,16,.8);BK.solid(0,0,.35,.35,3)},
 brazier(){BK.lathe(0,0,0,[[.08,0],[.1,.5],[.3,.8],[.34,.9]],EC.iron,'m',8);for(const a of[0,2.1,4.2])BK.rod(Math.cos(a)*.3,0,Math.sin(a)*.3,Math.cos(a)*.1,.55,Math.sin(a)*.1,.03,.025,EC.iron,'m',5);BK.cyl(0,.84,0,.3,.28,.08,0x2a1008,'s',8);const w=BK.where(0,.95);eBig(w[0],w[1],w[2],1,[1.6,13]);BK.solid(0,0,.7,.7,1)},
 sconce(ry){BK.at(0,0,0,ry||0,()=>{BK.box(0,0,0,.14,.3,.04,EC.brass,'g');BK.rod(0,-.05,.02,0,-.02,.18,.015,.012,EC.brass,'g');BK.cyl(0,-.04,.18,.04,.03,.05,EC.brass,'g',6);BK.cyl(0,-.0,.18,.02,.02,.14,EC.candle,'c',6);const w=BK.where(0,.1,.18);eFlame(w[0],w[1],w[2],1.2,[.9,10])})},
 curtain(w,h,c,ry){BK.at(0,0,0,ry||0,()=>{BK.rod(-w/2-.1,h+.05,0,w/2+.1,h+.05,0,.025,.025,EC.brass,'g');const n=Math.round(w/.22);for(let i=0;i<n;i++){const x=-w/2+(i+.5)*w/n,L=h*(.8+erand()*.2),z=Math.sin(i*1.7)*.06;BK.bot(x,h-L,z,w/n+.01,L,.04,c,'f',0)}})},
 stairs(x0,z0,x1,z1,dir,steps,rise){/* a stair block between two corners, rising towards +x ('e') or -x ('w'); solid, with carpet, balustrade and newels */
  const n=steps||12,rs=rise||.3,sx=(x1-x0)/n,L=z1-z0,cx=(x0+x1)/2,zc=(z0+z1)/2;
  for(let i=0;i<n;i++){const xi=dir=='e'?x0+(i+.5)*sx:x1-(i+.5)*sx,hh=(i+1)*rs;BK.bot(xi,0,zc,sx+.01,hh,L,0x5e584e,'s');BK.bot(xi,hh-.02,zc,sx+.03,.06,L+.06,0x726b60,'s');BK.bot(xi,hh+.04,zc,sx-.04,.02,Math.min(2.6,L*.55),0x5a1a1e,'f')}
  const zr=z1+.04,lo=dir=='e'?x0:x1,hi=dir=='e'?x1:x0;for(let i=0;i<=n;i++){const xi=lo+(hi-lo)*i/n;BK.cyl(xi,i*rs+.04,zr,.022,.022,.9,EC.dwood,'w',6)}
  BK.rod(lo,1.0,zr,hi,n*rs+1.0,zr,.045,.045,EC.dwood,'w',6);for(const[nx,h]of[[lo,0],[hi,n*rs]]){BK.lathe(nx,h,zr,[[.07,0],[.09,.12],[.06,.3],[.07,1.0],[.1,1.05],[.05,1.15]],EC.dwood,'w',8);BK.sph(nx,h+1.2,zr,.08,.08,.08,EC.brass,'g',6)}
  BK.solid(cx,zc,x1-x0,L,n*rs+.3)},
 fountain(){BK.lathe(0,0,0,[[2.6,0],[2.7,.2],[2.6,.7],[2.4,.78],[2.3,.7],[2.3,.2],[0,.2]],EC.dstone,'s',20);BK.cyl(0,.2,0,2.3,2.3,.4,0x1c2e30,'gl',20);BK.lathe(0,0,0,[[.4,.2],[.5,.4],[.3,1.0],[.34,1.4],[1.0,1.5],[1.2,1.65],[.2,1.7]],EC.stone,'s',14);BK.lathe(0,1.6,0,[[.2,0],[.12,.6],[.4,.8],[.46,.9],[.1,.95]],EC.stone,'s',12);BK.cyl(0,2.4,0,.08,.04,.5,EC.stone,'s',6);BK.sph(0,2.95,0,.14,.14,.14,EC.stone,'s',7);BK.solid(0,0,5.2,5.2,1.0)}
};
function eShape(pts){const s=new THREE.Shape();pts.forEach((p,i)=>i?s.lineTo(p[0],p[1]):s.moveTo(p[0],p[1]));s.closePath();return s}


/* ---------- the plan: nine rooms in a 3x3 grid, a front lawn to the south, a back garden (with the crypt) to the north ---------- */
const ERM={foyer:[-16,14,16,32],dining:[-42,14,-16,32],parlor:[16,14,42,32],ball:[-16,-6,16,14],lib:[-42,-6,-16,14],bill:[16,-6,42,14],kit:[-42,-24,-16,-6],study:[16,-24,42,-6],cons:[-16,-24,16,-6],crypt:[22,-50,46,-37]};
const ERA={foyer:0,dining:1,parlor:2,ball:3,kit:4,lib:5,bill:6,study:7,cons:8,garden:9,crypt:10,lawn:11};
const eInn=k=>{const r=ERM[k],ex=k=='crypt';return[r[0]+(r[0]==-42||ex?.6:.45),r[1]+(r[1]==-24||ex?.6:.45),r[2]-(r[2]==42||ex?.6:.45),r[3]-(r[3]==32||ex?.6:.45)]};
const eRoomAt=(x,z)=>{if(typeof sel!='undefined'&&sel.map=='London')return typeof lonIn=='function'&&lonIn(x,z)?'in':null;for(const k in ERM){const r=ERM[k];if(x>r[0]&&x<r[2]&&z>r[1]&&z<r[3])return k}return null};
const EWP={foyer:'wpRed',dining:'wpGreen',parlor:'wpBlue',ball:'wpCream',lib:'wpGreen',bill:'wpRed',kit:'wpCream',study:'wpBlue'};
const EFL={foyer:['marble',8],dining:['parquet',8],parlor:['carpet',4],ball:['parquet',8],lib:['parquet',8],bill:['carpet',4],kit:['tile',8],study:['carpet',4],cons:['terra',6],crypt:['flag',8]};

/* ---------- the map ---------- */
MAPS['Hollow Estate']={d:'Zombies map: the Hollow Estate, an abandoned Victorian mansion with nine rooms, a front lawn, a back garden with a graveyard and a crypt. Locked doors, perk machines, mystery boxes, wall weapons, ammo crates and Pack-a-Punch',zm:1,H:56,sky:0x141a24,gr:0x1e2a1c,bc:0x5e584e,ps:[0,29.5],skyk:'night',hemi:.62,hemiC:0x8aa0d0,hemiG:0x1a2030,sunI:.3,sunC:0x9fb4ff,fogF:80,gt:'grass',
 outdoor:[[-53,-53,53,-24.6],[-53,32.6,53,53]],links:[[3,5],[3,6],[4,8],[7,8]],lights:[],
 zs:[[-11,22,0],[11,22,0],[-12,29,0],[12,29,0],[-37,18,1],[-21,18,1],[-37,29,1],[-22,26,1],[37,18,2],[21,18,2],[37,29,2],[22,26,2],[-11,9,3],[11,9,3],[-11,-1,3],[11,-1,3],
  [-37,-20,4],[-21,-20,4],[-37,-10,4],[-22,-12,4],[-37,10,5],[-21,10,5],[-37,-1,5],[-21,-2,5],[37,10,6],[21,10,6],[37,-1,6],[21,-2,6],[37,-20,7],[21,-20,7],[37,-10,7],[24,-12,7],[-11,-20,8],[11,-20,8],[-11,-10,8],[11,-10,8],
  [-46,-30,9],[46,-30,9],[0,-48,9],[-30,-49,9],[20,-30,9],[-18,-30,9],[10,-44,9],[30,-45,10],[38,-45,10],[30,-41,10],[38,-41,10],[-44,44,11],[44,44,11],[-22,49,11],[22,49,11],[0,48,11]],
 dr:[{x:-16,z:23,w:.5,d:3.6,c:750,a:0,b:1,n:'Dining Hall',s:'wood'},{x:16,z:23,w:.5,d:3.6,c:750,a:0,b:2,n:'Parlor',s:'wood'},{x:0,z:14,w:4.6,d:.5,c:1250,a:0,b:3,n:'Ballroom',s:'wood'},
  {x:-29,z:14,w:3.6,d:.5,c:1000,a:1,b:5,n:'Library',s:'wood'},{x:29,z:14,w:3.6,d:.5,c:1000,a:2,b:6,n:'Billiard Room',s:'wood'},{x:-29,z:-6,w:3.6,d:.5,c:1250,a:5,b:4,n:'Kitchen',s:'wood'},{x:29,z:-6,w:3.6,d:.5,c:1250,a:6,b:7,n:'Study',s:'wood'},
  {x:0,z:-6,w:4.6,d:.5,c:1750,a:3,b:8,n:'Conservatory',s:'wood'},{x:0,z:32,w:6.2,d:.6,c:2000,a:0,b:11,n:'Front Gate',s:'iron'},{x:0,z:-24,w:5.2,d:.6,c:2250,a:8,b:9,n:'Garden',s:'glass'},
  {x:-29,z:-24,w:3.4,d:.6,c:2000,a:4,b:9,n:'Back Door',s:'wood'},{x:34,z:-37,w:3.6,d:.7,c:2500,a:9,b:10,n:'Crypt',s:'stone'}],
 mc:[{t:'rev',x:-12.2,z:30.85,f:'n'},{t:'vit',x:18.8,z:30.85,f:'n'},{t:'dbl',x:-15.0,z:9.5,f:'e'},{t:'mule',x:-17.1,z:10,f:'w'},{t:'spd',x:-17.1,z:-9.8,f:'w'},{t:'stam',x:19.5,z:13.0,f:'n'},{t:'pap',x:34,z:-48.7,f:'s'},
  {t:'box',x:-36.2,z:15.0,f:'s'},{t:'box',x:21,z:15.0,f:'s'},{t:'box',x:10,z:-25.4,f:'n'},
  {t:'wall',k:'MP',x:-15.5,z:28.3,f:'e'},{t:'wall',k:'MG',x:15.5,z:28.3,f:'w'},{t:'wall',k:'SG',x:-41.35,z:28.5,f:'e'},{t:'wall',k:'SMG',x:41.35,z:28.5,f:'w'},{t:'wall',k:'DS',x:41.35,z:24.4,f:'w'},{t:'wall',k:'AR',x:-8.5,z:-5.5,f:'s'},{t:'wall',k:'BR',x:8.5,z:-5.5,f:'s'},
  {t:'wall',k:'TRB',x:-41.35,z:10.5,f:'e'},{t:'wall',k:'VMP',x:21,z:-5.5,f:'s'},{t:'wall',k:'MVR',x:-36.5,z:-23.35,f:'s'},{t:'wall',k:'TUR',x:21,z:-6.5,f:'n'},{t:'wall',k:'KT',x:37.5,z:-6.5,f:'n'},{t:'wall',k:'SN',x:41.35,z:-20,f:'w'},
  {t:'wall',k:'CY',x:-9,z:-6.5,f:'n'},{t:'wall',k:'RL',x:-33.2,z:-24.75,f:'n'},{t:'wall',k:'MP',x:-6.8,z:32.75,f:'s'},
  {t:'ammo',x:-8,z:30.95,f:'n'},{t:'ammo',x:-40.9,z:18,f:'e'},{t:'ammo',x:15.1,z:9.5,f:'w'},{t:'ammo',x:-39.5,z:-22.9,f:'s'},{t:'ammo',x:17.0,z:-9.5,f:'e'},{t:'ammo',x:40.9,z:10,f:'w'},{t:'ammo',x:-10,z:-25.3,f:'n'},{t:'ammo',x:45.0,z:-44,f:'w'}],
 b(){return estBuild()}};
const _EM=MAPS['Hollow Estate'];_EM.post=g=>estPost(g);

function estBuild(){const M=MAPS['Hollow Estate'],a=[],vv=M._v=[];EST.sd=11;EST.cols=[];EST.dyn=[];EST.spots=[];EST.pend=[];EST.fires=[];EST.mach={};EST.pendulum=[];EST.walls=[];EST.holes=[];
 EST.pts={f:{p:[],c:[],f:[],base:[],size:.34},h:{p:[],c:[],f:[],base:[],size:1.7},F:{p:[],c:[],f:[],base:[],size:.9},H:{p:[],c:[],f:[],base:[],size:3.4},s:{p:[],c:[],f:[],base:[],size:2.4}};
 const B=(x,z,w,d,h,y0,c,k)=>a.push([x,z,w,d,h,y0||0,c,k]);BK=EST.bk=mkBake();
 /* ---- structure ---- */
 const wallRun=(ax,c,a0,a1,t,h,ops,ex,col)=>{ops=ops.slice().sort((p,q)=>p[0]-q[0]);col=col||(ex?0x5b4e47:0x756a5e);const kind=ex?'brick':'stucco';
  const piece=(s,e,y0,y1)=>{if(e-s<.04)return;const len=e-s,mid=(s+e)/2;ax=='x'?B(mid,c,len,t,y1,y0,col,kind):B(c,mid,t,len,y1,y0,col,kind)};
  const nrm=(mid,side)=>ax=='x'?[mid,c+side*(t/2+.9)]:[c+side*(t/2+.9),mid];
  const dress=(s,e,y0,y1,full)=>{/* wallpaper + wainscot on both faces of a plain stretch */if(e-s<.1)return;const mid=(s+e)/2,len=e-s;for(const side of[-1,1]){const[px,pz]=nrm(mid,side),rk=eRoomAt(px,pz);if(!rk)continue;BK.area=rk;const wp=EWP[rk];const off=t/2+.012,ry=ax=='x'?(side>0?0:Math.PI):(side>0?Math.PI/2:-Math.PI/2),X=ax=='x'?mid:c+side*off,Z=ax=='x'?c+side*off:mid;
    const lo=Math.max(y0,rk=='kit'?1.5:1.3),hi=Math.min(y1,5.5);if(wp&&hi>lo)BK.quad(X,(lo+hi)/2,Z,len,hi-lo,0xffffff,'s',0,ry,wp,len/4,(hi-lo)/4);
    if(y0<.5){const px2=ax=='x'?mid:c+side*(t/2+.03),pz2=ax=='x'?c+side*(t/2+.03):mid,wd=rk=='kit'?0x8a8478:EC.dwood;BK.box(px2,.65,pz2,ax=='x'?len:.06,1.3,ax=='x'?.06:len,wd,rk=='kit'?'s':'w');const rl=.08,pr=t/2+.05;BK.box(ax=='x'?mid:c+side*pr,1.32,ax=='x'?c+side*pr:mid,ax=='x'?len:.1,rl,ax=='x'?.1:len,EC.wood,'w');BK.box(ax=='x'?mid:c+side*pr,.1,ax=='x'?c+side*pr:mid,ax=='x'?len:.1,.2,ax=='x'?.1:len,0x1e140c,'w');
     if(y1>5)BK.box(ax=='x'?mid:c+side*pr,5.4,ax=='x'?c+side*pr:mid,ax=='x'?len:.14,.22,ax=='x'?.14:len,EC.wood,'w')}}};
  const frame=(p,w,top)=>{for(const side of[-1,1]){const[px,pz]=nrm(p,side),rk=eRoomAt(px,pz);BK.area=rk||'x';const pr=t/2+.05;for(const s of[-1,1]){BK.box(ax=='x'?p+s*(w/2+.1):c+side*pr,top/2,ax=='x'?c+side*pr:p+s*(w/2+.1),ax=='x'?.2:.14,top,ax=='x'?.14:.2,EC.dwood,'w')}BK.box(ax=='x'?p:c+side*pr,top+.08,ax=='x'?c+side*pr:p,ax=='x'?w+.5:.16,.2,ax=='x'?.16:w+.5,EC.dwood,'w')}};
  const win=(p,w)=>{/* a boarded-up window: frame, sill, planks with moonlight leaking between them */for(const side of[-1,1]){const[px,pz]=nrm(p,side),rk=eRoomAt(px,pz);BK.area=rk||'x';const pr=t/2+.03,X=ax=='x'?p:c+side*pr,Z=ax=='x'?c+side*pr:p,sw=ax=='x'?w:.1,sd=ax=='x'?.1:w;
    BK.box(X,1.05,Z,ax=='x'?w+.3:.2,.1,ax=='x'?.2:w+.3,EC.dstone,'s');BK.box(X,3.5,Z,ax=='x'?w+.3:.18,.1,ax=='x'?.18:w+.3,EC.dstone,'s');for(const s of[-1,1])BK.box(ax=='x'?p+s*(w/2+.04):X,2.28,ax=='x'?Z:p+s*(w/2+.04),ax=='x'?.1:.14,2.5,ax=='x'?.14:.1,EC.dwood,'w');
    const ry=ax=='x'?(side>0?0:Math.PI):(side>0?Math.PI/2:-Math.PI/2);for(let i=0;i<5;i++){const y=1.25+i*.44+erand()*.05,tl=(erand()-.5)*.1;BK.box(ax=='x'?p+(erand()-.5)*.08:X+side*.02,y,ax=='x'?Z+side*.02:p+(erand()-.5)*.08,ax=='x'?w+.1:.06,.2,ax=='x'?.06:w+.1,epk([0x3a2a1c,0x4a3822,0x2e2216]),'w',0,0,ax=='x'?tl:0)}
    BK.quad(ax=='x'?p:c+side*(t/2-.1),2.28,ax=='x'?c+side*(t/2-.1):p,w,2.3,0x7c93c4,'e',0,ry)}};
  let cur=a0;for(const[p,w,ty]of ops){const s=p-w/2,e=p+w/2;dress(cur,s,0,h);piece(cur,s,0,h);const top=ty=='a'?3.9:ty=='D'?4.7:3.5;piece(s,e,top,h);dress(s,e,top,h);
   if(ty=='w'){piece(s,e,0,1.05);dress(s,e,0,1.05);ax=='x'?B(p,c,w,t*.5,3.5,1.05,0,'n'):B(c,p,t*.5,w,3.5,1.05,0,'n');win(p,w)}else frame(p,w,ty=='D'?4.4:ty=='a'?3.9:3.5);cur=e}
  piece(cur,a1,0,h);dress(cur,a1,0,h)};
 /* exterior walls (8.4 high) */
 const XH=8.4;
 wallRun('x',-24,-42,-16,1.2,XH,[[-37,2.2,'w'],[-29,3.4,'d'],[-22,2.2,'w']],1);wallRun('x',-24,16,42,1.2,XH,[[22,2.2,'w'],[29,2.2,'w'],[36,2.2,'w']],1);
 wallRun('x',32,-42,-8,1.2,XH,[[-37,2.2,'w'],[-29,2.2,'w'],[-22,2.2,'w'],[-13,2.2,'w']],1);wallRun('x',32,8,42,1.2,XH,[[13,2.2,'w'],[22,2.2,'w'],[29,2.2,'w'],[37,2.2,'w']],1);wallRun('x',32,-8,8,1.2,XH,[[0,6.2,'D']],1);
 wallRun('z',-42,-24,32,1.2,XH,[[-17,2.2,'w'],[-11,2.2,'w'],[-2,2.2,'w'],[6,2.2,'w'],[19,2.2,'w'],[26,2.2,'w']],1);wallRun('z',42,-24,32,1.2,XH,[[-17,2.2,'w'],[-11,2.2,'w'],[-2,2.2,'w'],[6,2.2,'w'],[19,2.2,'w'],[26,2.2,'w']],1);
 /* interior walls (5.6 high) */
 const IH=5.6;wallRun('z',-16,-24,32,.9,IH,[[-15,3.4,'a'],[4,3.4,'a'],[23,3.6,'d']]);wallRun('z',16,-24,32,.9,IH,[[-15,3.4,'a'],[4,3.4,'a'],[23,3.6,'d']]);
 wallRun('x',-6,-42,42,.9,IH,[[-29,3.6,'d'],[0,4.6,'d'],[29,3.6,'d']]);wallRun('x',14,-42,42,.9,IH,[[-29,3.6,'d'],[0,4.6,'d'],[29,3.6,'d']]);
 /* the conservatory's north side is glass in an iron frame with the garden door in the middle; its piers are brick */
 {BK.area='cons';const gz=-24,x0=-16,x1=16;for(const[s,e]of[[x0,-2.6],[2.6,x1]]){B((s+e)/2,gz,e-s,.5,4.2,0,0x6a8aa0,'glass');B((s+e)/2,gz,e-s,.5,XH,4.2,0x5b4e47,'brick')}
  for(let x=x0;x<=x1;x+=2.4){if(Math.abs(x)<2.7)continue;BK.box(x,2.1,gz-.1,.12,4.2,.14,EC.iron,'m')}BK.box(-9.3,4.2,gz-.1,13.4,.14,.16,EC.iron,'m');BK.box(9.3,4.2,gz-.1,13.4,.14,.16,EC.iron,'m');BK.box(-9.3,2.1,gz-.1,13.4,.1,.12,EC.iron,'m');BK.box(9.3,2.1,gz-.1,13.4,.1,.12,EC.iron,'m');
  for(const s of[-1,1]){BK.box(s*2.6,2.4,gz-.1,.26,4.8,.3,EC.iron,'m');BK.at(s*2.6,4.8,gz-.1,0,()=>{BK.tor(0,.1,0,.2,.03,EC.iron,'m',0,0,0,8)})}BK.rod(-2.6,4.7,gz-.1,0,5.6,gz-.1,.07,.07,EC.iron,'m');BK.rod(2.6,4.7,gz-.1,0,5.6,gz-.1,.07,.07,EC.iron,'m');B(0,gz,5.2,.5,XH,5.7,0x5b4e47,'brick')}
 /* garden and lawn boundary: stone walls with iron spikes, closed off at the manor corners */
 const PW=(x,z,w,d)=>{B(x,z,w,d,3.4,0,0x5a544c,'brick');B(x,z,w,d,14,3.4,0,'n')};
 PW(0,-52,106,1.4);PW(0,52,106,1.4);PW(-52,0,1.4,106);PW(52,0,1.4,106);for(const s of[-1,1]){PW(s*47.5,-24,10,1.4);PW(s*47.5,32,10,1.4)}
 estOuter();
 /* ---- crypt ---- */
 {const r=ERM.crypt,cx=(r[0]+r[2])/2,cz=(r[1]+r[3])/2;wallRun('x',r[1],r[0],r[2],1.2,6.4,[],1,0x4c4a46);wallRun('x',r[3],r[0],r[2],1.2,6.4,[[34,3.6,'d']],1,0x4c4a46);wallRun('z',r[0],r[1],r[3],1.2,6.4,[],1,0x4c4a46);wallRun('z',r[2],r[1],r[3],1.2,6.4,[],1,0x4c4a46)}
 for(const k in ERM){BK.area=k;estRoom(k)}
 BK.area='x';estGarden();estLawn();
 for(const c of EST.cols)a.push(c);
 return a}
let BK=null;


/* ---------- exterior: cornice, plinth, pilasters, slate roofs, gables, chimneys, clock tower, front portico, gate pillars ---------- */
function estOuter(){BK.area='roof';const brick=0x5b4e47,slate=0x262a32;
 /* plinth, belt course and cornice around the whole manor, pilasters at the corners */
 for(const[x,z,w,d]of[[0,-24.7,85.4,.4],[0,32.7,85.4,.4],[-42.7,4,.4,57.4],[42.7,4,.4,57.4]]){BK.bot(x,0,z,w,.9,d,0x4a4440,'s');BK.bot(x,4.2,z,w+(w>d?.1:.28),.28,d+(d>w?.1:.28),0x4a4440,'s');BK.bot(x,XH0,z,w+(w>d?.2:.7),.5,d+(d>w?.2:.7),0x4a4440,'s')}
 for(const x of[-42,-28,-16,16,28,42])for(const z of[-24.65,32.65])BK.bot(x,0,z,1.1,8.4,.5,0x544a44,'s');for(const z of[-24,-8,8,22,32])for(const x of[-42.65,42.65])BK.bot(x,0,z,.5,8.4,1.1,0x544a44,'s');
 /* slate roofs: a tall central ridge flanked by two lower wings, gables at both ends */
 const slab=(cx,cy,cz,w,d,rz,col)=>BK.box(cx,cy,cz,w,.3,d,col||slate,'s',0,0,rz);
 const rs=(x,ridge,run,len,zc)=>{const rz=Math.atan2(ridge-XH0,run),W=Math.hypot(run,ridge-XH0);slab(x-run/2,(ridge+XH0)/2+.15,zc,W,len,rz);slab(x+run/2,(ridge+XH0)/2+.15,zc,W,len,-rz);BK.rod(x,ridge+.2,zc-len/2,x,ridge+.2,zc+len/2,.18,.18,0x1c1f26,'m',6)};
 rs(0,12.4,17,57.2,4);rs(-29,11,14.2,57.2,4);rs(29,11,14.2,57.2,4);
 for(const s of[-1,1]){const z=s>0?32.2:-24.2;const tri=eShape([[-17,0],[17,0],[0,4]]);BK.ext(tri,1.0,0,XH0+.25,z,brick,'s');BK.box(0,XH0+1.7,z+s*.55,1.4,1.8,.1,0xffe6a0,'e')}
 /* chimneys with smoke */
 for(const[x,z]of[[-34,-10],[34,-10],[-34,20],[34,20],[0,-2]]){BK.bot(x,10.2,z,1.7,4.2,1.7,0x6a4a3e,'s');BK.bot(x,14.4,z,2.1,.35,2.1,0x4a403a,'s');for(let i=0;i<4;i++)BK.bot(x-.6+(i%2)*1.2,14.75,z-.6+(i>>1)*1.2,.35,.55,.35,0x4a403a,'s');for(let q=0;q<6;q++){EST.pts.s.p.push(x,14.9,z);EST.pts.s.c.push(.5,.5,.55);EST.pts.s.f.push(1,q*1.7+erand());EST.pts.s.base.push(.5,.5,.55)}}
 /* clock tower over the front door */
 BK.bot(0,XH0,28,8,9,7,brick,'s');BK.bot(0,XH0+9,28,8.8,.5,7.8,0x4a4440,'s');for(const s of[-1,1]){BK.cyl(s*3.6,XH0+9.5,28+s*3.2,.5,.5,.2,0x4a4440,'s',4)}
 for(const s of[-1,1]){const z=28+s*3.55;BK.cyl(0,XH0+4.5,z+s*.02,1.8,1.8,.12,0xe8e0c0,'e',20,Math.PI/2);BK.tor(0,XH0+4.5,z+s*.06,1.8,.14,EC.brass,'g',0,0,0,20);for(let i=0;i<12;i++){const a=i/12*6.28;BK.box(Math.sin(a)*1.5,XH0+4.5+Math.cos(a)*1.5,z+s*.08,.1,.28,.04,0x101010,'s',0,0,-a)}BK.box(0,XH0+4.9,z+s*.09,.09,.9,.04,0x101010,'s');BK.box(.35,XH0+4.5,z+s*.09,.7,.09,.04,0x101010,'s',0,0,.4);
  for(const x of[-2.7,2.7])BK.box(x,XH0+6.2,z+s*.04,.9,2.4,.12,0x9fb0d8,'e')}
 BK.cyl(0,XH0+9.5,28,0,5.4,5,slate,'s',4,0,Math.PI/4);BK.rod(0,XH0+14.3,28,0,XH0+17,28,.06,.03,EC.iron,'m');
 /* front portico: four fat columns, a flat roof and three low steps (low enough to walk up) */
 BK.bot(0,0,34.2,14,.15,4,0x6a645c,'s');BK.bot(0,.15,34.7,12,.15,3,0x726b60,'s');BK.bot(0,.3,35.2,10.6,.01,1.6,0x5e584e,'s');
 BK.box(0,6.1,34.8,13,.5,5.6,0x4a4440,'s');BK.box(0,6.55,34.8,13.6,.25,6.1,0x3a3632,'s');
 for(const x of[-5.4,-1.8,1.8,5.4]){BK.lathe(x,.3,36.5,[[.62,0],[.7,.12],[.5,.3],[.46,5.5],[.56,5.6],[.7,5.82]],EC.marble,'s',14);EST.cols.push([x,36.5,1.2,1.2,6,0,0,'n'])}
  /* gate pillars at the south wall */
 for(const x of[-5.2,5.2]){BK.bot(x,0,51.4,1.8,4.6,1.8,0x5a544c,'s');BK.bot(x,4.6,51.4,2.2,.3,2.2,0x4a4440,'s');BK.sph(x,5.2,51.4,.5,.5,.5,0x4a4440,'s',8);eSpot(x,3.5,50.4,0xffb868,1.0,14,.9);eHalo(x,3.9,50.4,.4,.28,.1,'H')}
 for(let x=-4.4;x<=4.4;x+=.35)BK.rod(x,.3,51.5,x,3.6+Math.abs(Math.sin(x*2.8))*.5,51.5,.025,.02,EC.iron,'m',4);BK.rod(-4.4,1.3,51.5,4.4,1.3,51.5,.04,.04,EC.iron,'m');BK.rod(-4.4,3.0,51.5,4.4,3.0,51.5,.04,.04,EC.iron,'m');BK.tor(0,2.2,51.5,.3,.035,EC.iron,'m',0,0,0,12);
 /* iron fence spikes along the boundary wall */
 for(const[x0,z0,x1,z1]of[[-52,-52,52,-52],[-52,52,52,52],[-52,-52,-52,52],[52,-52,52,52]]){const L=Math.hypot(x1-x0,z1-z0),n=Math.floor(L/1.2);for(let i=0;i<=n;i++){const t=i/n;BK.cyl(x0+(x1-x0)*t,3.4,z0+(z1-z0)*t,.04,0,.5,EC.iron,'m',4)}}}
const XH0=8.4;

/* ---------- a room: floor, ceiling (with collapsed sections), then its furniture ---------- */
function estRoom(k){const r=eInn(k),w=r[2]-r[0],d=r[3]-r[1],cx=(r[0]+r[2])/2,cz=(r[1]+r[3])/2,fl=EFL[k];
 BK.quad(cx,.02,cz,w+.3,d+.3,0xffffff,'s',-Math.PI/2,0,fl[0],(w+.3)/fl[1],(d+.3)/fl[1]);
 const HOLES={foyer:[],ball:[[-6,9],[8,-2]],lib:[[-32,-1]],kit:[[-27,-19]],study:[[30,-16]],parlor:[[36,28]],dining:[[-37,28]],bill:[]}[k]||[];
 if(k=='cons')estGlassRoof(r);else if(k=='crypt'){BK.quad(cx,5.6,cz,w,d,0x3a3834,'s',Math.PI/2,0);for(let x=r[0]+2;x<r[2];x+=4)BK.box(x,5.4,cz,.5,.4,d,0x4a4640,'s');for(const x of[r[0]+.3,r[2]-.3])BK.box(x,5.0,cz,.6,.8,d,0x4a4640,'s')}
 else{for(let x=r[0];x<r[2]-.01;x+=4)for(let z=r[1];z<r[3]-.01;z+=4){const x1=Math.min(x+4,r[2]),z1=Math.min(z+4,r[3]),mx=(x+x1)/2,mz=(z+z1)/2;if(HOLES.some(h=>Math.abs(h[0]-mx)<3&&Math.abs(h[1]-mz)<3))continue;BK.quad(mx,5.52,mz,x1-x,z1-z,0x4a4238,'s',Math.PI/2,0)}
  for(let z=r[1]+2;z<r[3];z+=4)if(!HOLES.some(h=>Math.abs(h[1]-z)<2.5))BK.box(cx,5.38,z,w,.3,.3,EC.dwood,'w');
  for(const h of HOLES){estHole(h[0],h[1])}}
 const R=ROOMS[k];if(R)R()}
function estHole(x,z){EST.holes.push({x,z});BK.at(x,0,z,erand()*6,()=>{FUR.rubble(1.8)});for(let i=0;i<3;i++)BK.rod(x+eri(-2,2),eri(.2,.6),z+eri(-2,2),x+eri(-3,3),eri(.4,1.2),z+eri(-3,3),.12,.1,EC.dwood,'w',5);
 BK.quad(x,5.0,z,3.6,3.6,0xdad6c8,'e',Math.PI/2,0);/* the night sky seen through the hole (unlit, so it reads as sky, not ceiling) */
 for(let i=0;i<4;i++)BK.rod(x+eri(-2,2),5.45,z+eri(-2,2),x+eri(-2,2),5.2,z+eri(-2,2),.1,.08,EC.dwood,'w',5)}
function estGlassRoof(r){const cx=(r[0]+r[2])/2,cz=(r[1]+r[3])/2,w=r[2]-r[0],d=r[3]-r[1],rz=Math.atan2(2.2,w/2),W=Math.hypot(w/2,2.2);
 for(const s of[-1,1]){const x=cx+s*w/4;for(let z=r[1];z<r[3]-.01;z+=2.5){if(erand()<.2)continue;BK.box(x,6.7,z+1.25,W,.03,2.4,0x7a9aa8,'gl',0,0,-s*rz)}
  for(let z=r[1];z<=r[3]+.01;z+=2.5)BK.rod(cx+s*.02,7.8,z,cx+s*(w/2),5.6,z,.045,.045,EC.iron,'m',5)}
 BK.rod(cx,7.85,r[1],cx,7.85,r[3],.07,.07,EC.iron,'m',6);for(const s of[-1,1])BK.rod(cx+s*w/2,5.62,r[1],cx+s*w/2,5.62,r[3],.07,.07,EC.iron,'m',6);for(let x=-12;x<=12;x+=6)BK.rod(x,5.6,r[1],x,5.6,r[3],.05,.05,EC.iron,'m',5);
 estHole(-4,-15);estHole(9,-9)}

const at=(x,z,ry,fn)=>BK.at(x,0,z,ry,fn),PI=Math.PI;
const eWeb=(x,y,z,ry)=>BK.at(x,y,z,ry,()=>FUR.web(1.7));
function eCounter(x,z,w,ry){BK.at(x,0,z,ry,()=>{BK.bot(0,0,0,w,.88,.7,0x5a4a3a,'w');BK.bot(0,.88,.02,w+.06,.06,.78,0x8a8478,'s');for(let i=0;i<Math.floor(w/.8);i++)BK.bot(-w/2+.4+i*.8,.1,.36,.7,.7,.02,0x3a2c20,'w');BK.solid(0,0,w,.7,.95)})}
const ROOMS={
 foyer(){BK.quad(0,.035,23,8,10,0xffffff,'s',-PI/2,0,'rugA',1,1);FUR.stairs(-15.45,14.5,-5.0,19.5,'e');FUR.stairs(5.0,14.5,15.45,19.5,'w');
  BK.box(0,3.6,15.95,10.2,.3,3.0,EC.dwood,'w');for(let x=-4.6;x<=4.6;x+=.5)BK.cyl(x,3.75,17.35,.022,.022,.9,EC.dwood,'w',6);BK.rod(-5,4.7,17.4,5,4.7,17.4,.05,.05,EC.dwood,'w');BK.at(0,3.75,15.2,PI,()=>FUR.painting(2.6,1.6,3));
  at(-3.9,15.4,0,()=>FUR.armor());at(3.9,15.4,0,()=>FUR.armor());at(11.5,30.9,PI,()=>FUR.clock());at(-11.5,30.9,PI,()=>FUR.table(1.4,.45,.85,EC.dwood));BK.at(-11.5,2.1,31.3,PI,()=>FUR.mirror(1.2,1.7));
  for(const s of[-1,1]){BK.at(s*6.9,2.9,31.3,PI,()=>FUR.painting(1.5,2.0,s>0?1:2));at(s*4.3,30.6,0,()=>FUR.urn());at(s*6,30.4,0,()=>FUR.candelabra(1.4,5,[.9,9]));BK.at(s*15.5,3.0,26.2,s>0?-PI/2:PI/2,()=>FUR.sconce(0));BK.at(s*15.5,3.0,20.4,s>0?-PI/2:PI/2,()=>FUR.sconce(0))}
  at(0,22.5,0,()=>{FUR.table(1.2,1.2,.82,EC.wood);BK.at(0,.82,0,0,()=>FUR.vase(0x7a2a2a));BK.at(.3,.82,.25,0,()=>FUR.skull())});at(-7,22.8,.5,()=>FUR.rubble(1.1));
  eWeb(-15.2,5.2,31,PI/4);eWeb(15.2,5.2,31,-PI/4);eWeb(-15.2,5.3,14.9,PI*.75);eChand(0,5.45,24,1.5);eChand(-8,5.45,26,.8);eChand(8,5.45,26,.8)},
 dining(){BK.quad(-29,.035,22.5,15,6,0xffffff,'s',-PI/2,0,'rugB',1,1);at(-29,22.5,0,()=>FUR.table(12,2.4,.85,EC.dwood,EC.cloth));
  for(const x of[-33.5,-29,-24.5]){BK.at(x,.87,22.5,0,()=>FUR.candelabra(.85,5,[1,9]));}
  for(let i=0;i<6;i++){const x=-34.5+i*2;for(const s of[-1,1]){const tip=erand()<.2;BK.at(x,0,22.5+s*1.7,s>0?PI:0,()=>FUR.chair(),tip?.6+erand()*.5:0,tip?erand():0);BK.at(x+.1,.88,22.5+s*.75,0,()=>{BK.cyl(0,0,0,.2,.2,.02,0xe8e0d0,'c',12);BK.sph(0,.04,0,.1,.04,.08,epk([0x5a2a1a,0x7a6a2a,0x3a1a1a]),'f',6);BK.lathe(.25,0,.08,[[.03,0],[.015,.03],[.01,.09],[.04,.16]],0xc8d4d8,'gl',7)})}}
  BK.at(-29,.88,22.5,0,()=>{BK.cyl(0,0,0,.5,.5,.03,0xd8d0b8,'c',14);BK.sph(0,.14,0,.34,.13,.22,0x6a3a1c,'f',8);for(let i=0;i<6;i++)BK.sph(-.3+i*.12,.04,.3,.06,.04,.06,0x7a2a1a,'f',5)});
  at(-36.3,22.5,PI/2,()=>FUR.chair(EC.dwood));at(-21.7,22.5,-PI/2,()=>FUR.chair(EC.dwood));
  at(-40.9,23,PI/2,()=>FUR.fireplace());BK.at(-41.1,3.6,23,PI/2,()=>FUR.painting(1.7,1.3,4));
  at(-22,15.0,0,()=>{FUR.table(2.6,.6,.95,EC.dwood);BK.at(0,.95,0,0,()=>FUR.candelabra(.7,3));BK.at(.7,.95,.1,0,()=>FUR.vase(0x2a4a3a))});BK.at(-37,3.0,14.55,0,()=>FUR.painting(1.5,1.9,0));BK.at(-21,3.0,14.55,0,()=>FUR.painting(1.5,1.9,5));
  for(const x of[-37,-29,-22])BK.at(x,0,31.25,PI,()=>FUR.curtain(2.8,3.8,EC.velvet));at(-37,28.5,.3,()=>FUR.rubble(1.4));at(-19.4,17.5,.9,()=>FUR.crate(.7));
  eWeb(-41.1,5.2,14.9,PI/4);eWeb(-16.9,5.2,31,-PI*.75);eChand(-29,5.45,22.5,1.6);eChand(-36,5.45,26,.7);eChand(-22,5.45,18,.7)},
 parlor(){BK.quad(29,.035,23,13,8,0xffffff,'s',-PI/2,0,'rugA',1,1);at(36.8,17.6,0,()=>FUR.piano());at(30,23,PI/2,()=>FUR.couch(3,EC.blue));at(35.5,19.6,-PI/4,()=>FUR.armchair(EC.velvet));at(35.5,26.6,PI*1.25,()=>FUR.armchair(EC.velvet));at(35,23,0,()=>{FUR.table(1.5,.8,.45,EC.dwood);BK.at(0,.45,0,0,()=>FUR.candles(3))});
  at(40.9,23,-PI/2,()=>FUR.fireplace());BK.at(41.1,3.6,23,-PI/2,()=>FUR.painting(1.8,1.3,2));at(41.0,16.8,-PI/2,()=>FUR.bookcase(1.4,2.7));at(41.0,18.25,-PI/2,()=>FUR.bookcase(1.4,2.7));
  for(const x of[22,29,37])BK.at(x,0,31.25,PI,()=>FUR.curtain(2.8,3.8,EC.blue));for(const z of[19,26])BK.at(41.2,0,z,-PI/2,()=>FUR.curtain(2.8,3.8,EC.blue));at(24.5,28.5,0,()=>FUR.table(.9,.9,.75,EC.wood));at(22.5,26.8,.5,()=>FUR.chair());at(26,28,2.4,()=>FUR.chair(),1.2,.3);at(20.5,19,.4,()=>FUR.rubble(1.2));
  BK.at(23,3.1,14.55,0,()=>FUR.painting(1.4,1.8,1));BK.at(35,3.1,14.55,0,()=>FUR.painting(1.4,1.8,3));eWeb(41.1,5.2,31,-PI/4);eWeb(16.9,5.2,14.9,PI/4);eChand(29,5.45,23,1.5);eChand(22,5.45,19,.6)},
 ball(){BK.quad(0,.035,4,10,16,0xffffff,'s',-PI/2,0,'rugB',1,1);for(const x of[-8.5,8.5])for(const z of[-1.5,9.5])at(x,z,0,()=>{BK.lathe(0,0,0,[[.58,0],[.64,.15],[.46,.32],[.42,4.6],[.54,4.72],[.66,5.05]],EC.marble,'s',14);BK.solid(0,0,1.15,1.15,5.5)});
  at(-12.2,-2.6,0,()=>FUR.piano());for(const s of[-1,1]){at(s*14.9,-1.5,s>0?-PI/2:PI/2,()=>FUR.couch(2.6,EC.velvet));at(s*13,12.4,0,()=>FUR.statue(s>0?'angel':'maiden',PI));BK.at(s*13,3.0,-5.5,0,()=>FUR.mirror(1.7,2.6))}
  at(-6,8.5,.6,()=>FUR.grandChandelierFallen());at(3,9,1.2,()=>FUR.rubble(1.0));at(7,2,.2,()=>FUR.beam(5));
  eChand(-7.5,5.45,3,1.7);eChand(7.5,5.45,3,1.7);eChand(0,5.45,10,1.1);eWeb(-15.2,5.2,-5.0,PI/4);eWeb(15.2,5.2,13,-PI*.75);
  for(const x of[-11,11])at(x,12.8,0,()=>FUR.candelabra(1.5,5,[.8,9]))},
 lib(){BK.quad(-29,.035,-1,6,4.4,0xffffff,'s',-PI/2,0,'rugA',1,1);for(let x=-40.4;x<-31.5;x+=1.45)at(x,-5.45,0,()=>FUR.bookcase(1.4,2.8));for(let x=-26.6;x<-17.5;x+=1.45)at(x,-5.45,0,()=>FUR.bookcase(1.4,2.8));
  for(const xr of[-34.4,-24.4])for(let z=3.4;z<10.5;z+=1.45){at(xr,z,PI/2,()=>FUR.bookcase(1.4,2.6));at(xr+.8,z,-PI/2,()=>FUR.bookcase(1.4,2.6))}
  at(-29,-1,0,()=>{FUR.table(2.6,1.1,.82,EC.dwood);BK.at(.6,.82,0,0,()=>{BK.sph(0,.16,0,.15,.15,.15,0x2a5a7a,'g',9);BK.cyl(0,0,0,.05,.08,.06,EC.brass,'g',6)});BK.at(-.6,.82,.1,0,()=>FUR.candelabra(.6,3))});for(const s of[-1,1])at(-29+s*.9,-2.6,0,()=>FUR.chair(EC.wood)),at(-29+s*.9,.7,PI,()=>FUR.chair(EC.wood));
  at(-40.9,2,PI/2,()=>FUR.fireplace());at(-38.6,.2,PI*.8,()=>FUR.armchair(EC.velvet));at(-38.6,3.8,PI*.2,()=>FUR.armchair(EC.velvet));BK.rod(-35,0,-5.0,-35.4,2.7,-5.4,.03,.03,EC.wood,'w');BK.rod(-34.4,0,-5.0,-34.8,2.7,-5.4,.03,.03,EC.wood,'w');for(let y=.3;y<2.6;y+=.3)BK.rod(-35+y*-.14,y,-5.0-y*.13,-34.4+y*-.14,y,-5.0-y*.13,.015,.015,EC.wood,'w',4);
  BK.at(-40.8,3.2,-3.0,PI/2,()=>FUR.painting(1.2,1.6,5));eWeb(-41.1,5.2,-5.0,PI/4);eWeb(-16.9,5.2,13,-PI*.75);eChand(-29,5.45,4,1.2);eChand(-29,5.45,-3,.7)},
 bill(){BK.quad(29,.035,4,10,7,0xffffff,'s',-PI/2,0,'rugB',1,1);at(29,4,0,()=>FUR.billiard());eCounter(40.3,-1.2,6.5,-PI/2);for(let i=0;i<5;i++)at(38.9,-4+i*1.4,0,()=>FUR.stool());for(let i=0;i<6;i++)BK.bot(41.0,1.6,-3.8+i*1.2,.2,.5,.18,[0x2a5a2a,0x5a2a1a,0x7a6a2a][i%3],'gl');
  at(23.6,-3.7,PI*.9,()=>FUR.armchair(EC.green));at(34.4,-3.7,PI*1.1,()=>FUR.armchair(EC.green));at(38.6,-3.2,0,()=>{FUR.table(.9,.7,.7,EC.dwood);BK.at(0,.7,0,0,()=>FUR.candles(2))});BK.at(16.55,2.6,-2,PI/2,()=>{BK.cyl(0,0,0,.28,.28,.05,0x1a1410,'s',18,PI/2);BK.cyl(0,0,.03,.2,.2,.02,0xb02020,'s',18,PI/2);BK.cyl(0,0,.04,.1,.1,.02,0xe8e0c8,'s',18,PI/2);BK.cyl(0,0,.05,.03,.03,.02,0xb02020,'s',10,PI/2)});
  for(const[x,z,ry]of[[25,13.4,PI],[33,13.4,PI]])BK.at(x,3.0,z,ry,()=>{BK.sph(0,0,.2,.28,.24,.36,0x5a3a22,'f',9);BK.sph(0,.3,.5,.14,.14,.22,0x5a3a22,'f',7);for(const s of[-1,1])BK.rod(s*.12,.4,.46,s*.34,.9,.5,.025,.012,0xd8d0b0,'s',4)});
  BK.at(41.0,3.3,6,-PI/2,()=>FUR.painting(1.4,1.7,2));eWeb(16.9,5.2,-5.0,PI/4);eWeb(41.1,5.2,13,-PI*.75);eChand(29,5.45,4,.9);eChand(29,3.4,4,.5)},
 kit(){const wd=-23.0;eCounter(-35.5,wd,9,0);eCounter(-22.5,wd,8,0);BK.at(-39.2,0,-22.9,0,()=>{BK.bot(0,0,0,1.5,.9,.8,EC.iron,'m');for(const[x,z]of[[-.35,-.15],[.35,-.15],[-.35,.2],[.35,.2]])BK.cyl(x,.9,z,.17,.17,.03,0x0a0a0a,'m',10);BK.cyl(0,1.0,-.2,.14,.12,3.2,EC.iron,'m',8);BK.solid(0,0,1.5,.8,1)});
  BK.at(-33.5,.9,wd+.1,0,()=>{BK.bot(0,0,0,1.0,.05,.6,0x9a9488,'m');BK.cyl(.3,.05,-.2,.03,.03,.5,EC.iron,'m',5);BK.rod(.3,.55,-.2,.3,.6,.05,.03,.03,EC.iron,'m',5)});
  at(-29,-15.5,0,()=>{FUR.table(4,1.4,.95,0x6a5a4a);BK.at(-1,.95,0,0,()=>{BK.lathe(0,0,0,[[.18,0],[.2,.1],[.2,.22],[.17,.24]],0x3a3a3e,'m',10)});BK.at(.8,.95,.2,.3,()=>{BK.bot(0,0,0,.35,.02,.14,0xc0c0c8,'m');BK.bot(-.2,0,0,.12,.03,.12,0x3a2a1a,'w')});BK.at(.1,.95,-.2,0,()=>FUR.skull())});
  for(let i=0;i<7;i++)BK.quad(eri(-38,-20),.035,eri(-21,-8),eri(.6,1.8),eri(.5,1.5),0x4a0a0a,'s',-PI/2,erand()*3);
  BK.rod(-36,3.3,-17,-22,3.3,-17,.03,.03,EC.iron,'m',5);for(let i=0;i<6;i++){const x=-35+i*2.4;BK.rod(x,3.3,-17,x,2.95,-17,.01,.01,EC.iron,'m',3);BK.lathe(x,2.62,-17,[[.04,0],[.12,.02],[.14,.18],[.12,.3],[.15,.33]],0x4a4a50,'m',8)}
  for(let i=0;i<4;i++){BK.rod(-40+i*.5,3.6,-9,-40+i*.5,2.9,-9,.01,.01,EC.iron,'m',3);BK.sph(-40+i*.5,2.6,-9,.14,.28,.14,0x7a3a2a,'f',7)}
  at(-40.6,-8.2,0,()=>FUR.barrel());at(-39.5,-8.4,0,()=>FUR.barrel());at(-40.2,-10.4,0,()=>FUR.sack());at(-38,-8.0,.2,()=>FUR.crate(.9));at(-18.2,-22.6,0,()=>FUR.barrel());at(-19.2,-22.6,0,()=>FUR.barrel());at(-17.4,-20.8,0,()=>FUR.crate(.8));at(-19,-18,0,()=>FUR.sack());
  BK.at(-41.0,0,-12,PI/2,()=>{BK.bot(0,0,0,1.0,1.9,.7,0x8a8478,'s');BK.bot(0,.1,.36,.9,.8,.02,0x6a645c,'m');BK.bot(0,1.0,.36,.9,.8,.02,0x6a645c,'m');BK.solid(0,0,1,.7,1.9)});for(const z of[-17,-11])BK.at(-41.2,0,z,PI/2,()=>FUR.curtain(2.4,3.3,0x6a6a5a));
  eWeb(-41.1,5.2,-23.0,PI/4);eWeb(-16.9,5.2,-6.9,-PI*.75);eChand(-29,5.45,-15,.9);eSpot(-30,2.6,-17,0xffcc88,.8,10,.9)},
 study(){BK.quad(29,.035,-14,12,8,0xffffff,'s',-PI/2,0,'rugA',1,1);at(29,-18.8,0,()=>FUR.desk());at(29,-20.3,PI,()=>FUR.armchair(EC.velvet));at(40.9,-15,-PI/2,()=>FUR.fireplace());at(36.5,-15,-PI/2,()=>FUR.couch(2.8,EC.velvet));at(34.5,-11.5,.4,()=>FUR.armchair(EC.velvet));at(34.5,-18.5,PI-.4,()=>FUR.armchair(EC.velvet));
  for(let z=-22.5;z<-17.4;z+=1.45)at(16.95,z,PI/2,()=>FUR.bookcase(1.4,2.8));for(let x=17.5;x<22;x+=1.45)at(x,-22.95,0,()=>FUR.bookcase(1.4,2.8));for(let x=32;x<40;x+=1.45)at(x,-22.95,0,()=>FUR.bookcase(1.4,2.8));
  BK.at(26,0,-9,0,()=>{BK.lathe(0,0,0,[[.2,0],[.06,.1],[.06,.8],[.12,1.0]],EC.brass,'g',8);BK.sph(0,1.2,0,.28,.28,.28,0x2a5a7a,'g',12);BK.tor(0,1.2,0,.34,.02,EC.brass,'g',.4,0,0,14);BK.solid(0,0,.7,.7,1.5)});
  for(const[x,ry]of[[24.5,0],[33.5,0]])BK.at(x,3.2,-23.1,ry,()=>{BK.sph(0,0,.2,.26,.24,.34,0x6a4a2a,'f',9);BK.sph(0,.28,.5,.13,.13,.2,0x6a4a2a,'f',7);for(const s of[-1,1]){BK.rod(s*.1,.38,.48,s*.3,.9,.5,.025,.012,0xd8d0b0,'s',4);BK.rod(s*.3,.9,.5,s*.34,1.3,.4,.02,.01,0xd8d0b0,'s',4)}});
  BK.at(41.0,3.3,-9,-PI/2,()=>FUR.painting(1.3,1.6,0));for(const x of[22,29,36])BK.at(x,0,-23.2,0,()=>FUR.curtain(2.8,3.8,EC.green));at(21,-8,.3,()=>FUR.rubble(1.0));eWeb(41.1,5.2,-23.0,PI/4);eWeb(16.9,5.2,-6.9,-PI/4);eChand(29,5.45,-15,1.2);eSpot(36,2.4,-15,0xffaa66,.9,12,1)},
 cons(){const rg=[[-9,-18],[9,-18],[-9,-11],[9,-11]];at(0,-15,0,()=>{BK.lathe(0,0,0,[[2.2,0],[2.3,.5],[2.0,.55],[1.9,.4],[0,.3]],EC.dstone,'s',18);BK.cyl(0,.3,0,1.9,1.9,.2,0x2a2018,'s',18);BK.rod(0,.5,0,.3,3.5,.2,.14,.06,0x3a2c1c,'w',6);for(let i=0;i<9;i++){const a=i/9*6.28;BK.rod(.3,3.4,.2,.3+Math.cos(a)*2,2.6,.2+Math.sin(a)*2,.04,.015,0x4a4a2a,'w',4);BK.sph(.3+Math.cos(a)*1.2,3.1,.2+Math.sin(a)*1.2,.5,.1,.3,0x3a4a1e,'f',5)}BK.solid(0,0,4.4,4.4,1.0)});
  for(const[x,z]of rg)at(x,z,0,()=>{BK.lathe(0,0,0,[[.4,0],[.5,.5],[.52,.9],[.45,.92]],0x8a4a2e,'s',10);BK.cyl(0,.9,0,.4,.4,.05,0x1a1008,'s',10);for(let i=0;i<10;i++){const a=i/10*6.28;BK.rod(0,.9,0,Math.cos(a)*.9,1.5+erand(),Math.sin(a)*.9,.025,.01,0x4a5a2a,'w',4);BK.sph(Math.cos(a)*.7,1.2+erand()*.4,Math.sin(a)*.7,.35,.1,.2,erand()<.3?0x5a4a2a:0x2a4a1e,'f',5)}BK.solid(0,0,1,1,1.2)});
  for(const s of[-1,1]){at(s*13,-12,0,()=>FUR.table(1.4,.8,.8,EC.iron));at(s*13,-13.4,PI,()=>FUR.chair(EC.iron));at(s*13,-10.6,0,()=>FUR.chair(EC.iron));at(s*13.8,-19,0,()=>FUR.couch(2,0x3a4a3a));at(s*14.6,-8,.3,()=>FUR.urn(0x8a4a2e))}
  for(let x=-12;x<=12;x+=6)eHang(x,6.2,-20,.5);eWeb(-15.2,5.4,-22.9,PI/4);eWeb(15.2,5.4,-6.9,-PI*.75);for(const[x,z]of[[-4,-15],[9,-9]])eGlass(x,.06,z,4.5,4.5,-PI/2,0,0x8aa4ff,.25)},
 crypt(){const r=eInn('crypt');for(const x of[26.5,41.5])for(const z of[-46.5,-43,-39.5])at(x,z,PI/2,()=>{BK.bot(0,0,0,2.4,.7,1.1,0x6a665e,'s');BK.bot(0,.7,0,2.6,.18,1.2,0x7a766c,'s');BK.bot(0,.88,0,2.2,.1,.9,0x62605a,'s');BK.sph(-1.0,1.0,0,.2,.12,.28,EC.bone,'s',6);if(erand()<.5)BK.bot(.3,.98,.2,.5,.04,.1,0x4a2a1a,'w',.3);BK.solid(0,0,2.6,1.2,1.0)});
  for(const x of[r[0]+.12,r[2]-.12])for(let z=-48;z<-38;z+=2){for(const y of[.5,1.7,2.9]){BK.box(x,y+.3,z,.2,.8,1.5,0x2a2824,'s');BK.box(x+(x<30?.1:-.1),y+.3,z,.06,.7,1.4,0x14120f,'s')}}
  for(const[x,z]of[[24,-48],[44.5,-48],[24,-38.5],[44.5,-38.5]])at(x,z,0,()=>FUR.brazier());for(const[x,z,n]of[[29,-47,3],[39,-47,3],[28,-39,4],[40,-39,4],[34,-44,5]])at(x,z,0,()=>FUR.candles(n));for(const[x,z]of[[28.5,-44],[39.6,-42],[34,-40.5],[30,-38.5]])at(x,z,erand()*6,()=>FUR.bones());for(let x=24;x<45;x+=3.2)for(let k=0;k<2;k++)BK.rod(x+eri(-.5,.5),5.4,eri(-49,-38),x+eri(-.3,.3),eri(3.8,4.6),eri(-49,-38),.015,.015,EC.iron,'m',3);
  eWeb(22.8,5.2,-49.2,PI/4);eWeb(45.2,5.2,-38,-PI*.75);eWeb(22.8,5.2,-38,PI*.75);eSpot(34,3.5,-44,0xb070ff,1.4,16,.7);eSpot(34,2.5,-47,0x9a60ff,1.2,12,.8)}
};


/* ---------- the back garden (graveyard, hedge maze, fountain) and the front lawn ---------- */
const eKeep=[];const eFree=(x,z,r)=>{for(const k of eKeep)if(x>k[0]-r&&x<k[2]+r&&z>k[1]-r&&z<k[3]+r)return false;for(const c of EST.cols){if(Math.abs(x-c[0])<c[2]/2+r&&Math.abs(z-c[1])<c[3]/2+r)return false}return true};
function ePath(x0,z0,x1,z1,w,col){const L=Math.hypot(x1-x0,z1-z0),n=Math.max(1,Math.round(L/1.1)),ang=Math.atan2(x1-x0,z1-z0);eKeep.push([Math.min(x0,x1)-w/2,Math.min(z0,z1)-w/2,Math.max(x0,x1)+w/2,Math.max(z0,z1)+w/2]);
 for(let i=0;i<n;i++){const t=(i+.5)/n,x=x0+(x1-x0)*t,z=z0+(z1-z0)*t;for(let j=0;j<Math.max(2,Math.round(w/1.1));j++){const o=(j+.5)/Math.max(2,Math.round(w/1.1))-.5,v=.9+erand()*.2,c=col||0x6a655c;const r=(c>>16&255)*v|0,g=(c>>8&255)*v|0,b=(c&255)*v|0;BK.box(x+Math.cos(ang)*o*w,.03,z-Math.sin(ang)*o*w,1.12,.06,L/n+.06,(r<<16)|(g<<8)|b,'s',ang)}}}
function estGarden(){BK.area='garden';eKeep.length=0;
 ePath(0,-25.4,0,-35.6,3.4);ePath(-29,-25.4,-29,-33,3);ePath(-27,-40,-3.5,-40,3);ePath(3.5,-35.6,34,-35.6,3);ePath(34,-35.6,34,-36.6,3.6);ePath(-3,-35.6,3,-35.6,3);
 at(0,-40,0,()=>FUR.fountain());eKeep.push([-3.5,-43.5,3.5,-36.5]);EST.fountain=[0,-40];
 /* hedge maze to the west: zig-zag rows with 4m gaps */
 const HZ=(z,x0,x1)=>{at((x0+x1)/2,z,0,()=>FUR.hedge(x1-x0,1.7));eKeep.push([x0,z-.9,x1,z+.9])};HZ(-34,-51,-41);HZ(-34,-37,-24);HZ(-40,-47,-31);HZ(-40,-27,-21);HZ(-46,-51,-38);HZ(-46,-34,-24);
 at(-35,-37,0,()=>FUR.statue('maiden',.5));at(-44,-43,0,()=>FUR.statue('angel',1));at(-26,-48,0,()=>FUR.tree(6));at(-48,-37,0,()=>FUR.tree(5));at(-36,-49.5,0,()=>{BK.bot(0,0,0,2.2,.5,.6,EC.dstone,'s');BK.solid(0,0,2.2,.6,.5)});
 at(-8,-31,0,()=>FUR.statue('angel',PI/2));at(8,-31,0,()=>FUR.statue('maiden',-PI/2));
 for(const[x,z]of[[-5.2,-27.5],[5.2,-27.5],[-2.6,-36.6],[2.6,-36.6],[30.5,-33.8],[37.5,-33.8],[-31,-35.4],[-27,-35.4],[-12,-38.4]])at(x,z,0,()=>FUR.lamppost());
 for(const x of[-12,12])at(x,-43,x>0?-PI/2:PI/2,()=>{BK.bot(0,0,0,1.8,.12,.5,EC.dstone,'s');BK.bot(0,.4,-.1,1.8,.1,.4,EC.dstone,'s');for(const s of[-1,1])BK.bot(s*.8,.12,0,.14,.3,.44,EC.dstone,'s');BK.bot(0,.5,-.3,1.8,.5,.1,EC.dstone,'s');BK.solid(0,0,1.8,.5,.9)});
 /* the crypt from outside: a pitched slate roof, a pediment, columns and plaque */
 {const rz=Math.atan2(2,6.75),W=Math.hypot(6.75,2);for(const s of[-1,1])BK.box(34,7.5,-43.5+s*3.4,25,.35,W,0x2a2c32,'s',0,s*rz,0);BK.rod(22,8.5,-43.5,46,8.5,-43.5,.2,.2,0x1c1f26,'m',6);BK.ext(eShape([[-13,0],[13,0],[0,2.3]]),1.1,34,6.3,-36.9,0x58554e,'s');
  for(const x of[28.6,39.4])BK.lathe(x,0,-35.7,[[.5,0],[.56,.12],[.4,.3],[.38,5.2],[.46,5.3],[.56,5.5]],0x7a766c,'s',12);BK.bot(34,5.5,-35.7,13,.6,1.4,0x6a665e,'s');BK.box(34,6.4,-36.4,5,.6,.1,0x2a2820,'s');BK.at(34,6.4,-36.3,0,()=>{BK.box(0,0,0,4.4,.08,.02,0xc9a23a,'g')});
  for(const x of[28.6,39.4])EST.cols.push([x,-35.7,1.1,1.1,5.8,0,0,'n']);for(const x of[26.5,41.5])at(x,-35,0,()=>FUR.brazier());}
 /* graveyard */
 for(let n=0,t=0;n<46&&t<600;t++){const x=eri(3,50),z=eri(-36,-26.5),inCry=x>20&&x<48&&z<-35;if(inCry||!eFree(x,z,1.3))continue;at(x,z,eri(-.25,.25),()=>FUR.tomb(erand()*4|0));n++}
 for(let n=0,t=0;n<24&&t<400;t++){const x=eri(6,50),z=eri(-50,-37.5);if((x>20.5&&x<47.5)||!eFree(x,z,1.5))continue;at(x,z,eri(-.4,.4),()=>FUR.tomb(erand()*4|0));n++}
 for(const[x,z]of[[-47,-27],[-18,-47],[48,-31],[15,-47],[-10,-49],[10,-30],[-40,-30],[50,-48]])at(x,z,0,()=>FUR.tree(5+erand()*3));
 for(let i=0;i<14;i++){const x=eri(-50,50),z=eri(-51,-26);if(eFree(x,z,1.5))at(x,z,erand()*6,()=>FUR.rubble(.7))}
 /* iron fence around the graveyard plot */
 for(let x=2.5;x<=50;x+=.55)BK.rod(x,0,-26.2,x,1.5,-26.2,.02,.015,EC.iron,'m',4);BK.rod(2.5,1.2,-26.2,50,1.2,-26.2,.03,.03,EC.iron,'m',4);BK.rod(2.5,.4,-26.2,50,.4,-26.2,.03,.03,EC.iron,'m',4)}
function estLawn(){BK.area='lawn';ePath(0,50,0,36.6,5.6);ePath(0,37.5,0,36.5,10,0x6a645c);
 for(const s of[-1,1]){at(s*5.4,40,0,()=>FUR.hedge(1.6,5,1.9));at(s*5.4,48,0,()=>FUR.hedge(1.6,5,1.9));at(s*8,38,s>0?PI:0,()=>FUR.statue(s>0?'maiden':'angel',0));at(s*3.4,37,0,()=>FUR.lamppost());at(s*3.4,49,0,()=>FUR.lamppost());at(s*10,36.5,0,()=>FUR.urn())}
 /* a wrecked hearse and a toppled carriage lamp */
 at(-16,43,.5,()=>{BK.bot(0,.5,0,1.9,.9,4.8,0x15161a,'g');BK.bot(0,.4,-2.6,1.8,.6,1.0,0x15161a,'g');BK.bot(0,1.4,.2,1.8,.9,2.8,0x15161a,'g');BK.bot(0,1.45,.2,1.86,.7,2.5,0x3a4a5a,'gl');BK.bot(0,.45,-.3,.5,.5,2.4,0x5a3a22,'w');for(const[x,z]of[[-.95,-1.5],[.95,-1.5],[-.95,1.5]]){BK.tor(x,.45,z,.42,.1,0x0a0a0a,'s',0,PI/2,0,10);BK.tor(x,.45,z,.28,.03,EC.brass,'g',0,PI/2,0,8)}BK.tor(.95,.2,1.5,.42,.1,0x0a0a0a,'s',0,PI/2,.3,10);BK.sph(0,1.9,.2,.1,.1,.1,EC.brass,'g',6);BK.solid(0,0,2.1,5.2,1.9)});
 for(const[x,z]of[[-30,38],[29,41],[-42,47],[41,49],[-24,36.5],[24,46]])at(x,z,0,()=>FUR.tree(5+erand()*3));
 for(let i=0;i<12;i++){const x=eri(-50,50),z=eri(34,50);if(Math.abs(x)>7&&eFree(x,z,1.5))at(x,z,erand()*6,()=>FUR.rubble(.8))}
 for(const s of[-1,1])for(let z=34.5;z<=50;z+=.6)if(Math.abs(z-43)>0)BK.rod(s*49,0,z,s*49,1.4,z,.02,.015,EC.iron,'m',4);
 at(-36,37.5,0,()=>{BK.bot(0,0,0,2.2,.5,.6,EC.dstone,'s');BK.solid(0,0,2.2,.6,.5)});at(34,37.5,0,()=>{BK.bot(0,0,0,2.2,.5,.6,EC.dstone,'s');BK.solid(0,0,2.2,.6,.5)})}

/* ---------- animated decoration: chandeliers sway and flicker, lanterns swing, the clock pendulum swings, the fountain ripples ---------- */
function eChand(x,y,z,s){const g=new THREE.Group(),lb=mkBake();g.position.set(x,y,z);const Y=-1.5*s;
 lb.rod(0,0,0,0,-1.1*s,0,.03,.03,EC.iron,'m',5);lb.lathe(0,-1.9*s,0,[[.04,0],[.16*s,.12*s],[.1*s,.35*s],[.2*s,.55*s],[.06*s,.8*s]],EC.brass,'g',10);lb.tor(0,-1.7*s,0,.85*s,.035*s,EC.brass,'g',PI/2,0,0,18);lb.tor(0,-1.45*s,0,.5*s,.03*s,EC.brass,'g',PI/2,0,0,14);
 const n=8;for(let i=0;i<n;i++){const a=i/n*PI*2,c=Math.cos(a),sn=Math.sin(a);lb.rod(0,-1.55*s,0,c*.85*s,-1.7*s,sn*.85*s,.022*s,.018*s,EC.brass,'g',5);lb.cyl(c*.85*s,-1.7*s,sn*.85*s,.04*s,.04*s,.06*s,EC.brass,'g',6);lb.cyl(c*.85*s,-1.64*s,sn*.85*s,.022*s,.024*s,.14*s,EC.candle,'c',6);
  const w=eWor2(g,x,y,z,c*.85*s,-1.46*s,sn*.85*s);eFlame(w[0],w[1],w[2],1.1);for(let k=0;k<3;k++){const aa=a+(k-1)*.14;lb.rod(Math.cos(aa)*.85*s,-1.72*s,Math.sin(aa)*.85*s,Math.cos(aa)*.85*s,-(1.9+erand()*.3)*s,Math.sin(aa)*.85*s,.004,.004,0xcfe6f0,'gl',3);lb.sph(Math.cos(aa)*.85*s,-(1.95+erand()*.3)*s,Math.sin(aa)*.85*s,.03*s,.05*s,.03*s,0xcfe6f0,'gl',5)}}
 lb.build(g);EST.pend.push(g);const w=eWor2(g,x,y,z,0,-1.5*s,0);eSpot(w[0],w[1],w[2],0xffb066,1.5*Math.min(1.4,s),18,1);eHalo(w[0],w[1],w[2],.5*s,.32*s,.12*s,'H');
 const ph=erand()*6;EST.dyn.push({tick(dt,t){g.rotation.z=Math.sin(t*.7+ph)*.025+Math.sin(t*1.9+ph*2)*.008;g.rotation.x=Math.cos(t*.55+ph)*.02;g.rotation.y=t*.06*(ph>3?1:-1)}})}
const eWor2=(g,x,y,z,lx,ly,lz)=>[x+lx,y+ly,z+lz];
function eHang(x,y,z,s){const g=new THREE.Group(),lb=mkBake();g.position.set(x,y,z);lb.rod(0,0,0,0,-.9,0,.02,.02,EC.iron,'m',4);lb.cyl(0,-1.3,0,.22*s*2,.1*s*2,.4*s*2,EC.iron,'m',6);lb.cyl(0,-1.35,0,.17*s*2,.08*s*2,.32*s*2,0xffe3a8,'e',6);lb.cyl(0,-.9,0,0,.28*s*2,.18,EC.iron,'m',6);lb.build(g);EST.pend.push(g);eSpot(x,y-1.2,z,0xffd890,.9,11,.9);eHalo(x,y-1.2,z,.4,.3,.14,'H');const ph=erand()*6;EST.dyn.push({tick(dt,t){g.rotation.z=Math.sin(t*.9+ph)*.05;g.rotation.x=Math.cos(t*.7+ph)*.04}})}

/* ---------- finishing: merged meshes, glow point systems, the pooled lights, the clock pendulum, fountain water, fog, moon shafts ---------- */
function estPost(g){EST.tm=0;const meshes=EST.bk.build(g);for(const o of EST.pend)g.add(o);EST.pend=[];
 const PT=EST.pts;EST.ptm={};const glow=estTx('glow'),smoke=estTx('smoke');
 for(const k in PT){const s=PT[k];if(!s.p.length)continue;const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(s.p,3));const col=new THREE.Float32BufferAttribute(s.c.slice(),3);col.setUsage&&col.setUsage(THREE.DynamicDrawUsage);geo.setAttribute('color',col);
  const m=new THREE.Points(geo,new THREE.PointsMaterial({map:k=='s'?smoke:glow,size:s.size,vertexColors:true,transparent:true,depthWrite:false,blending:k=='s'?THREE.NormalBlending:THREE.AdditiveBlending,fog:true,opacity:k=='s'?.35:1}));m.frustumCulled=false;g.add(m);EST.ptm[k]={m,col,s}}
 /* point lights: a pool that follows you (the real lights are expensive, the glow is cheap) */
 EST.pool=[];for(let i=0;i<6;i++){const L=new THREE.PointLight(0xffaa66,0,18,1.6);g.add(L);EST.pool.push({L,s:null})}
 for(const sp of EST.spots){sp.cur=0;sp.want=0;sp.L=null}
 /* clock pendulums */
 EST.pend2=[];for(const p of EST.pendulum||[]){const pg=new THREE.Group(),lb=mkBake();pg.position.set(p.x,p.y,p.z);pg.rotation.order='YXZ';pg.rotation.y=p.yaw;lb.rod(0,0,0,0,-.75,0,.012,.012,EC.brass,'g',4);lb.cyl(0,-.88,0,.1,.1,.03,EC.brass,'g',12,PI/2);lb.build(pg);g.add(pg);EST.dyn.push({tick(dt,t){pg.rotation.z=Math.sin(t*3.1)*.22}})}
 /* fountain water */
 if(EST.fountain){const w=new THREE.Mesh(new THREE.CircleGeometry(2.2,24),new THREE.MeshBasicMaterial({map:glow,color:0x4a6a8a,transparent:true,opacity:.5,depthWrite:false,blending:THREE.AdditiveBlending}));w.rotation.x=-PI/2;w.position.set(EST.fountain[0],.62,EST.fountain[1]);g.add(w);
  const rings=[];for(let i=0;i<3;i++){const r=new THREE.Mesh(new THREE.RingGeometry(.9,1,28),new THREE.MeshBasicMaterial({color:0x9ab8d8,transparent:true,opacity:.4,depthWrite:false,side:THREE.DoubleSide}));r.rotation.x=-PI/2;r.position.set(EST.fountain[0],.63,EST.fountain[1]);g.add(r);rings.push(r)}
  EST.dyn.push({tick(dt,t){rings.forEach((r,i)=>{const u=((t*.45+i/3)%1);r.scale.setScalar(.3+u*2.1);r.material.opacity=.45*(1-u)});w.material.opacity=.4+Math.sin(t*1.7)*.08}})}
 /* moonlight shafts and floor patches under every collapsed ceiling */
 for(const h of EST.holes){const cone=new THREE.Mesh(new THREE.CylinderGeometry(1.6,2.6,5.4,16,1,true),new THREE.MeshBasicMaterial({color:0x8aa4ff,transparent:true,opacity:.07,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,fog:false}));cone.position.set(h.x,2.8,h.z);g.add(cone);eGlass(h.x,.06,h.z,5.2,5.2,-PI/2,0,0x8aa4ff,.4)}
 /* low drifting fog in the garden and on the lawn */
 EST.fog=[];for(let i=0;i<22;i++){const s=new THREE.Sprite(new THREE.SpriteMaterial({map:smoke,color:0x8a9ab8,transparent:true,opacity:.22,depthWrite:false}));const gz=i<14;s.position.set(eri(-48,48),eri(.5,1.2),gz?eri(-50,-27):eri(36,50));s.scale.set(eri(8,14),eri(2,3.6),1);g.add(s);EST.fog.push({s,vx:eri(-.25,.25),ph:erand()*6})}
 EST.mapG=g;EST.dyn.push({tick:(dt,t)=>estFlicker(dt,t)})}


/* ===================== live objects: doors, machines, the box, wall buys, ammo crates ===================== */
const EMM={},EG={box:new THREE.BoxGeometry(1,1,1),cyl:new THREE.CylinderGeometry(1,1,1,16),cyl8:new THREE.CylinderGeometry(1,1,1,8),sph:new THREE.SphereGeometry(1,14,10),cone:new THREE.ConeGeometry(1,1,12),pl:new THREE.PlaneGeometry(1,1),tor:new THREE.TorusGeometry(1,.06,8,28)};
function eM(col,em,rough,metal){const k=col+'|'+(em||0)+'|'+rough+'|'+metal;if(EMM[k])return EMM[k];let m;if(LX.pbr&&(rough!=null||metal!=null))m=LX.patch(new THREE.MeshStandardMaterial({color:col,emissive:em||0,roughness:rough==null?.7:rough,metalness:metal||0,envMapIntensity:1}),{});else m=new THREE.MeshLambertMaterial({color:col,emissive:em||0});return EMM[k]=m}
function eMk(g,geo,mat,x,y,z,sx,sy,sz,rx,ry,rz){const m=new THREE.Mesh(geo,mat);m.position.set(x||0,y||0,z||0);m.scale.set(sx==null?1:sx,sy==null?1:sy,sz==null?1:sz);m.rotation.set(rx||0,ry||0,rz||0);m.castShadow=m.receiveShadow=true;g.add(m);return m}
const eBasic=(col,o,add)=>new THREE.MeshBasicMaterial({color:col,transparent:o!=null&&o<1,opacity:o==null?1:o,depthWrite:!(o!=null&&o<1),blending:add?THREE.AdditiveBlending:THREE.NormalBlending,side:THREE.DoubleSide});
function eCanvasMat(w,h,fn,basic){const t=zTex(w,h,fn);return basic?new THREE.MeshBasicMaterial({map:t,transparent:true,side:THREE.DoubleSide,depthWrite:false}):new THREE.MeshLambertMaterial({map:t})}
function eSign(txt,col,w,h){const c=hex(col);return eCanvasMat(w||256,h||96,(g,W,H)=>{g.fillStyle='#07070a';g.fillRect(0,0,W,H);const gr=g.createLinearGradient(0,0,0,H);gr.addColorStop(0,'rgba(255,255,255,.12)');gr.addColorStop(1,'rgba(0,0,0,.4)');g.fillStyle=gr;g.fillRect(0,0,W,H);g.shadowColor=c;g.shadowBlur=14;g.strokeStyle=c;g.lineWidth=4;g.strokeRect(6,6,W-12,H-12);g.font='700 '+(H*.52|0)+'px Teko,Impact,sans-serif';g.textAlign='center';g.textBaseline='middle';g.fillStyle='#fff';g.fillText(txt.toUpperCase(),W/2,H/2+4);g.shadowBlur=0;g.fillStyle=c;g.globalAlpha=.9;g.fillText(txt.toUpperCase(),W/2,H/2+4)},true)}
THREE.Color.prototype.setGray=function(v){return this.setRGB(v,v,v)};
const eFace=f=>FACE[f]!=null?FACE[f]:0,eFwd=f=>[Math.sin(FACE[f]||0),Math.cos(FACE[f]||0)];
const eSwap=(f,w,d)=>(f=='e'||f=='w')?[d,w]:[w,d];

/* ---------- flattening: the static parts of a live object (a gun on the wall, a machine's cabinet, a door leaf) are merged into one mesh so a lot of detail costs few draw calls.
   Anything animated is flagged userData.dyn and stays separate; transparent, unlit and textured parts are left alone. ---------- */
const EFM={};
function eFlatMat(r,m){const k=r+'|'+m;if(EFM[k])return EFM[k];return EFM[k]=LX.pbr?LX.patch(new THREE.MeshStandardMaterial({vertexColors:true,roughness:r,metalness:m,envMapIntensity:.9}),{}):new THREE.MeshLambertMaterial({vertexColors:true})}
function eRel(mesh,root){let m=new THREE.Matrix4(),t=mesh;while(t&&t!==root){m=new THREE.Matrix4().compose(t.position,new THREE.Quaternion().setFromEuler(t.rotation),t.scale).multiply(m);t=t.parent}return m}
function eFlatten(root,rough,metal){const list=[];const walk=o=>{for(const c of o.children){if(c.userData&&c.userData.dyn)continue;
   if(c.isMesh){const mt=c.material;if(c.visible&&c.geometry&&c.geometry.attributes&&c.geometry.attributes.position&&mt&&!mt.transparent&&!mt.isMeshBasicMaterial&&!mt.map&&!mt.isShaderMaterial&&mt.color)list.push(c)}
   else if(!c.isPoints&&!c.isSprite&&!c.isLight)walk(c)}};walk(root);if(list.length<2)return;
 const P=[],N=[],C=[],I=[],nm=new THREE.Matrix3(),v=new THREE.Vector3();let sh=false;
 for(const c of list){const g=c.geometry,pos=g.attributes.position,nor=g.attributes.normal,m=eRel(c,root),base=P.length/3,col=c.material.color,em=c.material.emissive;nm.getNormalMatrix(m);if(c.castShadow)sh=true;
  const r=Math.min(1,col.r+(em?em.r*.7:0)),gg=Math.min(1,col.g+(em?em.g*.7:0)),b=Math.min(1,col.b+(em?em.b*.7:0));
  for(let i=0;i<pos.count;i++){v.fromBufferAttribute(pos,i).applyMatrix4(m);P.push(v.x,v.y,v.z);if(nor){v.fromBufferAttribute(nor,i).applyMatrix3(nm).normalize();N.push(v.x,v.y,v.z)}else N.push(0,1,0);C.push(r,gg,b)}
  const ix=g.index;if(ix)for(let i=0;i<ix.count;i++)I.push(base+ix.getX(i));else for(let i=0;i<pos.count;i++)I.push(base+i);c.parent.remove(c)}
 const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(P,3));geo.setAttribute('normal',new THREE.Float32BufferAttribute(N,3));geo.setAttribute('color',new THREE.Float32BufferAttribute(C,3));geo.setIndex(new THREE.BufferAttribute(new Uint32Array(I),1));
 const mesh=new THREE.Mesh(geo,eFlatMat(rough,metal));mesh.castShadow=sh;mesh.receiveShadow=true;root.add(mesh)}
EST.objs={doors:[],mach:{},boxes:[],walls:[],crates:[],rings:[],pap:null};
/* a weapon model for displays: built once per weapon, scaled to a fixed length, centred; barrel along x */
const EGUN={};
function eGunModel(k,len){const key=k+'|'+len;if(EGUN[key])return EGUN[key].clone();let g;try{g=k=='NF'?(typeof objBuild=='function'?objBuild('nfists'):null):k=='KT'?(typeof objBuild=='function'?objBuild('katana'):null):buildGun(k)}catch(e){g=null}
 if(!g){g=new THREE.Group();eMk(g,EG.box,eM(0x2a2c30,0,.5,.7),0,0,0,.9,.1,.1)}
 const w=new THREE.Group();w.add(g);const bb=new THREE.Box3().setFromObject(g),sz=bb.getSize(new THREE.Vector3()),ct=bb.getCenter(new THREE.Vector3()),L=Math.max(sz.x,sz.y,sz.z,.01),sc=len/L;g.position.sub(ct);w.scale.setScalar(sc);
 const o=new THREE.Group();o.add(w);if(sz.z>=sz.x&&k!='KT')w.rotation.y=Math.PI/2;if(k=='KT'&&sz.y>sz.x){w.rotation.z=Math.PI/2}eFlatten(o,.5,.55);EGUN[key]=o;return o.clone()}

/* ---------- doors ---------- */
function estDoor(d,idx){const W=Math.max(d.w,d.d),alongZ=d.d>d.w,H=d.s=='iron'||W>5?4.3:3.4,g=new THREE.Group(),o={d,g,open:0,planks:[],an:0};g.position.set(d.x,0,d.z);
 /* the barricade faces the side you buy from: the area that is already open */
 const AC={0:[0,23],1:[-29,23],2:[29,23],3:[0,4],4:[-29,-15],5:[-29,4],6:[29,4],7:[29,-15],8:[0,-15],9:[34,-31],10:[34,-43],11:[0,43]},ac=AC[d.a]||[0,0];
 g.rotation.y=alongZ?(ac[0]>=d.x?Math.PI/2:-Math.PI/2):(ac[1]>=d.z?0:Math.PI);
 const wood=eM(0x3a2616,0,.8,0),dw=eM(0x24160c,0,.8,0),iron=eM(0x1c1d20,0,.5,.8),brass=eM(0xb08a3a,0,.3,1);o.piv=[];
 if(d.s=='stone'){const slab=new THREE.Group();eMk(slab,EG.box,eM(0x55524c,0,.9,0),0,H/2,0,W,H,.5);for(let i=0;i<3;i++)eMk(slab,EG.box,eM(0x4a4740,0,.9,0),0,.5+i*1.1,.28,W-.4,.9,.08);const rn=eBasic(0xa070ff,.9,1);for(let i=0;i<7;i++)eMk(slab,EG.box,rn,-1.2+i*.4,H*.55+(i%2)*.4,.34,.06,.35,.02);eMk(slab,EG.tor,iron,0,1.5,.34,.4,.4,.4);eFlatten(slab,.9,.1);g.add(slab);o.slab=slab;o.rune=rn}
 else{for(const s of[-1,1]){const pv=new THREE.Group();pv.position.set(s*W/2,0,0);g.add(pv);o.piv.push({pv,s});const lw=W/2-.02;
   if(d.s=='iron'){for(let i=0;i<9;i++)eMk(pv,EG.cyl8,iron,-s*(.1+i*(lw-.15)/8),H/2,0,.03,H,.03);for(const y of[.4,H/2,H-.4])eMk(pv,EG.box,iron,-s*lw/2,y,0,lw,.07,.07);for(let i=0;i<9;i++)eMk(pv,EG.cone,iron,-s*(.1+i*(lw-.15)/8),H+.1,0,.05,.22,.05);eMk(pv,EG.tor,iron,-s*lw*.85,H*.55,.04,.22,.22,.22)}
   else if(d.s=='glass'){eMk(pv,EG.box,iron,-s*lw/2,H/2,0,lw,H,.06);eMk(pv,EG.box,eM(0x6a8aa0,0x0a1626,.1,.2),-s*lw/2,H/2,0,lw-.2,H-.2,.03);for(let i=1;i<4;i++)eMk(pv,EG.box,iron,-s*lw/2,i*H/4,.02,lw,.05,.05);eMk(pv,EG.box,iron,-s*lw/2,H/2,.02,.05,H,.05)}
   else{for(let i=0;i<5;i++)eMk(pv,EG.box,i%2?wood:dw,-s*(.18+i*(lw-.2)/4),H/2,0,(lw-.1)/5-.01,H,.16);for(const y of[.5,H-.5])eMk(pv,EG.box,iron,-s*lw/2,y,.1,lw,.14,.03);for(const y of[.5,H-.5])for(let i=0;i<5;i++)eMk(pv,EG.sph,iron,-s*(.2+i*(lw-.4)/4),y,.12,.03,.03,.03);eMk(pv,EG.tor,brass,-s*.28,H*.5,.12,.14,.14,.14);eMk(pv,EG.box,wood,-s*lw/2,H/2,.09,lw-.5,H-1.4,.05)}}}
 for(const q of o.piv)eFlatten(q.pv,.8,.1);
 /* the barricade: planks nailed across, a chain and a padlock; they fly off when the door opens */
 const pm=[eM(0x4a3a24,0,.9,0),eM(0x3a2c1c,0,.9,0),eM(0x544028,0,.9,0)],np=d.s=='stone'?0:4;for(let i=0;i<np;i++){const y=.55+i*(H-1)/(np-1),pl=new THREE.Group(),sw=W*(.92+erand()*.1);eMk(pl,EG.box,pm[i%3],0,0,0,sw,.26,.07);for(const x of[-sw*.4,0,sw*.4])eMk(pl,EG.sph,eM(0x2a2a2a,0,.4,.9),x,0,.05,.025,.025,.025);pl.position.set(0,y,.3+.02*i);pl.rotation.z=(erand()-.5)*.28;g.add(pl);o.planks.push({m:pl,vx:(erand()-.5)*5,vy:2+erand()*3,vz:2+erand()*3.5,rx:(erand()-.5)*9,rz:(erand()-.5)*9})}
 if(d.s!='wood'||W>4){for(let i=0;i<5;i++)eMk(g,EG.tor,iron,-.5+i*.25,H*.45-i*.02,.34,.1,.1,.1,0,0,i);eMk(g,EG.box,brass,0,H*.4,.36,.2,.26,.1);eMk(g,EG.tor,brass,0,H*.4+.18,.36,.07,.07,.07)}
 /* a hand-painted price plate */
 const sg=eSign('LOCKED · '+d.c,0xffc860,256,72);const sgm=eMk(g,EG.pl,sg,0,H+.55,.1,1.7,.5,1);sgm.castShadow=false;o.sign=sgm;
 o.box=zSolid(d.x,d.z,d.w,d.d,H<4?3.5:4.6);zG.add(g);EST.objs.doors.push(o);zDoorRule(o,d,idx);return o}
function estDoorOpen(o){if(o.an>0)return;o.an=.001;const d=o.d;burst(V(d.x,1.2,d.z),34,0x9a9080,5,1.3,.26);burst(V(d.x,2,d.z),14,0x6a5a48,7,.9,.12);noise(.5,200,.4);beep(120,.9,'sawtooth',.06);setTimeout(()=>beep(90,.5,'triangle',.06),500);if(o.sign)o.sign.visible=false;o.g.updateMatrixWorld&&0}
function estDoorTick(o,dt){if(o.an<=0||o.an>=9)return;o.an+=dt;const t=o.an,e=esm(t/1.5),d=o.d;
 for(const q of o.piv)q.pv.rotation.y=-q.s*e*1.75;
 if(o.slab){o.slab.position.y=-3.7*e;if(t<1.5&&Math.random()<dt*30)burst(V(d.x,.2,d.z),1,0x8a8478,2,.6,.2);o.rune.opacity=.9*(1-e)}
 for(const p of o.planks){const m=p.m;if(t<1.4){p.vy-=9*dt;m.position.x+=p.vx*dt;m.position.y+=p.vy*dt;m.position.z+=p.vz*dt;m.rotation.x+=p.rx*dt;m.rotation.z+=p.rz*dt;if(m.position.y<.1){m.position.y=.1;p.vy=Math.abs(p.vy)*.3;p.vx*=.6;p.vz*=.6;p.rx*=.6;p.rz*=.6}}if(t>1.8)m.visible=false}
 if(t>2.4)o.an=9}

/* ---------- perk machines ---------- */
function estPerkMachine(m,t){const p=PERKS[t],g=new THREE.Group(),c=p.c,f=eFace(m.f),[fx,fz]=eFwd(m.f);g.position.set(m.x,0,m.z);g.rotation.y=f;
 const dk=new THREE.Color(c).multiplyScalar(.2).getHex(),body=eM(dk,0,.4,.65),chrome=eM(0xc4c8d0,0,.2,1),blk=eM(0x0e0f12,0,.6,.4),glow=eBasic(c,1);const o={g,t,buy:0,ph:erand()*6,bottles:[],c,x0:m.x};
 eMk(g,EG.box,blk,0,.07,0,1.66,.14,1.16);eMk(g,EG.box,body,0,1.17,0,1.5,2.06,1.0);eMk(g,EG.box,eM(new THREE.Color(c).multiplyScalar(.4).getHex(),0,.35,.7),0,2.26,0,1.6,.1,1.1);
 for(const s of[-1,1]){eMk(g,EG.box,chrome,s*.77,1.17,.02,.06,2.1,.98);eMk(g,EG.cyl8,chrome,s*.84,1.2,.3,.035,1.0,.035);for(const y of[.5,1.9])eMk(g,EG.sph,eM(0xb08a3a,0,.3,1),s*.84,y,.3,.07,.07,.07);eMk(g,EG.box,glow,s*.7,1.2,.51,.035,1.9,.012)}
 /* the window: chrome bezel, a lit bottle rack behind glass */
 const wy=1.3;eMk(g,EG.box,chrome,0,wy+.62,.51,1.14,.07,.05);eMk(g,EG.box,chrome,0,wy-.62,.51,1.14,.07,.05);for(const s of[-1,1])eMk(g,EG.box,chrome,s*.57,wy,.51,.07,1.2,.05);
 eMk(g,EG.box,eBasic(new THREE.Color(c).multiplyScalar(.55).getHex(),1),0,wy,.33,1.06,1.16,.02);eMk(g,EG.box,eBasic(c,.22,1),0,wy,.3,.9,1.0,.04);
 const bg=new THREE.Group();bg.userData.dyn=1;g.add(bg);o.rack=bg;const bc=eM(c,new THREE.Color(c).multiplyScalar(.5).getHex(),.2,.1),cap=eM(0xd8d8e0,0,.3,.9);
 for(let r=0;r<3;r++){eMk(g,EG.box,chrome,0,wy-.5+r*.4,.4,1.0,.02,.28);for(let i=0;i<4;i++){const x=-.36+i*.24,y=wy-.48+r*.4,b=new THREE.Group();b.position.set(x,y,.4);eMk(b,EG.cyl,bc,0,.13,0,.055,.13,.055);eMk(b,EG.cyl,bc,0,.31,0,.024,.05,.024);eMk(b,EG.sph,cap,0,.37,0,.03,.02,.03);eMk(b,EG.box,eM(0xf4f4f0,0,.8,0),0,.14,.054,.07,.1,.004);bg.add(b);o.bottles.push(b)}}
 eMk(g,EG.box,eBasic(0xbfe4ff,.1,1),0,wy,.51,.98,1.1,.01);
 /* the sign on top: neon lettering and the crown */
 const sm=eSign(p.n,c,256,88);o.sign=sm;eMk(g,EG.box,blk,0,2.62,.02,1.54,.5,.98);eMk(g,EG.pl,sm,0,2.62,.52,1.46,.44,1);eMk(g,EG.box,glow,0,2.9,.52,1.5,.03,.015);eMk(g,EG.box,glow,0,2.35,.52,1.5,.03,.015);for(const s of[-1,1])eMk(g,EG.box,glow,s*.75,2.62,.52,.03,.55,.015);
 eMk(g,EG.cyl,eM(c,0,.3,.8),0,2.95,0,.5,.06,.3);eMk(g,EG.sph,eM(c,new THREE.Color(c).multiplyScalar(.4).getHex(),.2,.4),0,3.08,0,.16,.16,.16);
 /* dispenser, coin slot, price plate */
 eMk(g,EG.box,blk,0,.5,.5,.62,.34,.1);eMk(g,EG.box,eM(0x30323a,0,.4,.8),0,.5,.55,.56,.28,.02);o.flap=eMk(g,EG.box,chrome,0,.62,.58,.5,.04,.12);o.flap.userData.dyn=1;eMk(g,EG.box,glow,.62,.62,.52,.14,.03,.012);
 eMk(g,EG.pl,eCanvasMat(128,56,(x,w,h)=>{x.fillStyle='#14110c';x.fillRect(0,0,w,h);x.strokeStyle='#b08a3a';x.lineWidth=3;x.strokeRect(2,2,w-4,h-4);x.font='700 34px Teko,Impact,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillStyle='#ffd24a';x.fillText(p.cost+' PTS',w/2,h/2+2)}),0,.2,.52,.5,.2,1);
 eSpot(m.x+fx*1.1,1.6,m.z+fz*1.1,c,1.1,10,.9);eHalo(m.x+fx*.7,1.4,m.z+fz*.7,new THREE.Color(c).r*.5,new THREE.Color(c).g*.5,new THREE.Color(c).b*.5,'H');
 eFlatten(g,.4,.65);const[ww,dd]=eSwap(m.f,1.7,1.2);o.bxo=zSolid(m.x,m.z,ww,dd,2.5);zG.add(g);EST.objs.mach[t]=o;if(t=='rev')zq.revM={g,o:{gone:0},bxo:o.bxo};zq.mp.push({k:t,x:m.x,z:m.z,f:m.f,n:p.n});
 zi.push({x:m.x,z:m.z,r:3.3,txt:()=>zq.revM&&t=='rev'&&zq.revM.o.gone?'':(t!='rev'&&!zPowered()?'The power is off':zq.perks[t]?p.n+' · you have it':'Buy '+p.n+' · '+p.t),cost:()=>zq.perks[t]||(t!='rev'&&!zPowered())?0:p.cost,act:()=>t!='rev'&&!zPowered()?noPower():zPerk(t)})}
function estMachTick(o,dt,t){if(o.g.visible===false)return;const fl=.85+.15*Math.sin(t*11+o.ph)+(Math.random()<.015?-.45:0);o.sign.color.setGray(o.t=='rev'||zPowered()?Math.max(.3,fl):.05);o.rack.position.y=Math.sin(t*2+o.ph)*.004;
 if(o.buy>0){o.buy-=dt*1.6;const b=Math.max(0,o.buy);o.g.position.x=o.x0+Math.sin(t*70)*.012*b;o.flap.rotation.x=-b*.7;if(o.drop){o.drop.vy-=9*dt;o.drop.m.position.y+=o.drop.vy*dt;o.drop.m.position.z+=o.drop.vz*dt;if(o.drop.m.position.y<.15){o.drop.m.position.y=.15;o.drop.vy=0;o.drop.vz=0}}if(o.buy<=0&&o.drop){o.g.remove(o.drop.m);o.drop=null;o.g.position.x=o.x0}}}
function estPerk(t){const o=EST.objs.mach[t];if(!o)return;o.x0=o.g.position.x;o.buy=1;const b=new THREE.Group(),bc=eM(o.c,new THREE.Color(o.c).multiplyScalar(.5).getHex(),.2,.1);eMk(b,EG.cyl,bc,0,.13,0,.055,.13,.055);eMk(b,EG.cyl,bc,0,.31,0,.024,.05,.024);b.position.set(0,.55,.55);b.rotation.x=.2;o.g.add(b);o.drop={m:b,vy:1.5,vz:.6};const[fx,fz]=eFwd(zq.mp.find(q=>q.k==t).f);burst(V(o.g.position.x+fx*.7,1,o.g.position.z+fz*.7),24,o.c,5,.6,.1)}

/* ---------- Pack-a-Punch ---------- */
function estPapMachine(m){const g=new THREE.Group(),f=eFace(m.f),[fx,fz]=eFwd(m.f);g.position.set(m.x,0,m.z);g.rotation.y=f;const V1=0xa070ff,iron=eM(0x17181c,0,.45,.85),stone=eM(0x2a2a30,0,.8,.2),vio=eBasic(V1,1),vioS=eBasic(V1,.55,1),brass=eM(0xb08a3a,0,.3,1);const o={g,gears:[],t:0,act:0,m};
 eMk(g,EG.box,stone,0,.25,0,3.0,.5,1.7);eMk(g,EG.box,iron,0,.55,0,2.7,.12,1.5);for(const s of[-1,1]){eMk(g,EG.box,iron,s*1.2,1.7,-.1,.62,2.3,1.1);eMk(g,EG.box,stone,s*1.2,2.95,-.1,.8,.22,1.3);eMk(g,EG.sph,eM(V1,0x4020a0,.2,.3),s*1.2,3.2,-.1,.2,.2,.2);eMk(g,EG.box,vio,s*1.2,1.7,.46,.05,1.9,.012);
  const gear=new THREE.Group();gear.position.set(s*1.55,1.6,.2);eMk(gear,EG.cyl,iron,0,0,0,.62,.1,.62,Math.PI/2);eMk(gear,EG.cyl,brass,0,0,0,.42,.14,.42,Math.PI/2);eMk(gear,EG.cyl,vio,0,0,0,.14,.16,.14,Math.PI/2);for(let i=0;i<14;i++){const a=i/14*6.28;eMk(gear,EG.box,iron,Math.cos(a)*.66,Math.sin(a)*.66,0,.14,.14,.1,0,0,a)}for(let i=0;i<4;i++)eMk(gear,EG.box,iron,0,0,0,1.0,.08,.08,0,0,i*Math.PI/4);gear.userData.dyn=1;g.add(gear);o.gears.push({m:gear,s});
  const g2=new THREE.Group();g2.position.set(s*1.55,2.55,.2);eMk(g2,EG.cyl,iron,0,0,0,.34,.1,.34,Math.PI/2);for(let i=0;i<9;i++){const a=i/9*6.28;eMk(g2,EG.box,iron,Math.cos(a)*.38,Math.sin(a)*.38,0,.1,.1,.1,0,0,a)}g2.userData.dyn=1;g.add(g2);o.gears.push({m:g2,s:-s,k:1.7});for(const y of[.9,2.3])eMk(g,EG.cyl8,brass,s*.8,y,.55,.03,.5,.03,Math.PI/2*0,0,Math.PI/2)}
 eMk(g,EG.box,iron,0,3.18,-.1,2.6,.3,1.1);eMk(g,EG.box,stone,0,3.42,-.1,2.9,.2,1.25);for(let i=0;i<9;i++)eMk(g,EG.box,vio,-1.0+i*.25,3.18,.47,.08,.18+(i%3)*.04,.012);
 eMk(g,EG.box,eM(0x0a0a10,0,.6,.4),0,1.7,-.1,1.7,2.3,.8);o.portal=eMk(g,EG.pl,vioS,0,1.7,.32,1.5,2.1,1);o.portal2=eMk(g,EG.pl,eBasic(0xd0b0ff,.35,1),0,1.7,.34,1.1,1.7,1);
 o.ring=eMk(g,EG.tor,vio,0,1.7,.4,.85,.85,.85);o.ring2=eMk(g,EG.tor,eBasic(0xd0b0ff,.8),0,1.7,.42,.65,.65,.65);o.orb=eMk(g,EG.sph,eBasic(0xe0c8ff,.9,1),0,1.7,.3,.22,.22,.22);
 const sm=eSign('PACK-A-PUNCH',V1,320,84);o.sign=sm;eMk(g,EG.pl,sm,0,3.9,.56,2.4,.6,1);eMk(g,EG.box,iron,0,3.9,.2,2.5,.7,.7);
 /* the pedestal in front where the weapon hovers while it is being upgraded */
 eMk(g,EG.cyl,stone,0,.45,1.45,.55,.45,.55);eMk(g,EG.cyl,iron,0,.7,1.45,.62,.05,.62);o.disc=eMk(g,EG.cyl,vioS,0,.77,1.45,.5,.02,.5);o.beam=eMk(g,EG.cyl,eBasic(V1,.22,1),0,2.6,1.45,.3,1.9,.3);
 o.hov=new THREE.Group();o.hov.userData.dyn=1;o.hov.position.set(0,1.7,1.45);g.add(o.hov);eSpot(m.x+fx*1.2,1.8,m.z+fz*1.2,V1,1.6,13,.8);eSpot(m.x,3.0,m.z,0x8a50ff,1.0,10,.7);eHalo(m.x+fx*.6,1.8,m.z+fz*.6,.3,.16,.55,'H');
 eFlatten(g,.45,.7);const[ww,dd]=eSwap(m.f,3.1,1.8);zSolid(m.x,m.z,ww,dd,3.4);zG.add(g);EST.objs.pap=o;zq.mp.push({k:'pap',x:m.x,z:m.z,f:m.f,n:'Pack-a-Punch'});
 const pos=[m.x+fx*1.5,m.z+fz*1.5];zi.push({x:m.x+fx*.9,z:m.z+fz*.9,r:3.4,txt:()=>zPowered()?zPapTxt():'The power is off',cost:()=>zPowered()?zPapCost():0,act:()=>zPowered()?zPapAct(pos):noPower()})}
function estPap(start,p){const o=EST.objs.pap;if(!o)return;if(start){o.act=1;o.t=0;o.fin=0;while(o.hov.children.length)o.hov.remove(o.hov.children[0]);const k=p.mel?(zq.mel.k=='Nitrogen Fists'?'NF':zq.mel.k=='Katana'?'KT':null):p.w.k;const it=k?eGunModel(k,1.35):new THREE.Group();if(!k){eMk(it,EG.sph,eM(0xe6d0b0,0x201810,.6,0),0,0,0,.28,.2,.22)}o.hov.add(it);o.item=it;o.tier=p.tier}
 else{o.act=0;o.fin=1;o.t=0;burst(V(o.m.x,1.8,o.m.z),30,0xb070ff,8,.9,.14);while(o.hov.children.length)o.hov.remove(o.hov.children[0]);o.item=null}}
function estPapTick(o,dt,t){const a=o.act?1:0;o.t+=dt;const sp=a?7:1.2;for(const q of o.gears)q.m.rotation.z+=q.s*dt*sp*(q.k||1);
 o.ring.rotation.z+=dt*(a?6:1.3);o.ring2.rotation.z-=dt*(a?9:2);o.ring.rotation.x=Math.sin(t*1.3)*.2;const pu=a?1.2+Math.sin(t*16)*.3:.7+Math.sin(t*2)*.12;o.orb.scale.setScalar(.18+pu*.1);o.portal.material.opacity=.4+(a?.35:.12)*Math.sin(t*(a?18:3));o.portal2.material.opacity=.25+.15*Math.sin(t*5+1);o.beam.material.opacity=a?.45:.14;o.disc.material.opacity=.4+.2*Math.sin(t*4);
 o.sign.color.setGray(.82+.18*Math.sin(t*9)+(Math.random()<.01?-.5:0));if(a){o.g.position.x=o.m.x+Math.sin(t*60)*.006;o.hov.rotation.y+=dt*3.2;o.hov.position.y=1.7+Math.sin(t*3)*.08;if(o.item)o.item.scale.setScalar(1+Math.sin(t*14)*.04)}else o.g.position.x=o.m.x;
 if(o.fin&&o.t>.8)o.fin=0}

/* ---------- Mystery Box ---------- */
function estBox(m,idx){const g=new THREE.Group(),f=eFace(m.f),[fx,fz]=eFwd(m.f);g.position.set(m.x,0,m.z);g.rotation.y=f;const wood=eM(0x4a2e18,0,.7,0),dwood=eM(0x2e1c0e,0,.75,0),iron=eM(0x1f2024,0,.4,.85),gold=eM(0xc9a23a,0x3a2a08,.28,1);
 eMk(g,EG.box,dwood,0,.12,0,1.9,.24,1.0);eMk(g,EG.box,wood,0,.52,0,1.84,.6,.94);for(const x of[-.75,0,.75])eMk(g,EG.box,iron,x,.5,0,.12,.68,1.0);for(const y of[.3,.74])eMk(g,EG.box,iron,0,y,.49,1.9,.07,.03);
 for(const s of[-1,1])for(const z of[-1,1]){eMk(g,EG.box,gold,s*.93,.84,z*.47,.1,.12,.1);eMk(g,EG.sph,gold,s*.93,.04,z*.47,.07,.07,.07)}for(const s of[-1,1])eMk(g,EG.tor,iron,s*.96,.55,0,.2,.2,.2,0,Math.PI/2);
 eMk(g,EG.box,eM(0x14120e,0,.5,.6),0,.62,.5,.5,.4,.04);eMk(g,EG.pl,eCanvasMat(64,64,(x,w,h)=>{x.fillStyle='#14120e';x.fillRect(0,0,w,h);x.font='900 56px Teko,Impact,sans-serif';x.textAlign='center';x.textBaseline='middle';x.shadowColor='#ffd24a';x.shadowBlur=10;x.fillStyle='#ffd24a';x.fillText('?',32,36)},true),0,.62,.53,.36,.36,1);
 /* the interior (lit gold when open) and the hinged lid */
 const inner=eBasic(0xffd24a,1);o_inner=eMk(g,EG.box,inner,0,.8,0,1.6,.04,.8);o_inner.visible=false;
 const lid=new THREE.Group();lid.userData.dyn=1;lid.position.set(0,.84,-.5);g.add(lid);const lm=wood.clone();lm.side=THREE.DoubleSide;const arch=new THREE.Mesh(new THREE.CylinderGeometry(.5,.5,1.92,20,1,false,0,Math.PI),lm);arch.rotation.z=Math.PI/2;arch.position.set(0,0,.5);arch.castShadow=true;lid.add(arch);
 for(const s of[-1,1]){const cap=new THREE.Mesh(new THREE.CircleGeometry(.5,18,0,Math.PI),dwood);cap.rotation.y=s*Math.PI/2;cap.position.set(s*.96,0,.5);cap.material.side=THREE.DoubleSide;lid.add(cap)}for(const x of[-.75,0,.75]){const b=new THREE.Mesh(new THREE.CylinderGeometry(.52,.52,.12,20,1,true,0,Math.PI),iron);b.rotation.z=Math.PI/2;b.position.set(x,0,.5);b.material.side=THREE.DoubleSide;lid.add(b)}eMk(lid,EG.box,gold,0,.18,1.02,.3,.2,.06);
 const o={g,lid,st:0,t:0,cy:0,by:null,item:null,m,fx,fz,ang:0,inner:o_inner};
 o.beam=new THREE.Mesh(new THREE.CylinderGeometry(.55,.9,7,16,1,true),eBasic(0xffd24a,.2,1));o.beam.position.set(0,4.2,0);o.beam.visible=false;g.add(o.beam);o.lab=zSprite('','#ffd24a',.42,1);o.lab.position.set(0,2.7,0);o.lab.visible=false;g.add(o.lab);
 o.wm=new THREE.Group();o.wm.userData.dyn=1;o.wm.position.set(0,1.6,0);g.add(o.wm);o.models={};o.halo=new THREE.Sprite(new THREE.SpriteMaterial({map:estTx('glow'),color:0xffd24a,transparent:true,opacity:0,blending:THREE.AdditiveBlending,depthWrite:false}));o.halo.scale.set(3,3,1);o.halo.position.set(0,1.6,0);g.add(o.halo);
 o.sp={x:m.x,y:1.4,z:m.z,col:0xffd24a,I:0,d:12,fl:.5,ph:0,cur:0,want:0,L:null};EST.spots.push(o.sp);
 eFlatten(g,.7,.2);const[ww,dd]=eSwap(m.f,2.0,1.1);o.sw=[m.x,m.z,ww,dd];o.on=false;g.visible=false;zG.add(g);zboxes.push(o);EST.objs.boxes.push(o);
 zi.push({x:m.x,z:m.z,r:3.2,txt:()=>!o.on||o.st==3?'':o.st==0?'Mystery Box':o.st==2&&o.by==zMe()?'Take the '+zItemName(o.item):'',cost:()=>o.st==0?zBoxCost():0,act:()=>zBoxAct(o,idx)})}
let o_inner=null;
function estBoxState(o,st){if(st==1){burst(V(o.m.x,1,o.m.z),22,0xffd24a,6,.7,.12);noise(.25,300,.2);beep(160,.4,'triangle',.07)}else if(st==0){while(o.wm.children.length)o.wm.remove(o.wm.children[0]);o.cur=null;noise(.2,200,.2)}}
function estBoxShow(o,k,fin){if(o.cur!==k||fin){while(o.wm.children.length)o.wm.remove(o.wm.children[0]);const it=eGunModel(k,fin?1.4:1.15);o.wm.add(it);o.cur=k}if(fin){burst(V(o.m.x,1.9,o.m.z),26,k=='RG'||k=='NF'?0xff4a4a:0x7bf08a,6,.7,.12);shake=Math.max(shake,.15)}}
function estBoxTick(o,dt,t){const open=o.st==3?-1.9*Math.max(0,Math.sin(t*26)):o.st>0?-1.9:0,fire=zq.pu&&zq.pu.fire>0;
 if(o.st==3){o.g.rotation.z=Math.sin(t*55)*.05*Math.min(1,o.t*2);o.g.position.y=Math.max(0,Math.sin(t*34))*.06;if(Math.random()<dt*30)burst(V(o.m.x+(Math.random()-.5)*1.4,.8+Math.random()*.6,o.m.z+(Math.random()-.5)*1.4),1,0xff4a4a,2.5,.5,.1)}else if(o.drop>0){o.drop-=dt*1.9;o.g.position.y=Math.max(0,o.drop*o.drop*16);if(o.drop<=0){o.g.position.y=0;burst(V(o.m.x,.2,o.m.z),34,0xc9a23a,6,.9,.16);burst(V(o.m.x,.1,o.m.z),18,0x8a8070,4,.8,.2);noise(.4,120,.5);beep(70,.3,'sawtooth',.1);shake=Math.max(shake,.45)}}else{o.g.rotation.z=0}o.lid.rotation.x+=(open-o.lid.rotation.x)*Math.min(1,dt*(o.st>0?9:6));const opn=Math.min(1,-o.lid.rotation.x/1.6);o.inner.visible=opn>.1;o.inner.material.color.setHex(fire?0xff6ab8:0xffd24a);
 const tc=fire?0xff6ab8:0xffd24a;o.beam.material.color.setHex(tc);o.halo.material.color.setHex(tc);o.halo.material.opacity=opn*(.55+.15*Math.sin(t*7));o.sp.I=opn*1.9;o.sp.col=tc;
 if(o.st>0){const rise=o.st==2?1.7:1.25+.2*Math.sin(o.t*10);o.wm.position.y+=(rise-o.wm.position.y)*Math.min(1,dt*5);o.wm.rotation.y+=dt*(o.st==2?1.8:6);if(o.st==1&&Math.random()<dt*20)burst(V(o.m.x,1.4,o.m.z),1,tc,2,.5,.08)}else{o.wm.position.y=1.0;o.wm.rotation.y=0}
 if(fire&&o.st==0&&Math.random()<dt*3)burst(V(o.m.x,1.2+Math.random(),o.m.z),1,0xff6ab8,1.5,.8,.08);o.beam.visible=o.st>0||fire}

/* ---------- wall weapons ---------- */
/* ---------- wall buys are chalk drawings on the wall: the outline of the weapon, traced from its own model, with chalk grain, dust and a hand-written name and price.
   They brighten as you come near and puff chalk dust when you buy. ---------- */
function chalkMake(k,cost,mat){const W_=1024,H_=512,cv=document.createElement('canvas');cv.width=W_;cv.height=H_;const x=cv.getContext('2d',{willReadFrequently:true}),tex=new THREE.CanvasTexture(cv);mat.map=tex;mat.needsUpdate=true;
 let sd=0;for(const c of k)sd=(sd*31+c.charCodeAt(0))>>>0;const rn=()=>{sd=(sd*1664525+1013904223)>>>0;return sd/4294967296};
 const grain=()=>{const d=x.getImageData(0,0,W_,H_),a=d.data;for(let i=3;i<a.length;i+=4)if(a[i]){const n=rn();a[i]=n<.1?0:a[i]*(.5+.5*n)}x.putImageData(d,0,0)};
 const finish=()=>{/* hand-written name and price, a wobbly underline, tally marks */
  const nm=(typeof zItemName=='function'?zItemName(k):k).toUpperCase();x.save();x.shadowColor='rgba(255,250,235,.5)';x.shadowBlur=6;x.fillStyle='#f6f1e3';x.strokeStyle='#f6f1e3';x.textAlign='center';x.textBaseline='middle';x.font='700 74px Teko,Impact,sans-serif';x.save();x.translate(W_/2,H_-82);x.rotate(-.012);x.fillText(nm,0,0);x.restore();
  x.font='700 52px Teko,Impact,sans-serif';x.fillText(String(cost),W_/2,H_-30);x.lineWidth=5;x.lineCap='round';x.beginPath();let px=W_/2-250,py=H_-125;x.moveTo(px,py);for(let i=1;i<=18;i++){px=W_/2-250+i*500/18;py=H_-125+Math.sin(i*1.7+k.length)*4+rn()*3;x.lineTo(px,py)}x.stroke();
  x.lineWidth=4;for(let i=0;i<4;i++){const bx=60+i*14;x.beginPath();x.moveTo(bx,H_-70);x.lineTo(bx+rn()*3,H_-30);x.stroke()}x.beginPath();x.moveTo(52,H_-40);x.lineTo(112,H_-62);x.stroke();x.restore();grain();tex.needsUpdate=true};
 const draw=img=>{x.clearRect(0,0,W_,H_);
  if(img){const sw=640,sh=300,t=document.createElement('canvas');t.width=sw;t.height=sh;const c=t.getContext('2d',{willReadFrequently:true});c.drawImage(img,0,0,sw,sh);const d=c.getImageData(0,0,sw,sh),a=d.data,o=c.createImageData(sw,sh),q=o.data;
   const al=(i,j)=>i<0||j<0||i>=sw||j>=sh?0:a[(j*sw+i)*4+3],lu=(i,j)=>{const p=(Math.max(0,Math.min(sh-1,j))*sw+Math.max(0,Math.min(sw-1,i)))*4;return a[p]*.3+a[p+1]*.59+a[p+2]*.11};
   let x0=sw,x1=0,y0=sh,y1=0;for(let j=1;j<sh-1;j++)for(let i=1;i<sw-1;i++){const p=(j*sw+i)*4;if(a[p+3]<40)continue;const edge=al(i-1,j)<40||al(i+1,j)<40||al(i,j-1)<40||al(i,j+1)<40;let v=0;if(edge)v=255;else{const gx=lu(i+1,j)-lu(i-1,j),gy=lu(i,j+1)-lu(i,j-1);if(Math.abs(gx)+Math.abs(gy)>34)v=170}
     if(v){q[p]=q[p+1]=q[p+2]=255;q[p+3]=v;if(i<x0)x0=i;if(i>x1)x1=i;if(j<y0)y0=j;if(j>y1)y1=j}}
   c.putImageData(o,0,0);const bw=Math.max(40,x1-x0),bh=Math.max(20,y1-y0),s=Math.min(W_*.84/bw,(H_-190)/bh),dw=sw*s,dh=sh*s,ox=W_/2-(x0+bw/2)*s,oy=(H_-190)/2+10-(y0+bh/2)*s;
   x.save();x.shadowColor='rgba(255,250,235,.55)';x.shadowBlur=9;x.globalAlpha=.95;for(const[jx,jy]of[[0,0],[1.6,.8],[-1.2,1.4],[.6,-1.1]])x.drawImage(t,ox+jx,oy+jy,dw,dh);x.restore()}
  else{x.strokeStyle='#f6f1e3';x.lineWidth=6;x.strokeRect(W_*.2,60,W_*.6,200)}
  finish()};
 /* text first, so a wall is never blank; the traced outline follows */
 finish();try{const url=typeof ZMELEE!='undefined'&&ZMELEE[k]?objImg('chalk-'+k,()=>objBuild(k=='NF'?'nfists':'katana')):wImg(k);if(url){const im=new Image();im.onload=()=>draw(im);im.onerror=()=>draw(null);im.src=url}else draw(null)}catch(e){draw(null)}}
function estWall(m){const k=m.k;if(!ZMELEE[k]&&!W[k])return;const g=new THREE.Group(),f=eFace(m.f),[fx,fz]=eFwd(m.f);g.position.set(m.x,0,m.z);g.rotation.y=f;const o={g,k,m,glow:0,pop:0};
 const cost=ZMELEE[k]?ZMELCOST[k]:zWallCost(k),mat=new THREE.MeshBasicMaterial({transparent:true,depthWrite:false,opacity:.7,side:THREE.DoubleSide});o.chalk=mat;
 const pl=new THREE.Mesh(EG.pl,mat);pl.position.set(0,1.75,.03);pl.scale.set(2.3,1.15,1);g.add(pl);
 setTimeout(()=>chalkMake(k,cost,mat),20+(EST.objs.walls.length%12)*45);
 o.sp={x:m.x+fx*.9,y:2.1,z:m.z+fz*.9,col:0xe8ecff,I:.3,d:5.5,fl:.12,ph:erand()*9,cur:0,want:0,L:null};EST.spots.push(o.sp);
 zG.add(g);EST.objs.walls.push(o);const px=m.x+fx*1.2,pz=m.z+fz*1.2;zi.push({x:px,z:pz,r:2.5,txt:()=>zWallTxt(k),cost:()=>zWallCostNow(k),act:()=>zBuyWall(k,[m.x+fx*.6,m.z+fz*.6])})}
function estWallTick(o,dt,t){const near=Math.hypot(P.x-o.m.x,P.z-o.m.z)<7;o.glow+=((near?1:0)-o.glow)*Math.min(1,dt*4);
 o.chalk.opacity=Math.min(1,(.66+.34*o.glow)*(.93+.07*Math.sin(t*2.1+o.m.x*3))+Math.max(0,o.pop)*.3);o.sp.I=.2+.45*o.glow;
 if(o.pop>0){o.pop-=dt*1.6;if(o.pop>.7&&!o.pd){o.pd=1;const[fx,fz]=eFwd(o.m.f);try{burst(V(o.m.x+fx*.25,1.7,o.m.z+fz*.25),22,0xf4efe0,2.4,1.1,.06)}catch(e){}}if(o.pop<=0)o.pd=0}}

/* ---------- ONE Mystery Box per map: a random spot every match (never a dead end at the start), and after 4 to 7 uses it moves to a new random spot ---------- */
function estBoxSet(o,on){if(o.on===on)return;o.on=on;o.g.visible=on;if(on){o.sol=zSolid(o.sw[0],o.sw[1],o.sw[2],o.sw[3],.95);zGrid()}else if(o.sol){zUnsolid(o.sol);o.sol=null}}
function estBoxThr(){return 4+(Math.random()*4|0)}
function estBoxGo(i,quiet){const B=zboxes;if(!B[i])return;const old=EST.bx&&EST.bx.loc>=0?B[EST.bx.loc]:null;if(!EST.bx)EST.bx={loc:-1,uses:0,thr:estBoxThr()};if(old&&old!==B[i]){burst(V(old.m.x,1,old.m.z),46,0xffd24a,8,1,.14);burst(V(old.m.x,1.4,old.m.z),24,0xff4a4a,5,.9,.12)}
 B.forEach((o,j)=>{estBoxSet(o,j==i);if(j!=i){o.st=0;o.g.position.y=0;o.g.rotation.z=0;if(o.beam)o.beam.visible=false;if(o.lab)o.lab.visible=false;if(o.sp)o.sp.I=0}});EST.bx.loc=i;EST.bx.uses=0;EST.bx.thr=estBoxThr();if(!quiet){B[i].drop=1;B[i].g.position.y=16;beep(900,.25,'triangle',.08);setTimeout(()=>beep(1300,.2,'triangle',.07),130)}}
function estBoxInit(){const B=zboxes;if(!B.length)return;EST.bx={loc:-1,uses:0,thr:estBoxThr()};const sp=(MAPS[sel.map]&&MAPS[sel.map].ps)||[0,0],ord=B.map((o,i)=>i).sort((a,b)=>Math.hypot(B[a].m.x-sp[0],B[a].m.z-sp[1])-Math.hypot(B[b].m.x-sp[0],B[b].m.z-sp[1])),pool=ord.slice(0,Math.max(1,Math.ceil(B.length*2/3)));estBoxGo(pool[Math.random()*pool.length|0],1)}
/* ---------- ammo crates ---------- */
function estCrate(m){const g=new THREE.Group(),f=eFace(m.f),[fx,fz]=eFwd(m.f);g.position.set(m.x,0,m.z);g.rotation.y=f;const od=eM(0x4a5628,0,.7,.35),dk=eM(0x2a3318,0,.7,.4),metal=eM(0x2a2c2a,0,.4,.85),brass=eM(0xc9a23a,0x3a2a08,.3,1);const o={g,m,open:0,pulse:0,fx,fz};
 eMk(g,EG.box,od,0,.26,0,.96,.5,.62);for(const x of[-.34,0,.34])eMk(g,EG.box,dk,x,.26,.0,.06,.52,.66);for(const y of[.1,.42])eMk(g,EG.box,dk,0,y,0,1.0,.05,.66);
 for(const s of[-1,1]){eMk(g,EG.box,metal,s*.5,.3,0,.04,.22,.2);eMk(g,EG.tor,metal,s*.5,.3,.0,.08,.08,.08,0,Math.PI/2)}for(const s of[-1,1])eMk(g,EG.box,metal,s*.3,.52,.33,.1,.12,.04);
 eMk(g,EG.pl,eCanvasMat(128,64,(x,w,h)=>{x.fillStyle='#3c4820';x.fillRect(0,0,w,h);x.fillStyle='#e8e6d0';x.font='900 44px Teko,Impact,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('AMMO',w/2,h/2+2);x.fillStyle='#e0b020';for(let i=0;i<6;i++)x.fillRect(i*22,0,10,5),x.fillRect(i*22,h-5,10,5)}),0,.28,.325,.7,.34,1);
 const inner=eBasic(0x40ff70,.9,1);o.inner=eMk(g,EG.box,inner,0,.5,0,.8,.02,.5);o.inner.visible=false;
 for(let i=0;i<8;i++){const b=new THREE.Group();b.userData.dyn=1;b.position.set(-.33+i*.095,.5,0);eMk(b,EG.cyl8,brass,0,.07,0,.03,.08,.03);eMk(b,EG.cone,eM(0xb06a2a,0,.4,.7),0,.18,0,.03,.1,.03);b.visible=false;g.add(b);(o.rounds=o.rounds||[]).push(b)}
 const lid=new THREE.Group();lid.userData.dyn=1;lid.position.set(0,.52,-.31);g.add(lid);eMk(lid,EG.box,od,0,.04,.31,1.0,.08,.64);eMk(lid,EG.box,dk,0,.1,.31,.9,.04,.54);for(const x of[-.34,.34])eMk(lid,EG.box,dk,x,.09,.31,.07,.06,.66);eMk(lid,EG.box,metal,0,.08,.62,.3,.1,.05);o.lid=lid;
 eMk(g,EG.box,eBasic(0x40ff70,1),.4,.5,.34,.08,.025,.012);o.led=g.children[g.children.length-1];
 o.sp={x:m.x+fx*.6,y:.9,z:m.z+fz*.6,col:0x6aff8a,I:.5,d:6,fl:.3,ph:erand()*9,cur:0,want:0,L:null};EST.spots.push(o.sp);
 eFlatten(g,.65,.35);const[ww,dd]=eSwap(m.f,1.05,.7);zSolid(m.x,m.z,ww,dd,.6);zG.add(g);EST.objs.crates.push(o);const pos=[m.x+fx*.7,m.z+fz*.7];
 zi.push({x:m.x+fx*.8,z:m.z+fz*.8,r:2.5,txt:()=>{if(P.dead)return'';const w=cw();return w?(zAmmoFull(w)?'Ammo is full':'Ammo for '+(w.pn||W[w.k].n)):''},cost:()=>{const w=cw();return w&&!zAmmoFull(w)?zAmmoPrice(w,0):0},act:()=>{o.pulse=1;zBuyAmmo(0,pos)}})}
function estCrateTick(o,dt,t){const d=Math.hypot(P.x-o.m.x,P.z-o.m.z),op=d<4.2?1:0;o.open+=(op-o.open)*Math.min(1,dt*(op?7:4));let la=-o.open*1.75;if(o.pulse>0){o.pulse-=dt*2;la=-(1.75*(1-Math.min(1,(1-o.pulse)*2)))*(o.pulse>.5?1:o.pulse*2)}o.lid.rotation.x=la;o.inner.visible=o.open>.2;const on=o.open>.5;for(const b of o.rounds)b.visible=on;
 o.sp.I=.45+.9*o.open+(o.pulse>0?1.2:0);o.led.material.color.setHex(o.open>.5?0x40ff70:0x206a30);if(o.pulse>0&&Math.random()<dt*40)burst(V(o.m.x+o.fx*.1,.8,o.m.z+o.fz*.1),2,0xc9a23a,4,.5,.07)}
function estBuy(x,z){const m=new THREE.Mesh(new THREE.RingGeometry(.4,.55,32),new THREE.MeshBasicMaterial({color:0xffd24a,transparent:true,opacity:.7,depthWrite:false,side:THREE.DoubleSide,blending:THREE.AdditiveBlending}));m.rotation.x=-PI/2;m.position.set(x,.12,z);EST.mapG&&EST.mapG.add(m);EST.objs.rings.push({m,t:0});
 for(const w of EST.objs.walls)if(Math.hypot(w.m.x-x,w.m.z-z)<2.4)w.pop=1}

/* ---------- build everything for a match ---------- */
function estObjects(M){EST.spots=EST.spots.filter(s=>!s.dyn);for(const sl of EST.pool||[]){sl.s=null;if(sl.L)sl.L.intensity=0}for(const s of EST.spots){s.L=null;s.cur=0;s.want=0}const n0=EST.spots.length;EST.objs={doors:[],mach:{},boxes:[],walls:[],crates:[],rings:[],pap:null};M.dr.forEach((d,i)=>estDoor(d,i));
 for(const m of M.mc){if(PERKS[m.t])estPerkMachine(m,m.t);else if(m.t=='pap')estPapMachine(m);else if(m.t=='box')estBox(m,zboxes.length);else if(m.t=='wall')estWall(m);else if(m.t=='ammo')estCrate(m)}estBoxInit();if(M.objs)M.objs(M);for(let i=n0;i<EST.spots.length;i++)EST.spots[i].dyn=1}

/* ---------- per frame ---------- */
function estTick(dt){const t=EST.tm+=dt,M=MAPS[sel.map];if(!M||!M.zm)return;
 for(const d of EST.dyn)d.tick(dt,t);const O=EST.objs;for(const d of O.doors)estDoorTick(d,dt);for(const k in O.mach)estMachTick(O.mach[k],dt,t);for(const b of O.boxes)if(b.on)estBoxTick(b,dt,t);for(const w of O.walls)estWallTick(w,dt,t);for(const c of O.crates)estCrateTick(c,dt,t);if(O.pap)estPapTick(O.pap,dt,t);
 for(let i=O.rings.length-1;i>=0;i--){const r=O.rings[i];r.t+=dt;const u=r.t/.7;r.m.scale.setScalar(1+u*6);r.m.material.opacity=.7*(1-u);if(u>=1){r.m.parent&&r.m.parent.remove(r.m);r.m.geometry.dispose();O.rings.splice(i,1)}}
 /* the world: indoors is darker than the grounds; storms flash through the boarded windows */
 const inside=!!eRoomAt(P.x,P.z);EST.amb=(EST.amb==null?1:EST.amb);EST.amb+=((inside?.62:1)-EST.amb)*Math.min(1,dt*2.2);
 const lt=EST.lt;lt.next-=dt;if(lt.next<=0){lt.next=9+Math.random()*19;lt.flash=1;lt.rep=Math.random()<.5?2:1;setTimeout(()=>{if(zq){noise(1.6,90,.45);beep(48,1.3,'sawtooth',.09)}},350+Math.random()*1100)}
 if(lt.flash>0){lt.flash=Math.max(0,lt.flash-dt*(lt.flash>.5?2.6:1.6));if(lt.flash<.3&&lt.rep>1){lt.rep--;lt.flash=.9}}
 const base=(M.hemi||.62)*(LX.pbr?.55:1);hemi.intensity=base*EST.amb*(1+lt.flash*1.7);sun.intensity=((M.sunI==null?.3:M.sunI)*(LX.pbr?1.2:1))*(1+lt.flash*3.2);if(lt.flash>.4)LX.fx.pulse=Math.max(LX.fx.pulse,lt.flash*.25);
 if(EST.fog)for(const f of EST.fog){f.s.position.x+=f.vx*dt;if(f.s.position.x>52)f.s.position.x=-52;if(f.s.position.x<-52)f.s.position.x=52;f.s.material.opacity=.14+.1*Math.sin(t*.3+f.ph)}
 /* the pooled lights */
 estLights(dt,t)}
let _estLT=0;
function estLights(dt,t){const sp=EST.spots,pool=EST.pool;if(!pool||!pool.length)return;_estLT-=dt;
 if(_estLT<=0){_estLT=.12;const cx=C.position.x,cz=C.position.z;for(const s of sp)s.d2=(s.x-cx)*(s.x-cx)+(s.z-cz)*(s.z-cz)+(s.I>0?0:1e6);const ord=sp.slice().sort((a,b)=>a.d2-b.d2).slice(0,pool.length),set=new Set(ord);
  for(const sl of pool)if(sl.s&&!set.has(sl.s))sl.s.want=0;for(const sl of pool)if(sl.s&&sl.s.cur<.03&&sl.s.want==0){sl.s.L=null;sl.s=null;sl.L.intensity=0}
  for(const s of ord){if(s.L||s.I<=0)continue;const sl=pool.find(q=>!q.s);if(!sl)break;sl.s=s;s.L=sl.L;s.want=1;sl.L.position.set(s.x,s.y,s.z);sl.L.color.setHex(s.col);sl.L.distance=s.d}
  for(const s of ord)if(s.L)s.want=1}
 for(const sl of pool){const s=sl.s;if(!s)continue;s.cur+=(s.want-s.cur)*Math.min(1,dt*5);const fl=1+(Math.sin(t*(7+s.ph%5)+s.ph)*.5+Math.sin(t*13.7+s.ph*2)*.3)*.07*s.fl+(Math.random()<.02?-.12*s.fl:0);sl.L.intensity=Math.max(0,s.I)*s.cur*fl;if(s.col!==sl.c){sl.c=s.col;sl.L.color.setHex(s.col)}}}
/* flame points flicker, chimney smoke rises */
function estFlicker(dt,t){const S_=EST.ptm;if(!S_)return;for(const k in S_){const e=S_[k],s=e.s,n=s.p.length/3,ca=e.col.array;if(k=='s'){const pa=e.m.geometry.attributes.position.array;for(let i=0;i<n;i++){const ph=s.f[i*2+1],u=((t*.22+ph*.17)%1);pa[i*3+1]=s.p[i*3+1]+u*6;pa[i*3]=s.p[i*3]+Math.sin(t*.7+ph)*u*1.4;const f=(1-u)*.55;ca[i*3]=s.base[i*3]*f;ca[i*3+1]=s.base[i*3+1]*f;ca[i*3+2]=s.base[i*3+2]*f}e.m.geometry.attributes.position.needsUpdate=true;e.col.needsUpdate=true;continue}
  const amp=k=='F'?.5:k=='f'?.3:.14;for(let i=0;i<n;i++){const ph=s.f[i*2+1],fl=s.f[i*2],f=fl?1+(Math.sin(t*(9+ph%6)+ph)*.5+Math.sin(t*17+ph*3)*.35)*amp+(Math.random()<.04?-.25*fl:0):1;ca[i*3]=s.base[i*3]*f;ca[i*3+1]=s.base[i*3+1]*f;ca[i*3+2]=s.base[i*3+2]*f}e.col.needsUpdate=true}}
/* a new round: thunder, a low bell, and a red flash when the brutes come */
function estRound(r,br){EST.lt.flash=1;EST.lt.rep=2;EST.lt.next=14+Math.random()*10;[196,147,98].forEach((f,i)=>setTimeout(()=>{beep(f,1.4,'sine',.1);beep(f*2,1,'triangle',.04)},i*620));if(br){LX.fx.dmg=Math.max(LX.fx.dmg,.35);shake=Math.max(shake,.4)}}

/* the map is built lazily; if the Zombies mode is the saved mode make sure the menu shows the new mansion */
if(typeof sel!=='undefined'&&sel.mode=='Zombies'&&typeof fixZM=='function'){try{fixZM();ui();buildMap()}catch(e){console.warn('estate init',e)}}
