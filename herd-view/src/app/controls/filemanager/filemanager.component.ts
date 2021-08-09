import { Component, OnInit } from '@angular/core';
import { Config } from 'src/app/config';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Location } from '@angular/common';
import { FilemanagerService } from 'src/app/services/filemanager.service';

@Component({
  selector: 'app-filemanager',
  templateUrl: './filemanager.component.html',
  styleUrls: ['./filemanager.component.css']
})
export class FilemanagerComponent implements OnInit {
  private filemanagerUrl: string = Config.filemanager_url;
  filemanagerUrlSafe: SafeResourceUrl;
  filemanagerReady: boolean = false;
  
  constructor(    
    private sanitizer: DomSanitizer,
    private filemanagerService: FilemanagerService,
    private location: Location) 
  {
    this.filemanagerUrlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.filemanagerUrl + '?t=' + this.filemanagerService.Token.value);
  }

  ngOnInit(): void {
    setTimeout(() =>  this.filemanagerReady = true, 3000);
  }

  back(): void {
    this.location.back();
  }

  openInNew(): void {
    window.open(this.filemanagerUrl + '?t=' + this.filemanagerService.Token.value, "_blank");
  }
}
