# 그림 요청 꾸러미 2 — '직접 만들어 보기' 비교 그림 (11장)

꾸러미 1(본문 그림)을 받은 뒤 진행합니다. 각 실습의 A 결과 그림을 첨부하고, B 문장('Same image. Change only: …')만 바꿔 만듭니다.
가발만 바꾸는 실습(5부·6부 f8)은 그림 생성이 아니라 도구의 '부분 수정(영역 칠하기)' 기능으로 합니다.

저장 이름은 `checklist.csv`의 `file` 열 그대로. 받은 그림은 `assets/img/{이름}.webp`로 넣고 `python3 build/build.py`를 다시 돌린 뒤,
`build/content_make.py`의 res(실제 결과)에 A·B를 비교해 실제로 달라진 점을 적습니다.
