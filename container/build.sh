#!/bin/sh -ex
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
ln -s /container/tools/* /sbin/

apk upgrade --no-cache

mkdir /container/run
[ -d /container/environment/startup ] || mkdir /container/environment/startup
[ -d /container/service/gunicorn/assets ] || mkdir /container/service/gunicorn/assets
chown -R root:root /container/environment
chmod 700 /container/environment /container/environment/startup

cd /container
tar -xzf out.tar.gz
mv sshfp /container/service/gunicorn/assets
mv sshfp-fe /container/service/nginx/assets

# Remove useless files
rm -rf /tmp/* /var/tmp/* /container/build.sh /container/Dockerfile

echo "Installing Services"
/container/tools/install-service

