# 벙커마켓 · 소리가 키운 것

바다의 소리를 모아, **그 소리가 자란 것**을 파는 마켓.
NFC 카드를 태그하면 → 그 소리가 재생되고 → 그 소리(환경)가 키운 농산물(그리고 나중엔 '소리 좋은 집')을 바로 살 수 있다.

## 핵심 설계 (확장을 전제로)

```
SOUND (소리)  ──1:N──▶  LISTING (그 소리가 키운 것)
 · 무한 확장               · category 로 판매방식 분기
 · NFC 는 소리 id 만 가리킴   (produce=장바구니 / stay=문의)
```

- **소리가 1급 엔티티다.** 제주 24개에 갇히지 않는다. 전국·전 세계로 계속 추가된다.
- **판매 대상은 열려 있다.** 지금은 농산물, 나중엔 소리 좋은 집, 그 다음 무엇이든 `category` 만 추가.
- **NFC 카드는 소리 id 하나만 담는다.** → `sound.html?s=<id>&autoplay=1`

## 파일 구조

| 파일 | 역할 |
|---|---|
| `js/data.js` | **데이터 전부.** SOUNDS · LISTINGS · CATEGORIES. 여기만 고치면 됨 |
| `js/ocean.js` | 오디오 엔진. 실제 mp3 있으면 재생, 없으면 파도소리 합성(항상 동작) |
| `js/store.js` | 장바구니(localStorage). 실제 PG 붙일 땐 여기 |
| `js/app.js` | 공용 렌더(소리카드·상품카드·드로어·토스트) |
| `index.html` | 홈 — 컨셉 + 소리 아카이브 + 미리보기 |
| `sound.html` | **NFC 착지 페이지.** 소리 재생 + 그 소리가 키운 것 |
| `catalog.html` | 마켓 — 카테고리/소리(산지)로 필터 |
| `product.html` | 상품 상세 (농산물=장바구니 / 집=문의 폼) |
| `checkout.html` | 주문 접수 → 계좌·수령 문자 안내 (MVP) |
| `nfc.html` | **운영용.** 카드별 주소 목록 · 복사 · Web NFC 직접 쓰기 |

## 새로 추가하는 법 (`js/data.js` 만 수정)

**새 소리** — 전국/전세계 어디든:
```js
SOUNDS.push({
  id:'busan-gwangan', code:'S-102', title:'광안 야경파도',
  region:{country:'대한민국', area:'부산', spot:'광안리'},
  coords:{lat:35.15, lng:129.11}, recordedAt:'2025-07',
  tone:{hue:250}, tags:['도시','밤'], story:'...',
  soundFile:'assets/sounds/busan-gwangan.mp3',
});
```
→ 홈·마켓·NFC 목록에 자동 등장. NFC 카드엔 `sound.html?s=busan-gwangan&autoplay=1` 새기면 끝.

**새 상품** — 어떤 소리가 키웠는지만 연결:
```js
LISTINGS.push({ id:'p-...', soundId:'busan-gwangan', category:'produce',
  title:'...', producer:'...', price:12000, unit:'1kg', short:'...', story:'...', stock:30 });
```

**새 판매 카테고리** — 예: 체험/굿즈:
```js
CATEGORIES.experience = { label:'소리 체험', tagline:'...', cta:'예약하기', mode:'inquiry', icon:'🎫' };
```
`mode:'cart'` 면 장바구니, `mode:'inquiry'` 면 문의 폼으로 자동 분기.

## 실제 소리/사진 넣기

- 소리: `assets/sounds/<id>.mp3` 로 저장 (data.js 의 `soundFile` 경로와 일치).
  파일이 없으면 자동으로 파도소리를 합성해 재생하므로 데모는 항상 동작.
- 지금 상품 이미지는 이모지+소리색 그라디언트. 실사진 쓰려면 `app.js` 의 `productCard`/`prod-thumb` 에 `<img>` 추가.

## NFC 카드 굽기 (마르셰 장터 준비)

1. 사이트를 도메인에 배포 (Netlify·Vercel·GitHub Pages 등 정적 호스팅).
2. `nfc.html` 접속 → 상단에 **배포 주소** 입력·저장.
3. 각 카드 줄에서
   - **안드로이드 Chrome**: `카드에 쓰기` → 빈 NFC 카드를 갖다 대면 바로 기록.
   - 그 외: `주소 복사` → NFC 쓰기 앱(NFC Tools 등)으로 URL 레코드 기록.

## 로컬 실행

```bash
node .claude/server.js        # http://localhost:4599
# 또는 어떤 정적 서버든
```

## 지금은 MVP인 것 (다음 단계)

- **결제**: 지금은 주문 접수 → 계좌·문자 안내. `checkout.html` 의 `onsubmit` 에서
  구글폼/스프레드시트/서버로 전송하거나 토스페이먼츠·스트라이프 연동으로 교체.
- **재고/주문 관리**: `stock` 필드만 있음. 실운영 시 백엔드 필요.
- **사진·실제 음원**: 자리표시자. 위 안내대로 교체.
