import { PipeTransform, Pipe } from "@angular/core";

@Pipe({
  name: 'myd_filter'
})
export class MydFilterPipe implements PipeTransform {
  transform(items: any, searchText: string = '', filter: any = null, defaultFilter: boolean = true): any {
    if (!searchText && searchText.length <= 0) {
      return items;
    }
    searchText= searchText.toLowerCase();

    if (!Array.isArray(items)) {
      return items;
    }
    let filterKeys: any;
    if (!filter && filter != null && filter.length > 0) {
      filterKeys = Object.keys(filter);
    }
    else {
      filterKeys = Object.keys(items[0]);
    }

    if (Array.isArray(items)) {

      return items.filter(item => {
        return filterKeys.some((keyName) => {
          if (item[keyName] != null) {
            if (item[keyName].toString().toLowerCase().includes(searchText)) {
              return true;
            }
          }
        });
      });



    }
  }
}