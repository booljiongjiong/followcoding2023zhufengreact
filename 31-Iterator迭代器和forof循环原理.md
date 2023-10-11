1. Iteator迭代器:
    - 是一种机制: 为各种不同的数据结构提供统一的访问机制, 任何数据结构只要部署Iteator接口, 皆可以完成遍历操作(forof循环),依次处理该数据结构所有成员
    - Iteator迭代器具有以下两个特点:
        - 拥有next方法用于遍历访问该数据结构所有成员
        - 每一次遍历返回的结果是一个对象{done:true/false, value:xxx}
    - 拥有Symbol.iteator属性的数据结构,被称为可被遍历的,记忆基于forof循环处理
        - 数组  Array.prototype[Symbol(Symbol.iteator)] = function ...
        - 部分类数组: arguments/NodeList/HTMLCollection...
        - string
        - Set
        - Map
        - genarator object
        - ...
    - 对象默认不具备Symbol.iteator, 属于不可遍历的数据结构, 不能直接使用forof循环
2. forof循环原理
    ```
    for(let val of arr){

    }

    // forof原理
    arr[Symbol.iteator] = function () {
        let self = this; // this --> 就是arr
        let index = -1;

        return {
            next (){
                index ++ ;
                if(index >= self.length){
                    return {
                        done: true,
                        value: undefined
                    };
                }
                return {
                    done: false,
                    value: self[index]
                };
            }
        }
    }
    ```
    - 1. 迭代执行, 先执行数组的Symbol.iteator方法,获取一个具备迭代器规范的对象 -> itor
    - 2. 开始迭代: 每一次迭代都是把itor.next方法执行
        - 把迭代器获取到的对象中的value属性值,赋值给forof循环的val对象
        - 再看迭代器对象中done这个属性,如果是false,则继续迭代, 如果是true,则迭代结束
3. 对象的迭代
    - 可以用for/in: 获取所有的keys, 然后迭代keys; 也可以使用forof,但是需要为其设置Symbil.iteator
    ```
    // 让对象可以使用forof循环: 
    Object.prototype[Symbol.iteator] = function iteator(){
        let self = this;
        let index = -1;
        let keys = Reflect.keys(self);

        return {
            next(){
                index ++ ;
                if(key >= keys.length){
                    return {
                        done: true,
                        value: undefined
                    };
                }
                let key = keys[index];
                return {
                    done: false,
                    value: self[key]
                };
            }
        };
    }
    ```
4. 类数组对象的遍历
    ```
    // 类数组对象, 借用数组原型上的Symbol.iteator方法即可
    aryLikeObj[Symbol.iteator] = Array.prototype[Symbol.iteator];
    for (let val of aryLikeObj){
        ...
    }
    ```
5. 在实际项目中, 原生的for循环和while循环,速度比较快,forEach/forof速度差不多,但是封装的好可以提升开发效率,forin因为会逐级遍历到原型上,性能极差,不推荐使用
    
