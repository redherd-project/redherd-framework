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

function ShowHelp {
        echo "usage: $0 (-s|--server) VPNSRV_PUBLIC_HOSTAME"
        echo
        echo "ARGS:"
        echo "     -s |--server                 Public FQDN or ip used for vpn connection"
        echo "     -a |--assets-count           Number of desired ovpn files (default:1, min:1, max:256)"
        echo "     -ca|--cert-auth              Create a new Certification Autorithy"
        echo "     -db |--init-db               Initialize database"
        echo "     -c |--generate-certs         Generate SSL certificates"
        echo "     -u |--generate-users         Generate user/password list for distribution server"
        echo "     -k |--generate-keys          Generate the SSH key pair"
        echo "     -d |--destroy                Destroy the server infrastructure"
        echo "     -h |--help                   This help"
        echo
}

function InstallDependencies {
        apt update
        apt install -y apache2-utils sqlite3
}

function DestroyInfrastructure {
        echo -e "$YELLOW$BOLD [*] Docker environment cleanup $RESET"

        docker rm $DOCKER_OVPNSRV_NAME --force
        docker rmi $DOCKER_OVPNSRV_NAME:latest --force

        docker rm $DOCKER_HERDSRV_NAME --force
        docker rmi $DOCKER_HERDSRV_NAME:latest --force

        docker rm $DOCKER_FTPSRV_NAME --force
        docker rmi $DOCKER_FTPSRV_NAME:latest --force

        docker rm $DOCKER_HERDVIEW_NAME --force
        docker rmi $DOCKER_HERDVIEW_NAME:latest --force
        
        docker rm $DOCKER_DSTRSRV_NAME --force
        docker rmi $DOCKER_DSTRSRV_NAME:latest --force

        docker system prune --force

        docker network rm $DOCKER_NET

        docker volume rm $OVPN_DATA

        echo -e "$YELLOW$BOLD [*] Uninstalling Herd-CLI $RESET"
        rm -f $HERDCLI_INSTALLATION_PATH/herd-cli

        echo -e "$YELLOW$BOLD [*] Removing herd-modules alias $RESET"
        sed -i '/^alias\ herd-modules/d' /etc/bash.bashrc
}


if [ ! "$UID" -eq "0" ]; then
        echo "Run as root user"
        exit 1
fi

###########################################################
# VARIABLES
INIT_DB="FALSE"
GENERATE_CA="FALSE"
GENERATE_CERTS="FALSE"
GENERATE_KEYS="FALSE"
GENERATE_USERS="FALSE"

PUBLIC_ADDRESS="NONE"
ASSETS_COUNT=1

DOCKER_NET="internal"
DOCKER_NET_ADDRESS="10.10.0.0"
DOCKER_NET_CIDR=16
DOCKER_NET_NETMASK="255.255.0.0"

VPN_CIDR="10.11.0.0/16"
OVPN_DATA="ovpn-data-server"
OVPN_CONFIG_PATH="$(pwd)/ovpn-configs"

DOCKER_OVPNSRV_NAME="ovpnsrv"
DOCKER_OVPNSRV_ADDRESS="10.10.0.2"
DOCKER_OVPNSRV_PATH="$(pwd)/ovpn-server"

DOCKER_HERDSRV_NAME="herdsrv"
DOCKER_HERDSRV_ADDRESS="10.10.0.3"
DOCKER_HERDSRV_PATH="$(pwd)/herd-server"
DOCKER_HERDSRV_MODULES_PATH="$DOCKER_HERDSRV_PATH/bin/module/collection"
DOCKER_HERDSRV_DB_PATH="$DOCKER_HERDSRV_PATH/models/data"

DOCKER_FTPSRV_NAME="ftpsrv"
DOCKER_FTPSRV_ADDRESS="10.10.0.4"
DOCKER_FTPSRV_PATH="$(pwd)/ftp-server"
ASSETS_SHARE_PATH="$(pwd)/share"
FTP_USER_NAME="redherd"
FTP_USER_PASS="redherd"

DOCKER_HERDVIEW_NAME="herdview"
DOCKER_HERDVIEW_ADDRESS="10.10.0.5"
DOCKER_HERDVIEW_PATH="$(pwd)/herd-view"

