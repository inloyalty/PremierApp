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
        await this.httpRestClientSvc.get(`Accounts/Users/${userId}`,null).then(
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
        await this.httpRestClientSvc.post('Accounts/Users', userModel).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getUsers(){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Accounts/Users`,null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }
     
    async getUserSports(userId:number){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Accounts/UserSports?userId=${userId}`,null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async saveUserSport(model : any){
        let responseModel : any;
        await this.httpRestClientSvc.post('Accounts/UserSports', model).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

     
    async deleteUserSport(id:number){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Accounts/UserSports/${id}/delete`,null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getUserClubJoins(userId:number){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Accounts/UserClubJoins?userId=${userId}`,null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async saveUserClubJoin(model : any){
        let responseModel : any;
        await this.httpRestClientSvc.post('Accounts/UserClubJoins', model).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

     
    async deleteUserClubJoin(id:number){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Accounts/UserClubJoins/${id}/delete`,null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getUserRewards(userId:number){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Accounts/UserRewards?userId=${userId}`,null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async saveUserReward(model : any){
        let responseModel : any;
        await this.httpRestClientSvc.post('Accounts/UserRewards', model).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

     
    async deleteUserReward(id:number){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Accounts/UserRewards/${id}/delete`,null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async UpdateIslogedIn(id:number){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Accounts/Users/${id}/UpdateIslogedIn`,null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

}
