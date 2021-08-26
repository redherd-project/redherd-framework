import { Component, HostListener } from '@angular/core';

export enum DisplayMode {
    mobile = 'mobile',
    desktop = 'desktop'
}

@Component({
    template: ''
})
export abstract class DisplayedComponent {
    private display: DisplayMode;

    constructor() {
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
      return window.innerWidth >= 768 ? DisplayMode.desktop : DisplayMode.mobile;
    }
  }