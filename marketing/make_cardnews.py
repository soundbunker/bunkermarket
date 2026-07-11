# 벙커마켓 카드뉴스 (농민 대상 설명) — 1080x1080 x 6장
# 디자인: og.png 와 동일한 사이트 팔레트/요소
import math, os
from PIL import Image, ImageDraw, ImageFont

W = H = 1080
SEA = (8, 40, 58)
TIDE = (28, 122, 134)
TIDE_LITE = (72, 181, 189)
ACCENT = (232, 101, 79)
FOAM = (238, 246, 245)
SAND = (232, 217, 189)

TTC = "/System/Library/Fonts/AppleSDGothicNeo.ttc"

_font_cache = {}
def font(size, want_bold=True):
    key = (size, want_bold)
    if key in _font_cache: return _font_cache[key]
    got = None
    for i in range(12):
        try:
            f = ImageFont.truetype(TTC, size, index=i)
            name = " ".join(f.getname())
            if want_bold and "Bold" in name and "Extra" not in name and "Semi" not in name:
                got = f; break
            if not want_bold and "Regular" in name:
                got = f; break
        except Exception:
            break
    _font_cache[key] = got or ImageFont.truetype(TTC, size)
    return _font_cache[key]

def lerp(a, b, t):
    return tuple(int(a[i] + (b[i] - a[i]) * t) for i in range(3))

def base(dark_top=True):
    img = Image.new("RGB", (W, H), SEA)
    px = img.load()
    for y in range(H):
        for x in range(W):
            t = (y / H) * 0.85 + (x / W) * 0.15
            px[x, y] = lerp(SEA, TIDE, min(1.0, t * 0.9))
    ov = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    od = ImageDraw.Draw(ov)
    def wave(base_y, amp, phase, color):
        pts = [(0, H)]
        for x in range(0, W + 1, 8):
            y = base_y + amp * math.sin((x / W) * math.pi * 2.2 + phase) \
                       + amp * .5 * math.sin((x / W) * math.pi * 4.8 + phase * 1.7)
            pts.append((x, y))
        pts.append((W, H))
        od.polygon(pts, fill=color)
    wave(H - 210, 26, .6, (*TIDE_LITE, 38))
    wave(H - 140, 22, 2.4, (255, 255, 255, 16))
    return Image.alpha_composite(img.convert("RGBA"), ov)

