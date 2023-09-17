1. `useCallback(callback, [dependencies])`
    - 组件第一次渲染， useCallback执行，创建一个函数'callback', 赋值给xxx
    - 组件后续每一次更新，依赖值改变则重新创建新的函数堆，赋值给xxx，依赖值没有改变或者没有设置依赖项[]，则xxx获取的一直是第一次创建出来的函数堆，不会创建新的出来
    ```
        const xxx = useCallback(() => {
            // 
        }, [依赖项])
    ```
    - 也就是说， 基于useCallBack，可以获取第一次创建函数的堆内存地址（或者说函数的引用）
    - 并不是所有函数组件内部的函数用useCallback来处理会更好，不要乱用
        - 啥时候用useCallback更好呢？
            - 父组件嵌套子组件，父组件要把内部的一个函数，基于属性传递给子组件，此时传递的这个点方法，在父组件中我们基于useCallback处理会更好
                - 因为当父组件传递给子组件的属性仅仅是一个函数（且函数计算是不变的），当父组件更新的时候，就不希望子组件跟着更新
                - 第一条：传递给子组件的属性是函数，每一次需要是相同的内存地址，基于useCallback处理
                - 第二条：在子组件内部也要做一个相应处理，就是验证父组件传递的属性是否发生改变，如果没有变化，则子组件不更新，否则更新。那么：
                    - 子组件是类组件的话，子组件需要继承React.PureComponent
                        ```
                        Class Child extends React.PureComponent{
                            ...
                        }
                        ```
                    - 子组件是函数组件的话，子组件整个定义需要使用React.Memo包起来，在React.memo内部会对传递的属性的新老值做浅比较，有变化才会把函数子组件执行后更新，没有变化子组件不更新
                        ```
                        const Child = React.memo(function Child(props){
                            ...
                            handle = () => {
                                props?.fatherCallBack();
                            }

                            return <div>
                                <button onClick={ () => { handle }}></button>
                            </div>
                        })
                        ```