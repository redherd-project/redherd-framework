'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_interfaces
class DebianInterfaces extends LinuxModule
{
    // ************************************************************
    //  Interfaces module
    // ************************************************************
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_interfaces", session, wsServer, token);
    }

    run(whatIf = false)
    {
        let task = "sudo echo \"- IPv4\";/sbin/ip -4 -o a | cut -d ' ' -f 2,7 | cut -d '/' -f 1 | tr -s \" \" \"\t\"; echo \"- IPv6\";/sbin/ip -6 -o a | cut -d ' ' -f 2,7 | cut -d '/' -f 1 | tr -s \" \" \"\t\"";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }
}

module.exports = DebianInterfaces