#Requires -RunAsAdministrator

###### VARIABLES ######
$DSTRSRV_PUBLIC_ADDRESS="AAAAAAAAAA"
$PUBLIC_DSTRSRV_PORT="8443"
$USERNAME="BBBBBBBBBB"
$PASSWORD="CCCCCCCCCC"
$ASSET_NAME="$USERNAME"
$ASSET_TYPE="windows"
$ASSET_PORT="22"

$INSTALLATION_PATH="c:\redherd"
$INSTALLATION_NAME="RedHerd.psm1"
$DATA_PATH="$INSTALLATION_PATH\data"

$CERT_NAME="redherdCA"

$NEW_USER_USERNAME="redherd"
$NEW_USER_PASSWORD=-join ((0x30..0x39) + ( 0x41..0x5A) + ( 0x61..0x7A) | Get-Random -Count 32 | % {[char]$_})

$HERDSRV_ADDRESS="10.10.0.3"
$HERDSRV_PORT="3000"
$FTPSRV_ADDRESS="10.10.0.4"

$ENV_HERDSRV="REDHERD_SRV"
$ENV_FTPSRV="REDHERD_FTP"
$ENV_DATA="REDHERD_DATA"

$REST_TIMEOUT=20

$md5 = New-Object -TypeName System.Security.Cryptography.MD5CryptoServiceProvider
$utf8 = New-Object -TypeName System.Text.UTF8Encoding
$ASSET_FINGERPRINT = ([System.BitConverter]::ToString($md5.ComputeHash($utf8.GetBytes($USERNAME)))).ToLower() -replace '-', ''


<#
 .Synopsis
  Add the asset to the RedHerd infrastructure.

 .Description
  This function prepares and adds the asset to the RedHerd infrastructure.
#>
function Add-Asset {
    ShowBanner
    
    CheckAlreadyInstalled

    Write-Host " [*] Installing" -ForegroundColor Yellow
    Write-Host " [+] Installing dependencies" -ForegroundColor Green
    InstallDependencies
    Write-Host " [+] Installing script" -ForegroundColor Green
    InstallScript
    Write-Host " [+] Installing Certification Authority" -ForegroundColor Green
    InstallCA
    sleep 2
    Write-Host " [+] Joining VPN" -ForegroundColor Green
    KillVPN
    JoinVPN
    sleep 2
    Write-Host " [+] Adding user" -ForegroundColor Green
    AddUser
    Write-Host " [*] User: ${NEW_USER_USERNAME} Password: ${NEW_USER_PASSWORD}" -ForegroundColor Yellow
    Write-Host " [+] Installing scheduled job" -ForegroundColor Green
    AddScheduledJob
    Write-Host " [+] Configuring SSH" -ForegroundColor Green
    ConfigureSSH
    Write-Host " [+] Adding environment vars" -ForegroundColor Green
    AddEnvVars
    Write-Host " [+] Joining asset" -ForegroundColor Green
    JoinAsset
}

<#
 .Synopsis
  Remove the asset from the RedHerd infrastructure.

 .Description
  This function removes the asset from the RedHerd infrastructure and restore previous configuration.
#>
function Remove-Asset {
    ShowBanner

    Write-Host " [*] Removing" -ForegroundColor Yellow
    Write-Host " [-] Un-joining asset" -ForegroundColor Yellow
    UnjoinAsset
    Write-Host " [-] Removing environment vars" -ForegroundColor Yellow
    RemoveEnvVars
    Write-Host " [-] Restoring SSH" -ForegroundColor Yellow
    RestoreSSH
    Write-Host " [-] Removing scheduled job" -ForegroundColor Yellow
    RemoveScheduledJob
    Write-Host " [-] Disabling user" -ForegroundColor Yellow
    DisableUser
    Write-Host " [-] Killing VPN" -ForegroundColor Yellow
    KillVPN
    Write-Host " [-] Removing Certification Authority" -ForegroundColor Yellow
    RemoveCA
    Write-Host " [-] Removing script" -ForegroundColor Yellow
    RemoveScript
    Write-Host " [-] Removing dependencies" -ForegroundColor Yellow
    RemoveDependencies
}

