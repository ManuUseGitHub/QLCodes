#!/bin/bash
. ./shell/func.sh

clear
rm -rf -v ./resources/CSV

if ! [ -d "$DIR/resources/CSV" ]; then
    
    mkdir "$DIR/resources/CSV"
    npm run fetch2
fi