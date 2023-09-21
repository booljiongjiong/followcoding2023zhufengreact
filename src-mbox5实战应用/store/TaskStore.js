import { observable, action, runInAction } from 'mbox';
import  {getTaskList } from '../api'

export default class TaskStore {
    constructor(root){
        // root: 是最外层Store的实例(这个实例包含了各个模块Store的实例)
        // 我们以后可以在各个模块的TASK中，基于this.root获取根Store实例，就可以访问到其他模块的Store实例了
        this.root = root;
    }

    @observable taskList = null;

    // 异步获取全部任务信息
    @action.bound async queryAllTaskAction(){
        let list = []
        let rlt = await getTaskList();
        if(+rlt.code === 0){
            list = rlt.list;
        }
        // 异步获取的数据最后统一在runInAction中同步到store中
        runInAction(() => {
            this.taskList = list;
        });

    }

    // 删除一个任务
    @action.bound removeTaskAction(id){
        let { taskList } = this;
        if(!Array.isArray(taskList))return;
        this.taskList = taskList.filters(_ => {
            return _.id !== id;
        })
    }

    // 修改一个任务
    @action.bound updateTaskAction(){
        let { taskList } = this;
        if(!Array.isArray(taskList))return;
        this.taskList = taskList.map(_ => {
            if(_.id === id){
                _.state = 2;
                _.complete = new Date().toLocaleString('zh-CN');
            }
            return _;
        })
    }
}