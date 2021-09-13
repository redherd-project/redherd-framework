import { SocketIoConfig } from 'ngx-socket-io'
import { DBConfig } from 'ngx-indexed-db';

let server_address: string = '10.10.0.3';
let api_port: number = 3000;
let socketio_port: number = 3001;
let filemanager_port: number = 3002;

export const Config = {
  // ************************************************************
  //  Certification Authority url
  // ************************************************************
  ca_url                          : 'https://' + server_address + ':' + api_port + '/ca.crt',

  // ************************************************************
  //  General configuration section
  // ************************************************************
  api_server_address              : server_address,
  api_server_proto                : 'https',
  api_server_port                 : api_port,
  api_url                         : 'https://' + server_address + ':' + api_port + '/api',

  assets_refresh_interval         : 10000,
  asset_image_placeholder         : 'assets/images/asset.png',

  single_instance                 : true,

  root_landing_path               : '/',
  unauthenticated_landing_path    : '/login',
  authenticated_landing_path      : '/assets',

  // ************************************************************
  //  Socket-io configuration section
  // ************************************************************
  socketio_url                    : 'https://' + server_address + ':' + socketio_port,

  // ************************************************************
  //  IndexedDB configuration section
  // ************************************************************
  db_name                         : 'rdhd',
  assets_data_store               : 'rdhd_assets_data',
  assets_status_store             : 'rdhd_assets_status',
  auth_token_store                : 'rdhd_token',
  assets_workspace_context_store  : 'rdhd_assets_workspace_context',
  modules_workspace_context_store : 'rdhd_modules_workspace_context',
  
  // ************************************************************
  //  File Manager configuration section
  // ************************************************************
  filemanager_url                 : 'https://' + server_address + ':' + filemanager_port,
}

export const socketioConfig: SocketIoConfig = { url: Config.socketio_url, options: {} };

export const dbConfig: DBConfig  = {
  name: Config.db_name,
  version: 1,
  objectStoresMeta: [
  {
    store: Config.assets_data_store,
    storeConfig: { keyPath: 'id', autoIncrement: false },
    storeSchema: [
      { name: 'name', keypath: 'name', options: { unique: false } },
      { name: 'ip', keypath: 'ip', options: { unique: false }  },
      { name: 'fingerprint', keypath: 'fingerprint', options: { unique: false }  },
      { name: 'user', keypath: 'user', options: { unique: false }  },
      { name: 'type', keypath: 'type', options: { unique: false }  },
      { name: 'description', keypath: 'description', options: { unique: false }  },
    ]
  },
  {
    store: Config.assets_status_store,
    storeConfig: { keyPath: 'id', autoIncrement: false },
    storeSchema: [
      { name: 'status', keypath: 'status', options: { unique: false } },
      { name: 'icon', keypath: 'icon', options: { unique: false } },
    ]
  },
  {
    store: Config.assets_workspace_context_store,
    storeConfig: { keyPath: 'id', autoIncrement: false },
    storeSchema: [
      { name: 'assetId', keypath: 'assetId', options: { unique: true } },
      { name: 'assetName', keypath: 'assetName', options: { unique: true } },
      { name: 'terminal', keypath: 'terminal', options: { unique: false } },
      { name: 'selected', keypath: 'selected', options: { unique: false } }
    ]
  },
  {
    store: Config.modules_workspace_context_store,
    storeConfig: { keyPath: 'id', autoIncrement: false },
    storeSchema: [
      { name: 'moduleName', keypath: 'moduleName', options: { unique: true } },
      { name: 'moduleTitle', keypath: 'moduleTitle', options: { unique: true } },
      { name: 'moduleType', keypath: 'moduleType', options: { unique: false } },
      { name: 'selected', keypath: 'selected', options: { unique: false } }
    ]
  }
]};
