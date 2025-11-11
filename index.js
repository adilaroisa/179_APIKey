const express = require('express');
const path = require('path');
const crypto = require('crypto'); // library bawaan Node.js
const app = express();
const port = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Folder public
app.use(express.static(path.join(__dirname, 'public')));

// Route utama
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Array untuk menyimpan API key yang valid sementara
const apiKeys = [];

// Route POST untuk membuat API key
app.post('/create', (req, res) => {
  try {
    // Generate API key acak dengan prefix
    const randomPart = crypto.randomBytes(24).toString('hex'); // 48 karakter hex
    const apiKey = `sk-sm-v1-${randomPart}`;

    // Simpan key ke array
    apiKeys.push(apiKey);

    // Kirim hasil ke frontend
    res.status(201).json({
      success: true,
      apiKey: apiKey,
      createdAt: new Date().toISOString(),
    });
  } catch (err) {
    console.error('Error generating API key:', err);
    res.status(500).json({ success: false, message: 'Gagal membuat API key' });
  }
});

// Route POST untuk cek API key
app.post('/cekapi', (req, res) => {
  const { key } = req.body;

  if (!key) {
    return res.status(400).json({ success: false, message: 'API key tidak dikirim' });
  }

  if (apiKeys.includes(key)) {
    return res.json({ success: true, message: 'API key valid' });
  } else {
    return res.status(401).json({ success: false, message: 'API key tidak valid' });
  }
});

// Jalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
