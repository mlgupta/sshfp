#!/bin/bash -e
#############################################################################
#                       Confidentiality Information                         #
#                                                                           #
# This module is the confidential and proprietary information of            #
# DBSentry Corp.; it is not to be copied, reproduced, or transmitted in any #
# form, by any means, in whole or in part, nor is it to be used for any     #
# purpose other than that for which it is expressly provided without the    #
# written permission of DBSentry Corp.                                      #
#                                                                           #
# Copyright (c) 2020-2021 DBSentry Corp.  All Rights Reserved.              #
#                                                                           #
#############################################################################

FIRST_START_DONE="${CONTAINER_STATE_DIR}/nginx-first-start-done"

if [ ! -e "$FIRST_START_DONE" ]; then
	touch $FIRST_START_DONE
fi

[ -z ${PORT} ] && PORT=${NGINX_PORT} 

log-helper info "Setting UID/GID for nginx to ${NGINX_UID}/${NGINX_GID}"
[ "$(id -g nginx)" -eq ${NGINX_GID} ] || groupmod -g ${NGINX_GID} nginx
[ "$(id -u nginx)" -eq ${NGINX_UID} ] || usermod -u ${NGINX_UID} -g ${NGINX_GID} nginx

cd /container/service/nginx/assets
[ -d sshfp-fe ] && mv sshfp-fe /var/www
cd /var/www
chown -R nginx:nginx sshfp-fe

cd /container/service/nginx/assets/etc/conf.d
if [ -f default.conf ]; then
        sed -i "s/{{PORT}}/${PORT}/g" default.conf
        mv default.conf /etc/nginx/conf.d
fi

[ -d /etc/nginx/certs ] || mkdir /etc/nginx/certs
cp /container/service/nginx/assets/certs/* /etc/nginx/certs

SSHFP_TLS_CRT_PATH=/etc/nginx/certs/$SSHFP_TLS_CRT_FILENAME
SSHFP_TLS_KEY_PATH=/etc/nginx/certs/$SSHFP_TLS_KEY_FILENAME

if [ ! -e "$SSHFP_TLS_CRT_PATH" ]; then
        log-helper info "Certificate/key do not exist. Generating a self signed certificate ..."
        openssl req -newkey rsa:2048 -nodes -keyout $SSHFP_TLS_KEY_PATH -x509 -days 3650 -out $SSHFP_TLS_CRT_PATH -subj "/CN=${HOSTNAME}"
fi

chown -R nginx:nginx /etc/nginx/conf.d/default.conf /etc/nginx/certs /var/lib/nginx

[ -d /run/nginx ] || mkdir /run/nginx

exit 0
