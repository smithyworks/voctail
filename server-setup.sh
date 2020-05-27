#!/bin/bash

sudo apt update
sudo apt upgrade -y

curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
sudo apt-get install -y nodejs

wget --quiet -O - https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
sudo sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt/ `lsb_release -cs`-pgdg main" >> /etc/apt/sources.list.d/pgdg.list'
sudo apt update
sudo apt install -y postgresql postgresql-contrib
sudo -u postgres psql -c "CREATE USER christo WITH PASSWORD 'christo95210'"
sudo -u postgres psql -c "ALTER USER christo WITH SUPERUSER"
sudo -u postgres createdb voctail-db
sudo adduser --ingroup postgres --gecos "" --no-create-home --disabled-password --disabled-login christo
sudo psql -U christo -d voctail-db