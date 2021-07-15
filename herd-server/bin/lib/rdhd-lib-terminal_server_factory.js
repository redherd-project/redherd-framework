'use strict';

// ************************************************************
// The following line of code is deprecated due to wetty installation at system level
// ************************************************************
//const wetty = require(__dirname + '/../../console/wetty/dist').default;
const ServiceFinalizer = require('./base/rdhd-lib-service_finalizer');
const { spawn } = require("child_process");

class TerminalServerFactory
{
    static spawn(ip, user, port, key, endPoint = '/', ssl = '', remoteSshPort = 22, command = '')
    {
        try
        {
            // ************************************************************
            //  Configure WeTTY parameters
            //
            //  REF: https://github.com/butlerx/wetty/blob/master/docs/API.md#module_WeTTy..start
            //
            //  NOTE: bypasshelmet parameter is used to enable/disable xss
            //  protections. If you set it to false you can insert wetty
            //  console in an iframe otherwise the "X-Frame-Options" header
            //  (set to "sameorigin") prevents iframe usage from different
            //  location other than wetty server
            // ************************************************************
            
            // [11.14.2020] Wetty upgraded to version 2.0.2:
            // - Some Wetty options have been modified with a different key;
            // - The "bypasshelmet" option is now named "allow-iframe".
            // ************************************************************
            let wettyConf = ssl ? [
                                    "--ssl-key", ssl.key,
                                    "--ssl-cert", ssl.cert,
                                    "--ssh-host", ip,
                                    "--ssh-port", remoteSshPort,
                                    "--ssh-user", user,
                                    "--title", "Console",
                                    "--ssh-auth", "publickey",
                                    "--ssh-key", key,
                                    "--base", endPoint,
                                    "--port", port,
                                    "--allow-iframe", true,
                                    "--host", "127.0.0.1",
                                    "--force-ssh", true,
                                    "--command", command
                                  ] : [   
                                    "--ssh-host", ip,
                                    "--ssh-port", remoteSshPort,
                                    "--ssh-user", user,
                                    "--title", "Console",
                                    "--ssh-auth", "publickey",
                                    "--ssh-key", key,
                                    "--base", endPoint,
                                    "--port", port,
                                    "--allow-iframe", true,
                                    "--host", "127.0.0.1",
                                    "--force-ssh", true,
                                    "--command", command
                                  ];
        
            spawn("wetty", wettyConf);

            // ************************************************************
            // The following code is deprecated due to wetty installation at system level
            // ************************************************************

            // ************************************************************
            //  Configure remote host SSH parameters
            // ************************************************************
            //let ssh = { user: user, host: ip, port: remoteSshPort, auth: "publickey", key: key };
            // ************************************************************
            //  Configure remote host WeTTY server parameters
            // ************************************************************
            //let wettyConf = { base: endPoint, host: "127.0.0.1", port: port, title: "Console", bypasshelmet: true };
            // ************************************************************
            //  Start WeTTY instance
            // ************************************************************
            //wetty.start(ssh, wettyConf, '', ssl).then(() => {});

            return port;
        }
        catch (e)
        {
            return false;
        }
    }

    static destroy(port)
    {
        return ServiceFinalizer.destroy(port);
    }
}

module.exports = TerminalServerFactory;