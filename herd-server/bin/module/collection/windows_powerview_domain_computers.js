'use strict';

const WindowsPowerViewModule = require('./windows_powerview_base');

// moduleCode: windows_powerview_domain_computers
class WindowsPowerViewDomainComputers extends WindowsPowerViewModule
{

    constructor(asset, context, session, wsServer, token)
    {
        super(asset, "windows_powerview_domain_computers", context, session, wsServer, token);
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
                case "COMPUTERS":
                    if (!this.target)
                    {
                        task += "Get-NetComputer -Credential $Cred'";
                    }
                    else
                    {
                        task += "Get-NetComputer -Credential $Cred -Domain " + this.target + "'";
                    }
                    break;  
                case "OPERATING SYSTEMS":
                    if (!this.target)
                    {
                        task += "Get-NetComputer -Credential $Cred | select name,operatingsystem,description'";
                    }
                    else
                    {
                        task += "Get-NetComputer -Credential $Cred -Domain " + this.target + " | select name,operatingsystem,description'";
                    }
                    break; 
                case "UNCONSTRAINED DELEGATION":
                    if (!this.target)
                    {
                        task += "Get-NetComputer -Credential $Cred -Unconstrained'";
                    }
                    else
                    {
                        task += "Get-NetComputer -Credential $Cred -Domain " + this.target + " -Unconstrained'";
                    }
                    break; 
                case "CONSTRAINED DELEGATION":
                    if (!this.target)
                    {
                        task += "Get-DomainComputer -TrustedToAuth -Credential $Cred'";
                    }
                    else
                    {
                        task += "Get-DomainComputer -TrustedToAuth -Credential $Cred -Domain " + this.target + "'";
                    }
                    break; 
                default:
                  this.reportAndExit(this.buildErrorMessage("Invalid input provided"));
                  return;
            };

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

module.exports = WindowsPowerViewDomainComputers
