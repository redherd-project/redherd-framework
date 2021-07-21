'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: windows_traceroute
class WindowsTraceroute extends WindowsModule
{
    // ************************************************************
    //  Traceroute module
    // ************************************************************
    // target      :   IP address or FQDN for tracerouting
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_traceroute", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
    }

    configure(whatIf = false)
    {
        /*
        let task = "";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
        */
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "tracert " + this.target;

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

module.exports = WindowsTraceroute