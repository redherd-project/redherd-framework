#!/bin/zsh

###### VARIABLES ######
DSTRSRV_PUBLIC_ADDRESS="AAAAAAAAAA"
PUBLIC_DSTRSRV_PORT="8443"
USERID="BBBBBBBBBB"
PASSWORD="CCCCCCCCCC"
ASSET_NAME="$USERNAME"
ASSET_TYPE="macos"
ASSET_PORT="22"
INSTALLATION_PATH="/Users/redherd/redherd"
INSTALLATION_NAME="redherd.sh"
CERT_NAME="redherdCA"
SUDO_USER_USERNAME="redherd"
SUDO_USER_PASSWORD=$(LC_CTYPE=C tr -dc A-Za-z0-9_\!\@\#\$\%\^\&\*\(\)-+= < /dev/urandom | head -c 32 | xargs)
ENV_HERDSRV="REDHERD_SRV"
HERDSRV_ADDRESS="10.10.0.3"
HERDSRV_PORT="3000"
FTPSRV_ADDRESS="10.10.0.4"
ENV_FTPSRV="REDHERD_FTP"
DATA_PATH="$INSTALLATION_PATH/data"
ENV_DATA="REDHERD_DATA"

##### COLORS #####
RESET="\e[0m"
BOLD="\e[1m"
RED="\e[31m"
GREEN="\e[32m"
YELLOW="\e[33m"

function ShowBanner {
    clear
    printf "$RED$BOLD                                                                                        $RESET\n"
    printf "$RED$BOLD  *                                          #                                          $RESET\n"
    printf "$RED$BOLD **                                          (#                                         $RESET\n"
    printf "$RED$BOLD **                                          ((#                                        $RESET\n"
    printf "$RED$BOLD ***                                        #((#                                        $RESET\n"
    printf "$RED$BOLD  ****(         (*****    ((((((          #((((                                         $RESET\n"
    printf "$RED$BOLD   *******************   ((((((((((((((((((((#                                          $RESET\n"
    printf "$RED$BOLD     *****************   ((((((((((((((((((                                             $RESET\n"
    printf "$RED$BOLD          ***********       (((((((((((                                                 $RESET\n"
    printf "$RED$BOLD              *******      (((((((#                                                     $RESET\n"
    printf "$RED$BOLD                  (*****   (((   ______ _______ ______  _     _ _______  ______ ______  $RESET\n"
    printf "$RED$BOLD                   *****  (((   |_____/ |______ |     \ |_____| |______ |_____/ |     \ $RESET\n"
    printf "$RED$BOLD                    ****  ((    |    \_ |______ |_____/ |     | |______ |    \_ |_____/ $RESET\n"
    printf "$RED$BOLD                     *** ((#                                                            $RESET\n"
    printf "$RED$BOLD                     *** (((                                                            $RESET\n"
    printf "$RED$BOLD                                                                                        $RESET\n"
    echo
}

function PrintBanner {
    printf "                                                                                        \n"
    printf "  *                                          #                                          \n"
    printf " **                                          (#                                         \n"
    printf " **                                          ((#                                        \n"
    printf " ***                                        #((#                                        \n"
    printf "  ****(         (*****    ((((((          #((((                                         \n"
    printf "   *******************   ((((((((((((((((((((#                                          \n"
    printf "     *****************   ((((((((((((((((((                                             \n"
    printf "          ***********       (((((((((((                                                 \n"
    printf "              *******      (((((((#                                                     \n"
    printf "                  (*****   (((   ______ _______ ______  _     _ _______  ______ ______  \n"
    printf "                   *****  (((   |_____/ |______ |     \ |_____| |______ |_____/ |     \ \n"
    printf "                    ****  ((    |    \_ |______ |_____/ |     | |______ |    \_ |_____/ \n"
    printf "                     *** ((#                                                            \n"
    printf "                     *** (((                                                            \n"
    printf "                                                                                        \n"
    echo
}

ShowBanner

if [ ! "$UID" -eq "0" ]; then
        printf "$RED $BOLD [*] Run as root user $RESET\n"
        echo
        exit 1
fi

if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ] || [ -z "$ASSET_NAME" ] || [ -z "$DSTRSRV_PUBLIC_ADDRESS" ]; then
        printf "$RED $BOLD [*] Provide a value for the following variables in the script $RESET\n"
        echo
        printf "$RED $BOLD  USERNAME                    Username to access the RedHerd network $RESET\n"
        printf "$RED $BOLD  PASSWORD                    Password to access the RedHerd network $RESET\n"
        printf "$RED $BOLD  ASSET_NAME                  Name of the asset to be added $RESET\n"
        printf "$RED $BOLD  DSTRSRV_PUBLIC_ADDRESS      IP or FQDN of the distribution server $RESET\n"
        echo
        exit 1
