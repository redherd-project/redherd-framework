'use strict';

const UnixJob = require('./rdhd-job-base_unix_job');

class LinuxJob
{
    static get os() { return "DEBIAN"; }

    static do(asset, code, task, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001')
    {  
        UnixJob.do(asset, code, task, sync, whatIf, wsServer);
    }
    // ******************************
}

module.exports = LinuxJob
