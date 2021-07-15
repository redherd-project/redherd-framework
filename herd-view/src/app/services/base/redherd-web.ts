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
    return localStorage.getItem(Config.auth_token_store);
  }

  public get HttpOptions(): { headers: HttpHeaders } {
    return this.httpOptions;
  }
}