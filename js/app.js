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
  // hue → 바다빛 그라디언트
  grad(hue){ return `linear-gradient(155deg, hsl(${hue} 55% 26%), hsl(${(hue+22)%360} 60% 16%))`; },
  emoji(listing){
    const map={ '마늘':'🧄','당근':'🥕','브로콜리':'🥦','감자':'🥔','땅콩':'🥜',
      '양배추':'🥬','옥수수':'🌽','집':'🏡','주택':'🏡' };
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
    const el = document.createElement('div');
    el.className='prod-card';
    el.innerHTML = `
      <a class="prod-thumb" href="product.html?p=${l.id}" style="background:${U.grad(s.tone.hue)}">
        <span class="cat">${cat.icon} ${cat.label}</span>
        <span class="emoji">${U.emoji(l)}</span>
      </a>
      <div class="prod-body">
        <div class="from">🌊 <a href="sound.html?s=${s.id}">${s.title}</a> 이(가) 키움</div>
        <h3><a href="product.html?p=${l.id}">${l.title}</a></h3>
        <div class="short">${l.short}</div>
        <div class="price">${U.krw(l.price)}<small>/ ${l.unit}</small></div>
        <div class="prod-actions"></div>
      </div>`;
    const actions = el.querySelector('.prod-actions');
    if(cat.mode === 'cart'){
      const b=document.createElement('button'); b.className='btn btn-accent btn-sm'; b.textContent=cat.cta;
      b.onclick=()=>{ Store.add(l.id); UI.toast(`장바구니에 담았어요 · ${l.title}`); UI.openDrawer(); };
      actions.appendChild(b);
    }else{
      const b=document.createElement('a'); b.className='btn btn-line btn-sm'; b.textContent=cat.cta;
      b.href=`product.html?p=${l.id}#inquiry`;
      actions.appendChild(b);
    }
    return el;
  },

  /* --- 장바구니 드로어 --------------------------------------------------*/
  mountDrawer(){
    if(document.querySelector('.drawer')) return;
    const mask=document.createElement('div'); mask.className='drawer-mask';
    const d=document.createElement('aside'); d.className='drawer';
    d.innerHTML=`
      <header><h3>장바구니</h3><button class="x" aria-label="닫기">×</button></header>
      <div class="items"></div>
      <footer>
        <div class="tot"><span>합계</span><b class="t-sum">0원</b></div>
        <button class="btn btn-accent" style="width:100%" id="go-checkout">주문하기</button>
        <p class="muted center" style="font-size:12px;margin-top:10px">주문 접수 후 계좌·수령 방법을 문자로 안내드려요.</p>
      </footer>`;
    document.body.append(mask, d);
    mask.onclick=()=>UI.closeDrawer();
    d.querySelector('.x').onclick=()=>UI.closeDrawer();
    d.querySelector('#go-checkout').onclick=()=>{ location.href='checkout.html'; };

    Store.onChange(()=>UI.renderDrawer());
    this._drawer=d; this._mask=mask;
  },
  openDrawer(){ this.mountDrawer(); this._mask.classList.add('open'); this._drawer.classList.add('open'); },
  closeDrawer(){ this._mask.classList.remove('open'); this._drawer.classList.remove('open'); },
  renderDrawer(){
    if(!this._drawer) return;
    const box=this._drawer.querySelector('.items');
    const items=Store.detailed();
    if(!items.length){ box.innerHTML=`<div class="empty">바구니가 비어 있어요.<br>소리가 키운 것들을 담아보세요 🌊</div>`; }
    else{
      box.innerHTML='';
      items.forEach(i=>{
        const s=U.soundById(i.soundId);
        const row=document.createElement('div'); row.className='ci';
        row.innerHTML=`
          <div class="ic" style="background:${U.grad(s.tone.hue)}">${U.emoji(i)}</div>
          <div class="g"><div class="t">${i.title}</div><div class="p">${U.krw(i.price)} · ${i.unit}</div></div>
          <div class="qty">
            <button class="minus">−</button><span>${i.qty}</span><button class="plus">+</button>
          </div>`;
        row.querySelector('.minus').onclick=()=>Store.setQty(i.id, i.qty-1);
        row.querySelector('.plus').onclick=()=>Store.setQty(i.id, i.qty+1);
        box.appendChild(row);
      });
    }
    this._drawer.querySelector('.t-sum').textContent = U.krw(Store.total());
  },
};

/* --- 헤더 장바구니 배지 자동 연결 --------------------------------------- */
function wireHeader(){
  UI.mountDrawer();
  const cartBtn=document.querySelector('.cart-btn');
  if(cartBtn){
    cartBtn.addEventListener('click',(e)=>{ e.preventDefault(); UI.openDrawer(); });
    Store.onChange(()=>{
      let b=cartBtn.querySelector('.badge');
      const n=Store.count();
      if(!b){ b=document.createElement('span'); b.className='badge'; cartBtn.appendChild(b); }
      b.textContent=n; b.style.display = n? 'inline-flex':'none';
    });
  }
}
document.addEventListener('DOMContentLoaded', wireHeader);
