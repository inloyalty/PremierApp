import { Component, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'myd-segmented-button',
    templateUrl: './myd-segmented-button.component.html'
})

export class MydSegmentedButtonComponent {
    // declare the inputs
    @Input() public buttonClass: string = 'btn-outline-primary btn-w-100';
    @Input() public buttons: Array<SegmentedButton>;

    // delclare the output 
    @Output() public buttonChanged: EventEmitter<SegmentedButton> = new EventEmitter();

    // declare the private variables

    // declare the public variables

    // delcare the child component reference variables 


    public onButtonChanged(button: SegmentedButton) {
        this.buttons.forEach(item => {
            item.active = false;
        })
        button.active = true;
        this.buttonChanged.emit(button);

    }

}

export class SegmentedButton {
    public id: number;
    public name: string;
    public label: string;
    public active: boolean = false;
}