#!/usr/bin/env bash

rm -rf /home/qredit/qredit-core
git clone https://github.com/Qredit/core -b upgrade /home/qredit/qredit-core

mkdir /home/qredit/.qredit
touch /home/qredit/.qredit/.env

mkdir /home/qredit/.qredit/config

mkdir /home/qredit/.qredit/database
touch /home/qredit/.qredit/database/json-rpc.sqlite
touch /home/qredit/.qredit/database/transaction-pool.sqlite
touch /home/qredit/.qredit/database/webhooks.sqlite

mkdir /home/qredit/.qredit/logs
mkdir /home/qredit/.qredit/logs/mainnet
touch /home/qredit/.qredit/logs/mainnet/test.log
