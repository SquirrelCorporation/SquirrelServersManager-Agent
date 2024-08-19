# SSM Agent
[Squirrel Servers Manager](https://squirrelserversmanager.io)

See:
[Technical Guide Agent](http://localhost:5173/docs/manual-install-agent)

It is possible to customize the behaviour of the agent by settings environment variables:

| Env                 | Required |         Example         | Description                                                | 
|---------------------|:--------:|:-----------------------:|------------------------------------------------------------|
| `URL_MASTER` |   YES    | http://192.168.0.3:8000 | URL of the SSM API                                         |
| `OVERRIDE_IP_DETECTION` |    NO    |       192.168.0.1       | Disable the auto-detection of the IP and set a fixed value |
| `AGENT_HEALTH_CRON_EXPRESSION` |    NO    |       '*/30 * * * * *'      | Frequency of agent self-check                              |
| `STATISTICS_CRON_EXPRESSION` |    NO    |       '*/30 * * * * *'      | Frequency of stats push                                    |
