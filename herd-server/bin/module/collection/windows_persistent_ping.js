'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: windows_persistent_ping
class WindowsPersistentPing extends WindowsModule
{
    // ************************************************************
    //  Ping module
    // ************************************************************
    // target   :   IP address or FQDN to ping
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_persistent_ping", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "ping " + this.target + " /t";

            //  Async execution
            // ******************************
            this.do(task, "cmd_res", false, whatIf);
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

module.exports = WindowsPersistentPing