#!/bin/bash

echo "
########################################
#### SQUIRREL SERVERS MANAGER AGENT ####
########################################
"

# RUN WITH PM2
echo "##### Clean PM2"
pm2 stop agent || true
pm2 delete agent || true

# CLEAN CURRENT INSTALL
echo "##### Clean"
rm -f ssm-agent
rm -f agent.blob
rm -rf ./build
rm -f ./hostid.txt