<#
 .Synopsis
  Re-adds the asset to the RedHerd infrastructure.

 .Description
  This function re-adds the asset to the RedHerd infrastructure in case of disconnection.
#>
function Refresh-Asset {
    ShowBanner

    if (!(Test-Connection -Cn ${HERDSRV_ADDRESS} -BufferSize 16 -Count 1 -ea 0 -quiet)) {
        Write-Host " [+] Re-joining VPN" -ForegroundColor Green
        KillVPN
        JoinVPN
        sleep 3
        Write-Host " [+] Joining asset" -ForegroundColor Green
        JoinAsset
    }
}

function ShowBanner {
    cls
    Write-Host "                                                                                        " -ForegroundColor red
    Write-Host "  *                                          #                                          " -ForegroundColor red
    Write-Host " **                                          (#                                         " -ForegroundColor red
    Write-Host " **                                          ((#                                        " -ForegroundColor red
    Write-Host " ***                                        #((#                                        " -ForegroundColor red
    Write-Host "  ****(         (*****    ((((((          #((((                                         " -ForegroundColor red
    Write-Host "   *******************   ((((((((((((((((((((#                                          " -ForegroundColor red
    Write-Host "     *****************   ((((((((((((((((((                                             " -ForegroundColor red
    Write-Host "          ***********       (((((((((((                                                 " -ForegroundColor red
    Write-Host "              *******      (((((((#                                                     " -ForegroundColor red
    Write-Host "                  (*****   (((   ______ _______ ______  _     _ _______  ______ ______  " -ForegroundColor red
    Write-Host "                   *****  (((   |_____/ |______ |     \ |_____| |______ |_____/ |     \ " -ForegroundColor red
    Write-Host "                    ****  ((    |    \_ |______ |_____/ |     | |______ |    \_ |_____/ " -ForegroundColor red
    Write-Host "                     *** ((#                                                            " -ForegroundColor red
    Write-Host "                     *** (((                                                            " -ForegroundColor red
    Write-Host "                                                                                        " -ForegroundColor red
    Write-Host ""
}

function PrintBanner {
    echo "                                                                                        "
    echo "  *                                          #                                          "
    echo " **                                          (#                                         "
    echo " **                                          ((#                                        "
    echo " ***                                        #((#                                        "
    echo "  ****(         (*****    ((((((          #((((                                         "
    echo "   *******************   ((((((((((((((((((((#                                          "
    echo "     *****************   ((((((((((((((((((                                             "
    echo "          ***********       (((((((((((                                                 "
    echo "              *******      (((((((#                                                     "
    echo "                  (*****   (((   ______ _______ ______  _     _ _______  ______ ______  "
    echo "                   *****  (((   |_____/ |______ |     \ |_____| |______ |_____/ |     \ "
    echo "                    ****  ((    |    \_ |______ |_____/ |     | |______ |    \_ |_____/ "
    echo "                     *** ((#                                                            "
    echo "                     *** (((                                                            "
    echo "                                                                                        "
    echo ""
}

function CheckAlreadyInstalled {
    if (Test-Path -Path $INSTALLATION_PATH) {
        Write-Host "[!] The script is already installed" -ForegroundColor Red
        Write-Host ""
        Break
    }    
}

function InstallDependencies {
    # Installing Chocolatey
    Set-ExecutionPolicy Bypass -Scope Process -Force; [System.Net.ServicePointManager]::SecurityProtocol = [System.Net.ServicePointManager]::SecurityProtocol -bor 3072; iex ((New-Object System.Net.WebClient).DownloadString('https://chocolatey.org/install.ps1'))
    
    # Installing OpenVPN client
    # https://chocolatey.org/packages/openvpn
    choco install openvpn -y --params "'/SELECT_SERVICE=0 /SELECT_LAUNCH=0'"
    RefreshEnv.cmd

    # Installing OpenSSH Server
    # https://docs.microsoft.com/it-it/windows-server/administration/openssh/openssh_install_firstuse
    Add-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
    # Install-Module -Name OpenSSHUtils -Force
}

