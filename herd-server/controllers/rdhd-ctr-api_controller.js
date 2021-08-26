'use strict';

// ************************************************************
//  Importing required Custom components
// ************************************************************
const Crypto = require('crypto');
const Config = require('../config');
const Utils = require('../bin/lib/rdhd-lib-common_utils');
const Validator = require('../bin/lib/rdhd-lib-input_validator');
const JSend = require('../proto/rdhd-prt-jsend_responses');

const AuthenticationController = require("./rdhd-ctr-authentication_controller");
const ModelController = require("./rdhd-ctr-model_controller");
const TerminalController = require('./rdhd-ctr-terminal_server_controller');
const WebProxyController = require('./rdhd-ctr-web_proxy_controller');
const TcpProxyController = require('./rdhd-ctr-tcp_proxy_controller');
const UdpProxyController = require('./rdhd-ctr-udp_proxy_controller');
const RtspRedirectorController = require('./rdhd-ctr-rtsp_redirector_controller');
const AssetsMonitor = require('./rdhd-ctr-assets_monitor_controller');
const ProcessKiller = require('../bin/job/rdhd-job-process_killer');

let msgServer = (Config.msg_over_ssl ? 'https' : 'http') + '://127.0.0.1:' + (Validator.validateTcpUdpPort(Config.msg_server_port) ? Config.msg_server_port : 3001);
let model = new ModelController();
let terminalController = new TerminalController();
let webProxyController = new WebProxyController();
let tcpProxyController = new TcpProxyController();
let udpProxyController = new UdpProxyController();
let rtspRedirectorController = new RtspRedirectorController();

