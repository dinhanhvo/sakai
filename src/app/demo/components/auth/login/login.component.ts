import {Component, Input, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import {LoginService} from "../../../../services/login.service";
import {AppStoreService} from "../../../../services/app-store.service";

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
                private loginService: LoginService,
                private appStore: AppStoreService,
                private router: Router
                ) { }

    login() {
        sessionStorage.setItem('isAuthenticated', String(true));
        this.loginService.login(this.username, this.password).subscribe({
            next: (response: any) => {
                console.log('-------- login response: ', response)
                // if (response type of )
                this.appStore.setAuth(response)

                this.router.navigate(["projects"])
            },
            complete: () => {},
            error: err => {}
        })
    }

    logOut() {
        this.appStore.logout()
    }

    ngOnInit(): void {
    }
}
