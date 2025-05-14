window.onload = function () {
  // 1. 저장된 모드 불러오기
  const modeData = JSON.parse(localStorage.getItem('mode'));

  if (modeData) {
    const labelEl = document.getElementById('mode-label');
    const ruleEl = document.getElementById('mode-rule');

    labelEl.textContent = modeData.label || '모드 없음';
    ruleEl.textContent = modeData.rule || '';
  } else {
    console.warn("저장된 모드 정보가 없습니다.");
  }

  // 2. 금연 시작일 가져오기 및 일수 계산
  const startDateStr = localStorage.getItem('startDate');
  const daysEl = document.getElementById('days-since');
  const phaseEl = document.getElementById('time-phase');
  const startDateText = document.getElementById('start-date'); // (선택사항) 금연 시작일 텍스트용

  if (startDateStr) {
    const startDate = new Date(startDateStr);
    const today = new Date();

    // 자정 기준 날짜 차이 계산
    startDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    const diffDays = Math.floor((today - startDate) / (1000 * 60 * 60 * 24)) + 1;

    daysEl.textContent = `${diffDays}일차`;

    // (선택) 금연 시작일 텍스트 표시
    if (startDateText) {
      startDateText.textContent = startDateStr;
    }
  } else {
    daysEl.textContent = `금연일 미지정`;
  }

  // 3. 현재 시간에 따라 시간대 표시
  const hour = new Date().getHours();
  let phase = "";

  if (hour >= 7 && hour < 12) {
    phase = "오전";
  } else if (hour >= 12 && hour < 18) {
    phase = "점심";
  } else if (hour >= 18 && hour <= 24) {
    phase = "저녁";
  } else {
    phase = "새벽";
  }

  phaseEl.textContent = `Time (${phase})`;
};
