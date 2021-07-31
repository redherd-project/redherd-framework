const config = {
    // ************************************************************
    //  General configuration section
    // ************************************************************
    database_path                   : __dirname + "/models/data/redherd.sqlite3",
    modules_directory               : __dirname + "/bin/module/collection/",
    system_user_id                  : 1,
    keepalive_interval              : 5,
    debug_mode                      : false,
    private_key                     : __dirname + "/key/priv.key",
    rate_limit_window               : 1000, // Rate Limit Window: 1 minute
    rate_limit_count                : 150,  // Rate Limit Max: 150 requests

    // ************************************************************
    //  Asset Web Proxy configuration section
    // ************************************************************
    asset_web_proxy_auth_enabled    : true,
    asset_web_proxy_endpoint        : "/",
    //asset_web_proxy_endpoint        : "/terminal/", <-- NOTE: Set specific route as endpoint in this way (closing "/" required)
    asset_web_proxy_over_ssl        : true,
    asset_web_proxy_ssl_key_path    : __dirname + "/ssl/key.pem",
    asset_web_proxy_ssl_cert_path   : __dirname + "/ssl/cert.pem",
    asset_web_proxy_ssl_ca_path     : __dirname + "/ssl/ca.crt",

    // ************************************************************
    //  Terminal Server configuration section
    // ************************************************************
    terminal_server_endpoint        : "/",
    terminal_server_over_ssl        : false,
    terminal_server_ssl_key_path    : __dirname + "/ssl/key.pem",
    terminal_server_ssl_cert_path   : __dirname + "/ssl/cert.pem",
    terminal_server_ssl_ca_path     : __dirname + "/ssl/ca.crt",

    // ************************************************************
    //  API service configuration section
    // ************************************************************
    api_auth_enabled                : true,
    api_over_ssl                    : true,
    api_server_port                 : 3000,
    api_endpoint                    : "/api",
    api_secured_routes              : [ /^\/api\/assets\/.+\/modules\/.+\/run$/, /^\/api\/assets\/.+\/service$/, /^\/api\/users.*$/ ],
    api_ssl_key_path                : __dirname + "/ssl/key.pem",
    api_ssl_cert_path               : __dirname + "/ssl/cert.pem",
    api_ssl_ca_path                 : __dirname + "/ssl/ca.crt",
    api_jwt_expiration_time         : "3h",
    api_jwt_key_path                : __dirname + "/ssl/key.pem",
    api_jwt_cert_path               : __dirname + "/ssl/cert.pem",

    // ************************************************************
    //  Messages service configuration section
    // ************************************************************
    msg_server_port                 : 3001,
    msg_over_ssl                    : true,
    msg_ssl_key_path                : __dirname + "/ssl/key.pem",
    msg_ssl_cert_path               : __dirname + "/ssl/cert.pem",
    msg_ssl_ca_path                 : __dirname + "/ssl/ca.crt",

    // ************************************************************
    //  Ftp server configuration section
    // ************************************************************
    ftp_server_port                 : 21,
    ftp_over_ssl                    : true,
    ftp_server_user                 : "redherd",
    ftp_server_pass                 : "redherd",

    // ************************************************************
    //  File manager configuration section
    // ************************************************************
    file_manager_bind_address       : "127.0.0.1",
    file_manager_bind_port          : 3002,
    file_manager_mount_dir          : "/home/node/share",
    file_manager_auth_enabled       : true,
    file_manager_over_ssl           : true,

    // ************************************************************
    //  Asset ENV variables
    // ************************************************************
    asset_env : {
        herd_server                 : "REDHERD_SRV",
        ftp_server                  : "REDHERD_FTP",
        data_dir                    : "REDHERD_DATA"
    },

    // ************************************************************
    //  Services configuration section
    // ************************************************************
    services_port_range : {
        first                       : 30000,
        last                        : 45000
    }
}

module.exports = config
