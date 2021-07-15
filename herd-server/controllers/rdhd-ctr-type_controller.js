'use strict';

const tyMapper = require('../models/rdhd-mdl-type_mapper');

class TypeController
{
    constructor(broker, type)
    {
        this._broker = broker;

        // { id: 0, name: "", description: "" }
        this._type = type;
    }
    
    get id()
    {
        return this._type.id;
    }

    get name()
    {
        return this._type.name;
    }
  
    set name(value)
    {
        this._type.name = value;
    }

    get description()
    {
        return this._type.description;
    }

    set description(value)
    {
        this._type.description = value;
    }

    persist()
    {
        let result;
        let ty = new tyMapper(this._broker);

        if (this._type.id)
        {
            result = (ty.update(this._type) == 0) ? true : false;
        }
        else
        {
            result = (ty.insert(this._type) > 0) ? true : false;
        }
        return result;
    }

    remove()
    {
        let result = false;
        let ty = new tyMapper(this._broker);

        if (this._type.id)
        {
            result = (ty.deleteById(this._type.id) == 0) ? true : false;
        }
        return result;
    }

    present()
    {
        let result = {};

        if (this._type)
        {
            result = { id: this._type.id, name: this._type.name, description: this._type.description };
        }
        return result;
    }
}

module.exports = TypeController;