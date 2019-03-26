import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'alternateText'
})
export class AlternateTextPipe implements PipeTransform {
    transform(value: any, alternateText: string = 'NA'): any {
        let retval: string = value;
        if (retval == undefined || retval === null || retval.trim() === '') {
            retval = alternateText
        }
        return retval;
    }
}