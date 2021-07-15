#!/bin/bash

if [ ! "$UID" -eq "0" ]; then
        echo "Run as root user"
        exit 1
fi

apt install -y apt-transport-https ca-certificates curl gnupg-agent software-properties-common
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
apt-key fingerprint 0EBFCD88
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"
add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu bionic stable"

apt update
apt -y install docker-ce docker-ce-cli containerd.io
docker run hello-world
