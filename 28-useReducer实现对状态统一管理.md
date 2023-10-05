1. `useReducer`是对`useState`的升级处理
    - useReducer在组件内部创建一个局部的Store容器
    - dispatch派发的对象必须要有type属性,这样可以在修改状态的管理员方法reducer中根据不同的type修改不同的状态信息
    - 普通需求在处理的时候,基本都是useState直接处理,不会使用useReducer
    - 但是如果一个组件逻辑很复杂,需要大量的状态,此时使用useReducer管理这些状态会更好一些
```
import React, { useReducer } from 'react';

const initialState = {
    num: 0
};

const reducer = function reducer(state, action){
    state = {...state}; //这里需要对原来的state做一次克隆, 最后返回的新的state会覆盖旧的state,才会触发视图更新
    switch(action.type){
        case 'plus':
            state.num++;
        break;
        case 'minus':
            state.num--;
        break;
    }
    return state;//返回的状态会替换原始信息,所以在一开始state要进行克隆
}

const A1 = function A1(){

    let [state, dispatch] = useReducer(reducer, initialState);

    return <div>
        <span>{state.num}<span>
        <button onClick={
            dispatch({type:'plus'})
        } > 增加 </button>
        <button onClick={
            dispatch({type:'minus'})
        } > 减少 </button>
    </div>;
}

```