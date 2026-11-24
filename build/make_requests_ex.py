# -*- coding: utf-8 -*-
"""부마다 '프롬프트 연습 문제' 예상 결과 그림 요청 꾸러미(docs/image_requests_ex) 생성. python3 build/make_requests_ex.py"""
import os, csv, sys
sys.path.insert(0, os.path.dirname(__file__))
from make_requests import CONV_EX, HEAD_ANI
from content_ex import EX
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, "docs", "image_requests_ex")
os.makedirs(os.path.join(D, "prompts"), exist_ok=True)
TITLE = {x["key"]: (no, i, x["title"]) for no, xs in EX.items() for i, x in enumerate(xs, 1)}
rows = []; n = 0
for cid, name, ratio, att, items in CONV_EX:
    md = f"# {cid} · {name}\n\n**첨부할 참고 그림:** {att}\n**비율:** {ratio}\n\n**Genspark에 먼저 붙여 넣기 ↓**\n```\n{HEAD_ANI}\n```\n"
    for j, it in enumerate(items, 1):
        n += 1; no, i, t = TITLE[it[0]]
        r = "2:3" if "vertical 2:3" in it[4].split("\n")[0] else "16:9"
        rows.append([n, cid, it[0], f"{no}부 연습 {i} · {t}", r, ""])
        md += f"\n---\n## {j}) {it[0]} — {no}부 연습 {i} · {t} ({r})\n**설명:** {it[3]}\n```\n{it[4]}\n```\n"
    open(os.path.join(D, "prompts", f"{cid}.md"), "w").write(md)
with open(os.path.join(D, "checklist.csv"), "w", newline="") as f:
    w = csv.writer(f); w.writerow(["order", "conversation", "file", "what", "ratio", "status"]); w.writerows(rows)
open(os.path.join(D, "README.md"), "w").write(f"""# 그림 요청 꾸러미 3 — 부마다 '프롬프트 연습 문제' 예상 결과 ({n}장)

1~6부의 연습 문제 2개씩(모두 {n}개)에 들어갈 예상 결과 그림입니다. Genspark 대화 하나 = 프롬프트 파일 하나(4장)입니다.

1. `prompts/E01~E03` 파일을 차례로 엽니다. 파일 맨 위의 참고 그림(`assets/refs/`)을 먼저 올리고, 안내 문장을 붙여 넣은 뒤 영어 프롬프트를 하나씩 넣습니다.
2. 하루가 나오는 그림은 가발 색이 무시되고 분홍 머리·번이 남기 쉽습니다. 그렇게 나오면 다시 만들어 주세요.
3. 저장 이름은 `checklist.csv`의 `file` 열 그대로(.png). 받은 그림은 `assets/img/{{이름}}.webp`로 넣고 `python3 build/build.py`를 다시 돌립니다.
4. 의도대로 나오지 않은 그림은 `build/content_ex.py`와 그림 설명을 실제 그림에 맞춰 고칩니다.
""")
print("ex images", n)
