'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_nc_listener
class DebianNetcat extends LinuxModule
{
    // ************************************************************
    //  Netcat module NON FUNZIONA
    // ************************************************************
    //
    // operation       :   [start/stop]
    // Port            :   TCP/UDP port
    // Protocol        :   TCP/UDP protocol
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_nc_listener", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.auth = { username: context.username, password: context.password };
        this.port = context.port;
        this.protocol = context.protocol;
        this.operation = context.operation;

        //  Local fields
        // ******************************
        this.url = "https://127.0.0.1:3000/api/assets/" + this.asset.id + "/service" + this.urlReadyToken;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; sudo apt install -y netcat";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    interact(whatIf = false)
    {
        let axios = require('axios');
        let https = require("https");
        let deasync = require('deasync');
        let response = false;

        if (this.validate())
        {
            let agent = new https.Agent({ rejectUnauthorized: false });
            let op;

            if (this.operation.toUpperCase() == "START")
            {
                let task;
                
                if (this.protocol.toUpperCase() == "TCP")
                {
                    task = "sudo nc -lnv " + this.port;
                }
                else
                {
                    task = "sudo nc -lnvu " + this.port;
                }

                op = "enable";

                axios.post(this.url,
                { 
                    operation: op,
                    service: {
                        type: 'TERMINAL',
                        params: {
                            command: task
                        }
                    }
                },
                {
                    httpsAgent: agent,
                    auth: this.auth
                })
                .then((res) => {
                    response = res.data.data.service;
                })
                .catch((err) => {
                    response = err.message;
                });
                deasync.loopWhile(() => !response);
            }
            else
            {
                op = "disable";

                axios.post(this.url,
                { 
                    operation: op,
                    service: {
                        type: 'TERMINAL'
                    }
                },
                {
                    httpsAgent: agent,
                    auth: this.auth
                })
                .then((res) => {
                    response = res.data.data.service;
                })
                .catch((err) => {
                    response = err.message;
                });
                deasync.loopWhile(() => !response);

                this.reportAndExit(this.buildInfoMessage("Operation started"));
            }
        }
        else
        {
            this.reportAndExit(this.buildErrorMessage("Invalid input provided"));
        }
        return response;
    }

    validate()
    {
        let result = false;
        if (((this.operation.toUpperCase() == "START") &&
             (this.port) && Validator.validateTcpUdpPort(this.port) &&
             (this.protocol) && ((this.protocol.toUpperCase() == "TCP") || (this.protocol.toUpperCase() == "UDP"))) ||
            (this.operation.toUpperCase() == "STOP"))
        {
            result = true;
        }
        return result;
    }
}

module.exports = DebianNetcat