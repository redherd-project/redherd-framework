'use strict';

const WindowsPowerViewModule = require('./windows_powerview_base');

// moduleCode: windows_powerview_forest
class WindowsPowerViewForest extends WindowsPowerViewModule
{

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_powerview_forest", context, session, wsServer, token);
    }

    run(whatIf = false)
    {
        if (this.object)
        {
            let task = "powershell -ep bypass '";
            task += "$SecPassword=ConvertTo-SecureString ''" + this.password + "'' -AsPlainText -Force;";
            task += "$Cred = New-Object System.Management.Automation.PSCredential(''" + this.username + "'', $SecPassword);";
            task += ". ''" + this.powerview_path + "'';";
            
            switch(this.object.toUpperCase()) {
                case "INFO":
                    task += "Get-NetForest -Credential $Cred";
                    break;
                case "DOMAINS":
                    task += "Get-NetForestDomain -Credential $Cred";
                    break;   
                case "TRUSTS":
                    task += "Get-NetForestTrust -Credential $Cred";
                    break;                                    
                default:
                  this.reportAndExit(this.buildErrorMessage("Invalid input provided"));
                  return;
            };

            if (this.target)
            {
                task = task + " -Forest " + this.target;
            }

            task += "'";

            //  Async execution
            // ******************************
            this.do(task, "cmd_res", false, whatIf);
        }
        else
        {
            this.reportAndExit(this.buildErrorMessage("Invalid input provided"));
        }
    }

}

module.exports = WindowsPowerViewForest
