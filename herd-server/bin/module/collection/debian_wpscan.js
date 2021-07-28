'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_wpscan
class DebianWPScan extends LinuxModule
{
    // ************************************************************
    //  WPScan module
    // ************************************************************
    // url         :   http(s):// + single IP (a.b.c.d) or FQDN to scan 
    // port        :   port exposing the wordpress server
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_wpscan", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.url = context.url;
        this.port = context.port;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; \
                    sudo apt install curl git libcurl4-openssl-dev make zlib1g-dev gawk g++ gcc libreadline6-dev libssl-dev libyaml-dev libsqlite3-dev sqlite3 autoconf -y && \
                    sudo apt install libgdbm-dev libncurses5-dev automake libtool bison pkg-config ruby ruby-bundler ruby-dev -y && \
                    sudo gem uninstall wpscan && \
                    sudo gem install wpscan";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "wpscan --url " + this.url + ":" + this.port + " --enumerate p";

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
        if ((this.url) && (Validator.validateURL(this.url)) && 
            (this.port) && (Validator.validateTcpUdpPort(this.port)))
        {
            return true;
        }
        return false;
    }
}

module.exports = DebianWPScan