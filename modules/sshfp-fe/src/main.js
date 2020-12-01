import Vue from 'vue'
import VueRouter from "vue-router";
import VueLogger from "vuejs-logger";
import App from './App.vue'
import vuetify from './plugins/vuetify';
import { store } from "./_store";

// router setup
import routes from "./routes/routes";

import Notifications from "./components/NotificationPlugin";


Vue.config.productionTip = false

// configure router
const router = new VueRouter({
  routes, // short for routes: routes
  linkExactActiveClass: "nav-item active"
});

Vue.use(VueRouter);

const isProduction = process.env.NODE_ENV === 'production';

const options = {
  isEnabled: true,
  logLevel: isProduction ? 'debug' : 'debug',
  stringifyArguments: false,
  showLogLevel: true,
  showMethodName: true,
  separator: '|',
  showConsoleColors: true
};

Vue.use(VueLogger, options);
Vue.use(Notifications);

new Vue({
  vuetify,
  render: h => h(App),
  router,
  store
}).$mount('#app')
