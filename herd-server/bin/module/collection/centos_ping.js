'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: centos_ping
class CentOSPing extends LinuxModule
{
    // ************************************************************
    //  Ping module
    // ************************************************************
    // target   :   IP address or FQDN to ping
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "centos_ping", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
    }

    configure(whatIf = false)
    {
        let task = "sudo yum makecache; sudo yum install iputils -y";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "ping " + this.target + " -c 4";

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

module.exports = CentOSPing
