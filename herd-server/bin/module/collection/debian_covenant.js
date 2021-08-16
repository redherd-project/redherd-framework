'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_covenant
class DebianCovenant extends LinuxModule
{
    // ************************************************************
    //  DebianCovenant module
    // ************************************************************
    //
    // operation       :   [start/stop]
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_covenant", session, wsServer, token);

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
                    sudo apt install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common; \
                    curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add - ; \
                    sudo apt-key fingerprint 0EBFCD88; \
                    sudo add-apt-repository \"deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable\" -y; \
                    sudo add-apt-repository \"deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable\" -y; \
                    sudo apt update; \
                    sudo apt -y install docker-ce docker-ce-cli containerd.io; \
                    service docker start; \
                    sudo rm -rf Covenant; \
                    git clone --recurse-submodules https://github.com/cobbr/Covenant; \
                    cd Covenant/Covenant; \
                    sudo docker build -t covenant .";

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
                task = "sudo docker run -p 7443:7443 -p 80:80 -p 443:443 --name covenant -v $(pwd)/Covenant/Covenant/Data:/app/Data covenant";
                op = "enable";

                //  Spawn a TCP proxy
                // ******************************
                axios.post(this.url,
                { 
                    operation: op,
                    service: {
                        type: "TCP_PROXY",
                        params: {
                            rport: 7443
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

                feedback = this.buildWarnMessage("Connect to https://10.10.0.3:" + port + "?t=" + this.token);
            } 
            else 
            {
                task = "sudo docker stop covenant && sudo docker rm covenant";
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
    
                feedback = this.buildInfoMessage("Operation started");
            }
        }
        else
        {
            feedback = this.buildErrorMessage("Invalid input provided");
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

module.exports = DebianCovenant
