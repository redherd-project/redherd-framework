'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: windows_push_file_to_ftp
class WindowsPushFileToFtp extends WindowsModule
{
    // ************************************************************
    //  PushFileToFtp module
    // ************************************************************
    // file     :   file to push
    //
    //  NOTE: this module works from the the asset "$REDHERD_DATA"
    //        dir to the FTP root dir.
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_push_file_to_ftp", session, wsServer, token);

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
            this.pushFileToShare(this.file, false, this.deleteFromSource);
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

module.exports = WindowsPushFileToFtp