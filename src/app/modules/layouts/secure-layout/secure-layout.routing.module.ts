import { NgModule } from "@angular/core";
import { SecureLayoutComponent } from "./secure-layout.component";
import { Routes, RouterModule } from "@angular/router";
import { UserModule } from '../../user/user.module';
 

const SECURED_LAYOUT_ROUTES: Routes = [
    {
        path: '', component: SecureLayoutComponent,
        children:
            [
                {
                    path: '', loadChildren: '../../user/user.module#UserModule'
                },
                {
                    path: 'dashboard', loadChildren: '../../user/user.module#UserModule'
                },
                
                
            ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(SECURED_LAYOUT_ROUTES)],
    exports: [RouterModule]
})

export class SecureLayoutRoutingModule { }