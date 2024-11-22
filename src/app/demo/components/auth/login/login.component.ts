import {Component, Input, OnInit} from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {LoginService} from "../../../../services/login.service";

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [`
        :host ::ng-deep .pi-eye,
        :host ::ng-deep .pi-eye-slash {
            transform:scale(1.6);
            margin-right: 1rem;
            color: var(--primary-color) !important;
        }
    `]
})
export class LoginComponent implements OnInit {
    @Input() username = '';
    @Input() password = '';

    valCheck: string[] = ['remember'];

    constructor(public layoutService: LayoutService,
                private loginService: LoginService
                ) { }

    login() {

        console.log('------ username: ', this.username)
        this.loginService.login(this.username, this.password).subscribe({
            next: (response: any) => {
                console.log('-------- login response: ', response)
            },
            complete: () => {},
            error: err => {}
        })
    }

    ngOnInit(): void {
    }
}
