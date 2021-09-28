'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');

// moduleCode: windows_transfer
class WindowsTransfer extends WindowsModule
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
        super(asset, "windows_transfer", session, wsServer, token);

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
  
            let task = "Invoke-WmiMethod -Class Win32_Process -Name Create -ArgumentList 'powershell -ep bypass -nop -c Import-Module $Env:REDHERD_DATA\\..\\redherd.psm1; Remove-Asset; [Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}; $webclient = New-Object System.Net.WebClient; $basic = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes(\\\"" + this.username + "\\\" + \\\":\\\" + \\\"" + this.password + "\\\")); $webclient.Headers[\\\"Authorization\\\"] = \\\"Basic $basic\\\"; $webclient.DownloadFile(\\\"https://" + this.public_ip + ":8443/" + this.fingerprint + "/windows_asset_setup.psm1\\\",\\\"script.psm1\\\"); Import-Module .\\script.psm1; Add-Asset; Remove-Item .\\script.psm1;'"

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

module.exports = WindowsTransfer


