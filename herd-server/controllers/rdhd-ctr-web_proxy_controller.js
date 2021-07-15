'use strict';

const ProxyController = require('./base/rdhd-ctr-base_proxy_controller');
const WebProxyFactory = require('../bin/lib/rdhd-lib-web_proxy_factory');
const ProxyJobModulePath = __dirname + '/../bin/job/rdhd-job-web_proxy.js';

class WebProxyController extends ProxyController
{
    constructor()
    {
        super(WebProxyFactory, ProxyJobModulePath);
    }
}

module.exports = WebProxyController;