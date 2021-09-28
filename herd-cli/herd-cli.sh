#!/bin/bash

###########################################################
# COLORS
RESET="\e[0m"
BOLD="\e[1m"
RED="\e[31m"
GREEN="\e[32m"
YELLOW="\e[33m"
###########################################################

function ShowBanner {
    if [ "$NOLOGO" != "True" ]; then 
        clear
        echo -e "$RED$BOLD                                                                                        $RESET"
        echo -e "$RED$BOLD  *                                          #                                          $RESET"
        echo -e "$RED$BOLD **                                          (#                                         $RESET"
        echo -e "$RED$BOLD **                                          ((#                                        $RESET"
        echo -e "$RED$BOLD ***                                        #((#                                        $RESET"
        echo -e "$RED$BOLD  ****(         (*****    ((((((          #((((                                         $RESET"
        echo -e "$RED$BOLD   *******************   ((((((((((((((((((((#                                          $RESET"
        echo -e "$RED$BOLD     *****************   ((((((((((((((((((                                             $RESET"
        echo -e "$RED$BOLD          ***********       (((((((((((                                                 $RESET"
        echo -e "$RED$BOLD              *******      (((((((#                                                     $RESET"
        echo -e "$RED$BOLD                  (*****   (((   ______ _______ ______  _     _ _______  ______ ______  $RESET"
        echo -e "$RED$BOLD                   *****  (((   |_____/ |______ |     \ |_____| |______ |_____/ |     \ $RESET"
        echo -e "$RED$BOLD                    ****  ((    |    \_ |______ |_____/ |     | |______ |    \_ |_____/ $RESET"
        echo -e "$RED$BOLD                     *** ((#    Command-line Interface                                  $RESET"
        echo -e "$RED$BOLD                     *** (((                                                            $RESET"
        echo -e "$RED$BOLD                                                                                        $RESET"
        echo
    fi
}

function ShowHelp {
    if [ "$NOLOGO" != "True" ]; then
        echo "usage: $0 [REALM] [ARGS]"
        echo
        echo "REALM:"
        echo
        echo "     endpoint             Realm used to generate the endpoint initialization one-liner"
        echo "     server               Realm used to manage the herd-server"
        echo "     user                 Realm used to manage RedHerd users"
        echo "     asset                Realm used to manage RedHerd assets"
        echo "     system               Realm used to manage the system context"
        echo "     help                 This help"
        echo
        echo "ARGS:"
        echo
        echo "usage: $0 endpoint (-s|--server) VPNSRV_PUBLIC_HOSTAME (-o|--operating-system) OS_TYPE (-m|--mode) MODE (-i|--index) INDEX"
        echo
        echo "     -s |--server                 Public FQDN or ip used for vpn connection"
        echo "     -o |--operating-system       Target Operating System (windows|macos|debian|centos|android|docker)"
        echo "     -m |--mode                   Execution mode (install|remove|client)"
        echo "     -i |--index                  Index of the requested credentials (1-65536)"
        echo "     -n |--no-logo                Do not show banner"
        echo
        echo "usage: $0 server [-r|--restart]"
        echo
        echo "     -r |--restart                 Restart the herd-server container"
        echo
        echo "usage: $0 user ([-a|--add] USERNAME | [-r|--remove] USERNAME | [-d|--disable] USERNAME | [-e|--enable] USERNAME)"
        echo
        echo "     -a |--add                    Add a new user"
        echo "     -r |--remove                 Delete a specific user"
        echo "     -d |--disable                Disable a specific user"
        echo "     -e |--enable                 Enable a specific user"
        echo
        echo "usage: $0 asset ([-d|--disable] NAME | [-b|--ban] NAME)"
        echo
        echo "     -d |--disable                Disable a specific asset"
        echo "     -b |--ban                    Revoke and ban client ovpn certificate associated to an asset"
        echo
        echo "usage: $0 system [-i|--init]"
        echo
        echo "     -i |--init                   Initialize the framework creating a new instance seed and storing dob"
    fi
}

###########################################################
# VARIABLES
REDHERD_PATH="$(dirname $(dirname $(readlink -f $0)))"

HERDSRV_NAME="herdsrv"
HERDSRV_ADDRESS="10.10.0.3"
HERDSRV_DB="$REDHERD_PATH/herd-server/models/data/redherd.sqlite3"

