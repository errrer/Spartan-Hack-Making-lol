/* ######## maps.js ######## */
/* ===================== maps.js ===================== */
/* ---------- shared building toolkit + the map Rust ----------
   Box format: [x,z,w,d,top,y0,colour,texture] (collision + visuals). Visual only (V and deco): [x,z,w,d,top,y0,colour,shape,texture], shape b box, e glow, g glass, s sphere, c cylinder, k cone.
   Open maps have no tall walls. The play area is enclosed by a fence with an invisible wall on top (barrierLine) and the rest of the world is detailed beyond the fence. */
const MK={
 rnd(seed){let s=seed||7;return()=>(s=(s*16807)%2147483647)/2147483647},
 /* wall along x (hz) or z with openings ops=[[offset from centre,width,bottom,top]...] measured from y0 */
 wall(B,hz,cx,cz,len,t,y0,y1,ops,c,k){ops=(ops||[]).slice().sort((p,q)=>p[0]-q[0]);let cur=-len/2;
  const put=(a,b,lo,hi)=>{if(b-a<.03||hi-lo<.03)return;const m=(a+b)/2,l=b-a;B(hz?cx+m:cx,hz?cz:cz+m,hz?l:t,hz?t:l,hi,lo,c,k)};
  for(const[o,w,bt,tp]of ops){put(cur,o-w/2,y0,y1);put(o-w/2,o+w/2,y0,y0+bt);put(o-w/2,o+w/2,y0+tp,y1);cur=o+w/2}put(cur,len/2,y0,y1)},
 /* four walls with doors / windows per side (n = -z, s = +z, w = -x, e = +x) and an optional flat roof */
 room(B,o){const{x,z,w,d,h,y0=0,t=.35,c,k,roof=1,rc,rk,rt=.3,dr={},wn={}}=o,ops=s=>[...(dr[s]||[]).map(([f,wd,ht])=>[f,Math.max(2.4,wd||2.4),0,ht||2.4]),...(wn[s]||[]).map(([f,wd])=>[f,wd||1.2,1.1,2.1])],W=MK.wall;
  W(B,1,x,z-d/2+t/2,w,t,y0,y0+h,ops('n'),c,k);W(B,1,x,z+d/2-t/2,w,t,y0,y0+h,ops('s'),c,k);W(B,0,x-w/2+t/2,z,d-2*t,t,y0,y0+h,ops('w'),c,k);W(B,0,x+w/2-t/2,z,d-2*t,t,y0,y0+h,ops('e'),c,k);
  if(roof)B(x,z,w+.2,d+.2,y0+h+rt,y0+h,rc||c,rk||k)},
 /* stairs: n steps rising .3 each, running in direction dir ('n','s','e','w'), starting at (x,z) = bottom centre */
 stairs(B,x,z,wd,n,dir,c,k,rise=.3,run=.62,y0=0){for(let i=0;i<n;i++){const o=(i+.5)*run,top=y0+rise*(i+1),px=dir=='e'?x+o:dir=='w'?x-o:x,pz=dir=='s'?z+o:dir=='n'?z-o:z,hz=dir=='e'||dir=='w';B(px,pz,hz?run:wd,hz?wd:run,top,y0,c,k)}},
 /* a floor slab with a rectangular hole (hx,hz centre, hw,hd size) so a stairwell can pass through */
 slab(B,x,z,w,d,top,y0,c,k,hole){if(!hole){B(x,z,w,d,top,y0,c,k);return}const[hx,hz,hw,hd]=hole,x0=x-w/2,x1=x+w/2,z0=z-d/2,z1=z+d/2,a=hx-hw/2,b=hx+hw/2,e=hz-hd/2,f=hz+hd/2;
  if(a-x0>.05)B((x0+a)/2,z,a-x0,d,top,y0,c,k);if(x1-b>.05)B((b+x1)/2,z,x1-b,d,top,y0,c,k);if(e-z0>.05)B(hx,(z0+e)/2,hw,e-z0,top,y0,c,k);if(z1-f>.05)B(hx,(f+z1)/2,hw,z1-f,top,y0,c,k)}
};

/* ===================== RUST ===================== */
/* An abandoned desert oil refinery. Layout traced from the reference top-down map (1 map pixel = .075 m): a central drilling tower with a conveyor stair, a tank farm top right,
   sheds on the left, a pit and low barriers right of centre, a tanker truck and pickup bottom right. Play area 51 x 59 m inside a fence; dunes, a pipeline, a derrick,
   a rail line with train cars, containers, rocks and pylons surround it. */
