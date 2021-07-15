'use strict';

const Model = require('../../controllers/rdhd-ctr-model_controller');
const Validator = require('../lib/rdhd-lib-input_validator');
const Job = require('./base/rdhd-job-base_job');

// jobCode: "process_killer"
class ProcessKillerJob
{
    static get code() { return "process_killer"; }

    static run(asset, moduleName, sync = false, wsServer = 'http://127.0.0.1:3001')
    {
        if ((moduleName) && (this.validate(moduleName)))
        {
            let model = new Model();
            let moduleBinary = model.getModuleByName(moduleName).binary;

            if (sync)
            {
                //  Sync execution
                // ******************************
                Job.do(asset, ProcessKillerJob.code, "sudo killall -9 " + moduleBinary, true, false, wsServer);
            }
            else
            {
                //  Async execution
                // ******************************
                Job.do(asset, ProcessKillerJob.code, "sudo killall -9 " + moduleBinary, false, false, wsServer);
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