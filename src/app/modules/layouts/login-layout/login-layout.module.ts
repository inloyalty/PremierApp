import { NgModule } from "@angular/core";
import { LoginLayoutComponent } from "./login-layout.component";
import { LoginLayoutRoutingModule } from "./login-layout.routing.module";
import { LoginModule } from '../../layout/login/login.module';

LoginModule
@NgModule({
    declarations : [LoginLayoutComponent],
    imports : [LoginLayoutRoutingModule, LoginModule],
    exports : [LoginLayoutRoutingModule]
})

export class LoginLayoutModule {

}