import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Config } from 'src/app/config';
import { Location } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { AssetService } from 'src/app/services/asset.service';

@Component({
  selector: 'app-module-wrapper',
  templateUrl: './module-wrapper.component.html',
  styleUrls: ['./module-wrapper.component.css']
})
export class ModuleWrapperComponent implements OnInit, OnDestroy {
  private assetId: number;
  private moduleName: string;
  private port: number;
  private baseUrl: string;
  private contentUrl: string;
  private apiData: {};

  contentUrlSafe: SafeResourceUrl;
  contentReady: boolean;

  constructor(
    private route: ActivatedRoute,
    private sanitizer: DomSanitizer,
    private location: Location,
    private assetService: AssetService
  ) {
    this.assetId = +this.route.snapshot.paramMap.get('id');
    this.moduleName = this.route.snapshot.paramMap.get('name');
    this.port = +this.route.snapshot.paramMap.get('port');
    this.baseUrl = 'https://' + Config.api_server_address + ':';
    this.contentUrl = '';
    this.contentReady = false;
  }

  ngOnInit(): void {
    this.contentUrl = this.baseUrl + this.port + '?t=' + this.assetService.Token;
    this.contentUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.contentUrl);
    setTimeout(() =>  this.contentReady = true, 2000);
  }

  ngOnDestroy() {
    this.destroy();
  }

  back(): void {
    this.location.back();
  }

  openInNew(): void {
    window.open(this.contentUrl, "_blank");
  }

  destroy(): void {
    this.apiData = {};
    this.apiData['mode'] = 'interact';
    this.apiData['params'] = { 'operation': 'stop' };
    this.assetService.runModule(this.assetId, this.moduleName, this.apiData).subscribe();
    //this.assetService.runModule(this.assetId, this.moduleName, this.apiData).subscribe(res => console.log(res));
  }

}
