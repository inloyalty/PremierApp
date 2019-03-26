import { Injectable } from '@angular/core';
import { HttpRestClientService } from 'src/app/shared/services/http-rest-client.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable()
export class TeamService {
    constructor(
        private httpRestClientSvc: HttpRestClientService,
    ) {
    }

    async getTeams(filter:any=null){
        console.log(filter);
        let responseModel : any;
        await this.httpRestClientSvc.get(`Teams`,filter).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async saveTeam(teamModel : any){
        let responseModel : any;
        await this.httpRestClientSvc.postFormData('Teams', teamModel).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getTeamPlayers(filter:any=null){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Teams/TeamPlayers`,filter).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async saveTeamPlayer(teamModel : any){
        let responseModel : any;
        await this.httpRestClientSvc.postFormData('Teams/TeamPlayers', teamModel).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async deleteTeam(id){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Teams/${id}/delete`).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }
    async deleteTeamPlayer(id){
        let responseModel : any;
        await this.httpRestClientSvc.get(`Teams/TeamPlayers/${id}/delete`).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }
     
}
