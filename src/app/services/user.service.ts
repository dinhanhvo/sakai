import { Injectable } from '@angular/core';
import {BaseService} from "./base.service";
import {User} from "../model/user";



@Injectable({
  providedIn: 'root'
})
export class UserService {

    private  API_USERS: string = '/users';

    constructor(private baseService: BaseService
    ) {
    }

    getUsers() {
        return this.baseService.getData('/users');
    }

    public newUser(user: User) {
        return this.baseService.postData(this.API_USERS, user)
    }

    public updateUser(user: User) {
        return this.baseService.putData(`${this.API_USERS}` + '/' + `${user.id}`, user)
    }

    public deleteUser(id: number) {
        return this.baseService.deleteData(`${this.API_USERS}` + '/' + `${id}`)
    }
}
