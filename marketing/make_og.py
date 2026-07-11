# 벙커마켓 OG 공유 이미지 (1200x630)
# 사이트 디자인 시스템 그대로: sea/tide 그라디언트 + 파도 + 플레이어 필 + 코랄 도트
import math
from PIL import Image, ImageDraw, ImageFont

W, H = 1200, 630
SEA = (8, 40, 58)        # --sea #08283a
TIDE = (28, 122, 134)    # --tide #1c7a86
TIDE_LITE = (72, 181, 189)  # --tide-lite #48b5bd
ACCENT = (232, 101, 79)  # --accent #e8654f
FOAM = (238, 246, 245)   # --foam

TTC = "/System/Library/Fonts/AppleSDGothicNeo.ttc"

def font(size, want_bold=True):
    # ttc 안에서 Bold 인덱스 탐색
    for i in range(12):
        try:
            f = ImageFont.truetype(TTC, size, index=i)
            name = " ".join(f.getname())
            if want_bold and "Bold" in name and "Extra" not in name and "Semi" not in name:
                return f
            if not want_bold and "Regular" in name:
                return f
        except Exception:
            break
    return ImageFont.truetype(TTC, size)

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

# --- 1) 대각 그라디언트 배경 (hero: 160deg sea→tide) -----------------------
img = Image.new("RGB", (W, H), SEA)
px = img.load()
for y in range(H):
    for x in range(W):
        # 160deg 근사: 아래 + 약간 오른쪽으로 갈수록 tide
        t = (y / H) * 0.82 + (x / W) * 0.18
        px[x, y] = lerp(SEA, TIDE, min(1.0, t * 0.92))

# --- 2) 파도 밴드 2겹 (index.html hero SVG 모사) ---------------------------
overlay = Image.new("RGBA", (W, H), (0, 0, 0, 0))
od = ImageDraw.Draw(overlay)

def wave(base_y, amp, phase, color):
    pts = [(0, H), ]
    for x in range(0, W + 1, 8):
        y = base_y + amp * math.sin((x / W) * math.pi * 2.2 + phase) \
                   + amp * 0.5 * math.sin((x / W) * math.pi * 4.8 + phase * 1.7)
        pts.append((x, y))
    pts.append((W, H))
    od.polygon(pts, fill=color)

wave(430, 30, 0.6, (*TIDE_LITE, 42))
wave(490, 26, 2.4, (255, 255, 255, 18))
img = Image.alpha_composite(img.convert("RGBA"), overlay)

d = ImageDraw.Draw(img)

# --- 3) 브랜드: 코랄 도트(글로우) + 벙커마켓 --------------------------------
bx, by = 64, 54
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
gd = ImageDraw.Draw(glow)
gd.ellipse([bx - 16, by - 16, bx + 16, by + 16], fill=(*ACCENT, 60))
img = Image.alpha_composite(img, glow)
d = ImageDraw.Draw(img)
d.ellipse([bx - 9, by - 9, bx + 9, by + 9], fill=ACCENT)
d.text((bx + 26, by - 23), "벙커마켓", font=font(38), fill=FOAM)

# --- 4) 키커: EQ 바 + 문구 ---------------------------------------------------
ky = 172
bars = [10, 22, 15, 26]
for i, bh in enumerate(bars):
    x0 = 66 + i * 11
    d.rounded_rectangle([x0, ky + (26 - bh), x0 + 6, ky + 26], 3, fill=TIDE_LITE)
kick_f = font(24)
kx = 66 + len(bars) * 11 + 16
for ch in "소리가 흐르는 곳 · SINCE THE SEA":
    d.text((kx, ky - 2), ch, font=kick_f, fill=(*TIDE_LITE, 255))
    kx += (kick_f.getbbox(ch)[2] - kick_f.getbbox(ch)[0]) + 6 if ch != " " else 14

# --- 5) 타이틀 + 서브 --------------------------------------------------------
d.text((62, 218), "바다 소리를 태그하다", font=font(88), fill=(255, 255, 255))
d.text((66, 340), "NFC 카드를 대면 파도 소리가 흐르고,", font=font(34, False), fill=(255, 255, 255, 210))
d.text((66, 388), "그 바닷가에서 자란 것들을 만납니다.", font=font(34, False), fill=(255, 255, 255, 210))

# --- 6) 플레이어 필 (sound.html player 모사) --------------------------------
pill = Image.new("RGBA", (W, H), (0, 0, 0, 0))
pd = ImageDraw.Draw(pill)
PX, PY, PW, PH = 62, 470, 620, 104
pd.rounded_rectangle([PX, PY, PX + PW, PY + PH], PH // 2, fill=(255, 255, 255, 30), outline=(255, 255, 255, 70), width=2)
img = Image.alpha_composite(img, pill)
d = ImageDraw.Draw(img)
# 재생 버튼
cx, cy, r = PX + 52, PY + PH // 2, 34
d.ellipse([cx - r, cy - r, cx + r, cy + r], fill=(255, 255, 255))
d.polygon([(cx - 9, cy - 15), (cx - 9, cy + 15), (cx + 17, cy)], fill=SEA)
# 웨이브바 점들
for i in range(22):
    dx = cx + r + 24 + i * 15
    d.rounded_rectangle([dx, cy - 4, dx + 8, cy + 4], 4, fill=(255, 255, 255, 190))
# 라벨
d.text((PX + PW - 128, cy - 30), "지금 듣기", font=font(26), fill=(255, 255, 255))
d.text((PX + PW - 128, cy + 4), "S-001 협재", font=font(20, False), fill=(255, 255, 255, 170))

# --- 7) 우상단 NFC 전파 아크 -------------------------------------------------
ax, ay = W - 120, 120
for i, rr in enumerate((26, 48, 70)):
    d.arc([ax - rr, ay - rr, ax + rr, ay + rr], start=-70, end=20, fill=(*TIDE_LITE, 200 - i * 55), width=7)
d.ellipse([ax - 7, ay - 7, ax + 7, ay + 7], fill=TIDE_LITE)

out = "/Users/emily/Desktop/**클로드**/2.벙커마켓/assets/og.png"
img.convert("RGB").save(out, "PNG")
print("saved:", out, img.size)
