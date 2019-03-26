import { PipeTransform, Pipe } from '@angular/core';
import * as _ from 'lodash';
// import { LangLocalePrefService } from 'src/app/modules/core/services/lang-locale-pref-service';
@Pipe({
    name: 'currencyFormat'
})
export class CurencyFormatterPipe implements PipeTransform {
   private static readonly DEFAULT_THOUSAND_SEPARATOR:string =",";

   constructor(
    //    private langLocalePrefSvc :LangLocalePrefService
       ){}

    transform(value: any,
        currencyCode?: string,
        roundingScale: number = null,
        isPrefix: boolean = false,
        thousandsSeparator: string=',',
        paddingType: string = null,
        paddingLength: number = 0,
        removetTrailingZero:boolean=false, 
        formatDocimalPlace: boolean = false
    ) {
        
        // return the null if value is isnull or empty 
        if (isEmpty(value)) return null;
        let retVal = '';
        // set the default value if optional parameters are null 
         thousandsSeparator = isEmpty(thousandsSeparator) ? "'" : thousandsSeparator;

        //thousandsSeparator = this.langLocalePrefSvc.thousandsSeparator? this.langLocalePrefSvc.thousandsSeparator:thousandsSeparator;
        currencyCode = isEmpty(currencyCode) ? "" : currencyCode;
        // Round the value before formatting 
        if(roundingScale !=null){
            value=  _.round(value, roundingScale)
         }   

        // split the string with decimal(.) to seperate
        let num_parts = value.toString().split(".");
        num_parts[0] = num_parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);

        // Remove the trailing zero from decimal part 
        if (removetTrailingZero && num_parts[1] && num_parts[1].length > 0) {
            num_parts[1] = parseFloat(num_parts[1]);
        }
        
        // format the decimal part 
        if (formatDocimalPlace && num_parts[1] && num_parts[1].length > 3) {
            num_parts[1] = num_parts[1].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
        }

        retVal = num_parts.join(".");
        if(!isEmpty(paddingType) && paddingType.length>0){
            retVal=  paddingType.toUpperCase()=='B'?retVal.padStart(paddingLength, '0'):retVal.padEnd(paddingLength, '0');
        }

        if (!isEmpty(currencyCode))
            retVal = isPrefix == true ? `${currencyCode} ${retVal}` : `${retVal} ${currencyCode}`
        return retVal

    }
}

function isEmpty(value: any): boolean {
    return value == null || value === '' || value !== value;
}

