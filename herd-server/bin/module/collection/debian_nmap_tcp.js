'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_nmap_tcp
class DebianNmapTCP extends LinuxModule
{
    // ************************************************************
    //  NmapTCP module
    // ************************************************************
    // target      :   single IP (a.b.c.d), IP range (a.b.c.d-e), 
    //                 CIDR (a.b.c.d/f) or FQDN to scan 
    // ports       :   port subset (a-b,c,d,e-f) to scan
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_nmap_tcp", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
        this.ports = context.ports;
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
            let task = "sudo nmap -Pn -p" + this.ports + " " + this.target;

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
        if (((this.target) && (Validator.validateHost(this.target) || Validator.validateIp(this.target) || Validator.validateCIDR(this.target) || Validator.validateIpRange(this.target))) && 
            ((this.ports) && (Validator.validateTcpUdpPortSubset(this.ports))))
        {
            return true;
        }
        return false;
    }
}

module.exports = DebianNmapTCP
