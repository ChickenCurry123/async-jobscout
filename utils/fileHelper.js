const fs = require('fs');
const path = require('path');

// Normalisasi path folder data secara cross-platform
const DATA_DIR = path.normalize(path.join(__dirname, '../data'));

function ensureDataDirExists() {
    if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    }
}

module.exports = { DATA_DIR, ensureDataDirExists };