import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketioService {
  constructor(private socket: Socket) { }

  public getMessages = () => {
    return Observable.create((observer) => {
            this.socket.on('message', (message) => {
                observer.next(message);
            });
    });
}

}