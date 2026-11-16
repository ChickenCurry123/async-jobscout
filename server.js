const express = require('express');
const jobRoutes = require('./routes/jobRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Indentasi otomatis respon JSON agar rapi
app.set('json spaces', 2);

app.use(express.json());

// Menyajikan file statis dari folder public (Dashboard UI)
app.use(express.static('public'));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Mounting Router API
app.use('/api/v1', jobRoutes);

// Route fallback untuk info status API
app.get('/api', (req, res) => {
    res.json({
        app: 'Async JobScout & Filtering Engine',
        status: 'Active',
        endpoints: [
            '/api/v1/jobs/search?keyword=python',
            '/api/v1/jobs/saved',
            '/api/v1/logs'
        ]
    });
});

// Jalankan Listener Server
app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Server aktif di http://localhost:${PORT}`);
    console.log(`=================================`);
});