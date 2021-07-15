'use strict';

const Asset = require('./rdhd-ctr-asset_controller');
const User = require('./rdhd-ctr-user_controller');
const Type = require('./rdhd-ctr-type_controller');
const Topic = require('./rdhd-ctr-topic_controller');
const Process = require('./rdhd-ctr-process_controller');
const Module = require('./rdhd-ctr-module_controller');
const Broker = require('../models/rdhd-mdl-sqlite_connection_broker');

const aMapper = require('../models/rdhd-mdl-asset_mapper');
const tMapper = require('../models/rdhd-mdl-topic_mapper');
const pMapper = require('../models/rdhd-mdl-process_mapper');
const atMapper = require('../models/rdhd-mdl-assets_topics_mapper');
const mMapper = require('../models/rdhd-mdl-module_mapper');
const uMapper = require('../models/rdhd-mdl-user_mapper');
const tyMapper = require('../models/rdhd-mdl-type_mapper');

const Config = require('../config');
const Validator = require('../bin/lib/rdhd-lib-input_validator');
const Utils = require('../bin/lib/rdhd-lib-common_utils');

class ModelController
{
    constructor()
    {
        let databasePath = Validator.validateLinuxPath(Config.database_path) ? Config.database_path : false;
        let modulesPath = Validator.validateLinuxPath(Config.modules_directory) ? Config.modules_directory :false;

        if (databasePath && modulesPath)
        {
            this._broker = new Broker(databasePath);
            this._repo = modulesPath;
        }
        else
        {
            throw new Error("Invalid data sources provided");
        }
    }

    get assets()
    {
        return this.getAssets();
    }

    get modules()
    {
        return this.getModules();
    }

    get topics()
    {
        return this.getTopics();
    }

    get processes()
    {
        return this.getProcesses();
    }

    get users()
    {
        return this.getUsers();
    }

    get types()
    {
        return this.getTypes();
    }

    getAssets()
    {
        let dbAssets = (new aMapper(this._broker)).findAll();
        let assets = [];

        for(let i in dbAssets)
        {
            assets.push(new Asset(this._broker, this._repo, dbAssets[i]));
        }

        // []{ id: 0, name: "", ip: "", description: "", user: "" }
        return assets;
    }

    presentAssets()
    {
        return Utils.presentCollectionElements(this.assets);
    }

    getModules()
    {
        let modules = [];

        if (this._repo)
        {
            let dbModules = (new mMapper(this._repo)).findAll();

            for(let i in dbModules)
            {
                modules.push(new Module(this._repo, dbModules[i]));
            }
        }

        // []{ id: 0, name: "", description: "" }
        return modules;
    }

    presentModules()
    {
        return Utils.presentCollectionElements(this.modules);
    }

    getTopics()
    {
        let dbTopics = (new tMapper(this._broker)).findAll();
        let topics = [];

        for(let i in dbTopics)
        {
            topics.push(new Topic(this._broker, dbTopics[i]));
        }

        // []{ id: 0, name: "", description: "" }
        return topics;
    }

    presentTopics()
    {
        return Utils.presentCollectionElements(this.topics);
    }

    getProcesses()
    {
        let dbProcesses = (new pMapper(this._broker)).findAll();
        let processes = [];

        for(let i in dbProcesses)
        {
            processes.push(new Process(this._broker, dbProcesses[i]));
        }

        // { id: 0, module: "", session: "", id_asset: 0 }
        return processes;
    }

    presentProcesses()
    {
        return Utils.presentCollectionElements(this.processes);
    }

    getUsers()
    {
        let dbUsers = (new uMapper(this._broker)).findAll();
        let users = [];

        for(let i in dbUsers)
        {
            users.push(new User(this._broker, dbUsers[i]));
        }

        return users;
    }

    presentUsers()
    {
        return Utils.presentCollectionElements(this.users);
    }

    getUserById(userId)
    {
        let result = {};
        let dbUser = (new uMapper(this._broker)).findById(userId);

        if (dbUser)
        {
            result = new User(this._broker, dbUser);
        }
        return result;
    }

    presentUserById(userId)
    {
        let result = {};
        let dbUser = this.getUserById(userId);

        if (!Utils.isEmpty(dbUser))
        {
            result = dbUser.present();
        }
        return result;
    }

    getUserByName(uname)
    {
        let result = {};
        let dbUser = (new uMapper(this._broker)).findByName(uname);

        if (dbUser)
        {
            result = new User(this._broker, dbUser);
        }
        return result;
    }

    presentUserByName(uname)
    {
        let result = {};
        let dbUser = this.getUserByName(uname);

        if (!Utils.isEmpty(dbUser))
        {
            result = dbUser.present();
        }
        return result;
    }

    getEnabledUsers()
    {
        let users = this.users;
        let enabledUsers = [];

        for (let i in users)
        {
            if (users[i].enabled.toString() == "1") 
            {
                enabledUsers.push(new User(this._broker, users[i]));
                //enabledUsers[users[i].uname] = users[i].secret;
            }
        }
        return enabledUsers;
    }

