const UdpProxyFactory = require('../lib/rdhd-lib-udp_proxy_factory');
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

    if (pPort && rPort && rHost)
    {
        // ************************************************************
        //  Spawn new tcp proxy
        // ************************************************************
        UdpProxyFactory.spawn(pPort, rHost, rPort);
    }
}
catch (e)
{
    console.log(e);
}