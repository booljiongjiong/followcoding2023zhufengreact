1. 类组件和函数组件中都可以使用 ref=函数的形式来获取DOM元素
    ```
    // 类组件中
    <div ref={ x => this.boxRef = x}>哈哈哈哈</div>
    ...
    this.boxRef就是真实的DOM元素

    // 函数组件中 - 注意函数组件中没有this!
    let boxRef；
    <div ref={ x => boxRef = x}>哈哈哈哈</div>
    ...
    boxRef就是真实DOM。不推荐在函数组件中这样定义和使用ref
    ```
2. 类组件和函数组件中都可以使用React.createRef()的形式来获取DOM元素
    ```
    // 类组件中
    const boxRef = React.createRef();
    ...
    <div ref={ this.boxRef }>哈哈哈哈</div>
    this.boxRef.current就是真实DOM

    // 函数组件中
    const boxRef = React.createRef();
    ...
    <div ref={ boxRef }>哈哈哈</div>
    boxRef.current就是真实DOM
    ```
3. this.refs.xxx只能在类组件中来定义和适应ref,函数组件中没有this这种概念呀
4. 函数组件中可以使用React.forwardRef来转发和获取子组件内部的DOM元素
    ```
    // 父组件： 类组件 ！
    return <div>
        <Demo ref={ x => this.boxRef=x }></Demo>
    </div>

    // 子组件：函数组件 ！
        const Demo = React.forwardRef(function Demo(props，ref) => {
            return <div>
                <buttton ref={ ref }></button>
            </div>
        })
    ```
5. `useRef`， 用法跟React.createRef差不多
    ```
    const boxRef = useRef(null);

    return <div>
        <button ref = {boxRef}>
    </div>

    boxRef.current就是DOM对象
    ```
6. useRef和React.createRef区别 
    - useRef每次在组件更新的时候(函数重新执行)，再次执行useRef的时候，不会创建新的ref对象了，获取到的还是第一次创建的那个Ref对象
    - React.createRef在 每一次组件更新的时候，都会创建一个全新的Ref对象，比较浪费性能 -->针对组件函数是这样的， 类组件内的createRef不会重新创建，因为类组件每次更新不会重新创建实例
    - 所以一般的，在类组件中使用React.createRef, 在函数组件中，为了保证性能，最好使用专属的useRef来处理
7. 如果调用的组件是函数组件，是不能在调用这个函数组件的时候给子组件添加ref={boxRef}这个属性的，想要获取函数组件中的某个元素需要配合`React.forwardRef`来使用
    ```
    const Child = React.forwardRef( function Child(props，ref){
        return <div>
            <button ref={ref}></button>
        </div>
    });

    const Demo = function Demo(){
        let childRef = useRef(null);
        return <div>
            <Demo ref = { childRef } ></Demo>
        </div>；
        // 这样在函数组件Demo中childRef.current就是子组件中的button的DOM元素
    }
    ```
8. 通过·`React.forwardRef`和`useImperativeHandle`可以获取子级函数组件内部的状态和方法
    ```
    const Child = React.forwardRef( function Child(props，ref){

        let [txt, setTxt] = useState('你好哇')；
        const submit = ()=>{...}

        useImperativeHandle(ref, ()=>{
            // 在useImperativeHandle第二个参数的返回值里面返回的对象可以被父组件的ref对象获取到
            return {
                txt，
                submit
            }
        })

        return <div>
            <button >啊啊啊啊</button> // 使用了useImperativeHandle来转发子组件内部的数据和方法，就不需要在具体的dom元素上添加ref={ref}属性了，加了也获取不到
        </div>
    });

    const Demo = function Demo(){
        let childRef = useRef(null);
        return <div>
            <Demo ref = { childRef } ></Demo>
        </div>；
        // 这样在函数组件Demo中childRef.current就是子组件中的button的DOM元素
    }
    ```
    
