'use strict';

const pMapper = require('../models/rdhd-mdl-process_mapper');

class ProcessController
{
    constructor(broker, process)
    {
        this._broker = broker;

        // { id: 0, module: "", session: "", id_asset: 0 }
        this._process = process;
    }
    
    get id()
    {
        return this._process.id;
    }

    get module()
    {
        return this._process.module;
    }
  
    set module(value)
    {
        this._process.module = value;
    }

    get session()
    {
        return this._process.session;
    }

    set session(value)
    {
        this._process.session = value;
    }

    get assetId()
    {
        return this._process.id_asset;
    }

    set assetId(value)
    {
        this._process.id_asset = value;
    }

    persist()
    {
        let result;
        let p = new pMapper(this._broker);

        if (this._process.id)
        {
            result = (p.update(this._process) == 0) ? true : false;
        }
        else
        {
            result = (p.insert(this._process) > 0) ? true : false;
        }
        return result;
    }

    remove()
    {
        let result = false;
        let p = new pMapper(this._broker);

        if (this._process.id)
        {
            result = (p.deleteById(this._process.id) == 0) ? true : false;
        }
        return result;
    }

    present()
    {
        let result = {};

        if (this._process)
        {
            result = { id: this._process.id, module: this._process.module, session: this._process.session, id_asset: this._process.id_asset };
        }
        return result;
    }
}

module.exports = ProcessController;