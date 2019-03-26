import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NgScrollbarModule } from "ngx-scrollbar";
import { MydAccordionComponent } from "./myd-accordion.component";
import { SharedPipeModule } from "../../pipes/shared.pipe.module";

@NgModule({
    declarations: [MydAccordionComponent],
    exports: [MydAccordionComponent],

    imports: [CommonModule,
        SharedPipeModule,
        NgScrollbarModule]

})

export class MydAccordionModule { }