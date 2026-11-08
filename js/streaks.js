/* ######## sk_data.js ######## */
/* ===================== sk_data.js ===================== */
/* ---------- killstreaks: the table (name, category, kills needed, unlock level, description) and a 3D model for every one of them.
   The models are used in the world (placed devices, aircraft, drones, crates) and rendered into the icons of the Killstreaks screen. ---------- */
const SKC=['Radar & Reconnaissance','Disruption & Electronic Warfare','Supply & Team Support','Traps & Remote Explosives','Sentry Turrets & Ground Robotics','Guided Missiles & Guided Bombs','Directed Bombardments & Air Strikes','Choppers & Heavy Gunships','Armored Suits & Reinforcements','Heavy Infantry Weapons','Orbital Space Weapons','Game-Ending Nuke'];
/* id, name, category index, kills, unlock level, description */
const STK_=[
 ['uav','UAV',0,3,1,'Pings basic enemy locations as periodic dots on the mini-map.'],
 ['advuav','Advanced UAV',0,5,6,'Shows real-time enemy positions and the direction they are facing, with no radar delay.'],
 ['pradar','Personal Radar',0,4,3,'A small drone that follows you and scans for enemies in your immediate proximity.'],
 ['motion','Motion Sensor',0,3,2,'A placeable field device that highlights enemies moving within its radius on the mini-map.'],
 ['cuav','Counter-UAV',1,4,4,'Jams and scrambles the enemy team\'s mini-map. Enemies react slower and lose track of you.'],
 ['emp','EMP',1,9,22,'Temporarily shuts down all enemy electronics, HUD, red-dots and active scorestreaks map-wide.'],
 ['flak','Flak Guns',1,6,12,'Automatically shoots down active enemy air support and prevents new air assets from being called in.'],
 ['care','Care Package',2,4,1,'Drops a single crate containing a random streak or heavy weapon.'],
 ['airdrop','Emergency Airdrop',2,7,16,'Calls in a cargo plane to drop multiple Care Packages at once.'],
 ['vests','Ballistic Vests',2,5,8,'Drops a crate of body armor to increase your health pool.'],
 ['ammo','Ammo Crate',2,3,2,'Drops a supply crate that replenishes ammunition and explosive equipment.'],
 ['sim','S.I.M.',3,5,9,'A deployable explosive module that automatically launches airburst anti-personnel charges when enemies draw near.'],
 ['dcvt','DC-VT',3,5,5,'A small, fast, remote-controlled car packed with explosives that you detonate manually.'],
 ['bombdrone','Bomb Drone',3,6,13,'A remote quadcopter with a 7 second battery. Crashes, enemies and your trigger all detonate it. The camera feed is a grainy night filter.'],
 ['hunter','Hunter Killer Drone',3,5,7,'An autonomous mini-drone that seeks out and crashes into the nearest enemy.'],
 ['sentry','Sentry Gun',4,6,10,'An automated tripod-mounted machine gun that targets enemies in its line of sight.'],
 ['shieldt','Shield Turret',4,7,18,'A heavy machine gun turret fitted with a bulletproof head-shield.'],
 ['pal','PAL Turret',4,6,15,'An automated surface-to-air missile battery that shoots down enemy aircraft.'],
 ['guardian','Guardian',4,8,24,'A microwave dish turret that emits a cone of heat, slowing, disorienting and damaging enemies.'],
 ['groundsis','Groundsis',4,8,28,'An armored ground rover equipped with an airburst turret that follows you.'],
 ['terminator','Terminator Missile',5,7,19,'High-altitude guided missile you steer directly down into enemy clusters.'],
 ['glide','Glide Boom',5,8,26,'A heavy free-fall guided bomb dropped from the sky.'],
 ['knight','Knight Rockets',5,7,20,'Handheld remote-controlled rockets steered in first person with limited fuel.'],
 ['gilded','GildedBird',5,9,32,'A remote-controlled stealth drone capable of firing individual micro-missiles.'],
 ['precision','Precision Airstrike',6,7,1,'Jet fighters sweep across a targeted linear strip of the map.'],
 ['mortar','Mortar Strike',6,6,11,'Heavy mortar shell bombardment on multiple map coordinates.'],
 ['stealth','Stealth Bomber',6,11,34,'A B-2 bomber, invisible to enemy radar, carpet-bombs a massive section of the map.'],
 ['napalm','Napalm Strike',6,9,30,'An aerial bomb drop that coats a strip of land in lingering fire.'],
 ['dogs','Attack Dogs',6,8,21,'A pack of lethal AI hunting dogs spawns to hunt down enemies.'],
 ['achopper','Attack Chopper',7,8,17,'An automated helicopter that patrols the map and shoots nearby enemies.'],
 ['gunner','Chopper Gunner',7,10,27,'You manually operate a heavy turret from the side door of a circling helicopter.'],
 ['dc260','DC-260',7,12,36,'You control the 105mm, 40mm and 25mm cannons from a high-altitude gunship.'],
 ['overwatch','Overwatch',7,9,29,'An armored chopper that follows and protects you.'],
 ['tolv','TOLV Planet',7,11,38,'A hover-capable fighter jet that drops bombs then hovers to auto-engage enemies.'],
 ['cube','Cube Turret Gunner',7,13,42,'You operate a 360-degree underbelly turret from a flying fortress bomber.'],
 ['jugg','Juggernaut',8,10,25,'An armored suit with a minigun and boosted health.'],
 ['goliath','Goliath',8,13,40,'A heavy mechanized battle suit with continuous miniguns and a self-destruct.'],
 ['para','Paratroopers',8,9,23,'An AI squad of soldiers drops into the map to fight alongside you.'],
 ['guarddog','Guard Dog',8,6,14,'A companion dog that follows you, guarding your back and attacking flankers.'],
 ['fear','Fear Machine',9,9,31,'A handheld multi-barrel minigun with a huge firing rate.'],
 ['boom','Boom Machine',9,8,33,'A semi-automatic handheld grenade launcher.'],
 ['flame','Flamethrower',9,8,35,'A portable incendiary weapon that incinerates close-quarters targets.'],
 ['satellite','Super Satellite',10,14,44,'Space station: kinetic rod strikes, smoke canisters and a tactical supply drop.'],
 ['annihil','Annihilation',10,15,48,'An orbital high-energy particle beam that burns everything it sweeps over.'],
 ['nuke','Nuke',11,30,1,'Launches by itself at 30 kills in a row. It cannot be equipped. When it detonates the match ends and the player who called it wins.']];
const STK={},STKL=[];for(const[id,n,c,k,lv,d]of STK_){STK[id]={id,n,c,k,lv,d};STKL.push(STK[id]);if(typeof UNL!='undefined')UNL['sk:'+id]=lv}
const SK_DEF=['uav','care','precision'];

/* ---------- models ---------- */
function skModel(id){const g=new THREE.Group(),M={},mat=c=>M[c]||(M[c]=new THREE.MeshLambertMaterial({color:c})),em=c=>M['e'+c]||(M['e'+c]=new THREE.MeshBasicMaterial({color:c}));
 const B=(w,h,d,x,y,z,c,rx,ry,rz)=>{const m=new THREE.Mesh(bg,typeof c=='object'?c:mat(c));m.scale.set(w,h,d);m.position.set(x,y,z);m.rotation.set(rx||0,ry||0,rz||0);g.add(m);return m},
  Cy=(r,len,x,y,z,c,ax,rt)=>{const m=new THREE.Mesh(new THREE.CylinderGeometry(rt==null?r:rt,r,len,16),typeof c=='object'?c:mat(c));if(ax=='z')m.rotation.x=Math.PI/2;else if(ax=='x')m.rotation.z=Math.PI/2;m.position.set(x,y,z);g.add(m);return m},
  Sp=(r,x,y,z,c,sx,sy,sz)=>{const m=new THREE.Mesh(sg,typeof c=='object'?c:mat(c));m.scale.set(r*(sx||1),r*(sy||1),r*(sz||1));m.position.set(x,y,z);g.add(m);return m},
  Co=(r,len,x,y,z,c,ax)=>{const m=new THREE.Mesh(new THREE.ConeGeometry(r,len,14),typeof c=='object'?c:mat(c));if(ax=='z')m.rotation.x=Math.PI/2;else if(ax=='-z')m.rotation.x=-Math.PI/2;m.position.set(x,y,z);g.add(m);return m},
  rotor=(x,y,z,r,c)=>{Cy(.03,.05,x,y,z,0x222222);Cy(r,.012,x,y+.03,z,c||0x333840)},
  GRY=0x6a7078,DK=0x2a2d32,TAN=0xb8a070,OLV=0x4a5a38,RED=0xc0392b,ORG=0xd9822b,BLK=0x16181b,WHT=0xd8d8d0,STE=0x9aa0a8;
 const wheel=(x,y,z,r)=>{Cy(r,.1,x,y,z,0x151515,'x')},dish=(x,y,z,r,c)=>{Co(r,r*.5,x,y,z,c||WHT,'z')};
 const legs=(x,z,h,sp,c)=>{for(const a of[0,2.09,4.19])Cy(.02,h,x+Math.cos(a)*sp*.5,h/2,z+Math.sin(a)*sp*.5,c||DK).rotation.set(Math.sin(a)*.45,0,-Math.cos(a)*.45)};
 const jet=(w,l,c)=>{Cy(.35*w,l,0,0,0,c,'z',.04*w);Co(.35*w,l*.3,0,0,l*.65,c,'z');B(w*3.2,.05*w,l*.45,0,0,-.05*l,c,0,0,0);B(w*1.4,.05*w,l*.25,0,0,-.4*l,c);for(const s of[-1,1])B(.05*w,.55*w,.28*l,s*.45*w,.3*w,-.42*l,c,0,0,s*.25);B(.4*w,.28*w,.35*l,0,.28*w,.1*l,0x1b2a38)};
 const heli=(c,big)=>{const s=big?1.35:1;B(1.1*s,1.0*s,2.8*s,0,0,0,c);Sp(.6*s,0,.1*s,1.2*s,c,1,.9,1.1);B(.1*s,.1*s,2.6*s,0,.35*s,-2.4*s,c);B(.05*s,.7*s,.5*s,0,.7*s,-3.6*s,c);Cy(.05,.4,0,.65*s,0,DK);Cy(2.4*s,.03,0,.9*s,0,0x2a2e33);B(5*s,.03,.15,0,.9*s,0,0x2a2e33,0,.8);Cy(.5*s,.03,.15*s,.4*s,-3.55*s,0x2a2e33,'x');B(1.5*s,.06,.4,0,-.5*s,.4*s,DK);for(const sd of[-1,1]){B(.04,.5*s,1.8*s,sd*.5*s,-.6*s,.2,DK);B(.1,.1,1.6*s,sd*.8*s,-.9*s,.2,DK)}B(.9*s,.55*s,.6*s,0,.1*s,1.6*s,0x1b2a38)};
 const dog=(c)=>{B(.28,.3,.7,0,.55,0,c);B(.2,.22,.3,0,.7,.5,c);B(.1,.1,.18,0,.66,.72,BLK);Co(.05,.12,.07,.9,.45,c);Co(.05,.12,-.07,.9,.45,c);for(const sx of[-1,1])for(const sz of[-1,1])B(.08,.45,.1,sx*.12,.22,sz*.25,c);B(.06,.06,.45,0,.62,-.5,c,.5);B(.3,.06,.1,0,.68,.4,RED)};
 const soldier=(c)=>{B(.5,.7,.3,0,1.2,0,c);Sp(.17,0,1.78,0,0xc8a98a);B(.38,.18,.36,0,1.88,0,c);for(const s of[-1,1]){B(.2,.8,.22,s*.15,.5,0,0x2a2f35);B(.14,.6,.14,s*.38,1.2,.05,c)}B(.08,.08,.8,.1,1.15,.4,BLK)};
 switch(id){
 case'uav':B(.4,.35,3,0,0,0,GRY);Cy(.2,2.4,0,0,0,0x7a8088,'z',.04);Co(.2,.8,0,0,1.6,0x7a8088,'z');B(5.4,.06,.8,0,0,-.5,GRY,0,0,0);for(const s of[-1,1])B(.9,.05,.4,s*2.9,0,-1,GRY);B(1.6,.05,.5,0,0,-1.3,GRY);B(.06,.5,.4,0,.35,-1.3,GRY);Sp(.18,0,-.25,.5,0x1b2a38);break;
 case'advuav':B(.5,.4,3.2,0,0,0,0x3a4048);Co(.5,3,0,0,0,0x3a4048,'z').scale.set(1,1,1);B(6,.06,2.4,0,0,-.4,0x4a5058).rotation.y=0;Sp(.3,0,.3,.4,0x1b2a38,1,.8,1.4);for(const s of[-1,1])B(.06,.5,.7,s*2.6,.3,-1.2,0x4a5058);Sp(.1,0,-.3,1,0x62e0f0);break;
 case'pradar':Sp(.35,0,0,0,0x4a5058);for(const a of[.785,2.356,3.93,5.5]){B(.08,.05,.9,Math.cos(a)*.6,0,Math.sin(a)*.6,DK,0,-a+1.57,0);rotor(Math.cos(a)*1.0,.03,Math.sin(a)*1.0,.38)}dish(0,.45,0,.28,WHT);Sp(.08,0,.2,.28,0x62e0f0);break;
 case'motion':legs(0,0,.7,.7);Cy(.14,.5,0,.85,0,GRY);Sp(.2,0,1.2,0,0x3a4048);dish(0,1.35,0,.25,STE);Sp(.05,.1,1.3,.12,RED);B(.06,.5,.06,.15,1.45,0,DK);break;
 case'cuav':B(.3,.3,1.8,0,0,0,0x4a5058);for(const s of[-1,1]){B(2.4,.04,.5,s*1.3,0,-.2,0x4a5058);Cy(.1,.5,s*2.2,0,-.2,DK,'z')}Cy(.04,.6,0,.4,0,DK);dish(0,.75,0,.55,WHT);Sp(.07,0,.78,.1,0x62e0f0);break;
 case'emp':Cy(.25,2.6,0,0,0,0x3a4048,'z');Co(.25,.8,0,0,1.7,0x3a4048,'z');for(const a of[0,1.57,3.14,4.71])B(.04,.55,.7,Math.cos(a)*.3,Math.sin(a)*.3,-1,0x3a4048,0,0,a);{const t=new THREE.Mesh(new THREE.TorusGeometry(.35,.04,8,20),em(0x62e0f0));t.position.z=.5;g.add(t);const t2=t.clone();t2.position.z=-.2;g.add(t2)}break;
 case'flak':B(1.4,.3,1.4,0,.15,0,DK);Cy(.35,.6,0,.6,0,GRY);B(.9,.5,1,0,1,0,OLV);for(const s of[-1,1]){Cy(.07,2,s*.35,1.1,1.3,DK,'z');Cy(.1,.25,s*.35,1.1,2.3,STE,'z')}B(.5,.3,.5,0,1.35,-.3,DK);Sp(.12,.4,1.2,-.5,RED);break;
 case'care':B(1.4,1,1.4,0,.5,0,0x6a5a30);for(const s of[-1,1]){B(1.42,.08,.18,0,.5,s*.4,0xd8c070);B(.18,.08,1.42,s*.4,.5,0,0xd8c070)}B(1.2,.1,1.2,0,1.02,0,0x7a6a3a);Sp(1.4,0,2.9,0,0xc8483a,1,.65,1);for(const a of[0,1.57,3.14,4.71])B(.02,1.9,.02,Math.cos(a)*.55,1.95,Math.sin(a)*.55,0x2a2a2a,Math.sin(a)*.5,0,-Math.cos(a)*.5);Sp(.14,0,1.12,0,0xe84030);break;
 case'airdrop':Cy(.7,9,0,0,0,0x7a8088,'z',.55);Co(.55,2.4,0,0,5.6,0x7a8088,'z');B(14,.18,2,0,.45,0,0x8a9098);B(6,.14,1.5,0,.3,-4.2,0x8a9098);B(.14,2,1.5,0,1.2,-4.2,0x8a9098);for(const x of[-5,-2.4,2.4,5])Cy(.38,.9,x,.25,.6,DK,'z');B(1,.8,2,0,.2,-4.6,DK);break;
 case'vests':B(1.2,.9,1.2,0,.45,0,0x2a3a2a);B(1.22,.12,1.22,0,.9,0,0x3a4a3a);B(.7,.5,.04,0,.5,.62,0x1b1b1b);Sp(.18,0,.5,.65,0x62e0f0,1,1,.2);B(.9,.06,.06,0,.9,.4,0xe8e8e0);break;
 case'ammo':B(1.3,.8,.9,0,.4,0,0x4a5030);B(1.32,.1,.92,0,.82,0,0x5a6040);B(1.34,.18,.2,0,.4,.46,0xd8c030);B(.3,.1,.1,.4,.9,0,0x2a2a2a);for(let i=0;i<4;i++)Cy(.07,.4,-.45+i*.3,.95,0,0xc8a030);break;
 case'sim':legs(0,0,.5,.8);Cy(.28,.3,0,.6,0,GRY);for(let i=0;i<4;i++){const a=i*1.57+.78;Cy(.08,.8,Math.cos(a)*.22,.95,Math.sin(a)*.22,DK).rotation.set(Math.sin(a)*.3,0,-Math.cos(a)*.3)}Sp(.07,0,.8,.28,RED);B(.4,.1,.4,0,.5,0,DK);break;
 case'dcvt':B(.7,.28,1.3,0,.28,0,0xc0392b);B(.5,.2,.6,0,.5,-.1,0x2a3a48);B(.8,.1,.35,0,.15,.55,DK);B(.8,.06,.3,0,.5,-.65,DK);for(const sx of[-1,1])for(const sz of[-1,1])wheel(sx*.42,.17,sz*.45,.2);B(.02,.6,.02,.25,.8,-.5,DK);Sp(.05,.25,1.1,-.5,RED);break;
 case'bombdrone':Sp(.25,0,0,0,0x3a4048,1,.6,1.3);for(const a of[.785,2.356,3.93,5.5]){B(.06,.04,.8,Math.cos(a)*.45,.02,Math.sin(a)*.45,DK,0,-a+1.57,0);rotor(Math.cos(a)*.8,.05,Math.sin(a)*.8,.3)}Cy(.14,.5,0,-.3,0,RED);Co(.14,.2,0,-.62,0,0x2a2a2a);Sp(.06,0,.1,.3,0x62e0f0);break;
 case'hunter':Cy(.12,1,0,0,0,0x4a5058,'z');Co(.12,.35,0,0,.65,0x4a5058,'z');for(const a of[0,1.57,3.14,4.71])B(.03,.35,.3,Math.cos(a)*.15,Math.sin(a)*.15,-.35,0x4a5058,0,0,a);Sp(.05,0,.05,.4,RED);for(const s of[-1,1])rotor(s*.22,.08,0,.14);break;
 case'sentry':legs(0,0,.9,.9);Cy(.18,.2,0,.95,0,GRY);B(.34,.3,.7,0,1.15,0,OLV);Cy(.05,.9,0,1.15,.8,DK,'z');Cy(.07,.2,0,1.15,1.25,STE,'z');B(.28,.2,.3,.28,1.05,0,0x3a3a30);Sp(.06,0,1.3,.35,RED);break;
 case'shieldt':legs(0,0,.8,1);B(.4,.35,.8,0,1.05,0,OLV);Cy(.06,1,0,1.05,.9,DK,'z');B(1.3,1.3,.1,0,1.3,1.1,0x3a4a52);B(1.1,.9,.02,0,1.3,1.16,0x1b2a38);B(.3,.2,.3,.3,.95,0,0x3a3a30);break;
 case'pal':B(1.6,.3,1.8,0,.15,0,DK);Cy(.35,.5,0,.5,0,GRY);B(1.2,.7,1.8,0,1.1,0,OLV).rotation.x=-.5;for(const sx of[-1,1])for(const sy of[0,1]){const m=Cy(.12,1.6,sx*.3,1.3+sy*.35,.4,0xd8d8d0,'z');m.rotation.x=-.5-1.57+1.57;Co(.12,.35,sx*.3,1.3+sy*.35,1.3,RED,'z')}break;
 case'guardian':legs(0,0,1.2,1.3);Cy(.12,.3,0,1.3,0,GRY);dish(0,1.75,.2,.9,0xd8d0b0);Cy(.04,.7,0,1.75,.65,DK,'z');Sp(.1,0,1.75,.9,0xff6a3a);B(.3,.3,.3,0,1.35,-.2,DK);break;
 case'groundsis':B(1.1,.4,1.8,0,.5,0,OLV);for(const s of[-1,1]){B(.3,.4,2,s*.7,.3,0,0x2a2a2a);for(let i=-3;i<=3;i++)Cy(.18,.28,s*.7,.22,i*.28,0x151515,'x')}B(.8,.35,.9,0,.85,-.1,0x5a6a42);Cy(.1,.9,0,.95,.8,DK,'z');Sp(.12,0,.95,1.3,STE);Cy(.03,.5,-.3,1.3,-.4,DK);Sp(.08,-.3,1.6,-.4,RED);break;
 case'terminator':Cy(.28,4.2,0,0,0,0xd8d8d0,'z');Co(.28,1.4,0,0,2.8,0xc0392b,'z');for(const a of[0,1.57,3.14,4.71])B(.05,.9,1.1,Math.cos(a)*.4,Math.sin(a)*.4,-1.7,0x8a9098,0,0,a);Cy(.3,.6,0,0,-2.3,0x2a2a2e,'z',.2);Cy(.2,.5,0,0,-2.7,0xff9a30,'z',.05);break;
 case'glide':Sp(.5,0,0,0,0x4a5030,1,1,2.4);Co(.35,.9,0,0,1.55,0x3a4028,'z');for(const a of[0,1.57,3.14,4.71])B(.04,.7,.8,Math.cos(a)*.5,Math.sin(a)*.5,-1.2,0x6a7058,0,0,a);B(2.4,.05,.6,0,0,-.2,0x6a7058);Cy(.3,.2,0,0,-1.5,DK,'z');Sp(.08,0,0,1.9,RED);break;
 case'knight':Cy(.18,2,0,0,0,0xd8d8d0,'z');Co(.18,.6,0,0,1.3,RED,'z');for(const a of[0,1.57,3.14,4.71])B(.04,.5,.55,Math.cos(a)*.25,Math.sin(a)*.25,-.8,0x8a9098,0,0,a);Cy(.2,.3,0,0,-1.1,DK,'z',.12);Sp(.1,0,0,-1.3,0xffb050);break;
 case'gilded':B(1.4,.18,2.4,0,0,0,0x1b1d22).scale.set(1,1,1);Co(.9,2,0,0,0,0x1b1d22,'z').scale.set(1.6,.2,1);for(const s of[-1,1])B(.05,.4,.7,s*.5,.18,-.8,0x1b1d22,0,0,s*.4);Sp(.2,0,.12,.3,0x0a0a0c,1,.7,1.8);Sp(.05,0,.1,1,0xff3a2a);for(const s of[-1,1])Cy(.06,.5,s*.5,-.1,.2,0x3a3a40,'z');break;
 case'precision':jet(1,6,0x6a7078);for(const s of[-1,1])Cy(.18,2,s*.25,-.12,-1.9,0x3a3a40,'z');Sp(.1,0,0,-3.3,0xffa040);break;
 case'mortar':B(1.2,.12,1.2,0,.06,0,DK);Cy(.14,1.6,0,.9,0,0x4a5030).rotation.x=.5;legs(0,0,.8,1.2);Cy(.1,.7,.7,.2,0,0xd8c030,'x');Co(.1,.3,.7,.2,.5,RED,'z').rotation.z=1.57;break;
 case'stealth':{const w=new THREE.Mesh(bg,mat(0x25272c));w.scale.set(12,.5,3.6);g.add(w);const a=B(12.4,.28,6,0,-.08,.6,0x1b1d22);Co(.9,2,0,0,2.4,0x25272c,'z').scale.set(1.4,.3,1);Sp(.4,0,.35,1,0x0a1018,1.2,.7,2);for(const s of[-1,1])B(2.2,.22,2.4,s*3.4,-.05,-1.8,0x1b1d22);}break;
 case'napalm':Cy(.4,2.4,0,0,0,0xd9822b,'z',.38);Sp(.4,0,0,1.2,0xd9822b,1,1,.7);Sp(.38,0,0,-1.2,0xd9822b,1,1,.5);for(const z of[-.6,.6])Cy(.41,.12,0,0,z,0x2a2a2a,'z');B(.06,.7,.6,0,.5,-1.1,0x8a4a1a);B(.7,.06,.6,0,0,-1.1,0x8a4a1a);Sp(.28,0,.5,.3,0xff5a1a,.5,.5,.5);break;
 case'dogs':dog(0x6a4a2a);break;
 case'achopper':heli(0x3a4a3a);break;
 case'gunner':heli(0x2f3a4a);B(.08,.08,1.2,1.15,0,.8,DK);Cy(.05,1.1,1.45,0,1.1,DK,'z');Sp(.15,1.2,0,.6,STE);B(.5,.4,.6,1.0,0,.4,0x3a3a40);break;
 case'dc260':Cy(.9,16,0,0,0,0x6a7078,'z',.7);Co(.7,3.4,0,0,9.6,0x6a7078,'z');B(24,.3,3.2,0,.7,.4,0x7a8088);for(const x of[-9,-4.2,4.2,9])Cy(.42,1.6,x,.2,.8,DK,'z');B(.3,3,2,0,1.7,-7.2,0x6a7078);B(7,.24,1.6,0,.5,-7.2,0x6a7078);Cy(.22,3.2,-1.05,-.5,2,0x2a2a2e,'z');Cy(.14,2.4,-1.05,-.5,4.4,0x2a2a2e,'z');Cy(.09,1.6,-1.05,-.5,-1,0x2a2a2e,'z');B(1.8,.7,3,-1,-.4,.2,DK);break;
 case'overwatch':heli(0x25282d,true);for(const s of[-1,1]){Cy(.12,1.8,s*1.2,-.2,.6,DK,'z');Co(.12,.4,s*1.2,-.2,1.6,RED,'z')}B(1.7,1.1,.15,0,.1,1.9,0x2a3038);break;
 case'tolv':jet(1.3,7,0x5a6068);for(const s of[-1,1]){Cy(.55,1.3,s*2.2,.1,.4,DK);Cy(.42,.08,s*2.2,.76,.4,0x151515)}for(const z of[-.8,.4])Cy(.16,1.2,0,-.25,z,RED);Sp(.1,0,.1,-3.7,0xffa040);break;
 case'cube':B(8,5,8,0,0,0,0x3a3e44);B(8.4,.4,8.4,0,2.6,0,0x2a2d32);B(8.4,.4,8.4,0,-2.6,0,0x2a2d32);for(const x of[-3.4,3.4])for(const z of[-3.4,3.4])Cy(.8,3.4,x,-3.8,z,0x25282d,'y');for(let i=0;i<4;i++){B(8.1,.14,.5,0,-1.6+i*1.2,4.1,0x1b2a38);B(.5,.14,8.1,4.1,-1.6+i*1.2,0,0x1b2a38)}Sp(.9,0,-3,0,0x4a5058);Cy(.14,2.4,0,-3,1.4,DK,'z');Cy(.14,2.4,.3,-3,1.4,DK,'z');break;
 case'jugg':B(.8,1.1,.5,0,1.6,0,0x2a2e32);B(.34,.34,.34,0,2.35,0,0x1b1d22);B(.5,.1,.4,0,2.5,0,0x3a3e44);for(const s of[-1,1]){B(.34,1.1,.38,s*.28,.55,0,0x3a3e44);B(.3,.9,.3,s*.7,1.7,.1,0x2a2e32);B(.4,.4,.4,s*.65,2.15,0,0x3a3e44)}Cy(.1,1.3,.5,1.3,.8,DK,'z');for(let i=0;i<3;i++)Cy(.04,1.2,.5+(i-1)*.07,1.3,.9,STE,'z');B(.8,.12,.6,0,2.05,0,0x4a4e54);break;
 case'goliath':for(const s of[-1,1]){B(.7,1.6,.8,s*.8,.8,0,0x4a5058);B(.9,.3,1.3,s*.8,.15,.2,0x3a3e44);B(.5,.8,.5,s*.8,1.9,0,0x5a6068)}B(2.2,1.5,1.4,0,2.9,0,0x4a5058);B(1.2,.8,1,0,3.9,.1,0x3a3e44);Sp(.3,0,3.95,.55,0x62e0f0,1.2,.5,.3);for(const s of[-1,1]){B(.7,.7,.8,s*1.6,3,0,0x5a6068);Cy(.14,1.6,s*1.7,2.8,.9,DK,'z');for(let i=0;i<3;i++)Cy(.05,1.2,s*1.7+(i-1)*.1,2.9,1.2,STE,'z')}B(1.4,.6,.5,0,3.3,-.9,DK);break;
 case'para':soldier(0x4a5a38);Sp(1.4,0,3.9,0,0x4a5a38,1,.6,1);for(const a of[0,1.57,3.14,4.71])B(.02,2.1,.02,Math.cos(a)*.7,2.8,Math.sin(a)*.7,0x2a2a2a,Math.sin(a)*.3,0,-Math.cos(a)*.3);break;
 case'guarddog':dog(0x3a3a3e);break;
 case'fear':Cy(.12,.5,0,0,-.2,DK,'z');for(let i=0;i<6;i++){const a=i*1.047;Cy(.028,1.4,Math.cos(a)*.09,Math.sin(a)*.09,.7,STE,'z')}Cy(.14,.14,0,0,1.4,GRY,'z');Cy(.14,.14,0,0,.5,GRY,'z');B(.2,.3,.4,0,-.25,.1,DK);B(.1,.3,.1,0,-.35,.1,BLK);B(.4,.3,.3,.25,-.1,.3,OLV);break;
 case'boom':Cy(.1,1,0,0,.2,0x4a5030,'z');Cy(.2,.45,0,0,.4,GRY,'z');B(.1,.5,.14,0,-.3,.1,DK);B(.4,.1,.1,0,-.1,-.4,DK);B(.1,.2,.5,0,.2,-.7,DK);Cy(.09,.14,0,0,.75,ORG,'z');Sp(.04,0,.14,.1,RED);break;
 case'flame':Cy(.08,1.4,0,0,.2,GRY,'z');Cy(.1,.18,0,0,.95,DK,'z');Co(.05,.14,0,0,1.0,ORG,'z');B(.1,.3,.1,0,-.2,.1,DK);Cy(.28,.9,0,.1,-.8,0xb8b8b0,'y');Cy(.29,.05,0,.6,-.8,RED);Cy(.12,.1,0,.65,-.8,DK);Cy(.02,1,0,.4,-.35,DK,'z');break;
 case'satellite':B(1.2,1.2,2,0,0,0,0xc8b060);B(7,.05,1.6,0,0,0,0x1a2a6a);B(.2,.2,.2,0,0,0,DK);for(const s of[-1,1])for(let i=0;i<6;i++)B(1,.06,1.5,s*(1.2+i*1.05),0,0,0x2a3a8a);dish(0,.9,.4,.6,WHT);Cy(.03,1.2,0,.9,.4,DK);Sp(.12,0,1.6,.4,0x62e0f0);Cy(.12,1.2,0,-.2,1.5,0x6a7078,'z');break;
 case'annihil':Cy(.9,3,0,0,0,0x3a3e44,'z');Cy(1.3,.5,0,0,1.8,0x2a2d32,'z',1.3);{const t=new THREE.Mesh(new THREE.TorusGeometry(1.1,.12,10,28),em(0x62e0f0));t.position.z=1.1;g.add(t);const t2=t.clone();t2.position.z=-.6;g.add(t2)}Cy(.45,.4,0,0,2.2,0x62e0f0,'z',.1);Cy(.5,.6,0,0,-1.7,0x3a3e44,'z');for(const s of[-1,1])B(5,.06,1.4,s*3.6,0,-.4,0x1a2a6a);break;
 case'nuke':Sp(.8,0,0,0,0x3a3e3a,1,1,2.6);Co(.8,1.5,0,0,2.6,0x2a2d2a,'z');for(const a of[0,1.57,3.14,4.71])B(.05,1.2,1.4,Math.cos(a)*.85,Math.sin(a)*.85,-1.9,0x6a6e6a,0,0,a);Cy(.84,.5,0,0,.3,0xd8c030,'z');Cy(.84,.4,0,0,.9,BLK,'z');Sp(.3,0,.86,.3,0xd8c030,1,1,.1);Cy(.4,.5,0,0,-2.7,DK,'z',.3);break;
 default:B(1,1,1,0,.5,0,GRY)}
 return g}
