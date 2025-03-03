const express = require('express');
const app = express();
const path = require('path');

// 允許 CORS，避免跨域問題
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});
// 解析 JSON 請求
app.use(express.json());

// 最新 PM 數據
let latestPM = {
  pm1_0: null,
  pm2_5: null,
  pm10: null
};

// 預設首頁
app.get('/', (req, res) => {
  res.send("PM2.5-Monitor");
});

// 📌 接收 ESP32 上傳的 PM 數據
app.post('/pm', (req, res) => {
  const { pm1_0, pm2_5, pm10 } = req.body;

  if (pm1_0 !== undefined && pm2_5 !== undefined && pm10 !== undefined) {
    latestPM = { pm1_0, pm2_5, pm10 };
    console.log('收到 ESP32 上傳數據:', latestPM);
    res.status(200).send({ message: '數據接收成功' });
  } else {
    console.log('接收到無效數據:', req.body);
    res.status(400).send({ message: '無效的數據格式' });
  }
});

// 📌 提供最新 PM 數據給前端用
app.get('/latest-pm', (req, res) => {
  res.json(latestPM);
});

// 啟動本地測試 server
const PORT = process.env.PORT || 8080;
const HOST = '192.168.0.21';
app.listen(PORT, HOST, () => {
  console.log(`Server 正在執行於 http://${HOST}:${PORT}`);
});