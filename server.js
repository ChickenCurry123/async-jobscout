const express = require('express');
const jobRoutes = require('./routes/jobRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('json spaces', 2);
app.use(express.json());
app.use(express.static('public'));

app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

app.use('/api/v1', jobRoutes);

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

app.listen(PORT, () => {
    console.log(`=================================`);
    console.log(`Server aktif di http://localhost:${PORT}`);
    console.log(`=================================`);
});

// Wajib ditambahkan agar kompatibel dengan Vercel Serverless Function
module.exports = app;
