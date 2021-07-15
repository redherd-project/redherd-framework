'use strict';

const TerminalServerFactory = require('../bin/lib/rdhd-lib-terminal_server_factory');
const WebProxyController = require('./rdhd-ctr-web_proxy_controller');
const ChildProcess = require('child_process');
const Utils = require('../bin/lib/rdhd-lib-common_utils');
const ServerJobModulePath = __dirname + '/../bin/job/rdhd-job-terminal_server.js';

class TerminalController
{
    constructor()
    {
        this._proxyController = new WebProxyController();
        this._spawnedTerminals = [];
    }

    spawn(user, ip, rHostId, rPort = 22, command = '', rHostSsl = false, pRange = { first: 34999, last: 65000 })
    {
        let result;
        let serverPort;
        let proxyPort;
        try
        {
            if (this._spawnedTerminals.some(e => e.id === rHostId))
            {
                for (let i in this._spawnedTerminals)
                {
                    if (this._spawnedTerminals[i].id == rHostId)
                    {
                        serverPort = this._spawnedTerminals[i].sport;
                        proxyPort = this._spawnedTerminals[i].port;
                    }
                }
            }
            else
            {
                //serverPort = Utils.getFreePortInRange(34999, 59999);
                serverPort = Utils.getFreePortInRange(pRange.first, pRange.last);
                ChildProcess.spawn("node", [ ServerJobModulePath, ip, user, serverPort, rPort, command ]);

                proxyPort = this._proxyController.spawn(rHostId, "127.0.0.1", serverPort, pRange, rHostSsl);

                this._spawnedTerminals.push({ id: rHostId, sport: serverPort, port: proxyPort });
            }
            result = proxyPort;
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }

    destroyByPort(port)
    {
        let result = true;
        try
        {
            for(let i in this._spawnedTerminals)
            {
                if (this._spawnedTerminals[i].port == port)
                {
                    TerminalServerFactory.destroy(this._spawnedTerminals[i].sport);
                    this._proxyController.destroyByPort(port);
                    this._spawnedTerminals.splice(i, 1);
                    break;
                }
            }
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }

    destroyById(rHostId)
    {
        let result = true;
        try
        {
            for(let i in this._spawnedTerminals)
            {
                if (this._spawnedTerminals[i].id == rHostId)
                {
                    TerminalServerFactory.destroy(this._spawnedTerminals[i].sport);
                    this._proxyController.destroyByPort(this._spawnedTerminals[i].port);
                    this._spawnedTerminals.splice(i, 1);
                    break;
                }
            }
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }
}

module.exports = TerminalController;