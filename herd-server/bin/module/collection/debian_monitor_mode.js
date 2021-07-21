'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_monitor_mode
class DebianMonitorMode extends LinuxModule
{
    // ************************************************************
    //  MonitorMode module
    // ************************************************************
    // interface   :   interface to put in monitor mode
    // operation   :   [start/stop]
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_monitor_mode", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.interface = context.interface;
        this.operation = context.operation;
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
        if (this.validate())
        {
            let task;

            if (this.operation.toUpperCase() == "ENABLE")
            {
                task = "sudo airmon-ng start " + this.interface;
            } 
            else 
            {
                task = "sudo airmon-ng stop " + this.interface;
            }
            
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
        if ((this.interface) && Validator.validateName(this.interface) &&
            ((this.operation.toUpperCase() == "ENABLE") || (this.operation.toUpperCase() == "DISABLE")))
        {
            return true;
        }
        return false;
    }
}

module.exports = DebianMonitorMode