#!/bin/bash

cd /home/node/app

echo "Installing initialize-db packages"
npm install

echo "Initializing database"
node ./initialize-db.js
