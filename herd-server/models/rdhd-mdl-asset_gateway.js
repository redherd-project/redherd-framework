'use strict';

const DataGateway = require('./base/rdhd-mdl-data_gateway');

class AssetGateway extends DataGateway
{
    constructor(connectionBroker)
    {
        super(connectionBroker, "assets");
    }

    // Specialized query decorator
    findById(id)
    {
        return this.select("SELECT id, name, ip, description, user, fingerprint, wport, joined, id_type FROM assets WHERE id = ?", [ id ])[0];
    }

    // Specialized query decorator
    findByName(name)
    {
        return this.select("SELECT id, name, ip, description, user, fingerprint, wport, joined, id_type FROM assets WHERE name = ?", [ name ])[0];
    }

    // Specialized query decorator
    findByFingerprint(fingerprint)
    {
        return this.select("SELECT id, name, ip, description, user, fingerprint, wport, joined, id_type FROM assets WHERE fingerprint = ?", [ fingerprint ])[0];
    }

    // Specialized query decorator
    findAll()
    {
        return this.select("SELECT id, name, ip, description, user, fingerprint, wport, joined, id_type FROM assets");
    }
}

module.exports = AssetGateway;