fi

function ShowHelp {
        echo "usage: $0 [mode]"
        echo
        echo "mode:"
        echo "     install     Add this asset to the RedHerd network"
        echo "     remove      From this asset from the RedHerd network"
        echo "     help        This help"
        echo
}

function CheckAlreadyInstalled {
        if [[ -d $INSTALLATION_PATH ]]
        then
                printf "$YELLOW $BOLD [*] The script is already installed $RESET\n"
                echo
                exit 1
        fi
}

function AddUser {
	      mkdir /Users/$SUDO_USER_USERNAME

        dscl . -create /Users/$SUDO_USER_USERNAME
        dscl . -create /Users/$SUDO_USER_USERNAME UserShell /bin/zsh
        dscl . -create /Users/$SUDO_USER_USERNAME RealName "RedHerd"
        dscl . -create /Users/$SUDO_USER_USERNAME UniqueID 9999
        dscl . -create /Users/$SUDO_USER_USERNAME PrimaryGroupID 9999
        dscl . -create /Users/$SUDO_USER_USERNAME NFSHomeDirectory /Users/$SUDO_USER_USERNAME
        dscl . -passwd /Users/$SUDO_USER_USERNAME $SUDO_USER_PASSWORD
        dscl . -append /Groups/admin GroupMembership $SUDO_USER_USERNAME

      	chown -R ${SUDO_USER_USERNAME}:admin /Users/${SUDO_USER_USERNAME}

        echo "$SUDO_USER_USERNAME ALL=(ALL) NOPASSWD:ALL" >> /etc/sudoers
}

function RemoveUser {
        dscl . -delete /Users/$SUDO_USER_USERNAME
        rmdir /Users/$SUDO_USER_USERNAME
        sed -i '' "/^$SUDO_USER_USERNAME/d" /etc/sudoers
}

function InstallDependencies {
        sudo -u $SUDO_USER_USERNAME -i /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install.sh)"
        sudo -u $SUDO_USER_USERNAME -i brew install curl openvpn lftp jq iproute2mac
}

function InstallScript {
        mkdir -p $INSTALLATION_PATH
        mkdir -p $DATA_PATH
        cp $ZSH_ARGZERO "$INSTALLATION_PATH/$INSTALLATION_NAME"
}

function RemoveScript {
        rm -rf $INSTALLATION_PATH
}

function InstallCA {
        curl -k -u $USERID:$PASSWORD https://$DSTRSRV_PUBLIC_ADDRESS:$PUBLIC_DSTRSRV_PORT/$ASSET_FINGERPRINT/ca.crt > $INSTALLATION_PATH/$CERT_NAME.crt
        /usr/bin/security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain $INSTALLATION_PATH/$CERT_NAME.crt
}

function RemoveCA {
        rm -rf /System/Library/OpenSSL/certs/$CERT_NAME.crt
        security delete-certificate -c redherd
}

function JoinVPN {
        curl --cacert $INSTALLATION_PATH/$CERT_NAME.crt -u $USERID:$PASSWORD https://$DSTRSRV_PUBLIC_ADDRESS:$PUBLIC_DSTRSRV_PORT/$ASSET_FINGERPRINT/config.ovpn > $INSTALLATION_PATH/config.ovpn
        /usr/local/sbin/openvpn $INSTALLATION_PATH/config.ovpn > /dev/null 2> /dev/null &
}

function KillVPN {
        killall openvpn > /dev/null 2> /dev/null
}

function AddCronJob {
        (crontab -l; echo "*/1 * * * *  ! ping -c 10 $HERDSRV_ADDRESS && $INSTALLATION_PATH/$INSTALLATION_NAME rejoin >/dev/null 2>&1") | crontab -
}

function RemoveCronJob {
        crontab -l | grep -v "$INSTALLATION_NAME" | crontab -
}

