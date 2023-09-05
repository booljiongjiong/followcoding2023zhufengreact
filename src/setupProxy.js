const {createProxyMiddleware} = require('http-proxy-middleware');
module.exports = function (app) {
    // 把以/jian打头的请求代理到(指向)https://wwww.jianshu.com.asimov
    app.use(
        createProxyMiddleware('/jian',{
            target: 'https://wwww.jianshu.com/users',
            changeOrigin:true,
            wa:true,
            pathRewrite: { "^/jian": ""}
        })
    );

    // 把以/zhi打头的请求代理到(指向)https://news-at.zhihu.com/api/4
    // app.use(
    //     createProxyMiddleware('/zhi',{
    //         target: 'https://news-at.zhihu.com/api/4',
    //         changeOrigin:true,
    //         wa:true,
    //         pathRewrite: { '^/zhi': '' }
    //     })
    // );
}