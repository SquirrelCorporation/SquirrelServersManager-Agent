#!/bin/bash

node --version | grep "v" &> /dev/null
if [ $? == 0 ]; then
 echo "Node is installed"
else
 echo "Error - Node not installed, install NodeJS (20) and NPM first"
 exit 1;
fi
echo "##### Clean"
rm -f ssm-agent
rm -f agent.blob
rm -rf ./build
echo "##### Install"
npm install
echo "##### Build"
npm run build
echo "##### Install PM2"
pm2 --version | grep "v" &> /dev/null
if [ $? == 0 ]; then
 echo "PM2 is installed"
else
 sudo npm install pm2 -g
fi
echo "##### Run"
pm2 stop agent
pm2 delete agent
pm2 start -f build/agent.js
eval "$(command pm2 startup | grep startup)"
if [ $? == 0 ]; then
 echo "pm2 startup installed"
else
 echo "Error - pm2 startup not installed"
 exit 1;
fi
pm2 save
