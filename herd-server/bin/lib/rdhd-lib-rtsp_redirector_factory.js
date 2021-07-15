'use strict';

const RtspServer = require('rtsp-streaming-server').default;
const ServiceFinalizer = require('./base/rdhd-lib-service_finalizer');

class RtspRedirectorFactory
{
    static spawn(sPort, cPort)
    {
        let result = true;
        try
        {
            let options = {
                serverPort: sPort,
                clientPort: cPort,
                rtpPortStart: 10000,
                rtpPortCount: 10000
            }

            let server = new RtspServer(options);

            _initiate(server);
        }
        catch
        {
            result = false;
        }
        return result;
    }

    static destroy(sPort)
    {
        return ServiceFinalizer.destroy(sPort);
    }
}

async function _initiate(server)
{
    await server.start();
}

module.exports = RtspRedirectorFactory;