'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_motion_cam
class DebianMotionCam extends LinuxModule
{
    // ************************************************************
    //  MotionCam module
    // ************************************************************
    //
    // operation       :   [start/stop]
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_motion_cam", session, wsServer, token);

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
                    sudo apt install motion -y && \
                    sudo sed -i 's/stream_localhost\ on/stream_localhost\ off/g' /etc/motion/motion.conf; \
                    sudo sed -i 's/width\ 320/width\ 640/g' /etc/motion/motion.conf; \
                    sudo sed -i 's/height\ 240/height\ 480/g' /etc/motion/motion.conf";

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
                task = "sudo motion";
                op = "enable";

                //  Spawn a Cam proxy
                // ******************************
                axios.post(this.url,
                { 
                    operation: op,
                    service: {
                        type: "HTTP_PROXY",
                        params: {
                            rport: 8081
                        }
                    }
                },
                {
                    httpsAgent: agent,
                    auth: this.auth
                })
                .then((res) => {
                    //response = res.data.data.service;
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
                task = "sudo killall -9 motion";
                op = "disable";

                //  Destroy a Cam proxy
                // ******************************
                axios.post(this.url,
                { 
                    operation: op,
                    service: {
                        type: "HTTP_PROXY"
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

module.exports = DebianMotionCam
