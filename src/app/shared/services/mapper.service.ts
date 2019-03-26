
import { Injectable } from '@angular/core';
// import { MappingDefinition } from 'src/app/models/api-response.model';

@Injectable()

  export class MapperService{
   
public mapModel(dataSource: any, mappingDefinitions: Array<any>, sourceToTarget = true): any {
    return new Promise((resolve, reject) => {
        let retVal: any = {};
        mappingDefinitions.forEach(element => {
            if (sourceToTarget) {
                retVal[element.target] = dataSource[element.source];
            }
            else {
                retVal[element.source] = dataSource[element.target];
            }
        });
        resolve(retVal);
    });
}

public mapModels(dataSource: any, mappingDefinitions: Array<any>, sourceToTarget = true): any {
    return new Promise((resolve, reject) => {
        let retVal: any = [];
        dataSource.forEach(item => {
            let row={};
            mappingDefinitions.forEach(mappingDefinition => {
                if (sourceToTarget) {
                    row[mappingDefinition.target] = item[mappingDefinition.source];
                }
                else {
                    row[mappingDefinition.source] = item[mappingDefinition.target];
                }
            });
            retVal.push(row);
        });
       
        resolve(retVal);
    });
}


  }

 

 