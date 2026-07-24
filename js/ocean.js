/* ============================================================================
 * 벙커마켓 · 오디오 엔진
 * 실제 소리 파일(assets/sounds/*.mp3)이 있으면 그것을 재생하고,
 * 아직 없으면 Web Audio 로 파도 소리를 합성해 데모가 항상 동작하게 한다.
 * 소리마다 tone.hue 값으로 음색(필터/리듬)을 살짝 다르게 준다.
 * ==========================================================================*/
const Ocean = (() => {
  let current = null;               // 현재 재생 중인 컨트롤러
  let seq = 0;                      // 재생 세대 토큰 — 늦게 로드된 오디오의 중첩 재생 방지
  let ctx = null;

  function getCtx(){
    if(!ctx) ctx = new (window.AudioContext || window.webkitAudioContext)();
    if(ctx.state === 'suspended') ctx.resume();
    return ctx;
  }

  /* 갈색 잡음(파도 저역) 버퍼 생성 */
  function noiseBuffer(ac){
    const len = ac.sampleRate * 3;
    const buf = ac.createBuffer(1, len, ac.sampleRate);
    const d = buf.getChannelData(0);
    let last = 0;
    for(let i=0;i<len;i++){
      const white = Math.random()*2-1;
      last = (last + 0.02*white)/1.02;
      d[i] = last*3.2;
    }
    return buf;
  }

  /* 합성 파도: 잡음 → 로우패스 → 느린 진폭 LFO(밀려왔다 빠지는 리듬) */
  function synth(hue){
    const ac = getCtx();
    const src = ac.createBufferSource();
    src.buffer = noiseBuffer(ac); src.loop = true;

    const lp = ac.createBiquadFilter();
    lp.type='lowpass';
    lp.frequency.value = 380 + (hue%60)*6;   // hue 로 음색 변화

    const gain = ac.createGain(); gain.gain.value = 0.0001;
    const lfo = ac.createOscillator();
    lfo.frequency.value = 0.13 + (hue%40)/300; // 파도 주기
    const lfoGain = ac.createGain(); lfoGain.gain.value = 0.16;
    lfo.connect(lfoGain).connect(gain.gain);

    const master = ac.createGain(); master.gain.value = 0;
    src.connect(lp).connect(gain).connect(master).connect(ac.destination);

    src.start(); lfo.start();
    master.gain.linearRampToValueAtTime(0.9, ac.currentTime + 1.2);

    return {
      stop(){
        try{
          master.gain.linearRampToValueAtTime(0, ac.currentTime + 0.4);
          setTimeout(()=>{ try{src.stop();lfo.stop();}catch(e){} }, 450);
        }catch(e){}
      }
    };
  }

  /* 파일 재생 시도, 실패 시 합성으로 폴백.
   * 실제 mp3 는 항상 존재하므로 합성음은 '진짜 오류'일 때만 쓴다.
   * 'canplay'(시작 가능)에서 바로 재생하고, 버퍼가 덜 찼다는 이유로
   * 합성음이 끼어들지 않게 한다. settled 가드로 늦은 로드의 중첩을 방지. */
  function playFile(sound){
    return new Promise((resolve)=>{
      const a = new Audio();
      a.loop = true; a.preload = 'auto';
      let done = false;        // resolve 는 딱 한 번
      let triggered = false;   // play() 도 딱 한 번 (canplay/loadeddata 중복 방지)
      const finish = (val)=>{
        if(done) return;
        done = true;
        if(val === null){ try{ a.pause(); a.removeAttribute('src'); a.load(); }catch(e){} }
        resolve(val);
      };
      // 시작 가능한 만큼만 받으면 바로 재생 (전체 버퍼링을 기다리지 않음).
      // 두 이벤트가 함께 발생해도 play() 는 한 번만 — 예전엔 두 번째 play() 가
      // 재생 중인 오디오를 스스로 일시정지시켜 '소리가 안 나던' 버그가 있었다.
      const start = ()=>{
        if(triggered || done) return;
        triggered = true;
        a.play()
          .then(()=> finish({ stop(){ try{ a.pause(); a.removeAttribute('src'); a.load(); }catch(e){} } }))
          .catch(()=> finish(null));
      };
      a.addEventListener('canplay', start, {once:true});
      a.addEventListener('loadeddata', start, {once:true});
      a.addEventListener('error', ()=> finish(null), {once:true});
      // 안전장치: 아주 오래 아무것도 못 받으면(파일 부재 등) 그때만 합성 폴백
      setTimeout(()=>{ if(!done && a.readyState === 0) finish(null); }, 12000);
      a.src = sound.soundFile;
      a.load();
    });
  }

  async function toggle(sound, onState){
    // 이미 이 소리가 재생 중이면 정지
    if(current && current.id === sound.id){ stop(); onState && onState(false); return false; }
    stop();
    const my = ++seq;
    let ctrl = await playFile(sound);
    // 로딩 중에 다른 소리가 시작됐거나 정지됐다면, 이 결과는 폐기
    if(my !== seq){ if(ctrl) ctrl.stop(); onState && onState(false); return false; }
    if(!ctrl) ctrl = synth(sound.tone ? sound.tone.hue : 200);   // 폴백
    current = { id: sound.id, ctrl, onState };
    onState && onState(true);
    return true;
  }

  function stop(){
    seq++;   // 진행 중이던 로딩도 무효화
    if(current){
      current.ctrl.stop();
      current.onState && current.onState(false);
      current = null;
    }
  }

  function isPlaying(id){ return current && current.id === id; }

  return { toggle, stop, isPlaying };
})();
