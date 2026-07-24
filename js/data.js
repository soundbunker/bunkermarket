/* ============================================================================
 * 벙커마켓 · 데이터 모델
 * ----------------------------------------------------------------------------
 * 설계 원칙
 *   1) SOUND 가 1급 엔티티다. 여기 담긴 소리는 전부 실제 필드 레코딩이다.
 *      (원본: /Volumes/work/2_영역/개발/Claude/NFC태깅시스템 · 웹용 5분/128kbps 변환본)
 *   2) 각 소리는 "그 바닷가에서 자란 것"들을 가진다(LISTINGS).
 *   3) NFC 카드는 오직 소리 id 하나만 가리킨다  →  /sound.html?s=<id>
 *
 * 새 소리 추가:  SOUNDS 배열에 { id, ... } 추가
 * 새 상품 추가:  LISTINGS 배열에 { soundId, category, ... } 추가
 * 새 카테고리:   CATEGORIES 에 키 하나 추가 (mode: 'link' | 'inquiry')
 * code 는 원본 파일 번호와 일치 (예: 18_gmneung.mp3 → S-018)
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

/* --- 소리 (전부 실제 녹음) ------------------------------------------------ */
/* tone.hue : 카드/페이지 테마 색상 (HSL 색상각). coords 없으면 표기 생략.      */
const SOUNDS = [
  {
    id: 'yongduam',
    code: 'S-001',
    title: '용두암 파도',
    subtitle: '용의 머리를 닮은 바위에 부딪는 도심 속 바다',
    region: { country: '대한민국', area: '제주시', spot: '용두암' },
    coords: { lat: 33.516, lng: 126.512 },
    recordedAt: '2026-01',
    tone: { hue: 210 },
    tags: ['현무암', '도심', '힘참'],
    story:
      '제주 시내에서 가장 가까운 바다. 용암이 굳어 만든 용두암 바위에 ' +
      '파도가 부딪혀 부서지는 소리를 담았다.',
    soundFile: 'assets/sounds/yongduam.mp3',
  },
  {
    id: 'goneuldong',
    code: 'S-002',
    title: '고늘동 물결',
    subtitle: '동네 바닷가를 오가는 잔잔한 물결',
    region: { country: '대한민국', area: '제주', spot: '고늘동' },
    coords: null,
    recordedAt: '2022-03',
    tone: { hue: 195 },
    tags: ['잔잔', '동네바다'],
    story:
      '관광지가 아닌 동네의 바닷가. 크게 목소리를 높이지 않는 ' +
      '물결이 갯바위 사이를 천천히 오간다.',
    soundFile: 'assets/sounds/goneuldong.mp3',
  },
  {
    id: 'samyang',
    code: 'S-003',
    title: '삼양 검은모래',
    subtitle: '검은 모래를 쓸어내리는 부드러운 파도',
    region: { country: '대한민국', area: '제주시', spot: '삼양 검은모래해변' },
    coords: { lat: 33.525, lng: 126.585 },
    recordedAt: '2026-05',
    tone: { hue: 230 },
    tags: ['검은모래', '부드러움'],
    story:
      '화산이 만든 검은 모래밭. 파도가 물러날 때마다 고운 검은 모래가 ' +
      '함께 쓸려 내려가며 낮게 속삭인다.',
    soundFile: 'assets/sounds/samyang.mp3',
  },
  {
    id: 'jarimul',
    code: 'S-004',
    title: '자리물',
    subtitle: '바닷가에 솟는 물, 자리물 곁의 소리',
    region: { country: '대한민국', area: '제주', spot: '자리물' },
    coords: null,
    recordedAt: '2022-01',
    tone: { hue: 175 },
    tags: ['맑음', '가까움'],
    story:
      '물가에 바짝 다가가 담은 소리. 크지 않은 물결이 ' +
      '아주 가까이에서 찰랑인다.',
    soundFile: 'assets/sounds/jarimul.mp3',
  },
  {
    id: 'woljeong',
    code: 'S-006',
    title: '월정 은빛 포말',
    subtitle: '고운 백사장을 길게 훑는 은빛 물거품',
    region: { country: '대한민국', area: '제주', spot: '월정리 해변' },
    coords: { lat: 33.556, lng: 126.796 },
    recordedAt: '2020-08',
    tone: { hue: 198 },
    tags: ['포말', '길게', '부드러움'],
    story:
      '완만한 백사장 위로 파도가 길게 미끄러진다. 부서진 포말이 모래에 ' +
      '스미며 내는 쉬— 하는 소리가 오래 남는다.',
    soundFile: 'assets/sounds/woljeong.mp3',
  },
  {
    id: 'hado',
    code: 'S-007',
    title: '하도리 바다',
    subtitle: '해녀의 마을, 철새가 쉬어 가는 고요한 바다',
    region: { country: '대한민국', area: '제주 구좌', spot: '하도리' },
    coords: { lat: 33.517, lng: 126.897 },
    recordedAt: '2023-03',
    tone: { hue: 185 },
    tags: ['고요', '해녀마을', '철새'],
    story:
      '제주에서 해녀가 가장 많은 마을, 겨울이면 철새가 내려앉는 바다. ' +
      '파도도 이곳에서는 서두르지 않는다.',
    soundFile: 'assets/sounds/hado.mp3',
  },
  {
    id: 'ojopogu',
    code: 'S-008',
    title: '오조포구',
    subtitle: '일출봉 그늘 아래 잔잔한 포구의 물결',
    region: { country: '대한민국', area: '제주 성산', spot: '오조포구' },
    coords: { lat: 33.470, lng: 126.925 },
    recordedAt: '2020-07',
    tone: { hue: 205 },
    tags: ['포구', '잔잔', '아늑'],
    story:
      '성산일출봉을 마주 보는 작은 포구. 큰 바다가 들어오지 못하는 ' +
      '안쪽 물은 호수처럼 낮게 찰랑인다.',
    soundFile: 'assets/sounds/ojopogu.mp3',
  },
  {
    id: 'gwangchigi',
    code: 'S-009',
    title: '광치기해변',
    subtitle: '일출봉을 마주 보고 밀려오는 넓은 파도',
    region: { country: '대한민국', area: '제주 성산', spot: '광치기해변' },
    coords: { lat: 33.451, lng: 126.929 },
    recordedAt: '2023-11',
    tone: { hue: 165 },
    tags: ['일출', '넓음', '이끼바위'],
    story:
      '썰물이면 초록 이끼로 덮인 너른 암반이 드러나는 해변. ' +
      '성산일출봉에서 떠오른 해가 가장 먼저 닿는 바다다.',
    soundFile: 'assets/sounds/gwangchigi.mp3',
  },
  {
    id: 'jebi',
    code: 'S-010',
    title: '제비 물소리',
    subtitle: '물가를 스치는 바람과 물의 소리',
    region: { country: '대한민국', area: '제주', spot: '제비' },
    coords: null,
    recordedAt: '2025-09',
    tone: { hue: 250 },
    tags: ['바람', '물가'],
    story:
      '제비라는 이름이 붙은 물가에서 담아온 소리. ' +
      '물과 바람이 스치듯 오간다.',
    soundFile: 'assets/sounds/jebi.mp3',
  },
  {
    id: 'sojeongbang',
    code: 'S-011',
    title: '소정방폭포',
    subtitle: '바다로 바로 떨어지는 물줄기',
    region: { country: '대한민국', area: '서귀포', spot: '소정방폭포' },
    coords: { lat: 33.244, lng: 126.572 },
    recordedAt: '2022-06',
    tone: { hue: 155 },
    tags: ['폭포', '시원함', '해안'],
    story:
      '정방폭포 곁, 바다로 곧장 떨어지는 작은 폭포. 한여름 백중날 ' +
      '물맞이를 하던 자리로, 물줄기 뒤로 파도가 겹쳐 들린다.',
    soundFile: 'assets/sounds/sojeongbang.mp3',
  },
  {
    id: 'gangjeongcheon',
    code: 'S-012',
    title: '강정천',
    subtitle: '한라산에서 바다로 흐르는 맑은 내',
    region: { country: '대한민국', area: '서귀포', spot: '강정천' },
    coords: { lat: 33.235, lng: 126.478 },
    recordedAt: '2022-11',
    tone: { hue: 145 },
    tags: ['하천', '맑음', '숲'],
    story:
      '사시사철 마르지 않고 바다까지 흘러드는 맑은 내. ' +
      '자갈 위를 구르는 물소리가 숲 그늘 아래로 이어진다.',
    soundFile: 'assets/sounds/gangjeongcheon.mp3',
  },
  {
    id: 'jungmun',
    code: 'S-013',
    title: '중문 색달해변',
    subtitle: '넓은 모래밭에 길게 부서지는 남쪽 파도',
    region: { country: '대한민국', area: '서귀포', spot: '중문 색달해변' },
    coords: { lat: 33.244, lng: 126.412 },
    recordedAt: '2021-11',
    tone: { hue: 218 },
    tags: ['광활', '모래', '서핑'],
    story:
      '남쪽 먼바다에서 온 너울이 넓은 모래밭에 길게 부서진다. ' +
      '서퍼들이 계절 없이 찾아드는 힘 있는 바다다.',
    soundFile: 'assets/sounds/jungmun.mp3',
  },
  {
    id: 'suwolbong',
    code: 'S-016',
    title: '수월봉 바람',
    subtitle: '화산재 절벽 아래, 노을과 바람의 바다',
    region: { country: '대한민국', area: '제주 한경', spot: '수월봉' },
    coords: { lat: 33.300, lng: 126.169 },
    recordedAt: '2022-08',
    tone: { hue: 35 },
    tags: ['절벽', '노을', '바람'],
    story:
      '화산재가 겹겹이 쌓인 절벽 아래로 파도가 밀려든다. ' +
      '제주에서 노을이 가장 붉게 지는 서쪽 끝 바다.',
    soundFile: 'assets/sounds/suwolbong.mp3',
  },
  {
    id: 'panpo',
    code: 'S-017',
    title: '판포포구',
    subtitle: '투명한 물빛의 작은 포구',
    region: { country: '대한민국', area: '제주 한경', spot: '판포포구' },
    coords: { lat: 33.348, lng: 126.235 },
    recordedAt: '2024-07',
    tone: { hue: 190 },
    tags: ['포구', '투명', '아늑'],
    story:
      '방파제 안쪽으로 유리처럼 맑은 물이 드는 작은 포구. ' +
      '잔잔한 물결이 돌담과 계단을 가볍게 두드린다.',
    soundFile: 'assets/sounds/panpo.mp3',
  },
  {
    id: 'geumneung',
    code: 'S-018',
    title: '금능 잔물결',
    subtitle: '비양도를 마주 본 얕고 맑은 바다',
    region: { country: '대한민국', area: '제주 한림', spot: '금능해변' },
    coords: { lat: 33.390, lng: 126.233 },
    recordedAt: '2026-01',
    tone: { hue: 188 },
    tags: ['얕음', '맑음', '비양도'],
    story:
      '수심이 얕아 파도가 무겁지 않은 바다. 잘게 부서지는 물결 너머로 ' +
      '비양도가 떠 있다.',
    soundFile: 'assets/sounds/geumneung.mp3',
  },
  {
    id: 'handam',
    code: 'S-019',
    title: '한담 해안',
    subtitle: '애월 바닷길을 따라 걷는 물결 소리',
    region: { country: '대한민국', area: '제주 애월', spot: '한담해안산책로' },
    coords: { lat: 33.464, lng: 126.303 },
    recordedAt: '2023-10',
    tone: { hue: 178 },
    tags: ['산책로', '잔잔', '애월'],
    story:
      '바다에 바짝 붙어 굽이도는 애월의 바닷길. 걸음 옆에서 ' +
      '물결이 갯바위를 낮게 두드린다.',
    soundFile: 'assets/sounds/handam.mp3',
  },
  {
    id: 'aljakji',
    code: 'S-020',
    title: '알작지 몽돌',
    subtitle: '파도가 물러날 때마다 구르는 둥근 돌들',
    region: { country: '대한민국', area: '제주시 내도', spot: '알작지해변' },
    coords: { lat: 33.507, lng: 126.466 },
    recordedAt: '2020-08',
    tone: { hue: 240 },
    tags: ['몽돌', '리듬', '자갈'],
    story:
      '모래 대신 둥근 몽돌이 깔린 해변. 파도가 물러날 때마다 ' +
      '수천 개의 돌이 함께 구르며 자르르— 소리를 낸다.',
    soundFile: 'assets/sounds/aljakji.mp3',
  },
  {
    id: 'chujado',
    code: 'S-021',
    title: '추자도 먼바다',
    subtitle: '제주와 육지 사이, 먼바다 섬의 물결',
    region: { country: '대한민국', area: '제주 추자면', spot: '추자도' },
    coords: { lat: 33.955, lng: 126.300 },
    recordedAt: '2023-10',
    tone: { hue: 225 },
    tags: ['섬', '먼바다'],
    story:
      '제주에서 뱃길로 한 시간, 마흔두 개의 섬이 모인 추자. ' +
      '먼바다의 물결이 섬의 갯바위를 두드린다.',
    soundFile: 'assets/sounds/chujado.mp3',
  },
  {
    id: 'chagwido',
    code: 'S-022',
    title: '차귀도 노을바다',
    subtitle: '무인도를 마주 본 서쪽 끝 바다',
    region: { country: '대한민국', area: '제주 한경', spot: '차귀도 앞바다' },
    coords: { lat: 33.311, lng: 126.146 },
    recordedAt: '2021-11',
    tone: { hue: 20 },
    tags: ['무인도', '노을', '바람'],
    story:
      '고깃배가 드나드는 자구내포구 너머로 무인도 차귀도가 떠 있다. ' +
      '해 질 무렵이면 바다 전체가 붉게 물든다.',
    soundFile: 'assets/sounds/chagwido.mp3',
  },
  {
    id: 'gapado',
    code: 'S-023',
    title: '가파도 청보리 바람',
    subtitle: '가장 낮은 섬을 지나는 바람과 파도',
    region: { country: '대한민국', area: '제주 대정', spot: '가파도' },
    coords: { lat: 33.168, lng: 126.271 },
    recordedAt: '2025-12',
    tone: { hue: 130 },
    tags: ['청보리', '낮은섬', '바람'],
    story:
      '모슬포 앞바다에 납작 엎드린 섬. 막아서는 것이 없어 바람은 ' +
      '보리밭을 지나 곧장 바다로 흘러간다.',
    soundFile: 'assets/sounds/gapado.mp3',
  },
  {
    id: 'udo',
    code: 'S-024',
    title: '우도 산호빛 물결',
    subtitle: '섬 속의 섬, 얕은 만을 채우는 나른한 파도',
    region: { country: '대한민국', area: '제주 우도', spot: '우도' },
    coords: { lat: 33.500, lng: 126.951 },
    recordedAt: '2022-04',
    tone: { hue: 172 },
    tags: ['섬속의섬', '얕음', '나른'],
    story:
      '산호가 부서져 만든 하얀 모래톱 위로 옥빛 물이 든다. ' +
      '파도는 서두르지 않고 오후의 볕처럼 천천히 밀려온다.',
    soundFile: 'assets/sounds/udo.mp3',
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
    soundId: 'geumneung',
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
    soundId: 'gapado',
    category: 'produce',
    link: 'https://smartstore.naver.com/murungfarm/products/3220323361',
    image: 'assets/listings/murungfarm-bundle.jpg',   // 판매처 대표 이미지 (판매자 제공)
    title: '제주 제철 농산물 꾸러미 (정기구독)',
    producer: '무릉외갓집 · 스레드 친구',
    origin: '제주 서귀포 대정읍 무릉리',
    price: null, unit: '',
    short: '가파도가 바라보이는 무릉리에서 다달이 오는 제철 꾸러미',
    story: '무릉리 농가들이 그때그때 가장 좋은 제철 농산물을 담아 다달이 보내는 정기구독 꾸러미입니다. 벙커마켓은 수수료 없이 판매 페이지로 바로 연결합니다.',
    curatorNote: '마르쉐 장터에서 함께 소개하는 스친의 꾸러미입니다. 클릭하면 스마트스토어 판매 페이지로 바로 이동해요.',
  },
  {
    id: 'p-jejualoe',
    soundId: 'gwangchigi',
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
  {
    id: 'p-jejujoa-bamhobak',
    soundId: 'handam',
    category: 'produce',
    link: 'https://smartstore.naver.com/jejujoa/products/4917766929',
    image: 'assets/listings/jejujoa-bamhobak.jpg',   // 판매처 대표 이미지 (판매자 제공)
    title: '애월 미니밤호박',
    producer: '제주청춘농장 · 스레드 친구',
    origin: '제주 애월',
    price: null, unit: '',
    short: '애월 바닷바람 아래 여문 포슬포슬한 미니밤호박',
    story: '애월에서 온 여름 제철 미니밤호박입니다. 밤처럼 포슬하고 단맛이 진해요. 벙커마켓은 수수료 없이 판매 페이지로 바로 연결합니다.',
    curatorNote: '마르쉐 장터에서 함께 소개하는 스친의 미니밤호박입니다. 클릭하면 스마트스토어 판매 페이지로 바로 이동해요.',
  },
  {
    id: 'p-toctoc-citrus',
    soundId: 'sojeongbang',
    category: 'produce',
    link: 'https://smartstore.naver.com/bongbong-island',
    image: 'assets/listings/toctoc-citrus.jpg',   // 판매자 네이버 플레이스 사진
    title: '톡톡아일랜드 · 산지직송 제주 감귤',
    producer: '톡톡아일랜드 · 스레드 친구',
    origin: '제주 서귀포 남원읍 하례리',
    price: null, unit: '',
    short: '하례리 돌담 귤밭에서 산지직송으로 오는 제주의 달콤함',
    story: '서귀포 남원읍 하례리의 감귤 농가입니다. 착한 농부가 땀 흘려 농사지어 산지직송으로 보내드려요. 벙커마켓은 수수료 없이 스토어로 바로 연결합니다.',
    curatorNote: '마르쉐 장터에서 함께 소개하는 스친의 귤 농가입니다. 클릭하면 스마트스토어로 바로 이동해요.',
  },
  {
    id: 'p-mukk-dripbag',
    soundId: 'handam',
    category: 'produce',
    link: 'https://smartstore.naver.com/mukk_mukk/products/11391995505',
    image: 'assets/listings/mukk-dripbag.jpg',   // 판매자 공식 사이트(mukk.co.kr) 상품 이미지
    title: '먹 mukk · 제로 카페인 먹 드립백',
    producer: '먹 mukk · 스레드 친구',
    origin: '제주 애월읍 납읍리',
    price: null, unit: '',
    short: '제주 토종 흑보리로 내리는 카페인 없는 한 잔',
    story: '애월 납읍리에서 제주 토종 흑보리를 기르고 볶는 대체커피 브랜드 먹(mukk)입니다. 흑보리와 작두콩을 블렌딩한 제로 카페인 드립백이에요. 벙커마켓은 수수료 없이 판매 페이지로 바로 연결합니다.',
    curatorNote: '마르쉐 장터에서 함께 소개하는 스친의 드립백입니다. 클릭하면 스마트스토어 판매 페이지로 바로 이동해요.',
  },

  // 👉 새 상품은 여기에. 어떤 소리(soundId)가 키웠는지만 연결하면 됩니다.
];

/* 전역 노출 (빌드 도구 없이 file:// 로도 동작) */
window.BUNKER = { CATEGORIES, SOUNDS, LISTINGS };
