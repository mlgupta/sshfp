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
from os import environ

''' Application Config '''
class Config(object):
    ''' Application Config '''
    DEBUG = False
    TESTING = False
   

    LOG_TYPE = 'stream'
    LOG_LEVEL = 'INFO'
#    LOG_DIR = "/var/log/keyper"
#    APP_LOG_NAME = "app.log"
#    WWW_LOG_NAME = "www.log"

class ProductionConfig(Config):
    pass

class DevelopmentConfig(Config):
    DEBUG = True

    LOG_TYPE = 'stream'
    LOG_LEVEL = 'DEBUG'

class TestingConfig(Config):
    TESTING = True

config = {
    'dev': 'DevelopmentConfig',
    'prod': 'ProductionConfig',
}