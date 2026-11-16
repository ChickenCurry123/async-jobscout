const EventEmitter = require('events');
const fs = require('fs');
const path = require('path');
const { DATA_DIR, ensureDataDirExists } = require('../utils/fileHelper');

class JobEventEmitter extends EventEmitter {}
const appEmitter = new JobEventEmitter();

const LOG_FILE = path.join(DATA_DIR, 'activity.log');
const DATA_FILE = path.join(DATA_DIR, 'jobs.json');

ensureDataDirExists();

// Listener Event: job:crawled (Pencatatan Log & Penyimpanan File JSON)
appEmitter.on('job:crawled', (data) => {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] [SUCCESS] Scraped ${data.count} jobs for keyword '${data.keyword}'\n`;

    // Penulisan log aktivitas secara asinkron
    fs.appendFile(LOG_FILE, logMessage, (err) => {
        if (err) console.error('Gagal memperbarui file log:', err.message);
    });

    // Simpan hasil data lowongan ke berkas jobs.json
    fs.writeFile(DATA_FILE, JSON.stringify(data.results, null, 2), (err) => {
        if (err) console.error('Gagal menulis data ke jobs.json:', err.message);
    });
});

// Listener Event: job:error (Handling Verification & Validation Eror)
appEmitter.on('job:error', (errorData) => {
    const timestamp = new Date().toISOString();
    const errorLog = `[${timestamp}] [ERROR] Crawling failed for '${errorData.keyword}' - Reason: ${errorData.message}\n`;

    fs.appendFile(LOG_FILE, errorLog, (err) => {
        if (err) console.error('Gagal mencatat log eror:', err.message);
    });
});

module.exports = { appEmitter, LOG_FILE, DATA_FILE };