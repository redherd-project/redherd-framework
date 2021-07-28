'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_dirb
class DebianDirb extends LinuxModule
{
    // ************************************************************
    //  Dirb module
    // ************************************************************
    // url          :   http(s):// + single IP (a.b.c.d) or FQDN to scan
    // port         :   port exposing the webserver
    // wordlist     :   small, common, big
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_dirb", session, wsServer, token);

        //  POST parameters
        // ************************************************************
        this.url = context.url;
        this.port = context.port;
        this.wordlist = context.wordlist;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install dirb -y";

        //  Async execution
        // ************************************************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "sudo dirb " + this.url + ":" + this.port + " /usr/share/dirb/wordlists/" + this.wordlist + ".txt";

            //  Async execution
            // ************************************************************
            this.do(task, "cmd_res", false, whatIf);
        }
        else
        {
            this.reportAndExit(this.buildErrorMessage("Invalid input provided"));
        }
    }

    validate()
    {
        if ((this.url) && Validator.validateURL(this.url) && (this.port) && Validator.validateTcpUdpPort(this.port) && (this.wordlist))
        {
            return true;
        }
        return false;
    }
}

module.exports = DebianDirb
