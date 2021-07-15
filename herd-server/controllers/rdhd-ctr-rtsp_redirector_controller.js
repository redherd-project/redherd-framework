'use strict';

const ServiceController = require('./base/rdhd-ctr-base_service_controller');
const RtspServerFactory = require('../bin/lib/rdhd-lib-rtsp_redirector_factory');
const ChildProcess = require('child_process');
const Utils = require('../bin/lib/rdhd-lib-common_utils');
const ServiceSpawnerJobPath = __dirname + '/../bin/job/rdhd-job-rtsp_redirector.js';

class RtspRedirectorController extends ServiceController
{
    constructor()
    {
        super(RtspServerFactory);
    }

    spawn(rHostId, pRange = { first: 22500, last: 29999 })
    {
        let result;
        let serverPort;
        let clientPort;
        try
        {
            if (this._spawnedServices.some(e => e.id === rHostId))
            {
                for (let i in this._spawnedServices)
                {
                    if (this._spawnedServices[i].id == rHostId)
                    {
                        serverPort = this._spawnedServices[i].sport;
                        clientPort = this._spawnedServices[i].port;
                    }
                }
            }
            else
            {
                //serverPort = Utils.getFreePortInRange(22500, 24999);
                //clientPort = Utils.getFreePortInRange(25000, 29999);

                serverPort = Utils.getFreePortInRange(pRange.first, pRange.last);
                clientPort = Utils.getFreePortInRange(pRange.first, pRange.last);

                ChildProcess.spawn("node", [ ServiceSpawnerJobPath, clientPort, serverPort ]);

                this._spawnedServices.push({ id: rHostId, sport: serverPort, port: clientPort });
            }
            result = { cport: clientPort, sport: serverPort };
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }
}

module.exports = RtspRedirectorController;