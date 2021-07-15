'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_john_wordlist
class DebianJohnTheRipperWordlist extends LinuxModule
{
    // ************************************************************
    //  JtR module
    // ************************************************************
    // wordlist    :   wordlist to be used
    // passfile    :   file to be cracked
    // operation   :   [start/stop]
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_john_wordlist", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.wordlist = context.wordlist;
        this.passfile = context.passfile;
        this.operation = context.operation;


        //  Local fields
        // ******************************
        this.wordlist_path = this.envDataDir + "/" + this.wordlist;
        this.passfile_path = this.envDataDir + "/" + this.passfile;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install john psmisc -y";

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
                task = "sudo /usr/sbin/john -wordlist:" + this.wordlist_path + " " + this.passfile_path;
            } 
            else 
            {
                task = "sudo killall -9 john";
            }

            // Retrieve files required for JtR execution in sync mode
            // ******************************
            //this.syncAsset();
            this.pullFileFromShare(this.wordlist);
            this.pullFileFromShare(this.passfile);

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
        if (((this.wordlist) && Validator.validateName(this.wordlist)) &&
            ((this.passfile) && Validator.validateName(this.passfile)) &&
            ((this.operation.toUpperCase() == "START") || (this.operation.toUpperCase() == "STOP")))
        {
            return true;
        }

        return false;
    }
}

module.exports = DebianJohnTheRipperWordlist