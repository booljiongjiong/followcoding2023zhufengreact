1. HASH路由
    - 改变页面的哈希值（#/xxx），主页面不会刷新
    - 根据不同哈希值，让容器渲染不同的内容（组件）
    - 监听路由变化 `window.onhashchange = function(){...}`
    ```
    <nav>
        <a href='#/'>首页</a>
        <a href='#product/'>产品中心</a>
        <a href='#/person'>个人中心</a>
    </nav>
    <div class='view-box'></div>

    //构建一个路由匹配表
    const routes = [{
        path: '/',
        component: '首页的内容'
    },{
        path: '/product',
        component: '产品中心的内容'
    }，{
        path:'/person'，
        component：'个人中心的内容'
    }]

    // 路由匹配的方法
    const routerMatch = function routerMatch(){
        let hash = location.hash.sybstring(1);
        let text = '';
        routes.forEach(item => {
            if(item.path === hash){
                text = item.component;
            }
        })
        viewBox.innerHtml = text;
    }

    // 刚开始进来展示首页信息，所以需要默认改变一下hash值
    location.hash = '/';
    routerMatch();

    //监听hash值变化, 重新进行路由匹配
    window.onhashchange = routerMatch;
    ```
2. History路由（浏览器路由）
    - 利用H5中的`history API`来实现页面地址的切换（不会刷新页面） 
    - 根据不同的地址，到路由表中匹配，让容器渲染不同的内容(组件)
    - 有个问题：我们切换的地址，在页面不刷新的情况下是没有问题的，但是如果页面刷新，这个地址是不存在的，会报404错误，此时我们需要服务器的配合：在此地址不存在的情况下，也可以把主页面内容返回
    - history.pushState
        - 地址跳转，新增历史记录
    - history.replaceState
        - 地址跳转，替换现在的记录
    - history.go
    - history.back
    - history.forward
    ```
    <nav>
        <!-- 注意history路由这里都不用加上# -->
        <a href='/'>首页</a>
        <a href='product/'>产品中心</a>
        <a href='/person'>个人中心</a>
    </nav>
    <div class='view-box'></div>

    //构建一个路由匹配表
    const routes = [{
        path: '/',
        component: '首页的内容'
    },{
        path: '/product',
        component: '产品中心的内容'
    }，{
        path:'/person'，
        component：'个人中心的内容'
    }]

    // 路由匹配的方法
    const routerMatch = function routerMatch(){
        let hash = location.hash.sybstring(1);
        let text = '';
        routes.forEach(item => {
            if(item.path === hash){
                text = item.component;
            }
        })
        viewBox.innerHtml = text;
    }

    navBox.onclick = function(e){
        let target = e.target;
        if(target.tagName === 'A'){
            e.preventDefault(); // 阻止A标签的点击后跳转和刷新页面的默认行为
            history.pushState({}, '', target,href);
            routeMatch();
        }
    }

    // 默认展示首页
    history.pushState({}, '', '/');
    routerMatch();

    // 监听popstate地址变化事件： 这个事件go/forward/back/浏览器前后箭头可以触发，pushState/replaceState不会触发
    window.onpopstate = routerMatch;
    
    ```
3. `react-router-dom  V5`
    - 安装react-router-dom 的5版本
    - `HashRouter`: 用HashRouter把渲染的内容包起来，开启hash路由
        - 后续用到的Route Link等都需要在HashRouter/BrowerRouter中使用
        - 开启后，整个页面地址，会默认设置一个 #/ 哈希值
    - `Router`: 设置路由项, path component/render
        - Router里面使用render的话, 当路由匹配到了后先执行render函数,最后返回值就是我们要渲染的内容
        - 在render函数中可以做一些操作: 例如登录状态监测等
    - `Link`：实现路由切换/跳转的组件
        - 最后渲染完毕的结果依然是a标签
        - 特可以根据路由模式,自动设定点击a标签切换的方式
    - `Switch`: 确保路由中, 只要有一项匹配,则不再继续向下匹配, `exact`:设置匹配模式为精准匹配
    - `Redirect` 路由匹配不到的时候,可以重定向到首页或者指定页面
    ```
    //1. 添加页面 A.jsx B.jsx C.jsx
    import React from 'react';
    const A = function A(){
        return <div className='box'>
            A组件的内容
        </div>;
    }
    export default A;

    //2. 主页面APP
    import { HashRouter, Route, Switch, Redirct, Link } from 'react-router-dom'

    import A from './views/A'
    import B from './views/B'
    import C from './views/C'

    import styled from 'styled-component'
    const NavBox = styled.nav`
        // 写a标签的样式
        ...
    `
    const App = function App(){
        // 用HashRouter把渲染的内容包起来，开启hash路由
            // - 后续用到的Route Link等都需要在HashRouter/BrowerRouter中使用
            // - 开启后，整个页面地址，会默认设置一个 #/ 哈希值
        return <HashRouter>
            <NavBox>
                <!-- 
                    <a href=''> A </a>
                    <a href=''> B </a>
                    <a href=''> C </a>
                 -->
                <Link to='/'> A </Link>
                <Link to='/b'> B </Link>
                <Link to='/c'> C </Link>
            </NavBox>

            // 路由容器:每一次页面加载或者路由切换完毕,都会根据当前的hash值,到这里跟每一歌Route匹配,把匹配到的组件,放在容器中渲染
            <div class='content'>
                <Switch>
                    <Router exact path='/' component={A} />
                    <Router path='/b' component={B} />
                    <Router path='/c' render= { () => {
                        // 当路由地址匹配后先执行render函数,返回的值就是我们需要渲染的内容, 在此函数中,我们可以处理一些事情:登陆状态检验...
                        if(isLogin){
                            return { C }
                        }else{
                            return <Redirect to='/login'>
                        }
                    }} />
                    <!-- 放在最后一项, 用于匹配不到的时候,执行这个规则, 当然也可以不设置404组件,而是重定向到默认 / 地址
                        <Router path='*' component={404组件} />
                        <Redirect from='' to='' exact />
                            - from: 从哪个地址来
                            - to: 重定向的地址
                            - exact开启精准匹配
                     -->
                </Switch>
                
            </div>
        </HashRouter>
    }
    ```
    - 路由地址匹配的规则:
        - 页面地址:浏览器地址URL后面的哈希值; 路由地址: Route中path字段指定的地址
        - 非精准匹配:
            - 页面地址和路由地址一样, 返回true
            - 页面地址中, 包含一套完整的路由地址返回true
            - 其余情况才返回false
         - 精准匹配:
            - 两个地址必须一样才返回true
