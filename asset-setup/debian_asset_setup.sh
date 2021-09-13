#!/bin/bash

###### VARIABLES ######
DSTRSRV_PUBLIC_ADDRESS="AAAAAAAAAA"
PUBLIC_DSTRSRV_PORT="8443"
USERNAME="BBBBBBBBBB"
PASSWORD="CCCCCCCCCC"
ASSET_NAME="$USERNAME"
ASSET_TYPE="debian"
ASSET_PORT="22"
INSTALLATION_PATH="/etc/redherd"
INSTALLATION_NAME="redherd.sh"
CERT_NAME="redherdCA"
SUDO_USER_USERNAME="redherd"
SUDO_USER_PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
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
    echo -e "$RED$BOLD                     *** ((#                                                            $RESET"
    echo -e "$RED$BOLD                     *** (((                                                            $RESET"
    echo -e "$RED$BOLD                                                                                        $RESET"
    echo
}

ShowBanner

if [ ! "$UID" -eq "0" ]; then
        echo -e "$RED $BOLD [*] Run as root user $RESET"
        echo
        exit 1
fi

if [ -z "$USERNAME" ] || [ -z "$PASSWORD" ] || [ -z "$ASSET_NAME" ] || [ -z "$DSTRSRV_PUBLIC_ADDRESS" ]; then
        echo -e "$RED $BOLD [*] Provide a value for the following variables in the script $RESET"
        echo
        echo -e "$RED $BOLD  USERNAME                    Username to access the RedHerd network $RESET"
        echo -e "$RED $BOLD  PASSWORD                    Password to access the RedHerd network $RESET"
        echo -e "$RED $BOLD  ASSET_NAME                  Name of the asset to be added $RESET"
        echo -e "$RED $BOLD  DSTRSRV_PUBLIC_ADDRESS      IP or FQDN of the distribution server $RESET"
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
                echo -e "$YELLOW $BOLD [*] The script is already installed $RESET"
                echo
                exit 1
        fi
}

function InstallDependencies {
        apt update
        apt install curl psmisc openssh-server openvpn jq ca-certificates iptables ufw lftp -y
}

function InstallScript {
        mkdir -p $INSTALLATION_PATH
        mkdir -p $DATA_PATH
        cp "$(readlink -f $0)" "$INSTALLATION_PATH/$INSTALLATION_NAME"
}

function RemoveScript {
        rm -rf $INSTALLATION_PATH
}

function InstallCA {
        curl -k -u $USERNAME:$PASSWORD https://$DSTRSRV_PUBLIC_ADDRESS:$PUBLIC_DSTRSRV_PORT/$ASSET_FINGERPRINT/ca.crt > /usr/local/share/ca-certificates/$CERT_NAME.crt
        /usr/sbin/update-ca-certificates
}

function RemoveCA {
        rm -rf /usr/local/share/ca-certificates/$CERT_NAME.crt
        /usr/sbin/update-ca-certificates --fresh
}

function JoinVPN {
        curl -u $USERNAME:$PASSWORD https://$DSTRSRV_PUBLIC_ADDRESS:$PUBLIC_DSTRSRV_PORT/$ASSET_FINGERPRINT/config.ovpn > $INSTALLATION_PATH/config.ovpn
        /usr/sbin/openvpn $INSTALLATION_PATH/config.ovpn > /dev/null 2> /dev/null &
}

function KillVPN {
        killall openvpn > /dev/null 2> /dev/null
}

function AddCronJob {
        (crontab -l; echo "*/1 * * * *  ! ping -c 3 $HERDSRV_ADDRESS && $INSTALLATION_PATH/$INSTALLATION_NAME rejoin >/dev/null 2>&1") | crontab -
        service cron reload > /dev/null 2> /dev/null
}

function RemoveCronJob {
        crontab -l | grep -v "$INSTALLATION_NAME" | crontab -
        service cron reload > /dev/null 2> /dev/null
}

function AddUser {
        sudo /usr/sbin/useradd $SUDO_USER_USERNAME -m --shell /bin/bash --password $(echo $SUDO_USER_PASSWORD | openssl passwd -1 -stdin) > /dev/null 2>&1
        /usr/sbin/usermod -aG sudo $SUDO_USER_USERNAME
        echo "$SUDO_USER_USERNAME  ALL=(ALL:ALL) NOPASSWD:ALL" >> /etc/sudoers
        chown $SUDO_USER_USERNAME:$SUDO_USER_USERNAME $DATA_PATH
}

