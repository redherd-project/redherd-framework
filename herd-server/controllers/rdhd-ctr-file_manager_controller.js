'use strict';

const FileManagerFactory = require('../bin/lib/rdhd-lib-file_manager_factory');
const WebProxyFactory = require('../bin/lib/rdhd-lib-web_proxy_factory');

class FileManagerController
{
    constructor() { }

    spawn(bindAddress, serverPort = 30002, proxyPort = 3002, mountDir = '/', key = '', cert = '', ca = '', auth = false, ssl = false)
    {
        let result = true;

        try 
        {
            FileManagerFactory.spawn(bindAddress, serverPort, mountDir);
            WebProxyFactory.spawn(proxyPort, '127.0.0.1', serverPort, key, cert, ca, auth, ssl);
        }
        catch (e)
        {
            result = false;
        }
        return result;
    }
}

module.exports = FileManagerController;