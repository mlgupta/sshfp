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
import Notifications from "./Notifications.vue";

const NotificationStore = {
  state: [], // here the notifications will be added

  removeNotification(timestamp) {
    const indexToDelete = this.state.findIndex(n => n.timestamp === timestamp);
    if (indexToDelete !== -1) {
      this.state.splice(indexToDelete, 1);
    }
  },
  addNotification(notification) {
    notification.timestamp = new Date();
    notification.timestamp.setMilliseconds(
      notification.timestamp.getMilliseconds() + this.state.length
    );
    this.state.push(notification);
  },
  notify(notification) {
    Vue.$log.debug("Enter");
    if (Array.isArray(notification)) {
      notification.forEach(notificationInstance => {
        this.addNotification(notificationInstance);
      });
    } else {
      this.addNotification(notification);
    }
    Vue.$log.debug(JSON.stringify(this.state));
  }
};

var NotificationsPlugin = {
  install(Vue) {
    Vue.mixin({
      data() {
        return {
          notificationStore: NotificationStore
        };
      },
      methods: {
        notify(notification) {
          this.notificationStore.notify(notification);
        }
      }
    });
    Object.defineProperty(Vue.prototype, "$notify", {
      get() {
        return this.$root.notify;
      }
    });
    Object.defineProperty(Vue.prototype, "$notifications", {
      get() {
        return this.$root.notificationStore;
      }
    });
    Vue.component("Notifications", Notifications);
  }
};

export default NotificationsPlugin;
