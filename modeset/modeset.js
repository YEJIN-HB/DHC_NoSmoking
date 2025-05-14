  function selectMode(mode) {
    let modeData = {};

    if (mode === 'easy') {
      modeData = {
        name: 'easy',
        label: 'Easy Mode',
        rule: '3일마다 2개비 감축',
        allowFail: 3
      };
    } else if (mode === 'normal') {
      modeData = {
        name: 'normal',
        label: 'Normal Mode',
        rule: '1주일 단위 50% 감축',
        allowFail: 2
      };
    } else if (mode === 'hard') {
      modeData = {
        name: 'hard',
        label: 'Hard Mode',
        rule: '즉시 완전 금연',
        allowFail: 1
      };
    }

      // 👉 금연 시작일이 없다면 오늘 날짜를 저장 (예외 방지)
  if (!localStorage.getItem('startDate')) {
    const today = new Date().toISOString().split('T')[0];
    localStorage.setItem('startDate', today);
  }

    // 저장
    localStorage.setItem('mode', JSON.stringify(modeData));
    
    alert(`"${modeData.label}"가 선택되었습니다.`);
    
    // 다음 화면으로 이동
    window.location.href = "main.html";
  }