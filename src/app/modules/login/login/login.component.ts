import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AppConstant } from '../../constants/app-constant';

@Component({
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']

})

export class LoginComponent implements OnInit, OnDestroy {

    // delcare public variables 
    public organisationsList: Array<any> = [];
    public selectedOrganisationId: any;

    public isServerUrlAdd: boolean = false;
    public appLogo = "src/assets/images/logo.png";
    public apiBaseUrl: string;
    public loading = false;
    public appBackgroundImage: any;
    public userName: any = '';
    public showOtp: boolean = false;
    public loginModel: any = {};
    constructor(
        private navigationSvc: NavigationService,
        private authSvc: AuthService,
        private toastrSvc: ToastrService,
        private localStorageSvc: LocalStorageService

    ) { }

    ngOnInit(): void {

    }


    async onLogin() {

        try {
            this.loading=true;
            let apiResponse = await this.authSvc.authenticate(this.loginModel);
            console.log(apiResponse);
            if (apiResponse.message) {
                if (apiResponse.message.code == 200) {
                    this.localStorageSvc.set(AppConstant.LOGGED_IN_USER_INFO, JSON.stringify(apiResponse.data));
                    console.log(apiResponse.data.token);
                    this.localStorageSvc.set(AppConstant.AUTH_TOKEN, apiResponse.data.token);
                    await this.navigationSvc.navigateTo('dashboard');
                }
                else {
                    this.toastrSvc.error(apiResponse.message.description);
                }
            }
            else{
                this.toastrSvc.error('Something went wrong. Please try after sometime');
            }
            this.loading=false;
        } catch (error) {
            this.toastrSvc.error('Something went wrong. Please try after sometime');
            this.loading=false;

        }

        //   


    }

    async validateApiEndPoint() {

    }


    addUrl() {
        this.apiBaseUrl = '';
        this.isServerUrlAdd = !this.isServerUrlAdd;
    }

    onChangeOrg($event: any) {
    }

  async  onForgotPassword() {
        await this.navigationSvc.navigateTo('login/forgot-password');
    }

    onCancel() {
        this.showOtp = !this.showOtp;
    }

    async  onSignUpClick() {
        await this.navigationSvc.navigateTo('login/sign-up');
    }

    ngOnDestroy(): void {
        this.doCleanUp();
    }

    /* Helper Methods */

    private selectedOrgansation() {

    }

    private formatApiBaseUrl() {
        if (!this.apiBaseUrl.toLowerCase().endsWith('/api') && !this.apiBaseUrl.toLowerCase().endsWith('/api/')) {
            return `${this.apiBaseUrl}/api/`
        }
        else if (!this.apiBaseUrl.endsWith('/')) {
            return `${this.apiBaseUrl}/`
        }
        else {
            return this.apiBaseUrl;
        }
    }

    private doCleanUp() {

    }

}
