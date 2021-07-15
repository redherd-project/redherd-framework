'use strict';

const Job = require('./base/rdhd-job-base_job');

// jobCode: "keep_alive"
class AssetMonitorJob
{
    static get code() { return "keep_alive"; }

    static run(asset, sync = false, wsServer = 'http://127.0.0.1:3001')
    {
        if (sync)
        {
            //  Sync execution
            // ******************************
            Job.do(asset, AssetMonitorJob.code, "hostname", true, false, wsServer);
        }
        else
        {
            //  Async execution
            // ******************************
            Job.do(asset, AssetMonitorJob.code, "hostname", false, false, wsServer);
        }
    }
}

module.exports = AssetMonitorJob