import { NgModule } from "@angular/core";
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
 

const LOGIN_ROUTES: Routes = [
    {
        path: '', component: LoginComponent
    },
    {
        path: 'login', component: LoginComponent
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

@NgModule({
    imports: [
        RouterModule.forChild(LOGIN_ROUTES)
    ],
    exports: [RouterModule]
    
})

export class LoginRoutingModule { }