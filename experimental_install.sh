#!/bin/bash

node --version | grep "v" &> /dev/null
if [ $? == 0 ]; then
 echo "Node Installed"
else
 echo "Error - Node not installed"
 exit 1;
fi
rm -f ssm-agent
rm -f agent.blob
rm -rf ./build
npm install
npm run build
echo "### 1. Generating blob"
node --experimental-sea-config package.json
echo "### 2. Copy node cmd"
cp "$(command -v node)" ssm-agent && chmod +rw ssm-agent
echo "### 3. Remove code signature (MacOS)"
codesign --remove-signature ssm-agent
echo "### 4. Inject"
npx postject ssm-agent NODE_SEA_BLOB agent.blob --sentinel-fuse NODE_SEA_FUSE_fce680ab2cc467b6e072b8b5df1996b2 --macho-segment-name NODE_SEA
echo "### 5. Add code signature (MacOS)"
codesign --sign - ssm-agent
