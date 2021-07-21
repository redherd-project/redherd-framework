'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');

// moduleCode: windows_metasploit
class WindowsMetasploit extends WindowsModule
{
    // ************************************************************
    //  Metasploit module
    // ************************************************************
    //
    // operation       :   [start/stop]
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_metasploit", session, wsServer, token);

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
        let task = "Write-Host '[Downloading Metasploit installer...it may require some time...]'; \
                    wget https://windows.metasploit.com/metasploitframework-latest.msi -OutFile C:\\Users\\Public\\installer.msi; \
                    Write-Host '[Download completed]'; \
                    Write-Host '[Installing Metasploit]'; \
                    Start-Process msiexec.exe -Wait -ArgumentList '/i C:\\Users\\Public\\installer.msi /passive /quiet'; \
                    Start-Process msiexec.exe -Wait -ArgumentList '/i C:\\installer.msi /passive /quiet'; \
                    Remove-Item -Force C:\\Users\\Public\\installer.msi;";

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
                let task = "msfconsole.bat";
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

module.exports = WindowsMetasploit
