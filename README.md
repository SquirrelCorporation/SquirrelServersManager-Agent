# SSM Agent
[Website](https://squirrelserversmanager.io) - [Documentation](https://squirrelserversmanager.io/docs) - [Demo](https://demo.squirrelserversmanager.io) 
<img src="https://raw.githubusercontent.com/SquirrelCorporation/SquirrelServersManager/master/client/public/logo.svg" align="right"
     alt="SSM by Emmanuel Costa" width="120" height="178">

Squirrel Servers Manager is an all-in-one configuration and container management tool, powered by Ansible and Docker, with a focus on UI/UX.
It is designed to provide a user-friendly alternative to well-known established tools, while being totally open-source and free.

[![CI Test](https://github.com/SquirrelCorporation/SquirrelServersManager-Agent/actions/workflows/ci.yml/badge.svg)](https://github.com/SquirrelCorporation/SquirrelServersManager-Agent/actions/workflows/ci.yml)
[![Integration tests](https://github.com/SquirrelCorporation/SquirrelServersManager-Agent/actions/workflows/integration-test.yml/badge.svg)](https://github.com/SquirrelCorporation/SquirrelServersManager-Agent/actions/workflows/integration-test.yml)

See:
[Technical Guide Agent](https://squirrelserversmanager.io/docs/technical-guide/manual-install-agent)

It is possible to customize the behaviour of the agent by settings environment variables, in the `.env` file:

| Env                 | Required |         Example         | Description                                                | 
|---------------------|:--------:|:-----------------------:|------------------------------------------------------------|
| `URL_MASTER` |   YES    | http://192.168.0.3:8000 | URL of the SSM API                                         |
| `OVERRIDE_IP_DETECTION` |    NO    |       192.168.0.1       | Disable the auto-detection of the IP and set a fixed value |
| `AGENT_HEALTH_CRON_EXPRESSION` |    NO    |       '*/30 * * * * *'      | Frequency of agent self-check                              |
| `STATISTICS_CRON_EXPRESSION` |    NO    |       '*/30 * * * * *'      | Frequency of stats push                                    |

