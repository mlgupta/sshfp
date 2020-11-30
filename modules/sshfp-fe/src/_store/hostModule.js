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
import { hostService } from '@/_helpers';
import Vue from "vue";

const initialState = { status: {loading: false }, data: [] };

export const hostStore = {
    namespaced: true,
    state: initialState,
    actions: {
        hostScan({ commit }, {hostname, port }) {
            commit('startLoading');

            hostService.hostScan(hostname, port)
                .then(
                    result => {
                        Vue.$log.debug("Host Key lookup returned");
                        commit('finishLoading');
                        commit('hostScanSuccess', result);
                    },
                    error => {
                        Vue.$log.error("Host Key lookup Error: " + error);
                        commit('finishLoading');
                        commit('hostScanFailure', error);
                        //dispatch('alert/error', "SSH Key Scan Error.", { root: true });
                    }
                );
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
        hostScanSuccess(state, result) {
            var sortedResult = result.sort((a, b) => {
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
        hostScanFailure(state) {
            Vue.set(state, "data", []);
            Vue.set(state, "status", { loading: 'error' });
        },
    }
};