MAPS.Rust={d:'Desert oil refinery: tower with a conveyor stair, tank farm, sheds and a pit',H:31,open:1,sky:0xdcc79f,gr:0xcdb78a,gt:'sand',bc:0xc4a878,hemi:.95,hemiC:0xfff2d8,hemiG:0x8a7650,sunI:.95,sunC:0xfff0d0,fogF:150,
 fb:[[-6,-27],[6,27]],zn:[[-10,14],[2,-3],[17,-10]],tb:[-25.8,-29.8,25.8,29.8],
 inside:(x,z)=>Math.abs(x)<24&&Math.abs(z)<28,
 lights:[[-2.6,17.2,-5.3,0xff8a30,1.6,46],[-2.6,4,-5,0xffd9a0,.5,14]],
 b(){const a=[],v=MAPS.Rust._v,B=(x,z,w,d,h,y0,c,k)=>a.push([x,z,w,d,h,y0||0,c,k]),V=(x,z,w,d,h,y0,c,s,t)=>v.push([x,z,w,d,h,y0||0,c,s||'b',t]),
  X=p=>(p-948)*.075,Z=p=>(p-945)*.075,R=(x0,y0,x1,y1)=>[(X(x0)+X(x1))/2,(Z(y0)+Z(y1))/2,(x1-x0)*.075,(y1-y0)*.075],rnd=MK.rnd(11),
  TAN=0xc9ad7c,SAND=0xd8c398,RUST=0x8a4a2a,DRUST=0x5a3320,STEEL=0x7a8087,RED=0xa03a2a,WHITE=0xd9d4c4,CONC=0xb5ac98,YEL=0xd7a82a,BLK=0x222426,OLIVE=0x6b6a45;
  const barrel=(x,z,c)=>{B(x,z,.7,.7,1.05,0,c||RUST,'rust');V(x,z,.74,.74,1.05,0,c||RUST,'c','rust');V(x,z,.78,.78,.08,.5,0x2a2a2a,'c')},
   crate=(x,z,w,d,h,c)=>{B(x,z,w,d,h,0,c||0x9a7a4a,'plank')},
   jersey=(x,z,hz,n)=>{for(let i=0;i<n;i++){const p=(i-(n-1)/2)*3.1,bx=hz?x+p:x,bz=hz?z:z+p;B(bx,bz,hz?3:.7,hz?.7:3,1.05,0,CONC,'concrete');V(bx,bz,hz?2.9:.9,hz?.9:2.9,.5,0,CONC,'b','concrete')}},
   sand=(x,z,w,d)=>{B(x,z,w,d,1.0,0,0xb89a60);V(x,z,w+.1,d+.1,1.1,.55,0xa88a52,'s')},
   container=(x,z,hz,c,h0)=>{const L=6,Wd=2.5,y=h0||0;B(x,z,hz?L:Wd,hz?Wd:L,y+2.6,y,c,'rust');for(let i=-2;i<=2;i++)V(hz?x+i*1.1:x,hz?z:z+i*1.1,hz?.08:Wd+.04,hz?Wd+.04:.08,y+2.55,y+.1,0x00000000+(c==RED?0x7a2a1e:0x4a4a3a),'b')};
  /* ---- ground: tarmac patches, oil stains, tracks and cracks ---- */
  const pad=(x0,y0,x1,y1,c)=>{const r=R(x0,y0,x1,y1);V(r[0],r[1],r[2],r[3],.05,0,c||0x7d7466,'b','concrete')};
  pad(860,800,1100,1100);pad(640,1080,800,1260,0x8a8070);pad(1090,1090,1280,1260,0x8a8070);pad(1100,640,1280,800,0x8f8574);pad(700,640,860,780,0x8a8070);
  for(let i=0;i<26;i++){const x=(rnd()-.5)*46,z=(rnd()-.5)*54;V(x,z,1+rnd()*3.5,1+rnd()*3,.04,0,0x3a2c22,'s')}
  for(let i=0;i<14;i++)V((rnd()-.5)*44,(rnd()-.5)*54,.12,2+rnd()*4,.045,0,0x5a4e3a,'b','concrete');
  for(let i=0;i<30;i++)V((rnd()-.5)*48,(rnd()-.5)*56,.5+rnd()*1.2,.5+rnd()*1.2,.3+rnd()*.3,0,0xbfa574,'s');
  /* ---- the central tower: open bay under a steel deck, a tall body above, and a conveyor stair up the south side ---- */
  const T=R(870,830,960,925),TB=R(897,852,943,903);
  for(const sx of[-1,1])for(const sz of[-1,1]){B(T[0]+sx*(T[2]/2-.45),T[1]+sz*(T[3]/2-.45),.7,.7,3.2,0,RUST,'rust');V(T[0]+sx*(T[2]/2-.45),T[1]+sz*(T[3]/2-.45),.9,.9,3.2,0,DRUST,'b','rust')}
  B(T[0],T[1],.7,.7,3.2,0,RUST,'rust');B(T[0]-2.4,T[1],.6,.6,3.2,0,RUST,'rust');B(T[0]+2.4,T[1],.6,.6,3.2,0,RUST,'rust');
  B(T[0],T[1],T[2],T[3],3.6,3.2,STEEL,'metal');                                   /* deck */
  B(TB[0],TB[1],TB[2],TB[3],14.5,3.6,TAN,'metal');                                 /* tower body */
  V(TB[0],TB[1],TB[2]+.4,TB[3]+.4,9.5,3.6,0x7d8590,'b','metal');V(TB[0],TB[1]+TB[3]/2+.25,3,.1,12.6,6.5,0xf2f0e6,'b','plank');V(TB[0],TB[1]+TB[3]/2+.32,2,.05,11.6,8.0,0xc8362a,'e');
  for(const sx of[-1,1])for(let i=0;i<4;i++){V(TB[0]+sx*(TB[2]/2+.05),TB[1]-1.4+i*1.1,.08,.7,6.6,4.6,0x1b2430,'g');V(TB[0]-1.2+i*.8,TB[1]-TB[3]/2-.05,.5,.08,9.2,5.6,0x1b2430,'g')}
  /* upper section with railings, two tall exhaust stacks with a flame */
  V(TB[0],TB[1],TB[2]-1,TB[3]-1,18,14.5,0x8a8f96,'b','metal');V(TB[0]-.8,TB[1],.9,.9,22,18,0xb9a070,'c','metal');V(TB[0]+.8,TB[1],.9,.9,22,18,0xb9a070,'c','metal');V(TB[0]-.8,TB[1],.5,.5,24.5,22,0xff8a30,'k');V(TB[0]-.8,TB[1],.3,.3,25.5,22.6,0xffd070,'e');
  for(let i=0;i<10;i++){const q=i/10*6.28;V(TB[0]+Math.cos(q)*2.5,TB[1]+Math.sin(q)*2.5,.1,.1,15.6,14.5,0x2a2a2e,'b','metal')}V(TB[0],TB[1]-2.5,5.2,.08,15.5,15.4,0x2a2a2e,'b');V(TB[0],TB[1]+2.5,5.2,.08,15.5,15.4,0x2a2a2e,'b');
  /* catwalk bracing under the deck and a ladder up the west leg */
  for(let i=0;i<8;i++){V(T[0]-T[2]/2+.2,T[1]+T[3]/2-.4-i*.8,.05,.05,.3+i*.4,0,YEL,'b')}
  for(let i=0;i<9;i++)V(T[0]-T[2]/2-.12,T[1]+T[3]/2-.8,.04,.5,.4+i*.38,.3+i*.38,YEL,'b');
  crate(T[0]-1.8,T[1]+1.2,1.4,1.4,1.4);crate(T[0]+2,T[1]-1.6,1.2,1.2,1.1,0x6a5a3a);barrel(T[0]+1.3,T[1]+2,DRUST);barrel(T[0]+.5,T[1]+2.4,0x8a2a1a);barrel(T[0]-2.4,T[1]-1.8,0x2a4a6a);
  B(T[0]+1.8,T[1]+1.5,.9,.9,1.2,0,0x6a6a60,'metal');V(T[0]+1.8,T[1]+1.5,.95,.95,1.25,0,0x6a6a60,'b','metal');
  /* conveyor stair: 12 steps (.3 each) up to a bridge that meets the deck at 3.6 */
  const SX=-1.6;MK.stairs(B,SX,Z(1095),2.4,12,'n',0x8a8f96,'metal',.3,.625);
  B(SX,(Z(995)+Z(925))/2,2.4,Z(995)-Z(925),3.6,3.2,0x8a8f96,'metal');
  for(const sd of[-1,1]){V(SX+sd*1.25,(Z(1095)+Z(925))/2+1.2,.08,Z(1095)-Z(925)-2.4,1.1,0,0x6a6f76,'b','metal');for(let i=0;i<12;i++)V(SX+sd*1.25,Z(1095)-.4-i*.625,.08,.08,.3*(i+1)+1.0,.3*i,0x2a2a2e,'b');V(SX+sd*1.25,(Z(995)+Z(925))/2,.08,Z(995)-Z(925),4.7,4.6,0x2a2a2e,'b')}
  for(let i=0;i<6;i++){V(SX,Z(1095)-1+i*1.2,2.5,.14,.3*(2*i+3)+.02,.3*(2*i+3),0xd7a82a,'b')}
  B(SX-1.0,Z(990),.5,.5,3.2,0,RUST,'rust');B(SX+1.0,Z(990),.5,.5,3.2,0,RUST,'rust');B(SX,Z(935),.5,.5,3.2,0,RUST,'rust');
  V(SX,Z(945),.5,.7,.04,0,0x7a2a1e,'b');
  /* ---- tank farm top right: concrete bund, three tanks, pipes and a ramp ---- */
  const TF=R(1130,640,1250,785);V(TF[0],TF[1],TF[2],TF[3],.35,0,0xa8a08c,'b','concrete');
  for(const[px,py]of[[1172,692],[1218,692],[1195,744]]){const x=X(px),z=Z(py);B(x,z,4.2,4.2,7,0,RUST,'rust');V(x,z,4.4,4.4,7,0,0x8c5030,'c','rust');V(x,z,4.3,4.3,7.7,7,0x6a3a24,'k');V(x,z,4.6,4.6,.2,5.2,DRUST,'c');V(x,z,4.6,4.6,.2,2.4,DRUST,'c');V(x+2.4,z,.25,.25,5.5,.3,0x5a5a60,'c')}
  B(TF[0]-2.8,TF[1]+5.2,6,.4,1.0,0,CONC,'concrete');B(TF[0]+4.5,TF[1]+5.2,5,.4,1.0,0,CONC,'concrete');crate(TF[0]-4,TF[1]+3,1.6,1.6,1.3);barrel(TF[0]+5,TF[1]-1,RED);barrel(TF[0]+5.8,TF[1]-.5,RUST);
  V(TF[0],TF[1]-4,10,.35,2.3,1.9,0x5a5a60,'b','metal');for(let i=-4;i<=4;i+=2)V(TF[0]+i,TF[1]-4,.2,.2,2,0,0x4a4a50,'b');
  /* ---- top left sheds (two) ---- */
  const s1=R(748,683,792,767),s2=R(795,688,830,767);
  MK.room(B,{x:s1[0],z:s1[1],w:s1[2],d:s1[3],h:3.2,c:TAN,k:'rust',rc:DRUST,rk:'metal',dr:{s:[[-.4,1.9]],e:[[.8,1.6]]},wn:{n:[[0,1.2]],w:[[-1.4,1.2]]}});
  MK.room(B,{x:s2[0],z:s2[1],w:s2[2],d:s2[3],h:3.0,c:0xb8997a,k:'rust',rc:DRUST,rk:'metal',dr:{s:[[.4,1.9]],w:[[.8,1.6]]},wn:{n:[[0,1.2]],e:[[-1,1.2]]}});
  crate(s1[0]-.3,s1[1]-1.5,1.3,1.3,1.2);barrel(s2[0]+.6,s2[1]-1.8);barrel(s2[0]-.2,s2[1]-1.6,0x2a4a6a);
  /* ---- big shed bottom left with two doors, windows and crates inside ---- */
  const bs=R(683,1090,773,1183);
  MK.room(B,{x:bs[0],z:bs[1],w:bs[2],d:bs[3],h:3.8,c:0xcfb58a,k:'rust',rc:0x6a4a30,rk:'metal',dr:{n:[[.8,2.2]],e:[[-.5,2.2]],w:[[1.5,1.8]]},wn:{s:[[-1.5,1.4],[1.5,1.4]],n:[[-2,1.2]],e:[[2.1,1.2]]}});
  crate(bs[0]-1.8,bs[1]+1.6,1.6,1.6,1.5);crate(bs[0]-1.8,bs[1]+.1,1.2,1.2,1.1,0x6a5a3a);crate(bs[0]+1.8,bs[1]+2.2,1.3,2,1.0,0x6a5a3a);barrel(bs[0]+2.2,bs[1]-1.8);B(bs[0],bs[1]+.5,1.6,.5,1.0,0,0x555a5e,'metal');
  V(bs[0],bs[1],bs[2]-.6,bs[3]-.6,.06,0,0x6a5a46,'b','plank');V(bs[0]+1,bs[1]-2.9,.9,.9,3.7,3.4,0xffe0a0,'e');
  /* ---- two containers bottom left, a container stack bottom centre ---- */
  const c1=R(673,1185,728,1215),c2=R(673,1218,728,1245);container(c1[0],c1[1],1,RED);container(c2[0],c2[1],1,0x4a5a6a);
  const c3=R(876,1215,958,1275);container(c3[0],c3[1],1,0x6b6a45);container(c3[0]+.6,c3[1]+.2,1,RED,2.6);for(let i=0;i<5;i++)B(c3[0]-3.3+i*.3,c3[1]+1.7+i*.3,.4,.4,.4+i*.1,0,0x6a4a2a);
  MK.stairs(B,c3[0]-3.3,c3[1]+3.3,1,8,'n',0x6a4a2a,'plank',.3,.34);   /* pallet ramp */
  /* ---- right shed, with a loading dock ---- */
  const rs=R(1190,827,1280,960);
  MK.room(B,{x:rs[0],z:rs[1],w:rs[2],d:rs[3],h:3.6,c:0xd1b894,k:'rust',rc:0x5a3a28,rk:'metal',dr:{w:[[-2,2],[3,2]],s:[[1.4,2.2]]},wn:{e:[[-2.5,1.4],[.5,1.4],[3.2,1.4]],n:[[0,1.4]]}});
  B(rs[0]-4.4,rs[1]+1.6,2,6,.9,0,CONC,'concrete');crate(rs[0]+1,rs[1]-2,1.5,1.5,1.5);crate(rs[0]-1.4,rs[1]-2.6,1.2,1.2,1.2,0x6a5a3a);barrel(rs[0]+2,rs[1]+3);barrel(rs[0]+2.8,rs[1]+3.2,0x8a2a1a);
  /* ---- guard shack mid left ---- */
  const gs=R(753,878,805,922);MK.room(B,{x:gs[0],z:gs[1],w:gs[2],d:gs[3],h:2.8,c:0xc4a878,k:'rust',rc:DRUST,rk:'metal',dr:{e:[[0,1.6]]},wn:{n:[[0,1]],s:[[0,1]],w:[[0,1]]}});B(gs[0]-1,gs[1],.8,1.8,.9,0,0x6a5a3a,'plank');
  /* ---- long walls on the left: a lane with two gaps ---- */
  MK.wall(B,0,X(700),(Z(712)+Z(1000))/2,Z(1000)-Z(712),.45,0,2.4,[[-4,2.4,0,2.4],[3,2.4,0,2.4]],CONC,'concrete');
  MK.wall(B,1,(X(700)+X(850))/2,Z(810),X(850)-X(700),.45,0,2.4,[[-4,2.4,0,2.4]],CONC,'concrete');
  for(let i=0;i<7;i++)V(X(700),Z(715)+i*3,.7,.5,2.6,2.4,0x8f8878,'b','concrete');
  /* ---- pit and low walls right of centre ---- */
  const pt=R(1005,1010,1075,1050);B(pt[0],pt[1]+pt[3]/2-.2,pt[2],.4,1.25,0,CONC,'concrete');B(pt[0]-pt[2]/2+.2,pt[1],.4,pt[3],1.25,0,CONC,'concrete');B(pt[0]+pt[2]/2-.2,pt[1],.4,pt[3],1.25,0,CONC,'concrete');
  V(pt[0],pt[1],pt[2]-.8,pt[3]-.8,.06,0,0x2a2118,'b','concrete');crate(pt[0]+.4,pt[1]-.3,1.4,1.4,1.3);barrel(pt[0]-1.4,pt[1]+.2,BLK);B(pt[0]+pt[2]/2+.6,pt[1]+.2,.5,pt[3]+.4,1.0,0,CONC,'concrete');
  /* ---- barrier strip right of centre ---- */
  jersey(X(1075),Z(965),1,4);jersey(X(1130),Z(965),1,2);
  /* ---- tanker truck and pickup bottom right, derelict car upper left ---- */
  B(18,12.4,2.6,2.6,2.9,0,WHITE,'metal');V(18,11.6,2.5,.1,2.4,1.6,0x2a3a4a,'g');V(18,12.4,2.7,2.7,.2,2.9,0x6a6a60,'b','metal');B(18,17.4,2.6,7,2.7,.4,0x9a5a2a,'rust');V(18,17.4,2.7,7.1,2.9,2.7,0x7a4a26,'b','rust');
  for(const sx of[-1,1])for(const zz of[11.8,16,18.5])V(18+sx*1.4,zz,.35,.9,.9,0,BLK,'c');for(const zz of[14,20.7])V(18,zz,2.65,.15,2.7,.4,0x5a3a20,'b');V(18,14.4,.8,.4,3.4,2.9,0x4a4a50,'c');
  B(7.7,19.3,2.2,4.8,1.1,0,0x4a4f52,'metal');B(7.7,18.2,2,1.8,1.85,.9,0x3a3f42,'metal');V(7.7,17.3,1.9,.08,1.75,1.1,0x1a2430,'g');for(const sx of[-1,1])for(const zz of[17.9,20.5])V(7.7+sx*1.05,zz,.3,.7,.7,0,BLK,'c');
  B(-9,-24,2,4.4,1.3,0,0x6a5a4a,'rust');V(-9,-24,1.95,4.3,1.9,1.2,0x4a3f35,'b','rust');B(14,-3,4.4,2,1.3,0,0x3a4a5a,'rust');V(14,-3,3,1.9,1.95,1.2,0x2a3a4a,'b','rust');
  /* ---- scattered cover: barrels, crates, sandbags, jersey barriers, pallets ---- */
  jersey(-4,-13,1,3);jersey(10,-8,0,2);jersey(-8,5,0,2);jersey(-23,3,0,2);jersey(23,-10,0,2);jersey(0,26,1,3);jersey(-22,-23,1,2);
  sand(-1,15,3.4,1);sand(-9,22,1,3.2);sand(13,6,3.2,1);sand(21,22,1,3.2);sand(-12,-5.8,1,3);
  barrel(-6,9.5);barrel(-6.8,9.8,0x2a4a6a);barrel(3,10,0x8a2a1a);barrel(12,-2.5);barrel(-3,-15.8,DRUST);barrel(-1.8,-16.3);barrel(10.5,24,0x2a4a6a);barrel(22,6,RUST);barrel(22.8,6.4,RED);barrel(-21,-8.5,RUST);
  crate(-2,9,1.6,1.6,1.4);crate(8,12,1.4,1.4,1.2,0x6a5a3a);crate(1.5,-12,1.3,1.3,1.2);crate(-15,-9,1.5,1.5,1.5);crate(-14.5,-7.2,1.2,1.2,1.1,0x6a5a3a);crate(10,26,1.5,1.5,1.4);crate(22,-5,1.3,1.3,1.1,0x6a5a3a);crate(-10,26,1.7,1.7,1.5);
  B(-6.3,-12.8,1.5,.8,.9,0,0x7a7a7a,'metal');B(4,-8,.9,.9,1.9,0,0x5a5a60,'metal');B(12,18.5,.6,.6,2.2,0,0x5a5a60,'metal');
  /* ---- pipes on the ground (low, mantle-able), sign posts, lamps, hazard lines, tyres ---- */
  B(-3,-22,7,.7,.7,0,0x6a4a34,'rust');V(-3,-22,7.2,.8,.8,0,0x7a5a40,'b','rust');B(11,-26,.7,6,.7,0,0x6a4a34,'rust');V(11,-26,.8,6.2,.8,0,0x7a5a40,'b','rust');
  for(const[x,z]of[[-12,-10],[4,-25],[14,10],[-6,19],[22,-17],[-20,24]]){V(x,z,.18,.18,5.2,0,0x3a3a3e,'c');V(x+.5,z,1.2,.5,5.4,4.9,0x2a2a2e,'b');V(x+.9,z,.35,.35,5.0,4.8,0xfff0c0,'e')}
  for(const[x,z]of[[-18.8,-5],[17,-2.6],[2,19]]){for(let i=0;i<3;i++)B(x,z,.9,.9,.5+i*.5,0,0x1b1b1c,'c'),V(x,z,1,1,.5+i*.5,i*.5,0x1b1b1c,'c')}
  for(let i=0;i<6;i++){V(-23+i*2.6,26.3,1.2,.18,.06,0,i%2?YEL:BLK,'b')}for(let i=0;i<6;i++)V(23,-26+i*2.6,.18,1.2,.06,0,i%2?YEL:BLK,'b');
  /* ---- the fence ---- */
  barrierLine(a,-25.6,-29.6,25.6,-29.6,0);barrierLine(a,-25.6,29.6,25.6,29.6,1);barrierLine(a,-25.6,-29.6,-25.6,29.6,2);barrierLine(a,25.6,-29.6,25.6,29.6,0);
  return a},
 /* ---- the world beyond the fence ---- */
 deco(){const o=[],rnd=MK.rnd(23),V=(x,z,w,d,h,y0,c,s,t)=>o.push([x,z,w,d,h,y0||0,c,s||'b',t]),RUST=0x8a4a2a,DR=0x5a3320,SD=[0xcdb78a,0xc7b080,0xd3bd90,0xbfa874];
  /* dunes in rings, bigger further out, with a pale crest on top */
  for(let r=0;r<150;r++){const q=rnd()*6.283,d=34+rnd()*100,x=Math.cos(q)*d,z=Math.sin(q)*d*1.05;if(Math.abs(x)<28&&Math.abs(z)<32)continue;const w=14+rnd()*30+d*.12,hh=2+rnd()*7+d*.045;V(x,z,w,w*(.6+rnd()*.8),hh-hh*.4,-hh*.8,SD[r&3],'s','sand')}
  for(let i=0;i<12;i++){const q=i/12*6.283+.2;V(Math.cos(q)*125,Math.sin(q)*125,80,60,34,-8,0xc2a874,'s','sand')}
  for(let r=0;r<80;r++){const q=rnd()*6.283,d=30+rnd()*50,x=Math.cos(q)*d,z=Math.sin(q)*d;if(Math.abs(x)<27.5&&Math.abs(z)<31.5)continue;V(x,z,.6+rnd()*1.6,.5+rnd()*1.4,.5+rnd()*1.1,0,0x8a7a62,'s')}
  /* pipeline along the west side with flanges, supports and a riser */
  for(let i=0;i<6;i++){const z=-52+i*20;V(-34,z+7,2.4,16.4,2.7,.4,0x8a6a4a,'b','rust');V(-34,z-1.5,2.8,.5,2.9,.2,0x5a4a3a,'b');V(-34,z+15,2.8,.5,2.9,.2,0x5a4a3a,'b');for(const dz of[3,11])V(-34,z+dz,.7,.7,.5,0,0x4a3a2a,'b','concrete')}
  V(-34,-60,2.4,2.4,5,.4,0x8a6a4a,'b','rust');V(-34,66,2.4,2.4,5,.4,0x8a6a4a,'b','rust');V(-41,20,2.2,30,2.4,.2,0x7a5a3e,'b','rust');V(-41,36,2.6,.6,2.9,.1,0x4a3a2a,'b');
  /* the derrick: four legs narrowing upward, rings and X braces, crown block and a platform */
  const lat=(x,z,hh,w0)=>{for(let lv=0;lv<10;lv++){const y=lv*hh/10,w=w0*(1-lv*.075),y1=y+hh/10;for(const sx of[-1,1])for(const sz of[-1,1])V(x+sx*w/2,z+sz*w/2,.32,.32,y1,y,0x8a5a3a,'b','rust');V(x,z+w/2,w,.14,y+.2,y,0x7a4a2a,'b');V(x,z-w/2,w,.14,y+.2,y,0x7a4a2a,'b');V(x+w/2,z,.14,w,y+.2,y,0x7a4a2a,'b');V(x-w/2,z,.14,w,y+.2,y,0x7a4a2a,'b');
    for(const sd of[-1,1]){V(x+sd*w*.25,z+w/2,.1,.1,y1,y,0x6a3a22,'b');V(x+sd*w*.25,z-w/2,.1,.1,y1,y,0x6a3a22,'b')}}V(x,z,w0*.4,w0*.4,hh+2.4,hh,0x5a5a60,'b','metal');V(x,z,w0*.8,w0*.8,hh*.62,hh*.6,0x6a6a60,'b','metal')};
  lat(-38,-38,34,7);lat(46,-52,20,4.6);
  /* power pylons on a diagonal, with a catenary of dark cables suggested by thin beams */
  for(let i=0;i<5;i++){const x=-70+i*34,z=60-i*30;lat(x,z,22,3.6);V(x,z,10,.3,21.2,20.6,0x2a2a2e,'b');V(x,z,8,.3,18.5,18,0x2a2a2e,'b')}
  /* the rail line to the east: track, sleepers, tank cars, a locomotive and a boxcar */
  V(40,0,.2,160,.2,0,0x3a3a3e,'b');V(41.6,0,.2,160,.2,0,0x3a3a3e,'b');for(let i=-38;i<38;i++)V(40.8,i*2.1,2.8,.5,.22,0,0x3a2a1e,'b','plank');
  const car=(z,len,c,h)=>{V(40.8,z,2.9,len,h+.6,.7,c,'b','rust');V(40.8,z,2.4,len-1.2,h+1.2,h+.5,0x4a3a2a,'b','rust');for(const dz of[-1,1])for(const dx of[-1,1])V(40.8+dx*1.1,z+dz*len*.32,.4,1.6,.9,0,0x1b1b1c,'c')};
  car(-52,11,0x3a3a3e,2.6);car(-39,11,0x6a2a1e,2.8);car(-26,12,0x2a2a2e,2.4);car(-12,10,0x5a3a22,2.6);car(6,12,0x3a3a3e,2.6);car(24,11,0x6a4a2a,2.8);car(40,12,0x4a4a50,2.6);
  V(40.8,-66,3.4,13,4.6,.7,0x2a2f36,'b','metal');V(40.8,-66,2.8,6,5.6,4.2,0x1b2028,'b');V(40.8,-60.4,3.5,2.2,3.4,.6,0xd7a82a,'b');
  /* shipping containers stacked east and south east beyond the fence */
  for(let i=0;i<6;i++){const c=[0x9a3a2a,0x3a5a6a,0x6b6a45,0x8a5a2a][i&3];V(32,-4+i*6.4,2.7,6.1,2.7,0,c,'b','rust');if(i%2==0)V(32,-4+i*6.4+.5,2.7,6,5.4,2.7,[0x3a5a6a,0x9a3a2a][(i>>1)&1],'b','rust')}
  /* rocky cliff and rubble to the south with scrub and a ruined shed */
  for(let r=0;r<40;r++){const x=(rnd()-.5)*70,z=36+rnd()*18,w=3+rnd()*7;V(x,z,w,w*.8,w*.7,-w*.2,0x8a7a62+((rnd()*20|0)<<8),'s')}
  for(let r=0;r<30;r++){const x=(rnd()-.5)*62,z=33+rnd()*14;V(x,z,.8+rnd(),.8+rnd(),.5+rnd()*.7,0,0x6a6a3a,'s')}
  V(24,40,6,5,3,0,0x9a7a52,'b','rust');V(24,40,6.4,5.4,3.3,3,0x5a3a28,'b','metal');V(-6,45,4,3,2.6,0,0x8a6a4a,'b','rust');
  /* palms near the south east corner and by the fence */
  const palm=(x,z)=>{V(x,z,.35,.35,5,0,0x6a4a2a,'c');for(let i=0;i<7;i++){const q=i/7*6.283;V(x+Math.cos(q)*1.1,z+Math.sin(q)*1.1,2.6,.35,5.4-Math.abs(Math.sin(q))*.2,5,0x4a6a2a,'b')}V(x,z,.7,.7,5.5,4.9,0x3a5a22,'s')};
  palm(36,28);palm(38,31);palm(-30,38);palm(33,-36);for(let i=0;i<8;i++){const q=rnd()*6.283;V(Math.cos(q)*60,Math.sin(q)*60,1.2,1.2,1.4,0,0x6a6a3a,'s')}
  /* fence posts and sagging mesh outside the play wall for atmosphere, warning signs and a gate */
  for(let i=-12;i<=12;i++){V(i*2.1,-30.3,.12,.12,2.6,0,0x6a6a6e,'b');V(i*2.1,30.3,.12,.12,2.6,0,0x6a6a6e,'b')}for(let i=-14;i<=14;i++){V(-26.3,i*2.1,.12,.12,2.6,0,0x6a6a6e,'b');V(26.3,i*2.1,.12,.12,2.6,0,0x6a6a6e,'b')}
  V(0,-30.4,5,.08,2.5,.2,0xc8362a,'b');V(-8,30.4,2.4,.08,1.6,.8,0xe8d040,'b');V(26.4,10,.08,2.4,1.6,.8,0xe8d040,'b');
  /* wrecked vehicle and drums west of the fence, a burnt-out bus on the north side */
  V(-30,-12,4.6,2.2,1.5,0,0x4a3f35,'b','rust');V(-30,-12,2.6,2,2.2,1.2,0x2a2a2e,'b');V(-4,-36,10,2.7,3,.3,0x6a5a3a,'b','rust');V(-4,-36,9.2,2.6,3.4,3,0x4a4a46,'b','metal');
  for(let i=0;i<5;i++)V(-29+i*.8,6+(i%2)*.7,.7,.7,1.05,0,i%2?0x8a2a1a:RUST,'c','rust');
  return o}};
;
/* ######## decay.js ######## */
/* ===================== decay.js ===================== */
/* ---------- Decay: an abandoned downtown, years after everyone left. Completely new layout.
   Boulevard east to west with a dry plaza at the crossing, an avenue north and south. Enterable buildings: Saint Aldric church with a ruined tower, Harlow Court apartments,
   a row of shops with a bank vault, the Meridian Hotel with a collapsed east wing and a rubble ramp to its second floor, a half built office skeleton, a parking deck with ramps,
   a market hall full of stalls, a metro entrance, a gas station with a canopy, a warehouse with a mezzanine and a derailed train on the boulevard.
   The play area is fenced (barrierLine: fence plus an invisible wall) and a whole ruined city continues beyond it. ---------- */
