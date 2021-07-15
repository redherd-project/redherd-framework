'use strict';

class FSMFPMessages
{
    //  RedHerd Flexible Message Formatting Protocol getters:
    // ******************************
    static get genericLv1Message() { return { "id": "", "type": "", "timestamp": "", "content": "" }; }
    // ******************************
    static get genericLv2Message() { return { "src": "", "dst": "", "type": "", "session": "", "payload": "" }; }
    // ******************************
}

module.exports = FSMFPMessages