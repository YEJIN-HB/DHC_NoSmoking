function saveProfile() {
    const nickname = document.getElementById('nickname').value;
    const age = document.getElementById('age').value;
    const year = document.getElementById('year').value;
    const cost = document.getElementById('cost').value;
    const number = document.getElementById('number').value;

    localStorage.setItem('nickname', nickname);
    localStorage.setItem('age', age);
    localStorage.setItem('year', year);
    localStorage.setItem('cost', cost);
    localStorage.setItem('number', number);

    alert("저장되었습니다.");
}


function calculateSmokingPeriod() {
    const year = parseInt(localStorage.getItem('year'));
    if (!isNaN(year)) {
        const currentYear = new Date().getFullYear();
        const smokingPeriod = currentYear - year;
        document.getElementById("year2").innerText = `${smokingPeriod}`;
    }
}


window.onload = function () {
    const nickname = localStorage.getItem('nickname');
    const age = localStorage.getItem('age');
    const year = localStorage.getItem('year');
    const cost = localStorage.getItem('cost');
    const number = localStorage.getItem('number');
    const profileImage = localStorage.getItem('profileImage');

    if (nickname) document.getElementById('nickname').value = nickname;
    if (age) document.getElementById('age').value = age;
    if (year) document.getElementById('year').value = year;
    if (cost) document.getElementById('cost').value = cost;
    if (number) document.getElementById('number').value = number;

    // 이미지 미리보기 복원
    if (profileImage) {
        const photoDiv = document.getElementById('photoPreview');
        photoDiv.style.backgroundImage = `url(${profileImage})`;
        photoDiv.style.backgroundSize = 'cover';
        photoDiv.style.backgroundPosition = 'center';
    }

    calculateSmokingPeriod();
};


document.getElementById('photoInput').addEventListener('change', function (event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function (e) {
        const imageData = e.target.result;

        // 미리보기 표시
        const photoDiv = document.getElementById('photoPreview');
        photoDiv.style.backgroundImage = `url(${imageData})`;
        photoDiv.style.backgroundSize = 'cover';
        photoDiv.style.backgroundPosition = 'center';

        // localStorage 저장
        localStorage.setItem('profileImage', imageData);
    };
    reader.readAsDataURL(file);
});