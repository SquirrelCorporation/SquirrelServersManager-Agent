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
cd $SSM_WORKDIR || exit 1

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
RESET=false
INTERACTIVE=false
INSTALL_AGENT=false
HOST_ID=false
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
        HOST_ID="$OPTARG"
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
echo "Host id is ${HOST_ID}"
# CHECK MASTER NODE URL
if [ -z "${MASTER_NODE_URL}" ]; then
  if [ "${INTERACTIVE}" = true ]; then
    read -p "Enter master node url: "  MASTER_NODE_URL
  fi;
else
   echo "Master node set to ${MASTER_NODE_URL}"
fi;

echo "Checking master node url"
if [ -z "${MASTER_NODE_URL}" ]; then
  echo "Error: master node url required"
 exit 1
else
   rm -f ./.env
   echo "Master node set to ${MASTER_NODE_URL} write in env file"
   echo "API_URL_MASTER=${MASTER_NODE_URL}" > ./.env
fi;

# CHECK NODE VERSION
echo "Checking node.js installation"
if command -v node &> /dev/null; then
    echo "node.js installation found"
else
    echo "node.js installation not found. Please install node.js."
    exit 1
fi

# CHECK NPM VERSION
echo "Checking node.js installation"
if command -v npm &> /dev/null; then
    echo "node.js installation found"
else
    echo "node.js installation not found. Please install node.js."
    exit 1
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
 sudo npm install pm2@latest -g
 pm2 install pm2-logrotate
fi

# RUN WITH PM2
echo "##### Clean PM2"
pm2 stop agent || true
pm2 delete agent || true

echo "Checking need reset"
# RESET OR SET HOSTID IF NEEDED
if [ "${RESET}" = true ]; then
  echo "##### Removing hostId.txt file"
  rm -f ./hostid.txt
fi;

echo "Checking hostid"
if [ "${HOST_ID}" = false ]; then
  echo "##### Host id not set"
else
  echo "##### Setting hostId.txt file"
  rm -f ./hostid.txt
  echo "$HOST_ID" > ./hostid.txt
fi;

if [ "${INSTALL_AGENT}" = true ]; then
  echo "##### Start agent..."
  # START AGENT
  pm2 start -f "$SSM_WORKDIR"/build/agent.js
  echo "##### PM2 startup..."
  pm2 startup
  echo "##### PM2 save..."
  pm2 save
   if [ $? == 0 ]; then
     echo "pm2 save"
    else
     echo "Error - pm2 save failed"
     exit 1;
    fi
  echo "##### Finished with success"
fi;
pm2 update
exit 0;
