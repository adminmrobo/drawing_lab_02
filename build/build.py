# -*- coding: utf-8 -*-
"""그리기 연구실 02 · 머리카락 편 — 페이지 빌드.
python3 build/build.py 로 index.html, 01~06 페이지, practice/index.html 을 다시 만든다.
그림 파일(assets/img/{키}.webp)이 있으면 넣고, 없으면 '그림 준비 중' 자리만 둔다."""
import json, os, html, sys
sys.path.insert(0, os.path.dirname(__file__))
from content_a import P1, P2, P3
from content_b import P4, P5, P6
from content_make import MAKE
from make_requests import PROMPTS, CONV_OF, ATTACH_OF
STYLES = [("pixel", "픽셀"), ("anime", "애니풍"), ("semireal", "반실사"), ("photo", "실사풍")]

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
VER = "v1.0"
DATE = "2026-11-24"
SITE = "https://adminmrobo.github.io/drawing_lab_02/"
MOOD = "https://adminmrobo.github.io/drawing_lab_01/"
PREV_SITE = "https://adminmrobo.github.io/adminmrobo-structure_first_drawing_lab/"
CLOSET = "https://adminmrobo.github.io/structure_first_drawing_lab_01/"
REPO = "https://github.com/adminmrobo/drawing_lab_02"
AUTHOR_URL = "https://adminmrobo.github.io/who_am_i/who_am_i.html"
RENDER = "https://adminmrobo.github.io/ai_rendering/"
FISH = "https://adminmrobo.github.io/unsupervised_fish_lab/"
CHARREPO = "https://github.com/adminmrobo/fruitfly-lab-expressions"
SERIES = "그리기 연구실 02 · 머리카락 편"
E = html.escape
PARTS = [P1, P2, P3, P4, P5, P6]

CH = {
 "doctor": ("박사", "해설 + 손님 모델(3·4부). 흰머리 가발, 쓸어 올린 앞머리, 젖은 머리를 보여 준다"),
 "haru": ("조수 하루", "모델(1·4부) + 수식 상자 담당. 번 머리를 풀고 짧은 단발·긴 웨이브 가발로 변장한다"),
 "sia": ("시아", "인턴1 · 모델(2부). 자기 긴 흑발 생머리에 포니테일·말린 머리·땋은 머리 가발을 써 본다"),
 "moa": ("모아", "인턴2 · 모델(3부). 금발·붉은 머리·은발·흑발 가발 네 개로 색과 윤기를 보여 준다"),
 "jupanbot": ("주판봇", "화가 A. 바깥 윤곽부터, 한 올씩 서두른다 — 흔한 실수 담당"),
 "fruitfly": ("초파리 연구원", "화가 B. 머리 원형과 원리부터 의심한다. \"이걸 눌러 봐\""),
 "x1": ("X1", "평가단 · 닮음 담당. 분홍 사이드 포니테일. 밝고 성급한 첫인상파 — \"멀리서 봐도 그 사람이야?\" 좌우가 바뀌면 바로 알아챈다"),
 "x2": ("X2", "평가단 · 원리 담당. 베레모와 청록 둥근 안경. 차분하게 이마 선·가르마·부피부터 따진다"),
 "x3": ("X3", "평가단 · 자연스러움 담당. 고양이 귀 후드와 노란 방울. 흔들리는 것을 좋아해 움직임·윤기에 예민하다"),
}
COLOR = {"doctor": "doc", "haru": "asst", "fruitfly": "fly", "jupanbot": "robo", "sia": "sia", "moa": "moa", "x1": "x", "x2": "x", "x3": "x"}

def face(k, e="e13", pre="", cls=""):
    n = CH[k][0]
    return f'<img src="{pre}assets/chars/{k}_{e}.webp" alt="{E(n)}" width="96" height="96" loading="lazy"{(" class=%s" % cls) if cls else ""}>'

def has_img(key):
    return os.path.exists(os.path.join(ROOT, "assets", "img", key + ".webp"))

def art(key, alt, ar="16/9", cap=None, pre="", cls=""):
    cap_html = f"<figcaption>{E(cap)}</figcaption>" if cap else ""
    if has_img(key):
        return f'<figure class="art {cls}" data-img="{key}"><img src="{pre}assets/img/{key}.webp" alt="{E(alt)}" loading="lazy" decoding="async">{cap_html}</figure>'
    return (f'<figure class="art {cls}" data-img="{key}"><div class="ph-art" style="--ar:{ar}" role="img" aria-label="{E(alt)}">'
            f'<b>그림 준비 중 · {key}</b><span>{E(alt)}</span></div>{cap_html}</figure>')

def head(title, desc, og, path, pre=""):
    return f"""<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>{E(title)}</title>
<meta name="description" content="{E(desc)}">
<meta property="og:type" content="article"><meta property="og:title" content="{E(title)}"><meta property="og:description" content="{E(desc)}">
<meta property="og:image" content="{SITE}assets/og/{og}"><meta property="og:url" content="{SITE}{path}"><meta name="twitter:card" content="summary_large_image">
<meta name="author" content="안상선">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans+KR:wght@400;500;700&display=swap" rel="stylesheet">
<link rel="stylesheet" href="{pre}assets/lab.css">
</head>
<body data-root="{pre}">
<div id="prog"></div>
"""

def nav(links, pre=""):
    a = "".join(f'<a href="{h}">{E(t)}</a>' for h, t in links)
    return f'<nav class="top"><div class="row"><a class="logo" href="{pre}index.html">그리기 연구실 02 <i>· 머리카락 편</i></a><div class="links">{a}</div></div></nav>\n'

