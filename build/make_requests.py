# -*- coding: utf-8 -*-
"""Genspark 그림 요청 꾸러미(docs/image_requests) 생성. python3 build/make_requests.py
PROMPTS의 프롬프트는 각 부 '프롬프트로 직접 만들어 보기'의 A 프롬프트로도 그대로 쓰인다."""
import os, csv
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
D = os.path.join(ROOT, "docs", "image_requests")
PIX = "Art style (required, always): 16-bit RPG style pixel art with clearly visible square pixels, limited palette, bold dark outline, 2–3 tone shading, small highlights; no smooth gradients, no painterly, vector, watercolor or 3D look.\nMatch the characters' proportions and colors of the attached reference images exactly, drawn in this same pixel-art style.\nBright daytime laboratory mood, soft natural sunlight through large windows, clean white walls, light lavender, mint and pink accents."
ANI = "Art style: high-quality anime illustration, clean confident lineart, two-tone cel shading, natural adult proportions.\nMatch the attached reference images exactly (face, hair, colors, accessories). All characters are adults in their early twenties (the Professor is an adult man in his thirties, normal proportions, not chibi); modest outfits exactly as described."
END = "No text, no letters, no numbers, no speech bubbles, no logos, no watermark, no revealing clothing, not childlike, no school uniform, not resembling any famous anime character."
ENDC = "No text, no letters, no numbers, no logos, no weapons, no cigarettes, no alcohol, no blood, no real brands."
SAFE = "Composition: every face and hand inside the central safe area (12% margin left and right, 10% top, 18% bottom); bottom-left corner plain and bright."
CH = {
 "haru": "Haru (adult lab assistant, long straight pink hair with navy streaks and a thick navy streak down the center of the bangs, two round hair buns on top, small ahoge, big blue eyes)",
 "sia": "Sia (adult maid intern, long straight jet-black hair, no headdress, gray eyes, small silver earrings)",
 "moa": "Moa (adult maid intern, long ash-beige wavy hair, white frilled maid headband with a white ribbon over her LEFT ear, amber eyes)",
 "doctor": "the Professor (adult male scientist, dark charcoal spiky hair with a white streak at the front, very thick black eyebrows, teal rectangular glasses)",
 "fly": "the Fruit Fly researcher (tiny cartoon fruit fly, large red compound eyes, retro dark blue helmet with a yellow-white stripe, colorful dangling cables, tiny white lab coat, translucent wings)",
 "bot": "AbaBot (boxy beige retro CRT-monitor robot, dark green screen face with mint pixel eyes, short antenna topped with a red-brown abacus bead, gray segmented arms, small tank treads)",
 "judges": "three small cute dark navy silhouette judges with white dot eyes (X1 with a pink side-ponytail bow, X2 with a beret and teal round glasses, X3 with a cat-ear hood and yellow pompoms) holding blank score paddles",
}
OUT = {"haru": "lavender hoodie with white drawstrings over a white t-shirt, open white knee-length lab coat, rolled-up jeans, lavender sneakers",
       "sia": "charcoal-black long-sleeved maid dress, large gray bow at the collar, long white frilled apron",
       "moa": "camel knit cardigan over a white blouse, red and navy plaid bow tie, white frilled apron, black skirt",
       "doctor": "white lab coat over a black vest, white shirt and black tie"}
def who(k, outfit=None): return CH[k] + ", wearing " + (outfit or OUT[k])
def cover(file, page, part, alt, scene, chars, meta, mood):
    p = f"Website top cover illustration, wide 16:9.\n{PIX}\nScene: {scene}\nCharacters:\n  " + ";\n  ".join(chars) + f".\nVisual metaphor: {meta}\n{SAFE}\nMood: {mood}\n{ENDC}"
    return (file, page, part, alt, p, "pixel")
def body(file, page, part, alt, ratio, scene, extra=""):
    p = ("Illustration, " + ("vertical 2:3." if ratio == "2:3" else "wide 16:9.") + f"\n{ANI}\n{scene}\n" + (extra + "\n" if extra else "") + "Plain off-white studio background or a bright clean lab interior.\n" + END)
    return (file, page, part, alt, p, "anime")


# ---- 변장(가발) 문장: 얼굴·눈 색·옷은 원래 캐릭터 그대로, 머리만 가발
KEEP = {"haru": "she keeps her own face, big bright blue eyes and outfit; the wig completely covers her usual pink hair, buns and navy streaks",
        "sia": "she keeps her own face, gray eyes, small silver earrings and outfit; the wig completely covers her usual jet-black hair",
        "moa": "she keeps her own face, amber eyes, outfit and the white frilled maid headband with the white ribbon over her LEFT ear placed on top of the wig",
        "doctor": "he keeps his own face, very thick black eyebrows, teal rectangular glasses and outfit; the wig completely covers his usual dark spiky hair"}
FACE = {"haru": "Haru (adult lab assistant in her early twenties, big bright blue eyes)", "sia": "Sia (adult maid intern in her early twenties, gray eyes, small silver earrings)",
        "moa": "Moa (adult maid intern in her early twenties, amber eyes)", "doctor": "the Professor (adult male scientist in his thirties, very thick black eyebrows, teal rectangular glasses)"}
def wig(k, desc, outfit=None): return FACE[k] + " wearing a wig: " + desc + "; " + KEEP[k] + ", wearing " + (outfit or OUT[k])
W_BOB = "a chin-length light chestnut-brown bob with straight bangs"
W_LONG = "a waist-length soft wavy light-brown wig"

