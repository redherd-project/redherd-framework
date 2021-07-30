'use strict';

const UnixJob = require('./rdhd-job-base_unix_job');

class DebianJob
{
    static get os() { return "DEBIAN"; }

    static do(asset, code, task, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001')
    {  
        UnixJob.do(asset, code, task, sync, whatIf, wsServer);
    }
    // ******************************

    static killAll(asset, code, binary, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001')
    {
        UnixJob.killAll(asset, code, binary, sync, whatIf, wsServer);
    }
    // ******************************

    static isAlive(asset, code, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001')
    {
        UnixJob.isAlive(asset, code, sync, whatIf, wsServer);
    }
    // ******************************
}

module.exports = DebianJob
