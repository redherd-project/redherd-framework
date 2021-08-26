import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { Config } from 'src/app/config';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AssetService } from 'src/app/services/asset.service';

@Component({
  selector: 'app-module-wrapper',
  templateUrl: './module-wrapper.component.html',
  styleUrls: ['./module-wrapper.component.css']
})
export class ModuleWrapperComponent implements OnInit, OnDestroy {
  private baseUrl: string;
  private contentUrl: string;
  private apiData: {};
  contentUrlSafe: SafeResourceUrl;
  contentReady: boolean;

  @Input() assetId: number;
  @Input() moduleName: string;
  @Input() port: number;

  constructor(private sanitizer: DomSanitizer, private assetService: AssetService) {
    this.baseUrl = Config.api_server_proto + '://' + Config.api_server_address + ':';
    this.contentUrl = '';
    this.contentReady = false;
  }

  ngOnInit() {
    this.contentUrl = this.baseUrl + this.port + '?t=' + this.assetService.Token.value;
    this.contentUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.contentUrl);
    setTimeout(() =>  this.contentReady = true, 2000);
  }

  ngOnDestroy() {
    this.destroy();
  }

  private destroy(): void {
    this.apiData = {};
    this.apiData['mode'] = 'interact';
    this.apiData['params'] = { 'operation': 'stop' };

    this.assetService.runModule(+this.assetId, this.moduleName, this.apiData)
      .subscribe();
  }
}
