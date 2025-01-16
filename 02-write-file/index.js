const fs = require('fs');
const path = require('path');
const fileSrc = path.join(__dirname, 'text.txt');
const { stdin, stdout, exit } = process;
const readline = require('readline');
const interface = readline.createInterface(stdin);
const writeStream = fs.createWriteStream(fileSrc);

stdout.write('Я понял, в чем ваша беда. Вы слишком серьезны. Умное лицо еще не признак ума, господа.\n');

const end = () => {
  stdout.write('Все глупости на земле делаются именно с этим выражением лица... Улыбайтесь, господа... Улыбайтесь...');
  exit();
};

interface.on('line', (text) => {
  if (text === 'exit') end();
  writeStream.write(text + '\n');
});

process.on('SIGINT', end);