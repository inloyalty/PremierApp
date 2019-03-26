import { Injectable } from '@angular/core';
import { HttpRestClientService } from 'src/app/shared/services/http-rest-client.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable()
export class AccountService {
    constructor(
        private httpRestClientSvc: HttpRestClientService,
    ) {
    }

    async getUserDetail(userId : number){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Accounts/${userId}`,null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async saveUserDetail(userModel : any){
        console.log(userModel);
        let responseModel : any;
        await this.httpRestClientSvc.post('Accounts', userModel).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getUsers(){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Accounts`,null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }
     

     
}
