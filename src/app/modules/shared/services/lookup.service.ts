import { Injectable } from '@angular/core';
import { HttpRestClientService } from 'src/app/shared/services/http-rest-client.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AppConstant } from '../../constants/app-constant';
import { FilterModel } from '../../models/filter-model';
import { LookupFilter } from 'src/app/models/filter';

@Injectable()
export class LookupService {

    public filterModel = new LookupFilter();
    constructor(
        private httpRestClientSvc: HttpRestClientService,
        private localStorageSvc: LocalStorageService
    ) {
        this.filterModel.PageSize= 99999;

    }

    async getCoutries(){
        let responseModel : any;
        await this.httpRestClientSvc.get('Lookups/Countries', this.filterModel).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getStatesByCountryId(countryId:number){
        let responseModel : any;
        let filter:any = this.filterModel;

        filter.countryId= countryId;
        await this.httpRestClientSvc.get('Lookups/Countries/States', filter).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getSports(){
        let responseModel : any;
        await this.httpRestClientSvc.get('Lookups/Sports', this.filterModel).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }

    async getGameTypes(){
        let responseModel : any;
        await this.httpRestClientSvc.get('Lookups/GameTypes', this.filterModel).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }
    
    async getSchools(){
        let responseModel : any;
        await this.httpRestClientSvc.get('Lookups/Schools', this.filterModel).then(
            result => {
                responseModel = result;
                return responseModel;
            },
        )
        return responseModel;
    }


     
}