OVPNSRV_NAME="ovpnsrv"
OVPN_DATA="ovpn-data-server"

DSTRSRV_NAME="dstrsrv"
DSTRSRV_PATH="$REDHERD_PATH/distrib-server"
DSTRSRV_AUTH_PATH="$REDHERD_PATH/distrib-server/auth"
DSTRSRV_CONF_PATH="$REDHERD_PATH/distrib-server/conf/distribution.conf"
OVPN_CONFIG_PATH="$REDHERD_PATH/ovpn-configs"
PLAIN_FILE_PATH="$REDHERD_PATH/distrib-server/plain"

PUBLIC_ADDRESS="NONE"
OS_TYPE="NONE"
MODE="install"
INDEX=0
NOLOGO="False"

###########################################################


###########################################################
# REALM INIT

function initiateEndpointRealm {
    ### Realm: endpoint
    while [[ $# -gt 0 ]]; do
        key="${1}"
        case ${key} in
        -s|--server)
            PUBLIC_ADDRESS=${2}
            shift
            shift
            ;;
        -o|--operating-system)
            OS_TYPE="${2}"
            shift
            shift
            ;;
        -m|--mode)
            MODE="${2}"
            shift
            shift
            ;;
        -i|--index)
            INDEX=${2}
            shift
            shift
            ;;
        -n|--no-logo)
            NOLOGO="True"
            shift
            ;;
        *)
            ShowHelp
            exit 1
            ;;
        esac
    done
    
    ShowBanner

    if [ "$PUBLIC_ADDRESS" == "NONE" ]; then
            echo
            echo -e "$YELLOW$BOLD [-] Specify the public IP or FQDN for vpn connection $RESET"
            echo
            ShowHelp
            exit 1
    fi
    
    if [ "$OS_TYPE" == "NONE" ]; then
            echo
            echo -e "$YELLOW$BOLD [-] Specify the target Operating System (windows|macos|debian|centos|android|docker) $RESET"
            echo
            ShowHelp
            exit 1
    fi
    
    if [[ "$MODE" != "install" ]] && [[ "$MODE" != "remove" ]] && [[ "$MODE" != "client" ]]; then
            echo
            echo -e "$YELLOW$BOLD [-] Specify the execution mode (install|remove|client) $RESET"
            echo
            ShowHelp
            exit 1
    fi
    
    if [[ $INDEX -lt 1 ]] || [[ $INDEX -gt $(cat $PLAIN_FILE_PATH | wc -l) ]]; then
            echo
            echo -e "$YELLOW$BOLD [-] Specify the index of the requested credentials (1-65536) $RESET"
            echo
            ShowHelp
            exit 1
    fi
}

###########################################################
# GENERAL FUNCTIONS

function getWindowsOneliner {
    ### Windows
    if [ "$MODE" != "client" ]; then
    
        if [ "$MODE" == "install" ]; then
            MODE_METHOD="Add-Asset"
        else
            MODE_METHOD="Remove-Asset"
        fi

read -r -d '' WINDOWS << EOM
\$block = {
[Net.ServicePointManager]::ServerCertificateValidationCallback = {\$true}; \$webclient = New-Object System.Net.WebClient; \$basic = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes("$USERNAME" + ":" + "$PASSWORD"));\$webclient.Headers["Authorization"] = "Basic \$basic";
\$webclient.DownloadFile("https://${PUBLIC_ADDRESS}:8443/${ASSET_FINGERPRINT}/windows_asset_setup.psm1", "script.psm1")
Import-Module .\script.psm1; $MODE_METHOD; Remove-Item .\script.psm1;
}; powershell -ep bypass -nop -c \$block
EOM
        echo "${WINDOWS}"
            
    else
    
read -r -d '' WINDOWS << EOM
\$block = {
[Net.ServicePointManager]::ServerCertificateValidationCallback = {\$true}; \$webclient = New-Object System.Net.WebClient; \$basic = [System.Convert]::ToBase64String([System.Text.Encoding]::ASCII.GetBytes("$USERNAME" + ":" + "$PASSWORD"));\$webclient.Headers["Authorization"] = "Basic \$basic";
\$webclient.DownloadFile("https://${PUBLIC_ADDRESS}:8443/${ASSET_FINGERPRINT}/config.ovpn", "redherd.ovpn")
}; powershell -ep bypass -nop -c \$block
EOM
        echo "${WINDOWS}"
        
        if [ "$NOLOGO" != "True" ]; then
            echo   
            echo -e "$YELLOW$BOLD [!] Manually run OpenVPN with downloaded redherd.ovpn config file $RESET"
            echo
        fi
        
    fi
}

