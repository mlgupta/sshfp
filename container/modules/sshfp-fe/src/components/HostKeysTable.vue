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
      <v-card-title class="success white--text">SSH Server Keys</v-card-title>
      <div v-if="loading === true">
        <div class="text-center">
          <v-progress-circular
            indeterminate
            color="primary"
          ></v-progress-circular>
        </div>
      </div>
      <div v-else-if="loading === false">
        <v-simple-table dense>
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
              v-for="item in hostData"
              :key="item.Fingerprint"
            >
              <td>{{ item.algorithm_text }}</td>
              <td>{{ item.fp_type_text }}</td>
              <td>{{ item.fingerprint }}</td>
            </tr>
          </tbody>
        </v-simple-table>
      </div>
      <div v-else>
        <v-alert type="error">
          SSH Key Scan Error.
        </v-alert>
      </div>
    </v-card>
  </div>
</template>

<script>
import Vue from "vue";

export default {
  name: "host-keys-table",
  data() {
    return {
    };
  },
  computed: {
    loading() {
      return this.$store.state.hostStore.status.loading;
    },
    hostData() {
      return this.$store.state.hostStore.data;
    },
    alert() {
      return this.$store.state.alert;
    },
    alertMsg() {
      return this.$store.state.alert.message;
    },
  },
  methods: {    
    notifyVue(type, msg) {
      Vue.$log.debug("Enter");

      this.$notify({
        message:
          msg,
        horizontalAlign: 'center',
        verticalAlign: 'top',
        type: type
      });
    } 
  }
};
</script>

<style lang="scss" scoped>
</style>