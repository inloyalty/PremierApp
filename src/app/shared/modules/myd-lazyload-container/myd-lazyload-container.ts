import { Component, ViewChild, ElementRef, Input, Output, EventEmitter } from "@angular/core";

@Component({
    selector: 'myd-lazyload-container',
    templateUrl: 'myd-lazyload-container.html'
})

export class MydLazyLoadContainerComponent {
    // declare the input variables 
    @Input() public width ='auto';
    @Input() public height = 1000;

    // declare the output variables 
    @Output() public pageChange: EventEmitter<number> = new EventEmitter();

    //declare the public variables 

    //declare the private variables 
    private currentPageIndex = 1;

    // declare the child variables 
    @ViewChild('scrollContainer') private scrollContainer: ElementRef;

    public onScroll(event: any) {
        let element = this.scrollContainer.nativeElement
        // console.log(element)
        let atBottom = element.scrollHeight - Math.ceil(element.scrollTop) === element.clientHeight
        if (atBottom) {
            this.currentPageIndex += 1;
            this.pageChange.emit(this.currentPageIndex);
        }

    }

}