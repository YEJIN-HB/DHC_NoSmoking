// ✅ 전역 변수
let dayRecordData = [];
let continue_day = 0;
let profileData = null;
let cravingChart = null;
let cigChart = null;
let cravingYear, cravingMonth;
let cigYear, cigMonth;

// 🔹 profile.json 불러오기
async function profilelogJSONData() {
  try {
    const response = await fetch("/get-profile");
    profileData = await response.json();
  } catch (err) {
    console.error("프로필 데이터 불러오기 실패:", err);
  }
}

// 🔹 day-record.json 불러오기
async function dayrecordlogJSONData() {
  try {
    const response = await fetch("/get-dayrecord");
    dayRecordData = await response.json();
  } catch (err) {
    console.error("흡연 기록 불러오기 실패:", err);
  }
}

// 🔹 연속 성공 일수 계산
function printDatesFromStartToToday() {
  if (!dayRecordData || dayRecordData.length === 0) return;

  dayRecordData.sort((a, b) =>
    new Date(a.date.replace(/\./g, "-")) - new Date(b.date.replace(/\./g, "-"))
  );

  let tempStreak = 0;
  let lastStreak = 0;

  for (const record of dayRecordData) {
    if (record.today_result === "T") {
      tempStreak += 1;
      lastStreak = tempStreak;
    } else {
      tempStreak = 0;
    }
  }

  continue_day = lastStreak;

  const target = document.getElementById("continue-day");
  if (target) {
    target.textContent = `${continue_day}일`;
  }
}

// 🔹 피우지 않은 개비 수, 절약 금액, 수명 계산
function printNoSmokeNumberAndSavings() {
  if (!dayRecordData || !profileData) return;

  const dayavg = Number(profileData.dayavg);
  const cost = Number(profileData.cost);

  if (isNaN(dayavg) || isNaN(cost)) return;

  let noSmokeCount = 0;

  for (const record of dayRecordData) {
    if (record.today_result === "T") {
      const total = record.count?.total ?? 0;
      const diff = dayavg - total;
      if (diff > 0) noSmokeCount += diff;
    }
  }

  const saveMoney = Math.floor((noSmokeCount / 20) * cost);

  const countTarget = document.getElementById("unsmoke-count");
  const moneyTarget = document.getElementById("save-money");
  const lifeTarget = document.getElementById("get-life");

  if (countTarget) countTarget.textContent = `${noSmokeCount}개비`;
  if (moneyTarget) moneyTarget.textContent = `${saveMoney.toLocaleString()}원`;
  if (lifeTarget) {
    const lifeInDays = (noSmokeCount * 11) / 1440;
    const limitedLife = Math.min(lifeInDays, 3650);
    lifeTarget.textContent = `${limitedLife.toFixed(2)}일`;
  }
}

// 🔹 월 초기화
function initMonths() {
  const today = new Date();
  cravingYear = today.getFullYear();
  cravingMonth = today.getMonth() + 1;
  cigYear = cravingYear;
  cigMonth = cravingMonth;
}

// 🔹 월별 버튼 설정
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

function updateCravingMonthDisplay() {
  const display = document.getElementById("craving-month");
  if (display) {
    display.textContent = `${cravingYear}.${String(cravingMonth).padStart(2, "0")}`;
  }
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

function updateCigMonthDisplay() {
  const display = document.getElementById("cig-month");
  if (display) {
    display.textContent = `${cigYear}.${String(cigMonth).padStart(2, "0")}`;
  }
}

// 🔹 욕구 그래프
function drawCravingChart() {
  if (!dayRecordData || dayRecordData.length === 0) return;

  const labels = [];
  const morningData = [], afternoonData = [], nightData = [];

  dayRecordData.sort((a, b) =>
    new Date(a.date.replace(/\./g, "-")) - new Date(b.date.replace(/\./g, "-"))
  );

  for (const record of dayRecordData) {
    const [y, m, d] = record.date.split(".").map(Number);
    if (y === cravingYear && m === cravingMonth) {
      labels.push(`${m}.${d}`);
      morningData.push(record.craving?.morning ?? 0);
      afternoonData.push(record.craving?.afternoon ?? 0);
      nightData.push(record.craving?.night ?? 0);
    }
  }

  const ctx = document.getElementById("craving").getContext("2d");
  if (cravingChart) cravingChart.destroy();

  const hasData = labels.length > 0;

  cravingChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: hasData ? labels : ["데이터 없음"],
      datasets: [
        {
          label: "아침",
          data: hasData ? morningData : [0],
          borderColor: "#f06292",
          backgroundColor: "transparent",
          tension: 0.3
        },
        {
          label: "오후",
          data: hasData ? afternoonData : [0],
          borderColor: "#42a5f5",
          backgroundColor: "transparent",
          tension: 0.3
        },
        {
          label: "밤",
          data: hasData ? nightData : [0],
          borderColor: "#ffca28",
          backgroundColor: "transparent",
          tension: 0.3
        },
      ]
    },
    options: {
      responsive: true,
      plugins: {
        legend: { position: "top" },
        title: { display: false }
      },
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

// 🔹 개비 수 변화 선그래프
function drawCigaretteCountChart() {
  if (!dayRecordData || dayRecordData.length === 0) return;

  const labels = [];
  const totalCounts = [];

  dayRecordData.sort((a, b) =>
    new Date(a.date.replace(/\./g, "-")) - new Date(b.date.replace(/\./g, "-"))
  );

  for (const record of dayRecordData) {
    const [y, m, d] = record.date.split(".").map(Number);
    if (y === cigYear && m === cigMonth) {
      labels.push(record.date);
      totalCounts.push(record.count?.total ?? 0);
    }
  }

  const ctx = document.getElementById("cig-count").getContext("2d");
  if (cigChart) cigChart.destroy();

  cigChart = new Chart(ctx, {
    type: "line",
    data: {
      labels: labels,
      datasets: [
        {
          label: "총 흡연 개비 수",
          data: totalCounts,
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
      plugins: {
        legend: { position: "top" },
        title: { display: false }
      },
      scales: {
        y: {
          beginAtZero: true,
          title: { display: true, text: "개비 수" }
        }
      }
    }
  });
}

// 🔹 메인 실행
async function main() {
  await profilelogJSONData();
  await dayrecordlogJSONData();
  printDatesFromStartToToday();
  printNoSmokeNumberAndSavings();
  initMonths();
  setupCravingButtons();
  setupCigButtons();
  updateCravingMonthDisplay();
  updateCigMonthDisplay();
  drawCravingChart();
  drawCigaretteCountChart();
}

main();
