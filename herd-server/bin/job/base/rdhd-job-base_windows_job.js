'use strict';

const Job = require('./rdhd-job-base_job');

const WindowsKillMode = {
	STOPPROCESS: "STOPPROCESS",
	WMIC: "WMIC",
	TASKKILL: "TASKKILL"
}

class WindowsJob
{
    static get os() { return "WINDOWS"; }

    static do(asset, code, task, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001')
    {
        Job.do(asset, code, task, sync, whatIf, wsServer);
    }
    // ******************************

    static killAll(asset, code, binary, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001', killMode = WindowsKillMode.WMIC)
    {
        let task = "";
        switch (killMode.toUpperCase())
        {
            case WindowsKillMode.STOPPROCESS:
                task = "Stop-Process -Name \"" + binary + "\" -Force";
                break;
            case WindowsKillMode.TASKKILL:
                task = "taskkill /IM \"" + binary + "\" /F";
                break;
            case WindowsKillMode.WMIC:
            default:
                task = "wmic process where \"commandline like '%" + binary + "%'\" call terminate";
                break;
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