C1 = [
 cover("cover_index", "index.html", "목차", "낮의 연구실 변장 파티 — 열린 가발 상자 앞에서 하루·시아·모아가 가발을 대 보고, 초파리와 주판봇이 이젤 앞에, 박사가 흰머리 가발을 들고, 평가단이 뒤에 앉은 장면",
   "a sunny corner of the laboratory turned into a costume dressing room: an open wooden trunk full of colorful wigs on stands (short bob, long wavy, ponytail, drill curls, white hair), a full-length mirror, two easels with canvases seen from the back.",
   [who("haru") + ", in the center holding a short brown bob wig above her head", who("sia") + ", on the left trying a blonde curly wig in front of the mirror", who("moa") + ", on the right holding a long black wig against herself",
    who("doctor") + ", at the back center holding a white-hair wig and smiling", CH["fly"] + ", on the far left facing right at the left easel", CH["bot"] + ", on the far right facing left at the right easel, wearing a tiny wig on its antenna", CH["judges"] + " sitting at a small table in the back right"],
   "a trunk of wigs — the same people, many different hairstyles.", "cheerful, playful costume-party mood."),
 cover("cover_01", "01_hair_frame.html", "1부 머리 모양의 뼈대", "하루가 짧은 단발 가발을 벗어 들고 있고, 옆의 마네킹 머리에 가운데 선과 이마 선이 그려져 있는 장면",
   "the lab drawing room with a white mannequin head on a stand, with a center line and a hairline drawn on it in blue.",
   [who("haru") + ", in the center holding a short brown bob wig in one hand", CH["fly"] + ", on the left facing right, pointing at the hairline on the mannequin head", CH["bot"] + ", on the right facing left, drawing only the outline of the wig on a canvas", who("doctor") + ", at the back nodding"],
   "a wig sits on top of a round head — head first, wig second.", "curious, friendly."),
 cover("cover_02", "02_hair_bundles.html", "2부 다발과 흐름", "시아가 거울 앞에서 포니테일 가발을 묶고, 주판봇이 머리카락을 한 올씩 세다 엉킨 실뭉치를 들고 있는 장면",
   "the lab mirror corner with a hair-tie on a tray and a tangled ball of thin threads.",
   [who("sia") + ", in the center tying a high ponytail wig, all locks pulled toward the tie", CH["fly"] + ", on the left facing right, holding three thick ribbon-like bundles", CH["bot"] + ", on the right facing left, tangled in a ball of thin threads", who("doctor") + ", at the back holding a comb"],
   "ribbons gathered into one point versus a tangled ball of thread.", "lively, funny."),
 cover("cover_03", "03_hair_color.html", "3부 색과 윤기", "모아가 금발·붉은 머리·은발·흑발 가발 네 개를 마네킹에 걸어 두고, 박사가 흰머리 가발을 쓰고 웃는 장면",
   "the lab dressing room with four wig stands in a row (blonde, red, silver, black) and a window light making a shiny band on the black wig.",
   [who("moa") + ", in the center pointing at the shiny highlight band on the black wig", wig("doctor", "short neat white hair with a few dark strands at the front") + ", on the right smiling", CH["fly"] + ", on the left facing right, holding a gray color card", CH["bot"] + ", at the back left painting all wigs the same gray"],
   "four colors, four different gray values.", "warm, bright."),
]
C2 = [
 cover("cover_04", "04_hair_motion.html", "4부 움직이는 머리카락", "하루가 긴 웨이브 가발을 쓰고 큰 선풍기 앞에 서서 머리가 한쪽으로 날리고, 박사가 젖은 머리를 수건으로 닦는 장면",
   "the lab wind tunnel corner with a large standing fan blowing from the left and a small water basin.",
   [wig("haru", W_LONG) + ", in the center, all her hair including the bangs blowing to the right", wig("doctor", "short dark hair, soaking wet and flattened") + ", on the right drying his hair with a towel", CH["fly"] + ", on the left facing right, holding an arrow sign showing the wind direction", CH["bot"] + ", at the back right holding its tiny wig as it flies away"],
   "one wind direction — every lock follows it.", "breezy, energetic."),
 cover("cover_05", "05_ai_vfx.html", "5부 AI와 VFX로 변장하기", "하루·시아·모아가 큰 모니터 앞에 서 있고, 화면에는 얼굴은 비우고 머리만 주황으로 칠한 그림과 가닥 선이 떠 있는 장면",
   "the lab control desk with a big monitor showing a simple portrait where only the hair area is highlighted in orange while the face is left clear, and a second monitor showing a few thick guide strands with many thin strands around them.",
   [who("haru") + ", in the center pointing at the orange hair area", who("sia") + ", on the left", who("moa") + ", on the right", CH["bot"] + ", typing at the desk", CH["fly"] + ", hovering near the monitor"],
   "change only the hair, keep the face.", "focused, gentle humor."),
 cover("cover_06", "06_failure_lab.html", "6부 실패 사례 실험실", "초파리가 돋보기를 들고 실패한 가발 그림 더미를 살펴보고, 주판봇이 머쓱하게 서 있는 장면",
   "the lab diagnosis room with a big desk covered with drawings of failed wigs (a helmet-like wig, a wig of tangled wire lines, a wig with vertical shiny stripes) and a five-step checklist board on the wall drawn only with simple icons.",
   [CH["fly"] + ", in the center facing right, inspecting a drawing with a large magnifying glass", CH["bot"] + ", on the right facing left, sheepishly holding a stack of drawings", who("doctor") + ", at the back with a clipboard", CH["judges"] + " peeking from behind the desk"],
   "finding where each failure first went wrong.", "detective, light-hearted."),
 cover("cover_07", "practice/index.html", "7부 실전 연습장", "연구실 미용실 의자, 바람 터널, 문장 공방 책상, 진단 데스크가 한 방에 있고 하루가 미용실 의자에 앉아 있는 장면",
   "a bright lab practice room with four corners: a salon chair with a mirror, a small fan tunnel, a writing desk with paper cards, and a diagnosis desk with a magnifying glass.",
   [who("haru") + ", sitting in the salon chair in the center, her own pink hair with buns", who("doctor") + ", standing behind her with a comb and scissors (closed)", CH["fly"] + ", on the left facing right near the fan tunnel", CH["bot"] + ", on the right facing left at the writing desk", CH["judges"] + " at the diagnosis desk in the back"],
   "four workshops in one room.", "busy, cheerful."),
]
C3 = [
 body("p1_haru_wig_off", "01_hair_frame.html", "1부 1단계", "하루가 벗은 짧은 단발 가발을 한 손에 들고 있고, 오른쪽에는 같은 하루의 머리 위에 파란 가운데 선과 이마 선, 주황 가르마 시작점이 그려진 비교 그림(머리 원형만 따로 그리지는 않고 하루의 원래 머리 위에 안내선을 얹음)", "16:9",
   "Two panels side by side of the same character, front view, head and shoulders.\nLeft: " + who("haru") + ", holding " + W_BOB + " wig in her right hand.\nRight: the same Haru as a simple drawing study: a smooth round head shape (hair drawn only as a faint light outline), with a thin blue center line, a blue hairline curve on the forehead, and a small orange dot where the hair parting starts, clearly BEHIND the hairline.",
   "Light from the upper left. The two faces are exactly the same size."),
 body("p1_haru_volume_compare", "01_hair_frame.html", "1부 2단계", "같은 하루가 두피에 딱 붙은 헬멧 같은 단발과, 머리 원형보다 한 겹 바깥에 부피를 둔 자연스러운 단발을 나란히 보여 주는 비교 그림", "16:9",
   "Two panels side by side, front view, head and shoulders, same pose and lighting.\nLeft: " + wig("haru", W_BOB + ", but drawn completely flat, hugging the skull like a swimming cap with no volume") + ".\nRight: " + wig("haru", W_BOB + " with natural volume: the hair sits slightly away from the scalp, rounded crown, soft outward silhouette") + ".",
   "The faces are exactly the same size; only the hair volume differs."),
 body("p1_haru_length_ends", "01_hair_frame.html", "1부 3단계", "하루가 다섯 가지 길이(아주 짧음·턱 길이·어깨 길이 바깥 튐·어깨 길이 안쪽 말림·긴 머리)로 바꾼 모습을 나란히 보여 주는 그림. 가발 색 대신 하루의 분홍 머리와 정수리 번이 그대로 남아 나옴", "16:9",
   "Five small panels in a row, head and shoulders, same pose: " + FACE["haru"] + " trying different wigs, keeping her own face, big bright blue eyes and lavender hoodie.\n1) a very short pixie wig showing the ears; 2) a chin-length bob covering the ears; 3) a shoulder-length wig with ends flipped OUTWARD (lively); 4) the same shoulder-length wig with ends curled INWARD (calm); 5) a long wig reaching below the shoulders, straight ends.",
   "Light from the upper left, consistent in all panels."),
 body("p1_haru_draw_steps", "01_hair_frame.html", "1부 4단계", "하루의 짧은 단발 가발을 다섯 단계로 그려 가는 과정을 왼쪽에서 오른쪽으로 나란히 놓은 그림, 단계마다 새로 더한 부분만 주황색 선", "16:9",
   "Five-step drawing process of " + wig("haru", W_BOB) + ", head and shoulders, front three-quarter view, shown as five panels from left to right on white paper.\n1) round head with a center line and hairline; 2) bangs added; 3) side locks in front of the ears added; 4) back hair with volume added; 5) clean line art with a few fine flyaway strands. In each panel, only the newly added lines are orange; earlier lines are black.",
   "Clean line-art study style with light cel shading only in panel 5."),
]
C4 = [
 body("p2_sia_bundles", "02_hair_bundles.html", "2부 1단계", "시아의 긴 흑발 생머리를 왼쪽은 덩어리(다발)만, 가운데는 다발 속 가는 선을 더한 것, 오른쪽은 다발에서 갈라진 가는 털까지 더한 완성으로 나란히 보여 주는 그림", "16:9",
   "Three panels side by side of " + who("sia") + ", upper body, front view, her own long straight jet-black hair.\nLeft: the hair drawn only as about twelve soft ribbon-like locks with clean outlines. Middle: the same locks with two or three fine strand lines inside each lock. Right: finished, with a few thin strands splitting off the locks.",
   "Same pose and light from the upper left in all three panels."),
 body("p2_sia_shoulder_contact", "02_hair_bundles.html", "2부 2단계", "시아가 고개와 어깨를 살짝 돌리고, 긴 흑발 일부가 한쪽 어깨 앞으로 넘어와 가슴 위로 흐르는 상반신 그림. 어깨 위에서 꺾이는 모습은 약하게 나옴", "2:3",
   "Upper body of " + who("sia") + ", her own long straight jet-black hair, turning her head and right shoulder slightly toward the viewer.\nThree locks of hair drape over the front of her right shoulder and bend along it, falling over her chest; the rest of the hair falls behind her shoulders, partly hidden by her neck and shoulders.",
   "Light from the upper left."),
 body("p2_sia_ponytail", "02_hair_bundles.html", "2부 3단계", "시아가 높게 묶은 포니테일 가발을 쓰고 옆으로 서서, 이마와 옆머리의 다발이 묶은 점으로 모였다가 꼬리로 퍼지는 모습이 보이는 그림", "2:3",
   "Side three-quarter view, upper body of " + wig("sia", "a high ponytail wig in dark chestnut brown, tied with a plain dark hair tie") + ".\nAll the hair from the hairline and the sides is pulled back toward the hair tie, with visible tension lines converging at the tie; the ponytail spreads out again below the tie and falls to the middle of her back.",
   "Light from the upper left. She looks like a calm adult woman."),
 body("p2_sia_curl_braid", "02_hair_bundles.html", "2부 4단계", "시아가 굵게 말린 금발 가발과 세 갈래로 땋은 갈색 가발을 번갈아 쓴 두 모습. 요청한 원기둥·마름모 안내선은 그려지지 않음", "16:9",
   "Two panels side by side, upper body, front view.\nLeft: " + wig("sia", "a long blonde wig with large spiral drill curls on both sides") + "; a faint orange cylinder guide with a spiral groove is overlaid on one curl.\nRight: " + wig("sia", "a dark brown wig with two loose three-strand braids over the shoulders") + "; a faint orange chain of soft diamond shapes is overlaid on one braid.",
   "Light from the upper left in both panels."),
]
C5 = [
 body("p3_moa_wig_colors", "03_hair_color.html", "3부 1단계", "모아가 밝은 금발(베이지에 가까움)·붉은 머리·은발·흑발 가발을 쓴 네 모습, 윗줄은 컬러, 아랫줄은 같은 그림을 흑백 만화 톤으로 바꾼 비교 그림", "16:9",
   "A grid of eight small head-and-shoulders portraits: top row in full color, bottom row the same four drawings in black-and-white manga style with screentones.\n" + FACE["moa"] + " wearing four shoulder-length wavy wigs: blonde, red, silver, black; " + KEEP["moa"] + ", wearing " + OUT["moa"] + ".\nIn the bottom row: red hair is a dark gray tone, blonde is almost white with tone only in the shadows, silver is white with fine lines, black is solid black with white highlight bands.",
   "Same pose and light from the upper left in all eight portraits."),
 body("p3_moa_shine_band", "03_hair_color.html", "3부 2단계", "모아가 긴 흑발 가발을 쓰고 위에서 빛을 받는 상반신 그림. 머리 둘레를 감는 윤기 띠는 약하게 퍼져 나와 또렷하지 않음", "2:3",
   "Upper body of " + wig("moa", "a long straight glossy black wig") + ".\nLight from above and slightly left. A single glossy white highlight band wraps around the head across the hair flow, about one third down from the top, broken slightly at each lock like a halo ring.",
   ""),
 body("p3_doctor_white_wig", "03_hair_color.html", "3부 3단계", "박사가 흰머리 가발을 쓰고 웃는 상반신 그림, 흰머리는 바깥 윤곽선과 흐름선만으로 그려지고 앞머리 일부에 짙은 머리가 남아 있는 그림", "2:3",
   "Upper body of " + wig("doctor", "a neat swept-back white-hair wig with a few dark strands left at the front") + ", smiling warmly.\nThe white hair is drawn with clean outlines and flow lines only, no hairline line, very light shading only inside the locks.",
   "Light from the upper left. He looks like a healthy man in his thirties wearing a costume wig."),
 body("p3_moa_black_wig", "03_hair_color.html", "3부 4단계", "모아가 굵은 웨이브 흑발 가발을 쓰고, 검게 칠한 머리에 흰 윤기 띠가 굽이마다 남아 있는 흑백 만화풍 상반신 그림", "2:3",
   "Black-and-white manga style illustration (ink and screentone), upper body of " + wig("moa", "a long black wig with large soft waves") + ".\nThe hair is filled solid black, with white glossy highlight bands left uncolored at each wave, about 15 percent of the hair area; fine white lines split the tips of the highlights.",
   ""),
]
C6 = [
 body("p4_haru_wind", "04_hair_motion.html", "4부 1단계", "하루가 허리까지 오는 긴 웨이브 가발을 쓰고 왼쪽에서 부는 바람을 맞아, 앞머리·옆머리·뒷머리가 모두 오른쪽으로 날리고 끝이 안쪽으로 모인 그림", "16:9",
   "Full body of " + wig("haru", W_LONG) + ", standing in a strong wind blowing from the left.\nAll the hair, including the bangs and side locks, blows to the right; the roots stay close to the head and the tips move the most, gathering softly inward. Her lab coat also flutters to the right.",
   "Light from the upper left."),
 body("p4_haru_turn_lag", "04_hair_motion.html", "4부 2단계", "하루가 긴 웨이브 가발을 쓰고 몸을 왼쪽으로 돌리는 동작을 세 장 연속으로 보여 주는 그림, 머리에 가까운 머리카락은 몸을 따라오고 끝은 늦게 따라와 둥글게 말린 모습", "16:9",
   "Three-frame sequence from left to right of " + wig("haru", W_LONG) + ", upper body, turning quickly to her left.\nFrame 1: starting the turn, hair still hanging straight. Frame 2: head turned, the hair near the head follows, the tips lag far behind. Frame 3: body stopped, the tips swing past and curl outward.",
   "Same lighting from the upper left in all frames."),
 body("p4_doctor_hand_wet", "04_hair_motion.html", "4부 3단계", "박사가 손으로 앞머리를 쓸어 올려 손가락 사이로 털이 튀어나온 모습과, 젖은 머리가 작은 다발로 갈라져 처진 모습을 나란히 보여 주는 상반신 그림", "16:9",
   "Two panels side by side, upper body of " + wig("doctor", "a medium-length dark brown wig", "white lab coat over a black t-shirt") + ".\nLeft: he sweeps his bangs up with his right hand; the hair under the hand stands up and short strands poke out between his fingers.\nRight: the same wig soaking wet after rain: flattened, separated into many thin clumps clinging to his forehead and neck, water dripping from the tips.",
   "Light from the upper left."),
 body("p4_haru_emotion_hair", "04_hair_motion.html", "4부 4단계", "긴 웨이브 가발을 쓴 하루가 기쁨·분노·놀람·실망 네 감정을 연기하는 그림, 감정마다 머리카락이 부풀고 솟고 튀고 처지는 모습", "16:9",
   "Four panels of " + wig("haru", W_LONG) + ", head and shoulders, manga-style exaggeration.\n1) joy: hair puffs out lightly and bounces; 2) anger: hair rises from the nape upward and spreads; 3) surprise: thin strands spring out in all directions; 4) disappointment: all tips droop downward and one single strand on top hangs limply.",
   "Same light from the upper left in all panels."),
]
C7 = [
 body("p5_haru_wig_inpaint", "05_ai_vfx.html", "5부 2단계", "하루의 원래 짧은 단발 그림, 머리와 어깨까지 반투명 주황으로 가린 그림(얼굴은 비움), 긴 웨이브 가발로 바뀐 결과의 세 단계 비교", "16:9",
   "Three panels side by side, upper body, identical pose.\n1) " + wig("haru", W_BOB) + ".\n2) the same image with the hair area and the shoulders covered by a semi-transparent orange overlay; the face, eyebrows and eyes are left clear.\n3) the result: the same Haru with " + W_LONG + " flowing over her shoulders; face, eyes and expression unchanged.",
   "Light from the upper left."),
]
STY = {"pixel": "Art style: detailed 16-bit SNES-era pixel art with clearly visible square pixels, limited palette, bold dark outline, 2–3 tone shading; the hair is only 3 to 5 large locks with one highlight row.",
       "anime": "Art style: high-quality anime illustration, clean lineart, two-tone cel shading; the hair is 8 to 15 locks with a few fine lines.",
       "semireal": "Art style: semi-realistic digital painting, soft painterly shading, realistic proportions; the hair is 20 to 40 locks with softer edges.",
       "photo": "Art style: realistic studio photograph of a fictional adult cosplayer in her twenties dressed as this character (not a real or famous person); realistic hair with fine flyaway strands."}
