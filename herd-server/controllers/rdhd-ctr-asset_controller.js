'use strict';

const Topic = require('./rdhd-ctr-topic_controller');
const Type = require('./rdhd-ctr-type_controller');
const Module = require('./rdhd-ctr-module_controller');
const aMapper = require('../models/rdhd-mdl-asset_mapper');
const atMapper = require('../models/rdhd-mdl-assets_topics_mapper');
const tMapper = require('../models/rdhd-mdl-topic_mapper');
const mMapper = require('../models/rdhd-mdl-module_mapper');
const tyMapper = require('../models/rdhd-mdl-type_mapper');

const Utils = require('../bin/lib/rdhd-lib-common_utils');

class AssetController
{
    constructor(broker, repo, asset)
    {
        this._broker = broker;
        this._repo = repo;

        // { id: 0, name: "", ip: "", description: "", user: "" }
        this._asset = asset;
    }

    get id()
    {
        return this._asset.id;
    }

    get name()
    {
        return this._asset.name;
    }

    set name(value)
    {
        this._asset.name = value;
    }

    get ip()
    {
        return this._asset.ip;
    }

    set ip(value)
    {
        this._asset.ip = value;
    }

    get description()
    {
        return this._asset.description;
    }

    set description(value)
    {
        this._asset.description = value;
    }

    get user()
    {
        return this._asset.user;
    }

    set user(value)
    {
        this._asset.user = value;
    }

    get fingerprint()
    {
        return this._asset.fingerprint;
    }

    set fingerprint(value)
    {
        this._asset.fingerprint = value;
    }

    get wport()
    {
        return this._asset.wport;
    }

    set wport(value)
    {
        this._asset.wport = value;
    }

    get joined()
    {
        return this._asset.joined;
    }

    set joined(value)
    {
        this._asset.joined = value;
    }

    get typeId()
    {
        return this.getType().id;
    }

    set typeId(value)
    {
        this._asset.id_type = value;
    }

    get type()
    {
        return this.getType();
    }

    get topics()
    {
        return this.getTopics();
    }

    get modules()
    {
        return this.getModules();
    }

    getType()
    {
        let type = {};
        if (this._asset.id_type > 0)
        {
            let ty = new tyMapper(this._broker).findById(this._asset.id_type);
            if (ty)
            {
                type = new Type(this._broker, ty);
            }
        }
        return type;
    }

    presentType()
    {
        let t = this.type;
        let type = {};
        if (t.id)
        {
            type = t.present();
        }
        return type;
    }

    getTopics()
    {
        let assetTopics = (new atMapper(this._broker)).findByAssetId(this._asset.id);

        let topics = [];
        let t = new tMapper(this._broker);

        for (let i in assetTopics)
        {
            let topic = t.findById(assetTopics[i].id_topic);
            if (topic)
            {
                topics.push(new Topic(this._broker, topic));
            }
        }
        return topics;
    }

    presentTopics()
    {
        return Utils.presentCollectionElements(this.topics);
    }

    getModules()
    {
        let topics = this.topics;
        let result = [];
        let modules = [];
        let dbModules = [];
        let m = new mMapper(this._repo);

        for (let i in topics)
        {
            modules = [];
            dbModules = m.findByTopic(topics[i].name);
            if (dbModules.length > 0)
            {
                for (let j in dbModules)
                {
                    modules.push(new Module(this._repo, dbModules[j]));
                }
                result = result.concat(modules);
            }
        }
        return result;
    }

    presentModules()
    {
        return Utils.presentCollectionElements(this.modules);
    }

    addTopic(topicId)
    {
        let topics = this.topics;
        let isLinked = false;

        for (let i in topics)
        {
            if (topics[i].id == topicId)
            {
                isLinked = true;
                break;
            }
        }

        if (!isLinked)
        {
            return ((new atMapper(this._broker)).insert({ "id_asset": this._asset.id, "id_topic": topicId }) > 0) ? true : false;
        }
        else
        {
            return true;
        }
    }

    removeTopic(topicId)
    {
        let result = false;
        if (!Utils.isEmpty(this._asset))
        {
            result = ((new atMapper(this._broker)).deleteByAssetAndTopicId(this._asset.id, topicId) == 0) ? true : false;
        }
        return result;
    }

    persist()
    {
        let result = false;
        let a = new aMapper(this._broker);

        if (!Utils.isEmpty(this._asset))
        {
            if (this._asset.id)
            {
                result = (a.update(this._asset) == 0) ? true : false;
            }
            else
            {
                result = (a.insert(this._asset) > 0) ? true : false;
            }
        }
        return result;
    }

    remove()
    {
        let result = false;
        let topics = this.getTopics();
        let a = new aMapper(this._broker);

        if (!Utils.isEmpty(this._asset))
        {
            for (let i in topics)
            {
                this.removeTopic(topics[i].id);
            }
            result = (a.deleteById(this._asset.id) == 0) ? true : false;
        }
        return result;
    }

    present(secured = true)
    {
        let result = {};
        
        if ((this._asset) && (!Utils.isEmpty(this._asset)))
        {
            result = secured ? {
                id: this._asset.id,
                name: this._asset.name,
                ip: this._asset.ip,
                user: this._asset.user,
                description: this._asset.description,
                wport: this._asset.wport,
                joined: this._asset.joined,
                type: this.presentType()
            } : {
                id: this._asset.id,
                name: this._asset.name,
                ip: this._asset.ip,
                user: this._asset.user,
                description: this._asset.description,
                fingerprint: this._asset.fingerprint,
                wport: this._asset.wport,
                joined: this._asset.joined,
                type: this.presentType()
            }; 
        }
        return result;
    }
}

module.exports = AssetController;