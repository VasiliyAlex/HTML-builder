const fs = require('fs');
const path = require('path');
const secretFolderSrc = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolderSrc, { withFileTypes: true }, (error, files) => {
  for (let file of files) {
    if (file.isFile()) {
      const fileSrc = path.join(secretFolderSrc, file.name);
      const fileName = path.parse(fileSrc).name;
      const fileExtension = path.parse(fileSrc).ext.slice(1);
      fs.stat(fileSrc, (error, stats) => {
        console.log(`${fileName} - ${fileExtension} - ${stats.size} B`);
      });
    }
  }
});