'use strict';

const WindowsPowerViewModule = require('./windows_powerview_base');

// moduleCode: windows_powerview_domain
class WindowsPowerViewDomain extends WindowsPowerViewModule
{

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_powerview_domain", context, session, wsServer, token);
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
                    task += "Get-NetDomain -Credential $Cred";
                    break;  
                case "SID":
                    task += "Get-DomainSID -Credential $Cred";
                    break; 
                case "TRUSTS":
                    task += "Invoke-MapDomainTrust -Credential $Cred";
                    break; 
                case "DOMAIN CONTROLLERS":
                    task += "Get-NetDomainController -Credential $Cred";
                    break;
                case "ORGANIZATIONAL UNITS":
                    task += "Get-NetOU -Credential $Cred";
                    break;      
                case "FILE SERVERS":
                    task += "Get-NetFileServer -Credential $Cred";
                    break;
                case "SHARES":
                    task += "Invoke-ShareFinder -Credential $Cred -CheckShareAccess";
                    break;                     
                default:
                  this.reportAndExit(this.buildErrorMessage("Invalid input provided"));
                  return;
            };

            if (this.target)
            {
                task = task + " -Domain " + this.target;
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

module.exports = WindowsPowerViewDomain
