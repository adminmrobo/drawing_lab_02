# -*- coding: utf-8 -*-
"""금지어 세 개가 결과물에 0건인지 확인. 낱말 자체를 파일에 적지 않으려고 글자 번호로 적는다. python3 build/check_banned.py"""
import os, glob, sys
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
BAN = ["".join(map(chr, w)) for w in ([52856], [49324, 45796, 47532], [44288, 53685])]
files = glob.glob(os.path.join(ROOT, "*.html")) + glob.glob(os.path.join(ROOT, "practice", "*.html")) + glob.glob(os.path.join(ROOT, "docs", "**", "*.md"), recursive=True) + [os.path.join(ROOT, "README.md")] + glob.glob(os.path.join(ROOT, "build", "*.*"))
bad = 0
for f in files:
    if f.endswith((".pyc",)) or not os.path.isfile(f): continue
    t = open(f, encoding="utf-8", errors="ignore").read()
    for w in BAN:
        n = t.count(w)
        if n: bad += n; print("XX", os.path.relpath(f, ROOT), "금지어", n, "건")
print("금지어 0건" if not bad else f"금지어 {bad}건"); sys.exit(1 if bad else 0)
