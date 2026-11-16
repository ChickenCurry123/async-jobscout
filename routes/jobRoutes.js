const express = require('express');
const router = express.Router();
const fs = require('fs');
const { scrapeJobs } = require('../services/crawlerService');
const { LOG_FILE, DATA_FILE } = require('../services/eventLogger');

// 1. GET /api/v1/jobs/search?keyword=python
router.get('/jobs/search', async (req, res) => {
    const keyword = req.query.keyword || 'python';

    try {
        const jobs = await scrapeJobs(keyword);
        res.json({
            status: 'success',
            message: `Berhasil menemukan ${jobs.length} lowongan untuk kata kunci '${keyword}'`,
            total: jobs.length,
            keyword,
            data: jobs
        });
    } catch (error) {
        res.status(500).json({
            status: 'error',
            message: error.message
        });
    }
});

// 2. GET /api/v1/jobs/saved
router.get('/jobs/saved', (req, res) => {
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err || !data) {
            return res.status(404).json({
                status: 'fail',
                message: 'Belum ada data lowongan yang tersimpan.'
            });
        }
        try {
            const parsedData = JSON.parse(data);
            res.json({
                status: 'success',
                total: parsedData.length,
                data: parsedData
            });
        } catch (parseErr) {
            res.status(500).json({ status: 'error', message: 'Gagal membaca format JSON.' });
        }
    });
});

// 3. GET /api/v1/logs
router.get('/logs', (req, res) => {
    fs.readFile(LOG_FILE, 'utf8', (err, data) => {
        if (err || !data) {
            return res.status(404).json({
                status: 'fail',
                message: 'Belum ada berkas log aktivitas.'
            });
        }
        res.type('text/plain').send(data);
    });
});

module.exports = router;