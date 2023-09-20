1. 在客户端和服务器通信中，只要客户端设置了cookie,在每一次请求的时候，默认就会在请求头中，基于cookie字段，把本地设置的cookie信息，传递给服务器
2. `let pm = fetch(请求地址，配置项)`
    - 当请求成功，pm的状态是fullfilled,值是请求回来的内容；如果请求失败，pm的状态时rejected,值是失败原因
    - 在fetch中，只要服务器反馈信息(不论HTTP状态码是多少)，都说明网络请求成功，最后pm的实例状态都是fullfilled。只有服务器没有任何反馈(例如：服务中断，请求超时，断网等)，实例pm才是rejected
    - 在axios中，只有返回的状态码是2开始的，才是让实例是成功状态
3. fetch请求的配置项
    - method
    - mode 请求模式 no-cors, *cors，same-origin
    - cache
    - credentials：资源凭证（例如cookie） include, *same-origin, omit
        - fetch默认情况下，跨域请求中，是不允许携带资源凭证的，只有同源下才允许
            - include: 同源和跨域都允许
            - same-origin:只有同源才可以
            - omit: 都不可以
    - headers 自定义请求头信息，是个Headers实例对象
        - Headers.prototype原型上有：
            - append方法：新增头信息 
                - header.append('Content-Type':'application/json');
                - header.append('xxxname':'xxxxxxxx')
                - 。。。
            - delete 删除头信息
            - forEach 迭代所有头信息
            - get 获取某一项的信息
            - has 验证是否包含某一项信息
            - 。。。
    - redirect
    - referredPolicy
    - body 设置请求主体信息
        - 只适用于POST系列请求，在GET系列请求中设置body会报错
        - body内容格式： --> 并且需要指定Content-Type请求头信息
            - JSON字符串
                - '{"key":"value", ...}'
                - Content-Type: application/json
            - URLENCODED
                - 'xxx=XXX&yyy=YYY'
                - Content-Type: application/x-www-form-urlencoded
            - 普通字符串 
                - 'xxxx'
                - Content-Type: text/plain
            - FormData对象
                - 主要用于文件上传或者表单提交
                - Content-Type: multipart/form-data
                    ```
                    let fm = new FormData();
                    fm.append('file',文件);
                    ...
                    ```
            - 二进制 或者 Buffer等格式
            - 其他。。。  
4. 相比较axios， fetch没有对GET系列请求的问号传参做特殊的处理，需要自己手动拼接到URL结尾才可以
5. fetch实例的返回值response对象
    - response对象是Response类的实例
    - 属性有：
        - body: 响应主体信息 --> 他是一个ReadableStream可读流
        - headers: 响应头信息 --> 他是Headers类的实例
        - status/statusText：返回的HTTP状态码及描述
        - ...
    - 方法有：
        - arrayBuffer()
        - blob()
        - formData()
        - text()
        - json()
        - ... 
        - 这些方法就是用来处理body可读流信息的，把可读流信息转换为我们自己需要的格式，返回值是一个Promise实例

    ```
    let head = new Headers();
    head.append('Content-Type':'application/json');

    let p = fetch('xxxURL',
    {
        method: 'POST'，
        headers: head,
        body: JSON.stringify({
            xx：XXX,
            yy: YYY
        })   
    });

    p.then(response => {
        // fetch实例走进then中不代表一定是请求成功
        let { headers，status, statusText } = response;

        // 返回的状态码以2或者3开头才是成功
        if(/^(2|3)\d{2}$/).test(status){
            return response.json(); // 如果转换失败了，报错failed to fetch
        }

        // 获取数据失败的情况（状态码不对）
        return Promise.reject({
            code: -100, //自定义
            status,
            statusText
        })

    }).then(value => {
        console.log('处理结果：',value)
    }).catch(reason => {
        // 服务器没有返回任何信息，或者状态码不对
        console.log(reason);
    })
    ```