DOCKER_DSTRSRV_NAME="dstrsrv"
DOCKER_DSTRSRV_PATH="$(pwd)/distrib-server"

HERDCLI_PATH="$(pwd)/herd-cli/herd-cli.sh"
HERDCLI_INSTALLATION_PATH="/usr/bin"

CA_PATH="$(pwd)/CA"
ASSET_SETUP_PATH="$(pwd)/asset-setup"
ETC_PATH="$(pwd)/etc"
###########################################################


###########################################################
# SCRIPT ARGS

ShowBanner

while [[ $# -gt 0 ]]; do
    key="${1}"
    case ${key} in
    -s|--server)
        PUBLIC_ADDRESS=${2}
        shift
        shift
        ;;
    -a|--assets-count)
        ASSETS_COUNT="${2}"
        shift
        shift
        ;;
    -db|--init-db)
        INIT_DB="TRUE"
        shift
        ;;
    -ca|--cert-auth)
        GENERATE_CA="TRUE"
        GENERATE_CERTS="TRUE"
        shift
        ;;
    -c|--generate-certs)
        GENERATE_CERTS="TRUE"
        shift
        ;;
    -u|--generate-users)
        GENERATE_USERS="TRUE"
        shift
        ;;
    -k|--generate-keys)
        GENERATE_KEYS="TRUE"
        shift
        ;;
    -d|--destroy)
        DestroyInfrastructure
        exit 0
        ;;
    -h|--help)
        ShowHelp
        exit 0
        ;;
    *)
        ShowHelp
        exit 1
        ;;
    esac
done

if [ "$PUBLIC_ADDRESS" == "NONE" ]; then
        ShowHelp
        exit 1
fi

RE='^[0-9]+$'
if ! [[ $ASSETS_COUNT =~ $RE ]] || [[ $ASSETS_COUNT -lt 1 ]] || [[ $ASSETS_COUNT -gt 256 ]]; then
        ShowHelp
        exit 1
fi

echo "[*] DETECTED PARAMETERS:"
echo "===================================================="
echo "[!] INIT DB: $INIT_DB"
echo "[!] GENERATE CA: $GENERATE_CA"
echo "[!] GENERATE CERTS: $GENERATE_CERTS"
echo "[!] GENERATE KEYS: $GENERATE_KEYS"
echo "[!] GENERATE USERS: $GENERATE_USERS"
echo "[!] PUBLIC HOSTNAME: $PUBLIC_ADDRESS"
echo "[!] ASSETS COUNT: $ASSETS_COUNT"
echo "[!] VPN NET CIDR: $VPN_CIDR"
echo "[!] DOCKER OVPNSRV NAME: $DOCKER_OVPNSRV_NAME"
echo "[!] DOCKER OVPNSRV ADDRESS: $DOCKER_OVPNSRV_ADDRESS"
echo "[!] DOCKER HERDSRV NAME: $DOCKER_HERDSRV_NAME"
echo "[!] DOCKER HERDSRV ADDRESS: $DOCKER_HERDSRV_ADDRESS"
echo "[!] DOCKER HERDVIEW NAME: $DOCKER_HERDVIEW_NAME"
echo "[!] DOCKER HERDVIEW ADDRESS: $DOCKER_HERDVIEW_ADDRESS"
echo "[!] DOCKER FTPSRV NAME: $DOCKER_FTPSRV_NAME"
echo "[!] DOCKER FTPSRV ADDRESS: $DOCKER_FTPSRV_ADDRESS"
echo "[!] DOCKER DSTRSRV NAME: $DOCKER_DSTRSRV_NAME"
echo "===================================================="

read -p "Continue? [y/N]: " -r; echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        exit 0
fi
###########################################################

###########################################################
# DOCKER ENV CLEANUP
DestroyInfrastructure
###########################################################

###########################################################
# DEPENDENCIES INSTALLATION
echo -e "$YELLOW$BOLD [*] Installing dependencies $RESET"
InstallDependencies
###########################################################

