1. `自定义hook`
    - 作用： 提取封装一些公共的处理逻辑
    - 玩法： 创建一个函数，名字是useXXX，后期就可以在组件中调用这个方法
        ```
        const usePartialState = function usePartialSatte(initSValue){
            let [state, setState] = useState(initValue);

            // react自己的useState的callback不支持部分修改，设置什么就会把state整体替换成什么
            // 自己定义的setPartial可以支持state部分修改
            const setPartial = function setPartial(partialState){
                setState({
                    ...state,
                    ...partialState
                });
            }

            return [state, setPartial];
        };

        const useDidMount = function useDidMount(txt){
            txt = txt || '哈哈哈哈哈'

            useEffect(()=>{
                document.title = txt;
            }, [])
        };

        const Demo = funciton Demo(){
            let [state, setPartial] = usePartialState({
                supNUm: 10,
                oppNum:5
            });

            useDidMount('自定义一个在组件第一次渲染完成后修改文档标题的hook组件')

            const handle = (type)=>{
                if(type==='sup'){
                    setPrtial({
                        supNum: supNum+1
                    });
                }
            }

            return <div>
                <button onClick = { handle.bind(null, 'sup') }> 支持人数 </button>
            </div>
        }
        ```
    - 自定义hook组件以use打头的话，在函数组件内部调用的时候是严格按照react的hook组件对待的，比如不能在判断条件里面包裹hook组件，如果自定义hook名称不是use打头，与欧版不受限制，但是建议还是使用use打头