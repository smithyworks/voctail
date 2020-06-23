#! /bin/bash

docker run \
  --name standalone-voctail-db \
  -p 5555:5432 \
  -v $PWD/init:/docker-entrypoint-initdb.d \
  -e POSTGRES_PASSWORD=password \
  -e POSTGRES_DB=voctail_db \
  --rm \
  postgres:latest
