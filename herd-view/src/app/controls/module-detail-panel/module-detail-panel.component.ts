import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Config } from 'src/app/config';
import { Module, ModuleInstance } from '../../bin/model/module';
import { ModuleService } from '../../services/module.service';
import { AssetService } from '../../services/asset.service';
import { SocketioService } from '../../services/socket-io.service'
import { Lv2Message } from '../../bin/proto/lv2-message';
import { NgTerminal, FunctionsUsingCSI } from 'ng-terminal';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-module-detail-panel',
  templateUrl: './module-detail-panel.component.html',
  styleUrls: ['./module-detail-panel.component.css']
})
export class ModuleDetailPanelComponent implements OnInit {
  @ViewChild('term', { static: true }) child: NgTerminal;
  assetId: number;
  module: Module;
  modelData: {};
  apiData: {};
  moduleInstance: ModuleInstance;
  baseUrl: string;
  output: Subject<string>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moduleService: ModuleService,
    private assetService: AssetService,
    private location: Location,
    private socketioService: SocketioService
  ) {
    this.assetId = +this.route.snapshot.paramMap.get('id');
    this.baseUrl = 'https://' + Config.api_server_address + ':';
    this.output = new Subject<string>();
  }

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    let name : string = this.route.snapshot.paramMap.get('name');
    this.moduleService.getModule(name)
      .subscribe(module => {
        this.module = module;
        this.initializeContextData();
      });
  }

  execute(): void {
    this.prepareRequestData();
    this.apiData['mode'] = this.module.tags.find(e => e.toLowerCase() == 'interactive') ? "interact" : (this.module.tags.find(e => e.toLowerCase() == 'automatic') ? 'execute' : 'pivot'); 
    this.assetService.runModule(this.assetId, this.module.name, this.apiData).subscribe(res => {
      this.moduleInstance = res;
      if (this.apiData['mode'] == 'interact' && this.apiData['params']['operation'] == 'start') {
        this.router.navigate(['assets/' + this.assetId + '/modules/' + this.module.name + '/' + res.result['ports']['port']]);
      } else {
        this.clearOutput();
        this.getMessages(this.moduleInstance.session);
      }
    });
  }

  configure(): void {
    this.prepareRequestData();
    this.apiData['mode'] = 'configure';

    this.assetService.runModule(this.assetId, this.module.name, this.apiData).subscribe(res => {
      this.moduleInstance = res;
      this.clearOutput();
      this.getMessages(this.moduleInstance.session);
    });  
  }
  
  back(): void {
    this.location.back();
  }

  initializeContextData(): void {
    this.modelData = {};   
    this.modelData['params'] = {};   
    this.modelData['mode'] = '';

    this.module.params.forEach(e => {
      switch (e.type.toLowerCase()) {
        case 'string':
        case 'password':
        case 'list':
          this.modelData['params'][e.name] = '';
          break;
        case 'number':
          this.modelData['params'][e.name] = 0;
          break;  
        case 'boolean':
          this.modelData['params'][e.name] = false;
          break;
        default:
          break;
      }
    })
  }

  prepareRequestData(): void {
    this.apiData = {};
    this.apiData['mode'] = '';
    this.apiData['params'] = {};
    for (let key of Object.keys(this.modelData['params'])) {
      this.apiData['params'][key] = this.modelData['params'][key].toString();
    }
  }

  clearOutput(): void {
    this.output.next(FunctionsUsingCSI.eraseInDisplay(2));
    this.output.next(FunctionsUsingCSI.cursorPosition(0,0));
  }

  private getMessages(session: string): void {
    this.socketioService
    .getMessages()
    .subscribe((message: Lv2Message) => {
        if (message.session == session && message.payload.type != "EXTCODE")
        {
          this.output.next(message.payload.content.replace(/\n/g,'\r\n') + '\r\n');
          //console.log(message);
        } else if (message.session == session && message.payload.type == "EXTCODE") {
          if (message.payload.content === '0') {
            this.output.next('\r\n[ Completed ]\r\n');
          } else {
            this.output.next('\r\n[ Error ]\r\n');
          }
          //console.log(message);
        }
    }); 
  }
}
