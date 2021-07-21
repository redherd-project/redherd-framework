'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_sync_asset_files
class DebianSyncAssetFiles extends LinuxModule
{
    // ************************************************************
    //  SyncAssetFiles module
    // ************************************************************
    //  NOTE: this module works from the FTP root dir to the asset
    //        "$REDHERD_DATA" dir.
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_sync_asset_files", session, wsServer, token);

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
            this.syncAsset(false, this.deleteFromSource);
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

module.exports = DebianSyncAssetFiles