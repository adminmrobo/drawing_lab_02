# 그림 요청 꾸러미 1 — 표지·본문·실패 그림 (37장)

## 요청 순서 (Genspark 대화 하나 = 파일 하나)
1. `prompts/C01_covers_A.md` — 표지 A (픽셀아트, 16:9) (4장) · 첨부: refs 전부
2. `prompts/C02_covers_B.md` — 표지 B (픽셀아트, 16:9) (4장) · 첨부: refs 전부 + C01에서 받은 cover_index
3. `prompts/C03_part1_frame.md` — 1부 머리 모양의 뼈대 (4장) · 첨부: refs/haru_anime_base.png, refs/haru_sheet.png
4. `prompts/C04_part2_bundles.md` — 2부 다발과 흐름 (4장) · 첨부: refs/sia_anime_base.png, refs/sia_sheet.png
5. `prompts/C05_part3_color.md` — 3부 색과 윤기 (4장) · 첨부: refs/moa_anime_base.png, refs/moa_sheet.png, refs/doctor_sheet.png
6. `prompts/C06_part4_motion.md` — 4부 움직이는 머리카락 (4장) · 첨부: refs/haru_anime_base.png, refs/doctor_sheet.png
7. `prompts/C07_part5_inpaint.md` — 5부 가림 영역 (1장) · 첨부: refs/haru_anime_base.png
8. `prompts/C08_part5_styles.md` — 5부 화풍 4종(시아) (4장) · 첨부: refs/sia_anime_base.png, refs/sia_sheet.png
9. `prompts/C09_fail.md` — 6부 실패 8종 (8장) · 첨부: 해당 캐릭터의 refs/*_anime_base.png (박사는 refs/doctor_sheet.png)

## 저장 이름
`checklist.csv`의 `file` 열 이름 그대로(png·jpg). 받은 그림은 `assets/img/{이름}.webp`로 넣고 `python3 build/build.py`, 표지는 `python3 build/make_og.py`까지 다시 돌립니다.

## 주의
- 표지 8장은 16비트 RPG풍 픽셀아트, 본문은 애니풍(5부 4단계만 네 화풍, 3부 4단계는 흑백 만화풍).
- 참고 그림은 `assets/refs/`(앞 시리즈에서 확정한 기준 전신·설정 시트)를 매번 첨부합니다.
- 실사풍은 캐릭터를 코스프레한 가상의 성인 모델입니다. 실존 인물과 닮으면 다시 만듭니다.
