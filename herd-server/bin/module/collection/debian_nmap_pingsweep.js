'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_nmap_pingsweep
class DebianNmapPingSweep extends LinuxModule
{
    // ************************************************************
    //  NmapPingSweep module
    // ************************************************************
    // target      :   IP range (a.b.c.d-e) or CIDR (a.b.c.d/f) to scan 
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_nmap_pingsweep", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install nmap -y";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "sudo nmap -sn " + this.target;

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
        if ((this.target) && (Validator.validateHost(this.target) || Validator.validateCIDR(this.target) || Validator.validateIpRange(this.target)))
        {
            return true;
        }
        return false;
    }
}

module.exports = DebianNmapPingSweep
