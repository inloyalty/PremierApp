import { NgModule } from "@angular/core";
import { MydFilterPipe } from "./filter.pipe";
import { RemoteImagePipe } from "./remote-image.pipe";
import { RemoteFilePipe } from "./remote-file.pipe";
import { DateFormatterPipe } from "./date-formatter.pipe";
import { CurencyFormatterPipe } from "./currency-formatter.pipe";
import { ShortNumberPipe } from "./short-number.pipe";
import { DatePipe } from "@angular/common";
import { LocalizationPipe } from "./localization.pipe";
import { BooleanToTextPipe } from "./boolean-totext.pipe";
import { AlternateTextPipe } from "./alternate-text.pipe";

@NgModule({
    declarations: [MydFilterPipe, RemoteImagePipe, RemoteFilePipe,DateFormatterPipe,CurencyFormatterPipe
                   ,ShortNumberPipe,LocalizationPipe,BooleanToTextPipe,AlternateTextPipe],
    imports: [],
    exports: [MydFilterPipe, RemoteImagePipe, RemoteFilePipe,DateFormatterPipe,CurencyFormatterPipe
              ,ShortNumberPipe,LocalizationPipe,BooleanToTextPipe,AlternateTextPipe],
     providers:[DatePipe]         

})

export class SharedPipeModule { }