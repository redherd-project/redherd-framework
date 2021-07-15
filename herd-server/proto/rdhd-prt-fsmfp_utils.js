'use strict';

const FSMFPMessages = require('./rdhd-prt-fsmfp_messages');

class FSMFPUtils
{
    //  RedHerd Flexible Message Formatting Protocol compliant decorator:
    // ******************************
    
    static getSpecializedLv2Message(src, dst, session = "0", type = "gen_res")
    {
        //  RedHerd Flexible Message Formatting Protocol compliant decorator:
        // Message format spec.: { "src": "", "dst": "", "payload": "", "session": "" }
        let w = {};
        Object.assign(w, FSMFPMessages.genericLv2Message);

        w.src = src.toString();
        w.dst = dst.toString();
        w.type = type.toString();
        w.session = session.toString();

        return w;
    }

    static getSpecializedLv1Message(id, timestamp, type, content)
    {
        //  RedHerd Flexible Message Formatting Protocol compliant decorator:
        //  Message format spec.: { "id": "", "timestamp": "", "type": "", "content": "" }
        // ******************************
        let w = {};
        Object.assign(w, FSMFPMessages.genericLv1Message);

        w.id = id.toString();
        w.timestamp = timestamp;
        w.content = content;
        w.type = type.toString();

        return w;
    }
}
module.exports = FSMFPUtils