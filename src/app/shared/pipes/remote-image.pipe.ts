import { PipeTransform, Pipe } from "@angular/core";
import { LocalStorageService } from "../services/local-storage.service";
import { AppConstant } from 'src/app/modules/constants/app-constant';
// import { AppConstant } from "src/app/modules/core/constants/app-constant";

@Pipe({
    name: 'remote-image',

})
export class RemoteImagePipe implements PipeTransform {

    constructor(private localStorageSvc: LocalStorageService) { }
    transform(value: any, dirName?: string, altValue?:string): any {
        let retVal = '';
        let apiBaseUrl = this.localStorageSvc.get(AppConstant.API_BASE_URL);
        console.log(apiBaseUrl)
        if (value != null && value.length > 0) {
            retVal = `${apiBaseUrl}Resource?path=Images/${dirName}/${value}`;
            if(altValue)
                retVal = retVal + `&altFilePath=Images/${dirName}/${altValue}`
        }
        return retVal;
    }
}