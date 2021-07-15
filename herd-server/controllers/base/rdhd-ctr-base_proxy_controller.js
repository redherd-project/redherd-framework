'use strict';

const ChildProcess = require('child_process');
const ServiceController = require('./rdhd-ctr-base_service_controller');
const Utils = require('../../bin/lib/rdhd-lib-common_utils');

class ProxyController extends ServiceController
{
    constructor(proxyFactory, proxyModule)
    {
        super(proxyFactory);

        this._proxyModule = proxyModule;
    }

    spawn(assetId, assetIp, assetPort, pRange = { first: 30000, last: 34998 }, assetOverSsl = false)
    {
        let result;
        let proxyPort;
        try
        {
            if (this._spawnedServices.some(e => e.id === assetId))
            {
                for (let i in this._spawnedServices)
                {
                    if (this._spawnedServices[i].id == assetId)
                    {
                        proxyPort = this._spawnedServices[i].port;
                    }
                }
            }
            else
            {
                proxyPort = Utils.getFreePortInRange(pRange.first, pRange.last);
                ChildProcess.spawn("node", [ this._proxyModule, proxyPort, assetIp, assetPort, assetOverSsl ]);

                this._spawnedServices.push({ id: assetId, port: proxyPort });
            }
            result = proxyPort;
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }
}

module.exports = ProxyController;