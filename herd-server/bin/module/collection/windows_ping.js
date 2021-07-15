'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: windows_ping
class WindowsPing extends WindowsModule
{
    // ************************************************************
    //  Ping module
    // ************************************************************
    // target   :   IP address or FQDN to ping
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_ping", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            // Dump file test command
            //let task = "ping " + this.target + " >> " + this.envDataDir + "\\demo.txt";
            let task = "ping " + this.target;

            //  Async execution
            // ******************************
            // Dump file test command
            //this.do(task, "cmd_res", false, whatIf, { active: true, file: "demo.txt" });
            this.do(task, "cmd_res", false, whatIf);

            // Pull file test command
            //this.pullFileFromShare("1/2/2.1.txt");

            // Sync share test command
            //this.syncShare(true);

            // Sync asset test command
            //this.syncAsset(true);
        }
        else
        {
            this.reportAndExit("Invalid input provided");
        }
    }

    validate()
    {
        if ((this.target) && Validator.validateHost(this.target))
        {
            return true;
        }
        return false;
    }
}

module.exports = WindowsPing