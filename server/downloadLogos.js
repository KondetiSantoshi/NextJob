const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '..', 'client', 'public', 'logos');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const brands = [
  { name: 'google', slug: 'google', color: '#4285F4' },
  { name: 'amazon', slug: 'amazon', color: '#FF9900' },
  { name: 'apple', slug: 'apple', color: '#000000' },
  { name: 'meta', slug: 'meta', color: '#0668E1' },
  { name: 'netflix', slug: 'netflix', color: '#E50914' },
  { name: 'uber', slug: 'uber', color: '#000000' },
  { name: 'stripe', slug: 'stripe', color: '#635BFF' },
  { name: 'nvidia', slug: 'nvidia', color: '#76B900' },
  { name: 'adobe', slug: 'adobe', color: '#FF0000' },
  { name: 'salesforce', slug: 'salesforce', color: '#00A1E0' },
  { name: 'atlassian', slug: 'atlassian', color: '#0052CC' },
  { name: 'razorpay', slug: 'razorpay', color: '#0C2340' },
  { name: 'swiggy', slug: 'swiggy', color: '#FC8019' },
  { name: 'zomato', slug: 'zomato', color: '#CB202D' },
  { name: 'flipkart', slug: 'flipkart', color: '#2874F0' },
  { name: 'infosys', slug: 'infosys', color: '#007CC3' },
];

async function run() {
  for (const b of brands) {
    try {
      const res = await fetch(`https://cdn.jsdelivr.net/npm/simple-icons@v13/icons/${b.slug}.svg`);
      let svg = await res.text();
      svg = svg.replace('<svg ', `<svg fill="${b.color}" `);
      fs.writeFileSync(path.join(dir, `${b.name}.svg`), svg);
      console.log('Saved:', b.name);
    } catch (e) {
      console.error('Error saving', b.name, e);
    }
  }

  // Microsoft SVG (Official 4 colored squares)
  const msSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path fill="#F25022" d="M1 1h10v10H1z"/><path fill="#7FBA00" d="M13 1h10v10H13z"/><path fill="#00A4EF" d="M1 13h10v10H1z"/><path fill="#FFB900" d="M13 13h10v10H13z"/></svg>`;
  fs.writeFileSync(path.join(dir, 'microsoft.svg'), msSvg);
  console.log('Saved: microsoft');

  // TCS SVG
  const tcsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><rect width="100" height="40" rx="8" fill="#0F172A"/><text x="50" y="27" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#38BDF8" text-anchor="middle">TCS</text></svg>`;
  fs.writeFileSync(path.join(dir, 'tcs.svg'), tcsSvg);
  console.log('Saved: tcs');

  // CRED SVG
  const credSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 40"><rect width="100" height="40" rx="8" fill="#000000"/><text x="50" y="27" font-family="Arial, sans-serif" font-size="18" font-weight="900" fill="#FFFFFF" letter-spacing="3" text-anchor="middle">CRED</text></svg>`;
  fs.writeFileSync(path.join(dir, 'cred.svg'), credSvg);
  console.log('Saved: cred');

  // Also copy to server/uploads so backend static routes can serve if needed
  const serverUploadsDir = path.join(__dirname, 'uploads');
  if (!fs.existsSync(serverUploadsDir)) fs.mkdirSync(serverUploadsDir, { recursive: true });
  const files = fs.readdirSync(dir);
  for (const f of files) {
    fs.copyFileSync(path.join(dir, f), path.join(serverUploadsDir, f));
  }
  console.log('Copied all logos to server/uploads too!');
}

run();
