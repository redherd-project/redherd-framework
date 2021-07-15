'use strict';

const Mapper = require('./base/rdhd-mdl-data_mapper');
const Gateway = require('./rdhd-mdl-process_gateway');

class processMapper extends Mapper
{
    constructor(connectionBroker)
    {
        super(connectionBroker, Gateway);
    }

    deleteBySession(session)
    {
        return this.gateway.deleteBySession(session);
    }
}

module.exports = processMapper;
