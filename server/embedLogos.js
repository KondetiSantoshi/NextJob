const fs = require('fs');

['cred', 'groww', 'freshworks', 'meesho', 'lenskart'].forEach(name => {
  const b64 = fs.readFileSync('client/public/logos/' + name + '.png').toString('base64');
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128"><image href="data:image/png;base64,${b64}" width="128" height="128"/></svg>`;
  fs.writeFileSync('client/public/logos/' + name + '.svg', svg, 'utf8');
  console.log('Created SVG with embedded PNG for', name);
});
