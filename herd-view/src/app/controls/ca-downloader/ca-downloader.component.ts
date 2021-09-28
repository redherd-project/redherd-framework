import { Component } from '@angular/core';
import { Config } from 'src/app/config';

@Component({
  selector: 'app-ca-downloader',
  templateUrl: './ca-downloader.component.html',
  styleUrls: ['./ca-downloader.component.css']
})
export class CaDownloaderComponent {

  download(): void {
    window.open(Config.ca_url, "_blank");
  }

}
