1. NavLink和Link都是实现路由跳转的,语法上几乎一样, 区别在于NavLink:
    - 每一次页面加载或者路由切换完毕,都会拿最新的路由地址,和NavLink中的to指定的地址(或者pathname地址)进行匹配
        - 匹配上的这一项,会默认设置active选中样式类,那么我们就可以基于activeClassName重新设置选中的样式类名
        - 我们也可以设置exact精准匹配
    - 基于NavLink这样的机制,我们就可以给选中的导航设置相关的选中样式
    ```
    // 1. @components/HomeHead.jsx
    import React from 'react';
    import { NavLink } from 'react-router-dom'

    import styled from 'styled-component'
    const NavBox = styled.nav`
        // 写a标签的样式
        a{
            margin-right: 10px;
            color: #000;
            <!-- 选中样式 -->
            &.active{               --->&表示a标签 且 同时具有active类名的时候 
                color: red;
            }
        }
        ...
    `
    const HomeHead = function HomeHead(){
        return <NavBox>
            <NavLink to='/a'> A </NavLink>
            <NavLink to='/b'> B </NavLink>
            <NavLink to='/c'> C </NavLink>
        </NavBox>;
    }
    export default HomeHead;
    ```