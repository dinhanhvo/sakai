import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, NgClass, NgIf} from "@angular/common";
import {DialogModule} from "primeng/dialog";
import {DropdownModule} from "primeng/dropdown";
import {FileUploadModule} from "primeng/fileupload";
import {InputNumberModule} from "primeng/inputnumber";
import {InputTextModule} from "primeng/inputtext";
import {InputTextareaModule} from "primeng/inputtextarea";
import {PaginatorModule} from "primeng/paginator";
import {RadioButtonModule} from "primeng/radiobutton";
import {RatingModule} from "primeng/rating";
import {RippleModule} from "primeng/ripple";
import {MessageService, SharedModule} from "primeng/api";
import {Table, TableModule} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {Project} from "../../../model/project";
import {ProductService} from "../../../demo/service/product.service";
import {ProjectService} from "./project.service";
@Component({
  selector: 'app-project',
  standalone: true,
    imports: [
        ButtonModule,
        CurrencyPipe,
        DialogModule,
        DropdownModule,
        FileUploadModule,
        InputNumberModule,
        InputTextModule,
        InputTextareaModule,
        NgIf,
        PaginatorModule,
        RadioButtonModule,
        RatingModule,
        RippleModule,
        SharedModule,
        TableModule,
        ToastModule,
        ToolbarModule,
        NgClass
    ],
  templateUrl: './project.component.html',
  styleUrl: './project.component.scss',
  providers: [ProjectService]
})
export class ProjectComponent implements OnInit {

    projectDialog: boolean = false;

    deleteProjectDialog: boolean = false;

    deleteProjectsDialog: boolean = false;

    projects: Project[] = [];

    project: Project = {};

    selectedProjects: Project[] = [];

    submitted: boolean = false;

    cols: any[] = [];

    statuses: any[] = [];

    rowsPerPageOptions = [5, 10, 20];

    constructor(private projectService: ProjectService, private messageService: MessageService) { }

    ngOnInit() {
        this.projectService.getProjects().then(data => this.projects = data);

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'owner', header: 'Owner' },
            { field: 'createdAt', header: 'Created At' },
            { field: 'updatedAt', header: 'Updated At' }
        ];

            this.statuses = [
                { label: 'INSTOCK', value: 'instock' },
                { label: 'LOWSTOCK', value: 'lowstock' },
                { label: 'OUTOFSTOCK', value: 'outofstock' }
            ];
    }

    openNew() {
        this.project = {};
        this.submitted = false;
        this.projectDialog = true;
    }

    deleteSelectedProjects() {
        this.deleteProjectsDialog = true;
    }

    editProject(project: Project) {
        this.project = { ...project };
        this.projectDialog = true;
    }

    deleteProject(project: Project) {
        this.deleteProjectDialog = true;
        this.project = { ...project };
    }

    confirmDeleteSelected() {
        this.deleteProjectsDialog = false;
        this.projects = this.projects.filter(val => !this.selectedProjects.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Projects Deleted', life: 3000 });
        this.selectedProjects = [];
    }

    confirmDelete() {
        this.deleteProjectDialog = false;
        this.projects = this.projects.filter(val => val.id !== this.project.id);
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Deleted', life: 3000 });
        this.project = {};
    }

    hideDialog() {
        this.projectDialog = false;
        this.submitted = false;
    }

    saveProject() {
        this.submitted = true;

        if (this.project.name?.trim()) {
            if (this.project.id) {
                // @ts-ignore
                this.project.inventoryStatus = this.project.inventoryStatus.value ? this.project.inventoryStatus.value : this.project.inventoryStatus;
                this.projects[this.findIndexById(this.project.id)] = this.project;
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Updated', life: 3000 });
            } else {
                // this.project.id = this.createId();
                // this.project.code = this.createId();
                // this.project.image = 'project-placeholder.svg';
                // @ts-ignore
                // this.project.inventoryStatus = this.project.inventoryStatus ? this.project.inventoryStatus.value : 'INSTOCK';
                // this.projects.push(this.project);
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Created', life: 3000 });
            }

            this.projects = [...this.projects];
            this.projectDialog = false;
            this.project = {};
        }
    }

    findIndexById(id: string): number {
        let index = -1;
        for (let i = 0; i < this.projects.length; i++) {
            if (this.projects[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    createId(): string {
        let id = '';
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

}
