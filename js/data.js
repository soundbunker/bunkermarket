/* ============================================================================
 * 벙커마켓 · 데이터 모델
 * ----------------------------------------------------------------------------
 * 설계 원칙
 *   1) SOUND 가 1급 엔티티다. 제주 24개에 갇히지 않는다.
 *      전국·전 세계의 소리가 계속 추가된다 → 이 배열에 객체 하나만 append.
 *   2) 각 소리는 "그 환경이 키운 것"들을 가진다(LISTINGS).
 *      지금은 농산물, 나중에는 '소리 좋은 집'. 카테고리는 CATEGORIES 로 열려 있다.
 *   3) NFC 카드는 오직 소리 id 하나만 가리킨다  →  /sound.html?s=<id>
 *
 * 새 소리 추가:  SOUNDS 배열에 { id, ... } 추가
 * 새 상품 추가:  LISTINGS 배열에 { soundId, category, ... } 추가
 * 새 카테고리:   CATEGORIES 에 키 하나 추가 (mode: 'cart' | 'inquiry')
 * ==========================================================================*/

/* --- 판매 카테고리 (확장 지점) ------------------------------------------- */
const CATEGORIES = {
  produce: {
    label: '농산물',
    tagline: '이 소리가 흐르는 바닷가에서 자란 작물',
    cta: '사러 가기',
    mode: 'link',          // 외부 판매처로 링크아웃
    icon: '🌱',
  },
  stay: {
    label: '소리 좋은 집',
    tagline: '이 소리가 흐르는 공간',
    cta: '방문·구매 문의',
    mode: 'inquiry',       // 문의 (mailto/외부 링크)
    icon: '🏡',
  },
  // 예: goods, experience ... 여기에 계속 추가
};

