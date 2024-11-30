import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Project} from "../../../model/project";
import {BaseService} from "../../../services/base.service";



@Injectable({
  providedIn: 'root'
})
export class ProjectService {

    private API_PROJECT = '/project'
    private API_PROJECTS = '/projects'

    constructor(private http: HttpClient,
                private baseService: BaseService) { }

    // getProjects() {
    //     return this.http.get<any>('assets/FakeData/project.json')
    //         .toPromise()
    //         .then(res => res.data as Project[])
    //         .then(data => data);
    // }
    getProjectsById(id: string) {
        return this.baseService.getData(`${this.API_PROJECT}` + '/detail/' + `${id}`);
    }

    getProjectsByName(name: string) {
        return this.baseService.getData(`${this.API_PROJECTS}` + '/search?name=' + `${name}`);
    }


    getProjects() {
        return this.baseService.getData(this.API_PROJECTS);
    }

    public newProject(project: Project) {
        return this.baseService.postData(this.API_PROJECT, project)
    }

    public updateProject(project: Project) {
        return this.baseService.putData(`${this.API_PROJECT}` + '/' + `${project.id}`, project)
    }

    public deleteProject(id: number) {
        return this.baseService.deleteData(`${this.API_PROJECT}` + '/' + `${id}`)
    }
}
