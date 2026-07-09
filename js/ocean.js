/* ============================================================================
 * 벙커마켓 · 오디오 엔진
 * 실제 소리 파일(assets/sounds/*.mp3)이 있으면 그것을 재생하고,
 * 아직 없으면 Web Audio 로 파도 소리를 합성해 데모가 항상 동작하게 한다.
 * 소리마다 tone.hue 값으로 음색(필터/리듬)을 살짝 다르게 준다.
 * ==========================================================================*/
const Ocean = (() => {
  let current = null;               // 현재 재생 중인 컨트롤러
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

  /* 파일 재생 시도, 실패 시 합성으로 폴백 */
  function playFile(sound){
    return new Promise((resolve)=>{
      const a = new Audio(sound.soundFile);
      a.loop = true;
      a.addEventListener('canplaythrough', ()=>{
        a.play().then(()=>resolve({stop(){a.pause();a.currentTime=0;}}))
                .catch(()=>resolve(null));
      }, {once:true});
      a.addEventListener('error', ()=>resolve(null), {once:true});
      // 파일이 없으면 error 이벤트가 늦게 올 수 있어 타임아웃 폴백
      setTimeout(()=>{ if(a.readyState < 3){ resolve(null); } }, 1200);
      a.load();
    });
  }

  async function toggle(sound, onState){
    // 이미 이 소리가 재생 중이면 정지
    if(current && current.id === sound.id){ stop(); onState && onState(false); return false; }
    stop();
    let ctrl = await playFile(sound);
    if(!ctrl) ctrl = synth(sound.tone ? sound.tone.hue : 200);   // 폴백
    current = { id: sound.id, ctrl, onState };
    onState && onState(true);
    return true;
  }

  function stop(){
    if(current){
      current.ctrl.stop();
      current.onState && current.onState(false);
      current = null;
    }
  }

  function isPlaying(id){ return current && current.id === id; }

  return { toggle, stop, isPlaying };
})();
