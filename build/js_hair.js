
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
