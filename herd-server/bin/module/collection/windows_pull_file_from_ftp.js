'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: windows_pull_file_from_ftp
class WindowsPullFileFromFtp extends WindowsModule
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
        super(asset, "windows_pull_file_from_ftp", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.file = context.file;

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
            this.pullFileFromShare(this.file, false, this.deleteFromSource);
        }
        else
        {
            this.reportAndExit(this.buildErrorMessage("Invalid input provided"));
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

module.exports = WindowsPullFileFromFtp