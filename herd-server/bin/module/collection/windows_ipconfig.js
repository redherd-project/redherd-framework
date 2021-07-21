'use strict';

const WindowsModule = require('../base/rdhd-mod-base_windows_module');

// moduleCode: windows_interfaces
class WindowsInterfaces extends WindowsModule
{
    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_interfaces", session, wsServer, token);
    }

    run(whatIf = false)
    {
        if (this.validate())
        {
            let task = "ipconfig";

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

module.exports = WindowsInterfaces