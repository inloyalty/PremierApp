import { PipeTransform, Pipe } from "@angular/core";
import { LocalStorageService } from "../services/local-storage.service";
// import { AppConstant } from "src/app/modules/core/constants/app-constant";

@Pipe({
    name: 'remote-file',

})
export class RemoteFilePipe implements PipeTransform {

    constructor(private localStorageSvc: LocalStorageService) { }
    transform(value: any, isPersonImage?: boolean): any {
        let retVal = '';
        let apiBaseUrl = this.localStorageSvc.get('AppConstant.API_BASE_URL');
        if (value != null && value.length > 0) {
            if (isPersonImage)
                retVal = `${apiBaseUrl}Files/ClientProfileImage?filePath=${value}&enc=true`;
            else
                retVal = `${apiBaseUrl}Files/OrganizationDocument?filePath=${value}&enc=true`;
        }
        return retVal;
    }
}