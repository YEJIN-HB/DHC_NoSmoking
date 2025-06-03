function saveProfile() {
  const name = document.getElementById('name').value;
  const age = document.getElementById('age').value;
  const smokeday = document.getElementById('smokeday').value;
  const dayavg = parseInt(document.getElementById('dayavg').value);
  const cost = parseInt(document.getElementById('cost').value);
  const startDate = document.getElementById('start-date').value;
  const supplements = document.getElementById('supplements').value;

  updateCalculatedInfo(smokeday, startDate, dayavg, cost);
  const { diffDays, totalCost, totalTar } = updateCalculatedInfo(smokeday, startDate, dayavg, cost);
  const data = { name, age, smokeday, dayavg, cost, startDate, supplements, diffDays, totalCost, totalTar};

  fetch("/save-profile", {
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

//자동계산
function updateCalculatedInfo(smokeday, startDate, dayavg, cost) {
  const start = new Date(smokeday);
  const end = new Date(startDate);
  const diffDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24));

  const totalCost = (diffDays * dayavg * (cost / 20)).toLocaleString();
  const totalTar = (diffDays * dayavg * 10).toLocaleString();

  document.getElementById('duration').textContent = `흡연 기간: 약 ${diffDays}일`;
  document.getElementById('total-cost').textContent = `총 소비 금액: 약 ${totalCost}원`;
  document.getElementById('tar').textContent = `섭취한 타르 양: 약 ${totalTar}mg`;

  return { diffDays, totalCost, totalTar };
}