// ************************************************************
//  Local functions
// ************************************************************
function runAssetWebProxy(assetId, data)
{
    let result;
    try
    {
        let isValidAssetId = Validator.validateId(assetId);
        let isEmptyOperation = !data.operation;

        if (isValidAssetId && !isEmptyOperation)
        {
            let asset = model.getAssetById(assetId);

            if (!Utils.isEmpty(asset))
            {
                switch (data.operation.toUpperCase())
                {
                    case 'ENABLE':
                        if (data.service.params)
                        {
                            if (Validator.validateTcpUdpPort(data.service.params.rport))
                            {
                                let pRange = Utils.getPortRangeObject(Config.services_port_range.first, Config.services_port_range.last);
                                result = JSend.success({ service: { enabled: true, ports: { port: webProxyController.spawn(asset.id, asset.ip, data.service.params.rport, pRange) } } });
                            }
                            else
                            {
                                result = JSend.fail({ reason: "Invalid rPort provided" });
                            }
                        }
                        else
                        {
                            result = JSend.fail({ reason: "No params provided" });
                        }
                        break;
                    case 'DISABLE':
                        webProxyController.destroyById(asset.id);
                        result = JSend.success({ service: { enabled : false } });
                        break;
                    default:
                        result = JSend.fail({ reason: "Invalid operation provided" });
                        break;
                }
            }
            else
            {
                result = JSend.fail({ reason: "Unexisting asset provided" });
            }
        }
        else if (!isValidAssetId)
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Empty operation provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

function runAssetTcpProxy(assetId, data)
{
    let result;
    try
    {
        let isValidAssetId = Validator.validateId(assetId);
        let isEmptyOperation = !data.operation;

        if (isValidAssetId && !isEmptyOperation)
        {
            let asset = model.getAssetById(assetId);

            if (!Utils.isEmpty(asset))
            {
                switch (data.operation.toUpperCase())
                {
                    case 'ENABLE':
                        if (data.service.params)
                        {
                            if (Validator.validateTcpUdpPort(data.service.params.rport))
                            {
                                let pRange = Utils.getPortRangeObject(Config.services_port_range.first, Config.services_port_range.last);
                                result = JSend.success({ service: { enabled: true, ports: { port: tcpProxyController.spawn(asset.id, asset.ip, data.service.params.rport, pRange) } } });
                            }
                            else
                            {
                                result = JSend.fail({ reason: "Invalid rPort provided" });
                            }
                        }
                        else
                        {
                            result = JSend.fail({ reason: "No params provided" });
                        }
                        break;
                    case 'DISABLE':
                        tcpProxyController.destroyById(asset.id);
                        result = JSend.success({ service: { enabled : false } });
                        break;
                    default:
                        result = JSend.fail({ reason: "Invalid operation provided" });
                        break;
                }
            }
            else
            {
                result = JSend.fail({ reason: "Unexisting asset provided" });
            }
        }
        else if (!isValidAssetId)
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Empty operation provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

function runAssetUdpProxy(assetId, data)
{
    let result;
    try
    {
        let isValidAssetId = Validator.validateId(assetId);
        let isEmptyOperation = !data.operation;

        if (isValidAssetId && !isEmptyOperation)
        {
            let asset = model.getAssetById(assetId);

            if (!Utils.isEmpty(asset))
            {
                switch (data.operation.toUpperCase())
                {
                    case 'ENABLE':
                        if (data.service.params)
                        {
                            if (Validator.validateTcpUdpPort(data.service.params.rport))
                            {
                                let pRange = Utils.getPortRangeObject(Config.services_port_range.first, Config.services_port_range.last);
                                result = JSend.success({ service: { enabled: true, ports: { port: udpProxyController.spawn(asset.id, asset.ip, data.service.params.rport, pRange) } } });
                            }
                            else
                            {
                                result = JSend.fail({ reason: "Invalid rPort provided" });
                            }
                        }
                        else
                        {
                            result = JSend.fail({ reason: "No params provided" });
                        }
                        break;
                    case 'DISABLE':
                        udpProxyController.destroyById(asset.id);
                        result = JSend.success({ service: { enabled : false } });
                        break;
                    default:
                        result = JSend.fail({ reason: "Invalid operation provided" });
                        break;
                }
            }
            else
            {
                result = JSend.fail({ reason: "Unexisting asset provided" });
            }
        }
        else if (!isValidAssetId)
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Empty operation provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

function runAssetRtspRedirector(assetId, data)
{
    let result;
    try
    {
        let isValidAssetId = Validator.validateId(assetId);
        let isEmptyOperation = !data.operation;

        if (isValidAssetId && !isEmptyOperation)
        {
            let asset = model.getAssetById(assetId);

            if (!Utils.isEmpty(asset))
            {
                switch (data.operation.toUpperCase())
                {
                    case 'ENABLE':
                        let pRange = Utils.getPortRangeObject(Config.services_port_range.first, Config.services_port_range.last);
                        let ports = rtspRedirectorController.spawn(asset.id, pRange);
                        result = JSend.success({ service: { enabled : true, ports: { cport : ports.cport, sport : ports.sport } } });
                        break;
                    case 'DISABLE':
                        rtspRedirectorController.destroyById(asset.id);
                        result = JSend.success({ service: { enabled : false } });
                        break;
                    default:
                        result = JSend.fail({ reason: "Invalid operation provided" });
                        break;
                }
            }
            else
            {
                result = JSend.fail({ reason: "Unexisting asset provided" });
            }
        }
        else if (!isValidAssetId)
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Empty operation provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

function runAssetTerminal(assetId, data)
{
    let result;
    try
    {
        let terminalServerOverSsl =  Validator.validateBool(Config.terminal_server_over_ssl) ? Config.terminal_server_over_ssl : false;
        let isValidAssetId = Validator.validateId(assetId);
        let isEmptyOperation = !data.operation;

        if (isValidAssetId && !isEmptyOperation)
        {
            let asset = model.getAssetById(assetId);

            if (!Utils.isEmpty(asset))
            {
                switch (data.operation.toUpperCase())
                {
                    case 'ENABLE':
                        let pRange = Utils.getPortRangeObject(Config.services_port_range.first, Config.services_port_range.last);
                        let command = (data.service.params) ? data.service.params.command : "";
                        result = JSend.success({ service: { enabled : true,  ports: { port: terminalController.spawn(asset.user, asset.ip, asset.id, asset.wport, command, terminalServerOverSsl, pRange) } } });
                        break;
                    case 'DISABLE':
                        terminalController.destroyById(asset.id);
                        result = JSend.success({ service: { enabled : false } });
                        break;
                    default:
                        result = JSend.fail({ reason: "Invalid operation provided" });
                        break;
                }
            }
            else
            {
                result = JSend.fail({ reason: "Unexisting asset provided" });
            }
        }
        else if (!isValidAssetId)
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Empty operation provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

// ************************************************************
//  API Functions (unrouted)
// ************************************************************
exports.isAuthenticatedApi = function isAuthenticatedApi(token)
{
    let result = false;
    try
    {
        result = AuthenticationController.isAuthenticated(token);
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = false;
    }
    return result;
}

exports.removeProcessByIdApi = function removeProcessByIdApi(processId)
{
    let result = false;
    try
    {
        if (Validator.validateId(processId))
        {
            result = model.removeProcessById(processId);
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = false;
    }
    return result;
}

exports.removeProcessBySessionApi = function removeProcessBySessionApi(session)
{
    let result = false;
    try
    {
        if (Validator.validateSessionId(session))
        {
            result = model.removeProcessBySession(session);
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = false;
    }
    return result;
}

exports.getEnabledUsersApi = function getEnabledUsersApi()
{
    let result;
    try
    {
        result = model.getEnabledUsers();
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = false;
    }
    return result;
}

// ************************************************************
//  API functions (routed)
// ************************************************************
exports.authenticateUserApi = function authenticateUserApi(credentials)
{
    // credentials = { username: string, password: string }
    let result;
    try
    {
        credentials = Utils.cleanObject(credentials);

        let isValidUser = Validator.validateUser(credentials.username);

        if (isValidUser)
        {
            let token = AuthenticationController.authenticate(credentials.username, credentials.password);
            if (token)
            {
                result = JSend.success({ token: token });
            } 
            else
            {
                result = JSend.fail({ reason: "Authentication failed" });
            }
        }
        else
        {
            result = JSend.fail({ reason: "Invalid credentials" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getAssetsApi = function getAssetsApi()
{
    let result;
    try
    {
        result = JSend.success({ assets: model.presentAssets() });
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.addAssetApi = function addAssetApi(asset)
{
    let result;
    try
    {
        asset = Utils.cleanObject(asset);

        let isValidAssetName = Validator.validateName(asset.name);
        let isValidAssetIp = Validator.validateIp(asset.ip);
        let isValidAssetUser = Validator.validateUser(asset.user);
        let isValidAssetFingerprint = Validator.validateFingerprint(asset.fingerprint);
        let isValidAssetDescription = ((asset.description === undefined) || Validator.validateDescription(asset.description));

        // TODO: implement an integrity check (the type must exist)
        let isValidAssetType = ((asset.id_type === undefined) || Validator.validateNumber(asset.id_type));

        if (isValidAssetName && isValidAssetIp && isValidAssetUser && isValidAssetFingerprint && isValidAssetDescription && isValidAssetType)
        {
            asset.wport = (Validator.validateTcpUdpPort(asset.wport)) ? asset.wport : 22;

            // asset: { name: string, ip: string, user: string, fingerprint: string [, description: string] [, "wport": int (default: 22)] }
            let isCreated = model.addAsset(asset);
            if (isCreated)
            {
                // Restart keepalive job
                (new AssetsMonitor(model.assets, msgServer)).restart(Config.keepalive_interval);

                // Return success message
                result = JSend.success(null);
            }
            else
            {
                result = JSend.fail({ reason: "Operation failed" });
            }
        }
        else if (!isValidAssetName)
        {
            result = JSend.fail({ reason: "Invalid assetName provided" });
        }
        else if (!isValidAssetIp)
        {
            result = JSend.fail({ reason: "Invalid assetIp provided" });
        }
        else if (!isValidAssetUser)
        {
            result = JSend.fail({ reason: "Invalid assetUser provided" });
        }
        else if (!isValidAssetFingerprint)
        {
            result = JSend.fail({ reason: "Invalid assetFingerprint provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid assetDescription provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getAssetApi = function getAssetApi(param)
{
    let result;
    try
    {
        let isValidAssetId = Validator.validateId(param);
        let isValidAssetFingerprint = Validator.validateFingerprint(param);

        if (isValidAssetId)
        {
            result = JSend.success({ asset: model.presentAssetById(param) });
        }
        else if (isValidAssetFingerprint)
        {
            result = JSend.success({ asset: model.presentAssetByFingerprint(param) });
        }
        else if (!isValidAssetId)
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid assetFingerprint provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.updateAssetApi = function updateAssetApi(param, fields)
{
    let result;
    let isKeepAliveRestartRequired = false;
    try
    {
        let asset = Utils.cleanObject(fields);
        if (asset)
        {
            let isValidAssetId = Validator.validateId(param);
            let isValidAssetFingerprint = Validator.validateFingerprint(param);
    
            if (isValidAssetId)
            {
                asset.id = model.getAssetById(param).id;
            }
            else if (isValidAssetFingerprint)
            {
                asset.id = model.getAssetByFingerprint(param).id;
                isValidAssetFingerprint = false;
            }

            // Assigning null to fingreprint property to avoid modification
            asset.fingerprint = null;
            asset = Utils.cleanObject(asset);

            // Validate asset ID a second time to be sure the asset exists
            isValidAssetId = Validator.validateId(asset.id);

            let isValidAssetName = ((asset.name === undefined) || Validator.validateName(asset.name));
            let isValidAssetIp = ((asset.ip === undefined) || Validator.validateIp(asset.ip));
            let isValidAssetUser = ((asset.user === undefined) || Validator.validateUser(asset.user));
            let isValidAssetDescription = ((asset.description === undefined) || Validator.validateDescription(asset.description));
            let isValidAssetPort = ((asset.wport === undefined) || Validator.validateTcpUdpPort(asset.wport));
            let isValidJoinedValue = ((asset.joined === undefined) || Validator.validateBool(asset.joined));

            // Normalizing Joined param value
            if (asset.joined)
            {
                asset.joined = Validator.validatePositiveBool(asset.joined) ? 1 : 0;
            }

            // TODO: implement an integrity check (the type must exist)
            let isValidAssetType = ((asset.id_type === undefined) || Validator.validateNumber(asset.id_type));

            isKeepAliveRestartRequired = (Validator.validateIp(asset.ip) || Validator.validateTcpUdpPort(asset.wport) || Validator.validateUser(asset.user) || Validator.validateBool(asset.joined));

            if ((isValidAssetId || isValidAssetFingerprint) &&
                isValidAssetName &&
                isValidAssetIp &&
                isValidAssetUser &&
                isValidAssetDescription &&
                isValidAssetPort &&
                isValidAssetType &&
                isValidJoinedValue)
            {
                // asset: { id: string, name: string, ip: string, description: string, user: string, fingerprint: string [, "wport": int (default: 22)] [, "id_type": int (default: null)] }
                let isUpdated = model.updateAsset(asset);
                if (isUpdated)
                {
                    result = JSend.success(null);

                    if (isKeepAliveRestartRequired)
                    {
                        let delay = Config.keepalive_interval * 1000 * 2;

                        // Restart keepalive job
                        // Added a delay to be sure that at least another asset keep_alive check is triggered
                        setTimeout(() => {
                            (new AssetsMonitor(model.assets, msgServer)).restart(Config.keepalive_interval);
                        }, delay);
                    }
                }
                else
                {
                    result = JSend.fail({ reason: "Operation failed" });
                }
            }
            else if ((!isValidAssetId) || (!isValidAssetFingerprint))
            {
                result = JSend.fail({ reason: "Invalid asset identification param" });
            }
            else if (!isValidAssetName)
            {
                result = JSend.fail({ reason: "Invalid assetName provided" });
            }
            else if (!isValidAssetIp)
            {
                result = JSend.fail({ reason: "Invalid assetIp provided" });
            }
            else if (!isValidAssetPort)
            {
                result = JSend.fail({ reason: "Invalid asswtWPort provided" });
            }
            else if (!isValidAssetUser)
            {
                result = JSend.fail({ reason: "Invalid assetUser provided" });
            }
            else if (!isValidAssetDescription)
            {
                result = JSend.fail({ reason: "Invalid assetDescription provided" });
            }
            else
            {
                result = JSend.fail({ reason: "Invalid asset join status" });
            }
        }
        else
        {
            result = JSend.fail({ reason: "Nothing to update" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.removeAssetApi = function removeAssetApi(param)
{
    let result;
    try
    {
        let isValidAssetId = Validator.validateId(param);
        let isValidAssetFingerprint = Validator.validateFingerprint(param);

        let isDeleted = false;
        if (isValidAssetId)
        {
            isDeleted = model.removeAssetById(param);
        }
        else if (isValidAssetFingerprint)
        {
            isDeleted = model.removeAssetByFingerprint(param);
        }

        if (isDeleted)
        {
            // Restart keepalive job
            (new AssetsMonitor(model.assets, msgServer)).restart(Config.keepalive_interval);

            // Return success message
            result = JSend.success(null);
        }
        else if (!isValidAssetId)
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
        else if (!isValidAssetFingerprint)
        {
            result = JSend.fail({ reason: "Invalid assetFingerprint provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Operation failed" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.runAssetServiceApi = function runAssetServiceApi(assetId, data)
{
    let result;
    try
    {
        let isValidAssetId = Validator.validateId(assetId);
        let isServiceDeclared = data.service;

        if (isValidAssetId && isServiceDeclared)
        {
            switch (data.service.type.toUpperCase())
            {
                case 'HTTP_PROXY':
                    result = runAssetWebProxy(assetId, data);
                    break;
                case 'TCP_PROXY':
                    result = runAssetTcpProxy(assetId, data);
                    break;
                case 'UDP_PROXY':
                    result = runAssetUdpProxy(assetId, data);
                    break;
                case 'RTSP_REDIRECTOR':
                    result = runAssetRtspRedirector(assetId, data);
                    break;
                case 'TERMINAL':
                    result = runAssetTerminal(assetId, data);
                    break;
                default:
                    result = JSend.fail({ reason: "Invalid type provided" });
                    break;
            }
        }
        else if (!isServiceDeclared)
        {
            result = JSend.fail({ reason: "Empty service provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getTopicsByAssetIdApi = function getTopicsByAssetIdApi(assetId)
{
    let result;
    try
    {
        if (Validator.validateId(assetId))
        {
            result = JSend.success({ topics: model.presentTopicsByAssetId(assetId) });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.addTopicToAssetApi = function addTopicToAssetApi(assetId, topic)
{
    let result;
    try
    {
        let isValidAssetId = Validator.validateId(assetId);
        let isValidTopicId = Validator.validateId(topic.topicId);

        if (isValidAssetId && isValidTopicId)
        {
            // topic: { topicId: int }
            let isLinked = (model.getAssetById(assetId)).addTopic(topic.topicId);
            if (isLinked)
            {
                result = JSend.success(null);
            }
            else
            {
                result = JSend.fail({ reason: "Operation failed" });
            }
        }
        else if (!isValidAssetId)
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid topicId provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.removeTopicFromAssetApi = function removeTopicFromAssetApi(assetId, topicId)
{
    let result;
    try
    {
        let isValidAssetId = Validator.validateId(assetId);
        let isValidTopicId = Validator.validateId(topicId);

        if (isValidAssetId && isValidTopicId)
        {
            let isRemoved = (model.getAssetById(assetId)).removeTopic(topicId);
            if (isRemoved)
            {
                result = JSend.success(null);
            }
            else
            {
                result = JSend.fail({ reason: "Operation failed" });
            }
        }
        else if (!isValidAssetId)
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid topicId provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getModulesByAssetIdApi = function getModulesByAssetIdApi(assetId)
{
    let result;
    try
    {
        if (Validator.validateId(assetId))
        {
            result = JSend.success({ modules: model.presentModulesByAssetId(assetId) });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.runModuleApi = function runModuleApi(assetId, moduleName, moduleData, token = '')
{
    // Note: the "moduleData.params" object needs validation at module level
    let result;
    try
    {
        let isValidAssetId = Validator.validateId(assetId);
        let isValidModuleName = Validator.validateName(moduleName);

        if (isValidAssetId && isValidModuleName)
        {
            const Module = require(Config.modules_directory + moduleName);

            let session = Crypto.createHash("md5").update(Math.random().toString()).digest("hex");
            let asset = model.getAssetById(assetId);
            
            if (!Utils.isEmpty(asset))
            {
                let m = new Module(asset.present(), moduleData.params, session, msgServer, token);

                let assetTopics = asset.topics;
                let moduleTopic = model.getModuleByName(moduleName).topic;

                if (assetTopics.some(e => e.name === moduleTopic))
                {
                    switch (moduleData.mode.toUpperCase())
                    {
                        case "EXECUTE":
                            if (Utils.isFunction(m, "run"))
                            {
                                m.run();
                                result = JSend.success({ instance: { session: session, result: null } });
                            }
                            else
                            {
                                result = JSend.fail({ reason: "Not Implemented" });
                            }
                            break;
                        case "CONFIGURE":
                            if (Utils.isFunction(m, "configure"))
                            {
                                m.configure();
                                result = JSend.success({ instance: { session: session, result: null } });
                            }
                            else
                            {
                                result = JSend.fail({ reason: "Not Implemented" });
                            }
                            break;
                        case "INTERACT":
                            if (Utils.isFunction(m, "interact"))
                            {
                                result = JSend.success({ instance: { session: session, result: m.interact() } });
                            }
                            else
                            {
                                result = JSend.fail({ reason: "Not Implemented" });
                            }
                            break;
                        case "PIVOT":
                            if (Utils.isFunction(m, "pivot"))
                            {
                                m.pivot();
                                result = JSend.success({ instance: { session: session, result: null } });
                            }
                            else
                            {
                                result = JSend.fail({ reason: "Not Implemented" });
                            }
                            break;
                        default:
                            result = JSend.fail({ reason: "Invalid mode provided" });
                            break;
                    }
                }
                else
                {
                    result = JSend.fail({ reason: "Module not available" });
                }

                if ((result.status == "success") && (moduleData.mode.toUpperCase() != "INTERACT"))
                {
                    model.addProcess({ module: moduleName, id_asset: assetId, session: session });
                }
            }
            else
            {
                result = JSend.fail({ reason: "Asset not found" });
            }
        }
        else if (!isValidAssetId)
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid moduleName provided" });
        }
    }
    catch (e)   
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.runModuleMultiAssetApi = function runModuleMultiAssetApi(moduleName, moduleData, token = '')
{
    // Note: the "moduleData.params" object needs validation at module level
    let result;
    try
    {
        let isValidModuleName = Validator.validateName(moduleName);

        if (isValidModuleName)
        {
            if (moduleData.assets && (moduleData.assets.length > 0))
            {
                result = [];
                for (let i in moduleData.assets)
                {
                    try
                    {
                        let isValidAssetId = Validator.validateId(moduleData.assets[i]);

                        if (isValidAssetId)
                        {
                            const Module = require(Config.modules_directory + moduleName);

                            let session = Crypto.createHash("md5").update(Math.random().toString()).digest("hex");
                            let asset = model.getAssetById(moduleData.assets[i]);
                            
                            if (!Utils.isEmpty(asset))
                            {
                                let m = new Module(asset.present(), moduleData.params, session, msgServer, token);

                                let assetTopics = asset.topics;
                                let moduleTopic = model.getModuleByName(moduleName).topic;
                    
                                if (assetTopics.some(e => e.name === moduleTopic))
                                {
                                    switch (moduleData.mode.toUpperCase())
                                    {
                                        case "EXECUTE":
                                            if (Utils.isFunction(m, "run"))
                                            {
                                                m.run();
                                                result.push(JSend.success({ instance: { session: session, result: null } }));
                                            }
                                            else
                                            {
                                                result.push(JSend.fail({ reason: "Not Implemented" }));
                                            }
                                            break;
                                        case "CONFIGURE":
                                            if (Utils.isFunction(m, "configure"))
                                            {
                                                m.configure();
                                                result.push(JSend.success({ instance: { session: session, result: null } }));
                                            }
                                            else
                                            {
                                                result.push(JSend.fail({ reason: "Not Implemented" }));
                                            }
                                            break;
                                        default:
                                            result.push(JSend.fail({ reason: "Incompatible mode provided" }));
                                            break;
                                    }
                                }
                                else
                                {
                                    result.push(JSend.fail({ reason: "Module not available" }));
                                }

                                if (result[result.length - 1].status == "success")
                                {
                                    model.addProcess({ module: moduleName, id_asset: asset.id, session: session });
                                }
                            }
                            else
                            {
                                result.push(JSend.fail({ reason: "Asset not found" }));
                            }
                        }
                        else
                        {
                            result.push(JSend.fail({ reason: "Invalid assetId provided" }));
                        }
                    }
                    catch (e)
                    {
                        if (Config.debug_mode)
                        {
                            console.log(e);
                        }
                        result.push(JSend.error(e.message));
                    }
                }

                if (result.every(e => (e.status === "fail" || e.status === "error")))
                {
                    result = JSend.fail({ reason: "Failed to launch all modules", details: result });
                }
                else
                {
                    result = JSend.success({ instances: result });
                }
            }
        }
        else
        {
            result = JSend.fail({ reason: "Invalid moduleName provided" });
        }
    }
    catch (e)   
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getProcessesByAssetIdApi = function getProcessesByAssetIdApi(assetId)
{
    let result;
    try
    {
        if (Validator.validateId(assetId))
        {
            result = JSend.success({ processes: model.presentProcessesByAssetId(assetId) });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid assetId provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getModulesApi = function getModulesApi()
{
    let result;
    try
    {
        let m = model.modules;
        let modules = [];

        for (let i in m)
        {
            modules.push(m[i].present());
        }
        result = JSend.success({ modules: modules });
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getModuleByNameApi = function getModuleByNameApi(moduleName)
{
    let result;
    try
    {
        if (Validator.validateName(moduleName))
        {
            result = JSend.success({ module: model.presentModuleByName(moduleName) });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid moduleName provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getTopicsApi = function getTopicsApi()
{
    let result;
    try
    {
        result = JSend.success({ topics: model.presentTopics() });
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getTopicApi = function getTopicApi(param)
{
    let result;
    try
    {
        let isValidTopicId = Validator.validateId(param);
        let isValidTopicName = Validator.validateName(param);

        if (isValidTopicId)
        {
            result = JSend.success({ topic: model.presentTopicById(param) });
        }
        else if (isValidTopicName)
        {
            result = JSend.success({ topic: model.presentTopicByName(param) });
        }
        else if (!isValidTopicId)
        {
            result = JSend.fail({ reason: "Invalid topicId provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid topicName provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.addTopicApi = function addTopicApi(topic)
{
    let result;
    try
    {
        let _topic = Utils.cleanObject(topic);

        let isValidTopicName = Validator.validateName(_topic.name);
        let isValidTopicDescription = ((_topic.description === undefined) || Validator.validateDescription(_topic.description));

        if (isValidTopicName && isValidTopicDescription)
        {
            // topic: { name: string, description: string }
            let isAdded = model.addTopic(_topic);
            if (isAdded)
            {
                result = JSend.success(null);
            }
            else
            {
                result = JSend.fail({ reason: "Operation failed" });
            }
        }
        else if (!isValidTopicName)
        {
            result = JSend.fail({ reason: "Invalid topicName provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid topicDescription provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.updateTopicApi = function updateTopicApi(topicId, fields)
{
    let result;
    try
    {
        let topic = Utils.cleanObject(fields);
        if (topic)
        {
            topic.id = topicId;
            let isValidTopicId = Validator.validateId(topic.id);
            let isValidTopicName = ((topic.name === undefined) || Validator.validateName(topic.name));
            let isValidTopicDescription = ((topic.description === undefined) || Validator.validateDescription(topic.description));

            if (isValidTopicId && isValidTopicName && isValidTopicDescription)
            {
                // topic: { id: string, name: string, description: string }
                let isUpdated = model.updateTopic(topic);
                if (isUpdated)
                {
                    result = JSend.success(null);
                }
                else
                {
                    result = JSend.fail({ reason: "Operation failed" });
                }
            }
            else if (!isValidTopicId)
            {
                result = JSend.fail({ reason: "Invalid topicId provided" });
            }
            else if (!isValidTopicName)
            {
                result = JSend.fail({ reason: "Invalid topicName provided" });
            }
            else
            {
                result = JSend.fail({ reason: "Invalid topicDescription provided" });
            }
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.removeTopicApi = function removeTopicApi(topicId)
{
    let result;
    try
    {
        if (Validator.validateId(topicId))
        {
            let isDeleted = model.removeTopic(topicId);
            if (isDeleted)
            {
                result = JSend.success(null);
            }
            else
            {
                result = JSend.fail({ reason: "Operation failed" });
            }
        }
        else
        {
            result = JSend.fail({ reason: "Invalid topicId provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getAssetsByTopicApi = function getAssetsByTopicApi(param)
{
    let result;
    try
    {
        let isValidTopicId = Validator.validateId(param);
        let isValidTopicName = Validator.validateName(param);

        if (isValidTopicName)
        {
            result = JSend.success({ assets: model.presentAssetsByTopicName(param) });
        }
        else if (isValidTopicId)
        {
            result = JSend.success({ assets: model.presentAssetsByTopicId(param) });
        }
        else if (!isValidTopicName)
        {
            result = JSend.fail({ reason: "Invalid topicName provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid topicId provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getProcessesApi = function getProcessesApi()
{
    let result;
    try
    {
        result = JSend.success({ processes: model.presentProcesses() });
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getProcessByIdApi = function getProcessByIdApi(processId)
{
    let result;
    try
    {
        if (Validator.validateId(processId))
        {
            result = JSend.success({ process: model.presentProcessById(processId) });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid processId provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.killProcessApi = function killProcessApi(processId)
{
    let result;
    try
    {
        if (Validator.validateId(processId))
        {
            let process = model.getProcessById(processId);
            let asset = model.getAssetById(process.assetId);

            if (!Utils.isEmpty(asset))
            {
                ProcessKiller.run(asset, process.module, false, msgServer);
            }
            
            let isRemoved = model.removeProcessById(processId);
            if (isRemoved)
            {
                result = JSend.success(null);
            }
            else
            {
                result = JSend.fail({ reason: "Operation failed" });
            }
        }
        else
        {
            result = JSend.fail({ reason: "Invalid processId provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getTypesApi = function getTypesApi()
{
    let result;
    try
    {
        result = JSend.success({ types: model.presentTypes() });
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getTypeApi = function getTypeApi(param)
{
    let result;
    try
    {
        let isValidTypeId = Validator.validateId(param);
        let isValidTypeName = Validator.validateName(param);

        if (isValidTypeId)
        {
            result = JSend.success({ type: model.presentTypeById(param) });
        }
        else if (isValidTypeName)
        {
            result = JSend.success({ type: model.presentTypeByName(param) });
        }
        else if (!isValidTypeId)
        {
            result = JSend.fail({ reason: "Invalid typeId provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid typeName provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.addTypeApi = function addTypeApi(type)
{
    let result;
    try
    {
        let _type = Utils.cleanObject(type);

        let isValidTypeName = Validator.validateName(_type.name);
        let isValidTypeDescription = ((_type.description === undefined) || Validator.validateDescription(_type.description));

        if (isValidTypeName && isValidTypeDescription)
        {
            // type: { name: string, description: string }
            let isAdded = model.addType(_type);
            if (isAdded)
            {
                result = JSend.success(null);
            }
            else
            {
                result = JSend.fail({ reason: "Operation failed" });
            }
        }
        else if (!isValidTypeName)
        {
            result = JSend.fail({ reason: "Invalid typeName provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid typeDescription provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.updateTypeApi = function updateTypeApi(typeId, fields)
{
    let result;
    try
    {
        let type = Utils.cleanObject(fields);
        if (type)
        {
            type.id = typeId;
            let isValidTypeId = Validator.validateId(type.id);
            let isValidTypeName = ((type.name === undefined) || Validator.validateName(type.name));
            let isValidTypeDescription = ((type.description === undefined) || Validator.validateDescription(type.description));

            if (isValidTypeId && isValidTypeName && isValidTypeDescription)
            {
                // type: { id: string, name: string, description: string }
                let isUpdated = model.updateType(type);
                if (isUpdated)
                {
                    result = JSend.success(null);
                }
                else
                {
                    result = JSend.fail({ reason: "Operation failed" });
                }
            }
            else if (!isValidTypeId)
            {
                result = JSend.fail({ reason: "Invalid typeId provided" });
            }
            else if (!isValidTypeName)
            {
                result = JSend.fail({ reason: "Invalid typeName provided" });
            }
            else
            {
                result = JSend.fail({ reason: "Invalid typeDescription provided" });
            }
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.removeTypeApi = function removeTypeApi(typeId)
{
    let result;
    try
    {
        if (Validator.validateId(typeId))
        {
            let isDeleted = model.removeType(typeId);
            if (isDeleted)
            {
                result = JSend.success(null);
            }
            else
            {
                result = JSend.fail({ reason: "Operation failed" });
            }
        }
        else
        {
            result = JSend.fail({ reason: "Invalid typeId provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getUsersApi = function getUsersApi()
{
    let result;
    try
    {
        result = model.presentUsers();
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = false;
    }
    return result;
}

exports.getUserApi = function getUserApi(param)
{
    let result;
    try
    {
        let isValidUserId = Validator.validateId(param);
        let isValidUserName = Validator.validateUser(param);

        if (isValidUserId)
        {
            result = JSend.success({ type: model.presentUserById(param) });
        }
        else if (isValidUserName)
        {
            result = JSend.success({ type: model.presentUserByName(param) });
        }
        else if (!isValidTypeId)
        {
            result = JSend.fail({ reason: "Invalid userId provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid userName provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.addUserApi = function addUserApi(user)
{
    let result;
    try
    {
        let _user = Utils.cleanObject(user);

        let isValidUserName = Validator.validateUser(_user.uname);
        let isValidUserStatus = Validator.validateBinaryNumber(_user.enabled);

        if (isValidUserName && isValidUserStatus)
        {
            // user: { uname: string, secret: string, enabled: bool }
            let isAdded = model.addUser(_user);
            if (isAdded)
            {
                result = JSend.success(null);
            }
            else
            {
                result = JSend.fail({ reason: "Operation failed" });
            }
        }
        else if (!isValidUserName)
        {
            result = JSend.fail({ reason: "Invalid userName provided" });
        }
        else
        {
            result = JSend.fail({ reason: "Invalid userStatus provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.updateUserApi = function updateUserApi(userId, fields)
{
    let result;
    try
    {
        // This workaround is needed to avoid username modification
        fields.uname = "";
        let user = Utils.cleanObject(fields);
        if (user)
        {
            user.id = userId;
            let isValidUserId = Validator.validateId(user.id);
            let isValidUserName = ((user.uname === undefined) || Validator.validateUser(user.uname));
            let isValidUserStatus = ((user.enabled === undefined) || Validator.validateBinaryNumber(user.enabled));

            if (isValidUserId && isValidUserName && isValidUserStatus)
            {
                let isUpdated = model.updateUser(user);
                if (isUpdated)
                {
                    result = JSend.success(null);
                }
                else
                {
                    result = JSend.fail({ reason: "Operation failed" });
                }
            }
            else if (!isValidUserId)
            {
                result = JSend.fail({ reason: "Invalid userId provided" });
            }
            else if (!isValidUserName)
            {
                result = JSend.fail({ reason: "Invalid userName provided" });
            }
            else
            {
                result = JSend.fail({ reason: "Invalid userStatus provided" });
            }
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.removeUserApi = function removeUserApi(userId)
{
    let result;
    try
    {
        if (Validator.validateId(userId))
        {
            let isDeleted = model.removeUser(userId);
            if (isDeleted)
            {
                result = JSend.success(null);
            }
            else
            {
                result = JSend.fail({ reason: "Operation failed" });
            }
        }
        else
        {
            result = JSend.fail({ reason: "Invalid userId provided" });
        }
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}

exports.getSystemApi = function getSystemApi()
{
    let result;
    try
    {
        result = JSend.success({ system: model.presentSystem() });
    }
    catch (e)
    {
        if (Config.debug_mode)
        {
            console.log(e);
        }
        result = JSend.error(e.message);
    }
    return result;
}
