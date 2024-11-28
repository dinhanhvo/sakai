import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = (route, state) => {
    // const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const isAuthenticated = sessionStorage.getItem('isAuthenticated') ;

    const router = inject(Router);

    if (isAuthenticated) {
        return true;
    } else {
        router.navigate(['/login'], { queryParams: { returnUrl: state.url } }); // Điều hướng đến trang đăng nhập
        return false;
    }
};