MAPS.Decay={d:'Abandoned downtown: ruined hotel, church, market hall, parking deck and a derailed train',H:52,open:1,sky:0x9aa5a3,gr:0x6a6a62,gt:'concrete',bc:0x9a968a,hemi:.8,hemiC:0xdfe6e4,hemiG:0x4a4a42,sunI:.5,sunC:0xf0ece0,fogF:125,
 fb:[[-38,1],[42,-2]],zn:[[-24,1],[-1,9],[24,-9]],tb:[-46,-46,46,46],
 inside:(x,z)=>Math.abs(x)<44&&Math.abs(z)<44,
 lights:[[18,5,-27,0xff3a2a,1.3,22],[-34,6,-30,0xa0c0ff,.9,22],[38,5,-10,0xffd080,1.0,24],[38,6,26,0xffe0b0,1.1,28],[-31,5,18,0xffd8a0,1.0,26],[-12,2.5,1,0xff7a3a,1.0,16],[16,4,-8,0xffb060,.7,16]],
 b(){const a=[],v=MAPS.Decay._v,B=(x,z,w,d,h,y0,c,k)=>a.push([x,z,w,d,h,y0||0,c,k]),V=(x,z,w,d,h,y0,c,s,t)=>v.push([x,z,w,d,h,y0||0,c,s||'b',t]),rnd=MK.rnd(5),
  CONC=0xa8a498,DCON=0x7d7a70,BRK=0x8a5a48,PLS=0xb9b09a,GRN=0x4a6a3a,DG=0x35502e,RST=0x7a4a2e,WOOD=0x6a5a44,BLK=0x1f2022,GLS=0x2a3a42;
  const pick=a_=>a_[rnd()*a_.length|0];
  /* ---------- props ---------- */
  const car=(x,z,hz,c,burnt)=>{const L=4.4,Wd=1.9,l=hz?L:Wd,d=hz?Wd:L;B(x,z,l,d,.95,0,burnt?0x2a2420:c,'concrete');B(x,z,hz?2.4:Wd-.1,hz?Wd-.1:2.4,1.5,.9,burnt?0x1b1816:c,'concrete');V(x,z,hz?2.2:Wd,hz?Wd:2.2,1.46,1.0,GLS,'g');for(const sx of[-1,1])for(const sz of[-1,1])V(x+(hz?sx*1.4:sz*.9),z+(hz?sz*.9:sx*1.4),.7,.7,.7,0,BLK,'c');if(burnt)V(x,z,l*.9,d*.9,1.0,.9,0x3a1a0c,'b','rust')},
   rub=(x,z,r,n,mx)=>{for(let i=0;i<n;i++){const q=rnd()*6.28,dd=rnd()*r,w=.7+rnd()*1.9,h=.3+rnd()*(mx||1.1);B(x+Math.cos(q)*dd,z+Math.sin(q)*dd,w,.7+rnd()*1.6,h,0,pick([CONC,DCON,BRK,PLS]),'concrete')}for(let i=0;i<n*2;i++){const q=rnd()*6.28,dd=rnd()*r*1.1;V(x+Math.cos(q)*dd,z+Math.sin(q)*dd,.3+rnd()*.9,.3+rnd()*.8,.25+rnd()*.4,0,pick([CONC,DCON,0x5a5448]),'s')}},
   tree=(x,z)=>{B(x,z,.5,.5,3.4,0,0x4a3f35,'plank');V(x,z,.7,.7,3.4,0,0x3a3028,'c');for(let i=0;i<6;i++){const q=i*1.05+rnd();V(x+Math.cos(q)*.9,z+Math.sin(q)*.9,1.8,.12,3.2+rnd()*1.4,3+rnd(),0x3a3028,'b')}},
   lamp=(x,z,bent)=>{V(x,z,.16,.16,5.4,0,0x3a3d40,'c');V(x+(bent?-.9:.7),z,1.6,.2,5.5,5.3,0x3a3d40,'b');if(!bent)V(x+1.4,z,.4,.25,5.3,5.15,0xd8d0a8,'e')},
   bench=(x,z,hz)=>{B(x,z,hz?1.8:.5,hz?.5:1.8,.5,0,WOOD,'plank');V(x+(hz?0:-.25),z+(hz?-.25:0),hz?1.8:.1,hz?.1:1.8,.95,.5,WOOD,'b','plank')},
   dump=(x,z,hz,c)=>{B(x,z,hz?2.2:1.2,hz?1.2:2.2,1.3,0,c||0x3a5a3a,'metal');V(x,z,hz?2.3:1.3,hz?1.3:2.3,1.38,1.3,0x2a2a2a,'b')},
   sand=(x,z,hz,L)=>{B(x,z,hz?L:1,hz?1:L,1.0,0,0xa8946a);V(x,z,hz?L+.1:1.1,hz?1.1:L+.1,1.1,.6,0x9a8660,'s')},
   jers=(x,z,hz,n)=>{for(let i=0;i<n;i++){const p=(i-(n-1)/2)*3.1,bx=hz?x+p:x,bz=hz?z:z+p;B(bx,bz,hz?3:.7,hz?.7:3,1.05,0,0xb5b0a2,'concrete')}},
   vine=(x,z,hz,L,h)=>{for(let i=0;i<Math.max(2,L/1.3|0);i++){const o=-L/2+rnd()*L,hh=1+rnd()*(h||5);V(hz?x+o:x,hz?z:z+o,hz?.5+rnd()*.7:.12,hz?.12:.5+rnd()*.7,hh,0,pick([GRN,DG,0x5a7a3a]),'b','grass')}},
   graf=(x,z,hz,L)=>{for(let i=0;i<3;i++){const o=(rnd()-.5)*L*.7;V(hz?x+o:x,hz?z:z+o,hz?.5+rnd()*1.5:.06,hz?.06:.5+rnd()*1.5,1.2+rnd()*1.2,.8,pick([0xc8362a,0x2a7ac8,0xe8c020,0x40c060,0xe8e8e8]),'b')}};
  const ops=(L,skip,lo,hi,step)=>{const r=[];for(let o=-L/2+2;o<L/2-1.3;o+=step||3.4){if(skip.some(([s,w])=>Math.abs(o-s)<Math.max(2.4,w)/2+1.1))continue;if(rnd()<.14)continue;r.push([o,1.3,lo,hi])}return r};
  /* generic building: walls per floor with windows, doors on the ground floor, floor slabs with stairwell holes, stairs, flat roof. o.col collapses the east end */
  const bld=o=>{const{x,z,w,d,fl=2,fh=3.6,t=.4,c=CONC,k='stucco',dr={},wlo=.9,whi=2.4,roof=1,rc=DCON,rf=0,col=null,st=[0,'n'],nowin=0,gl=0}=o,S=['n','s','w','e'],
   L=s=>(s=='n'||s=='s')?w:d,pos=s=>s=='n'?[x,z-d/2+t/2,1]:s=='s'?[x,z+d/2-t/2,1]:s=='w'?[x-w/2+t/2,z,0]:[x+w/2-t/2,z,0];
   for(let f=0;f<fl;f++){const y0=f*fh;for(const s of S){if(col&&col.side==s&&f>=col.wall)continue;const[px,pz,hz]=pos(s),len=hz?w:d-2*t,dd=(dr[s]||[]).filter(()=>f==0).map(([o,wd,ht])=>[o,Math.max(2.4,wd||2.4),0,ht||2.5]);
      const wn=nowin?[]:ops(len,(dr[s]||[]).map(([o,wd])=>[o,wd||1.8]),wlo,whi,Math.max(3.2,len/5|0?3.4:3.4));MK.wall(B,hz,px,pz,len,t,y0,y0+fh,[...dd,...wn],c,k)}}
   /* floors */
   const stw=1.7,run=Math.ceil(fh/.3)*.55;
   for(let f=1;f<=fl;f++){const y=f*fh,last=f==fl;if(last&&!roof)continue;let sx=x,sw=w-2*t,sz=z,sd=d-2*t;if(col&&f>=col.slab){const dp=col.depth;sw-=dp;sx-=dp/2}
     const sdir=st[1],hole=f==fl?null:null;let hx,hz_,hw,hd;
     if(!last||roof){const fl_=f-1,flight=(fl_%2==0)?'n':'s',zz=flight=='n'?z-d/2+t+stw/2+.1:z+d/2-t-stw/2-.1,x0=x-w/2+t+.3,hole=f<=fl&&!last?[x0+run/2,zz,run+.3,stw+.3]:null;
      MK.slab(B,sx,sz,sw,sd,y,y-.35,rc,'concrete',f-1>=0&&f<=fl&&!last?[x0+run/2,zz,run+.4,stw+.3]:null);if(f==fl)B(x,z,w+.3,d+.3,y+.3,y,rc,'concrete')}}
   /* stair flights: floor 0->1 along the north wall rising east, 1->2 along the south wall, ... (the hole above each flight is cut in the slab) */
   for(let f=0;f<fl-1;f++){const flight=(f%2==0)?'n':'s',zz=flight=='n'?z-d/2+t+stw/2+.1:z+d/2-t-stw/2-.1,x0=x-w/2+t+.3;MK.stairs(B,x0,zz,stw,Math.ceil(fh/.3),'e',DCON,'concrete',fh/Math.ceil(fh/.3),.55,f*fh)}
   if(fl>=2&&true){/* ground to first floor flight is always present */}
   /* weathering */
   for(const s of S){const[px,pz,hz]=pos(s),len=hz?w:d;const off=s=='n'?-.3:s=='s'?.3:s=='w'?-.3:.3;if(rnd()<.8)vine(hz?x:x+(s=='e'?1:-1)*(w/2+.1),hz?z+(s=='s'?1:-1)*(d/2+.1):z,hz,len*.8,fl*fh-1);if(rnd()<.4)graf(hz?x:x+(s=='e'?1:-1)*(w/2+.06),hz?z+(s=='s'?1:-1)*(d/2+.06):z,hz,len)}
   V(x,z,w-1,d-1,fl*fh+.7,fl*fh+.3,0x4a4a44,'b','concrete');for(let i=0;i<4;i++)V(x+(rnd()-.5)*w*.7,z+(rnd()-.5)*d*.7,.9+rnd()*1.3,.9+rnd()*1.3,fl*fh+1.1+rnd()*.8,fl*fh+.3,pick([0x5a5448,0x6a665a]),'b','concrete');
   if(gl)for(const s of S){const[px,pz,hz]=pos(s);for(let i=0;i<6;i++){const o=(rnd()-.5)*(hz?w:d)*.8;V(hz?x+o:px,hz?pz:z+o,hz?.7:.05,hz?.05:.7,.5,.0,0x8aa0a8,'g')}}};
  /* ====================== STREETS, GROUND ====================== */
  V(0,1,100,10,.06,0,0x4a4b4a,'b','asphalt');V(-1,-25,10,42,.06,0,0x4a4b4a,'b','asphalt');V(-1,27,10,42,.06,0,0x4a4b4a,'b','asphalt');
  for(const s of[-1,1])for(const[xx,zz,w,d]of[[0,1+s*5.6,100,2.2],[-1+s*5.6,-25,2.2,42],[-1+s*5.6,27,2.2,42]])V(xx,zz,w,d,.14,0,0x8a8678,'b','concrete');
  for(let i=-46;i<46;i+=5){V(i,1,2.6,.18,.07,0,0xd8c030,'b');V(-1,i<-4?i:i+8,.18,2.6,.07,0,0xd8c030,'b')}
  for(let i=0;i<5;i++){V(-1.6+i*.8,-4.6,.45,1.4,.07,0,0xe0e0d8,'b');V(-1.6+i*.8,6.6,.45,1.4,.07,0,0xe0e0d8,'b')}
  for(let i=0;i<28;i++){const x=(rnd()-.5)*88,z=(rnd()-.5)*88;V(x,z,2+rnd()*5,1+rnd()*4,.09,0,pick([GRN,DG,0x5a6a3a]),'b','grass')}
  for(let i=0;i<40;i++)V((rnd()-.5)*90,(rnd()-.5)*90,.14,2+rnd()*6,.075,0,0x2a2a2a,'b');
  for(let i=0;i<10;i++){const x=(rnd()-.5)*80,z=(rnd()-.5)*80;V(x,z,.8,.8,.08,0,0x1b1b1b,'c')}
  /* ====================== PLAZA ====================== */
  const fx=-1,fz=1;for(const s of[-1,1]){B(fx,fz+s*2.6,5.4,.5,.9,0,0x9a9688,'concrete');B(fx+s*2.6,fz,.5,5.4,.9,0,0x9a9688,'concrete')}B(fx,fz,1.2,1.2,2.6,0,0x8a8678,'concrete');V(fx,fz,1.6,1.6,.5,0,0x7a7a70,'c');V(fx,fz,4.4,4.4,.08,.1,0x3a4a38,'b','grass');V(fx,fz+1.6,.3,.3,3,2.6,0x6a6a60,'b');
  for(const[x,z,h]of[[3.5,-3,1],[-5.5,5.2,1],[3.8,5.3,1]])bench(x,z,h);tree(-4.4,-1.8);tree(2.6,4);rub(-6.6,3.8,2,4,.9);
  /* overturned bus */
  MK.room(B,{x:-15,z:1.2,w:10.6,d:2.8,h:2.7,c:0xb8a030,k:'rust',rc:0x8a7a24,rk:'rust',t:.2,dr:{n:[[-1.2,1.3,2.3]],s:[[2.4,1.3,2.3]]},wn:{n:[[-3.6,1.2],[1,1.2],[3.6,1.2]],s:[[-4.2,1.2],[-1.2,1.2],[4.2,1.2]]}});for(let i=0;i<4;i++)B(-18+i*2,1.2,.4,2,.7,0,0x4a3f35,'plank');
  /* news kiosk, bus shelter, phone booth, hydrants */
  B(-8,-3,2.4,1.6,2.4,0,0x6a2a2a,'rust');V(-8,-3,2.6,1.8,2.9,2.4,0x4a4a44,'b','metal');V(-8,-2.1,2,.06,2.1,1.2,GLS,'g');B(7,-3.5,3.6,.4,2.5,0,0x4a5a6a,'metal');B(8.7,-2.7,.2,1.4,2.5,0,0x4a5a6a,'metal');V(7,-2.5,3.8,1.8,2.7,2.5,0x3a4a5a,'b','metal');
  for(const[x,z]of[[-9,6.8],[9,6.8],[4.6,-4.8],[-6.4,-4.8]])V(x,z,.4,.4,.8,0,0xb03030,'c');
  /* ====================== CHURCH ====================== */
  const chx=-36,chz=-33;
  bld({x:chx,z:chz,w:16,d:20,fl:1,fh:9,t:.55,c:0x9a968a,k:'concrete',dr:{s:[[3,2.8,4.2]],e:[[-5,2.4,3.4]],w:[[2,2.2,3]]},wlo:2.2,whi:7,roof:0,nowin:0,gl:1});
  B(chx+4,chz-1,8.5,.2,.1,0,0x000000,'n');B(chx,chz-22.5+12.5+0,1,1,.1,0,0,'n');
  for(const z of[-6,-2.5,1,4.5])for(const s of[-1,1])B(chx+s*3.4,chz+z,2.6,.7,.95,0,WOOD,'plank');
  B(chx,chz-8.4,4.4,1.4,1.2,0,0x8a8678,'concrete');B(chx,chz-9.4,1,1,2.2,0,0x8a8678,'concrete');V(chx,chz-9.6,3.2,.2,6.8,3,0x4a2a24,'b');rub(chx-1,chz+3,3,7,1.2);
  /* roof: two broken slabs and trusses */
  B(chx-5,chz,6,20.4,9.4,9,0x5a5448,'concrete');B(chx+6,chz-6,4,8,9.4,9,0x5a5448,'concrete');for(let i=0;i<8;i++){V(chx,chz-9+i*2.6,16,.3,10.4,9.2,0x3a2f26,'b','plank')}
  /* bell tower, ruined */
  B(chx-6,chz-9,4.8,4.8,20,0,0x8a867a,'concrete');V(chx-6,chz-9,3.4,3.4,24,20,0x7a766a,'b','concrete');V(chx-6,chz-9,.9,.9,29,24,0x5a5448,'k');V(chx-6,chz-6.5,2.4,.1,17,12,0x1b1b1b,'b');V(chx-6,chz-6.5,1.6,.1,17,12.8,0x050505,'b');
  V(chx+8.1,chz,.2,5,7.5,4,0xc89a30,'g');V(chx+8.1,chz,.15,3.5,9.2,7.7,0x2a7ac8,'g');for(let i=0;i<5;i++)V(chx+8.15,chz-6+i*3,.2,1.2,7.4,2.6,0x1a1a1c,'g');
  /* ====================== HARLOW COURT (apartments) ====================== */
  bld({x:-17,z:-33,w:16,d:18,fl:3,fh:3.4,dr:{s:[[0,2.4,2.6]],w:[[4,1.8,2.5]],n:[[-4,1.8,2.5]]},c:BRK,k:'brick',rc:0x6a5a4a,col:{side:'e',wall:2,slab:2,depth:5}});
  rub(-8,-30,4,10,1.4);rub(-9.5,-37,2.5,5,.9);V(-17,-24.1,2.4,.2,3.6,3.4,0xc89a30,'g');
  /* ====================== SHOP ROW NORTH (z -20 .. -6) ====================== */
  for(const[i,sx,wd,cl]of[[0,-39.5,9,0xa89a7a],[1,-29.5,9,0x9a8a8a],[2,-19.5,9,0x8a96a0],[3,-10.5,8,0xb0a088]])
   bld({x:sx,z:-13,w:wd,d:14,fl:2,fh:3.6,c:cl,k:'stucco',dr:{s:[[0,3.4,2.8]],n:[[-1.5,1.8,2.4]]},wlo:1.1,whi:2.5,rc:0x5a5448,gl:1});
  /* bank vault in the third shop */
  MK.room(B,{x:-19.5,z:-17.8,w:4,d:3.6,h:3,t:.6,c:0x6a6a70,k:'metal',roof:0,dr:{s:[[1.2,1.4,2.4]]}});V(-19.5,-15.9,1.5,.1,2.4,.2,0x8a8a92,'c','metal');B(-24,-8,.1,.1,.1,0,0,'n');
  /* ====================== HOTEL ====================== */
  bld({x:18,z:-30,w:20,d:24,fl:4,fh:3.6,c:0xb0a894,k:'stucco',dr:{s:[[-3,4.4,3.2],[5,1.8,2.5]],n:[[0,1.8,2.5]],w:[[-4,1.8,2.5]]},wlo:1,whi:2.6,rc:0x5a564c,col:{side:'e',wall:2,slab:2,depth:7},gl:1});
  /* rubble ramp up the east face to the first floor (12 steps of .3) */
  MK.stairs(B,29.2,-18.2,3.4,12,'n',DCON,'concrete',.3,.5,0);rub(31,-21,3,6,1.2);rub(25,-26,3,5,.9);
  /* lobby: desk, pillars, a fallen chandelier, lounge furniture; second floor rooms */
  B(14,-23,6,.9,1.15,0,0x4a3a2e,'plank');for(const px of[11,17,24])B(px,-26,.8,.8,3.6,0,0x9a968a,'concrete');V(20,-27,1.6,1.6,.6,.0,0xc8a040,'s');B(14,-34,4.2,.7,.5,0,0x6a2a2a,'plank');B(22,-33,3.6,1.1,.5,0,0x4a3a5a,'plank');
  for(let i=0;i<4;i++){B(12+i*2.8,-38.5,2.2,.12,3.4,0,0x6a5a46,'plank')}B(16.5,-32,1.7,1.7,3.6,0,0x5a5a62,'metal');B(16.5,-32,1.7,1.7,7.2,3.6,0x5a5a62,'metal');
  V(18,-18.1,6,.12,4,3.3,0xc8362a,'e');V(18,-18.1,5.6,.1,3.8,3.4,0x1b1b1c,'b');
  /* ====================== OFFICE SKELETON ====================== */
  const ox=38.5,oz=-35;for(let f=0;f<3;f++){const y=f*3.8;if(f>0){MK.slab(B,ox,oz,11,14,y,y-.4,0x8a867a,'concrete',f==1?[ox+3,oz-4.5,4.4,4.2]:[ox-3,oz+3,4,4])}}
  for(const px of[-4.6,0,4.6])for(const pz of[-6,-1.6,2.8,6.4])B(ox+px,oz+pz,.8,.8,11.4,0,0x8a867a,'concrete');B(ox+3.8,oz-5,3,3,11.4,0,0x7a766a,'concrete');MK.stairs(B,ox-5.2,oz-5.4,1.7,13,'e',DCON,'concrete',3.8/13,.55,0);MK.stairs(B,ox-5.2,oz+5.4,1.7,13,'e',DCON,'concrete',3.8/13,.55,3.8);
  MK.wall(B,1,ox,oz+6.9,11,.3,0,3.8,[[-3,3.2,0,2.6]],0x9a968a,'concrete');MK.wall(B,0,ox-5.6,oz,10,.3,3.8,7.6,[[0,4,.9,2.4]],0x9a968a,'concrete');
  for(let i=0;i<8;i++)V(ox-5+i*1.4,oz-6.8,.05,.05,12.5,11.4,0x5a3a2a,'b');V(ox,oz,12,15,11.5,11.4,0x2a2a2a,'b');rub(ox,oz+8.5,3,6,1.1);V(ox+1,oz+3,2.4,2.4,12.6,11.4,0xd7a82a,'b');
  /* ====================== PARKING DECK ====================== */
  const px0=38,pz0=-13;for(let f=1;f<3;f++)MK.slab(B,px0,pz0,14,20,f*3.2,f*3.2-.35,0x8a867a,'concrete',[px0-4.5,pz0+7.8,5.5,3.8]);
  for(const cx of[-5.5,0,5.5])for(const cz of[-8,-2.6,2.8,8])B(px0+cx,pz0+cz,.7,.7,6.4,0,0x8a867a,'concrete');
  for(let f=0;f<3;f++){const y=f*3.2;for(const s of[-1,1]){B(px0,pz0+s*9.8,14,.3,y+1.1,y,0x9a968a,'concrete');B(px0+s*6.8,pz0,.3,20,y+1.1,y,0x9a968a,'concrete')}}
  MK.stairs(B,px0-4.5-3.2,pz0+7.8,3.4,11,'e',DCON,'concrete',3.2/11,.58,0);MK.stairs(B,px0+5,pz0+7.8,3.2,11,'w',DCON,'concrete',3.2/11,.58,3.2);
  car(px0-2,pz0-4,1,0x4a5a6a,0);car(px0+2.5,pz0-4,1,0x6a2a2a,1);car(px0-2,pz0+1,1,0x9a9a8a,0);car(px0+1,pz0-4,0,0x2a4a2a,1);
  for(let f=1;f<3;f++){car(px0-3.5,pz0-5,1,pick([0x6a2a2a,0x4a5a6a,0x9a9a8a]),f==2);car(px0+2,pz0+2,1,0x3a3a3a,1)}
  /* ====================== MARKET HALL ====================== */
  const mx=-31,mz=18;bld({x:mx,z:mz,w:26,d:16,fl:1,fh:6,t:.45,c:0x9a8a6a,k:'stucco',dr:{n:[[-9,3.2,4],[0,3.2,4],[9,3.2,4]],e:[[-3,2.2,3]],w:[[-4,2.2,3]]},wlo:2.4,whi:4.8,roof:1,rc:0x5a4a38});
  for(let r=0;r<4;r++)for(let c=0;c<5;c++){if((r+c)%7==3)continue;const x=mx-9+c*4.6,z=mz-4.6+r*3.1;B(x,z,2.4,1.1,1.05,0,WOOD,'plank');V(x,z,2.9,1.8,2.6,2.1,pick([0xb8402a,0x2a6a8a,0xc89a30,0x4a8a4a,0x8a4a8a]),'b');V(x-1,z,.08,.08,2.1,0,0x3a3a3a,'b');V(x+1,z,.08,.08,2.1,0,0x3a3a3a,'b')}
  rub(mx+4,mz+4,3,8,1.3);V(mx,mz,26,16,6.4,6,0x3a3a34,'b');
  /* metro entrance */
  MK.room(B,{x:-11,z:13,w:6,d:7,h:3.4,c:0x6a7078,k:'concrete',rc:0x4a4e54,dr:{n:[[0,2.6,2.8]]},wn:{}});B(-11,12.6,4.6,2,1.9,0,0x4a4a4a,'concrete');V(-11,9.4,5.6,.2,4.2,3.0,0xff4a30,'e');V(-11,9.3,5.2,.12,4,3.2,0x1b1b1c,'b');
  /* ====================== SHOPS SOUTH ====================== */
  for(const[sx,cl]of[[-38.5,0x9a8a7a],[-26.5,0x8a9a90],[-14.5,0xa89a8a]])bld({x:sx,z:37,w:11,d:12,fl:2,fh:3.6,c:cl,k:'stucco',dr:{n:[[0,3.4,2.8]],s:[[-3,1.8,2.4]]},rc:0x5a5448,gl:1});
  /* ====================== GAS STATION ====================== */
  MK.room(B,{x:12,z:24,w:8,d:6,h:3.2,c:0xb8b0a0,k:'stucco',rc:0x5a5448,dr:{e:[[-.8,1.8,2.5]],n:[[2,1.8,2.5]]},wn:{s:[[-2,1.2],[2,1.2]],n:[[-2,1.2]]}});B(12,22.8,5.6,.7,1.1,0,0x4a4a44,'metal');
  for(const sx of[0,1])for(const sz of[0,1])B(20.4+sx*7.2,13+sz*8,.7,.7,4.4,0,0x9a968a,'concrete');B(24,17,10,11.4,4.75,4.4,0xb03a2a,'metal');V(24,17,10.4,11.8,4.9,4.75,0xd8d0c0,'b','metal');
  for(const z of[14,20])for(const x of[21.2,26.8]){B(x,z,.6,1.2,1.3,0,0xb03a2a,'metal');V(x,z,.7,1.3,1.5,1.3,0x2a2a2a,'b')}car(24,16.5,0,0x3a5a7a,1);car(30,28,1,0x2a2a2a,1);V(31,10.5,.5,.5,10,0,0x3a3a3e,'c');V(31,10.5,3.2,.4,12.4,9,0xe8c020,'e');
  /* ====================== WAREHOUSE ====================== */
  const wx=38,wz=26;bld({x:wx,z:wz,w:14,d:30,fl:1,fh:8,t:.45,c:0x6a7078,k:'metal',dr:{w:[[-8,4,4.2],[6,4,4.2]],s:[[0,2.2,3]]},wlo:5.5,whi:7,roof:1,rc:0x4a4e54});
  for(let r=0;r<3;r++)for(let c=0;c<4;c++){if(c==1)continue;B(wx+1.5+r*2.6,wz-11+c*5.4,.9,4.6,3.6,0,0x8a5a2a,'metal');V(wx+1.5+r*2.6,wz-11+c*5.4,1,4.7,3.7,3.6,0x6a4a2a,'b')}
  B(wx+5.2,wz,2.6,24,4.3,4,0x5a5e64,'metal');MK.stairs(B,wx+3.8,wz+11.6,1.6,14,'n',DCON,'concrete',4/14,.58,0);B(wx-4,wz-8,2.4,6,2.6,0,0x9a3a2a,'rust');B(wx-4,wz+6,2.4,6,2.6,0,0x3a5a6a,'rust');B(wx-3,wz-12.5,1.3,2.4,1.7,0,0xc8a030,'metal');
  /* ====================== DERAILED TRAIN ====================== */
  const trainCar=(x0,len,c)=>{MK.room(B,{x:x0+len/2,z:1,w:len,d:3.2,h:3.6,c,k:'rust',rc:0x3a3a3e,rk:'metal',t:.25,dr:{n:[[-2.5,1.5,2.6],[2.5,1.5,2.6]],s:[[0,1.5,2.6]]},wn:{n:[[-5,1.2],[0,1.2],[5,1.2]],s:[[-5,1.2],[-2.5,1.2],[2.5,1.2],[5,1.2]]}});for(let i=0;i<5;i++)B(x0+1.6+i*2,.1,1.1,.5,.6,0,0x4a3a2e,'plank');V(x0+len/2,1,len,3.4,.7,.6,0x1b1b1b,'b')};
  trainCar(10,11.6,0x5a6a7a);trainCar(22.4,11.6,0x7a4a3a);MK.room(B,{x:37.2,z:1,w:6.4,d:3.4,h:3.8,c:0x2a3a4a,k:'metal',rc:0x2a2a2e,t:.3,dr:{w:[[0,1.5,2.6]]},wn:{n:[[1,1.4]],s:[[1,1.4]]}});V(37.2,1,6.4,3.5,4.5,3.8,0x1a1a1c,'b');
  /* ====================== STREET LIFE: cars, wrecks, barricades, trees, lamps, trash ====================== */
  car(-33,-2.2,1,0x6a2a2a,0);car(-28,3.8,1,0x2a4a6a,1);car(-22,-2,1,0x8a8a7a,0);car(-5,-1.8,1,0x3a3a3a,1);car(6,3.8,1,0x5a2a2a,0);car(40,3.8,1,0x4a4a3a,1);car(-1.6,-12,0,0x6a6a2a,0);car(.4,-22,0,0x2a2a2a,1);car(-2,-33,0,0x5a3a2a,0);car(-1.2,15,0,0x4a5a3a,1);car(-2,24,0,0x7a2a2a,0);car(.2,35,0,0x2a3a5a,1);
  car(-6.6,-30,0,0x8a8a6a,0);car(4.3,-38,0,0x3a3a3a,1);car(-8,28,1,0x3a5a3a,1);car(4,32,1,0x6a6a6a,0);car(-44,10,0,0x4a4a4a,1);
  jers(-9.5,-4.6,1,2);jers(7.5,6.6,1,2);jers(-4.4,-18.5,1,1);jers(2.6,-18.5,1,1);jers(-4.4,20.5,1,1);jers(2.6,20.5,1,1);sand(-4,-6,1,5);sand(6,8.4,1,6);sand(-6.2,12,0,5);sand(4.2,-14,0,5);
  for(const[x,z]of[[-42,-2],[-35,-5.6],[-24,-5.8],[-12,-5.8],[10,-5.5],[27,-5.7],[41,-5.6],[-42,8],[-26,8.2],[10,8.4],[34,8.4],[-8,22],[-8,-24],[7,-8],[7,28],[-8,36]])tree(x,z);
  for(const[x,z,b]of[[-42,-4.6,0],[-30,-4.6,1],[-18,-4.6,0],[-6.8,-4.6,0],[6.4,-4.6,1],[20,-4.6,0],[34,-4.6,0],[-42,7,0],[-30,7,1],[-12,7,0],[6.4,7,0],[20,7,1],[34,7,0],[-6.4,-18,0],[4.4,-26,1],[-6.4,26,0],[4.4,18,0]])lamp(x,z,b);
  for(const[x,z,h,c]of[[-6.9,-9,0,0x3a5a3a],[-6.9,-30,0,0x3a5a3a],[6,-19.6,1,0x2a4a6a],[4.6,29,0,0x3a5a3a],[-20,6.8,1,0x2a4a6a],[-44,-7,0,0x5a3a2a],[-9,24,1,0x3a5a3a],[30,7,1,0x5a3a2a]])dump(x,z,h,c);
  for(let i=0;i<10;i++){const x=(rnd()-.5)*84,z=(rnd()-.5)*84;if(!a.some(b=>b[4]>.4&&b[5]<1&&x>b[0]-b[2]/2-1.2&&x<b[0]+b[2]/2+1.2&&z>b[1]-b[3]/2-1.2&&z<b[1]+b[3]/2+1.2))rub(x,z,2,4+(i&3),.8)}
  for(const[x,z]of[[-1,-8],[-1,-27],[-1,12],[-1,30],[-20,1],[22,-1]])rub(x,z,2.4,5,.7);
  for(let i=0;i<8;i++){const x=-42+rnd()*84,z=-4+rnd()*10;V(x,z,.6,.5,.3,0,pick([0xc8c8c0,0x8a8a80,0x7a5a3a]),'b')}
  /* fence around the play area, then the city continues */
  const F=45.8;barrierLine(a,-F,-F,F,-F,0);barrierLine(a,-F,F,F,F,1);barrierLine(a,-F,-F,-F,F,2);barrierLine(a,F,-F,F,F,0);
  return a},
 /* ---------- the ruined city beyond the fence ---------- */
 deco(){const o=[],rnd=MK.rnd(41),V=(x,z,w,d,h,y0,c,s,t)=>o.push([x,z,w,d,h,y0||0,c,s||'b',t]),pick=a=>a[rnd()*a.length|0],GL=0x1c2a34,W=[0x8a867a,0x7a7a74,0x9a9488,0x6f7068,0x8c8274];
  /* ruined towers in rings: window grids with missing panes, ragged tops, rebar, balconies */
  const tower=(x,z,w,d,h,c)=>{V(x,z,w,d,h,0,c,'b','concrete');const rows=Math.floor(h/3.4),cols=Math.max(2,Math.floor(w/2.6)),cd=Math.max(2,Math.floor(d/2.6));
   for(let r=1;r<rows;r++){for(let i=0;i<cols;i++){if(rnd()<.18)continue;const px=x-w/2+(i+.5)*w/cols;V(px,z+d/2+.05,1.4,.1,r*3.4+2.3,r*3.4+.8,rnd()<.2?0x0a0a0c:GL,'g');if(rnd()<.45)V(px,z-d/2-.05,1.4,.1,r*3.4+2.3,r*3.4+.8,GL,'g')}
     for(let i=0;i<cd;i++){if(rnd()<.2)continue;const pz=z-d/2+(i+.5)*d/cd;V(x+w/2+.05,pz,.1,1.4,r*3.4+2.3,r*3.4+.8,GL,'g');if(rnd()<.4)V(x-w/2-.05,pz,.1,1.4,r*3.4+2.3,r*3.4+.8,GL,'g')}
     if(rnd()<.3)V(x,z+d/2+.5,w*.8,1,r*3.4+.2,r*3.4,0x6a665a,'b','concrete')}
   for(let i=0;i<4;i++)V(x+(rnd()-.5)*w*.8,z+(rnd()-.5)*d*.8,w*.3,d*.3,h+1+rnd()*3.5,h,c,'b','concrete');for(let i=0;i<5;i++)V(x+(rnd()-.5)*w,z+(rnd()-.5)*d,.08,.08,h+1.6+rnd()*2,h,0x6a3a24,'b');
   if(rnd()<.5){V(x+w/2,z,w*.15,d*.6,h*.6,h*.3,0x0a0a0c,'b')}for(let i=0;i<3;i++)V(x+(rnd()-.5)*w,z+d/2+.04,.5+rnd()*1.4,.05,h*.9,rnd()*h*.7,pick([GRN_,DG_]),'b','grass')};
  const GRN_=0x4a6a3a,DG_=0x35502e;
  for(let i=0;i<30;i++){const q=i/30*6.283+rnd()*.15,d=62+rnd()*45,x=Math.cos(q)*d,z=Math.sin(q)*d;if(Math.abs(x)<50&&Math.abs(z)<50)continue;tower(x,z,9+rnd()*10,9+rnd()*10,16+rnd()*48,pick(W))}
  for(let i=0;i<22;i++){const q=rnd()*6.283,d=52+rnd()*22,x=Math.cos(q)*d,z=Math.sin(q)*d;if(Math.abs(x)<49&&Math.abs(z)<49)continue;tower(x,z,7+rnd()*8,7+rnd()*8,6+rnd()*14,pick(W))}
  /* rubble fields between the towers and the fence, overgrown with grass and dead trees */
  for(let i=0;i<130;i++){const x=(rnd()-.5)*140,z=(rnd()-.5)*140;if(Math.abs(x)<48&&Math.abs(z)<48)continue;const r=1+rnd()*3.5;V(x,z,r*1.6,r*1.3,r*.5,0,pick([0x7a766a,0x6a665a,0x8a8478,0x5a5448]),'s')}
  for(let i=0;i<50;i++){const x=(rnd()-.5)*130,z=(rnd()-.5)*130;if(Math.abs(x)<48&&Math.abs(z)<48)continue;V(x,z,3+rnd()*7,2+rnd()*5,.12,0,pick([GRN_,DG_,0x5a6a3a]),'b','grass')}
  const dt=(x,z)=>{V(x,z,.6,.6,5,0,0x3a3028,'c');for(let i=0;i<5;i++){const q=i*1.3+rnd();V(x+Math.cos(q)*1.2,z+Math.sin(q)*1.2,2.2,.14,4.6+rnd()*2,4+rnd(),0x3a3028,'b')}};
  for(let i=0;i<40;i++){const x=(rnd()-.5)*130,z=(rnd()-.5)*130;if(Math.abs(x)<49&&Math.abs(z)<49)continue;dt(x,z)}
  /* elevated highway on pillars north of the city with a collapsed span */
  for(let i=-6;i<=6;i++){V(i*14,-62,2.2,2.2,9,0,0x7a766a,'b','concrete');if(i!=2&&i!=3)V(i*14+7,-62,12,9,10.4,9,0x6a665a,'b','concrete');V(i*14+7,-62,12.2,.5,11.4,10.4,0x8a867a,'b','concrete');V(i*14+7,-57.6,12.2,.4,11.2,10.4,0x6a665a,'b')}
  V(34,-62,7,8,5,0,0x5a5448,'s');V(37,-60,6,7,4,0,0x6a665a,'s');V(30.4,-62,5,7,10,9.2,0x6a665a,'b','concrete');
  /* train gantry crane and a water tower to the south, billboard to the west */
  V(-30,70,1.4,1.4,34,0,0x8a5a2a,'b','rust');V(-30,70,1.4,1.4,34,0,0x8a5a2a,'b','rust');V(-10,70,1.4,1.4,34,0,0x8a5a2a,'b','rust');V(-20,70,22,1.6,34,32.4,0x8a5a2a,'b','rust');V(-20,70,1,1,32,26,0x5a5a60,'b');V(-20,70,3,2.4,26,23,0x4a4a44,'b','metal');
  for(const sx of[-1,1])for(const sz of[-1,1])V(60+sx*3,-4+sz*3,.5,.5,16,0,0x5a4a3a,'b','rust');V(60,-4,9.4,9.4,22,16,0x6a5a4a,'c','rust');V(60,-4,9.6,9.6,.5,16,0x3a2a22,'c');V(60,-4,9.8,9.8,24.5,22,0x5a4a3a,'k');
  V(-58,-12,.6,.6,10,0,0x4a4a4a,'b');V(-58,12,.6,.6,10,0,0x4a4a4a,'b');V(-58,0,.5,26,16,9.6,0x2a3a4a,'b');V(-58.4,0,.1,22,15,10.4,0x4a6a8a,'b');V(-58.5,-6,.1,3,13,11,0xc8362a,'b');V(-58.5,5,.1,6,12.5,11.5,0xe8c020,'b');
  /* the continuation of the streets beyond the fence, wrecks in them, a bus, bridge pieces and smoke columns */
  V(0,-80,10,70,.06,0,0x4a4b4a,'b','asphalt');V(0,80,10,70,.06,0,0x4a4b4a,'b','asphalt');V(-80,1,70,10,.06,0,0x4a4b4a,'b','asphalt');V(80,1,70,10,.06,0,0x4a4b4a,'b','asphalt');
  for(let i=0;i<22;i++){const t=i%4,d=52+rnd()*30,s=(rnd()<.5?-1:1),x=t==0?(rnd()-.5)*5:t==1?(rnd()-.5)*5:s*d,z=t==0?s*d:t==1?-s*d:1+(rnd()-.5)*5;V(x,z,t<2?1.9:4.4,t<2?4.4:1.9,1.2,0,pick([0x3a3a3a,0x5a2a2a,0x3a4a5a,0x4a4a3a]),'b','rust');V(x,z,t<2?1.7:2.2,t<2?2.2:1.7,1.8,1.1,0x1f2a30,'b')}
  V(-70,40,14,3,3.4,0,0x9a8a30,'b','rust');V(-70,40,13,2.8,3.8,3.4,0x8a7a24,'b','rust');V(60,-30,3,13,3,0,0x2a4a6a,'b','rust');
  for(let i=0;i<4;i++){const x=(rnd()-.5)*140,z=(rnd()-.5)*140;if(Math.abs(x)<60&&Math.abs(z)<60)continue;for(let k=0;k<8;k++)V(x+Math.sin(k)*.5,z+Math.cos(k*2)*.5,2+k*.6,2+k*.6,10+k*8,6+k*8,0x555a58,'s')}
  /* a ring of the playable area's own streets: guard rail posts and warning tape outside the fence */
  for(let i=-22;i<=22;i++){V(i*2.1,-46.7,.12,.12,2.6,0,0x6a6a6e,'b');V(i*2.1,46.7,.12,.12,2.6,0,0x6a6a6e,'b');V(-46.7,i*2.1,.12,.12,2.6,0,0x6a6a6e,'b');V(46.7,i*2.1,.12,.12,2.6,0,0x6a6a6e,'b')}
  for(const[x,z,hz]of[[0,-46.9,1],[20,46.9,1],[-46.9,-12,0],[46.9,18,0]])V(x,z,hz?5:.08,hz?.08:5,2.5,.2,0xe8d040,'b');
  return o}};