function getDebianOneliner {
    ### Debian
    if [ "$MODE" != "client" ]; then

read -r -d '' DEBIAN << EOM
sudo bash -c "curl -k -u $USERNAME:$PASSWORD https://$PUBLIC_ADDRESS:8443/$ASSET_FINGERPRINT/debian_asset_setup.sh > /tmp/script.sh && \
chmod +x /tmp/script.sh && \
/tmp/script.sh $MODE && \
rm -rf /tmp/script.sh" 
EOM
        echo "${DEBIAN}"
    
    else
    
read -r -d '' DEBIAN << EOM
sudo bash -c "apt update && \
apt install curl openvpn -y && \
curl -k -u $USERNAME:$PASSWORD https://$PUBLIC_ADDRESS:8443/$ASSET_FINGERPRINT/config.ovpn > ./redherd.ovpn && \
/usr/sbin/openvpn ./redherd.ovpn"
EOM
        echo "${DEBIAN}"
        
    fi
}

function getCentOSOneliner {
    ### CentOS
    if [ "$MODE" != "client" ]; then

read -r -d '' CENTOS << EOM
sudo bash -c "curl -k -u $USERNAME:$PASSWORD https://$PUBLIC_ADDRESS:8443/$ASSET_FINGERPRINT/centos_asset_setup.sh > /tmp/script.sh && \
chmod +x /tmp/script.sh && \
/tmp/script.sh $MODE && \
rm -rf /tmp/script.sh" 
EOM
        echo "${CENTOS}"
    
    else
    
read -r -d '' CENTOS << EOM
sudo bash -c "yum install epel-release -y && \
yum makecache && \
yum install curl openvpn -y && \
curl -k -u $USERNAME:$PASSWORD https://$PUBLIC_ADDRESS:8443/$ASSET_FINGERPRINT/config.ovpn > ./redherd.ovpn && \
/usr/sbin/openvpn ./redherd.ovpn"
EOM
        echo "${CENTOS}"
        
    fi
}

function getAndroidOneliner {
    ### Android
    if [ "$MODE" != "client" ]; then
        if [ "$NOLOGO" != "True" ]; then
            echo -e "$YELLOW$BOLD [!] Install Termux, Termux:Boot and Termux:API from Google Play $RESET"
            echo
        fi
        
read -r -d '' ANDROID << EOM
pkg install curl -y && \
curl -k -u $USERNAME:$PASSWORD https://$PUBLIC_ADDRESS:8443/$ASSET_FINGERPRINT/android_asset_setup.sh > ./script.sh && \
chmod +x ./script.sh && \
./script.sh $MODE && \
rm -rf ./script.sh
EOM
        echo "${ANDROID}"
        
    else

        if [ "$NOLOGO" != "True" ]; then
            echo   
            echo -e "$YELLOW$BOLD [!] Manually download the OpenVPN config file: $RESET"
            echo -e "$YELLOW [!] Url: https://$PUBLIC_ADDRESS:8443/$ASSET_FINGERPRINT/config.ovpn $RESET"
            echo -e "$YELLOW [!] Username: $USERNAME $RESET"
            echo -e "$YELLOW [!] Password: $PASSWORD $RESET"
            echo
        fi
        
    fi   
}

function getMacosOneliner {
    ### MacOS
    if [ "$MODE" != "client" ]; then
    
read -r -d '' MACOS << EOM
sudo zsh -c "curl -k -u $USERNAME:$PASSWORD https://$PUBLIC_ADDRESS:8443/$ASSET_FINGERPRINT/macos_asset_setup.sh > /tmp/script.sh && \
chmod +x /tmp/script.sh && \
/tmp/script.sh $MODE && \
rm -rf /tmp/script.sh" 
EOM
        echo "${MACOS}"
        
    else
    
read -r -d '' MACOS << EOM
curl -k -u $USERNAME:$PASSWORD https://$PUBLIC_ADDRESS:8443/$ASSET_FINGERPRINT/config.ovpn > ./redherd.ovpn
EOM
        echo "${MACOS}"
        
        if [ "$NOLOGO" != "True" ]; then
            echo   
            echo -e "$YELLOW$BOLD [!] Manually run OpenVPN with downloaded redherd.ovpn config file $RESET"
            echo
        fi
        
    fi
}

