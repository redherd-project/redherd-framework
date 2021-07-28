'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');

// moduleCode: windows_download_file
class WindowsDownloadFile extends WindowsModule
{
    // ************************************************************
    //  DownloadFile module
    // ************************************************************
    // url      :   URL for file download
    // filename :   Filename to save downloaded file
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_download_file", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.url = context.url;
        this.filename = context.filename;
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "wget " + this.url + " -outfile \"" + this.envDataDir + "\\" + this.filename + "\"";

            //  Sync execution
            // ******************************
            this.do(task, "cmd_res", true, whatIf);

            // Push file to share
            this.pushFileToShare(this.filename);
        }
        else
        {
            this.reportAndExit(this.buildErrorMessage("Invalid input provided"));
        }
    }

    validate()
    {
        if (((this.url) && Validator.validateURL(this.url)) && 
            ((this.filename) && Validator.validateFileName(this.filename)))
        {
            return true;
        }
        return false;
    }
}

module.exports = WindowsDownloadFile