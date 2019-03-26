import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule } from "@angular/forms";
import { MydAdvanceFilterComponent } from "./advance-filter.component";


@NgModule(
    {
        declarations: [MydAdvanceFilterComponent],
        imports: [CommonModule,
            RouterModule,
            FormsModule,],
        exports: [MydAdvanceFilterComponent]
    }
)

export class MydAdvanceFilterModule { };