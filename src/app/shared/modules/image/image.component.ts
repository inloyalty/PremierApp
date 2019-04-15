import { Component, OnInit, Input, SimpleChange } from '@angular/core';

@Component({
  selector: 'image',
  templateUrl: 'image.component.html'
})
export class ImageComponent implements OnInit {

  @Input() src: string;
  @Input() caption: string
  @Input() label: string
  @Input() height: string;
  @Input() width: string;
  @Input() capLeft: string = '42';
  @Input() capTop: string = '45';
  @Input() padding: string;
  @Input() captionFontSize: string;
  @Input() captionPadding: string;
  @Input() imgHeight: string;
  @Input() imgWidth: string;
  @Input() rounded: boolean = false;
  @Input() backgroundColor: string;

  public hasError: boolean = true;
  public backgroundClass: string;
  public initials: string;

  constructor() { }

  ngOnInit() {
    this.setSize();
    this.initials = this.label ? this.label : this.getInitials(this.caption);
    console.log( this.initials )
    if (!this.backgroundColor) {
      this.backgroundClass = 'bg-primary'
    }
  }

  ngOnChanges(changes: any) {
    let imageUrlChange: SimpleChange = changes.src;
    if (imageUrlChange && imageUrlChange.currentValue) {
      this.src = imageUrlChange.currentValue;
      if (this.src) {
        this.hasError = false;
      }
    }
  }

  setSize() {
    if (this.height == undefined && this.width == undefined) {
      this.height = this.width = '150';
    }
    if (this.imgHeight == undefined && this.imgWidth == undefined) {
      this.imgHeight = this.imgWidth = '';
    }
    else if (this.height == undefined) {
      if (this.width != undefined) {
        this.height = this.width;
      }
    }
    else if (this.imgHeight == undefined) {
      if (this.imgWidth != undefined) {
        this.imgHeight = this.imgWidth;
      }
    }
    else if (this.width == undefined) {
      if (this.height != undefined) {
        this.width = this.height;
        this.imgWidth = this.imgHeight;
      }
    }
    else if (this.imgWidth == undefined) {
      if (this.imgHeight != undefined) {
        this.imgWidth = this.imgHeight;
      }
    }

    if (this.captionPadding) {
      this.capLeft = null;
      this.capTop = null;
    }
  }

  getInitials(caption: string) {
    var initials = !caption ? "" : caption.split(" ")
      .map((n, i, a) => i === 0 || i + 1 === a.length ? n[0] : null)
      .join(" ")
      .toUpperCase();
    return initials;
  }
}