C8 = []
for k, nm in [("pixel", "픽셀아트"), ("anime", "애니풍"), ("semireal", "반실사"), ("photo", "실사풍")]:
    C8.append((f"p5_sia_{k}", "05_ai_vfx.html", "5부 4단계", f"말린 금발 가발을 쓴 시아의 {nm} 전신",
               "Character full body, vertical 2:3.\n" + STY[k] + "\n" + wig("sia", "a long blonde wig with large spiral drill curls on both sides") + ".\nPose: standing, three-quarter view, hands folded in front. Light from the upper left; the highlight band on the curls is about one third down from the top.\nPlain off-white studio background.\n" + END, k))
FAILNOTE = "This is an intentional FAILURE example for a teaching page: draw the mistake described below clearly and convincingly, while everything else stays correct."
def fail(file, alt, scene, mistake, ratio="2:3"):
    p = f"Illustration, {'vertical 2:3' if ratio == '2:3' else 'wide 16:9'}.\n{ANI}\n{FAILNOTE}\n{scene}\nIntentional mistake: {mistake}\nPlain off-white studio background.\n{END}"
    return (file, "06_failure_lab.html", "6부 실패", alt, p, "anime")
C9 = [
 fail("f1_part_in_front", "짧은 단발 가발을 쓴 하루의 가르마 선이 이마 선을 넘어 눈썹 바로 위까지 내려와, 이마에 금이 간 것처럼 보이는 실패 예시", "Head and shoulders of " + wig("haru", "a chin-length light brown bob with a center parting") + ".", "the center parting line runs all the way down across her forehead to just above the eyebrows, as if the forehead were split by a line."),
 fail("f2_flat_helmet", "모아의 가발이 머리 원형에 딱 붙어 부피가 없어, 머리가 작고 얼굴이 커 보이는 헬멧 같은 실패 예시", "Head and shoulders of " + wig("moa", "a shoulder-length ash-beige wig") + ".", "the wig hugs the skull exactly like a swimming cap with zero volume, so the head looks small and flat and the face looks too big."),
 fail("f3_wire_lines", "시아의 긴 흑발을 가는 선 수백 개로 한 올씩 그려 덩어리가 사라지고 철사 뭉치처럼 보이는 실패 예시", "Upper body of " + who("sia") + ", her own long jet-black hair.", "every single hair is drawn as a separate thin line, hundreds of lines with no grouped locks, so the hair looks like a tangle of gray wire."),
 fail("f4_pony_no_converge", "시아가 포니테일 가발을 썼는데 정수리와 옆머리는 풀린 생머리처럼 아래로 흐르고 꼬리만 뒤에 붙어 있는 실패 예시", "Side three-quarter view, upper body of " + wig("sia", "a dark chestnut-brown ponytail wig") + ".", "the hair on top and at the sides falls loosely straight down as if untied, and the ponytail is simply stuck on the back of the head with no hair pulled toward the tie."),
 fail("f5_shine_along", "모아의 흑발 가발에 흰 윤기 선이 머리 흐름과 나란히 세로로 그어져, 반짝이는 플라스틱 줄무늬처럼 보이는 실패 예시", "Upper body of " + wig("moa", "a long straight black wig") + ", light from above.", "the highlights are drawn as many thin vertical white stripes running along each strand instead of a band across the head, so the hair looks like striped plastic."),
 fail("f6_wind_opposite", "긴 웨이브 가발을 쓴 하루의 뒷머리는 오른쪽으로 날리는데 앞머리는 왼쪽으로 날려 바람이 두 방향에서 부는 것처럼 보이는 실패 예시", "Full body of " + wig("haru", W_LONG) + ", standing in the wind.", "the long back hair blows to the right but the bangs and side locks blow to the left, as if two winds were blowing from opposite directions.", "16:9"),
 fail("f7_wet_fluffy", "박사가 물에 흠뻑 젖은 장면인데 머리카락은 부피와 모양이 그대로이고 물방울만 몇 개 얹힌 실패 예시", "Upper body of " + wig("doctor", "a medium-length dark brown wig", "white lab coat over a black t-shirt") + ", soaked by rain, his face and clothes dripping wet.", "his hair is still dry-looking, fluffy and full of volume with thick locks; only a few water drops sit on top of it."),
 fail("f8_wig_changed_face", "하루에게 가발만 바꿔 씌우려다 얼굴형과 눈 색까지 달라져 다른 사람처럼 된 전후 비교 실패 예시", "Two panels side by side, upper body. Left: " + wig("haru", W_BOB) + ". Right: a young adult woman with " + W_LONG + ", same lavender hoodie and lab coat.", "the right panel was supposed to be Haru with only a new wig, but the face shape is different and the eyes are green instead of blue — she has become a different person.", "16:9"),
]
CONV = [("C01_covers_A", "표지 A (픽셀아트, 16:9)", "16:9", "refs 전부", C1), ("C02_covers_B", "표지 B (픽셀아트, 16:9)", "16:9", "refs 전부 + C01에서 받은 cover_index", C2),
        ("C03_part1_frame", "1부 머리 모양의 뼈대", "16:9", "refs/haru_anime_base.png, refs/haru_sheet.png", C3), ("C04_part2_bundles", "2부 다발과 흐름", "16:9·2:3", "refs/sia_anime_base.png, refs/sia_sheet.png", C4),
        ("C05_part3_color", "3부 색과 윤기", "16:9·2:3", "refs/moa_anime_base.png, refs/moa_sheet.png, refs/doctor_sheet.png", C5), ("C06_part4_motion", "4부 움직이는 머리카락", "16:9", "refs/haru_anime_base.png, refs/doctor_sheet.png", C6),
        ("C07_part5_inpaint", "5부 가림 영역", "16:9", "refs/haru_anime_base.png", C7), ("C08_part5_styles", "5부 화풍 4종(시아)", "2:3", "refs/sia_anime_base.png, refs/sia_sheet.png", C8),
        ("C09_fail", "6부 실패 8종", "2:3·16:9", "해당 캐릭터의 refs/*_anime_base.png (박사는 refs/doctor_sheet.png)", C9)]
