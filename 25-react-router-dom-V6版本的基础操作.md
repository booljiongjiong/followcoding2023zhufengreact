1. 安装`react-router-dom`的V6版本的包
2. 在react-router-dom V6版本中, 移除了
    - Switch 
    - Redirect  --> v6中的代替方案 `Navigate`
    - withRouter --> v6中的代替方案 自己写一个HOC高阶函数代理一下
3. 还是要使用`<HashRouter>`或者`<BrowserRouter>`开启哈希/浏览器路由
4. 所有路由匹配规则都放在`<Routes>`中, 每一条规则的匹配还是放在`<Route>`中
    - Route中不再基于component/render设置要渲染的组件,而是基于`element`,element的值也不能直接使用导入的组件变量,而是要写成组件的形式`element = { <A /> } `
    - 不再需要Switch,<Routes>默认就是一个匹配成功,就不再匹配下面的了
    - 也不再需要exact, <Routes>默认每一项都是精准匹配
    - 也不再需要Redirect, 而是使用`<Navigate to='/xxx'>`代替.在任何地方遇到Navigate都表示重定向到指定页面
        - Navigate可以设置replace属性, 替换现有记录
        - Navigate的to的值可以是字符串表示地址,也可以是对象
5. `V6版本中, 要求所有的二级/子级路由, 不再分散到各个组件中编写`, 而是统一都写在一起处理
    - 比如所有路由配置都写在了App.jsx中,包括二级/子级路由
    - 在组件A.jsx中不再需要手动配置二级/子级路由了,只需要在渲染子级路由页面的地方放入`<Outlet />`这个`路由容器`,表示用来渲染二级/子级路由匹配的内容
```
// 1. 修改@/App.jsx
import { HashRouter, Route, Switch, Redirct, Link } from 'react-router-dom'

    import A from './views/A'
    import B from './views/B'
    import C from './views/C'

    import A1 from './views/a/A1';
    import A2 from './views/a/A2';
    import A3 from './views/a/A3';

    import styled from 'styled-component'
    const NavBox = styled.nav`
        // 写a标签的样式
        ...
    `
    const A = function A(){
        return <HashRouter>
            <HomeHead />
            <div class='content'>
                <Routes>
                    <Route path='/' element={ <Navigate to='/a' /> } />
                    <Route path='/a' element={ <A /> } >
                        <!-- V6版本中要求所有自己路由不再分散到各个组件中,而是统一写在一起 -->
                        <Route path='/a' element={ <Navigate to='/a/a1' />}>
                        <Route path='/a/a1' element={ <A1 /> }/>
                        <Route path='/a/a2' element={ <A2 /> }/>
                        <Route path='/a/a3' element={ <A3 /> }/>
                    </Route>
                    <Route path='/b' element={ <B /> } />
                    <Route path='/c' element={ <C /> } />
                    <Route path='*' element={ <Navigate to={
                        <!-- 没有匹配到任何路由,则重定向到a页面,并且通过问号传参传递信息给a组件 -->
                        pathname:'/a',
                        search: '?from=404'
                    } /> } />
                </Routes>
            </div>
        </HashRouter>
    }

    // 2. 修改@/views/A.jsx
   import React from 'react';
    import { Link, Outlet } from 'react-router-dom';
    import styled from 'styled-components'
    const DemoBox = styled.div`
        display: felx;
        justify-content:'flex-start';
        align-items:flect-start;

        .menu {
            a {
                display: box;
                &.active {
                    color: red;
                }
            }
        }
    `
    const A = function A(){
        return <DemoBox>
            <div className='menu'>
                <NavLink to='/a/a1'> A1 </NavLink>
                <NavLink to='/a/a2'> A2 </NavLink>
                <NavLink to='/a/a3'> A3 </NavLink>
            </div> 
            <div className='view'>
                <!-- V6版本中 二级/子级路由不再分散到各个组件中, 这里的二级路由在APP中已经配置好了,这里不再需要配置, 只需要引入Outlet组件,用于渲染二级/多级路由即可
                <Switch>
                    <Redirect exact from='/a' to='/a/a1'>
                    <Route path='/a/a1' component={ A1 }>
                    <Route path='/a/a2' component={ A2 }>
                    <Route path='/a/a3' component={ A3 }>
                </Switch>
                -->
                <Outlet />
            </div>
        </DemoBox>;
    }
    export default A;
```