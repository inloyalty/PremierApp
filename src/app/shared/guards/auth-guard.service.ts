import { Injectable } from "@angular/core";
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';
// import { AuthService } from "src/app/modules/core/services/auth-service";

@Injectable()

export class AuthGuardService implements CanActivate {

    constructor(
        public router: Router,
        // private authSvc : AuthService
    ) { }

    canActivate(route: ActivatedRouteSnapshot): boolean {
        // if (!this.authSvc.IsAuthenticated) {
        //     this.router.navigate(['login']);
        //     return false;
        // }
        return true;
    }

}