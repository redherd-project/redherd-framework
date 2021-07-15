'use strict';

const AssetMonitor = require('../bin/job/rdhd-job-asset_monitor');

class AssetsMonitorController
{
    constructor(assets, msgServer)
    {
        this._assets = assets;
        this._msgServer = msgServer;
    }

    //  Cross-instance handlers collection
    // ******************************
    static keepAliveHandlers;

    start(interval = 10)
    {
        let result = true;
        try
        {
            let _keepAliveHandlers = (AssetsMonitorController.keepAliveHandlers) ? Array.from(AssetsMonitorController.keepAliveHandlers) : [];
            if (_keepAliveHandlers.length == 0)
            {
                let assets = this._assets;
                let _interval = interval * 1000;
    
                for (let i in assets)
                {
                    if (assets[i].joined)
                    {
                        _keepAliveHandlers.push(setInterval(AssetMonitor.run, _interval, assets[i], false, this._msgServer));
                    }
                }
                AssetsMonitorController.keepAliveHandlers = _keepAliveHandlers;
            }
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }
    
    stop()
    {
        let result = true;
        try
        {
            let _keepAliveHandlers = (AssetsMonitorController.keepAliveHandlers) ? Array.from(AssetsMonitorController.keepAliveHandlers) : [];
            if (_keepAliveHandlers.length > 0)
            {
                for (let i in _keepAliveHandlers)
                {
                    clearInterval(_keepAliveHandlers[i]);
                }
                AssetsMonitorController.keepAliveHandlers = [];
            }
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }
    
    restart(interval = 10)
    {
        let result = true;
        try
        {
            this.stop();
            this.start(interval);
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }
}

module.exports = AssetsMonitorController;