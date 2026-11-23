/* 구조 먼저 보는 캐릭터 그리기 연구실 — 실험 패널 모음 (외부 라이브러리 없음) */
(function(){
'use strict';
var NS='http://www.w3.org/2000/svg';
var C={teal:'#0f8f84',orange:'#e8731a',navy:'#1e2f6e',blue:'#2458d6',green:'#13733a',red:'#c9302c',purple:'#6b4fb0',grid:'#e3e8ee',muted:'#5b6874',ink:'#16212b'};
var KFONT='"IBM Plex Sans KR","Malgun Gothic","Noto Sans KR",sans-serif';
var RM=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
var P={};

/* ---------- 공용 도구 ---------- */
function el(tag,a,parent){var e=document.createElementNS(NS,tag);for(var k in a){if(a[k]!=null)e.setAttribute(k,a[k]);}if(parent)parent.appendChild(e);return e;}
function ktxt(p,x,y,s,a){a=a||{};var t=el('text',{x:x,y:y,'font-size':a.size||13,fill:a.fill||C.muted,'font-family':KFONT,'text-anchor':a.anchor||'start','font-weight':a.weight||'normal'},p);t.textContent=s;return t;}
function svgOf(h,W,H,label){h.innerHTML='';return el('svg',{viewBox:'0 0 '+W+' '+H,role:'img','aria-label':'실험 그림: '+(label||noteOf(h))},h);}
function noteOf(h){var n=h.parentNode&&h.parentNode.querySelector('.ph small');return n?n.textContent:'';}
function canvasOf(h,W,H,mw){h.innerHTML='';var c=document.createElement('canvas');c.width=W;c.height=H;c.style.width='100%';c.style.maxWidth=(mw||W*1.2)+'px';c.style.margin='0 auto';c.style.height='auto';c.style.display='block';c.style.borderRadius='10px';c.setAttribute('role','img');c.setAttribute('aria-label','실험 그림: '+noteOf(h));h.appendChild(c);return c;}
function out(h){return h.parentNode.querySelector('.readout');}
function ctl(h){return h.parentNode.querySelector('.ctrl');}
function f2(v,d){d=d==null?2:d;if(d===0)return String(Math.round(v));var m=Math.pow(10,d);var s=(Math.round(v*m)/m).toFixed(d);s=s.replace(/\.?0+$/,'');if(s==='-0')s='0';return s;}
function num(v,d){return v<0?'−'+f2(-v,d):f2(v,d);}
function clamp(v,a,b){return Math.max(a,Math.min(b,v));}
function lerp(a,b,t){return a+(b-a)*t;}
function hex(c){c=c.replace('#','');return[parseInt(c.substr(0,2),16),parseInt(c.substr(2,2),16),parseInt(c.substr(4,2),16)];}
function rgb(a){return 'rgb('+a.map(function(v){return Math.round(clamp(v,0,255));}).join(',')+')';}
function mix(c1,c2,t){var a=hex(c1),b=hex(c2);return rgb([lerp(a[0],b[0],t),lerp(a[1],b[1],t),lerp(a[2],b[2],t)]);}
function shade(c,k){var a=hex(c);return rgb([a[0]*k,a[1]*k,a[2]*k]);}
function rad(d){return d*Math.PI/180;}
function seg(h,sel,cb){var bs=ctl(h).querySelectorAll(sel);bs.forEach(function(b){b.addEventListener('click',function(){bs.forEach(function(x){x.classList.remove('on');});b.classList.add('on');cb(b);});});}
function rng(seed){var s=seed>>>0||1;return function(){s=(s*1664525+1013904223)>>>0;return s/4294967296;};}
function onIn(inp,f){inp.addEventListener('input',f);}
function svgPt(s,e){var m=s.getScreenCTM().inverse();var q=s.createSVGPoint();q.x=e.clientX;q.y=e.clientY;return q.matrixTransform(m);}

/* ---------- 캐릭터 얼굴(가슴 위) 그리기 — 캔버스 ---------- */
var CH={
 haru:{hair:'#E9909A',hair2:'#D9707E',streak:'#1E2F5C',buns:true,ahoge:true,eye:'#3D8BE0',skin:'#F6D3B8',outfit:'hoodie',long:true},
 sia:{hair:'#1E1B22',hair2:'#4A4656',eye:'#7A7680',skin:'#F6D9C4',outfit:'maid',long:true,earring:true},
 moa:{hair:'#D8C09A',hair2:'#B89C74',eye:'#B07A3E',skin:'#F8DCC8',outfit:'cardigan',long:true,headband:true,ribbon:'L',wavy:true}
};
function cfg(name,over){var o={};var b=CH[name];for(var k in b)o[k]=b[k];for(var j in over)o[j]=over[j];return o;}
function drawBust(ctx,W,H,o){
  var cx=W/2,s=W/200;ctx.save();ctx.clearRect(0,0,W,H);ctx.fillStyle=o.bg||'#f4f6f9';ctx.fillRect(0,0,W,H);
  var ln=o.line||2.2*s;ctx.lineJoin='round';ctx.lineCap='round';ctx.strokeStyle=o.ink||'#2a2230';ctx.lineWidth=ln;
  function E(x,y,rx,ry,fill,stroke){ctx.beginPath();ctx.ellipse(x,y,rx,ry,0,0,Math.PI*2);if(fill){ctx.fillStyle=fill;ctx.fill();}if(stroke!==false)ctx.stroke();}
  // 뒷머리
  if(o.long){ctx.fillStyle=o.hair;ctx.beginPath();ctx.moveTo(cx-48*s,78*s);ctx.quadraticCurveTo(cx-62*s,150*s,cx-52*s,200*s);ctx.lineTo(cx+52*s,200*s);ctx.quadraticCurveTo(cx+62*s,150*s,cx+48*s,78*s);ctx.closePath();ctx.fill();ctx.stroke();}
  else{ctx.fillStyle=o.hair;ctx.beginPath();ctx.moveTo(cx-46*s,80*s);ctx.quadraticCurveTo(cx-50*s,120*s,cx-36*s,128*s);ctx.lineTo(cx+36*s,128*s);ctx.quadraticCurveTo(cx+50*s,120*s,cx+46*s,80*s);ctx.closePath();ctx.fill();ctx.stroke();}
  // 몸·옷
  var body=o.outfit==='maid'?'#34363F':o.outfit==='cardigan'?'#D4B48A':o.outfit==='generic'?'#8a93a6':'#A99AC8';
  ctx.fillStyle=body;ctx.beginPath();ctx.moveTo(cx-70*s,200*s);ctx.quadraticCurveTo(cx-66*s,150*s,cx-26*s,140*s);ctx.lineTo(cx+26*s,140*s);ctx.quadraticCurveTo(cx+66*s,150*s,cx+70*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();
  if(o.outfit==='hoodie'&&o.coat!==false){ctx.fillStyle='#fbfbfd';ctx.beginPath();ctx.moveTo(cx-70*s,200*s);ctx.quadraticCurveTo(cx-66*s,150*s,cx-30*s,141*s);ctx.lineTo(cx-18*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();ctx.beginPath();ctx.moveTo(cx+70*s,200*s);ctx.quadraticCurveTo(cx+66*s,150*s,cx+30*s,141*s);ctx.lineTo(cx+18*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.strokeStyle='#ffffff';ctx.beginPath();ctx.moveTo(cx-8*s,150*s);ctx.lineTo(cx-10*s,175*s);ctx.moveTo(cx+8*s,150*s);ctx.lineTo(cx+10*s,175*s);ctx.stroke();ctx.strokeStyle=o.ink||'#2a2230';}
  if(o.outfit==='maid'){ctx.fillStyle='#fbfbfd';ctx.fillRect(cx-16*s,136*s,32*s,12*s);ctx.strokeRect(cx-16*s,136*s,32*s,12*s);ctx.fillStyle='#8C8C94';E(cx-12*s,154*s,12*s,8*s,'#8C8C94');E(cx+12*s,154*s,12*s,8*s,'#8C8C94');E(cx,154*s,5*s,5*s,'#77777f');
    ctx.fillStyle='#F4F2EE';ctx.beginPath();ctx.moveTo(cx-30*s,200*s);ctx.lineTo(cx-24*s,172*s);ctx.lineTo(cx+24*s,172*s);ctx.lineTo(cx+30*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();}
  if(o.outfit==='cardigan'){ctx.fillStyle='#ffffff';ctx.beginPath();ctx.moveTo(cx-18*s,142*s);ctx.lineTo(cx,175*s);ctx.lineTo(cx+18*s,142*s);ctx.closePath();ctx.fill();ctx.stroke();ctx.fillStyle='#A8323C';ctx.beginPath();ctx.moveTo(cx,150*s);ctx.lineTo(cx-12*s,144*s);ctx.lineTo(cx-12*s,158*s);ctx.closePath();ctx.moveTo(cx,150*s);ctx.lineTo(cx+12*s,144*s);ctx.lineTo(cx+12*s,158*s);ctx.closePath();ctx.fill();ctx.stroke();
    ctx.fillStyle='#FAF8F4';ctx.beginPath();ctx.moveTo(cx-34*s,200*s);ctx.lineTo(cx-28*s,178*s);ctx.lineTo(cx+28*s,178*s);ctx.lineTo(cx+34*s,200*s);ctx.closePath();ctx.fill();ctx.stroke();}
  // 목·얼굴
  ctx.fillStyle=o.skin;ctx.fillRect(cx-11*s,118*s,22*s,24*s);ctx.beginPath();ctx.moveTo(cx-11*s,118*s);ctx.lineTo(cx-11*s,140*s);ctx.moveTo(cx+11*s,118*s);ctx.lineTo(cx+11*s,140*s);ctx.stroke();
  ctx.beginPath();ctx.moveTo(cx-38*s,70*s);ctx.quadraticCurveTo(cx-40*s,112*s,cx,128*s);ctx.quadraticCurveTo(cx+40*s,112*s,cx+38*s,70*s);ctx.closePath();ctx.fillStyle=o.skin;ctx.fill();ctx.stroke();
  // 눈
  [-1,1].forEach(function(d){var ex=cx+d*17*s,ey=96*s;E(ex,ey,8.5*s,10.5*s,'#ffffff');E(ex,ey+1*s,6.5*s,8.5*s,o.eye,false);E(ex,ey+2*s,3.4*s,4.6*s,shade(o.eye,0.45),false);E(ex-2.4*s,ey-3*s,2.2*s,2.2*s,'#ffffff',false);
    ctx.beginPath();ctx.moveTo(ex-10*s,ey-10*s);ctx.quadraticCurveTo(ex,ey-14*s,ex+10*s,ey-9*s);ctx.lineWidth=ln*1.4;ctx.stroke();ctx.lineWidth=ln;});
  ctx.beginPath();ctx.moveTo(cx-5*s,116*s);ctx.quadraticCurveTo(cx,119*s,cx+5*s,116*s);ctx.stroke();
  if(o.blush!==false){ctx.fillStyle='rgba(240,120,130,.25)';E(cx-26*s,108*s,6*s,3*s,'rgba(240,120,130,.25)',false);E(cx+26*s,108*s,6*s,3*s,'rgba(240,120,130,.25)',false);}
  // 앞머리
  ctx.fillStyle=o.hair;ctx.beginPath();ctx.moveTo(cx-46*s,88*s);ctx.quadraticCurveTo(cx-50*s,34*s,cx,30*s);ctx.quadraticCurveTo(cx+50*s,34*s,cx+46*s,88*s);
  if(o.wavy){ctx.quadraticCurveTo(cx+30*s,76*s,cx+22*s,82*s);ctx.quadraticCurveTo(cx+10*s,72*s,cx,80*s);ctx.quadraticCurveTo(cx-10*s,72*s,cx-22*s,82*s);ctx.quadraticCurveTo(cx-30*s,76*s,cx-46*s,88*s);}
  else{ctx.lineTo(cx+36*s,74*s);ctx.lineTo(cx+24*s,84*s);ctx.lineTo(cx+12*s,72*s);ctx.lineTo(cx,84*s);ctx.lineTo(cx-12*s,72*s);ctx.lineTo(cx-24*s,84*s);ctx.lineTo(cx-36*s,74*s);}
  ctx.closePath();ctx.fill();ctx.stroke();
  ctx.strokeStyle=o.hair2;ctx.beginPath();ctx.moveTo(cx-30*s,44*s);ctx.quadraticCurveTo(cx-20*s,40*s,cx-10*s,46*s);ctx.stroke();ctx.strokeStyle=o.ink||'#2a2230';
  if(o.streak){ctx.fillStyle=o.streak;ctx.beginPath();ctx.moveTo(cx-6*s,31*s);ctx.lineTo(cx+6*s,31*s);ctx.lineTo(cx+5*s,80*s);ctx.lineTo(cx,84*s);ctx.lineTo(cx-5*s,80*s);ctx.closePath();ctx.fill();
    ctx.fillRect(cx-46*s+4*s,100*s,6*s,70*s);ctx.fillRect(cx+46*s-10*s,100*s,6*s,70*s);}
  if(o.buns){E(cx-30*s,30*s,15*s,14*s,o.hair);E(cx+30*s,30*s,15*s,14*s,o.hair);ctx.strokeStyle=o.hair2;ctx.beginPath();ctx.arc(cx-30*s,30*s,8*s,3.6,5.6);ctx.stroke();ctx.beginPath();ctx.arc(cx+30*s,30*s,8*s,3.6,5.6);ctx.stroke();ctx.strokeStyle=o.ink||'#2a2230';}
  if(o.ahoge){ctx.beginPath();ctx.moveTo(cx+2*s,30*s);ctx.quadraticCurveTo(cx+14*s,12*s,cx+4*s,8*s);ctx.lineWidth=ln*1.2;ctx.strokeStyle=o.hair2;ctx.stroke();ctx.lineWidth=ln;ctx.strokeStyle=o.ink||'#2a2230';}
  if(o.headband){ctx.fillStyle='#ffffff';ctx.beginPath();ctx.ellipse(cx,38*s,44*s,12*s,0,Math.PI*1.05,Math.PI*1.95);ctx.lineWidth=7*s;ctx.strokeStyle='#ffffff';ctx.stroke();ctx.lineWidth=ln;ctx.strokeStyle=o.ink||'#2a2230';
    for(var i=-3;i<=3;i++){E(cx+i*11*s,27*s+Math.abs(i)*2.2*s,4.5*s,4*s,'#ffffff');}}
  if(o.ribbon){var side=o.ribbon==='L'?1:-1;var rx=cx+side*44*s,ry=60*s;ctx.fillStyle='#ffffff';ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(rx-10*s,ry-7*s);ctx.lineTo(rx-10*s,ry+7*s);ctx.closePath();ctx.moveTo(rx,ry);ctx.lineTo(rx+10*s,ry-7*s);ctx.lineTo(rx+10*s,ry+7*s);ctx.closePath();ctx.fill();ctx.stroke();}
  if(o.earring){ctx.fillStyle='#c9ccd6';E(cx-39*s,108*s,2.5*s,4*s,'#c9ccd6');E(cx+39*s,108*s,2.5*s,4*s,'#c9ccd6');}
  ctx.restore();
}
function pixelate(src,dst,block){var W=dst.width,H=dst.height,ctx=dst.getContext('2d');if(block<=1){ctx.imageSmoothingEnabled=true;ctx.drawImage(src,0,0,W,H);return;}
  var t=document.createElement('canvas');t.width=Math.max(1,Math.round(W/block));t.height=Math.max(1,Math.round(H/block));var tc=t.getContext('2d');tc.imageSmoothingEnabled=true;tc.drawImage(src,0,0,t.width,t.height);
  ctx.imageSmoothingEnabled=false;ctx.clearRect(0,0,W,H);ctx.drawImage(t,0,0,W,H);ctx.imageSmoothingEnabled=true;}
function offBust(name,over,W){var c=document.createElement('canvas');c.width=W||200;c.height=W||200;drawBust(c.getContext('2d'),c.width,c.height,cfg(name,over||{}));return c;}

/* ---------- 3D 도형 마네킹 ---------- */
function limb(a,b,t,part){var dx=b[0]-a[0],dy=b[1]-a[1];return {c:[(a[0]+b[0])/2,(a[1]+b[1])/2,(a[2]+b[2])/2],s:[t,Math.hypot(dx,dy),t*0.95],rz:Math.atan2(dx,dy)*-1,part:part,ends:[a,b]};}
function mannequin(pose){pose=pose||'hip';
  var B=[];function box(c,s,part){B.push({c:c,s:s,rz:0,part:part});}
  box([0,7.45,0],[0.82,1.0,0.88],'head');box([0,6.78,0],[0.32,0.36,0.32],'neck');box([0,5.95,0],[1.6,1.45,1.0],'chest');box([0,4.62,0],[1.36,1.15,0.85],'pelvis');
  var L=[0.96,6.5,0],R=[-0.96,6.5,0];
  var le=[1.12,5.0,0],lh=[1.18,3.65,0.05];
  var re,rh;if(pose==='up'){re=[-1.15,8.0,0];rh=[-1.2,9.4,0];le=[1.15,8.0,0];lh=[1.2,9.4,0];}else{re=[-1.55,5.35,-0.1];rh=[-0.82,4.75,0.15];}
  B.push(limb(L,le,0.36,'uarm'));B.push(limb(le,lh,0.3,'farm'));B.push(limb(R,re,0.36,'uarm'));B.push(limb(re,rh,0.3,'farm'));
  [0.38,-0.38].forEach(function(x){var hp=[x,4.15,0],kn=[x*1.05,2.2,0.05],an=[x*1.08,0.35,0];B.push(limb(hp,kn,0.5,'thigh'));B.push(limb(kn,an,0.38,'shin'));box([x*1.08,0.14,0.18],[0.34,0.28,0.7],'foot');});
  B.joints={head:[0,7.45,0],neck:[0,6.6,0],ls:L,rs:R,le:le,lh:lh,re:re,rh:rh,lp:[0.38,4.15,0],rp:[-0.38,4.15,0],lk:[0.4,2.2,0.05],rk:[-0.4,2.2,0.05],la:[0.41,0.35,0],ra:[-0.41,0.35,0]};
  return B;}
var FACES=[[0,1,2,3],[4,5,6,7],[0,1,5,4],[2,3,7,6],[1,2,6,5],[0,3,7,4]];
function boxVerts(b){var w=b.s[0]/2,h=b.s[1]/2,d=b.s[2]/2,c=Math.cos(b.rz),s=Math.sin(b.rz);
  var L=[[-w,-h,-d],[w,-h,-d],[w,h,-d],[-w,h,-d],[-w,-h,d],[w,-h,d],[w,h,d],[-w,h,d]];
  return L.map(function(p){var x=p[0]*c-p[1]*s,y=p[0]*s+p[1]*c;return[x+b.c[0],y+b.c[1],p[2]+b.c[2]];});}
function rotY(p,a){var c=Math.cos(a),s=Math.sin(a);return[p[0]*c+p[2]*s,p[1],-p[0]*s+p[2]*c];}
function sub3(a,b){return[a[0]-b[0],a[1]-b[1],a[2]-b[2]];}
function cross(a,b){return[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];}
function norm(a){var l=Math.hypot(a[0],a[1],a[2])||1;return[a[0]/l,a[1]/l,a[2]/l];}
function dot(a,b){return a[0]*b[0]+a[1]*b[1]+a[2]*b[2];}
var PARTCOL={head:'#E9909A',neck:'#F6D3B8',chest:'#A99AC8',pelvis:'#5b7fb8',uarm:'#fbfbfd',farm:'#fbfbfd',thigh:'#5b7fb8',shin:'#5b7fb8',foot:'#A99AC8'};
function renderMan(s,o){/* o: yaw, mode(shade|flat|edge|depth|blocks|sketch|line|color), W,H,scale,ox,oy, light */
  var B=mannequin(o.pose),yaw=rad(o.yaw||0),Lt=norm(o.light||[-0.55,0.65,0.55]);
  var sc=o.scale||40,ox=o.ox||o.W/2,oy=o.oy||o.H-20;var polys=[];var zmin=1e9,zmax=-1e9;
  B.forEach(function(b){var V=boxVerts(b).map(function(p){return rotY(p,yaw);});
    FACES.forEach(function(f){var a=V[f[0]],bb=V[f[1]],c=V[f[2]];var n=norm(cross(sub3(bb,a),sub3(c,a)));
      var cen=[0,0,0];f.forEach(function(i){cen[0]+=V[i][0]/4;cen[1]+=V[i][1]/4;cen[2]+=V[i][2]/4;});
      // 바깥쪽 법선으로 맞춤
      var bc=rotY(b.c,yaw);if(dot(n,sub3(cen,bc))<0)n=[-n[0],-n[1],-n[2]];
      if(n[2]<=0.001)return;zmin=Math.min(zmin,cen[2]);zmax=Math.max(zmax,cen[2]);
      polys.push({pts:f.map(function(i){return[ox+V[i][0]*sc,oy-V[i][1]*sc];}),z:cen[2],n:n,part:b.part});});});
  polys.sort(function(a,b){return a.z-b.z;});var g=el('g',{},s);var R=rng(7);
  polys.forEach(function(p){var d=p.pts.map(function(q){return q[0].toFixed(1)+','+q[1].toFixed(1);}).join(' ');
    var br=0.28+0.72*Math.max(0,dot(p.n,Lt));var m=o.mode;
    if(m==='shade')el('polygon',{points:d,fill:mix('#3b3f4a','#eef1f6',br),stroke:'#2a2e38','stroke-width':0.8},g);
    else if(m==='flat')el('polygon',{points:d,fill:o.flat||'#f2d9c6',stroke:o.flat||'#f2d9c6','stroke-width':0.6},g);
    else if(m==='blocks')el('polygon',{points:d,fill:'none',stroke:C.blue,'stroke-width':1.3},g);
    else if(m==='sketch'){var q=p.pts.map(function(v){return[v[0]+(R()-.5)*3,v[1]+(R()-.5)*3];});el('polygon',{points:q.map(function(v){return v[0].toFixed(1)+','+v[1].toFixed(1);}).join(' '),fill:'none',stroke:'#8a8f99','stroke-width':1,opacity:.85},g);}
    else if(m==='line')el('polygon',{points:d,fill:'#ffffff',stroke:'#1d1a22','stroke-width':1.4},g);
    else if(m==='color'){var A=hex(PARTCOL[p.part]||'#dddddd');el('polygon',{points:d,fill:rgb(A.map(function(v){return v*(0.6+0.4*br);})),stroke:'#1d1a22','stroke-width':1.2},g);}
    else if(m==='edge')el('polygon',{points:d,fill:'#000',stroke:'#fff','stroke-width':1.1},g);
    else if(m==='depth'){var t=(p.z-zmin)/Math.max(1e-6,zmax-zmin);var v=Math.round(70+t*185);el('polygon',{points:d,fill:'rgb('+v+','+v+','+v+')',stroke:'rgb('+v+','+v+','+v+')','stroke-width':0.6},g);}
  });
  var J={};for(var k in B.joints){var r=rotY(B.joints[k],yaw);J[k]=[ox+r[0]*sc,oy-r[1]*sc,r[2]];}
  return {g:g,J:J};}


/* ===================== 공용: 머리와 가발(SVG) ===================== */
var HC={haru:'#E9909A',sia:'#1E1B22',moa:'#D8C09A',doctor:'#3a3d44',bob:'#9a6a46',lbrown:'#AA7D55',chestnut:'#6b4430',blonde:'#E6C88C',red:'#B4473A',silver:'#C9CDD6',black:'#1E1B22',white:'#F4F4F2'};
var EYE={haru:'#3D8BE0',sia:'#7A7680',moa:'#B07A3E',doctor:'#4a4a52'};
var INK='#2a2230',SKIN='#F6D3B8';
function arrowS(s,x1,y1,x2,y2,col,w){col=col||C.purple;var a=Math.atan2(y2-y1,x2-x1),L=9;var g=el('g',{},s);el('line',{x1:x1,y1:y1,x2:x2,y2:y2,stroke:col,'stroke-width':w||2.6,'stroke-linecap':'round'},g);
  el('path',{d:'M'+x2+','+y2+' L'+(x2-L*Math.cos(a-0.45))+','+(y2-L*Math.sin(a-0.45))+' L'+(x2-L*Math.cos(a+0.45))+','+(y2-L*Math.sin(a+0.45))+'Z',fill:col},g);return g;}
function P2(x,y){return x.toFixed(1)+','+y.toFixed(1);}
/* 길이 0~10 → 머리 아래 끝 y (머리 가운데 cy, 반지름 r 기준). 0~2 짧음(귀 위~목덜미), 3~5 중간(턱~어깨), 6~10 긴 머리 */
function lenY(cy,r,len){return cy+r*(0.15+len*0.32);}
function lenName(len){return len<=2?'짧은 머리':len<=5?'중간 머리':'긴 머리';}
/* o: cx,cy,r, who, col(머리색), vol(px), len(0~10), end(out|in|flat), bang(0~10), hl(이마 선 0~10), part(가르마 시작 cm), side(c|l), tie(none|pony|half|twin), tieH(0~10),
      wave(0~10), locks(다발 수), inner(다발 속 선), shine(0~1 위치, null 없음), skull(점선 원형), noFace, body(어깨), hideLines, ink */
function headS(s,o){var cx=o.cx,cy=o.cy,r=o.r,v=o.vol==null?r*0.15:o.vol,col=o.col||HC.lbrown,ink=o.ink||INK,g=el('g',{},s);
  var len=o.len==null?4:o.len,yb=lenY(cy,r,len),wv=(o.wave||0)/10,tie=o.tie||'none',hlY=cy-r*(0.2+0.045*(o.hl==null?5:o.hl));
  var R2=r*0.92+v,top=cy-r-v,dark=shade(col,0.78);
  function wavy(x0,y0,x1,y1,amp,n){var d='';for(var i=1;i<=12;i++){var t=i/12;d+=' L'+P2(lerp(x0,x1,t)+Math.sin(t*Math.PI*(n||3))*amp,lerp(y0,y1,t));}return d;}
  // 뒷머리
  var tied=tie==='pony'||tie==='twin';
  if(!tied||tie==='half'||true){var by=tied?cy+r*0.35:yb,side=r*(tie==='half'?0.95:1)+v*(tied?0.3:1);var fl=o.end==='out'?r*0.35:o.end==='in'?-r*0.2:0;var amp=wv*r*0.12;
    var d='M'+P2(cx-side,cy)+' A'+side.toFixed(1)+','+(r+v).toFixed(1)+' 0 0 1 '+P2(cx+side,cy)+wavy(cx+side,cy,cx+side+(tied?0:v*0.2),by,amp,3)+' Q'+P2(cx+side+fl,by+r*0.12)+' '+P2(cx+side+fl*1.2-(fl<0?0:0),by+(fl>0?-r*0.08:r*0.1));
    d+=' L'+P2(cx+r*0.55,by)+' L'+P2(cx-r*0.55,by)+' L'+P2(cx-side-fl*1.2,by+(fl>0?-r*0.08:r*0.1))+' Q'+P2(cx-side-fl,by+r*0.12)+' '+P2(cx-side-(tied?0:v*0.2),by)+wavy(cx-side-(tied?0:v*0.2),by,cx-side,cy,amp,3)+'Z';
    el('path',{d:d,fill:col,stroke:ink,'stroke-width':2.2,'stroke-linejoin':'round'},g);}
  if(tie==='pony'){var ty=cy-r*(0.2+0.09*(o.tieH==null?6:o.tieH));el('path',{d:'M'+P2(cx+r*0.7,ty)+' Q'+P2(cx+r*1.6,ty+r*0.3)+' '+P2(cx+r*1.35,ty+r*2.2)+' Q'+P2(cx+r*1.05,ty+r*1.2)+' '+P2(cx+r*0.75,ty+r*0.35)+'Z',fill:col,stroke:ink,'stroke-width':2.2},g);el('circle',{cx:cx+r*0.82,cy:ty+r*0.05,r:r*0.09,fill:'#4a4656',stroke:ink,'stroke-width':1.5},g);}
  if(tie==='twin'){var ty2=cy-r*(0.2+0.09*(o.tieH==null?6:o.tieH));[-1,1].forEach(function(dd){el('path',{d:'M'+P2(cx+dd*r*0.85,ty2)+' Q'+P2(cx+dd*r*1.7,ty2+r*0.4)+' '+P2(cx+dd*r*1.3,ty2+r*2)+' Q'+P2(cx+dd*r*1.1,ty2+r)+' '+P2(cx+dd*r*0.85,ty2+r*0.3)+'Z',fill:col,stroke:ink,'stroke-width':2.2},g);el('circle',{cx:cx+dd*r*0.9,cy:ty2+r*0.08,r:r*0.09,fill:'#4a4656',stroke:ink,'stroke-width':1.5},g);});}
  if(o.skull)el('ellipse',{cx:cx,cy:cy,rx:r*0.92,ry:r,fill:'none',stroke:C.blue,'stroke-width':1.6,'stroke-dasharray':'5 4'},g);
  // 어깨·몸
  if(o.body!==false){el('path',{d:'M'+P2(cx-r*1.9,cy+r*2.6)+' Q'+P2(cx-r*1.8,cy+r*1.45)+' '+P2(cx-r*0.4,cy+r*1.3)+' L'+P2(cx+r*0.4,cy+r*1.3)+' Q'+P2(cx+r*1.8,cy+r*1.45)+' '+P2(cx+r*1.9,cy+r*2.6)+'Z',fill:o.outfit||'#A99AC8',stroke:ink,'stroke-width':2.2},g);
    el('rect',{x:cx-r*0.24,y:cy+r*0.7,width:r*0.48,height:r*0.62,fill:SKIN,stroke:ink,'stroke-width':2},g);}
  // 얼굴
  if(!o.noFace){el('path',{d:'M'+P2(cx-r*0.82,cy-r*0.25)+' Q'+P2(cx-r*0.86,cy+r*0.62)+' '+P2(cx,cy+r)+' Q'+P2(cx+r*0.86,cy+r*0.62)+' '+P2(cx+r*0.82,cy-r*0.25)+' Q'+P2(cx,cy-r*1.05)+' '+P2(cx-r*0.82,cy-r*0.25)+'Z',fill:SKIN,stroke:ink,'stroke-width':2.2},g);
    var ec=EYE[o.who]||'#5a6b80';[-1,1].forEach(function(dd){var ex=cx+dd*r*0.34,ey=cy+r*0.12;el('ellipse',{cx:ex,cy:ey,rx:r*0.14,ry:r*0.18,fill:'#fff',stroke:ink,'stroke-width':1.6},g);el('ellipse',{cx:ex,cy:ey+r*0.02,rx:r*0.1,ry:r*0.14,fill:o.eyeCol||ec},g);el('circle',{cx:ex-r*0.04,cy:ey-r*0.05,r:r*0.035,fill:'#fff'},g);
      el('path',{d:'M'+P2(ex-r*0.16,ey-r*0.19)+' Q'+P2(ex,ey-r*0.26)+' '+P2(ex+r*0.16,ey-r*0.17),fill:'none',stroke:ink,'stroke-width':2.6,'stroke-linecap':'round'},g);});
    el('path',{d:'M'+P2(cx-r*0.12,cy+r*0.62)+' Q'+P2(cx,cy+r*0.7)+' '+P2(cx+r*0.12,cy+r*0.62),fill:'none',stroke:ink,'stroke-width':1.8,'stroke-linecap':'round'},g);}
  // 옆머리(얼굴 앞, 귀 앞)
  if(!tied&&len>=1){var sy=Math.min(yb,cy+r*3);[-1,1].forEach(function(dd){var x0=cx+dd*r*0.8,w=r*0.22+v*0.35,fl=o.end==='out'?dd*r*0.25:o.end==='in'?-dd*r*0.15:0;
      el('path',{d:'M'+P2(x0-dd*w*0.2,cy-r*0.45)+' Q'+P2(x0+dd*w,cy)+' '+P2(x0+dd*w*0.9+fl,sy)+' L'+P2(x0-dd*w*0.3+fl*0.6,sy-r*0.05)+' Q'+P2(x0-dd*w*0.4,cy+r*0.3)+' '+P2(x0-dd*w*0.2,cy-r*0.45)+'Z',fill:col,stroke:ink,'stroke-width':2},g);});}
  // 앞머리(이마 선 → 앞머리 끝)
  var bang=o.bang==null?4:o.bang,bE=cy-r*0.45+bang*r*0.065,cover=bang>=9;var pts=[],nB=5;
  var d2='M'+P2(cx-R2*0.98,cy-r*0.05)+' Q'+P2(cx-R2,top+r*0.15)+' '+P2(cx,top)+' Q'+P2(cx+R2,top+r*0.15)+' '+P2(cx+R2*0.98,cy-r*0.05);
  for(var i=nB;i>=0;i--){var x=cx-r*0.82+i*(r*1.64/nB),yy=(i%2?bE:bE-r*0.12);if(cover&&i>=3)yy=cy+r*0.4;d2+=' L'+P2(x,yy);}
  d2+='Z';el('path',{d:d2,fill:col,stroke:ink,'stroke-width':2.2,'stroke-linejoin':'round'},g);
  // 묶은 머리의 당김 결
  if(tied||tie==='half'){var tx=tie==='pony'?cx+r*0.82:cx,tyy=cy-r*(0.2+0.09*(o.tieH==null?6:o.tieH));if(!o.noConverge){for(var k=0;k<8;k++){var sx=cx-r*0.8+k*r*0.23;el('path',{d:'M'+P2(sx,bE-r*0.1)+' Q'+P2((sx+tx)/2,top+r*0.05)+' '+P2(tie==='twin'?(sx<cx?cx-r*0.9:cx+r*0.9):tx,tyy),fill:'none',stroke:o.lineCol2||dark,'stroke-width':1.6},g);}}}
  // 다발 경계와 다발 속 선
  if(!o.hideLines){var n=o.locks==null?7:o.locks,inner=o.inner==null?1:o.inner;for(var j=0;j<n;j++){var t=(j+0.5)/n,x1=cx-r*0.85+t*r*1.7;el('path',{d:'M'+P2(cx+(t-0.5)*r*0.5,top+r*0.08)+' Q'+P2(x1,top+r*0.2)+' '+P2(x1+(t-0.5)*r*0.2,bE-r*0.04),fill:'none',stroke:o.lineCol||ink,'stroke-width':1.5,opacity:0.85},g);
      for(var q=0;q<inner;q++){var tt=t+((q+1)/(inner+1)-0.5)/n;var xq=cx-r*0.85+tt*r*1.7;el('path',{d:'M'+P2(cx+(tt-0.5)*r*0.5,top+r*0.18)+' Q'+P2(xq,top+r*0.3)+' '+P2(xq+(tt-0.5)*r*0.2,bE-r*0.12),fill:'none',stroke:o.lineCol2||dark,'stroke-width':o.innerW||0.9,opacity:0.8},g);}}}
  // 가르마
  if(o.part!=null){var ps=o.part,sxp=o.side==='l'?cx-r*0.35:cx,syp=hlY-ps*r*0.08;var bad=ps<0;
    el('path',{d:'M'+P2(sxp,top+r*0.02)+' L'+P2(sxp,Math.max(syp,top+r*0.05)),fill:'none',stroke:bad?C.red:'#fbe9df','stroke-width':2.4},g);
    if(bad)el('path',{d:'M'+P2(sxp,hlY)+' L'+P2(sxp,Math.min(cy-r*0.2,hlY-ps*r*0.08)),fill:'none',stroke:C.red,'stroke-width':2.4},g);}
  // 윤기 띠
  if(o.shine!=null){var sy2=top+(cy+r*0.2-top)*(1-o.shine);var gg=el('g',{},g);for(var m=0;m<6;m++){var a0=-0.75+m*0.26;var xs=cx+Math.sin(a0)*R2*0.9,xe=cx+Math.sin(a0+0.17)*R2*0.9;
      el('path',{d:'M'+P2(xs,sy2+Math.abs(a0)*r*0.25)+' L'+P2(xe,sy2+Math.abs(a0+0.17)*r*0.25),stroke:o.shineCol||'#ffffff','stroke-width':o.shineW||5,'stroke-linecap':'round',opacity:0.9},gg);}}
  return {g:g,top:top,yb:yb,hlY:hlY,R2:R2,bE:bE};}

/* ===================== 공용: 머리카락 가닥(베를레 계산, 단위 cm) ===================== */
function Strands(roots,L,N){this.N=N;this.seg=L/N;this.s=[];var self=this;roots.forEach(function(rt){var p=[],o=[];for(var i=0;i<=N;i++){var q=[rt[0]+(rt[2]||0)*i*self.seg*0.3,rt[1]+i*self.seg];p.push(q.slice());o.push(q.slice());}self.s.push({p:p,o:o,root:rt.slice(),dir:rt[2]||0});});}
/* opt: g(중력), wind(옆 힘, 풍속²에 비례해 넣음), stiff(0~1), damp, wet(bool) */
Strands.prototype.step=function(opt){var g=opt.g==null?1:opt.g,wd=opt.wind||0,st=opt.stiff||0,dm=opt.damp==null?0.92:opt.damp,seg=this.seg,N=this.N,dt=0.12;
  this.s.forEach(function(S){var p=S.p,o=S.o,i;p[0][0]=S.root[0];p[0][1]=S.root[1];p[1][0]=S.root[0]+S.dir*seg*0.3;p[1][1]=S.root[1]+seg;
    for(i=2;i<=N;i++){var vx=(p[i][0]-o[i][0])*dm,vy=(p[i][1]-o[i][1])*dm;o[i][0]=p[i][0];o[i][1]=p[i][1];p[i][0]+=vx+wd*dt;p[i][1]+=vy+g*dt;}
    for(var it=0;it<8;it++){for(i=1;i<N;i++){var a=p[i],b=p[i+1],dx=b[0]-a[0],dy=b[1]-a[1],d=Math.hypot(dx,dy)||1e-6,df=(d-seg)/d;if(i===1){b[0]-=dx*df;b[1]-=dy*df;}else{a[0]+=dx*df*0.5;a[1]+=dy*df*0.5;b[0]-=dx*df*0.5;b[1]-=dy*df*0.5;}}
      if(st>0)for(i=2;i<=N;i++){var rx=S.root[0]+S.dir*seg*0.3*i,ry=S.root[1]+i*seg,k=st*0.0025*(1-0.5*i/N);p[i][0]+=(rx-p[i][0])*k;p[i][1]+=(ry-p[i][1])*k;}
      p[0][0]=S.root[0];p[0][1]=S.root[1];p[1][0]=S.root[0]+S.dir*seg*0.3;p[1][1]=S.root[1]+seg;}});};
Strands.prototype.tipDx=function(){var t=0,self=this;this.s.forEach(function(S){t+=S.p[self.N][0]-S.p[1][0]-S.dir*self.seg*0.3*(self.N-1);});return t/this.s.length;};
Strands.prototype.draw=function(ctx,sc,ox,oy,col,w,alpha){var self=this;ctx.save();ctx.globalAlpha=alpha==null?1:alpha;ctx.strokeStyle=col;ctx.lineWidth=w||3;ctx.lineCap='round';ctx.lineJoin='round';
  this.s.forEach(function(S){ctx.beginPath();S.p.forEach(function(q,i){var X=ox+q[0]*sc,Y=oy+q[1]*sc;if(i)ctx.lineTo(X,Y);else ctx.moveTo(X,Y);});ctx.stroke();});ctx.restore();};
/* 바람 세기 w(0~5) → 옆 힘: 풍속² 비례. 젖으면 무게 1.3배, 다발이 뭉쳐 받는 넓이 0.6배(예시값) */
function windForce(w,wet){return 0.12*w*w*(wet?0.6:1);}
function settle(S,opt,n){for(var i=0;i<(n||400);i++)S.step(opt);return S;}
function stiffOf(v){return clamp(v/10,0,1)*0.9;}
function hairRoots(n,spread,dir){var r=[];for(var i=0;i<n;i++){var t=n===1?0:i/(n-1)-0.5;r.push([t*spread,0,t*(dir==null?0.6:dir)]);}return r;}
function dot2(s,x,y,r){return el('circle',{cx:x,cy:y,r:r||8,fill:C.orange,stroke:'#fff','stroke-width':2.5},s);}

/* ===================== 1부 ===================== */
function rngIn(h,n){return ctl(h).querySelector('[name='+n+']');}
P.p1_part=function(h){var ps=rngIn(h,'ps'),hl=rngIn(h,'hl'),side='c',W=560,H=330;seg(h,'button[data-side]',function(b){side=b.dataset.side;draw();});
  function draw(){var s=svgOf(h,W,H),p=+ps.value,l=+hl.value;el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    // 옆에서 본 머리
    var cx=140,cy=165,r=80;ktxt(s,cx,24,'옆에서 본 머리',{anchor:'middle',fill:C.ink,weight:700});
    el('circle',{cx:cx,cy:cy,r:r,fill:SKIN,stroke:INK,'stroke-width':2},s);
    var aH=rad(70+l*3),hx=cx+Math.cos(aH)*r,hy=cy-Math.sin(aH)*r;// 이마 선 각
    var hd='';for(var a=200;a>=70+l*3;a-=4){var A=rad(a);hd+=(hd?' L':'M')+P2(cx+Math.cos(A)*r*1.08,cy-Math.sin(A)*r*1.08);}el('path',{d:hd,fill:'none',stroke:HC.bob,'stroke-width':14,'stroke-linecap':'round',opacity:0.85},s);
    el('circle',{cx:hx,cy:hy,r:6,fill:C.blue},s);ktxt(s,hx+12,hy+14,'이마 선',{size:12,fill:C.blue});
    var aP=aH+rad(p*6),px=cx+Math.cos(aP)*r*1.04,py=cy-Math.sin(aP)*r*1.04;el('circle',{cx:px,cy:py,r:7,fill:p<0?C.red:C.orange,stroke:'#fff','stroke-width':2},s);
    ktxt(s,px+(p<0?10:-10),py-12,'가르마 시작',{size:12,fill:p<0?C.red:C.orange,anchor:p<0?'start':'end'});
    el('circle',{cx:cx+r*0.55,cy:cy+r*0.05,r:4,fill:INK},s);
    // 앞에서 본 머리
    headS(s,{cx:410,cy:160,r:72,who:'haru',col:HC.bob,len:3,end:'in',bang:4,hl:l,part:p,side:side,vol:10,locks:6,inner:0});
    ktxt(s,410,24,'앞에서 본 단발 가발',{anchor:'middle',fill:C.ink,weight:700});
    var bad=p<0;out(h).innerHTML='가르마 시작점: 이마 선 '+(p<0?'앞 <b style="color:'+C.red+'">'+num(-p,0)+'cm</b> — 이마를 가르는 선이 됩니다(6부 f1).':'뒤 <b>'+p+'cm</b> — '+(p===0?'이마 선 바로 위라 조금 드러납니다.':'앞머리 다발 사이로 숨습니다.'))+
      ' · 이마 선 높이 '+l+(l>=7?' — 이마가 넓어 어른스러워 보입니다.':l<=3?' — 이마가 좁아 얼굴이 작아 보입니다.':' — 보통입니다.');}
  [ps,hl].forEach(function(i){onIn(i,draw);});draw();};

P.p1_volume=function(h){var t=rngIn(h,'t'),kind='straight',W=560,H=330;seg(h,'button[data-kind]',function(b){kind=b.dataset.kind;draw();});
  function draw(){var s=svgOf(h,W,H),v=+t.value,sc=72*1.84/16;el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var wave={straight:0,wave:5,curly:9}[kind];headS(s,{cx:200,cy:150,r:72,who:'haru',col:HC.bob,len:3,end:'in',bang:4,vol:v*sc,skull:true,wave:wave,locks:6,inner:1});
    var wd=16+2*v,pct=(wd-16)/16*100,bx=360;ktxt(s,bx,40,'실루엣 폭',{fill:C.ink,weight:700});
    el('rect',{x:bx,y:56,width:16*8,height:18,rx:4,fill:'#dfe4ea'},s);ktxt(s,bx+16*8+6,70,'머리 16cm',{size:12});
    el('rect',{x:bx,y:86,width:wd*8,height:18,rx:4,fill:C.teal},s);ktxt(s,bx,124,f2(wd,1)+'cm (+'+f2(pct,1)+'%)',{size:13,fill:C.ink,weight:700});
    var lab=v===0?'헬멧처럼 두피에 붙음':v<1?'얇음 — 머리가 작아 보임':v<=2?'보통 생머리':'풍성 — 웨이브·곱슬';ktxt(s,bx,150,lab,{size:13,fill:v===0?C.red:C.green});
    ktxt(s,bx,190,'점선 = 머리 원형',{size:12,fill:C.blue});
    out(h).innerHTML='실루엣 폭 = 16 + 2 × '+f2(v,1)+' = <b>'+f2(wd,1)+'cm</b>, 머리 원형보다 '+f2(pct,1)+'% 큼 — '+lab+(kind!=='straight'&&v<2?'. 웨이브·곱슬은 두께를 더 크게 잡아야 자연스럽습니다.':'.');}
  onIn(t,draw);draw();};

var IMP={out:'활발',in:'부드럽고 차분',flat:'단정',hide:'신비롭고 차가움'};
P.p1_length=function(h){var ln=rngIn(h,'len'),end='out',W=560,H=400;seg(h,'button[data-end]',function(b){end=b.dataset.end;draw();});
  function draw(){var s=svgOf(h,W,H),L=+ln.value,cy=120,r=62,cx=230;el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    headS(s,{cx:cx,cy:cy,r:r,who:'haru',col:HC.bob,len:L,end:end==='hide'?'flat':end,bang:end==='hide'?10:4,vol:10,locks:6,inner:0});
    [['귀',cy+r*0.2],['목덜미',cy+r*0.85],['어깨',cy+r*1.5]].forEach(function(m){el('line',{x1:60,y1:m[1],x2:400,y2:m[1],stroke:C.blue,'stroke-width':1,'stroke-dasharray':'4 4'},s);ktxt(s,56,m[1]+4,m[0],{size:12,fill:C.blue,anchor:'end'});});
    var nm=lenName(L);ktxt(s,420,60,nm,{size:16,fill:C.ink,weight:700});ktxt(s,420,88,'인상: '+IMP[end],{size:14,fill:C.teal,weight:700});
    out(h).innerHTML='길이 '+L+' → <b>'+nm+'</b>'+(L<=2?'(귀가 보이고 목덜미 위)':L<=5?'(귀를 덮고 어깨에 닿기 전)':'(어깨 아래)')+' · 끝: '+{out:'바깥으로 튐',in:'안으로 말림',flat:'일자',hide:'한쪽 눈 가림'}[end]+' → 인상 <b>'+IMP[end]+'</b>(예시 판정).';}
  onIn(ln,draw);draw();};

P.p1_order=function(h){var W=520,H=360,done=[],warn='';var NAMES=['가운데 선·이마 선','앞머리','옆머리','뒷머리','정리·잔머리'];
  ctl(h).querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){var k=b.dataset.s;if(k==='r'){done=[];warn='';draw();return;}k=+k;if(done.indexOf(k)>=0)return;
    warn=k!==done.length?'순서가 어긋났습니다. 지금은 <b>'+NAMES[done.length]+'</b> 차례입니다. '+(k===3?'뒷머리를 먼저 그리면 앞머리가 얼굴을 얼마나 가릴지 몰라 다시 고치게 됩니다.':k===4?'잔머리부터 넣으면 큰 흐름이 사라집니다.':'얼굴에 가까운 것부터 정합니다.'):'';if(!warn)done.push(k);draw();});});
  function draw(){var s=svgOf(h,W,H),cx=260,cy=170,r=80,last=done[done.length-1];el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    function c(k){return k===last?C.orange:INK;}var col=HC.bob;
    if(done.indexOf(3)>=0)el('path',{d:'M'+P2(cx-r*1.1,cy)+' A'+(r*1.1)+','+(r*1.15)+' 0 0 1 '+P2(cx+r*1.1,cy)+' L'+P2(cx+r*1.05,cy+r*0.95)+' L'+P2(cx-r*1.05,cy+r*0.95)+'Z',fill:col,stroke:c(3),'stroke-width':2.4},s);
    el('ellipse',{cx:cx,cy:cy-r*0.05,rx:r*0.9,ry:r*1.05,fill:SKIN,stroke:INK,'stroke-width':2},s);
    [-1,1].forEach(function(d){el('ellipse',{cx:cx+d*r*0.34,cy:cy+r*0.12,rx:r*0.1,ry:r*0.14,fill:EYE.haru},s);});
    if(done.indexOf(0)>=0&&done.indexOf(4)<0){el('line',{x1:cx,y1:cy-r*1.1,x2:cx,y2:cy+r,stroke:last===0?C.orange:C.blue,'stroke-width':1.5,'stroke-dasharray':'5 4'},s);el('path',{d:'M'+P2(cx-r*0.7,cy-r*0.45)+' Q'+P2(cx,cy-r*0.75)+' '+P2(cx+r*0.7,cy-r*0.45),fill:'none',stroke:last===0?C.orange:C.blue,'stroke-width':2},s);}
    if(done.indexOf(2)>=0)[-1,1].forEach(function(d){el('path',{d:'M'+P2(cx+d*r*0.75,cy-r*0.45)+' Q'+P2(cx+d*r*1.05,cy+r*0.2)+' '+P2(cx+d*r*0.95,cy+r*0.9)+' L'+P2(cx+d*r*0.72,cy+r*0.8)+' Q'+P2(cx+d*r*0.8,cy+r*0.1)+' '+P2(cx+d*r*0.75,cy-r*0.45)+'Z',fill:col,stroke:c(2),'stroke-width':2.2},s);});
    if(done.indexOf(1)>=0)el('path',{d:'M'+P2(cx-r*0.95,cy-r*0.1)+' Q'+P2(cx-r,cy-r*1.15)+' '+P2(cx,cy-r*1.15)+' Q'+P2(cx+r,cy-r*1.15)+' '+P2(cx+r*0.95,cy-r*0.1)+' L'+P2(cx+r*0.6,cy-r*0.2)+' L'+P2(cx+r*0.35,cy-r*0.05)+' L'+P2(cx+r*0.1,cy-r*0.22)+' L'+P2(cx-r*0.15,cy-r*0.04)+' L'+P2(cx-r*0.4,cy-r*0.2)+' L'+P2(cx-r*0.65,cy-r*0.06)+'Z',fill:col,stroke:c(1),'stroke-width':2.2},s);
    if(done.indexOf(4)>=0){[[cx-r*0.3,cy-r*1.15,cx-r*0.45,cy-r*1.35],[cx+r*0.2,cy-r*1.15,cx+r*0.3,cy-r*1.38],[cx+r*1.05,cy+r*0.4,cx+r*1.25,cy+r*0.35]].forEach(function(q){el('path',{d:'M'+P2(q[0],q[1])+' Q'+P2((q[0]+q[2])/2+6,(q[1]+q[3])/2)+' '+P2(q[2],q[3]),fill:'none',stroke:C.orange,'stroke-width':1.6},s);});}
    NAMES.forEach(function(n,i){var on=done.indexOf(i)>=0;el('rect',{x:16,y:20+i*30,width:130,height:24,rx:6,fill:on?'#ecf7ef':'#f2f4f7',stroke:on?C.green:'#d5dbe2'},s);ktxt(s,24,37+i*30,(i+1)+' '+n,{size:12,fill:on?C.green:C.muted});});
    out(h).innerHTML=warn||(done.length===5?'다섯 단계 완료 — 얼굴에 가까운 것부터 큰 것에서 작은 것으로 쌓았습니다.':done.length?'<b>'+NAMES[done[done.length-1]]+'</b>까지 완료. 다음은 '+NAMES[done.length]+'.':'① 가운데 선·이마 선부터 눌러 보세요.');}
  draw();};

/* ===================== 2부 ===================== */
P.p2_bundle=function(h){var n=rngIn(h,'n'),k=rngIn(h,'k'),W=560,H=400;
  function draw(){var s=svgOf(h,W,H),N=+n.value,K=+k.value,tot=N*K;el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    headS(s,{cx:250,cy:110,r:62,who:'sia',col:'#2c2833',len:8,end:'flat',bang:5,vol:8,locks:N,inner:K,lineCol:'#9a94a8',lineCol2:'#6d6780',outfit:'#34363F'});
    var lab=tot===0?'덩어리만 — 플라스틱처럼 매끈':tot<20?'덩어리 위주':tot<=60?'덩어리와 세밀함이 함께':tot<=100?'조금 많음 — 무거워 보임':'철사 뭉치(6부 f3)';
    ktxt(s,250,392,'다발 '+N+' × 속 선 '+K+' = '+tot+'줄',{anchor:'middle',size:14,fill:C.ink,weight:700});
    out(h).innerHTML='그림 선 수 = '+N+' × '+K+' = <b>'+tot+'줄</b> → '+lab+'. 다발 하나가 맡는 머리카락 ≈ 100,000 ÷ '+N+' ≈ '+Math.round(100000/N).toLocaleString('ko-KR')+'올(예시).';}
  [n,k].forEach(function(i){onIn(i,draw);});draw();};

P.p2_contact=function(h){var c=ctl(h),sh=rngIn(h,'sh'),fr=rngIn(h,'front'),chk=c.querySelector('input[type=checkbox]'),W=520,H=420;
  function draw(){var s=svgOf(h,W,H),a=+sh.value,F=+fr.value,hide=chk.checked;el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var hx=250,hy=110,sx=250+a*2.2,sy=250;var strands=[];for(var i=0;i<6;i++)strands.push({x:hx+40+i*6,front:i<F});
    function path(st){var x0=st.x,y0=hy+20;if(st.front&&a>=0){var cxp=sx+46+(st.x-hx-40)*3.2,cyp=sy-40+(st.x-hx-40)*0.5;return {d:'M'+P2(x0,y0)+' Q'+P2(x0+8,y0+70)+' '+P2(cxp,cyp)+' Q'+P2(cxp+24,cyp+8)+' '+P2(cxp+18,cyp+150),c:[cxp,cyp]};}
      return {d:'M'+P2(x0,y0)+' Q'+P2(x0+4,y0+90)+' '+P2(x0+(st.front?6:-4),y0+250),c:null};}
    strands.filter(function(st){return !st.front||a<0;}).forEach(function(st){el('path',{d:path(st).d,fill:'none',stroke:'#2c2833','stroke-width':9,'stroke-linecap':'round'},s);});
    el('path',{d:'M'+P2(sx-120,H)+' Q'+P2(sx-110,sy-30)+' '+P2(sx-10,sy-40)+' Q'+P2(sx+90,sy-48)+' '+P2(sx+110,sy+20)+' L'+P2(sx+120,H)+'Z',fill:'#34363F',stroke:INK,'stroke-width':2.4},s);
    if(!hide)strands.filter(function(st){return !st.front||a<0;}).forEach(function(st){el('path',{d:path(st).d,fill:'none',stroke:C.red,'stroke-width':1.6,'stroke-dasharray':'5 4'},s);});
    el('circle',{cx:hx,cy:hy,r:56,fill:SKIN,stroke:INK,'stroke-width':2},s);el('path',{d:'M'+P2(hx-58,hy+10)+' A58,60 0 0 1 '+P2(hx+58,hy+10)+' L'+P2(hx+52,hy+30)+' Q'+P2(hx,hy-30)+' '+P2(hx-52,hy+30)+'Z',fill:'#2c2833',stroke:INK,'stroke-width':2},s);
    var cnt=0;strands.filter(function(st){return st.front&&a>=0;}).forEach(function(st){var P_=path(st);el('path',{d:P_.d,fill:'none',stroke:'#2c2833','stroke-width':9,'stroke-linecap':'round'},s);el('path',{d:P_.d,fill:'none',stroke:'#6d6780','stroke-width':1.2},s);dot2(s,P_.c[0],P_.c[1],6);cnt++;});
    out(h).innerHTML=(a<0?'어깨가 뒤로 빠져 앞으로 넘긴 다발도 닿지 않고 곧게 떨어집니다.':'어깨에 닿은 다발 <b>'+cnt+'개</b> — 닿는 곳(주황 점)에서 꺾여 어깨면을 따라 흐릅니다.')+' 뒤로 넘어간 다발 '+(6-F)+'개는 '+(hide?'어깨에 가려 선을 지웠습니다.':'<b style="color:'+C.red+'">선이 어깨 위로 비쳐 떠 보입니다</b>(가려진 선 지우기를 켜 보세요).');}
  [sh,fr].forEach(function(i){onIn(i,draw);});chk.addEventListener('change',draw);draw();};

P.p2_tie=function(h){var c=ctl(h),ht=rngIn(h,'h'),chk=c.querySelector('input[type=checkbox]'),tie='pony',W=520,H=380;seg(h,'button[data-tie]',function(b){tie=b.dataset.tie;draw();});
  function draw(){var s=svgOf(h,W,H),v=+ht.value;el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    headS(s,{cx:240,cy:160,r:72,who:'sia',col:HC.chestnut,len:tie==='half'?7:3,end:'flat',bang:4,vol:8,tie:tie,tieH:v,noConverge:chk.checked,hideLines:true,lineCol2:'#e0b48a',outfit:'#34363F'});
    if(chk.checked){for(var i=0;i<6;i++){var x=180+i*24;el('path',{d:'M'+P2(x,100)+' L'+P2(x+2,170),fill:'none',stroke:C.red,'stroke-width':1.6},s);}}
    var imp=v>=7?'경쾌':v>=4?'보통':'차분하고 어른스러움';ktxt(s,420,60,'묶는 높이 '+v,{fill:C.ink,weight:700});ktxt(s,420,84,'인상: '+imp,{fill:C.teal,weight:700});
    out(h).innerHTML=chk.checked?'<b style="color:'+C.red+'">흐름 무시</b> — 위쪽 다발이 묶은 점과 상관없이 아래로 떨어져, 꼬리를 나중에 붙인 것처럼 보입니다(6부 f4).':
      ({pony:'포니테일',twin:'양쪽 묶음',half:'반묶음'}[tie])+' · 이마 선의 다발 8개가 모두 묶은 점으로 모입니다. 묶는 높이 '+v+' → <b>'+imp+'</b>(예시 판정).'+(tie==='twin'?' 양쪽 묶음은 머리 이름 때문에 어려 보일 수 있어, AI 문장에는 높이·길이를 적습니다(6부).':'');}
  onIn(ht,draw);chk.addEventListener('change',draw);draw();};

function curlLen(r,p,n){return n*Math.sqrt(Math.pow(2*Math.PI*r,2)+p*p);}
P.p2_curl=function(h){var R=rngIn(h,'r'),Pp=rngIn(h,'p'),Nn=rngIn(h,'n'),m='curl',W=540,H=400;seg(h,'button[data-m]',function(b){m=b.dataset.m;draw();});
  function draw(){var s=svgOf(h,W,H),r=+R.value,p=+Pp.value,n=+Nn.value,sc=12;el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var cx=170,y0=40;if(m==='curl'){var rr=r*sc*1.6,drop=n*p*sc*0.9;el('rect',{x:cx-rr,y:y0,width:rr*2,height:drop,fill:'none',stroke:C.orange,'stroke-width':1.2,'stroke-dasharray':'4 4'},s);
      var front='',back='';for(var i=0;i<=n*60;i++){var th=i/60*2*Math.PI,x=cx+Math.sin(th)*rr,y=y0+i/60*p*sc*0.9+Math.cos(th)*rr*0.18;var cmd=(Math.cos(th)>0?'F':'B');
        if(cmd==='F'){front+=(front&&prevF?' L':' M')+P2(x,y);}else{back+=(back&&!prevF?' L':' M')+P2(x,y);}var prevF=cmd==='F';}
      el('path',{d:back,fill:'none',stroke:'#c9b07a','stroke-width':7,'stroke-linecap':'round',opacity:0.6},s);el('path',{d:front,fill:'none',stroke:HC.blonde,'stroke-width':11,'stroke-linecap':'round'},s);el('path',{d:front,fill:'none',stroke:INK,'stroke-width':1.2},s);
      var Lh=curlLen(r,p,n),dr=n*p;ktxt(s,330,60,'머리카락 길이 '+f2(Lh,1)+'cm',{fill:C.ink,weight:700,size:14});ktxt(s,330,86,'내려온 높이 '+f2(dr,1)+'cm',{fill:C.teal,weight:700,size:14});ktxt(s,330,112,'짧아 보이는 배수 '+f2(Lh/dr,1)+'배',{fill:C.orange,weight:700,size:14});
      out(h).innerHTML='한 바퀴 = √((2 × π × '+r+')² + '+p+'²) ≈ '+f2(Lh/n,2)+'cm, × '+n+'바퀴 = <b>'+f2(Lh,1)+'cm</b>. 내려온 높이는 '+n+' × '+p+' = '+f2(dr,1)+'cm → 약 '+f2(Lh/dr,1)+'배 짧아 보입니다. 앞쪽 홈은 진하게, 뒤로 도는 홈은 연하게.';}
    else{var sz=26;for(var j=0;j<n+3;j++){var w=sz*(1-j*0.06),y=y0+j*w*1.1;['#8a5a3c','#a06c48'].forEach(function(cc,q){var dx=(j%2?1:-1)*w*0.25*(q?-1:1);el('path',{d:'M'+P2(cx+dx,y)+' Q'+P2(cx+dx+w*0.9,y+w*0.55)+' '+P2(cx+dx,y+w*1.15)+' Q'+P2(cx+dx-w*0.9,y+w*0.55)+' '+P2(cx+dx,y)+'Z',fill:cc,stroke:INK,'stroke-width':1.6},s);});}
      out(h).innerHTML='땋은 머리 — 부드러운 마름모를 '+(n+3)+'개 겹쳐 이었습니다. 아래로 갈수록 조금씩 작게 하면 끝이 가늘어지고, 매듭 안에 다음 매듭으로 조여 드는 흐름선을 넣습니다.';}}
  [R,Pp,Nn].forEach(function(i){onIn(i,draw);});draw();};

/* ===================== 3부 ===================== */
var PRESET={red:[180,60,50],brown:[170,125,85],blonde:[230,200,140],silver:[200,205,214],black:[30,28,34]};
function luma(r,g,b){return 0.299*r+0.587*g+0.114*b;}
P.p3_gray=function(h){var c=ctl(h),R=rngIn(h,'r'),G=rngIn(h,'g'),Bb=rngIn(h,'b'),W=560,H=300;
  seg(h,'button[data-c]',function(b){var v=PRESET[b.dataset.c];R.value=v[0];G.value=v[1];Bb.value=v[2];draw();});
  function draw(){var s=svgOf(h,W,H),r=+R.value,g=+G.value,b=+Bb.value,L=luma(r,g,b),pct=L/255*100,gray=Math.round(L);var col=rgb([r,g,b]),gc=rgb([gray,gray,gray]);el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    headS(s,{cx:140,cy:120,r:60,who:'moa',col:col,len:5,end:'in',bang:4,vol:8,locks:6,inner:0,outfit:'#D4B48A'});headS(s,{cx:400,cy:120,r:60,who:'moa',col:gc,len:5,end:'in',bang:4,vol:8,locks:6,inner:0,outfit:'#c8c8c8',eyeCol:'#777'});
    ktxt(s,140,292,'컬러',{anchor:'middle',fill:C.ink,weight:700});ktxt(s,400,292,'흑백 — 밝기 '+f2(pct,0)+'%',{anchor:'middle',fill:C.ink,weight:700});
    var tone=pct<20?'검게 칠함(베타)':pct<45?'진한 톤':pct<65?'중간 톤':pct<80?'옅은 톤':'톤 없음(선만)';
    out(h).innerHTML='밝기 = 0.299 × '+r+' + 0.587 × '+g+' + 0.114 × '+b+' ≈ <b>'+f2(L,1)+'</b> → '+f2(L,1)+' ÷ 255 ≈ <b>'+f2(pct,0)+'%</b> → 흑백에서는 <b>'+tone+'</b>.';}
  [R,G,Bb].forEach(function(i){onIn(i,draw);});draw();};

P.p3_shine=function(h){var l=rngIn(h,'l'),v=rngIn(h,'v'),dir='across',W=560,H=340;seg(h,'button[data-dir]',function(b){dir=b.dataset.dir;draw();});
  function draw(){var s=svgOf(h,W,H),L=+l.value,V=+v.value,a=(L+V)/2;el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var cx=200,cy=150,r=74;var shinePos=clamp(Math.sin(rad(a))*0.95,0,1);
    var o=headS(s,{cx:cx,cy:cy,r:r,who:'moa',col:'#24212a',len:7,end:'in',bang:4,vol:10,locks:7,inner:0,lineCol:'#5a5566',shine:dir==='across'?shinePos:null,shineW:6,outfit:'#D4B48A'});
    if(dir==='along'){for(var i=0;i<9;i++){var x=cx-r*0.8+i*r*0.2;el('line',{x1:x,y1:cy-r*0.95+Math.abs(i-4)*6,x2:x+2,y2:cy-r*0.45,stroke:'#fff','stroke-width':2.5,opacity:0.9},s);}}
    var ox=420,oy=150;el('circle',{cx:ox,cy:oy,r:50,fill:'none',stroke:'#d5dbe2'},s);
    function ray(deg,col,lab){var x=ox+Math.cos(rad(deg))*95,y=oy-Math.sin(rad(deg))*95;arrowS(s,x,y,ox+Math.cos(rad(deg))*52,oy-Math.sin(rad(deg))*52,col,2.4);ktxt(s,x,y-6,lab,{size:12,fill:col,anchor:'middle'});}
    ray(180-L,C.orange,'빛 '+L+'°');ray(V,C.blue,'눈 '+V+'°');el('circle',{cx:ox+Math.cos(rad(a))*50,cy:oy-Math.sin(rad(a))*50,r:6,fill:'#fff',stroke:C.ink,'stroke-width':2},s);
    out(h).innerHTML=dir==='across'?'띠 높이 ≈ ('+L+' + '+V+') ÷ 2 = <b>'+f2(a,1)+'°</b> — 띠가 머리 둘레를 감고, 다발마다 조금씩 끊깁니다.':'<b style="color:'+C.red+'">흐름과 나란한 줄</b> — 둥근 입체가 사라지고 플라스틱 줄무늬처럼 보입니다(6부 f5).';}
  [l,v].forEach(function(i){onIn(i,draw);});draw();};

P.p3_light=function(h){var c=ctl(h),q=rngIn(h,'q'),d=rngIn(h,'d'),chk=c.querySelector('input[type=checkbox]'),W=540,H=340;
  function draw(){var s=svgOf(h,W,H),Q=+q.value,D=+d.value,hl=chk.checked;el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var cx=200,cy=160,r=76;var hairCol=mix('#f6f6f4','#9a9ca2',clamp((Q-3)/10,0,0.7));
    headS(s,{cx:cx,cy:cy,r:r,who:'doctor',col:hairCol,len:2,end:'flat',bang:3,vol:10,locks:Math.max(2,Q),inner:Math.floor(Q/4),lineCol:'#8a8c92',outfit:'#fbfbfd'});
    var nd=Math.round(D/100*8);for(var i=0;i<nd;i++){var x=cx-r*0.7+i*r*0.2;el('path',{d:'M'+P2(x,cy-r*1.05)+' Q'+P2(x+8,cy-r*0.8)+' '+P2(x+4,cy-r*0.5),fill:'none',stroke:'#3a3d44','stroke-width':5,'stroke-linecap':'round'},s);}
    if(hl)el('path',{d:'M'+P2(cx-r*0.7,cy-r*0.4)+' Q'+P2(cx,cy-r*0.72)+' '+P2(cx+r*0.7,cy-r*0.4),fill:'none',stroke:INK,'stroke-width':3},s);
    var look=Q>4?'회색 머리처럼 보임':'흰머리로 보임',age=D===0?'나이가 많아 보임':D<=30?'기운이 남은 흰머리':D<=40?'희끗한 머리':'회색 머리처럼 보임';
    ktxt(s,380,60,look,{fill:Q>4?C.red:C.green,weight:700});ktxt(s,380,86,age,{fill:C.teal,weight:700,size:13});if(hl)ktxt(s,380,112,'이마 선 → 무거워 보임',{fill:C.red,size:13});
    out(h).innerHTML='선·톤의 양 '+Q+' → <b>'+look+'</b>(예시 판정: 4를 넘으면 회색). 짙은 머리 '+D+'% → '+age+'.'+(hl?' 이마 선을 그려 머리와 이마 사이에 경계가 생겼습니다. 밝은 머리는 흐름만 그립니다.':'');}
  [q,d].forEach(function(i){onIn(i,draw);});chk.addEventListener('change',draw);draw();};

P.p3_black=function(h){var w=rngIn(h,'w'),wv=rngIn(h,'wave'),W=540,H=360;
  function draw(){var s=svgOf(h,W,H),Wr=+w.value,Wv=+wv.value;el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var cx=200,cy=130,r=70;headS(s,{cx:cx,cy:cy,r:r,who:'moa',col:'#141217',len:8,end:'in',bang:4,vol:10,wave:Wv,locks:0,hideLines:true,outfit:'#ffffff',ink:'#000'});
    var bands=1+Math.round(Wv/3),area=Wr/100,bw=Math.max(0,area*40/bands);
    for(var b=0;b<bands;b++){var yy=cy-r*0.75+b*(r*2.6/Math.max(1,bands));for(var i=0;i<6;i++){var x=cx-r*1.12+i*r*0.42;if(yy>cy-r*0.5&&i>0&&i<5)continue;if(bw>0)el('path',{d:'M'+P2(x,yy+Math.sin(i+b)*4)+' L'+P2(x+r*0.22,yy+Math.sin(i+b+1)*4),stroke:'#fff','stroke-width':bw,'stroke-linecap':'round'},s);}}
    var imp=Wr===0?'까만 덩어리 — 다발이 사라짐':Wr<10?'차분':Wr<=25?'윤기 있는 흑발':'화려하고 눈에 띄는 흑발';ktxt(s,390,60,'윤기 비율 '+Wr+'%',{fill:C.ink,weight:700});ktxt(s,390,86,imp,{fill:C.teal,weight:700,size:13});
    out(h).innerHTML='윤기 비율 = 흰 넓이 ÷ 머리 넓이 = <b>'+Wr+'%</b> → '+imp+'(예시 구간: 10% 아래 차분, 10~25% 윤기, 25% 넘으면 화려). 웨이브 '+Wv+'에서 흰 띠가 '+bands+'줄로 나뉩니다.';}
  [w,wv].forEach(function(i){onIn(i,draw);});draw();};

/* ===================== 4부 ===================== */
function headCanvas(ctx,cx,cy,r,col,eye){ctx.fillStyle=SKIN;ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(cx,cy,r*0.85,r,0,0,7);ctx.fill();ctx.stroke();
  ctx.fillStyle=col;ctx.beginPath();ctx.ellipse(cx,cy-r*0.25,r*0.98,r*0.85,0,Math.PI,0);ctx.fill();ctx.stroke();ctx.fillStyle=eye||EYE.haru;[-1,1].forEach(function(d){ctx.beginPath();ctx.ellipse(cx+d*r*0.32,cy+r*0.15,r*0.09,r*0.13,0,0,7);ctx.fill();});}
P.p4_wind=function(h){var c=ctl(h),w=rngIn(h,'w'),st=rngIn(h,'st'),chk=c.querySelector('input[type=checkbox]'),W=520,H=380;var cv=canvasOf(h,W,H),ctx=cv.getContext('2d');
  function draw(){var Wd=+w.value,S_=+st.value,opp=chk.checked,sc=4.2,ox=200,oy=110;
    var back=settle(new Strands(hairRoots(7,22,0.5),50,12),{g:1,wind:windForce(Wd),stiff:stiffOf(S_)},500);
    var bang=settle(new Strands(hairRoots(5,16,0.2),9,6),{g:1,wind:windForce(Wd)*(opp?-1:1),stiff:stiffOf(S_)},500);
    ctx.fillStyle='#fbfcfd';ctx.fillRect(0,0,W,H);back.draw(ctx,sc,ox,oy-20,'#c9a47a',7);back.draw(ctx,sc,ox,oy-20,'#8a6a4a',1.2);headCanvas(ctx,ox,oy+30,52,'#c9a47a');bang.draw(ctx,sc,ox,oy-12,opp?'#c0392b':'#b08a60',6);
    for(var i=0;i<Math.round(Wd*2);i++){ctx.strokeStyle='rgba(36,88,214,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(20,60+i*30);ctx.lineTo(70+Wd*8,60+i*30);ctx.stroke();}
    var dx=back.tipDx();ctx.fillStyle=C.ink;ctx.font='700 14px '+KFONT;ctx.fillText('바람 힘 ∝ 풍속² = '+f2(Wd*Wd,2),330,40);ctx.fillText('뒷머리 끝 이동 '+f2(dx,1)+'cm',330,64);
    out(h).innerHTML='풍속 '+Wd+' → 미는 힘은 풍속 1의 <b>'+f2(Wd*Wd,2)+'배</b>. 50cm 뒷머리 끝이 평균 <b>'+f2(dx,1)+'cm</b> 날립니다(뻣뻣함 '+S_+').'+(opp?' <b style="color:'+C.red+'">앞머리만 반대</b> — 바람이 두 개 부는 것처럼 보입니다(6부 f6).':' 앞머리도 같은 방향입니다.');}
  [w,st].forEach(function(i){onIn(i,draw);});chk.addEventListener('change',draw);draw();};

P.p4_lag=function(h){var c=ctl(h),ln=rngIn(h,'len'),chk=c.querySelector('input[type=checkbox]'),btn=c.querySelector('button'),W=520,H=360;var cv=canvasOf(h,W,H),ctx=cv.getContext('2d'),raf=null;
  function info(){var L=+ln.value,t=L/150,fr=t*24;out(h).innerHTML='늦는 시간 = '+L+' ÷ 150 = <b>'+f2(t,2)+'초</b> → × 24 = 약 <b>'+f2(fr,0)+'장</b> 늦게 따라옵니다(전달 빠르기 150cm/초는 예시값).'+(chk.checked?' <b style="color:'+C.red+'">같이 돌기</b> — 머리카락이 헬멧처럼 한 덩어리로 움직입니다.':'');}
  function run(){if(raf)cancelAnimationFrame(raf);var L=+ln.value,sc=Math.min(4,250/L),S=new Strands(hairRoots(5,14,0.3),L,12),fr=0,ghosts=[];settle(S,{g:1,wind:0,stiff:0.05},200);var base=S.s.map(function(q){return q.root.slice();});
    function frame(){var e=fr<30?0.5-0.5*Math.cos(Math.PI*fr/30):1,shift=e*40;S.s.forEach(function(q,i){q.root[0]=base[i][0]+shift;});
      if(chk.checked){S.s.forEach(function(q,i){q.p.forEach(function(pt,k){pt[0]=q.root[0]+q.dir*S.seg*0.3*k;pt[1]=q.root[1]+k*S.seg;q.o[k]=pt.slice();});});}else{for(var k=0;k<2;k++)S.step({g:1,wind:0,stiff:0.05,damp:0.96});}
      if(fr%10===0)ghosts.push(S.s.map(function(q){return q.p.map(function(pt){return pt.slice();});}));
      ctx.fillStyle='#fbfcfd';ctx.fillRect(0,0,W,H);var ox=120,oy=70;
      ghosts.forEach(function(gs){ctx.strokeStyle='rgba(138,106,74,.22)';ctx.lineWidth=3;gs.forEach(function(pp){ctx.beginPath();pp.forEach(function(pt,i){var X=ox+pt[0]*sc,Y=oy+pt[1]*sc;if(i)ctx.lineTo(X,Y);else ctx.moveTo(X,Y);});ctx.stroke();});});
      S.draw(ctx,sc,ox,oy,'#c9a47a',6);headCanvas(ctx,ox+S.s[2].root[0]*sc,oy+10,40,'#c9a47a');fr++;if(fr<110&&!RM)raf=requestAnimationFrame(frame);}
    if(RM){fr=0;for(var z=0;z<110;z++){frame();}}else frame();info();}
  ln.addEventListener('input',function(){info();});ln.addEventListener('change',run);btn.addEventListener('click',run);chk.addEventListener('change',run);run();};

P.p4_wet=function(h){var m='dry',W=540,H=360;seg(h,'button[data-m]',function(b){m=b.dataset.m;draw();});
  var INFO={dry:['마른 머리',7,1,1],hand:['손으로 쓸어 올림',7,1,1],wet:['젖은 머리',14,0.6,1.3],water:['물속',10,1.4,0.2]};
  function draw(){var s=svgOf(h,W,H),I=INFO[m],cx=200,cy=150,r=70;el('rect',{x:0,y:0,width:W,height:H,fill:m==='water'?'#e8f3fb':'#fbfcfd'},s);
    if(m==='water'){for(var i=0;i<14;i++){var a=-Math.PI*0.95+i*Math.PI*1.9/13,L=r*1.1+(i%3)*12;var x1=cx+Math.cos(a)*r*0.8,y1=cy-r*0.2+Math.sin(a)*r*0.8,x2=cx+Math.cos(a)*(r+L),y2=cy-r*0.2+Math.sin(a)*(r+L);
        el('path',{d:'M'+P2(x1,y1)+' Q'+P2((x1+x2)/2+Math.sin(i)*14,(y1+y2)/2+Math.cos(i)*14)+' '+P2(x2,y2),fill:'none',stroke:'#6b4430','stroke-width':10,'stroke-linecap':'round'},s);}
      headS(s,{cx:cx,cy:cy,r:r,who:'doctor',col:'#6b4430',len:0,end:'flat',bang:2,vol:4,locks:0,hideLines:true,outfit:'#fbfbfd'});[[330,80,8],[350,140,5],[320,200,6]].forEach(function(b){el('circle',{cx:b[0],cy:b[1],r:b[2],fill:'none',stroke:C.blue,'stroke-width':1.6},s);});}
    else{var wet=m==='wet';headS(s,{cx:cx,cy:cy,r:r,who:'doctor',col:'#6b4430',len:wet?3:2,end:wet?'flat':'out',bang:wet?6:3,vol:wet?3:12,locks:I[1],inner:0,lineCol:'#3a2418',outfit:'#fbfbfd'});
      if(wet){for(var j=0;j<6;j++){el('path',{d:'M'+P2(cx-r*0.7+j*r*0.28,cy-r*0.2)+' l -3,16 l 6,0 z',fill:C.blue,opacity:0.7},s);}}
      if(m==='hand'){el('path',{d:'M'+P2(cx-r*0.9,cy-r*0.55)+' Q'+P2(cx,cy-r*0.95)+' '+P2(cx+r*0.6,cy-r*0.75)+' L'+P2(cx+r*0.7,cy-r*0.55)+' Q'+P2(cx,cy-r*0.72)+' '+P2(cx-r*0.85,cy-r*0.35)+'Z',fill:SKIN,stroke:INK,'stroke-width':2},s);
        for(var k=0;k<4;k++){var fx=cx-r*0.5+k*r*0.32;el('path',{d:'M'+P2(fx,cy-r*0.82)+' q 4,-22 -6,-34',fill:'none',stroke:'#6b4430','stroke-width':3,'stroke-linecap':'round'},s);}dot2(s,cx,cy-r*0.8,6);}}
    ktxt(s,380,60,I[0],{fill:C.ink,weight:700,size:15});ktxt(s,380,88,'다발 수 '+I[1]+'개',{size:13});ktxt(s,380,110,'부피 ×'+I[2],{size:13});ktxt(s,380,132,'무게 ×'+I[3],{size:13});
    out(h).innerHTML={dry:'마른 머리 — 다발 7개, 부피와 무게는 기준값입니다.',hand:'손이 새 <b>닿는 곳</b>입니다(주황 점). 손에 밀린 털은 위로 서고, 손가락 사이로 가는 털이 튀어나옵니다.',
      wet:'젖은 머리 — 다발 <b>2배</b>(14개)로 갈라지고 부피 <b>0.6배</b>, 무게 <b>1.3배</b>로 처집니다. 끝은 뾰족하고 물방울이 떨어집니다(예시값).',water:'물속 — 무게가 거의 사라져(×0.2) 아래로 처지지 않고 <b>사방으로</b> 부드럽게 퍼집니다. 거품을 그리면 물속임을 바로 알 수 있습니다.'}[m];}
  draw();};

P.p4_emotion=function(h){var x=rngIn(h,'x'),e='joy',W=540,H=360;seg(h,'button[data-e]',function(b){e=b.dataset.e;draw();});
  function draw(){var s=svgOf(h,W,H),X=+x.value/10,cx=220,cy=170,r=70;el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var pts=[],n=36;for(var i=0;i<=n;i++){var a=Math.PI+i*Math.PI*1.0/n*2;var t=i/n;var base=r*1.12,R_=base,dy=0;
      var ang=Math.PI*(1+t);var bottom=Math.abs(Math.cos(ang));// 옆일수록 1
      if(e==='joy')R_=base*(1+0.1*X)+Math.sin(t*Math.PI*10)*4*X;
      if(e==='anger')R_=base*(1+0.08*X)+(i%2?1:-0.3)*X*26*(0.4+bottom);
      if(e==='surprise')R_=base*(1+0.05*X)+(i%3===0?X*30:0);
      if(e==='sad'){R_=base*(1-0.06*X);dy=X*14*bottom;}
      var px=cx+Math.cos(ang)*R_*1.0,py=cy-r*0.1+Math.sin(ang)*R_*(e==='sad'?0.9:1)+dy;pts.push([px,py]);}
    var side=e==='sad'?r*(1.9+0.3*X):e==='anger'?r*(1.1-0.4*X):r*1.7;
    var d='M'+P2(pts[0][0],pts[0][1]+side*0.3);pts.forEach(function(p_){d+=' L'+P2(p_[0],p_[1]);});d+=' L'+P2(pts[n][0],pts[n][1]+side*0.3);
    if(e==='anger'){d+=' L'+P2(cx+r*1.2,cy-r*0.3-X*30)+' L'+P2(cx-r*1.2,cy-r*0.3-X*30);}
    d+='Z';el('path',{d:d,fill:'#b58a62',stroke:INK,'stroke-width':2.2,'stroke-linejoin':'round'},s);
    headS(s,{cx:cx,cy:cy,r:r*0.95,who:'haru',col:'#b58a62',len:0,end:'flat',bang:3,vol:4,locks:0,hideLines:true,body:false});
    if(e==='sad')el('path',{d:'M'+P2(cx+4,cy-r*1.05)+' Q'+P2(cx+30,cy-r*1.05+10*X)+' '+P2(cx+18,cy-r*0.6+12*X),fill:'none',stroke:'#7a5a3a','stroke-width':3},s);
    if(e==='surprise')for(var k=0;k<5;k++){el('line',{x1:cx-40+k*20,y1:cy-r*1.15,x2:cx-48+k*24,y2:cy-r*1.15-18-X*14,stroke:'#7a5a3a','stroke-width':2},s);}
    var nm={calm:'평소',joy:'기쁨',anger:'분노',surprise:'놀람',sad:'실망'}[e];ktxt(s,420,60,nm+' · 과장 '+x.value,{fill:C.ink,weight:700});
    out(h).innerHTML={calm:'평소 — 머리카락은 중력대로 내려옵니다.',joy:'기쁨 — 전체가 둥글게 가볍게 부풀고 끝이 통통 튑니다.',anger:'분노 — 머리 <b>아래쪽(목덜미)부터 위로</b> 들려 크게 흩어집니다.',surprise:'놀람 — 가는 털이 사방으로 튑니다.',sad:'실망 — 모든 털끝이 아래를 향하고 부피가 줄며, 위의 한 가닥이 축 늘어집니다.'}[e]+' 과장 '+x.value+'(화풍이 사실적일수록 작게, 5부 4단계).';}
  onIn(x,draw);draw();};

/* ===================== 5부 ===================== */
var HP=[["len","① 길이(기준점)",[["","— 고르기 —"],["chin","턱 길이, 귀를 덮음"],["shoulder","어깨에 닿는 길이"],["waist","허리까지 오는 길이"]]],
 ["bang","② 앞머리",[["","— 고르기 —"],["straight","눈썹 위 일자 앞머리"],["side","옆으로 넘긴 앞머리"],["eye","한쪽 눈을 가리는 긴 앞머리"]]],
 ["part","③ 가르마·이마 선",[["","— 고르기 —"],["center","가운데 가르마(이마 선 뒤에서 시작)"],["side","옆 가르마(이마 선 뒤에서 시작)"],["back","가르마 없이 모두 뒤로 넘김"]]],
 ["vol","④ 부피·끝 방향",[["","— 고르기 —"],["out","자연스러운 부피, 끝은 바깥으로"],["in","자연스러운 부피, 끝은 안으로"],["flat","매끈하게, 끝은 일자"]]],
 ["lock","⑤ 다발·묶음",[["","— 고르기 —"],["locks","부드러운 다발 + 다발 속 가는 선"],["pony","높은 포니테일(묶은 점으로 모임)"],["curl","원기둥 나선으로 말린 머리"],["braid","세 갈래 땋은 머리"]]],
 ["color","⑥ 색",[["","— 고르기 —"],["black","흑발"],["blonde","금발"],["red","붉은 머리"],["silver","은발"],["white","흰머리"]]],
 ["shine","⑦ 윤기",[["","— 고르기 —"],["band","흐름을 가로지르는 윤기 띠"],["matte","윤기 적은 부드러운 머리"],["manga","흑백 만화: 검게 칠하고 흰 띠 약 15%"]]],
 ["move","⑧ 움직임",[["","— 고르기 —"],["still","가만히 내려옴"],["wind","왼쪽 바람, 앞머리까지 오른쪽으로, 끝이 늦게 따라옴"],["wet","젖은 머리: 작은 다발로 갈라져 처짐"]]]];
var HPEN={len:{chin:"chin-length hair that covers the ears",shoulder:"shoulder-length hair",waist:"waist-length hair"},
 bang:{straight:"straight bangs at eyebrow level",side:"side-swept bangs",eye:"long bangs hiding one eye"},
 part:{center:"a center parting that starts behind the hairline",side:"a side parting that starts behind the hairline",back:"all hair swept back with no parting"},
 vol:{out:"natural volume, the hair sits slightly away from the scalp, ends flipped outward",in:"natural volume, the hair sits slightly away from the scalp, ends curled inward",flat:"sleek hair with straight-cut ends"},
 lock:{locks:"hair drawn as soft ribbon-like locks with a few fine strands inside each lock",pony:"a high ponytail, all hair pulled toward the hair tie",curl:"spiral drill curls shaped like cylinders, each curl winding the same way",braid:"a loose three-strand braid made of soft diamond shapes"},
 color:{black:"black hair",blonde:"blonde hair",red:"red hair",silver:"silver hair",white:"pure white hair"},
 shine:{band:"a glossy highlight band wraps around the head across the hair flow",matte:"soft matte hair with very little shine",manga:"manga style: solid black hair with white highlight bands left uncolored, about 15 percent of the area"},
 move:{still:"hair hanging still",wind:"wind from the left, all hair including the bangs blows to the right, the tips lag behind",wet:"soaking wet hair, flattened, separated into thin clumps that cling to the neck"}};
function hairPrompt(o){var parts=[],score=0,miss=[];HP.forEach(function(p){var k=p[0];if(o[k]){parts.push(HPEN[k][o[k]]);score++;}else miss.push(p[1]);});
  var keep=o.keep?"Keep her face, eye color, expression and outfit unchanged; change only the hair.":"";var neg=o.neg?"An adult woman in her early twenties, adult proportions. No text, no logos, not childlike, not resembling any famous character.":"";
  return {text:["Hair: "+(parts.length?parts.join(", "):"(empty)")+".",keep,neg].filter(Boolean).join("\n"),score:score,miss:miss};}
function hairForm(host,onchange){var form=document.createElement('div');form.style.cssText='display:grid;grid-template-columns:repeat(auto-fit,minmax(190px,1fr));gap:8px 14px;width:100%';host.appendChild(form);
  HP.forEach(function(p){var l=document.createElement('label');l.innerHTML=p[1]+' <select name="'+p[0]+'">'+p[2].map(function(o){return '<option value="'+o[0]+'">'+o[1]+'</option>';}).join('')+'</select>';form.appendChild(l);});
  [['keep','고정: 얼굴·눈 색·옷은 그대로'],['neg','금지: 20대 성인 비율, 글자·로고 없음']].forEach(function(q){var l=document.createElement('label');l.innerHTML='<input type="checkbox" name="'+q[0]+'"> '+q[1];form.appendChild(l);});
  form.querySelectorAll('select,input').forEach(function(i){i.addEventListener('change',onchange);});
  return function(){var o={};HP.forEach(function(p){o[p[0]]=form.querySelector('[name='+p[0]+']').value;});o.keep=form.querySelector('[name=keep]').checked;o.neg=form.querySelector('[name=neg]').checked;return o;};}
P.p5_hairprompt=function(h){h.innerHTML='';var get=hairForm(h,draw);var pb=document.createElement('div');pb.className='promptbox';pb.innerHTML='<b>조립된 머리 문장</b><pre aria-live="polite"></pre><button type="button" class="btn copy">복사하기</button>';h.appendChild(pb);
  function draw(){var o=get(),r=hairPrompt(o);pb.querySelector('pre').textContent=r.text;out(h).innerHTML='점검표 <b>'+r.score+' / 8</b>'+(r.miss.length?' — 빠진 조각: '+r.miss.join(', '):' — 여덟 조각 완성')+'. 고정 조각 '+(o.keep?'있음':'<b style="color:'+C.red+'">없음</b>(얼굴이 바뀔 수 있음)')+' · 금지 조각 '+(o.neg?'있음':'없음')+'.';}
  draw();};

P.p5_mask=function(h){var c=ctl(h),bot=rngIn(h,'bot'),wid=rngIn(h,'wid'),ln=rngIn(h,'len'),chk=c.querySelector('input[type=checkbox]'),W=512,H=768;
  function draw(){var s=svgOf(h,W,H),B=+bot.value,Wd=+wid.value,L=+ln.value,prot=chk.checked;s.style.maxWidth='300px';s.style.margin='0 auto';s.style.display='block';el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var y0=60,y1=230+B*40,mw=200+Wd*20,x0=256-mw/2,wigB=200+L*45;
    el('path',{d:'M'+P2(256-130,170)+' Q256,40 '+P2(256+130,170)+' L'+P2(256+150,wigB)+' L'+P2(256-150,wigB)+'Z',fill:HC.lbrown,stroke:INK,'stroke-width':3,opacity:0.35,'stroke-dasharray':'8 6'},s);
    el('path',{d:'M56,768 Q60,470 196,440 L316,440 Q452,470 456,768Z',fill:'#A99AC8',stroke:INK,'stroke-width':3},s);el('rect',{x:226,y:330,width:60,height:120,fill:SKIN,stroke:INK,'stroke-width':3},s);
    el('path',{d:'M'+P2(256-110,170)+' Q256,60 '+P2(256+110,170)+' L'+P2(256+112,300)+' L'+P2(256-112,300)+'Z',fill:HC.bob,stroke:INK,'stroke-width':3},s);
    el('ellipse',{cx:256,cy:250,rx:70,ry:90,fill:SKIN,stroke:INK,'stroke-width':3},s);[-1,1].forEach(function(d){el('ellipse',{cx:256+d*28,cy:255,rx:9,ry:13,fill:EYE.haru},s);});
    var mask=el('g',{opacity:0.5},s);el('rect',{x:x0,y:y0,width:mw,height:y1-y0,fill:C.orange},mask);if(prot)el('ellipse',{cx:256,cy:255,rx:70,ry:90,fill:'#fbfcfd'},s).setAttribute('opacity','0.55');
    var area=mw*(y1-y0)-(prot?Math.PI*70*90:0),tot=W*H,ratio=area/tot*100;var cut=y1<wigB;
    out(h).innerHTML='가린 넓이 ≈ '+Math.round(area).toLocaleString('ko-KR')+' ÷ 전체 512 × 768 = 393,216 → <b>'+f2(ratio,1)+'%</b>가 다시 그려집니다. '+
      (cut?'<b style="color:'+C.red+'">새 가발이 가림 영역보다 길어</b> 아래쪽에서 잘린 듯 끝납니다(가림 아래쪽을 넓히세요). ':'새 가발이 들어갈 자리가 넉넉합니다. ')+(prot?'얼굴은 가림 영역에서 빠져 그대로 남습니다.':'<b style="color:'+C.red+'">얼굴까지 가려</b> 눈 색·얼굴형이 바뀔 수 있습니다(6부 f8).')+' 점선 = 새 가발이 차지할 자리.';}
  [bot,wid,ln].forEach(function(i){onIn(i,draw);});chk.addEventListener('change',draw);draw();};

P.p5_vfx=function(h){var g=rngIn(h,'g'),f=rngIn(h,'f'),cl=rngIn(h,'c'),ku=rngIn(h,'k'),W=540,H=360;var cv=canvasOf(h,W,H),ctx=cv.getContext('2d');
  function draw(){var G=+g.value,F=+f.value,Cl=+cl.value/10,K=+ku.value/10,ng=Math.round(G/25),rr=rng(5);ctx.fillStyle='#fbfcfd';ctx.fillRect(0,0,W,H);
    ctx.fillStyle=SKIN;ctx.strokeStyle=INK;ctx.lineWidth=2;ctx.beginPath();ctx.ellipse(270,90,120,70,0,Math.PI,0);ctx.fill();ctx.stroke();
    for(var i=0;i<ng;i++){var t=(i+0.5)/ng,gx=150+t*240,gy=90-Math.sin(t*Math.PI)*60;function curve(dx0,dk){var pts=[];for(var j=0;j<=20;j++){var u=j/20;pts.push([gx+dx0*(1-u*Cl)+Math.sin(u*Math.PI*6+dk)*K*14*u,gy+u*240]);}return pts;}
      var thin=Math.min(10,Math.round(F/200));for(var q=0;q<thin;q++){var pp=curve((rr()-0.5)*26,rr()*6);ctx.strokeStyle='rgba(170,125,85,.55)';ctx.lineWidth=1;ctx.beginPath();pp.forEach(function(p_,k){if(k)ctx.lineTo(p_[0],p_[1]);else ctx.moveTo(p_[0],p_[1]);});ctx.stroke();}
      var gp=curve(0,0);ctx.strokeStyle='#6b4430';ctx.lineWidth=3.2;ctx.beginPath();gp.forEach(function(p_,k){if(k)ctx.lineTo(p_[0],p_[1]);else ctx.moveTo(p_[0],p_[1]);});ctx.stroke();}
    var tot=G*F;ctx.fillStyle=C.ink;ctx.font='700 14px '+KFONT;ctx.fillText('그려지는 가닥 '+tot.toLocaleString('ko-KR'),20,330);ctx.fillText('계산량 '+f2(G/200,2)+'배',300,330);
    out(h).innerHTML='가닥 수 = '+G+' × '+F+' = <b>'+tot.toLocaleString('ko-KR')+'</b> · 계산량은 가이드 수에 비례해 기준(200)의 '+f2(G/200,2)+'배 · 덩어리 '+cl.value+(Cl<0.2?' — 고르게 퍼져 솜뭉치처럼 보입니다':Cl>0.6?' — 다발이 또렷합니다':'')+' · 곱슬 '+ku.value+'.';}
  [g,f,cl,ku].forEach(function(i){onIn(i,draw);});draw();};

var STYLEL={pixel:[4,0,'픽셀아트'],anime:[12,1,'애니풍'],semireal:[30,1,'반실사'],photo:[60,2,'실사풍']};
P.p5_style=function(h){var st='anime',W=540,H=330;seg(h,'button[data-s]',function(b){st=b.dataset.s;draw();});
  function draw(){var s=svgOf(h,W,H),S=STYLEL[st];el('rect',{x:0,y:0,width:W,height:H,fill:'#fbfcfd'},s);
    var o=headS(s,{cx:200,cy:130,r:66,who:'sia',col:HC.blonde,len:7,end:'in',bang:4,vol:10,wave:6,locks:S[0],inner:S[1],shine:0.55,innerW:st==='photo'?0.6:0.9,outfit:'#34363F'});
    if(st==='pixel')s.setAttribute('shape-rendering','crispEdges');if(st==='photo'){for(var i=0;i<14;i++){el('path',{d:'M'+P2(140+i*9,70)+' q '+(i%2?6:-6)+',-14 '+(i%2?2:-3)+',-22',fill:'none',stroke:'#c9a96c','stroke-width':0.8},s);}}
    el('line',{x1:110,y1:o.top+(130+66*0.2-o.top)*0.45,x2:290,y2:o.top+(130+66*0.2-o.top)*0.45,stroke:C.orange,'stroke-width':1,'stroke-dasharray':'4 4'},s);ktxt(s,20,o.top+(130+66*0.2-o.top)*0.45-6,'윤기 띠 높이(그대로)',{size:12,fill:C.orange});
    ktxt(s,400,60,S[2],{fill:C.ink,weight:700,size:15});ktxt(s,400,86,'다발 '+S[0]+'개',{size:13});ktxt(s,400,108,'다발 속 선 '+S[1]+'개',{size:13});
    out(h).innerHTML=S[2]+' — 다발 <b>'+S[0]+'개</b>, 다발 속 선 '+S[1]+'개'+(st==='photo'?' + 흩어진 가는 털':'')+'. 윤기 띠 높이와 머리 흐름은 네 화풍 모두 같습니다(예시 구간: 픽셀 3~5, 애니 8~15, 반실사 20~40).';}
  draw();};

/* ===================== 6부 ===================== */
var CHECK=['① 뼈대(이마 선·가르마·부피)','② 다발·흐름(닿는 곳·묶은 점)','③ 색·윤기','④ 움직임(바람·무게·감정)','⑤ 고정·가림 영역'];
var FAILAT=[0,0,1,1,2,3,3,4];var FAILWHY=['가르마가 이마 선 앞에서 시작해 이마를 가릅니다.','부피가 0이라 가발이 두피에 붙었습니다.','다발 없이 한 올씩 그려 철사 뭉치가 되었습니다.','다발이 묶은 점으로 모이지 않았습니다.','윤기를 흐름과 나란한 줄로 넣었습니다.','바람 방향이 둘입니다 — 앞머리만 반대입니다.','젖었는데 다발·부피·무게가 그대로입니다.','가림 영역이 얼굴까지 덮고 고정 조각이 없었습니다.'];
P.p6_check=function(h){var c=ctl(h),sel=c.querySelector('select');h.innerHTML='';var list=document.createElement('div');list.style.cssText='display:flex;flex-direction:column;gap:6px';h.appendChild(list);var done=0;
  function build(){list.innerHTML='';done=0;CHECK.forEach(function(t,i){var b=document.createElement('button');b.type='button';b.className='btn';b.style.textAlign='left';b.textContent=t;b.addEventListener('click',function(){press(i,b);});list.appendChild(b);});out(h).innerHTML='점검표를 <b>위에서부터</b> 눌러 보세요.';}
  function press(i,b){var f=+sel.value,at=FAILAT[f];if(i!==done){out(h).innerHTML='순서대로! 먼저 <b>'+CHECK[done]+'</b>을 보세요. 큰 원리에서 작은 표현 순서입니다.';return;}
    if(i<at){b.style.borderColor=C.green;b.style.background='#ecf7ef';b.textContent=CHECK[i]+' — 통과';done++;out(h).innerHTML=CHECK[i]+' 통과. 다음 항목으로.';}
    else{b.style.borderColor=C.red;b.style.background='#fdeceb';b.textContent=CHECK[i]+' — 여기서 걸림';done=99;out(h).innerHTML='<b>'+CHECK[i]+'</b>에서 처음 걸렸습니다: '+FAILWHY[f]+' 아래 실패 카드 f'+(f+1)+'에서 고치는 조각을 보세요.';}}
  sel.addEventListener('change',build);build();};
function board(el_,items){el_.innerHTML=items.map(function(it){return '<div class="'+(it[2]?'good':'bad')+'"><span>'+it[0]+'</span><b>'+it[1]+'</b></div>';}).join('');}
function say(el_,lines){el_.innerHTML=lines.map(function(l){return '<div class="line"><img src="../assets/chars/'+l[0]+'_'+l[1]+'.webp" alt="" width="48" height="48"><div class="bub"><b>'+l[2]+'</b>'+l[3]+'</div></div>';}).join('');}
function missions(el_,state,touched){el_.querySelectorAll('li').forEach(function(li,i){if(touched&&state[i])li.classList.add('done');});}
var DONE={};

/* ===================== 실전 연습장 ===================== */
function practice(){var root=document.getElementById('practice');if(!root)return;var tabs=root.querySelectorAll('.tabs button'),scenes=root.querySelectorAll('.scene');
  function show(id){tabs.forEach(function(b){b.classList.toggle('on',b.dataset.t===id);});scenes.forEach(function(s){s.classList.toggle('on',s.id===id);});if(history.replaceState)history.replaceState(null,'','#'+id);}
  tabs.forEach(function(b){b.addEventListener('click',function(){show(b.dataset.t);});});var hsh=(location.hash||'').slice(1);show([].some.call(scenes,function(s){return s.id===hsh;})?hsh:'salon');
  salon();windT();workshop();desk();}
function wire(S,f){var st={touched:false};S.querySelectorAll('input,select').forEach(function(i){i.addEventListener(i.tagName==='SELECT'||i.type==='checkbox'?'change':'input',function(){st.touched=true;f(st);});});f(st);}
var RULE={"lively": "길이 5 이하 + 끝 바깥 + 앞머리 6 이하 + 반묶음 아님", "calm": "끝 안쪽 + 길이 3~8 + 앞머리 7 이하 + 포니테일 아님", "neat": "끝 일자 + 앞머리 6 이하 + 웨이브 3 이하 + (묶음 또는 길이 5 이하)", "mystic": "앞머리 9 이상(한쪽 눈 가림) + 끝 일자·안쪽 + 웨이브 4 이하", "glam": "웨이브 6 이상 + 부피 2.5cm 이상 + 길이 6 이상"};
var ORDN={lively:'활발하게',calm:'차분하게',neat:'단정하게',mystic:'신비롭게',glam:'화려하게'};
/* 인상 판정(예시 규칙) */
function impressions(o){var m=[];if(o.bang>=9&&(o.end==='flat'||o.end==='in')&&o.wave<=4)m.push('mystic');
  if(o.len<=5&&o.end==='out'&&o.bang<=6&&o.tie!=='half')m.push('lively');
  if(o.end==='in'&&o.len>=3&&o.len<=8&&o.bang<=7&&o.tie!=='pony')m.push('calm');
  if(o.end==='flat'&&o.bang<=6&&o.wave<=3&&(o.tie!=='none'||o.len<=5))m.push('neat');
  if(o.wave>=6&&o.vol>=2.5&&o.len>=6)m.push('glam');return m;}
function salon(){var S=document.getElementById('salon');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};
  wire(S,function(st){var o={order:q('order').value,len:+q('len').value,end:q('end').value,bang:+q('bang').value,vol:+q('vol').value,tie:q('tie').value,part:+q('part').value,wave:+q('wave').value};
    var im=impressions(o),ok=o.part>=0&&o.vol>=1,hit=im.indexOf(o.order)>=0;
    board(S.querySelector('.board'),[['주문',ORDN[o.order],true],['읽히는 인상',im.length?im.map(function(k){return {lively:'활발',calm:'차분',neat:'단정',mystic:'신비',glam:'화려'}[k];}).join('·'):'흐릿함',hit],['길이',lenName(o.len),true],['가발 씌우기',ok?'바름':(o.part<0?'가르마가 이마 앞':'부피 부족'),ok]]);
    var s=el('svg',{viewBox:'0 0 360 320',role:'img','aria-label':'미용실 거울 속 가발'});var g1=S.querySelector('.g1');g1.innerHTML='';g1.appendChild(s);el('rect',{x:0,y:0,width:360,height:320,fill:'#fbfcfd'},s);
    headS(s,{cx:180,cy:110,r:52,who:'haru',col:HC.bob,len:o.len,end:o.end,bang:o.bang,vol:o.vol*5.9,tie:o.tie,tieH:6,part:o.tie==='none'?o.part:null,wave:o.wave*1,locks:7,inner:1});
    var s2=el('svg',{viewBox:'0 0 360 200',role:'img','aria-label':'인상 점수 막대'});var g2=S.querySelector('.g2');g2.innerHTML='';g2.appendChild(s2);
    Object.keys(ORDN).forEach(function(k,i){var on=im.indexOf(k)>=0;el('rect',{x:90,y:14+i*36,width:on?240:30,height:24,rx:5,fill:on?(k===o.order?C.teal:'#9fd8cf'):'#e3e8ee'},s2);ktxt(s2,84,31+i*36,ORDN[k],{size:12.5,anchor:'end',fill:C.ink});});
    var M=[o.order==='lively'&&hit&&ok,o.order==='mystic'&&hit&&ok,o.order==='neat'&&hit&&o.part>=2&&o.vol>=1];if(st.touched)missions(S.querySelector('.missions'),M,true);
    say(S.querySelector('.talk'),[['doctor','e10','박사','주문은 \''+ORDN[o.order]+'\'. '+(hit?'주문대로 읽힌다.':'아직 주문과 다르게 읽힌다.')],['haru','e10','조수',lenName(o.len)+', 끝 '+{out:'바깥',in:'안쪽',flat:'일자'}[o.end]+', 앞머리 '+o.bang+(o.bang>=9?'(한쪽 눈 가림)':'')+', 부피 '+o.vol+'cm예요. 실루엣 폭 16 + 2 × '+o.vol+' = '+f2(16+2*o.vol,1)+'cm.'],
      ['fruitfly','e09','초파리','판정 규칙(예시): \''+ORDN[o.order]+'\' = '+RULE[o.order]+'. 바르게 씌운 가발 = 가르마 0cm 이상 뒤 + 부피 1cm 이상.'],['x2','e09','평가단 X2',o.part<0?'가르마가 이마 선 앞이에요. 이마가 갈라져 보여요.':o.vol<1?'부피가 1cm도 안 돼요. 헬멧 같아요.':'이마 선과 부피는 바르게 씌웠어요.'],['jupanbot','e16','주판봇',hit?'손님이 웃으십니다!':'가발을 한 치수 큰 걸로 바꾸면… 아니군요!']]);});}
function windT(){var S=document.getElementById('wind');if(!S)return;var q=function(n){return S.querySelector('[name='+n+']');};var W=360,H=320;
  wire(S,function(st){var w=+q('wind').value,L=+q('len').value,sf=+q('stiff').value,wet=q('wet').checked;
    var Sd=settle(new Strands(hairRoots(6,18,0.5),L,12),{g:wet?1.3:1,wind:windForce(w,wet),stiff:stiffOf(sf)},600),dx=Sd.tipDx(),lag=L/150*24;
    board(S.querySelector('.board'),[['끝 이동',f2(dx,1)+'cm',dx>0],['바람 힘(풍속²)',f2(w*w,2),true],['늦는 장 수',f2(lag,0)+'장',true],['젖음',wet?'무게 1.3배':'마름',true]]);
    var g1=S.querySelector('.g1');g1.innerHTML='';var cv=document.createElement('canvas');cv.width=W;cv.height=H;cv.style.cssText='width:100%;border-radius:10px';cv.setAttribute('role','img');cv.setAttribute('aria-label','바람 터널 가닥 그림');g1.appendChild(cv);var ctx=cv.getContext('2d');
    ctx.fillStyle='#fbfcfd';ctx.fillRect(0,0,W,H);var sc=Math.min(3.6,230/L);Sd.draw(ctx,sc,140,60,wet?'#6b4430':'#c9a47a',wet?4:6);headCanvas(ctx,140,80,38,wet?'#6b4430':'#c9a47a');
    for(var i=0;i<Math.round(w*2);i++){ctx.strokeStyle='rgba(36,88,214,.35)';ctx.lineWidth=2;ctx.beginPath();ctx.moveTo(10,40+i*26);ctx.lineTo(40+w*8,40+i*26);ctx.stroke();}
    var s2=el('svg',{viewBox:'0 0 360 200',role:'img','aria-label':'끝 이동 막대'});var g2=S.querySelector('.g2');g2.innerHTML='';g2.appendChild(s2);
    [['끝 이동',clamp(dx,0,50)/50,C.teal],['바람 힘',clamp(w*w,0,25)/25,C.blue],['늦는 장 수',clamp(lag,0,10)/10,C.orange]].forEach(function(b,i){el('rect',{x:90,y:30+i*50,width:240*b[1],height:26,rx:5,fill:b[2]},s2);ktxt(s2,84,48+i*50,b[0],{size:12.5,anchor:'end',fill:C.ink});});
    var M=[w>=3&&dx>=25&&!wet,w>=3&&sf>=7&&dx<12&&!wet,wet&&w>=2&&dx<10];if(st.touched)missions(S.querySelector('.missions'),M,true);
    say(S.querySelector('.talk'),[['doctor','e10','박사','바람 '+w+', 힘은 풍속² = '+f2(w*w,2)+'. '+(wet?'젖으면 무거워지고 다발이 뭉쳐 덜 날린다.':'끝이 가장 많이 움직인다.')],['fruitfly','e09','초파리','계산 값(예시): 옆 힘 = 0.12 × 풍속²'+(wet?' × 0.6(다발이 뭉쳐 받는 넓이)':'')+' = '+f2(windForce(w,wet),3)+', 무게 '+(wet?'1.3':'1')+', 뻣뻣함 '+sf+' → 가닥 12마디를 600번 계산해 멈춘 모양에서 끝 이동을 잽니다.'],['haru','e10','조수',L+'cm 가발 끝이 '+f2(dx,1)+'cm 날려요. 고개를 돌리면 '+L+' ÷ 150 × 24 ≈ '+f2(lag,0)+'장 늦게 따라와요.'],
      ['x3','e24','평가단 X3',dx>=25?'제 후드 방울보다 더 날려요!':dx<5?'거의 안 흔들려요. 바람을 더 세게?':'살랑살랑 흔들려요.'],['jupanbot','e16','주판봇',sf>=7?'뻣뻣하니 판자처럼 버팁니다!':'통째로 기울이면 안 된다고 배웠습니다!']]);});}
function workshop(){var S=document.getElementById('workshop');if(!S)return;var touched=false;var get=hairForm(S.querySelector('.ow'),function(){touched=true;upd();});var job=S.querySelector('[name=job]');job.addEventListener('change',function(){touched=true;upd();});
  function upd(){var o=get();var r=hairPrompt(o);S.querySelector('.g1 pre').textContent=r.text;var jobOk={swap:o.keep&&!!o.len,wind:o.move==='wind'&&!!o.lock,manga:!!o.color&&!!o.shine}[job.value];
    board(S.querySelector('.board'),[['점검표',r.score+' / 8',r.score===8],['요청 상황 맞춤',jobOk?'맞음':'부족',jobOk],['고정(얼굴)',o.keep?'있음':'없음',o.keep],['나이 표기',o.neg?'성인 명시':'없음',o.neg]]);
    var s=el('svg',{viewBox:'0 0 360 270',role:'img','aria-label':'점검표 막대'});var g2=S.querySelector('.g2');g2.innerHTML='';g2.appendChild(s);HP.forEach(function(p,i){var ok=!!o[p[0]];el('rect',{x:110,y:10+i*31,width:ok?220:40,height:20,rx:4,fill:ok?C.teal:'#e3e8ee'},s);ktxt(s,104,25+i*31,p[1],{size:11.5,anchor:'end',fill:C.ink});});
    var M=[r.score===8,job.value==='wind'&&o.move==='wind'&&!!o.lock,o.color==='black'&&(o.shine==='band'||o.shine==='manga')&&/band/.test(r.text)];if(touched)missions(S.querySelector('.missions'),M,true);
    say(S.querySelector('.talk'),[['doctor','e10','박사','요청 상황: '+job.options[job.selectedIndex].text+'. '+(jobOk?'필요한 조각이 들어 있다.':'이 상황에 꼭 필요한 조각이 빠졌다.')],['haru','e10','조수','점검표 '+r.score+' / 8'+(r.miss.length?', 빠진 것: '+r.miss.join(', '):'!')],['fruitfly','e09','초파리',o.keep?'고정 조각이 있으니 가발만 바뀌고 얼굴은 남을 거야.':'고정 조각이 없으면 가발을 바꾸다 얼굴까지 바뀔 수 있어(6부 f8).'],['jupanbot','e16','주판봇',r.score===8?'여덟 조각 완성! 이번엔 제가 이깁니다!':'조각이 남았습니다! 하나씩 채우겠습니다!']]);}
  var cp=S.querySelector('.copy');if(cp)cp.addEventListener('click',function(){var t=S.querySelector('.g1 pre').textContent;if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){cp.textContent='복사했습니다';},function(){cp.textContent='직접 선택해 복사하세요';});});upd();}