;
/* ######## maps2.js ######## */
/* ===================== maps2.js ===================== */
/* ---------- Blockfort, Pillars and Canyon, rebuilt from scratch as detailed, lived-in places (they replace the old simple versions):
   Blockfort: a medieval castle with a keep, gatehouse, barracks, chapel, smithy, stables and market, with a countryside around it.
   Pillars:   a ruined Roman forum with colonnades, an amphitheatre, a temple, baths, a triumphal arch and cypress hills.
   Canyon:    a winding mining gorge with a trestle bridge, a mill, a mine tunnel, a water tower, rail carts, saloon and ledges you can climb. ---------- */
/* multi storey building: walls with windows per floor, door gaps on the ground floor, slabs with a stairwell hole, stairs between floors, roof slab */
function multi(B,o){const{x,z,w,d,fl=2,fh=3.6,t=.45,c,k='stucco',rc,rk,dr={},wn={},roof=1,wlo=1.1,whi=2.4,step=3.4,rnd=Math.random}=o,S=['n','s','w','e'],
 pos=s=>s=='n'?[x,z-d/2+t/2,1,w]:s=='s'?[x,z+d/2-t/2,1,w]:s=='w'?[x-w/2+t/2,z,0,d-2*t]:[x+w/2-t/2,z,0,d-2*t];
 for(let f=0;f<fl;f++){const y0=f*fh;for(const s of S){const[px,pz,hz,len]=pos(s),dd=f==0?(dr[s]||[]).map(([q,wd,ht])=>[q,Math.max(2.4,wd||2.4),0,ht||2.5]):[],ww=[];if(wn[s]!==0){for(let q=-len/2+2;q<len/2-1.3;q+=step){if((dr[s]||[]).some(([a,b])=>f==0&&Math.abs(q-a)<Math.max(2.4,b||2.4)/2+1.1))continue;ww.push([q,1.2,wlo,whi])}}MK.wall(B,hz,px,pz,len,t,y0,y0+fh,[...dd,...ww],c,k)}}
 const stw=1.7,n=Math.ceil(fh/.3),run=n*.55;
 for(let f=1;f<=fl;f++){const y=f*fh,fl_=f-1,north=fl_%2==0,zz=north?z-d/2+t+stw/2+.1:z+d/2-t-stw/2-.1,x0=x-w/2+t+.3;if(f<fl)MK.slab(B,x,z,w-2*t,d-2*t,y,y-.35,rc||c,'concrete',[x0+run/2,zz,run+.4,stw+.3]);else if(roof)B(x,z,w+.3,d+.3,y+.3,y-.1,rc||c,rk||'concrete')}
 for(let f=0;f<fl-1;f++){const north=f%2==0,zz=north?z-d/2+t+stw/2+.1:z+d/2-t-stw/2-.1,x0=x-w/2+t+.3;MK.stairs(B,x0,zz,stw,n,'e',rc||c,'concrete',fh/n,.55,f*fh)}}
