import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Config } from 'src/app/config';
import { TerminalService } from 'src/app/services/terminal.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements OnInit, OnDestroy {
  private baseUrl: string;
  private terminalUrl: string;
  terminalUrlSafe: SafeResourceUrl;
  terminalReady: boolean;

  @Input() assetId: number;

  constructor(private terminalService: TerminalService, private sanitizer: DomSanitizer) {
    this.baseUrl = Config.api_server_proto + '://' + Config.api_server_address + ':';
    this.terminalUrl = '';
    this.terminalReady = false;
  }

  ngOnInit() {
    this.spawn();
  }

  ngOnDestroy() {
    this.destroy();
  }

  private spawn(): void {
    this.terminalService.start(+this.assetId)
      .subscribe(res => {
        if (res) {
          this.terminalUrl = this.baseUrl + res['ports']['port'] + '?t=' + this.terminalService.Token.value;
          this.terminalUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.terminalUrl);
        }
        setTimeout(() =>  this.terminalReady = true, 2000);
    });
  }

  private destroy(): void {
    this.terminalService.stop(+this.assetId)
      .subscribe(_ => { this.terminalUrl = ''; });
  }

  public openInNew(): void {
    window.open(this.terminalUrl, "_blank");
  }
}