function RemoveUser {
        sudo /usr/sbin/userdel -f -r $SUDO_USER_USERNAME > /dev/null 2>&1
        grep -v "$SUDO_USER_USERNAME" /etc/sudoers > /tmp/sudoers
        mv /tmp/sudoers /etc/sudoers
}

function ConfigureSSH {
        # Add herdserver key to authorized keys
        rm -rf /home/$SUDO_USER_USERNAME/.ssh
        mkdir -p /home/$SUDO_USER_USERNAME/.ssh
        touch /home/$SUDO_USER_USERNAME/.ssh/authorized_keys
        chown -R $SUDO_USER_USERNAME:$SUDO_USER_USERNAME /home/$SUDO_USER_USERNAME/.ssh
        curl https://$HERDSRV_ADDRESS:$HERDSRV_PORT/pub.key > /home/$SUDO_USER_USERNAME/.ssh/authorized_keys
        
        # Update SSH banner
        cp /etc/motd $INSTALLATION_PATH/motd.bck
        ShowBanner > /etc/motd
        
        # Restart SSH service
        systemctl restart ssh.service
}

function RestoreSSH {
	# Restore SSH banner
        cp $INSTALLATION_PATH/motd.bck /etc/motd
}

function AddEnvVars {
        export $ENV_HERDSRV=$HERDSRV_ADDRESS
        echo "$ENV_HERDSRV=$HERDSRV_ADDRESS" >> /etc/environment
        
        export $ENV_FTPSRV=$FTPSRV_ADDRESS
        echo "$ENV_FTPSRV=$FTPSRV_ADDRESS" >> /etc/environment
        
        export $ENV_DATA=$DATA_PATH
        echo "$ENV_DATA=$DATA_PATH" >> /etc/environment
}

function RemoveEnvVars {
        unset $ENV_HERDSRV
        sed -i "/^$ENV_HERDSRV/d" /etc/environment
                
        unset $ENV_FTPSRV
        sed -i "/^$ENV_FTPSRV/d" /etc/environment
        
        unset $ENV_DATA
        sed -i "/^$ENV_DATA/d" /etc/environment
}


