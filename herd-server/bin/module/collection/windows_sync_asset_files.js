'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');

// moduleCode: windows_sync_asset_files
class WindowsSyncAssetFiles extends WindowsModule
{
    // ************************************************************
    //  SyncAssetFiles module
    // ************************************************************
    //  NOTE: this module works from the FTP root dir to the asset
    //        "$REDHERD_DATA" dir.
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_sync_asset_files", session, wsServer, token);

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
            this.syncAsset(false, this.deleteFromSource);
        }
        else
        {
            this.reportAndExit("Invalid input provided");
        }
    }

    validate()
    {
        return true;
    }
}

module.exports = WindowsSyncAssetFiles