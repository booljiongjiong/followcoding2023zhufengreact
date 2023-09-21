import React from 'react';
import ReactDOM from 'react-dom/client';
import Task from './views/Task';
/* 使用ANTD组件库 */
import { ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import './index.less';
/* REDUX */
import store from './store';
import { Provider } from 'mobx-react';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ConfigProvider locale={zhCN}>
        //基于Provider把各个模块的Store实例结构出来 都放在上下文中
        <Provider {...store}>
            <Task />
        </Provider>
    </ConfigProvider>
);