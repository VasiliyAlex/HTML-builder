const fs = require('fs');
const path = require('path');
const stylesSrc = path.join(__dirname, 'styles');
const bundleSrc = path.join(__dirname, 'project-dist', 'bundle.css');

const mergeStyles = (stylesSrc, bundleSrc) => {
  const writeStream = fs.createWriteStream(bundleSrc);

  fs.readdir(stylesSrc, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.error(err);
    } else {
      files.forEach((file) => {
        if (file.isFile() && path.parse(file.name).ext === '.css') {
          const fileCssSrc = path.join(stylesSrc, file.name);
          const readStream = fs.createReadStream(fileCssSrc, 'utf-8');
          readStream.on('data', (chunk) => writeStream.write(chunk));
        }
      });
    }
  });
};

mergeStyles(stylesSrc, bundleSrc);

module.exports = mergeStyles;
