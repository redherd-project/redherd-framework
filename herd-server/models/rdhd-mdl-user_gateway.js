'use strict';

const DataGateway = require('./base/rdhd-mdl-data_gateway');

class UserGateway extends DataGateway
{
    constructor(connectionBroker)
    {
        super(connectionBroker, "users");
    }

    // Specialized query decorator
    findAll()
    {
        return this.select("SELECT id, uname, secret, enabled FROM users");
    }
}

module.exports = UserGateway;