'use strict';

global.Validator = require('../../lib/rdhd-lib-input_validator');
global.Config = require('../../../config');

const Messenger = require('../../lib/rdhd-lib-web_socket_message');
const Shell = require('../../lib/rdhd-lib-web_socket_shell');
const FSMFPUtils = require('../../../proto/rdhd-prt-fsmfp_utils');

class Module
{
    constructor(asset, moduleCode, session = "0", wsServer = 'http://127.0.0.1:3001', token = '')
    {
        this.token = token;
        this.urlReadyToken = this.token ? "?t=" + this.token : '';
        this.asset = asset;
        this.moduleCode = moduleCode;
        this.session = session;
        this.wsServer = wsServer;

        //  Message colors:
        // ******************************    
        this.info_color = '\u001b[34m';
        this.warn_color = '\u001b[33m';
        this.error_color = '\u001b[31m';
        this.bold_format = '\u001b[1m';
        this.reset_format = '\u001b[0m';
    }

    //  Task execution function:
    // ******************************
    do(task, type = 'gen_res', sync = false, whatIf = false, doPush = { active: false })
    {
        if (Validator.validateLinuxPath(Config.private_key))
        {
            // Check if the current task requires ftp share sync
            //let tk = doPush.active ? task + ' && ' + this.buildPushMirrorCommand : task;
            let tk = doPush.active ? task + ';' + this.buildPushFileCommand(doPush.file) : task;
            //let tk = task;

            // Create shell object istance
            let sh = new Shell('ssh', ['-i', Config.private_key, this.asset.user + '@' + this.asset.ip, '-p', this.asset.wport, tk], FSMFPUtils.getSpecializedLv2Message(this.asset.id, this.moduleCode, this.session, type), this.wsServer);

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
                sh.executeAsync(whatIf);
            }
        }
    }

    report(message)
    {
        //  Generate a simple message on the output channel
        // ******************************
        let msg = new Messenger(message, FSMFPUtils.getSpecializedLv2Message(this.asset.id, this.moduleCode, this.session), this.wsServer);
        msg.send();
    }

    reportAndExit(message)
    {
        //  Generate a simple message on the output channel
        // ******************************
        let msg = new Messenger(message, FSMFPUtils.getSpecializedLv2Message(this.asset.id, this.moduleCode, this.session), this.wsServer);
        msg.sendAndFinalize();
    }

    syncShare(sync = true, del = false)
    {
        // Push files to Ftp server in sync mode
        //
        //  NOTE: the "sync" parameter set to "true" executes the task(s) in synchronous mode
        //  NOTE: the "del" parameter set to "true" removes the file(s) from the source
        // ******************************
        this.do(this.buildPushMirrorCommand(del), "syn_res", sync);
    }

    syncAsset(sync = true, del = false)
    {
        // Retrieve files from Ftp server in sync mode
        //
        //  NOTE: the "sync" parameter set to "true" executes the task(s) in synchronous mode
        //  NOTE: the "del" parameter set to "true" removes the file(s) from the source
        // ******************************
        this.do(this.buildPullMirrorCommand(del), "syn_res", sync);
    }

    pullFileFromShare(file, sync = true, del = false)
    {
        //  Retrieve a file from the Ftp server in sync mode
        //
        //  NOTE: the "del" parameter set to "true" removes the file(s) from the source
        // ******************************
        this.do(this.buildPullFileCommand(file, del), "syn_res", sync);
    }

    pushFileToShare(file, sync = true, del = false)
    {
        //  Push a file to the Ftp server in sync mode
        //
        //  NOTE: the "del" parameter set to "true" removes the file(s) from the source
        // ******************************
        this.do(this.buildPushFileCommand(file, del), "syn_res", sync);
    }

    buildPullMirrorCommand()
    {
        // Must be implemented in a derived class
        throw new Error("Not Implemented");
    }

    buildPushMirrorCommand()
    {
        // Must be implemented in a derived class
        throw new Error("Not Implemented");
    }

    buildPullFileCommand()
    {
        // Must be implemented in a derived class
        throw new Error("Not Implemented");
    }

    buildPushFileCommand()
    {
        // Must be implemented in a derived class
        throw new Error("Not Implemented");
    }

    buildInfoMessage(text)
    {
        let message = this.info_color + this.bold_format + '[?] Info: ' + this.reset_format + this.bold_format + text + this.reset_format;
        return message;
    }

    buildWarnMessage(text)
    {
        let message = this.warn_color + this.bold_format + '[!] Warn: ' + this.reset_format + this.bold_format + text + this.reset_format;
        return message;
    }

    buildErrorMessage(text)
    {
        let message = this.error_color + this.bold_format + '[x] Error: ' + this.reset_format + this.bold_format + text + this.reset_format;
        return message;
    }
}

module.exports = Module
