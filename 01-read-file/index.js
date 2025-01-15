const fs = require('node:fs');
const path = require('node:path');
const fileSrc = path.join(__dirname, 'text.txt');
const readStream = fs.createReadStream(fileSrc, 'utf-8');
readStream.on('data', chunk => console.log(chunk));