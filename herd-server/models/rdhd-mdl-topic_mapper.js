'use strict';

const Mapper = require('./base/rdhd-mdl-data_mapper');
const Gateway = require('./rdhd-mdl-topic_gateway');

class TopicMapper extends Mapper
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

module.exports = TopicMapper;
