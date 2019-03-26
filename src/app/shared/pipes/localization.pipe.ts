import { Pipe, PipeTransform } from '@angular/core';
import * as _ from 'lodash';
// import { WebSqlService } from 'src/app/modules/core/services/web-sql-service';
// import { UiLabelModel } from 'src/app/models/ui-label.model';
import { LocalStorageService } from '../services/local-storage.service';

function _window(): any {
    // return the global native browser window object
    return window;
}

@Pipe({
    name: 'localization',
})
export class LocalizationPipe implements PipeTransform {
    public mydDatabaseInstance: any;

    constructor(
        private localStorageSvc: LocalStorageService
    ) {
        // this.mydDatabaseInstance = _window().openDatabase('MYD_ADV_APP_DB', '1.0', 'This is a client side database', 2 * 1024 * 1024);
    }
    transform(value: any, defaultLabel?: string) {
        let retVal = defaultLabel;
        if (!value) {
            return retVal;
        }
        var uilables = JSON.parse(this.localStorageSvc.get('UI_LABLES', false));
        let uiLabel = _.find(uilables, (item: any) => { return item.key == value });
        if (uiLabel && uiLabel != 'undefined') {
            retVal = uiLabel.value;
        }
        return retVal;

    }
}