function RemoveDependencies {
    # choco uninstall openvpn -y --force
    # RefreshEnv.cmd
    # Remove-WindowsCapability -Online -Name OpenSSH.Server~~~~0.0.1.0
}

function InstallScript {
    New-Item -path $DATA_PATH -type directory -Force
    $MODULE_NAME = $MyInvocation.MyCommand.ModuleName
    cp ".\${MODULE_NAME}.psm1" $INSTALLATION_PATH\$INSTALLATION_NAME
}

function RemoveScript {
    Remove-Item -path $INSTALLATION_PATH -recurse
}

function InstallCA {
    # Disable Certificate errors
    [Net.ServicePointManager]::ServerCertificateValidationCallback = {$true}
    # Create a WebClient
    $webclient = New-Object System.Net.WebClient
    # Basic authentication encoding.
    $basic = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes($USERNAME + ":" + $PASSWORD));
    # Set Authorization HTTP header with Basic authentication information.
    $webclient.Headers["Authorization"] = "Basic $basic"
    # Export the contents to file.
    $webclient.DownloadFile("https://${DSTRSRV_PUBLIC_ADDRESS}:${PUBLIC_DSTRSRV_PORT}/${ASSET_FINGERPRINT}/ca.crt", "${INSTALLATION_PATH}\${CERT_NAME}.crt")

    Import-Certificate -FilePath ${INSTALLATION_PATH}\${CERT_NAME}.crt -CertStoreLocation Cert:\LocalMachine\Root
}

function RemoveCA {
    Get-ChildItem Cert:\LocalMachine\Root | Where-Object { $_.Subject -match 'RedHerd' } | Remove-Item
}

function JoinVPN {
    Invoke-WebRequest -Uri "https://${DSTRSRV_PUBLIC_ADDRESS}:${PUBLIC_DSTRSRV_PORT}/${ASSET_FINGERPRINT}/config.ovpn" -OutFile ${INSTALLATION_PATH}\config.ovpn -Headers @{ Authorization = "Basic "+ [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes("${USERNAME}:${PASSWORD}")) } 
    Start-Process -NoNewWindow -RedirectStandardOutput "NUL" 'C:\Program Files\OpenVPN\bin\openvpn.exe' ${INSTALLATION_PATH}\config.ovpn 
}

function KillVPN {
    Stop-Process -Name "openvpn" -Force 2>&1>$null
}

function AddUser {
    if ( (Get-LocalUser -Name $NEW_USER_USERNAME).count -gt 0 ) {
        net user $NEW_USER_USERNAME /active:yes
        net user $NEW_USER_USERNAME $NEW_USER_PASSWORD
    } else {
        net user $NEW_USER_USERNAME $NEW_USER_PASSWORD /add /y
        net localgroup Administrators $NEW_USER_USERNAME /add
    }
}

function DisableUser {
    net user $NEW_USER_USERNAME /active:no
}

function AddScheduledJob {
    [securestring]$secStringPassword = ConvertTo-SecureString $NEW_USER_PASSWORD -AsPlainText -Force
    [pscredential]$credObject = New-Object System.Management.Automation.PSCredential ($NEW_USER_USERNAME, $secStringPassword)
    $Job = {
        param($p1)
        Set-ExecutionPolicy -ExecutionPolicy Bypass -Scope Process
        Import-Module $p1
        Refresh-Asset
    }

    $JobTrigger = New-JobTrigger  -RepetitionInterval (New-TimeSpan -minutes 1) -RepetitionDuration ([timeSpan]::maxvalue) -At (get-date) -Once
    $JobOption = New-ScheduledJobOption -RunElevated
    Register-ScheduledJob -Name "RedHerdJob" -Trigger $JobTrigger -ScheduledJobOption $JobOption -ScriptBlock $Job -ArgumentList "$INSTALLATION_PATH\$INSTALLATION_NAME" -Credential $credObject
}