HEAD_PIX = "웹페이지 맨 위에 거는 표지 그림을 한 장씩 차례로 만들어 줘.\n- 비율 16:9, 가로 1920px 이상\n- 그림체는 반드시 16비트 RPG풍 픽셀아트 (네모 픽셀이 보이게, 매끈한 일러스트·벡터·수채화·3D 금지)\n- 첨부한 참고 이미지의 캐릭터를 같은 외형으로 그릴 것(가발을 쓴 인물은 얼굴·눈 색·옷을 그대로)\n- 그림 안에 글자·숫자·로고 금지\n- 얼굴과 손은 가장자리에서 떨어진 가운데 영역에, 왼쪽 아래 구석은 밝고 단순하게\n아래 영어 프롬프트를 하나씩 써 줘."
HEAD_ANI = "해설 페이지 본문에 넣을 그림을 한 장씩 차례로 만들어 줘.\n- 비율은 각 프롬프트 첫 줄을 따를 것(16:9는 가로 1920px 이상, 2:3은 세로 1536px 이상)\n- 첨부한 참고 이미지의 캐릭터 얼굴·눈 색·옷을 똑같이 지킬 것. 이번 편은 '가발로 변장'이라 머리 모양만 프롬프트대로 바꿈\n- 등장인물은 모두 20대 성인(박사는 성인 남성). 노출·과장된 체형·교복 느낌 금지\n- 그림 안에 글자·숫자·로고·말풍선 금지, 유명 애니 캐릭터와 닮으면 다시 만들 것\n아래 영어 프롬프트를 하나씩 써 줘."

