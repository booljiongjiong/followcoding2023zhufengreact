import React, { useState, useEffect, useLayoutEffect, useImperativeHandle, useRef } from "react";
import { Button } from 'antd';

const Child = React.forwardRef(function Child(props, ref){
    let [txt, setTxt] = useState('你好哇');
    const submitFunc = ()=>{console.log('submitFunc')};

    useImperativeHandle(ref, () => {
        return {txt, submitFunc};
    });

    return <div>
        <button ref={ref}>啊啊啊啊</button>
    </div>
})

const Demo = function Demo() {
    let childRef = useRef(null)
    console.log('RENDER');
    childRef.current && console.log('demo -> childRef',childRef)
    useEffect(()=>{
       console.log('demo -> childRef ——useEffect',childRef)
    },[])
    return <div>
        <Child ref = {childRef}></Child>
    </div>;
};

export default Demo;