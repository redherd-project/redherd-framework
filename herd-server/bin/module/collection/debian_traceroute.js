'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_traceroute
class DebianTraceroute extends LinuxModule
{
    // ************************************************************
    //  Traceroute module
    // ************************************************************
    // target      :   IP address or FQDN for tracerouting
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_traceroute", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install traceroute -y";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "traceroute " + this.target;
            //let task = "traceroute " + this.target;

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

module.exports = DebianTraceroute