'use strict';

const LinuxModule = require('../base/rdhd-mod-base_linux_module');

// moduleCode: debian_spawnto
class DebianSpawnTo extends LinuxModule
{
    // ************************************************************
    //  Ping module
    // ************************************************************
    // target   :   IP address or FQDN to ping
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "debian_spawnto", session, wsServer, token);

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
            let task = "if [ -f /.dockerenv ]; then \
                            sed -i '/^DSTRSRV_PUBLIC_ADDRESS/d' /etc/environment && \
                            unset DSTRSRV_PUBLIC_ADDRESS && \
                            sed -i '/^USERNAME/d' /etc/environment && \
                            unset USERNAME && \
                            sed -i '/^PASSWORD/d' /etc/environment && \
                            unset PASSWORD && \
                            echo \"DSTRSRV_PUBLIC_ADDRESS=" + this.public_ip + "\" >> /etc/environment && \
                            export DSTRSRV_PUBLIC_ADDRESS=" + this.public_ip + " && \
                            echo \"USERNAME=" + this.username + "\" >> /etc/environment && \
                            export USERNAME=" + this.username + " && \
                            echo \"PASSWORD=" + this.password + "\" >> /etc/environment && \
                            export PASSWORD=" + this.password + " && \
                            rm -f $INSTALLATION_PATH/config.ovpn /tmp/redherd.lock && killall openvpn sshd; \
                        else \
                            nohup sudo bash -c '" + this.envDataDir + "/../redherd.sh remove && curl -k -u " + this.username + ":" + this.password + " https://" + this.public_ip + ":8443/" + this.fingerprint + "/debian_asset_setup.sh > /tmp/script.sh && chmod +x /tmp/script.sh && /tmp/script.sh install && rm -rf /tmp/script.sh'; \
                        fi";

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
        return true;
    }
}

module.exports = DebianSpawnTo