6. fetch的请求中断，利用`AbortController`
    ```
        let abortCtrl = new AbortController();

        fetch('xxxURL'，{
            signal: abortCtrl.signal
            header,
            method: 'xxx'
        }).then(response => {
            return response.json();
        }).then(value => {
            ...
        }).catch(reason => {
            ....
            // 如果外部调用传进来的signal.abort()手动中断，会被catch捕获报错 {code:20, message:'the user aborted a request, name:'AbortError'}
        });

        abortCtrl.abort();
    ```
7. 封装企业级fetch库
    ```
    // 核心方法
    const http = function http(config){
        // 设置一些默认值
        if(!isPlainObject(config)) config = {};
        
        // Object.assign(obj1, obj2) 合并obj2对象到obj1, 修改了obj1, 返回的也是obj1
        config = Object.assign({
            url:'',
            method:'GET',
            credentials:'include',
            headers:null,
            body:null,
            params:null,
            responseType:'json',
            signal:null
        }, config);

        //校验
        if(!config.url){
            throw new TypeError('url must be required')
        }
        if(!isPlainObject(config.headers)) config.headers = {};
        if(config.params !== null && !isPlainObject(config.params)) config.params = null;

        //处理细节
        let { url, method, crdentials, headers, body, params, responseType, signal } = config;
        // 1.处理问号传参 把params手动拼接到url中
        if(params){
            url += `${url.includes('?') ? '&' : '?'}${qs.stringify(params)}`；
        }
        // 2.处理请求主体: 按照我们后台要求，如果传递的是一个普通对象，要把其设置为urlencode格式(同时设置请求头)
        if(isPlainObject(body)){
            body = qs.stringify(body);
            headers['Content-Type'] = 'application/x-www=from-urlencoded';
        }

        // 3.类似于axios中的请求拦截器：每一个请求，传递给服务器的相同的内容在这里处理(例如token)
        let token = localStorage.getItem('tk');
        if(token) headers['authorization'] = token;

        ...

        // 发送请求
        method = method.tpUpperCase();
        config = {
            method,
            credentials,
            headers,
            cache:'no-cache',
        };

        if(/^(POST|PUT|PATCH)$/i.test(method) && body) config.body = body;
         return fetch(url, config)
         .then(response => {
            let { status } = value;
            // 返回的状态码以2或者3开头才是成功
            if(/^(2|3)\d{2}$/).test(status){
                // 请求成功，根据预设的格式，转换相应的数据。如果转换失败了，报错failed to fetch
                let result;
                switch responseType.toLowerCase(){
                    case 'text':
                        result = response.text();
                        break;
                    case 'arraybuffer'：
                        result = response.arrayBuffer();
                        break;
                    case 'blob':
                        result = response.blob();
                        break;
                    ...
                    default:
                        result = response.json();
                }
                return result;
            }

            // 获取数据失败的情况（状态码不对）
            return Promise.reject({
                code: -100, //自定义
                status,
                statusText
            })
         })
         .catch( reason => {
            // 失败统一提示
            if(reson && typeof reason === 'object'){
                let {code, status} = reason;
                if(code === -100){
                    switch (+status){
                        case 400:
                            meaage.error('请求参数出了问题')
                        break;
                        ...
                    }
                }else if(code === 20){
                    message.error('请求被中断了')
                }else{
                    message.error('网络忙，请稍后再试')
                }
                ...
            }else{
                message.error('网络忙，请稍后再试')
            }

            return Promise.reject(reason);
         });

    }

    // GET系列请求的初始化
    ['GET','HEAD','DELETE','OPTIONS'].forEach(item => {
        http[item.toLowerCase()] = function(url, config){
            if(!isPlainObject(config)) config = {};
            config['url'] = url;
            config['method'] = item;
            return http(config);
        }
    })

    // POST系列请求的初始化
    ['{POST}','PUT','PATCH'].forEach(item => {
        http[item.toLowerCase()] = function(url, body, config){
            if(!isPlainObject(config)) config = {};
            config['url'] = url;
            config['method'] = item;
            config['body'] = body;
            return http(config);
        }
    })

    export default http;
    ```


    


