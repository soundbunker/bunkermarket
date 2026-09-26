/* ============================================================================
 * 벙커마켓 · 오디오 엔진
 * 실제 녹음(assets/sounds/*.mp3)만 재생한다. 불러오지 못하면(약한 망·파일 오류)
 * 합성음으로 대신하지 않고 정지 상태로 되돌린 뒤 '다시 눌러주세요'라고 알린다.
 * ==========================================================================*/
const Ocean = (() => {
  let current = null;               // 현재 재생 중인 컨트롤러
  let seq = 0;                      // 재생 세대 토큰 — 늦게 로드된 오디오의 중첩 재생 방지

  /* 파일 재생 시도. 성공하면 컨트롤러, 불러오기 실패면 null, 브라우저 차단이면 'blocked'.
   * 'canplay'(시작 가능)에서 바로 재생한다. done 가드로 늦은 로드의 중첩을 방지. */
  function playFile(sound){
    return new Promise((resolve)=>{
      const a = new Audio();
      a.loop = true; a.preload = 'auto';
      let done = false;        // resolve 는 딱 한 번
      let triggered = false;   // play() 도 딱 한 번 (canplay/loadeddata 중복 방지)
      const finish = (val)=>{
        if(done) return;
        done = true;
        if(val === null || val === 'blocked'){ try{ a.pause(); a.removeAttribute('src'); a.load(); }catch(e){} }
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
          .catch(e=> finish(e && e.name === 'NotAllowedError' ? 'blocked' : null));
      };
      a.addEventListener('canplay', start, {once:true});
      a.addEventListener('loadeddata', start, {once:true});
      a.addEventListener('error', ()=> finish(null), {once:true});
      // 안전장치: 아주 오래 아무것도 못 받으면(약한 망·파일 부재) 실패로 끝낸다
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
    if(my !== seq){ if(ctrl && ctrl.stop) ctrl.stop(); onState && onState(false); return false; }
    if(ctrl === 'blocked' || !ctrl){   // 정지 상태로 되돌리고 다시 누르도록 안내
      onState && onState(false);
      if(typeof UI !== 'undefined' && UI.toast)
        UI.toast(ctrl === 'blocked' ? '재생 버튼을 다시 눌러주세요' : '소리를 불러오지 못했어요. 다시 눌러주세요');
      return false;
    }
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
