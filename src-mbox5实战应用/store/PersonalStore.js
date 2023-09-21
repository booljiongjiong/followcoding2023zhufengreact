import { observable, action } from 'mbox';

export default class PersonalStore {
    constructor(){
        // root: 是最外层Store的实例(这个实例包含了各个模块Store的实例)
        // 我们以后可以在各个模块的TASK中，基于this.root获取根Store实例，就可以访问到其他模块的Store实例了
        this.root = root;
    }
    
    @observable info = null;

    @action.bound queryInfo(){

    }
}