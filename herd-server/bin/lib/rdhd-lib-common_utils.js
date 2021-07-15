'use strict';

const GetPort = require('get-port');
const Validator = require('./rdhd-lib-input_validator');

// ************************************************************
//  Utility Functions
// ************************************************************
function getFreePort(options)
{
    const deasync = require('deasync');
    
    let done = false;
    let freeport = null;
    let error = null;

    GetPort(options)
        .then(port => {
            done = true;
            freeport = port;
        })
        .catch(err => {
            done = true;
            error = err;
        });

    deasync.loopWhile(() => !done);

    if (error)
    {
        throw error
    }
    else
    {
        return freeport
    }
}

function getFreePortInRange(fromPort, toPort)
{
    return getFreePort({ port: GetPort.makeRange(fromPort, toPort) });
}

function getPortRangeObject(first, last)
{
    let pRange = { first: 30000, last: 45000 }
    let isValidPortRange = ((Validator.validateTcpUdpPortRange(first + "-" + last)) && (first < last) ) ? true : false;
    if (isValidPortRange)
    {
        pRange.first = first;
        pRange.last = last;
    }
    return pRange;
}

function cleanObject(object)
{
    let result;
    try
    {
        let properties = Object.getOwnPropertyNames(object);
        for (let i = 0; i < properties.length; i++)
        {
            let property = properties[i];
            if (object[property] === null || object[property] === undefined || object[property] === "")
            {
                delete object[property];
            }
        }
        result = object;
    }
    catch (e)
    {
        result = false;
    }
    return result;
}

function isEmpty(object)
{
    let result = true;
    try
    {
        for(let key in object)
        {
            if(object.hasOwnProperty(key))
            {
                result = false;
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

function isFunction(object, method)
{
    let result;
    try
    {
        if(typeof object[method] === 'function')
        {
            result = true;
        }
        else if (typeof myObj.prop2 === 'undefined')
        {
            result = false;
        }
        else
        {
            result = false;
        }
    }
    catch (e)
    {
        result = false;
    }
    return result;
}

function isSecuredRoute(route, securedRoutes)
{
    let result = false;
    try
    {
        for (let i in securedRoutes)
        {
            if (securedRoutes[i].test(route))
            {
                result = true;
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

function presentCollectionElements(collection)
{
    let result = [];
    try
    {
        let wCollection = (collection) ? Array.from(collection) : [];
        for (let i in wCollection)
        {
            if (this.isFunction(wCollection[i], "present"))
            {
                result.push(wCollection[i].present());
            }
        }
    }
    catch (e)
    {
        result = false;
    }
    return result;
}

module.exports = {
    getFreePort,
    getFreePortInRange,
    getPortRangeObject,
    cleanObject,
    isFunction,
    isEmpty,
    isSecuredRoute,
    presentCollectionElements
}