;
/* ######## sk_core.js ######## */
/* ===================== sk_core.js ===================== */
/* ---------- killstreak engine ----------
   SK.objs: things you placed or called in (turrets, drones, crates, helicopters ...). Every object can have hp: enemy bots with a line of sight shoot it down, an EMP disables it.
   SK.rc: remote control / gunner mode: the camera moves to the vehicle or gun, the player body stands still. SK.ea: enemy air support, the target of Flak Guns, PAL turrets, EMP and your gunships.
   Kills made by killstreaks never feed the killstreak counter. In private matches the streaks are local to the player who earned them. */
const SK={got:{},objs:[],q:[],t:0,uavT:0,advT:0,prT:0,cuavT:0,empT:0,flakT:0,rc:null,suit:null,ping:[],pingT:0,ea:[],eaT:70,nok:0,fp:0,trp:0,air:[],bombs:[],fires:[],lines:[],marks:[],heavyBack:null};
const foes=()=>bots.filter(b=>b.al&&!ally(b)&&!b.out);
function skGnd(x,z){let h=0;for(const b of bx)if((b.y0||0)<.4&&b.h<4&&x>b.x0&&x<b.x1&&z>b.z0&&z<b.z1&&b.h>h)h=b.h;return h}
function skSpot(maxd){maxd=maxd||7;const o=C.position.clone(),d=aimDir(),t=Math.max(1.2,Math.min(maxd,castW(o,d,maxd)-.5)),x=o.x+d.x*t,z=o.z+d.z*t;return V(x,skGnd(x,z),z)}
function skAimPoint(maxd){const o=C.position.clone(),d=aimDir(),t=Math.min(maxd||90,castW(o,d,maxd||90));return o.add(d.multiplyScalar(t))}
/* damage helpers: streak damage is credited to the player and never touches the player */
function skHurt(b,d,name){src=name;srcK='';SK.nok=1;try{hitBot(b,d,0)}catch(e){}SK.nok=0}
function skBlast(p,R,d,name,quiet){src=name;srcK='';SK.nok=1;try{if(quiet){for(const b of foes()){const D=Math.hypot(b.x-p.x,(b.y||0)+1-p.y,b.z-p.z);if(D<R)hitBot(b,d*(1-.5*D/R),0)}burst(p,7,0xffa040,5,.4,.2)}else boom(p,{R,d,own:1,c:0xff8a30})}catch(e){}SK.nok=0;skHitEA(p,R+2,d)}
function skLine(a,b,col,life){const g=new THREE.BufferGeometry().setFromPoints([a,b]),l=new THREE.Line(g,new THREE.LineBasicMaterial({color:col||0xffe080}));S.add(l);SK.lines.push({l,t:life||.07})}
/* objects */
function skAdd(o){o.m.position.set(o.x,o.y,o.z);S.add(o.m);o.t=o.life||60;SK.objs.push(o);return o}
function skRemove(o,boomFx){const i=SK.objs.indexOf(o);if(i>=0)SK.objs.splice(i,1);S.remove(o.m);if(o.end)try{o.end(o)}catch(e){}if(boomFx){burst(V(o.x,o.y+.5,o.z),26,0xff9a30,7,.8,.3);burst(V(o.x,o.y+.5,o.z),14,0x333333,3,1,.5);noise(.4,500,.2)}}
/* bots shoot streak assets they can see */
function skBotsAttack(o,dt){if(!o.hp||o.inv||SK.empT>0&&o.elec)return;let dmg=0;for(const b of foes()){if(b.stun>0)continue;const d=Math.hypot(b.x-o.x,b.z-o.z);if(d>(o.air?26:30)||!navLos(b.x,b.z,o.x,o.z))continue;let f=1;if(o.shield){const a=Math.atan2(b.x-o.x,b.z-o.z),df=Math.abs(((a-o.face+Math.PI*3)%(Math.PI*2))-Math.PI);f=df>2.3?.12:1}dmg+=(o.air?1.1:3.2)*f}
 if(dmg){o.hp-=dmg*dt;if(o.hp<=0){feed('Enemy destroyed your '+(o.n||'streak'));skRemove(o,true)}}}
/* enemy air support: a hostile helicopter now and then. Flak Guns stop new ones, EMP / PAL / gunships / rockets bring them down. */
function skEnemyAir(){const m=skModel('achopper');m.scale.setScalar(.8);m.traverse(e=>{if(e.material&&e.material.color)e.material=e.material.clone(),e.material.color.multiplyScalar(.7).add(new THREE.Color(.25,0,0))});const a=Math.random()*6.28;const e={m,x:Math.cos(a)*40,y:17,z:Math.sin(a)*40,hp:650,mhp:650,ang:a,t:60,cd:1};m.position.set(e.x,e.y,e.z);S.add(m);SK.ea.push(e);msg('Enemy chopper inbound',2);beep(180,.4,'sawtooth',.08)}
function skHitEA(p,R,d){for(let i=SK.ea.length-1;i>=0;i--){const e=SK.ea[i];if(Math.hypot(e.x-p.x,e.y-p.y,e.z-p.z)<R+2){e.hp-=d*(SK.nok?1.5:1);if(e.hp<=0)skEaDie(e)}}}
function skEaDie(e){const i=SK.ea.indexOf(e);if(i<0)return;SK.ea.splice(i,1);S.remove(e.m);burst(V(e.x,e.y,e.z),40,0xff9a30,9,1,.4);noise(.6,300,.25);feed('You ▸ Enemy chopper destroyed');if(typeof popup=='function')popup('CHOPPER DOWN','+300')}
function skEaTick(dt){if(!run||mode=='Zombies')return;SK.eaT-=dt;if(SK.eaT<=0){SK.eaT=75+Math.random()*50;if(SK.flakT<=0&&SK.ea.length<1&&foes().length>2)skEnemyAir()}
 for(let i=SK.ea.length-1;i>=0;i--){const e=SK.ea[i];e.t-=dt;if(SK.empT>0){e.hp-=400*dt}if(e.hp<=0){skEaDie(e);continue}if(e.t<=0||SK.flakT>0&&Math.random()<dt*.35){S.remove(e.m);SK.ea.splice(i,1);continue}
  e.ang+=dt*.35;e.x+=(P.x+Math.cos(e.ang)*26-e.x)*Math.min(1,dt*.6);e.z+=(P.z+Math.sin(e.ang)*26-e.z)*Math.min(1,dt*.6);e.y=17+Math.sin(SK.t*.8)*1.2;e.m.position.set(e.x,e.y,e.z);e.m.rotation.y=Math.atan2(P.x-e.x,P.z-e.z);
  e.cd-=dt;if(e.cd<=0&&!P.dead&&Math.hypot(P.x-e.x,P.z-e.z)<44&&navLos(e.x,e.z,P.x,P.z)){e.cd=.7;skLine(V(e.x,e.y-.6,e.z),V(P.x+(Math.random()-.5)*2,1.2,P.z+(Math.random()-.5)*2),0xff6a40,.08);if(Math.random()<.55)hurt(7)}}}
/* the player's own bullets hit enemy air as well */
function skShotAir(){if(!SK.ea.length)return;const o=C.position.clone(),d=aimDir(),w=cw();for(const e of SK.ea){const v=V(e.x-o.x,e.y-o.y,e.z-o.z),t=v.dot(d);if(t<2||t>90)continue;const off=v.clone().sub(d.clone().multiplyScalar(t)).length();if(off<2.4&&castW(o,d,t)>=t-.5){{const hitP=o.clone().add(d.clone().multiplyScalar(Math.max(2,t-1.5)));e.hp-=(w?w.d:20)*.7*skMul(w)*.28;burst(hitP,3,0xffe0a0,5,.2,.05);beep(1900+Math.random()*900,.03,'square',.03);e.fl=.1;if(e.hp<=0)skEaDie(e)}}}}
/* ---------- radar types ---------- */
function skRadar(dot,pt,c){for(const b of bots){if(!b.al)continue;if(ally(b)){dot(b.x,b.z,'#62e0f0',3);continue}if(b.out)continue;const d=Math.hypot(b.x-P.x,b.z-P.z);let show=d<28;
  if(SK.advT>0)show=true;else if(SK.prT>0&&d<46)show=true;if(!show&&(b.mvs||0)>1.2)show=SK.objs.some(o=>o.id=='motion'&&Math.hypot(b.x-o.x,b.z-o.z)<o.r);
  if(show){dot(b.x,b.z,'#ff5a3a',3);if(SK.advT>0){const p=pt(b.x,b.z),a=b.m?b.m.rotation.y:0,q=pt(b.x+Math.sin(a)*5,b.z+Math.cos(a)*5);if(p&&q&&Math.hypot(p[0]-75,p[1]-75)<70){c.strokeStyle='#ff9a7a';c.lineWidth=1.5;c.beginPath();c.moveTo(p[0],p[1]);c.lineTo(q[0],q[1]);c.stroke()}}}}
 if(SK.uavT>0&&SK.advT<=0){for(const p of SK.ping){const age=SK.t-p.t,a=Math.max(0,1-age/4.2);if(a<=0)continue;c.globalAlpha=a;dot(p.x,p.z,'#ff5a3a',3);c.globalAlpha=1}}
 if(SK.cuavT>0&&!P.dead){}}
/* ---------- remote control / gunner camera ---------- */
function rcStart(r){if(SK.rc)return false;r.t=r.t||25;r.hy=yaw;r.hp=pitch;r.fireT=0;if(r.m&&r.id=='dcvt')S.add(r.m);SK.rc=r;SK.trp=trig;msg(r.hint||'Remote control',2.5);if(typeof haptic=='function')haptic(.3,100,.4,'both');return true}
function rcEnd(why){const r=SK.rc;if(!r)return;SK.rc=null;if(r.m)S.remove(r.m);if(r.end)try{r.end(r)}catch(e){}gun.visible=true;C.rotation.order='YXZ';const e=$('#rcv');if(e)e.style.display='none';if(why)msg(why,1.5)}
function rcTick(dt){const r=SK.rc;if(!r)return;if(P.dead||SK.empT>0&&r.elec){rcEnd(P.dead?'':'Signal lost');return}r.t-=dt;const edge=trig&&!SK.trp;SK.trp=trig;
 /* heading follows where the player looks, limited by the turn rate */
 if(r.turn){const dy=Math.atan2(Math.sin(yaw-r.hy),Math.cos(yaw-r.hy)),dp=cl(pitch+(r.bias||0),-1.5,1.2)-r.hp,mx=r.turn*dt;r.hy+=cl(dy,-mx,mx);r.hp+=cl(dp,-mx,mx)}else{r.hy=yaw;r.hp=pitch}
 try{r.tick(r,dt,edge)}catch(e){rcEnd('Link lost')}if(!SK.rc)return;if(r.t<=0){if(r.expire)r.expire(r);if(SK.rc===r)rcEnd('Out of time')}
 const e=$('#rcv');if(e){e.style.display='block';e.innerHTML=`<b>${r.n||'REMOTE'}</b> <span>${Math.max(0,Math.ceil(r.t))}s</span><small>${r.hint||''}</small>`}}
function skCam(){const r=SK.rc;if(!r)return;gun.visible=false;if(r.m){r.m.position.set(r.x,r.y,r.z);r.m.rotation.set(-r.hp*.6,r.hy+Math.PI,0)}
 const cp=r.cam?r.cam(r):V(r.x,r.y,r.z);C.position.copy(cp);C.rotation.order='YXZ';C.rotation.set(r.camPitch!=null?r.camPitch:r.hp,r.hy,0)}
/* ---------- tick ---------- */
function skTick(dt){SK.t+=dt;for(const k of['uavT','advT','prT','cuavT','empT','flakT'])if(SK[k]>0)SK[k]-=dt;
 if(SK.uavT>0&&SK.advT<=0){SK.pingT-=dt;if(SK.pingT<=0){SK.pingT=4;SK.ping=foes().map(b=>({x:b.x,z:b.z,t:SK.t}))}}
 for(const b of bots){if(!b.al)continue;b.mvs=Math.hypot(b.x-(b._lx==null?b.x:b._lx),b.z-(b._lz==null?b.z:b._lz))/Math.max(dt,.001);b._lx=b.x;b._lz=b.z}
 if(SK.cuavT>0){SK.cj=(SK.cj||0)-dt;if(SK.cj<=0){SK.cj=.45;for(const b of foes())b.cd=Math.max(b.cd||0,.4)}}
 if(SK.empT>0){SK.ej=(SK.ej||0)-dt;if(SK.ej<=0){SK.ej=.3;for(const b of foes())b.stun=Math.max(b.stun||0,.6)}}
 for(let i=SK.objs.length-1;i>=0;i--){const o=SK.objs[i];if(!o)continue;o.t-=dt;if(o.t<=0){skRemove(o,false);continue}if(!(SK.empT>0&&o.elec))try{if(o.tick)o.tick(o,dt)}catch(e){skRemove(o,false);continue}if(o.m)o.m.position.set(o.x,o.y,o.z);skBotsAttack(o,dt)}
 for(let i=SK.lines.length-1;i>=0;i--){const l=SK.lines[i];l.t-=dt;if(l.t<=0){S.remove(l.l);l.l.geometry.dispose();SK.lines.splice(i,1)}}
 skEaTick(dt);rcTick(dt);if(typeof skAirTick=='function')skAirTick(dt);skTickSuit(dt)}
function skTickSuit(dt){const s=SK.suit;if(!s)return;s.t-=dt;if(s.t<=0||P.dead)skEndSuit(P.dead?'':'Suit powered down')}
function skEndSuit(why){const s=SK.suit;if(!s)return;SK.suit=null;P.mhp=s.mhp;P.msh=s.msh;P.hp=Math.min(P.hp,P.mhp);P.sh=Math.min(P.sh,P.msh);if(s.wk)skDropHeavy(s.wk);if(why)msg(why,1.5)}
function skReset(){for(const o of SK.objs.slice())skRemove(o,false);for(const e of SK.ea)S.remove(e.m);SK.ea=[];rcEnd();for(const l of SK.lines)S.remove(l.l);SK.lines=[];if(typeof skAirClear=='function')skAirClear();SK.suit=null;SK.uavT=SK.advT=SK.prT=SK.cuavT=SK.empT=SK.flakT=0;SK.ping=[];SK.eaT=70;SK.q=[];SK.got={};gun.visible=true}
/* hooks */
{const _ft=featTick;featTick=function(dt){_ft.apply(this,arguments);if(mode!='Zombies')skTick(dt)}}
{const _fr=featReset;featReset=function(){_fr.apply(this,arguments);skReset()}}
{const _gt=gfxTick;gfxTick=function(dt){_gt.apply(this,arguments);skCam()}}
{const _mc=moveCalc;moveCalc=function(){const r=_mc.apply(this,arguments);if(SK.rc)return{f:0,s:0,spt:false,spd:0};if(SK.suit)r.spd*=SK.suit.sp;return r}}
{const _sh=shoot;shoot=function(){if(SK.rc)return;_sh.apply(this,arguments);skShotAir()}}
{const _d=die;die=function(){const was=P.dead;_d.apply(this,arguments);if(!was){rcEnd();skEndSuit('');SK.got={}}}}
{const _b=boom;boom=function(p,g){_b.apply(this,arguments);if(!g||!g.tac)skHitEA(p,(g&&g.R)||4,((g&&g.d)||100)*(g&&g.w=='RL'?3.5:g&&g.w=='RG'?3:1))}}
{const _fk=featKill;featKill=function(b,h){if(SK.nok)ks--;_fk.apply(this,arguments)}}
{const _sw=swap;swap=function(){if(SK.rc)return;_sw.apply(this,arguments)}}
;
/* ######## sk_use.js ######## */
/* ===================== sk_use.js ===================== */
/* ---------- what each killstreak does when you use it ---------- */
const rndI=n=>Math.random()*n|0,rndP=a=>a[rndI(a.length)];
const skNear=(o,max)=>{let b0=null,bd=max||1e9;for(const b of foes()){const d=Math.hypot(b.x-o.x,b.z-o.z);if(d<bd){bd=d;b0=b}}return b0};
const skNearLos=(o,max,h)=>{let b0=null,bd=max||1e9;for(const b of foes()){const d=Math.hypot(b.x-o.x,b.z-o.z);if(d<bd&&navLos(o.x,o.z,b.x,b.z)){bd=d;b0=b}}return b0};
function skM(id,sc,rot){const m=skModel(id);m.scale.setScalar(sc||1);return m}
/* ---------- aircraft that fly a line across the map and drop bombs ---------- */
function skFly(o){const c=skAimPoint(80),f=V(-Math.sin(yaw),0,-Math.cos(yaw)),L=H*1.3,len=2*L,n=o.n||1,px=-f.z,pz=f.x;
 for(let i=0;i<n;i++){const off=(i-(n-1)/2)*(o.gap||0),back=(i%2?7:0),sx=c.x-f.x*(L+back)+px*off,sz=c.z-f.z*(L+back)+pz*off,m=skM(o.model,o.sc||1);m.position.set(sx,o.alt,sz);m.rotation.y=Math.atan2(f.x,f.z);S.add(m);SK.air.push({m,x:sx,z:sz,ox:sx,oz:sz,fx:f.x,fz:f.z,run:0,len,acc:0,o,px,pz})}
 const lg=new THREE.BufferGeometry().setFromPoints([V(c.x-f.x*L,.3,c.z-f.z*L),V(c.x+f.x*L,.3,c.z+f.z*L)]),ln=new THREE.Line(lg,new THREE.LineBasicMaterial({color:0xff4a2a}));S.add(ln);SK.marks.push({m:ln,t:2.6});noise(1.6,260,.22);beep(200,.5,'sawtooth',.08)}
function skBombFall(x,z,o,fx,fz){const m=skM('napalm',.4);if(!o.nap)m.traverse(e=>{});m.position.set(x,o.alt-2,z);m.rotation.x=1.2;S.add(m);SK.bombs.push({m,x,z,y:o.alt-2,vy:0,vx:fx*30*.4,vz:fz*30*.4,o})}
function skAirTick(dt){
 for(let i=SK.marks.length-1;i>=0;i--){const k=SK.marks[i];k.t-=dt;if(k.t<=0){S.remove(k.m);SK.marks.splice(i,1)}}
 for(let i=SK.air.length-1;i>=0;i--){const p=SK.air[i],o=p.o;p.run+=o.spd*dt;p.x=p.ox+p.fx*p.run;p.z=p.oz+p.fz*p.run;p.m.position.set(p.x,o.alt+Math.sin(SK.t*2+i)*.1,p.z);
  p.dr=(p.dr||0)-dt;if(p.dr<=0){p.dr=.6;const dd=Math.hypot(p.x-C.position.x,p.z-C.position.z);beep(70+Math.max(0,40-dd*.5),.55,'sawtooth',Math.max(.01,.07*(1-dd/150)))}
  if(Math.abs(p.x)<H+2&&Math.abs(p.z)<H+2){p.acc+=dt;while(p.acc>=o.iv){p.acc-=o.iv;const sd=(Math.random()-.5)*(o.spread||4);skBombFall(p.x+p.px*sd,p.z+p.pz*sd,o,p.fx,p.fz)}}
  if(p.run>p.len){S.remove(p.m);SK.air.splice(i,1);if(p.o.after&&!SK.air.some(q=>q.o===p.o))p.o.after()}}
 for(let i=SK.bombs.length-1;i>=0;i--){const b=SK.bombs[i];b.vy-=24*dt;b.y+=b.vy*dt;b.x+=b.vx*dt;b.z+=b.vz*dt;b.vx*=Math.exp(-.8*dt);b.vz*=Math.exp(-.8*dt);b.m.position.set(b.x,b.y,b.z);b.m.rotation.x=Math.min(1.5,b.m.rotation.x+dt*1.1);
  if(b.y<=skGnd(b.x,b.z)+.4){S.remove(b.m);SK.bombs.splice(i,1);const p=V(cl(b.x,-H+1,H-1),.3,cl(b.z,-H+1,H-1)),o=b.o;if(o.nap){skFire(p.x,p.z,o.fr||4.5,11);skBlast(p,3,40,o.name)}else skBlast(p,o.R,o.d,o.name)}}
 for(let i=SK.fires.length-1;i>=0;i--){const f=SK.fires[i];f.t-=dt;f.tk-=dt;for(const c of f.m.children)c.scale.y=.7+Math.random()*.9;if(f.tk<=0){f.tk=.25;for(const b of foes())if(Math.hypot(b.x-f.x,b.z-f.z)<f.r)skHurt(b,8,'Napalm Strike')}if(f.t<=0){S.remove(f.m);SK.fires.splice(i,1)}}
 for(let i=SK.shells.length-1;i>=0;i--){const s=SK.shells[i];s.d-=dt;if(s.m){s.m.position.y=Math.max(.3,s.y0*Math.max(0,s.d/s.D));if(s.d<s.D*.7&&!s.w){s.w=1;beep(900,.9,'sine',.04)}}if(s.d<=0){if(s.m)S.remove(s.m);if(s.ring)S.remove(s.ring);SK.shells.splice(i,1);skBlast(V(s.x,.3,s.z),s.R,s.dmg,s.name,s.quiet)}}}
