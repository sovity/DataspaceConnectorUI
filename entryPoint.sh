#!/bin/bash
set -xe
: "${UI_BACKEND_URL?Need an ui backend url}"

sed -i "s@#UI_BACKEND_URL#@$UI_BACKEND_URL@g" .env
sed -i "s@#UI_TITLE#@$UI_TITLE@g" .env
sed -i "s@#ROLE_NAME_ADMIN#@$ROLE_NAME_ADMIN@g" .env
sed -i "s@#ROLE_NAME_CONSUMER#@$ROLE_NAME_CONSUMER@g" .env
sed -i "s@#ROLE_NAME_PROVIDER#@$ROLE_NAME_PROVIDER@g" .env

npm run-script startprod