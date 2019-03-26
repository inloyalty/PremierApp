import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { LocalStorageService } from "./local-storage.service";
import { share } from 'rxjs/operators';
import { Observable } from "rxjs";
import { AppConstant } from 'src/app/modules/constants/app-constant';
// import { AppConstant } from "src/app/modules/core/constants/app-constant";


@Injectable()

export class HttpRestClientService {

    /* Private members */
    private _apiBaseUrl: string;

    /* Properties */
    get ApiBaseUrl(): string {
        if (this._apiBaseUrl != null)
            return this._apiBaseUrl
        else
            return this.localStorageSvc.get(AppConstant.API_BASE_URL);
    }

    set ApiBaseUrl(value: string) {
        this._apiBaseUrl = value;
    }

    /**
       * Contructor : Creates an instance of this service.
    */
    constructor(
        private httpClient: HttpClient,
        private localStorageSvc: LocalStorageService
    ) {

    }

    /** 
     * Gets/Retrives a resource from given endpoint.
     * @requestUrl : api endpoint.
    */
    get(requestUrl: string, params: any = null) {
        let promise = new Promise<any>((resolve, reject) => {
            let queryParams = this.getParams(params)
            this.httpClient.get(`${this.ApiBaseUrl}${requestUrl}${queryParams}`).pipe(share())
                .toPromise<any>().then(
                    res => { // Success
                        let responseModel: any = {};
                        responseModel =res
                        resolve(responseModel);
                    },
                    error => {
                        reject(error)
                    }
                )
        });
        return promise;
    }

    /** 
    * Posts/saves a resource on given endpoint.
    * @requestUrl : api endpoint.
    * @data : data will be passed as json string.
    */
    post(requestUrl: string, data: any, params: any = null) {
        let promise = new Promise<any>((resolve, reject) => {
            return this.httpClient.post(`${this.ApiBaseUrl}${requestUrl}`, data, this.httpHeader())
                .toPromise<any>().then(
                    res => { // Success
                        let responseModel: any = {};
                        responseModel = res;
                        resolve(responseModel);
                    },
                    error => {
                        reject(error)
                    }
                )
        });
        return promise;
    }

    /** 
   * Posts/saves a resource on given endpoint.
   * @requestUrl : api endpoint.
   * @data : data will be passed as json string and internally convert the data into FormData.
   */
    postFormData(requestUrl: string, data: any, params: any = null) {
        let promise = new Promise<any>((resolve, reject) => {
            const headers = new HttpHeaders({ 'enctype': 'multipart/form-data' });
            return this.httpClient.post(`${this.ApiBaseUrl}${requestUrl}`, this.getFormData(data))
                .toPromise<any>().then(
                    res => { // Success
                        let responseModel: any = {};
                        responseModel = res;
                        resolve(responseModel);
                    },
                    error => {
                        reject(error)
                    }
                )
        });
        return promise;
    }

    /**
     * Updates a resource on given endpoint.
     * @param requestUrl api endpoint.
     * @param data json object.
     * @param params parameters will be passed as query string.
     */
    put(requestUrl: string, data: any, params: any = null) {
        let promise = new Promise<any>((resolve, reject) => {
            return this.httpClient.post(`${this.ApiBaseUrl}${requestUrl}`, data, this.httpHeader())
                .toPromise<any>().then(
                    res => { // Success
                        let responseModel: any = {};
                        responseModel = this.mapResponse(res)
                        resolve(responseModel);
                    },
                    error => {
                        reject(error)
                    }
                )
        });
        return promise;
    }

    // patch rest api call as a oberservable 
    patch(requestUrl: string, data: any, params: any = null) {
        let promise = new Promise<any>((resolve, reject) => {
            return this.httpClient.post(`${this.ApiBaseUrl}${requestUrl}`, data, this.httpHeader())
                .toPromise<any>().then(
                    res => { // Success
                        let responseModel: any = {};
                        responseModel = this.mapResponse(res)
                        resolve(responseModel);
                    },
                    error => {
                        reject(error)
                    }
                )
        });
        return promise;
    }

    /**
     * Deletes a resource on given endpoint.
     * @param requestUrl api endpoint.
     * @param params parameters will be passed as query string.
     */
    delete(requestUrl: string, params: any = null) {
        let promise = new Promise<any>((resolve, reject) => {
            this.httpClient.get(`${this.ApiBaseUrl}${requestUrl}`)
                .toPromise<any>().then(
                    res => { // Success
                        let responseModel: any = {};
                        responseModel = this.mapResponse(res)
                        resolve(responseModel);
                    },
                    error => {
                        reject(error)
                    }
                )
        });
        return promise;
    }

    /** 
     * Gets/Retrives a resource from given endpoint.
     * @requestUrl : api endpoint.
    */


    /* Helper Methods */
    private httpHeader(): any {
        try {
            return { headers: { 'content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' } };
        }
        catch (err) {
            console.error(err);
        }
    }

    private httpFormDataHeader(): any {
        try {
            return { headers: { 'content-Type': 'multipart/form-data', 'Access-Control-Allow-Origin': '*' } };
        }
        catch (err) {
            console.error(err);
        }
    }

    private mapResponse(res: any): any {
        let responseModel: any = {};
        responseModel.success = res.Message.MessageCode == 200;

        // Map data properties
        responseModel.data = res.Data;

        if (res.Filter != null) {
            // Map filter properties
            responseModel.filter.searchText = res.Filter.SearchText;

            // Map pager properties
            responseModel.page.index = res.Filter.Page.PageIndex;
            responseModel.page.records = res.Filter.Page.TotalRecords;
            responseModel.page.sortOrder = res.Filter.Page.SortOrder;
        }

        if (res.Message != null) {
            // Map message propeties
            responseModel.message.code = res.Message.MessageCode;
            responseModel.message.text = res.Message.Message;
        }
        return responseModel
    }

    private getParams(params) {
        // if (params === null || params === undefined) {
        //     return '';
        // }
        // const keys = Object.keys(params);
        // let queryStrings = '';
        // keys.forEach((key, index) => {
        //     queryStrings = index !== 0 ? queryStrings + '&' + key + '=' + params[key] : '?' + key + '=' + params[key];
        // });
        // return queryStrings;

        if (params === null || params === undefined) {
            return '';
        }
        const keys = Object.keys(params);
        let paramString = '';
        keys.forEach((key, index) => {
            let paramName = key;
            if (paramName === 'PageSize') {
                paramName = 'Page.PageSize';
            } else if (paramName === 'PageIndex') {
                paramName = 'Page.PageIndex';
            } else if (paramName === 'SortOrder') {
                paramName = 'Page.SortOrder';
            } else if (paramName === 'SearchText') {
                paramName = 'SearchText';
            } else if (paramName === 'OrderBy') {
                paramName = 'Page.OrderBy';
            }
            paramString = index !== 0 ? paramString + '&' + paramName + '=' + params[key] : '?' + paramName + '=' + params[key];
        });
        return paramString;
    }

    private getFormData(data: any) {
        const formDatas = new FormData();
        for (const key in data) { formDatas.append(key, data[key]); }
        console.log(formDatas)
        return formDatas;
    }
}