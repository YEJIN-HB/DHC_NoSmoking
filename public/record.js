let currentDate = new Date();

// 날짜 업데이트
function updateDate() {
  const dateStr = formatDate(currentDate);
  document.getElementById("current-date").textContent = dateStr;
}

function formatDate(date) {
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

// 날짜 이동
document.getElementById("prev-day").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() - 1);
  updateDate();
});

document.getElementById("next-day").addEventListener("click", () => {
  currentDate.setDate(currentDate.getDate() + 1);
  updateDate();
});

updateDate(); // 초기 날짜 표시

// 저장 버튼 동작
function saveProfile() {
  const dateStr = formatDate(currentDate);

  const morning = +document.getElementById("morning-count").value || 0;
  const afternoon = +document.getElementById("afternoon-count").value || 0;
  const night = +document.getElementById("night-count").value || 0;
  const total = morning + afternoon + night;
  const tar = `${total * 10}mg`;

  const mCraving = document.querySelectorAll("#morning-craving .bar.active").length;
  const aCraving = document.querySelectorAll("#afternoon-craving .bar.active").length;
  const nCraving = document.querySelectorAll("#night-craving .bar.active").length;
  const avg = ((mCraving + aCraving + nCraving) / 3).toFixed(2);

  const data = {
    date: dateStr,
    count: { morning, afternoon, night, total },
    craving: { morning: mCraving, afternoon: aCraving, night: nCraving, average: avg },
    tar
  };

  // 결과 출력
  console.log("저장할 데이터:", JSON.stringify(data, null, 2));

  // 보고서 표시
  document.getElementById("today-number").textContent = `하루동안 피운 개비 수: ${total}`;
  document.getElementById("tar").textContent = `섭취한 타르 양: ${tar}`;
  document.getElementById("carving-avg").textContent = `흡연욕구(평균): ${avg}`;

  fetch("/save-day-record", {
    method : "POST",
    headers: {
      "Content-Type" : "application/json",
    },
    body : JSON.stringify(data),
  })
  .then(response => {
    if(response.ok){
      console.log("저장 성공");
    } else{
      console.error("저장 실패");
    }
  })
  .catch(error => {
    console.error("오류 발생:", error);
  });
}

// 욕구 바 클릭
document.querySelectorAll(".craving-bars").forEach(container => {
  const bars = container.querySelectorAll(".bar");
  bars.forEach((bar, i) => {
    bar.addEventListener("click", () => {
      bars.forEach((b, j) => b.classList.toggle("active", j <= i));
    });
  });
});
