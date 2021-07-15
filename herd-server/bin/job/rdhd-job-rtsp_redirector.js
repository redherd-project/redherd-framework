const RtspRedirectorFactory = require('../lib/rdhd-lib-rtsp_redirector_factory');
const Validator = require('../lib/rdhd-lib-input_validator');

try
{
    // ************************************************************
    //  Instance specific parameters
    // ************************************************************
    let cPort = Validator.validateTcpUdpPort(process.argv[2]) ? process.argv[2] : false;
    let sPort = Validator.validateTcpUdpPort(process.argv[3]) ? process.argv[3] : false;

    if (sPort && cPort)
    {
        // ************************************************************
        //  Spawn new RTSP redirector
        // ************************************************************
        RtspRedirectorFactory.spawn(sPort, cPort);
    }
}
catch (e)
{
    console.log(e);
}