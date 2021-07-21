'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_tcpdump_interface
class DebianTcpdumpInterface extends LinuxModule
{
    // ************************************************************
    //  TCPDump module
    // ************************************************************
    // https://hackertarget.com/tcpdump-examples/
    //
    // interface   :   interface for packet sniffing
    // dump        :   output to file [true/false]
    // operation   :   [start/stop]
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_tcpdump_interface", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.interface = context.interface;
        this.dump = context.dump;
        this.operation = context.operation;
        // this.interval = context.interval;

        //  Local fields
        // ******************************
        this.output = this.envDataDir + "/" + session + ".pcap";
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install tcpdump psmisc -y";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            //  Workaround usable to run tcpdump for a given time interval
            //  -G <secs>
            //  -W 1
            // ******************************
            // let task = "sudo tcpdump -i " + this.interface + " -G " + this.interval + " -W 1 ";

            let task;
            let dump = (this.dump.toUpperCase() == "TRUE") ? { active: true, file: this.output } : { active: false };

            if (this.operation.toUpperCase() == "START")
            {
                task = "sudo tcpdump -i " + this.interface;

                if (dump.active)
                {
                    task += " -w " + this.output;
                }

                //  Async execution
                // ******************************
                this.do(task, "cmd_res", false, whatIf);
            } 
            else 
            {
                task = "sudo killall -9 tcpdump";

                //  Async execution
                // ******************************
                this.do(task, "cmd_res", false, whatIf);

                //  Sync Ftp share service in order to upload the pcap file
                // ******************************
                this.syncShare();
            }
            
        }
        else
        {
            this.reportAndExit(this.buildErrorMessage("Invalid input provided"));
        }
    }

    validate()
    {
        if (((this.interface) && Validator.validateName(this.interface)) &&
            (Validator.validateBool(this.dump)) &&
            ((this.operation.toUpperCase() == "START") || (this.operation.toUpperCase() == "STOP")))
        {
            return true;
        }

        return false;
    }
}

module.exports = DebianTcpdumpInterface
