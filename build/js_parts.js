
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