const EDGE=(a,x0,z0,x1,z1,h,c,k,t=1.2)=>{const hz=Math.abs(x1-x0)>=Math.abs(z1-z0),L=hz?Math.abs(x1-x0):Math.abs(z1-z0),cx=(x0+x1)/2,cz=(z0+z1)/2;a.push([cx,cz,hz?L:t,hz?t:L,h,0,c,k]);a.push([cx,cz,hz?L:t,hz?t:L,14,0,0,'n'])};
const free_=(a,x,z,m=1)=>!a.some(b=>b[4]>.5&&b[5]<2&&x>b[0]-b[2]/2-m&&x<b[0]+b[2]/2+m&&z>b[1]-b[3]/2-m&&z<b[1]+b[3]/2+m);

/* =============================== BLOCKFORT =============================== */
MAPS.Blockfort={d:'Medieval castle: keep, gatehouse, barracks, chapel, smithy, stables and a market court',H:40,open:1,sky:0x9ec9ea,gr:0x5f7f48,gt:'grass',bc:0x9a958a,hemi:.9,hemiC:0xf4f8ff,hemiG:0x4a5a3a,sunI:.95,sunC:0xfff4dc,fogF:140,
 fb:[[-27,5],[26,0]],zn:[[-21,8],[0,-9],[21,9]],tb:[-35,-30,35,30],inside:(x,z)=>Math.abs(x)<32&&Math.abs(z)<27.5,
 lights:[[-24,2.6,17,0xff7a2a,1.5,16],[18,5,-6,0xffc070,.9,18],[-20,5,-12,0xffc070,.9,18],[0,3.6,26,0xffa040,1.0,14],[0,3.6,-26.5,0xffa040,.8,14],[26,4.5,12,0xffd9a0,.8,14]],
 b(){const a=[],v=MAPS.Blockfort._v,B=(x,z,w,d,h,y0,c,k)=>a.push([x,z,w,d,h,y0||0,c,k]),V=(x,z,w,d,h,y0,c,s,t)=>v.push([x,z,w,d,h,y0||0,c,s||'b',t]),rnd=MK.rnd(3),pick=q=>q[rnd()*q.length|0],
  STN=0x9a958a,DST=0x7a766c,WD=0x6a4a30,RF=[0x8a3a2a,0x6a4a3a,0x5a5a60],COL=[0xb83a2a,0x2a5aa8,0xd8a020,0x3a8a4a,0x7a3a8a];
  const barrel=(x,z)=>{B(x,z,.8,.8,1.1,0,WD,'plank');V(x,z,.85,.85,1.1,0,WD,'c','plank');V(x,z,.9,.9,.1,.3,0x2a2a2a,'c');V(x,z,.9,.9,.1,.8,0x2a2a2a,'c')},
   crate=(x,z,s)=>{B(x,z,s,s,s*.9,0,0x8a6a3a,'plank')},hay=(x,z)=>{B(x,z,1.5,1,.9,0,0xc8a850,'plank');V(x,z,1.6,1.1,.95,0,0xd8b860,'b','plank')},
   torch=(x,z,h=2.4)=>{V(x,z,.12,.12,h,0,WD,'c');V(x,z,.3,.3,h+.5,h,0xff8a30,'e');V(x,z,.15,.15,h+.9,h+.4,0xffd060,'k')},
   banner=(x,z,hz,c,h=4.4)=>{V(x,z,.14,.14,h+.9,0,WD,'c');V(x+(hz?0:.34),z+(hz?.34:0),hz?.9:.06,hz?.06:.9,h,h-2,c,'b')},
   tree=(x,z,s=1)=>{B(x,z,.7,.7,2.4*s,0,0x5a4030,'plank');V(x,z,.8,.8,2.6*s,0,0x5a4030,'c');V(x,z,4*s,4*s,5.4*s,1.8*s,0x3f7a34,'s');V(x+.8,z+.6,3*s,3*s,6*s,3*s,0x4f8a3c,'s')},
   stall=(x,z,c)=>{B(x,z,2.6,1.1,1.0,0,WD,'plank');for(const s of[-1,1])V(x+s*1.2,z-.4,.1,.1,2.4,0,WD,'b');V(x,z-.1,2.9,1.8,2.7,2.35,c,'b');V(x,z,2.2,.9,1.18,1,pick(COL),'b'),V(x-.5,z,.4,.4,1.3,1,0xc83a2a,'s'),V(x+.5,z,.4,.4,1.3,1,0xe0c040,'s')},
   dummy=(x,z)=>{V(x,z,.14,.14,1.8,0,WD,'c');V(x,z,.8,.14,1.5,1.3,WD,'b');V(x,z,.4,.4,2.1,1.7,0xc8b080,'s');B(x,z,.4,.4,1.8,0,WD,'plank')},
   cart=(x,z,hz)=>{B(x,z,hz?2.6:1.6,hz?1.6:2.6,.9,.4,WD,'plank');for(const s of[-1,1])V(x+(hz?0:s*.9),z+(hz?s*.9:0),hz?1:.14,hz?.14:1,1,0,0x3a2a1a,'c');V(x,z,hz?2.4:1.4,hz?1.4:2.4,1.2,.9,0xc8a850,'b','plank')};
  /* ground: cobbled courts, dirt tracks, grass tufts, puddles */
  V(0,0,62,52,.07,0,0x8a8070,'b','cobble');V(0,27.5,8,6,.08,0,0x6a5a46,'b','concrete');V(0,36,6,18,.06,0,0x7a6a50,'b','concrete');V(36,-3,16,6,.06,0,0x7a6a50,'b','concrete');
  for(let i=0;i<30;i++)V((rnd()-.5)*58,(rnd()-.5)*48,.8+rnd()*2,.8+rnd()*2,.08,0,pick([0x4a6a3a,0x5a7a40]),'b','grass');for(let i=0;i<8;i++)V((rnd()-.5)*50,(rnd()-.5)*40,1.5+rnd(),1+rnd(),.075,0,0x4a5a68,'s');
  /* curtain wall: stone, 4 m high, with four gates; crenellations, buttresses and a wall walk on the inside of the north and west walls */
  const wallLine=(x0,z0,x1,z1,gaps)=>{const hz=z0==z1,L=hz?x1-x0:z1-z0,cx=(x0+x1)/2,cz=(z0+z1)/2;MK.wall(B,hz,cx,cz,L,1.4,0,4.2,gaps.map(g=>[g[0],g[1],0,g[2]||4.2]),STN,'brick');
   B(cx,cz,hz?L:1.4,hz?1.4:L,14,0,0,'n');for(let q=-L/2+1;q<L/2;q+=2.2){if(gaps.some(g=>Math.abs(q-g[0])<g[1]/2+.6))continue;V(hz?cx+q:cx,hz?cz:cz+q,hz?1.1:1.5,hz?1.5:1.1,5.0,4.2,STN,'b','brick')}for(let q=-L/2+3;q<L/2;q+=7){if(gaps.some(g=>Math.abs(q-g[0])<g[1]/2+1.2))continue;V(hz?cx+q:cx,hz?cz:cz+q,hz?1.2:2.4,hz?2.4:1.2,3.6,0,DST,'b','brick')}};
  wallLine(-33,-28,33,-28,[[-13,2.6],[10,0.01]]);wallLine(-33,28,33,28,[[0,6]]);wallLine(-33,-28,-33,28,[[11.5,2.8]]);wallLine(33,-28,33,28,[[0,5.2]]);
  /* gate arches and gate towers */
  B(0,28,6.4,1.4,8.4,5.2,STN,'brick');for(const s of[-1,1]){multi(B,{x:s*6.6,z:25.8,w:5,d:5,fl:2,fh:4,c:STN,k:'brick',rc:DST,dr:{n:[[0,1.8,2.5]]},wn:{s:0,w:0,e:0},rnd});V(s*3.2,28.9,.3,.3,4.4,1.1,0x3a3a3e,'b','metal')}for(let i=-3;i<=3;i++)V(i*.8,28.8,.1,.1,5,0,0x2a2a2e,'b');V(0,28.8,6,.1,5.2,5,0x2a2a2e,'b');
  B(33,0,1.4,5.4,7.6,4.6,STN,'brick');for(const s of[-1,1])multi(B,{x:30.6,z:s*5.8,w:5,d:5,fl:2,fh:4,c:STN,k:'brick',rc:DST,dr:{w:[[0,1.8,2.5]]},wn:{e:0,n:0,s:0},rnd});
  /* corner towers (two floors, stair, walkable roof with crenels) */
  for(const sx of[-1,1])for(const sz of[-1,1]){const x=sx*31,z=sz*26;multi(B,{x,z,w:7,d:7,fl:2,fh:4.2,c:DST,k:'brick',rc:STN,dr:{[sz>0?'n':'s']:[[0,1.8,2.5]]},wn:{},rnd});for(let i=0;i<8;i++)V(x+(i<4?-3.4+i*2.27:(i%2?3.4:-3.4)),z+(i<4?(i%2?3.4:-3.4):-3.4+(i-4)*2.27),1,1,9.4,8.7,DST,'b','brick');V(x,z,.4,.4,12,8.7,WD,'c');V(x+.8,z,1.5,.06,11.8,10.6,COL[(sx+sz+2)%5],'b')}
  /* wall walks: platform behind the north and west walls, reached by stairs at the corners */
  B(-4,-26,50,2.6,3.4,3.0,0x8a7a5a,'plank');MK.stairs(B,-29,-26,1.8,10,'e',STN,'concrete',.3,.6,0);B(-31.4,-8,2.6,36,3.4,3.0,0x8a7a5a,'plank');MK.stairs(B,-31.4,17,1.8,10,'n',STN,'concrete',.3,.6,0);
  /* keep: raised on a stepped plinth, three floors, battlements */
  const kx=20,kz=-14;for(let i=0;i<3;i++)B(kx,kz,22-i*1.4,18-i*1.4,.28*(i+1),0,STN,'concrete');multi(B,{x:kx,z:kz,w:15,d:12,fl:3,fh:4,c:STN,k:'brick',rc:DST,dr:{s:[[-2,2.8,3.4],[4,1.8,2.5]],w:[[0,1.8,2.5]]},wn:{},wlo:1.6,whi:3,rnd});
  for(let i=0;i<14;i++)V(kx-7.5+i*1.15,kz-6,.9,.5,13.8,13.1,DST,'b','brick');for(let i=0;i<14;i++)V(kx-7.5+i*1.15,kz+6,.9,.5,13.8,13.1,DST,'b','brick');V(kx,kz,3,.2,15,12,0xb83a2a,'b');banner(kx+8,kz+3,0,0xb83a2a,10);banner(kx-8,kz-3,0,0x2a5aa8,10);B(kx-2,kz,2,5,1.1,0,WD,'plank');B(kx+3,kz+1,1.4,1.4,1.0,0,WD,'plank');
  /* barracks (west), second barracks, great hall with a long table */
  multi(B,{x:-21,z:-17,w:14,d:8,fl:2,fh:3.6,c:0xa89a7a,k:'stucco',rc:RF[0],rk:'shingle',dr:{s:[[-3,1.8,2.5],[3,1.8,2.5]]},rnd});multi(B,{x:-21,z:-6,w:14,d:7,fl:2,fh:3.6,c:0xa8987a,k:'stucco',rc:RF[1],rk:'shingle',dr:{n:[[-2,1.8,2.5]],s:[[3,1.8,2.5]]},rnd});
  for(let i=0;i<4;i++){B(-25+i*3.3,-17,.9,2,.6,0,WD,'plank')}B(-21,-6,8,1.1,.95,0,WD,'plank');V(-21,-6,8.4,1.4,.1,.95,0x6a5a48,'b','plank');
  /* chapel with bell cote */
  multi(B,{x:22,z:14,w:9,d:13,fl:1,fh:6.4,c:0xb0a890,k:'stucco',rc:RF[2],rk:'shingle',dr:{n:[[0,2.4,3.6]]},wlo:2.2,whi:5,rnd});B(22,19.5,1.2,.7,1.0,0,STN,'concrete');for(let i=0;i<3;i++){B(19.4,15+i*1.6,1.6,.6,.8,0,WD,'plank');B(24.6,15+i*1.6,1.6,.6,.8,0,WD,'plank')}V(22,8,1,1,10,7.6,STN,'b','brick');V(22,8,.5,.5,9.6,8.4,0xc8a030,'s');V(22,7.4,.3,.3,12,10,0xc0c0c0,'b');
  /* smithy with a glowing forge, open front, anvil and weapon racks */
  B(-24,17,9,.4,3,0,WD,'plank');B(-28.3,19.5,.4,5.6,3,0,WD,'plank');B(-19.7,19.5,.4,5.6,3,0,WD,'plank');B(-24,19.5,9.4,6.4,3.4,3,RF[0],'shingle');B(-27,20.5,2.2,1.6,1.1,0,0x5a5650,'brick');V(-27,20.5,1.4,.8,1.1,1.0,0xff5a20,'e');B(-23,20,.9,.6,.9,0,0x2a2a2e,'metal');B(-21,21,.8,.8,.7,0,0x4a4a4a,'concrete');V(-24,17.3,.1,2,2.4,.8,0x6a6a70,'b','metal');
  /* stables: roof on posts, stall dividers and hay */
  B(-5,18.5,15,5.6,3.6,3.2,RF[1],'shingle');for(let i=0;i<6;i++){B(-11.5+i*2.5,16,.3,.3,3.2,0,WD,'plank');B(-11.5+i*2.5,21,.3,.3,3.2,0,WD,'plank')}for(let i=1;i<5;i++)B(-11.5+i*2.5,19.8,.12,3.2,1.2,0,WD,'plank');B(-5,22,15,.3,1.6,0,WD,'plank');hay(-9,20.6);hay(-4,20.8);hay(1,20.4);
  /* market court: stalls, a well, carts, barrels, hay, a fountain-plinth in the centre */
  const wx=0,wz=-4;for(const s of[-1,1]){B(wx+s*1.6,wz,.5,3.4,1.0,0,STN,'concrete');B(wx,wz+s*1.6,3.4,.5,1.0,0,STN,'concrete')}V(wx,wz,2.6,2.6,.1,.1,0x2a4a68,'b');V(wx-1.6,wz-1.6,.2,.2,3.4,0,WD,'b');V(wx+1.6,wz-1.6,.2,.2,3.4,0,WD,'b');V(wx,wz-1.6,3.6,.2,3.6,3.2,WD,'b');V(wx,wz,3.8,2.6,3.9,3.5,RF[0],'b','shingle');
  for(let i=0;i<4;i++)B(wx,wz,9-i*1.4,9-i*1.4,.2*(i+1),0,0x8a8576,'concrete');
  stall(-8,2,COL[0]);stall(-4,5,COL[1]);stall(4,5,COL[2]);stall(8,2,COL[3]);stall(-9,-8,COL[4]);stall(9,-8,COL[1]);cart(-12,3,1);cart(12,4,0);cart(-3,-12,1);
  for(const[x,z]of[[-12,-11],[12,-12],[-6,9],[6,9],[-2,-12.8],[3.4,-12],[26,6],[-26,10],[-14,12]])barrel(x,z);for(const[x,z,s]of[[-13,9,1.2],[13,9.6,1.3],[28,-12,1.4],[-28,-12,1.2],[3,13,1.4],[-8,-12,1.1]])crate(x,z,s);for(const[x,z]of[[-12,6.5],[-13.5,6],[10,-10],[11.5,-10.6],[27,3],[-4.5,22.5]])hay(x,z);
  dummy(-12,-22);dummy(-9,-22);dummy(-6,-22);for(const x of[-14,-10,-6]){B(x,-26,1.6,.5,1.8,0,0xc8a850,'plank');V(x,-25.7,1.4,.08,1.7,.4,0xc83a2a,'c')}
  for(const[x,z]of[[-8,9],[8,9],[-16,-1],[16,-1],[0,-17],[11,-3],[-11,-4],[-27,-24],[27,24],[5,22],[-5,14]])torch(x,z);banner(-6,-6,1,COL[0]);banner(6,-6,1,COL[1]);banner(-3,26.6,1,COL[0],5);banner(3,26.6,1,COL[1],5);banner(-27,0,0,COL[3]);banner(27,-12,0,COL[4]);
  for(const[x,z,s]of[[-27,12,1],[-30,-14,1.1],[27,22,1],[10,-24,.9],[-14,24,1],[28,-22,1]])tree(x,z,s);
  /* a moat-like ditch outside the wall is just visual (grass banks); a few cats on walls would be cute but cost polys */
  return a},
 deco(){const o=[],rnd=MK.rnd(61),V=(x,z,w,d,h,y0,c,s,t)=>o.push([x,z,w,d,h,y0||0,c,s||'b',t]),pick=q=>q[rnd()*q.length|0];
  /* countryside: rolling hills, a forest in rings, fields, a river with a bridge, a windmill, a camp with siege engines, distant mountains */
  for(let i=0;i<90;i++){const q=rnd()*6.283,d=40+rnd()*100,x=Math.cos(q)*d*1.15,z=Math.sin(q)*d;if(Math.abs(x)<36&&Math.abs(z)<32)continue;const w=14+rnd()*34,h=3+rnd()*9;V(x,z,w,w*(.6+rnd()*.6),h*.6,-h*.5,pick([0x5f8a48,0x6a9a50,0x557a40,0x7a9a58]),'s','grass')}
  for(let i=0;i<10;i++){const q=i/10*6.283+.3;V(Math.cos(q)*140,Math.sin(q)*130,110,70,42,-10,pick([0x6a7a8a,0x7a8a9a,0x5a6a7a]),'s')}
  for(let i=0;i<150;i++){const q=rnd()*6.283,d=40+rnd()*60,x=Math.cos(q)*d*1.1,z=Math.sin(q)*d;if(Math.abs(x)<35&&Math.abs(z)<31)continue;if(x>-6&&x<6&&z>30)continue;const s=.8+rnd()*1.2;V(x,z,.5*s,.5*s,2*s,0,0x5a4030,'c');V(x,z,3.4*s,3.4*s,6*s,1.4*s,pick([0x2f6a2c,0x3f7a34,0x2a5a2a]),'k')}
  for(let i=0;i<12;i++){const x=-70+i*14,z=-52+((i*7)%3)*3;V(x,z,12,16,.12,0,pick([0xc8b050,0x8aa04a,0x6a8a3a]),'b','grass');for(let k=0;k<6;k++)V(x-5+k*2,z,.15,15,.5,0,0xb89a3a,'b')}
  V(0,52,8,50,.1,0,0x7a6a50,'b','concrete');V(-60,12,10,150,.14,-.02,0x3a6a98,'b');V(-60,12,10.3,150,.1,0,0x6a8aa8,'g');for(let i=0;i<4;i++)V(-60,6+i*1.2,14,1.8,1.6+.4,1.2,0x7a7a72,'b','concrete');V(-60,2,14,.6,2.2,1.5,0x6a4a30,'b','plank');
  V(48,32,.9,.9,12,0,0x8a7a60,'c');V(48,32,5,5,10,0,0xcaba98,'k');for(let k=0;k<4;k++){const q=k*1.5708;V(48+Math.cos(q)*4,32,.5,8,16,8,0xe8dcc0,'b');V(48,32+Math.sin(q)*4,8,.5,16,8.2,0xe8dcc0,'b')}
  for(let i=0;i<7;i++){const x=-58+i*3.4,z=-42+(i%2)*3;V(x,z,3.2,3.2,2.6,0,pick([0xd8d0b8,0xb8a888,0xc8483a]),'b');V(x,z,3.4,3.4,3.8,2.6,pick([0xb83a2a,0x2a5aa8]),'k')}V(-52,-48,6,3,3,.6,0x6a4a30,'b','plank');V(-52,-48,.4,.4,6,3,0x6a4a30,'c');V(-54,-48,7,.4,6.4,5.8,0x6a4a30,'b','plank');V(-48,-47,4,2,.6,.3,0x6a4a30,'b','plank');
  for(let i=0;i<14;i++){V(-38+i*5.6,-33,2.6,2,.5,0,0x6a6a62,'s');V(-38+i*5.6,33,2.4,2,.5,0,0x6a6a62,'s')}
  for(let i=-6;i<=6;i++){V(i*5.5,-34.6,3.2,1.3,4.2,0,0x6a655c,'b','brick');V(i*5.5,34.6,3.2,1.3,4.2,0,0x6a655c,'b','brick')}for(let i=-5;i<=5;i++){V(-37,i*5.5,1.3,3.2,4.2,0,0x6a655c,'b','brick');V(37,i*5.5,1.3,3.2,4.2,0,0x6a655c,'b','brick')}
  return o}};

