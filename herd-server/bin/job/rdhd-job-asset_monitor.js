'use strict';

const Model = require('../../controllers/rdhd-ctr-model_controller');
const DebianJob = require('./base/rdhd-job-base_debian_job');
const CentosJob = require('./base/rdhd-job-base_centos_job');
const WindowsJob = require('./base/rdhd-job-base_windows_job');
const AndroidJob = require('./base/rdhd-job-base_android_job');
const MacosJob = require('./base/rdhd-job-base_macos_job');

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
                case DebianJob.os:
                    DebianJob.isAlive(asset, AssetMonitorJob.code, sync, false, wsServer);
                    break;
                case CentosJob.os:
                    CentosJob.isAlive(asset, AssetMonitorJob.code, sync, false, wsServer);
                    break;
                case WindowsJob.os:
                    WindowsJob.isAlive(asset, AssetMonitorJob.code, sync, false, wsServer);
                    break;
                case AndroidJob.os:
                    AndroidJob.isAlive(asset, AssetMonitorJob.code, sync, false, wsServer);
                    break;
                case MacosJob.os:
                    MacosJob.isAlive(asset, AssetMonitorJob.code, sync, false, wsServer);
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