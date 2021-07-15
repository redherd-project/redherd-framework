'use strict';

const ProxyController = require('./base/rdhd-ctr-base_proxy_controller');
const UdpProxyFactory = require('../bin/lib/rdhd-lib-udp_proxy_factory');
const ProxyJobModulePath = __dirname + '/../bin/job/rdhd-job-udp_proxy.js';

class UdpProxyController extends ProxyController
{
    constructor()
    {
        super(UdpProxyFactory, ProxyJobModulePath);
    }
}

module.exports = UdpProxyController;