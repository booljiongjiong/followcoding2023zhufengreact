import PersonalStore from "./PersonalStore";
import TaskStore from "./TaskStore";

class Store{
    constuctor(){
        this.task = new TaskStore(this);
        this.personal = new PersonalStore(this)
    }
}

export default new Store();

/* 这个类导出的实例 store = {
    task: {
        taskList: null，
        __proto__:TaskStore.prototype
            queryAllTaskAction,
            removeTaskAction,
            updateTaskAction
    },

    personal: {
        info: null,
        __proto__: PersonalStore.prototype
            queryInfo
    },

    __proto__: Store.prototype
} */