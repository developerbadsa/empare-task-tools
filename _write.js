const fs = require('fs');
const h = fs.readFileSync('_write.html', 'utf8');
fs.writeFileSync('shopify-prompt-generator.html', h);
console.log('Done! ' + h.length + ' bytes');
