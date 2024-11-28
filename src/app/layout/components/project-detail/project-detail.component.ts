import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DatePipe, NgClass, NgIf, UpperCasePipe} from "@angular/common";
import {InputTextModule} from "primeng/inputtext";
import {RippleModule} from "primeng/ripple";
import {MessageService, SharedModule} from "primeng/api";
import {Table, TableModule} from "primeng/table";
import {Task, TaskRequest} from "../../../model/task";
import {UIOption, User} from "../../../model/user";
import {Project} from "../../../model/project";
import {TaskService} from "../task/task.service";
import {UserService} from "../../../services/user.service";
import {ProjectService} from "../project/project.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {mapProjectsToLabelValue, mapUsersToLabelValue} from "../../../mappers/mapperUtil";
import {ActivatedRoute} from "@angular/router";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PaginatorModule} from "primeng/paginator";
import {findIndexById} from "../../../utils/common.util";
import {TaskMapper} from "../../../mappers/TaskMapper";
import {FileUploadModule} from "primeng/fileupload";
import {ToolbarModule} from "primeng/toolbar";

@Component({
  selector: 'app-project-detail',
  standalone: true,
    imports: [
        ButtonModule,
        DatePipe,
        InputTextModule,
        RippleModule,
        SharedModule,
        TableModule,
        DialogModule,
        DropdownModule,
        InputTextareaModule,
        NgIf,
        PaginatorModule,
        UpperCasePipe,
        FileUploadModule,
        ToolbarModule,
        NgClass
    ],
  templateUrl: './project-detail.component.html',
  styleUrl: './project-detail.component.scss'
})
export class ProjectDetailComponent implements OnInit {
    taskDialog: boolean = false;

    deleteTaskDialog: boolean = false;

    deleteTasksDialog: boolean = false;

    tasks: Task[] = [];

    taskRequest: TaskRequest = {};

    selectedTasks: Task[] = [];

    cols: any[] = [];

    statuses: any[] = [];

    selectUsers: UIOption[] = []
    users: User[] = []
    selectProjects: UIOption[] = []
    projects: Project[] = []

    private projectId: string;
    project: Project;

    form: FormGroup;
    submitted: boolean = false;

    constructor(
        private route: ActivatedRoute,
        private taskService: TaskService,
        private projectService: ProjectService,
        private messageService: MessageService,
    ) {
    }

    ngOnInit() {
        this.projectId = this.route.snapshot.paramMap.get('id');

        this.projectService.getProjectsById(this.projectId).subscribe({
            next: (response: any) => {
                console.log('-------- project detail response: ', response)
                this.project = {...response}
                console.log('-------- project detail : ', this.project)
                this.tasks = this.project['taskDTOS']
                console.log('----------- taskDTOS: ', this.tasks)
            },
            complete: () => {},
            error: err => {}
        })

        this.cols = [
            { field: 'title', header: 'Title' },
            { field: 'project', header: 'Project' },
            { field: 'assignedTo', header: 'AssignedTo' },
            { field: 'description', header: 'Description' },
            { field: 'status', header: 'Status' },
            { field: 'createdAt', header: 'Created At' },
            { field: 'updatedAt', header: 'Updated At' }
        ];

        this.statuses = [
            { label: 'COMPLETED', value: 'COMPLETED' },
            { label: 'PROCESSING', value: 'PROCESSING' },
            { label: 'OPEN', value: 'OPEN' }
        ];

        this.taskRequest.project = -1;
        this.taskRequest.status = this.statuses[2]
    }

    confirmDelete() {
        this.taskService.deleteTask(this.taskRequest.id).subscribe({
            next: (response: any) => {
                console.log('-------- delete task response: ', response)

                this.tasks.splice(findIndexById(this.taskRequest.id), 0)
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task deleted', life: 3000 });
                this.taskDialog = false;
            },
            complete: () => {
                this.taskDialog = false;
                this.taskRequest = {};
            },
            error: err => {
                this.taskDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Can not delete task' });
            }
        })
    }

    deleteTask(task: TaskRequest) {
        this.deleteTaskDialog = true;
        this.taskRequest = { ...task };
    }

    confirmDeleteSelected() {
        this.tasks = this.tasks.filter(val => !this.selectedTasks.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Tasks deleted', life: 3000 });
        this.selectedTasks = [];
        this.deleteTasksDialog = false;
    }

    openNew() {
        this.taskRequest = {};
        this.taskDialog = true;
    }

    deleteSelectedTasks() {
        this.deleteTasksDialog = true;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    getOptionName(id: number, opts: UIOption[]): string {
        let opt = opts.find(opt => opt.value === id)
        return opt.label
    }

    editTask(task: Task) {
        // console.log('from Task: : ' , task)
        // let selectProject = this.selectProjects.find(prj => prj.label === task.project)
        // this.taskRequest = TaskMapper.toRequest(task);
        // this.taskRequest.project = selectProject.value
        // const selectAssigned = this.selectUsers.find((u => u.label = task.assignedTo))
        // this.taskRequest.assignedTo = selectAssigned.value
        // console.log('to taskRequest (prepare to edit): ' , this.taskRequest)
        // this.taskDialog = true;
    }


    get selectedProjectControl() {
        return this.form.get('selectedProject');
    }
    validateTaskForm(): boolean {
        return  this.taskRequest.title?.trim() && this.taskRequest.project > 0
    }

    saveTask() {
        this.submitted = true;

        if (this.validateTaskForm()) {
            if (this.taskRequest.id) {
                this.taskService.updateTask(this.taskRequest).subscribe({
                    next: (response: any) => {
                        console.log('-------- task response: ', response)
                        let pro: Task = response
                        this.tasks[findIndexById(pro.id)] = pro
                        this.tasks = this.tasks.sort((pr1, pr2) => this.compareTime(pr2.updatedAt, pr1.updatedAt));
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task updated', life: 3000 });
                    },
                    complete: () => {
                        this.taskDialog = false;
                        this.taskRequest = {};
                    },
                    error: err => {
                        this.taskDialog = false;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Can not add task' });
                    }
                })
            } else {
                this.taskService.newTask(this.taskRequest).subscribe({
                    next: (response: any) => {
                        console.log('-------- task response: ', response)
                        this.tasks.push(response)
                        this.tasks = this.tasks.sort((pr1, pr2) => this.compareTime(pr1.updatedAt, pr2.updatedAt));
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Task Created', life: 3000 });
                    },
                    complete: () => {
                        this.taskDialog = false;
                        this.taskRequest = {};
                    },
                    error: err => {
                        this.taskDialog = false;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Can not add task' });
                    }
                })
            }
        }
    }
    compareTime(sdate1: Date, sdate2: Date) {
        const date1 = new Date(sdate1)
        const date2 = new Date(sdate2)
        return date1.getTime() - date2.getTime();
    }
    hideDialog() {
        this.taskDialog = false;
        this.submitted = false;
    }

}