function skAirClear(){for(const p of SK.air)S.remove(p.m);SK.air=[];for(const b of SK.bombs)S.remove(b.m);SK.bombs=[];for(const f of SK.fires)S.remove(f.m);SK.fires=[];for(const s of SK.shells){if(s.m)S.remove(s.m);if(s.ring)S.remove(s.ring)}SK.shells=[];for(const k of SK.marks)S.remove(k.m);SK.marks=[]}
SK.shells=[];
function skFire(x,z,r,t){const g=new THREE.Group();for(let i=0;i<9;i++){const a=Math.random()*6.28,d=Math.random()*r*.85,c=new THREE.Mesh(new THREE.ConeGeometry(.5+Math.random()*.5,1.6,6),new THREE.MeshBasicMaterial({color:i%3?0xff6a20:0xffc040}));c.position.set(Math.cos(a)*d,.6,Math.sin(a)*d);g.add(c)}g.position.set(x,skGnd(x,z),z);S.add(g);SK.fires.push({m:g,x,z,r,t,tk:0})}
function skShell(x,z,R,dmg,name,delay,quiet,fall){const s={x,z,R,dmg,name,d:delay,D:delay,quiet,y0:55};if(fall){const m=skM('mortar',.18);m.position.set(x,55,z);m.rotation.x=Math.PI;S.add(m);s.m=m}const r=new THREE.Mesh(new THREE.RingGeometry(R*.85,R,28),new THREE.MeshBasicMaterial({color:0xff3a2a,transparent:true,opacity:.6,side:THREE.DoubleSide,depthWrite:false}));r.rotation.x=-Math.PI/2;r.position.set(x,skGnd(x,z)+.08,z);S.add(r);s.ring=r;SK.shells.push(s)}
/* ---------- units that walk (dogs, paratroopers, rover) ---------- */
function skUnit(o){o.unit=1;return skAdd(o)}
function skDog(id,n,life,hp,sc){const p=skSpot(3);const a=Math.random()*6.28;return skUnit({id,n,m:skM(id=='guarddog'?'guarddog':'dogs',sc||1),x:p.x+Math.cos(a)*1.5,y:0,z:p.z+Math.sin(a)*1.5,hp,life,cd:0,tick(o,dt){const t=skNear(o,id=='guarddog'?14:60);const tx=t?t.x:P.x+Math.cos(SK.t*.4+o.x)*2.5,tz=t?t.z:P.z+Math.sin(SK.t*.4+o.x)*2.5;navMove(o,dt,tx,tz,t?10:7.5,null);o.m.rotation.y=o.mva||0;o.y=skGnd(o.x,o.z);o.cd-=dt;if(t&&Math.hypot(t.x-o.x,t.z-o.z)<1.7&&o.cd<=0){o.cd=.6;skHurt(t,48,o.n);beep(300,.1,'sawtooth',.06)}}})}
/* ---------- helicopters / VTOL that shoot ---------- */
function skHeli(o){const base={air:1,elec:1,cd:0,ang:Math.random()*6.28,iv:.35,dmg:14,rng:46,hp:400,life:50,y:14,orbit:20,spd:.35,follow:0};o=Object.assign(base,o);o.hp=Math.round(o.hp*2.4);o.mhp=o.hp;o.x=o.x==null?P.x+20:o.x;o.z=o.z==null?P.z:o.z;o.m=skM(o.model,o.sc||1);o.tick=(o,dt)=>{o.ang+=dt*o.spd;const cx=o.follow?P.x:0,cz=o.follow?P.z:0,R=o.follow?o.orbit:Math.min(o.orbit,H*.55);const tx=cx+Math.cos(o.ang)*R,tz=cz+Math.sin(o.ang)*R;o.x+=(tx-o.x)*Math.min(1,dt*1.2);o.z+=(tz-o.z)*Math.min(1,dt*1.2);o.y=o.hy||o.y;const t=skNearLos(o,o.rng);
  o.m.rotation.y=t?Math.atan2(t.x-o.x,t.z-o.z):Math.atan2(-Math.sin(o.ang),Math.cos(o.ang))+0;o.cd-=dt;if(o.cd<=0){const ea=SK.ea.find(e=>Math.hypot(e.x-o.x,e.z-o.z)<60);if(ea){o.cd=o.iv;skLine(V(o.x,o.y-.5,o.z),V(ea.x,ea.y,ea.z),0xffd070,.08);ea.hp-=o.dmg*1.2;if(ea.hp<=0)skEaDie(ea)}else if(t){o.cd=o.iv;skLine(V(o.x,o.y-.5,o.z),V(t.x,1.2,t.z),0xffd070,.08);if(Math.random()<.85)skHurt(t,o.dmg,o.n)}}};return skAdd(o)}
/* ---------- care packages and supply crates ---------- */
function skReward(){const r=Math.random();if(r<.55){const pool=STKL.filter(s=>!['nuke','care','airdrop','satellite','annihil','dc260','cube','goliath','emp'].includes(s.id)&&s.k<=12);const s=rndP(pool);q.push(s.id);msg('Care Package: '+s.n+' (press '+(2+q.length)+')',2.5)}else if(r<.85){skGiveHeavy(rndP(['MNG','GL','FT']))}else{skAmmo();msg('Care Package: ammo and armor',2)}}
function skAmmo(){for(const w of wp){if(w.heavy)continue;w.mag=w.m;w.res=w.m*(w.rs==null?4:w.rs)}gc=Math.max(gc,3);ST.tN=Math.max(ST.tN,2);beep(600,.15,'triangle',.07)}
function skCrate(x,z,type,fall){const m=skM(type=='vests'?'vests':type=='ammo'?'ammo':'care',type=='care'?.9:1);const o={id:'crate',n:'crate',type,m,x,z,y:fall?48:skGnd(x,z),life:100,landed:!fall,sm:0,tick(o,dt){if(!o.landed){o.y-=7*dt;const g=skGnd(o.x,o.z);if(o.y<=g){o.y=g;o.landed=true;m.children.forEach(c=>{if(c.position.y>2.2)c.visible=false});burst(V(o.x,g+.6,o.z),16,0xcccccc,4,.8,.5);noise(.3,200,.15)}return}
   o.sm-=dt;if(o.sm<=0){o.sm=.5;burst(V(o.x,o.y+1.2,o.z),2,type=='care'?0xffd040:0x80e0a0,2,1.4,.5)}
   if(!P.dead&&Math.hypot(P.x-o.x,P.z-o.z)<2.5){if(!o.hint){o.hint=1;msg('Press F to open',1.2)}if(key.KeyF&&!SK.fp){SK.fp=1;if(type=='care')skReward();else if(type=='vests'){P.msh+=50;P.sh=P.msh;msg('Ballistic vest: +50 armor',2)}else{skAmmo();msg('Ammo resupplied',1.6)}skRemove(o,false)}}else o.hint=0}};return skAdd(o)}
/* ---------- heavy weapons ---------- */
W.MNG={n:'Fear Machine',d:15,r:.04,m:200,sp:.035,rc:.45,pel:1,au:1,rl:6,len:.85,col:0x4a4f55};W.GL={n:'Boom Machine',d:120,r:.55,m:12,sp:.01,rc:1.2,pel:1,au:0,rl:3.2,len:.8,col:0x4a5030};W.FT={n:'Flamethrower',d:9,r:.045,m:160,sp:.1,rc:.2,pel:1,au:1,rl:5,len:.7,col:0xd9822b};
WG.MNG=[.85,0x4a4f55,1,0xffa040];WG.GL=[.8,0x4a5030,1,0xffa040];WG.FT=[.7,0xd9822b,1,0xff7a30];RLK.MNG=RLK.GL=RLK.FT='mag';
MODELS.MNG=function(g,rm){const k=gunKit(g,rm),M=k.M,body=rm||M(0x4a4f55),dk=M(0x1b1d21),st=M(0x9aa0a8);k.box(.12,.14,.4,0,0,.1,body);k.cyl(.07,.2,0,0,.4,dk);for(let i=0;i<6;i++){const a=i*1.047;k.cyl(.02,.62,Math.cos(a)*.045,Math.sin(a)*.045,.75,st)}k.cyl(.07,.04,0,0,1.06,dk);k.cyl(.07,.04,0,0,.55,dk);k.box(.1,.2,.1,0,-.17,.0,dk,.3);k.box(.06,.12,.08,0,-.12,.34,dk);k.box(.14,.18,.2,.1,-.05,.0,M(0x4a5030));k.box(.04,.1,.04,0,.1,.0,dk);k.box(.04,.04,.5,0,.1,.3,dk);g.userData.a={r:[0,-.14,0],l:[0,-.08,.34],m:[0,-.05,.0]};g.userData.mags=[];return g};
MODELS.GL=function(g,rm){const k=gunKit(g,rm),M=k.M,body=rm||M(0x4a5030),dk=M(0x1b1d21),st=M(0x9aa0a8);k.cyl(.07,.7,0,.02,.45,body);k.cyl(.085,.34,0,.02,.25,dk);k.cyl(.075,.05,0,.02,.82,dk);k.box(.07,.1,.34,0,-.02,.0,dk);k.box(.04,.14,.05,0,-.1,-.02,dk,.3);k.box(.03,.1,.03,0,-.1,.5,dk);k.box(.04,.04,.4,0,.1,.25,dk);k.cyl(.02,.04,0,.14,.55,st);k.box(.05,.05,.3,0,-.06,-.25,body);k.box(.05,.12,.04,0,-.06,-.42,dk);g.userData.a={r:[0,-.12,-.0],l:[0,-.05,.5],m:[0,-.02,.25]};g.userData.mags=[];return g};
MODELS.FT=function(g,rm){const k=gunKit(g,rm),M=k.M,body=rm||M(0xd9822b),dk=M(0x1b1d21),st=M(0x9aa0a8);k.cyl(.035,.9,0,.04,.5,st);k.cyl(.05,.2,0,.04,.15,dk);k.box(.07,.12,.3,0,0,0,body);k.cyl(.045,.1,0,.04,.98,dk,.025);k.cone(.012,.05,0,.04,1.06,M(0xff7a30));k.box(.04,.14,.05,0,-.1,.0,dk,.3);k.box(.04,.1,.04,0,-.08,.45,dk);k.cyl(.12,.42,-.02,-.2,-.35,M(0xb8b8b0),.12);k.cylY(.12,.4,-.02,-.25,-.4,M(0xb8b8b0));k.cylY(.02,.5,.05,-.1,-.15,dk,0,Math.PI/2);g.userData.a={r:[0,-.1,0],l:[0,-.06,.45],m:[0,0,.1]};g.userData.mags=[];return g};
function skGiveHeavy(wk){if(!W[wk])return;let w=wp.find(x=>x.k==wk);if(w){w.mag=w.m}else{w={k:wk,...eff(wk,[])};w.mag=w.m;w.res=0;w.rs=0;w.heavy=1;wp.push(w)}cur=wp.indexOf(w);setGun();msg(W[wk].n+' equipped',2);beep(500,.2,'square',.06)}
function skDropHeavy(wk){const i=wp.findIndex(w=>w.k==wk);if(i<0)return;wp.splice(i,1);cur=Math.max(0,Math.min(cur,wp.length-1));setGun()}
function skHeavyShot(w){w.mag--;shots++;nf=t0+w.r*zfr();src=W[w.k].n;srcK=w.k;gunSnd(w);kick=Math.max(kick,.4);const o=C.position.clone(),d=aimDir();
 if(w.k=='GL'){const p=skAimPoint(80);skLine(o.clone().add(d.clone().multiplyScalar(1)),p,0xffd070,.12);skBlast(p,4.8,w.d,'Boom Machine')}
 else{for(let i=0;i<3;i++){const p=o.clone().add(d.clone().multiplyScalar(2.5+Math.random()*4)).add(V((Math.random()-.5)*.8,(Math.random()-.5)*.8,(Math.random()-.5)*.8));burst(p,3,Math.random()<.5?0xff7a20:0xffc040,4,.35,.3)}for(const b of foes()){const v=V(b.x-o.x,(b.y||0)+1-o.y,b.z-o.z),D=v.length();if(D<8.5&&v.normalize().dot(d)>.8&&navLos(o.x,o.z,b.x,b.z))skHurt(b,w.d,'Flamethrower')}}}
{const _s=shoot;shoot=function(){const w=cw();if(w&&w.heavy&&(w.k=='GL'||w.k=='FT')){skHeavyShot(w);return}_s.apply(this,arguments)}}
{const _d=die;die=function(){const was=P.dead;_d.apply(this,arguments);if(!was)for(const w of wp.filter(x=>x.heavy))skDropHeavy(w.k)}}
/* ---------- guided / remote control helpers ---------- */
function skMissile(o){return rcStart(Object.assign({elec:1,turn:1.2,spd:30,hint:'Steer with the mouse · LMB detonate',tick(r,dt,edge){const d=V(-Math.sin(r.hy)*Math.cos(r.hp),Math.sin(r.hp),-Math.cos(r.hy)*Math.cos(r.hp)),v=r.spd*dt;r.y-=r.grav?r.grav*dt:0;const t=castW(V(r.x,r.y,r.z),d,v+.6);r.x+=d.x*v;r.y+=d.y*v;r.z+=d.z*v;const hit=t<v+.5||r.y<=skGnd(r.x,r.z)+.3||Math.abs(r.x)>H||Math.abs(r.z)>H;if(hit||edge||r.fuelOut){skBlast(V(cl(r.x,-H,H),Math.max(.3,r.y),cl(r.z,-H,H)),r.R,r.dmg,r.n);if(r.next){r.next(r);return}rcEnd()}if(r.fuel!=null){r.fuel-=dt;if(r.fuel<=0)r.fuelOut=1}},expire(r){skBlast(V(r.x,Math.max(.3,r.y),r.z),r.R,r.dmg,r.n)},cam(r){return V(r.x,r.y,r.z)}},o))}
function skDrone(o){return rcStart(Object.assign({elec:1,turn:2.6,hint:'Mouse steer · W forward · LMB detonate',missiles:0,cd:0,tick(r,dt,edge){const v=key.KeyW?10:key.KeyS?-4:3,d=V(-Math.sin(r.hy)*Math.cos(r.hp),Math.sin(r.hp),-Math.cos(r.hy)*Math.cos(r.hp)),st=Math.abs(v)*dt;const t=castW(V(r.x,r.y,r.z),d.clone().multiplyScalar(Math.sign(v)||1),st+.5);if(t>st+.4){r.x+=d.x*v*dt;r.y+=d.y*v*dt;r.z+=d.z*v*dt}r.y=Math.max(skGnd(r.x,r.z)+.5,Math.min(30,r.y));r.x=cl(r.x,-H+1,H-1);r.z=cl(r.z,-H+1,H-1);r.cd-=dt;
   if(r.missiles){if(edge&&r.cd<=0&&r.missiles>0){r.cd=.45;r.missiles--;const mm=skM('knight',.25),dd=d.clone();mm.position.set(r.x,r.y-.3,r.z);S.add(mm);skAdd({id:'mm',n:'GildedBird',m:mm,x:r.x,y:r.y-.3,z:r.z,life:2.2,vx:dd.x*32,vy:dd.y*32,vz:dd.z*32,tick(o,dt){const tt=castW(V(o.x,o.y,o.z),V(o.vx,o.vy,o.vz).normalize(),32*dt+.4);o.x+=o.vx*dt;o.y+=o.vy*dt;o.z+=o.vz*dt;mm.lookAt(o.x+o.vx,o.y+o.vy,o.z+o.vz);if(tt<32*dt+.4||o.y<=skGnd(o.x,o.z)+.2){skBlast(V(o.x,Math.max(.3,o.y),o.z),3.4,92,'GildedBird',true);skRemove(o,false)}}});beep(700,.12,'sawtooth',.05)}if(r.missiles<=0&&r.cd<=0&&!r.out){r.out=1;r.t=Math.min(r.t,2)}}
   else if(edge){skBlast(V(r.x,r.y,r.z),r.R||5.5,r.dmg||140,r.n);rcEnd()}},expire(r){if(!r.missiles)skBlast(V(r.x,r.y,r.z),r.R||5.5,r.dmg||140,r.n)},cam(r){return V(r.x,r.y,r.z)}},o))}
function skGunner(o){return rcStart(Object.assign({elec:0,fireT:0,hint:'Aim with the mouse · LMB fire',tick(r,dt,edge){r.ang=(r.ang||0)+dt*.25;r.x=Math.cos(r.ang)*r.orbit;r.z=Math.sin(r.ang)*r.orbit;r.fireT-=dt;r.shoot(r,dt,edge)},cam(r){return V(r.x,r.y,r.z)}},o))}
function skGunFire(r,dmg,R,quiet,iv,name){if(r.fireT>0)return;r.fireT=iv;const o=V(r.x,r.y,r.z),d=V(-Math.sin(r.hy)*Math.cos(r.hp),Math.sin(r.hp),-Math.cos(r.hy)*Math.cos(r.hp)),t=Math.min(160,castW(o,d,160)),p=o.clone().add(d.clone().multiplyScalar(t));p.y=Math.max(.3,p.y);skLine(o.clone().add(V(.5,-1,0)),p,0xffe080,.06);skBlast(p,R,dmg,name,quiet)}
/* ---------- the streaks ---------- */
const SKB={
 uav(){SK.uavT=30;uav=30;SK.pingT=0;msg('UAV online',1.5)},
 advuav(){SK.uavT=30;SK.advT=30;uav=30;msg('Advanced UAV online',1.5)},
 pradar(){SK.prT=45;skAdd({id:'pradar',n:'Personal Radar',m:skM('pradar',.5),x:P.x,y:2.3,z:P.z,hp:45,air:1,elec:1,life:45,tick(o,dt){o.x+=(P.x+Math.cos(SK.t*.9)*1.2-o.x)*Math.min(1,dt*3);o.z+=(P.z+Math.sin(SK.t*.9)*1.2-o.z)*Math.min(1,dt*3);o.y=2.4+Math.sin(SK.t*3)*.12;o.m.rotation.y+=dt*2},end(){SK.prT=0}});msg('Personal Radar online',1.5)},
 motion(){const p=skSpot();skAdd({id:'motion',n:'Motion Sensor',m:skM('motion',1),x:p.x,y:p.y,z:p.z,hp:60,elec:1,life:60,r:22,tick(o,dt){o.m.children[2]&&(o.m.rotation.y+=dt*1.2)}});msg('Motion Sensor placed',1.5)},
 cuav(){SK.cuavT=30;msg('Counter-UAV: enemy radar jammed',2);beep(300,.4,'sawtooth',.06)},
 emp(){SK.empT=10;ST.flash=Math.max(ST.flash,1.1);msg('EMP: enemy electronics down',2.5);noise(.8,150,.3);for(const e of SK.ea.slice())skEaDie(e)},
 flak(){skFlakDeploy()},
 care(){const p=skAimPoint(40);skCrate(p.x,p.z,'care',true);msg('Care Package inbound',2)},
 airdrop(){const f=V(-Math.sin(yaw),0,-Math.cos(yaw)),c=skAimPoint(60);const m=skM('airdrop',.9);m.rotation.y=Math.atan2(f.x,f.z);S.add(m);let run=0,n=0,acc=0;const L=H*1.3,sx=c.x-f.x*L,sz=c.z-f.z*L;skAdd({id:'plane',n:'Cargo plane',m,x:sx,y:48,z:sz,life:9,hp:0,tick(o,dt){run+=34*dt;o.x=sx+f.x*run;o.z=sz+f.z*run;acc+=dt;if(acc>.9&&n<5&&Math.abs(o.x)<H-4&&Math.abs(o.z)<H-4){acc=0;n++;skCrate(o.x+(Math.random()-.5)*6,o.z+(Math.random()-.5)*6,'care',true)}}});msg('Emergency Airdrop inbound',2.2);noise(1.4,200,.2)},
 vests(){const p=skAimPoint(40);skCrate(p.x,p.z,'vests',true);msg('Ballistic Vests inbound',2)},
 ammo(){const p=skSpot(5);skCrate(p.x,p.z,'ammo',false);msg('Ammo Crate placed',1.5)},
 sim(){const p=skSpot();skAdd({id:'sim',n:'S.I.M.',m:skM('sim',1),x:p.x,y:p.y,z:p.z,hp:70,elec:1,life:70,cd:1,tick(o,dt){o.cd-=dt;if(o.cd>0)return;const t=skNearLos(o,9);if(t){o.cd=2.4;skLine(V(o.x,1.2,o.z),V(t.x,5,t.z),0xffd070,.2);skShell(t.x,t.z,3.3,92,'S.I.M.',.55,false,false);beep(500,.2,'square',.05)}}});msg('S.I.M. deployed',1.5)},
 dcvt(){const f=V(-Math.sin(yaw),0,-Math.cos(yaw));rcStart({id:'dcvt',n:'DC-VT',elec:1,m:skM('dcvt',1),x:P.x+f.x*1.6,z:P.z+f.z*1.6,y:0,ch:yaw,v:0,t:22,hint:'W/S drive · A/D steer · LMB detonate',tick(r,dt,edge){const mvv=(key.KeyW?1:0)-(key.KeyS?.4:0),tg=mvv*13;r.v+=(tg-r.v)*Math.min(1,dt*3);r.ch+=((key.KeyA?1:0)-(key.KeyD?1:0))*dt*2.4*Math.min(1,Math.abs(r.v)/4);const fx=-Math.sin(r.ch),fz=-Math.cos(r.ch);mv(r,fx*r.v*dt,fz*r.v*dt,.5);r.y=skGnd(r.x,r.z);r.hy=r.ch;r.camPitch=-.22;const t=skNear(r,2.4);if(edge||t){skBlast(V(r.x,.4,r.z),6,150,'DC-VT');rcEnd()}},expire(r){skBlast(V(r.x,.4,r.z),6,150,'DC-VT')},cam(r){return V(r.x+Math.sin(r.ch)*3.6,r.y+1.8,r.z+Math.cos(r.ch)*3.6)}});},
 bombdrone(){skDrone({id:'bombdrone',n:'BOMB DRONE',m:skM('bombdrone',1),x:P.x,y:2.2,z:P.z,t:28,R:5.5,dmg:140})},
 hunter(){const p=skSpot(3);skAdd({id:'hunter',n:'Hunter Killer Drone',m:skM('hunter',1),x:p.x,y:2,z:p.z,hp:25,air:1,elec:1,life:16,tick(o,dt){const t=skNear(o,1e9);if(!t){o.y=3+Math.sin(SK.t*3);return}const dx=t.x-o.x,dz=t.z-o.z,D=Math.hypot(dx,dz);const tw=Math.min(1,dt*4);o.x+=dx/D*13*dt;o.z+=dz/D*13*dt;o.y+=(1.4-o.y)*tw;o.m.rotation.y=Math.atan2(dx,dz);if(D<1.5){skBlast(V(o.x,.8,o.z),3.6,118,'Hunter Killer');skRemove(o,false)}}});msg('Hunter Killer launched',1.5)},
 sentry(){const p=skSpot();skAdd({id:'sentry',n:'Sentry Gun',m:skM('sentry',1),x:p.x,y:p.y,z:p.z,hp:130,elec:1,life:65,cd:0,face:yaw+Math.PI,tick(o,dt){const t=skNearLos(o,28);if(t){const a=Math.atan2(t.x-o.x,t.z-o.z);o.face+=Math.atan2(Math.sin(a-o.face),Math.cos(a-o.face))*Math.min(1,dt*7);o.cd-=dt;if(o.cd<=0){o.cd=.1;skLine(V(o.x,1.15,o.z),V(t.x,1.1,t.z),0xffd070,.05);if(Math.random()<.78)skHurt(t,8,'Sentry Gun')}}else o.face+=dt*.5;o.m.rotation.y=o.face}});msg('Sentry Gun deployed',1.5)},
 shieldt(){const p=skSpot();skAdd({id:'shieldt',n:'Shield Turret',m:skM('shieldt',1),x:p.x,y:p.y,z:p.z,hp:280,shield:1,elec:1,life:65,cd:0,face:yaw+Math.PI,tick(o,dt){const t=skNearLos(o,30);if(t){const a=Math.atan2(t.x-o.x,t.z-o.z);o.face+=Math.atan2(Math.sin(a-o.face),Math.cos(a-o.face))*Math.min(1,dt*3);o.cd-=dt;if(o.cd<=0){o.cd=.13;skLine(V(o.x,1.1,o.z),V(t.x,1.1,t.z),0xffd070,.05);if(Math.random()<.8)skHurt(t,14,'Shield Turret')}}o.m.rotation.y=o.face}});msg('Shield Turret deployed',1.5)},
 pal(){const p=skSpot();skAdd({id:'pal',n:'PAL Turret',m:skM('pal',1),x:p.x,y:p.y,z:p.z,hp:160,elec:1,life:70,cd:0,tick(o,dt){o.cd-=dt;const e=SK.ea.find(e=>Math.hypot(e.x-o.x,e.z-o.z)<80);if(e){o.m.rotation.y=Math.atan2(e.x-o.x,e.z-o.z);if(o.cd<=0){o.cd=1.1;skLine(V(o.x,1.4,o.z),V(e.x,e.y,e.z),0xffffff,.25);e.hp-=70;beep(800,.2,'sawtooth',.05);if(e.hp<=0)skEaDie(e)}}}});msg('PAL Turret deployed',1.5)},
 guardian(){const p=skSpot();const m=skM('guardian',1);const cone=new THREE.Mesh(new THREE.ConeGeometry(5,13,20,1,true),new THREE.MeshBasicMaterial({color:0xff7a3a,transparent:true,opacity:.14,side:THREE.DoubleSide,depthWrite:false}));cone.rotation.x=-Math.PI/2;cone.position.set(0,1.75,6.5);m.add(cone);skAdd({id:'guardian',n:'Guardian',m,x:p.x,y:p.y,z:p.z,hp:180,elec:1,life:60,cd:0,face:yaw+Math.PI,tick(o,dt){const t=skNearLos(o,13);if(t){const a=Math.atan2(t.x-o.x,t.z-o.z);o.face+=Math.atan2(Math.sin(a-o.face),Math.cos(a-o.face))*Math.min(1,dt*2.5)}else o.face+=dt*.8;o.m.rotation.y=o.face;o.cd-=dt;if(o.cd<=0){o.cd=.25;for(const b of foes()){const dx=b.x-o.x,dz=b.z-o.z,D=Math.hypot(dx,dz);if(D<13&&Math.cos(Math.atan2(dx,dz)-o.face)>.72&&navLos(o.x,o.z,b.x,b.z)){skHurt(b,5.5,'Guardian');b.stun=Math.max(b.stun||0,.2)}}}}});msg('Guardian deployed',1.5)},
 groundsis(){const p=skSpot(3);skUnit({id:'groundsis',n:'Groundsis',m:skM('groundsis',1),x:p.x,y:0,z:p.z,hp:230,life:70,cd:1,tick(o,dt){const t=skNearLos(o,22),tx=P.x+Math.cos(SK.t*.3)*4,tz=P.z+Math.sin(SK.t*.3)*4;if(Math.hypot(tx-o.x,tz-o.z)>3.2)navMove(o,dt,tx,tz,6,null);o.y=skGnd(o.x,o.z);o.m.rotation.y=t?Math.atan2(t.x-o.x,t.z-o.z):(o.mva||0);o.cd-=dt;if(t&&o.cd<=0){o.cd=1.1;skLine(V(o.x,1.4,o.z),V(t.x,1.2,t.z),0xffd070,.1);skBlast(V(t.x,1.2,t.z),2.7,58,'Groundsis',true)}}});msg('Groundsis deployed',1.5)},
 terminator(){skMissile({bias:-1.0,n:'TERMINATOR',m:skM('terminator',.4),x:P.x,y:75,z:P.z,hy:yaw,hp:-1.2,spd:36,R:7.5,dmg:210,t:30})},
 glide(){skMissile({bias:-.35,n:'GLIDE BOOM',m:skM('glide',.4),x:P.x,y:85,z:P.z,hy:yaw,hp:-.5,spd:20,grav:7,turn:.9,R:10.5,dmg:260,t:30,hint:'Steer the glide with the mouse · LMB detonate'})},
 knight(){const f=V(-Math.sin(yaw),0,-Math.cos(yaw));let left=3;const launch=r=>{r.x=P.x+f.x*.8;r.y=1.6;r.z=P.z+f.z*.8;r.fuel=7;r.fuelOut=0;r.hy=yaw;r.hp=pitch;r.hint='Knight Rocket · '+left+' left · LMB detonate'};const o={n:'KNIGHT ROCKET',m:skM('knight',.35),spd:22,turn:2.2,R:5.5,dmg:165,t:45,fuel:7,next(r){left--;if(left<=0){rcEnd();return}launch(r)},x:P.x+f.x*.8,y:1.6,z:P.z+f.z*.8,hy:yaw,hp:pitch};skMissile(o)},
 gilded(){skDrone({id:'gilded',n:'GILDEDBIRD',m:skM('gilded',.7),x:P.x,y:6,z:P.z,t:32,missiles:8,hint:'Mouse steer · W forward · LMB micro-missile'})},
 precision(){skFly({model:'precision',sc:.9,alt:42,spd:50,iv:.22,spread:3.2,R:4.2,d:135,name:'Precision Airstrike',n:3,gap:6});msg('Precision Airstrike inbound',2)},
 mortar(){const c=skAimPoint(70),pts=foes().sort((a,b)=>Math.hypot(a.x-c.x,a.z-c.z)-Math.hypot(b.x-c.x,b.z-c.z)).slice(0,5).map(b=>[b.x,b.z]);while(pts.length<10)pts.push([c.x+(Math.random()-.5)*20,c.z+(Math.random()-.5)*20]);msg('Mortar Strike: incoming',2);pts.forEach(([x,z],i)=>skShell(cl(x+(Math.random()-.5)*4,-H+2,H-2),cl(z+(Math.random()-.5)*4,-H+2,H-2),4.6,135,'Mortar Strike',2.2+i*.45,false,true))},
 stealth(){skFly({model:'stealth',sc:1,alt:55,spd:46,iv:.09,spread:26,R:5.6,d:145,name:'Stealth Bomber',n:1});msg('Stealth Bomber inbound',2)},
 napalm(){skFly({model:'napalm',sc:1.4,alt:38,spd:42,iv:.5,spread:2,R:3,d:40,nap:1,fr:4.8,name:'Napalm Strike',n:1});msg('Napalm Strike inbound',2)},
 dogs(){for(let i=0;i<4;i++)skDog('dogs','Attack Dog',40,55,1);msg('Attack Dogs released',2)},
 achopper(){skHeli({id:'achopper',n:'Attack Chopper',model:'achopper',sc:1,hp:420,dmg:15,iv:.3,life:50,orbit:22,hy:13});msg('Attack Chopper inbound',2)},
 gunner(){skGunner({n:'CHOPPER GUNNER',x:0,y:42,z:20,orbit:20,t:30,hint:'Aim with the mouse · LMB fire 30mm',shoot(r,dt){if(trig)skGunFire(r,16,2,true,.09,'Chopper Gunner')}})},
 dc260(){skGunner({n:'DC-260',x:0,y:60,z:25,orbit:24,t:38,w:2,hint:'1: 105mm  2: 40mm  3: 25mm · LMB fire',shoot(r,dt){if(key.Digit1)r.w=0;else if(key.Digit2)r.w=1;else if(key.Digit3)r.w=2;if(trig){if(r.w==0)skGunFire(r,260,9,false,2.2,'DC-260 105mm');else if(r.w==1)skGunFire(r,100,3.8,false,.55,'DC-260 40mm');else skGunFire(r,15,1.7,true,.07,'DC-260 25mm')}r.hint=['105mm','40mm','25mm'][r.w]+' selected · keys 1/2/3'}})},
 overwatch(){skHeli({id:'overwatch',n:'Overwatch',model:'overwatch',sc:.7,hp:360,dmg:13,iv:.22,life:46,follow:1,orbit:9,hy:8,rng:42,spd:.5});msg('Overwatch inbound',2)},
 tolv(){skFly({model:'tolv',sc:.9,alt:36,spd:44,iv:.45,spread:3,R:6,d:160,name:'TOLV Planet',n:1,after(){skHeli({id:'tolv',n:'TOLV Planet',model:'tolv',sc:.8,hp:320,dmg:15,iv:.24,life:30,follow:0,orbit:10,hy:18,spd:.25,rng:48})}});msg('TOLV Planet inbound',2)},
 cube(){skGunner({n:'CUBE TURRET',x:0,y:62,z:0,orbit:14,t:35,hint:'LMB minigun · RMB cannon',shoot(r,dt){if(trig)skGunFire(r,18,1.5,true,.05,'Cube Turret');if(ST.adsIn)skGunFire(r,140,5,false,1.4,'Cube Cannon')}})},
 jugg(){skStartSuit('jugg',60,300,.72,'MNG');msg('Juggernaut: minigun online',2)},
 goliath(){skStartSuit('goliath',50,520,.78,'MNG');msg('Goliath online · X to self-destruct',2.5)},
 para(){for(let i=0;i<4;i++){const a=i*1.57+Math.random(),x=cl(P.x+Math.cos(a)*5,-H+3,H-3),z=cl(P.z+Math.sin(a)*5,-H+3,H-3),m=skM('para',1);skUnit({id:'para',n:'Paratrooper',m,x,y:30,z,hp:80,life:65,cd:0,fall:1,tick(o,dt){if(o.fall){o.y-=7*dt;const g=skGnd(o.x,o.z);if(o.y<=g){o.y=g;o.fall=0;m.children.forEach(c=>{if(c.position.y>2.4)c.visible=false})}return}const t=skNearLos(o,28),tx=t?t.x:P.x+Math.cos(i)*3.5,tz=t?t.z:P.z+Math.sin(i)*3.5;if(Math.hypot(tx-o.x,tz-o.z)>(t?14:3))navMove(o,dt,tx,tz,5.5,null);o.y=skGnd(o.x,o.z);o.m.rotation.y=t?Math.atan2(t.x-o.x,t.z-o.z):(o.mva||0);o.cd-=dt;if(t&&o.cd<=0){o.cd=.45;skLine(V(o.x,1.3,o.z),V(t.x,1.1,t.z),0xffd070,.05);if(Math.random()<.55)skHurt(t,13,'Paratroopers')}}})}msg('Paratroopers dropping',2)},
 guarddog(){skDog('guarddog','Guard Dog',90,90,1);msg('Guard Dog at your side',2)},
 fear(){skGiveHeavy('MNG')},boom(){skGiveHeavy('GL')},flame(){skGiveHeavy('FT')},
 satellite(){const pts=foes().sort(()=>Math.random()-.5).slice(0,5).map(b=>[b.x,b.z]);while(pts.length<4)pts.push([(Math.random()-.5)*H,(Math.random()-.5)*H]);msg('Super Satellite: kinetic strike',2.5);pts.forEach(([x,z],i)=>{const rod=new THREE.Mesh(new THREE.CylinderGeometry(.18,.18,70,8),new THREE.MeshBasicMaterial({color:0xffe0a0}));rod.position.set(x,200,z);S.add(rod);let y=200,done=0;const t0_=SK.t+1+i*.6;skAdd({id:'rod',n:'Kinetic rod',m:rod,x,y:200,z,life:9,tick(o,dt){if(SK.t<t0_){o.y=200;return}o.y-=170*dt;if(o.y<=35&&!done){done=1;skBlast(V(x,.3,z),6,230,'Super Satellite');skRemove(o,false)}}})});for(let i=0;i<3;i++){const a=i*2.09;const sx=P.x+Math.cos(a)*6,sz=P.z+Math.sin(a)*6;skAdd({id:'smoke',n:'Smoke',m:new THREE.Group(),x:sx,y:0,z:sz,life:12,tick(o,dt){burst(V(o.x,1.5,o.z),3,0xcccccc,2,2,1.4)}})}const p=skAimPoint(30);skCrate(p.x,p.z,'care',true)},
 annihil(){const c=skAimPoint(80),f=V(-Math.sin(yaw),0,-Math.cos(yaw)),beam=new THREE.Group();const core=new THREE.Mesh(new THREE.CylinderGeometry(.8,1.6,160,16,1,true),new THREE.MeshBasicMaterial({color:0x8af0ff,transparent:true,opacity:.55,depthWrite:false,side:THREE.DoubleSide})),halo=new THREE.Mesh(new THREE.CylinderGeometry(2.4,3.6,160,16,1,true),new THREE.MeshBasicMaterial({color:0x3aa0ff,transparent:true,opacity:.18,depthWrite:false,side:THREE.DoubleSide}));core.position.y=80;halo.position.y=80;beam.add(core,halo);msg('Annihilation: orbital beam',2.5);noise(1.6,120,.3);skAdd({id:'beam',n:'Annihilation',m:beam,x:c.x,y:0,z:c.z,life:8,cd:0,tick(o,dt){o.x=cl(o.x+f.x*5*dt,-H+2,H-2);o.z=cl(o.z+f.z*5*dt,-H+2,H-2);o.y=skGnd(o.x,o.z);beam.rotation.y+=dt*3;if(Math.random()<.5)burst(V(o.x,.6,o.z),2,0x8af0ff,5,.5,.4);o.cd-=dt;if(o.cd<=0){o.cd=.2;for(const b of foes())if(Math.hypot(b.x-o.x,b.z-o.z)<5.2)skHurt(b,28,'Annihilation')}}})},
 nuke(){skNukeStart()},
};
function skStartSuit(k,t,mhp,sp,wk){if(SK.suit)skEndSuit('');SK.suit={k,t,sp,mhp:P.mhp,msh:P.msh,wk};P.mhp=mhp;P.hp=mhp;P.msh=0;P.sh=0;skGiveHeavy(wk)}
{const _f=actField;actField=function(){if(SK.suit&&SK.suit.k=='goliath'){boom(V(P.x,.6,P.z),{R:9.5,d:310,own:1,c:0xff8a30});skEndSuit('Self-destruct');return}_f.apply(this,arguments)}}
;
/* ######## sk_ui.js ######## */
/* ===================== sk_ui.js ===================== */
/* ---------- killstreak loadout: 3 selected streaks (L.ks), awarding by kills, the HUD, using them (keys 3 to 6 use the ready ones in the order you earned them),
   and the SCORESTREAKS screen: a grid of every streak with its model, description and cost, three SELECTED slots at the bottom. Opened from the Killstreaks tile in the loadout screen. ---------- */
