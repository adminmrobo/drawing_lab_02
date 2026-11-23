
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
