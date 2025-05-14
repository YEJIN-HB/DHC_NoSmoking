// 1. 프로필 저장 함수
function saveProfile() {
  // HTML에서 입력된 값들을 가져와서 하나의 객체로 만들기
  const profileData = {
    nickname: document.getElementById('nickname').value,
    age: document.getElementById('age').value,
    year: document.getElementById('year').value,
    cost: document.getElementById('cost').value,
    number: document.getElementById('number').value,
    dayavg: document.getElementById('dayavg').value,
    photo: localStorage.getItem('profileImage') || null, // 사진 미리 저장된 값 가져옴
    startDate: new Date().toISOString().split('T')[0] // 오늘 날짜 저장 (YYYY-MM-DD)
  };

  // JSON.stringify()로 문자열로 변환 후 로컬 스토리지에 저장
  localStorage.setItem('profileData', JSON.stringify(profileData));

  alert("프로필이 저장되었습니다.");
  window.location.href = "modeset.html"; // 저장 후 다음 페이지로 이동
}

// 2. 프로필 불러오기 함수
function loadProfile() {
  // 저장된 profileData 불러오기
  const data = JSON.parse(localStorage.getItem('profileData'));
  if (!data) return; // 저장된 데이터 없으면 종료

  // 각 입력칸에 저장된 값을 넣어주기
  document.getElementById('nickname').value = data.nickname || '';
  document.getElementById('age').value = data.age || '';
  document.getElementById('year').value = data.year || '';
  document.getElementById('cost').value = data.cost || '';
  document.getElementById('number').value = data.number || '';
  document.getElementById('dayavg').value = data.dayavg || '';

  // 사진 미리보기 복원
  if (data.photo) {
    const photoDiv = document.getElementById('photoPreview');
    photoDiv.style.backgroundImage = `url(${data.photo})`;
    photoDiv.style.backgroundSize = 'cover';
    photoDiv.style.backgroundPosition = 'center';
  }

  // 흡연 기간 계산해서 표시
  if (data.year) {
    const year = parseInt(data.year);
    const currentYear = new Date().getFullYear();
    if (!isNaN(year)) {
      const period = currentYear - year;
      document.getElementById('year2').textContent = `${period}`;
    }
  }
}

// 3. 이미지 업로드 시 미리보기 및 로컬 저장
document.getElementById('photoInput').addEventListener('change', function (event) {
  const file = event.target.files[0]; // 선택한 파일
  if (!file) return;

  const reader = new FileReader(); // 파일을 읽을 준비

  reader.onload = function (e) {
    const imageData = e.target.result; // base64 이미지 데이터

    // 미리보기 설정
    const photoDiv = document.getElementById('photoPreview');
    photoDiv.style.backgroundImage = `url(${imageData})`;
    photoDiv.style.backgroundSize = 'cover';
    photoDiv.style.backgroundPosition = 'center';

    // 기존 profileData가 있으면 거기에 photo만 추가
    const existing = JSON.parse(localStorage.getItem('profileData')) || {};
    existing.photo = imageData;
    localStorage.setItem('profileData', JSON.stringify(existing));
  };

  reader.readAsDataURL(file); // 파일을 base64 형식으로 읽기
});

// 4. 흡연 시작연도 입력하면 자동으로 흡연 기간 계산
document.getElementById('year').addEventListener('input', function () {
  const year = parseInt(this.value);
  const currentYear = new Date().getFullYear();

  if (!isNaN(year) && year > 1900 && year <= currentYear) {
    const period = currentYear - year;
    document.getElementById('year2').textContent = `${period}`;
  } else {
    document.getElementById('year2').textContent = '';
  }
});

// 5. 페이지 열릴 때 프로필 자동 로딩
window.onload = loadProfile;