function getDockerOneliner {
    ### Docker
    if [ "$MODE" != "client" ]; then

        if [ "$MODE" == "install" ]; then
read -r -d '' DOCKER << EOM
sudo docker run -d --rm --cap-add=NET_ADMIN \
--device /dev/net/tun \
-e DSTRSRV_PUBLIC_ADDRESS="$PUBLIC_ADDRESS" \
-e USERNAME="$USERNAME" \
-e PASSWORD="$PASSWORD" \
--privileged=true \
--network host \
--name redherd-asset redherd/asset
EOM
        else
read -r -d '' DOCKER << EOM
sudo docker stop redherd-asset
EOM
        fi

        echo "${DOCKER}"
    
    else
    
read -r -d '' DOCKER << EOM
sudo docker run -d --rm --cap-add=NET_ADMIN \
--device /dev/net/tun \
-e DSTRSRV_PUBLIC_ADDRESS="$PUBLIC_ADDRESS" \
-e USERNAME="$USERNAME" \
-e PASSWORD="$PASSWORD" \
--network host \
-v \$(pwd)/redherd-certificates:/usr/local/share/ca-certificates \
--name redherd-client redherd/client
EOM
        echo "${DOCKER}"
        
    fi
}

function restartHerdServer {
    RELOAD=$(docker restart $HERDSRV_NAME)

    if [ "$RELOAD" == "$HERDSRV_NAME" ]; then
        echo -e "$GREEN$BOLD [!] Operation successfully completed $RESET"
    else
        echo -e "$RED$BOLD [!] Operation failed $RESET"
    fi
}

function getUserIdApi {
    USERID=$(sqlite3 $HERDSRV_DB "SELECT id FROM main.users WHERE uname=\"${1}\"")

    if [ -z $USERID ]; then
        echo "-1"
    else
        echo "$USERID"
    fi
}

function addUserApi {
    if [ -z ${1} ]; then
        echo -e "$RED$BOLD [!] Invalid username provided $RESET"
        exit 1
    fi

    read -sp 'New User Password: ' SECRET
    echo; clear

    CRYPT_SECRET=$(htpasswd -bnBC 10 "" $SECRET | tr -d ':\n')

    echo -e "$YELLOW$BOLD [-] Attempting to create the new user $RESET"
    RESULT=$(sqlite3 $HERDSRV_DB "INSERT INTO main.users (uname, secret, enabled) VALUES (\"${1}\", \"${CRYPT_SECRET//\$2y\$/\$2a\$}\", \"1\")")

    if [ -z $RESULT ]; then
        echo -e "$GREEN$BOLD [!] Operation successfully completed $RESET"        
    else
        echo -e "$RED$BOLD [!] Operation failed $RESET"
    fi
}

function removeUserApi {
    USERID=$(getUserIdApi ${1})

    if [ "$USERID" -eq "-1" ]; then
        echo -e "$RED$BOLD [!] Unable to retrieve the requested user $RESET"
        exit 1
    fi

    echo -e "$YELLOW$BOLD [-] Attempting to remove the specified user $RESET"
    RESULT=$(sqlite3 $HERDSRV_DB "DELETE FROM main.users WHERE id=\"$USERID\"")

    if [ -z $RESULT ]; then
        echo -e "$GREEN$BOLD [!] Operation successfully completed $RESET"
    else
        echo -e "$RED$BOLD [!] Operation failed $RESET"
    fi
}

function setUserStatusApi {
    USERID=$(getUserIdApi ${1})

    if [ "$USERID" -eq "-1" ]; then
        echo -e "$RED$BOLD [!] Unable to retrieve the requested user $RESET"
        exit 1
    fi

    echo -e "$YELLOW$BOLD [-] Attempting to modify the user status $RESET"
    RESULT=$(sqlite3 $HERDSRV_DB "UPDATE main.users SET enabled=\"${2}\" WHERE id=\"$USERID\"")

    if [ -z $RESULT ]; then
        echo -e "$GREEN$BOLD [!] Operation successfully completed $RESET"
    else
        echo -e "$RED$BOLD [!] Operation failed $RESET"
    fi
}

