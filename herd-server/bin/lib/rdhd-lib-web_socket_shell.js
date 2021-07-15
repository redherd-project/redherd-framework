'use strict';

const FSMFPUtils = require('../../proto/rdhd-prt-fsmfp_utils');

class WebSocketShell
{
    constructor(command = "hostname", commandArgs = [], wsMessageEnvelope = { "payload": "" }, wsServer = "http://localhost:3001/", ignoreSSL = true)
    {
        //  Required object init:
        // ******************************
        this._cp = require('child_process');
        this._io = require("socket.io-client");
        this._crypto = require('crypto');

        //  RedHerd Flexible Message Formatting Protocol compliant envelope:
        // ******************************
        this._messageEnvelope = wsMessageEnvelope;

        //  Command related variables init:
        // ******************************
        this._command = command;
        this._commandArgs = commandArgs;
        this._wsServer = wsServer;

        this._socketOptions = ignoreSSL ? { rejectUnauthorized : false } : { rejectUnauthorized : true };
    }

    //  Async execution decorator:
    // ******************************
    executeAsync(whatIf = false, messageOnExit = true)
    {
        this._execute(false, messageOnExit, whatIf);
    }

    //  Sync execution decorator:
    // ******************************
    executeSync(whatIf = false)
    {
        this._execute(true, false, whatIf);
    }

    //  Concrete execution function:
    // ******************************
    _execute(sync = false, messageOnExit = true, whatIf = false)
    {
        let socket = this._io(this._wsServer, this._socketOptions);

        if (sync)
        {
            let data = this._cp.spawnSync(this._command, this._commandArgs, { encoding : 'utf8' }).output;
    
            //  Child_Process & WebSocket events handling for stdout:
            // ******************************
            let stdout = data[1].trim();
            if (stdout)
            {
                if (!whatIf)
                {
                    let timestamp = Date.now();
                    let commandId = this._crypto.createHash("md5").update(Math.random().toString()).digest("hex");

                    //  RedHerd Flexible Message Formatting Protocol usage:
                    // ******************************
                    let msgObj = {};
                    Object.assign(msgObj, this._messageEnvelope);
                    msgObj.payload = FSMFPUtils.getSpecializedLv1Message(commandId, timestamp, "STDOUT", stdout);

                    setTimeout(() => {
                        socket.emit('message', msgObj);
                    }, 250);
                }
                else
                {
                    console.log(stdout);
                }
            }
    
            //  Child_Process & WebSocket events handling for stderr:
            // ******************************
            let stderr = data[2].trim();
            if (stderr)
            {
                if (!whatIf)
                {
                    let timestamp = Date.now();
                    let commandId = this._crypto.createHash("md5").update(Math.random().toString()).digest("hex");

                    //  RedHerd Flexible Message Formatting Protocol usage:
                    // ******************************
                    let msgObj = {};
                    Object.assign(msgObj, this._messageEnvelope);
                    msgObj.payload = FSMFPUtils.getSpecializedLv1Message(commandId, timestamp, "STDERR", stderr);

                    setTimeout(() => {
                        socket.emit('message', msgObj);
                    }, 250);
                }
                else
                {
                    console.log(stderr);
                }
            }
        }
        else
        {
            let task = this._cp.spawn(this._command, this._commandArgs);
    
            //  Child_Process & WebSocket events handling for stdout:
            // ******************************
            task.stdout.on('data', (data) => {
                let content = data.toString().trim();

                if (!whatIf)
                {
                    let timestamp = Date.now();
                    let commandId = this._crypto.createHash("md5").update(Math.random().toString()).digest("hex");

                    //  RedHerd Flexible Message Formatting Protocol usage:
                    // ******************************
                    let msgObj = {};
                    Object.assign(msgObj, this._messageEnvelope);
                    msgObj.payload = FSMFPUtils.getSpecializedLv1Message(commandId, timestamp, "STDOUT", content);

                    setTimeout(() => {
                        socket.emit('message', msgObj);
                    }, 250);
                }
                else
                {
                    console.log(content);
                }
            });
    
            //  Child_Process & WebSocket events handling for stderr:
            // ******************************
            task.stderr.on('data', (data) => {
                let content = data.toString().trim();

                if (!whatIf)
                {
                    let timestamp = Date.now();
                    let commandId = this._crypto.createHash("md5").update(Math.random().toString()).digest("hex");

                    //  RedHerd Flexible Message Formatting Protocol usage:
                    // ******************************
                    let msgObj = {};
                    Object.assign(msgObj, this._messageEnvelope);
                    msgObj.payload = FSMFPUtils.getSpecializedLv1Message(commandId, timestamp, "STDERR", content);
                    
                    setTimeout(() => {
                        socket.emit('message', msgObj);
                    }, 250);
                }
                else
                {
                    console.log(content);
                }
            });

            //  Child_Process & WebSocket events handling for process exit:
            // ******************************
            if (messageOnExit)
            {
                task.on('close', (code) => {
                    let content = code.toString().trim();
                    
                    if (!whatIf)
                    {
                        let timestamp = Date.now();
                        let commandId = this._crypto.createHash("md5").update(Math.random().toString()).digest("hex");

                        //  RedHerd Flexible Message Formatting Protocol usage:
                        // ******************************
                        let msgObj = {};
                        Object.assign(msgObj, this._messageEnvelope);
                        msgObj.payload = FSMFPUtils.getSpecializedLv1Message(commandId, timestamp, "EXTCODE", content);

                        setTimeout(() => {
                            socket.emit('message', msgObj);
                            socket.close();
                        }, 250);
                    }
                    else
                    {
                        console.log(content);
                    }
                });
            } 
            else
            {
                task.on('close', (code) => {                 
                    if (!whatIf)
                    {
                        setTimeout(() => {
                            socket.close();
                        }, 250);
                    }
                    else
                    {
                        console.log(content);
                    }
                });
            }
            
        }
    }
}

module.exports = WebSocketShell;