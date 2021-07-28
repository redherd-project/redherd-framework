'use strict';

const Module = require('./rdhd-mod-base_module');

class WindowsModule extends Module
{
    constructor(asset, moduleCode, session = "0", wsServer = 'http://127.0.0.1:3001', token = '')
    {
        super(asset, moduleCode, session, wsServer, token);

        //  Config ENV entries
        // ******************************
        this.envFTPServer = "$Env:" + Config.asset_env.ftp_server;
        this.envHerdServer = "$Env:" + Config.asset_env.herd_server;
        this.envDataDir = "$Env:" + Config.asset_env.data_dir;
    }

    buildPullMirrorCommand()
    {
        let command = '$z=\'$FTPHost="ftp://' + this.envFTPServer + '/";\
        $FTPUser="' + Config.ftp_server_user + '";\
        $FTPPass="' + Config.ftp_server_pass + '";\
        $FTPDir="/";\
        $IgnoreSsl=' + ((Config.debug_mode) ? '$true' : '$false') + ';\
        $DownloadFolder="' + this.envDataDir + '\\";\
        $FTPHost="$FTPHost$FTPDir";if($IgnoreSsl -eq $true){[Net.ServicePointManager]::ServerCertificateValidationCallback={$true};}\
        function Ftps-GetFile{param([parameter(Mandatory=$true)][String] $FTPHost,[parameter(Mandatory=$true)][String] $OutputPath,\
        [parameter(Mandatory=$true)][String] $Username,[parameter(Mandatory=$true)][String] $Password,[parameter(Mandatory=$true)][String] $File)\
        $LocalFile=$OutputPath+"\\"+$File;$RemoteFile="$FTPHost/$File".replace("\\","/");$FTPRequest=[System.Net.FtpWebRequest]::Create($RemoteFile);\
        $FTPRequest.Credentials=New-Object System.Net.NetworkCredential($Username,$Password);$FTPRequest.Method=[System.Net.WebRequestMethods+Ftp]::DownloadFile;\
        $FTPRequest.EnableSsl=$true;$FTPRequest.UseBinary=$true;$FTPRequest.UsePassive=$true;$FTPRequest.KeepAlive=$true;$FTPRequest.ConnectionGroupName="FTPS$Username";\
        $FTPResponse=$FTPRequest.GetResponse();$ResponseStream=$FTPResponse.GetResponseStream();$FileStream=New-Object IO.FileStream ($LocalFile, [IO.FileMode]::Create);\
        try{$Buffer=New-Object Byte[](1024);while($true){$Row = $ResponseStream.Read($Buffer,0,1024);if($Row -eq 0){break;}$FileStream.Write($Buffer,0,$Row);}}\
        finally{if($ResponseStream -ne $null){$ResponseStream.Dispose();}$FileStream.Close();$Response=$FTPRequest.GetResponse();$Response.StatusDescription;$Response.Close();}}\
        function Ftps-DirList{param([parameter(Mandatory=$true)][String] $FTPHost,[parameter(Mandatory=$true)][String] $Username,[parameter(Mandatory=$true)][String] $Password)\
        try{$Uri=$FTPHost;$FTPRequest=[System.Net.FtpWebRequest]::Create($Uri);$FTPRequest.Credentials=New-Object System.Net.NetworkCredential($Username,$Password);\
        $FTPRequest.Method=[System.Net.WebRequestMethods+Ftp]::ListDirectoryDetails;$FTPRequest.EnableSsl=$true;$FTPResponse=$FTPRequest.GetResponse();\
        $ResponseStream=$FTPResponse.GetResponseStream();$StreamReader=New-Object System.IO.StreamReader $ResponseStream;$Files=New-Object System.Collections.ArrayList;\
        while($File = $StreamReader.ReadLine()){[void] $Files.add("$File");}}catch{Write-Host -message $_.Exception.InnerException.Message;}$StreamReader.Close();$ResponseStream.Close();\
        $FTPResponse.Close();Return $Files;}function Ftps-Recurse{param([parameter(Mandatory=$true)][String] $FTPHost,[parameter(Mandatory=$true)][String] $DownloadFolder,\
        [parameter(Mandatory=$true)][String] $Username,[parameter(Mandatory=$true)][String] $Password,[parameter(Mandatory=$true)][String] $FTPDir)\
        $FTPHost="$FTPHost\\$FTPDir";$SrcEntries=Ftps-DirList -FTPHost $FTPHost -Username $FTPUser -Password $FTPPass;\
        $Srcfolders=$SrcEntries -split "`n" | Select-String "(^[d])([\\w|-]+)(\\s+)(\\d+)(\\s+)(\\d+)(\\s+)(\\w+)(\\s+)(\\d+)(\\s+)(\\w+)(\\s+)(\\d+)(\\s+)(\\d{2}:\\d{2})(\\s+)([\\s|\\w|\\d|\\._-]+)"\
        |ForEach-Object{$_.Matches[0].Groups[18].Value};\
        $SrcFiles = $SrcEntries -split "`n" | Select-String "(^[-])([\\w|-]+)(\\s+)(\\d+)(\\s+)(\\d+)(\\s+)(\\w+)(\\s+)(\\d+)(\\s+)(\\w+)(\\s+)(\\d+)(\\s+)(\\d{2}:\\d{2})(\\s+)([\\s|\\w|\\d|\\._-]+)"\
        |ForEach-Object{$_.Matches[0].Groups[18].Value};\
        foreach($file in $SrcFiles){Ftps-GetFile -FTPHost $FTPHost -OutputPath $DownloadFolder -File $file -Username $FTPUser -Password $FTPPass;}\
        foreach($folder in $Srcfolders){mkdir "$DownloadFolder$folder" -Force;\
        Ftps-Recurse -FTPHost $FTPHost -DownloadFolder "$DownloadFolder$folder\\" -FTPDir $folder -Username $FTPUser -Password $FTPPass;}}\
        Ftps-Recurse -FTPHost $FTPHost -DownloadFolder $DownloadFolder -FTPDir $FTPDir -Username $FTPUser -Password $FTPPass;\';$z|IEX';

        return this.getPSEncodedCommand(command);
    }

