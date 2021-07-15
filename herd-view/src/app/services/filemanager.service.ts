import { Injectable } from '@angular/core';
import { RedHerdWebContext } from './base/redherd-web';

@Injectable({
  providedIn: 'root'
})
export class FilemanagerService {
  private context: RedHerdWebContext;

  constructor() { 
    this.context = new RedHerdWebContext();
  }

  public get Token() {
    return this.context.Token;
  }
}
