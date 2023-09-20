import React, { useState } from "react";
// import { Button } from 'antd';
// import './Demo.less';
import { flushSync } from 'react-dom';

const Demo = function Demo() {
    console.log('RENDER渲染');
    let [x, setX] = useState(10);

    const handle = () => {
       for(let i=0 ;i<10; i++){
        // flushSync(()=>{setX(x+1)});
        setX(x+1);
       }
    };
    return <div className="demo">
        <span className="num">x:{x}</span>
        <button type="primary"
            size="small"
            onClick={handle}>
            新增
        </button>
    </div>;
};

export default Demo;