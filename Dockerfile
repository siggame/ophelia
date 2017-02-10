FROM node:latest
LABEL maintainer "siggame@mst.edu"

ADD . ophelia
WORKDIR ophelia
RUN npm run setup
RUN npm run build

EXPOSE 3000

CMD [ "npm", "run", "quick-start" ]
