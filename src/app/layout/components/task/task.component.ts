import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {DatePipe, NgClass, NgIf, UpperCasePipe} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {FileUploadModule} from "primeng/fileupload";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PaginatorModule} from "primeng/paginator";
import {RippleModule} from "primeng/ripple";
import {MessageService, SharedModule} from "primeng/api";
import {Table, TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {Task, TaskRequest} from "../../../model/task";
import {TaskService} from "./task.service";
import {UIOption, User} from "../../../model/user";
import {UserService} from "../../../services/user.service";
import {ProjectService} from "../project/project.service";
import {mapProjectsToLabelValue, mapUsersToLabelValue} from "../../../mappers/mapperUtil";
import {Project} from "../../../model/project";
import {TaskMapper} from "../../../mappers/TaskMapper";
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";

@Component({
  selector: 'app-task',
  standalone: true,
    imports: [
        ButtonModule,
        DatePipe,
        DialogModule,
        FileUploadModule,
        InputTextModule,
        InputTextareaModule,
        NgIf,
        PaginatorModule,
        RippleModule,
        SharedModule,
        TableModule,
        ToastModule,
        ToolbarModule,
        NgClass,
        UpperCasePipe,
        ReactiveFormsModule
    ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.scss'
})

export class TaskComponent implements OnInit {
    taskDialog: boolean = false;

    deleteTaskDialog: boolean = false;

    deleteTasksDialog: boolean = false;

    tasks: Task[] = [];

    taskRequest: TaskRequest = {};

    selectedTasks: Task[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    selectUsers: UIOption[] = []
    users: User[] = []
    selectProjects: UIOption[] = []
    projects: Project[] = []

    rowsPerPageOptions = [5, 10, 20];

    form: FormGroup;

    constructor(
        private taskService: TaskService,
        private userService: UserService,
        private projectService: ProjectService,
        private messageService: MessageService,
        private fb: FormBuilder
    ) {
        this.form = this.fb.group({
            selectedProject: [null, Validators.required]
        });
    }

    ngOnInit() {
        this.taskService.getTasks().subscribe({
            next: (response: any) => {
                console.log('-------- get all tasks response: ', response)
                this.tasks = response
                this.tasks.sort((pr1, pr2) => this.compareTime(pr2.updatedAt, pr1.updatedAt));
                console.log('-------- tasks sorted: ', this.tasks)
            },
            complete: () => {},
            error: err => {}
        })

        this.projectService.getProjects().subscribe({
            next: (response: any) => {
                console.log('-------- project task response: ', response)
                this.projects = response
                this.selectProjects = mapProjectsToLabelValue(this.projects)
            },
            complete: () => {},
            error: err => {}
        })

        this.userService.getUsers().subscribe({
            next: (response: any) => {
                console.log('-------- user task response: ', response)
                this.users = response
                this.selectUsers = mapUsersToLabelValue(this.users)
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

    get selectedProjectControl() {
        return this.form.get('selectedProject');
    }

    openNew() {
        this.taskRequest = {};
        this.submitted = false;
        this.taskDialog = true;
    }

    deleteSelectedTasks() {
        this.deleteTasksDialog = true;
    }

    editTask(task: Task) {
        console.log('from Task: : ' , task)
        let selectProject = this.selectProjects.find(prj => prj.label === task.project)
        this.taskRequest = TaskMapper.toRequest(task);
        this.taskRequest.project = selectProject.value
        const selectAssigned = this.selectUsers.find((u => u.label = task.assignedTo))
        this.taskRequest.assignedTo = selectAssigned.value
        console.log('to taskRequest (prepare to edit): ' , this.taskRequest)
        this.taskDialog = true;
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

    confirmDelete() {
        this.taskService.deleteTask(this.taskRequest.id).subscribe({
            next: (response: any) => {
                console.log('-------- delete task response: ', response)

                this.tasks.splice(this.findIndexById(this.taskRequest.id), 0)
                this.tasks = this.tasks.sort((pr1, pr2) => this.compareTime(pr1.updatedAt, pr2.updatedAt));
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

    hideDialog() {
        this.taskDialog = false;
        this.submitted = false;
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
                        this.tasks[this.findIndexById(pro.id)] = pro
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

    getOptionName(id: number, opts: UIOption[]): string {
        let opt = opts.find(opt => opt.value === id)
        return opt.label
    }

    findIndexById(id: number): number {
        let index = -1;
        for (let i = 0; i < this.tasks.length; i++) {
            if (this.tasks[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    protected readonly name = name;
}
