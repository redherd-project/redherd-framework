'use strict';

const Job = require('./rdhd-job-base_job');

class WindowsJob
{
    static get os() { return "WINDOWS"; }

    static do(asset, code, task, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001')
    {
        Job.do(asset, code, task, sync, whatIf, wsServer);
    }
    // ******************************

    static killAllWithoutPS(asset, code, binary, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001')
    {
        WindowsJob.killAll(asset, code, binary, sync, whatIf, wsServer, false);
    }
    // ******************************

    static killAll(asset, code, binary, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001', usePS = true)
    {
        let task = "";
        if (usePS)
        {
            // Kill a process using a PowerShell cmd-let...
            task = "Stop-Process -Name \"" + binary + "\" -Force";
        }
        else
        {
            // ...or using a Windows cmd
            task = "taskkill /IM \"" + binary + "\" /F";
        }

        WindowsJob.do(asset, code, task, sync, whatIf, wsServer);
    }
    // ******************************

    static isAlive(asset, code, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001')
    {
        let task = "hostname";

        WindowsJob.do(asset, code, task, sync, whatIf, wsServer);
    }
    // ******************************
}

module.exports = WindowsJob