/* --- 소리 (전국/전세계로 무한 확장) -------------------------------------- */
/* tone.hue : 카드/페이지 테마 색상 (HSL 색상각). 소리마다 고유한 분위기.       */
const SOUNDS = [
  {
    id: 'jeju-hyeopjae',
    code: 'S-001',
    title: '협재 잔물결',
    subtitle: '얕은 산호모래 위로 부서지는 높고 맑은 파도',
    region: { country: '대한민국', area: '제주', spot: '협재 해변' },
    coords: { lat: 33.394, lng: 126.240 },
    recordedAt: '2025-06',
    tone: { hue: 188 },
    tags: ['잔잔', '맑음', '고음'],
    story:
      '에메랄드빛 얕은 바다가 흰 산호모래를 쓸어 올렸다 내려놓는다. ' +
      '수심이 얕아 파도는 무겁지 않고, 잘게 부서지며 높고 투명한 소리를 낸다. ' +
      '바람이 자는 이른 아침이면 물결이 유리처럼 반짝인다.',
    soundFile: 'assets/sounds/jeju-hyeopjae.mp3',
  },
  {
    id: 'jeju-gimnyeong',
    code: 'S-002',
    title: '김녕 물마루',
    subtitle: '검은 현무암 사이를 돌아 나오는 깊고 둥근 울림',
    region: { country: '대한민국', area: '제주', spot: '김녕 성세기' },
    coords: { lat: 33.558, lng: 126.759 },
    recordedAt: '2025-05',
    tone: { hue: 205 },
    tags: ['깊음', '리듬', '저음'],
    story:
      '현무암 갯바위 틈으로 파도가 밀려들었다 빠질 때마다 공기가 눌리며 ' +
      '둥근 저음이 인다. 규칙적인 물마루가 밭담 너머까지 넘어온다.',
    soundFile: 'assets/sounds/jeju-gimnyeong.mp3',
  },
  {
    id: 'jeju-seongsan',
    code: 'S-003',
    title: '성산 새벽바다',
    subtitle: '일출봉을 두른 물결과 멀리 우는 물새',
    region: { country: '대한민국', area: '제주', spot: '성산 일출봉 아래' },
    coords: { lat: 33.458, lng: 126.942 },
    recordedAt: '2025-04',
    tone: { hue: 28 },
    tags: ['새벽', '넓음', '새소리'],
    story:
      '해가 오르기 직전, 바다는 가장 낮은 목소리로 눕는다. 먼 물새 울음이 ' +
      '물안개 위로 번지고, 파도는 서두르지 않고 밀려온다.',
    soundFile: 'assets/sounds/jeju-seongsan.mp3',
  },
  {
    id: 'jeju-sagye',
    code: 'S-004',
    title: '사계 바람파도',
    subtitle: '산방산 아래, 바람과 뒤섞인 거친 물결',
    region: { country: '대한민국', area: '제주', spot: '사계 해안' },
    coords: { lat: 33.229, lng: 126.309 },
    recordedAt: '2025-03',
    tone: { hue: 168 },
    tags: ['거침', '바람', '광활'],
    story:
      '남서풍이 정면으로 부딪는 해안. 파도는 바람의 결을 그대로 받아 ' +
      '흩어지고, 소리에는 늘 바람의 사각거림이 섞여 있다.',
    soundFile: 'assets/sounds/jeju-sagye.mp3',
  },
  {
    id: 'jeju-udo',
    code: 'S-005',
    title: '우도 산호빛 물결',
    subtitle: '섬 속의 섬, 얕은 만을 채우는 나른한 파도',
    region: { country: '대한민국', area: '제주', spot: '우도 하고수동' },
    coords: { lat: 33.514, lng: 126.972 },
    recordedAt: '2025-06',
    tone: { hue: 178 },
    tags: ['나른', '따뜻', '얕음'],
    story:
      '방파제가 큰 물을 막아 만 안쪽은 늘 느긋하다. 파도는 서두르지 않고, ' +
      '오후의 볕처럼 천천히 밀려왔다 물러난다.',
    soundFile: 'assets/sounds/jeju-udo.mp3',
  },
  {
    id: 'jeju-woljeong',
    code: 'S-006',
    title: '월정 은빛 포말',
    subtitle: '고운 백사장을 길게 훑는 은빛 물거품',
    region: { country: '대한민국', area: '제주', spot: '월정리' },
    coords: { lat: 33.556, lng: 126.795 },
    recordedAt: '2025-05',
    tone: { hue: 198 },
    tags: ['포말', '길게', '부드러움'],
    story:
      '완만한 백사장 위로 파도가 길게 미끄러진다. 부서진 포말이 모래에 ' +
      '스미며 내는 쉬— 하는 소리가 오래 남는다.',
    soundFile: 'assets/sounds/jeju-woljeong.mp3',
  },
  {
    id: 'jeju-moseulpo',
    code: 'S-007',
    title: '모슬포 갯바람',
    subtitle: '거센 조류와 뱃소리가 섞인 항구의 바다',
    region: { country: '대한민국', area: '제주', spot: '모슬포항' },
    coords: { lat: 33.213, lng: 126.251 },
    recordedAt: '2025-02',
    tone: { hue: 212 },
    tags: ['힘참', '항구', '조류'],
    story:
      '조류가 빠른 남쪽 바다. 방파제에 부딪는 물살이 굵고 힘차다. ' +
      '멀리 돌아오는 뱃고동이 파도 사이에 낮게 깔린다.',
    soundFile: 'assets/sounds/jeju-moseulpo.mp3',
  },

  /* --- 여기서부터 전국 · 전 세계로 확장 (예시) ------------------------- */
  {
    id: 'gangneung-anmok',
    code: 'S-101',
    title: '안목 동해 너울',
    subtitle: '길고 깊게 밀려오는 동해의 큰 너울',
    region: { country: '대한민국', area: '강릉', spot: '안목 해변' },
    coords: { lat: 37.771, lng: 128.947 },
    recordedAt: '2025-06',
    tone: { hue: 220 },
    tags: ['너울', '웅장', '동해'],
    story:
      '수심이 깊은 동해는 파도가 멀리서부터 몸을 만들어 온다. ' +
      '한 번의 너울이 길고 깊게 해안을 채운다.',
    soundFile: 'assets/sounds/gangneung-anmok.mp3',
  },
  {
    id: 'okinawa-nago',
    code: 'S-201',
    title: '나고 산호초 바다',
    subtitle: '따뜻한 아열대, 산호초에 걸러진 잔잔한 물결',
    region: { country: '일본', area: '오키나와', spot: '나고' },
    coords: { lat: 26.591, lng: 127.977 },
    recordedAt: '2025-01',
    tone: { hue: 158 },
    tags: ['아열대', '따뜻', '산호'],
    story:
      '먼바다의 큰 파도를 산호초가 먼저 받아낸다. 해안에 닿는 물결은 ' +
      '체온처럼 미지근하고, 소리는 낮고 부드럽다.',
    soundFile: 'assets/sounds/okinawa-nago.mp3',
  },

  // 👉 새 소리는 여기에 계속 추가하세요. NFC 카드는 이 id 로 연결됩니다.
];

