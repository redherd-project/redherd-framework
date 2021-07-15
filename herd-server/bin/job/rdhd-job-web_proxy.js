const WebProxyFactory = require('../lib/rdhd-lib-web_proxy_factory');
const Validator = require('../lib/rdhd-lib-input_validator');
const Config = require('../../config');

try
{
    // ************************************************************
    //  Instance specific parameters
    // ************************************************************
    let pPort = Validator.validateTcpUdpPort(process.argv[2]) ? process.argv[2] : false;
    let rHost =  Validator.validateHost(process.argv[3]) ? process.argv[3] : false;
    let rPort =  Validator.validateTcpUdpPort(process.argv[4]) ? process.argv[4] : false;
    let targetOverSsl =  Validator.validatePositiveBool(process.argv[5]) ? true : false;

    // ************************************************************
    //  Config related parameters
    // ************************************************************
    let sslCert = Validator.validateSslPath(Config.asset_web_proxy_ssl_cert_path) ? Config.asset_web_proxy_ssl_cert_path : false;
    let sslKey = Validator.validateSslPath(Config.asset_web_proxy_ssl_key_path) ? Config.asset_web_proxy_ssl_key_path : false;
    let sslCa = Validator.validateSslPath(Config.asset_web_proxy_ssl_ca_path) ? Config.asset_web_proxy_ssl_ca_path : false;
    let authEnabled = Validator.validateBool(Config.asset_web_proxy_auth_enabled) ? Config.asset_web_proxy_auth_enabled : false;
    let sslEnabled = Validator.validateBool(Config.asset_web_proxy_over_ssl) ? Config.asset_web_proxy_over_ssl : false;
    let endpoint = Validator.validateLinuxPath(Config.asset_web_proxy_endpoint) ? Config.asset_web_proxy_endpoint : "/";
    let debugMode = Validator.validateBool(Config.debug_mode) ? Config.debug_mode : false;
    let rateLimitWindow = Validator.validateNumber(Config.rate_limit_window) ? Config.rate_limit_window : 60000;
    let rateLimitCount = Validator.validateNumber(Config.rate_limit_count) ? Config.rate_limit_count : 100;

    if (pPort && rPort && rHost)
    {
        if (sslEnabled && (!sslCert || !sslKey || !sslCa))
        {
            sslEnabled = false;
        }

        // ************************************************************
        //  Spawn new web proxy
        // ************************************************************
        WebProxyFactory.spawn(pPort, rHost, rPort, sslKey, sslCert, sslCa, authEnabled, sslEnabled, targetOverSsl, endpoint, debugMode, rateLimitWindow, rateLimitCount);
    }
}
catch (e)
{
    console.log(e);
}