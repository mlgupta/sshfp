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
import Vue from "vue";

export const alert = {
    namespaced: true,
    state: {
        type: null,
        message: null
    },
    actions: {
        success({ commit }, message) {
            commit('success', message);
        },
        error({ commit }, message) {
            Vue.$log.debug("Enter");

            commit('error', message);
        },
        clear({ commit }) {
            commit('clear');
        }
    },
    mutations: {
        success(state, message) {
            Vue.$log.debug("Alert Success: " + message);
            
            Vue.set(state, 'type', 'success');
            Vue.set(state, 'message', message);
        },
        error(state, message) {
            Vue.set(state, 'type', 'error');
            Vue.set(state, 'message', message);
        },
        clear(state) {
            Vue.set(state, 'type', null);
            Vue.set(state, 'message', null);
        },
    }
}