'use strict';

const Shell = require('../../lib/rdhd-lib-web_socket_shell');
const FSMFPUtils = require('../../../proto/rdhd-prt-fsmfp_utils');
const Config = require('../../../config');

class Job
{
    //  Job execution function:
    // ******************************
    static do(asset, code, task, sync = false, whatIf = false, wsServer = 'http://127.0.0.1:3001')
    {
        // Create shell object istance
        let sh = new Shell('ssh', ['-i', Config.private_key, asset.user + '@' + asset.ip, '-p', asset.wport, task], FSMFPUtils.getSpecializedLv2Message(asset.id, code), wsServer);
  
        //  RedHerd Flexible Message Formatting Protocol compliant JSON envelopes:
        if (sync)
        {
            //  Sync execution
            // ******************************
            sh.executeSync(whatIf);
        }
        else
        {
            //  Async execution
            // ******************************
            sh.executeAsync(whatIf, false);
        }
    }
    // ******************************
}

module.exports = Job
