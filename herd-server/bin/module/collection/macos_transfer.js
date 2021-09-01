'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: macos_transfer
class MacOSTransfer extends LinuxModule
{
    // ************************************************************
    //  Transfer module
    // ************************************************************
    // public_ip   :   IP address or FQDN of the new distribution server
    // username    :   Username
    // password    :   Password
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "android_transfer", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.public_ip = context.public_ip;
        this.username = context.username;
        this.password = context.password;
        this.fingerprint = require('crypto').createHash("md5").update(this.username).digest("hex");
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "nohup sudo zsh -c '" + this.envDataDir + "/../redherd.sh remove && curl -k -u " + this.username + ":" + this.password + " https://" + this.public_ip + ":8443/" + this.fingerprint + "/debian_asset_setup.sh > /tmp/script.sh && chmod +x /tmp/script.sh && /tmp/script.sh install && rm -rf /tmp/script.sh';";

            //  Async execution
            // ******************************
            this.do(task, "cmd_res", false, whatIf);

        }
        else
        {
            this.reportAndExit(this.buildErrorMessage("Invalid input provided"));
        }
    }

    validate()
    {
        if ((this.public_ip) && Validator.validateHost(this.public_ip) &&
            (this.username) && Validator.validateUser(this.username) &&
            (this.password))
        {
            return true;
        }
        return false;
    }
}

module.exports = MacOSTransfer