/* =============================== PILLARS =============================== */
MAPS.Pillars={d:'Ruined Roman forum: colonnades, amphitheatre, temple, baths and a triumphal arch',H:44,open:1,sky:0xa8cdee,gr:0x93885e,gt:'cobble',bc:0xe0d9c6,hemi:1,hemiC:0xfff6e4,hemiG:0x8a7a52,sunI:1,sunC:0xfff0d0,fogF:150,
 fb:[[-31,0],[31,0]],zn:[[-24,-2],[0,12],[24,3]],tb:[-38,-34,38,34],inside:(x,z)=>Math.abs(x)<36&&Math.abs(z)<32,
 lights:[[0,6,-2,0xffe8c0,.5,40]],
 b(){const a=[],v=MAPS.Pillars._v,B=(x,z,w,d,h,y0,c,k)=>a.push([x,z,w,d,h,y0||0,c,k]),V=(x,z,w,d,h,y0,c,s,t)=>v.push([x,z,w,d,h,y0||0,c,s||'b',t]),rnd=MK.rnd(9),pick=q=>q[rnd()*q.length|0],
  MAR=0xe4ddcb,DM=0xc9c0a8,OLD=0xb0a68c,BRK=0x9a5a40,GRS=0x5a7a3a,PINK=0xd8a89a;
  const col=(x,z,h,full=1,w=1.7)=>{B(x,z,w+.5,w+.5,.5,0,DM,'concrete');B(x,z,w,w,h,.5,MAR,'concrete');V(x,z,w+.2,w+.2,h,.5,MAR,'c','concrete');for(let i=0;i<3;i++)V(x,z,w+.14,w+.14,h*.2+i*h*.3,h*.1+i*h*.3,0xc8c0a8,'c');if(full){B(x,z,w+.7,w+.7,h+.7,h,DM,'concrete');V(x,z,w+1,w+1,h+.9,h+.4,MAR,'b','concrete')}else{V(x+.4,z+.2,w*.8,w*.7,.5+rnd()*.5,0,DM,'s')}},
   beam=(x,z,hz,L,y)=>{B(x,z,hz?L:1.5,hz?1.5:L,y+1,y,MAR,'concrete');V(x,z,hz?L:1.6,hz?1.6:L,y+1.25,y+.9,DM,'b','concrete')},
   fallen=(x,z,hz,L)=>{B(x,z,hz?L:1.6,hz?1.6:L,1.45,0,MAR,'concrete');V(x,z,hz?L:1.5,hz?1.5:L,1.5,.1,MAR,'c','concrete');V(x+(hz?L/2:0),z+(hz?0:L/2),1.8,1.8,.4,0,DM,'b')},
   plinth=(x,z,s,h,c)=>{B(x,z,s,s,h,0,DM,'concrete');V(x,z,s*.6,s*.6,h+2.4,h,c||MAR,'s','concrete');V(x,z,s*.3,s*.3,h+3.1,h+1.8,c||MAR,'s')},
   cypress=(x,z,s=1)=>{B(x,z,.8,.8,2*s,0,0x4a3a2a,'plank');V(x,z,2.2*s,2.2*s,8*s,.8,0x2a5a2e,'k')},olive=(x,z)=>{B(x,z,.7,.7,2.2,0,0x6a5a42,'plank');V(x,z,.8,.8,2.4,0,0x6a5a42,'c');V(x,z,4,4,4.4,2,0x6a8a5a,'s');V(x+.9,z-.5,3,3,4.8,2.6,0x7a9a68,'s')},
   steps=(x,z,w,d,n,dir,c)=>MK.stairs(B,x,z,dir=='e'||dir=='w'?d:w,n,dir,c||MAR,'concrete',.3,.7),
   ivy=(x,z,hz,L,h)=>{for(let i=0;i<Math.max(3,L/1.1|0);i++)V(hz?x-L/2+rnd()*L:x,hz?z:z-L/2+rnd()*L,hz?.6+rnd():.12,hz?.12:.6+rnd(),.6+rnd()*h,0,pick([GRS,0x3a5a2a,0x6a8a3a]),'b','grass')};
  /* ground: tile mosaics, grass in the cracks, fallen leaves, a dry river bed of pale sand to the south */
  V(0,0,76,64,.07,0,0xa89c80,'b','cobble');for(let i=0;i<34;i++)V((rnd()-.5)*72,(rnd()-.5)*60,2+rnd()*5,1.5+rnd()*4,.09,0,pick([GRS,0x6a8a3a,0x4a6a2e]),'b','grass');V(0,0,60,6.4,.1,0,0xc9bf9e,'b','concrete');V(0,0,8,60,.1,0,0xc9bf9e,'b','concrete');
  for(let i=0;i<20;i++)V((rnd()-.5)*60,(rnd()-.5)*50,2,2,.11,0,pick([0x8a4a3a,0x4a6a8a,0xc8b080]),'b','concrete');
  /* the avenue: two colonnades with a stone entablature on top (walk beneath), some columns broken */
  for(let i=-5;i<=5;i++)for(const s of[-1,1]){const x=i*5.8,br=(i*7+s*3)%11==0;col(x,s*9.5,br?2.4+rnd()*1.5:8,!br);if(!br&&i<5)beam(x+2.9,s*9.5,1,4.1,8.7)}
  /* amphitheatre in the middle: stepped rings around a raised stage, with four stair ramps and a ring of pillars */
  for(let i=0;i<5;i++){const r=20-i*2.6;MK.wall(B,1,0,-r*.72,r*2*.9,1.2,0,.35+i*.3,[[0,4,0,5]],OLD,'concrete');MK.wall(B,1,0,r*.72,r*2*.9,1.2,0,.35+i*.3,[[0,4,0,5]],OLD,'concrete')}
  for(let i=0;i<3;i++)B(0,-2,16-i*2.2,10-i*1.4,.28*(i+1),0,0xd0c6aa,'concrete');B(0,-2,10,5,1.3,.3,0xe0d6ba,'concrete');
  for(const[x,z]of[[-4.4,-4.2],[4.4,-4.2],[-4.4,.2],[4.4,.2]])col(x,z,4.6,1,1.2);V(0,-2,8,3.6,1.34,1.3,0xb0302a,'b');plinth(0,3.4,2.2,.8,0xc8b078);
  /* temple to the north: stylobate steps, six front columns, cella with a door, fallen roof, statue inside */
  const tx=-4,tz=-26;for(let i=0;i<3;i++)B(tx,tz,22-i*1.4,13-i*1.2,.3*(i+1),0,MAR,'concrete');MK.room(B,{x:tx,z:tz-1,w:11,d:9,h:7.4,t:.7,y0:.9,c:MAR,k:'concrete',roof:0,dr:{s:[[0,3,4.6]]},wn:{}});
  for(let i=0;i<6;i++)col(tx-8.8+i*3.52,tz+4.7,i==2?3.6:8,i!=2);for(const s of[-1,1])for(let i=0;i<2;i++)col(tx+s*9.8,tz-1+i*5,8,1);beam(tx,tz+4.7,1,19,9.7);B(tx,tz-1,5,3,8.9,8.3,DM,'concrete');plinth(tx,tz-3,2.6,.9+.4,0xe8e0cc);fallen(tx+6,tz+8.5,1,6);fallen(tx-9,tz+10.6,1,4);V(tx,tz+6,19,.5,11.8,9.7,DM,'b','concrete');
  /* baths in the south: sunken pool shown as a rim and water, arcaded hall on both sides */
  const bx=3,bz=24;B(bx,bz,15,.7,1,0,MAR,'concrete');B(bx,bz+6.4,15,.7,1,0,MAR,'concrete');B(bx-7.2,bz+3.2,.7,6.4,1,0,MAR,'concrete');B(bx+7.2,bz+3.2,.7,6.4,1,0,MAR,'concrete');V(bx,bz+3.2,14,5.8,.7,.1,0x4a9ab8,'g');
  for(const s of[-1,1]){MK.wall(B,0,bx+s*11,bz+3,16,.9,0,5.6,[[-4.6,2.8,0,3.6],[0,2.8,0,3.6],[4.6,2.8,0,3.6]],PINK,'stucco');B(bx+s*11,bz+3,1.2,16.4,6.1,5.6,DM,'concrete');for(let i=0;i<3;i++)V(bx+s*(11+.5),bz-2.3+i*4.6+3,.2,2.6,4.8,3.4,0x2a2a2a,'b')}
  B(bx,bz+9,28,.9,5.6,0,PINK,'stucco');for(let i=0;i<5;i++)V(bx-10+i*5,bz+8.4,2.4,.2,3.6,.1,0x2a2a2a,'b');
  /* stoas: long covered halls east and west with doorways */
  for(const s of[-1,1])MK.room(B,{x:s*28,z:-18,w:6,d:20,h:5.4,t:.6,c:OLD,k:'concrete',rc:BRK,rk:'shingle',dr:{w:[[-5,2.6,3.6],[5,2.6,3.6]],e:[[-5,2.6,3.6],[5,2.6,3.6]],n:[[0,2.4,3]]},wn:{[s>0?'e':'w']:[[-6,1.4],[0,1.4],[6,1.4]]}});
  /* triumphal arch at the east end of the avenue: two piers and a lintel high enough to walk under */
  for(const s of[-1,1]){B(33.5,s*3.6,5,3.2,10,0,MAR,'concrete');V(33.5,s*3.6,5.4,3.6,10.2,7,DM,'b','concrete')}B(33.5,0,5,10.4,11.4,7.4,MAR,'concrete');V(33.5,0,5.4,10.8,12,11.2,DM,'b','concrete');V(33.5,0,2,3,13.6,12,0xc8a24a,'b');for(const s of[-1,1])steps(30.4,s*3.6,1,3.2,3,'e');
  /* statues on plinths, fountains, fallen columns, broken walls, benches of stone, cypress and olive groves */
  for(const[x,z]of[[-14,-3],[14,-3],[-14,3],[14,3],[-26,16],[26,16],[-24,-30],[18,-30]])plinth(x,z,2.4,1.3);
  for(const[x,z]of[[-20,-1],[20,2]]){B(x,z,4.4,4.4,.9,0,MAR,'concrete');V(x,z,3.6,3.6,.3,.7,0x4a9ab8,'g');B(x,z,.8,.8,2.8,0,MAR,'concrete')}
  fallen(-14,13,1,6);fallen(-23,-12,0,6.5);fallen(12,-13,1,5.5);fallen(25,12,0,6);fallen(-30,9,1,5);fallen(8,12,0,5);fallen(19,23,1,6);
  for(const[x,z,w,d]of[[-12,17,5,.8],[-29,-6,.8,6],[28,9,.8,7],[15,-11,5,.8],[-20,13,.8,5],[-8,-12,.8,4.5],[22,-8,.8,4]]){B(x,z,w,d,1.2+rnd()*1.2,0,OLD,'concrete');ivy(x,z,w>d,Math.max(w,d),1.8)}
  for(const[x,z,h]of[[-16,10.5,1],[16,10.5,1],[-16,-10.5,1],[16,-10.5,1],[-8,16,0],[8,18,0]])B(x,z,h?2.2:.6,h?.6:2.2,.55,0,MAR,'concrete');
  for(const[x,z]of[[-32,-25],[-32,-12],[-32,24],[32,-26],[32,22],[10,-33],[-14,-33],[-34,6],[34,10],[-18,28],[24,28]])cypress(x,z,1+rnd()*.4);for(const[x,z]of[[-23,24],[-27,22],[-26,28],[24,-27],[28,-24],[22,-30],[-10,29],[14,30]])olive(x,z);
  /* the edge of the site: an old low wall covered in ivy with an invisible barrier above it */
  EDGE(a,-37,-33,37,-33,2.2,OLD,'concrete',1.1);EDGE(a,-37,33,37,33,2.2,OLD,'concrete',1.1);EDGE(a,-37,-33,-37,33,2.2,OLD,'concrete',1.1);EDGE(a,37,-33,37,33,2.2,OLD,'concrete',1.1);
  for(let i=-18;i<=18;i++){ivy(i*2,-33,1,2,2);ivy(i*2,33,1,2,2)}for(let i=-15;i<=15;i++){ivy(-37,i*2.1,0,2,2);ivy(37,i*2.1,0,2,2)}for(let i=-17;i<=17;i++){V(i*2.2,-33,1.3,1.4,2.7,2.2,OLD,'b','concrete');V(i*2.2,33,1.3,1.4,2.7,2.2,OLD,'b','concrete')}
  return a},
 deco(){const o=[],rnd=MK.rnd(77),V=(x,z,w,d,h,y0,c,s,t)=>o.push([x,z,w,d,h,y0||0,c,s||'b',t]),pick=q=>q[rnd()*q.length|0];
  /* hills with terraces and vineyards, an aqueduct, villas with red roofs, cypress rows, a coast line to the south and mountains */
  for(let i=0;i<100;i++){const q=rnd()*6.283,d=44+rnd()*90,x=Math.cos(q)*d*1.15,z=Math.sin(q)*d;if(Math.abs(x)<38&&Math.abs(z)<35)continue;const w=14+rnd()*34,h=3+rnd()*10;V(x,z,w,w*(.6+rnd()*.7),h*.6,-h*.5,pick([0x8a9a5a,0x7a8a50,0x9aa868,0x6a7a48]),'s','grass')}
  for(let i=0;i<10;i++){const q=i/10*6.283+.1;V(Math.cos(q)*150,Math.sin(q)*140,110,80,50,-12,pick([0x8a8a9a,0x9a9aaa,0x7a7a8a]),'s')}
  for(let i=-8;i<=8;i++){V(i*7,-62,2.6,2.6,14,0,0xcbbf9e,'b','concrete');if(i<8){V(i*7+3.5,-62,4.4,2.2,12,0,0x1a1a1a,'b');V(i*7+3.5,-62,7,2.8,15.6,12.2,0xcbbf9e,'b','concrete')}V(i*7,-62,2.8,3,15.8,14,0xdacdac,'b','concrete')}
  for(let i=0;i<16;i++){const x=-70+i*9.4,z=48+rnd()*10;V(x,z,6,6,4,0,pick([0xe8dcc0,0xd8c8a8]),'b','stucco');V(x,z,6.6,6.6,5.6,4,0xb8503a,'k');for(let k=0;k<3;k++)V(x-2+k*2,z+3.05,.9,.1,3,1.4,0x2a3a4a,'g')}
  for(let i=0;i<8;i++){const x=-80+i*21;for(let k=0;k<18;k++)V(x+k*1.1,-48,.8,.8,3.4,0,0x3a5a2e,'c');V(x+10,-42,22,4,.12,0,pick([0x8aa04a,0x6a8a3a]),'b','grass');for(let k=0;k<10;k++)V(x+k*2.2,-42,.15,4,.5,0,0x7a6a3a,'b')}
  V(0,100,300,50,.2,-.1,0x3a7aa8,'b');V(0,100,300,50,.1,0,0x6aa8d0,'g');for(let i=0;i<9;i++)V(-60+i*18,86+(i%2)*3,9,3,2,0,0x8a7a62,'s');
  for(let i=0;i<60;i++){const q=rnd()*6.283,d=40+rnd()*60,x=Math.cos(q)*d*1.15,z=Math.sin(q)*d;if(Math.abs(x)<38&&Math.abs(z)<35)continue;V(x,z,2.2,2.2,8,.8,0x2a5a2e,'k');V(x,z,.7,.7,1,0,0x4a3a2a,'c')}
  for(let i=0;i<12;i++){const x=(rnd()-.5)*120,z=(rnd()-.5)*110;if(Math.abs(x)<38&&Math.abs(z)<35)continue;V(x,z,1.7,1.7,7,.4,0xe4ddcb,'c','concrete');V(x,z,2.4,2.4,7.6,7,0xc9c0a8,'b','concrete')}
  return o}};

