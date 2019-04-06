import { Component, OnInit, OnDestroy } from "@angular/core";
import { NavigationService } from 'src/app/shared/services/navigation.service';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AppConstant } from 'src/app/modules/constants/app-constant';
declare var $: any;

@Component({
    templateUrl: './login-layout.component.html',
    styleUrls: ['./login-layout.component.css']

})

export class LoginLayoutComponent implements OnInit, OnDestroy {

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
            this.loading = true;
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
            else {
                this.toastrSvc.error('Something went wrong. Please try after sometime');
            }
            this.loading = false;
        } catch (error) {
            this.toastrSvc.error('Something went wrong. Please try after sometime');
            this.loading = false;

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

    public onChangeWizard() {
        //jQuery time
        var current_fs, next_fs, previous_fs; //fieldsets
        var left, opacity, scale; //fieldset properties which we will animate
        var animating; //flag to prevent quick multi-click glitches

        $(".next").click(function () {
            if (animating) return false;
            animating = true;

            current_fs = $(this).parent();
            next_fs = $(this).parent().next();

            //activate next step on progressbar using the index of next_fs
            $("#progressbar li").eq($("fieldset").index(next_fs)).addClass("active");

            //show the next fieldset
            next_fs.show();
            //hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now, mx) {
                    //as the opacity of current_fs reduces to 0 - stored in "now"
                    //1. scale current_fs down to 80%
                    scale = 1 - (1 - now) * 0.2;
                    //2. bring next_fs from the right(50%)
                    left = (now * 50) + "%";
                    //3. increase opacity of next_fs to 1 as it moves in
                    opacity = 1 - now;
                    current_fs.css({
                        'transform': 'scale(' + scale + ')',
                        'position': 'absolute'
                    });
                    next_fs.css({ 'left': left, 'opacity': opacity });
                },
                duration: 800,
                complete: function () {
                    current_fs.hide();
                    animating = false;
                },
                //this comes from the custom easing plugin
                easing: 'easeInOutBack'
            });
        });

        $(".previous").click(function () {
            if (animating) return false;
            animating = true;

            current_fs = $(this).parent();
            previous_fs = $(this).parent().prev();

            //de-activate current step on progressbar
            $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");

            //show the previous fieldset
            previous_fs.show();
            //hide the current fieldset with style
            current_fs.animate({ opacity: 0 }, {
                step: function (now, mx) {
                    //as the opacity of current_fs reduces to 0 - stored in "now"
                    //1. scale previous_fs from 80% to 100%
                    scale = 0.8 + (1 - now) * 0.2;
                    //2. take current_fs to the right(50%) - from 0%
                    left = ((1 - now) * 50) + "%";
                    //3. increase opacity of previous_fs to 1 as it moves in
                    opacity = 1 - now;
                    current_fs.css({ 'left': left });
                    previous_fs.css({ 'transform': 'scale(' + scale + ')', 'opacity': opacity });
                },
                duration: 800,
                complete: function () {
                    current_fs.hide();
                    animating = false;
                },
                //this comes from the custom easing plugin
                easing: 'easeInOutBack'
            });
        });

        $(".submit").click(function () {
            return false;
        })
    }
}
