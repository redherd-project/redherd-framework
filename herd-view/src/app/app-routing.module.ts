import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './bin/auth/auth.guard'
import { AssetsTableComponent } from './controls/assets-table/assets-table.component';
import { AssetPanelComponent } from './controls/asset-panel/asset-panel.component';
import { TopicsTableComponent } from './controls/topics-table/topics-table.component';
import { TopicPanelComponent } from './controls/topic-panel/topic-panel.component';
import { ProcessesTableComponent } from './controls/processes-table/processes-table.component';
import { ModulesTableComponent } from './controls/modules-table/modules-table.component';
import { ModulePanelComponent } from './controls/module-panel/module-panel.component';
import { ModuleWrapperComponent } from './controls/module-wrapper/module-wrapper.component';
import { TypesTableComponent } from './controls/types-table/types-table.component';
import { TypePanelComponent } from './controls/type-panel/type-panel.component';
import { TerminalComponent } from './controls/terminal/terminal.component';
import { LoginPanelComponent } from './controls/login-panel/login-panel.component';
import { FilemanagerComponent } from './controls/filemanager/filemanager.component';

const routes: Routes = [
  { path: '', redirectTo: '/assets', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: 'assets', component: AssetsTableComponent, canActivate: [AuthGuard] },
  { path: 'assets/:id', component: AssetPanelComponent, canActivate: [AuthGuard] },
  { path: 'assets/:id/modules/:name', component: ModulePanelComponent, canActivate: [AuthGuard] },
  { path: 'assets/:id/modules/:name/:port', component: ModuleWrapperComponent, canActivate: [AuthGuard] },
  { path: 'topics', component: TopicsTableComponent, canActivate: [AuthGuard] },
  { path: 'topics/:id', component: TopicPanelComponent, canActivate: [AuthGuard] },
  { path: 'processes', component: ProcessesTableComponent, canActivate: [AuthGuard] },
  { path: 'modules', component: ModulesTableComponent, canActivate: [AuthGuard] },
  { path: 'types', component: TypesTableComponent, canActivate: [AuthGuard] },
  { path: 'types/:id', component: TypePanelComponent, canActivate: [AuthGuard] },
  { path: 'terminal/:id', component: TerminalComponent, canActivate: [AuthGuard] },
  { path: 'filemanager', component: FilemanagerComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPanelComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule { }
