'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_sync_ftp_files
class DebianSyncFtpFiles extends LinuxModule
{
    // ************************************************************
    //  SyncFtpFiles module
    // ************************************************************
    //  NOTE: this module works from the the asset "$REDHERD_DATA"
    //        dir to the FTP root dir.
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_sync_ftp_files", session, wsServer, token);

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
            this.syncShare(false, this.deleteFromSource);
        }
        else
        {
            this.reportAndExit(this.buildErrorMessage("Invalid input provided"));
        }
    }

    validate()
    {
        return true;
    }
}

module.exports = DebianSyncFtpFiles