def cover(key, cap, cast, pre=""):
    if has_img(key):
        return f'<div class="cover"><div class="frame" data-img="{key}"><img class="art" src="{pre}assets/img/{key}.webp" alt="{E(cap)}" width="1600" height="900" fetchpriority="high" decoding="async"></div></div>\n'
    # 그림이 오기 전 픽셀 대체 표지: 네모 격자 + 상자·원기둥 마네킹(픽셀 블록) + 픽셀 캐릭터
    cells = []
    for x in range(0, 1600, 40):
        for y in range(0, 900, 40):
            if (x // 40 + y // 40) % 2 == 0:
                cells.append(f'<rect x="{x}" y="{y}" width="40" height="40" fill="#f3f6fa"/>')
    blocks = [(1180, 140, 80, 100, "#c9d3e6"), (1200, 240, 40, 30, "#d8dfeb"), (1150, 270, 140, 140, "#b9c6df"), (1160, 410, 120, 90, "#a9b8d6"),
              (1110, 280, 40, 120, "#cdd6e8"), (1290, 280, 40, 120, "#cdd6e8"), (1100, 400, 40, 100, "#dfe5ef"), (1300, 400, 40, 100, "#dfe5ef"),
              (1170, 500, 50, 170, "#b9c6df"), (1230, 500, 50, 170, "#b9c6df"), (1170, 670, 50, 130, "#a9b8d6"), (1230, 670, 50, 130, "#a9b8d6")]
    bl = "".join(f'<rect x="{x}" y="{y}" width="{w}" height="{h}" fill="{c}" stroke="#1e2f6e" stroke-width="6"/>' for x, y, w, h, c in blocks)
    easel = '<rect x="240" y="180" width="300" height="380" fill="#ffffff" stroke="#8a5a2b" stroke-width="12"/><rect x="270" y="560" width="20" height="260" fill="#8a5a2b"/><rect x="490" y="560" width="20" height="260" fill="#8a5a2b"/>' + \
            "".join(f'<rect x="{300+i*40}" y="{240+j*40}" width="40" height="40" fill="{c}"/>' for i, j, c in [(1,0,"#e9909a"),(2,0,"#e9909a"),(1,1,"#f6d3b8"),(2,1,"#f6d3b8"),(0,2,"#a99ac8"),(1,2,"#a99ac8"),(2,2,"#a99ac8"),(3,2,"#a99ac8"),(1,3,"#fbfbfd"),(2,3,"#fbfbfd"),(1,4,"#5b7fb8"),(2,4,"#5b7fb8")])
    imgs = "".join(face(k, e, pre) for k, e in cast)
    return f"""<div class="cover"><div class="frame" data-img="{key}"><svg class="grid" viewBox="0 0 1600 900" preserveAspectRatio="xMidYMid slice" aria-hidden="true" shape-rendering="crispEdges">{''.join(cells)}{easel}{bl}</svg>
<span class="cap">{E(cap)}</span><span class="badge">표지 그림 준비 중 · {key}</span><div class="cast" style="image-rendering:pixelated">{imgs}</div></div></div>
"""

def three(a, b, c, abbr):
    dl = "".join(f"<dt>{E(x)}</dt><dd>{E(y)}</dd>" for x, y in abbr)
    return f"""<div class="three"><h2>처음 오신 분께 — 세 줄 요약</h2><ul>
<li><b>무엇을</b>: {E(a)}</li><li><b>왜 알아야 하나</b>: {E(b)}</li><li><b>어디에 쓰나</b>: {E(c)}</li></ul>
<p>그림 실력·코드·수식을 몰라도 됩니다. 실험을 눌러 보며 따라오세요.</p>
<details class="abbr"><summary>낱말·약어 풀이 (펼치기)</summary><dl>{dl}</dl></details></div>\n"""

ABBR = [("이마 선", "머리카락이 나기 시작하는 선. 가르마와 앞머리가 여기서 출발한다"), ("가르마", "머리카락을 양쪽으로 가르는 선. 이마 선보다 뒤에서 시작한다"),
        ("머리 원형", "머리카락을 뺀 둥근 머리 모양. 가발을 벗긴 모습"), ("부피", "두피에서 머리카락 바깥 윤곽까지의 두께"),
        ("목덜미", "목 뒤 머리카락이 끝나는 곳. 짧은·중간 머리의 기준점"), ("다발", "머리카락 여러 올을 하나의 부드러운 띠로 묶어 본 덩어리"),
        ("닿는 곳", "머리카락이 어깨·가슴·손에 닿아 흐름이 꺾이는 곳"), ("묶은 점", "포니테일·묶음 머리에서 다발이 모이는 점"),
        ("윤기 띠", "머리카락 흐름을 가로지르는 밝은 반사 띠(하이라이트)"), ("스크린톤", "흑백 만화에서 회색을 내는 점무늬 톤"),
        ("늦게 따라오기", "몸이 움직인 뒤 털끝이 조금 늦게 따라오는 움직임(애니메이션 용어 팔로 스루)"),
        ("가림 영역(마스크)", "AI가 다시 그릴 부분을 표시한 영역"), ("가이드 가닥", "VFX 헤어에서 움직임을 직접 계산하는 대표 가닥"), ("VFX", "영화·영상의 시각 효과(Visual Effects)")]

def talk(lines, pre=""):
    out = []
    for k, e, t in lines:
        side = " r" if k in ("moa", "sia") else ""
        out.append(f'<div class="line{side}">{face(k, e, pre)}<div class="bub"><b style="color:var(--c-{COLOR[k]})">{E(CH[k][0])}</b>{E(t)}</div></div>')
    return '<div class="talk">' + "".join(out) + "</div>"

def quiz(q, opts, ans, ok, no):
    b = "".join(f'<button type="button">{E(o)}</button>' for o in opts)
    return f'<div class="quiz" data-ans="{ans}"><div class="qq">확인 퀴즈 — {E(q)}</div><div class="opts">{b}</div><div class="fb" aria-live="polite"></div><span class="qok" hidden>{E(ok)}</span><span class="qno" hidden>{E(no)}</span></div>'

def panel(no, i, p):
    return (f'<div class="panel"><div class="ph"><b>실험 {no}-{i}</b><small>{E(p["note"])}</small></div>'
            f'<div id="pp-{p["key"]}" data-panel="{p["key"]}"></div><div class="ctrl">{p["ctrl"]}</div><div class="readout" aria-live="polite"></div></div>')

def mathbox(m):
    tries = "".join(f"<div>{E(t)}</div>" for t in m["tries"])
    pcs = "".join(f"<tr><td class='m'>{E(a)}</td><td>{E(b)}</td></tr>" for a, b in m["pieces"])
    return f"""<div class="box mathbox"><h4>수식이 어려운 조수가 대신 묻습니다</h4>
<div class="q">{face('haru','e04')}<div><b>조수</b> {E(m['ask'])}</div></div>
<div class="easy"><b>말로 하면</b> — {E(m['words'])}</div>
<p><b>학교 수학으로 보면</b> — {E(m['school'])}</p>
<div class="fx">{E(m['formula'])}</div>
<table><thead><tr><th>식 조각</th><th>뜻</th></tr></thead><tbody>{pcs}</tbody></table>
<div class="try"><b>숫자로 한 번 해 보기</b>{tries}</div>
<div class="q">{face('haru','e16')}<div><b>조수</b> {E(m['comment'])}</div></div></div>"""

def gallery():
    rows = []
    for who, nm in [("haru", "하루"), ("sia", "시아"), ("moa", "모아")]:
        cells = "".join(art(f"p5_{who}_{st}", f"{nm}의 {sn} 전신 — 같은 자세, 왼쪽 위 빛", "2/3", sn) for st, sn in STYLES)
        rows.append(f'<h4 style="margin:14px 0 6px">{nm}</h4><div class="artrow">{cells}</div>')
    return '<div class="box" style="background:#fff">' + "".join(rows) + '<p class="hint" style="margin-top:8px">실사풍은 이 캐릭터를 코스프레한 가상의 성인 모델 사진으로 만든 것입니다. 실존 인물이 아닙니다.</p></div>'

EXAMPLE_PROMPT = """Full body character illustration, vertical 2:3.
High-quality anime illustration, clean confident lineart, two-tone cel shading with soft highlights, natural proportions of a young adult woman in her early twenties.
Character (match the attached reference sheet exactly): Haru, a cheerful lab assistant, long straight pink hair reaching the waist with navy blue streaks, including a thick navy streak down the center of the bangs, two round slightly messy hair buns on top of the head, a small ahoge, big bright blue eyes, lavender hoodie with white drawstrings over a white t-shirt, open white knee-length lab coat, rolled-up blue jeans, lavender sneakers. Modest outfit exactly as described.
Pose: standing upright in a three-quarter view turned slightly to the right, left arm relaxed at her side, right hand resting on her hip.
Lighting: soft daylight from the upper left, form shadows on the right side of the body, a soft cast shadow on the floor toward the lower right.
Background: plain off-white studio background.
No text, no letters, no logos, no watermark, no revealing clothing, not resembling any famous anime character, no pixel art."""

def step(P, i, s):
    no = P["no"]
    labels = ["무엇이 문제인가", "그냥 하면 막히는 곳", "이렇게 푼다"]
    why = "".join(f"<li><b>{labels[k]}</b> — {E(x)}</li>" for k, x in enumerate(s["why"]))
    whybox = f'<div class="box why"><h4>왜 이렇게 하나</h4><ol>{why}</ol><div class="easy"><b>쉽게 말하면</b> — {E(s["easy"])}</div></div>'
    calm = talk([("doctor", "e08", "여기서 한 번 멈춰도 괜찮아요. 식이 낯설면 건너뛰고 아래 실험부터 눌러 보세요. 숫자는 실험이 대신 계산해 줍니다.")])
    duo = f'<div class="duo">{whybox}{mathbox(s["math"])}</div>{calm}' if s.get("math") else f'<div style="margin:16px 0">{whybox}</div>'
    solve = "".join(f"<p>{E(x)}</p>" for x in s["solve"])
    extra = ""
    if s.get("gallery"):
        extra += gallery()
    if s.get("imgs"):
        extra += '<div class="box" style="background:#fff"><div class="artrow">' + "".join(art(k, al, "2/3", cp) for k, al, cp in s["imgs"]) + '</div><p class="hint" style="margin-top:8px">실사풍은 캐릭터를 코스프레한 가상의 성인 모델 사진으로 만든 것입니다. 실존 인물이 아닙니다.</p></div>'
    if s.get("prompts"):
        extra += f'<div class="promptbox"><b>예시 — 이 시리즈의 그림 요청문(하루, 애니풍 기준 전신)</b><p class="hint">고정값 → 자세 → 빛(그림자 방향까지) → 화풍 → 금지 순서입니다.</p><pre>{E(EXAMPLE_PROMPT)}</pre></div>'
    img = art(s["img"][0], s["img"][1], s["img"][2], s["img"][1], cls="tall" if s["img"][2] == "2/3" else "") if s.get("img") else ""
    q = s["quiz"]
    return f"""<section class="room" id="{s['id']}"><div class="wrap">
<div class="roomno">{no}부 · {i}단계</div>
<h2>{E(s['title'])}</h2><p class="muted">{E(s['sub'])}</p>
<div class="tags"><span class="tag how">{E(s['how'])}</span><span class="tag day">{E(s['day'])}</span></div>
{duo}
<div class="pair"><div class="box"><h4>일상으로 치면</h4><p>{E(s['daily'])}</p></div><div class="box ml"><h4>그림·VFX 현장에서는</h4><p>{E(s['field'])}</p></div></div>
{talk(s['talk'])}
{panel(no, i, s['panel'])}
<div class="solve"><h4>풀이</h4>{solve}</div>
{extra}{img}
<div class="solve"><h4>AI 결과, 그대로 써도 될까?</h4><p>{E(s['ai'][0])}</p><details class="code"><summary>답 보기</summary><p>{E(s['ai'][1])}</p></details></div>
<div class="limit"><b>주의할 점</b> — {E(s['limit'])}</div>
{quiz(q[0], q[1], q[2], q[3], q[4])}
</div></section>
"""

def judge(J):
    rows = ""
    for idx, item in enumerate(J["items"]):
        a, b = J["a"][1][idx], J["b"][1][idx]
        mx = 8 if "8개" in item else 10
        rows += f'<span>{E(item)}</span><span class="bar" title="{J["a"][0]} {a}"><i style="width:{a/mx*100:.0f}%"></i></span><span class="bar" title="{J["b"][0]} {b}"><i style="width:{b/mx*100:.0f}%;background:var(--teal)"></i></span>'
    sa, sb = sum(J["a"][1]), sum(J["b"][1])
    tbl = "".join(f"<tr><td>{E(it)}</td><td>{J['a'][1][k]}</td><td>{J['b'][1][k]}</td></tr>" for k, it in enumerate(J["items"]))
    return f"""<section class="room" id="judge"><div class="wrap"><div class="roomno">평가단 채점</div><h2>{E(J['title'])}</h2>
{talk(J['setup'])}
<div class="judge"><h4>평가단 X1·X2·X3 채점</h4>
<div class="score"><span></span><b>{E(J['a'][0])}</b><b>{E(J['b'][0])}</b>{rows}</div>
<div class="tbl" style="margin-top:10px"><table><thead><tr><th>항목</th><th>{E(J['a'][0])}</th><th>{E(J['b'][0])}</th></tr></thead><tbody>{tbl}<tr><th>합계</th><th>{sa}</th><th>{sb}</th></tr></tbody></table></div>
{talk(J['comments'])}</div>
{talk(J['result'])}
<p class="hint">점수는 이야기 속 예시입니다. 실제 그림을 평가한 값이 아닙니다.</p>
</div></section>
"""

def summary(P):
    rows = "".join(f"<tr><td>{E(a)}</td><td>{E(b)}</td><td>{E(c)}</td></tr>" for a, b, c in P["summary"])
    return f"""<section id="sum"><div class="wrap"><h2>{P['no']}부 정리</h2>
<div class="tbl"><table><thead><tr><th>주제</th><th>한 줄</th><th>작업에서는</th></tr></thead><tbody>{rows}</tbody></table></div></div></section>
"""

def outro(P):
    return f"""<section id="outro"><div class="wrap"><h2>다음으로</h2>{talk(P['outro'])}
<div class="next"><a href="{P['prev'][0]}">{E(P['prev'][1])}</a><a href="{P['next'][0]}">{E(P['next'][1])}</a></div></div></section>
"""

def failcard(f):
    note = f'<p class="hint">{E(f["note"])}</p>' if f.get("note") else ""
    return f"""<div class="failcard" id="{f['key'][:7]}"><h3>{E(f['title'])}</h3><div class="failgrid">
{art(f['key'], f['alt'], f['ar'])}
<div><p><span class="chip">증상</span>{E(f['symptom'])}</p>
{quiz(f['q'], f['opts'], f['ans'], f['ok'], f['no'])}
<p><span class="chip">연결된 원리</span><a href="{f['link'][0]}">{E(f['link'][1])}</a></p>
<div class="promptbox"><b>고치는 프롬프트 조각</b><pre>{E(f['fix'])}</pre></div>{note}</div></div></div>"""

# ---------------- 지식 색인
KG = [
 ("concept/hairline-parting", "Concept", "이마 선과 가르마", "Hairline and parting", "01_hair_frame.html", "#s1", "가르마는 이마 선보다 뒤에서 시작한다"),
 ("concept/hair-volume", "Concept", "머리카락 부피", "Hair volume over the skull", "01_hair_frame.html", "#s2", "실루엣 폭 = 머리 폭 + 2 × 머리카락 두께"),
 ("concept/length-ends", "Concept", "길이와 끝 방향", "Hair length landmarks and end direction", "01_hair_frame.html", "#s3", "귀·목덜미·어깨 기준점과 바깥·안쪽·일자·눈 가림 끝 모양"),
 ("method/hair-draw-order", "Method", "머리카락 그리는 순서", "Hair drawing order", "01_hair_frame.html", "#s4", "가운데 선·이마 선 → 앞머리 → 옆머리 → 뒷머리 → 잔머리"),
 ("method/hair-locks", "Method", "다발로 그리기", "Drawing hair as locks", "02_hair_bundles.html", "#s1", "선 수 = 다발 수 × 다발 속 가는 선 수"),
 ("concept/hair-contact", "Concept", "몸에 닿는 곳의 흐름", "Hair flow at body contacts", "02_hair_bundles.html", "#s2", "어깨·가슴에 닿으면 면을 따라 꺾이고 가려진 선은 지운다"),
 ("concept/tie-convergence", "Concept", "묶은 점으로 모이는 흐름", "Locks converging at the hair tie", "02_hair_bundles.html", "#s3", "묶은 머리는 모든 다발이 묶은 점으로 모인다"),
 ("concept/curl-cylinder", "Concept", "말린 머리의 원기둥", "Curls as spiral cylinders", "02_hair_bundles.html", "#s4", "길이 = 바퀴 수 × √(둘레² + 한 바퀴 높이²)"),
 ("concept/hair-gray-value", "Concept", "머리색의 회색 농도", "Hair color as gray value", "03_hair_color.html", "#s1", "밝기 = 0.299R + 0.587G + 0.114B"),
 ("concept/shine-band", "Concept", "윤기 띠", "Anisotropic highlight band", "03_hair_color.html", "#s2", "띠 높이 ≈ (빛 각 + 눈 각) ÷ 2, 흐름을 가로지른다"),
 ("method/light-hair", "Method", "밝은 머리 덜어 내기", "Rendering light hair by subtraction", "03_hair_color.html", "#s3", "이마 선 생략, 그늘 안쪽에만 톤"),
 ("method/black-hair", "Method", "검은 머리와 윤기 비율", "Black hair and highlight ratio", "03_hair_color.html", "#s4", "윤기 비율 = 흰 넓이 ÷ 머리 넓이"),
 ("concept/wind-force", "Concept", "바람과 머리카락", "Wind on hair", "04_hair_motion.html", "#s1", "미는 힘 ∝ 풍속², 방향은 하나"),
 ("concept/follow-through", "Concept", "늦게 따라오기", "Follow-through of hair tips", "04_hair_motion.html", "#s2", "늦는 장 수 = 거리 ÷ 전달 빠르기 × 24"),
 ("concept/hand-wet-hair", "Concept", "손과 물의 머리카락", "Hair under hands and water", "04_hair_motion.html", "#s3", "손은 닿는 곳, 젖으면 다발↑ 부피↓ 무게↑"),
 ("method/emotion-hair", "Method", "감정 과장 머리카락", "Emotional exaggeration of hair", "04_hair_motion.html", "#s4", "기쁨 퍼짐·분노 곤두섬·놀람 튐·실망 처짐"),
 ("method/hair-prompt", "Method", "머리 문장 여덟 조각", "Eight-part hair prompt", "05_ai_vfx.html", "#s1", "길이·앞머리·가르마·부피·다발·색·윤기·움직임 + 고정·금지"),
 ("method/hair-inpaint", "Method", "가림 영역으로 머리만 바꾸기", "Inpainting only the hair", "05_ai_vfx.html", "#s2", "새 가발 자리까지 가리고 얼굴은 비운다"),
 ("method/guide-hairs", "Method", "가이드 가닥과 채우기", "Guide hairs and interpolation", "05_ai_vfx.html", "#s3", "가닥 수 = 가이드 × 채우기, 덩어리 값으로 다발"),
 ("method/style-locks", "Method", "화풍별 다발 수", "Lock count per art style", "05_ai_vfx.html", "#s4", "원리는 그대로, 다발과 가는 털의 양만 바꾼다"),
 ("method/hair-diagnosis", "Method", "머리카락 그림 진단 순서", "Hair drawing diagnosis checklist", "06_failure_lab.html", "#s1", "뼈대 → 다발·흐름 → 색·윤기 → 움직임 → 고정·가림"),
 ("application/hair-failures", "Application", "머리카락 그림 실패 8종", "Eight hair drawing failures", "06_failure_lab.html", "#fails", "가르마 앞·헬멧·철사·묶은 점 무시·세로 윤기·바람 둘·뽀송한 젖은 머리·얼굴 바뀜"),
 ("open/hairstyle-age-drift", "OpenQuestion", "머리 이름이 나이를 바꾸는 현상", "Hairstyle words shifting apparent age", "06_failure_lab.html", "#drift", "머리 이름 대신 묶는 높이·길이를 적고 성인 나이를 고정한다"),
 ("application/practice", "Application", "실전 연습장", "Practice simulator", "practice/index.html", "#salon", "미용실·바람 터널·머리 문장 공방·진단 데스크"),
 ("analogy/hat", "Analogy", "모자 쓰기", "Wearing a hat", "01_hair_frame.html", "#s1", "모자처럼 머리카락도 이마 선에 걸쳐 얹는다"),
 ("analogy/brush-tip", "Analogy", "붓 끝", "Brush tip", "02_hair_bundles.html", "#s1", "수천 가닥이 몇 개의 뭉치로 모인다"),
 ("analogy/umbrella", "Analogy", "우산살", "Umbrella ribs", "02_hair_bundles.html", "#s3", "모든 살이 꼭지로 모인다"),
 ("analogy/silk-skein", "Analogy", "비단실 타래", "Silk skein", "03_hair_color.html", "#s2", "실 방향과 가로로 밝은 띠가 생긴다"),
 ("analogy/jump-rope", "Analogy", "줄넘기 줄", "Jump rope", "04_hair_motion.html", "#s2", "물결이 손에서 끝까지 늦게 도착한다"),
]
KG_EDGES = [("concept/hairline-parting","motivates","concept/hair-volume"),("concept/hair-volume","motivates","concept/length-ends"),("concept/length-ends","motivates","method/hair-draw-order"),
 ("method/hair-draw-order","motivates","method/hair-locks"),("method/hair-locks","motivates","concept/hair-contact"),("concept/hair-contact","motivates","concept/tie-convergence"),("concept/tie-convergence","motivates","concept/curl-cylinder"),
 ("concept/curl-cylinder","motivates","concept/hair-gray-value"),("concept/hair-gray-value","motivates","concept/shine-band"),("concept/shine-band","motivates","method/light-hair"),("method/light-hair","motivates","method/black-hair"),
 ("method/black-hair","motivates","concept/wind-force"),("concept/wind-force","motivates","concept/follow-through"),("concept/follow-through","motivates","concept/hand-wet-hair"),("concept/hand-wet-hair","motivates","method/emotion-hair"),
 ("method/emotion-hair","motivates","method/hair-prompt"),("method/hair-prompt","motivates","method/hair-inpaint"),("method/hair-inpaint","motivates","method/guide-hairs"),("method/guide-hairs","motivates","method/style-locks"),
 ("method/style-locks","motivates","method/hair-diagnosis"),("method/hair-diagnosis","usedIn","application/hair-failures"),("method/hair-prompt","explains","open/hairstyle-age-drift"),
 ("method/hair-locks","explains","method/guide-hairs"),("concept/curl-cylinder","explains","method/guide-hairs"),("concept/follow-through","explains","method/guide-hairs"),("concept/shine-band","explains","method/black-hair"),
 ("analogy/hat","explains","concept/hairline-parting"),("analogy/brush-tip","explains","method/hair-locks"),("analogy/umbrella","explains","concept/tie-convergence"),("analogy/silk-skein","explains","concept/shine-band"),("analogy/jump-rope","explains","concept/follow-through"),
 ("method/hair-prompt","usedIn","application/practice"),("concept/hair-volume","usedIn","application/practice"),("concept/wind-force","usedIn","application/practice")]
REFS = [
 dict(id="studio_hard_deluxe_2015_expressions", title="デジタルツールで描く！感情があふれ出るキャラの表情の描き方", author="スタジオ・ハードデラックス", year=2015, note="マイナビ出版. 4장 특별편 「髪の描き方」(p.135~158: 머리 모양의 종류, 머리카락 그리는 순서, 남녀 머리 모양 변형, 머리색 표현, 감정 과장, 머리카락의 움직임)의 원리를 참고. 책의 그림·문장·도식·구성 순서는 옮기지 않고 연구실 캐릭터와 실험으로 새로 구성"),
 dict(id="itu_bt601", title="Recommendation ITU-R BT.601 (luma coefficients)", author="ITU-R", year=1982, note="밝기 = 0.299R + 0.587G + 0.114B. 색을 회색 농도로 바꾸는 근삿값"),
 dict(id="marschner_2003_hair", title="Light Scattering from Human Hair Fibers", author="Stephen R. Marschner, Henrik Wann Jensen, Mike Cammarano, Steve Worley, Pat Hanrahan", year=2003, note="SIGGRAPH 2003 — 머리카락 윤기가 흐름을 가로지르는 띠, 두 겹 띠가 되는 원리"),
 dict(id="kajiya_kay_1989", title="Rendering Fur with Three Dimensional Textures", author="James T. Kajiya, Timothy L. Kay", year=1989, note="SIGGRAPH 1989 — 가는 원기둥(털)의 반사를 방향을 따라 늘어난 띠로 계산"),
 dict(id="jakobsen_2001_verlet", title="Advanced Character Physics", author="Thomas Jakobsen", year=2001, note="GDC 2001 — 이 페이지 실험의 점과 막대(베를레) 머리카락 가닥 계산"),
 dict(id="lugmayr_2022_repaint", title="RePaint: Inpainting using Denoising Diffusion Probabilistic Models", author="Andreas Lugmayr et al.", year=2022, note="CVPR 2022. arXiv:2201.09865 — 가림 영역만 다시 그리는 방식"),
 dict(id="rombach_2022_ldm", title="High-Resolution Image Synthesis with Latent Diffusion Models", author="Robin Rombach et al.", year=2022, note="CVPR 2022. arXiv:2112.10752 — 글 지시로 그림을 만드는 확산 모델(인페인팅 포함)"),
 dict(id="prev_series", title="구조 먼저 보는 캐릭터 그리기 연구실 / 옷장 편 / 그리기 연구실 01 · 기분 편", author="안상선", year=2026, note="앞 시리즈. https://adminmrobo.github.io/adminmrobo-structure_first_drawing_lab/ · https://adminmrobo.github.io/structure_first_drawing_lab_01/ · https://adminmrobo.github.io/drawing_lab_01/"),
]

def kg_block(page, pages):
    nodes = [dict(id="lab:" + i, type=t, label=dict(ko=ko, en=en), page=p, anchor=a, definition=dict(ko=d), source="lab:work/drawing_lab_02")
             for i, t, ko, en, p, a, d in KG if p in pages]
    ids = {n["id"] for n in nodes}
    edges = [dict(s="lab:" + s, p=p, o="lab:" + o) for s, p, o in KG_EDGES if "lab:" + s in ids and "lab:" + o in ids]
    raw = dict(version="1.3", page=page, series=SERIES, nodes=nodes, edges=edges)
    ld = {"@context": {"@vocab": "urn:lab:", "skos": "http://www.w3.org/2004/02/skos/core#", "schema": "https://schema.org/"},
          "@graph": [{"@id": "urn:" + n["id"], "@type": n["type"], "skos:prefLabel": [{"@value": n["label"]["ko"], "@language": "ko"}, {"@value": n["label"]["en"], "@language": "en"}],
                      "skos:definition": n["definition"]["ko"], "schema:url": SITE + n["page"] + n["anchor"]} for n in nodes]}
    meta = dict(title=page, series=SERIES, creator=[dict(name="안상선", role="author", affiliation="(주)M-Robo")], date=DATE, version=VER, license="캐릭터·그림 무단 사용 금지")
    J = lambda o: json.dumps(o, ensure_ascii=False).replace("</", "<\\/")
    return f"""<section id="kg"><div class="wrap"><h2>지식 색인 — 이 페이지의 낱말 찾기</h2>
<p class="muted">이 페이지에 나온 개념·방법·비유·쓰임을 모았습니다. 검색하고, "설명 보러 가기"로 본문에 돌아갑니다.</p><div id="kg-mount"></div></div></section>
<section id="export"><div class="wrap"><h2>온톨로지·서지 꾸러미 내려받기</h2>
<p class="muted">지식 색인을 출처와 함께 파일로 내려받습니다. 서지 관리는 BibTeX·RIS, 온톨로지 편집은 Turtle, 그래프 도구는 CSV, 여러 페이지 합치기는 kg.json입니다.</p><div id="export-mount"></div></div></section>
<script type="application/json" id="kg-raw">{J(raw)}</script>
<script type="application/ld+json" id="kg-ld">{J(ld)}</script>
<script type="application/json" id="refs-csl">{J(REFS)}</script>
<script type="application/json" id="page-meta">{J(meta)}</script>
"""

FOOT_LINKS = [("index.html", "목차")] + [(P["file"], f"{P['no']}부") for P in PARTS] + [("practice/index.html", "7부 실전 연습장")]

def footer(pre=""):
    links = " · ".join(f'<a href="{pre}{h}">{E(t)}</a>' for h, t in FOOT_LINKS) + f' · <a href="{REPO}">저장소</a>'
    refs = "".join(f"<tr><td>[{i+1}]</td><td>{E(r['author'])} ({r['year']}). {E(r['title'])}</td><td>{E(r['note'])}</td></tr>" for i, r in enumerate(REFS))
    return f"""<footer><div class="wrap">
<h3>출처·참고</h3>
<div class="tbl"><table><thead><tr><th>#</th><th>자료</th><th>어디에 썼나</th></tr></thead><tbody>{refs}</tbody></table></div>
<h3>예시값·설명용 숫자</h3>
<p>머리 폭 16cm, 머리카락 두께, 길이 구간, 머리카락 10만 올, 선 수 구간, 말린 머리 반지름·높이, 인물끼리 밝기 차이 15%, 윤기 비율 구간, 전달 빠르기 150cm/초, 젖은 머리의 다발 2배·부피 0.6배·무게 1.3배, 가림 영역 크기, 가이드·채우기 수, 화풍별 다발 수, 평가단 점수는 모두 원리를 보이기 위한 예시값입니다. 실제 값은 사람·화풍·도구마다 다릅니다.</p>
<p>등장인물은 모두 20대 성인 연구원입니다(박사는 성인 남성). 실사풍 그림은 캐릭터를 코스프레한 가상의 성인 모델이며 실존 인물이 아닙니다. 다른 작품의 캐릭터를 닮은 그림은 만들지 않습니다.</p>
<p>원리 참고: スタジオ・ハードデラックス『デジタルツールで描く！感情があふれ出るキャラの表情の描き方』(マイナビ, 2015) 4장 특별편 「髪の描き方」(p.135~158). 책의 그림·문장·도식·구성 순서는 옮기지 않았습니다. 이번 편의 '가발로 변장'은 연구실 등장인물이 머리 모양만 바꿔 쓰는 설정이며, 얼굴·눈 색·옷은 원래 캐릭터 그대로입니다.</p>
<p>캐릭터 이름·설정·그림은 저작권자 안상선의 허락 없이 사용할 수 없습니다. 캐릭터 그림: <a href="{CHARREPO}">fruitfly-lab-expressions</a>.</p>
<p>글 · 안상선 ((주)M-Robo 대표) · <a href="{AUTHOR_URL}">저자 소개</a> · {DATE} · {VER}</p>
<p>{links}</p>
</div></footer>
<script src="{pre}assets/panels.js"></script>
</body></html>
"""

REFS_DL = ["haru_anime_base.png", "sia_anime_base.png", "moa_anime_base.png", "haru_sheet.png", "sia_sheet.png", "moa_sheet.png", "doctor_sheet.png", "fruitfly_sprites_6.png", "jupanbot_ref_genspark_v0.png", "pixel_style_ref_prev_cover.png"]
def make_section(P):
    tasks = MAKE.get(P["no"])
    if not tasks:
        return ""
    refs = " · ".join(f'<a href="assets/refs/{f}" download>{f.replace(".png", "")}</a>' for f in REFS_DL)
    out = f"""<section class="room" id="make"><div class="wrap"><div class="roomno">{P['no']}부 · 직접 만들기</div><h2>프롬프트로 직접 만들어 보기</h2>
<div class="box"><p>이 부에서 배운 원리를 그림 생성 AI(Genspark 등)로 직접 확인합니다. <b>A</b>는 이 페이지 그림을 실제로 만든 프롬프트, <b>B</b>는 원리를 하나 빼거나 바꾼 비교용 문장입니다.</p>
<ol style="margin:6px 0 0;padding-left:20px"><li>새 대화를 열고 아래 '첨부'에 적힌 참고 그림을 올립니다.</li><li>A를 붙여 넣어 만들고, 확인표로 결과를 점검합니다.</li><li>같은 대화에 B를 이어 붙여 다시 만들고, A 결과와 나란히 비교합니다.</li><li>결과는 매번 다릅니다. 두세 번 만들어 가장 나은 것을 고르세요.</li></ol>
<p class="hint" style="margin-top:8px">참고 그림 내려받기: {refs}</p></div>"""
    for i, t in enumerate(tasks, 1):
        A = PROMPTS[t["key"]][4]
        att = ATTACH_OF[CONV_OF[t["key"]]]
        ar = "16/9" if "16:9" in A.split("\n")[0] else "2/3"
        alt = PROMPTS[t["img"]][3]
        chk = "".join(f'<li>{E(c)}' + (f' <a href="{l}">원리 보기</a>' if l else "") + "</li>" for c, l in t["check"])
        bimgs = ""
        if t["b_imgs"]:
            bimgs = '<div class="artrow">' + "".join(art(k, "비교 결과 — " + t["b_title"], ar, f"B 결과 {j}") for j, k in enumerate(t["b_imgs"], 1)) + "</div>"
        tip = f'<p class="hint">{E(t["tip"])}</p>' if t.get("tip") else ""
        if t.get("res"):
            tip = f'<p style="background:#fff7ec;border-left:4px solid var(--orange);padding:8px 12px;border-radius:6px">{E(t["res"])}</p>' + tip
        bbox = f'<div class="promptbox"><b>{E(t["b_title"])}</b><pre>{E(t["b_text"])}</pre><button type="button" class="btn copy">복사하기</button></div>'
        if len(t["b_imgs"]) == 1:
            k = t["b_imgs"][0]
            bpart = f'<div class="pair">{bbox}<div>{art(k, PROMPTS[k][3] if k in PROMPTS else "비교 결과 — " + t["b_title"], ("2/3" if "vertical 2:3" in PROMPTS[k][4] else "16/9") if k in PROMPTS else ar, "B 결과")}</div></div>'
        else:
            bpart = bbox + bimgs
        out += f"""<div class="failcard" id="make{i}"><h3>실습 {i} · {E(t['title'])}</h3><p>{E(t['goal'])}</p>
<div class="pair"><div class="promptbox"><b>A — 이 페이지 그림을 만든 프롬프트</b><p class="hint">첨부: {E(att)}</p><pre>{E(A)}</pre><button type="button" class="btn copy">복사하기</button></div>
<div>{art(t['img'], alt, ar, "A 결과 — Genspark로 만든 실제 그림")}</div></div>
{bpart}<h4>결과에서 확인할 것</h4><ol>{chk}</ol>{tip}</div>"""
    return out + "</div></section>"

def build_part(P):
    t = f"{SERIES} {P['no']}부 — {P['title']}"
    s = head(t, P["desc"], P["og"], P["file"])
    navl = [(f"#{x['id']}", f"{k+1}단계") for k, x in enumerate(P["steps"])]
    if P.get("fails"): navl += [("#fails", "실패 8종")]
    navl += [("#make", "직접 만들기"), ("#judge", "평가"), ("#sum", "정리"), (P["next"][0], "다음 →")]
    s += nav(navl)
    s += cover(P["cover_key"], P["cover_cap"], P["cover_cast"])
    s += f"""<header class="hero"><div class="wrap"><span class="kicker">{E(P['kicker'])}</span><h1>{E(P['title'])}</h1><p class="lead">{E(P['lead'])}</p>
<p class="byline">글 · 안상선 ((주)M-Robo 대표) · <a href="{AUTHOR_URL}">저자 소개</a> · {DATE} · {VER}</p></div></header>
<section><div class="wrap">{three(*P['three'], ABBR)}</div></section>
<section><div class="wrap"><h2>오늘의 과제</h2>{talk(P['intro'])}{flow_strip(P['no'])}</div></section>
"""
    for k, st in enumerate(P["steps"]):
        s += step(P, k + 1, st)
    if P.get("fails"):
        s += '<section class="room" id="fails"><div class="wrap"><div class="roomno">6부 · 2단계</div><h2>머리카락 그림 실패 8종 진단</h2><p class="muted">그림마다 증상을 보고 원인을 고른 뒤, 연결된 원리와 고치는 프롬프트 조각을 확인합니다.</p>'
        s += "".join(failcard(f) for f in P["fails"])
        d = P["drift"]
        s += f'<div class="failcard" id="drift"><h3>{E(d["title"])}</h3>' + "".join(f"<p>{E(x)}</p>" for x in d["body"]) + '<p><span class="chip">연결된 원리</span><a href="05_ai_vfx.html#s1">5부 1단계 머리 문장</a></p></div></div></section>'
    s += make_section(P)
    s += judge(P["judge"]) + summary(P) + outro(P)
    s += kg_block(P["file"].replace(".html", ""), [P["file"]])
    s += footer()
    open(os.path.join(ROOT, P["file"]), "w").write(s)

FLOW = [
 (1, "머리 모양의 뼈대", "바깥 윤곽부터 그리면 가르마가 이마를 가르고 머리가 납작해진다", "이마 선·가르마·부피·길이와 끝·순서"),
 (2, "다발과 흐름", "뼈대를 잡아도 한 올씩 그리면 철사 뭉치가 되고, 몸·묶은 점과 따로 논다", "다발·닿는 곳·묶은 점·원기둥"),
 (3, "색과 윤기", "모양이 맞아도 흑백에서 색이 안 보이고, 윤기가 틀리면 플라스틱 같다", "회색 농도·윤기 띠·밝은 머리·검은 머리"),
 (4, "움직이는 머리카락", "서 있는 머리를 움직이는 장면에 쓰면 판자처럼 굳어 보인다", "바람·늦게 따라오기·손과 물·감정"),
 (5, "AI와 VFX로 변장하기", "도구는 원리를 모른다. 말과 가림 영역·숫자로 나눠 알려 줘야 한다", "머리 문장·가림 영역·가이드 가닥·화풍"),
 (6, "실패 사례 실험실", "문장을 잘 써도 머리는 틀릴 수 있다", "진단 순서와 고치는 조각"),
 (7, "실전 연습장", "배운 것을 한 화면에서 함께 다뤄 본다", "미용실·바람 터널·공방·진단 데스크"),
]
def flow_strip(cur=None, pre=""):
    files = {P["no"]: P["file"] for P in PARTS}
    files[7] = "practice/index.html"
    cells = []
    for n, t, _, _ in FLOW:
        mark = ' style="border-color:var(--orange);background:var(--orange-soft)"' if n == cur else ""
        cells.append(f'<a href="{pre}{files[n]}"{mark}><b>{n}부</b>{E(t)}</a>')
    return '<div class="flowgrid" style="grid-template-columns:repeat(auto-fit,minmax(130px,1fr));margin-top:16px">' + "".join(cells) + "</div>"

def build_index():
    t = f"{SERIES} — 같은 얼굴, 다른 머리"
    d = "연구실 등장인물이 가발로 변장합니다. 이마 선·가르마·부피, 다발과 묶은 점, 흑백의 머리색과 윤기 띠, 바람·늦게 따라오기·젖은 머리를 실험으로 익히고, AI 머리 문장·가림 영역·VFX 가이드 가닥으로 옮겨 봅니다. 머리카락 그림 실패 8종 진단까지."
    s = head(t, d, "og_index.jpg", "index.html")
    s += nav([("#howto", "읽는 법"), ("#parts", "편 목록"), ("#map", "전체 흐름"), ("#cast", "등장인물"), ("#source", "원리와 출처")])
    s += cover("cover_index", "연구실 변장 파티 · 가발 상자 앞의 모델 셋, 화가 둘, 박사, 평가단 셋", [("fruitfly", "e09"), ("haru", "e01"), ("sia", "e13"), ("moa", "e19"), ("jupanbot", "e16")])
    s += f"""<header class="hero"><div class="wrap"><span class="kicker">연구실 특별편 · 그리기와 렌더링 · 머리카락 편</span>
<h1>그리기 연구실 02<br>머리카락 편 — 같은 얼굴, 다른 머리</h1>
<p class="lead">연구실에 가발 상자가 도착했습니다. 하루는 번 머리를 풀고 단발을, 시아는 포니테일과 말린 머리를, 모아는 네 가지 색을, 박사는 흰머리를 씁니다. <b>얼굴은 그대로, 머리만 바꾸는 변장</b>으로 머리카락을 그리는 원리를 실험으로 보고, <b>AI와 VFX로 가발을 씌워</b> 봅니다.</p>
<p class="byline">글 · 안상선 ((주)M-Robo 대표) · <a href="{AUTHOR_URL}">저자 소개</a> · {DATE} · {VER}</p></div></header>
<section><div class="wrap">{three("머리카락을 이마 선·가르마·부피로 먼저 잡고, 다발과 묶은 점으로 흐름을 정하고, 색과 윤기·움직임을 더하는 원리를 실험으로 익힌 뒤, AI 머리 문장과 VFX 헤어 값으로 옮깁니다.", "머리 모양은 캐릭터를 알아보는 첫째 표식입니다. 원리와 어긋나면 머리가 헬멧처럼 붙거나 철사처럼 뭉치고, 가발을 바꿀 때 얼굴까지 바뀝니다.", "캐릭터 헤어 설정, 흑백 만화의 머리 톤, AI 그림의 머리 바꾸기와 검수, 3D 헤어 시뮬레이션 설정에 씁니다.", ABBR)}</div></section>
<section id="howto"><div class="wrap"><h2>읽는 순서와 시간</h2><div class="box"><ul style="margin:0;padding-left:20px">
<li><b>처음부터 차례로</b>(권장): 부마다 실험을 눌러 보며 20~30분, 전체 3시간 안팎입니다.</li>
<li><b>앞 시리즈를 안 봤다면</b>: <a href="{PREV_SITE}">구조 먼저 보는 캐릭터 그리기 연구실</a>의 빛과 그림자 부분을 먼저 보면 3부가 편합니다. 안 봐도 읽을 수 있게 다시 설명합니다. 옷 주름은 <a href="{CLOSET}">옷장 편</a>, 표정은 <a href="{MOOD}">기분 편</a>에 있습니다.</li>
<li><b>손 그림 원리만</b>: 1~4부. <b>AI·VFX가 급하다면</b>: 5부 → 6부 → 7부, 막히는 낱말은 각 단계의 링크로 되짚어 보세요.</li>
<li>각 부 끝의 <b>평가단 채점</b>은 이야기 속 예시 점수입니다. 확인 퀴즈와 실전 연습장 미션으로 스스로 점검하세요.</li></ul></div></div></section>
<section id="parts"><div class="wrap"><h2>편 목록</h2>
<p class="muted">모델은 하루·시아·모아(3·4부에는 박사가 손님 모델), 화가는 주판봇과 초파리, 평가단은 X1·X2·X3, 해설은 박사입니다. 부마다 두 화가가 겨루고 평가단이 점수를 매깁니다.</p>
<div class="cards">
<a class="card" href="01_hair_frame.html">{face("haru","e01")}<span class="n">1부 · 모델 하루(단발 가발)</span><h3>머리 모양의 뼈대</h3><p>이마 선과 가르마, 머리카락 두께만큼의 부피, 길이와 끝 방향, 그리는 순서.</p></a>
<a class="card" href="02_hair_bundles.html">{face("sia","e13")}<span class="n">2부 · 모델 시아(포니테일·말린 머리)</span><h3>다발과 흐름</h3><p>다발로 잡기, 몸에 닿는 곳, 묶은 점으로 모이는 흐름, 원기둥과 마름모.</p></a>
<a class="card" href="03_hair_color.html">{face("moa","e19")}<span class="n">3부 · 모델 모아 · 손님 박사</span><h3>색과 윤기</h3><p>흑백의 회색 농도, 흐름을 가로지르는 윤기 띠, 밝은 머리와 검은 머리.</p></a>
<a class="card" href="04_hair_motion.html">{face("haru","e19")}<span class="n">4부 · 모델 하루(긴 웨이브) · 손님 박사</span><h3>움직이는 머리카락</h3><p>바람 하나, 늦게 따라오는 털끝, 손과 물, 감정 과장.</p></a>
<a class="card" href="05_ai_vfx.html">{face("moa","e10")}<span class="n">5부 · 모델 셋 모두</span><h3>AI와 VFX로 변장하기</h3><p>머리 문장 여덟 조각, 머리만 가려 다시 그리기, 가이드 가닥, 화풍별 다발 수.</p></a>
<a class="card" href="06_failure_lab.html">{face("jupanbot","e20")}<span class="n">6부 · 의도적 실패 8종</span><h3>실패 사례 실험실</h3><p>증상 → 원인 → 원리 → 고치는 조각. 머리카락 그림 진단 순서.</p></a>
<a class="card" href="practice/index.html">{face("x3","e16")}<span class="n">7부 · 마지막 장</span><h3>실전 연습장</h3><p>미용실·바람 터널·머리 문장 공방·진단 데스크를 직접 운영합니다.</p></a>
</div></div></section>
<section id="map"><div class="wrap"><h2>전체 흐름 — 1부부터 7부까지 이어지는 순서</h2>{flow_strip()}
<div class="tbl" style="margin-top:16px"><table><thead><tr><th>부</th><th>제목</th><th>이 부를 배우는 까닭</th><th>핵심</th></tr></thead><tbody>
{''.join(f"<tr><td>{n}</td><td>{E(t)}</td><td>{E(a)}</td><td>{E(b)}</td></tr>" for n, t, a, b in FLOW)}</tbody></table></div>
<p class="muted" style="margin-top:12px">함께 보면 좋은 편: <a href="{PREV_SITE}">구조 먼저 보는 캐릭터 그리기 연구실(구조·빛·주름·확산 모델)</a> · <a href="{CLOSET}">옷장 편(옷 주름)</a> · <a href="{MOOD}">기분 편(표정)</a> · <a href="{RENDER}">AI 렌더링 연구실</a></p></div></section>
<section id="cast"><div class="wrap"><h2>등장인물</h2><div class="cast-grid">{''.join(f'<div class="who">{face(k, "e01" if k in ("haru","sia","moa") else "e13")}<b>{E(CH[k][0])}</b><span>{E(CH[k][1])}</span></div>' for k in ["doctor","haru","sia","moa","jupanbot","fruitfly","x1","x2","x3"])}</div>
<div class="box" style="margin-top:12px"><b>이번 편의 설정 — 가발로 변장</b><p style="margin:6px 0 0">연구실 식구들이 변장 파티를 엽니다. 가발은 머리 모양만 바꿉니다. 얼굴·눈 색·옷·나이는 원래 캐릭터 그대로이고, 모아의 흰 리본은 가발 위에서도 왼쪽 귀 위에 둡니다. 그래서 '머리만 바꾸고 얼굴은 지키기'가 5부 AI 실습의 목표가 됩니다.</p></div>
<p class="hint" style="margin-top:10px">모델은 모두 20대 성인 연구원입니다(박사는 성인 남성). 원리 실습은 연구실 의상(랩코트·후드티·카디건·메이드복·조끼와 넥타이)으로 합니다.</p></div></section>
<section id="source"><div class="wrap"><h2>원리와 출처</h2>
<p>1~4부의 그리기 원리(머리 원형 위에 이마 선·가르마를 잡고 부피를 얹는 순서, 길이 구분과 끝 방향, 다발로 그리기, 묶은 머리·말린 머리·땋은 머리, 흑백의 머리색과 윤기, 바람·몸 동작·손·물·감정에 따른 머리카락)는 일반적인 드로잉 원리이며, スタジオ・ハードデラックス의 작법서 『デジタルツールで描く！感情があふれ出るキャラの表情の描き方』(マイナビ, 2015) 4장 특별편 「髪の描き方」 p.135~158을 참고해 정리했습니다. 책의 그림·문장·도식·구성 순서는 옮기지 않았고, 연구실 캐릭터와 직접 움직이는 실험으로 새로 구성했습니다. 책의 교복·맨몸 습작 예시는 쓰지 않고 같은 원리를 연구실 의상으로 다뤘습니다.</p>
<p>색의 밝기 식은 영상 규격(ITU-R BT.601), 윤기 띠는 머리카락 빛 산란 연구(Marschner 외 2003, Kajiya·Kay 1989), 가닥 계산은 베를레 계산(Jakobsen 2001), 가림 영역 다시 그리기는 확산 모델 연구를 바탕으로 쉽게 풀었습니다(아래 출처). 페이지의 그림 48장(표지 8장은 픽셀아트, 본문은 애니풍, 3부 4단계는 흑백 만화풍, 5부 4단계만 네 화풍, 직접 만들어 보기 비교 그림 11장)은 Genspark로 만들었습니다. 그림이 의도대로 나오지 않은 곳은 그림 설명과 '실제 결과'에 있는 그대로 적었습니다. 실험 패널은 모두 페이지 안에서 직접 계산해 그립니다.</p></div></section>
"""
    s += kg_block("index", [P["file"] for P in PARTS] + ["practice/index.html"])
    s += footer()
    open(os.path.join(ROOT, "index.html"), "w").write(s)

def build_practice():
    pre = "../"
    t = f"{SERIES} 7부 — 실전 연습장"
    d = "미용실(주문에 맞는 가발 만들기), 바람 터널(가닥 시뮬레이션), 머리 문장 공방(프롬프트), 진단 데스크(실패 맞히기) 네 곳을 직접 운영하며 1~6부를 함께 연습합니다."
    s = head(t, d, "og_07.jpg", "practice/index.html", pre)
    s += nav([("#salon", "미용실"), ("#wind", "바람 터널"), ("#workshop", "공방"), ("#desk", "진단 데스크"), ("#wrap", "마무리")], pre)
    s += cover("cover_07", "연구실 연습장 · 미용실 의자·바람 터널·문장 책상·진단 데스크", [("haru", "e19"), ("doctor", "e16"), ("fruitfly", "e09"), ("jupanbot", "e16")], pre)
    s += f"""<header class="hero"><div class="wrap"><span class="kicker">7부 · 마지막 장</span><h1>실전 연습장</h1>
<p class="lead">네 곳의 작업장을 직접 운영합니다. <span style="color:var(--green)">초록 조작판</span>은 주어진 환경, <span style="color:var(--blue)">파랑 조작판</span>은 내 결정입니다. 미션은 직접 조작해야 판정됩니다.</p>
<p class="byline">글 · 안상선 ((주)M-Robo 대표) · <a href="{AUTHOR_URL}">저자 소개</a> · {DATE} · {VER}</p></div></header>
<section id="practice"><div class="wrap">
<div class="tabs" role="tablist"><button type="button" data-t="salon">미용실</button><button type="button" data-t="wind">바람 터널</button><button type="button" data-t="workshop">머리 문장 공방</button><button type="button" data-t="desk">진단 데스크</button></div>
"""
    def sc(id_, title, situ, env, me, missions, back, g1=""):
        ms = "".join(f"<li>{E(m)}</li>" for m in missions)
        bk = " · ".join(f'<a href="{pre}{h}">{E(t)}</a>' for h, t in back)
        return f"""<div class="scene" id="{id_}"><h2>{E(title)}</h2><div class="box"><b>상황</b> — {E(situ)}</div>
<div class="panel"><div class="ph"><b>조작판</b><small>초록 = 환경 · 파랑 = 내 결정</small></div>
<div class="ctrl ctl-env">{env}</div><div class="ctrl ctl-me">{me}</div>
<div class="board" aria-live="polite"></div>
<div class="pair"><div class="g1">{g1}</div><div class="g2"></div></div>
<div class="talk"></div>
<h4>미션</h4><ol class="missions">{ms}</ol></div>
<p class="muted">배운 곳 다시 보기: {bk}</p></div>
"""
    def rg(label, name, lo, hi, val, step=1):
        return f'<label>{label} <input type="range" name="{name}" min="{lo}" max="{hi}" step="{step}" value="{val}"></label>'
    s += sc("salon", "미용실 — 주문에 맞는 가발 만들기", "손님(하루)의 주문 인상이 주어집니다. 길이·끝 방향·앞머리·부피·묶음·가르마를 정해 주문대로 보이게 만듭니다. 가르마는 이마 선보다 뒤, 부피는 1cm 이상이어야 '바르게 씌운 가발'입니다.",
            '<label>주문 인상 <select name="order"><option value="lively">활발하게</option><option value="calm">차분하게</option><option value="neat">단정하게</option><option value="mystic">신비롭게</option><option value="glam">화려하게</option></select></label>',
            rg("길이(0 짧음 ~ 10 허리)", "len", 0, 10, 4) + '<label>끝 방향 <select name="end"><option value="out">바깥으로 튐</option><option value="in">안으로 말림</option><option value="flat">일자</option></select></label>' + rg("앞머리 길이(10 = 한쪽 눈 가림)", "bang", 0, 10, 4) + rg("부피(cm)", "vol", 0, 4, 1.5, 0.5) + '<label>묶음 <select name="tie"><option value="none">풀기</option><option value="pony">포니테일</option><option value="half">반묶음</option></select></label>' + rg("가르마 시작(이마 선 기준 cm)", "part", -3, 5, 2) + rg("웨이브", "wave", 0, 10, 2),
            ["'활발하게' 주문 맞추기", "'신비롭게' 주문 맞추기", "'단정하게' 주문을 가르마 2cm 이상 뒤·부피 1cm 이상으로 맞추기"],
            [("01_hair_frame.html#s1", "1부 1단계 이마 선·가르마"), ("01_hair_frame.html#s2", "1부 2단계 부피"), ("01_hair_frame.html#s3", "1부 3단계 길이와 끝"), ("02_hair_bundles.html#s3", "2부 3단계 묶은 머리")])
    s += sc("wind", "바람 터널 — 날리는 가발 맞추기", "바람은 주어집니다. 가발 길이와 뻣뻣함, 젖음을 정해 장면에 맞게 날리게 합니다. 끝 이동은 털끝이 뿌리에서 옆으로 움직인 거리입니다.",
            rg("바람 세기", "wind", 0, 5, 2, 0.5),
            rg("가발 길이(cm)", "len", 10, 60, 40, 10) + rg("뻣뻣함", "stiff", 0, 10, 3) + '<label><input type="checkbox" name="wet"> 젖은 머리</label>',
            ["바람 3 이상에서 끝 이동 25 이상 만들기(긴 머리가 크게 날림)", "바람 3 이상에서 뻣뻣함만 올려 끝 이동을 12 미만으로 줄이기", "젖은 머리를 켜고 바람 2 이상에서 끝 이동 10 미만 만들기"],
            [("04_hair_motion.html#s1", "4부 1단계 바람"), ("04_hair_motion.html#s3", "4부 3단계 손과 물"), ("05_ai_vfx.html#s3", "5부 3단계 가이드 가닥")])
    s += sc("workshop", "머리 문장 공방 — 요청서 조립", "요청 상황에 맞춰 머리 문장을 조립합니다. 여덟 조각을 채우고, 상황에 꼭 필요한 조각을 넣습니다.",
            '<label>요청 상황 <select name="job"><option value="swap">가발 바꿔 씌우기(고정·길이 중요)</option><option value="wind">바람 장면(움직임·다발 중요)</option><option value="manga">흑백 만화(색·윤기 중요)</option></select></label>',
            '<div class="ow" style="width:100%"></div>',
            ["점검표 8 / 8 채우기", "바람 장면에서 '움직임'에 바람을 고르고 '다발'을 채우기", "흑발 + 윤기 띠를 골라 문장에 'band'가 들어가는지 확인"],
            [("05_ai_vfx.html#s1", "5부 1단계 머리 문장"), ("05_ai_vfx.html#s2", "5부 2단계 가림 영역")],
            '<div class="promptbox"><b>조립된 머리 문장</b><pre aria-live="polite"></pre><button type="button" class="btn copy">복사하기</button></div>')
    s += sc("desk", "진단 데스크 — 원인 맞히기", "머리카락 그림 실패의 증상이 하나씩 들어옵니다. 원인을 고르세요. 순서: 뼈대 → 다발·흐름 → 색·윤기 → 움직임 → 고정·가림 영역.",
            '<span class="hint">환경: 증상은 무작위로 들어옵니다.</span>',
            '<div style="width:100%"><p class="sym" style="font-weight:600"></p><div class="opts deskopts"></div></div>',
            ["3개 연속 정답", "8종 원인을 모두 한 번 이상 맞히기", "틀리지 않고 5개 맞히기"],
            [("06_failure_lab.html#s1", "6부 진단 순서"), ("06_failure_lab.html#fails", "6부 실패 8종")])
    s += f"""</div></section>
<section id="wrap"><div class="wrap"><h2>마무리 — 네 작업장을 하나로 묶으면</h2>
<div class="box"><p>미용실에서 정한 길이·끝·부피·가르마는 머리 문장의 '길이'·'앞머리'·'가르마'·'부피' 조각이 되고, 바람 터널의 값은 '움직임' 조각과 VFX 가이드 가닥 값이 됩니다. 진단 데스크에서 틀린 원인은 대부분 앞의 세 곳 중 하나가 빠진 경우입니다. 머리카락 그림은 결국 <b>어디서 나서(이마 선·가르마), 얼마나 쌓여(부피·다발), 어디로 흐르고 움직이는가(묶은 점·바람·무게)</b>의 기록입니다.</p>
<p><b>실제 그림으로 이어 가기</b> — 머리 문장 공방에서 조립한 문장을 복사해 그림 생성 AI에 넣어 보세요. 가발만 바꿀 때는 부분 수정(영역 칠하기) 기능으로 머리만 칠합니다. 결과는 각 부의 '프롬프트로 직접 만들어 보기' 확인표로 점검합니다: <a href="{pre}01_hair_frame.html#make">1부</a> · <a href="{pre}02_hair_bundles.html#make">2부</a> · <a href="{pre}03_hair_color.html#make">3부</a> · <a href="{pre}04_hair_motion.html#make">4부</a> · <a href="{pre}05_ai_vfx.html#make">5부</a> · <a href="{pre}06_failure_lab.html#make">6부</a></p>
<p class="hint">주의할 점: 이 연습장의 인상 판정·끝 이동·가닥 계산은 원리를 보이기 위해 크게 단순화한 규칙입니다. 숫자는 교육용 예시이며, 실제 그림과 도구의 값과 다릅니다.</p></div>
<div class="next"><a href="{pre}06_failure_lab.html">← 6부 실패 사례 실험실</a><a href="{pre}index.html">목차로</a></div></div></section>
"""
    s += kg_block("practice_index", ["practice/index.html"])
    s += footer(pre)
    open(os.path.join(ROOT, "practice", "index.html"), "w").write(s)

if __name__ == "__main__":
    JS = ["js_base.js", "js_hair.js", "js_parts.js", "js_practice_util.js", "js_practice.js", "js_tail.js"]
    open(os.path.join(ROOT, "assets", "panels.js"), "w").write("".join(open(os.path.join(ROOT, "build", f)).read() for f in JS))
    build_index()
    for P in PARTS:
        build_part(P)
    build_practice()
    print("built", len(PARTS) + 2, "pages")


# ── 분야 뼈대 다시 걸기 (kg/rehang.json, ai-lab-retrofit 15장) ──
# 빌드가 페이지를 다시 쓴 뒤, 덧씌우기를 kg-raw·kg-ld에 다시 적용한다. 파일이 없으면 아무것도 하지 않는다.
if __name__ == "__main__":
    import os as _os, sys as _sys, subprocess as _sp
    _r = _os.path.dirname(_os.path.abspath(__file__))
    for _i in range(3):
        if _os.path.exists(_os.path.join(_r, "kg", "rehang.json")): break
        _r = _os.path.dirname(_r)
    if _os.path.exists(_os.path.join(_r, "kg", "rehang.json")):
        _sp.run([_sys.executable, _os.path.join(_r, "kg", "rehang.py"), "apply", _r])
