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
''' Error definition '''

class Error(Exception):
    ''' Error '''
    status_code = 400

    def __init__(self, msg, status_code=None, payload=None):
        Exception.__init__(self)
        self.msg = msg
        if status_code is not None:
            self.status_code = status_code
        self.payload = payload

    def to_dict(self):
        rv = dict(self.payload or ())
        rv['msg'] = self.msg
        return rv

errors = {
    "InternalServerError": {
        "msg": "Something went wrong",
        "status": 500
    },
     "SchemaValidationError": {
         "msg": "Request is missing required fields or error in fields",
         "status": 400
     },
     "ObjectExistsError": {
         "msg": "Object with given name already exists",
         "status": 400
     }
}
