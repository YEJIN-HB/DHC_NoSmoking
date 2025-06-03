const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({extended : false}));

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


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});