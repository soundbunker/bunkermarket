# 벙커마켓 · 소리가 흐르는 곳

바다의 소리를 모아, **그 소리가 흐르는 바닷가에서 자란 것**을 잇는 마켓.
NFC 카드를 태그하면 → 그 소리가 재생되고 → 그 바닷가의 농산물(나중엔 '소리 좋은 집')의 **판매처로 연결**된다.

## 핵심 설계

```
SOUND (소리)  ──1:N──▶  LISTING (그 바닷가의 것)
 · 무한 확장               · link 로 외부 판매처에 연결 (직접 판매 안 함)
 · NFC 는 소리 id 만 가리킴    (produce=링크아웃 / stay=이메일 문의)
```

- **소리가 1급 엔티티다.** 제주에 갇히지 않는다. 전국·전 세계로 계속 추가된다.
- **직접 팔지 않는다.** 상품은 썸네일+스토리로 소개하고, `link`(네이버 스토어·농가 판매처)로 보낸다.
  → 재고·배송·정산·PG 없음. 우리가 파는 건 '산지의 이야기'.
- **NFC 카드는 소리 id 하나만 담는다.** → `sound.html?s=<id>&autoplay=1`

## 파일 구조

| 파일 | 역할 |
|---|---|
| `js/data.js` | **데이터 전부.** SOUNDS · LISTINGS · CATEGORIES. 여기만 고치면 됨 |
| `js/ocean.js` | 오디오 엔진. 실제 mp3 있으면 재생, 없으면 파도소리 합성(항상 동작) |
| `js/app.js` | 공용 렌더(소리카드·상품카드·토스트) + 판매처 링크 헬퍼(`buyLink`) |
| `index.html` | 홈 — 컨셉 + 소리 아카이브 + 미리보기 |
| `sound.html` | **NFC 착지 페이지.** 소리 재생 + 그 바닷가의 것 |
| `catalog.html` | 마켓 — 카테고리/소리(산지) 필터, 카드 클릭 → 판매처 |
| `product.html` | 상품 상세 (농산물=판매처 링크 / 집=이메일 문의) |
| `nfc.html` | **운영용.** 카드별 주소 목록 · 복사 · Web NFC 직접 쓰기 |
| `marketing/` | 카드뉴스(농민 설명용)·OG 이미지 생성 스크립트, 캔바 작업 킷 |

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

**새 상품** — 어떤 소리의 바닷가인지 + 판매처 링크만 연결:
```js
LISTINGS.push({ id:'p-...', soundId:'busan-gwangan', category:'produce',
  link:'https://smartstore.naver.com/...',   // ← 실제 판매처. 비우면 네이버쇼핑 검색으로 폴백
  title:'...', producer:'...', price:12000, unit:'1kg', short:'...', story:'...' });
```

**판매 방식(mode)** — `CATEGORIES`에서:
- `mode:'link'` → 외부 판매처로 이동 (농산물)
- `mode:'inquiry'` → play@soundb.kr 이메일 문의 (소리 좋은 집)

## 실제 소리/사진 넣기

- 소리: `assets/sounds/<id>.mp3` 로 저장 (data.js 의 `soundFile` 경로와 일치).
  파일이 없으면 자동으로 파도소리를 합성해 재생하므로 데모는 항상 동작.
- 상품 이미지는 이모지+소리색 그라디언트. 실사진 쓰려면 `app.js` 의 `productCard` 에 `<img>` 추가.

## NFC 카드 굽기 (마르셰 장터 준비)

1. 사이트를 도메인에 배포 (Netlify — `netlify.toml` 있음. Git 연동하면 push 마다 자동 배포).
2. `nfc.html` 접속 → 상단에 **배포 주소** 입력·저장.
3. 각 카드 줄에서
   - **안드로이드 Chrome**: `카드에 쓰기` → 빈 NFC 카드를 갖다 대면 바로 기록.
   - 그 외: `주소 복사` → NFC 쓰기 앱(NFC Tools 등)으로 URL 레코드 기록.

## 로컬 실행

```bash
node .claude/server.js        # PORT 환경변수 지원, 기본 4599
```

## 남은 일 (코드 밖)

- [ ] Netlify Git 연동 → 배포 URL 확정 → `og:image` 절대경로로 교체
- [ ] 진짜 바다 녹음 파일 → `assets/sounds/`
- [ ] 실제 농가 섭외 → `LISTINGS`의 `link` 채우기 (marketing/cardnews 로 설득)
- [ ] 연락 이메일: play@soundb.kr (수신 확인 필수)