function getAssetIdApi {
    ASSETID=$(sqlite3 $HERDSRV_DB "SELECT id FROM main.assets WHERE name=\"${1}\"")

    if [ -z $ASSETID ]; then
        echo "-1"
    else
        echo "$ASSETID"
    fi
}

function setAssetStatusApi {
    ASSETID=$(getAssetIdApi ${1})

    if [ "$ASSETID" -eq "-1" ]; then
        echo -e "$RED$BOLD [!] Unable to retrieve the requested asset $RESET"
        exit 1
    fi

    echo -e "$YELLOW$BOLD [-] Attempting to modify the asset status $RESET"
    RESULT=$(sqlite3 $HERDSRV_DB "UPDATE main.assets SET joined=\"${2}\" WHERE id=\"$ASSETID\"")

    if [ -z $RESULT ]; then
        echo -e "$GREEN$BOLD [!] Operation successfully completed $RESET"
    else
        echo -e "$RED$BOLD [!] Operation failed $RESET"
    fi
}

function revokeClientCertApi {
    echo -e "$YELLOW$BOLD [-] Attempting to revoke client certificate $RESET"

    RESULT=$(docker run -v $OVPN_DATA:/etc/openvpn \
        -v /etc/localtime:/etc/localtime:ro \
        --log-driver=none \
        --rm $OVPNSRV_NAME:latest \
        ovpn_revokeclient ${1} 2>&1)

    if [[ -z $(echo -e "$RESULT" | grep "Data Base Updated") ]]; then
        echo -e "$RED$BOLD [!] Certificate revocation failed $RESET"
    else
        RESTART=$(docker restart $OVPNSRV_NAME)

        if [ "$RESTART" == "$OVPNSRV_NAME" ]; then
            echo -e "$GREEN$BOLD [!] Certificate successfully revoked $RESET"

            revokeDistribUserCredsApi ${1}
        else
            echo -e "$RED$BOLD [!] Incomplete certificate revocation: failed to restart $OVPNSRV_NAME $RESET"
        fi
    fi
}

function revokeDistribUserCredsApi {
    echo -e "$YELLOW$BOLD [-] Attempting to revoke Distribution-Server credentials $RESET"

    RESULT_PLAIN=$(sed -i "/${1}/d" $PLAIN_FILE_PATH 2>&1)

    if [ -z "$RESULT_PLAIN" ]; then
        HASHED_USERNAME=$(echo -n ${1} | md5sum | cut -f1 -d" ")

        RESULT_CONF=$(sed -i "/$HASHED_USERNAME/d" $DSTRSRV_CONF_PATH 2>&1)
        RESULT_AUTH=$(rm -rf "$DSTRSRV_AUTH_PATH/$HASHED_USERNAME.htpasswd" 2>&1)
        RESULT_OVPN=$(rm -rf "$OVPN_CONFIG_PATH/$HASHED_USERNAME" 2>&1)

        if [ -z "$RESULT_CONF" ] && [ -z "$RESULT_AUTH" ] && [ -z "$RESULT_OVPN" ]; then
            RESTART=$(docker restart $DSTRSRV_NAME)

            if [ "$RESTART" == "$DSTRSRV_NAME" ]; then
                echo -e "$GREEN$BOLD [!] Credentials successfully revoked $RESET"
            else
                echo -e "$RED$BOLD [!] Incomplete credentials revocation: failed to restart $DSTRSRV_NAME $RESET"
            fi
        else
            echo -e "$RED$BOLD [!] Distribution-Server config and file cleanup failed $RESET"
        fi
    else
        echo -e "$RED$BOLD [!] Credentials revocation failed $RESET"
    fi
}

function initializeSystemContext {
    SEED=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1 | md5sum | cut -f1 -d" ")

    echo -e "$YELLOW$BOLD [-] Attempting to initialize system context $RESET"
    RESULT=$(sqlite3 $HERDSRV_DB "INSERT INTO main.system (seed, dob) VALUES (\"${SEED}\", DateTime('now'))")

    if [ -z $RESULT ]; then
        echo -e "$GREEN$BOLD [!] Operation successfully completed $RESET"
    else
        echo -e "$RED$BOLD [!] Operation failed $RESET"
    fi
}

