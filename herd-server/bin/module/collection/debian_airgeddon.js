'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_airgeddon
class DebianAirgeddon extends LinuxModule
{
    // ************************************************************
    //  Airgeddon module
    // ************************************************************
    // https://github.com/wifiphisher/wifiphisher
    // https://en.kali.tools/?p=90
    //
    // operation       :   [start/stop]
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_airgeddon", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.auth = { username: context.username, password: context.password };
        this.operation = context.operation;

        //  Local fields
        // ******************************
        this.url = "https://127.0.0.1:3000/api/assets/" + this.asset.id + "/service" + this.urlReadyToken;
    }

    configure(whatIf = false)
    {
        let task = "sudo apt update; \
                    sudo apt install git iw aircrack-ng tmux -y && \
                    sudo rm -rf airgeddon && \
                    git clone --depth 1 https://github.com/v1s1t0r1sh3r3/airgeddon.git && \
                    cd airgeddon && \
                    sudo sed -i 's/AIRGEDDON_WINDOWS_HANDLING=xterm/AIRGEDDON_WINDOWS_HANDLING=tmux/g' .airgeddonrc";

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
                let task = "cd airgeddon && sudo /bin/bash airgeddon.sh";
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
        if ((this.operation.toUpperCase() == "START") || (this.operation.toUpperCase() == "STOP"))
        {
            result = true;
        }
        return result;
    }
}

module.exports = DebianAirgeddon
