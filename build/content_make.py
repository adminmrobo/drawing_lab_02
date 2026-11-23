# -*- coding: utf-8 -*-
"""부마다 '프롬프트로 직접 만들어 보기' 실습. A 프롬프트는 make_requests.py(이 페이지 그림을 실제로 만든 프롬프트)에서 가져온다.
B 결과 그림이 아직 없으므로 res(실제 결과)는 그림이 들어온 뒤 채운다."""

def T(key, title, goal, b_title, b_text, check, tip=None, img=None, b_imgs=None, res=None):
    return dict(key=key, title=title, goal=goal, b_title=b_title, b_text=b_text, check=check, tip=tip, img=img or key,
                b_imgs=[key + "_b"] if b_imgs is None else b_imgs, res=res or WAIT)

WAIT = "실제 결과: 그림이 들어오면 A와 B를 나란히 보고 무엇이 달라졌는지(또는 달라지지 않았는지) 여기에 적습니다. 지금은 위 확인표로 직접 만들어 비교해 보세요."

MAKE = {
1: [
 T("p1_haru_wig_off", "가발을 벗기고 안내선 긋기", "가발 아래 머리 원형에 가운데 선·이마 선·가르마 시작점이 보이는 그림을 만들어, '가르마는 이마 선 뒤'를 눈으로 확인합니다.",
   "B — 원리 빼기: 가르마를 눈썹 위에서 시작", "Same image. Change only: on the right side, draw the parting line starting right above the eyebrows, crossing the forehead. Keep the same framing. Still no text.",
   [("A의 가르마 시작점이 이마 선 뒤에 있나", "#s1"), ("B에서 이마가 갈라진 것처럼 보이나", "#s1"), ("하루의 파란 눈과 얼굴이 두 그림에서 같은가", None)]),
 T("p1_haru_volume_compare", "헬멧 단발과 부피 있는 단발", "같은 하루, 같은 단발에서 부피만 바꿔 실루엣이 얼마나 달라지는지 봅니다.",
   "B — 원리 빼기: 부피 낱말 지우기", "Same image. Change only: make both bobs identical; do not mention volume or how far the hair sits from the scalp. Keep the same framing. Still no text.",
   [("A의 오른쪽 단발이 왼쪽보다 한 둘레 큰가", "#s2"), ("B에서 두 단발이 구별되지 않는지 확인", "#s2"), ("얼굴 크기가 두 그림에서 같은가", None)]),
],
2: [
 T("p2_sia_bundles", "덩어리 → 속 선 → 가는 털", "다발로 잡은 머리와 선을 더해 가는 단계를 실제 그림으로 봅니다.",
   "B — 원리 빼기: 한 올씩 그리게 하기", "Same image. Change only: in all three panels, draw every single hair strand as a separate thin line, with no grouped locks. Keep the same framing. Still no text.",
   [("A의 왼쪽 그림에 다발 덩어리가 10~15개 보이나", "#s1"), ("B가 철사 뭉치처럼 보이는지(6부 f3)", "06_failure_lab.html#f3_wire"), ("시아의 회색 눈과 은색 귀걸이가 남아 있나", None)]),
 T("p2_sia_ponytail", "묶은 점으로 모이는 포니테일", "이마와 옆머리의 다발이 묶은 점으로 모이는지 실제 그림으로 확인합니다.",
   "B — 원리 빼기: 모이는 결 문장 빼기", "Same image. Change only: remove any pulled-back tension; the hair on top falls loosely downward and the ponytail is simply attached at the back. Keep the same framing. Still no text.",
   [("A에서 이마 선의 다발이 묶은 점을 향하나", "#s3"), ("B가 꼬리를 나중에 붙인 것처럼 보이나(6부 f4)", "06_failure_lab.html#f4_pony"), ("시아가 20대 성인으로 보이나", None)]),
],
3: [
 T("p3_moa_wig_colors", "가발 네 색을 흑백으로", "컬러 가발 네 개가 흑백 만화 톤에서도 구별되는지 봅니다.",
   "B — 원리 빼기: 흑백 줄을 모두 같은 회색으로", "Same image. Change only: in the bottom manga row, fill all four wigs with the same medium gray screentone. Keep the same framing. Still no text.",
   [("A 아랫줄에서 붉은 머리가 진한 회색, 금발이 거의 흰색인가", "#s1"), ("B에서 네 가발이 구별되지 않는지 확인", "#s1"), ("모아의 왼쪽 귀 위 흰 리본이 네 컷 모두 같은 쪽인가", None)]),
 T("p3_moa_shine_band", "흐름을 가로지르는 윤기 띠", "흑발 가발의 윤기를 띠로 넣었을 때와 세로 줄로 넣었을 때를 비교합니다.",
   "B — 원리 바꾸기: 윤기를 흐름과 나란히", "Same image. Change only: draw the hair highlights as thin vertical white lines running along each strand instead of a band across the head. Keep the same framing. Still no text.",
   [("A의 윤기 띠가 머리 둘레를 감나", "#s2"), ("B가 플라스틱 줄무늬처럼 보이나(6부 f5)", "06_failure_lab.html#f5_shin"), ("띠 높이가 빛 방향(위)과 맞나", "#s2")]),
],
4: [
 T("p4_haru_wind", "바람 하나, 앞머리까지", "바람 방향 하나에 모든 다발이 맞는지 실제 그림으로 봅니다.",
   "B — 원리 빼기: 앞머리 문장 빼기", "Same image. Change only: only the long back hair blows to the right; the bangs stay still or fall to the left. Keep the same framing. Still no text.",
   [("A에서 앞머리·옆머리·뒷머리가 모두 같은 쪽으로 날리나", "#s1"), ("B에서 바람이 둘처럼 보이는지(6부 f6)", "06_failure_lab.html#f6_wind"), ("털끝이 뿌리보다 많이 움직였나", "#s2")]),
 T("p4_haru_emotion_hair", "감정 네 가지와 머리카락", "같은 가발로 기쁨·분노·놀람·실망을 연기할 때 머리카락도 함께 연기하는지 봅니다.",
   "B — 원리 빼기: 머리카락 문장 빼기", "Same image. Change only: keep the facial expressions, but the hair stays exactly the same calm shape in all four panels. Keep the same framing. Still no text.",
   [("A의 분노 컷에서 머리가 아래쪽부터 위로 솟았나", "#s4"), ("B에서 감정이 얼굴에만 머물러 약해 보이는지 확인", "#s4"), ("과장이 애니풍에 맞는 세기인가", "05_ai_vfx.html#s4")]),
],
5: [
 T("p5_haru_wig_inpaint", "부분 수정으로 가발만 바꾸기", "그림 생성 도구의 부분 수정(영역 칠하기) 기능으로 얼굴은 두고 머리만 바꿉니다.",
   "B — 가림 영역을 지금 머리에만 딱 맞게", "(부분 수정 기능에서) 원래 짧은 단발 머리만 딱 맞게 칠하고, 어깨는 칠하지 않은 채 아래 문장을 넣는다:\nwaist-length soft wavy light brown wig, natural volume, keep her face, big bright blue eyes and expression unchanged.",
   [("A에서 긴 가발이 어깨까지 자연스럽게 내려왔나", "#s2"), ("B에서 가발이 칠한 영역 끝에서 잘린 듯 끝나는지 확인", "#s2"), ("하루의 파란 눈이 그대로인가(바뀌면 6부 f8)", "06_failure_lab.html#f8_wig_")],
   tip="옷만 바꾸는 실습처럼, 머리만 바꾸는 실습도 설명용 그림이 아니라 도구의 부분 수정 기능으로 합니다."),
 T("p5_sia_anime", "같은 가발, 화풍만 바꾸기", "말린 금발 가발을 쓴 시아를 애니풍에서 픽셀아트로 바꿔, 원리(원기둥 축·윤기 띠 높이)는 그대로인지 봅니다.",
   "B — 화풍 조각만 바꾸기", "Same image. Change only: redraw in 16-bit pixel art with clearly visible square pixels and only 3 to 5 large hair locks; keep the curl axis, the highlight band height, the pose and the outfit. Keep the same framing. Still no text.",
   [("B의 다발 수가 3~5개로 줄었나", "#s4"), ("말린 머리의 원기둥 축과 윤기 띠 높이가 A와 같은가", "02_hair_bundles.html#s4"), ("시아의 회색 눈이 그대로인가", "#s1")],
   b_imgs=["p5_sia_pixel"]),
],
6: [
 T("f2_flat_helmet", "헬멧 가발 고치기", "실패 그림 f2에 고치는 조각을 넣어 다시 만들고, 부피가 돌아왔는지 봅니다.",
   "B — 고치는 조각 넣기", "Same character and pose as the attached failure image. Change only: natural volume, the hair sits slightly away from the scalp, rounded crown. Keep her face and the white ribbon over her LEFT ear. Still no text.",
   [("B의 머리 실루엣이 A보다 한 둘레 커졌나", "01_hair_frame.html#s2"), ("얼굴 크기는 그대로인가", None), ("모아의 리본이 왼쪽 귀 위에 있나", None)],
   b_imgs=["f2_fixed"]),
 T("f8_wig_changed_face", "얼굴이 바뀐 가발 고치기", "실패 그림 f8을 가림 영역과 고정 조각으로 다시 만들어, 얼굴을 지키는지 봅니다.",
   "B — 가림 영역에서 얼굴을 빼고 고정 조각 넣기", "(부분 수정 기능에서) 머리카락만 칠하고 얼굴·눈썹·눈은 비운 채 아래 문장을 넣는다:\nwaist-length soft wavy light brown wig, keep her face, big bright blue eyes and expression unchanged, adult woman in her early twenties.",
   [("B의 눈 색이 하루의 파란색인가", "05_ai_vfx.html#s2"), ("얼굴형이 원래 하루와 같은가", "05_ai_vfx.html#s1"), ("가발 경계가 어깨와 자연스럽게 이어지나", "05_ai_vfx.html#s2")],
   b_imgs=["f8_fixed"]),
],
}
