1. 使用crate-react-app脚手架创建react工程化项目
    全局安装脚手架 npm  creat-react-app -g
    检查安装情况 creat-react-app --version
    基于脚手架创建react工程化应用 crate-react-app 项目名
        项目名称小写字母 数字 下划线组成
        项目目录
            |- node-modules
            |- src 所有后续编写的代码机会都放在src下面， 打包的时候一般只对这个目录下的代码进行处理
                |- idnex.js 入口文件
            |- public 放页面模板
                |- index.html
            |- package.json
            |- ...

2. 使用create-react-app脚手架创建的项目， 默认会安装：
    react: React框架的核心
    react-dom： React试图渲染的核心（基于react构建WebApp(HTML页面)）
        -----》引申一下: 还有react-native:用于构建和渲染App的
    react-script：脚手架为了让项目看起来干净一些，把webpack打包的规则和相关的插件、Loader等都隐藏到了node_modules目录下。react-script就是脚手架中自己对打包命令的一种封装，基于他打包。 会调用mode_modules中的webpack等进行处理

3. 升级相关
    1. node.js
        windows系统直接官网下载 或者使用n管理
        mac等使用nvm管理
    2. npm
        npm i npm@latest -g
    3. npm镜像
        使用nrm管理
            全局安装nrm: npm i nrm -g
            查看当前镜像： npm config get registry
            切换镜像： nrm use xxx
1. 使用crate-react-app脚手架创建react工程化项目
    全局安装脚手架 npm  creat-app-app -g
    检查安装情况 creat-react-app --version
    基于脚手架创建react工程化应用 crate-react-app 项目名
        项目名称小写字母 数字 下划线组成
        项目目录
            |- node-modules
            |- src 所有后续编写的代码机会都放在src下面， 打包的时候一般只对这个目录下的代码进行处理
                |- idnex.js 入口文件
            |- public 放页面模板
                |- index.html
            |- package.json
            |- ...

2. 使用create-react-app脚手架创建的项目， 默认会安装：
    react: React框架的核心
    react-dom： React试图渲染的核心（基于react构建WebApp(HTML页面)）
        -----》引申一下: 还有react-native:用于构建和渲染App的
    react-script：脚手架为了让项目看起来干净一些，把webpack打包的规则和相关的插件、Loader等都隐藏到了node_modules目录下。react-script就是脚手架中自己对打包命令的一种封装，基于他打包。 会调用mode_modules中的webpack等进行处理

3. 升级相关
    1. node.js
        windows系统直接官网下载 或者使用n管理
        mac等使用nvm管理
    2. npm
        npm i npm@latest -g
    3. npm镜像
        使用nrm管理
            全局安装nrm: npm i nrm -g
            查看当前镜像： npm config get registry
            切换镜像： nrm use xxx
4. 脚手架默认生成的package.json
    1. 默认使用`react-script start` 或者 `react-script build` 或者 `react-script jest` 或者 `react-script eject`
    2. 执行`react-script eject`是把node-modules里面的一些配置项拆出来， 形成一些可配置的文件，方便后续根据项目需求进行修改。执行这个命令后是不可逆的执行这个命令之前如果项目本地有修改， 需要提交到历史区再执行（没必要提交到远程仓库）， 或者放弃本地修改（可以使用stash临时还原修改后续再删除这个stash）
5. 从默认json执行eject后形成新的package.json 和 一些新的配置文件
    1. 新package.json中会把依赖项列出来， 并重新安装到node-modules中
        - 其中：
        `@babel/core: "^7.16.0"` 把es6转成es5需要用到
        `@babel-preset-react-app: ""^10.0.1` 对eject暴露之前的 `@babel/preset-env`进行了重写， 目的是为es6转成es5, 在转换过程中要识别react语法， 实现代码转换
        `sass-loader: "^12.3.0"` creat-react-app这个脚手架默认配置的是sass预编译语言， 项目中使用的是sass则无需处理，但是要是用less/stylus，则还需要自己处理
   2. 新package.json中的script：
        不再用react-scripts封装的插件执行命令了，而是基于nodez去执行对应的入口文件
    3. 新package.json中babel配置：
        ```
        "babel": {
            "preset": [
                ""react-app
            ]
        }
        ```
        类似于之前写的babel.config.js，对babel-loader的额外配置
6. 常见的修改
    1. 把sass改成less
        `npm add less less-loader@8` 注意必须是8版本
        `npm remove sass-loader`
    2. create-react-app脚手架默认webpack规则的修改： 直接去暴露的源码中修改
        1. sass相关配置改成less
        2. resolve中的alias里面添加一行`'@': paths.appSrc`代表将paths.appSrc这个变量表示的项目的src这个目录去个别名叫@
        3. 执行`npm run start` 实际执行的是`node scripts/start.js`， start.js里面可以修改域名和端口号
            - 如果想基于修改环境变量的方式来修改，需要借助`cross-env`这个node包
            - `cross-env`包可以跨平台的修改和使用环境变量
            - 先 `npm i cross-env`安装cross-env
            - 再 在package.json的scripts中加上你想修改的环境变量即可`cross-env PORT=8080 node script/start.js`
    3. 修改浏览器兼容
        ```
         "browserslist": {
            "production": [
            ">0.2%",
            "not dead",
        "not op_mini all"
            ],
            "development": [
            "last 1 chrome version",
            "last 1 firefox version",
            "last 1 safari version"
            ]
        },
        ```
        通过修改browserslist下面的兼容列表， 实现浏览器的兼容
        - 对postcss-loader生效： 控制css3的前缀
        - 对babel-loader生效： 控制ES6向es5的转换
        - 遗留问题：无法处理ES6内置API的转换 ---》需要使用`@babel/polyfill`对ES6常见的API重写
            - 在用了create-react-app脚手架的情况下创建的项目：里面天然的添加了`react-app-polyfill`这个包, 里面对`@babel/polyfill`进行了重写
            - 没有使用create-react-app脚手架创建的项目：需要手动安装@babel/polyfill这个包`npm i @babel/polyfill`， 并且在项目的入口文件中引入`import '@babel/polyfill'`
    4. 处理proxy跨域
        1. 因为 **webpackDevServer.config.js**中的配置中，有一个中间件检查，先查找是否存在`paths.proxySetup`这个变量所指向的src/setupProxy.js这个文件，存在就会根据设置匹配进行代理
        2. 安装`npm i http-proxy-middleware`
            - `http-proxy-middleware`: 实现跨域代理的模块（`webpack-dev-server`的跨域代理原理，也是基于他完成的）
        3. 在src目录下新建setupProxy.js文件，引入中间件`http-proxy-middleware`, 并写入代理代码，参考src/setupProxy.js， 然后在项目入口文件index.js中添加测试代码
            ```
            fetch('')
            ```
        


