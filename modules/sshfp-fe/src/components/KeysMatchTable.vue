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
  <div>   
    <v-card
      elevation="2"
      outlined
      shaped
      class="mx-auto"
      max-width="750"
    >
      <v-card-title class="success white--text">Matching Keys</v-card-title>
      <div v-if="loading === true">
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </div>
      <div v-else-if="loading === false">
        <v-simple-table dense v-if="matchData.length > 0">
          <thead>
            <tr>
              <th class="text-left">
                Algorithm
              </th>
              <th class="text-left">
                Type
              </th>
              <th class="text-left">
                Fingerprint
              </th>
            </tr>            
          </thead>
          <tbody>
            <tr
              v-for="item in matchData"
              :key="item.Fingerprint"
            >
              <td>{{ item.algorithm_text }}</td>
              <td>{{ item.fp_type_text }}</td>
              <td>{{ item.fingerprint }}</td>
            </tr>
          </tbody>
        </v-simple-table>
        <v-alert type="error" v-else-if="dnsData.length > 0 && hostData.length > 0">
          No Match.
        </v-alert>
      </div>
      <div v-else>
        <v-alert type="error">
          SSHFP Match Error.
        </v-alert>
      </div>
    </v-card>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "keys-match-table",
  data() {
    return {
    };
  },
  computed: {
    dnsLoading() {
      return this.$store.state.dnsStore.status.loading;
    },
    hostLoading() {
      return this.$store.state.hostStore.status.loading;
    },
    loading() {
      Vue.$log.debug("Enter");
      if ((this.dnsLoading === 'error') || (this.hostLoading === 'error')) {
        return 'error';
      } else if (this.dnsLoading || this.hostLoading) {
        return true;  
      } else {
        return false;
      }
    },
    dnsData() {
      return this.$store.state.dnsStore.data;
    },
    hostData() {
      return this.$store.state.hostStore.data;
    },
    matchData() {
      Vue.$log.debug("Enter");
      Vue.$log.debug(this.dnsData);
      Vue.$log.debug(this.hostData);

      if (this.dnsData.length > 0 && this.hostData.length > 0) {
        return this.dnsData.filter(dnsKey => {
          Vue.$log.debug(dnsKey.fingerprint);
          var result = false;
          for (var i in this.hostData)  {
            Vue.$log.debug("hostKey: " + this.hostData[i]);
            Vue.$log.debug("hostKey FP:" + this.hostData[i].fingerprint);
            //if (hostKey.algorithm == dnsKey.algorithm && hostKey.fp_type == dnsKey.fp_type && hostKey.fingerprint == dnsKey.fingerprint) {
            if (this.hostData[i].fingerprint === dnsKey.fingerprint) {
              Vue.$log.debug("Match Found");
              result = true;
              break;
            }
          }
          return result;
        });
      } else {
        return [];
      }
    },
  },
  methods: {    
  }
};
</script>

<style lang="scss" scoped>
</style>