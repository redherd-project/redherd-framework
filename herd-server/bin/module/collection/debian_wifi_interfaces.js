'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_wifi_interfaces
class DebianWiFiInterfaces extends LinuxModule
{
    // ************************************************************
    //  WiFiInterfaces module
    // ************************************************************
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_wifi_interfaces", session, wsServer, token);
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install aircrack-ng -y";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        let task = "sudo airmon-ng | tail -n +4 | head -n -1";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }
}

module.exports = DebianWiFiInterfaces