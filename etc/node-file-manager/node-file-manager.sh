#!/usr/bin/env sh

SHELL_PATH=`dirname $0`
cd $SHELL_PATH/lib

node --harmony index.js $*
