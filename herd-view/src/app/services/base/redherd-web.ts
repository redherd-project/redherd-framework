import { HttpHeaders } from '@angular/common/http';
import { Config } from 'src/app/config';
import { JwtToken } from '../../bin/model/token';

export class RedHerdWebContext {
  protected httpOptions: { headers: HttpHeaders };
  protected token: JwtToken;
  
  constructor() {
    this.httpOptions = { 
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    };
  }

  public get Token(): JwtToken {
    return new JwtToken(
      Config.single_instance ? sessionStorage.getItem(Config.auth_token_store) : localStorage.getItem(Config.auth_token_store)
    );
  }

  public get HttpOptions(): { headers: HttpHeaders } {
    return this.httpOptions;
  }
}