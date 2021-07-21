'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');

// moduleCode: windows_sync_ftp_files
class WindowsSyncFtpFiles extends WindowsModule
{
    // ************************************************************
    //  SyncFtpFiles module
    // ************************************************************
    //  NOTE: this module works from the the asset "$REDHERD_DATA"
    //        dir to the FTP root dir.
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_sync_ftp_files", session, wsServer, token);

        //  Local parameters
        // ******************************
        this.deleteFromSource = false;
    }

    configure(whatIf = false)
    {
        let task = "";

        //  Async execution
        // ******************************
        // this.do(task, "cmd_res", false, whatIf);
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

module.exports = WindowsSyncFtpFiles