def brand(img):
    d = ImageDraw.Draw(img)
    bx, by = 70, 74
    glow = Image.new("RGBA", (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse([bx-15, by-15, bx+15, by+15], fill=(*ACCENT, 60))
    img.alpha_composite(glow)
    d = ImageDraw.Draw(img)
    d.ellipse([bx-9, by-9, bx+9, by+9], fill=ACCENT)
    d.text((bx+25, by-22), "벙커마켓", font=font(36), fill=FOAM)
    return d

def pagenum(d, n, total=6):
    t = f"{n} / {total}"
    f_ = font(28, False)
    tw = d.textlength(t, font=f_)
    d.text((W - 70 - tw, H - 92), t, font=f_, fill=(255, 255, 255, 150))

def kicker(d, text, y, x=72):
    bars = [9, 20, 13, 24]
    for i, bh in enumerate(bars):
        x0 = x + i * 10
        d.rounded_rectangle([x0, y + (24 - bh), x0 + 5, y + 24], 2, fill=TIDE_LITE)
    kx = x + len(bars) * 10 + 16
    f_ = font(28)
    for ch in text:
        d.text((kx, y - 4), ch, font=f_, fill=TIDE_LITE)
        kx += d.textlength(ch, font=f_) + (12 if ch == " " else 4)

def lines(d, txts, x, y, f_, gap, fill):
    for t in txts:
        d.text((x, y), t, font=f_, fill=fill)
        y += gap
    return y

def nfc_arcs(img, ax, ay, scale=1.0, alpha=200):
    d = ImageDraw.Draw(img)
    for i, rr in enumerate((int(24*scale), int(44*scale), int(64*scale))):
        d.arc([ax-rr, ay-rr, ax+rr, ay+rr], start=-70, end=20,
              fill=(*TIDE_LITE, max(0, alpha - i*55)), width=max(4, int(6*scale)))
    d.ellipse([ax-6, ay-6, ax+6, ay+6], fill=TIDE_LITE)

OUT = "/Users/emily/Desktop/**클로드**/2.벙커마켓/marketing/cardnews"
os.makedirs(OUT, exist_ok=True)

# ── 카드 1 · 표지 ──────────────────────────────────────────────
img = base(); d = brand(img)
kicker(d, "농부님께 드리는 제안", 300)
lines(d, ["바다 소리와 함께,", "농부님의 농산물을", "소개하고 싶습니다"], 68, 360, font(88), 118, (255,255,255))
d.text((70, 760), "벙커마켓 · 소리가 흐르는 곳의 마켓", font=font(34, False), fill=(255,255,255,200))
nfc_arcs(img, W-150, 170, 1.2)
d = ImageDraw.Draw(img); pagenum(d, 1)
img.convert("RGB").save(f"{OUT}/card-1.png")

# ── 카드 2 · 벙커마켓이 뭔가요 ─────────────────────────────────
img = base(); d = brand(img)
kicker(d, "벙커마켓이 뭐 하는 곳인가요?", 210)
lines(d, ["바닷가의 소리를 녹음해", "작은 카드에 담습니다."], 68, 268, font(64), 86, (255,255,255))
# 카드+폰 일러스트 (단순 도형)
card_x, card_y = 120, 520
d.rounded_rectangle([card_x, card_y, card_x+260, card_y+170], 22, fill=(255,255,255,235))
d.ellipse([card_x+38, card_y+58, card_x+92, card_y+112], fill=ACCENT)
d.text((card_x+112, card_y+62), "협재", font=font(40), fill=SEA)
nfc_arcs(img, card_x+310, card_y+40, 0.9)
d = ImageDraw.Draw(img)
lines(d, ["손님이 카드에 휴대폰을 대면 —",
          "그 바다의 파도 소리가 흐르고,",
          "그 바닷가에서 자란 농산물이",
          "함께 소개됩니다."], 68, 760, font(44, False), 62, (255,255,255,225))
pagenum(d, 2)
img.convert("RGB").save(f"{OUT}/card-2.png")

# ── 카드 3 · 손님의 30초 ──────────────────────────────────────
img = base(); d = brand(img)
kicker(d, "손님이 겪는 30초", 200)
steps = [
    ("1", "장터에서 카드에 폰을 댄다"),
    ("2", "파도 소리가 흐른다"),
    ("3", "“이 바닷가의 당근이구나”"),
    ("4", "[사러 가기] → 농부님 판매처로"),
]
y = 300
for n, t in steps:
    d.ellipse([70, y, 70+76, y+76], fill=(*ACCENT, 255))
    nw = d.textlength(n, font=font(44))
    d.text((70+38-nw/2, y+10), n, font=font(44), fill=(255,255,255))
    d.text((178, y+12), t, font=font(48), fill=(255,255,255))
    if n != "4":
        d.line([70+38, y+84, 70+38, y+124], fill=(255,255,255,70), width=3)
    y += 132
d.text((70, y+34), "손님은 소리로 산지를 먼저 만납니다.", font=font(38, False), fill=(*SAND, 255))
pagenum(d, 3)
img.convert("RGB").save(f"{OUT}/card-3.png")

# ── 카드 4 · 농부님이 하실 일 ─────────────────────────────────
img = base(); d = brand(img)
kicker(d, "농부님은 무엇을 하나요?", 200)
lines(d, ["링크 하나만", "주시면 됩니다"], 68, 258, font(84), 110, (255,255,255))
checks = [
    "팔던 방식 그대로 파세요",
    "(네이버 스토어 · 전화 주문 · 직거래)",
    "저희 ‘사러 가기’ 버튼이",
    "농부님 판매처로 바로 연결됩니다",
    "재고 · 배송 · 정산, 저희는 손대지 않아요",
]
y = 540
for i, t in enumerate(checks):
    is_sub = t.startswith("(")
    if not is_sub and (i in (0, 2, 4)):
        d.line([74, y+30, 96, y+52], fill=TIDE_LITE, width=8)
        d.line([96, y+52, 134, y+6], fill=TIDE_LITE, width=8)
    d.text((160, y), t, font=font(42 if not is_sub else 34, False),
           fill=(255,255,255,235) if not is_sub else (255,255,255,170))
    y += 78 if not is_sub else 58
pagenum(d, 4)
img.convert("RGB").save(f"{OUT}/card-4.png")

# ── 카드 5 · 조건 (정직하게) ──────────────────────────────────
img = base(); d = brand(img)
kicker(d, "조건은요?", 200)
y = 270
for big, small in [("입점비 0원", "내실 돈이 없습니다"),
                   ("수수료 0원", "판매는 농부님 판매처에서 그대로"),
                   ("과장 없음", "“소리가 흐르는 곳에서 자란” — 사실만 말합니다")]:
    d.text((70, y), big, font=font(64), fill=FOAM)
    d.text((70, y+82), small, font=font(36, False), fill=(255,255,255,190))
    y += 172
d.text((70, y+26), "저희가 얻는 건 ‘산지의 이야기’입니다.", font=font(40), fill=(*SAND,255))
d.text((70, y+84), "소리가 이야기가 되고, 이야기가 손님을 데려옵니다.", font=font(34, False), fill=(255,255,255,190))
pagenum(d, 5)
img.convert("RGB").save(f"{OUT}/card-5.png")

# ── 카드 6 · 함께해요 ─────────────────────────────────────────
img = base(); d = brand(img)
kicker(d, "함께하려면", 200)
d.text((68, 258), "세 가지만 알려주세요", font=font(72), fill=(255,255,255))
items = ["농가(농부님) 이름", "팔고 있는 것", "판매처 링크 또는 전화번호"]
y = 420
for i, t in enumerate(items, 1):
    d.ellipse([70, y, 70+64, y+64], fill=(*ACCENT, 255))
    nw = d.textlength(str(i), font=font(38))
    d.text((70+32-nw/2, y+8), str(i), font=font(38), fill=(255,255,255))
    d.text((160, y+8), t, font=font(46), fill=(255,255,255))
    y += 108
pill = Image.new("RGBA", (W, H), (0,0,0,0)); pd = ImageDraw.Draw(pill)
pd.rounded_rectangle([70, y+40, W-70, y+180], 34, fill=(255,255,255,28), outline=(255,255,255,80), width=2)
img.alpha_composite(pill); d = ImageDraw.Draw(img)
d.text((110, y+72), "hello@bunkermarket.kr", font=font(46), fill=FOAM)
d.text((110, y+134), "마르셰 장터에서 직접 만나실 수도 있어요", font=font(30, False), fill=(255,255,255,180))
pagenum(d, 6)
img.convert("RGB").save(f"{OUT}/card-6.png")

print("saved 6 cards to", OUT)
