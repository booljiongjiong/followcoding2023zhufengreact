1.  `dva`: 
    - dva是一个基于redux和redux-saga的数据流发方案, 为了简化开发体验, dva内置了react-router和fetch, 所以也可理解为一个轻量级的应用框架
    - elm概念, 通过reducers, effects和subscriptions阻止model
    - 插件机制: 比如dva-loading可以自动处理loading状态,不用一遍遍的写showloading和hideloading
    - 支持HMR: 基于babel-plugin-dva-hmr实现components, routes和models的HMR
2. 在create-react-app基础上使用dva:
    - 本身可以使用`dva-cli`脚手架, 但是为了延续之前的脚手架, 继续使用create-react-app
    - 在安装create-react-app基础上, 还需要额外安装的内容:
        - 可以安装antd的V5版本, 这样antd可以自动的按需导入(在V5之前不能自动,需要手动按需要导入)
        - 无需安装: redux, redux-saga, react-redux, react-router-dom等, dva内部已经集成好了
            - react-router0dom使用的是v4版本, 所以只能使用v4版本的语法
            - redux使用的是V3
            - 集成的配套插件版本有点低
            - 在react18的脚手架中使用dva会有警告错误
        - history是控制路由模式的
        - 其余的按照之前的配置方案去配置webpack, 包括less, 跨域代理, 兼容, 响应式布局等
3. 使用dva
    ```
    import dva from 'dva'
    import createHistory from 'history/createHashHistory'
    import RouterConfig from './router'
    import voteModel from './store/voteModel'

    const app = dva({
        history: createHistory()
    });

    app.use({});
    app.model(voteModel)
    app.router(RouterConfig)
    app.start('#root')
    
    ```