const skSel=()=>{if(!Array.isArray(L.ks)||L.ks.length!=3)L.ks=SK_DEF.slice();return L.ks};
const skOK=id=>!!STK[id]&&(typeof unlocked=='function'?unlocked('sk:'+id):true);
{const _san=sanitize;sanitize=function(){_san.apply(this,arguments);const k=skSel();for(let i=0;i<3;i++)if(!skOK(k[i])||k[i]=='nuke')k[i]=SK_DEF[i]}}
function skAward(){if(mode=='Zombies')return;for(const id of skSel()){const s=STK[id];if(!s||SK.got[id]||q.includes(id))continue;if(ks>=Math.max(1,s.k-hl())){SK.got[id]=1;q.push(id);msg(s.n+' ready: press '+(2+q.length),2.5);if(typeof popup=='function')popup(s.n.toUpperCase(),'KILLSTREAK READY')}}
 if(ks>=30&&!SK.got.nuke&&!over&&!P.dead&&!SK.nk){SK.got.nuke=1;if(typeof popup=='function')popup('TACTICAL NUKE','30 KILLS');SKB.nuke()}}
useStreak=function(i){i=i||0;if(mode=='Zombies')return zUse();if(P.dead||SK.rc||q.length<=i)return;const id=q[i],f=SKB[id];if(!f){q.splice(i,1);return}q.splice(i,1);beep(500,.2,'sine',.1);f()};
ksHud=function(){const sel=skSel(),row=(id)=>{const s=STK[id],t=Math.max(1,s.k-hl()),qi=q.indexOf(id),rdy=qi>=0,used=!rdy&&SK.got[id];return `<div class="kt ${rdy?'rdy':used?'used':''}"><b>${s.n}</b><i>${rdy?'['+(qi+3)+'] READY':used?'USED':Math.min(ks,t)+' / '+t}</i></div>`},
 h=sel.map(row).join('')+q.filter(id=>!sel.includes(id)).map(row).join('');if(h!=ksC){ksC=h;$('#kst').innerHTML=`<small>KILLSTREAKS · ${ks}</small>`+h}};
/* ---------- images ---------- */
const skImg=id=>{const u=objImg('sk_'+id,()=>skModel(id));return u||''};
const skTag=id=>{const u=skImg(id);return u?`<img src="${u}" alt="">`:''};
/* ---------- screen ---------- */
const SKU={sel:'uav',slot:0,cat:-1};
function skOpen(){SKU.sel=skSel()[SKU.slot]||'uav';$$('#nav button').forEach(x=>x.classList.remove('on'));$$('.pn').forEach(p=>p.classList.toggle('on',p.id=='p-ks'));skRender()}
function skBack(){const b=document.querySelector('#nav button[data-p="load"]');if(b)b.click()}
function skRender(){const e=$('#p-ks');if(!e)return;const sel=skSel(),cur=STK[SKU.sel]||STK.uav,lock=!skOK(cur.id),hid=cur.id=='nuke'&&lock;
 const tiles=STKL.filter(s=>s.id!='nuke'&&(SKU.cat<0||s.c==SKU.cat)).map(s=>{const lk=!skOK(s.id),hd=s.id=='nuke'&&lk,on=sel.includes(s.id);return `<button class="sk ${SKU.sel==s.id?'sel':''} ${lk?'lk':''} ${on?'eq':''}" data-sk="${s.id}"><span class="skc">${hd?'':s.k}</span>${lk?`<u>🔒</u>`:''}<span class="ski">${hd?'':skTag(s.id)}</span><b>${hd?'???':s.n}</b>${lk&&!hd?`<small>Level ${s.lv}</small>`:''}</button>`}).join('');
 const slots=sel.map((id,i)=>{const s=STK[id];return `${i?'<i class="ar">▸</i>':''}<button class="ss ${SKU.slot==i?'on':''}" data-ss="${i}"><span class="ski">${skTag(id)}</span><b>${s.k}</b><small>${s.n}</small></button>`}).join('');
 e.innerHTML=`<div class="skp"><div class="sk-top"><button class="cu-back" data-skact="back">‹</button><h2>SCORESTREAKS</h2><div class="sk-cats"><button data-skcat="-1" class="${SKU.cat<0?'on':''}">ALL</button>${SKC.map((n,i)=>`<button data-skcat="${i}" class="${SKU.cat==i?'on':''}" title="${n}">${i+1}</button>`).join('')}</div></div>
  <div class="sk-main"><div class="sk-grid">${tiles}</div><aside class="sk-info"><h3>${hid?'???':cur.n}</h3><p class="sk-d">${hid?'A hidden streak. Reach the level to reveal it.':cur.d}</p><p class="sk-m">${SKC[cur.c]} · ${cur.k} kills${lock?` · unlocks at level ${cur.lv}`:''}</p><div class="sk-big">${hid?'':skTag(cur.id)}</div>
   <button class="big sk-eq" data-skact="equip" ${lock&&!(prof.tok>0)?'disabled':''}>${lock?(prof.tok>0?'Spend 1 unlock token':'Locked'):sel.includes(cur.id)?'Selected in slot '+(sel.indexOf(cur.id)+1):'Equip to slot '+(SKU.slot+1)}</button></aside></div>
  <div class="sk-sel"><h4>SELECTED</h4><div class="sk-slots">${slots}</div><p class="sk-h">Pick a slot, then a streak. Streaks are earned in a row without dying: the kills number is how many kills each needs. Press 3, 4, 5 to use them in the order you earn them. The Nuke cannot be equipped: it launches by itself at 30 kills in a row.</p></div></div>`}
document.addEventListener('click',e=>{const t=e.target;const op=t.closest('.ls[data-slot="ks"]');if(op){e.stopImmediatePropagation();skOpen();return}if(!t.closest('#p-ks'))return;
 const a=t.closest('[data-skact]');if(a){if(a.dataset.skact=='back')skBack();else if(a.dataset.skact=='equip'){const id=SKU.sel;if(!skOK(id)&&id!='nuke'&&STK[id]){if(typeof tokenSpend=='function')tokenSpend('sk:'+id);skRender();return}if(!skOK(id)||id=='nuke')return;const sel=skSel(),j=sel.indexOf(id);if(j>=0&&j!=SKU.slot){const tmp=sel[SKU.slot];sel[SKU.slot]=id;sel[j]=tmp}else sel[SKU.slot]=id;try{ui()}catch(er){}skRender()}return}
 const c=t.closest('[data-skcat]');if(c){SKU.cat=+c.dataset.skcat;skRender();return}const s=t.closest('[data-sk]');if(s){SKU.sel=s.dataset.sk;skRender();return}const sl=t.closest('[data-ss]');if(sl){SKU.slot=+sl.dataset.ss;SKU.sel=skSel()[SKU.slot];skRender()}},true);

try{ldRender()}catch(e){}
;

/* ===================== sk_net.js ===================== */
/* ---------- killstreaks in multiplayer: every placed device, aircraft and helicopter is mirrored to the other players as a model, they can shoot it down (the owner applies the damage),
   explosions are shown to everybody, and the NUKE is announced to the whole lobby and ends the match for everyone. Rocket Launcher and RayGun deal extra damage to streaks. ---------- */
let NUKE_BY=0;
const skMul=w=>w&&w.k=='RG'?3.5:w&&w.k=='RL'?4:1;
SK.uid=0;SK.gh={};SK.na=0;SK.nk=0;
{const _sm=skModel;skModel=function(id){const g=_sm.apply(this,arguments);if(g&&g.userData)g.userData.mid=id;return g}}
{const _a=skAdd;skAdd=function(o){const r=_a.apply(this,arguments);if(r&&!r.uid)r.uid=++SK.uid;return r}}
function skNetSend(dt){if(!netOn||!run||over)return;SK.na+=dt;if(SK.na<.1)return;SK.na=0;const l=[],mid=m=>m.userData&&m.userData.mid;
 for(const o of SK.objs){if(!o.m||!o.uid)continue;const id=mid(o.m);if(!id)continue;l.push([o.uid,id,+o.x.toFixed(1),+o.y.toFixed(1),+o.z.toFixed(1),+(o.m.rotation.y||0).toFixed(2),+o.m.scale.x.toFixed(2),o.hp>0&&!o.inv?1:0])}
 for(const a of SK.air){if(!a.m)continue;if(!a.uid)a.uid=++SK.uid;const id=mid(a.m);if(!id)continue;l.push([a.uid,id,+a.m.position.x.toFixed(1),+a.m.position.y.toFixed(1),+a.m.position.z.toFixed(1),+a.m.rotation.y.toFixed(2),+a.m.scale.x.toFixed(2),0])}
 const r=SK.rc;if(r&&r.m&&mid(r.m))l.push([-1,mid(r.m),+r.x.toFixed(1),+r.y.toFixed(1),+r.z.toFixed(1),+(r.hy||0).toFixed(2),+r.m.scale.x.toFixed(2),0]);
 netSend({t:'sko',l})}
function skNetObjs(d){if(d.id==myId||!run||over||mode=='Zombies')return;const now=performance.now(),seen=new Set();
 for(const[u,mid,x,y,z,ry,sc,hp]of d.l){const k=d.id+':'+u;seen.add(k);let g=SK.gh[k];
  if(!g){let m;try{m=skModel(mid)}catch(e){continue}m.scale.setScalar(sc||1);m.position.set(x,y,z);S.add(m);let rad=1;try{rad=Math.max(.8,Math.min(5,new THREE.Box3().setFromObject(m).getSize(new THREE.Vector3()).length()*.45))}catch(e){}g=SK.gh[k]={m,own:d.id,u,rad}}
  g.tx=x;g.ty=y;g.tz=z;g.ry=ry;g.t=now;g.hp=hp}
 for(const k in SK.gh)if(k.startsWith(d.id+':')&&!seen.has(k))skGhostDrop(k,true)}
function skGhostDrop(k,fx){const g=SK.gh[k];if(!g)return;if(fx&&g.hp)burst(g.m.position.clone(),18,0xff9a30,6,.7,.25);S.remove(g.m);delete SK.gh[k]}
function skGhostTick(dt){const now=performance.now(),k=Math.min(1,dt*10);for(const key in SK.gh){const g=SK.gh[key];if(now-g.t>1600){skGhostDrop(key,false);continue}const p=g.m.position;p.x+=(g.tx-p.x)*k;p.y+=(g.ty-p.y)*k;p.z+=(g.tz-p.z)*k;g.m.rotation.y=g.ry}}
function skGhostClear(){for(const k in SK.gh)skGhostDrop(k,false)}
/* shooting at someone else's streak */
function skShotGhost(){if(!netOn||!run||P.dead)return;const w=cw();if(!w||!w.k)return;const o=C.position.clone(),d=aimDir(),wall=castW(o,d,90);let best=null,bt=1e9;
 for(const k in SK.gh){const g=SK.gh[k];if(!g.hp)continue;const c=g.m.position.clone();c.y+=g.rad*.4;const t=rs(o,d,c,g.rad);if(t<bt&&t<wall&&t<90){bt=t;best=g}}
 if(best){const dmg=Math.round(Math.min(400,w.d*Math.max(1,w.pel*.5)*skMul(w)));netSend({t:'skh',to:best.own,u:best.u,d:dmg});$('#hm').className='on';hmT=.12}}
function skNetHit(d){if(d.to!=myId||!run)return;const o=SK.objs.find(x=>x.uid==d.u);if(!o||!o.hp||o.inv)return;o.hp-=Math.max(0,Math.min(400,+d.d||0));if(o.hp<=0){feed((names[d.id]||'An enemy')+' destroyed your '+(o.n||'streak'));skRemove(o,true)}}
function skNetFx(d){if(d.id==myId||!run)return;const p=V(d.x,d.y,d.z);burst(p,16,0xffa040,6,.6,.25);const dist=p.distanceTo(C.position);if(dist<70)noise(.4,500,.2*Math.max(0,1-dist/70))}
/* explosions: shown to everyone, and rockets / RayGun shots hurt other players' streaks in the blast */
{const _sb=skBlast;skBlast=function(p,R){_sb.apply(this,arguments);if(netOn)netSend({t:'skx',x:+p.x.toFixed(1),y:+p.y.toFixed(1),z:+p.z.toFixed(1)})}}
{const _b=boom;boom=function(p,g){_b.apply(this,arguments);if(!netOn||!g||g.tac||SK.nok)return;const m=g.w=='RL'?3.5:g.w=='RG'?3:1;for(const k in SK.gh){const gh=SK.gh[k];if(!gh.hp)continue;const D=gh.m.position.distanceTo(p);if(D<(g.R||4)+gh.rad)netSend({t:'skh',to:gh.own,u:gh.u,d:Math.round(Math.min(400,(g.d||100)*m*(1-.5*D/((g.R||4)+gh.rad))))})}}}
{const _sh=shoot;shoot=function(){const w=cw(),was=w?w.mag:0;_sh.apply(this,arguments);if(w&&w.mag<was)skShotGhost()}}
{const _st=skTick;skTick=function(dt){try{_st.apply(this,arguments)}catch(e){}if(!key.KeyF)SK.fp=0;try{skGhostTick(dt);skNetSend(dt);if(run&&!over&&!P.dead)skAward()}catch(e){}}}
{const _sr=skReset;skReset=function(){_sr.apply(this,arguments);skGhostClear();SK.nk=0;SK.fp=0;NUKE_BY=0}}
/* ---------- the nuke ---------- */
function skNukeStart(){if(SK.nk)return;if(netOn)netSend({t:'nuke',by:myId});skNukeSeq(myId,1)}
function skNukeSeq(by,mine){if(SK.nk)return;SK.nk=1;let n=8;const who=mine?'YOU':String(names[by]||'AN ENEMY').toUpperCase();msg((mine?'NUKE LAUNCHED':'NUKE INBOUND · '+who)+' · '+n,2);noise(2,100,.3);
 const iv=setInterval(()=>{if(!run||over){clearInterval(iv);SK.nk=0;return}n--;msg(n>0?'NUKE IN '+n:'DETONATION',1);beep(400+(8-n)*90,.15,'square',.08);
  if(n<=0){clearInterval(iv);ST.flash=3;const e=$('#flash');if(e)e.style.opacity=1;noise(2.5,80,.4);if(mine)for(const b of foes())skHurt(b,9999,'Nuke');
   setTimeout(()=>{SK.nk=0;if(!run||over)return;
    if(!netOn)endGame('Victory · Nuke');
    else if(isHost){NUKE_BY=by;const win=teamMode()?(mpTeams[by]||myTeam)==myTeam:by==myId;endGame(win?'Victory':'Defeat')}},1800)}},1000)}
/* ---------- power weapons (Rocket Launcher, Sniper) are lost on death and never carried into the next match ---------- */
const PWK=['RL','SN'];
function dropPower(){const had=wp.length;wp=wp.filter(w=>!(w.pw||PWK.includes(w.k)&&!w.heavy));if(!wp.length)wp=[{k:L.p,...eff(L.p,L.pa),mag:0,res:0}];if(wp.length!=had){cur=0;rel=0;try{setGun()}catch(e){}}}
{const _d=die;die=function(){const was=P.dead;_d.apply(this,arguments);if(!was&&mode!='Zombies')dropPower()}}
{const _g=startGame;startGame=function(){wp=wp.filter(w=>!PWK.includes(w.k));_g.apply(this,arguments);if(mode!='Zombies')dropPower()}}
{const _san=sanitize;sanitize=function(){_san.apply(this,arguments);if(PWK.includes(L.p))L.p='AR';if(PWK.includes(L.s))L.s='MG'}}
/* ---------- One in the Chamber: every kill (bullet, melee, or a player you downed) gives one bullet back ---------- */
{const _hb=hitBot;hitBot=function(b,d,head){const was=b.al;_hb.apply(this,arguments);if(OI.on&&was&&!b.al)oiBullet()}}

