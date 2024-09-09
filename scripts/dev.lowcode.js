const { exec } = require('child_process');
const httpServer = require('http-server/lib/http-server')

const chokidar = require('chokidar');

const buildComponent = (cb = () => {}) => {
  console.log('组件编译中...')
  exec('vite build', (error, stdout, stderr) => {
    if (error) {
      console.error(`执行错误: ${error.message}`);
      return;
    }
    // if (stderr) {
    //   console.error(`错误输出: ${stderr}`);
    //   return;
    // }
    console.log(`组件编译成功`);
    cb();
  })
}
const buildMeta = (cb = () => {}) => {
  console.log('编译组件配置文件...');
    exec('node ./scripts/build.lowcode.js', (error, stdout, stderr) => {
      if (error) {
          console.error(`执行错误: ${error.message}`);
          return;
        }
        // if (stderr) {
        //   console.error(`错误输出: ${stderr}`);
        //   return;
        // }
        // console.log(`编译组件配置文件成功: ${stdout}`);
        console.log(`编译组件配置文件成功`);
        cb()
    })
}
const startServer = (cb = () => {}) => {
  var server = httpServer.createServer({
    root: './'
  });

  server.listen('8080', '0.0.0.0', () => {
    console.log('启动服务: http://127.0.0.1:8080');
    cb()
  })
}
const watchBuild = () => {
  chokidar.watch('.').on('change', (path, stats) => {
    if(path.startsWith('src/')){
      // 编译组件
      buildComponent()
    }
    if(path.startsWith('low-code/')){
      // 编译配置
      buildMeta()
    }
  })
}

// 原神，启动
buildComponent(() => {
  buildMeta(() => {
    startServer(() => {
      watchBuild()
    })
  })
})