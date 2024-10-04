FROM node:22.9.0-alpine
LABEL org.opencontainers.image.source=https://github.com/SquirrelCorporation/SquirrelServersManager-Agent
LABEL org.opencontainers.image.description="SSM Agent"
LABEL org.opencontainers.image.licenses="GNU AFFERO GENERAL PUBLIC LICENSE"


RUN npm install -g npm@latest
RUN npm install -g typescript

WORKDIR /app

COPY ./package*.json .
COPY ./tsconfig.json .
RUN npm ci --verbose --no-audit
COPY . .
RUN npm run build-docker
RUN ls -R /app/build

CMD ["node", "build/src/index.js"]
#CMD ["/bin/sh"]
