# Could use either from below, both refer to the LTS version of node 6 (aka boron)
#FROM node:6.9.1
FROM node:boron

# Who to contact with questions
MAINTAINER cwd8d@mst.edu

# Create a directory for the web server files to go in
# TODO figure out the idiomatic location for this webserver
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# Copy over the package.json file and install all dependencies
COPY package.json .
RUN npm install

# Copy the actual webserver code and resources over
COPY . .

# Create the siggame user, change the app folder owner and switch to that user
RUN groupadd -r siggame && useradd -r -g siggame siggame && \
    chown -R siggame:siggame .
USER siggame

# Set which ports are exposed for the container
EXPOSE 3000

# Set the envirnment variable to let node know its in a production setting
ENV NODE_ENV production

# Start the server by executing npm start
CMD [ "npm", "start" ]
