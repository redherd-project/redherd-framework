'use strict';

const DataGateway = require('./base/rdhd-mdl-data_gateway');

class AssetsTopicsGateway extends DataGateway
{
    constructor(connectionBroker)
    {
        super(connectionBroker, "assets_topics");
    }

    // Specialized query decorator
    findById(id)
    {
        return this.select("SELECT id, id_asset, id_topic FROM assets_topics WHERE id = ?", [ id ]);
    }

    // Specialized query decorator
    findAll()
    {
        return this.select("SELECT id, id_asset, id_topic FROM assets_topics");
    }

    // Specialized query decorator
    findByAssetId(id)
    {
        return this.select("SELECT id, id_asset, id_topic FROM assets_topics WHERE id_asset = ?", [ id ]);
    }

    // Specialized query decorator
    findByTopicId(id)
    {
        return this.select("SELECT id, id_asset, id_topic FROM assets_topics WHERE id_topic = ?", [ id ]);
    }
}

module.exports = AssetsTopicsGateway;