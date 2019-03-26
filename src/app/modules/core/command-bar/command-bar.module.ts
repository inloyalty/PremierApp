import { NgModule } from "@angular/core";
import { CommandBarComponent } from "./command-bar.component";
import { CommonModule } from "@angular/common";

@NgModule({
    declarations:[CommandBarComponent],
    imports:[CommonModule],
    exports:[CommandBarComponent]
})

export class CommandBarModule{}