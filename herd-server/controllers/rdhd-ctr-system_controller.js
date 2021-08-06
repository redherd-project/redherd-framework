'use strict';

class SystemController
{
    constructor(broker, system)
    {
        this._broker = broker;

        // { seed: "", dob: timestamp }
        this._system = system;
    }
    
    get seed()
    {
        return this._system.seed;
    }

    get dob()
    {
        return this._system.dob;
    }

    persist()
    {
        throw new Error("Not Implemented");
    }

    remove()
    {
        throw new Error("Not Implemented");
    }

    present()
    {
        let result = {};

        if (this._system)
        {
            result = { seed: this._system.seed, dob: this._system.dob };
        }
        return result;
    }
}

module.exports = SystemController;