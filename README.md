# Ophelia - siggame's new webserver

[![Build Status](https://travis-ci.org/siggame/ophelia.svg?branch=master)](https://travis-ci.org/siggame/ophelia)

The old Django site is becoming hard to maintain so its time for a new website.
This new site utilizes Node.js and Express to create a lightweight webserver
for megaminerai.com.

### Development
##### Using Docker
1. `docker build . -t ophelia`
2. `docker run -p 3000:3000 ophelia`
