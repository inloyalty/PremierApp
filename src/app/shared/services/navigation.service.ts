import { Injectable } from "@angular/core";
import { Router, ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";

@Injectable()
export class NavigationService {

    constructor(
        private router: Router,
        private location: Location,
        private activatedRoute: ActivatedRoute) {

    }

    public navigateBack() {
        this.location.back();
    }

    public navigateForward() {
        this.location.forward();
    }

    public navigateTo(url: string, params: any = null, addInNavigationStack: boolean = true) {
        this.router.navigate([url], { queryParams: params });
    }

    public navigateByUrl(url:string){
        this.router.navigateByUrl(url);
    }

    public getParam(name: string): any {
        return new Promise<any>((resolve) => {
            this.activatedRoute.queryParams.subscribe(p => {
                const value = p[name];
                console.log(value);
                resolve(value);
            });
        });
    }
}