###########################################################
# REALM BUSINESS LOGIC

function executeEndpointRealm {
    ### Realm: endpoint
    initiateEndpointRealm $@

    CREDENTIALS=$(sed "${INDEX}q;d" ${PLAIN_FILE_PATH})
    USERNAME=$(echo ${CREDENTIALS} | cut -d ':' -f 1)
    PASSWORD=$(echo ${CREDENTIALS} | cut -d ':' -f 2)
    ASSET_FINGERPRINT=$(echo -n $USERNAME | md5sum | cut -f1 -d" ")
    
    key="${OS_TYPE}"
    case ${key} in
        windows)
            getWindowsOneliner
            ;;
        debian)
            getDebianOneliner
            ;;
        centos)
            getCentOSOneliner
            ;;
        android)
            getAndroidOneliner
            ;;
        macos)
            getMacosOneliner
            ;;
        docker)
            getDockerOneliner
            ;;
        *)
            ShowHelp
            exit 1
            ;;
    esac
    
    if [ "$NOLOGO" != "True" ]; then
        echo
    fi
}

function executeServerRealm {
    ### Realm: server
    if [ "$UID" -eq "0" ]; then
        key="${1}"
        case ${key} in
            -r|--restart)
                echo -e "$YELLOW$BOLD [-] Restarting herd-server container $RESET"
                restartHerdServer
                ;;
            *)
                ShowHelp
                exit 1
                ;;
        esac
        
        if [ "$NOLOGO" != "True" ]; then
            echo
        fi
    else
        echo -e "$YELLOW$BOLD [-] Superuser privileges required $RESET"
        exit 1
    fi
}

function executeUserRealm {
    ### Realm: user
    if [ "$UID" -eq "0" ]; then
        key="${1}"
        case ${key} in
            -a|--add)
                addUserApi ${2}
                ;;
            -r|--remove)
                removeUserApi ${2}
                ;;
            -d|--disable)
                setUserStatusApi ${2} 0
                ;;
            -e|--enable)
                setUserStatusApi ${2} 1
                ;;
            *)
                ShowHelp
                exit 1
                ;;
        esac

        if [ "$NOLOGO" != "True" ]; then
            echo
        fi
    else
        echo -e "$YELLOW$BOLD [-] Superuser privileges required $RESET"
        exit 1
    fi
}

function executeAssetRealm {
    ### Realm: asset
    if [ "$UID" -eq "0" ]; then
        key="${1}"
        case ${key} in
            -d|--disable)
                setAssetStatusApi ${2} 0
                ;;
            -b|--ban)
                revokeClientCertApi ${2}
                ;;
            *)
                ShowHelp
                exit 1
                ;;
        esac
        
        if [ "$NOLOGO" != "True" ]; then
            echo
        fi
    else
        echo -e "$YELLOW$BOLD [-] Superuser privileges required $RESET"
        exit 1
    fi
}

function executeSystemRealm {
    ### Realm: user
    if [ "$UID" -eq "0" ]; then
        key="${1}"
        case ${key} in
            -i|--init)
                initializeSystemContext
                ;;
            *)
                ShowHelp
                exit 1
                ;;
        esac

        if [ "$NOLOGO" != "True" ]; then
            echo
        fi
    else
        echo -e "$YELLOW$BOLD [-] Superuser privileges required $RESET"
        exit 1
    fi
}

###########################################################
# MAIN

if [[ $# -gt 0 ]]; then
    while [[ $# -gt 0 ]]; do
        key="${1}"
        case ${key} in
        endpoint)
            shift
            executeEndpointRealm $@
            exit 0
            ;;
        server)
            shift
            executeServerRealm $@
            exit 0
            ;;
        user)
            shift
            executeUserRealm $@
            exit 0
            ;;
        asset)
            shift
            executeAssetRealm $@
            exit 0
            ;;
        system)
            shift
            executeSystemRealm $@
            exit 0
            ;;
        help)
            ShowHelp
            exit 0
            ;;
        *)
            ShowHelp
            exit 1
            ;;
        esac
    done
else
    ShowHelp
fi