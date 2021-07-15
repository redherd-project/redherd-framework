'use strict';

class DataMapper
{
    constructor(connectionBroker, gateway)
    {
        // Initiate data gateway for instance access
        this.gateway = new gateway(connectionBroker);
    }

    // Exposed
    findById(id)
    {
        return this.gateway.findById(id);
    }

    // Exposed
    findAll()
    {
        return this.gateway.findAll();
    }

    // Exposed
    insert(object)
    {
        return this.gateway.insert(object);
    }

    // Exposed
    delete(object)
    {
        return this.gateway.delete(object);
    }

    // Exposed
    deleteById(objectId)
    {
        return this.gateway.delete({ id: objectId });
    }

    // Exposed
    update(object)
    {
        return this.gateway.update(object);
    }
}

module.exports = DataMapper;
