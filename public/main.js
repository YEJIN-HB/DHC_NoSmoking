let profileData = null;
let dayRecords = [];
let currentDate = new Date();
let cravingYear, cravingMonth;
let cigYear, cigMonth;
let cravingChart = null;
let cigChart = null;

function formatDate(date) {
  let y = date.getFullYear();
  let m = String(date.getMonth() + 1).padStart(2, '0');
  let d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

// 서버에서 프로필 불러오기
async function loadProfile() {
  try {
    const res = await fetch("/get-profile");
    profileData = await res.json();
  } catch (e) {
    console.log("프로필 불러오기 실패", e);
  }
}

// 서버에서 기록 불러오기
async function loadRecords() {
  try {
    const res = await fetch("/get-dayrecord");
    dayRecords = await res.json();
  } catch (e) {
    console.log("기록 불러오기 실패", e);
  }
}

// 프로필 정보
function showProfile() {
  if (!profileData) return;
  document.getElementById('name').textContent = profileData.name;
  document.getElementById('age').textContent = profileData.age;
  document.getElementById('start-date').textContent = profileData.startDate;
  document.getElementById('supplements').textContent = profileData.supplements;
  document.getElementById('during').textContent = profileData.diffDays;
  document.getElementById('con-money').textContent = profileData.totalCost;
  document.getElementById('total-tar').textContent = profileData.totalTar;
}

// 오늘 날짜에 맞는 기록 표시
function showTodayRecord() {
  const today = formatDate(currentDate);
  document.getElementById("current-date").textContent = today;

  const found = dayRecords.find(r => r.date === today);

  if (found) {
    document.getElementById("morning-count").textContent = found.count.morning;
    document.getElementById("afternoon-count").textContent = found.count.afternoon;
    document.getElementById("night-count").textContent = found.count.night;
    document.getElementById("today-number").textContent = `하루동안 피운 개비 수: ${found.count.total}`;
    document.getElementById("today-tar").textContent = `섭취한 타르 양: ${found.tar}`;
    document.getElementById("carving-avg").textContent = `흡연욕구(평균): ${found.craving.average}`;
    setBars("morning", found.craving.morning);
    setBars("afternoon", found.craving.afternoon);
    setBars("night", found.craving.night);
  } else {
    document.getElementById("morning-count").textContent = "-";
    document.getElementById("afternoon-count").textContent = "-";
    document.getElementById("night-count").textContent = "-";
    document.getElementById("today-number").textContent = "하루동안 피운 개비 수: -";
    document.getElementById("today-tar").textContent = "섭취한 타르 양: -";
    document.getElementById("carving-avg").textContent = "흡연욕구(평균): -";
    setBars("morning", 0);
    setBars("afternoon", 0);
    setBars("night", 0);
  }
}

// 욕구 레벨 막대
function setBars(time, level) {
  const bars = document.querySelectorAll(`#${time}-craving-bars .bar`);
  bars.forEach((bar, i) => {
    bar.classList.toggle("active", i < level);
  });
}

// 날짜 이동 버튼
function moveDate(dir) {
  currentDate.setDate(currentDate.getDate() + dir);
  showTodayRecord();
}

// 통계 정보 표시
function showStatistics() {
  if (!profileData || !dayRecords) return;
  const dayavg = Number(profileData.dayavg);
  const price = Number(profileData.cost);
  let count = 0;

  for (let record of dayRecords) {
    if (record.today_result === "T") {
      const diff = dayavg - record.count.total;
      if (diff > 0) count += diff;
    }
  }

  const saved = ((count / 20) * price);
  const life = Math.min((count * 11) / 1440, 3650); // 최대 10년

  document.getElementById("unsmoke-count").textContent = `${count}개비`;
  document.getElementById("save-money").textContent = `${saved.toLocaleString()}원`;
  document.getElementById("get-life").textContent = `${life.toFixed(2)}일`;
}

// 연속 성공 일수 계산
function countStreak() {
  let streak = 0;
  for (let record of dayRecords) {
    if (record.today_result === "T") {
      streak++;
    } else {
      streak = 0;
    }
  }
  document.getElementById("continue-day").textContent = `${streak}일`;
}

// 목표 진행률 바 계산
function showProgress() {
  if (!profileData || !profileData.Goal_D) return;
  const goal = Number(profileData.Goal_D);
  let streak = 0;

  for (let record of dayRecords) {
    if (record.today_result === "T") {
      streak++;
    } else {
      streak = 0;
    }
  }

  const percent = Math.min((streak / goal) * 100, 100).toFixed(1);
  document.getElementById("goal-progress-bar").style.width = `${percent}%`;
  document.getElementById("goal-progress-text").textContent = `${percent}% 달성`;
}
//날짜 이동
//---------------------------------------
function setupDateButtons() {
  // 이전 날 버튼
  document.getElementById("prev-day").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    showTodayRecord();
  });

  // 다음 날 버튼
  document.getElementById("next-day").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    showTodayRecord();
  });
}

