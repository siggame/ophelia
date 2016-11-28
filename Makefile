default:
	docker-compose build

fresh:
	docker-compose build --no-cache

run:
	docker-compose up

rm-containers:
	docker rm $(shell docker ps -a -q)

stop-containers:
	docker stop $(shell docker ps -a -q)

recycle-containers:
	docker stop $(shell docker ps -a -q)
	docker rm $(shell docker ps -a -q)