function ConfigureSSH {
        # Add herdserver key to authorized keys
        rm -rf /Users/$SUDO_USER_USERNAME/.ssh
        mkdir -p /Users/$SUDO_USER_USERNAME/.ssh
        touch /Users/$SUDO_USER_USERNAME/.ssh/authorized_keys
        chown -R ${SUDO_USER_USERNAME}:admin /Users/$SUDO_USER_USERNAME/.ssh
        curl --cacert $INSTALLATION_PATH/$CERT_NAME.crt --connect-timeout 2 --max-time 10 --retry 5 https://$HERDSRV_ADDRESS:$HERDSRV_PORT/pub.key > /Users/$SUDO_USER_USERNAME/.ssh/authorized_keys

        # Update SSH banner
        PrintBanner > $INSTALLATION_PATH/motd
        echo "Banner $INSTALLATION_PATH/motd" >> /etc/ssh/sshd_config

        # Enable SSH Server
        systemsetup -f -setremotelogin on
}

function RestoreSSH {
        # Restore SSH banner
        sed -i '' "/^Banner $INSTALLATION_PATH\/motd/d" /etc/ssh/sshd_config

        # Disable SSH Server
        systemsetup -f -setremotelogin off
}

function AddEnvVars {
        export $ENV_HERDSRV=$HERDSRV_ADDRESS
        echo "export $ENV_HERDSRV=$HERDSRV_ADDRESS" >> /Users/$SUDO_USER_USERNAME/.zshrc

        export $ENV_FTPSRV=$FTPSRV_ADDRESS
        echo "export $ENV_FTPSRV=$FTPSRV_ADDRESS" >> /Users/$SUDO_USER_USERNAME/.zshrc

        export $ENV_DATA=$DATA_PATH
        echo "export $ENV_DATA=$DATA_PATH" >> /Users/$SUDO_USER_USERNAME/.zshrc
}

function RemoveEnvVars {
        unset $ENV_HERDSRV
        unset $ENV_FTPSRV
        unset $ENV_DATA
}

