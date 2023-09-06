import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.less'

// import 'react-app-polyfill/ie9';
// import 'react-app-polyfill/ie11';
// import 'react-app-polyfill/stable';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <div>啊啊啊啊啊啊啊啊</div>
);

// 因为webpackDevserver.config.js中配置了先查找在项目目录下查找是否存在setupProxy.js文件，如果有的话，则会使用中间件启用我们写好的代理配置
fetch('/jian/recommended?seen_ids=&count=5&only_unfollowed=true').then(res => {
  console.log(2222)
    return res.json();
}).then(val => {
  console.log(val);
})
