'use strict';

// Ref: https://www.npmjs.com/package/udp-proxy
const proxy = require('udp-proxy');
const ServiceFinalizer = require('./base/rdhd-lib-service_finalizer');

class UdpProxyFactory
{
    static spawn(port, targetHost, targetPort)
    {
        let result = true;
        try
        {
            let options = {
                address: targetHost,
                port: targetPort,
                localport: port
            };

            let udpProxy = proxy.createServer(options);
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }

    static destroy(port)
    {
        return ServiceFinalizer.destroy(port, 'udp');
    }
}

module.exports = UdpProxyFactory;