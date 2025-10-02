const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();

// Phục vụ các file tĩnh từ thư mục hiện tại
app.use(express.static(__dirname));

// Xử lý route cho trang dashboard
app.get('/:userId', (req, res) => {
    const filePath = path.join(__dirname, 'user-dashboard.html');
    
    // Kiểm tra xem file có tồn tại không
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Trang không tồn tại');
    }
});

// Xử lý tất cả các route khác
app.get('*', (req, res) => {
    const filePath = path.join(__dirname, 'user-dashboard.html');
    
    // Kiểm tra xem file có tồn tại không
    if (fs.existsSync(filePath)) {
        res.sendFile(filePath);
    } else {
        res.status(404).send('Trang không tồn tại');
    }
});

module.exports = app;
