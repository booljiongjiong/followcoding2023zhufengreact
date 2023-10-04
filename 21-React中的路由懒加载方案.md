1. 在真实项目中,如果我们事先把所有组件全部导入进来,再基于Route做路由匹配,这样在项目打包的时候,所有组件全部打包进一个js中,这样js文件就会非常大, 就会导致第一次加载页面的时候,从服务器获取这个js文件就会用很长时间,导致此阶段页面一直处于白屏阶段,这样体验很不好. 
    - 虽然说优化方案中有建议合并为一个js文件,这样可以减少HTTP网络请求的此处,但是这个js文件不宜过大
    - 我们最好的处理方案应该是这样的:
        - 我们只把最开始要展示的文件/组件打包到'主js'中(boundle.js),  其余的组件,打包成独立的js或者几个组件合并成在一起打包
        - 当页面加载的时候,首先只把'主js'(boundle.js)文件请求回来渲染,其余的js先不加载
            - 因为主js文件中只有最开始要渲染的代码,所以体积小,获取和渲染速度快,可以减少白屏等待时间
            - 其余js此时并没有加载,但是也不影响页面第一次渲染
        - 当切换路由的时候,和哪个规则匹配,想要渲染哪个组件,再把这个组件所在的js文件,动态导入进来进行渲染即可
        - 这就是`分割打包js, 按需异步加载js` ---> 这就是`路由懒加载`
2. 借助react的`lazy` `suspence`和es6的`import`实现react中的路由懒加载
    - 在路由配置中, 需要首次加载的组件比如A,可以先导入,这样A组件就会被打包进主js(boundle.js)文件中, 不需要首次渲染的组件比如B和C,不要先导入进来
    - 配置B和C的路由时候, 组件component设置不能直接赋值对应组件,而是使用lazy函数和es6中的import动态导入
        - 分割打包: 这样被lazy和import处理的组件,就会被单独打包为一个js文件
        - 按需导入/加载: 最开始渲染页面不会加载这些单独的js,只有路由匹配规则成功,需要渲染这个组件的时候,才会去加载
    - 上面改造后的一级和二级路由配置表, 还不能正确执行, 因为首次渲染组件A的时候,会默认渲染A1,此时A1是懒加载的,可能还没请求回来,所以控制台会报错,页面不显示, 所以在根据配置表创建路由RouteView的时候需要用react中`suspence`包裹返回的component, 并且Suspence可以设置`fallback`,在组件请求的时候做一些loading处理
    - 组件A的二级路由配置aRoutes.js中, 每一个路由配置中的A1 A2 A3组件也都是通过路由懒加载处理的, 如果我们想要把这三个子组件打包进一个js中, 还需要处理一下: 在动态import的时候手动指定打包的名字`webpackChunkName`为同一个:
        - `component: lazy(() => import(/* webpackChunkName:"Achild" */'@/views/a/A1'))`
3. 实现
    ```
    1. 在@/router/routes.js中修改一下

    import { lazy } from 'react';
    import A from '@/views/A'
    <!-- 组件B C 不需要首次加载, 所以这里不需要导入, 使用lazy
    import B from '@/views/B'
    import C from '@/views/C' 
    -->

    import aRoutes from '@/router/aRoutes';

    const routes = [
        {
            redirect: true,
            from: '/',
            to: '/a',
            exact: true
        },
        {
           path: '/a',
           name: 'a',
           component: A,
           meta: {},
           children:[
               aRoutes
           ]
        },
        {
           path: '/b',
           name: 'b',
           <!-- 这里不能直接导入首次不需要的组件B了,而是用react中的lazy和es6的import实现懒加载:会把懒加载的组件单独打包成一个js文件
           component: B, 
           -->
           component: lazy( () => import('@/views/B')),
           meta: {},
        },
        {
           path: '/c',
           name: 'c',
           <!-- component: C, -->
           component: lazy( () => import('@/views/C')),
           meta: {},
        },
        {
            redirect: true,
            to: '/a'
        }
    ];
    export default routes;


    // 2. 二级路由配置表@/router/aRoutes.js中的处理
    import { lazy } from 'react';
    <!-- 二级路由的页面也不需要首次加载, 所有不需要导入, 用lazy和import实现懒加载
    import A1 from '@views/a/A1';
    import A2 from '@views/a/A2';
    import A3 from '@views/a/A3'; 
    -->
    const aRoutes = [
        {
            redirect: true,
            from: '/a',
            to: '/a/a1',
            exact: true
        },
        {
           path: '/a/a1',
           name: 'a-a1',
           <!-- component: A1, -->
           <!-- 为多个组件指定打包名字为同一个,就可以把这些组件打包进一个js中,而不是一个组件打包成一个js了 -->
           component: lazy( () => import(/*webpackChunkName:"AChild"*/'@/views/a/A1')),
           meta: {},
        },
       {
           path: '/a/a2',
           name: 'a-a2',
           <!-- component: A2, -->
           lazy( () => import(/*webpackChunkName:"AChild"*/'@/views/a/A2')),
           meta: {},
        },
        {
           path: '/a/a3',
           name: 'a-a3',
           <!-- component: A3, -->
           lazy( () => import(/*webpackChunkName:"AChild"*/'@/views/a/A3')),
           meta: {},
        },
    ];
    export default aRoutes;

    // 3.上面改造后的一级和二级路由配置表, 还不能正确执行, 因为首次渲染组件A的时候,会默认渲染A1,此时A1是懒加载的,可能还没请求回来,所以控制台会报错,页面不显示, 所以在根据配置表创建路由RouteView的时候需要用react中的suspence包裹返回的component
        // @/router/index.jsx中的修改
    import React, {Suspence} from 'react';
    import { Switch, Route, Redirect } from 'react-router-dom';

    const RouterView = function RouterView(props){
        let { routes } = props;

        return <Switch>
            {
                routes.map((item, index) => {
                    let {redirect, from, to, path, component:Component, exact} = item;
                    let config = {};
                    if(redirect){
                        config = { to };
                        if(from){
                            config.from = from;
                        }
                        if(exact){
                            config.exact = true;
                        }
                        return <Redirect key={index} {...config} />
                    }
                    config = { path };
                    if(exact){
                        config.exact = true;
                    }
                    return <Route key={index} {...config} render={()=>{
                        // 这里为什么要用render而不是直接设置component呢,因为路由懒加载必须要react.suspence的支持, 且我们可能会需要做一些特殊操作, 所以这里使用render
                        // 使用suspence包裹需要返回的组件: 保证请求回来组件的js后再进行渲染,不会报错 fallback是在等待时候进行一些loading处理
                        return <Suspence fallback={<>正在处理中</>}>
                            <Component />
                        </Suspence>
                    }}/>
                })
            }
        </Switch>;
    }
    export default RouterView;

    ```