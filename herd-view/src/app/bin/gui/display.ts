import { Component, HostListener } from '@angular/core';

export enum DisplayMode {
    mobile = 'mobile',
    desktop = 'desktop'
}

@Component({
    template: ''
})
export abstract class AdaptiveComponent {
    private maxWidth: number;
    private display: DisplayMode;

    constructor() {
        this.maxWidth = 960;
        this.display = this.getDisplayMode();
    }
  
    get displayMode(): DisplayMode {
        return this.display;
    }

    @HostListener('window:resize', ['$event'])
    onResize(_) {
        this.display = this.getDisplayMode();
    }
  
    protected getDisplayMode(): DisplayMode {
      return window.innerWidth >= this.maxWidth ? DisplayMode.desktop : DisplayMode.mobile;
    }
  }