function JoinAsset {
        ASSET_ADDR=$(/sbin/ip -o -4 addr list tun0 | awk '{print $4}' | cut -d/ -f1)
        ASSET_USER=$SUDO_USER_USERNAME

        # Get asset types
        TYPES=$(curl https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/types)
        TYPE_IDS=( $(echo ${TYPES} | jq -r '.data.types | .[] | .id') )
        TYPE_NAMES=( $(echo ${TYPES} | jq -r '.data.types | .[] | .name') )
        for (( i=0; i<${#TYPE_IDS[@]}; i++ ));
        do
                TYPE_ID=${TYPE_IDS[$i]}
                TYPE_NAME=${TYPE_NAMES[$i]}
                if [ "${TYPE_NAME}" == "${ASSET_TYPE}" ]
                then
                        ASSET_TYPE_ID=${TYPE_ID}
                fi
        done

        # Check if the asset already exists
        ASSET=$(curl https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/assets/${ASSET_FINGERPRINT})
        ASSET_ID=$(echo ${ASSET} | jq -r '.data.asset.id')
        
        if [ "${ASSET_ID}" == "null" ]; then
		# Asset doesn't exist --> add
               ASSET_STATUS=$(curl -X  POST \
                                   -H "Content-Type: application/json" \
                                   -d "{ \"name\":\"${ASSET_NAME}\", \"ip\":\"${ASSET_ADDR}\", \"user\":\"${ASSET_USER}\", \"wport\":\"${ASSET_PORT}\", \"fingerprint\":\"${ASSET_FINGERPRINT}\", \"id_type\":\"${ASSET_TYPE_ID}\", \"joined\":\"true\" }" \
                                   https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/assets | jq -r '.status')
        else
               # Asset exists --> update 
               ASSET_STATUS=$(curl -X  PUT \
                                   -H "Content-Type: application/json" \
                                   -d "{ \"name\":\"${ASSET_NAME}\", \"ip\":\"${ASSET_ADDR}\", \"user\":\"${ASSET_USER}\", \"wport\":\"${ASSET_PORT}\", \"id_type\":\"${ASSET_TYPE_ID}\", \"joined\":\"true\" }" \
                                   https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/assets/${ASSET_FINGERPRINT} | jq -r '.status')               
        fi

        # Verify if asset has correctly joined
        if [ "${ASSET_STATUS}" == "success" ]; then
               echo -e "$GREEN $BOLD [+] Successful joining $RESET"
        else
               echo -e "$RED $BOLD [-] Error during joining $RESET"
        fi
}

function UnjoinAsset {
        ASSET_STATUS=$(curl -X  PUT \
                            -H "Content-Type: application/json" \
                            -d "{ \"joined\":\"false\" }" \
                            https://${HERDSRV_ADDRESS}:${HERDSRV_PORT}/api/assets/${ASSET_FINGERPRINT} | jq -r '.status')               

        # Verify if asset has correctly joined
        if [ "${ASSET_STATUS}" == "success" ]; then
               echo -e "$GREEN $BOLD [+] Successful un-joining $RESET"
        else
               echo -e "$RED $BOLD [-] Error during un-joining $RESET"
        fi
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

ASSET_FINGERPRINT=$(echo -n $USERNAME | md5sum | cut -f1 -d" ")

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
        echo -e "$YELLOW $BOLD [*] Installing $RESET"
        echo -e "$GREEN $BOLD [+] Installing dependencies $RESET"
        InstallDependencies
        echo -e "$GREEN $BOLD [+] Installing script into system folder $RESET"
        InstallScript
        echo -e "$GREEN $BOLD [+] Installing Certification Authority $RESET"
        InstallCA
        echo -e "$GREEN $BOLD [+] Joining VPN $RESET"
        KillVPN
        JoinVPN
        sleep 3
        echo -e "$GREEN $BOLD [+] Adding cron job $RESET"
        RemoveCronJob
        AddCronJob
        echo -e "$GREEN $BOLD [+] Adding user $SUDO_USER_USERNAME to sudoers $RESET"
        AddUser
        echo -e "$YELLOW $BOLD [+] User: $SUDO_USER_USERNAME - Password: $SUDO_USER_PASSWORD $RESET"
        echo -e "$GREEN $BOLD [+] Configuring SSH $RESET"
        ConfigureSSH
        echo -e "$GREEN $BOLD [+] Adding environment vars $RESET"
        AddEnvVars
        echo -e "$GREEN $BOLD [+] Joining asset $RESET"
        JoinAsset
        echo -e "$GREEN $BOLD [+] Enabling firewall $RESET"
        ConfigureFirewall
        exit 0
        ;;
    remove)
        # REMOVE
        echo -e "$YELLOW $BOLD [*] Removing $RESET"
        echo -e "$YELLOW $BOLD [-] Un-joining asset $RESET"
        UnjoinAsset
        echo -e "$YELLOW $BOLD [-] Removing cron job $RESET"
        RemoveCronJob
        echo -e "$YELLOW $BOLD [-] Removing SSH customization $RESET"
        RestoreSSH
        echo -e "$YELLOW $BOLD [-] Removing script from system folder $RESET"
        RemoveScript
        echo -e "$YELLOW $BOLD [-] Removing $SUDO_USER_USERNAME $RESET"
        RemoveUser
        echo -e "$YELLOW $BOLD [-] Removing Certification Authority $RESET"
        RemoveCA
        echo -e "$YELLOW $BOLD [-] Removing environment vars $RESET"
        RemoveEnvVars
        echo -e "$YELLOW $BOLD [-] Killing VPN $RESET"
        KillVPN
        echo -e "$YELLOW $BOLD [-] Disabling firewall $RESET"
        ResetFirewall    
        exit 0
        ;;
    rejoin)
        # UPDATE
        echo -e "$GREEN $BOLD [+] Joining VPN $RESET"
        KillVPN
        JoinVPN
        sleep 3
        echo -e "$GREEN $BOLD [+] Joining asset $RESET"
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

