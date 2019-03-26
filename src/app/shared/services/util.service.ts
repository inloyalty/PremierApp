import { Injectable } from "@angular/core";

@Injectable()

export class UtilService {

    public secondsTohhmmss(totalSeconds: number) {
        let hours = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds - (hours * 3600)) / 60);
        let seconds = totalSeconds - (hours * 3600) - (minutes * 60);

        // round seconds
        seconds = Math.round(seconds * 100) / 100

        let result = (hours < 10 ? "0" + hours : hours);
        result += ":" + (minutes < 10 ? "0" + minutes : minutes);
        result += ":" + (seconds < 10 ? "0" + seconds : seconds);
        return result;
    }

    public secondsTommss(totalSeconds: number) {
        // let hours   = Math.floor(totalSeconds / 3600);
        let minutes = Math.floor((totalSeconds) / 60);
        let seconds = totalSeconds - (minutes * 60);
        // round seconds
        seconds = Math.round(seconds * 100) / 100
        let result = (minutes < 10 ? "0" + minutes : minutes);
        result += ":" + (seconds < 10 ? "0" + seconds : seconds);
        return result;
    }
    public getBsDatepickerConfig() {
        let retval: any =
        {
            dateInputFormat: 'DD.MM.YYYY',
            containerClass: 'theme-blue'
        }
        return retval;
    }

    public getReportName(name: string, fileType: string): string {
        let date = new Date();
        return name + "_" + `${(date.getMonth() + 1)}_${date.getDate()}_${date.getFullYear()} ${date.getHours()}_${date.getMinutes()}_${date.getSeconds()}_${date.getTime()}` + fileType;
    }
}
