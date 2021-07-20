'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');

// moduleCode: windows_defender
class WindowsDefender extends WindowsModule
{
    // ************************************************************
    //  Defender module
    // ************************************************************
    // operation   :   enable/disable
    // ************************************************************

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_defender", session, wsServer, token);

        //  POST parameters
        // ******************************
        this.operation = context.operation;
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "Set-MpPreference -DisableRealtimeMonitoring $";

            if (this.operation.toUpperCase() == "ACTIVATE")
            {
                task += "false";
            }
            else
            {
                task += "true";
            }

            task += "; Write-Host 'Real-time Monitoring disabled:',(Get-MpPreference).DisableRealtimeMonitoring;"

            //  Async execution
            // ******************************
            this.do(task, "cmd_res", false, whatIf);
        }
        else
        {
            this.reportAndExit("Invalid input provided");
        }
    }

    validate()
    {
        if ((this.operation.toUpperCase() == "ACTIVATE") || (this.operation.toUpperCase() == "DEACTIVATE"))
        {
            return true;
        }
        return false;
    }
}

module.exports = WindowsDefender