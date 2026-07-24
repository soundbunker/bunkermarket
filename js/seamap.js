/* ============================================================================
 * 벙커마켓 · 제주 소리 지도
 * 외부 지도 API 없이 자체 SVG 로 그린 스타일라이즈드 제주.
 * coords 있는 소리는 핀으로 찍히고, 핀을 누르면 그 소리가 바로 재생된다.
 * (Ocean 엔진이 단독 재생을 보장하므로 핀 사이를 옮겨 다니며 들을 수 있다)
 * 좌표 투영: lat 33.16~33.57 / lng 126.14~126.96 → viewBox 1000x480
 * ==========================================================================*/
const SeaMap = (() => {
  const B = { latMax: 33.57, latMin: 33.16, lngMin: 126.14, lngMax: 126.96 };

  /* 해안선 (주요 지점을 실제 좌표로 투영해 손으로 다듬은 폴리곤) */
  const COAST = [
    [455,110],[541,102],[748,71],[791,73],[910,109],[961,153],   // 북안: 용두암→성산
    [843,286],[701,329],[583,361],[512,366],[417,375],[337,362], // 동남→남안
    [216,384],[145,394],[49,310],[127,266],[121,227],[204,158],[382,125], // 서남→서북안
  ];
  /* 부속섬: 우도 · 가파도 · 차귀도 · 비양도 */
  const ISLES = [[975,125,13],[170,433,9],[22,300,7],[110,208,6]];
  /* 지도 범위 밖 소리의 고정 위치 (추자도 인셋) */
  const FIXED = { chujado: [632, 28] };

  function xy(s){
    if(FIXED[s.id]) return { x: FIXED[s.id][0], y: FIXED[s.id][1] };
    return {
      x: 15 + 970 * (s.coords.lng - B.lngMin) / (B.lngMax - B.lngMin),
      y: 60 + 380 * (B.latMax - s.coords.lat) / (B.latMax - B.latMin),
    };
  }

  /* 꼭짓점을 중점-쿼드 곡선으로 이어 부드러운 해안선 만들기 */
  function smooth(pts){
    const n = pts.length;
    const mid = (a,b)=>[(a[0]+b[0])/2,(a[1]+b[1])/2];
    let m = mid(pts[n-1], pts[0]);
    let d = `M ${m[0]} ${m[1]}`;
    for(let i=0;i<n;i++){
      const p = pts[i], m2 = mid(p, pts[(i+1)%n]);
      d += ` Q ${p[0]} ${p[1]} ${m2[0]} ${m2[1]}`;
    }
    return d + ' Z';
  }

  function render(el, sounds){
    const onMap = sounds.filter(s => s.coords || FIXED[s.id]);
    const offMap = sounds.filter(s => !s.coords && !FIXED[s.id]);

    const pins = onMap.map(s=>{
      const p = xy(s);
      return `<g class="pin" data-id="${s.id}" transform="translate(${p.x},${p.y})" tabindex="0" role="button" aria-label="${s.title} 재생">
        <circle class="halo" r="11"></circle>
        <circle class="dot" r="7" fill="hsl(${s.tone.hue} 72% 62%)"></circle>
        <title>${s.code} · ${s.title} — ${s.region.spot}</title>
      </g>`;
    }).join('');

    el.innerHTML = `
      <div class="seamap-panel">
        <svg viewBox="0 0 1000 480" role="img" aria-label="제주 소리 지도">
          <path class="isle" d="${smooth(COAST)}"/>
          ${ISLES.map(c=>`<circle class="isle" cx="${c[0]}" cy="${c[1]}" r="${c[2]}"/>`).join('')}
          <g class="inset">
            <rect x="602" y="6" width="264" height="44" rx="12"/>
            <text x="662" y="34">추자도 · 북쪽 먼바다</text>
          </g>
          ${pins}
        </svg>
        <div class="seamap-now" id="seamapNow">🌊 핀을 누르면 그 바다의 소리가 들려요</div>
        ${offMap.length ? `<div class="seamap-chips">
          ${offMap.map(s=>`<button class="chip" data-id="${s.id}">▶ ${s.title}</button>`).join('')}
          <span style="font-size:12px;color:rgba(255,255,255,.55)">— 지도 밖의 소리</span>
        </div>` : ''}
      </div>`;

    const now = el.querySelector('#seamapNow');
    el.querySelectorAll('.pin,.chip').forEach(node=>{
      const s = sounds.find(x=>x.id===node.dataset.id);
      const play = ()=>{
        if(!Ocean.isPlaying(s.id)) now.textContent = `… ${s.title} 여는 중`;
        Ocean.toggle(s, on=>{
          node.classList.toggle('playing', on);
          now.innerHTML = on
            ? `<span class="eq"><i></i><i></i><i></i><i></i></span>&ensp;${s.code} · <b>${s.title}</b> — ${s.region.area} · ${s.region.spot}&ensp;<span style="opacity:.6">(다시 누르면 멈춰요)</span>`
            : '🌊 핀을 누르면 그 바다의 소리가 들려요';
          if(on && window.goatcounter && typeof goatcounter.count==='function')
            goatcounter.count({ path:'map-'+s.id, title:'지도 재생 '+s.title, event:true });
        });
      };
      node.addEventListener('click', play);
      node.addEventListener('keydown', e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); play(); } });
    });
  }

  return { render };
})();
