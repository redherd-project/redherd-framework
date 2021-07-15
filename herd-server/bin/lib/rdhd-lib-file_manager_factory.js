'use strict';

const { spawn } = require("child_process");

class FileManagerFactory
{
    static spawn(bindAddress, bindPort, mountDir = '/')
    {
        try
        {
            let fileManagerConf = [ "-s", bindAddress,
                                    "-p", bindPort,
                                    "-d", mountDir ];
        
            spawn("node-file-manager", fileManagerConf);

            return bindPort;
        }
        catch (e)
        {
            return false;
        }
    }
}

module.exports = FileManagerFactory;