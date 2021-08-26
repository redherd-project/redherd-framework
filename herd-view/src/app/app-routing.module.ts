import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './bin/auth/auth.guard'
import { AssetsBoardComponent } from './controls/assets-board/assets-board.component';
import { ProcessesTableComponent } from './controls/processes-table/processes-table.component';
import { ModulesTableComponent } from './controls/modules-table/modules-table.component';
import { LoginPanelComponent } from './controls/login-panel/login-panel.component';
import { FilemanagerComponent } from './controls/filemanager/filemanager.component';

const routes: Routes = [
  { path: '', redirectTo: '/assets', pathMatch: 'full' },
  { path: 'assets', component: AssetsBoardComponent, canActivate: [AuthGuard] },
  { path: 'processes', component: ProcessesTableComponent, canActivate: [AuthGuard] },
  { path: 'modules', component: ModulesTableComponent, canActivate: [AuthGuard] },
  { path: 'filemanager', component: FilemanagerComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginPanelComponent }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { useHash: true, relativeLinkResolution: 'legacy' })
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {}
