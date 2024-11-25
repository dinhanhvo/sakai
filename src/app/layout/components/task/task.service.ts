import {Injectable} from '@angular/core';
import {BaseService} from "../../../services/base.service";
import {TaskRequest} from "../../../model/task";

@Injectable({
  providedIn: 'root'
})
export class TaskService {

    private API_TASK = '/task'

    constructor(private baseService: BaseService) { }

    getTasks() {
        return this.baseService.getData('/tasks');
    }

    public newTask(task: TaskRequest) {
        return this.baseService.postData(this.API_TASK, task)
    }

    public updateTask(task: TaskRequest) {
        return this.baseService.putData(`${this.API_TASK}` + '/' + `${task.id}`, task)
    }

    public deleteTask(id: number) {
        return this.baseService.deleteData(`${this.API_TASK}` + '/' + `${id}`)
    }
}
