'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: android_ping
class AndroidPing extends LinuxModule
{
    // ************************************************************
    //  AndroidPing module
    // ************************************************************
    // target   :   IP address or FQDN to ping
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "android_ping", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "ping -c 4 " + this.target;
            //let task = "ping " + this.target;

            //  Async execution
            // ******************************
            this.do(task, "cmd_res", false, whatIf);
        }
        else
        {
            this.reportAndExit(this.buildErrorMessage("Invalid input provided"));
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

module.exports = AndroidPing