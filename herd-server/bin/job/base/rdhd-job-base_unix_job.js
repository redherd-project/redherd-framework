'use strict';

const Job = require('./rdhd-job-base_job');

const UnixKillMode = {
	PKILL: "PKILL",
	KILLALL: "KILLALL"
}

class UnixJob
{
    static get os() { return "UNIX"; }

    static do(asset, code, task, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001')
    {  
        Job.do(asset, code, task, sync, whatIf, wsServer);
    }
    // ******************************

    static killAll(asset, code, binary, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001', killMode = UnixKillMode.PKILL)
    {
        let task = "";
        switch (killMode.toUpperCase())
        {
            case UnixKillMode.KILLALL:
                task = "sudo killall -9 " + binary;
                break;
            case UnixKillMode.PKILL:
            default:
                task = "sudo pkill -9 " + binary;
                break;
        }
        UnixJob.do(asset, code, task, sync, whatIf, wsServer);
    }
    // ******************************

    static isAlive(asset, code, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001')
    {
        let task = "hostname";

        UnixJob.do(asset, code, task, sync, whatIf, wsServer);
    }
    // ******************************
}

module.exports = UnixJob