var DESK_CA=['가르마 위치(이마 선)','부피 없음','다발 없음(한 올씩)','묶은 점 무시','윤기 방향','바람 방향 둘','젖은 머리 무게','가림 영역 과다'];
var DESK_SYM=['가르마 선이 앞머리를 지나 이마 위까지 그어져 있다','가발이 머리뼈 모양에 딱 붙어 수영모 같다','머리카락이 가는 선 수백 개로 덮여 회색 철사 같다','포니테일인데 정수리 머리가 풀린 생머리처럼 아래로 흐른다','흰 윤기가 머리카락 방향을 따라 세로 줄로 그어졌다','뒷머리는 오른쪽, 앞머리는 왼쪽으로 날린다','흠뻑 젖은 장면인데 머리가 뽀송하게 부풀어 있다','가발만 바꿨는데 눈 색과 얼굴형이 달라졌다'];
function desk(){var S=document.getElementById('desk');if(!S)return;var CA=DESK_CA,SYM=DESK_SYM;
  var cur=0,streak=0,seen={},wrong=0,right=0,touched=false;var r=rng(Date.now()%9999+1);
  function next(){cur=Math.floor(r()*8);S.querySelector('.sym').textContent='증상: '+SYM[cur];var o=S.querySelector('.opts');o.innerHTML='';
    var opts=[cur];while(opts.length<4){var k=Math.floor(r()*8);if(opts.indexOf(k)<0)opts.push(k);}opts.sort(function(){return r()-.5;});
    opts.forEach(function(k){var b=document.createElement('button');b.type='button';b.textContent=CA[k];b.addEventListener('click',function(){touched=true;if(k===cur){streak++;right++;seen[cur]=1;b.classList.add('ok');setTimeout(next,500);}else{streak=0;wrong++;b.classList.add('no');}upd();});o.appendChild(b);});}
  function upd(){var n=Object.keys(seen).length;board(S.querySelector('.board'),[['연속 정답',streak,streak>=3],['맞힌 종류',n+' / 8',n===8],['맞힘',right,right>0],['틀림',wrong,wrong===0]]);
    var M=[streak>=3,n===8,right>=5&&wrong===0];if(touched)missions(S.querySelector('.missions'),M,true);
    var s=el('svg',{viewBox:'0 0 360 200',role:'img','aria-label':'맞힌 실패 종류'});var g=S.querySelector('.g2');g.innerHTML='';g.appendChild(s);CA.forEach(function(t,i){el('rect',{x:16+(i%4)*86,y:20+Math.floor(i/4)*90,width:78,height:70,rx:8,fill:seen[i]?'#e8f6ec':'#f2f4f7',stroke:seen[i]?C.green:'#d5dbe2'},s);ktxt(s,55+(i%4)*86,60+Math.floor(i/4)*90,'f'+(i+1)+(seen[i]?' ✓':''),{size:14,anchor:'middle',fill:seen[i]?C.green:C.muted,weight:700});});
    say(S.querySelector('.talk'),[['doctor','e10','박사','순서: 뼈대 → 다발·흐름 → 색·윤기 → 움직임 → 고정·가림.'],['haru','e10','조수','연속 '+streak+'개, 맞힌 종류 '+n+' / 8이에요.'],['x1','e09','평가단 X1',wrong?'틀린 건 6부 실패 카드에서 다시 보세요.':'아직 틀린 게 없어요! 첫인상이 좋아요.'],['jupanbot','e16','주판봇',streak>=3?'연속 정답! 제가 만든 실패작이라 잘 압니다!':'다음 문제는 제가 맞힙니다!']]);}
  next();upd();}

