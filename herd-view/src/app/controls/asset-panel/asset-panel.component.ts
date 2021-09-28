import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { AdaptiveComponent } from '../../bin/gui/display';
import { Asset } from '../../bin/model/asset';
import { AssetService } from '../../services/asset.service';

@Component({
  selector: 'app-asset-panel',
  templateUrl: './asset-panel.component.html',
  styleUrls: ['./asset-panel.component.css']
})
export class AssetPanelComponent extends AdaptiveComponent implements OnInit {
  asset: Asset;
  terminal: boolean;
  moduleView: any;

  @Input() assetId: number;
  @Input() showTerminal: boolean;

  @Output() terminalViewChanged = new EventEmitter<boolean>();

  constructor(private assetService: AssetService, private location: Location) {
    super();

    this.moduleView = null;
  }

  ngOnInit() {
    this.terminal = false;
    this.getData();
  }

  ngOnChanges(changes) {
    if (changes.showTerminal) {
      // An alternative option is to inspect the changes value
      //this.terminal = changes.showTerminal.currentValue;
      this.terminal = !this.terminal;
    }
  }

  private getData(): void {
    this.assetService.getAsset(+this.assetId)
      .subscribe(asset => this.asset = asset);
  }

  public back(): void {
    this.location.back();
  }

  public resume(event): void {
    this.moduleView = { assetId: event['assetId'], module: event['module'], session: event['session'] };
  }

  public terminalShowHide(): void {
    this.terminalViewChanged.emit(!this.terminal);
  }

  public switchToModule(event): void {
    this.moduleView = { assetId: event['assetId'], module: event['module'], session: null };
  }
}
