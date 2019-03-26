import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'booleanToText'
})
export class BooleanToTextPipe implements PipeTransform {
    transform(value: any, yesText: string = 'Yes', noText: string = 'No'): any {
        let retval: string = value;
        if (value && value == true) {
            retval = yesText
        } else {
            retval = noText
        }
        return retval;
    }
}