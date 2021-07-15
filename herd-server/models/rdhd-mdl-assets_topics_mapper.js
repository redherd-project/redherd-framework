'use strict';

const Mapper = require('./base/rdhd-mdl-data_mapper');
const Gateway = require('./rdhd-mdl-assets_topics_gateway');

class AssetsTopicsMapper extends Mapper
{
    constructor(connectionBroker)
    {
        super(connectionBroker, Gateway);
    }

    // Specialized query decorator
    findByAssetId(id)
    {
        return this.gateway.findByAssetId(id);
    }

    // Specialized query decorator
    findByTopicId(id)
    {
        return this.gateway.findByTopicId(id);
    }

    // Specialized delete decorator
    deleteByAssetId(id)
    {
        return this.gateway.delete({}, { id_asset: id });
    }

    // Specialized delete decorator
    deleteByTopicId(id)
    {
        return this.gateway.delete({}, { id_topic: id });
    }

    // Specialized delete decorator
    deleteByAssetAndTopicId(assetId, topicId)
    {
        return this.gateway.delete({}, { id_asset: assetId, id_topic: topicId });
    }
}

module.exports = AssetsTopicsMapper;
