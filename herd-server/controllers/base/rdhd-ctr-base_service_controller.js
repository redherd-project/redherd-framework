'use strict';

class ServiceController
{
    constructor(factory)
    {
        this._factory = factory;
        this._spawnedServices = [];
    }

    spawn()
    {
        // Must be implemented in a derived class
        throw new Error("Not Implemented");
    }

    destroyByPort(port)
    {
        let result = true;
        try
        {
            for(let i in this._spawnedServices)
            {
                if (this._spawnedServices[i].port == port)
                {
                    this._factory.destroy(this._spawnedServices[i].port);
                    this._spawnedServices.splice(i, 1);
                    break;
                }
            }
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }

    destroyById(assetId)
    {
        let result = true;
        try
        {
            for(let i in this._spawnedServices)
            {
                if (this._spawnedServices[i].id == assetId)
                {
                    this._factory.destroy(this._spawnedServices[i].port);
                    this._spawnedServices.splice(i, 1);
                    break;
                }
            }
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }
}

module.exports = ServiceController;