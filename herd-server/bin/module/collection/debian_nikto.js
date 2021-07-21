'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_nikto
class DebianNikto extends LinuxModule
{
    // ************************************************************
    //  Nikto module
    // ************************************************************
    // target      :   single IP (a.b.c.d) or FQDN to scan 
    // port        :   port exposing the webserver
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_nikto", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
        this.port = context.port;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install nikto -y";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "sudo nikto -port " + this.port + " -h " + this.target;

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
        if (((this.target) && (Validator.validateHost(this.target) || Validator.validateIp(this.target))) && 
            ((this.port) && (Validator.validateTcpUdpPort(this.port))))
        {
            return true;
        }
        return false;
    }
}

module.exports = DebianNikto