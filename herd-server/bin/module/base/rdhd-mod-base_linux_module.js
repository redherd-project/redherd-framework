'use strict';

const Module = require('./rdhd-mod-base_module');

class LinuxModule extends Module
{
    constructor(asset, moduleCode, session = "0", wsServer = 'http://127.0.0.1:3001', token = '')
    {
        super(asset, moduleCode, session, wsServer, token);

        //  Config ENV entries
        // ******************************
        this.envFTPServer = "$" + Config.asset_env.ftp_server;
        this.envHerdServer = "$" + Config.asset_env.herd_server;
        this.envDataDir = "$" + Config.asset_env.data_dir;
    }

    buildSslOptions()
    {
        //  Generate the ssl component of the lftp command
        // ******************************

        //  Ftp ssl connection options
        // ******************************
        let result = "";

        if (Validator.validateBool(Config.ftp_over_ssl) && Config.ftp_over_ssl)
        {
            let sslBaseOptions = "set ftp:ssl-auth TLS;set ftp:ssl-force true;set ftp:ssl-protect-data true;set ssl:check-hostname false;";
            let sslDebugOptions = "set ssl:verify-certificate false;";
            let sslOptions = Config.debug_mode ? sslBaseOptions + sslDebugOptions : sslBaseOptions;

            result = sslOptions;
        }
        return result;
    }

    buildMirrorOptions(reverse = false)
    {
        //  Generate the ssl and mirror component of the lftp command
        //
        //  NOTE: in the case below an entire folder is synced with an ftp server (delta only)
        // ******************************

        //  Ftp connection options
        // ******************************
        let sslOptions = this.buildSslOptions();
        
        // NOTE: add "--delete" to remove files from source
        let mirrorOptions = sslOptions + "mirror --continue --only-newer --parallel=5";

        // NOTE: the commented command below empties the destunation before mirror
        //mirrorOptions = del ? mirrorOptions + " --delete" : mirrorOptions;

        return reverse ? mirrorOptions + " --reverse" : mirrorOptions;
    }

    buildPullMirrorCommand(del = false)
    {
        //  Generate a command used to GET files from an ftp server
        //
        //  NOTE: in the case below an entire folder is synced with an ftp server (delta only)
        //  NOTE: the "del" parameter set to "true" removes the file(s) from the source
        // ******************************
        let result = false;

        // Retrieve the ssl and mirror component of the lftp command (reverse == false)
        let options = this.buildMirrorOptions(false);

        if (Validator.validateBool(Config.ftp_over_ssl) && Validator.validateTcpUdpPort(Config.ftp_server_port) && options)
        {
            // NOTE: the commented command below empties the source after mirror
            let rmCommand = del ? ";rm -rf ." : "";
            
            //  Command
            // ******************************
            result = 'lftp -e "' + options + ' / ' + this.envDataDir + rmCommand + ';bye" -u "' + Config.ftp_server_user + '","' + Config.ftp_server_pass + '" ' + this.envFTPServer + ' -p ' + Config.ftp_server_port;
        }
        return result;
    }

    buildPushMirrorCommand(del = false)
    {
        //  Generate a command used to PUT files on an ftp server
        //
        //  NOTE: in the case below an entire folder is synced with an ftp server (delta only)
        //  NOTE: the "del" parameter set to "true" removes the file(s) from the source
        // ******************************

        //  Ftp connection options
        // ******************************
        let result = false;

        // Retrieve the ssl and mirror component of the lftp command (reverse == true)
        let options = this.buildMirrorOptions(true);

        if (Validator.validateTcpUdpPort(Config.ftp_server_port) && Validator.validateName(Config.ftp_server_user) && options)
        {            
            // NOTE: the commented command below empties the source after mirror
            let rmCommand = del ? " && rm -rf " + this.envDataDir + "/*" : "";

            //  Command
            // ******************************
            result = 'lftp -e "' + options + ' ' + this.envDataDir + ' /;bye" -u "' + Config.ftp_server_user + '","' + Config.ftp_server_pass + '" ' + this.envFTPServer + ' -p ' + Config.ftp_server_port + rmCommand;
        }
        return result;
    }

    buildPullFileCommand(file, del = false)
    {
        //  Generate a command used to GET a file from an ftp server
        //
        //  NOTE: the "del" parameter set to "true" removes the file(s) from the source
        // ******************************
        let result = false;

        if (Validator.validateTcpUdpPort(Config.ftp_server_port) && Validator.validateName(Config.ftp_server_user))
        {
            //  Ftp connection options
            // ******************************
            let sslOptions = this.buildSslOptions();
            let getCommand = "get " + file;
            getCommand = del ? getCommand + ";rm -f " + file : getCommand;
            
            //  Command
            // ******************************
            result = 'cd ' + this.envDataDir + ';lftp -e "' + sslOptions + getCommand + ';bye" -u "' + Config.ftp_server_user + '","' + Config.ftp_server_pass + '" ' + this.envFTPServer + ' -p ' + Config.ftp_server_port;
        }
        return result;
    }

    buildPushFileCommand(file, del = false)
    {
        //  Generate a command used to PUT a file on an ftp server
        //
        //  NOTE: the "del" parameter set to "true" removes the file(s) from the source
        // ******************************

        //  Ftp connection options
        // ******************************
        let result = "";

        if (Validator.validateTcpUdpPort(Config.ftp_server_port) && Validator.validateName(Config.ftp_server_user))
        {
            let sslOptions = this.buildSslOptions();
            let putCommand = "put " + this.envDataDir + "/" + file;
            let rmCommand = del ? " && rm -f " + this.envDataDir + "/" + file : "";
            
            //  Command
            // ******************************
            result = 'lftp -e "' + sslOptions + putCommand + ';bye" -u "' + Config.ftp_server_user + '","' + Config.ftp_server_pass + '" ' + this.envFTPServer + ' -p ' + Config.ftp_server_port + rmCommand;
        }
        return result;
    }
}

module.exports = LinuxModule
