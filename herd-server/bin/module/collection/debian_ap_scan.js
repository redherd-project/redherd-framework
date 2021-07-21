'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_ap_scan
class DebianAPScan extends LinuxModule
{
    // ************************************************************
    //  APScan module
    // ************************************************************
    // interface   :   interface for Access Point scanning
    // operation   :   [start/stop]
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_ap_scan", session, wsServer, token);
        
        //  POST parameters
        // ******************************
        this.interface = context.interface;
        this.operation = context.operation;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install aircrack-ng psmisc -y";

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
                task = 'sudo rm -rf /tmp/ap_scan-01.csv; sudo airodump-ng -w /tmp/ap_scan --output-format csv ' + this.interface + ' &>/dev/null &';
            } 
            else 
            {
                task = "sudo killall -9 airodump-ng;sleep 3;cat /tmp/ap_scan-01.csv";
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
        if ((this.interface) && Validator.validateName(this.interface) && ((this.operation.toUpperCase() == "START") || (this.operation.toUpperCase() == "STOP")))
        {
            return true;
        }
        return false;
    }
}

module.exports = DebianAPScan