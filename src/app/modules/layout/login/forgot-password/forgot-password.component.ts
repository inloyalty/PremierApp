import { Component } from "@angular/core";
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
    templateUrl: './forgot-password.component.html',
    styleUrls : ['./forgot-password.component.css']
})

export class ForgotPasswordComponent {

    public forgotPasswordModel: any = {}
    public isUserNameVerified = false;
    public isConfirmPasswordValid=false;
    public loading=false;

    constructor(
        private navigationSvc: NavigationService,
        private authSvc: AuthService,
        private toastrSvc: ToastrService,
        private localStorageSvc: LocalStorageService

    ) { }

    async  onChangePassword() {
        try {
            let apiResponse = await this.authSvc.changePassword(this.forgotPasswordModel);
            console.log(apiResponse);
            if (apiResponse.message) {
                if (apiResponse.message.code == 200) {
                    //  await this.navigationSvc.navigateTo('dashboard');
                    this.toastrSvc.success('Password changed successfully.');
                }
                else {
                    this.toastrSvc.error(apiResponse.message.description);
                }
            }
            else {
                this.toastrSvc.error('Something went wrong. Please try after sometime');
            }
        } catch (error) {
            this.toastrSvc.error('Something went wrong. Please try after sometime');

        }
    }

    onLogin() {
        this.navigationSvc.navigateTo('login');
    }
    isConfirmedPasswordMatched()
    {
        let retVal=false;

        if(this.forgotPasswordModel.confirmPassword && this.forgotPasswordModel.confirmPassword.length>0 && this.forgotPasswordModel.confirmPassword== this.forgotPasswordModel.password)
        {
            retVal= true;
        }
        return retVal;
    }
}