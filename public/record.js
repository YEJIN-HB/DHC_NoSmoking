let currentDate = new Date();
let continue_day = 0;

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


async function profilelogJSONData() {
  try {
    const response = await fetch("/get-profile");
    const jsonData = await response.json();
    return jsonData; // 🔹 데이터를 반환함
  } catch (err) {
    console.error("프로필 데이터 불러오기 실패:", err);
    return null;
  }
}



// 저장 버튼 동작
async function saveProfile() {
  const jsonData = await profilelogJSONData(); // 🔹 데이터를 받아옴
  if (!jsonData) return; // 실패 시 중단

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

  let today_result;

  if (total <= Number(jsonData.oksmoke)) {
    today_result = 'T';

  } else {
    today_result = 'F';
  }

  const data = {
    date: dateStr,
    count: { morning, afternoon, night, total },
    craving: { morning: mCraving, afternoon: aCraving, night: nCraving, average: avg },
    tar,
    today_result, continue_day
  };

  console.log("저장할 데이터:", JSON.stringify(data, null, 2));

  document.getElementById("today-number").textContent = `하루동안 피운 개비 수: ${total}`;
  document.getElementById("tar").textContent = `섭취한 타르 양: ${tar}`;
  document.getElementById("carving-avg").textContent = `흡연욕구(평균): ${avg}`;

  try {
    const res = await fetch("/save-day-record", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      console.log("저장 성공");
    } else {
      console.error("저장 실패");
    }
  } catch (err) {
    console.error("저장 요청 실패:", err);
  }
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
