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

# Build Vue frontend app
if [ -f /container/modules/sshfp-fe/package.json ]; then
	cd /container/modules/sshfp-fe
	npm install
	npm run build

	status=$?

	if [ $status -eq 0 ]; then
		mv dist /container/service/nginx/assets/sshfp-fe
	else
		echo "##########################################################"
		echo "Error building sshfp-fe"
		echo "##########################################################"
	fi
else
	mkdir /container/service/nginx/assets/sshfp-fe
fi

# Build and install flask modules/libraries
mv /container/modules/sshfp /var/www
cd /var/www/sshfp
rm -rf env/*
python3 -m venv env
. env/bin/activate
pip install -r requirements.txt

status=$?

if [ $status -eq 0 ]; then
	cd /var/www
	mv sshfp /container/service/gunicorn/assets
else
	echo "##########################################################"
	echo "Error building sshfp"
	echo "##########################################################"
fi


# Remove useless files
rm -rf /tmp/* /var/tmp/* /container/build.sh /container/Dockerfile /container/modules

echo "Installing Services"
/container/tools/install-service

