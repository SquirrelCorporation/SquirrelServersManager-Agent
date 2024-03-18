#!/bin/bash

SSM_WORKDIR=$(cd $(dirname $0) && pwd)

echo "
########################################
#### SQUIRREL SERVERS MANAGER AGENT ####
########################################
"


# RUN WITH PM2
echo "##### Clean PM2"
pm2 stop agent || true
pm2 delete agent || true
echo "##### Start agent..."
# START AGENT
pm2 start -f "$SSM_WORKDIR"/build/agent.js
echo "##### PM2 startup..."
pm2 startup
echo "##### PM2 save..."
pm2 save
pm2 update
exit 0;
