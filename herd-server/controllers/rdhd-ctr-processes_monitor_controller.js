'use strict';

const ProcessMonitor = require('../bin/job/rdhd-job-process_monitor');

class ProcessesMonitorController
{
    static start(msgServer)
    {
        let result = true;
        try
        {
            ProcessMonitor.run(msgServer);
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }
}

module.exports = ProcessesMonitorController;