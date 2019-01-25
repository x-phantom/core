#!/usr/bin/env bash

pm2 stop qredit-core > /dev/null 2>&1
pm2 stop qredit-core-relay > /dev/null 2>&1
pm2 stop qredit-core-forger > /dev/null 2>&1

pm2 stop core > /dev/null 2>&1
pm2 stop core-relay > /dev/null 2>&1
pm2 stop core-forger > /dev/null 2>&1

node ./scripts/upgrade/upgrade.js

yarn setup
