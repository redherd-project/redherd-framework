'use strict';

const Mapper = require('./base/rdhd-mdl-data_mapper');
const Gateway = require('./rdhd-mdl-system_gateway');

class SystemMapper extends Mapper
{
    constructor(connectionBroker)
    {
        super(connectionBroker, Gateway);
    }

    // Specialized query decorator
    findBySeed(seed)
    {
        return this.gateway.findBySeed(seed);
    }

    // Specialized query decorator
    findCurrent()
    {
        return this.gateway.findCurrent();
    }
}

module.exports = SystemMapper;
