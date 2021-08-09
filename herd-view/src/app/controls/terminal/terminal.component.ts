import { AfterViewInit, Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Config } from 'src/app/config';
import { Location } from '@angular/common';
import { TerminalService } from 'src/app/services/terminal.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// NOTE: Testing statements requirement in dev phase
// import { WebProxyService } from 'src/app/services/web-proxy.service';
// import { TcpProxyService } from 'src/app/services/tcp-proxy.service';
// import { UdpProxyService } from 'src/app/services/udp-proxy.service';
// import { RtspRedirectorService } from 'src/app/services/rtsp-redirector.service';


@Component({
  selector: 'app-terminal',
  templateUrl: './terminal.component.html',
  styleUrls: ['./terminal.component.css']
})
export class TerminalComponent implements AfterViewInit, OnInit, OnDestroy {
  private asset: number;
  private baseUrl: string;
  private terminalUrl: string;
  
  terminalUrlSafe: SafeResourceUrl;
  terminalReady: boolean;

  // NOTE: Testing statements requirement in dev phase
  // constructor(
  //   private route: ActivatedRoute,
  //   private terminalService: TerminalService,
  //   private wpService: WebProxyService,
  //   private tcpService: TcpProxyService,
  //   private udpService: UdpProxyService,
  //   private rtspService: RtspRedirectorService,
  //   private sanitizer: DomSanitizer,
  //   private location: Location
  // ) {
  //   this.asset = +this.route.snapshot.paramMap.get('id');
  // }

  constructor(
    private route: ActivatedRoute,
    private terminalService: TerminalService,
    private sanitizer: DomSanitizer,
    private location: Location
  ) {
    this.asset = +this.route.snapshot.paramMap.get('id');
    this.baseUrl = 'https://' + Config.api_server_address + ':';
    this.terminalUrl = '';
    this.terminalReady = false;
  }

  ngOnInit() {
    this.spawn();
  }

  ngOnDestroy() {
    this.destroy();
  }

  ngAfterViewInit() {
  }

  spawn(): void {
    this.terminalService.start(this.asset)
      .subscribe(res => {
        if (res) {
          this.terminalUrl = this.baseUrl + res['ports']['port'] + '?t=' + this.terminalService.Token.value;
          this.terminalUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.terminalUrl);
        }
      
        setTimeout(() =>  this.terminalReady = true, 2000);
    });

    // NOTE: Testing statements requirement in dev phase
    // this.wpService.start(this.asset, 8888)
    //   .subscribe(res => { console.log({ serv: 'web', res: res }) });

    // this.tcpService.start(this.asset, 4444)
    //   .subscribe(res => { console.log({ serv: 'tcp', res: res }) });

    // this.udpService.start(this.asset, 5555)
    //   .subscribe(res => { console.log({ serv: 'udp', res: res }) });

    // this.rtspService.start(this.asset)
    //   .subscribe(res => { console.log({ serv: 'rtsp', res: res }) });
  }

  destroy(): void {
    this.terminalService.stop(this.asset)
      .subscribe(_ => { this.terminalUrl = ''; });

    // NOTE: Testing statements requirement in dev phase
    // this.wpService.stop(this.asset)
    //   .subscribe(res => { console.log({ serv: 'web', res: res }) });

    // this.tcpService.stop(this.asset)
    //   .subscribe(res => { console.log({ serv: 'tcp', res: res }) });

    // this.udpService.stop(this.asset)
    //   .subscribe(res => { console.log({ serv: 'udp', res: res }) });

    // this.rtspService.stop(this.asset)
    //   .subscribe(res => { console.log({ serv: 'rtsp', res: res }) });
  }

  back(): void {
    this.location.back();
  }

  openInNew(): void {
    window.open(this.terminalUrl, "_blank");
  }
}