/* --- 상품 (소리가 흐르는 곳에서 자란 것) --------------------------------- */
/* soundId 로 소리에 연결. category 로 표시 방식 결정.                        */
/* link : 실제 판매처 URL (네이버스토어·자사몰·농가 링크 등).                  */
/*        비워두면 → 상품명으로 네이버쇼핑 검색 링크가 자동 생성됨.            */
const LISTINGS = [
  /* ── 농산물 ─────────────────────────────────────────────────── */
  {
    id: 'p-hyeopjae-garlic',
    soundId: 'jeju-hyeopjae',
    category: 'produce',
    link: '',   // ← 실제 판매처 URL
    title: '협재 통마늘',
    producer: '협재리 김농부',
    price: 13000, unit: '1kg',
    short: '맑고 높은 파도 소리 아래 자란 단단한 제주 마늘',
    story: '얕은 바다의 미네랄 바람을 맞고 자라 알이 단단하고 향이 진합니다.',
    stock: 40,
  },
  {
    id: 'p-gimnyeong-carrot',
    soundId: 'jeju-gimnyeong',
    category: 'produce',
    link: '',   // ← 실제 판매처 URL
    title: '김녕 구좌 당근',
    producer: '구좌 해밭농원',
    price: 15000, unit: '3kg',
    short: '현무암 저음이 울리는 밭에서 자란 구좌 당근',
    story: '검은 화산토와 깊은 파도의 리듬 속에서 당도 높게 자랍니다.',
    stock: 25,
  },
  {
    id: 'p-seongsan-broccoli',
    soundId: 'jeju-seongsan',
    category: 'produce',
    link: '',   // ← 실제 판매처 URL
    title: '성산 브로콜리',
    producer: '일출밭 협동조합',
    price: 12000, unit: '2kg',
    short: '새벽바다 물안개를 먹고 큰 단단한 브로콜리',
    story: '해 뜨기 전 낮은 파도와 물새 소리 속에서 천천히 여뭅니다.',
    stock: 30,
  },
  {
    id: 'p-sagye-potato',
    soundId: 'jeju-sagye',
    category: 'produce',
    link: '',   // ← 실제 판매처 URL
    title: '사계 흑감자',
    producer: '산방밭 이농부',
    price: 11000, unit: '2kg',
    short: '바람파도를 견디며 단단해진 제주 감자',
    story: '거친 바람과 물결을 이겨낸 만큼 조직이 치밀하고 포슬합니다.',
    stock: 50,
  },
  {
    id: 'p-udo-peanut',
    soundId: 'jeju-udo',
    category: 'produce',
    link: '',   // ← 실제 판매처 URL
    title: '우도 땅콩',
    producer: '우도 하고수동 농가',
    price: 18000, unit: '600g',
    short: '나른한 만의 파도가 흐르는 밭에서 자란 고소한 우도 땅콩',
    story: '따뜻하고 느린 파도 아래 작지만 기름지고 고소하게 여뭅니다.',
    stock: 35,
  },
  {
    id: 'p-woljeong-cabbage',
    soundId: 'jeju-woljeong',
    category: 'produce',
    link: '',   // ← 실제 판매처 URL
    title: '월정 양배추',
    producer: '월정리 포말농장',
    price: 9000, unit: '1통',
    short: '은빛 포말 소리 아래 자란 아삭한 양배추',
    story: '길게 스미는 파도의 습기를 머금어 잎이 두껍고 아삭합니다.',
    stock: 60,
  },
  {
    id: 'p-anmok-corn',
    soundId: 'gangneung-anmok',
    category: 'produce',
    link: '',   // ← 실제 판매처 URL
    title: '강릉 초당옥수수',
    producer: '안목 바다밭',
    price: 16000, unit: '10개',
    short: '동해 너울 소리를 들으며 여문 초당옥수수',
    story: '깊고 긴 너울의 리듬 속에서 알이 꽉 차고 달게 익습니다.',
    stock: 45,
  },

  /* ── 소리 좋은 집 (향후 확장 · 문의형) ──────────────────────── */
  {
    id: 'h-woljeong-house',
    soundId: 'jeju-woljeong',
    category: 'stay',
    link: '',   // ← 매물/문의 링크 (비우면 이메일 문의)
    title: '월정 파도소리 돌집',
    producer: '벙커마켓 큐레이션',
    price: 480000000, unit: '매매',
    short: '침실 창을 열면 은빛 포말 소리가 그대로 드는 제주 돌집',
    story: '바다에서 120m. 파도가 길게 스미는 S-006 의 소리가 온종일 머무는 집.',
    stock: 1,
  },
  {
    id: 'h-udo-stay',
    soundId: 'jeju-udo',
    category: 'stay',
    link: '',   // ← 매물/문의 링크 (비우면 이메일 문의)
    title: '우도 나른한 만 목조주택',
    producer: '벙커마켓 큐레이션',
    price: 320000000, unit: '매매',
    short: '느린 파도가 창을 채우는 우도의 단층 목조주택',
    story: '방파제 안쪽 나른한 물결(S-005)이 하루 종일 낮게 깔리는 자리.',
    stock: 1,
  },

  // 👉 새 상품은 여기에. 어떤 소리(soundId)가 키웠는지만 연결하면 됩니다.
];

/* 전역 노출 (빌드 도구 없이 file:// 로도 동작) */
window.BUNKER = { CATEGORIES, SOUNDS, LISTINGS };
