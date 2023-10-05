1. 使用方法:
```
// 1. 在@router目录下创建 index.js routes.js
    // 1.1 创建routes.js
    import { Navigate } from 'react-router-dom';
    import { lazy } from 'react';
    import A from '@/views/A';
    <!-- 不需要导入一级路由对应的组件B C,因为要使用路由懒加载(分割js,按需异步加载)
    import B from '@/views/B'; 
    import C from '@/views/C'; -->

    // A组件的二级路由
    const aRoutes = [
        {
            path:'/a',
            component:()=><Navigate to='/a/a1' />
        },
        {
            path:'/a/a1',
            name:'a-a1',
            component: lazy( ()=> import(/*webpackChunkName:'AChild'*/'@viewa/a/A1')),
            meta:{}
        },
        {
            path:'/a/a2',
            name:'a-a2',
            component: lazy( ()=> import(/*webpackChunkName:'AChild'*/'@viewa/a/A2')),
            meta:{}
        },
        {
            path:'/a/a3',
            name:'a-a3',
            component: lazy( ()=> import(/*webpackChunkName:'AChild'*/'@viewa/a/A3')),
            meta:{}
        },
    ];

    //一级路由
    const routes = [
        {
            path:'/',
            component:()=><Navigate to='/a' /> //这里把Navigate组件包在了一层函数里面,是为了防止在@/router/index.js中导入这个routes的时候遇到Navigate直接就重定向跳转页面了
        },
        {
            path:'/a',
            name:'a',
            component:A,
            meta:{},
            children: aRoutes
        },
        {
            path:'/b/',
            name:'b,
            component: lazy( () => import('@/views/B')),
            meta:{}
        },
        {
            path:'/c/:id?/:name?',
            name:'c,
            component: lazy( () => import('@/views/C')),
            meta:{}
        },
        {
            path:'*',
            component: () => {
                return <Navigte to={ 
                    pathname:'/a',
                    search: '?from=404'
                }>;
            },
            meta:{}
        }
    ];

    export default routes;

    // 1.2. 创建@router/index.js 遍历路由配置表创建路由
    import { suspence } from 'react'
    import routes from '@/router/routes';
    import { Routes, Route, useNavigate, useLocation, useParams, useSearchparams} from 'react-router-dom';

    //统一渲染组件:在这里可以做一些事情,比如登陆校验,传递路由信息等....
    const Element = function Element(props){
        let { component:Component,  } = props;
        // 把路由信息先获取到,最后基于属性传递给组件: 这样,只要是基于<Route>匹配渲染的组件, 都可以基于属性props获取到路由信息
        const navigate = useNavigate();
        const location = useLocation();
        const params = useParams();
        const [usp] = useSearchparams();

        //最后把Component进行渲染
        return <Component navigate location params usp />
    }

    //递归创建Route
    const createRoute = function createRoute(routes){
        return <>
            {routes.map((item,index) => {
                let { path, children } = item;
                return <Route key={index} path element={ <Element {...item} /> }>
                    // 基于递归方式,绑定子级路由
                    {Array.isArray(children) ? create(children) : null}
                </Route>;
            });
            }
        </>
    }

    export default function RouterView(){
        // 使用react.Suspence跟V5版本一样, 当使用了路由懒加载的时候,按需异步加载js,在这个请求还没完成的异步时间内,可以做一些操作比如loading,也可以保证页面渲染不会报错
        return <Suspence fallback={ <>正在处理中...</>}>
            <Routes>
                {createRoute(routes)}
            </Routes>
        </Suspence>
    }

    // 创建高阶组件HOC, 模拟V5版本的withRouter效果
    export const withRouter = function withRouter(Component){
        // Component:真实要渲染的组件
        return function HOC(props){
            //提前获取路由信息, 传递给Component组件
            const navigate = useNavigate();
            const location = useLocation();
            const params = useParams();
            const [usp] = useSearchparams();
            return <Component {...props} navigate loaction params usp  />;
        }
    }
// 2. 修改@/App.jsx 去掉原来手动写的路由配置表和导入的组件 导入上面写的RouterView
    import { HashRouter } from 'react-router-dom';
    import HomeHead from '@/components/HomeHead';
    import RouterView from '@/router'
    import styled from 'styled-component'
    const NavBox = styled.nav`
        // 写a标签的样式
        ...
    `
    const App = function App(){
        return <HashRouter>
            <HomeHead />
            <div class='content'>
                <RouterView />
            </div>
        </HashRouter>
    }
    export default App;

// 3. 各个组件中的修改
    // 3.1 修改@/views/A.jsx  基本不用修改 还是需要使用Outlet组件占坑表示用于渲染子级路由
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
                <Outlet />
            </div>
        </DemoBox>;
    }
    export default A;

    // 3.2 修改@/views/B.jsx
    import React from 'react';
    import { Link, Outlet } from 'react-router-dom';
    const B = function B(props){
        // 无论B组件是函数组件还是类组件,都可以使用props获取到路由信息了,因为在根据路由配置表创建路由的时候已经做了传参处理了
        const { navigate } = props;
        return <div className='box'>
            B组件的内容
            <button onClick={
                // 通过属性拿到navigate 点击B中按钮跳转C,通过路径传参给C
                navigate('/c/100/hahaha');
            }>B组件中按钮-点击跳转C组件</<button>
        </div>
    }
    export default B;

    // 3.3 修改@/views/C.jsx
    import React from 'react';
    import { Link, Outlet } from 'react-router-dom';
    const C = function C(props){
        // 无论C组件是函数组件还是类组件,都可以使用props获取到路由信息了,因为在根据路由配置表创建路由的时候已经做了传参处理了
        // 包括获取到路由信息中的传参信息, 具体获取方式要看具体的传参方式
        // 这里解构出来的params就是在创建路由的时候使用useParams这个Hook函数创建的数据然后传递给组件的
        const { params } = props;
        return <div className='box'>
            C组件的内容
            
        </div>
    }
    export default C;

// 4. 不是基于<Route/>匹配渲染的组件 获取路由信息的处理方式 @/components/HomeHead.jsx
    import React from 'react';
    import { NavLink } from 'react-router-dom'
    import { withRouter } from '@/router'; // 导入自己写的高阶函数HOC获取路由信息

    import styled from 'styled-component'
    const NavBox = styled.nav`
        // 写a标签的样式
        a{
            margin-right: 10px;
            color: #000;
            <!-- 选中样式 -->
            &.active{
                color: red;
            }
        }
        ...
    `
    const HomeHead = function HomeHead(props){
        // 路由信息获取方式1: 如果HomeHead是函数组件,虽然不是基于<Route/>匹配渲染的,不能使用props获取, 但是是放在<HashRouter>中渲染的,所以Hook函数和高阶函数withRouter都可以处理来获取路由信息
        // 路由信息获取方式2: 如果HomeHead是类组件, 不是基于<Route/>匹配渲染,不能使用props获取,但是放在了<HashRouter>中渲染, 又因为类组件不能使用Hook函数,所以只能使用withRouter高阶函数处理获取路由信息
        return <NavBox>
            <NavLink to='/a'> A </NavLink>
            <NavLink to='/b'> B </NavLink>
            <NavLink to='/c'> C </NavLink>
        </NavBox>;
    }
    export default withRouter(HomeHead);
```
2. 总结
    - 函数组件 且 基于<Route/>匹配渲染的, 可以基于属性props获取路由信息,也可以自己使用Hook函数获取
    - 类组件 且 基于<Route/>匹配渲染的, 只能基于属性props获取路由信息,或者使用自己写的高阶函数(模拟的V5版本的withRouter)
    - 函数组件 且 不是基于<Route/>匹配渲染的,可以基于Hook自己处理获取路由信息,也可以使用自己写的高级函数withRouter
    - 类组件 且 不是基于<Route/>匹配渲染的, 只能基于自己写的withRouter
    - 所有路由都要放在<HashRouter>中渲染
3. 使用`useRoutes`统一创建管理路由表
    - 使用useRoutes([])可以帮我们省事, 不用自己再去@/router下面创建index.js 和 routes.js来创建路由了
    - 具体使用方法 参照官网

