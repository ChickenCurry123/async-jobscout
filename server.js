const express = require('express');
const path = require('path');
const jobRoutes = require('./routes/jobRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('json spaces', 2);
app.use(express.json());

// Serving static files dari folder public
app.use(express.static(path.join(__dirname, 'public')));

// Request logging middleware
app.use((req, res, next) => {
    console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.url}`);
    next();
});

// Routing API
app.use('/api/v1', jobRoutes);

// Root route (Eksplisit menyajikan index.html untuk Vercel Serverless)
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Fallback status API
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

module.exports = app;
