'use strict';

const Mapper = require('./base/rdhd-mdl-data_mapper');
const Gateway = require('./rdhd-mdl-type_gateway');

class TypeMapper extends Mapper
{
    constructor(connectionBroker)
    {
        super(connectionBroker, Gateway);
    }

    // Specialized query decorator
    findByName(name)
    {
        return this.gateway.findByName(name);
    }
}

module.exports = TypeMapper;
