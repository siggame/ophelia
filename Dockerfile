# Could use either from below, both refer to the LTS version of node 6 (aka boron)
#FROM node:6.9.1
FROM node:boron

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY package.json /usr/src/app
RUN npm install

COPY . /usr/src/app

EXPOSE 3000

ENV NODE_ENV production

CMD [ "npm", "start" ]
