'use strict';

const Gateway = require('./rdhd-mdl-module_gateway');

class ModuleMapper
{
    constructor(repo)
    {
        this.gateway = new Gateway(repo);
    }

    // Specialized decorator
    findByName(name)
    {
        return this.gateway.findByName(name);
    }

    // Specialized decorator
    findByTopic(topic)
    {
        return this.gateway.findByTopic(topic);
    }

    // Specialized decorator
    findAll()
    {
        return this.gateway.findAll();
    }
}

module.exports = ModuleMapper;
