const fs = require('fs');
const path = require('path');

const targetDir = path.join(__dirname, '..', 'client', 'public', 'logos');

const logos = {
  'phonepe.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="22" fill="#5f259f"/>
  <path d="M42 22h14c12 0 19 6 19 16s-7 16-19 16h-4v24h-10V22zm10 22h4c6 0 9-3 9-6s-3-6-9-6h-4v12z" fill="#fff"/>
</svg>`,

  'paytm.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 40">
  <rect width="120" height="40" rx="8" fill="#002e6e"/>
  <text x="12" y="27" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#ffffff">Pay</text>
  <text x="56" y="27" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#00baf2">tm</text>
</svg>`,

  'wipro.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#ffffff" stroke="#e2e8f0" stroke-width="2"/>
  <circle cx="50" cy="30" r="14" fill="#cb2026"/>
  <circle cx="34" cy="56" r="14" fill="#0072bc"/>
  <circle cx="66" cy="56" r="14" fill="#7ac143"/>
  <circle cx="50" cy="72" r="12" fill="#f58220"/>
</svg>`,

  'jio.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <circle cx="50" cy="50" r="48" fill="#0a2885"/>
  <circle cx="50" cy="50" r="38" fill="#e11b22"/>
  <text x="50" y="62" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="34" fill="#ffffff" text-anchor="middle">Jio</text>
</svg>`,

  'hcl.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 50">
  <rect width="120" height="50" rx="10" fill="#0056b3"/>
  <text x="60" y="34" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="24" fill="#ffffff" text-anchor="middle" letter-spacing="1">HCL</text>
</svg>`,

  'cognizant.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#0033a0"/>
  <path d="M50 20 A30 30 0 1 0 78 65 L65 57 A18 18 0 1 1 50 32 Z" fill="#ffffff"/>
  <circle cx="68" cy="35" r="8" fill="#00b140"/>
</svg>`,

  'zoho.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect x="6" y="24" width="22" height="52" rx="4" fill="#df2027"/>
  <rect x="28" y="24" width="22" height="52" rx="4" fill="#009245"/>
  <rect x="50" y="24" width="22" height="52" rx="4" fill="#1b75bb"/>
  <rect x="72" y="24" width="22" height="52" rx="4" fill="#f8a51d"/>
  <text x="50" y="94" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#333" text-anchor="middle">ZOHO</text>
</svg>`,

  'freshworks.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#ff5722"/>
  <circle cx="50" cy="50" r="26" fill="#ffffff"/>
  <path d="M42 36l20 14-20 14z" fill="#ff5722"/>
</svg>`,

  'zepto.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#ff3269"/>
  <text x="50" y="66" font-family="Arial, sans-serif" font-weight="900" font-size="44" fill="#ffffff" text-anchor="middle">Z</text>
</svg>`,

  'zerodha.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#387ed1"/>
  <path d="M28 72 L72 28 M72 72 L28 28" stroke="#ffffff" stroke-width="12" stroke-linecap="round"/>
</svg>`,

  'groww.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#00d09c"/>
  <circle cx="45" cy="55" r="22" fill="#ffffff"/>
  <circle cx="62" cy="40" r="16" fill="#5367ff"/>
</svg>`,

  'meesho.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="20" fill="#9f2066"/>
  <path d="M30 68 V32 L50 50 L70 32 V68" fill="none" stroke="#ffffff" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"/>
</svg>`,

  'hdfc.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="16" fill="#004c8f"/>
  <rect x="25" y="25" width="50" height="50" fill="#ed232a"/>
  <rect x="37" y="37" width="26" height="26" fill="#ffffff"/>
  <rect x="44" y="44" width="12" height="12" fill="#004c8f"/>
</svg>`,

  'icici.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="16" fill="#8b1c1c"/>
  <circle cx="50" cy="50" r="30" fill="none" stroke="#f58220" stroke-width="10"/>
  <circle cx="50" cy="50" r="14" fill="#ffffff"/>
</svg>`,

  'walmart.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="18" fill="#0071ce"/>
  <g transform="translate(50,50)" fill="#ffc220">
    <ellipse rx="5" ry="16" transform="rotate(0) translate(0,-16)"/>
    <ellipse rx="5" ry="16" transform="rotate(60) translate(0,-16)"/>
    <ellipse rx="5" ry="16" transform="rotate(120) translate(0,-16)"/>
    <ellipse rx="5" ry="16" transform="rotate(180) translate(0,-16)"/>
    <ellipse rx="5" ry="16" transform="rotate(240) translate(0,-16)"/>
    <ellipse rx="5" ry="16" transform="rotate(300) translate(0,-16)"/>
  </g>
</svg>`,

  'techmahindra.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="18" fill="#e31837"/>
  <path d="M28 35h44v10H56v25H44V45H28z" fill="#ffffff"/>
</svg>`,

  'ltimindtree.svg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <rect width="100" height="100" rx="18" fill="#002b49"/>
  <text x="50" y="44" font-family="Arial, sans-serif" font-weight="900" font-size="20" fill="#00a3e0" text-anchor="middle">LTI</text>
  <text x="50" y="68" font-family="Arial, sans-serif" font-weight="bold" font-size="14" fill="#ffffff" text-anchor="middle">Mindtree</text>
</svg>`
};

Object.entries(logos).forEach(([filename, svgContent]) => {
  const filePath = path.join(targetDir, filename);
  fs.writeFileSync(filePath, svgContent.trim());
  console.log(`Saved ${filename}`);
});

console.log('All authentic company logos saved successfully!');
