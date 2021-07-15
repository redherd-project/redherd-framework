import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Asset } from '../../bin/model/asset';
import { AssetService } from '../../services/asset.service';
import { SocketioService } from '../../services/socket-io.service';
import { Type } from '../../bin/model/type';
import { TypeService } from '../../services/type.service';
import { Lv2Message } from '../../bin/proto/lv2-message';

@Component({
  selector: 'app-asset-detail-panel',
  templateUrl: './asset-detail-panel.component.html',
  styleUrls: ['./asset-detail-panel.component.css']
})
export class AssetDetailPanelComponent implements OnInit {
  types: Type[];
  asset: Asset;
  status: string;
  icon: string;

  constructor(
    private route: ActivatedRoute,
    private assetService: AssetService,
    private socketioService: SocketioService,
    private typeService: TypeService
  ) {}

  ngOnInit() {
    this.getData();

    this.status = '';
    this.icon = '';
    this.getStatus();
  }

  getData(): void {
    let id : number = +this.route.snapshot.paramMap.get('id');

    this.assetService.getAsset(id)
      .subscribe(asset => this.asset = asset);

    this.typeService.getTypes()
      .subscribe(type => this.types = type);
  }

  private getStatus(): void {
    this.socketioService
    .getMessages()
    .subscribe((message: Lv2Message) => {
        let messageType : string = '';

        if (message.dst == 'keep_alive' && +message.src ==  this.asset.id)
        {
            messageType = message.payload.type.toLowerCase();

            this.status = messageType == 'stdout' ? 'online' : 'offline';
            this.icon = this.status == 'online' ? 'link' : 'link_off';
        }
        //console.log(message);
    }); 
  }


  save(): void {
    this.assetService.updateAsset(this.asset).subscribe();
  }

  refresh(): void {
    this.getData();
  }
}
