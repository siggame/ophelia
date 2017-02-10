# Ophelia - siggame's new webserver
[![Build Status](https://travis-ci.org/siggame/ophelia.svg?branch=master)](https://travis-ci.org/siggame/ophelia)

=====

### Table of Contents
- [About](#about)
- [Docker](#docker)
- [Environment Variables](#environment-variables)
- [Folder Structure](#folder-structure)
- [package.json](#packagejson)

====

### About
The old Django site is becoming hard to maintain so its time for a new website.
This new site utilizes Node.js and Express to create a lightweight webserver
for megaminerai.com.

====

### Docker
##### Using Docker
1. `docker build . -t ophelia`
2. `docker run -p {host port}:3000 ophelia`

##### Docker Hub
[Docker Hub](https://hub.docker.com/r/siggame/ophelia/) automatically will build and host the Ophelia docker image and be available to run as a container anywhere. To trigger a build, simply push new code to the master branch.

`docker run -p 3000:3000 siggame/ophelia`

====

### Environment Variables
Environment variables can be supplied to the `docker run` command with the `-e ENV=VAR` flag
Example: `docker run -p 3000:3000 -e GITLAB_TOKEN=abcdefg siggame/ophelia`

| **name** | **description** | **default** | **notes** |
|---|---|---|---|
|`POSTGRES_HOST`| Database host| `localhost` | |
|`POSTGRES_PORT`| Database port | `5432` | |
|`POSTGRES_USERNAME`| Database username | `postgres` | |
|`POSTGRES_PASSWORD`| Database password | `postgres` | |
|`POSTGRES_NAME`| Database name | `postgres` |
|`POSTGRES_DEBUG`| Enable SQL debugging? || |
|`GITLAB_HOST`| GitLab host | `localhost` | |
|`GITLAB_PORT`| GitLab HTTP port | `8080` | |
|`GITLAB_TOKEN`| GitLab personal access token ||Required|
