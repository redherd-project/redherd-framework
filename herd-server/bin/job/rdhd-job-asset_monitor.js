'use strict';

const Model = require('../../controllers/rdhd-ctr-model_controller');
const LinuxJob = require('./base/rdhd-job-base_linux_job');
const WindowsJob = require('./base/rdhd-job-base_windows_job');

// jobCode: "keep_alive"
class AssetMonitorJob
{
    static get code() { return "keep_alive"; }

    static run(asset, sync = false, wsServer = 'http://127.0.0.1:3001')
    {
        try
        {
            let model = new Model();
            let assetType = model.getTypeByAssetId(asset.id).name;

            switch(assetType.toUpperCase())
            {
                case LinuxJob.os:
                    LinuxJob.isAlive(asset, AssetMonitorJob.code, sync, false, wsServer);
                    break;
                case WindowsJob.os:
                    WindowsJob.isAlive(asset, AssetMonitorJob.code, sync, false, wsServer);
                    break;
                default:
                    // Unsupported operating system
                    console.log("Unsupported operating system");
                    break;
            }
        }
        catch (e)
        {
            console.log(e);
        }
    }
}

module.exports = AssetMonitorJob