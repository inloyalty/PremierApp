import { Injectable } from '@angular/core';
import { HttpRestClientService } from 'src/app/shared/services/http-rest-client.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AppConstant } from '../constants/app-constant';

@Injectable()
export class AuthService {
  baseUrl = 'http://216.15.177.55/PremierApi/api/';
//   baseUrl = 'http://localhost:55937/api/';
    constructor(
        private httpRestClientSvc: HttpRestClientService,
        private localStorageSvc: LocalStorageService
    ) {
        // this.localStorageSvc.set(AppConstant.API_BASE_URL, this.baseUrl);
    }

    async register(userModel : any){
        console.log(userModel);
        let responseModel : any;
        await this.httpRestClientSvc.post('Authentication/Register', userModel).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async authenticate(loginModel : any){
        let responseModel : any;
        await this.httpRestClientSvc.post('Authentication/Authenticate', loginModel).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async changePassword(forgotPasswordModel : any){
        let responseModel : any;
        await this.httpRestClientSvc.post('Authentication/ChangePassword', forgotPasswordModel).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }
    async verifyEmail(emailVerificationCode : any){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Authentication/VerifyEmail?emailVerificationCode=${emailVerificationCode}`, null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async emailExist(email : any){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Authentication/EmailExist?email=${email}`, null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async childEmailExists(email : any){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Authentication/ChildEmailExists?email=${email}`, null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async userNameExists(userName : any){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Authentication/UserNameExists?userName=${userName}`, null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }
}
