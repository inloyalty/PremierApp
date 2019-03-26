import { Directive, Input, ElementRef, Renderer2, OnInit } from "@angular/core";

@Directive({
    selector: `[busy]`
})

export class BusyDirective implements OnInit {
    div: any
    text: any;

    constructor(private renderer: Renderer2, private el: ElementRef) { }

    ngOnInit() {
    }

    @Input('showLoading')
    set showLoading(loading: boolean) {

        if (loading) {
            // Add loader container div
            this.div = this.renderer.createElement('div');
            this.renderer.addClass(this.div, 'loader-container');
            // Add loader in container div
            const loader = this.renderer.createElement('div');
            this.renderer.addClass(loader, 'loader');
            this.renderer.appendChild(this.div, loader);

            this.renderer.addClass(this.el.nativeElement, 'busy-position');
            this.renderer.appendChild(this.el.nativeElement, this.div);
        }
        else {
            // embed the contents of the host template
            if (this.div != null) {
                this.renderer.removeChild(this.el.nativeElement, this.div);
                this.renderer.removeClass(this.el.nativeElement, 'busy-position');
            }

            //   this.el.nativeElement.innerHTML = this._innerHTML;
        }
    }


}