'use strict';

const FSMFPUtils = require('../../proto/rdhd-prt-fsmfp_utils');

class WebSocketMessage
{
    constructor(message, wsMessageEnvelope = { "payload": "" }, wsServer = "http://localhost:3001/", ignoreSSL = true)
    {
        //  Required object init:
        // ******************************
        this._io = require("socket.io-client");
        this._crypto = require('crypto');

        //  RedHerd Flexible Message Formatting Protocol compliant envelope:
        // ******************************
        this._messageEnvelope = wsMessageEnvelope;

        //  Command related variables init:
        // ******************************
        this._message = message;
        this._wsServer = wsServer;

        this._socketOptions = ignoreSSL ? { rejectUnauthorized : false } : { rejectUnauthorized : true };
    }

    send()
    {
        this._send();
    }

    sendAndFinalize()
    {
        this._send("EXTMSG");
    }

    //  Concrete execution function:
    // ******************************
    _send(msgType = "MSG")
    {
        let socket = this._io(this._wsServer, this._socketOptions);
        let timestamp = Date.now();
        let messageId = this._crypto.createHash("md5").update(timestamp.toString()).digest("hex");

        //  RedHerd Flexible Message Formatting Protocol usage:
        // ******************************
        let msgObj = this._messageEnvelope;

        msgObj.payload = FSMFPUtils.getSpecializedLv1Message(messageId, timestamp, msgType, this._message);
        setTimeout(() => {
            socket.emit('message', msgObj);
        }, 250);
    }
}

module.exports = WebSocketMessage;