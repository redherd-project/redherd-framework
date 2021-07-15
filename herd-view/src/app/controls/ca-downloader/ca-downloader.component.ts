import { Component, OnInit } from '@angular/core';
import { Config } from '../../config';

@Component({
  selector: 'app-ca-downloader',
  templateUrl: './ca-downloader.component.html',
  styleUrls: ['./ca-downloader.component.css']
})
export class CaDownloaderComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  download(): void {
    window.open(Config.ca_url, "_blank");
  }
}
