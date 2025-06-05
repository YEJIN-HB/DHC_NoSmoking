// 🔹 전역 변수
let dayRecordData = [];
let currentDate = new Date();

// 🔹 날짜 포맷 (YYYY.MM.DD 형태)
function formatDate(date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

// 🔹 프로필 정보 불러오기
async function profilelogJSONData() {
  try {
    const response = await fetch("/get-profile");
    const jsonData = await response.json();

    document.getElementById('name').textContent = jsonData.name;
    document.getElementById('age').textContent = jsonData.age;
    document.getElementById('start-date').textContent = jsonData.startDate;
    document.getElementById('supplements').textContent = jsonData.supplements;
    document.getElementById('during').textContent = jsonData.diffDays;
    document.getElementById('con-money').textContent = jsonData.totalCost;
    document.getElementById('total-tar').textContent = jsonData.totalTar;
  } catch (err) {
    console.error("프로필 데이터 불러오기 실패:", err);
  }
}

// 🔹 흡연 기록 불러오기
async function dayrecordlogJSONData() {
  try {
    const response = await fetch("/get-dayrecord");
    dayRecordData = await response.json();
    updateDateAndData(); // 오늘 날짜로 초기화
  } catch (err) {
    console.error("흡연 기록 불러오기 실패:", err);
  }
}

// 🔹 날짜 표시 및 데이터 반영
function updateDateAndData() {
  const dateStr = formatDate(currentDate);
  document.getElementById("current-date").textContent = dateStr;

  const todayData = dayRecordData.find(item => item.date === dateStr);

  if (todayData) {
    // 개비수 출력
    document.getElementById("morning-count").textContent = todayData.count.morning;
    document.getElementById("afternoon-count").textContent = todayData.count.afternoon;
    document.getElementById("night-count").textContent = todayData.count.night;

    // 리포트 출력
    document.getElementById("today-number").textContent = `하루동안 피운 개비 수: ${todayData.count.total}`;
    document.getElementById("today-tar").textContent = `섭취한 타르 양: ${todayData.tar}`;
    document.getElementById("carving-avg").textContent = `흡연욕구(평균): ${todayData.craving.average}`;

    // 욕구 시각화
    highlightCravingBars(document.querySelectorAll("#morning-craving-bars .bar"), todayData.craving.morning);
    highlightCravingBars(document.querySelectorAll("#afternoon-craving-bars .bar"), todayData.craving.afternoon);
    highlightCravingBars(document.querySelectorAll("#night-craving-bars .bar"), todayData.craving.night);
  } else {
    // 데이터 없음
    document.getElementById("morning-count").textContent = "-";
    document.getElementById("afternoon-count").textContent = "-";
    document.getElementById("night-count").textContent = "-";
    document.getElementById("today-number").textContent = "하루동안 피운 개비 수: -";
    document.getElementById("today-tar").textContent = "섭취한 타르 양: -";
    document.getElementById("carving-avg").textContent = "흡연욕구(평균): -";

    // 막대 초기화
    ["morning-craving-bars", "afternoon-craving-bars", "night-craving-bars"].forEach(id => {
      highlightCravingBars(document.querySelectorAll(`#${id} .bar`), 0);
    });
  }
}

// 🔹 욕구 시각화 막대 처리
function highlightCravingBars(bars, level) {
  bars.forEach((bar, index) => {
    if (index < level) {
      bar.classList.add("active");
    } else {
      bar.classList.remove("active");
    }
  });
}

// 🔹 날짜 버튼 클릭 이벤트
document.getElementById("prev-day").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 1);
  updateDateAndData();
});

document.getElementById("next-day").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 1);
  updateDateAndData();
});

// 🔹 초기 실행
document.addEventListener("DOMContentLoaded", () => {
  profilelogJSONData();
  dayrecordlogJSONData();
});