/* ===================== topbar.js ===================== */
/* ---------- the match info at the top of the screen (#ob holds the raw text from the game modes; this turns it into a proper scoreboard bar: team panels with progress, a centre badge, status chips) ---------- */
(function(){
 const hud=$('#hud'),ob=$('#ob');if(!hud||!ob)return;const bar=document.createElement('div');bar.id='tbar';hud.appendChild(bar);let last=null;
 const E=s=>String(s).replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
 const chip=t=>{t=t.trim();if(!t)return'';let m;
  if(m=t.match(/^([A-Z])\s+(blue|red|open)$/))return`<span class="tc zn ${m[2]}"><em>${m[1]}</em>${m[2]=='open'?'OPEN':m[2].toUpperCase()}</span>`;
  if(/CONTESTED/i.test(t))return`<span class="tc warn">${E(t)}</span>`;if(/BLUE HOLDING/i.test(t))return`<span class="tc blue">${E(t)}</span>`;if(/RED HOLDING/i.test(t))return`<span class="tc red">${E(t)}</span>`;
  if(/^(Time|Round|Wave)\b/i.test(t))return`<span class="tc big">${E(t)}</span>`;if(/flag/i.test(t))return`<span class="tc ${/^Blue/i.test(t)?'blue':'red'}">${E(t)}</span>`;
  return`<span class="tc">${E(t)}</span>`};
 function render(){const t=ob.textContent.trim();if(t===last)return;last=t;if(!t){bar.innerHTML='';return}
  let m=t.match(/^Blue\s+(\d+)\s*[-–]\s*(\d+)\s+Red(.*)$/)||t.match(/^Blue\s+(\d+)\s*·\s*Red\s+(\d+)(.*)$/);
  if(m){const a=+m[1],b=+m[2];let rest=m[3]||'',tg=0;const tm=rest.match(/(?:first to|\(first to)\s*(\d+)/i);if(tm)tg=+tm[1];rest=rest.replace(/\(?first to\s*\d+\)?/i,'');const chips=rest.split(/\s*·\s*/).map(chip).join('');
   const pa=tg?Math.min(100,a/tg*100):0,pb=tg?Math.min(100,b/tg*100):0;
   bar.innerHTML=`<div class="tr"><div class="tt a"><i>BLUE</i><b>${a}</b><u style="width:${pa}%"></u></div><div class="tm">${tg?`<small>FIRST TO</small><b>${tg}</b>`:'<small>VS</small>'}</div><div class="tt b"><b>${b}</b><i>RED</i><u style="width:${pb}%"></u></div></div>${chips?`<div class="tcs">${chips}</div>`:''}`;return}
  bar.innerHTML=`<div class="tcs solo">${t.split(/\s*·\s*|\s{2,}/).map(chip).join('')}</div>`}
 new MutationObserver(render).observe(ob,{childList:true,characterData:true,subtree:true});setInterval(render,200);
})();

/* ===================== fixes: RayGun ADS, VR menu cube ===================== */
/* RayGun: the power cell and cap sit on the sight line a few centimetres in front of the camera, which showed up as a giant block while aiming. They are hidden while aiming down sights. */
{const _fu=fpUpdate;fpUpdate=function(dt){_fu.apply(this,arguments);try{const m=rgG.userData.mag,w=cw();if(m&&w){const hide=w.k=='RG'&&ST.ads>.2;for(const x of m)x.visible=!hide}}catch(e){}}}
/* VR: outside a match nothing weapon-shaped may be drawn on the controllers or the camera (the white block on the right arm in the main menu) */
{const _vp=vrPost;vrPost=function(dt){_vp.apply(this,arguments);if(!xrS||inMatch())return;try{gun.visible=false;katG.visible=false;for(const a of[fpArm.r,fpArm.l])a.up.visible=a.fo.visible=false;for(const c of xrCtl)for(const ch of c.children)if(ch!==gun&&!(xrWrist&&ch===xrWrist.m))ch.visible=false}catch(e){}}}

/* ---------- held-weapon stability: arm IK is skipped for invalid targets and nudged when the hand sits exactly on the shoulder (zero-length direction), which made arms snap or vanish ---------- */
{const _ik=ik;ik=function(S0,H0,hint,arm){if(!S0||!H0||!arm||!arm.up||!(isFinite(S0.x+S0.y+S0.z+H0.x+H0.y+H0.z)))return;if(H0.distanceToSquared(S0)<1e-5)H0=H0.clone().add(V(0,-.02,-.05));return _ik.call(this,S0,H0,hint||V(0,-1,0),arm)}}

/* ---------- burst fire (TRB-3): one trigger pull fires the whole burst, then a short reset; a burst is cancelled by reload, an empty magazine or switching weapons ---------- */
GS.TUR={n:[[.06,'lowpass',5200,.3],[.02,'highpass',3800,.2],[.1,'bandpass',2200,.1,.01,1.6,2]],o:[['square',340,130,.05,.1],['sawtooth',1500,600,.025,.05]]};
GS.TRB={n:[[.07,'lowpass',4600,.34],[.025,'highpass',3400,.24],[.12,'bandpass',1500,.12,.02,1.4,2]],o:[['sawtooth',310,105,.06,.11],['triangle',1200,520,.03,.06]]};
{const _sb=shoot;shoot=function(){const w=cw();if(!w||!w.burst)return _sb.apply(this,arguments);if(BST.n<=0)BST.n=w.burst;_sb.apply(this,arguments);BST.n--;if(BST.n<=0||w.mag<=0){BST.n=0;nf=t0+w.r+(w.bd||.2)}}}
{const _sg=setGun;setGun=function(){BST.n=0;return _sg.apply(this,arguments)}}
{const _sr=startRel;startRel=function(){BST.n=0;return _sr.apply(this,arguments)}}

/* ===================== holdanim.js ===================== */
/* ---------- every weapon has its own way of being held. HOLD[k] (first person):
   i = idle pose offset [x,y,z, pitch,yaw,roll] (fades out when aiming so the sight line is never moved), b = breathing [height, sideways, speed], m = how much it sways while moving,
   s = extra pose while sprinting, d = draw-in motion [x,y,z, pitch,yaw,roll, seconds], k = recoil kick per shot [pitch, yaw, roll, push back, randomness, recovery speed].
   HOLD3[k] (what other players and bots look like): [idle height, idle forward, idle pitch, idle roll, run pitch, run roll, run height, breathing size, breathing speed]. ---------- */
const HOLD={
 AR:{i:[0,0,0,0,0,0],b:[.003,.002,1.1],m:1,s:[0,-.02,0,.1,-.05,.05],d:[.05,-.28,.1,.5,-.3,.15,.42],k:[.05,0,.02,.03,.3,12]},
 MVR:{i:[.005,-.005,.01,.02,0,0],b:[.0045,.003,.8],m:.8,s:[.01,-.03,0,.12,-.08,.08],d:[.08,-.32,.12,.6,-.35,.2,.55],k:[.075,.02,.05,.045,.5,9]},
 TRB:{i:[-.005,0,0,-.01,.02,-.02],b:[.0025,.002,1.3],m:1.1,s:[-.01,-.02,0,.08,.12,-.1],d:[-.06,-.26,.1,.55,.4,-.2,.38],k:[.032,.008,.012,.02,.2,16]},
 SMG:{i:[-.01,.01,.03,-.02,0,-.04],b:[.002,.0015,1.6],m:1.4,s:[-.03,0,0,.15,.35,.35],d:[0,-.2,.12,.5,0,0,.28],k:[.025,.015,.03,.012,.9,18]},
 VMP:{i:[-.015,.015,.04,-.03,.03,-.08],b:[.002,.002,1.4],m:1.3,s:[-.02,.01,0,.2,.45,.3],d:[.1,-.2,.08,.4,-.5,.3,.3],k:[.03,.02,.04,.015,1,17]},
 BR:{i:[.01,-.005,0,.015,0,0],b:[.004,.0025,.75],m:.8,s:[.02,-.03,0,.15,-.1,.05],d:[.04,-.34,.1,.65,-.2,.1,.6],k:[.1,.015,.02,.07,.2,10]},
 SG:{i:[.02,-.01,.03,.04,-.05,.03],b:[.004,.003,.7],m:.7,s:[0,0,-.02,.35,.1,-.1],d:[0,-.35,.2,.9,0,0,.65],k:[.2,.03,.06,.14,.1,8]},
 CY:{i:[.025,-.02,.05,.05,0,0],b:[.006,.004,.55],m:.6,s:[.02,-.03,0,.2,-.1,.1],d:[.1,-.4,.2,.8,-.2,.1,.75],k:[.11,.04,.05,.08,.6,9]},
 CT:{i:[-.03,.05,.1,.05,.03,-.02],b:[.0015,.001,1.8],m:.8,s:[-.01,.04,0,.55,0,0],d:[0,-.25,.08,.9,0,0,.22],k:[.18,0,.03,.1,.2,20]},
 MG:{i:[-.03,.045,.09,.04,.04,0],b:[.002,.0015,1.5],m:.8,s:[-.01,.04,0,.5,.1,0],d:[.02,-.3,.12,1,.1,0,.34],k:[.3,.02,.05,.14,.3,16]},
 MP:{i:[-.025,.05,.09,0,-.04,.05],b:[.0022,.002,2],m:1.2,s:[-.02,.03,0,.45,-.2,.2],d:[.05,-.25,.1,.7,-.3,.2,.24],k:[.05,.03,.05,.02,1,19]},
 RG:{i:[0,.02,.05,0,.1,-.08],b:[.004,.004,2.4],m:1,s:[0,.02,0,.2,.2,-.15],d:[0,-.2,.2,.3,.8,-.3,.45],k:[0,0,.08,.06,0,10]},
 SN:{i:[.015,-.02,.04,.02,-.03,0],b:[.005,.003,.6],m:.6,s:[0,0,0,.3,.1,0],d:[.05,-.4,.2,.6,-.4,.1,.8],k:[.22,.04,.03,.1,.1,7]},
 RL:{i:[.03,-.04,.06,.1,-.08,0],b:[.007,.004,.5],m:.7,s:[.02,-.02,0,.1,-.2,.1],d:[.1,-.5,.2,.9,-.4,.2,.9],k:[.15,.02,.05,.2,0,6]},
 MNG:{i:[.03,-.03,.05,.06,0,0],b:[.006,.004,.55],m:.6,s:[.02,-.03,0,.15,-.1,.1],d:[.1,-.45,.2,.85,-.3,.15,.8],k:[.04,.02,.03,.03,.6,14]},
 GL:{i:[.03,-.04,.06,.08,-.06,0],b:[.006,.004,.55],m:.7,s:[.02,-.02,0,.1,-.2,.1],d:[.1,-.45,.2,.9,-.3,.2,.8],k:[.14,.02,.05,.16,0,7]},
 TUR:{i:[-.008,.002,.012,-.015,.025,-.03],b:[.0028,.002,1.5],m:1.2,s:[-.02,-.02,0,.1,.2,-.12],d:[-.07,-.27,.1,.55,.4,-.2,.34],k:[.03,.014,.026,.016,.7,17]},
 FT:{i:[.02,-.02,.04,.04,0,0],b:[.005,.004,1],m:.8,s:[.01,-.02,0,.1,-.05,.05],d:[.08,-.35,.15,.7,-.2,.1,.6],k:[.015,.01,.02,.01,.8,16]}};
const HOLD3={AR:[0,0,0,0,.12,-.05,-.03,.008,1.1],MVR:[-.01,0,.02,0,.2,-.08,-.04,.01,.8],TRB:[0,0,-.01,.02,.1,.05,-.03,.008,1.3],TUR:[0,0,-.01,.02,.12,.08,-.03,.007,1.5],SMG:[.01,.02,0,-.05,.15,.2,-.02,.006,1.6],VMP:[.015,.02,0,-.08,.2,.25,-.02,.006,1.4],
 BR:[0,0,.02,0,.14,-.04,-.03,.01,.75],SG:[.01,0,.06,.03,.28,-.1,-.04,.01,.7],CY:[-.01,.01,.08,0,.32,-.12,-.05,.012,.55],CT:[.03,.05,.12,-.02,.3,0,.02,.004,1.8],MG:[.03,.06,.1,0,.3,0,.02,.004,1.5],
 MP:[.03,.05,.04,.06,.25,.1,0,.005,2],RG:[.02,.04,0,-.08,.1,.12,-.02,.008,2.4],SN:[-.01,0,.04,0,.3,-.05,-.04,.012,.6],RL:[.02,-.02,.1,0,.4,-.15,-.06,.014,.5],MNG:[-.01,.01,.08,0,.3,-.1,-.05,.012,.6],GL:[.02,-.02,.1,0,.35,-.12,-.05,.012,.6],FT:[0,0,.05,0,.2,-.05,-.03,.01,1]};
function hold3(b,mvf,run,id){const T=HOLD3[b.wk]||HOLD3.AR;b.hr=(b.hr||0)+((run?1:0)-(b.hr||0))*.12;const br=Math.sin(t0*T[8]+id)*T[7]*(1-.6*b.hr);
 return[0,T[0]+br*.5+b.hr*T[6],T[1],T[2]+b.hr*T[4]+br*.8,Math.sin(t0*T[8]*.5+id)*T[7]*.4,T[3]+b.hr*T[5]]}
const HA={a:null,t:9,w:'',kx:[0,0,0,0],kv:[0,0,0,0]};
function holdPose(dt){const o=[0,0,0,0,0,0],w=cw();if(!w||!run||P.dead||xrS)return o;const h=HOLD[w.k]||HOLD.AR,ads=ST.ads||0,spr=P.sprG==null?(P.spr||0):P.sprG,idle=1-ads,mv=Math.min(1,Math.hypot(P.mx||0,P.mz||0)/7);
 for(let n=0;n<6;n++)o[n]+=h.i[n]*idle+(h.s?h.s[n]*spr:0);
 const bs=(1-.7*ads)*(1-mv*.7),sp=h.b[2];o[1]+=Math.sin(t0*sp*2.4)*h.b[0]*bs;o[0]+=Math.sin(t0*sp*1.3+1)*h.b[1]*bs;o[3]+=Math.sin(t0*sp*2.4+.5)*h.b[0]*.6*bs;
 o[5]+=Math.sin(bobP)*.012*h.m*mv*idle;o[4]+=Math.cos(bobP)*.01*h.m*mv*idle;
 HA.t+=dt;const d=h.d,e=Math.min(1,HA.t/d[6]);if(e<1){const rem=Math.pow(1-e,3);o[0]+=d[0]*rem;o[1]+=d[1]*rem;o[2]+=d[2]*rem;o[3]-=d[3]*rem;o[4]+=d[4]*rem;o[5]+=d[5]*rem}
 const w0=h.k[5],zt=.78,sub=Math.max(1,Math.ceil(dt/.008)),st=dt/sub;for(let s=0;s<sub;s++)for(let n=0;n<4;n++){const a=-w0*w0*HA.kx[n]-2*zt*w0*HA.kv[n];HA.kv[n]+=a*st;HA.kx[n]+=HA.kv[n]*st}
 o[3]+=HA.kx[0]*(1-.3*ads);o[4]+=HA.kx[1];o[5]+=HA.kx[2];o[2]+=HA.kx[3]*(1-.5*ads);
 const m=OPT.hold==null?1:OPT.hold;if(m!=1)for(let n=0;n<6;n++)o[n]*=m;return o}
{const _fu=fpUpdate;fpUpdate=function(dt){const o=holdPose(dt);HA.a=o;gun.position.x+=o[0];gun.position.y+=o[1];gun.position.z+=o[2];gun.rotation.x+=o[3];gun.rotation.y+=o[4];gun.rotation.z+=o[5];return _fu.apply(this,arguments)}}
/* the offsets are taken off again at the start of the next frame, so the game's own smoothing never sees them */
{const _u=upd;upd=function(dt){const o=HA.a;if(o){gun.position.x-=o[0];gun.position.y-=o[1];gun.position.z-=o[2];gun.rotation.x-=o[3];gun.rotation.y-=o[4];gun.rotation.z-=o[5];HA.a=null}return _u.apply(this,arguments)}}
{const _sg=setGun;setGun=function(){const r=_sg.apply(this,arguments),w=cw();if(w&&w.k!=HA.w){HA.w=w.k;HA.t=0;HA.kx=[0,0,0,0];HA.kv=[0,0,0,0]}return r}}
{const _s=shoot;shoot=function(){const w=cw(),was=w?w.mag:0,r=_s.apply(this,arguments);if(w&&w.mag<was&&HOLD[w.k]){const k=HOLD[w.k].k,sg=Math.random()<.5?-1:1,v=HA.kv,g=k[5]*2.718;/* a velocity impulse of k*w*e peaks at k */v[0]=Math.min(2.6,v[0]+k[0]*(1+Math.random()*.2)*g);v[1]=cl(v[1]+sg*k[1]*Math.random()*2*g,-1.2,1.2);v[2]=cl(v[2]+sg*k[2]*(1+k[4]*Math.random())*g,-1.6,1.6);v[3]=Math.min(1.2,v[3]+k[3]*g)}return r}}

/* ===================== binds.js ===================== */
/* ---------- feature 1: rebindable controls. The game reads keys through RB(): a physical key is translated into the key the game expects for that action. Rebinding an action to a key that another action
   already uses swaps the two. Saved on this device (sd-keys). The UI is the Controls section at the bottom of Settings. ---------- */
const ACT=[['fwd','Move forward','KeyW','Movement'],['back','Move backward','KeyS','Movement'],['left','Move left','KeyA','Movement'],['right','Move right','KeyD','Movement'],['jump','Jump / stand / mantle','Space','Movement'],['sprint','Sprint','ShiftLeft','Movement'],['crouch','Crouch / slide','KeyC','Movement'],['prone','Prone / dive','ControlLeft','Movement'],['walk','Walk','AltLeft','Movement'],['autorun','Auto run','KeyH','Movement'],
 ['reload','Reload','KeyR','Combat'],['inspect','Inspect weapon','KeyY','Combat'],['melee','Melee (katana)','KeyV','Combat'],['fmode','Fire mode','KeyB','Combat'],['mount','Weapon mount','KeyT','Combat'],['next','Next weapon','Digit1','Combat'],['prev','Previous weapon','Digit2','Combat'],
 ['lethal','Lethal (frag)','KeyE','Equipment'],['tact','Tactical (flashbang)','KeyQ','Equipment'],['use','Interact / buy / revive / skip killcam','KeyF','Equipment'],['field','Field upgrade','KeyX','Equipment'],['ks1','Killstreak slot 1','Digit3','Equipment'],['ks2','Killstreak slot 2','Digit4','Equipment'],['ks3','Killstreak slot 3','Digit5','Equipment'],['ks4','Killstreak slot 4','Digit6','Equipment'],
 ['sb','Scoreboard','Tab','Interface'],['map','Map','KeyM','Interface'],['nv','Night vision','KeyN','Interface'],['chat','Open chat','Enter','Interface'],['quick','Quick chat','KeyZ','Interface']];
let BIND={},REV={};try{BIND=JSON.parse(localStorage.getItem('sd-keys')||'{}')||{}}catch(e){BIND={}}
const DEFC=new Set(ACT.map(a=>a[2])),FORBID=['Escape','F1','F3','F6','F5','F11','F12','Backspace','MetaLeft','MetaRight','ContextMenu'];
const bindOf=id=>BIND[id]||ACT.find(a=>a[0]==id)[2];
function bindRebuild(){REV={};for(const a of ACT)REV[bindOf(a[0])]=a[2]}
function RB(c){if(REV[c]!==undefined)return REV[c];return DEFC.has(c)?'Unbound':c}
bindRebuild();
function bindSave(){try{localStorage.setItem('sd-keys',JSON.stringify(BIND))}catch(e){}bindRebuild()}
function bindSet(id,code){const def=ACT.find(a=>a[0]==id)[2],old=bindOf(id),other=ACT.find(a=>a[0]!=id&&bindOf(a[0])==code);
 if(other){if(old==ACT.find(a=>a[0]==other[0])[2])delete BIND[other[0]];else BIND[other[0]]=old}
 if(code==def)delete BIND[id];else BIND[id]=code;bindSave()}
const keyName=c=>({Space:'Space',ShiftLeft:'L-Shift',ShiftRight:'R-Shift',ControlLeft:'L-Ctrl',ControlRight:'R-Ctrl',AltLeft:'L-Alt',AltRight:'R-Alt',Tab:'Tab',Enter:'Enter',CapsLock:'Caps',Backquote:'`',Minus:'-',Equal:'=',Comma:',',Period:'.',Slash:'/',Semicolon:';',Quote:"'",BracketLeft:'[',BracketRight:']',Backslash:'\\'}[c]||String(c).replace(/^Key/,'').replace(/^Digit/,'').replace(/^Numpad/,'Num ').replace(/^Arrow/,'Arrow '));
let CAP=null;
function bindUI(){const el=$('#rbg');if(!el)return;let h='',g='';for(const a of ACT){if(a[3]!=g){g=a[3];h+=`<h3>${g}</h3>`}const ch=BIND[a[0]]!=null;h+=`<div class="rbr"><span>${a[1]}</span><button class="rbk ${CAP==a[0]?'cap':''} ${ch?'chg':''}" data-rb="${a[0]}">${CAP==a[0]?'Press a key…':keyName(bindOf(a[0]))}</button><button class="rbx" data-rbr="${a[0]}" ${ch?'':'disabled'} title="Restore default">↺</button></div>`}el.innerHTML=h}
addEventListener('keydown',e=>{if(!CAP)return;e.preventDefault();e.stopImmediatePropagation();const id=CAP;CAP=null;if(e.code=='Escape'){bindUI();return}if(e.code=='Backspace'){delete BIND[id];bindSave();bindUI();return}
 if(FORBID.includes(e.code)){bindUI();return}bindSet(id,e.code);bindUI()},true);
addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-rb],[data-rbr],#rbreset');if(!b)return;if(b.id=='rbreset'){BIND={};bindSave();CAP=null;bindUI();return}
 if(b.dataset.rbr){delete BIND[b.dataset.rbr];bindSave();bindUI();return}CAP=b.dataset.rb;bindUI()});
/* ---------- gameplay options saved on this device ---------- */
const OPT=(()=>{let o={kc:1,chat:1,hold:1};try{Object.assign(o,JSON.parse(localStorage.getItem('sd-opt')||'{}'))}catch(e){}return o})();
const optSave=()=>{try{localStorage.setItem('sd-opt',JSON.stringify(OPT))}catch(e){}};
(function(){const ps=$('#p-set');if(!ps)return;const d=document.createElement('div');d.id='rebind';
 d.innerHTML=`<h2>Gameplay options</h2><label>Killcam<select id="o-kc"><option value="1">On: watch how you died</option><option value="0">Off</option></select></label><label>Chat<select id="o-chat"><option value="1">On</option><option value="0">Off (hide all messages)</option></select></label><label>Weapon hold animations<select id="o-hold"><option value="1">Full</option><option value="0.5">Reduced</option><option value="0">Off (original game motion)</option></select></label>
 <h2>Controls</h2><p class="sub">Click an action, then press the new key. Esc cancels, Backspace (or the arrow) restores the default. If the key is already used, the two actions swap. Mouse buttons and controller bindings are fixed.</p><div id="rbg"></div><button class="btn sm" id="rbreset">Reset all controls</button>`;ps.appendChild(d);
 const kc=$('#o-kc'),ch=$('#o-chat');kc.value=OPT.kc?'1':'0';ch.value=OPT.chat?'1':'0';kc.onchange=()=>{OPT.kc=+kc.value;optSave()};ch.onchange=()=>{OPT.chat=+ch.value;optSave()};const hd=$('#o-hold');hd.value=String(OPT.hold==null?1:OPT.hold);hd.onchange=()=>{OPT.hold=+hd.value;optSave()};bindUI()})();

/* ===================== chat.js ===================== */
/* ---------- feature 2: in-game chat. Enter opens it (team channel in team modes, Tab switches between TEAM and ALL), Z opens quick chat (1-8: callouts, the first two also drop a ping), messages travel
   peer to peer to everyone in the lobby, team messages are only shown to your team. Commands: /help /clear /mute name /unmute name /team /all. Rate limited on both ends, text only. ---------- */
const CHT={open:0,q:0,ch:'all',log:[],last:0,rate:{},mute:new Set(),qt:0};
const QCH=[['Enemy spotted!',1],['Need backup!',1],['Cover me!',0],['Watch the flank!',0],['On my way',0],['Nice shot!',0],['Thanks!',0],['Good game!',0]];
(function(){const hud=$('#hud');if(!hud)return;const c=document.createElement('div');c.id='chat';c.innerHTML='<div id="chlog"></div><div id="chin"><span id="chtag"></span><input id="chtxt" maxlength="120" autocomplete="off" spellcheck="false" placeholder="Type a message, Enter to send, Tab switches channel, Esc cancels"></div><div id="qchat"></div>';hud.appendChild(c)})();
const chSelf=()=>($('#nm')&&$('#nm').value.trim())||'Player';
const chTeamOn=()=>{try{return typeof teamMode=='function'&&netOn&&teamMode()}catch(e){return false}};
function chRender(){const el=$('#chlog');if(!el)return;const now=performance.now(),show=CHT.open?14:7;el.textContent='';for(const l of CHT.log.slice(-show)){const age=now-l.t;if(!CHT.open&&age>9000)continue;const r=document.createElement('div');r.className='chl'+(l.sys?' sys':'')+(!CHT.open&&age>6500?' old':'');if(!l.sys){const t=document.createElement('b');t.className=l.tm=='A'?'cta':l.tm=='B'?'ctb':'';t.textContent=(l.ch=='team'?'[TEAM] ':'')+l.n+': ';r.appendChild(t)}const s=document.createElement('span');s.textContent=l.m;r.appendChild(s);el.appendChild(r)}}
function chAdd(n,m,ch,tm,sys){CHT.log.push({n,m,ch,tm,sys,t:performance.now()});if(CHT.log.length>60)CHT.log.shift();chRender()}
function chTag(){const t=$('#chtag');if(!t)return;t.textContent=CHT.ch=='team'?'TEAM':'ALL';t.className=CHT.ch}
function chOpen(){if(CHT.open||!run||paused||over||(typeof xrS!='undefined'&&xrS))return;CHT.open=1;CHT.q=0;$('#qchat').style.display='none';for(const k in key)key[k]=0;trig=0;CHT.ch=chTeamOn()?'team':'all';chTag();const i=$('#chin');i.style.display='flex';const x=$('#chtxt');x.value='';x.focus();chRender()}
function chClose(){if(!CHT.open)return;CHT.open=0;$('#chin').style.display='none';$('#chtxt').blur();chRender()}
function chCmd(s){const [c,...a]=s.slice(1).split(/\s+/),arg=a.join(' ').trim().toLowerCase();
 if(c=='help')chAdd('','Commands: /mute name, /unmute name, /clear, /team, /all. Enter opens chat, Tab switches channel, Z is quick chat.','all',0,1);
 else if(c=='clear'){CHT.log=[];chRender()}else if(c=='team'){CHT.ch=chTeamOn()?'team':'all';chAdd('','Channel: '+CHT.ch.toUpperCase(),'all',0,1)}else if(c=='all'){CHT.ch='all';chAdd('','Channel: ALL','all',0,1)}
 else if(c=='mute'||c=='unmute'){if(!arg){chAdd('','Usage: /'+c+' name','all',0,1);return}const hit=Object.values(names||{}).find(n=>String(n).toLowerCase()==arg);if(!hit){chAdd('','No player named '+arg,'all',0,1);return}if(c=='mute')CHT.mute.add(arg);else CHT.mute.delete(arg);chAdd('',(c=='mute'?'Muted ':'Unmuted ')+hit,'all',0,1)}
 else chAdd('','Unknown command. Try /help','all',0,1)}
function chSend(txt,ch){txt=String(txt).replace(/[\u0000-\u001f<>]/g,'').trim().slice(0,120);if(!txt)return;if(txt[0]=='/'){chCmd(txt);return}const now=Date.now();if(now-CHT.last<700){chAdd('','Slow down a little.','all',0,1);return}CHT.last=now;
 const tm=typeof myTeam!='undefined'?myTeam:0;chAdd(chSelf(),txt,ch,tm);if(netOn)netSend({t:'chat',m:txt,ch,tm})}
function chatRecv(d){if(d.id==myId||!OPT.chat||typeof d.m!='string')return;const n=String((names&&names[d.id])||'Player').slice(0,14),now=performance.now(),r=CHT.rate[d.id]=(CHT.rate[d.id]||[]).filter(x=>now-x<4000);if(r.length>=4)return;r.push(now);
 if(CHT.mute.has(n.toLowerCase()))return;if(d.ch=='team'&&!(chTeamOn()&&d.tm==myTeam))return;chAdd(n,d.m.replace(/[\u0000-\u001f<>]/g,'').slice(0,120),d.ch=='team'?'team':'all',String(d.tm||'').slice(0,2));beep(880,.05,'sine',.04)}
function chQuick(i){const q=QCH[i];if(!q)return;CHT.q=0;$('#qchat').style.display='none';chSend(q[0],chTeamOn()?'team':'all');if(q[1]&&typeof actPing=='function'){try{actPing()}catch(e){}}}
function chQuickOpen(){if(CHT.open||!run||paused||over||(typeof xrS!='undefined'&&xrS))return;if(CHT.q){CHT.q=0;$('#qchat').style.display='none';return}CHT.q=1;CHT.qt=5;const e=$('#qchat');e.innerHTML='<h4>QUICK CHAT</h4>'+QCH.map((q,i)=>`<div><kbd>${i+1}</kbd>${q[0]}${q[1]?' <i>+ping</i>':''}</div>`).join('');e.style.display='block'}
addEventListener('keydown',e=>{
 if(CHT.open){if(e.code=='Enter'){e.preventDefault();e.stopImmediatePropagation();const v=$('#chtxt').value,ch=CHT.ch;chClose();chSend(v,ch);return}if(e.code=='Escape'){e.preventDefault();e.stopImmediatePropagation();chClose();return}if(e.code=='Tab'){e.preventDefault();e.stopImmediatePropagation();CHT.ch=CHT.ch=='team'||!chTeamOn()?'all':'team';chTag();return}e.stopImmediatePropagation();return}
 if(!run||paused||over)return;
 if(CHT.q){const n=e.code.startsWith('Digit')?+e.code.slice(5):0;if(n>=1&&n<=8){e.preventDefault();e.stopImmediatePropagation();chQuick(n-1);return}if(e.code=='Escape'||e.code==bindOf('quick')){e.preventDefault();e.stopImmediatePropagation();CHT.q=0;$('#qchat').style.display='none';return}return}
 if(e.code==bindOf('chat')&&!e.repeat){e.preventDefault();e.stopImmediatePropagation();chOpen()}else if(e.code==bindOf('quick')&&!e.repeat){e.preventDefault();e.stopImmediatePropagation();chQuickOpen()}},true);
