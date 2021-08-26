import { Component, OnInit, EventEmitter, Input, Output } from '@angular/core';
import { Module, ModuleMode, ModuleVerb } from '../../bin/model/module';
import { ModuleService } from '../../services/module.service';
import { AssetService } from '../../services/asset.service';


@Component({
  selector: 'app-module-panel',
  templateUrl: './module-panel.component.html',
  styleUrls: ['./module-panel.component.css']
})
export class ModulePanelComponent implements OnInit {
  modelData: {};
  module: Module;
  port: number;

  @Input() assetId: number;
  @Input() moduleName: string;
  @Input() session: string;
  @Output() moduleInteractionEnded = new EventEmitter();

  constructor(private moduleService: ModuleService, private assetService: AssetService) {
    this.session = '';
    this.assetId = -1;
    this.port = 0;
  }

  ngOnInit() {
    this.getData();
  }

  private getData(): void {
    this.moduleService.getModule(this.moduleName)
      .subscribe(module => {
        this.module = module;
        this.getLocalModel(this.module);

        if (this.session) {
          this.resume();
        }
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
    this.modelData['mode'] = this.getModuleVerb(module);
  }

  private getModuleVerb(module: Module): ModuleVerb {
    let verb: ModuleVerb = ModuleVerb.none;

    for (let tag of module.tags) {
      switch (tag.toLowerCase()) {
        case ModuleMode.automatic:
          verb = ModuleVerb.execute;
          break;
        case ModuleMode.interactive:
          verb = ModuleVerb.interact;
          break;
        case ModuleMode.pivotable:
          verb = ModuleVerb.pivot;
          break;
        default:
          verb = ModuleVerb.none;
          break;
      }
    }
    return verb;
  }

  public execute(): void {
    this.modelData['mode'] = this.getModuleVerb(this.module);

    this.assetService.runModule(+this.assetId, this.module.name, this.modelData).subscribe(instance => {
      if (this.modelData['mode'] == ModuleVerb.interact && this.modelData['params']['operation'] == 'start' && instance.result['ports']) {
        this.port = +instance.result['ports']['port'];
      }
      else if (this.modelData['mode'] == ModuleVerb.interact && this.modelData['params']['operation'] == 'stop') {
        this.modelData['mode'] = ModuleVerb.execute;
      }
      else if ((this.modelData['mode'] == ModuleVerb.interact || this.modelData['mode'] == ModuleVerb.pivot) && !this.modelData['params']['operation']) {
        this.modelData['mode'] = ModuleVerb.none;
        return;
      }
      this.session = instance.session;
    });
  }

  public configure(): void {
    this.modelData['mode'] = ModuleVerb.configure;

    this.assetService.runModule(+this.assetId, this.module.name, this.modelData).subscribe(instance => {
      this.session = instance.session;
    });  
  }

  public resume(): void {
    this.modelData['mode'] = ModuleVerb.resume;
  }

  public back(): void {
    this.moduleInteractionEnded.emit();
  }
}
