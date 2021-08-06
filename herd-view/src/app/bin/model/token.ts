import jwtDecode, { JwtPayload } from 'jwt-decode';

export class Token {
  private _value : string;
  private _expiration : number;
  private _seed : string;
  private _user : string;

  constructor(value : string) {
    this._value = value;

    let decoded_value : JwtPayload = this._value ? jwtDecode<JwtPayload>(this._value) : null;

    this._expiration = decoded_value ? (decoded_value['exp'] ? decoded_value['exp'].valueOf() * 1000 : -1) : null;
    this._seed = decoded_value ? (decoded_value['seed'] ? decoded_value['seed'] : '') : null;
    this._user = decoded_value ? (decoded_value['user'] ? decoded_value['user'] : '') : null;
  }

  public get value() : string {
    return this._value;
  }

  public get expiration() : number {
    return this._expiration;
  }

  public get seed() : string {
    return this._seed;
  }

  public get user() : string {
    return this._user;
  }

  public isExpired() : boolean { 
    let result : boolean = true;
    let now : number = (new Date()).getTime();

    if (!this._expiration || now <= this._expiration) {
      result = false;
    }
    return result;
  }

  public isEmpty() : boolean { 
    let result : boolean = true;

    if (this._value) {
      result = false;
    }
    return result;
  }

  public isValid() : boolean { 
    let result : boolean = false;

    if (!this.isEmpty() && !this.isExpired()) {
      result = true;
    }
    return result;
  }
}
