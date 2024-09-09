/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');
const package = require('../package.json');
const archiver = require('archiver');

// 创建一个输出流，将ZIP文件写入到 output.zip
const output = fs.createWriteStream(package.name + '.zip');

// 创建一个archiver实例
const archive = archiver('zip', {
  zlib: { level: 9 } // 设置压缩级别
});

// 将输出流绑定到archiver实例
archive.pipe(output);

// 添加目录到ZIP
archive.directory(path.join(__dirname, '../lib'), 'lib'); // 添加整个目录
// 添加doc目录到ZIP
archive.directory(path.join(__dirname, '../doc'), 'doc'); // 添加整个目录

// 添加文件到ZIP
archive.file(path.join(__dirname, '../package.json'), { name: 'package.json' }); // 添加指定文件
archive.file(path.join(__dirname, '../README.md'), { name: 'README.md' }); // 添加指定文件

// 完成ZIP压缩
archive.finalize();

output.on('close', () => {
  console.log('ZIP文件已创建：', package.name + '.zip');
});

output.on('end', () => {
  console.log('数据已全部写入到文件');
});

archive.on('warning', (err) => {
  if (err.code === 'ENOENT') {
    console.warn('警告：文件或目录不存在');
  } else {
    throw err;
  }
});

archive.on('error', (err) => {
  throw err;
});
