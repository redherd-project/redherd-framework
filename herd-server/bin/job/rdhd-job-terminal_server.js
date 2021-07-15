const TerminalServerFactory = require('../lib/rdhd-lib-terminal_server_factory');
const Validator = require('../lib/rdhd-lib-input_validator');
const Config = require('../../config');

try
{
    // ************************************************************
    //  Instance specific parameters
    // ************************************************************
    let ip =  Validator.validateIp(process.argv[2]) ? process.argv[2] : false;
    let user = Validator.validateUser(process.argv[3]) ? process.argv[3] : false;
    let port = Validator.validateTcpUdpPort(process.argv[4]) ? process.argv[4] : false;
    let rPort = Validator.validateTcpUdpPort(process.argv[5]) ? process.argv[5] : 22;
    let command = process.argv[6] ? process.argv[6] : '';

    // ************************************************************
    //  Config related parameters
    // ************************************************************
    let sshKey = Validator.validateSslPath(Config.private_key) ? Config.private_key : false;
    let endpoint = Validator.validateLinuxPath(Config.terminal_server_endpoint) ? Config.terminal_server_endpoint : false;
    let sslCert = Validator.validateSslPath(Config.terminal_server_ssl_cert_path) ? Config.terminal_server_ssl_cert_path : false;
    let sslKey = Validator.validateSslPath(Config.terminal_server_ssl_key_path) ? Config.terminal_server_ssl_key_path : false;
    let sslEnabled = Validator.validateBool(Config.terminal_server_over_ssl) ? Config.terminal_server_over_ssl : false;

    let sslConf = '';

    if (ip && user && port && sshKey && endpoint)
    {
        // ************************************************************
        //  Detecting is SSL is enable or not
        // ************************************************************
        if (sslEnabled && sslKey && sslCert)
        {
            sslConf = { cert: sslCert, key: sslKey };
        }

        // ************************************************************
        //  Spawn new terminal server
        // ************************************************************
        TerminalServerFactory.spawn(ip, user, port, sshKey, endpoint, sslConf, rPort, command);
    }
}
catch (e)
{
    console.log(e);
}