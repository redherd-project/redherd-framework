'use strict';

const Mapper = require('./base/rdhd-mdl-data_mapper');
const Gateway = require('./rdhd-mdl-asset_gateway');

class AssetMapper extends Mapper
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

    // Specialized query decorator
    findByFingerprint(fingerprint)
    {
        return this.gateway.findByFingerprint(fingerprint);
    }
}

module.exports = AssetMapper;
