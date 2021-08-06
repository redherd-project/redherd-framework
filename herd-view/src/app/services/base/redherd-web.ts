import { HttpHeaders } from '@angular/common/http';
import { Config } from '../../config';


export class RedHerdWebContext {
  protected httpOptions: { headers: HttpHeaders };
  
  constructor() {
    this.httpOptions = { 
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  public get Token(): string {
    // Switched to sessionStorage API in order to mitigate the effect of the
    // browser dirty cache after multiple framework deploy
    //return localStorage.getItem(Config.auth_token_store);
    return sessionStorage.getItem(Config.auth_token_store);
  }

  public get HttpOptions(): { headers: HttpHeaders } {
    return this.httpOptions;
  }
}