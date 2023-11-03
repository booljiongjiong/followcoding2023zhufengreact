0. 源码参考: react18全家桶-全套课程讲义\03淘系方案\day1231
1. 更多时候我们会使用dva自带的脚手架创建项目
    - dva脚手架创建的项目是基于roadhog进行webpack配置
    - roadhog是一个cli工具, 提供server, build, test三个命令, 分别用于本地调试和构建,并且提供了非常易用的mock功能
    ```
    npm i dva-cli -g
    dva new my-project
    ```
2. 基于roadhog进行webpack配置:
    - antd的V4版本, 没有按需导入, 需要搭配`babel-plugin-import`使用实现按需导入
    - dva默认使用css,所以需要禁用cssmodules
    - 移动端需要配置REM响应式布局
    - 
    ```
    // 在webpack.js配置中, 需要加入相关配置

    import px2rem from 'postcss-pxtorem';
    export default {
        /* 基础配置 */
        "entry": "src/index.js", //配置多入口：src/enter/*.js
        "outputPath": "./dist",
        "publicPath": "/",
        
        "hash": true,

        // 把public下面的index.html改成index.ejs, 并且去掉导入的index.css和index.js, 同时在这里添加配置
        "html": {
            "template": "./public/index.ejs"
        },

        /* 配置LESS */
        "disableCSSModules": true,
        /* 配置PX转REM - REM响应式布局, 只有移动端需要 */
        "extraPostCSSPlugins": [
            px2rem({
                "rootValue": 75,
                "propList": ['*']
            })
        ],

        /* 配置BABEL的插件 */
        "extraBabelPlugins": [
            // antd按需导入
            [
                "import",
                {
                    "libraryName": "antd",
                    "libraryDirectory": "es",
                    "style": "css"
                }
            ],
            // 配置PX转REM
            [
                "styled-components-px2rem",
                {
                    "rootValue": 75
                }
            ]
        ],

        /* 配置跨域代理 */
        "proxy": {
            "/api": {
                "target": "https://news-at.zhihu.com/api/4",
                "changeOrigin": true,
                "ws": true,
                "pathRewrite": {
                    "/api": ""
                }
            }
        },

        /* 不同环境下的不同配置 */
        "env": {

            // 开发环境下的热更新
            "development": {
                "extraBabelPlugins": [
                    "dva-hmr"
                ]
            }
        }
    };
    ```