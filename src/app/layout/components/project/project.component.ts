import {Component, OnInit} from '@angular/core';
import {ButtonModule} from "primeng/button";
import {CurrencyPipe, DatePipe, NgClass, NgIf, NgTemplateOutlet} from "@angular/common";
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
import {Table, TableModule, TableRowSelectEvent} from "primeng/table";
import {ToastModule} from "primeng/toast";
import {ToolbarModule} from "primeng/toolbar";
import {Project} from "../../../model/project";
import {ProjectService} from "./project.service";
import {
    AbstractControl,
    FormBuilder,
    FormGroup,
    ReactiveFormsModule,
    ValidationErrors,
    Validators
} from "@angular/forms";
import {Router} from "@angular/router";

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
        NgClass,
        DatePipe,
        ReactiveFormsModule,
        NgTemplateOutlet
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
    form: FormGroup;

    constructor(private projectService: ProjectService,
                private messageService: MessageService,
                private router: Router,
                private fb: FormBuilder
    ) {

        this.form = this.fb.group({
            username: ['', [Validators.required, Validators.minLength(4)]],
            // description: ['', [Validators.required]],
            // description: ['', [Validators.required, Validators.email]],
        });
    }

    ngOnInit() {
        this.projectService.getProjects().subscribe({
            next: (response: any) => {
                console.log('-------- login response: ', response)
                this.projects = response
                this.projects.sort((pr1, pr2) => this.compareTime(pr1.updatedAt, pr2.updatedAt));
            },
            complete: () => {},
            error: err => {}
        })

        this.cols = [
            { field: 'name', header: 'Name' },
            { field: 'description', header: 'Description' },
            { field: 'owner', header: 'Owner' },
            { field: 'createdAt', header: 'Created At' },
            { field: 'updatedAt', header: 'Updated At' }
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
        this.projects = this.projects.filter(val => !this.selectedProjects.includes(val));
        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Projects Deleted', life: 3000 });
        this.selectedProjects = [];
        this.deleteProjectsDialog = false;
    }

    confirmDelete() {
        this.projectService.deleteProject(this.project.id).subscribe({
            next: (response: any) => {
                console.log('-------- project response: ', response)

                // this.projects[this.findIndexById(this.project.id)] = pro
                this.projects.splice(this.findIndexById(this.project.id), 0)
                this.projects = this.projects.sort((pr1, pr2) => this.compareTime(pr1.updatedAt, pr2.updatedAt));
                this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project deleted', life: 3000 });
                this.deleteProjectDialog = false;
            },
            complete: () => {
                this.deleteProjectDialog = false;
                this.project = {};
            },
            error: err => {
                this.deleteProjectDialog = false;
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Can not add project' });
            }
        })
    }

    hideDialog() {
        this.projectDialog = false;
        this.submitted = false;
    }

    saveProject() {
        this.submitted = true;

        if (this.project.name?.trim()) {
            if (this.project.id) {
                this.projectService.updateProject(this.project).subscribe({
                    next: (response: any) => {
                        console.log('-------- project response: ', response)
                        let pro: Project = response
                        this.projects[this.findIndexById(pro.id)] = pro
                        this.projects = this.projects.sort((pr1, pr2) => this.compareTime(pr1.updatedAt, pr2.updatedAt));
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project updated', life: 3000 });
                    },
                    complete: () => {
                        this.projectDialog = false;
                        this.project = {};
                    },
                    error: err => {
                        this.projectDialog = false;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Can not add project' });
                    }
                })
            } else {
                this.projectService.newProject(this.project).subscribe({
                    next: (response: any) => {
                        console.log('-------- project response: ', response)
                        this.projects.push(response)
                        this.projects = this.projects.sort((pr1, pr2) => this.compareTime(pr1.updatedAt, pr2.updatedAt));
                        this.messageService.add({ severity: 'success', summary: 'Successful', detail: 'Project Created', life: 3000 });
                    },
                    complete: () => {
                        this.projectDialog = false;
                        this.project = {};
                    },
                    error: err => {
                        this.projectDialog = false;
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Can not add project' });
                    }
                })
            }
        }
    }

    compareTime(sdate1: Date, sdate2: Date) {
        const date1 = new Date(sdate1)
        const date2 = new Date(sdate2)
        console.log('-------- number: ' + (typeof date1))
        const number = date1.getTime() - date2.getTime()
        return number;
    }

    findIndexById(id: number): number {
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
        // table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
        console.log("---------------- search by name: ", event.target)
        this.projectService.getProjectsByName("go").subscribe({
            next: (response: any) => {
                console.log('-------- login response: ', response)
                this.projects = response
                this.projects.sort((pr1, pr2) => this.compareTime(pr1.updatedAt, pr2.updatedAt));
            },
            complete: () => {},
            error: err => {}
        })
    }

    // Custom Validator
    passwordStrengthValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value || '';
        const hasNumber = /\d/.test(value);
        const hasUpperCase = /[A-Z]/.test(value);
        const hasLowerCase = /[a-z]/.test(value);

        if (!hasNumber || !hasUpperCase || !hasLowerCase) {
            return { weakPassword: true };
        }
        return null;
    }

    submitForm() {
        if (this.form.valid) {
            console.log('Form Submitted Successfully!', this.form.value);
        } else {
            console.error('Form is invalid. Fix the errors and try again.');
        }
    }

    validForm() : boolean {
        return !this.project.name;
    }

    navigateToDetail(event: TableRowSelectEvent) {
        const projectId = event.data.id;
        console.log('--------', projectId)
        this.router.navigate([`/projects/${projectId}`]);
    }

    navigateToProjectDetail(projectId: number): void {
        this.router.navigate(['/projects', projectId]);
    }
}
