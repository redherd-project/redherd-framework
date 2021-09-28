import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';
import { Lv2Message } from '../bin/proto/lv2-message';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  constructor(private socket: Socket) { }

  public getMessages(): Observable<Lv2Message> {
    return new Observable<Lv2Message>((observer) => {
      this.socket.on('message', (message) => {
          observer.next(message);
      });
    });
  }

}