1. 在react-router-dom V6版本中, 即便当前组件是基于<Route/>渲染的,也不会基于props属性把history/location/match这三个对象传递给组件,想要获取相关信息,`我们只能使用Hook函数处理`
    - 首先要确保, 要使用路由Hook函数的组件, 必须要在Router[HashRouter/BrowserRouter]内部包裹着的, 否则使用这些Hook会报错
    - 只要是在HashRouter/BrowserRouter中包裹的组件, 不管是不是基于<Route>匹配渲染的,都不能基于props获取三个对象信息了,只能基于`路由Hook`获取
    - 为了在类组件中也可以获取路由的相关信息:
        - 稍后在构建路由表的时候,会想办法继续让基于<Route/>匹配渲染的类组件,可以基于属性props获取单个对象信息
        - 不是基于<Route/>匹配渲染的组件,我们需要自己重写withRouter(V6中去掉了这个API),让其和基于<Route/>匹配渲染的组件,具备相同的属性
    
    ```
    // 1. 创建@views/B.jsx
    import React from 'react';
    const B = function B(props){

        let location  = useLocation();  --> location

        const clickHandle = () => {

        };

        return <div className='view'>
            <div>B组件的内容</div>
            <button onClick={ clickHandle }> B组件中按钮-点击跳转C组件 </button>
        </div>;
    }
    export default B;
    ```
2. 在react-router-dom V6版本中,实现路由跳转的方式有:
    - 1. 方式1: `<Link/NavLink to='/xxx' />` 点击跳转路由
    - 2. 方式2: `<Navigate to='/xxx' />` 遇到Navigate这个组件就会重定向跳转
    - 3. 方式3: `useNavigate` 编程式导航
        ```
        import { useNavigate } from 'react-router-dom';
        const navigate = usenavigate();
        navigate('/xxx');
        navigate('/xxx', {repalce:true});
        navigate({
            pathname: '/c'
        })
        navigate({
            pathname: '/c',
            search: '?id=100&name=hahaha'
        })
        ```
3. 在react-router-dom V6版本中, 实现路由传参的方式有:
    - 1. 方式1: `问号传参`
        ```
        // 1. B组件中点击按钮跳转C组件,并通过问号传参给C
        import React from 'react';
        const B = function B(){
            const navigate = useNavigate();

            const clickHandle = () => {
                navigate({
                    pathname: '/c',
                    search: qs.stringify({
                        id: 100,
                        name:'hahaha'
                    })
                });
            };

            return <div className='view'>
                <div>B组件的内容</div>
                <button onClick={ clickHandle }> B组件中按钮-点击跳转C组件 </button>
            </div>;
        }
        export default B;

        // 2. C组件中接收参数
        import React from 'react';
        import { useLocation } from 'react-router-dom';

        const C = function C(){

            <!-- 获取方式1: useLocation
            let location = useLocation();
            const usp = new URLSearchPaprams(location.search);
            let id = usp.get('id');
            let name = usp.get('name');
             -->

             <!-- 获取方式2: useSearchParams -->
             let [usp] = useSearchParams(); // useSearchParams()执行结果是一个数组, 数组第一项就是URLSearchPaprams对象,这里使用解构赋值,把第一项重命名为usp
             let id = usp.get('id')
             let name = usp.get('name')


            return <div className='view'>
                <div>C组件的内容</div>
            </div>;
        }
        export default C;
        ```
    2. 方式2: `路径传参`
        - 在App.jsx中配置路由表的时候 基于<Route>匹配渲染的规则在设置path属性的时候,添加查询参数
        ```
        // 1. 修改@/App.jsx中配置Route时候的path, 添加查询参数名称
        import { HashRouter, Routes, Route } from 'react-router-dom'
        import HomeHead from '@/components/HomeHead';

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
        const App = function App(){
            return <HashRouter>
                <HomeHead />
                <div class='content'>
                    <Routes>
                        <Route path='/' element={ <Navigate to='/a' /> } />
                        <Route path='/a' element={ <A /> } >
                            <Route path='/a' element={ <Navigate to='/a/a1' />}>
                            <Route path='/a/a1' element={ <A1 /> }/>
                            <Route path='/a/a2' element={ <A2 /> }/>
                            <Route path='/a/a3' element={ <A3 /> }/>
                        </Route>
                        <Route path='/b' element={ <B /> } />
                        <Route path='/c/:id/:name?' element={ <C /> } />  ---> 这里path的值添加了查询参数id和name,问号表示可选
                        <Route path='*' element={ <Navigate to={
                            pathname:'/a',
                            search: '?from=404'
                        } /> } />
                    </Routes>
                </div>
            </HashRouter>
        }
        export default App;

        // 2. B组件中传递参数
        import React from 'react';
        const B = function B(){
            const navigate = useNavigate();

            const clickHandle = () => {
                navigate('/c/100/hahaha'); // B组件这里点击按钮跳转C并通过路径传参
            };

            return <div className='view'>
                <div>B组件的内容</div>
                <button onClick={ clickHandle }> B组件中按钮-点击跳转C组件 </button>
            </div>;
        }
        export default B;

        // 3. C组件中获取B组建中路径传参的参数值 useParams
        import React from 'react';
        import { useParams } from 'react-router-dom';

        const C = function C(){

            let params = useParams(); // {id: 100, name: 'hahaha'}

            return <div className='view'>
                <div>C组件的内容</div>
            </div>;
        }
        export default C;
        ```
    3. 方式3: `隐式传参`
        - 在react-router-dom V5版本中, 隐式传参,目标组件只要刷新,传递的信息就会消失,`但是在V6版本中刷新后这个传递信息被保留下来了`
        ```
        // 1. B组件中点击按钮跳转C组件,并通过隐式传参给C
        import React from 'react';
        const B = function B(){
            const navigate = useNavigate();

            const clickHandle = () => {
                navigate('/c', {
                    state: {
                        id: 100,
                        name:'hahaha'
                    },
                    replace: true, // 替换现有历史记录
                });
            };

            return <div className='view'>
                <div>B组件的内容</div>
                <button onClick={ clickHandle }> B组件中按钮-点击跳转C组件 </button>
            </div>;
        }
        export default B;

        // 2. C组件中接收B中饮食传递的参数值
        import React from 'react';
        import { useLocation } from 'react-router-dom';

        const C = function C(){

            let location = useLocation();
            let {id, name} = location.state;

            return <div className='view'>
                <div>C组件的内容</div>
            </div>;
        }
        export default C;
        ```
4. 总结: 在react-router-dom V6版本中, 常用的路由Hook
    - useNavigate: 替换V5中的useHistory, 实现编程式导航, 实现路由跳转
    - useLocation: V5中也有, 用于获取location对象location.pathname/search/state
    - useSearchParams: V6新增, 获取问号传参信息,结果是一个URLSearchParams对象
    - useParams: V5中也有, 获取路径传参中匹配到的信息

    
