#!/bin/bash

SSM_WORKDIR=$(cd $(dirname $0) && pwd)

echo "
########################################
#### SQUIRREL SERVERS MANAGER AGENT ####
########################################
"
usage(){
>&2 cat << EOF
Usage: $0
   [ -u | --url MASTER_NODE_URL]
   [ -r | --reset ]
   [ -s | --set]
   [ -a | --agent]
   [ -i | --interactive]
EOF
exit 1
}

# READ CLI ARGS
for arg in "$@"; do
  shift
  case "$arg" in
    '--url')   set -- "$@" '-u'   ;;
    '--reset') set -- "$@" '-r'   ;;
    '--set')   set -- "$@" '-s'   ;;
    '--agent') set -- "$@" '-a'   ;;
    '--interactive') set -- "$@" '-i'   ;;
    *)         set -- "$@" "$arg" ;;
  esac
done

while getopts "aris:u:" OPTION
do
   case $OPTION in
      u)
        MASTER_NODE_URL="$OPTARG"
        ;;
      r)
        RESET=true
        ;;
      s)
        SET="$OPTARG"
        ;;
      a)
        INSTALL_AGENT=true
        ;;
      i)
        INTERACTIVE=true
        ;;
      *)
        usage
        ;;
   esac
done

# CHECK MASTER NODE URL
if [ -z "${MASTER_NODE_URL}" ]; then
  if [ "${INTERACTIVE}" = true ]; then
    read -p "Enter master node url: "  MASTER_NODE_URL
  fi;
else
   echo "Master node set to ${MASTER_NODE_URL}"
fi;

if [ -z "${MASTER_NODE_URL}" ]; then
  echo "Error: master node url required"
 exit 1
else
   echo "API_URL_MASTER=${MASTER_NODE_URL}" > ./.env
fi;

# CHECK NODE VERSION
node --version | grep "v" &> /dev/null
if [ $? == 0 ]; then
 echo "Node is installed"
else
 echo "Error - Node not installed, install NodeJS (20) and NPM first"
 exit 1;
fi

# CLEAN CURRENT INSTALL
echo "##### Clean"
rm -f ssm-agent
rm -f agent.blob
rm -rf ./build

# INSTALL
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

# RUN WITH PM2
echo "##### Clean PM2"
pm2 stop agent || true
pm2 delete agent || true

# RESET OR SET HOSTID IF NEEDED
if [ -z "${RESET}" ]; then
  echo "##### Removing hostId.txt file"
  rm -f ./hostid.txt
fi;
if [ -z "${SET}" ]; then
    echo "##### Setting hostId.txt file"
  echo "$SET" > hostid.txt
fi;

if [ "${INSTALL_AGENT}" = true ]; then
  echo "##### Start agent..."
  # START AGENT
  pm2 start -f ./build/agent.js
  SUB="$(/usr/local/bin/pm2 startup | grep startup)"
  echo "RESULT --> $SUB"
  CMD="$(echo $SUB)"
  eval "$CMD"
  if [ $? == 0 ]; then
   echo "pm2 startup installed"
  else
   echo "Error - pm2 startup not installed"
   exit 1;
  fi
  pm2 save
   if [ $? == 0 ]; then
     echo "pm2 save"
    else
     echo "Error - pm2 save failed"
     exit 1;
    fi
  echo "##### Finished with success"
fi;
exit 0;
