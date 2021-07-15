import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Asset } from '../../bin/model/asset';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-asset-panel',
  templateUrl: './asset-panel.component.html',
  styleUrls: ['./asset-panel.component.css']
})
export class AssetPanelComponent implements OnInit {
  asset: Asset;

  constructor(
    private route: ActivatedRoute,
    private assetService: AssetService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    let id : number = +this.route.snapshot.paramMap.get('id');

    this.assetService.getAsset(id)
      .subscribe(asset => this.asset = asset);
  }

  back(): void {
    this.location.back();
  }
}
