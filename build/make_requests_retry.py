# -*- coding: utf-8 -*-
"""연습 문제 다시 시도 요청 꾸러미(docs/image_requests_ex_retry) 생성. python3 build/make_requests_retry.py"""
import os, csv, sys
sys.path.insert(0, os.path.dirname(__file__))
from make_requests import CONV_RETRY, PROMPTS, HEAD_ANI
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, "docs", "image_requests_ex_retry")
os.makedirs(os.path.join(D, "prompts"), exist_ok=True)
HEAD = HEAD_ANI + "\n- '[Attach the failed result …]'로 시작하는 프롬프트는 failed/ 폴더의 그 그림을 먼저 올리고, 적힌 것만 바꿔 줘. 그림 전체를 새로 만들거나 좌우를 뒤집지 말 것"
rows = []; n = 0
cid, name, ratio, att, items = CONV_RETRY[0]
md = f"# {cid} · {name}\n\n**첨부:** {att}\n\n**Genspark에 먼저 붙여 넣기 ↓**\n```\n{HEAD}\n```\n"
for j, it in enumerate(items, 1):
    n += 1; base = it[0].replace("_retry", ""); r = "2:3" if "vertical 2:3" in it[4] else ("1차 결과와 같게" if it[4].startswith("[Attach") else "16:9")
    how = "1차 결과를 첨부하고 같은 그림에서 일부만 바꾸기(같은 대화가 아니어도 됨)" if it[4].startswith("[Attach") else "새 대화에서 처음부터 만들기(참고 그림만 첨부)"
    rows.append([n, cid, it[0], it[2], r, ""])
    md += f"\n---\n## {j}) {it[0]} — {it[2]}\n**1차 결과(첨부용):** failed/{base}.png\n**방법:** {how}\n**설명:** {it[3]}\n```\n{it[4]}\n```\n"
miss = PROMPTS["ex5_1_sia_silver_inpaint"]; n += 1
rows.append([n, cid, miss[0], "5부 연습 1(지난번에 받지 못한 그림)", "16:9", ""])
md += f"\n---\n## {len(items)+1}) {miss[0]} — 5부 연습 1 · 지난번 꾸러미에서 받지 못한 그림\n**첨부:** refs/sia_anime_base.png\n**방법:** 새 대화에서 처음부터 만들기(원래 프롬프트 그대로)\n```\n{miss[4]}\n```\n"
open(os.path.join(D, "prompts", f"{cid}.md"), "w").write(md)
with open(os.path.join(D, "checklist.csv"), "w", newline="") as f:
    w = csv.writer(f); w.writerow(["order", "conversation", "file", "what", "ratio", "status"]); w.writerows(rows)
open(os.path.join(D, "README.md"), "w").write(f"""# 그림 요청 꾸러미 4 — 연습 문제 다시 시도 ({n}장)

1차 결과가 의도와 다르게 나온 연습 문제 6개를 다시 만들고, 지난번에 받지 못한 5부 연습 1 그림 1장을 함께 요청합니다.
성공한 1차 결과는 그대로 두고, 실패한 1차 결과는 페이지에 '1차 결과'로 남긴 채 '다시 시도 결과'를 옆에 더합니다.

1. `prompts/R01_ex_retry.md`를 엽니다. 맨 위 안내 문장을 먼저 붙여 넣습니다.
2. '[Attach the failed result …]'로 시작하는 프롬프트는 `failed/` 폴더의 해당 그림(1차 결과)을 먼저 올리고 넣습니다. 3부 연습 2(역광)와 5부 연습 1은 새 대화에서 처음부터 만듭니다.
3. 저장 이름은 `checklist.csv`의 `file` 열 그대로(.png). 그래도 차이가 약하면 두세 번 만들어 가장 나은 것을 골라 주세요.
""")
print("retry images", n)