###########################################################
# DOCKER NETWORK
echo -e "$GREEN$BOLD [*] Docker network creation $RESET"
docker network create $DOCKER_NET --subnet $DOCKER_NET_ADDRESS/$DOCKER_NET_CIDR
###########################################################

###########################################################
# OVPN SERVER
echo -e "$GREEN$BOLD [*] Docker OPENVPN server building $RESET"
docker build -t $DOCKER_OVPNSRV_NAME:latest $DOCKER_OVPNSRV_PATH

docker volume create --name $OVPN_DATA

echo -e "$GREEN$BOLD [*] Docker OPENVPN server config generation $RESET"
docker run -v $OVPN_DATA:/etc/openvpn \
        -v /etc/localtime:/etc/localtime:ro \
        --log-driver=none \
        --rm \
        $DOCKER_OVPNSRV_NAME:latest ovpn_genconfig \
        -u udp://$PUBLIC_ADDRESS \
        -s $VPN_CIDR \
        -p "route $DOCKER_NET_ADDRESS $DOCKER_NET_NETMASK" \
        -b #-c
        
echo -e "$GREEN$BOLD [*] Docker OPENVPN server CA initialization $RESET"
docker run -v $OVPN_DATA:/etc/openvpn \
        -v /etc/localtime:/etc/localtime:ro \
        --log-driver=none \
        --rm \
        -it \
        $DOCKER_OVPNSRV_NAME:latest ovpn_initpki nopass

echo -e "$GREEN$BOLD [*] Docker OPENVPN server starting $RESET"
docker run --name $DOCKER_OVPNSRV_NAME \
        --network $DOCKER_NET \
        --ip $DOCKER_OVPNSRV_ADDRESS \
        -v $OVPN_DATA:/etc/openvpn \
        -v /etc/localtime:/etc/localtime:ro \
        -p 1194:1194/udp \
        -d \
        --cap-add=NET_ADMIN \
        $DOCKER_OVPNSRV_NAME:latest
###########################################################

