/* ============================================================================
 * 벙커마켓 · 공용 UI / 렌더 헬퍼
 * ==========================================================================*/
const U = {
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
  // hue → 바다빛 그라디언트
  grad(hue){ return `linear-gradient(155deg, hsl(${hue} 55% 26%), hsl(${(hue+22)%360} 60% 16%))`; },
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

  /* --- 소리 카드 --------------------------------------------------------*/
  soundCard(s){
    const el = document.createElement('a');
    el.className='sound-card'; el.href=`sound.html?s=${s.id}`;
    el.style.background = U.grad(s.tone.hue);
    el.innerHTML = `
      <div class="sc-overlay"></div>
      <span class="code">${s.code}</span>
      <button class="play" aria-label="소리 듣기">▶</button>
      <div style="position:relative;z-index:2">
        <h3>${s.title}</h3>
        <div class="spot">${s.region.area} · ${s.region.spot}</div>
        <div class="tags">${s.tags.map(t=>`<span>${t}</span>`).join('')}</div>
      </div>`;
    const btn = el.querySelector('.play');
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      Ocean.toggle(s, on=>{ btn.innerHTML = on ? '<span class="eq"><i></i><i></i><i></i><i></i></span>' : '▶'; });
    });
    return el;
  },

  /* --- 상품 카드 --------------------------------------------------------*/
  productCard(l){
    const s = U.soundById(l.soundId);
    const cat = U.category(l.category);
    const href = U.buyLink(l);
    const ext = cat.mode !== 'inquiry';        // 외부 사이트면 새 탭
    const attr = ext ? 'target="_blank" rel="noopener"' : '';
    const btnCls = cat.mode === 'inquiry' ? 'btn btn-line btn-sm' : 'btn btn-accent btn-sm';
    const btnLabel = U.buyLabel(l);
    const el = document.createElement('div');
    el.className='prod-card';
    el.innerHTML = `
      <a class="prod-thumb" href="${href}" ${attr} style="background:${U.grad(s.tone.hue)}">
        <span class="cat">${cat.icon} ${cat.label}</span>
        <span class="pick">🌊 산지 큐레이션</span>
        <span class="emoji">${U.emoji(l)}</span>
      </a>
      <div class="prod-body">
        <div class="from">🌊 <a href="sound.html?s=${s.id}">${s.title}</a> 소리가 흐르는 곳</div>
        <h3><a href="${href}" ${attr}>${l.title}</a></h3>
        <div class="short">${l.short}</div>
        <div class="price">${
          ((cat.mode==='inquiry' || U.hasLink(l)) && l.price != null)
            ? `${U.krw(l.price)}<small>/ ${l.unit}</small>`
            : `<small class="muted" style="font-weight:500">가격은 판매처에서 확인</small>`
        }</div>
        <div class="prod-actions">
          <a class="${btnCls}" href="${href}" ${attr}>${btnLabel}</a>
        </div>
      </div>`;
    return el;
  },

};
