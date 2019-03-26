import { NgModule } from "@angular/core";
import { MydListComponent } from "./myd-list.component";
import { MydSelectOptionDirective, MydSelectOptionSelectedDirective, MydSelectOptionNotFoundDirective } from "./myd-list-directive";
import { CommonModule } from "@angular/common";
import { NgScrollbarModule } from "ngx-scrollbar";

@NgModule({
    declarations: [MydListComponent, MydSelectOptionDirective, MydSelectOptionSelectedDirective,
        MydSelectOptionNotFoundDirective],
    exports: [MydListComponent, MydSelectOptionDirective, MydSelectOptionSelectedDirective,
        MydSelectOptionNotFoundDirective],

    imports: [CommonModule,
        NgScrollbarModule]

})

export class MydListModule { }