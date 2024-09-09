/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');
const path = require('path');

const packageInfo = require(path.resolve('./package.json'));
const pacakgeName = packageInfo.name;
const packageVersion = packageInfo.version;

const staticSever = 'http://10.20.155.253:9000';
const staticPath = '/hddml/material/public/';

// 组件面板中同一个 tab 下的不同区间用 category 区分，category 的排序依照 categoryList 顺序排列
const sort = {
  categoryList: ['布局类', '容器类', '展示类', '表格类', '表单类', '反馈类', '图表类', '业务组件']
};

// 指定要搜索的目录
const directoryToSearch = path.resolve('./low-code');

// 创建一个用于存储所有JSON数据的数组
let jsonDataArray = [];

// 递归遍历目录并读取所有JSON文件
function readJSONFiles(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stats = fs.statSync(filePath);
    if (stats.isDirectory()) {
      readJSONFiles(filePath);
    } else if (path.extname(file) === '.json') {
      // 读取并解析JSON文件
      const jsonData = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      jsonDataArray.push(jsonData);
    } else if (path.extname(file) === '.js') {
      const data = require(filePath);
      jsonDataArray.push(data);
    }
  });
}

// 开始遍历目录并合并JSON数据
readJSONFiles(directoryToSearch);

jsonDataArray = jsonDataArray.map(item => {
  // 修改meta.json 中的 npm 信息
  // npm 信息如下
  // {
  //   "package": "hddml-components",
  //   "version": "2.1.8",
  //   "exportName": "Typefield",
  //   "main": "",
  //   "destructuring": true,
  //   "subName": "",
  //   "devStack": "vue2"
  // }

  if (item.npm){
    item.npm.package = pacakgeName;
    item.npm.version = packageVersion;
  } else {
    item.npm = {
      package: pacakgeName,
      version: packageVersion,
      exportName: item.componentName,
      main: '',
      destructuring: true,
      subName: '',
      devStack: 'vue2'
    };
  }

  // 修改meta.json的docUrl信息

  if (!item.docUrl){
    // 判断对应的doc文件是否存在(md文件， 文件名和packageName一致)
    if (fs.existsSync(path.resolve('./doc/' + item.componentName + '.md'))){
      item.docUrl = staticSever + staticPath + pacakgeName + '/' + packageVersion + '/' + pacakgeName + '/' + 'doc/' + item.componentName + '.md';
    }
  }

  return item;
});

const jsonArray = JSON.stringify({ sort, components: jsonDataArray }, (k, v) => {
  if (typeof v === 'function') {
    return v.toString();
  }
  return v;
}, 2);

// 将合并后的数据写入一个新的JSON文件
const outputFilePath = './lib/index.json';
fs.writeFileSync(outputFilePath, jsonArray, 'utf-8');

console.log('JSON文件合并完成，输出到:', outputFilePath);