    buildPushMirrorCommand()
    {
        let command = '$z=\'$FTPHost="ftp://' + this.envFTPServer + '/";\
        $FTPUser="' + Config.ftp_server_user + '";\
        $FTPPass="' + Config.ftp_server_pass + '";\
        $IgnoreSsl=' + ((Config.debug_mode) ? '$true' : '$false') + ';\
        $UploadFolder="' + this.envDataDir + '\\";\
        if ($IgnoreSsl -eq $true){[Net.ServicePointManager]::ServerCertificateValidationCallback={$true};}\
        function Ftps-PutFile{param([parameter(Mandatory=$true)][String] $FTPUri,[parameter(Mandatory=$true)][String] $LocalFile,\
        [parameter(Mandatory=$true)][String] $Username,[parameter(Mandatory=$true)][String] $Password)\
        $File=dir $LocalFile;$RemoteFile="$FTPUri";$FTPRequest=[System.Net.FtpWebRequest]::Create($RemoteFile);\
        $FTPRequest.Credentials=New-Object System.Net.NetworkCredential($Username,$Password);\
        $FTPRequest.Method=[System.Net.WebRequestMethods+Ftp]::UploadFile;$FTPRequest.EnableSsl=$true;$FTPRequest.UseBinary=$true;\
        $FTPRequest.UsePassive=$true;$FTPRequest.KeepAlive=$true;$FTPRequest.ConnectionGroupName = "FTPS$Username";\
        $RequestStream=$FTPRequest.GetRequestStream();$FTPRequest.ContentLength=$File.Length;\
        $FileStream=New-Object IO.FileStream $File.FullName,"Open","Read";try{$Buffer=New-Object Byte[](1024);\
        while ($true){$Row=$FileStream.Read($Buffer, 0, 1024);if($Row -eq 0){break;}$RequestStream.Write($Buffer,0,$Row);}}\
        finally{if ($FileStream -ne $null){$FileStream.Dispose();}$RequestStream.Close();$Response = $FTPRequest.GetResponse();\
        $Response.StatusDescription;$Response.Close();}}function Ftps-Mkdir {param([Parameter(Mandatory=$true)][string] $FTPUri,\
        [Parameter(Mandatory=$true)][string] $Username,[Parameter(Mandatory=$true)][string] $Password)if($FTPUri -match "\\\\$|\\\\\\w+$")\
        {throw "Uri should end with a file name";}$FTPRequest=[System.Net.FtpWebRequest]::Create($FTPUri);\
        $FTPRequest.Method=[System.Net.WebRequestMethods+Ftp]::MakeDirectory;$FTPRequest.UseBinary=$true;$FTPRequest.EnableSsl=$true;\
        $FTPRequest.Credentials=New-Object System.Net.NetworkCredential($Username,$Password);$FTPResponse=$FTPRequest.GetResponse();\
        Write-Host Upload File Complete, status $FTPResponse.StatusDescription;$FTPResponse.Close();}\
        $SrcEntries=Get-ChildItem $UploadFolder -Recurse;$Srcfolders=$SrcEntries | Where-Object{$_.PSIsContainer};\
        $SrcFiles=$SrcEntries | Where-Object{!$_.PSIsContainer};foreach($folder in $Srcfolders){$SrcFolderPath=$UploadFolder -replace "\\\\","\\\\" -replace "\\:","\\:";\
        $DesFolder=$folder.Fullname -replace $SrcFolderPath,$FTPHost;$DesFolder=$DesFolder -replace "\\\\", "/";Ftps-Mkdir -FTPUri "$DesFolder" -Username $FTPUser -Password $FTPPass;}\
        foreach($entry in $SrcFiles){$SrcFullname=$entry.fullname;$SrcName=$entry.Name;$SrcFilePath=$UploadFolder -replace "\\\\","\\\\" -replace "\\:","\\:";\
        $DesFile=$SrcFullname -replace $SrcFilePath,$FTPHost;$DesFile=$DesFile -replace "\\\\", "/";\
        Ftps-PutFile -FTPUri $DesFile -LocalFile $SrcFullname -Username $FTPUser -Password $FTPPass;}\';$z|IEX';

        return this.getPSEncodedCommand(command);
    }