function JoinAsset {
        ASSET_ADDR=$(ip route get ${HERDSRV_ADDRESS} | awk '{gsub(".*src",""); print $1; exit}')
        ASSET_USER=$SUDO_USER_USERNAME

        # Get asset types
        TYPES=$(curl --cacert $INSTALLATION_PATH/$CERT_NAME.crt https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/types )
        TYPE_IDS=( $(echo ${TYPES} | jq -r '.data.types | .[] | .id') )
        TYPE_NAMES=( $(echo ${TYPES} | jq -r '.data.types | .[] | .name') )
        ## zsh array indexes start from 1
        for (( i=1; i<=${#TYPE_IDS[@]}; i++ ));
        do
                TYPE_ID=${TYPE_IDS[$i]}
                TYPE_NAME=${TYPE_NAMES[$i]}
                if [[ "${TYPE_NAME}" == "${ASSET_TYPE}" ]]
                then
                        ASSET_TYPE_ID=${TYPE_ID}
                fi
        done

        # Check if the asset already exists
        ASSET=$(curl --cacert $INSTALLATION_PATH/$CERT_NAME.crt https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/assets/${ASSET_FINGERPRINT})
        ASSET_ID=$(echo ${ASSET} | jq -r '.data.asset.id')
        
        if [ "${ASSET_ID}" == "null" ]; then
		# Asset doesn't exist --> add
               ASSET_STATUS=$(curl --cacert $INSTALLATION_PATH/$CERT_NAME.crt -X  POST \
                                   -H "Content-Type: application/json" \
                                   -d "{ \"name\":\"${ASSET_NAME}\", \"ip\":\"${ASSET_ADDR}\", \"user\":\"${ASSET_USER}\", \"wport\":\"${ASSET_PORT}\", \"fingerprint\":\"${ASSET_FINGERPRINT}\", \"id_type\":\"${ASSET_TYPE_ID}\", \"joined\":\"true\" }" \
                                   https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/assets | jq -r '.status')
        else
               # Asset exists --> update 
               ASSET_STATUS=$(curl --cacert $INSTALLATION_PATH/$CERT_NAME.crt -X  PUT \
                                   -H "Content-Type: application/json" \
                                   -d "{ \"name\":\"${ASSET_NAME}\", \"ip\":\"${ASSET_ADDR}\", \"user\":\"${ASSET_USER}\", \"wport\":\"${ASSET_PORT}\", \"id_type\":\"${ASSET_TYPE_ID}\", \"joined\":\"true\" }" \
                                   https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/assets/${ASSET_FINGERPRINT} | jq -r '.status')               
        fi
        
         # Verify if asset has correctly joined
        if [ "${ASSET_STATUS}" == "success" ]; then
               echo -e "$GREEN $BOLD [+] Successful joining $RESET"
        else
               echo -e "$RED $BOLD [-] Error during joining $RESET"
}

function UnjoinAsset {
        ASSET_STATUS=$(curl --cacert $INSTALLATION_PATH/$CERT_NAME.crt -X  PUT \
                            -H "Content-Type: application/json" \
                            -d "{ \"joined\":\"false\" }" \
                            https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/assets/${ASSET_FINGERPRINT} | jq -r '.status')               

        # Verify if asset has correctly joined
        if [ "${ASSET_STATUS}" == "success" ]; then
               echo -e "$GREEN $BOLD [+] Successful un-joining $RESET"
        else
               echo -e "$RED $BOLD [-] Error during un-joining $RESET"
}

function ConfigureFirewall {
        /usr/sbin/ufw --force reset
        /usr/sbin/ufw default allow incoming
        /usr/sbin/ufw --force enable
}

function ResetFirewall {
        /usr/sbin/ufw --force reset
        /usr/sbin/ufw --force disable
}

ASSET_FINGERPRINT=$(echo -n $USERID | /sbin/md5)
#######################

if [[ $# -eq 0 ]]; then
        ShowHelp
        exit 1
fi

while [[ $# -gt 0 ]]; do
    key="${1}"
    case ${key} in
    install)
        # INSTALL
        CheckAlreadyInstalled
        printf "$YELLOW $BOLD [*] Installing $RESET\n"
        printf "$GREEN $BOLD [+] Adding user $SUDO_USER_USERNAME to sudoers $RESET\n"
        AddUser
        printf "$YELLOW $BOLD [+] User: $SUDO_USER_USERNAME - Password: $SUDO_USER_PASSWORD $RESET\n"
        printf "$GREEN $BOLD [+] Installing dependencies $RESET\n"
        InstallDependencies
        printf "$GREEN $BOLD [+] Installing script into system folder $RESET\n"
        InstallScript
        printf "$GREEN $BOLD [+] Installing Certification Authority $RESET\n"
        InstallCA
        printf "$GREEN $BOLD [+] Joining VPN $RESET\n"
        KillVPN
        JoinVPN
        printf "$GREEN $BOLD [+] Adding cron job $RESET\n"
        RemoveCronJob
        AddCronJob
        printf "$GREEN $BOLD [+] Configuring SSH $RESET\n"
        ConfigureSSH
        printf "$GREEN $BOLD [+] Adding environment vars $RESET\n"
        AddEnvVars
        printf "$GREEN $BOLD [+] Joining asset $RESET\n"
        JoinAsset
        #printf "$GREEN $BOLD [+] Enabling firewall $RESET\n"
        #ConfigureFirewall
        exit 0
        ;;
    remove)
        # REMOVE
        printf "$YELLOW $BOLD [*] Removing $RESET\n"
        printf "$YELLOW $BOLD [-] Un-joining asset $RESET\n"
        UnjoinAsset
        printf "$YELLOW $BOLD [-] Removing cron job $RESET\n"
        RemoveCronJob
        printf "$YELLOW $BOLD [-] Removing SSH customization $RESET\n"
        RestoreSSH
        printf "$YELLOW $BOLD [-] Removing script from system folder $RESET\n"
        RemoveScript
        printf "$YELLOW $BOLD [-] Removing Certification Authority $RESET\n"
        RemoveCA
        printf "$YELLOW $BOLD [-] Removing environment vars $RESET\n"
        RemoveEnvVars
        printf "$YELLOW $BOLD [-] Killing VPN $RESET\n"
        KillVPN
        printf "$YELLOW $BOLD [-] Removing $SUDO_USER_USERNAME $RESET\n"
        RemoveUser
        #printf "$YELLOW $BOLD [-] Disabling firewall $RESET\n"
        #ResetFirewall
        exit 0
        ;;
    rejoin)
        # UPDATE
        printf "$GREEN $BOLD [+] Joining VPN $RESET\n"
        KillVPN
        JoinVPN
        printf "$GREEN $BOLD [+] Joining asset $RESET\n"
        JoinAsset
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
