'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_rtsp_cam
class DebianRtspCam extends LinuxModule
{
    // ************************************************************
    //  RtspCam module
    // ************************************************************
    //
    // RECEIVE CMD:
    //  ffplay -i rtsp://<server_ip>:<cport>/<session>
    // EXAMPLE:
    //  ffplay -i rtsp://10.10.0.3:25000/489375ede5e090b2ba80e20ee2abbda5
    //
    // operation       :   [start/stop]
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_rtsp_cam", session, wsServer, token);

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
                    sudo apt install ffmpeg -y";

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
            let sport;
            let cport;

            if (this.operation.toUpperCase() == "START")
            {
                op = "enable";

                //  Spawn a Cam proxy
                // ******************************
                axios.post(this.url,
                { 
                    operation: op,
                    service: {
                        type: "RTSP_REDIRECTOR"
                    }
                },
                {
                    httpsAgent: agent,
                    auth: this.auth
                })
                .then((res) => {
                    //response = res.data.cport;
                    //response = { enabled: true, port: res.data.data.service.ports.cport };
                    //sport = res.data.sport;
                    response = true;
                    cport = res.data.data.service.ports.cport;
                    sport = res.data.data.service.ports.sport;
                })
                .catch((err) => {
                    response = err.message;
                });
                deasync.loopWhile(() => !response);

                //ffmpeg -i /dev/video0 -c:v h264 -r 10 -s 720x480 -f rtsp rtsp://127.0.0.1:22500/stream1
                task = "sudo ffmpeg -i /dev/video0 -c:v h264 -r 10 -s 720x480 -f rtsp rtsp://" + this.envHerdServer + ":" + sport + "/" + this.session;
                
                feedback = this.buildWarnMessage("Connect to rtsp://10.10.0.3:" + cport + "/" + this.session);
            } 
            else 
            {
                task = "sudo killall -9 ffmpeg";
                op = "disable";

                //  Destroy a Cam proxy
                // ******************************
                axios.post(this.url,
                { 
                    operation: op,
                    service: {
                        type: "RTSP_REDIRECTOR"
                    }
                },
                {
                    httpsAgent: agent,
                    auth: this.auth
                })
                .then((res) => {
                    response = true;
                })
                .catch((err) => {
                    response = err.message;
                });
                deasync.loopWhile(() => !response);

                feedback = this.buildInfoMessage("Opertion Completed");
            }

            //  Async execution
            // ******************************
            setTimeout(() => {
                this.do(task, "cmd_res", false, whatIf)
            }, 500);
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

module.exports = DebianRtspCam