function RemoveScheduledJob {
    Unregister-ScheduledJob -name "RedHerdJob" -Force
}

function ConfigureSSH {
    Start-Service sshd
    # OPTIONAL but recommended:
    Set-Service -Name sshd -StartupType 'Automatic'
    # Confirm the Firewall rule is configured. It should be created automatically by setup. 
    Get-NetFirewallRule -Name *ssh*
    # There should be a firewall rule named "OpenSSH-Server-In-TCP", which should be enabled
    # If the firewall does not exist, create one
    New-NetFirewallRule -Name sshd -DisplayName 'OpenSSH Server (sshd)' -Enabled True -Direction Inbound -Protocol TCP -Action Allow -LocalPort 22 2>$null

    # https://github.com/PowerShell/Win32-OpenSSH/wiki/Security-protection-of-various-files-in-Win32-OpenSSH
    # https://docs.microsoft.com/it-it/windows-server/administration/openssh/openssh_keymanagement
    #New-Item -path c:\Users\$NEW_USER_USERNAME\.ssh -type directory -Force
    
    $wc = New-Object System.Net.WebClient
    $wc.Encoding = [System.Text.Encoding]::UTF8
    $wc.DownloadString("https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/pub.key") >  C:\ProgramData\ssh\administrators_authorized_keys 

    $MyRawString = Get-Content -Raw -Path C:\ProgramData\ssh\administrators_authorized_keys 
    $Utf8NoBomEncoding = New-Object System.Text.UTF8Encoding $False
    [System.IO.File]::WriteAllLines("C:\ProgramData\ssh\administrators_authorized_keys", $MyRawString, $Utf8NoBomEncoding)    

    $acl = Get-Acl C:\ProgramData\ssh\administrators_authorized_keys
    $acl.SetAccessRuleProtection($true, $false)
    $administratorsRule = New-Object system.security.accesscontrol.filesystemaccessrule("Administrators","FullControl","Allow")
    $systemRule = New-Object system.security.accesscontrol.filesystemaccessrule("SYSTEM","FullControl","Allow")
    $acl.SetAccessRule($administratorsRule)
    $acl.SetAccessRule($systemRule)
    $acl | Set-Acl

    # Set powershell as default shell
    New-ItemProperty -Path "HKLM:\SOFTWARE\OpenSSH" -Name DefaultShell -Value "C:\Windows\System32\WindowsPowerShell\v1.0\powershell.exe" -PropertyType String -Force

    # Update SSH banner
    PrintBanner > ${INSTALLATION_PATH}\motd
    Add-Content -Path C:\ProgramData\ssh\sshd_config -Value "Banner ${INSTALLATION_PATH}\motd"

     # Allow SSHD service to interact with desktop
    $svcKey = Get-Item HKLM:\SYSTEM\CurrentControlSet\Services\sshd
    ## Set 9th bit, from http://www.codeproject.com/KB/install/cswindowsservicedesktop.aspx
    $newType = $svcKey.GetValue('Type') -bor 0x100
    Set-ItemProperty $svcKey.PSPath -Name Type -Value $newType

    Restart-Service sshd
}

function RestoreSSH {
    #Remove-Item -path c:\Users\$NEW_USER_USERNAME\.ssh -Recurse -Force

    # Restore SSH banner
    Get-Content C:\ProgramData\ssh\sshd_config | Where-Object {$_ -notmatch "Banner ${INSTALLATION_PATH}\\motd"} | Set-Content C:\ProgramData\ssh\sshd_config.new
    Move-Item C:\ProgramData\ssh\sshd_config.new C:\ProgramData\ssh\sshd_config -Force

    # Disable SSH service
    Stop-Service sshd
    Set-Service -Name sshd -StartupType 'Manual'
}

