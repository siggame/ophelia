#!/bin/bash

docker pull siggame/colisee-db
docker rm --force ophelia-db
docker run --name ophelia-db --publish 5432:5432 --detach siggame/colisee-db

npm run test

docker stop ophelia-db