    getTypes()
    {
        let dbTypes = (new tyMapper(this._broker)).findAll();
        let types = [];

        for(let i in dbTypes)
        {
            types.push(new Type(this._broker, dbTypes[i]));
        }

        return types;
    }

    presentTypes()
    {
        return Utils.presentCollectionElements(this.types);
    }

    getTopicById(topicId)
    {
        let result = {};
        let dbTopic = (new tMapper(this._broker)).findById(topicId);

        if (dbTopic)
        {
            result = new Topic(this._broker, dbTopic);
        }
        return result;
    }

    presentTopicById(topicId)
    {
        let result = {};
        let dbTopic = this.getTopicById(topicId);

        if (!Utils.isEmpty(dbTopic))
        {
            result = dbTopic.present();
        }
        return result;
    }

    getTopicByName(topicName)
    {
        let result = {};
        let dbTopic = (new tMapper(this._broker)).findByName(topicName);

        if (dbTopic)
        {
            result = new Topic(this._broker, dbTopic);
        }
        return result;
    }

    presentTopicByName(topicName)
    {
        let result = {};
        let dbTopic = this.getTopicByName(topicName);

        if (!Utils.isEmpty(dbTopic))
        {
            result = dbTopic.present();
        }
        return result;
    }

    getTopicsByAssetId(assetId)
    {
        let assets = this.assets;
        let topics = [];
    
        for(let i in assets)
        {
            if (assets[i].id == assetId)
            {
                topics = assets[i].topics;
                break;
            }
        }
        return topics;
    }

    presentTopicsByAssetId(assetId)
    {
        return Utils.presentCollectionElements(this.getTopicsByAssetId(assetId));
    }

    getAssetById(assetId)
    {
        let result = {};
        let dbAsset = (new aMapper(this._broker)).findById(assetId);

        if (dbAsset)
        {
            result = new Asset(this._broker, this._repo, dbAsset);
        }
        return result;
    }

    presentAssetById(assetId)
    {
        let result = {};
        let dbAsset = this.getAssetById(assetId);

        if (!Utils.isEmpty(dbAsset))
        {
            result = dbAsset.present();
        }
        return result;
    }

    getAssetByFingerprint(fingerprint)
    {
        let result = {};
        let dbAsset = (new aMapper(this._broker)).findByFingerprint(fingerprint);

        if (dbAsset)
        {
            result = new Asset(this._broker, this._repo, dbAsset);
        }
        return result;
    }

    presentAssetByFingerprint(fingerprint)
    {
        let result = {};
        let dbAsset = this.getAssetByFingerprint(fingerprint);

        if (!Utils.isEmpty(dbAsset))
        {
            result = dbAsset.present();
        }
        return result;
    }

    getAssetsByTopicId(topicId)
    {
        let assets = this.assets;
        let selectedAssets = [];
    
        for(let i in assets)
        {
            for(let j in assets[i].topics)
            {
                if (assets[i].topics[j].id == topicId)
                {
                    selectedAssets.push(assets[i]);
                }
            }
        }
        return selectedAssets;
    }

    presentAssetsByTopicId(topicId)
    {
        return Utils.presentCollectionElements(this.getAssetsByTopicId(topicId));
    }

    getAssetsByTopicName(topicName)
    {
        let assets = this.assets;
        let selectedAssets = [];
    
        for(let i in assets)
        {
            for(let j in assets[i].topics)
            {
                if (assets[i].topics[j].name == topicName)
                {
                    selectedAssets.push(assets[i]);
                }
            }
        }
        return selectedAssets;
    }

    presentAssetsByTopicName(topicName)
    {
        return Utils.presentCollectionElements(this.getAssetsByTopicName(topicName));
    }

    getModuleByName(moduleName)
    {
        let module = {};
    
        if (this._repo)
        {
            let modules = this.modules;
            
            for(let i in modules)
            {
                if (modules[i].name == moduleName)
                {
                    module = modules[i];
                    break;
                }
            }
        }
        return module;
    }

    presentModuleByName(moduleName)
    {
        let result = {};
        let module = this.getModuleByName(moduleName);

        if (!Utils.isEmpty(module))
        {
            result = module.present();
        }
        return result;
    }

    getModulesByAssetId(assetId)
    {
        let modules = [];
    
        if (this._repo)
        {
            let assets = this.assets;

            for(let i in assets)
            {
                if (assets[i].id == assetId)
                {
                    modules = assets[i].modules;
                    break;
                }
            }
        }
        return modules;
    }

    presentModulesByAssetId(assetId)
    {
        return Utils.presentCollectionElements(this.getModulesByAssetId(assetId));
    }

    getProcessById(processId)
    {
        let processes = this.processes;
        let process = {};
        
        for(let i in processes)
        {
            if (processes[i].id == processId)
            {
                process = processes[i];
                break;
            }
        }
        return process;
    }

    presentProcessById(processId)
    {
        let result = {};
        let process = this.getProcessById(processId);

        if (!Utils.isEmpty(process))
        {
            result = process.present();    
        }
        return result;
    }

