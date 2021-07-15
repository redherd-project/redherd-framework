'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_ping
class DebianPing extends LinuxModule
{
    // ************************************************************
    //  Ping module
    // ************************************************************
    // target   :   IP address or FQDN to ping
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_ping", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install iputils-ping -y";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "ping " + this.target + " -c 4";

            // Command STDOUT dump example
            //let task = "ping " + this.target + " -c 4 >> " + this.envDataDir + "/ping.txt";

            // Infinite command example
            //let task = "ping " + this.target;

            //  Async execution
            // ******************************
            this.do(task, "cmd_res", false, whatIf);

            // Command dumped STDOUT synced with an ftp server
            //this.do(task, "cmd_res", false, whatIf, { active: true, file: "ping.txt" });
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

module.exports = DebianPing