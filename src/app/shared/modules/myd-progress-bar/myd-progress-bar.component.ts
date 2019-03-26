import { Component, Input, OnDestroy, OnInit, SimpleChanges } from "@angular/core";

@Component({
    selector: 'myd-progress-bar',
    templateUrl: 'myd-progress-bar.component.html'
})

export class MydProgressBarComponent implements OnDestroy {

    // declare the inputs
    @Input() public height: number;
    public valuePerc: number;
    @Input() public min: number = 0;
    @Input() public max: number = 100;
    @Input()
    public set value(arg: number) {
        this.valuePerc = (arg / this.max) * 100;
    }
    @Input() public backgroundColor: string;
    @Input() public progressColor: string;
    @Input() public borderRadius: string;
    @Input() public showValue: boolean = false;
    @Input() public stacked: boolean = false;
    @Input() public values: Array<ProgressBarModel>
    @Input() public label: string;
    @Input() public rightToLeft: boolean = false;

    // delclare the output 
    // declare the private variables

    // declare the public variables

    // delcare the child component reference variables 

    ngOnDestroy(): void {
        this.doCleanUp();
    }

    private doCleanUp() {
        delete this.height;
        delete this.valuePerc;
        delete this.min;
        delete this.backgroundColor;
        delete this.showValue;
        delete this.stacked;
        delete this.values;
    }
}

export class ProgressBarModel {
    public value: number;
    public label: string;
    public progressColor: string;
}