/* =============================== CANYON =============================== */
MAPS.Canyon={d:'Mining gorge: trestle bridge, mill, mine tunnel, water tower, rail carts and climbable ledges',H:44,open:1,sky:0xe0a070,gr:0xb4693e,gt:'sand',bc:0xb9774c,hemi:.85,hemiC:0xffc8a0,hemiG:0x8a4a3a,sunI:1.05,sunC:0xffb070,fogF:150,
 fb:[[-33,8],[33,-6]],zn:[[-26,6],[0,-2],[27,-4]],tb:[-44,-44,44,44],inside:(x,z)=>Math.abs(x)<40&&Math.abs(z)<40,
 lights:[[30,3.6,-18,0xffa040,1.2,16],[-6,3.2,-12,0xffd9a0,.9,16],[22,2.5,-30,0xffa040,1,14],[-20,3,16,0xffc070,.9,16]],
 b(){const a=[],v=MAPS.Canyon._v,B=(x,z,w,d,h,y0,c,k)=>a.push([x,z,w,d,h,y0||0,c,k]),V=(x,z,w,d,h,y0,c,s,t)=>v.push([x,z,w,d,h,y0||0,c,s||'b',t]),rnd=MK.rnd(17),pick=q=>q[rnd()*q.length|0],
  RK=[0xb9774c,0xa8683e,0xc98858,0x9a5a38,0xd09868],WD=0x7a5a3a,WDL=0x9a7a52,MET=0x6a6a62,RS=0x8a4a2a;
  const rock=(x,z,w,d,h,y0)=>{B(x,z,w,d,h,y0||0,pick(RK),'sand');const s=Math.min(w,d);for(let i=0;i<3;i++)V(x+(rnd()-.5)*w*.8,z+(rnd()-.5)*d*.8,s*.5,s*.4,h+.2+rnd()*.5,h-.4,pick(RK),'s','sand')},
   /* a terraced cliff: n ledges stepping away from the canyon floor, each one .3 up from the last for the first few so they can be climbed */
   cliff=(x0,z0,len,hz,dir,steps)=>{for(let i=0;i<steps.length;i++){const[off,wd,h]=steps[i],px=hz?x0+len/2:x0+dir*(off+wd/2),pz=hz?z0+dir*(off+wd/2):z0+len/2;rock(px,pz,hz?len:wd,hz?wd:len,h)}},
   cactus=(x,z)=>{B(x,z,.6,.6,2.4,0,0x4a7a3a,'plank');V(x,z,.7,.7,2.5,0,0x4a7a3a,'c');V(x-.6,z,.6,.3,1.9,1.5,0x4a7a3a,'c');V(x+.6,z,.6,.3,1.5,1.1,0x4a7a3a,'c')},
   boulder=(x,z,r)=>{B(x,z,r,r,r*.7,0,pick(RK),'sand');V(x,z,r*1.1,r*1.05,r*.8,0,pick(RK),'s','sand')},
   barrel=(x,z,c)=>{B(x,z,.8,.8,1.1,0,c||WD,'plank');V(x,z,.85,.85,1.1,0,c||WD,'c','plank');V(x,z,.9,.9,.1,.5,0x2a2a2a,'c')},crate=(x,z,s)=>B(x,z,s,s,s*.9,0,0x9a7a4a,'plank'),
   dead=(x,z)=>{B(x,z,.5,.5,2.6,0,0x5a4a3a,'plank');V(x,z,.5,.5,3,0,0x5a4a3a,'c');for(let i=0;i<4;i++){const q=i*1.6+rnd();V(x+Math.cos(q)*.8,z+Math.sin(q)*.8,1.8,.12,2.6+rnd()*1.2,2.2+rnd(),0x4a3a2a,'b')}},
   cart=(x,z,hz,full)=>{B(x,z,hz?2.6:1.5,hz?1.5:2.6,1.15,.3,0x5a5a60,'metal');V(x,z,hz?2.7:1.6,hz?1.6:2.7,1.2,1.0,0x3a3a3e,'b','metal');if(full)V(x,z,hz?2.3:1.2,hz?1.2:2.3,1.5,1.1,0x2a2a2e,'s');for(const s of[-1,1])V(x+(hz?s*.9:0),z+(hz?0:s*.9),.5,.5,.5,0,0x1b1b1c,'c')},
   shack=(x,z,w,d,fl,dr)=>multi(B,{x,z,w,d,fl,fh:3.4,c:WDL,k:'plank',rc:0x6a4a30,rk:'plank',dr,rnd,step:3,wlo:1.1,whi:2.2});
  /* ground: wheel ruts, railway, scrub, dry riverbed in pale sand */
  V(0,0,92,92,.06,0,0xb4693e,'b','sand');V(-2,2,80,10,.07,0,0xd0a870,'b','sand');V(14,-12,10,50,.07,0,0xd0a870,'b','sand');V(-22,18,30,8,.07,0,0xd0a870,'b','sand');
  for(let i=0;i<36;i++){const x=(rnd()-.5)*86,z=(rnd()-.5)*86;V(x,z,1+rnd()*3,.8+rnd()*2,.08,0,pick([0x8a9a4a,0x6a7a3a,0xa0a050]),'b','grass')}
  V(-1,-9,80,.2,.12,0,0x4a4a4e,'b');V(-1,-7.6,80,.2,.12,0,0x4a4a4e,'b');for(let i=-19;i<=19;i++)V(-1+i*2.1,-8.3,.5,2.2,.14,0,0x5a3a22,'b','plank');
  /* canyon walls: terraced on the north and south with climbable ledges and rock tops; east and west are wide cliff masses with gaps */
  const N=[[0,3,.3],[3,3,.6],[6,3,.9],[9,3,1.2],[12,4,3.4],[16,4,5.4],[20,5,8.6]],M=[[0,3,.3],[3,3,.6],[6,3,.9],[9,4,3],[13,4,5],[17,6,9]];
  cliff(-40,-40,28,1,1,N.map(([o,w,h])=>[o,w,h]));cliff(12,-40,28,1,1,N.map(([o,w,h])=>[o+(o>9?0:0),w,h*(1+(rnd()<.5?0:.2))]));cliff(-40,40,34,1,-1,M);cliff(-2,40,42,1,-1,M);
  rock(-40,-24,6,28,10);rock(-40,24,6,28,11);rock(40,-26,6,26,10);rock(40,18,6,34,10);rock(-37,0,4,10,4);rock(37,-4,4,8,3);rock(-34.5,-6,3,5,2);
  /* gaps in the south cliff form two side canyons; a pair of ledges lets you climb out of the north side onto a mesa shelf */
  B(-24,-31,12,4,4.6,0,pick(RK),'sand');B(-10,-33,10,5,6.2,0,pick(RK),'sand');MK.stairs(B,-20,-27,3,15,'n',pick(RK),'sand',.3,.6,0);rock(-4,-35,8,4,6.8);
  /* mine tunnel through the east cliff: timber frames and a roof high above the rails */
  const mx=34,mz=-18;B(mx,mz-4.5,14,4,3,0,pick(RK),'sand');B(mx,mz+4.5,14,4,3,0,pick(RK),'sand');B(mx,mz,14,5,14,3.6,pick(RK),'sand');B(mx+2,mz,10,5.2,14,3.6,pick(RK),'sand');for(let i=0;i<5;i++){V(mx-5.5+i*2.8,mz-2.4,.5,.5,3.4,0,WD,'b','plank');V(mx-5.5+i*2.8,mz+2.4,.5,.5,3.4,0,WD,'b','plank');V(mx-5.5+i*2.8,mz,.5,5.2,3.7,3.3,WD,'b','plank')}
  V(mx,mz,12,2,.14,0,0x4a4a4e,'b');for(let i=0;i<8;i++)V(mx-5+i*1.5,mz,.4,2.4,.15,0,0x5a3a22,'b','plank');V(mx,mz-1.6,8,.9,1.2,.1,0x2a2a2e,'s');B(mx-3,mz+1.6,1.4,1.2,1.0,0,0x5a5a60,'metal');V(mx-6.6,mz,.1,3,3,.2,0xffd9a0,'e');
  /* water tower on legs with a tank (walk under it); stairs up to a catwalk */
  const wt=[-14,-16];for(const sx of[-1,1])for(const sz of[-1,1]){B(wt[0]+sx*2.4,wt[1]+sz*2.4,.6,.6,8,0,WD,'plank')}B(wt[0],wt[1],6.2,6.2,8.4,8,WD,'plank');V(wt[0],wt[1],6,6,13,8.4,0x7a5a3a,'c','plank');V(wt[0],wt[1],6.3,6.3,14.4,13,0x5a3a22,'k');for(let i=0;i<4;i++)V(wt[0],wt[1],6.1,6.1,.25,9+i*1.2,0x3a3a3a,'c');MK.stairs(B,wt[0]-3.4,wt[1]+3.4,1.4,26,'n',WD,'plank',.31,.45,0);for(const[dx,dz]of[[-2.4,0],[2.4,0],[0,-2.4],[0,2.4]])V(wt[0]+dx,wt[1]+dz,dx?.1:4.8,dx?4.8:.1,6.5,.4,0x4a3a2a,'b');
  /* ore mill: three floors with a hopper, a chute and a big wheel */
  multi(B,{x:-4,z:-17,w:12,d:9,fl:3,fh:3.8,c:0x8a7a62,k:'plank',rc:0x5a4a38,rk:'plank',dr:{s:[[-2,2.6,3.2]],e:[[0,1.8,2.6]]},rnd,step:3.4});V(-4,-12.3,10,1,12,3,0x5a4a38,'b','plank');V(-10.4,-17,.5,5,5.4,.5,0x4a3a2a,'c','plank');V(-10.4,-17,.4,8,7,3,RS,'c','rust');B(-4,-23.6,3,3,7,0,WD,'plank');V(-4,-23.6,3.4,3.4,9,7,RS,'k','rust');V(1.2,-13.5,3,.6,2.4,.2,0x4a3a2a,'b','plank');
  /* saloon and boarding house with covered porch, hotel and bank facades along the main street */
  multi(B,{x:-22,z:-2,w:14,d:9,fl:2,fh:3.6,c:0xa86a46,k:'plank',rc:0x6a4a30,rk:'plank',dr:{s:[[-3,2.4,2.8],[3,1.8,2.5]],n:[[0,1.8,2.5]]},rnd,step:3.4});B(-22,3.5,14.6,2.6,3.2,3,0x6a4a30,'plank');for(let i=0;i<5;i++)B(-28+i*3,4.6,.3,.3,3,0,WD,'plank');V(-22,-6.6,10,.1,5.4,4.4,0xe8d4a0,'b','plank');B(-22,-5,5,.1,5.2,3.8,0,'n');
  multi(B,{x:-8,z:3,w:9,d:8,fl:2,fh:3.6,c:0x9a8a6a,k:'plank',rc:0x5a4a38,rk:'plank',dr:{n:[[-1,2.4,2.8]],e:[[0,1.8,2.5]]},rnd});shack(10,-24,7,6,1,{s:[[0,1.8,2.5]]});shack(-30,24,8,6,1,{n:[[0,1.8,2.5]],e:[[0,1.8,2.5]]});shack(8,22,7,7,2,{w:[[0,1.8,2.5]],n:[[2,1.8,2.5]]});shack(24,12,6,5,1,{w:[[0,1.8,2.5]]});
  MK.room(B,{x:-34,z:-24,w:3.4,d:3.4,h:2.6,c:0x6a4a30,k:'plank',rc:0x4a3a28,dr:{e:[[0,1.2,2.2]]},wn:{}});V(-34,-24,3.8,3.8,3.5,2.6,0xc8362a,'b');
  /* trestle bridge across the gulch at height 5: timber legs, a deck with rails, stairs up at both ends */
  const bz=-30,b0=-32,b1=6;for(let x=b0;x<=b1;x+=4)for(const s of[-1,1]){B(x,bz+s*1.5,.7,.7,4.6,0,WD,'plank');V(x,bz+s*1.5,.9,.9,4.7,0,0x5a3a22,'b','plank')}for(let x=b0+2;x<b1;x+=4){V(x,bz,.3,3.4,3.8,.8,WDL,'b');V(x,bz,.2,4,3.2,2.6,0x5a3a22,'b')}B((b0+b1)/2,bz,b1-b0+2,3.6,5,4.6,WDL,'plank');for(const s of[-1,1])for(let x=b0;x<=b1;x+=2)V(x,bz+s*1.7,.12,.12,6.1,5,0x4a3a2a,'b');for(const s of[-1,1])V((b0+b1)/2,bz+s*1.7,b1-b0+2,.1,6,5.9,0x4a3a2a,'b');
  MK.stairs(B,b0-1.8,bz,3.2,16,'e',WDL,'plank',.2875,.62,0);MK.stairs(B,b1+1.8,bz,3.2,16,'w',WDL,'plank',.2875,.62,0);
  /* corral, cart track, cargo stacks, dynamite shed, windmill and plenty of scatter */
  for(let i=0;i<6;i++){B(18+i*2.2,28,.2,.2,1.5,0,WD,'plank');B(18+i*2.2,36,.2,.2,1.5,0,WD,'plank')}for(let i=0;i<4;i++){B(18+i*2.2+1.1,28,2.2,.1,1.2,.5,WD,'plank');B(18+i*2.2+1.1,36,2.2,.1,1.2,.5,WD,'plank')}
  for(const[x,z,h,f]of[[6,-8.3,1,1],[10,-8.3,1,0],[14,-8.3,1,1],[-12,-8.3,1,0],[24,-8.3,1,1]])cart(x,z,h,f);
  for(const[x,z]of[[-10,10],[-6,14],[10,12],[20,2],[26,-10],[2,18],[-18,24],[16,-30],[-26,12],[30,20],[22,-22],[0,-24]])boulder(x,z,1.6+rnd()*1.8);
  for(const[x,z]of[[-30,10],[-16,8],[6,6],[28,6],[32,-8],[-8,22],[14,30],[-34,18],[24,-34],[4,-14],[-20,-14]])cactus(x,z);for(const[x,z]of[[-27,-12],[12,-14],[26,24],[-14,30],[30,-26]])dead(x,z);
  for(const[x,z]of[[-28,-6],[-27,-6.9],[-27.8,-7.8],[6,12],[6.9,12.6],[12,-22],[12.8,-22.8],[24,20],[-16,22],[-15,22.8]])barrel(x,z,pick([WD,RS,0x2a4a6a]));for(const[x,z,s]of[[-1,12,1.4],[1,12.6,1.2],[2.2,-3,1.5],[-12,6,1.4],[22,8,1.3],[-6,-4,1.2],[8,-18,1.4],[28,-10,1.5]])crate(x,z,s);
  for(const[x,z]of[[-24,-8],[-12,12],[16,6],[30,-14],[-34,12]]){V(x,z,.14,.14,3.6,0,WD,'c');V(x,z,1.4,.08,3.5,2.8,0xe8d4a0,'b','plank');V(x,z,.3,.3,3.9,3.6,0xffc060,'e')}
  /* the railroad ends in buffers; a small signal; a mine office with a safe */
  B(-40.5,-8.3,1.6,3.2,1.6,0,0x5a5a60,'metal');for(const x of[-30,-6,18,36])V(x,-10.4,.14,.14,3.2,0,0x3a3a3e,'c'),V(x,-10.4,.7,.1,3.2,2.6,0x8a2a1a,'b');
  return a},
 deco(){const o=[],rnd=MK.rnd(33),V=(x,z,w,d,h,y0,c,s,t)=>o.push([x,z,w,d,h,y0||0,c,s||'b',t]),pick=q=>q[rnd()*q.length|0],RK=[0xb9774c,0xa8683e,0xc98858,0x9a5a38,0xd09868,0x8a4a30];
  /* the gorge continues: huge terraced mesas on every side, spires, arches, a distant river and desert scrub, vultures, wind-carved ridges */
  for(let i=0;i<60;i++){const q=rnd()*6.283,d=52+rnd()*95,x=Math.cos(q)*d*1.1,z=Math.sin(q)*d;if(Math.abs(x)<44&&Math.abs(z)<44)continue;const w=10+rnd()*30,h=10+rnd()*34;V(x,z,w,w*(.7+rnd()*.6),h,0,pick(RK),'b','sand');V(x,z,w*.78,w*.7,h+h*.3,h,pick(RK),'b','sand');V(x,z,w*.5,w*.5,h*1.5,h*1.3,pick(RK),'b','sand')}
  for(let i=0;i<26;i++){const q=rnd()*6.283,d=48+rnd()*60,x=Math.cos(q)*d,z=Math.sin(q)*d;if(Math.abs(x)<44&&Math.abs(z)<44)continue;V(x,z,3+rnd()*3,3+rnd()*3,12+rnd()*18,0,pick(RK),'c','sand');V(x,z,5,5,13+rnd()*19,11,pick(RK),'s','sand')}
  for(let i=0;i<8;i++){const x=-60+i*16,z=-62;V(x,z,3,3,14,0,pick(RK),'b','sand');V(x+4,z,3,3,14,0,pick(RK),'b','sand');V(x+2,z,9,3.4,17,14,pick(RK),'b','sand')}
  for(let i=0;i<90;i++){const q=rnd()*6.283,d=40+rnd()*80,x=Math.cos(q)*d*1.1,z=Math.sin(q)*d;if(Math.abs(x)<44&&Math.abs(z)<44)continue;V(x,z,.8,.8,1.6+rnd()*1.2,0,0x4a7a3a,'c')}
  V(0,100,300,40,.2,-.1,0x3a7aa8,'b');for(let i=0;i<6;i++)V(-50+i*20,-80,.3,.3,34+i*3,28,0x1a1a1a,'s');
  for(let i=-8;i<=8;i++){V(-1+i*5,-52.6,.5,.5,3.8,0,0x6a5a42,'b','plank')}for(let i=0;i<5;i++)V(-46+i*22,-54,4,2,.8,0,0x5a5a60,'b','metal');
  V(-58,-8,24,.14,.2,0,0x3a3a3e,'b');V(-58,-6.6,24,.14,.2,0,0x3a3a3e,'b');
  return o}};
