'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');
//const Validator = require('../../lib/rdhd-lib-input_validator');

// moduleCode: debian_hydra
class DebianHydra extends LinuxModule
{
    // ************************************************************
    //  Hydra module
    // ************************************************************
    // target      :   single IP (a.b.c.d) or FQDN to scan 
    // port        :   port exposing the wordpress server
    // protocol    :   chose from ftp/rdp/ssh
    // userList    :   path of user wordlist
    // passList    :   path of password wordlist
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_hydra", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
        this.port = context.port;
        this.protocol = context.protocol;
        this.userList = context.userList;
        this.passList = context.passList;
        this.operation = context.operation;


        //  Local fields
        // ******************************
        this.userList_path = this.envDataDir + "/" + this.userList;
        this.passList_path = this.envDataDir + "/" + this.passList;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; \
                    sudo apt install hydra -y";

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
                this.pullFileFromShare(this.userList, true);
                this.pullFileFromShare(this.passList, true);

                task = "sudo hydra -s " + this.port + " -L " + this.userList_path + " -P " + this.passList_path + " " + this.target + " -t 4 " + this.protocol;
            } 
            else 
            {
                task = "sudo killall -9 hydra";
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
        if ((this.target) && Validator.validateHost(this.target) && 
            (this.port) && Validator.validateTcpUdpPort(this.port) &&
            ((this.protocol.toUpperCase() == "FTP") || (this.protocol.toUpperCase() == "SSH") || (this.protocol.toUpperCase() == "RDP")) &&
            (this.userList) && Validator.validateFileName(this.userList) &&
            (this.passList) && Validator.validateFileName(this.passList) &&
            ((this.operation.toUpperCase() == "START") || (this.operation.toUpperCase() == "STOP")))
        {
            return true;
        }
        return false;
    }
}

module.exports = DebianHydra
