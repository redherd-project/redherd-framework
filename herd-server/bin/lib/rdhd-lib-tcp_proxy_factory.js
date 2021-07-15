'use strict';

// Ref: https://www.npmjs.com/package/node-tcp-proxy
const proxy = require('node-tcp-proxy');
const ServiceFinalizer = require('./base/rdhd-lib-service_finalizer');

class TcpProxyFactory
{
    static spawn(port, targetHosts, targetPorts)
    {
        let result = true;
        try
        {
            let tcpProxy = proxy.createProxy(port, targetHosts, targetPorts);
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }

    static destroy(port)
    {
        return ServiceFinalizer.destroy(port);
    }
}

module.exports = TcpProxyFactory;