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
''' API to get user's SSH Public Keys '''
import subprocess
import os
import sys
import json
import dns
import dns.name
import dns.query
import dns.resolver
from flask import request, jsonify
from flask import current_app as app
from marshmallow import fields, Schema
from marshmallow.validate import Length
from . import public
from ..resources.errors import Error, errors


@public.route('/dnssshfp', methods=['GET','POST'])
def get_dns_sshfp():
    ''' Get SSHFP records from the DNS '''
    app.logger.debug("Enter")

    req = request.values

    err = dnssshfp_schema.validate(req)
    if err:
        app.logger.error("Input Data validation error.")
        app.logger.error("Errors:" + json.dumps(err))
        raise Error(errors["SchemaValidationError"].get("msg"), errors["SchemaValidationError"].get("status"))

    host = request.values.get('host')
    result = []

    try:
        app.logger.info("SSHFP DNS Lookup for %s" % (host))
        dns.resolver.reset_default_resolver()
        nameservers = query_authoritative_ns(host)
        authns = []
        for nameserver in nameservers:
            app.logger.debug("Default nameserver: " + nameserver.to_text())
            nameserver_ips = dns.resolver.query(nameserver.to_text(), 'A')
            for nameserver_ip in nameserver_ips:
                authns.append(nameserver_ip.to_text())
        app.logger.debug("Default nameservers: " + json.dumps(authns))
        dns.resolver.default_resolver = dns.resolver.Resolver(configure=False)
        dns.resolver.default_resolver.nameservers = authns 
        answers = dns.resolver.query(host, 'SSHFP')
        
        for rr in answers:
            rdata = {}
            rdata["algorithm"] = rr.algorithm
            rdata["fp_type"] = rr.fp_type
            rdata["fingerprint"] = rr.fingerprint.hex()
            result.append(rdata)
    except dns.exception.DNSException as e:
        app.logger.error("DNS Exception: " + str(e))
        raise Error("DNS Exception: " + str(e),401)
   
    app.logger.debug("Exit")
    return jsonify(result)

@public.route('/hostsshfp', methods=['GET','POST'])
def get_host_sshfp():
    ''' Get SSH Fingerprints for host using ssh-keyscan '''
    app.logger.debug("Enter")

    req = request.values

    err = hostsshfp_schema.validate(req)
    if err:
        app.logger.error("Input Data validation error.")
        app.logger.error("Errors:" + json.dumps(err))
        raise Error(errors["SchemaValidationError"].get("msg"), errors["SchemaValidationError"].get("status"))

    host = request.values.get('host')
    port = request.values.get('port')
    result = []

    try:
        app.logger.info("ssh-keyscan for %s:%s" % (host, port))
        answers = subprocess.run([
            'ssh-keyscan',
            '-D',
            '-p', '{}'.format(port),
            host], capture_output=True, text=True, check=True, timeout=5)

        app.logger.debug("stdout: " + answers.stdout)
        app.logger.debug("stderr: " + answers.stderr)

        if ("getaddrinfo" in answers.stderr):
            app.logger.debug("Invalid Host: ")
            raise Error("ssh-keyscan Exception: Invalid Host",401)

        lines = answers.stdout.splitlines()

        for line in lines:
            app.logger.debug("Line: " + line)
            rr = ' '.join(line.split()).split(' ')
            app.logger.debug("Line token length: " + str(len(rr)))
            if (len(rr) >= 6):
                rdata = {}
                rdata["algorithm"] = rr[3]
                rdata["fp_type"] = rr[4]
                rdata["fingerprint"] = rr[5]
                result.append(rdata)
    except subprocess.SubprocessError as e:
        app.logger.error("ssh-keyscan  Exception: " + str(e))
        raise Error("ssh-keyscan Exception: " + str(e),401)


    app.logger.debug("Exit")
    return jsonify(result)

def query_authoritative_ns (domain):
    app.logger.debug("Enter")

    default = dns.resolver.get_default_resolver()
    ns = default.nameservers[0]

    n = domain.split('.')

    for i in range(len(n), 0, -1):
        sub = '.'.join(n[i-1:])

        app.logger.debug('Looking up %s on %s' % (sub, ns))
        query = dns.message.make_query(sub, dns.rdatatype.NS)
        response = dns.query.udp(query, ns)

        rcode = response.rcode()
        if rcode != dns.rcode.NOERROR:
            if rcode == dns.rcode.NXDOMAIN:
                raise Error('%s does not exist.' % sub, 401)
            else:
                raise Error('Error %s' % dns.rcode.to_text(rcode), 401)

        if len(response.authority) > 0:
            rrsets = response.authority
        elif len(response.additional) > 0:
            rrsets = [response.additional]
        else:
            rrsets = response.answer

        # Handle all RRsets, not just the first one
        for rrset in rrsets:
            for rr in rrset:
                if rr.rdtype == dns.rdatatype.SOA:
                    app.logger.debug('Same server is authoritative for %s' % (sub))
                elif rr.rdtype == dns.rdatatype.A:
                    ns = rr.items[0].address
                    app.logger.debug('Glue record for %s: %s' % (rr.name, ns))
                elif rr.rdtype == dns.rdatatype.NS:
                    authority = rr.target
                    ns = default.query(authority).rrset[0].to_text()
                    #app.logger.debug('%s [%s] is authoritative for %s; ttl %i' % 
                    #    (authority, ns, sub, rrset.ttl))
                    result = rrset
                else:
                    # IPv6 glue records etc
                    #log('Ignoring %s' % (rr))
                    pass

    app.logger.debug("Exit")
    return result

class HostSSHFPSchema(Schema):
    host = fields.Str(required=True, validate=Length(max=100))
    port = fields.Int(required=True)

    class Meta:
       fields = ("host", "port")

class DnsSSHFPSchema(Schema):
    host = fields.Str(required=True, validate=Length(max=100))
    port = fields.Int(required=False)

    class Meta:
       fields = ("host", "port")

dnssshfp_schema = DnsSSHFPSchema()
hostsshfp_schema = HostSSHFPSchema()