addEventListener('keyup',e=>{if(CHT.open)e.stopImmediatePropagation()},true);
setInterval(()=>{if(CHT.q){CHT.qt-=.25;if(CHT.qt<=0){CHT.q=0;$('#qchat').style.display='none'}}if(!run&&CHT.open)chClose();chRender()},250);
{const _fr=featReset;featReset=function(){_fr.apply(this,arguments);CHT.log=[];CHT.rate={};CHT.q=0;chClose();chRender()}}

/* ===================== killcam.js ===================== */
/* ---------- feature 3: killcam and death recap. When you die you watch your killer from an over-the-shoulder camera (walls are respected, it eases in) while a panel shows who they are, their weapon,
   the distance, and their health; a recap lists the damage you took (per attacker, with weapon) and the damage you dealt to the person who killed you. Press the interact key to skip once
   it has run for a second. The respawn timer is extended so the killcam can finish. Can be switched off in Settings. ---------- */
const KC={on:0,t:0,dur:3.4,b:null,tp:null,cam:null,hist:[],deal:[],info:null};
{const _h=hurt;hurt=function(d,b){if(!P.dead&&d>0&&run)KC.hist.push({t:t0,d:Math.min(d,P.hp+P.sh),b:b||null,nm:b?(b.nm||'Enemy'):'',wk:b?b.wk:''});if(KC.hist.length>80)KC.hist.shift();return _h.apply(this,arguments)}}
{const _hb=hitBot;hitBot=function(b,d,head){if(d>0&&b&&b.al&&run&&!SK.nok){KC.deal.push({b,d:Math.min(d,b.hp+(b.sh||0)),t:t0});if(KC.deal.length>80)KC.deal.shift()}return _hb.apply(this,arguments)}}
{const _d=die;die=function(){const was=P.dead,k=lastBot;_d.apply(this,arguments);if(was||mode=='Zombies'||mode=='Survival'||over)return;try{kcStart(k)}catch(e){}}}
{const _dc=deathCam;deathCam=function(dt){_dc.apply(this,arguments);if(KC.on)try{kcCam(dt)}catch(e){}}}
{const _ft=featTick;featTick=function(dt){_ft.apply(this,arguments);try{kcamTick(dt)}catch(e){}}}
(function(){const hud=$('#hud');if(!hud)return;const k=document.createElement('div');k.id='kcam';hud.appendChild(k)})();
function kcStart(k){const live=OPT.kc&&k&&k.m&&k!==null,now=t0,rec=new Map();for(const h of KC.hist)if(now-h.t<6&&h.d>0){const key=h.nm||'Explosion';const r=rec.get(key)||{nm:key,d:0,wk:h.wk};r.d+=h.d;if(h.wk)r.wk=h.wk;rec.set(key,r)}
 let dealt=0;if(k)for(const x of KC.deal)if(x.b===k&&now-x.t<8)dealt+=x.d;
 KC.on=1;KC.t=0;KC.b=live?k:null;KC.tp=V(P.x,P.y+1,P.z);KC.cam=null;
 KC.info={nm:k?(k.nm||'Enemy'):'Unknown',wk:k&&k.wk?(W[k.wk]?W[k.wk].n:k.wk):'Explosive',dist:k?Math.round(Math.hypot(k.x-P.x,k.z-P.z)):0,team:k?k.team:0,rec:[...rec.values()].sort((a,b)=>b.d-a.d).slice(0,5),dealt:Math.round(dealt),live,hp0:k?Math.max(0,k.hp+(k.sh||0)):0};
 KC.hist=[];KC.deal=[];P.rt=Math.max(P.rt,live?KC.dur+.5:3.4);document.body.classList.add('kc-on');kcPanel()}
function kcPanel(){const e=$('#kcam'),I=KC.info;if(!e||!I)return;const wn=n=>String(n).replace(/[<>&]/g,'');
 e.innerHTML=`<div class="kc-top">${I.live?'<small>KILLCAM</small>':'<small>ELIMINATED</small>'}<b>${wn(I.nm).toUpperCase()}</b><span>${wn(I.wk)} · ${I.dist} m</span><div class="kc-hp"><i></i></div></div>
 <div class="kc-rec"><h4>DAMAGE TAKEN</h4>${I.rec.length?I.rec.map(r=>`<div><b>${wn(r.nm)}</b><span>${r.wk&&W[r.wk]?W[r.wk].n:'Explosion'}</span><i>${Math.round(r.d)}</i></div>`).join(''):'<div><b>Unknown</b><i>–</i></div>'}<h4>YOU DEALT</h4><div><b>${I.dealt>0?wn(I.nm):'Nothing'}</b><i>${I.dealt}</i></div></div>
 <div class="kc-bot"><span id="kc-rs"></span><em>Press <kbd>${keyName(bindOf('use'))}</kbd> to skip</em></div>`;e.style.display='block'}
function kcCam(dt){KC.t+=dt;const k=KC.b;if(!k||!k.m)return;const T=KC.tp,K=V(k.x,(k.y||0)+1,k.z);let dx=T.x-K.x,dz=T.z-K.z;const L=Math.hypot(dx,dz)||1;dx/=L;dz/=L;
 const want=V(K.x-dx*2.7-dz*.95,K.y+.85,K.z-dz*2.7+dx*.95),o=V(K.x,K.y+.6,K.z),dv=want.clone().sub(o),len=dv.length();dv.divideScalar(len||1);const tw=castW(o,dv,len);if(tw<len)want.copy(o).addScaledVector(dv,Math.max(.4,tw-.25));
 if(!KC.cam)KC.cam=C.position.clone();KC.cam.lerp(want,Math.min(1,dt*6));C.position.copy(KC.cam);C.lookAt(T.x,T.y+.25,T.z)}
function kcamTick(dt){const e=$('#kcam');if(!e)return;if(!KC.on)return;if(!P.dead||over){KC.on=0;e.style.display='none';document.body.classList.remove('kc-on');return}
 const rs=$('#kc-rs');if(rs)rs.textContent=KC.info&&KC.info.live?'Killcam · respawn in '+Math.max(0,P.rt).toFixed(1)+'s':'Respawn in '+Math.max(0,P.rt).toFixed(1)+'s';
 const k=KC.b,hp=e.querySelector('.kc-hp i');if(hp&&k)hp.style.width=Math.max(0,Math.min(100,k.hp+(k.sh||0)))+'%';
 if(KC.t>1&&(key.KeyF||key.Space||key[bindOf('use')])&&P.rt>.15&&mode!='Survival')P.rt=.1}

/* ===================== notes.js ===================== */
/* ---------- match notifications, redesigned. msg() (objective and match messages) and popup() (unlocks, streaks earned, level ups) now show as compact stacked toasts that sit BELOW the match bar
   (their position is measured from it, so they can never slide behind the scoreboard), at most 3 at a time, repeated messages refresh instead of stacking. Kill messages (+1 Kill, Headshot!, Double Kill!...)
   become small points under the crosshair that rise and fade. The old centre banner is hidden. ---------- */
const NT={list:[],last:'',lastT:0};
(function(){const hud=$('#hud');if(!hud)return;const c=document.createElement('div');c.id='notes';hud.appendChild(c);const p=document.createElement('div');p.id='pts';hud.appendChild(p)})();
const ntKind=t=>/\bflag\b|captur|zone|hill|hardpoint|domination|objective|secured|contested/i.test(t)?'obj':/ready|streak|uav|airstrike|nuke|care package|available|earned|unlocked|prestige|level/i.test(t)?'streak':/warning|danger|low|died|eliminated|lost/i.test(t)?'warn':'info';
function ntShow(html,kind,secs,key,card){const box=$('#notes');if(!box)return;const now=performance.now();
 const same=NT.list.find(n=>n.key==key&&!n.gone);if(same){same.t=now;same.life=secs;same.el.classList.remove('old','out');return}
 const el=document.createElement('div');el.className='nt '+kind+(card?' card':'');el.innerHTML=(card?'':'<i></i>')+html;box.appendChild(el);const n={el,t:now,life:secs,key,gone:0};NT.list.push(n);
 while(NT.list.filter(x=>!x.gone).length>3){const o=NT.list.find(x=>!x.gone);o.gone=1;o.el.classList.add('out');setTimeout(()=>o.el.remove(),350)}}
setInterval(()=>{const now=performance.now(),live=NT.list.filter(n=>!n.gone);for(const n of NT.list){if(!n.gone&&now-n.t>n.life*1000){n.gone=1;n.el.classList.add('out');setTimeout(()=>n.el.remove(),350)}}
 live.forEach((n,i)=>n.el.classList.toggle('old',i<live.length-1&&live.length>1));NT.list=NT.list.filter(n=>!n.gone||now-n.t<n.life*1000+600);
 const tb=$('#tbar'),r=tb&&tb.firstChild?tb.getBoundingClientRect():null;document.documentElement.style.setProperty('--ntop',((r&&r.height?r.bottom:34)+12)+'px')},180);
const esc_=x=>String(x).replace(/[&<>]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));
msg=function(t,s){t=String(t==null?'':t);if(!t)return;
 if(/^(\+\d+ Kill|Headshot!|Double Kill!|Triple Kill!|Overkill!|Killing Spree!)/i.test(t)){const p=$('#pts');if(!p)return;p.textContent='';const e=document.createElement('div');e.className='pt'+(/Headshot/i.test(t)?' hs':t[0]=='+'?'':' multi');e.textContent=t;p.appendChild(e);setTimeout(()=>e.remove(),1150);return}
 ntShow('<span>'+esc_(t)+'</span>',ntKind(t),Math.max(1.6,Math.min(4,(s||2)+.4)),t,0)};
popup=function(t,sub){ntShow('<strong>'+esc_(t)+'</strong><em>'+esc_(sub)+'</em>',ntKind(t+' '+sub),4,'p:'+t+sub,1);beep(880,.12,'triangle',.05);setTimeout(()=>beep(1320,.16,'triangle',.045),100)};

/* ===================== medals.js ===================== */
/* ---------- feature 4: medals and challenges. Medals are awarded in the match for how you play (first blood, longshot, revenge, close call, multikills, streaks, melee, explosives, air support, untouchable);
   each pays a little XP. Challenges: 3 daily and 3 weekly picked for the day / week, plus career challenges with tiers. Progress is saved on the device (signed), XP rewards go through the normal XP path.
   Screen: Multiplayer, Challenges. ---------- */
const MST={k:0,hs:0,melee:0,expl:0,streak:0,long:0,best:0,medals:{},dmg:0,t0:0,su:0,mk:[],lastKiller:null,noHit:0,cc:[],xp0:0};
const MEDALS={'First Blood':[50,'First kill of the match'],'Headshot':[10,'Kill with a headshot'],'Longshot':[40,'Kill from 50 m or more'],'Revenge':[40,'Kill the player who just killed you'],'Close Call':[30,'Kill while under 30 health'],
 'Double Kill':[25,'2 kills within 3.5 s'],'Triple Kill':[50,'3 kills within 3.5 s'],'Quad Kill':[100,'4 kills within 3.5 s'],'Killing Spree':[50,'5 kills in a row'],'Rampage':[100,'10 kills in a row'],'Unstoppable':[200,'15 kills in a row'],
 'Cold Steel':[30,'Melee kill'],'Frag Out':[25,'Kill with an explosive'],'Air Support':[25,'Kill with a scorestreak'],'Untouchable':[60,'5 kills without taking damage']};
const dayKey=()=>{const d=new Date();return d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0')};
const weekKey=()=>{const d=new Date(),t=Date.UTC(d.getFullYear(),d.getMonth(),d.getDate());return'W'+Math.floor((t/86400000+3)/7)};
const msReset=()=>{Object.assign(MST,{k:0,hs:0,melee:0,expl:0,streak:0,long:0,best:0,medals:{},dmg:0,t0:t0,su:0,mk:[],lastKiller:null,noHit:0,cc:[]})};
/* challenge definitions: [id, name, description, stat, goal, xp] */
const CHD=[['d1','Warm-up','Get 15 kills','kills',15,300],['d2','Sharpshooter','Get 8 headshots','headshots',8,400],['d3','Rifleman','12 kills with rifles','k_Rifles',12,350],['d4','Close Quarters','10 kills with SMGs and shotguns','k_Close Quarters',10,350],
 ['d5','Sidearm Specialist','6 kills with sidearms','k_Sidearms',6,400],['d6','Long Shot','2 kills from 50 m or more','longshots',2,450],['d7','Knife Fight','3 melee kills','melee',3,450],['d8','Frag Out','3 kills with explosives','explosive',3,400],
 ['d9','Call Down','Use 3 scorestreaks','streaksUsed',3,350],['d10','On a Roll','Play 3 matches','matches',3,300],['d11','Victory Lap','Win 2 matches','wins',2,500],['d12','Medal Hunter','Earn 6 medals','medals',6,300]];
const CHW=[['w1','Veteran','Get 120 kills','kills',120,1500],['w2','Headhunter','Get 50 headshots','headshots',50,1500],['w3','Winning Streak','Win 8 matches','wins',8,2000],['w4','Air Superiority','15 kills with scorestreaks','streakKills',15,1500],['w5','Marksman','10 kills from 50 m or more','longshots',10,1800],['w6','Sidearm Master','40 kills with sidearms','k_Sidearms',40,1500]];
const CHC=[['c1','Centurion','kills',[100,500,2500],[500,1500,4000]],['c2','Headshot Hunter','headshots',[50,250,1000],[500,1500,4000]],['c3','Veteran of Arms','wins',[10,50,200],[600,2000,5000]],['c4','Medal Collector','medals',[25,100,400],[500,1500,4000]]];
const hs2=x=>{let a=0x9e3779b9,b=0x85ebca6b;const t=x+'|ch|sd77';for(let i=0;i<t.length;i++){a=Math.imul(a^t.charCodeAt(i),2654435761);b=Math.imul(b^t.charCodeAt(i),1597334677)}return((a^b)>>>0).toString(36)};
const rngS=seed=>{let s=0;for(const c of seed)s=(s*31+c.charCodeAt(0))>>>0;return()=>{s=(Math.imul(s,1664525)+1013904223)>>>0;return s/4294967296}};
const pickS=(pool,seed,n)=>{const r=rngS(seed),a=pool.slice(),o=[];while(o.length<n&&a.length)o.push(a.splice(Math.floor(r()*a.length),1)[0]);return o};
let CHST=null;
function chFresh(){return{v:1,day:dayKey(),week:weekKey(),d:{},w:{},done:{},c:{},tier:{},medals:{}}}
function chLoad(){let o=null;try{const raw=JSON.parse(localStorage.getItem('sd-ch')||'null');if(raw&&raw.g===hs2(JSON.stringify({...raw,g:0})))o=raw}catch(e){}CHST=o||chFresh();chRoll()}
function chSave(){CHST.g=0;CHST.g=hs2(JSON.stringify(CHST));try{localStorage.setItem('sd-ch',JSON.stringify(CHST))}catch(e){}}
function chRoll(){const dk=dayKey(),wk=weekKey();let ch=0;if(CHST.day!=dk){CHST.day=dk;CHST.d={};for(const k of Object.keys(CHST.done))if(k[0]=='d')delete CHST.done[k];ch=1}if(CHST.week!=wk){CHST.week=wk;CHST.w={};for(const k of Object.keys(CHST.done))if(k[0]=='w')delete CHST.done[k];ch=1}if(ch)chSave()}
const chActive=()=>({d:pickS(CHD,CHST.day,3),w:pickS(CHW,CHST.week,3)});
function chEv(stat,n=1){if(!CHST)chLoad();chRoll();const A=chActive();let any=0;
 for(const [grp,list] of [['d',A.d],['w',A.w]])for(const c of list){if(c[3]!=stat)continue;const key=grp+':'+c[0];if(CHST.done[key])continue;CHST[grp][c[0]]=Math.min(c[4],(CHST[grp][c[0]]||0)+n);any=1;
  if(CHST[grp][c[0]]>=c[4]){CHST.done[key]=1;MST.cc.push([c[1],c[5]]);try{giveXP(c[5])}catch(e){}popup('CHALLENGE COMPLETE',c[1]+' · +'+c[5]+' XP')}}
 for(const c of CHC){if(c[2]!=stat)continue;CHST.c[stat]=(CHST.c[stat]||0)+n;any=1;const t=CHST.tier[c[0]]||0;if(t<3&&CHST.c[stat]>=c[3][t]){CHST.tier[c[0]]=t+1;MST.cc.push([c[1]+' '+['I','II','III'][t],c[4][t]]);try{giveXP(c[4][t])}catch(e){}popup('CAREER · '+c[1].toUpperCase()+' '+['I','II','III'][t],'+'+c[4][t]+' XP')}}
 if(any)chSave()}
chLoad();
function msMedal(name){const m=MEDALS[name];if(!m)return;MST.medals[name]=(MST.medals[name]||0)+1;CHST.medals[name]=(CHST.medals[name]||0)+1;try{giveXP(m[0])}catch(e){}ntShow('<span>★ '+name.toUpperCase()+' · +'+m[0]+' XP</span>','streak',2.6,'m:'+name+performance.now(),0);chEv('medals')}
function msKill(b,head){const s=String(src||''),stk=!!SK.nok,d=Math.hypot(b.x-P.x,b.z-P.z),cat=!stk&&srcK&&typeof catOf=='function'?catOf(srcK):'';
 MST.k++;MST.noHit++;MST.best=Math.max(MST.best,ks);chEv('kills');
 if(head){MST.hs++;chEv('headshots');msMedal('Headshot')}
 if(stk){MST.streak++;chEv('streakKills');msMedal('Air Support')}else if(s=='Melee'){MST.melee++;chEv('melee');msMedal('Cold Steel')}else if(s=='Explosive'){MST.expl++;chEv('explosive');msMedal('Frag Out')}
 if(cat)chEv('k_'+cat);
 if(!stk&&srcK&&d>=50){MST.long++;chEv('longshots');msMedal('Longshot')}
 if(MST.k==1&&t0-MST.t0<60)msMedal('First Blood');
 if(MST.lastKiller&&b===MST.lastKiller){MST.lastKiller=null;msMedal('Revenge')}
 if(P.hp+P.sh<=30&&P.hp>0)msMedal('Close Call');
 const now=t0;MST.mk=MST.mk.filter(x=>now-x<3.5);MST.mk.push(now);const c=MST.mk.length;if(c==2)msMedal('Double Kill');else if(c==3)msMedal('Triple Kill');else if(c==4)msMedal('Quad Kill');
 if(ks==5)msMedal('Killing Spree');else if(ks==10)msMedal('Rampage');else if(ks==15)msMedal('Unstoppable');
 if(MST.noHit==5)msMedal('Untouchable')}
{const _fk=featKill;featKill=function(b,h){const r=_fk.apply(this,arguments);try{msKill(b,h)}catch(e){console.error(e)}return r}}
{const _h=hurt;hurt=function(d,b){if(!P.dead&&d>0)MST.noHit=0;return _h.apply(this,arguments)}}
{const _d=die;die=function(){const was=P.dead,k=lastBot;_d.apply(this,arguments);if(!was){MST.lastKiller=k||null;MST.noHit=0;MST.mk=[]}}}
{const _hb=hitBot;hitBot=function(b,d,head){if(d>0&&b&&b.al&&run)MST.dmg+=Math.min(d,b.hp+(b.sh||0));return _hb.apply(this,arguments)}}
{const _us=useStreak;useStreak=function(){const n=q.length,r=_us.apply(this,arguments);if(q.length<n){MST.su++;chEv('streaksUsed')}return r}}
{const _sg=startGame;startGame=function(){msReset();return _sg.apply(this,arguments)}}
{const _eg=endGame;endGame=function(t){const was=over,r=_eg.apply(this,arguments);if(!was&&over&&mode!='Zombies'&&mode!='Survival'){chEv('matches');if(won)chEv('wins')}return r}}
/* challenges screen */
(function(){const nav=$('#nav'),main=$('main');if(!nav||!main)return;const b=document.createElement('button');b.dataset.p='chal';b.className='mp';b.textContent='Challenges';const ld=nav.querySelector('button[data-p=load]');nav.insertBefore(b,ld?ld.nextSibling:null);
 const sec=document.createElement('section');sec.id='p-chal';sec.className='pn';main.appendChild(sec);
 b.onclick=()=>{$$('#nav button').forEach(x=>x.classList.toggle('on',x==b));$$('.pn').forEach(p=>p.classList.toggle('on',p.id=='p-chal'));chRenderUI()}})();
function chLeft(ms){const m=Math.max(0,Math.floor(ms/60000)),d=Math.floor(m/1440),h=Math.floor(m%1440/60);return d?d+'d '+h+'h':h+'h '+m%60+'m'}
function chRenderUI(){const e=$('#p-chal');if(!e)return;chRoll();const A=chActive(),now=new Date(),dRes=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1)-now,wDay=(now.getDay()+6)%7,wRes=new Date(now.getFullYear(),now.getMonth(),now.getDate()+(7-wDay))-now;
 const row=(grp,c)=>{const key=grp+':'+c[0],p=CHST[grp][c[0]]||0,done=!!CHST.done[key];return`<div class="chr ${done?'dn':''}"><div class="cht"><b>${c[1]}</b><span>${c[2]}</span></div><div class="chb"><i style="width:${Math.min(100,p/c[4]*100)}%"></i></div><div class="chn">${done?'COMPLETE':p+' / '+c[4]}<em>+${c[5]} XP</em></div></div>`};
 const car=c=>{const t=CHST.tier[c[0]]||0,v=CHST.c[c[2]]||0,g=c[3][Math.min(t,2)];return`<div class="chr ${t>=3?'dn':''}"><div class="cht"><b>${c[1]}</b><span>Tier ${Math.min(t+1,3)} of 3${t>=3?' (complete)':''}</span></div><div class="chb"><i style="width:${t>=3?100:Math.min(100,v/g*100)}%"></i></div><div class="chn">${t>=3?'MAX':v+' / '+g}<em>+${c[4][Math.min(t,2)]} XP</em></div></div>`};
 e.innerHTML=`<h2>Challenges</h2><p class="sub">Daily and weekly challenges rotate automatically. Rewards are XP. Progress is saved on this device.</p><div class="chg"><div class="chc"><h3>Daily <small>resets in ${chLeft(dRes)}</small></h3>${A.d.map(c=>row('d',c)).join('')}</div><div class="chc"><h3>Weekly <small>resets in ${chLeft(wRes)}</small></h3>${A.w.map(c=>row('w',c)).join('')}</div><div class="chc"><h3>Career</h3>${CHC.map(car).join('')}</div></div>
 <h3 class="chh">Medals</h3><div class="chm">${Object.keys(MEDALS).map(n=>{const c=CHST.medals[n]||0;return`<div class="md ${c?'on':''}" title="${MEDALS[n][1]}"><b>★</b><span>${n}</span><i>${c}</i></div>`}).join('')}</div>`}
/* ===================== aar.js ===================== */
/* ---------- feature 5: after action report. The post-match board gets a full report: your result, MVP badge, K/D, accuracy, headshots, damage, best streak, time played, XP, the medals you earned and the challenges you completed. ---------- */
{const _fs=finStart;finStart=function(t,sc,nb,xp){const r=_fs.apply(this,arguments);try{aarInject(t)}catch(e){console.error(e)}return r}}
function aarInject(t){const f=$('#fbd'),c=$('#fcont');if(!f||!c)return;const rows=(typeof finInfo!='undefined'&&finInfo&&finInfo.rows)||[],me=rows.findIndex(r=>r.me),mvp=me==0&&rows.length>1,acc=shots?Math.round(hits/shots*100):0,kd=deaths?(kills/deaths).toFixed(2):kills.toFixed(2),mins=Math.max(0,t0-MST.t0),tm=Math.floor(mins/60)+':'+String(Math.floor(mins%60)).padStart(2,'0'),
 box=(l,v,s)=>`<div class="ab"><i>${l}</i><b>${v}</b>${s?`<em>${s}</em>`:''}</div>`,md=Object.keys(MST.medals);
 const h=`<div class="aar">${mvp?'<div class="mvp">★ MVP · top of the board</div>':''}<div class="aag">${box('K/D',kd,kills+' / '+deaths)}${box('Accuracy',acc+'%',hits+' of '+shots+' shots')}${box('Headshots',MST.hs,kills?Math.round(MST.hs/kills*100)+'% of kills':'')}${box('Damage',Math.round(MST.dmg))}${box('Best streak',MST.best)}${box('Time',tm)}</div>
 ${md.length?`<h4>Medals earned</h4><div class="aam">${md.map(n=>`<span><b>★</b>${n}${MST.medals[n]>1?' x'+MST.medals[n]:''}</span>`).join('')}</div>`:''}${MST.cc.length?`<h4>Challenges completed</h4><div class="aac">${MST.cc.map(x=>`<div><span>${x[0]}</span><i>+${x[1]} XP</i></div>`).join('')}</div>`:''}</div>`;
 f.classList.add('hasaar');c.insertAdjacentHTML('beforebegin',h)}
/* ===================== threat.js ===================== */
/* ---------- feature 6: threat awareness. Live grenades near you show a pulsing arrow around the crosshair pointing at them (red for frags, white for flashbangs) with a warning beep, and enemy footsteps are heard
   in 3D: left/right by direction, louder when closer, muffled behind walls, faster when sprinting, silent when crouched or prone. Both can be switched off in Settings. ---------- */
(function(){const hud=$('#hud');if(!hud)return;const d=document.createElement('div');d.id='danger';hud.appendChild(d)})();
const TH={pool:[],fsT:new WeakMap(),warned:new WeakSet()};
function thArrow(i){let e=TH.pool[i];if(!e){e=document.createElement('div');e.className='dg';e.innerHTML='<i></i><b></b>';$('#danger').appendChild(e);TH.pool[i]=e}return e}
function thStep(b,dist,ang,blocked){try{ac=ac||new AudioContext();const t=ac.currentTime,g=ac.createGain(),p=ac.createStereoPanner?ac.createStereoPanner():null,f=ac.createBiquadFilter(),len=Math.floor(ac.sampleRate*.07),bf=ac.createBuffer(1,len,ac.sampleRate),d=bf.getChannelData(0);for(let i=0;i<len;i++)d[i]=(Math.random()*2-1)*Math.pow(1-i/len,2.2);
 const s=ac.createBufferSource();s.buffer=bf;f.type='lowpass';f.frequency.value=blocked?320:760+(Math.random()-.5)*160;g.gain.value=Math.max(.0001,(blocked?.5:1)*.2*Math.pow(Math.max(0,1-dist/26),1.5)*(typeof vol=='number'?vol:1));
 s.connect(f);f.connect(g);if(p){p.pan.value=Math.max(-1,Math.min(1,Math.sin(ang)));g.connect(p);p.connect(ac.destination)}else g.connect(ac.destination);s.start(t);
 const o=ac.createOscillator(),og=ac.createGain();o.type='sine';o.frequency.setValueAtTime(95,t);o.frequency.exponentialRampToValueAtTime(55,t+.06);og.gain.setValueAtTime(g.gain.value*.9,t);og.gain.exponentialRampToValueAtTime(.0001,t+.07);o.connect(og);og.connect(p||ac.destination);o.start(t);o.stop(t+.08)}catch(e){}}
