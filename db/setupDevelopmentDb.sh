#!/bin/bash

#NOTE: This should be ran from the root directory
#NOTE: This should NOT be ran directly from the db/ folder

echo "Initalizing Database"
docker stop ophelia_db
docker rm --force ophelia_db
docker rmi --force ophelia_image
docker build -f db/Dockerfile -t ophelia_image db/
docker run --name ophelia_db -d -p 5432:5432 ophelia_image
docker start ophelia_db
