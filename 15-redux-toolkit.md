0. 第69-70节视频课
1. redux-toolkit最大特点：基于`切片`机制，把reducer和actionCreator混合在一起了，简化了redux使用
2. 使用
    - `configStore()`创建store
    - `reduxThunk`中间件实现异步操作
    - `createSlice({})`按照模块创建切片reducer
    - `useSelector(state=>state.task)`获取指定切片模块task的公共状态
    - `useDispatch()`创建派发函数
    - 异步函数两次派发
    ```
        // @store/index.js
        // 创建reduxStore： 注册各个模块的reducer, 指定中间件
        import {configStore} from '@reduxjs/toolkit';
        import reduxLogger from 'redux-logger';
        import reduxThunk from 'redux-thunk';

        import taskSliceReducer from './features/taskSlice'

        const store = configStore({
            // 指定reducer
            reducer: {
                // 按照模块管理各个切片导出的reducer
                task：taskSliceReducer
            },

            // 使用中间件(如果不指定任何中间件，则默认集成了reduxThunk，但是一旦设置了会整体替换默认值，需要手动指定thunk中间件)
            middleware:[reduxLogger, reduxThunk],
        }) 

        export default store;
    ```
    ```
        // @store/features/taskSlice.js
        // 创建TASK模块的切片: 每一个切片包含reducer和actionCreator
        import { createSlice } from '@reduxjs/toolkit'

        // 导入跟服务器通信的方法类(获取服务器列表的方法，删除服务器端某个项的方法，更新服务器端某个项的数据的方法)
        import http from '../../api';

        const taskSlice = createSlice({
            // 设置切片名字
            name: 'task'，

            // 设置此切片对应reducer中的初始状态
            initialState: {
                taskList: null
            },

            // 编写不同业务逻辑下，对公共状态的修改
            reducers: {
                getAllTaskList(state, action){
                    // state:redux中的公共状态信息(基于immer库管理，不需要我们自己去克隆了)
                    // action：派发的行为对象，我们无需考虑表示问题，传递的其他信息都是通过action.payload传递，没有type属性了
                    state.taskList = action.payload;
                },
                removeTask(state,{payload}){
                    let taskList = state.taskList;
                    if(!Array.isArray(taskList)) return;
                    state.taskList = taskList.filter( item => {
                        return +item.id !== +payload;
                    });
                },
                upadteTask(state,{payload}){
                    let taskList = state.taskList;
                    if(!Array.isArray(taskList)) return;
                    state.taskList = taskList.map( item => {
                        if(item.id === payload){
                            item.state = 2;
                            item.time = Date.now()+"";
                        }
                        return item;
                    });
                }
            }
        });

        
        // 打印taskSlice对象，里面包含了name, actions，reducer等
        // 从切片对象中结构出来的方法和上面reducers中配置的方法，仅仅是同名；这些结构出来的方法执行后，返回需要派发的行为对象{type:'task/getAllTaskList', payload:xxx}；后期我们可以基于dispatch进行任务派发即可
        export const {getAllTaskList, removeTask,upadteTask } = taskSlice.actions;

        // 利用从切片的actions中结构出来的方法，实现异步函数(同步函数就直接使用结构出来的同名action函数就行,不用像异步函数这样单独操作再导出了)
        export const getAllTaskListAsync = () => {
            return async dispatch => {
                let list = [];
                let result = await http.getTaskList(0);//服务器通信 获取项目列表
                list = result.list;
                // 这里就是真正的派发，传递的参数就是从切片taskSlice的actions中结构出来的方法getAllTaskList(list)执行的结果，是一个对象{type:'task/getAllTaskList',payload:xxx}
                dispatch(getAllTaskList(list));
            }
        }

        // 从切片中获取reducer
        export default taskSlice.reducer;
    ```
    ```
    // @index.jsx
    // 程序入口文件
    import React from 'react'
    import ReactDOM from 'react-dom/client'
    import Task from './views/Task'
    import { Provider } from 'react-redux'
    import store from './store'

    const root = ReactDOM.createRoot(document.getElementById('root'));
    root.render(
        <Provider store={store}>
            <Task>
        </Provider>
    )
    ```
    ```
    // @views/Task.jsx
    // 组件中使用redux-toolkit

    // 使用useSelector获取指定指定模块切片中的公共状态，使用useDispatch进行派发
    import { useSelector, useDispatch } from 'react-redux' 
    //导入模块切片中的方法， 用作patch
    import {getAllTaskListAsync, removeTask as removeTaskAction, upadteTask as upadteTaskAction} from './store/fratures/taskSlice' 
    // 导入服务器通信模块
    import http from '../api'

    const Task = function Task(){
        let [selectIndex, setSelectIndex] = useState[0],// 选中页签的index
            [tableData, setTableData] = useState([]),//渲染列表的数据
            [loading, setLoading] = useState(false);

        // 获取 task模块切片中的公共属性
        let { taskList } = useSelector(state=>state.task); 
         // 获取派发的方法
        let dispatch = useDispatch();

        // 首次渲染完成，请求服务器端所有列表数据
        useEffect(()=>{
            // 如果组件挂在成功后，获取到的task模块中的公共状态中的taskList是空的，需要向服务器请求数据。异步派发是两次dispatch
            const asyncFun = async（）=> {
                if(!taskList){ 
                    setLoading(true);
                    await dispatch(getAllTaskListAsync());
                    setLoading(false);
                }
            };
            asyncFun();
        }, []);

        // 根据选中页签筛选公共状态中的taskList中对应状态的项目列表数据
        useEffect(()=>{
            if(!taskList) taskList = []；
            if(selectedIndex !== 0){
                taskList = taskList.filter(item => {
                    return +item.state === selectedIndex;
                });
                setTableData(taskList);
            }
        }, [selectIndex, taskList]);

        const addTaskSubmit = async() => {
            await formIns.validateFields();
            let {task, time} = formIns.getFieldsValue();
            let {code} = await http.addTask();
            if(code === 0){
                closeAddFormModal();
                setLoading(true);

                // 新增操作提交成功，重新派发异步任务，获取全局项目列表数据同步到redux中
                await dispatch(getAllTaskListAsync()); 

                setLoading(false);
                message.success('新增项目成功')
            }else{
                messgae.error('新增项目失败')
            }
        };

        const removeHsndle = async(id) => {
            // 删除服务器端的一个id项目
            let { code } = await http.removeTask(id);
            if(code === 0){
                // 重新派发，更新redux中的taskList的数据
                dispatch(removeTaskAction(id))
            }else{
                message.error('删除id项目失败')
            }
        }


        return <div>
            ...
        </div>
    }
    ```