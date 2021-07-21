'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_wifiphisher
class DebianWifiPhisher extends LinuxModule
{
    // ************************************************************
    //  WifiPhisher module
    // ************************************************************
    // https://github.com/wifiphisher/wifiphisher
    // https://en.kali.tools/?p=90
    //
    // password        :   Basic auth password
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_wifiphisher", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.auth = { username: context.username, password: context.password };
        this.operation = context.operation;

        //  Local fields
        // ******************************
        this.url = "https://127.0.0.1:3000/api/assets/" + this.asset.id + "/service"  + this.urlReadyToken;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; \
                    sudo apt install git python3 -y && \
                    sudo apt install libnl-3-dev libnl-genl-3-dev libssl-dev -y && \
                    sudo rm -rf wifiphisher && \
                    git clone https://github.com/wifiphisher/wifiphisher.git && \
                    cd wifiphisher && \
                    sudo python3 setup.py install";

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
                let task = "sudo wifiphisher";
                op = "enable";

                axios.post(this.url,
                { 
                    operation: 'enable',
                    service: {
                        type: "TERMINAL",
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

                this.reportAndExit(this.buildInfoMessage("Operation Completed"));
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
        if ((this.operation.toUpperCase() == "START") || (this.operation.toUpperCase() == "STOP"))
        {
            result = true;
        }
        return result;
    }
}

module.exports = DebianWifiPhisher
