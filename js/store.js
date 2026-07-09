/* ============================================================================
 * 벙커마켓 · 장바구니 / 주문 저장소 (localStorage)
 * 결제 방식(주문 폼 + 계좌/문자)에 맞춘 MVP.
 * 실제 PG 연동 시 checkout() 만 교체하면 된다.
 * ==========================================================================*/
const Store = (() => {
  const KEY = 'bunker.cart.v1';
  let listeners = [];

  function read(){ try{ return JSON.parse(localStorage.getItem(KEY)) || {}; }catch(e){ return {}; } }
  function write(c){ localStorage.setItem(KEY, JSON.stringify(c)); emit(); }
  function emit(){ listeners.forEach(fn=>fn(read())); }

  function onChange(fn){ listeners.push(fn); fn(read()); }

  function add(id, qty=1){
    const c = read(); c[id] = (c[id]||0) + qty; write(c);
  }
  function setQty(id, qty){
    const c = read();
    if(qty<=0) delete c[id]; else c[id]=qty;
    write(c);
  }
  function remove(id){ const c=read(); delete c[id]; write(c); }
  function clear(){ write({}); }

  function count(){ return Object.values(read()).reduce((a,b)=>a+b,0); }

  /* 장바구니 상세 (LISTINGS 조인) */
  function detailed(){
    const c = read();
    return Object.entries(c).map(([id,qty])=>{
      const item = window.BUNKER.LISTINGS.find(l=>l.id===id);
      return item ? {...item, qty} : null;
    }).filter(Boolean);
  }
  function total(){ return detailed().reduce((s,i)=>s + i.price*i.qty, 0); }

  return { onChange, add, setQty, remove, clear, count, detailed, total };
})();
