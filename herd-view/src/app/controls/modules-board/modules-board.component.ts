import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AdaptiveComponent } from '../../bin/gui/display';
import { Config } from 'src/app/config';

@Component({
  selector: 'app-modules-board',
  templateUrl: './modules-board.component.html',
  styleUrls: ['./modules-board.component.css']
})
export class ModulesBoardComponent extends AdaptiveComponent implements OnInit {
  serverUrl: string;
  imgPlaceholder: string;

  tabs: string[];
  tabsContext: any[];
  selected: FormControl;

  constructor(private dbService: NgxIndexedDBService) {
    super();

    this.serverUrl = Config.api_server_proto + '://' + Config.api_server_address + ':' + Config.api_server_port;
    this.imgPlaceholder = Config.asset_image_placeholder;
    
    this.tabs = ['Modules'];
    this.tabsContext = [{ moduleName: '', moduleTitle: '', selected: true }];
    this.selected = new FormControl(0);
  }

  ngOnInit(): void {
    this.getTabsContext();
  }

  private getTabsContext(): void {
    // Retrieve workspace context from database
    this.dbService.getAll(Config.modules_workspace_context_store)
      .then(
        data => {
          this.tabsContext = [{ moduleName: '', moduleTitle: '', selected: false }];
          for (let element of data) {
            let context = { moduleName: element['moduleName'], moduleTitle: element['moduleTitle'], selected: element['selected'] };
            if (context.moduleName != '') {
              this.addTab({ name: context.moduleName, title: context.moduleTitle }, context.selected, false);
            }
          }
        }
      );
  }

  private setTabsContext(): void {
    // Store last workspace context into database
    this.dbService.clear(Config.modules_workspace_context_store);

    for (let element of this.tabsContext) {
      this.dbService.update(Config.modules_workspace_context_store, {
        id: this.tabsContext.indexOf(element),
        moduleName: element['moduleName'],
        moduleTitle: element['moduleTitle'],
        selected: element['selected']
      }).then();
    }
  }

  public changeSelectedTab(index: number): void {
    this.selected.setValue(index);

    this.tabsContext.forEach(element => { element.selected = false; });
    this.tabsContext[index].selected = true;

    this.setTabsContext();
  }

  public addTab(event, selected: boolean = true, persist: boolean = true): void {
    let existingTab = this.tabsContext.find(e => e.moduleName == event.name);

    if (!existingTab) {
      let addedTab = { moduleName: event.name, moduleTitle: event.title, selected: selected };

      this.tabsContext.push(addedTab);
      this.tabs.push(event.title);

      if (selected) {
        this.selected.setValue(this.tabsContext.indexOf(addedTab));
      }
    }
    else {
      this.selected.setValue(this.tabsContext.indexOf(existingTab));
    }

    if (persist) {
      this.setTabsContext();
    }
  }

  public removeOtherTabs(exclude: number[], persist: boolean = true): void {
    let excluded: number;

    for (let i: number = this.tabs.length - 1; i > 0; i--) {
      excluded = exclude.find(e => e === this.tabs.indexOf(this.tabs[i]));
      if (!excluded && excluded != 0) {
        this.removeTab(this.tabs.indexOf(this.tabs[i]), persist);
      }
    }
  }

  public removeTab(index: number, persist: boolean = true): void {
    if (index > 0) {
      this.tabsContext.splice(index, 1);
      this.tabs.splice(index, 1);

      this.changeSelectedTab(index - 1);

      if (persist) {
        this.setTabsContext();
      }
    }
  }
}