'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_theharvester
class DebianTheHarvester extends LinuxModule
{
    // ************************************************************
    //  theHarvester module
    // ************************************************************
    // domain      :   Domain to search or company name
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_theharvester", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.domain = context.domain;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; \
                    sudo apt install python3 python3-pip -y && \
                    sudo rm -rf theHarvester && \
                    git clone https://github.com/laramies/theHarvester && \
                    cd theHarvester && \
                    sudo python3 -m pip install -r requirements/base.txt"

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "cd theHarvester && python3 theHarvester.py -b all -d " + this.domain;

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
        if ((this.domain) && ((Validator.validateName(this.domain) || Validator.validateHostname(this.domain))))
        {
            return true;
        }
        return false;
    }
}

module.exports = DebianTheHarvester