# ---- 부마다 '프롬프트 연습 문제' 2개의 예상 결과 그림 (docs/image_requests_ex, make_requests_ex.py)
X1 = [
 body("ex1_1_moa_side_part", "01_hair_frame.html", "1부 연습 1", "모아가 옆 가르마 단발 가발을 쓴 상반신 — 가르마가 이마 선 뒤에서 시작해 앞머리 사이로 숨고, 머리 원형보다 한 겹 바깥에 부피가 있는 예상 결과", "2:3",
   "Upper body, front three-quarter view of " + wig("moa", "a chin-length ash-brown bob wig with a side parting on her right side") + ".\nThe parting starts clearly BEHIND the hairline and disappears among the side-swept bangs; no parting line on the forehead.\nNatural volume: the bob sits slightly away from the scalp with a rounded crown; the ends curl softly inward.",
   "Light from the upper left."),
 body("ex1_2_sia_two_impressions", "01_hair_frame.html", "1부 연습 2", "같은 어깨 길이 가발을 쓴 시아 두 모습 — 왼쪽은 끝이 바깥으로 튀어 활발해 보이고, 오른쪽은 끝이 안으로 말려 차분해 보이는 예상 결과", "16:9",
   "Two panels side by side, upper body, same pose, same lighting.\nLeft: " + wig("sia", "a shoulder-length dark brown wig with the ends flipped OUTWARD") + ", a bright lively smile.\nRight: the same Sia with exactly the same wig length, but the ends curled INWARD, a calm gentle smile.\nOnly the end direction and the expression differ; the length, color, parting and bangs are identical.",
   "Light from the upper left in both panels."),
]
X2 = [
 body("ex2_1_sia_half_up", "02_hair_bundles.html", "2부 연습 1", "반묶음 가발을 쓴 시아의 뒤쪽 3/4 모습 — 윗머리 다발이 뒤통수의 묶은 점으로 모이고, 아랫머리는 등 위로 풀려 내려오는 예상 결과", "2:3",
   "Back three-quarter view, upper body of " + wig("sia", "a long straight dark chestnut half-up wig") + ", looking back over her shoulder.\nThe upper half of the hair is pulled back from the hairline and both temples toward one small tie at the back of the head, with visible tension lines converging at the tie; a short tail spreads out below the tie.\nThe lower half of the hair falls loosely down her back as soft ribbon-like locks.",
   "Light from the upper left."),
 body("ex2_2_haru_braid_shoulder", "02_hair_bundles.html", "2부 연습 2", "하루가 한 갈래로 땋은 갈색 가발을 오른쪽 어깨 앞으로 넘긴 상반신 — 땋은 머리가 어깨에 닿는 곳에서 꺾여 가슴 위로 내려오고, 매듭이 아래로 갈수록 작아지는 예상 결과", "2:3",
   "Upper body, front view of " + wig("haru", "a long light-brown wig in one loose three-strand braid") + ".\nThe braid is brought over the front of her RIGHT shoulder: it rests on the shoulder, bends along it, and falls over her chest. The braid is made of soft diamond-shaped sections that get gradually smaller toward the end, finished with a small plain hair tie.\nThe rest of the hair behind the shoulders is partly hidden by the shoulders.",
   "Light from the upper left."),
]
X3 = [
 body("ex3_1_manga_three_tones", "03_hair_color.html", "3부 연습 1", "흑백 만화 한 장면에 하루(진한 회색 톤)·시아(검게 칠하고 흰 윤기 띠)·모아(선만, 그늘에만 옅은 톤)가 나란히 서서 머리색이 밝기로 구별되는 예상 결과", "16:9",
   "Black-and-white manga illustration with ink lines and screentones only (no color), three adults standing side by side, upper body.\nLeft: " + wig("haru", "a shoulder-length red wig drawn with a dark gray screentone") + ".\nCenter: " + who("sia") + ", her own long black hair filled solid black with white glossy highlight bands about 15 percent of the hair area.\nRight: " + wig("moa", "a long wavy blonde wig left almost white, drawn with outlines and flow lines only and a light screentone only in the shadows") + ".\nThe three hair colors are clearly different in brightness.",
   ""),
 body("ex3_2_moa_backlight_silver", "03_hair_color.html", "3부 연습 2", "은발 가발을 쓴 모아가 뒤쪽 위에서 오는 빛을 받아, 정수리 가까이에 머리 둘레를 감는 윤기 띠와 머리 가장자리의 밝은 테두리가 생긴 예상 결과", "2:3",
   "Upper body of " + wig("moa", "a long straight silver wig") + ", standing by a bright window.\nThe light comes from BEHIND and ABOVE her. A single glossy highlight band wraps around the head across the hair flow, placed high near the crown, broken slightly at each lock; a thin bright rim of light outlines the edge of the hair and shoulders; her face is in soft shade.",
   ""),
]
X4 = [
 body("ex4_1_sia_jump_down", "04_hair_motion.html", "4부 연습 1", "낮은 계단에서 뛰어내리는 순간의 시아 — 아래에서 올라오는 바람에 긴 머리가 위로 들려 퍼지고, 털끝일수록 크게 들린 예상 결과", "2:3",
   "Full body of " + wig("sia", "a waist-length straight dark brown wig") + ", captured in mid-air while hopping down from a low step in the lab, knees slightly bent, arms out for balance, calm and safe.\nThe air from below lifts her hair upward and outward: the roots stay close to the head while the tips rise the most and spread in all directions; the hem of her apron also lifts slightly.",
   "Light from the upper left."),
 body("ex4_2_haru_pony_turn", "04_hair_motion.html", "4부 연습 2", "포니테일 가발을 쓴 하루가 고개를 휙 돌려 뒤를 보는 순간 — 머리는 이미 돌았는데 포니테일 끝은 늦게 따라와 반대쪽으로 휘어 말린 예상 결과", "16:9",
   "Upper body of " + wig("haru", "a high light-brown ponytail wig tied with a plain lavender hair tie") + ", quickly turning her head to look back over her left shoulder.\nHer head has already turned, but the ponytail lags behind: the part near the tie follows the head, while the tail swings out to the opposite side and its tip curls outward. A few faint motion lines behind the tail.",
   "Light from the upper left."),
]
X5 = [
 body("ex5_1_sia_silver_inpaint", "05_ai_vfx.html", "5부 연습 1", "왼쪽은 원래 흑발의 시아, 오른쪽은 머리 부분만 다시 그려 은발이 된 시아 — 얼굴·회색 눈·귀걸이·옷·자세가 그대로인 예상 결과", "16:9",
   "Two panels side by side, identical upper-body pose and lighting.\nLeft: " + who("sia") + ".\nRight: exactly the same image, but only the hair color is changed to silver, as if repainted with inpainting: same hair length, same locks and same parting; her face, gray eyes, small silver earrings, expression, outfit and background are pixel-for-pixel the same.",
   "Light from the upper left in both panels."),
 body("ex5_2_three_low_ponytails", "05_ai_vfx.html", "5부 연습 2", "하루·시아·모아가 같은 '목덜미 낮은 포니테일' 가발 문장으로 나란히 선 단체 그림 — 머리 모양은 같고 얼굴·눈 색·옷·모아의 왼쪽 리본은 각자 그대로인 예상 결과", "16:9",
   "Group picture, three adults standing side by side, upper body, front view, all wearing the same style of wig: a low ponytail tied at the nape, shoulder-length tail, side-swept bangs, natural volume, soft ribbon-like locks.\nLeft: " + FACE["haru"] + " with a light-brown version of this wig, wearing " + OUT["haru"] + ".\nCenter: " + FACE["sia"] + " with a dark chestnut version, wearing " + OUT["sia"] + ".\nRight: " + FACE["moa"] + " with an ash-beige version, the white frilled maid headband and the white ribbon over her LEFT ear on top of the wig, wearing " + OUT["moa"] + ".\nEach keeps her own face and eye color.",
   "Light from the upper left."),
]
X6 = [
 body("ex6_1_wind_fixed", "06_failure_lab.html", "6부 연습 1", "실패 f6을 고친 예상 결과 — 왼쪽에서 부는 바람 하나에 하루의 앞머리·옆머리·뒷머리·랩코트가 모두 오른쪽으로 날리는 그림", "16:9",
   "Full body of " + wig("haru", W_LONG) + ", standing in a strong wind blowing from the LEFT.\nEvery lock, including the bangs, the side locks in front of the ears and the long back hair, blows to the RIGHT; the roots stay close to the head and the tips move the most. Her lab coat also flutters to the right. There is only one wind direction in the whole picture.",
   "Light from the upper left."),
 body("ex6_2_moa_low_twin_adult", "06_failure_lab.html", "6부 연습 2", "머리 이름 대신 모양을 적어 고친 예상 결과 — 목덜미 낮은 위치에서 두 갈래로 묶은 어깨 길이 가발을 쓴 모아가 20대 성인 비율로 차분하게 보이는 그림", "2:3",
   "Upper body of " + wig("moa", "an ash-beige wig tied into two low ponytails at the nape, just behind the ears, each tail shoulder-length and loosely wavy, plain dark hair ties") + ".\nAn adult woman in her early twenties with adult proportions and a calm, mature expression; the hairstyle reads as relaxed and grown-up, not childish.",
   "Light from the upper left."),
]
CONV_EX = [("E01_ex_part1_2", "연습 문제 예상 결과 1·2부", "2:3·16:9", "refs/moa_anime_base.png, refs/sia_anime_base.png, refs/haru_anime_base.png", X1 + X2),
           ("E02_ex_part3_4", "연습 문제 예상 결과 3·4부", "16:9·2:3", "refs/haru_anime_base.png, refs/sia_anime_base.png, refs/moa_anime_base.png", X3 + X4),
           ("E03_ex_part5_6", "연습 문제 예상 결과 5·6부", "16:9·2:3", "refs/haru_anime_base.png, refs/sia_anime_base.png, refs/moa_anime_base.png", X5 + X6)]
