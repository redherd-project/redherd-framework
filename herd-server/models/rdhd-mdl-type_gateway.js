'use strict';

const DataGateway = require('./base/rdhd-mdl-data_gateway');

class TypeGateway extends DataGateway
{
    constructor(connectionBroker)
    {
        super(connectionBroker, "types");
    }

    // Specialized query decorator
    findById(id)
    {
        return this.select("SELECT id, name, description FROM types WHERE id = ?", [ id ])[0];
    }

    // Specialized query decorator
    findByName(name)
    {
        return this.select("SELECT id, name, description FROM types WHERE name = ?", [ name ])[0];
    }

    // Specialized query decorator
    findAll()
    {
        return this.select("SELECT id, name, description FROM types");
    }
}

module.exports = TypeGateway;