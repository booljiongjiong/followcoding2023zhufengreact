1. 循环相关知识
    - for-in循环：性能较差，既可以迭代私有的，也可以迭代公有的；且只能迭代可枚举的、非symbol类型的属性。。。
    - 获取对象所有私有属性（私有的，不论是否可枚举，不论类型）
        - Object.getOwnPropertyNames：获取对象非symbol类型的私有属性（无论是否可枚举）
        - Object.getOwnPropewrtySymbols: 获取对象Symbol类型的私有属性
        - 综上，获取对象所有私有属性ley keys = Obejct.getOwnPropertyNames(arr).concat(Object.getOwnProertySymbols(arr))
    - 基于es6中的Reflect.OwnKeys，缺点是不兼容IE
        - ley keys = Reflect.ownKeys(arr)

2. jsx底层渲染机制
    1. 把jsx通过babel-preset-react-app插件编译成虚拟dom
        - 通过babel-preset-react-app把jsx编译成`React.crateElement(type, props, children)`这种***格式***
        - 再通过执行`React.crateElement(type, props, children)`这个方法得到虚拟dom
            ```
            virtualDOM = {
                $$typeof: Symbol(react.element),
                ref: null,
                key: null,
                type: 标签名「或组件」,
                // 存储了元素的相关属性 && 子节点信息
                props: {
                    元素的相关属性,
                    children:子节点信息「没有子节点则没有这个属性、属性值可能是一个值、也可能是一个数组」
                }
            }
            ```
    2. 通过React.render()把虚拟dom渲染成真实DOM
        - v16:
        ```
        React.render(组件，挂载节点)
        ```
        - v18:
        ```
        let root = React.createDom(Document.getElementById('#root'));
        root.render(组件)
        ```
        - 第一渲染的时候是把整个虚拟dom全部渲染到屏幕上， 后面的改动都是先计算出两次虚拟dom之间的差异patch, 只对差异部分进行渲染

3. react的插槽
    通过双闭合标签的形式调用组件，在闭合符号之间添加DOM模拟插槽，以达到组件的高复用性
    - 在被调用的组件内部，props是被冻结的，可以结构出来children属性， 这个children属性就包含了调用组件时候在双闭合标签内传递进来的DOM
    - 在被调用的组件内部，使用插槽的时候， 需要借助`React.Children.toArray/count/foreach... `等方法进行处理并赋值给新的变量，后续就可以使用这个新的变量， 因为props结构出来的children有可能是undefiend, 有可能就是一个虚拟DOM, 有可能是一个虚拟dom数组
    ```
        // 实现
        const DemoOne = function DemoOne(props){
            // 注意： 传递进来的children都是编译后的虚拟DOM，而不是传递的标签DOM
            const {title, style, className, children} = props;
            ....
            ....
            // 用法1
            const newChildren = React.Children.toArray(children);

            // 用法2
            const headers = [];
            const footers = [];
            const others = [];
            React.Children.forEach(childVDom => {
                const {slot} = childVDom.props；
                if(slot === 'header'){
                    headers.push(childVDom);
                }else if(slot === 'footer'){
                    footers.push(childVDom);
                }else{
                    others.push(childVDom);
                }
            })
            ....
            return <>
                {headers}

                {newChildren[0]}

                <h2>啊哈哈哈哈哈</h2>
                ...

                {newChildren[1]}

                {footers}
            </>;
        }
        export default DemoOne;
    ```
    ```
    // 调用
        React.render(
            <>
                <DemoOne title='第一段' className='firstP'>
                    <span slot='footer'>我是页脚</span> // slot字段是给传递的插槽信息设置名字， 这个名字可以是任意的， 具名插槽可以在调用的时候不用考虑顺序，设置好对应的名字就行， 在实现插槽的组件内部可以任意使用
                    <span slot='header'>我是页眉</span>
                </DemoOne>
                
                <DemoOne title='第二段' className='secP'>
                    <span slot='other'>我是第二段</span>
                </DemoOne>

                <DemoOne title='第三段' className='thirdP'>
                </DemoOne>

            </>,
        root)
    ```
4. 可以通过设置组件的props的默认值和props的属性类型 进行规则校验
    - 进行规则校验前必须引入`import PropTypes from 'prop-types'`
    ```
    // props默认值
    DemoComponent.defaultProps = {
        title:'温馨提示'，
        num:1
        ...
    }
    ```
    ```
    // props属性类型约束
    DemoComponent.propTypes = {
        title: PropTypes.string,
        num: PropTypes.isOneOf([
            PropTypes.string.isRequired,
            PropTypes.number
        ])
    }
    ``` 
5. 类组件
    1. 创建一个构造函数
        - 必须继承React.Component/PureComponent
        - 给当前类设置一个render方法（是放在其原型上的）：在render方法中，返回需要渲染的视图
        - render方法在渲染的时候，如果type是
            - 字符串： 创建一个标签
            - 普通函数： 执行这个函数，并把props传递给函数
            - 构造函数：把构造函数基于new执行（创建一个类的实例），同时传递props
    2. 从调用类组件new DemoComponent({...})开始，类组件内部发生的事情：
        - 初始化属性 & 设置规则校验(添加静态属性static defaultProps和static propTypes)
        - 初始化状态
            - 状态： 后期修改状态， 可以触发试图的更新
            - 需要手动初始化，如果没有手动初始化， 会默认在实例上挂载一个state属性，初始值是null
            ```
            // 1. 可以直接添加属性
            state = {
                title: '你好哇'，
                id: 1
            }

            // 2. 或者在constructor函数中设置
                constructor(props){
                    super(props);
                    ...
                    this.state = {
                        title: '你好哇'，
                        id:1
                    }
                }
            ``` 
            - 修改状态，更新视图
                - this.state.xxx = xxx 这种只能修改实例的state值， 并不能更新视图
                - 想要视图更新，我们需要基于`React.Component.prototype`提供的方法操作
                    - 第一种： `this.setState(partialState)`
                        - partialState: 部分状态

