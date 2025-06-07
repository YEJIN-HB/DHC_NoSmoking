// ✅ 전역 변수
let dayRecordData = [];
let currentDate = new Date();
let continue_day = 0;
let profileData = null;
let cravingChart = null;
let cigChart = null;
let cravingYear, cravingMonth;
let cigYear, cigMonth;

// 🔹 날짜 포맷 (YYYY.MM.DD 형태)
function formatDate(date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

// 🔹 프로필 데이터 불러오기 (공통)
async function loadProfileData() {
  try {
    const response = await fetch("/get-profile");
    profileData = await response.json();
  } catch (err) {
    console.error("프로필 데이터 불러오기 실패:", err);
  }
}

// 🔹 일일 기록 불러오기 (공통)
async function loadDayRecordData() {
  try {
    const response = await fetch("/get-dayrecord");
    dayRecordData = await response.json();
  } catch (err) {
    console.error("흡연 기록 불러오기 실패:", err);
  }
}

// 🔹 메인용 프로필 반영
function applyProfileToMain() {
  if (!profileData) return;
  document.getElementById('name').textContent = profileData.name;
  document.getElementById('age').textContent = profileData.age;
  document.getElementById('start-date').textContent = profileData.startDate;
  document.getElementById('supplements').textContent = profileData.supplements;
  document.getElementById('during').textContent = profileData.diffDays;
  document.getElementById('con-money').textContent = profileData.totalCost;
  document.getElementById('total-tar').textContent = profileData.totalTar;
}

// 🔹 메인용 날짜 기반 UI 업데이트
function updateTodayRecordUI() {
  const dateStr = formatDate(currentDate);
  document.getElementById("current-date").textContent = dateStr;
  const todayData = dayRecordData.find(item => item.date === dateStr);

  if (todayData) {
    document.getElementById("morning-count").textContent = todayData.count.morning;
    document.getElementById("afternoon-count").textContent = todayData.count.afternoon;
    document.getElementById("night-count").textContent = todayData.count.night;
    document.getElementById("today-number").textContent = `하루동안 피운 개비 수: ${todayData.count.total}`;
    document.getElementById("today-tar").textContent = `섭취한 타르 양: ${todayData.tar}`;
    document.getElementById("carving-avg").textContent = `흡연욕구(평균): ${todayData.craving.average}`;
    highlightCravingBars("morning", todayData.craving.morning);
    highlightCravingBars("afternoon", todayData.craving.afternoon);
    highlightCravingBars("night", todayData.craving.night);
  } else {
    ["morning", "afternoon", "night"].forEach(time => {
      document.getElementById(`${time}-count`).textContent = "-";
      highlightCravingBars(time, 0);
    });
    document.getElementById("today-number").textContent = "하루동안 피운 개비 수: -";
    document.getElementById("today-tar").textContent = "섭취한 타르 양: -";
    document.getElementById("carving-avg").textContent = "흡연욕구(평균): -";
  }
}

function highlightCravingBars(period, level) {
  const bars = document.querySelectorAll(`#${period}-craving-bars .bar`);
  bars.forEach((bar, index) => {
    bar.classList.toggle("active", index < level);
  });
}

// 🔹 날짜 이동 버튼
function setupDateButtons() {
  document.getElementById("prev-day").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() - 1);
    updateTodayRecordUI();
  });
  document.getElementById("next-day").addEventListener("click", () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateTodayRecordUI();
  });
}

// 🔹 통계 계산 및 반영
function applyStatistics() {
  if (!dayRecordData || !profileData) return;
  const dayavg = Number(profileData.dayavg);
  const cost = Number(profileData.cost);
  let noSmokeCount = 0;

  for (const record of dayRecordData) {
    if (record.today_result === "T") {
      const total = record.count?.total ?? 0;
      const diff = dayavg - total;
      if (diff > 0) noSmokeCount += diff;
    }
  }

  const saveMoney = Math.floor((noSmokeCount / 20) * cost);
  const lifeInDays = Math.min((noSmokeCount * 11) / 1440, 3650);

  document.getElementById("unsmoke-count").textContent = `${noSmokeCount}개비`;
  document.getElementById("save-money").textContent = `${saveMoney.toLocaleString()}원`;
  document.getElementById("get-life").textContent = `${lifeInDays.toFixed(2)}일`;
}

// 🔹 연속 성공 일수 계산
function applyStreak() {
  let tempStreak = 0;
  for (const record of dayRecordData) {
    if (record.today_result === "T") {
      tempStreak += 1;
      continue_day = tempStreak;
    } else {
      tempStreak = 0;
    }
  }
  document.getElementById("continue-day").textContent = `${continue_day}일`;
}

// 🔹 월별 상태 초기화 및 버튼
function initMonthlyState() {
  const today = new Date();
  cravingYear = cigYear = today.getFullYear();
  cravingMonth = cigMonth = today.getMonth() + 1;
  updateCravingMonthDisplay();
  updateCigMonthDisplay();
  setupCravingButtons();
  setupCigButtons();
}