;
/* ######## lanes.js ######## */
/* ===================== lanes.js ===================== */
/* ---------- the three lane layout ----------
   Every multiplayer map is built as three main pathways running from one team's side to the other: a north lane, a middle lane and a south lane. Long dividers (shipping containers, wrecks,
   stone walls, ruined walls, rock ridges, hedges, adobe walls, depending on the map) separate the lanes, with crossover gaps every so often so players can rotate between lanes. Each lane
   also gets its own tint on the ground so it reads at a glance. Dividers are only placed where nothing already stands, so the map's own buildings act as divider pieces too.
   The Hollow Estate zombies map is a survival layout and is not divided. ---------- */
const LANES={
 Rust:{zs:[-10,10],x:[-20,20],style:'container',seg:6,gap:4.4,col:[0x9a3a2a,0x3a5a6a,0x6b6a45,0x8a5a2a],tint:[0x8a7a5a,0x9a8660,0x7a7258]},
 Decay:{zs:[-15,16],x:[-40,40],style:'wreck',seg:8,gap:4.6,col:[0x6a6a2a,0x3a4a5a,0x5a2a2a,0x4a4a4a],tint:[0x5a5a52,0x4e4e4a,0x56564c]},
 Blockfort:{zs:[-9.5,9.5],x:[-27,27],style:'stone',seg:8,gap:4.4,col:[0x9a958a],tint:[0x6a6a60,0x7a7468,0x6a6a60]},
 Pillars:{zs:[-11,11],x:[-31,31],style:'ruin',seg:7,gap:4.6,col:[0xd0c8b0,0xc0b69c],tint:[0xb0a688,0xc2b894,0xb0a688]},
 Canyon:{zs:[-6,8.5],x:[-34,34],style:'rock',seg:8,gap:5,col:[0xb9774c,0xa8683e,0xc98858],tint:[0xc08a58,0xd0a070,0xb87a4a]},
 Suburbia:{zs:[-19,19],x:[-45,45],style:'hedge',seg:9,gap:5,col:[0x3f7a34],tint:[0x5a8a46,0x66954e,0x5a8a46]},
 Boomtown:{zs:[-8,8],x:[-44,44],style:'adobe',seg:9,gap:5,col:[0xc2a878,0xb8996a],tint:[0xb59d6c,0xc0a878,0xb59d6c]}};
MK.lanes=function(a,v,name){const C_=LANES[name];if(!C_)return;const rnd=MK.rnd(name.length*31+7),B=(x,z,w,d,h,y0,c,k)=>a.push([x,z,w,d,h,y0||0,c,k]),V_=(x,z,w,d,h,y0,c,s,t)=>v.push([x,z,w,d,h,y0||0,c,s||'b',t]),pick=q=>q[rnd()*q.length|0];
 const free=(x,z,w,d,m)=>!a.some(b=>b[4]>.5&&(b[5]||0)<2&&Math.abs(x-b[0])<(w+b[2])/2+m&&Math.abs(z-b[1])<(d+b[3])/2+m);
 const M=MAPS[name],hx=M.H||40;
 /* ground tint ribbons: one per lane */
 const zb=[-hx,C_.zs[0],C_.zs[1],hx],ext=C_.x[1]*1.15;for(let i=0;i<3;i++){const z0=Math.max(zb[i],-(M.H-4)),z1=Math.min(zb[i+1],M.H-4);V_(0,(z0+z1)/2,ext*2,z1-z0-.6,.045,0,C_.tint[i],'b','concrete')}
 const piece=(x,z,len,zi)=>{const c=pick(C_.col);
  if(C_.style=='container'){B(x,z,len,2.5,2.6,0,c,'rust');for(let i=-2;i<=2;i++)V_(x+i*1.15,z,.08,2.56,2.55,.1,0x2a2a2a,'b');if(rnd()<.4)V_(x,z,len-.4,2.4,2.7,2.6,pick(C_.col),'b','rust')}
  else if(C_.style=='wreck'){B(x,z,len,2.8,2.8,0,c,'rust');V_(x,z,len-.3,2.9,3.0,2.8,0x2a2a2e,'b','metal');for(let i=-3;i<=3;i++)V_(x+i*1.1,z+1.42,.9,.05,2.4,1.4,0x1a2a32,'g');B(x+len/2+.9,z+.2,1.8,.8,1.05,0,0xb5b0a2,'concrete')}
  else if(C_.style=='stone'){B(x,z,len,1.3,3.6,0,c,'brick');for(let i=-len/2+.6;i<len/2;i+=1.5)V_(x+i,z,.9,1.5,4.3,3.6,c,'b','brick');V_(x,z-.8,len,.2,.9,0,0x4a4a44,'b','concrete')}
  else if(C_.style=='ruin'){B(x,z,len,1.2,2.6+rnd()*1.6,0,pick(C_.col),'concrete');for(let i=0;i<5;i++)V_(x+(rnd()-.5)*len,z+(rnd()>.5?.65:-.65),.5+rnd(),.1,.8+rnd()*2.4,0,pick([0x4f7a3a,0x3a5a2a,0x6a8a3a]),'b','grass')}
  else if(C_.style=='rock'){B(x,z,len,3.2,3.4+rnd()*1.6,0,c,'sand');for(let i=0;i<3;i++)V_(x+(rnd()-.5)*len*.8,z+(rnd()-.5)*2,2.4,2,4.6+rnd()*1.2,2,pick(C_.col),'s','sand')}
  else if(C_.style=='hedge'){B(x,z,len,1.4,2.2,0,0x3f7a34,'grass');V_(x,z,len+.2,1.6,2.35,1.4,0x4f8a3c,'b','grass');for(let i=0;i<6;i++)V_(x+(rnd()-.5)*len,z+(rnd()-.5)*1.2,.6,.6,2.5,2,pick([0xe8c030,0xd84a6a,0xffffff]),'s')}
  else{B(x,z,len,1.2,3,0,c,'stucco');V_(x,z,len+.1,1.4,3.3,3,0x9a8460,'b','concrete');for(let i=-len/2+1.2;i<len/2;i+=3)V_(x+i,z-.65,.9,.05,2.2,.9,0x5a3a22,'b')}};
 for(let k=0;k<2;k++){const z=C_.zs[k],step=C_.seg+C_.gap*2.4;let x=C_.x[0]+(k?step*.5:0);/* isolated blocks (a container stack, a wreck, a wall stub, a ruin) with wide open ground between them: the lanes are three routes you can walk through, not walls */while(x+C_.seg<=C_.x[1]){const len=C_.seg*(.8+.4*rnd()),cx=x+len/2,jz=z+(rnd()-.5)*.8;if(free(cx,jz,len,2.2,1.0))piece(cx,jz,len,k);x+=step}}}
for(const n of Object.keys(LANES)){const M=MAPS[n];if(!M||!M.b)continue;const _b=M.b;M.b=function(){const a=_b.apply(this,arguments);this._v=this._v||[];MK.lanes(a,this._v,n);return a}}
;
