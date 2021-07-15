'use strict';

const DataGateway = require('./base/rdhd-mdl-data_gateway');

class ProcessGateway extends DataGateway
{
    constructor(connectionBroker)
    {
        super(connectionBroker, "processes");
    }

    // Specialized query decorator
    findById(id)
    {
        return this.select("SELECT id, module, session, id_asset FROM processes WHERE id = ?", [ id ])[0];
    }

    // Specialized query decorator
    findAll()
    {
        return this.select("SELECT id, module, session, id_asset FROM processes");
    }

    // Specialized query decorator
    findByAssetId(id)
    {
        return this.select("SELECT id, module, session, id_asset FROM processes WHERE id_asset = ?", [ id ])[0];
    }

    // Specialized query decorator
    findByModuleName(name)
    {
        return this.select("SELECT id, module, session, id_asset FROM processes WHERE module = '?'", [ name ])[0];
    }

    // Specialized query decorator
    findBySession(session)
    {
        return this.select("SELECT id, module, session, id_asset FROM processes WHERE session = '?'", [ session ])[0];
    }

    // Specialized delete decorator
    deleteBySession(session)
    {
        return this.delete({}, { session: session });
    }
}

module.exports = ProcessGateway;