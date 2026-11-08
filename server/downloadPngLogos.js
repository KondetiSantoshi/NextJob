const fs = require('fs');
const https = require('https');

function download(url, dest) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return download(res.headers.location, dest).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      const file = fs.createWriteStream(dest);
      res.pipe(file);
      file.on('finish', () => {
        file.close();
        console.log('Saved:', dest);
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  const domains = [
    { domain: 'cred.club', name: 'cred' },
    { domain: 'groww.in', name: 'groww' },
    { domain: 'freshworks.com', name: 'freshworks' },
    { domain: 'meesho.com', name: 'meesho' },
    { domain: 'lenskart.com', name: 'lenskart' }
  ];

  for (const item of domains) {
    const url = `https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://${item.domain}&size=128`;
    try {
      await download(url, `client/public/logos/${item.name}.png`);
    } catch (e) {
      console.error(`Failed ${item.name}:`, e.message);
    }
  }
}

run();
