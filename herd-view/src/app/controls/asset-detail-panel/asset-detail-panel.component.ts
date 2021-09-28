import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';
import { Config } from 'src/app/config';
import { Asset } from '../../bin/model/asset';
import { AssetService } from '../../services/asset.service';
import { SocketioService } from '../../services/socket-io.service';
import { Lv2Message } from '../../bin/proto/lv2-message';


@Component({
  selector: 'app-asset-detail-panel',
  templateUrl: './asset-detail-panel.component.html',
  styleUrls: ['./asset-detail-panel.component.css']
})
export class AssetDetailPanelComponent implements OnInit {
  private messages$: Observable<Lv2Message>;
  asset: Asset;
  status: string;
  icon: string;
  serverUrl: string;
  imgPlaceholder: string;

  @Input() assetId: number;

  constructor(private assetService: AssetService,private socketioService: SocketioService) {
    this.status = '';
    this.icon = '';

    this.serverUrl = Config.api_server_proto + '://' + Config.api_server_address + ':' + Config.api_server_port;
    this.imgPlaceholder = Config.asset_image_placeholder;
  }

  ngOnInit() {
    this.messages$ = this.socketioService.getMessages().pipe(shareReplay(1));

    this.getData();
    this.getStatus();
  }

  private getData(): void {
    this.assetService.getAsset(+this.assetId)
      .subscribe(asset => this.asset = asset);
  }

  private getStatus(): void {
    this.messages$
      .subscribe((message: Lv2Message) => {
        let messageType : string = '';

        if (message.dst == 'keep_alive' && +message.src ==  +this.assetId) {
            messageType = message.payload.type.toLowerCase();

            this.status = messageType == 'stdout' ? 'online' : 'offline';
            this.icon = this.status == 'online' ? 'link' : 'link_off';
        }
      }); 
  }

  public save(): void {
    this.assetService.updateAsset(this.asset).subscribe();
  }

  public refresh(): void {
    this.getData();
  }
}