function AddEnvVars {
    [System.Environment]::SetEnvironmentVariable($ENV_HERDSRV,$HERDSRV_ADDRESS,[System.EnvironmentVariableTarget]::Machine)
    [System.Environment]::SetEnvironmentVariable($ENV_FTPSRV,$FTPSRV_ADDRESS,[System.EnvironmentVariableTarget]::Machine)
    [System.Environment]::SetEnvironmentVariable($ENV_DATA,$DATA_PATH,[System.EnvironmentVariableTarget]::Machine)
}

function RemoveEnvVars {
    [System.Environment]::SetEnvironmentVariable($ENV_HERDSRV,$null,[System.EnvironmentVariableTarget]::Machine)
    [System.Environment]::SetEnvironmentVariable($ENV_FTPSRV,$null,[System.EnvironmentVariableTarget]::Machine)
    [System.Environment]::SetEnvironmentVariable($ENV_DATA,$null,[System.EnvironmentVariableTarget]::Machine)
}


function JoinAsset {
    $ASSET_ADDR=(Get-NetIPAddress -AddressFamily IPv4 -InterfaceAlias Ethernet).IPAddress
    $ASSET_USER=$NEW_USER_USERNAME

    # Get asset types
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
    $TYPES=(Invoke-RestMethod https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/types -TimeoutSec $REST_TIMEOUT).data.types
    foreach ($TYPE in $TYPES) {
        if ($TYPE.name -eq $ASSET_TYPE) {
            $ASSET_TYPE_ID = $TYPE.id
        }
    }

    # Check if the asset already exists in the database
    $ASSET=Invoke-RestMethod https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/assets/${ASSET_FINGERPRINT} -TimeoutSec $REST_TIMEOUT
    $ASSET_ID=$ASSET.data.asset.id

    # Check if asset already exists
    if ($ASSET_ID) {
        # Asset exists --> update
        $ASSET_STATUS=(Invoke-RestMethod https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/assets/${ASSET_FINGERPRINT} -TimeoutSec $REST_TIMEOUT -Method Put -ContentType "application/json" -Body (@{
	     name = $ASSET_NAME
	     ip = $ASSET_ADDR
	     user = $ASSET_USER
	     wport = $ASSET_PORT
	     id_type = $ASSET_TYPE_ID
	     joined = "true"
        } | ConvertTo-Json)).status
    } else {
        # Asset doesn't exist --> add
        $ASSET_STATUS=(Invoke-RestMethod https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/assets -TimeoutSec $REST_TIMEOUT -Method Post -ContentType "application/json" -Body (@{
	     name = $ASSET_NAME
	     ip = $ASSET_ADDR
	     user = $ASSET_USER
	     wport = $ASSET_PORT
	     fingerprint = $ASSET_FINGERPRINT
	     id_type = $ASSET_TYPE_ID
	     joined = "true"
        } | ConvertTo-Json)).status
    }
    
    # Verify if asset has correctly joined
    if ($ASSET_STATUS -eq "success") {
        Write-Host " [+] Successful joining" -ForegroundColor Green
    } else {
        Write-Host " [-] Error during joining" -ForegroundColor Red
    }

    # Restarting SSHD service
    Restart-Service sshd
}

function UnjoinAsset {
    [Net.ServicePointManager]::SecurityProtocol = [Net.ServicePointManager]::SecurityProtocol -bor [Net.SecurityProtocolType]::Tls12
    $ASSET_STATUS=(Invoke-RestMethod https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/assets/${ASSET_FINGERPRINT} -TimeoutSec $REST_TIMEOUT -Method Put -ContentType "application/json" -Body (@{
	    joined = "false"
    } | ConvertTo-Json)).status
        
    # Verify if asset has correctly joined
    if ($ASSET_STATUS -eq "success") {
        Write-Host " [+] Successful un-joining" -ForegroundColor Green
    } else {
        Write-Host " [-] Error during un-joining" -ForegroundColor Red
    }  
}

Export-ModuleMember -Function Add-Asset
Export-ModuleMember -Function Remove-Asset
Export-ModuleMember -Function Refresh-Asset