function thTick(dt){const box=$('#danger');if(!box)return;const on=OPT.threat!==0,fsOn=OPT.steps!==0;
 if(!run||P.dead||over||(typeof xrS!='undefined'&&xrS)){for(const e of TH.pool)e.style.display='none';return}
 const fx=-Math.sin(yaw),fz=-Math.cos(yaw),rx=Math.cos(yaw),rz=-Math.sin(yaw),rel=(dx,dz)=>Math.atan2(dx*rx+dz*rz,dx*fx+dz*fz);
 /* grenades */
 let n=0;if(on)for(const g of grs){if(!g||!g.p||!(g.t>0))continue;const dx=g.p.x-P.x,dz=g.p.z-P.z,dist=Math.hypot(dx,dz);if(dist>13||Math.abs(g.p.y-(P.y||0))>6)continue;const e=thArrow(n++),ang=rel(dx,dz),tac=g.g&&g.g.tac,near=1-dist/13;
  e.style.display='block';e.style.opacity=(.45+.55*near)*(g.t<.8&&Math.floor(g.t*10)%2?.4:1);e.style.transform=`translate(-50%,-50%) rotate(${ang}rad) translateY(-${96+(1-near)*20}px)`;e.className='dg '+(tac?'fl':'fr');e.lastChild.textContent=Math.round(dist)+'m';e.lastChild.style.transform=`rotate(${-ang}rad)`;
  if(!TH.warned.has(g)){TH.warned.add(g);if(dist<9){beep(1500,.09,'square',.05);setTimeout(()=>beep(1500,.09,'square',.05),130)}}}
 for(let i=n;i<TH.pool.length;i++)TH.pool[i].style.display='none';
 /* footsteps */
 if(fsOn)for(const b of bots){if(!b.al||b.net&&b.local)continue;const lp=TH.fsT.get(b)||{x:b.x,z:b.z,t:0};const v=Math.hypot(b.x-lp.x,b.z-lp.z)/Math.max(dt,.001);lp.x=b.x;lp.z=b.z;
  const ally=typeof teamMode=='function'&&teamMode()&&b.team&&b.team===myTeam;if(ally||v<1.3||v>16||(b.pc||0)>.5||(b.pp||0)>.5||(b.psl||0)>.3){TH.fsT.set(b,lp);continue}
  lp.t+=dt;const iv=v>5?.27:v>3.2?.38:.56;if(lp.t>=iv){lp.t=0;const dx=b.x-P.x,dz=b.z-P.z,dist=Math.hypot(dx,dz);if(dist<26){let bl=false;try{const o=V(P.x,(P.y||0)+1.4,P.z),dv=V(dx,0,dz).normalize();bl=castW(o,dv,dist)<dist-.5}catch(e){}thStep(b,dist,rel(dx,dz),bl)}}TH.fsT.set(b,lp)}}
{const _ft=featTick;featTick=function(dt){_ft.apply(this,arguments);try{thTick(dt)}catch(e){console.error(e)}}}
(function(){const hd=$('#o-hold');if(!hd||!hd.parentNode)return;const mk=(id,label)=>{const l=document.createElement('label');l.innerHTML=label+'<select id="'+id+'"><option value="1">On</option><option value="0">Off</option></select>';return l};
 const a=mk('o-threat','Threat indicators (grenade danger arrows)'),b=mk('o-steps','Enemy footstep audio');hd.parentNode.insertAdjacentElement('afterend',a);a.insertAdjacentElement('afterend',b);
 const sa=$('#o-threat'),sb=$('#o-steps');sa.value=OPT.threat===0?'0':'1';sb.value=OPT.steps===0?'0':'1';sa.onchange=()=>{OPT.threat=+sa.value;optSave()};sb.onchange=()=>{OPT.steps=+sb.value;optSave()}})();

/* ===================== anticheat.js ===================== */
/* ---------- anti-cheat. Everything lives inside this closure, so it cannot be reached or switched off from the browser console.
   PROGRESS: levels, prestige, weapon kills and camo progress are signed. Anything that changes them outside the game's own functions (console scripts, hack menus, edited storage)
   is caught, flagged, and the profile is reset to a fresh one the next time the game is opened. The dev menu only works from a real mouse click, not from scripts.
   MATCH: god mode (hurt overridden, damage never lowering health, health far above the maximum), double damage (weapon table edited, damage functions replaced, impossible shots) and replaced game functions.
   Browser-side protection stops copy-paste exploits and casual tools; anyone can still edit client code they control, so real security needs a server. ---------- */
(function(){
 const SALT='sd9|'+'q7Zt'+'41xA'+'|spartan',KS='sd-sig',KF='sd-cheat';
 const hs=s=>{let a=0xdeadbeef,b=0x41c6ce57;for(let i=0;i<s.length;i++){const c=s.charCodeAt(i);a=Math.imul(a^c,2654435761);b=Math.imul(b^c,1597334677)}a=Math.imul(a^(a>>>16),2246822507)^Math.imul(b^(b>>>13),3266489909);b=Math.imul(b^(b>>>16),2246822507)^Math.imul(a^(a>>>13),3266489909);return(4294967296*(2097151&b)+(a>>>0)).toString(36)};
 const core0=()=>JSON.stringify([prof.lvl,prof.xp,prof.pres,prof.master,prof.ml,prof.all?1:0,prof.zbest||0,Object.keys(prof.wk||{}).sort().map(k=>{const w=prof.wk[k]||{};return[k,w.k|0,w.c|0,w.p|0,w.z|0]}).filter(r=>r[1]||r[2]||r[3]||r[4])]);
 const core=()=>core0()+'|'+(prof.tok|0)+'|'+JSON.stringify((prof.perm||[]).slice().sort())+(prof.dev?'|dev':'');
 const coreOld=()=>core0();const sigOld=()=>hs(core0()+SALT);const sig=()=>hs(core()+SALT);
 const store=(k,v)=>{try{if(v==null)localStorage.removeItem(k);else localStorage.setItem(k,v)}catch(e){}};
 const fetch_=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
 let last='',flagged=0,legit=0,devOK=0,slowT=0,overT=0,still=0,hist=[],inShot=0;
 const resync=()=>{last=core();store(KS,sig())};
 /* progress that can never be true for an honest profile */
 const bad=()=>{if(!prof||typeof prof!='object')return'profile';if(prof.dev)return 0;if(prof.all&&!devOK&&fetch_(KS)!==sig())return'unlock-all';if(!(prof.lvl>=1&&prof.lvl<=55)||prof.pres>10||prof.pres<0||prof.ml>1250||prof.ml<1)return'range';
  if((prof.tok|0)<0||((prof.perm||[]).length+(prof.tok|0))>(prof.pres|0)||!Array.isArray(prof.perm||[]))return'tokens';for(const v of prof.perm||[])if(!UNL[v])return'perm';
  for(const k in prof.wk||{}){const w=prof.wk[k];if(!w||w.c>w.k+1||w.k<0||w.c<0||w.p>3)return'counters'}
  if(!prof.all){let ok;try{ok=okSet()}catch(e){ok=null}if(ok)for(const k in prof.camo||{}){const v=prof.camo[k];if(v&&typeof v=='string'&&!ok.has(k+':'+v))return'camo'}}return 0};
 const note=m=>{try{const d=document.createElement('div');d.style.cssText='position:fixed;inset:0;z-index:99999;background:#000d;color:#fff;display:flex;align-items:center;justify-content:center;text-align:center;font:600 22px Rajdhani,sans-serif;padding:30px';d.innerHTML='<div><div style="font:700 56px Teko,sans-serif;color:#ff5a3a;letter-spacing:3px">'+m[0]+'</div><p>'+m[1]+'</p><button style="padding:10px 26px;font:700 20px Teko,sans-serif;cursor:pointer" onclick="this.parentNode.parentNode.remove()">OK</button></div>';document.body.appendChild(d)}catch(e){}};
 const wipe=why=>{const fresh={v:1,lvl:1,xp:0,pres:0,master:0,ml:1,tok:0,perm:[],wk:{},camo:{}};for(const k of Object.keys(prof))delete prof[k];Object.assign(prof,fresh);try{L.ks=SK_DEF.slice()}catch(e){}store('sd-slots',null);store('sd-slot',null);try{save()}catch(e){}resync();store(KF,null);devOK=0;try{sanitize();showRank()}catch(e){}
  note(['PROGRESS RESET','Cheating or tampering was detected on this profile ('+why+'). Levels, unlocks, weapon progress and camos have been reset.'])};
 /* the strike: remember it, break the signature, end the match. The reset itself happens the next time the game is opened. */
 const strike=why=>{if(flagged)return;flagged=1;store(KF,String(why).slice(0,60));store(KS,'x'+Date.now().toString(36));try{if(run&&!over){run=0;over=1;paused=0;document.exitPointerLock&&document.exitPointerLock();$('#hud').style.display='none';$('#menu').style.display='block'}}catch(e){}
  note(['CHEAT DETECTED','A modified game was detected ('+why+'). The match was ended and this profile will be reset the next time you log in.'])};
 /* gameplay detections that could in theory be a false alarm (health, damage, weapon numbers) end the match with a warning and only count as a strike when they repeat; tampering with progress, the weapon table or game functions is a hard strike */
 const softN=()=>{try{return+localStorage.getItem('sd-gs')||0}catch(e){return 0}};let softHit=0,suitMax=0,suitT0=0,suitReg=0;const SUITS={jugg:[60,300],goliath:[50,520]};
 const endMatch=()=>{try{if(run&&!over){run=0;over=1;paused=0;document.exitPointerLock&&document.exitPointerLock();$('#hud').style.display='none';$('#menu').style.display='block'}}catch(e){}};
 const soft=why=>{if(flagged||softHit)return;softHit=1;const n=softN()+1;store('sd-gs',String(n));if(n>=3){strike('repeated unusual game states: '+why);return}endMatch();note(['MATCH ENDED','An unusual game state was detected ('+why+'). If you did not modify the game this was a false alarm and nothing was changed on your profile. Repeated detections reset it.'])};
 /* suits are registered when the game starts one: only Juggernaut and Goliath with their real time and health are accepted, and the health caps below follow the registered suit, so nothing is switched off while a suit is active */
 {const _ss=skStartSuit;skStartSuit=function(k,t,mhp,sp,wk){const d=SUITS[k];if(!d||d[0]!==t||d[1]!==mhp){strike('invalid suit: '+k+' '+t+' '+mhp);return}suitMax=mhp;suitT0=t;suitReg=1;return _ss.apply(this,arguments)}}
 /* on load: flagged last time, stored signature does not match, or an impossible profile */
 {const f=fetch_(KF),sg=fetch_(KS);let why=f?'flagged: '+f:0;if(!why){if(sg==null){why=prof.all?'unlock-all':bad()}else if(sg!==sig()&&sg!==sigOld())why='profile edited outside the game';else why=bad()}
  if(why)wipe(why);else{/* profiles from before unlock tokens existed: prestiges already earned are paid out once */if(prof.tok==null){prof.tok=Math.min(10,prof.pres|0);prof.perm=[];try{save()}catch(e){}}resync()}}
 /* the game's own progress functions: the signature is refreshed right after they run */
 const guard=name=>{const o=globalThis[name];return function(){legit++;try{return o.apply(this,arguments)}finally{legit--;if(!legit&&!flagged&&!bad())resync()}}};
 giveXP=guard('giveXP');wkill=guard('wkill');wzkill=guard('wzkill');zRoundDone=guard('zRoundDone');wpres=guard('wpres');doPrestige=guard('doPrestige');tokenSpend=guard('tokenSpend');
 {const dv=$('#dev'),od=dv&&dv.onclick;if(dv&&od)dv.onclick=function(e){if(!e||!e.isTrusted){strike('dev menu used by a script');return}if(e.target&&e.target.dataset&&e.target.dataset.d=='reset')store(KS,null);devOK=1;legit++;try{od.call(this,e)}finally{legit--;if(!flagged)resync()}}}
 /* damage taken while a hit lands: it must lower health, and not be absorbed forever */
 {const _h=hurt;hurt=function(d,b){const was=P.dead,pre=P.hp+P.sh;_h.apply(this,arguments);if(!was&&d>1&&run&&!over&&mode!='Zombies'&&!(typeof OI!='undefined'&&OI.on)&&!P.dead){const post=P.hp+P.sh;if(post>=pre-.0001){if(++still>=5)soft('invulnerable')}else{still=0;hist.push([performance.now(),pre-post])}}}}
 /* a single shot can never deal this much (streaks, the nuke and One in the Chamber are excluded) */
 {const _s=shoot;shoot=function(){inShot++;try{return _s.apply(this,arguments)}finally{inShot--}}}
 {const _hb=hitBot;hitBot=function(b,d,head){if(inShot&&d>480&&mode!='Zombies'&&!SK.nok&&!SK.nk&&!(typeof OI!='undefined'&&OI.on)&&!(cw()&&cw().heavy))soft('impossible damage');return _hb.apply(this,arguments)}}
 {const _sg=startGame;startGame=function(){hist=[];still=0;overT=0;softHit=0;return _sg.apply(this,arguments)}}
 {const _eg=endGame;endGame=function(){const r=_eg.apply(this,arguments);if(!softHit&&!flagged){const n=softN();if(n>0)store('sd-gs',String(n-1))}return r}}
 /* references to the functions that decide progress and damage, taken now that every script has loaded */
 const names_=['skStartSuit','giveXP','wkill','wzkill','zRoundDone','wpres','doPrestige','tokenSpend','permHas','unlocked','okSet','camos','zcamos','allCamos','wd','hurt','die','hitBot','takeDmg','eff','shoot','respawn','startGame','boom','featKill'],ref=names_.map(n=>globalThis[n]);
 const WSN={};for(const k in W){const w=W[k];WSN[k]=[w.d,w.r,w.m,w.pel,w.sp,w.rc,w.rl,w.ex?w.ex.d:0,w.ex?w.ex.R:0]}
 const wchg=()=>{for(const k in WSN){const w=W[k];if(!w)return k+' removed';const n=[w.d,w.r,w.m,w.pel,w.sp,w.rc,w.rl,w.ex?w.ex.d:0,w.ex?w.ex.R:0],o=WSN[k];for(let i=0;i<n.length;i++)if(n[i]!==o[i])return'weapon table '+k}for(const k in W)if(!WSN[k])return'new weapon '+k;return 0};
 /* cheap checks every frame, the heavy ones about once a second */
 const tick=dt=>{if(flagged)return;
  for(let i=0;i<names_.length;i++)if(globalThis[names_[i]]!==ref[i]){strike('game function replaced: '+names_[i]);return}
  if(!SK.suit)suitReg=0;else if(!suitReg||SK.suit.t>suitT0+1||SK.suit.k&&!SUITS[SK.suit.k]){soft('suit state edited');return}
  const hpCap=SK.suit?suitMax:400;
  if(run&&!over&&P&&!P.dead){
   if(P.hp>P.mhp+.5||P.sh>P.msh+.5){overT+=dt||.016;if(overT>3)soft('health above maximum')}else overT=0;
   if(P.mhp>hpCap||P.msh>400||(SK.suit&&P.mhp<suitMax-.5&&P.mhp>0&&false))soft('health maximum edited');
   const n=performance.now();if(hist.length){hist=hist.filter(x=>n-x[0]<10000);let tot=0;for(const x of hist)tot+=x[1];if(tot>Math.max(650,hpCap*2.2))soft('took '+Math.round(tot)+' damage without dying')}}
  slowT-=dt||.016;if(slowT>0)return;slowT=.9;
  const b=bad();if(b){strike(b);return}
  if(!legit&&core()!==last){strike('progress edited from outside the game');return}
  const wc=wchg();if(wc){strike(wc);return}
  if(run&&!over&&mode!='Zombies'&&!(typeof OI!='undefined'&&OI.on)&&wp)for(const w of wp){const bs=W[w.k];if(bs&&!w.heavy&&w.d>bs.d*1.34+.01){soft('weapon damage edited: '+w.k);return}}};
 setInterval(()=>tick(.9),900);
 {const _ft=featTick;featTick=function(dt){_ft.apply(this,arguments);tick(dt)}}
 ref[names_.indexOf('hurt')]=hurt;ref[names_.indexOf('hitBot')]=hitBot;ref[names_.indexOf('shoot')]=shoot;ref[names_.indexOf('startGame')]=startGame;

 /* ---------- secret menu: click the S of SPARTAN five times, then type "ohio". Real clicks and key presses only (scripts cannot open it or press its buttons). Everything it changes is signed, so the anti-cheat accepts it;
    a profile edited here is marked as a dev profile. ---------- */
 {let arm=0,clicks=0,ct=0,buf='';for(const h of document.querySelectorAll('#brand h1,#home header h1'))if(!h.querySelector('.sS'))h.innerHTML=h.innerHTML.replace(/^S/,'<span class="sS">S</span>');
  const lab=k=>k.startsWith('sk:')?((STK[k.slice(3)]||{n:k}).n+' (streak)'):((typeof nm=='function'?nm(k):k)),itm=k=>`${lab(k)}`;
  const el=document.createElement('div');el.id='secret';el.style.display='none';document.body.appendChild(el);
  const apply=fn=>{legit++;devOK=1;try{prof.dev=1;fn();try{save()}catch(e){}}finally{legit--;resync()}for(const f of[()=>showRank(),()=>masteryUI(),()=>ldRender()])try{f()}catch(e){}render()};
  const num=(id,lo,hi,d)=>{const v=parseInt((el.querySelector('#'+id)||{}).value,10);return isNaN(v)?d:Math.max(lo,Math.min(hi,v))};
  function render(){const scr=el.querySelector('.sc-body'),top=scr?scr.scrollTop:0,p=prof,keys=Object.keys(UNL).sort((a,b)=>UNL[a]-UNL[b]||a.localeCompare(b));
   el.innerHTML=`<div class="sc"><div class="sc-h"><b>SECRET MENU</b><span>${p.dev?'dev profile':'changes mark this profile as a dev profile'}</span><button data-s="close">✕</button></div><div class="sc-body">
   <h4>Level and prestige</h4><div class="scr"><label>Level (1-55)<input id="s-lvl" type="number" min="1" max="55" value="${p.lvl}"></label><label>Prestige (0-10)<input id="s-pres" type="number" min="0" max="10" value="${p.pres|0}"></label><label>Master level<input id="s-ml" type="number" min="1" max="1250" value="${p.ml||1}"></label><label class="ck"><input id="s-mas" type="checkbox" ${p.master?'checked':''}>Prestige Master</label><label>Unlock tokens<input id="s-tok" type="number" min="0" max="99" value="${p.tok|0}"></label><button data-s="rank">Apply</button><button data-s="max">Level 55</button></div>
   <h4>Unlocks</h4><div class="scr"><button data-s="all">${p.all?'Unlock-all is ON (turn off)':'Unlock everything'}</button><button data-s="perm">Permanently unlock every item</button><button data-s="lock">Lock everything again</button></div>
   <div class="scl">${keys.map(k=>`<label class="ck ${unlocked(k)?'on':''}"><input type="checkbox" data-sp="${k}" ${(p.perm||[]).includes(k)?'checked':''}>${itm(k)} <i>lv ${UNL[k]}</i></label>`).join('')}</div>
   <h4>Weapons and camos</h4><div class="scr"><button data-s="camos">Unlock every camo (max all weapons)</button><button data-s="camoreset">Reset all weapon progress and camos</button><button data-s="camoclear">Unequip all camos</button></div>
   <div class="scr"><label>Weapon<select id="s-wk">${Object.keys(W).map(k=>`<option value="${k}">${W[k].n}</option>`).join('')}</select></label><label>Kills<input id="s-wkk" type="number" min="0" max="99999" value="${((p.wk||{})[Object.keys(W)[0]]||{}).k|0}"></label><label>Prestige<select id="s-wp"><option>0</option><option>1</option><option>2</option><option>3</option></select></label><button data-s="wset">Set weapon</button></div>
   <h4>Zombies</h4><div class="scr"><label>Best round<input id="s-zb" type="number" min="0" max="999" value="${p.zbest|0}"></label><button data-s="zset">Set</button></div>
   <h4>Danger</h4><div class="scr"><button class="dg" data-s="reset">Reset everything</button></div></div></div>`;
   const b=el.querySelector('.sc-body');if(b)b.scrollTop=top;const sel=el.querySelector('#s-wk');if(sel)sel.onchange=()=>{const w=(prof.wk||{})[sel.value]||{};el.querySelector('#s-wkk').value=w.k|0;el.querySelector('#s-wp').value=w.p|0}}
  const act={close(){el.style.display='none'},
   rank(){apply(()=>{const m=el.querySelector('#s-mas').checked;prof.lvl=num('s-lvl',1,55,prof.lvl);prof.xp=0;prof.pres=num('s-pres',0,10,prof.pres|0);prof.tok=num('s-tok',0,99,0);if(m){prof.master=1;prof.pres=10;prof.ml=num('s-ml',1,1250,1)}else{prof.master=0;prof.ml=1}})},
   max(){apply(()=>{prof.lvl=55;prof.xp=0})},all(){apply(()=>{prof.all=prof.all?0:1})},
   perm(){apply(()=>{prof.perm=Object.keys(UNL)})},lock(){apply(()=>{prof.perm=[];prof.all=0;prof.lvl=1;prof.xp=0;prof.pres=0;prof.master=0;prof.tok=0})},
   camos(){apply(()=>{for(const k in W){const w=wd(k);w.k=w.c=w.z=30000;w.p=3}})},camoreset(){apply(()=>{prof.wk={};prof.camo={}})},camoclear(){apply(()=>{prof.camo={}})},
   wset(){apply(()=>{const k=el.querySelector('#s-wk').value,w=wd(k);w.k=w.c=num('s-wkk',0,99999,0);w.p=num('s-wp',0,3,0)})},zset(){apply(()=>{prof.zbest=num('s-zb',0,999,0)})},
   reset(){if(!confirm('Reset all progress?'))return;apply(()=>{const dv=1;for(const k of Object.keys(prof))delete prof[k];Object.assign(prof,{v:1,lvl:1,xp:0,pres:0,master:0,ml:1,tok:0,perm:[],wk:{},camo:{},dev:dv});try{L.ks=SK_DEF.slice()}catch(e){}})}};
  el.addEventListener('click',e=>{if(!e.isTrusted){strike('secret menu used by a script');return}const b=e.target.closest('[data-s]');if(b&&act[b.dataset.s])act[b.dataset.s]()});
  el.addEventListener('change',e=>{if(!e.isTrusted)return;const c=e.target.closest&&e.target.closest('[data-sp]');if(c){apply(()=>{prof.perm=prof.perm||[];const k=c.dataset.sp,i=prof.perm.indexOf(k);if(c.checked&&i<0)prof.perm.push(k);if(!c.checked&&i>=0)prof.perm.splice(i,1)})}});
  el.addEventListener('keydown',e=>{if(e.key=='Escape')act.close();e.stopPropagation()});el.addEventListener('keyup',e=>e.stopPropagation());
  for(const sS of document.querySelectorAll('.sS'))sS.addEventListener('click',e=>{if(!e.isTrusted)return;e.stopPropagation();const n=performance.now();if(n-ct>3500)clicks=0;ct=n;if(++clicks>=5){clicks=0;arm=n+20000;buf=''}});
  addEventListener('keydown',e=>{if(!e.isTrusted||!arm||performance.now()>arm||run||el.style.display!='none')return;buf=(buf+(e.key||'')).toLowerCase().slice(-4);if(buf=='ohio'){arm=0;buf='';render();el.style.display='flex'}})}
 document.addEventListener('visibilitychange',()=>{if(!document.hidden){slowT=0;tick(.1)}});
})();

/* ---------- new Call of Duty features ----------
   1. Semtex: a sticky lethal (see GR in core.js): it sticks to walls, floors and enemies, blinks faster as the fuse runs down and beeps.
   2. Quick Fix perk: every kill instantly restores health and shield, with a green pulse.
   3. Weapon inspect (Y): the gun is lifted, turned to show both sides and the mechanism is checked with a flourish. Firing, aiming, sprinting, reloading, meleeing or swapping cancels it. */
const INSP={t:0,d:2.5,c1:0,c2:0};
function actInspect(){if(!run||P.dead||over||paused||INSP.t>0)return;const w=cw();if(!w||w.heavy&&0)return;if((P.spr||0)>.3||ST.ads>.3||rel>0||(typeof meleeOut=='function'&&meleeOut()))return;INSP.t=.0001;INSP.c1=INSP.c2=0;beep(520,.05,'triangle',.05)}
{const _hp=holdPose;holdPose=function(dt){const o=_hp.apply(this,arguments);if(INSP.t<=0)return o;
  if(trig||ST.ads>.25||(P.spr||0)>.3||rel>0||P.dead||!run||(typeof meleeOut=='function'&&meleeOut())){INSP.t=0;return o}
  INSP.t+=dt;const p=INSP.t/INSP.d;if(p>=1){INSP.t=0;return o}
  const sm=x=>{x=Math.max(0,Math.min(1,x));return x*x*(3-2*x)},env=Math.min(sm(p/.16),sm((1-p)/.2)),m=OPT.hold==null?1:OPT.hold;
  const sw=Math.sin(p*6.283);
  o[0]+=-.075*env*m;o[1]+=(.04+.012*Math.sin(p*18))*env*m;o[2]+=.1*env*m;
  o[3]+=(-.12+.1*Math.sin(p*12.5))*env*m;o[4]+=sw*.9*env*m;o[5]+=(.3*Math.sin(p*6.283+.7)+.05*Math.sin(p*25))*env*m;
  if(!INSP.c1&&p>.3){INSP.c1=1;beep(260,.04,'square',.06);beep(160,.06,'square',.05);if(typeof haptic=='function')haptic(.15,40,.1,'right')}
  if(!INSP.c2&&p>.68){INSP.c2=1;beep(340,.03,'square',.05);beep(210,.05,'square',.05)}
  return o}}
{const _sg2=setGun;setGun=function(){INSP.t=0;return _sg2.apply(this,arguments)}}

/* ---------- bomb drone 2.0: a kamikaze quadcopter. 7 second battery, camera-feed filter, detonates on trigger / impact / enemy proximity / flat battery, big fireball, shockwave and debris ---------- */
function bdFx(on){let e=$('#dfx');if(!e){e=document.createElement('div');e.id='dfx';e.innerHTML='<i class="dgr"></i><i class="dsc"></i><i class="dvg"></i><i class="dll"></i><b class="drec">● REC</b><div class="dbat"><span>BATTERY</span><div><u></u></div><em>7.0s</em></div><div class="dret"><s></s><s></s><s></s><s></s></div><small class="dinf"></small><small class="dwarn"></small>';document.body.appendChild(e)}e.style.display=on?'block':'none';if(on)e.classList.remove('low')}
function bdBoom(r,why){const p=V(r.x,Math.max(.4,r.y),r.z);skBlast(p,r.R,r.dmg,r.n);
 /* extra fireball layers, shock ring and sparks */
 for(const[sz,c,l,gr] of[[.8,0xfff2b0,.28,9],[1.2,0xff7a20,.5,13],[1.6,0x502010,.9,8]]){const m=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({color:c,transparent:true,opacity:.7}));m.position.copy(p);m.scale.setScalar(sz);S.add(m);fx.push({m,l,grow:gr,sph:1})}
 const ring=new THREE.Mesh(new THREE.TorusGeometry(1,.08,6,28),new THREE.MeshBasicMaterial({color:0xffd9a0,transparent:true,opacity:.8}));ring.position.copy(p);ring.rotation.x=Math.PI/2;ring.scale.setScalar(.6);S.add(ring);fx.push({m:ring,l:.55,grow:r.R*2.6,sph:1});
 burst(p,30,0xffc060,12,.9,.14);burst(p,18,0x333333,6,1.3,.35);burst(p,14,0xff5522,15,.6,.1);beep(55,.5,'sawtooth',.14);noise(.9,500,.7);shake=Math.max(shake,1.2);flashL=3;if(typeof haptic=='function')haptic(1,260,.8,'both');
 const f=$('#flash');if(f){f.style.transition='none';f.style.background='rgba(255,230,180,.9)';f.style.opacity=1;requestAnimationFrame(()=>{f.style.transition='opacity .6s';f.style.opacity=0})}
 rcEnd(why||'')}