/* 프롬프트 복사 버튼(직접 만들기 실습·5부 조립기) */
document.addEventListener('click',function(e){var b=e.target.closest&&e.target.closest('.promptbox .copy');if(!b||b.closest('#workshop'))return;var pre=b.parentNode.querySelector('pre');if(!pre)return;var t=pre.textContent;
  if(navigator.clipboard)navigator.clipboard.writeText(t).then(function(){b.textContent='복사했습니다';},function(){b.textContent='직접 선택해 복사하세요';});else b.textContent='직접 선택해 복사하세요';});
/* ===================== 퀴즈·지식 색인·꾸러미 ===================== */
function quiz(q){var ans=+q.getAttribute('data-ans');var fb=q.querySelector('.fb');var OK=q.querySelector('.qok'),NO=q.querySelector('.qno');q.querySelectorAll('.opts button').forEach(function(b,i){b.addEventListener('click',function(){q.querySelectorAll('.opts button').forEach(function(x){x.classList.remove('ok','no');});b.classList.add(i===ans?'ok':'no');fb.innerHTML=i===ans?'⭕ '+OK.innerHTML:'❌ '+NO.innerHTML;});});}
function kg(){var raw=document.getElementById('kg-raw');var mount=document.getElementById('kg-mount');if(!raw||!mount)return;var K=JSON.parse(raw.textContent);
  mount.innerHTML='<input class="kg-search" type="search"><div class="kg-list"></div>';var list=mount.querySelector('.kg-list'),inp=mount.querySelector('input');inp.placeholder='개념 찾기 (예: 그림자, 주름, 강도)';inp.setAttribute('aria-label','지식 색인 검색');
  var TY={Concept:'개념',Method:'방법',Analogy:'비유',Application:'쓰임',OpenQuestion:'열린 질문'};var pre=document.body.getAttribute('data-root')||'';
  function render(){var qv=inp.value.trim().toLowerCase();list.innerHTML=K.nodes.filter(function(n){return !qv||(n.label.ko+' '+n.label.en+' '+n.definition.ko).toLowerCase().indexOf(qv)>=0;}).map(function(n){
    var nb=K.edges.filter(function(e){return e.s===n.id||e.o===n.id;}).map(function(e){var o=e.s===n.id?e.o:e.s;var m=K.nodes.filter(function(x){return x.id===o;})[0];return m?m.label.ko:'';}).filter(Boolean);
    return '<div class="kg-item"><span class="t">'+(TY[n.type]||n.type)+'</span><b>'+n.label.ko+'</b><span class="muted">'+n.label.en+'</span><div>'+n.definition.ko+'</div>'+(nb.length?'<div class="muted" style="font-size:12.5px">이웃: '+nb.join(', ')+'</div>':'')+'<a href="'+pre+n.page+n.anchor+'">설명 보러 가기 →</a></div>';}).join('');}
  inp.addEventListener('input',render);render();var ex=document.getElementById('export-mount');if(!ex)return;
  ex.innerHTML='<div class="exp-btns"><button class="btn" data-x="json">kg.json</button><button class="btn" data-x="ld">JSON-LD</button><button class="btn" data-x="ttl">Turtle (Protégé)</button><button class="btn" data-x="csv">CSV (Neo4j·Gephi)</button><button class="btn" data-x="bib">BibTeX</button><button class="btn" data-x="ris">RIS</button></div>';
  function dl(name,text,type){var b=new Blob([text],{type:type||'text/plain'});var a=document.createElement('a');a.href=URL.createObjectURL(b);a.download=name;document.body.appendChild(a);a.click();setTimeout(function(){URL.revokeObjectURL(a.href);a.remove();},500);}
  var base=K.page;var refs=JSON.parse((document.getElementById('refs-csl')||{textContent:'[]'}).textContent);
  ex.querySelectorAll('button').forEach(function(b){b.addEventListener('click',function(){var x=b.getAttribute('data-x');
    if(x==='json')dl(base+'.kg.json',JSON.stringify(K,null,2),'application/json');
    if(x==='ld')dl(base+'.jsonld',document.getElementById('kg-ld').textContent,'application/ld+json');
    if(x==='ttl'){var t='@prefix lab: <urn:lab:> .\n@prefix rdfs: <http://www.w3.org/2000/01/rdf-schema#> .\n@prefix skos: <http://www.w3.org/2004/02/skos/core#> .\n\n';K.nodes.forEach(function(n){t+='<urn:'+n.id+'> a lab:'+n.type+' ;\n  skos:prefLabel "'+n.label.ko+'"@ko , "'+n.label.en+'"@en ;\n  rdfs:comment "'+n.definition.ko.replace(/"/g,'\\"')+'"@ko .\n\n';});K.edges.forEach(function(e){t+='<urn:'+e.s+'> lab:'+e.p+' <urn:'+e.o+'> .\n';});dl(base+'.ttl',t,'text/turtle');}
    if(x==='csv'){var c='id,type,label_ko,label_en,anchor\n'+K.nodes.map(function(n){return [n.id,n.type,n.label.ko,n.label.en,n.page+n.anchor].map(function(v){return '"'+String(v).replace(/"/g,'""')+'"';}).join(',');}).join('\n');c+='\n\nsource,relation,target\n'+K.edges.map(function(e){return [e.s,e.p,e.o].join(',');}).join('\n');dl(base+'.csv',c,'text/csv');}
    if(x==='bib')dl(base+'.bib',refs.map(function(r){return '@misc{'+r.id+',\n  title = {'+r.title+'},\n  author = {'+r.author+'},\n  note = {'+(r.note||'')+'},\n  year = {'+r.year+'}\n}';}).join('\n\n'));
    if(x==='ris')dl(base+'.ris',refs.map(function(r){return 'TY  - GEN\nTI  - '+r.title+'\nAU  - '+r.author+'\nPY  - '+r.year+'\nN1  - '+(r.note||'')+'\nER  - ';}).join('\n'));});});}

function boot(){document.querySelectorAll('[data-panel]').forEach(function(h){var k=h.getAttribute('data-panel');if(P[k]){try{P[k](h);}catch(e){h.textContent='실험을 불러오지 못했습니다.';if(window.console)console.warn(k,e);}}});
  document.querySelectorAll('.quiz').forEach(quiz);kg();practice();
  var pr=document.getElementById('prog');if(pr)window.addEventListener('scroll',function(){var d=document.documentElement;pr.style.width=(100*d.scrollTop/Math.max(1,d.scrollHeight-d.clientHeight))+'%';},{passive:true});}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);else boot();
})();