###########################################################
# CLEANING CONFIG FILEs
echo -e "$YELLOW$BOLD [*] Cleaning old config files $RESET"
rm -f $DOCKER_DSTRSRV_PATH/auth/*
rm -f $DOCKER_DSTRSRV_PATH/conf/distribution.conf
rm -rf $OVPN_CONFIG_PATH/*
###########################################################

###########################################################
# CERTIFICATION AUTHORITY
# https://gist.github.com/fntlnz/cf14feb5a46b2eda428e000157447309

if [ "$GENERATE_CA" == "TRUE" ]; then
        echo -e "$GREEN$BOLD [*] Generating Certification Authority $RESET"

        echo -e "$GREEN$BOLD [*] Creating Root Key $RESET"
        rm -f $CA_PATH/ca.key
        # openssl genrsa -des3 -out $CA_PATH/ca.key 4096        # With password
        openssl genrsa -out $CA_PATH/ca.key 4096                # Without password

        echo -e "$GREEN$BOLD [*] Create and self sign the Root Certificate $RESET"
        rm -f $CA_PATH/ca.crt
        # Here we use our root key to create the root certificate that needs to be distributed in all the computers that have to trust us.
        openssl req -x509 -new -nodes -subj "/C=IT/ST=IT/O=RedHerd/CN=RedHerd" -key $CA_PATH/ca.key -sha256 -days 1024 -out $CA_PATH/ca.crt

        # Copy root CA certificate for Socket.IO https implementation and public download
        rm -f $DOCKER_HERDSRV_PATH/ssl/ca.crt
        cp $CA_PATH/ca.crt $DOCKER_HERDSRV_PATH/ssl/ca.crt
        cp $CA_PATH/ca.crt $DOCKER_HERDSRV_PATH/public/ca.crt        
fi
###########################################################

###########################################################
# USERS GENERATION
if [ "$GENERATE_USERS" == "TRUE" ]; then
        echo -e "$YELLOW$BOLD [*] Generating user credentials $RESET"
        rm -f $DOCKER_DSTRSRV_PATH/plain
        for i in {001..256}; 
        do
                USERNAME=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 10 | head -n 1)
                PASSWORD=$(cat /dev/urandom | tr -dc 'a-zA-Z0-9' | fold -w 32 | head -n 1)
                echo "$USERNAME:$PASSWORD" >> $DOCKER_DSTRSRV_PATH/plain 
        done
fi
###########################################################

###########################################################
# OVPN CLIENT CONFIG FILEs
echo '
limit_req_zone $binary_remote_addr zone=backend_oauth:10m rate=5r/s;

server {
        listen              443 ssl;
        server_name         localhost;
        
        limit_req zone=backend_oauth nodelay;
        limit_req_status 429;
        
        ssl_certificate     /etc/nginx/cert.pem;
        ssl_certificate_key /etc/nginx/key.pem;
        root /var/www/html;
' > $DOCKER_DSTRSRV_PATH/conf/distribution.conf

mapfile -t USER_LIST < $DOCKER_DSTRSRV_PATH/plain

for (( IDX=0; IDX<$ASSETS_COUNT; IDX++ ))
do
        USERNAME=$(echo ${USER_LIST[$IDX]} | cut -f1 -d":")
        PASSWORD=$(echo ${USER_LIST[$IDX]} | cut -f2 -d":")
        HASHED_USERNAME=$(echo -n $USERNAME | md5sum | cut -f1 -d" ")

        htpasswd -b -c $DOCKER_DSTRSRV_PATH/auth/$HASHED_USERNAME.htpasswd $USERNAME $PASSWORD
        echo "        location /$HASHED_USERNAME/ { auth_basic \"Restricted Area\"; auth_basic_user_file /etc/nginx/auth/$HASHED_USERNAME.htpasswd; }" >> $DOCKER_DSTRSRV_PATH/conf/distribution.conf

        echo -e "$GREEN$BOLD [*] Generating OVPN config for $USERNAME $RESET"
        docker run -v $OVPN_DATA:/etc/openvpn \
                -v /etc/localtime:/etc/localtime:ro \
                --log-driver=none \
                --rm \
                -it \
                $DOCKER_OVPNSRV_NAME:latest \
                easyrsa build-client-full $USERNAME nopass

        CLIENT_CONFIG_PATH=$OVPN_CONFIG_PATH/$HASHED_USERNAME
        mkdir -p $CLIENT_CONFIG_PATH

        docker run -v $OVPN_DATA:/etc/openvpn \
                -v /etc/localtime:/etc/localtime:ro \
                --log-driver=none \
                --rm $DOCKER_OVPNSRV_NAME:latest \
                ovpn_getclient $USERNAME > $CLIENT_CONFIG_PATH/config.ovpn

        # Copying root certificate to client config path for download
        cp $CA_PATH/ca.crt $CLIENT_CONFIG_PATH/ca.crt

        # Copying and configuring asset setup templates to client config path for download
        cp $ASSET_SETUP_PATH/{*.sh,*.psm1} $CLIENT_CONFIG_PATH
        sed -i -e "s/AAAAAAAAAA/$PUBLIC_ADDRESS/g" -e "s/BBBBBBBBBB/$USERNAME/g" -e "s/CCCCCCCCCC/$PASSWORD/g" $CLIENT_CONFIG_PATH/{*.sh,*.psm1}
done

echo "}" >> $DOCKER_DSTRSRV_PATH/conf/distribution.conf
###########################################################

###########################################################
# GENERATING SSH KEY PAIRS
if [ "$GENERATE_KEYS" == "TRUE" ]; then
        echo -e "$GREEN$BOLD [*] Generating SSH key pair $RESET"

        rm -f $DOCKER_HERDSRV_PATH/key/priv.key
        rm -f $DOCKER_HERDSRV_PATH/public/pub.key

        ssh-keygen -t rsa -N "" -f $DOCKER_HERDSRV_PATH/key/key

        mv $DOCKER_HERDSRV_PATH/key/key $DOCKER_HERDSRV_PATH/key/priv.key
        mv $DOCKER_HERDSRV_PATH/key/key.pub $DOCKER_HERDSRV_PATH/public/pub.key
fi

chmod 600 $DOCKER_HERDSRV_PATH/key/priv.key 
###########################################################

###########################################################
# HERD SERVER
if [ "$GENERATE_CERTS" == "TRUE" ]; then
        echo -e "$GREEN$BOLD [*] Generating certs for herdserver $RESET"

        # Create the herdserver key
        rm -f $DOCKER_HERDSRV_PATH/ssl/key.pem
        openssl genrsa -out $DOCKER_HERDSRV_PATH/ssl/key.pem 2048

        # Create the Certificate Signing Request (CSR)
        rm -f $DOCKER_HERDSRV_PATH/ssl/domain.csr
        openssl req -new -sha256 -key $DOCKER_HERDSRV_PATH/ssl/key.pem -subj "/C=IT/ST=IT/O=RedHerd/CN=$DOCKER_HERDSRV_ADDRESS" -out $DOCKER_HERDSRV_PATH/ssl/domain.csr

        # Generate the certificate using the csr and key along with the CA Root key
        rm -f $DOCKER_HERDSRV_PATH/ssl/cert.pem
        openssl x509 -req -in $DOCKER_HERDSRV_PATH/ssl/domain.csr -CA $CA_PATH/ca.crt -CAkey $CA_PATH/ca.key -CAcreateserial -outform PEM -out $DOCKER_HERDSRV_PATH/ssl/cert.pem -days 3650 -sha256
fi

if [ "$INIT_DB" == "TRUE" ]; then
        echo -e "$GREEN$BOLD [*] Initializing database $RESET"
        docker run --rm \
                --name "database_initializer" \
                -v $ETC_PATH/initialize-db:/home/node/app \
                -v /etc/localtime:/etc/localtime:ro \
                node:latest \
                /bin/bash -c "/home/node/app/run.sh"
        mv $ETC_PATH/initialize-db/redherd.sqlite3 $DOCKER_HERDSRV_PATH/models/data
fi

echo -e "$GREEN$BOLD [*] Compiling node-file-manager $RESET"
docker run --rm \
	 --name "node-file-manager_compiler" \
        -v $ETC_PATH/node-file-manager:/home/node/app \
        -v /etc/localtime:/etc/localtime:ro \
        node:latest \
        /bin/bash -c "/home/node/app/run.sh"
mv $ETC_PATH/node-file-manager/node-file-manager $DOCKER_HERDSRV_PATH/etc

echo -e "$GREEN$BOLD [*] Docker herd server building $RESET"
docker build -t $DOCKER_HERDSRV_NAME:latest $DOCKER_HERDSRV_PATH

echo -e "$GREEN$BOLD [*] Docker herd server starting $RESET"
docker run --name $DOCKER_HERDSRV_NAME \
        --network $DOCKER_NET \
        --ip $DOCKER_HERDSRV_ADDRESS \
        -v $ASSETS_SHARE_PATH:/home/node/share \
        -v $DOCKER_HERDSRV_MODULES_PATH:/home/node/app/bin/module/collection \
        -v $DOCKER_HERDSRV_DB_PATH:/home/node/app/models/data \
        -v /etc/localtime:/etc/localtime:ro \
        --env NODE_EXTRA_CA_CERTS=/home/node/app/ssl/ca.crt \
        -d \
        --cap-add=NET_ADMIN \
        $DOCKER_HERDSRV_NAME:latest \
        /bin/bash -c "ip route del default; ip route add default via $DOCKER_OVPNSRV_ADDRESS; node app.js"
###########################################################

###########################################################
# FTP SERVER
echo -e "$GREEN$BOLD [*] Creating asset shared folder $RESET"
if [[ ! -d $ASSETS_SHARE_PATH ]]
then
    mkdir $ASSETS_SHARE_PATH
fi

if [ "$GENERATE_CERTS" == "TRUE" ]; then
        echo -e "$GREEN$BOLD [*] Generating certs for FTP server $RESET"

        # Generate DH parameters file
        rm -f $DOCKER_FTPSRV_PATH/ssl/pure-ftpd-dhparams.pem
        openssl dhparam -out $DOCKER_FTPSRV_PATH/ssl/pure-ftpd-dhparams.pem 2048
        chmod 600 $DOCKER_FTPSRV_PATH/ssl/pure-ftpd-dhparams.pem
                
        # Create the FTP server key
        rm -f $DOCKER_FTPSRV_PATH/ssl/key.pem
        openssl genrsa -out $DOCKER_FTPSRV_PATH/ssl/key.pem 2048

        # Create the Certificate Signing Request (CSR)
        rm -f $DOCKER_FTPSRV_PATH/ssl/domain.csr
        openssl req -new -sha256 -key $DOCKER_FTPSRV_PATH/ssl/key.pem -subj "/C=IT/ST=IT/O=RedHerd/CN=$DOCKER_FTPSRV_ADDRESS" -out $DOCKER_FTPSRV_PATH/ssl/domain.csr

        # Generate the certificate using the csr and key along with the CA Root key
        rm -f $DOCKER_FTPSRV_PATH/ssl/cert.pem $DOCKER_FTPSRV_PATH/ssl/pure-ftpd.pem
        openssl x509 -req -in $DOCKER_FTPSRV_PATH/ssl/domain.csr -CA $CA_PATH/ca.crt -CAkey $CA_PATH/ca.key -CAcreateserial -outform PEM -out $DOCKER_FTPSRV_PATH/ssl/cert.pem -days 3650 -sha256
        cat $DOCKER_FTPSRV_PATH/ssl/key.pem $DOCKER_FTPSRV_PATH/ssl/cert.pem > $DOCKER_FTPSRV_PATH/ssl/pure-ftpd.pem
        chmod 600 $DOCKER_FTPSRV_PATH/ssl/pure-ftpd.pem
fi


echo -e "$GREEN$BOLD [*] Docker FTP server building $RESET"
docker build -t $DOCKER_FTPSRV_NAME:latest $DOCKER_FTPSRV_PATH

echo -e "$GREEN$BOLD [*] Docker FTP server starting $RESET"
sudo docker run --name $DOCKER_FTPSRV_NAME \
        --env "PUBLICHOST=$DOCKER_FTPSRV_ADDRESS" \
        --env FTP_USER_NAME=$FTP_USER_NAME \
        --env FTP_USER_PASS=$FTP_USER_PASS \
        --env FTP_USER_HOME=/home/ftpusers/$FTP_USER_NAME \
        -v $ASSETS_SHARE_PATH:/home/ftpusers/$FTP_USER_NAME \
        -v $DOCKER_FTPSRV_PATH/ssl/pure-ftpd-dhparams.pem:/etc/ssl/private/pure-ftpd-dhparams.pem \
        -v $DOCKER_FTPSRV_PATH/ssl/pure-ftpd.pem:/etc/ssl/private/pure-ftpd.pem \
        -v /etc/localtime:/etc/localtime:ro \
        --network $DOCKER_NET \
        --ip $DOCKER_FTPSRV_ADDRESS \
        --env "ADDED_FLAGS=--tls=3" \
        -d \
        $DOCKER_FTPSRV_NAME:latest
   
###########################################################

###########################################################
# HERD VIEW
if [ "$GENERATE_CERTS" == "TRUE" ]; then
        echo -e "$GREEN$BOLD [*] Generating certs for herdview $RESET"

        # Create the distribution server key
        rm -f $DOCKER_HERDVIEW_PATH/ssl/key.pem
        openssl genrsa -out $DOCKER_HERDVIEW_PATH/ssl/key.pem 2048

        # Create the Certificate Signing Request (CSR)
        rm -f $DOCKER_HERDVIEW_PATH/ssl/domain.csr
        openssl req -new -sha256 -key $DOCKER_HERDVIEW_PATH/ssl/key.pem -subj "/C=IT/ST=IT/O=RedHerd/CN=$DOCKER_HERDVIEW_ADDRESS" -out $DOCKER_HERDVIEW_PATH/ssl/domain.csr

        # Generate the certificate using the csr and key along with the CA Root key
        rm -f $DOCKER_HERDVIEW_PATH/ssl/cert.pem
        openssl x509 -req -in $DOCKER_HERDVIEW_PATH/ssl/domain.csr -CA $CA_PATH/ca.crt -CAkey $CA_PATH/ca.key -CAcreateserial -outform PEM -out $DOCKER_HERDVIEW_PATH/ssl/cert.pem -days 3650 -sha256
fi

echo -e "$GREEN$BOLD [*] Docker herd view building $RESET"
docker build -t $DOCKER_HERDVIEW_NAME:latest $DOCKER_HERDVIEW_PATH

echo -e "$GREEN$BOLD [*] Docker herd view starting $RESET"
sudo docker run --name $DOCKER_HERDVIEW_NAME \
        --network $DOCKER_NET \
        --ip $DOCKER_HERDVIEW_ADDRESS \
        -v $DOCKER_HERDVIEW_PATH/conf/herdview.conf:/etc/nginx/conf.d/default.conf \
        -v $DOCKER_HERDVIEW_PATH/ssl/cert.pem:/etc/nginx/cert.pem \
        -v $DOCKER_HERDVIEW_PATH/ssl/key.pem:/etc/nginx/key.pem \
        -v /etc/localtime:/etc/localtime:ro \
        -d \
        $DOCKER_HERDVIEW_NAME:latest
###########################################################

###########################################################
# DISTRIBUTION SERVER
if [ "$GENERATE_CERTS" == "TRUE" ]; then
        echo -e "$GREEN$BOLD [*] Generating certs for distribution server $RESET"

        # Create the distribution server key
        rm -f $DOCKER_DSTRSRV_PATH/ssl/key.pem
        openssl genrsa -out $DOCKER_DSTRSRV_PATH/ssl/key.pem 2048

        # Create the Certificate Signing Request (CSR)
        rm -f $DOCKER_DSTRSRV_PATH/ssl/domain.csr
        openssl req -new -sha256 -key $DOCKER_DSTRSRV_PATH/ssl/key.pem -subj "/C=IT/ST=IT/O=RedHerd/CN=$PUBLIC_ADDRESS" -out $DOCKER_DSTRSRV_PATH/ssl/domain.csr

        # Generate the certificate using the csr and key along with the CA Root key
        rm -f $DOCKER_DSTRSRV_PATH/ssl/cert.pem
        openssl x509 -req -in $DOCKER_DSTRSRV_PATH/ssl/domain.csr -CA $CA_PATH/ca.crt -CAkey $CA_PATH/ca.key -CAcreateserial -outform PEM -out $DOCKER_DSTRSRV_PATH/ssl/cert.pem -days 3650 -sha256
fi

echo -e "$GREEN$BOLD [*] Docker distribution server building $RESET"
docker build -t $DOCKER_DSTRSRV_NAME:latest $DOCKER_DSTRSRV_PATH

echo -e "$GREEN$BOLD [*] Docker distribution server starting $RESET"
docker run --name $DOCKER_DSTRSRV_NAME \
        -p 8443:443/tcp \
        -v $DOCKER_DSTRSRV_PATH/conf/distribution.conf:/etc/nginx/conf.d/default.conf \
        -v $DOCKER_DSTRSRV_PATH/ssl/cert.pem:/etc/nginx/cert.pem \
        -v $DOCKER_DSTRSRV_PATH/ssl/key.pem:/etc/nginx/key.pem \
        -v $DOCKER_DSTRSRV_PATH/auth:/etc/nginx/auth\
        -v $OVPN_CONFIG_PATH:/var/www/html \
        -v /etc/localtime:/etc/localtime:ro \
        -d \
        $DOCKER_DSTRSRV_NAME:latest
###########################################################

###########################################################
# HERD CLI

#sed -i 's|REDHERD_PATH=.*|REDHERD_PATH="'$(pwd)'"|g' $HERDCLI_PATH
ln -s $HERDCLI_PATH $HERDCLI_INSTALLATION_PATH/herd-cli
###########################################################

###########################################################
# MODULES FOLDER ALIAS CREATION
echo -e "$GREEN$BOLD [*] Modules folder alias creation $RESET"

echo alias herd-modules=\"cd $(pwd)/herd-server/bin/module/collection/\" >> /etc/bash.bashrc
source /etc/bash.bashrc
###########################################################

###########################################################
# SYSTEM CONTEXT INITIALIZATION
echo -e "$GREEN$BOLD [*] Framework context initialization $RESET"

$HERDCLI_INSTALLATION_PATH/herd-cli system --init
###########################################################