1. `useMemo(callback， [dependencies])` useMemo具有`计算缓存`
    - 第一次渲染的时候，callback会执行
    - 后期只有依赖的状态值改变的时候，callback才会执行
    - 每一次callback执行返回结果赋值给xxx
    ```
        let [supNum, setSup] = useState(10);
        let [oppNum, setOpp] = useState(5);

        let total = useMemo(() => {
            let total = supNum+oppNum;
            return total;
        }, [supNum, oppNum]);

        return <div>
            <span>总人数{total}</span>
        </div>
    ```
    - useMemo具备计算缓存，在依赖的状态值没有改变callback没有触发执行的时候，xxx获取到的是上一次计算出来的结果
    - 综上，如果函数组件中，有消耗时间、性能的计算操作，则尽可能使用useMemo缓存起来，设置对应的依赖，这样可以保证，当非依赖的状态发生改变，不回去处理一些没必要的操作，提高组件的更新速度