/****************************************************************************
*                       Confidentiality Information                         *
*                                                                           *
* This module is the confidential and proprietary information of            *
* DBSentry Corp.; it is not to be copied, reproduced, or transmitted in any *
* form, by any means, in whole or in part, nor is it to be used for any     *
* purpose other than that for which it is expressly provided without the    *
* written permission of DBSentry Corp.                                      *
*                                                                           *
* Copyright (c) 2020-2021 DBSentry Corp.  All Rights Reserved.              *
*                                                                           *
****************************************************************************/
import { dnsService } from '@/_helpers';
import Vue from "vue";

const initialState = { status: {loading: false }, data: [] };

export const dnsStore = {
    namespaced: true,
    state: initialState,
    actions: {
        dnsScan({ commit }, {hostname, port }) {
            Vue.$log.debug("Enter");
            Vue.$log.debug("Hostname:Port " + hostname + ":" + port);

            commit('startLoading');

            dnsService.dnsScan(hostname, port)
                .then(
                    result => {
                        Vue.$log.debug("DNS lookup returned");
                        commit('finishLoading');
                        commit('dnsScanSuccess', result);
                    },
                    error => {
                        Vue.$log.error("DNS lookup Error: " + error);
                        commit('finishLoading');
                        commit('dnsScanFailure', error);
                        //dispatch('alert/error', "SSHFP DNS Lookup Error.", { root: true });
                    }
                );
            Vue.$log.debug("Exit");
        },
    },
    mutations: {
        startLoading(state) {
            Vue.set(state, "status", { loading: true });
            state.data = [];
        },
        finishLoading(state) {
            Vue.set(state, "status", { loading: false });
        },
        dnsScanSuccess(state, result) {
            var sortedResult = result
            sortedResult.sort((a, b) => {
                let compare = 0;
                let acol = a.algorithm + '' + a.fp_type;
                let bcol = b.algorithm + '' + b.fp_type;
                 if (acol > bcol) {
                     compare = 1;
                 } else if ( acol < bcol) {
                     compare = -1;
                 }
                return compare;
            });

            sortedResult.forEach(result => {
                if (result['algorithm'] == 1) {
                    result['algorithm_text'] = 'RSA';
                } else if (result['algorithm'] == 2) {
                    result['algorithm_text'] = 'DSA';
                } else if (result['algorithm'] == 3) {
                    result['algorithm_text'] = 'ECDSA';
                } else if (result['algorithm'] == 4) {
                    result['algorithm_text'] = 'ED25519';
                }
                if (result['fp_type'] == 1) {
                    result['fp_type_text'] = 'SHA-1';
                } else if (result['fp_type'] == 2) {
                    result['fp_type_text'] = 'SHA-256';
                }
            });

            Vue.set(state, "data", sortedResult);
        },
        dnsScanFailure(state) {
            Vue.set(state, "data", []);
            Vue.set(state, "status", { loading: 'error' });
        },
    }
};