import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'secondFormat'
})
export class SecondFormatPipe implements PipeTransform {
    transform(value: any): any {
        let retval: any = '';
        if(value)
        {

            let minutes = Math.floor((value) / 60);
            let seconds = value - (minutes * 60);
            // round seconds
            seconds = Math.round(seconds * 100) / 100
            let result = (minutes < 10 ? "0" + minutes : minutes);
            result += ":" + (seconds < 10 ? "0" + seconds : seconds);
            retval= result;
            console.log(retval);

        }
         
        return retval;
    }
}