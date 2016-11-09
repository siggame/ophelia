# Ophelia - siggame's new webserver
The old Django site is becoming hard to maintain so its time for a new website.
This new site utilizes Node.js and Express to create a lightweight webserver
for megaminerai.com.

## Using Docker Compose
Using **docker-compose** is probably the easiest way to get started with docker.
Make sure you have **docker** and **docker-compose** installed. Check out your
distributions package manager for the actual packages to install. You may have
to start the docker daemon.

To build the docker image, simply navigate to the base directory of the repo and
execute
```
docker-compose build
```
This will download the base node image, create all the image layers, and add
an image with the name siggame/ophelia to the local dockerfile image repository.

To run the webserver with a development setup, run
```
docker-compose up
```
which will use the docker-compose.yml file to run the image and set up a few
other things to aid in development. When you are ready to stop the webserver run
```
docker-compose stop
```
and then use
```
docker-compose rm
```
to get rid of the stopped containers.

To run the webserver with a production setup, run
```
docker-compose -f docker-compose.prod.yml up
```
The other commands are similar. For more information on this setup, check out
this tutorial [docker node app](http://jdlm.info/articles/2016/03/06/lessons-building-node-app-docker.html)

## Using Docker
Included in the base directory of the repository are files for creating a
docker image along with docker-compose yaml files for setting up the application.

To get started, make sure you have docker installed. Then, to build the docker
image you can simply run:
```
docker build https://github.com/siggame/ophelia.git
```
This will download the repo in a temp directory and build the docker image. If
you already have the repository downloaded, you can navigate to the base
directory and run:
```
docker build [-t siggame/ophelia] .
```
This builds the docker image from the local copy of the ophelia repo.

When you're ready to run the image, you can quickly get running using:
```
docker run -d -p 3000:3000 --name web siggame/ophelia
```
This will run the container in detached mode, with the container port 3000 being
mapped to localhost port 3000 and naming the running container instance web for
easy manipulation. To see what containers are running, use:
```
docker ps
```
and to stop and remove the container run:
```
docker stop web
docker rm web
```
For more info on using docker, check out the docs at [docker docs](https://docs.docker.com/engine/reference/commandline/)
