# M06 · 6부 '직접 만들어 보기' 비교 그림

**Genspark에 먼저 붙여 넣기 ↓**
```
해설 페이지의 '직접 만들어 보기' 비교 그림을 만들어 줘.
- 첨부한 그림(이미 만든 A 결과)과 똑같은 캐릭터·구도·화풍·빛을 유지하고, 아래 'Change only'에 적힌 것만 바꿀 것
- 비율은 첨부한 A 결과와 같게
- 등장인물은 모두 20대 성인(박사는 성인 남성). 노출·교복 느낌 금지
- 그림 안에 글자·숫자·로고 금지
```

---
## 1) f2_fixed — 헬멧 가발 고치기
**첨부:** f2_flat_helmet.png (A 결과) + 해당 캐릭터의 refs/*_anime_base.png (박사는 refs/doctor_sheet.png)
**방법:** A 결과를 만든 같은 대화에 이어서(차이가 약하면 새 대화에서 A 결과를 첨부하고 처음부터)
```
Same character and pose as the attached failure image. Change only: natural volume, the hair sits slightly away from the scalp, rounded crown. Keep her face and the white ribbon over her LEFT ear. Still no text.
```

---
## 2) f8_fixed — 얼굴이 바뀐 가발 고치기
**첨부:** f8_wig_changed_face.png (A 결과)
**방법:** 그림 생성이 아니라 '부분 수정(영역 칠하기)' 기능으로. 원본은 A 결과(f8_wig_changed_face)
```
(부분 수정 기능에서) 머리카락만 칠하고 얼굴·눈썹·눈은 비운 채 아래 문장을 넣는다:
waist-length soft wavy light brown wig, keep her face, big bright blue eyes and expression unchanged, adult woman in her early twenties.
```
