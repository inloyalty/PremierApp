import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from '@angular/router';
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Component({
    templateUrl: './verify-email.component.html'
})

export class VerifyEmailComponent implements OnInit {


    public isEmailVerified = false;
    public errorMessage='';
    public loading=false;

    constructor(
        private route: ActivatedRoute,
        private navigationSvc: NavigationService,
        private authSvc: AuthService,
        private toastrSvc: ToastrService,
        private localStorageSvc: LocalStorageService
    ) {

    }

   async ngOnInit() {

    this.route.queryParams.subscribe(p => {
        const value = p[name];
        console.log(p);
        console.log(value);
       
    });
        const email: string = this.route.snapshot.queryParamMap.get('email');
        const guid: string = this.route.snapshot.queryParamMap.get('guid');
        console.log(this.route.snapshot.queryParamMap);
        console.log(`guid ${guid} email ${email}`);
        await this.verifyEmail(guid);
    }

    async  verifyEmail(emailVerificationCode: any) {
        try {
            let apiResponse = await this.authSvc.verifyEmail(emailVerificationCode);
            console.log(apiResponse);
            if (apiResponse.message) {
                if (apiResponse.message.code == 200) {
                    //  await this.navigationSvc.navigateTo('dashboard');
                    this.toastrSvc.success('Password changed successfully.');
                    this.isEmailVerified=true;
                    
                }
                else {
                    this.toastrSvc.error(apiResponse.message.description);
                    this.errorMessage= apiResponse.message.description;
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

}