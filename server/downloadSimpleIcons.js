const fs = require('fs');
const https = require('https');

function downloadAndColor(url, dest, color) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'Mozilla/5.0' } }, res => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        return downloadAndColor(res.headers.location, dest, color).then(resolve).catch(reject);
      }
      if (res.statusCode !== 200) return reject(new Error('HTTP ' + res.statusCode));
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        let svg = data;
        if (color) {
          if (svg.includes('fill="currentColor"')) {
            svg = svg.replace('fill="currentColor"', `fill="${color}"`);
          } else if (svg.includes('<svg') && !svg.includes('fill=')) {
            svg = svg.replace('<svg', `<svg fill="${color}"`);
          }
        }
        fs.writeFileSync(dest, svg, 'utf8');
        console.log('Saved:', dest, '(' + svg.length + ' bytes)');
        resolve();
      });
    }).on('error', reject);
  });
}

async function run() {
  const items = [
    { url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/accenture.svg', dest: 'client/public/logos/accenture.svg', color: '#A100FF' },
    { url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/wipro.svg', dest: 'client/public/logos/wipro.svg', color: '#382B7D' },
    { url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hcl.svg', dest: 'client/public/logos/hcl.svg', color: '#0070B8' },
    { url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/paytm.svg', dest: 'client/public/logos/paytm.svg', color: '#002E6E' },
    { url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/zoho.svg', dest: 'client/public/logos/zoho.svg', color: '#DF2027' },
    { url: 'https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/jio.svg', dest: 'client/public/logos/jio.svg', color: '#0A2885' },
    { url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/hdfcbank.svg', dest: 'client/public/logos/hdfc.svg', color: '#004C8F' },
    { url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/icicibank.svg', dest: 'client/public/logos/icici.svg', color: '#F58220' },
    { url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/walmart.svg', dest: 'client/public/logos/walmart.svg', color: '#0071CE' },
    { url: 'https://cdn.jsdelivr.net/npm/simple-icons@v11/icons/zerodha.svg', dest: 'client/public/logos/zerodha.svg', color: '#387ED1' }
  ];

  for (const item of items) {
    try {
      await downloadAndColor(item.url, item.dest, item.color);
    } catch(e) {
      console.error('Failed ' + item.dest + ':', e.message);
    }
  }
}

run();
