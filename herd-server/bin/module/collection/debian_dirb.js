'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_dirb
class DebianDirb extends LinuxModule
{
    // ************************************************************
    //  Dirb module
    // ************************************************************
    // target      :   single IP (a.b.c.d) or FQDN to scan 
    // wordlist    :   small, common, big
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_dirb", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
        this.wordlist = context.wordlist;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install dirb -y";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "sudo dirb " + this.target + " /usr/share/dirb/wordlists/" + this.wordlist + ".txt";

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
        if (this.target && this.wordlist)
        {
            return true;
        }
        return false;
    }
}

module.exports = DebianDirb