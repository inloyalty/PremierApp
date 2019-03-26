import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { MydProgressBarComponent } from './myd-progress-bar.component';

@NgModule({
    declarations: [MydProgressBarComponent],
    imports:[CommonModule],
    exports: [MydProgressBarComponent]
})

export class MydProgressBarModule { }