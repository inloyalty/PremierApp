import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { LoginComponent } from './login/login.component';


const LOGIN_ROUTES: Routes = [
    {
        path: '', component: LoginComponent,
        children:
            [
                {
                    path: '', component: LoginLayoutComponent
                }
                ,
                {
                    path: 'login', component: LoginLayoutComponent
                }
                ,
                {
                    path: 'sign-up', component: SignUpComponent
                }
                ,
                {
                    path: 'forgot-password', component: ForgotPasswordComponent
                }
                ,
                {
                    path: 'verify-email', component: VerifyEmailComponent
                }
            ]
    }
]

@NgModule({
    imports: [
        RouterModule.forChild(LOGIN_ROUTES)
    ],
    exports: [RouterModule]

})

export class LoginRoutingModule { }