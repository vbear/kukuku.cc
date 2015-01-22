## H.acfun.tv AC匿名版
这里是Acfun揭示板，以宅文化为主题似Futaba贴图风格，在这里不需要进行注册便可以尽情发文!

## Install
安装前请先确认以下环境是否已经准备完整

* Node.js (version >= 0.11.14) / io.js
* Mysql
* Redis / Memcache
* ImageMagick
* rabbitMQ

### 步骤
首先你需要进入工程目录
```
$ cd h.acfun.tv.front
$ npm install
$ cd h.acfun.tv.admin
$ npm install
```

在生产环境下，我建议使用[PM2](https://github.com/Unitech/pm2)作为守护进程运行程序，使用以下命令启用。
```
$ pm2 start app.js -i 10 --name=h.acfun.tv.front -- --port=1337 --pord
$ pm2 start app.js -i 1 --name=h.acfun.tv.admin -- --port=1336 --pord
```

## 配置
配置文件分 config.development.js 和 config.production.js 两份，分别对应着开发环境下配置和生产环境下配置，切记如果你要将此代码开源的话一定要记得将config.production.js加入.gitignore中。

配置相关请参考[sails的配置](http://sailsjs.org/#/documentation/anatomy/myApp/config)。