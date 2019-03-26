import { Directive, Input, Output, EventEmitter, ElementRef, OnInit, OnDestroy } from '@angular/core';
import { NgControl } from '@angular/forms';
import { debounceTime, distinctUntilChanged, map } from 'rxjs/operators';
import { Subscription } from 'rxjs';
@Directive({
    selector: '[ngModel][onDebounce]',
})
export class DebounceDirective implements OnInit, OnDestroy {
    @Output()
    public onDebounce = new EventEmitter<any>();

    @Input('debounceDelay')
    public debounceDelay: number = 300;
    private isFirstChange: boolean = true;
    private subscription: Subscription;
    constructor(
        public model: NgControl) {
    }

    ngOnInit() {
        this.subscription =
            this.model.valueChanges.pipe(
                debounceTime(this.debounceDelay),
                distinctUntilChanged(),

            ).subscribe(modelValue => {
                if (this.isFirstChange) {
                    this.isFirstChange = false;
                } else {
                    this.onDebounce.emit(modelValue);
                }
            });;
    }
    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}