// 오류처리 미들웨어의 작성과 사용
const express = require('express');

const app = express();

const hasError = (req, res, next) => {
    next("ERROR");
}

app.get('/', (req, res) => {
    res.send("OK");
});

app.get('/success', (req, res) => {
    res.send("SUCCESS");
});

app.get('/fail', hasError, (req, res) => {
    res.send("FAIL");
});

// 오류처리 미들웨어 추가하기

app.use((err, req, res,next)=>{
    res.send(`Request failed with ${err}`)
})


app.listen(8080);