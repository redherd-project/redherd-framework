'use strict';

const tMapper = require('../models/rdhd-mdl-topic_mapper');

class TopicController
{
    constructor(broker, topic)
    {
        this._broker = broker;

        // { id: 0, name: "", description: "" }
        this._topic = topic;
    }
    
    get id()
    {
        return this._topic.id;
    }

    get name()
    {
        return this._topic.name;
    }
  
    set name(value)
    {
        this._topic.name = value;
    }

    get description()
    {
        return this._topic.description;
    }

    set description(value)
    {
        this._topic.description = value;
    }

    persist()
    {
        let result;
        let t = new tMapper(this._broker);

        if (this._topic.id)
        {
            result = (t.update(this._topic) == 0) ? true : false;
        }
        else
        {
            result = (t.insert(this._topic) > 0) ? true : false;
        }
        return result;
    }

    remove()
    {
        let result = false;
        let t = new tMapper(this._broker);

        if (this._topic.id)
        {
            result = (t.deleteById(this._topic.id) == 0) ? true : false;
        }
        return result;
    }

    present()
    {
        let result = {};

        if (this._topic)
        {
            result = { id: this._topic.id, name: this._topic.name, description: this._topic.description };
        }
        return result;
    }
}

module.exports = TopicController;