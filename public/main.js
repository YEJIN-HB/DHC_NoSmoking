async function logJSONData() {
    try{
        const response = await fetch("/get-profile");
        const jsonData = await response.json();
    
        document.getElementById('name').textContent = jsonData.name;
        document.getElementById('age').textContent = jsonData.age;
        document.getElementById('start-date').textContent = jsonData.startDate;
        document.getElementById('supplements').textContent = jsonData.supplements;
        document.getElementById('during').textContent = jsonData.diffDays;
        document.getElementById('con-money').textContent = jsonData.totalCost;
        document.getElementById('tar').textContent = jsonData.totalTar;
    } catch(err){
        console.error("데이터 불러오기 실패 : ", err)
    }
}
logJSONData();