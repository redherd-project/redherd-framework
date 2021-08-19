'use strict';

const DataGateway = require('./base/rdhd-mdl-data_gateway');

class SystemGateway extends DataGateway
{
    constructor(connectionBroker)
    {
        super(connectionBroker, "types");
    }

    // Specialized query decorator
    findBySeed(seed)
    {
        return this.select("SELECT seed, dob FROM system WHERE seed = ?", [ seed ])[0];
    }

    // Specialized query decorator
    findCurrent()
    {
        return this.select("SELECT * FROM system ORDER BY dob DESC LIMIT 1")[0];
    }

    // Specialized query decorator
    findAll()
    {
        return this.select("SELECT seed, dob FROM system");
    }
}

module.exports = SystemGateway;