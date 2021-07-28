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
                case "USERS":
                    if (!this.target)
                    {
                        task += "Get-NetUser -Credential $Cred  | select name,samaccountname,description '";
                    }
                    else
                    {
                        task += "Get-NetUser -Credential $Cred -Domain " + this.target + " | select name,samaccountname,description '";
                    }
                    break;
                case "E-MAILS":
                    if (!this.target)
                    {
                        task += "Get-NetUser -Credential $Cred  | where {$_.mail}'";
                    }
                    else
                    {
                        task += "Get-NetUser -Credential $Cred -Domain " + this.target + " | where {$_.mail}'";
                    }
                    break; 
                case "GROUPS":
                    if (!this.target)
                    {
                        task += "Get-NetGroup -Credential $Cred | select samaccountname'";
                    }
                    else
                    {
                        task += "Get-NetGroup -Credential $Cred -Domain " + this.target + " | select samaccountname'";
                    }
                    break;
                case "ENTERPRISE ADMINS":
                    if (!this.target)
                    {
                        task += "Get-NetGroupMember -Credential $Cred -Identity ''Enterprise Admins'' -Recurse -Server $((Get-NetDomainController -Credential $Cred)[0].name) | select MemberName'";
                    }
                    else
                    {
                        task += "Get-NetGroupMember -Credential $Cred -Identity ''Enterprise Admins'' -Recurse -Domain " + this.target + " -Server $((Get-NetDomainController -Credential $Cred -Domain " + this.target + ")[0].name) | select MemberName'";
                    }
                    break;  
                case "DOMAIN ADMINS":
                    if (!this.target)
                    {
                        task += "Get-NetGroupMember -Credential $Cred -Identity ''Domain Admins'' -Recurse -Server $((Get-NetDomainController -Credential $Cred)[0].name) | select MemberName'";
                    }
                    else
                    {
                        task += "Get-NetGroupMember -Credential $Cred -Identity ''Domain Admins'' -Recurse -Domain " + this.target + " -Server $((Get-NetDomainController -Credential $Cred -Domain " + this.target + ")[0].name) | select MemberName'";
                    }
                    break;   
                case "LOCAL ADMIN ACCESS":
                    if (!this.target)
                    {
                        task += "Find-LocalAdminAccess -Credential $Cred -Verbose -Server $((Get-NetDomainController -Credential $Cred)[0].name)";
                    }
                    else
                    {
                        task += "Find-LocalAdminAccess -Credential $Cred -Verbose -Recurse -Domain " + this.target + " -Server $((Get-NetDomainController -Credential $Cred -Domain " + this.target + ")[0].name)'";
                    }
                    break;  
                case "SERVICE PRINCIPAL NAME":
                    if (!this.target)
                    {
                        task += "Get-NetUser -SPN -Credential $Cred'";
                    }
                    else
                    {
                        task += "Get-NetUser -SPN -Credential $Cred -Domain " + this.target + "'";
                    }
                    break;
                case "CONSTRAINED DELEGATION":
                    if (!this.target)
                    {
                        task += "Get-DomainUser -TrustedToAuth -Credential $Cred'";
                    }
                    else
                    {
                        task += "Get-DomainUser -TrustedToAuth -Credential $Cred -Domain " + this.target + "'";
                    }
                    break;   
                case "PREAUTH NOT REQUIRED":
                    if (!this.target)
                    {
                        task += "Get-DomainUser -PreauthNotRequired -Credential $Cred'";
                    }
                    else
                    {
                        task += "Get-DomainUser -PreauthNotRequired -Credential $Cred -Domain " + this.target + "'";
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