PROMPTS = {it[0]: it for _c in CONV + CONV_EX for it in _c[4]}
CONV_OF = {it[0]: _c[0] for _c in CONV + CONV_EX for it in _c[4]}
ATTACH_OF = {_c[0]: _c[3] for _c in CONV + CONV_EX}
if __name__ == "__main__":
    os.makedirs(os.path.join(D, "prompts"), exist_ok=True)
    rows = []; n = 0
    for cid, title, ratio, att, items in CONV:
        pix = items[0][5] == "pixel"
        md = f"# {cid[:3]} · {title} — " + ", ".join(i[0] for i in items) + f"\n\n**첨부:** {att}\n\n**Genspark에 먼저 붙여 넣기 ↓**\n```\n{HEAD_PIX if pix else HEAD_ANI}\n```\n"
        for k, (file, page, part, alt, prompt, style) in enumerate(items):
            n += 1; rows.append([n, cid[:3], file, page, part, "16:9" if "16:9" in prompt.split("\n")[0] else "2:3", style, ""])
            md += f"\n---\n## {k+1}) {file} — {part}\nalt: {alt}\n```\n{prompt}\n```\n"
        if cid.startswith("C09"):
            md += "\n---\n**실패 그림 주의:** 도구가 실수를 자동으로 고쳐 버리면 두 번까지만 다시 시도해 주세요. 그래도 안 되면 그대로 주셔도 됩니다(페이지에서 '결과는 매번 달라진다'는 사례로 설명합니다).\n"
        open(os.path.join(D, "prompts", cid + ".md"), "w").write(md)
    with open(os.path.join(D, "checklist.csv"), "w", newline="") as f:
        w = csv.writer(f); w.writerow(["order", "conversation", "file", "page", "part", "ratio", "style", "status"]); w.writerows(rows)
    open(os.path.join(D, "README.md"), "w").write(f"""# 그림 요청 꾸러미 1 — 표지·본문·실패 그림 ({n}장)

## 요청 순서 (Genspark 대화 하나 = 파일 하나)
""" + "\n".join(f"{i+1}. `prompts/{c[0]}.md` — {c[1]} ({len(c[4])}장) · 첨부: {c[3]}" for i, c in enumerate(CONV)) + """

## 저장 이름
`checklist.csv`의 `file` 열 이름 그대로(png·jpg). 받은 그림은 `assets/img/{이름}.webp`로 넣고 `python3 build/build.py`, 표지는 `python3 build/make_og.py`까지 다시 돌립니다.

## 주의
- 표지 8장은 16비트 RPG풍 픽셀아트, 본문은 애니풍(5부 4단계만 네 화풍, 3부 4단계는 흑백 만화풍).
- 참고 그림은 `assets/refs/`(앞 시리즈에서 확정한 기준 전신·설정 시트)를 매번 첨부합니다.
- 실사풍은 캐릭터를 코스프레한 가상의 성인 모델입니다. 실존 인물과 닮으면 다시 만듭니다.
""")
    print("prompts", len(CONV), "images", n)
