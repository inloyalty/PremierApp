import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormsModule } from "@angular/forms";
import { LoginLayoutComponent } from './login-layout/login-layout.component';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AuthService } from './auth.service';
import { HttpRestClientService } from 'src/app/shared/services/http-rest-client.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from "ngx-bootstrap";
import { SignUpComponent } from './sign-up/sign-up.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { SharedDirectiveModule } from 'src/app/shared/directives/shared.directive.module';
import { TopNavModule } from '../../shared/modules/top-nav/top-nav.module';
import { FooterModule } from '../../shared/modules/footer/footer.module';
import { LoginComponent } from './login/login.component';
import { MydSegmentedButtonModue } from 'src/app/shared/modules/myd-segmented-button/myd-segmented-button.module';
import { LoginRoutingModule } from './login.routing.module';


@NgModule({
    declarations: [LoginLayoutComponent,LoginComponent, SignUpComponent, ForgotPasswordComponent, VerifyEmailComponent],
    imports: [CommonModule,LoginRoutingModule,TopNavModule, FooterModule, FormsModule, NgSelectModule, BsDatepickerModule.forRoot(), 
        SharedDirectiveModule
    ,MydSegmentedButtonModue],
    providers: [NavigationService, AuthService, HttpRestClientService, LocalStorageService],
    entryComponents: []
})

export class LoginModule { }