const axios = require('axios');
const cheerio = require('cheerio');
const { appEmitter } = require('./eventLogger');

async function scrapeJobs(keyword = 'python') {
    const targetUrl = 'https://realpython.github.io/fake-jobs/';

    try {
        // HTTP Client request secara non-blocking
        const response = await axios.get(targetUrl, {
            timeout: 6000,
            headers: { 'User-Agent': 'AsyncJobScout-Agent/1.0' }
        });

        const $ = cheerio.load(response.data);
        const jobs = [];
        const currentTimestamp = new Date().toLocaleDateString('id-ID', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });

        // Loop dan parse struktur HTML .card-content
        $('.card-content').each((index, element) => {
            const title = $(element).find('.title').text().trim();
            const company = $(element).find('.company').text().trim();
            const location = $(element).find('.location').text().trim();
            const applyLink = $(element).find('footer .card-footer-item').last().attr('href');

            if (title.toLowerCase().includes(keyword.toLowerCase())) {
                jobs.push({
                    id: index + 1,
                    title,
                    company,
                    location,
                    scrapedAt: currentTimestamp,
                    applyLink: applyLink || targetUrl
                });
            }
        });

        // Trigger Event jika scraping sukses
        appEmitter.emit('job:crawled', { keyword, count: jobs.length, results: jobs });

        return jobs;
    } catch (error) {
        // Trigger Event jika terjadi timeout atau masalah jaringan
        appEmitter.emit('job:error', { keyword, message: error.message });
        throw new Error(`Gagal menarik data lowongan: ${error.message}`);
    }
}

module.exports = { scrapeJobs };