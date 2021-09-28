import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FunctionsUsingCSI } from 'ng-terminal';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SocketioService } from '../../services/socket-io.service'
import { Lv2Message } from '../../bin/proto/lv2-message';

@Component({
  selector: 'app-module-output-panel',
  templateUrl: './module-output-panel.component.html',
  styleUrls: ['./module-output-panel.component.css']
})
export class ModuleOutputPanelComponent implements OnInit {
  private ngUnsubscribe = new Subject();
  private info_color: string;
  private error_color: string;
  private bold_format: string;
  private reset_format: string;
  output: Subject<string>;

  @Input() session: string;
  @Output() moduleEnded: EventEmitter<string>;

  constructor(private socketioService: SocketioService) {
    this.output = new Subject<string>();
    this.moduleEnded = new EventEmitter<string>();

    //  Message colors:
    // ******************************    
    this.info_color = '\u001b[34m';
    this.error_color = '\u001b[31m';
    this.bold_format = '\u001b[1m';
    this.reset_format = '\u001b[0m';
  }

  ngOnInit() {}

  ngOnChanges(changes) {
    if (changes.session) {
      // Stop the collection of socketio messages referred to the old session
      this.stopOutput();

      // Clear the output board
      this.clearOutput();

      // Collect messages referred to the new session
      this.getMessages(this.session);
    }
  }

  ngOnDestroy() {
    this.stopOutput();
  }

  private clearOutput(): void {
    this.output.next(FunctionsUsingCSI.eraseInDisplay(2));
    this.output.next(FunctionsUsingCSI.cursorPosition(0,0));
  }

  private stopOutput(): void {
    this.ngUnsubscribe.next();
  }

  private getMessages(session: string): void {
    this.socketioService
    .getMessages()
    .pipe(takeUntil(this.ngUnsubscribe))
    .subscribe((message: Lv2Message) => {
        if (message.session == session && message.payload.type != "EXTCODE") {
          this.output.next(message.payload.content.replace(/\n/g,'\r\n') + '\r\n');
        }
        else if (message.session == session && message.payload.type == "EXTCODE") {
          if (message.payload.content === '0') {
            this.output.next('\r\n' + this.info_color + this.bold_format + '[?] Info: ' + this.reset_format + this.bold_format + 'Operation successful\r\n' + this.reset_format);
          }
          else {
            this.output.next('\r\n' + this.error_color + this.bold_format + '[x] Error: ' + this.reset_format + this.bold_format + 'Operation failed\r\n' + this.reset_format);
          }
          this.moduleEnded.emit(this.session);
        }
    }); 
  }
}
