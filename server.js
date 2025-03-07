console.log("🚀 啟動中，準備載入 express...");
const express = require('express');
const app = express();
const path = require('path');

const isLocal = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 8080;
const HOST = isLocal ? '192.168.0.21' : undefined;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

app.use(express.json());

let latestPM = {
  cf_pm1_0: 0,
  cf_pm2_5: 0,
  cf_pm10: 0,
  atm_pm1_0: 0,
  atm_pm2_5: 0,
  atm_pm10: 0,
  particles_1_0: 0,
  particles_2_5: 0,
  particles_10: 0
};

// ✅ API 路由放前面
app.post('/pm', (req, res) => {
  latestPM = req.body;
  if (latestPM && Object.keys(latestPM).length > 0) {
    console.log('✅ 收到 ESP32 上傳數據:', latestPM);
    res.status(200).send({ message: '數據接收成功' });
  } else {
    console.log('❌ 接收到無效數據:', req.body);
    res.status(400).send({ message: '無效的數據格式' });
  }
});

app.get('/latest-pm', (req, res) => {
  res.json(latestPM);
});

// ✅ 靜態檔案路由放後面
app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'frontend/dist/index.html'));
});

if (isLocal) {
  app.listen(PORT, HOST, () => {
    console.log(`✅ Local Server 正在執行於 http://${HOST}:${PORT}`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`✅ GCP Server 正在執行於 PORT ${PORT}`);
  });
}
