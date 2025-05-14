function saveProfile() {
    const nickname = document.getElementById('nickname').value;
    const age = document.getElementById('age').value;
    const year = document.getElementById('year').value;
    const cost = document.getElementById('cost').value;
    const number = document.getElementById('number').value;
    const dayavg = document.getElementById('dayavg').value;

    const today = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'

    const profileData = {
        nickname,
        age,
        year,
        cost,
        number,
        dayavg,
        startDate: today
    };

    // 서버로 JSON 데이터를 POST 전송
    fetch('/save-profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(profileData)
    })
    .then(response => {
        if (response.ok) {
            alert('저장되었습니다.');
            window.location.href = 'modeset.html';
        } else {
            alert('저장 실패: 서버 오류');
        }
    })
    .catch(error => {
        console.error('에러 발생:', error);
        alert('저장 실패: 네트워크 오류');
    });
}
