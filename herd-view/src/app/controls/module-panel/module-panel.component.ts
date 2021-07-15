import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { Module } from '../../bin/model/module';
import { ModuleService } from '../../services/module.service';

@Component({
  selector: 'app-module-panel',
  templateUrl: './module-panel.component.html',
  styleUrls: ['./module-panel.component.css']
})
export class ModulePanelComponent implements OnInit {
  module: Module;

  constructor(
    private route: ActivatedRoute,
    private moduleService: ModuleService,
    private location: Location
  ) {}

  ngOnInit() {
    this.getData();
  }

  getData(): void {
    let name : string = this.route.snapshot.paramMap.get('name');

    this.moduleService.getModule(name)
      .subscribe(module => this.module = module);
  }

  back(): void {
    this.location.back();
  }
}
