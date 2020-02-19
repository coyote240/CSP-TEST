#!/usr/bin/env bash

set -e

docker run --name nginx-csp-test \
           --rm \
           -p 8080:80 \
           nginx-csp-test
