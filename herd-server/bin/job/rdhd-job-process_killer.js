'use strict';

const Model = require('../../controllers/rdhd-ctr-model_controller');
const Validator = require('../lib/rdhd-lib-input_validator');
const DebianJob = require('./base/rdhd-job-base_debian_job');
const WindowsJob = require('./base/rdhd-job-base_windows_job');
const AndroidJob = require('./base/rdhd-job-base_android_job');
const MacosJob = require('./base/rdhd-job-base_macos_job');

// jobCode: "process_killer"
class ProcessKillerJob
{
    static get code() { return "process_killer"; }

    static run(asset, moduleName, sync = false, wsServer = 'http://127.0.0.1:3001')
    {
        if ((moduleName) && (this.validate(moduleName)))
        {
            try
            {
                let model = new Model();
                let moduleBinary = model.getModuleByName(moduleName).binary;
                let assetType = model.getTypeByAssetId(asset.id).name;

                switch(assetType.toUpperCase())
                {
                    case DebianJob.os:
                        DebianJob.killAll(asset, ProcessKillerJob.code, moduleBinary, sync, false, wsServer);
                        break;
                    case WindowsJob.os:
                        WindowsJob.killAll(asset, ProcessKillerJob.code, moduleBinary, sync, false, wsServer);
                        break;
                    case AndroidJob.os:
                        AndroidJob.killAll(asset, ProcessKillerJob.code, moduleBinary, sync, false, wsServer);
                        break;
                    case MacosJob.os:
                        MacosJob.killAll(asset, ProcessKillerJob.code, moduleBinary, sync, false, wsServer);
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

    static validate(moduleName)
    {
        if (Validator.validateName(moduleName))
        {
            return true;
        }
        return false;
    }
}

module.exports = ProcessKillerJob