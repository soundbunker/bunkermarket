/* ============================================================================
 * 벙커마켓 · 공용 UI / 렌더 헬퍼
 * ==========================================================================*/
const U = {
  // data.js 문자열을 HTML 에 끼울 때 — 제목에 " 하나만 있어도 속성이 깨지던 문제 방지
  esc(v){ return String(v == null ? '' : v).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c])); },
  qs(name){ return new URLSearchParams(location.search).get(name); },
  krw(n){
    if(n >= 100000000) return (n/100000000).toLocaleString('ko-KR',{maximumFractionDigits:1})+'억';
    return n.toLocaleString('ko-KR')+'원';
  },
  soundById(id){ return window.BUNKER.SOUNDS.find(s=>s.id===id); },
  listingsForSound(id){ return window.BUNKER.LISTINGS.filter(l=>l.soundId===id); },
  category(key){ return window.BUNKER.CATEGORIES[key]; },
  // 판매처 링크: link 있으면 그대로, 없으면 → 문의(집)/네이버쇼핑 검색(농산물)
  buyLink(l){
    if(l.link) return l.link;
    if(U.category(l.category).mode === 'inquiry')
      return `mailto:play@soundb.kr?subject=${encodeURIComponent('[문의] '+l.title)}`;
    // 폴백: 실제 판매처 URL이 없을 때. 존재하지 않는 농가명은 빼고
    // 상품명만으로 검색해야 실제 결과가 나온다.
    const q = encodeURIComponent(l.searchQuery || l.title);
    return `https://search.shopping.naver.com/search/all?query=${q}`;
  },
  hasLink(l){ return !!l.link; },
  // 버튼 문구: 실제 판매처면 CTA, 없으면 '검색'임을 정직하게 표기
  buyLabel(l){
    const cat = U.category(l.category);
    if(cat.mode === 'inquiry') return cat.cta;
    return U.hasLink(l) ? (cat.cta + ' ↗') : '네이버쇼핑에서 찾기 ↗';
  },
  // hue → 소리마다의 바다빛. 채도를 낮춘 한 색이 위에서 아래로 깊어질 뿐(두 색 그라데이션 금지)
  grad(hue){ return `linear-gradient(180deg, hsl(${hue} 26% 22%), hsl(${hue} 30% 14%))`; },
  emoji(listing){
    const map={ '마늘':'🧄','당근':'🥕','브로콜리':'🥦','감자':'🥔','땅콩':'🥜',
      '양배추':'🥬','옥수수':'🌽','호박':'🎃','집':'🏡','주택':'🏡' };
    for(const k in map){ if(listing.title.includes(k)) return map[k]; }
    return U.category(listing.category).icon;
  },
};

/* --- 토스트 --------------------------------------------------------------*/
const UI = {
  toast(msg){
    let t = document.querySelector('.toast');
    if(!t){ t=document.createElement('div'); t.className='toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('show');
    clearTimeout(t._h); t._h = setTimeout(()=>t.classList.remove('show'), 2200);
  },

  /* --- 상품 카드 --------------------------------------------------------*/
  productCard(l){
    // soundId 오타가 있어도 이 카드만 소리 연결 없이 그린다 (예전엔 예외로 목록 전체가 멈췄다)
    const s = U.soundById(l.soundId) || { id:'', title:'', tone:{ hue:200 } };
    const cat = U.category(l.category);
    const href = U.buyLink(l);
    const ext = cat.mode !== 'inquiry';        // 외부 사이트면 새 탭
    const attr = ext ? 'target="_blank" rel="noopener"' : '';
    const btnCls = 'btn btn-line btn-sm';   // 산호 면은 화면의 주 행동 하나에만 쓴다
    const btnLabel = U.buyLabel(l);
    const E = U.esc;
    const track = `data-track="buy-${E(l.id)}" data-track-title="${E(l.title)}"`;
    const el = document.createElement('div');
    el.className='prod-card';
    el.innerHTML = `
      <a class="prod-thumb" href="${E(href)}" ${attr} ${track} style="background:${U.grad(s.tone.hue)}">
        <span class="cat">${cat.icon} ${cat.label}</span>
        ${l.image
          ? `<img class="photo" src="${E(l.image)}" alt="${E(l.title)}" loading="lazy">`
          : `<span class="emoji">${U.emoji(l)}</span>`}
      </a>
      <div class="prod-body">
        ${s.id ? `<div class="from">🌊 <a href="sound.html?s=${E(s.id)}">${E(s.title)}</a> 소리가 흐르는 곳</div>` : ''}
        <h3><a href="${E(href)}" ${attr} ${track}>${E(l.title)}</a></h3>
        <div class="short">${E(l.short)}</div>
        <div class="price">${
          ((cat.mode==='inquiry' || U.hasLink(l)) && l.price != null)
            ? `${U.krw(l.price)}<small>/ ${E(l.unit)}</small>`
            : `<span class="price-note">가격은 판매처에서 확인</span>`
        }</div>
        <div class="prod-actions">
          <a class="${btnCls}" href="${E(href)}" ${attr} ${track}>${E(btnLabel)}</a>
        </div>
      </div>`;
    return el;
  },

};

/* --- 판매처 클릭 집계 (GoatCounter 이벤트) --------------------------------*/
document.addEventListener('click', (e)=>{
  const a = e.target.closest('a[data-track]');
  if(a && window.goatcounter && typeof goatcounter.count === 'function')
    goatcounter.count({ path: a.dataset.track, title: a.dataset.trackTitle || a.dataset.track, event: true });
});
