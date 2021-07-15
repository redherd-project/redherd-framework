#!/bin/bash

cd /home/node/app

echo "Installing node-file-manger packages"
npm install

echo "Installing pkg package"
npm install -g pkg

echo "Compiling node-file-manager"
pkg -t node14-linux-x64 .
