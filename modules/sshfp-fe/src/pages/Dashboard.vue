<!--
                        Confidentiality Information

  This module is the confidential and proprietary information of
  DBSentry Corp.; it is not to be copied, reproduced, or transmitted in any
  form, by any means, in whole or in part, nor is it to be used for any
  purpose other than that for which it is expressly provided without the
  written permission of DBSentry Corp.

  Copyright (c) 2020-2021 DBSentry Corp.  All Rights Reserved.

-->
<template>
  <div class="content">
    <v-card
      elevation="0"
      class="mx-auto"
      max-width="750"
    >
      <v-card-title>ABOUT SSHFP TESTER</v-card-title>
      <v-divider></v-divider>
      <v-card-text>
<p>This tester will list SSHFP records, SSH Key Fingerprints for a server, and matching Key fingerprints between the published DNS SSHFP records and Fingerprints returned by the SSH server. SSHFP records are obtained by performing DNS lookup against the domain's authoritative name servers, so changes to SSHFP records should show up instantly. This tool extracts SSH Key Fingerprints using ssh-keyscan against the server and port. Result also includes a set of matching keys between published DNS SSHFP records and Key fingerprints returned by the SSH server. You should use DNSSEC when publishing SSHFP records. And, you should only perform this test against the server you own.</p>
<p>This is an OpenSource tool released under the GPLv3 license. You can download source code from its <a href=https://github.com/dbsentry/sshfp>GitHub repository</a>. You can also download the Docker Image from the <a href=https://hub.docker.com/r/dbsentry/sshfp>Docker Hub</a></p>
      </v-card-text>
      <v-divider></v-divider>
      <v-form >
        <v-container>
          <v-row 
            dense
            justify="center"
          >
            <v-col cols="6">
              <v-text-field
                outlined
                filled
                v-model="hostname"
                label="Host Name"
                :error-messages="getErrors('hostname',$v.hostname)"
                required
                @input="$v.hostname.$touch()"
                @blur="$v.hostname.$touch()"
                :disabled="sending"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-text-field
                outlined
                filled
                v-model="port"
                label="Port"
                :error-messages="getErrors('port',$v.port)"
                required
                @input="$v.port.$touch()"
                @blur="$v.port.$touch()"
                :disabled="sending"
              ></v-text-field>
            </v-col>
            <v-col cols="2">
              <v-btn 
                color="success"
                class="mx-2"
                fab
                @click="search"
                :disabled="sending"
              >
                <v-icon>mdi-magnify</v-icon>
              </v-btn>
            </v-col>
          </v-row>
        </v-container>
      </v-form>
    </v-card>
    <dns-keys-table></dns-keys-table>
    <v-container>
      <v-row>
        <v-col>
          <host-keys-table></host-keys-table>
        </v-col>
      </v-row>
      <v-row>
        <v-col>
          <keys-match-table></keys-match-table>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import Vue from "vue";
import { validationMixin } from "vuelidate";
import {
  required,
  between
} from "vuelidate/lib/validators";
import { DnsKeysTable } from "@/components";
import { HostKeysTable } from "@/components";
import { KeysMatchTable } from "@/components";

export default {
  name: "dashboard",
  components: {    
    DnsKeysTable,
    HostKeysTable,
    KeysMatchTable
  },
  mixins: [validationMixin],
  validations: {
    hostname: { 
        required 
    },
    port: { 
        required,
        between: between(1, 65535)
    }
  },
  data() {
    return {
      hostname: '',
      port: 22,
      sending: false
    }
  },
  computed: {
    alert() {
      return this.$store.state.alert;
    },
    alertMsg() {
      return this.$store.state.alert.message;
    },
  },
  watch: {
    alertMsg() {
      Vue.$log.debug("Enter");
      Vue.$log.debug("Alert Type: " + this.alert.type);

      if (this.alert.type == null) {
        Vue.$log.debug("Nothing in alert");
      } else {
        this.notifyVue(this.alert.type, this.alert.message);
        this.$store.dispatch("alert/clear");
      }
    }
  },
  created() {
    this.$store.dispatch("alert/clear");
  },
  methods: {
    getErrors(name, model) {
      Vue.$log.debug("Enter");

      const errors = [];

      if (!model.$dirty) return errors;
      switch (name) {
        case "hostname":
          !model.required && errors.push('Hostname is required');
          break;
        case "port":
          !model.required && errors.push("Port is required");
          !model.between && errors.push("Port must be between 1 and 65535");
          break;
      }
      Vue.$log.debug(errors);
      return errors;
    },
    search() {
      Vue.$log.debug("Enter");

      this.$v.$touch();

      if (this.$v.$invalid) {
        Vue.$log.debug("Validation Errors");
      } else {
        Vue.$log.debug("Hostname:Port " + this.hostname + ":" + this.port);
        var hostname = this.hostname;
        var port = this.port 
        this.sending = true;
        this.$store.dispatch('dnsStore/dnsScan', { hostname, port } );
        this.$store.dispatch('hostStore/hostScan', { hostname, port } );
        this.sending = false;
      }

      Vue.$log.debug("Exit");
    },
    notifyVue(type, msg) {
      Vue.$log.debug("Enter");
      Vue.$log.debug("Type: " + type);
      Vue.$log.debug("msg: " + msg);

      this.$notify({
        message:
          msg,
        horizontalAlign: '',
        verticalAlign: 'top',
        type: type
      });
    } 
  }
};
</script>
<style>
</style>
