'use strict';

const ProxyController = require('./base/rdhd-ctr-base_proxy_controller');
const TcpProxyFactory = require('../bin/lib/rdhd-lib-tcp_proxy_factory');
const ProxyJobModulePath = __dirname + '/../bin/job/rdhd-job-tcp_proxy.js';

class TcpProxyController extends ProxyController
{
    constructor()
    {
        super(TcpProxyFactory, ProxyJobModulePath);
    }
}

module.exports = TcpProxyController;