function setupMonthButtons() {
  console.log("setupMonthButtons 실행됨");

  // craving 초기화
  cravingYear = currentDate.getFullYear();
  cravingMonth = currentDate.getMonth() + 1;
  updateCravingMonthDisplay();
  drawCravingChart();

  // cig 초기화
  cigYear = currentDate.getFullYear();
  cigMonth = currentDate.getMonth() + 1;
  updateCigMonthDisplay();
  drawCigChart();

  // craving 월 이동 버튼
  document.getElementById("craving-prev").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    cravingYear = currentDate.getFullYear();
    cravingMonth = currentDate.getMonth() + 1;
    updateCravingMonthDisplay();
    drawCravingChart();
  });

  document.getElementById("craving-next").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    cravingYear = currentDate.getFullYear();
    cravingMonth = currentDate.getMonth() + 1;
    updateCravingMonthDisplay();
    drawCravingChart();
  });

  // cig 월 이동 버튼
  document.getElementById("cig-prev").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() - 1);
    cigYear = currentDate.getFullYear();
    cigMonth = currentDate.getMonth() + 1;
    updateCigMonthDisplay();
    drawCigChart();
  });

  document.getElementById("cig-next").addEventListener("click", () => {
    currentDate.setMonth(currentDate.getMonth() + 1);
    cigYear = currentDate.getFullYear();
    cigMonth = currentDate.getMonth() + 1;
    updateCigMonthDisplay();
    drawCigChart();
  });
}



//---------------------------------------------
// 흡연 욕구 날짜 업데이트

function updateCravingMonthDisplay() {
  const text = `${cravingYear}.${String(cravingMonth).padStart(2, '0')}`;
  document.getElementById("craving-month").textContent = text;
}
function updateCigMonthDisplay() {
  const text = `${cigYear}.${String(cigMonth).padStart(2, '0')}`;
  document.getElementById("cig-month").textContent = text;
}

// 흡연 욕구 변화 그래프
function drawCravingChart() {
  const ctx = document.getElementById("craving").getContext("2d");
  const labels = [], morning = [], afternoon = [], night = [];

  for (let r of dayRecords) {
    const [y, m] = r.date.split(/[-.]/).map(Number);
    if (y === cravingYear && m === cravingMonth) {
      labels.push(r.date);
      morning.push(r.craving?.morning ?? 0);
      afternoon.push(r.craving?.afternoon ?? 0);
      night.push(r.craving?.night ?? 0);
    }
  }

  // 기존 차트 제거
  if (cravingChart) {
    cravingChart.destroy();
  }

  // 새 차트 생성 및 저장
  cravingChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "오전", data: morning, borderColor: "red", fill: false },
        { label: "오후", data: afternoon, borderColor: "blue", fill: false },
        { label: "밤", data: night, borderColor: "green", fill: false }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { min: 0, max: 10 }
      }
    }
  });
}

// 흡연 개비 수 변화 그래프
function drawCigChart() {
  const ctx = document.getElementById("cig-count").getContext("2d");
  const labels = [], totals = [];

  for (let r of dayRecords) {
    const [y, m] = r.date.split(/[-.]/).map(Number); // ← craving과 동일하게 처리
    if (y === cigYear && m === cigMonth) {
      labels.push(r.date);
      totals.push(r.count?.total ?? 0);
    }
  }

  // 기존 차트 제거
  if (cigChart) {
    cigChart.destroy();
  }

  // 새 차트 생성 및 저장
  cigChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "총 개비 수", data: totals, borderColor: "purple", fill: false }
      ]
    },
    options: {
      responsive: true,
      scales: {
        y: { beginAtZero: true }
      }
    }
  });
}

// 페이지 로드 후 실행
async function main() {
  await loadProfile();
  await loadRecords();
  console.log("📦 dayRecords = ", dayRecords);
  showProfile();
  showTodayRecord();
  showStatistics();
  countStreak();
  showProgress();
  drawCravingChart();
  drawCigChart();
  setupMonthButtons();

  document.getElementById("prev-day").addEventListener("click", () => moveDate(-1));
  document.getElementById("next-day").addEventListener("click", () => moveDate(1));
}

document.addEventListener("DOMContentLoaded", () => {
  setupDateButtons(); 
  main();            
});