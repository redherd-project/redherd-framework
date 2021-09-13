import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { NgxIndexedDBService } from 'ngx-indexed-db';
import { AdaptiveComponent } from '../../bin/gui/display';
import { Config } from 'src/app/config';

@Component({
  selector: 'app-assets-board',
  templateUrl: './assets-board.component.html',
  styleUrls: ['./assets-board.component.css']
})
export class AssetsBoardComponent extends AdaptiveComponent implements OnInit {
  tabs: string[];
  tabsContext: any[];
  selected: FormControl;

  constructor(private dbService: NgxIndexedDBService) {
    super();

    this.tabs = ['Assets'];
    this.tabsContext = [{ assetId: -1, assetName: '', terminal: false, selected: true }];
    this.selected = new FormControl(0);
  }

  ngOnInit(): void {
    this.getTabsContext();
  }

  private getTabsContext(): void {
    // Retrieve workspace context from database
    this.dbService.getAll(Config.assets_workspace_context_store)
      .then(
        data => {
          this.tabsContext = [{ assetId: -1, assetName: '', terminal: false, selected: false }];
          for (let element of data) {
            let context = { assetId: element['assetId'], assetName: element['assetName'], terminal: element['terminal'], selected: element['selected'] };
            if (context.assetId != -1) {
              this.addTab({ id: context.assetId, name: context.assetName }, context.terminal, context.selected, false);
            }
          }
        }
      );
  }

  private setTabsContext(): void {
    // Store last workspace context into database
    this.dbService.clear(Config.assets_workspace_context_store);
    for (let element of this.tabsContext) {
      this.dbService.update(Config.assets_workspace_context_store, {
        id: this.tabsContext.indexOf(element),
        assetId: element['assetId'],
        assetName: element['assetName'],
        // In order to avoid an excessive computational effort, the terminal
        // of each tab is always stored as disabled
        //terminal: element['terminal'],
        terminal: false,
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

  public addTab(event, terminal: boolean = false, selected: boolean = true, persist: boolean = true): void {
    let existingTab = this.tabsContext.find(e => e.assetId == event.id);

    if (!existingTab) {
      let addedTab = { assetId: event.id, assetName: event.name, terminal: terminal, selected: selected };

      this.tabsContext.push(addedTab);
      this.tabs.push(event.name);

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

  public terminalShowHide(event: number, persist: boolean = true): void {
    this.tabsContext[event].terminal = !this.tabsContext[event].terminal;

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
