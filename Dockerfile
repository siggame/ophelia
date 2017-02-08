FROM node:latest
LABEL maintainer "siggame@mst.edu"

ADD . ophelia
WORKDIR ophelia
RUN npm install

EXPOSE 3000

CMD [ "npm", "start" ]
