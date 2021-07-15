// ************************************************************
//  Importing core components
// ************************************************************
const express = require('express');
const app = express();
const fs = require('fs');
const bodyparser = require('body-parser');
const ratelimiter = require('express-rate-limit');
const cors = require('cors');

const Config = require('./config');
const Validator = require('./bin/lib/rdhd-lib-input_validator');
const AssetsMonitor = require('./controllers/rdhd-ctr-assets_monitor_controller');
const ProcessesMonitor = require('./controllers/rdhd-ctr-processes_monitor_controller');
const FileManager = require('./controllers/rdhd-ctr-file_manager_controller');
const Model = require('./controllers/rdhd-ctr-model_controller');

// ************************************************************
//  Define http(s) servers and related options
// ************************************************************
const apiOverSSL = Validator.validatePositiveBool(Config.api_over_ssl) ? true : false;
const apiSSLKey =  apiOverSSL ? fs.readFileSync(Config.api_ssl_key_path) : "";
const apiSSLCert = apiOverSSL ? fs.readFileSync(Config.api_ssl_cert_path) : "";
const apiSSLCA = apiOverSSL ? fs.readFileSync(Config.api_ssl_ca_path) : "";
const apiSSLOptions = apiOverSSL ? { key: apiSSLKey, cert: apiSSLCert, ca: apiSSLCA } : {};

const msgOverSSL = Validator.validatePositiveBool(Config.msg_over_ssl) ? true : false;
const msgSSLKey = msgOverSSL ? fs.readFileSync(Config.msg_ssl_key_path) : "";
const msgSSLCert = msgOverSSL ? fs.readFileSync(Config.msg_ssl_cert_path) : "";
const msgSSLCA = msgOverSSL ? fs.readFileSync(Config.msg_ssl_ca_path) : "";
const msgSSLOptions = msgOverSSL ? { key: msgSSLKey, cert: msgSSLCert, ca: msgSSLCA } : {};

const apiPort = Validator.validateTcpUdpPort(Config.api_server_port) ? Config.api_server_port : 3000;
const apiHost = (apiOverSSL ? 'https' : 'http') + '://localhost:' + apiPort;
const msgPort = Validator.validateTcpUdpPort(Config.msg_server_port) ? Config.msg_server_port : 3001;
const msgHost = (msgOverSSL ? 'https' : 'http') + '://localhost:' + msgPort;

const apiHttp = apiOverSSL ? require('https') : require('http');
const msgHttp = msgOverSSL ? require('https') : require('http');
const fileManager = new FileManager();

const rateLimitWindow = Validator.validateNumber(Config.rate_limit_window) ? Config.rate_limit_window : 60000;
const rateLimitCount = Validator.validateNumber(Config.rate_limit_count) ? Config.rate_limit_count : 100;
const limiter = ratelimiter({ windowMs: rateLimitWindow,  max: rateLimitCount, message: '429 - Too Many Requests' });

// ************************************************************
//  Define business objects
// ************************************************************
let model = new Model();
let assetsMonitorController = new AssetsMonitor(model.assets, msgHost);

// ************************************************************
//  Importing required Custom components
// ************************************************************
const Router = require('./routes/rdhd-rte-routes');
//const { config } = require('process');

app.use(cors());
// NOTE: Due to compatibility issues the "limiter" middleware MUST
// be provided BEFORE "bodyparser" middleware
app.use(limiter);
app.use(bodyparser.urlencoded({ extended: true }));
app.use(bodyparser.json());
app.use(express.static(__dirname + '/public'));

Router(app);

// ************************************************************
//  Error 404 page
// ************************************************************
app.use((req, res) => {
    res.type('text/plain');
    res.status(404);
    res.send('404 - Not Found');
});

// ************************************************************
//  Error 500 page
// ************************************************************
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.type('text/plain');
    res.status(500);
    res.send('500 - Server Error');
});

// ************************************************************
//  Create web server instance
// ************************************************************
const apiServer = apiHttp.createServer(apiSSLOptions, app);
const msgServer = msgHttp.createServer(msgSSLOptions, app);

fileManager.spawn(
    Config.file_manager_bind_address,
    30002,
    Config.file_manager_bind_port,
    Config.file_manager_mount_dir,
    Config.api_ssl_key_path,
    Config.api_ssl_cert_path,
    Config.api_ssl_ca_path,
    Config.file_manager_auth_enabled,
    Config.file_manager_over_ssl);

// ************************************************************
//  Initiate socket.io server
// ************************************************************
const io = require('socket.io')(msgServer);

// ************************************************************
//  Initiate WebSocket server
// ************************************************************
io.on('connection', (socket) => {
    socket.on('message', (msg) => {
        setTimeout(() => {
            io.emit('message', msg);
        }, 250);
        
        if (Config.debug_mode)
        {
            console.log(msg);
        }
    });

    socket.on('disconnect', () => {
        delete io.sockets[socket.id];
        delete io.sockets.sockets[socket.id];
    });
});

// ************************************************************
//  Start server
// ************************************************************
apiServer.listen(apiPort, () => {
    console.log( 'API Server started on ' + apiHost);
});

msgServer.listen(msgPort, () => {
    console.log( 'Messages Server started on ' + msgHost);
});

// ************************************************************
//  Start assets Monitoring
// ************************************************************
assetsMonitorController.start(Validator.validateNumber(Config.keepalive_interval) ? Config.keepalive_interval : 20);

// ************************************************************
//  Start processes Monitoring
// ************************************************************
ProcessesMonitor.start(msgHost);