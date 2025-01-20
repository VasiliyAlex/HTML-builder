const fs = require('fs');
const promises = require('fs').promises;
const path = require('path');

const projectDistSrc = path.join(__dirname, 'project-dist');
fs.mkdir(projectDistSrc, { recursive: true }, (err) => {
  if (err) {
    console.log(err.message);
  }
});

const stylesSrc = path.join(__dirname, 'styles');
const assetsSrc = path.join(__dirname, 'assets');
const projectDistAssetsSrc = path.join(projectDistSrc, 'assets');
const templateSrc = path.join(__dirname, 'template.html');
const indexProjectDistSrc = path.join(projectDistSrc, 'index.html');
const componentsSrc = path.join(__dirname, 'components');
const projectDistStylesSrc = path.join(projectDistSrc, 'style.css');

async function createIndexHtml() {
  await promises.copyFile(templateSrc, indexProjectDistSrc);
  let content = await promises.readFile(indexProjectDistSrc, 'utf-8');
  const components = await promises.readdir(componentsSrc, {
    withFileTypes: true,
  });

  const promisesArray = components.map(async (file) => {
    const component = path.join(componentsSrc, file.name);
    const fileExt = path.extname(component);
    if (file.isFile() && fileExt === '.html') {
      const fileContent = await promises.readFile(component, 'utf-8');
      const fileName = file.name.replace(fileExt, '');
      content = content.replace(`{{${fileName}}}`, fileContent);
    }
  });

  await Promise.all(promisesArray);
  await promises.writeFile(indexProjectDistSrc, content);
}

function mergeStyles() {
  const writeStream = fs.createWriteStream(projectDistStylesSrc);
  fs.readdir(stylesSrc, { withFileTypes: true }, (err, files) => {
    if (err) {
      console.log(err.message);
    } else {
      files.forEach((file) => {
        if (file.isFile() && path.extname(file.name) === '.css') {
          const fileCssSrc = path.join(stylesSrc, file.name);
          const readStream = fs.createReadStream(fileCssSrc, 'utf-8');
          readStream.on('data', (chunk) => writeStream.write(chunk));
        }
      });
    }
  });
}

async function copyDirectory(origFileSrc, copyFileSrc) {
  try {
    await promises.mkdir(copyFileSrc, { recursive: true });
    const files = await promises.readdir(
      origFileSrc,
      { withFileTypes: true },
      (err, files) => {
        if (err) console.log(err.message);
        return files;
      },
    );
    files.forEach((file) => {
      const origfile = path.join(origFileSrc, file.name);
      const copyFile = path.join(copyFileSrc, file.name);
      if (file.isDirectory()) {
        copyDirectory(origfile, copyFile);
      } else {
        promises.copyFile(origfile, copyFile);
      }
    });
  } catch (e) {
    console.log(e.message);
  }
}

async function buildPage() {
  await createIndexHtml();
  mergeStyles();
  copyDirectory(assetsSrc, projectDistAssetsSrc);
}

buildPage();
