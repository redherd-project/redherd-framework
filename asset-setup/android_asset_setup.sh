#!/data/data/com.termux/files/usr/bin/bash


###### VARIABLES ######
DSTRSRV_PUBLIC_ADDRESS="AAAAAAAAAA"
PUBLIC_DSTRSRV_PORT="8443"
USERNAME="BBBBBBBBBB"
PASSWORD="CCCCCCCCCC"
ASSET_NAME="Android_BBBBBBBBBB"
ASSET_TYPE="android"
ASSET_PORT="2222"
BASE_PATH="/data/data/com.termux/files"
INSTALLATION_PATH="$BASE_PATH/redherd"
INSTALLATION_NAME="redherd.sh"
CERT_NAME="redherdCA"
ENV_HERDSRV="REDHERD_SRV"
HERDSRV_ADDRESS="10.10.0.3"
HERDSRV_PORT="3000"
FTPSRV_ADDRESS="10.10.0.4"
ENV_FTPSRV="REDHERD_FTP"
DATA_PATH=$INSTALLATION_PATH/data
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

function CheckAlreadyInstalled {
        if [[ -d $INSTALLATION_PATH ]]
        then
                echo -e "$YELLOW $BOLD [*] The script is already installed $RESET"
                echo
                exit 1
        fi
}

function ShowHelp {
        echo "usage: $0 [mode]"
        echo
        echo "mode:"
        echo "     install     Add this asset to the RedHerd network"
        echo "     remove      From this asset from the RedHerd network"
        echo "     help        This help"
        echo
}

function InstallDependencies {
        pkg install game-repo -y
        pkg install science-repo -y
        pkg install root-repo -y
        pkg install x11-repo -y
        pkg install unstable-repo -y
        pkg upgrade -y
        pkg install curl dropbear openvpn openssl-tool jq git termux-api lftp cronie -y
        
        termux-setup-storage
        
        rm -rf termux-sudo
        git clone https://gitlab.com/st42/termux-sudo
        cd termux-sudo
        cat sudo > /data/data/com.termux/files/usr/bin/sudo
        chmod 700 /data/data/com.termux/files/usr/bin/sudo
        cd -
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
        curl -k -u $USERNAME:$PASSWORD https://$DSTRSRV_PUBLIC_ADDRESS:$PUBLIC_DSTRSRV_PORT/$ASSET_FINGERPRINT/ca.crt > $INSTALLATION_PATH/$CERT_NAME.crt
        add-trusted-certificate $INSTALLATION_PATH/$CERT_NAME.crt
}

function RemoveCA {
        rm -rf $BASE_PATH/usr/etc/tls/$CERT_NAME.crt
}

function JoinVPN {
        # Download OVPN config
        curl -u $USERNAME:$PASSWORD https://$DSTRSRV_PUBLIC_ADDRESS:$PUBLIC_DSTRSRV_PORT/$ASSET_FINGERPRINT/config.ovpn > $INSTALLATION_PATH/config.ovpn
        
        # Connect to VPN
        sudo openvpn $INSTALLATION_PATH/config.ovpn > /dev/null 2> /dev/null &
        
        # Add networking rules
        sleep 3
        VPN_ADDR=$(ip -o -4 addr list tun0 | awk '{print $4}' | cut -d/ -f1)
        
sudo su <<ROUTING
        echo "252 tvpn" >> /data/misc/net/rt_tables
        ip route add 10.0.0.0/8 dev tun0 src $VPN_ADDR table tvpn
        ip route add default via 10.11.0.1 dev tun0 src $VPN_ADDR table tvpn
        ip rule add from $VPN_ADDR table tvpn
        ip rule add to 10.10.0.0/8 table tvpn
ROUTING
}

function KillVPN {
        sudo pkill openvpn > /dev/null 2> /dev/null
}

function AddCronJob {
        (crontab -l; echo "*/1 * * * *  ! ping -c 3 $HERDSRV_ADDRESS && $INSTALLATION_PATH/$INSTALLATION_NAME rejoin >/dev/null 2>&1") | crontab -
        pkill crond
        crond
}

function RemoveCronJob {
        crontab -l | grep -v "$INSTALLATION_NAME" | crontab -
        pkill crond
        crond
}

function ConfigureSSH {
        # Add herdserver key to authorized keys
        rm -rf $BASE_PATH/home/.ssh
        mkdir -p $BASE_PATH/home/.ssh
        touch $BASE_PATH/home/.ssh/authorized_keys
        curl https://$HERDSRV_ADDRESS:$HERDSRV_PORT/pub.key >> $BASE_PATH/home/.ssh/authorized_keys
        
        # Update SSH banner
        cp $BASE_PATH/usr/etc/motd $INSTALLATION_PATH/motd.bck
        ShowBanner > $BASE_PATH/usr/etc/motd
        
        # Restart SSH service
        pkill dropbear
        # Ensure that the device is prevented from sleeping
        termux-wake-lock
        dropbear -s -p 0.0.0.0:$ASSET_PORT
}

function RestoreSSH {
	# Restore SSH banner
        cp $INSTALLATION_PATH/motd.bck $BASE_PATH/usr/etc/motd
}

function AddEnvVars {
        export $ENV_HERDSRV=$HERDSRV_ADDRESS
        export $ENV_FTPSRV=$FTPSRV_ADDRESS
        export $ENV_DATA=$DATA_PATH
}

function RemoveEnvVars {
        unset $ENV_HERDSRV
        unset $ENV_FTPSRV
        unset $ENV_DATA
}

function CreateStartupScript {
        rm -rf .termux
        mkdir -p .termux/boot

#$ENV_SHARE=$SHARE_PATH

cat <<EOT >> .termux/boot/startup.sh
#!/data/data/com.termux/files/usr/bin/bash

$ENV_HERDSRV=$HERDSRV_ADDRESS
$ENV_FTPSRV=$FTPSRV_ADDRESS
$ENV_DATA=$DATA_PATH
        
termux-wake-lock

dropbear -s -p 0.0.0.0:$ASSET_PORT

$INSTALLATION_PATH/$INSTALLATION_NAME rejoin >/dev/null 2>&1

crond
EOT

chmod +x .termux/boot/startup.sh
}

function RemoveStartupScript {
        rm -f .termux/boot/startup.sh
}

function JoinAsset {
        ASSET_ADDR=$(ip -o -4 addr list tun0 | awk '{print $4}' | cut -d/ -f1)
        ASSET_USER=$(whoami)

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
        echo -e "$GREEN $BOLD [+] Configuring SSH $RESET"
        ConfigureSSH
        echo -e "$GREEN $BOLD [+] Adding environment vars $RESET"
        AddEnvVars
        echo -e "$GREEN $BOLD [+] Creating startup script $RESET"
        CreateStartupScript
        echo -e "$GREEN $BOLD [+] Joining asset $RESET"
        JoinAsset
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
        echo -e "$YELLOW $BOLD [-] Removing Certification Authority $RESET"
        RemoveCA
        echo -e "$YELLOW $BOLD [-] Removing environment vars $RESET"
        RemoveEnvVars
        echo -e "$YELLOW $BOLD [-] Removing startup script $RESET"
        RemoveStartupScript
        echo -e "$YELLOW $BOLD [-] Killing VPN $RESET"
        KillVPN  
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