function updateCravingMonthDisplay() {
  document.getElementById("craving-month").textContent = `${cravingYear}.${String(cravingMonth).padStart(2, "0")}`;
}

function updateCigMonthDisplay() {
  document.getElementById("cig-month").textContent = `${cigYear}.${String(cigMonth).padStart(2, "0")}`;
}

function setupCravingButtons() {
  document.getElementById("craving-prev").addEventListener("click", () => {
    cravingMonth--;
    if (cravingMonth < 1) {
      cravingMonth = 12;
      cravingYear--;
    }
    updateCravingMonthDisplay();
    drawCravingChart();
  });

  document.getElementById("craving-next").addEventListener("click", () => {
    cravingMonth++;
    if (cravingMonth > 12) {
      cravingMonth = 1;
      cravingYear++;
    }
    updateCravingMonthDisplay();
    drawCravingChart();
  });
}

function setupCigButtons() {
  document.getElementById("cig-prev").addEventListener("click", () => {
    cigMonth--;
    if (cigMonth < 1) {
      cigMonth = 12;
      cigYear--;
    }
    updateCigMonthDisplay();
    drawCigaretteCountChart();
  });

  document.getElementById("cig-next").addEventListener("click", () => {
    cigMonth++;
    if (cigMonth > 12) {
      cigMonth = 1;
      cigYear++;
    }
    updateCigMonthDisplay();
    drawCigaretteCountChart();
  });
}

// 🔹 그래프 함수
function drawCravingChart() {
  if (!dayRecordData || dayRecordData.length === 0) return;
  const labels = [], morning = [], afternoon = [], night = [];

  dayRecordData.sort((a, b) => new Date(a.date.replaceAll('.', '-')) - new Date(b.date.replaceAll('.', '-')));
  for (const r of dayRecordData) {
    const [y, m] = r.date.split(".").map(Number);
    if (y === cravingYear && m === cravingMonth) {
      labels.push(r.date);
      morning.push(r.craving?.morning ?? 0);
      afternoon.push(r.craving?.afternoon ?? 0);
      night.push(r.craving?.night ?? 0);
    }
  }
  const ctx = document.getElementById("craving").getContext("2d");
  if (cravingChart) cravingChart.destroy();
  cravingChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        { label: "아침", data: morning, borderColor: "#f06292", backgroundColor: "transparent", tension: 0.3 },
        { label: "오후", data: afternoon, borderColor: "#42a5f5", backgroundColor: "transparent", tension: 0.3 },
        { label: "밤", data: night, borderColor: "#ffca28", backgroundColor: "transparent", tension: 0.3 }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "top" }, title: { display: false } },
      scales: {
        y: {
          min: 0,
          max: 10,
          title: { display: true, text: "욕구 레벨 (0~10)" }
        }
      }
    }
  });
}

function drawCigaretteCountChart() {
  if (!dayRecordData || dayRecordData.length === 0) return;
  const labels = [], totals = [];

  dayRecordData.sort((a, b) => new Date(a.date.replaceAll('.', '-')) - new Date(b.date.replaceAll('.', '-')));
  for (const r of dayRecordData) {
    const [y, m] = r.date.split(".").map(Number);
    if (y === cigYear && m === cigMonth) {
      labels.push(r.date);
      totals.push(r.count?.total ?? 0);
    }
  }
  const ctx = document.getElementById("cig-count").getContext("2d");
  if (cigChart) cigChart.destroy();
  cigChart = new Chart(ctx, {
    type: "line",
    data: {
      labels,
      datasets: [
        {
          label: "총 흡연 개비 수",
          data: totals,
          borderColor: "#9575cd",
          backgroundColor: "rgba(149, 117, 205, 0.2)",
          fill: true,
          tension: 0.3,
          pointRadius: 4,
          pointHoverRadius: 6
        }
      ]
    },
    options: {
      responsive: true,
      plugins: { legend: { position: "top" }, title: { display: false } },
      scales: {
        y: { beginAtZero: true, title: { display: true, text: "개비 수" } }
      }
    }
  });
}

function applyGoalProgress() {
  if (!profileData || !profileData.Goal_D) return;

  const goal = Number(profileData.Goal_D);
  const achieved = continue_day;
  const percent = Math.min((achieved / goal) * 100, 100).toFixed(1);

  document.getElementById("goal-progress-bar").style.width = `${percent}%`;
  document.getElementById("goal-progress-text").textContent = `${percent}% 달성`;
}


// 🔹 실행
async function main() {
  await loadProfileData();
  await loadDayRecordData();
  applyProfileToMain();
  updateTodayRecordUI();
  applyStatistics();
  applyStreak();
  initMonthlyState();
  drawCravingChart();
  drawCigaretteCountChart();
  setupDateButtons();
  applyGoalProgress()
}

document.addEventListener("DOMContentLoaded", main);
