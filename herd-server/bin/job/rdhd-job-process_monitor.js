'use strict';

const Model = require('../../controllers/rdhd-ctr-model_controller');
const io = require("socket.io-client");

// jobCode: "process_monitor"
class ProcessMonitorJob
{
    static get code() { return "process_monitor"; }

    static run(wsServer = "http://localhost:3001/", ignoreSSL = true)
    {
        let socketOptions = ignoreSSL ? { rejectUnauthorized : false } : { rejectUnauthorized : true };

        let socket = io(wsServer, socketOptions);
        let model = new Model();

        socket.on("message", (msg) => {
            if (/(_res)$/i.test(msg.type))
            {
                // TODO: Evaluate a better solution
                if ((msg.payload.type.toUpperCase() == "EXTCODE") || (msg.payload.type.toUpperCase() == "EXTMSG"))
                {
                    model.removeProcessBySession(msg.session);
                }
            }
        });
    }
}

module.exports = ProcessMonitorJob