#!/bin/bash

set -e

docker build -t dashboard:latest . --target dashboard --build-arg NETWORK_NAME=enkinet --no-cache 