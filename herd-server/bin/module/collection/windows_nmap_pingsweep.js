'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: windows_nmap_pingsweep
class WindowsNmapPingSweep extends WindowsModule
{
    // ************************************************************
    //  NmapPingSweep module
    // ************************************************************
    // target      :   IP range (a.b.c.d-e) or CIDR (a.b.c.d/f) to scan 
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_nmap_pingsweep", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
    }

    configure(whatIf = false)
    {
        let task = "choco install nmap -y --force";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "nmap -sn " + this.target;

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
        if ((this.target) && (Validator.validateHost(this.target) || Validator.validateCIDR(this.target) || Validator.validateIpRange(this.target)))
        {
            return true;
        }
        return false;
    }
}

module.exports = WindowsNmapPingSweep