    getProcessBySession(session)
    {
        let processes = this.processes;
        let process = {};
        
        for(let i in processes)
        {
            if (processes[i].session == session)
            {
                process = processes[i];
                break;
            }
        }
        return process;
    }

    presentProcessBySession(session)
    {
        let result = {};
        let process = this.getProcessBySession(session);

        if (!Utils.isEmpty(process))
        {
            result = process.present();
        }
        return result;
    }

    getProcessesByAssetId(assetId)
    {
        let result = [];
        let processes = this.processes;
        
        for(let i in processes)
        {
            if (processes[i].assetId == assetId)
            {
                result.push(processes[i]);
            }
        }
        return result;
    }

    presentProcessesByAssetId(assetId)
    {
        return Utils.presentCollectionElements(this.getProcessesByAssetId(assetId));
    }

    getTypeById(typeId)
    {
        let result = {};
        let dbType = (new tyMapper(this._broker)).findById(typeId);

        if (dbType)
        {
            result = new Type(this._broker, dbType);
        }
        return result;
    }

    presentTypeById(typeId)
    {
        let result = {};
        let dbType = this.getTypeById(typeId);

        if (!Utils.isEmpty(dbType))
        {
            result = dbType.present();
        }
        return result;
    }

    getTypeByName(typeName)
    {
        let result = {};
        let dbType = (new tyMapper(this._broker)).findByName(typeName);

        if (dbType)
        {
            result = new Type(this._broker, dbType);
        }
        return result;
    }

    presentTypeByName(typeName)
    {
        let result = {};
        let dbType = this.getTypeByName(typeName);

        if (!Utils.isEmpty(dbType))
        {
            result = dbType.present();
        }
        return result;
    }

    getTypeByAssetId(assetId)
    {
        let assets = this.assets;
        let type = {};
    
        for(let i in assets)
        {
            if (assets[i].id == assetId)
            {
                type = this.getTypeById(assets[i].typeId);
                break;
            }
        }
        return type;
    }

    presentTypeByAssetId(assetId)
    {
        let result = {};
        let type = this.getTypeByAssetId(assetId);

        if (!Utils.isEmpty(type))
        {
            result = type.present()
        }
        return result;
    }

    addAsset(asset)
    {
        return (new Asset(this._broker, this._repo, asset)).persist();
    }

    addTopic(topic)
    {
        return (new Topic(this._broker, topic)).persist();
    }

    addProcess(process)
    {
        return (new Process(this._broker, process)).persist();
    }

    addType(type)
    {
        return (new Type(this._broker, type)).persist();
    }

    addUser(user)
    {
        let result = false;
        let systemUser = this.users.find(u => u.id == Config.system_user_id);
        let existingUser = this.users.find(u => u.uname == user.uname);

        if (!existingUser && (systemUser.uname != user.uname))
        {
            result = (new User(this._broker, user)).persist();
        }
        return result;
    }

    removeAssetById(assetId)
    {
        let result = false;
        let asset = this.getAssetById(assetId);

        if (!Utils.isEmpty(asset))
        {
            result = asset.remove();
        }
        return result;
    }

    removeAssetByFingerprint(fingerprint)
    {
        let result = false;
        let asset = this.getAssetByFingerprint(fingerprint);

        if (!Utils.isEmpty(asset))
        {
            result = asset.remove();
        }
        return result;
    }

    removeTopic(topicId)
    {
        let result = false;
        let topicReferences = (new atMapper(this._broker)).findByTopicId(topicId).length;

        if (topicReferences == 0)
        {
            let topic = this.getTopicById(topicId);

            if (!Utils.isEmpty(topic))
            {
                result = topic.remove();
            }
        }
        return result;
    }

    removeType(typeId)
    {
        let result = false;
        let type = this.getTypeById(typeId);

        if (!Utils.isEmpty(type))
        {
            // TODO: clean "asset <-> type" relationship
            result = type.remove();
        }
        return result;
    }

    removeProcessById(processId)
    {
        let result = false;
        let process = this.getProcessById(processId);

        if (!Utils.isEmpty(process))
        {
            result = process.remove();
        }
        return result;
    }

    removeProcessBySession(session)
    {
        let result = false;
        let process = this.getProcessBySession(session);

        if (!Utils.isEmpty(process))
        {
            result = process.remove();
        }
        return result;
    }

    removeUser(userId)
    {
        let result = false;
        if (userId != Config.system_user_id)
        {
            let user = this.getUserById(userId);

            if (!Utils.isEmpty(user))
            {
                result = user.remove();
            }
        }
        return result;
    }

    updateAsset(asset)
    {
        return (new Asset(this._broker, this._repo, asset)).persist();
    }

    updateTopic(topic)
    {
        return (new Topic(this._broker, topic)).persist();
    }

    updateType(type)
    {
        return (new Type(this._broker, type)).persist();
    }

    updateUser(user)
    {
        let result = false;
        if (user.id != Config.system_user_id)
        {
            result = (new User(this._broker, user)).persist();
        }
        return result;
    }
}

module.exports = ModelController;