    buildPullFileCommand(file)
    {
        let command = '$z=\'$FTPHost="ftp://' + this.envFTPServer + '/";\
        $DownloadFolder="' + this.envDataDir + '\\";\
        $FTPUser="' + Config.ftp_server_user + '";\
        $FTPPass="' + Config.ftp_server_pass + '";\
        $File="' + file + '";\
        $IgnoreSsl=' + ((Config.debug_mode) ? '$true' : '$false') + ';\
        $g="$DownloadFolder$File";$h="$FTPHost"+$File;if($IgnoreSsl -eq $true){[Net.ServicePointManager]::ServerCertificateValidationCallback={$true}}\
        $i=[System.Net.FtpWebRequest]::Create($h);$i.Credentials=New-Object System.Net.NetworkCredential($FTPUser,$FTPPass);\
        $i.Method=[System.Net.WebRequestMethods+Ftp]::DownloadFile;$i.EnableSsl=$true;$i.UseBinary=$true;$i.UsePassive=$true;$i.KeepAlive=$true;\
        $i.ConnectionGroupName="FTPS$FTPUser";$j=$i.GetResponse();$k=$j.GetResponseStream();$l=New-Object IO.FileStream ($g,[IO.FileMode]::Create);\
        try{$m=New-Object Byte[](1024);while($true){$n=$k.Read($m,0,1024);if($n -eq 0){break;}$l.Write($m,0,$n);}}\
        finally{if($k -ne $null){$k.Dispose();}$l.Close();$o=$i.GetResponse();$o.StatusDescription;$o.Close();}\';$z|IEX';

        return this.getPSEncodedCommand(command);
    }

    buildPushFileCommand(file)
    {
        let command = '$z=\'$FTPHost="ftp://' + this.envFTPServer + '/";\
        $FTPUser="' + Config.ftp_server_user + '";\
        $FTPPass="' + Config.ftp_server_pass + '";\
        $UploadFile="'+ this.envDataDir + '\\' + file + '";\
        $IgnoreSsl=' + ((Config.debug_mode) ? '$true' : '$false') + ';\
        $f=dir $UploadFile;$g="$FTPHost"+$f.Name;if($IgnoreSsl -eq $true){[Net.ServicePointManager]::ServerCertificateValidationCallback={$true};}\
        $h=[System.Net.FtpWebRequest]::Create($g);$h.Credentials=New-Object System.Net.NetworkCredential($FTPUser,$FTPPass);\
        $h.Method=[System.Net.WebRequestMethods+Ftp]::UploadFile;$h.EnableSsl=$true;$h.UseBinary=$true;$h.UsePassive=$true;\
        $h.KeepAlive=$true;$h.ConnectionGroupName="FTPS$FTPUser";$i=$h.GetRequestStream();$h.ContentLength=$f.Length;\
        $j=New-Object IO.FileStream $f.FullName,"Open","Read";try{$k=New-Object Byte[](1024);while($true){$l=$j.Read($k,0,1024);if($l -eq 0){break;}$i.Write($k,0,$l);}}\
        finally{if($j -ne $null){$j.Dispose();}$i.Close();$m=$h.GetResponse();$m.StatusDescription;$m.Close();}\';$z|IEX';

        return this.getPSEncodedCommand(command);
    }

    getPSEncodedCommand(command)
    {
        // NodeJS base64 encoding function compatible with PowerShell (Unicode-16)
        // ******************************
        return "powershell -ep bypass -nop -ec " + this.getPSEncodedString(command);
    }

    getPSEncodedString(input)
    {
        // NodeJS base64 encoding function compatible with PowerShell (Unicode-16)
        // ******************************
        let bytes = new Array(input.length * 2)

        // Convert input string into an array of bytes
        let i, j;
        for (i = 0, j = 0; i < input.length; j = 2 * ++i)
        {
            bytes[j] = input.charCodeAt(i);
        }

        // Create a Unicode-16 string from bytes array
        let encode = String.fromCharCode.apply(String, bytes);

        // Base64 encode
        let buffer = Buffer.from(encode);
        let b64 = buffer.toString('base64');

        return b64;
    }
}

module.exports = WindowsModule
