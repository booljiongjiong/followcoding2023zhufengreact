1. `Object.getOwnPropertyDescriptors`
    - Object.getOwnPropertyDescriptors(对象, 成员) 获取对象的某个成员的规则
    - Object.getOwnPropertyDescriptors(对象) 获取对象的所有成员的规则
    - 规则有：
        - configurable: 是否可删除
        - writeable: 是否可被更改
        - enumerable: 是否可被枚举(可以被forin或者Object.keys列举出来的的属性是可枚举的)
        - value：成员的值
2. `Object.defineProperty(对象，成员，规则)`
    - 设置对象中某个成员的规则：成员存在则修改规则，不存在则新增成员并设置规则，默认规则都是false,默认value都是undefined
    - 数据劫持
        ```
        Object.defineProperty(obj, 'x', {
            get(){
                //获取成员x的时候触发
                ...
                rturn xxx;
            },
            set(val){
                // 设置成员x的时候触发
                ...
            }
        })
        ```