import { Injectable } from '@angular/core';
import { HttpRestClientService } from 'src/app/shared/services/http-rest-client.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';

@Injectable()
export class LeageService {
    constructor(
        private httpRestClientSvc: HttpRestClientService,
    ) {
    }

    async getLeagues(filter: any = null) {
        let responseModel: any;
        await this.httpRestClientSvc.get(`Leagues`, filter).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async saveLeague(model: any) {
        let responseModel: any;
        await this.httpRestClientSvc.postFormData('Leagues', model).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getTeamPlayersByTeamId(teamId: number) {
        let responseModel: any;
        await this.httpRestClientSvc.get(`Teams/${teamId}/TeamPlayers`).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async saveLeagueMatch(model: any) {
        let responseModel: any;
        await this.httpRestClientSvc.post('Leagues/LeagueMatches', model).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getLeagueMatches(filter:any) {
        let responseModel: any;
        await this.httpRestClientSvc.get(`Leagues/LeagueMatches`, filter).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getLeagueMatch(leagueMatchId) {
        let responseModel: any;
        await this.httpRestClientSvc.get(`Leagues/LeagueMatches/${leagueMatchId}`, null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }
    async deleteLeague(id) {
        let responseModel: any;
        await this.httpRestClientSvc.get(`Leagues/${id}/delete`).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async deleteLeagueMatch(id) {
        let responseModel: any;
        await this.httpRestClientSvc.get(`Leagues/LeagueMatches/${id}/delete`).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getScoringPoints() {
        let responseModel: any;
        await this.httpRestClientSvc.get(`Leagues/SportStatistics/Points`, null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async saveBasketBallMatchScorePoints(model: any) {
        let responseModel: any;
        await this.httpRestClientSvc.post('Leagues/LeagueMatchBasketBallScores', model).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async finishMatchMatch(id) {
        let responseModel: any;
        await this.httpRestClientSvc.get(`Leagues/LeagueMatches/${id}/FinishMatch`).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    
    async getBasketBallMatchScore(leagueMatchId) {
        let responseModel: any;
        await this.httpRestClientSvc.get(`Leagues/LeagueMatches/${leagueMatchId}/MatchScore/BasketBall`, null).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getUpComingMatches(userId:number, filter:any) {
        let responseModel: any;
        await this.httpRestClientSvc.get(`Leagues/LeagueMatches/${userId}/UpComingMatches`, filter).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getPastMatches(userId:number, filter:any) {
        let responseModel: any;
        await this.httpRestClientSvc.get(`Leagues/LeagueMatches/${userId}/PastMatches`, filter).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async saveBasketBallSession(model: any) {
        let responseModel: any;
        await this.httpRestClientSvc.post('Leagues/LeagueMatchBasketBallSession/Save', model).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async saveBasketBallOverTimeSession(model: any) {
        let responseModel: any;
        await this.httpRestClientSvc.post('Leagues/LeagueMatchBasketBallSession/Save/OverTime', model).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }


    
    async saveBasketBallLineup(model: any) {
        let responseModel: any;
        await this.httpRestClientSvc.post('Leagues/LeagueMatchBasketBallLineups/Save', model).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async saveLeagueMatchPlayByPlay(model: any) {
        let responseModel: any;
        await this.httpRestClientSvc.post('Leagues/LeagueMatchPlayByPlays/Save', model).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }
 
    async saveSchool(model: any) {
        let responseModel: any;
        await this.httpRestClientSvc.postFormData('Leagues/LeagueSchools', model).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }


}
