#!/usr/bin/env bash

CLIENT_HOSTNAME="chess.siggame.io"
SERVER_HOSTNAME="chess-server.siggame.io"

sudo certbot certonly --standalone -d "$CLIENT_HOSTNAME"
sudo certbot certonly --standalone -d "$SERVER_HOSTNAME"
