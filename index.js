const express = require('express');
const app = express();

// 포트 번호 설정
const PORT = process.env.PORT || 3000;

// 기본 라우트 설정
app.get('/', (req, res) => {
    res.send('Hello, Express!');
});

// 서버 실행
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});