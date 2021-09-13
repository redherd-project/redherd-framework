import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { DisplayedComponent } from '../../bin/gui/display';
import { Module, ModuleMode, ModuleVerb } from '../../bin/model/module';
import { ModuleService } from '../../services/module.service';

@Component({
  selector: 'app-module-tab',
  templateUrl: './module-tab.component.html',
  styleUrls: ['./module-tab.component.css']
})
export class ModuleTabComponent extends DisplayedComponent implements OnInit {
  module: Module;
  modelData: {};
  assetView: any;

  @Input() moduleName: string;

  constructor(private moduleService: ModuleService, private location: Location) { 
    super();

    this.assetView = null;
  }
  
  ngOnInit() {
    this.getData();
  }

  private getData(): void {
    this.moduleService.getModule(this.moduleName)
      .subscribe(module => {
        this.module = module;
        this.getLocalModel(this.module);
      });
  }

  private getLocalModel(module: Module): void {
    this.modelData = {};   
    this.modelData['params'] = {};   
    this.modelData['mode'] = ModuleVerb.none;

    for (let param of module.params) {
      switch (param.type.toLowerCase()) {
        case 'list':
          this.modelData['params'][param.name] = param.values ? param.values[0] : '';
          break;
        case 'number':
          this.modelData['params'][param.name] = 0;
          break;  
        case 'boolean':
          this.modelData['params'][param.name] = false;
          break;
        case 'string':
        case 'password':
        default:
          break;
      }
    }
  }

  public activateModule(event): void {
    this.modelData['mode'] = event['mode'];
    this.modelData['assets'] = event['assets'];
    this.moduleService.runModule(this.module.name, this.modelData).subscribe();
  }

  public resume(event): void {
    this.assetView = { assetId: event['assetId'], module: event['module'], session: event['session'] };
  }

  public switchToModule(event): void {
    this.assetView = { assetId: event['assetId'], module: event['module'], session: null };
  }
}
