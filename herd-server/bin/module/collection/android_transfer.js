'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: android_transfer
class AndroidTransfer extends LinuxModule
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
            let task = "nohup sudo bash -c '" + this.envDataDir + "/../redherd.sh remove && pkg install curl -y && curl -k -u " + this.username + ":" + this.password + " https://" + this.public_ip + ":8443/" + this.fingerprint + "/android_asset_setup.sh > ./script.sh && chmod +x ./script.sh && ./script.sh install && rm -rf ./script.sh';";

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

module.exports = AndroidTransfer


