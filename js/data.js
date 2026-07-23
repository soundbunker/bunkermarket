/* ============================================================================
 * 벙커마켓 · 데이터 모델
 * ----------------------------------------------------------------------------
 * 설계 원칙
 *   1) SOUND 가 1급 엔티티다. 제주 24개에 갇히지 않는다.
 *      전국·전 세계의 소리가 계속 추가된다 → 이 배열에 객체 하나만 append.
 *   2) 각 소리는 "그 바닷가에서 자란 것"들을 가진다(LISTINGS).
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

  /* ── 스레드 스친 (마르쉐 연결 · 수수료 없음 · 판매처 직행) ────── */
  {
    id: 'p-theyoos-pumpkin',
    soundId: 'jeju-hyeopjae',
    category: 'produce',
    link: 'https://smartstore.naver.com/theyoos/products/6838162232',
    image: 'assets/listings/theyoos-pumpkin.jpg',   // 판매처 대표 이미지 (판매자 제공)
    title: '여름 단호박',
    producer: '더유스 · 스레드 친구',
    origin: '판매처 상세페이지 참고',
    price: null, unit: '',
    short: '파도 소리 아래에서 소개하는 스친의 여름 제철 단호박',
    story: '스레드에서 만난 이웃 판매자의 제철 단호박입니다. 벙커마켓은 수수료 없이 판매 페이지로 바로 연결합니다.',
    curatorNote: '마르쉐 장터에서 함께 소개하는 스친의 단호박입니다. 클릭하면 스마트스토어 판매 페이지로 바로 이동해요.',
  },
  {
    id: 'p-murung-bundle',
    soundId: 'jeju-moseulpo',
    category: 'produce',
    link: 'https://smartstore.naver.com/murungfarm/products/3220323361',
    image: 'assets/listings/murungfarm-bundle.jpg',   // 판매처 대표 이미지 (판매자 제공)
    title: '제주 제철 농산물 꾸러미 (정기구독)',
    producer: '무릉외갓집 · 스레드 친구',
    origin: '제주 서귀포 대정읍 무릉리',
    price: null, unit: '',
    short: '모슬포 갯바람이 닿는 무릉리에서 다달이 오는 제철 꾸러미',
    story: '무릉리 농가들이 그때그때 가장 좋은 제철 농산물을 담아 다달이 보내는 정기구독 꾸러미입니다. 벙커마켓은 수수료 없이 판매 페이지로 바로 연결합니다.',
    curatorNote: '마르쉐 장터에서 함께 소개하는 스친의 꾸러미입니다. 클릭하면 스마트스토어 판매 페이지로 바로 이동해요.',
  },
  {
    id: 'p-jejualoe',
    soundId: 'jeju-seongsan',
    category: 'produce',
    link: 'https://smartstore.naver.com/jejualoe/products/3857942464',
    image: 'assets/listings/jejualoe-yachaesu.jpg',   // 판매처 대표 이미지 (판매자 제공)
    title: '제주농장 유기농 야채수',
    producer: '제주농장(제주알로에) · 스레드 친구',
    origin: '제주 서귀포 표선면',
    price: null, unit: '',
    short: '무·당근·우엉·무청·표고를 한 포에 담은 100% 유기농 야채수',
    story: '30년 넘게 알로에를 키워온 표선 농장 제주농장의 유기농 야채수입니다. 다섯 가지 유기농 야채를 한 포에 담았어요. 벙커마켓은 수수료 없이 판매 페이지로 바로 연결합니다.',
    curatorNote: '마르쉐 장터에서 함께 소개하는 스친의 야채수입니다. 클릭하면 스마트스토어 판매 페이지로 바로 이동해요.',
  },

  // 👉 새 상품은 여기에. 어떤 소리(soundId)가 키웠는지만 연결하면 됩니다.
];

/* 전역 노출 (빌드 도구 없이 file:// 로도 동작) */
window.BUNKER = { CATEGORIES, SOUNDS, LISTINGS };
