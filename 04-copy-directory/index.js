const fs = require('fs');
const path = require('path');
const origFileSrc = path.join(__dirname, 'files');
const copyFileSrc = path.join(__dirname, 'files-copy');

function copyDirectory(origFileSrc, copyFileSrc) {
  fs.rm(copyFileSrc, { recursive: true, force: true }, () => {
    fs.mkdir(copyFileSrc, { recursive: true }, () => {});
    fs.readdir(origFileSrc, (err, files) => {
      files.forEach((file) => {
        fs.copyFile(`${origFileSrc}/${file}`, `${copyFileSrc}/${file}`, () => {});
      });
    });
  });
};

copyDirectory(origFileSrc, copyFileSrc);

module.exports = copyDirectory;