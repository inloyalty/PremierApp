import { NgModule } from "@angular/core";
import { MakeDraggable } from "./make-draggable.directive";
import { MakeDroppable } from "./make-droppable.directive";
import { BusyDirective } from "./busy.directive";
import { DebounceDirective } from "./debounce.directive";
import { EqualValidator } from './equal-validator.directive';

@NgModule({
    declarations: [MakeDraggable, MakeDroppable, BusyDirective, DebounceDirective,EqualValidator],
    imports: [],
    exports: [MakeDraggable, MakeDroppable, BusyDirective, DebounceDirective,EqualValidator]
})

export class SharedDirectiveModule { }