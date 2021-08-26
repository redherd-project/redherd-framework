import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { SocketIoModule } from 'ngx-socket-io'
import { NgxIndexedDBModule } from 'ngx-indexed-db';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LayoutModule } from '@angular/cdk/layout';
import { NgTerminalModule } from 'ng-terminal';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs'; 
import { DragDropModule } from '@angular/cdk/drag-drop';
import { SimpleNotificationsModule } from 'angular2-notifications';
import { ImgFallbackModule } from 'ngx-img-fallback';
import { NavBarComponent } from './controls/nav-bar/nav-bar.component';
import { AppRoutingModule } from './app-routing.module';
import { socketioConfig, dbConfig } from './config'
import { TerminalComponent } from './controls/terminal/terminal.component';
import { ModulesTableComponent } from './controls/modules-table/modules-table.component';
import { ModulePanelComponent } from './controls/module-panel/module-panel.component';
import { ProcessesTableComponent } from './controls/processes-table/processes-table.component';
import { AssetsTableComponent } from './controls/assets-table/assets-table.component';
import { AssetPanelComponent } from './controls/asset-panel/asset-panel.component';
import { AssetDetailPanelComponent } from './controls/asset-detail-panel/asset-detail-panel.component';
import { AssetTopicPanelComponent } from './controls/asset-topic-panel/asset-topic-panel.component';
import { AssetModulePanelComponent } from './controls/asset-module-panel/asset-module-panel.component';
import { AssetProcessPanelComponent } from './controls/asset-process-panel/asset-process-panel.component';
import { FilemanagerComponent } from './controls/filemanager/filemanager.component';
import { ModuleWrapperComponent } from './controls/module-wrapper/module-wrapper.component';
import { LoginFormComponent } from './controls/login-form/login-form.component';
import { LoginPanelComponent } from './controls/login-panel/login-panel.component';
import { CaDownloaderComponent } from './controls/ca-downloader/ca-downloader.component';
import { AssetsBoardComponent } from './controls/assets-board/assets-board.component';
import { ModuleOutputPanelComponent } from './controls/module-output-panel/module-output-panel.component';


@NgModule({
  declarations: [
    AppComponent,
    NavBarComponent,
    TerminalComponent,
    ModulesTableComponent,
    ModulePanelComponent,
    ProcessesTableComponent,
    AssetsTableComponent,
    AssetPanelComponent,    
    AssetDetailPanelComponent,
    AssetTopicPanelComponent,
    AssetModulePanelComponent,
    AssetProcessPanelComponent,
    FilemanagerComponent,
    ModuleWrapperComponent,
    LoginFormComponent,
    LoginPanelComponent,
    CaDownloaderComponent,
    AssetsBoardComponent,
    ModuleOutputPanelComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MatToolbarModule,
    MatButtonModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatSidenavModule,
    MatIconModule,
    MatListModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatGridListModule,
    MatExpansionModule,
    MatTabsModule,
    HttpClientModule,
    AppRoutingModule,
    FormsModule,
    DragDropModule,
    NgTerminalModule,
    ReactiveFormsModule,
    ImgFallbackModule,
    SocketIoModule.forRoot(socketioConfig),
    NgxIndexedDBModule.forRoot(dbConfig),
    SimpleNotificationsModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {}