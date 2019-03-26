//npm install --save file-saver
// npm install -–save @types/file-saver 

import { Injectable } from '@angular/core';
import { saveAs } from 'file-saver';
import { HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';


@Injectable()
export class FileHelperService {

    private _apiBaseUrl: string;

    /* Properties */
    get ApiBaseUrl(): string {
        if (this._apiBaseUrl != null)
            return this._apiBaseUrl
        else
            return this.localStorageSvc.get('AppConstant.API_BASE_URL');
    }

    set ApiBaseUrl(value: string) {
        this._apiBaseUrl = value;
    }

    constructor(
        private httpClient: HttpClient,
        private localStorageSvc: LocalStorageService
    ) {

    }

    /** 
     * Gets/Retrives a resource from given endpoint.
     * @requestUrl : api endpoint.
     * @fileName : save the file name with provided name
     * @params : query strimg param JSON object 
    */
    download(requestUrl: string, fileName: string, params: any = null, hasBaseUrl: boolean=false) {
        let queryParams = this.getParams(params)
        this.httpClient.get(hasBaseUrl ? `${requestUrl}${queryParams}` : `${this.ApiBaseUrl}${requestUrl}${queryParams}`
            , { responseType: "blob" }).subscribe(
                res => {
                    const blob = new Blob([res], { type: 'application/octet-stream' });
                    saveAs(blob, fileName);
                }
            )
    }


    /** 
     * Gets/Retrives a resource from given endpoint.
     * @requestUrl : api endpoint.
     * @fileName : save the file name with provided name
     * @data : data will be passed as json string.
     * @params : query strimg param JSON object 
    */
    downloadAsPost(requestUrl: string, fileName: string, data: any = null, params: any = null, ) {
        let queryParams = this.getParams(params)
        this.httpClient.post(`${this.ApiBaseUrl}${requestUrl}${queryParams}`, data
            , { responseType: "blob" }).subscribe(
                res => {
                    const blob = new Blob([res], { type: 'application/octet-stream' });
                    saveAs(blob, fileName);
                }
            )



    }

    private getParams(params) {
        if (params === null || params === undefined) {
            return '';
        }
        const keys = Object.keys(params);
        let queryStrings = '';
        keys.forEach((key, index) => {
            queryStrings = index !== 0 ? queryStrings + '&' + key + '=' + params[key] : '?' + key + '=' + params[key];
        });
        return queryStrings;
    }



}