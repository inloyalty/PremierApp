import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";
import { LoginLayoutComponent } from "./login-layout.component";

const SECURED_LAYOUT_ROUTES: Routes = [
    {
        path: '', component: LoginLayoutComponent,
        children:
            [
                {
                    path: '', loadChildren: '../../../../../login/login.module#LoginModule'
                },
                {
                    path: 'login', loadChildren: '../../login/login.module#LoginModule'
                }  
            ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(SECURED_LAYOUT_ROUTES)],
    exports: [RouterModule]
})

export class LoginLayoutRoutingModule{}