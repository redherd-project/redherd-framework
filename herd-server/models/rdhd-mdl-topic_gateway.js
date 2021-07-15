'use strict';

const DataGateway = require('./base/rdhd-mdl-data_gateway');

class TopicGateway extends DataGateway
{
    constructor(connectionBroker)
    {
        super(connectionBroker, "topics");
    }

    // Specialized query decorator
    findById(id)
    {
        return this.select("SELECT id, name, description FROM topics WHERE id = ?", [ id ])[0];
    }

    // Specialized query decorator
    findByName(name)
    {
        return this.select("SELECT id, name, description FROM topics WHERE name = ?", [ name ])[0];
    }

    // Specialized query decorator
    findAll()
    {
        return this.select("SELECT id, name, description FROM topics");
    }
}

module.exports = TopicGateway;