# SSM Agent
[Website](https://squirrelserversmanager.io) - [Documentation](https://squirrelserversmanager.io/docs) - [Demo](https://demo.squirrelserversmanager.io) 
<img src="https://raw.githubusercontent.com/SquirrelCorporation/SquirrelServersManager/master/client/public/logo.svg" align="right"
     alt="SSM by Emmanuel Costa" width="120" height="178">

Squirrel Servers Manager is an all-in-one configuration and container management tool, powered by Ansible and Docker, with a focus on UI/UX.
It is designed to provide a user-friendly alternative to well-known established tools, while being totally open-source and free.

[![CI Test](https://github.com/SquirrelCorporation/SquirrelServersManager-Agent/actions/workflows/ci.yml/badge.svg)](https://github.com/SquirrelCorporation/SquirrelServersManager-Agent/actions/workflows/ci.yml)

See:
[Technical Guide Agent](https://squirrelserversmanager.io/docs/technical-guide/manual-install-agent)

It is possible to customize the behaviour of the agent by settings environment variables, in the `.env` file:

| Env                 | Required |         Example         | Description                                                | 
|---------------------|:--------:|:-----------------------:|------------------------------------------------------------|
| `URL_MASTER` |   YES    | http://192.168.0.3:8000 | URL of the SSM API                                         |
| `OVERRIDE_IP_DETECTION` |    NO    |       192.168.0.1       | Disable the auto-detection of the IP and set a fixed value |
| `AGENT_HEALTH_CRON_EXPRESSION` |    NO    |       '*/30 * * * * *'      | Frequency of agent self-check                              |
| `STATISTICS_CRON_EXPRESSION` |    NO    |       '*/30 * * * * *'      | Frequency of stats push                                    |

## Recommanded: Install from the UI
[Adding a device](https://squirrelserversmanager.io/docs/devices/add-device)

## Experimental: Docker Version

```docker
version: '3.8'

services:
  ssm_agent:
    image: ghcr.io/squirrelcorporation/squirrelserversmanager-agent:docker
    network_mode: host
    privileged: true
    environment:
      - API_URL_MASTER=${API_URL_MASTER}
    pid: host
    restart: unless-stopped
    volumes:
      - /proc:/proc
      - /var/run/docker.sock:/var/run/docker.sock
      - ssm-agent-data:/data

volumes:
  ssm-agent-data:

```

```shell
git clone https://github.com/SquirrelCorporation/SquirrelServersManager-Agent
git checkout docker
API_URL_MASTER=<API_URL> docker-compose up -d
```
or
```shell
docker pull ghcr.io/squirrelcorporation/squirrelserversmanager-agent:docker
docker volume create ssm-agent-data
docker run --network host \
  -e API_URL_MASTER=<API_URL> \
  --privileged \
  --pid=host \
  -v /proc:/proc \
  -v /var/run/docker.sock:/var/run/docker.sock \
  -v ssm-agent-data:/data \
  --restart unless-stopped \
  ghcr.io/squirrelcorporation/squirrelserversmanager-agent:docker
```
| Env                 | Required |         Example         | Description                                                | 
|---------------------|:--------:|:-----------------------:|------------------------------------------------------------|
| `URL_MASTER` |   YES    | http://192.168.0.3:8000 | URL of the SSM API                                         |
| `OVERRIDE_IP_DETECTION` |    NO    |       192.168.0.1       | Disable the auto-detection of the IP and set a fixed value |
| `AGENT_HEALTH_CRON_EXPRESSION` |    NO    |       '*/30 * * * * *'      | Frequency of agent self-check                              |
| `STATISTICS_CRON_EXPRESSION` |    NO    |       '*/30 * * * * *'      | Frequency of stats push                                    |
| `HOST_ID_PATH` |    NO    |      `/data/`     | Path where is stored the registered HostID                                    |
| `LOGS_PATH` |    NO    |      `/data/logs`     | Path where are store the logs                                    |
