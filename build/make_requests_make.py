# -*- coding: utf-8 -*-
"""'프롬프트로 직접 만들어 보기'의 B 결과 그림 요청 꾸러미(docs/image_requests_make) 생성. python3 build/make_requests_make.py"""
import os, csv, sys
sys.path.insert(0, os.path.dirname(__file__))
from content_make import MAKE
from make_requests import PROMPTS, ATTACH_OF, CONV_OF
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, "docs", "image_requests_make")
os.makedirs(os.path.join(D, "prompts"), exist_ok=True)
HEAD = ("해설 페이지의 '직접 만들어 보기' 비교 그림을 만들어 줘.\n- 첨부한 그림(이미 만든 A 결과)과 똑같은 캐릭터·구도·화풍·빛을 유지하고, 아래 'Change only'에 적힌 것만 바꿀 것\n"
        "- 비율은 첨부한 A 결과와 같게\n- 등장인물은 모두 20대 성인(박사는 성인 남성). 노출·교복 느낌 금지\n- 그림 안에 글자·숫자·로고 금지")
rows = []; n = 0
for no in sorted(MAKE):
    md = f"# M0{no} · {no}부 '직접 만들어 보기' 비교 그림\n\n**Genspark에 먼저 붙여 넣기 ↓**\n```\n{HEAD}\n```\n"; cnt = 0
    for t in MAKE[no]:
        for k in t["b_imgs"]:
            if k in PROMPTS:
                continue
            n += 1; cnt += 1
            a = PROMPTS[t["key"]]; ratio = "16:9" if "16:9" in a[4].split("\n")[0] else "2:3"
            if t["b_text"].startswith("("):
                how = "그림 생성이 아니라 '부분 수정(영역 칠하기)' 기능으로. 원본은 A 결과(" + t["key"] + ")"
                att = t["key"] + ".png (A 결과)"
            else:
                how = "A 결과를 만든 같은 대화에 이어서(차이가 약하면 새 대화에서 A 결과를 첨부하고 처음부터)"
                att = t["key"] + ".png (A 결과) + " + ATTACH_OF[CONV_OF[t["key"]]]
            rows.append([n, f"M0{no}", k, f"{no}부 실습 · {t['title']}", ratio, ""])
            md += f"\n---\n## {cnt}) {k} — {t['title']}\n**첨부:** {att}\n**방법:** {how}\n```\n{t['b_text']}\n```\n"
    if cnt:
        open(os.path.join(D, "prompts", f"M0{no}_part{no}.md"), "w").write(md)
with open(os.path.join(D, "checklist.csv"), "w", newline="") as f:
    w = csv.writer(f); w.writerow(["order", "conversation", "file", "what", "ratio", "status"]); w.writerows(rows)
open(os.path.join(D, "README.md"), "w").write(f"""# 그림 요청 꾸러미 2 — '직접 만들어 보기' 비교 그림 ({n}장)

꾸러미 1(본문 그림)을 받은 뒤 진행합니다. 각 실습의 A 결과 그림을 첨부하고, B 문장('Same image. Change only: …')만 바꿔 만듭니다.
가발만 바꾸는 실습(5부·6부 f8)은 그림 생성이 아니라 도구의 '부분 수정(영역 칠하기)' 기능으로 합니다.

저장 이름은 `checklist.csv`의 `file` 열 그대로. 받은 그림은 `assets/img/{{이름}}.webp`로 넣고 `python3 build/build.py`를 다시 돌린 뒤,
`build/content_make.py`의 res(실제 결과)에 A·B를 비교해 실제로 달라진 점을 적습니다.
""")
print("B images", n)