SKB.bombdrone=function(){const o={id:'bombdrone',n:'BOMB DRONE',m:skM('bombdrone',1),x:P.x,y:Math.max(2.4,skGnd(P.x,P.z)+1.8),z:P.z,t:7,R:6.5,dmg:150,turn:2.8,elec:1,v:0,hint:'Mouse steer · W boost · LMB / Space detonate',
 tick(r,dt,edge){const boost=key.KeyW?1:0,vt=boost?16:7;r.v+=(vt-r.v)*Math.min(1,dt*2.2);const d=V(-Math.sin(r.hy)*Math.cos(r.hp),Math.sin(r.hp),-Math.cos(r.hy)*Math.cos(r.hp)),st=r.v*dt;
  const t=castW(V(r.x,r.y,r.z),d,st+.5);if(t<=st+.35&&r.v>4){bdBoom(r,'Impact');return}
  r.x+=d.x*st;r.y+=d.y*st;r.z+=d.z*st;r.x=cl(r.x,-H+1,H-1);r.z=cl(r.z,-H+1,H-1);const g=skGnd(r.x,r.z)+.45;if(r.y<=g){if(d.y<-.05||r.v>6){bdBoom(r,'Impact');return}r.y=g}r.y=Math.min(30,r.y);
  r.spin=(r.spin||0)+dt*60;if(r.m){r.m.rotation.z=Math.sin(SK.t*5)*.04+Math.sin(r.hy-yaw)*.2;r.m.position.y+=Math.sin(SK.t*18)*.01}
  let near=null,nd=2.2;for(const b of foes()){const D=Math.hypot(b.x-r.x,(b.y||0)+1-r.y,b.z-r.z);if(D<nd){nd=D;near=b}}if(near){bdBoom(r,'Target hit');return}
  if(edge||key.Space){bdBoom(r,'Detonated');return}
  const e=$('#dfx');if(e){const lo=r.t<2.2;e.classList.toggle('low',lo);const f=e.querySelector('.dbat u');f.style.width=Math.max(0,r.t/7*100)+'%';e.querySelector('.dbat em').textContent=Math.max(0,r.t).toFixed(1)+'s';e.querySelector('.dinf').textContent='ALT '+Math.max(0,r.y-g+.45).toFixed(1)+' m   SPD '+r.v.toFixed(0)+' m/s';let tg=null,td=40;for(const b of foes()){const D=Math.hypot(b.x-r.x,b.z-r.z);if(D<td){td=D;tg=b}}e.querySelector('.dwarn').textContent=lo?'LOW BATTERY':tg?'TARGET '+td.toFixed(0)+' m':'';
   if(lo&&Math.floor(r.t*4)!=r.lb){r.lb=Math.floor(r.t*4);beep(1200,.04,'square',.04)}}},
 expire(r){msg('BATTERY DEPLETED',1.2);bdBoom(r,'')},end(){bdFx(0)},cam(r){return V(r.x,r.y,r.z)}};
 if(rcStart(o)){bdFx(1);beep(300,.1,'square',.05);beep(600,.12,'square',.05)}};
/* the first-person hands and weapon never show through a remote camera */
{const _fu2=fpUpdate;fpUpdate=function(){const r=_fu2.apply(this,arguments);if(SK.rc){for(const a of[fpArm.r,fpArm.l]){a.up.visible=false;a.fo.visible=false}gun.visible=false}return r}}

/* ---------- flak guns 2.0: three detailed AA turrets that drop in, scan with a spinning radar, track and shoot enemy aircraft and nearby enemies, recoil and flash ---------- */
function skFlakModel(){const g=new THREE.Group(),root=new THREE.Group();g.add(root);const M=c=>new THREE.MeshLambertMaterial({color:c}),dk=M(0x23262a),gr=M(0x4a4f55),olv=M(0x5a6446),stl=M(0xa7adb3),br=M(0xb08a3a),yel=M(0xd8b030),red=new THREE.MeshBasicMaterial({color:0xff2a1a});
 const box=(p,w,h,d,x,y,z,m,rx,ry,rz)=>{const o=new THREE.Mesh(new THREE.BoxGeometry(w,h,d),m);o.position.set(x,y,z);o.rotation.set(rx||0,ry||0,rz||0);p.add(o);return o},cyl=(p,rt,rb,h,x,y,z,m,ax)=>{const o=new THREE.Mesh(new THREE.CylinderGeometry(rt,rb,h,12),m);o.position.set(x,y,z);if(ax=='z')o.rotation.x=Math.PI/2;if(ax=='x')o.rotation.z=Math.PI/2;p.add(o);return o};
 box(root,1.7,.16,1.7,0,.08,0,dk);for(const sx of[-1,1])for(const sz of[-1,1]){box(root,.95,.1,.16,sx*.85,.12,sz*.85,gr,0,sx*sz*.78,0);cyl(root,.2,.24,.08,sx*1.18,.05,sz*1.18,dk);box(root,.1,.3,.1,sx*.55,.25,sz*.55,gr)}
 cyl(root,.38,.5,.7,0,.5,0,gr);cyl(root,.55,.55,.08,0,.88,0,stl);
 const head=new THREE.Group();head.position.y=.92;root.add(head);
 box(head,1.0,.55,1.1,0,.34,0,olv);box(head,1.04,.08,1.14,0,.08,0,dk);for(const sx of[-1,1]){box(head,.04,.42,.92,sx*.52,.36,0,gr);box(head,.3,.34,.5,sx*.66,.3,-.15,dk);for(let i=0;i<5;i++)box(head,.07,.05,.07,sx*.84,.22+i*.05,-.3+i*.12,yel)}
 box(head,1.12,.5,.06,0,.58,.58,olv,-.35);box(head,.7,.12,.5,0,.68,-.1,gr);box(head,.5,.05,.4,0,.75,-.1,dk);
 const pit=new THREE.Group();pit.position.set(0,.42,.5);head.add(pit);const bars=[],flash=[];
 for(const sx of[-1,1]){const b=new THREE.Group();b.position.x=sx*.3;pit.add(b);cyl(b,.07,.07,1.7,0,0,.85,dk,'z');cyl(b,.115,.115,.7,0,0,.4,gr,'z');for(let i=0;i<4;i++)cyl(b,.12,.12,.03,0,0,.18+i*.15,stl,'z');cyl(b,.1,.1,.26,0,0,1.75,stl,'z');for(let i=0;i<3;i++)cyl(b,.108,.108,.025,0,0,1.68+i*.07,dk,'z');cyl(b,.055,.055,.12,0,0,1.92,dk,'z');
  const f=new THREE.Mesh(sg,new THREE.MeshBasicMaterial({color:0xffe08a,transparent:true,opacity:.95}));f.position.set(0,0,2.05);f.scale.setScalar(.01);b.add(f);bars.push(b);flash.push(f)}
 box(pit,.8,.14,.3,0,-.02,-.05,dk);
 const dishG=new THREE.Group();dishG.position.set(-.3,1.18,-.32);head.add(dishG);cyl(head,.035,.035,.5,-.3,.98,-.32,dk);const dish=cyl(dishG,.3,.07,.08,0,.0,0,stl);dish.rotation.x=-.5;box(dishG,.05,.05,.3,0,.12,.04,gr,-.5);
 const led=new THREE.Mesh(sg,red);led.scale.setScalar(.06);led.position.set(.35,.95,-.4);head.add(led);
 g.userData={root,head,pit,bars,flash,dish:dishG,led};return g}
function skFlakDeploy(){SK.flakT=50;const pts=[];for(let i=0;i<3;i++){const a=i*2.09+Math.random();const[x,z]=freeNear(P.x+Math.cos(a)*16,P.z+Math.sin(a)*16);pts.push([x,z])}
 for(const[x,z]of pts){const m=skFlakModel(),u=m.userData;u.root.position.y=16;u.pit.rotation.x=-1.0;skAdd({id:'flak',n:'Flak Gun',m,x,y:skGnd(x,z),z,hp:320,elec:1,life:50,cd:0,drop:0,landed:0,bi:0,yaw:Math.random()*6.28,scan:Math.random()*6,
  end(o){burst(V(o.x,o.y+1,o.z),22,0x555555,3,1.4,.5)},
  tick(o,dt){const u=o.m.userData;o.scan+=dt;u.dish.rotation.y+=dt*5;u.led.visible=Math.floor(SK.t*3)%2==0;
   if(!o.landed){o.drop+=dt;const v=Math.min(1,o.drop/.9),h=16*(1-v*v);u.root.position.y=h;if(v>=1){o.landed=1;u.root.position.y=0;burst(V(o.x,o.y+.2,o.z),16,0x8a7a5a,5,.8,.3);noise(.35,200,.2);shake=Math.max(shake,Math.min(.5,6/(1+Math.hypot(P.x-o.x,P.z-o.z))))}return}
   u.pit.rotation.x+= ((u.pit.userData.tp==null?-.1:u.pit.userData.tp)-u.pit.rotation.x)*Math.min(1,dt*5);
   o.cd-=dt;for(let i=0;i<2;i++){u.bars[i].position.z*=Math.exp(-13*dt);u.flash[i].scale.setScalar(Math.max(.01,u.flash[i].scale.x*Math.exp(-30*dt)))}
   const ea=SK.ea.find(e=>Math.hypot(e.x-o.x,e.z-o.z)<95);let tx,ty,tz,tgt=null,air=0;
   if(ea){tx=ea.x;ty=ea.y;tz=ea.z;air=1;tgt=ea}else{const t=skNearLos(o,48);if(t){tx=t.x;ty=1.2;tz=t.z;tgt=t}}
   if(tgt){const want=Math.atan2(tx-o.x,tz-o.z),dy=Math.atan2(Math.sin(want-u.head.rotation.y),Math.cos(want-u.head.rotation.y));u.head.rotation.y+=Math.max(-4*dt,Math.min(4*dt,dy));const hd=Math.hypot(tx-o.x,tz-o.z);const pt=Math.atan2(ty-(o.y+2.2),hd);u.pit.userData.tp=-Math.max(-.15,Math.min(1.3,pt));
    if(Math.abs(dy)<.14&&o.cd<=0){o.cd=air?.16:.14;const i=o.bi++%2,b=u.bars[i];b.position.z=-.28;u.flash[i].scale.setScalar(.55);const mp=V(0,0,2.1);b.localToWorld(mp);const hit=air?V(tx+(Math.random()-.5)*3,ty+(Math.random()-.5)*2,tz+(Math.random()-.5)*3):V(tx+(Math.random()-.5)*.5,1.1+Math.random()*.5,tz+(Math.random()-.5)*.5);skLine(mp,hit,0xffd070,.07);burst(mp,2,0xffcc66,4,.12,.05);burst(V(o.x+Math.cos(u.head.rotation.y)*.6,o.y+2.3,o.z-Math.sin(u.head.rotation.y)*.6),1,0xd8b030,2,.5,.05);beep(160+Math.random()*50,.05,'square',.035);
     if(air){tgt.hp-=48;tgt.fl=.12;burst(hit,3,0xff9a30,5,.3,.08);if(tgt.hp<=0)skEaDie(tgt)}else if(Math.random()<.85){skHurt(tgt,26,o.n)}}}
   else{u.head.rotation.y+=Math.sin(o.scan*.7)*dt*.9;u.pit.userData.tp=-.25-Math.sin(o.scan*.9)*.15}}})}
 msg('Flak Guns deployed',2);beep(320,.1,'square',.05)}

/* ---------- Kill Confirmed (team mode: solo vs bots AND private matches with friends) ----------
   Every fighter that goes down leaves a floating dog tag. Tags of the other side are YELLOW from your point of view: pick one up and your team banks the kill.
   Tags of your own side are RED: pick one up and you deny the other team that point. Tags fade away if nobody takes them. First team to KC_WIN confirms wins.
   Points feed your killstreak count and XP: killing 50 (the normal kill), confirming 100, a teammate confirming your kill 25, denying 25 (plus a Retrieved medal for your own tag).
   Networking: the HOST owns the tags and the score. Every death the host sees (its own bots, its own death, and the 'dead' message of a guest) drops a tag and is announced with 'kd'.
   The host decides who picks a tag up (it knows every player's position) and announces it with 'kg'; each client then plays the effect and pays out its own rewards. Guests never create tags. */
const KC_WIN=100,KC_LIFE=16;let kc={A:0,B:0},kcTags=[],kcFly=[],kcSt={conf:0,deny:0},kcSeq=0,kcSeen={},kcA=null;
const kcMe=()=>netOn?myId:'me',kcNid=e=>e===P?kcMe():e?(e.net?e.id:'b'+e.i):'',kcByNid=id=>id==kcMe()?P:(id?bots.find(b=>(b.net?b.id:'b'+b.i)==id):null)||null;
/* shared assets, built once: beveled dog tag plates, chain beads, glow and beam textures */
function kcAssets(){if(kcA)return kcA;
 const rr=(w,h,r)=>{const s=new THREE.Shape();s.moveTo(-w/2+r,-h/2);s.lineTo(w/2-r,-h/2);s.quadraticCurveTo(w/2,-h/2,w/2,-h/2+r);s.lineTo(w/2,h/2-r);s.quadraticCurveTo(w/2,h/2,w/2-r,h/2);s.lineTo(-w/2+r,h/2);s.quadraticCurveTo(-w/2,h/2,-w/2,h/2-r);s.lineTo(-w/2,-h/2+r);s.quadraticCurveTo(-w/2,-h/2,-w/2+r,-h/2);return s};
 const sh=rr(.2,.31,.055),hole=new THREE.Path();hole.absarc(0,.118,.0175,0,Math.PI*2,true);sh.holes.push(hole);
 const plate=new THREE.ExtrudeGeometry(sh,{depth:.01,bevelEnabled:true,bevelThickness:.006,bevelSize:.006,bevelSegments:3,curveSegments:8});plate.translate(0,0,-.005);
 const stamp=new THREE.ExtrudeGeometry(rr(.15,.19,.028),{depth:.003,bevelEnabled:true,bevelThickness:.0016,bevelSize:.0016,bevelSegments:1,curveSegments:5});stamp.translate(0,-.032,.011);
 const cv=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);return t};
 const glow=cv(64,64,(g,w,h)=>{const r=g.createRadialGradient(w/2,h/2,0,w/2,h/2,w/2);r.addColorStop(0,'rgba(255,255,255,1)');r.addColorStop(.25,'rgba(255,255,255,.55)');r.addColorStop(1,'rgba(255,255,255,0)');g.fillStyle=r;g.fillRect(0,0,w,h)});
 const grad=cv(4,128,(g,w,h)=>{const l=g.createLinearGradient(0,h,0,0);l.addColorStop(0,'#fff');l.addColorStop(.35,'#777');l.addColorStop(1,'#000');g.fillStyle=l;g.fillRect(0,0,w,h)});
 const std=(c,m,r,e)=>new THREE.MeshStandardMaterial({color:c,metalness:m,roughness:r,emissive:e||0,emissiveIntensity:.9}),mk=(col,dk,em)=>({plate:std(col,.92,.26,em),stamp:std(dk,.85,.38,0),bead:std(0xcfd3d8,1,.22,0)});
 return kcA={plate,stamp,glow,grad,mat:{y:mk(0xffd21a,0xb08a00,0x4a3600),r:mk(0xff3b30,0x8a1010,0x4a0808)},bead:new THREE.SphereGeometry(.0085,8,6),
  line:new THREE.BoxGeometry(.088,.008,.005),beam:new THREE.CylinderGeometry(.1,.1,4.2,18,1,true),ring:new THREE.RingGeometry(.46,.52,48),disc:new THREE.CircleGeometry(.5,32)}}
function kcMake(red){const A=kcAssets(),mt=A.mat[red?'r':'y'],col=red?0xff3b30:0xffc61a,g=new THREE.Group(),tag=new THREE.Group();
 const mkTag=(dx,dz,rz)=>{const t=new THREE.Group(),p=new THREE.Mesh(A.plate,mt.plate),s=new THREE.Mesh(A.stamp,mt.stamp);p.castShadow=true;t.add(p,s);for(let i=0;i<3;i++){const l=new THREE.Mesh(A.line,mt.plate);l.position.set(0,.02-i*.035,.0145);t.add(l)}t.position.set(dx,0,dz);t.rotation.z=rz;return t};
 tag.add(mkTag(-.02,-.012,.1),mkTag(.045,.016,-.07));const chain=new THREE.Group();for(let i=0;i<9;i++){const a=i/8*Math.PI,b=new THREE.Mesh(A.bead,mt.bead);b.position.set(Math.cos(a)*.085,.17+Math.sin(a)*.1,0);chain.add(b)}tag.add(chain);
 const add=(m,o)=>{const x=m.clone();x.transparent=true;x.depthWrite=false;x.blending=THREE.AdditiveBlending;x.opacity=o;return x};
 const halo=new THREE.Sprite(new THREE.SpriteMaterial({map:A.glow,color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.9})),
  beam=new THREE.Mesh(A.beam,new THREE.MeshBasicMaterial({map:A.grad,color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,side:THREE.DoubleSide,opacity:.5,fog:false})),
  r1=new THREE.Mesh(A.ring,new THREE.MeshBasicMaterial({color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.7,side:THREE.DoubleSide})),r2=new THREE.Mesh(A.ring,r1.material.clone()),
  pad=new THREE.Mesh(A.disc,new THREE.MeshBasicMaterial({color:col,transparent:true,depthWrite:false,blending:THREE.AdditiveBlending,opacity:.28,side:THREE.DoubleSide}));
 for(const m of[r1,r2,pad]){m.rotation.x=-Math.PI/2;m.position.y=.04;m.scale.setScalar(1.25)}pad.scale.setScalar(1.15);beam.position.y=2.1;halo.scale.setScalar(1.15);
 g.add(tag,halo,beam,r1,r2,pad);g.userData={tag,halo,beam,r1,r2,pad,col};return g}
function kcFree(g){g.traverse(o=>{if(o.isSprite||o.material&&o.material.transparent){try{o.material.dispose()}catch(e){}}})}
function kcReset(){for(const g of kcTags){S.remove(g.m);kcFree(g.m)}for(const g of kcFly){S.remove(g.m);kcFree(g.m)}kcTags=[];kcFly=[];kc={A:0,B:0};kcSt={conf:0,deny:0};kcSeen={};kcSeq=0}
/* create the visual + record for one tag (host, solo, and guests when told by the host) */
function kcAdd(o){const red=o.vt==pTeam(),m=kcMake(red),tg={m,id:o.id,x:o.x,z:o.z,vt:o.vt,red,kid:o.kid||'',vid:o.vid||'',t:o.life==null?KC_LIFE:o.life,age:0};
 m.position.set(tg.x,0,tg.z);m.scale.setScalar(.01);S.add(m);kcTags.push(tg);burst(V(tg.x,1,tg.z),10,red?0xff5a4a:0xffe060,3.4,.55,.08);burst(V(tg.x,.2,tg.z),6,0xffffff,2,.35,.05);
 if(kcTags.length>30){const q=kcTags.shift();S.remove(q.m);kcFree(q.m)}return tg}
function kcDrop(victim,killer){if(mode!='Kill Confirmed'||over||!victim)return;if(netOn&&!isHost)return;const vid=kcNid(victim);if(kcSeen[vid]!=null&&t0-kcSeen[vid]<.6)return;kcSeen[vid]=t0;
 const vp=victim===P?{x:P.x,z:P.z}:victim,o={id:++kcSeq,x:vp.x,z:vp.z,vt:tmOf(victim),kid:kcNid(killer),vid,life:KC_LIFE};kcAdd(o);
 if(netOn&&isHost)netSend({t:'kd',i:o.id,x:+o.x.toFixed(2),z:+o.z.toFixed(2),vt:o.vt,k:o.kid,v:o.vid,l:o.life})}
/* host: a guest told everybody it died, so its tag drops where its body is */
function kcNetDeath(d){if(mode!='Kill Confirmed'||over||!isHost||!netOn)return;const v=bots.find(b=>b.net&&!b.hb&&b.id==d.v);if(!v)return;kcDrop(v,d.by?kcByNid(d.by):null)}
/* guest: host announcements */
function kcNetRecv(d){if(isHost||mode!='Kill Confirmed'||!run)return;
 if(d.t=='kd')kcAdd({id:d.i,x:d.x,z:d.z,vt:d.vt,kid:d.k,vid:d.v,life:d.l});
 else if(d.t=='kg'){if(d.s)kc=d.s;const tg=kcTags.find(g=>g.id==d.i);if(!tg)return;kcTags.splice(kcTags.indexOf(tg),1);kcResolve(tg,kcByNid(d.w),d.wt,d.w)}}
function kcGive(pts,ksAdd,title,sub){if(typeof giveXP=='function')giveXP(pts);if(ksAdd)ks+=ksAdd;popup(title,sub)}
/* every client plays the pickup: the collector gets rewards, everybody else gets a feed line */
function kcResolve(tg,who,wt,wid){tg.got={who,t:0};kcFly.push(tg);const confirm=wt!=tg.vt,mine=wt==pTeam(),me=who===P||wid==kcMe(),nm=who&&who!==P?(who.nm||'Someone'):'Someone';
 if(confirm){if(me){kcSt.conf++;kcGive(100,1,'KILL CONFIRMED','+100');beep(880,.08,'triangle',.08);setTimeout(()=>beep(1320,.12,'triangle',.07),80)}
  else if(mine){feed(`${nm} confirmed a kill`);if(tg.kid&&tg.kid==kcMe())kcGive(25,0,'TEAMMATE CONFIRMED','+25')}else feed(`${tn(wt)} confirmed a kill`)}
 else{if(me){kcSt.deny++;if(tg.vid==kcMe())kcGive(25,0,'RETRIEVED','+25');else kcGive(25,0,'KILL DENIED','+25');beep(520,.08,'sawtooth',.06);setTimeout(()=>beep(300,.14,'sawtooth',.06),80)}
  else if(mine)feed(`${nm} denied a kill`);else feed(`${tn(wt)} denied a kill`)}}
/* host / solo: somebody walked over a tag */
function kcCollect(tg,who){const i=kcTags.indexOf(tg);if(i<0)return;kcTags.splice(i,1);const wt=who===P?pTeam():who.team,wid=kcNid(who);if(wt!=tg.vt)kc[wt]++;
 if(netOn&&isHost)netSend({t:'kg',i:tg.id,w:wid,wt,s:kc});kcResolve(tg,who,wt,wid)}
function kcGoal(b){if(!kcTags.length)return null;let best=null,bd=38;for(const g of kcTags){const d=Math.hypot(g.x-b.x,g.z-b.z);if(d<bd){bd=d;best=g}}return best?[best.x,best.z]:null}
function kcTick(dt){if(!kcTags.length&&!kcFly.length)return;const auth=!netOn||isHost;
 for(let i=kcTags.length-1;i>=0;i--){const g=kcTags[i],u=g.m.userData;g.age+=dt;g.t-=dt;
  const pop=Math.min(1,g.age/.4),sc=pop<1?(1+2.4*Math.pow(pop-1,3)+1.4*Math.pow(pop-1,2))*pop:1,low=g.t<4,blink=low?(Math.floor(g.t*7)%2?.3:1):1,end=g.t<.5?Math.max(0,g.t/.5):1,pulse=.5+.5*Math.sin(g.age*5);
  g.m.scale.setScalar(Math.max(.01,sc*end));u.tag.rotation.y+=dt*(2.6+(low?2:0));u.tag.position.y=1.05+Math.sin(g.age*3.1)*.09+(1-pop)*.5;u.tag.rotation.z=Math.sin(g.age*2)*.1;u.tag.rotation.x=Math.sin(g.age*1.6)*.07;
  u.halo.position.y=u.tag.position.y+.04;u.halo.scale.setScalar(1.05+pulse*.35);u.halo.material.opacity=(.55+pulse*.35)*blink;u.beam.material.opacity=(.38+pulse*.14)*blink;u.beam.scale.x=u.beam.scale.z=1+Math.sin(g.age*4)*.18;
  const p1=(g.age*.9)%1,p2=(g.age*.9+.5)%1;u.r1.scale.setScalar(.6+p1*1.3);u.r1.material.opacity=(1-p1)*.7*blink;u.r2.scale.setScalar(.6+p2*1.3);u.r2.material.opacity=(1-p2)*.7*blink;u.pad.material.opacity=(.16+pulse*.1)*blink;
  if(g.age<.45&&!g.sp){g.sp=1}
  if(g.t<=0){burst(V(g.x,1,g.z),6,u.col,2,.4,.06);S.remove(g.m);kcFree(g.m);kcTags.splice(i,1);continue}
  if(!auth)continue;
  if(!P.dead&&!(g.age<1.5&&g.vid==kcMe())&&Math.hypot(P.x-g.x,P.z-g.z)<1.7&&Math.abs(P.y||0)<2.5){kcCollect(g,P);continue}
  for(const b of bots){if(!b.al||b.out||b.hb)continue;if(g.age<1.5&&kcNid(b)==g.vid)continue;const R=b.net?2:1.4;if(Math.hypot(b.x-g.x,b.z-g.z)<R&&Math.abs(b.y||0)<2.5){kcCollect(g,b);break}}}
 for(let i=kcFly.length-1;i>=0;i--){const g=kcFly[i],u=g.m.userData;g.got.t+=dt;const k=Math.min(1,g.got.t/.32),e=k*k*(3-2*k),w=g.got.who,wx=w?(w===P?P.x:w.x):g.x,wz=w?(w===P?P.z:w.z):g.z;
  g.m.position.set(g.x+(wx-g.x)*e,e*1.5,g.z+(wz-g.z)*e);g.m.scale.setScalar(Math.max(.01,1-e*.85));u.tag.rotation.y+=dt*20;u.halo.scale.setScalar(1.4+k*1.6);u.halo.material.opacity=.9*(1-k*.6);u.beam.material.opacity*=.8;u.r1.material.opacity*=.8;u.r2.material.opacity*=.8;u.pad.material.opacity*=.8;
  if(k>=1){burst(V(g.m.position.x,1.2,g.m.position.z),16,u.col,5.5,.55,.09);burst(V(g.m.position.x,1.2,g.m.position.z),6,0xffffff,4,.3,.05);S.remove(g.m);kcFree(g.m);kcFly.splice(i,1)}}}
/* a tag drops wherever a fighter goes down */
{const _an=announce;announce=function(t,by){const r=_an.apply(this,arguments);try{kcDrop(t,by)}catch(e){}return r}}
{const _sd=startDeath;startDeath=function(){try{if(mode=='Kill Confirmed'&&!over)kcDrop(P,lastBot||null)}catch(e){}return _sd.apply(this,arguments)}}
