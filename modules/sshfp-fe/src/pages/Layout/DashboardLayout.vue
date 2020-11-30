<template>
  <div>
    <v-app>
      <notifications></notifications>
      <v-app-bar 
        app
      >
        <v-app-bar-nav-icon></v-app-bar-nav-icon>
        <v-toolbar-title>SSHFP Tester</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-app-bar>

      <v-main>
        <dashboard-content> </dashboard-content>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import DashboardContent from "./Content.vue";

export default {
  name: 'Waterfall',
  components: {
    DashboardContent
  },
  data() {
    return {
    };
  }
}
</script>

<style lang="scss" scoped>

</style>

