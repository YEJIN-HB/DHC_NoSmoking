const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;


app.use(express.static('public'));
app.use(express.json());

// profile.html 연결
app.get('/profile', (req, res) => {
  res.sendFile(__dirname + '/public/profile.html');
});

//profile post요청
app.post("/save-profile", (req,res) =>{
    console.log(req.body);
    res.send("저장 완료");

    const profileJSON = JSON.stringify(req.body, null, 2)
    fs.writeFileSync('./profile.json', profileJSON);
});

// record.html 연결
app.get('/record', (req, res) => {
  res.sendFile(__dirname + '/public/record.html');
});

//record post요청
app.post("/save-day-record", (req, res) => {
  const newData = req.body;
  const filePath = path.join(__dirname, "day-record.json");

  let records = [];

  // 기존 파일이 있으면 불러오기
  if (fs.existsSync(filePath)) {
    const fileData = fs.readFileSync(filePath, "utf8");
    try {
      records = JSON.parse(fileData);
    } catch (e) {
      console.error("JSON 파싱 실패:", e);
    }
  }

  // 같은 날짜 있으면 제거 [filter()는 배열에서 조건에 맞는 요소만 남기고 나머지는 제거]
  records = records.filter(record => record.date !== newData.date);

  // 새 데이터 추가
  records.push(newData);

  // 저장
  fs.writeFileSync(filePath, JSON.stringify(records, null, 2));
  res.send("저장 완료");
});

//main.html 연결
app.get('/main', (req,res) => {
    res.sendFile(__dirname + '/public/main.html');
});

app.get('/get-profile', (req, res) => {
  try {
    const data = fs.readFileSync('./profile.json');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).send('profile.json 파일을 읽을 수 없습니다');
  }
});


app.get('/get-dayrecord', (req, res) => {
  try {
    const data = fs.readFileSync('./day-record.json');
    res.json(JSON.parse(data));
  } catch (err) {
    res.status(500).send('day-record.json 파일을 읽을 수 없습니다');
  }
});


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "main.html"));
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
