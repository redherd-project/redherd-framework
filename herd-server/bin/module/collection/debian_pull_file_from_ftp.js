'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_pull_file_from_ftp
class DebianPullFileFromFtp extends LinuxModule
{
    // ************************************************************
    //  PullFileFromFtp module
    // ************************************************************
    // file     :   file to pull
    //
    //  NOTE: this module works from the FTP root dir to the asset
    //        "$REDHERD_DATA" dir.
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_pull_file_from_ftp", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.file = context.file;

        //  Local parameters
        // ******************************
        this.deleteFromSource = false;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install lftp -y";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run()
    {
        if (this.validate())
        {
            this.pullFileFromShare(this.file, false, this.deleteFromSource);
        }
        else
        {
            this.reportAndExit("Invalid input provided");
        }
    }

    validate()
    {
        if (Validator.validateFileName(this.file))
        {
            return true;
        }
        return false;
    }
}

module.exports = DebianPullFileFromFtp