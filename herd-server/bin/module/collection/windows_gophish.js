'use strict';

const config = require('../../../config');
const WindowsModule = require('../base/rdhd-mod-base_windows_module');

// moduleCode: windows_gophish
class WindowsGophish extends WindowsModule
{
    // ************************************************************
    //  WindowsGophish module
    // ************************************************************
    //
    // operation       :   [start/stop]
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_gophish", session, wsServer, token);

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
        let task = "Write-Host '[Downloading Gophish...it may require some time...]'; \
                    wget https://github.com/gophish/gophish/releases/download/v0.11.0/gophish-v0.11.0-windows-64bit.zip -OutFile C:\\Users\\Public\\gophish.zip; \
                    cd C:\\Users\\Public; \
                    Expand-Archive gophish.zip -Force; \
                    cd gophish; \
                    ((Get-Content -path .\\config.json -Raw) -Replace '127.0.0.1','0.0.0.0') | Set-Content -Path .\\config.json; \
                    New-NetFirewallRule -DisplayName 'Gophish inbound rule' -Direction Inbound -LocalPort 3333 -Protocol TCP -Action Allow;";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    pivot(whatIf = false)
    {
        let axios = require('axios');
        let https = require("https");
        let deasync = require('deasync');
        let response = false;
        let feedback;

        if (this.validate())
        {
            let agent = new https.Agent({ rejectUnauthorized: false });
            let task;
            let op;
            let port;

            if (this.operation.toUpperCase() == "START")
            {
                task = "cd C:\\Users\\Public\\gophish; \
                        .\\gophish.exe";
                op = "enable";

                //  Spawn a TCP proxy
                // ******************************
                axios.post(this.url,
                { 
                    operation: op,
                    service: {
                        type: "TCP_PROXY",
                        params: {
                            rport: 3333
                        }
                    }
                },
                {
                    httpsAgent: agent,
                    auth: this.auth
                })
                .then((res) => {
                    response = true;
                    port = res.data.data.service.ports.port;

                })
                .catch((err) => {
                    response = err.message;
                });
                deasync.loopWhile(() => !response);

                //  Async execution
                // ******************************
                this.do(task, "cmd_res", false, whatIf);

                feedback = "[!] Connect to https://10.10.0.3:" + port + "?t=" + this.token;
            } 
            else 
            {
                task = "Stop-Process -Name gophish -Force";
                op = "disable";

                //  Destroy the TCP proxy
                // ******************************
                axios.post(this.url,
                { 
                    operation: op,
                    service: {
                        type: "TCP_PROXY"
                    }
                },
                {
                    httpsAgent: agent,
                    auth: this.auth
                })
                .then((res) => {
                    //response = { enabled: false };
                    response = true;
                })
                .catch((err) => {
                    response = err.message;
                });

                deasync.loopWhile(() => !response);

                //  Async execution
                // ******************************
                this.do(task, "cmd_res", false, whatIf);
    
                feedback = "[ Operation Initiated ]";
            }
        }
        else
        {
            feedback = "[ Invalid input provided ]";
        }
        this.reportAndExit(feedback);
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

module.exports = WindowsGophish
