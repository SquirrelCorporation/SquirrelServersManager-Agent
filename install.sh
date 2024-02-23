#!/bin/bash

node --version | grep "v" &> /dev/null
if [ $? == 0 ]; then
 echo "Node Installed"
else
 echo "Error - Node not installed"
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
 echo "Node Installed"
else
 npm install pm2 -g
fi
echo "##### Run"
pm2 stop agent
pm2 delete agent
pm2 start -f build/agent.js
eval "$(command pm2 startup | grep startup)"
if [ $? == 0 ]; then
 echo "Startup Installed"
else
 echo "Error - Not installed"
 exit 1;
fi
pm2 save
