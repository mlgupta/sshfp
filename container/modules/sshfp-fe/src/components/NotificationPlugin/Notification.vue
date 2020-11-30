<template>
  <v-snackbar
    v-model="snackbar"
    :bottom="verticalAlign === 'bottom'"
    :top="verticalAlign === 'top'"
    :left="horizontalAlign === 'left'"
    :right="horizontalAlign === 'right'"
    :color="type"
    :timeout="timeout"  
  >
    {{ message }}

    <template v-slot:action="{ attrs }">
      <v-btn 
        text
        v-bind="attrs"
        @click="close"
      > 
        X
      </v-btn>
    </template>
  </v-snackbar>
</template>
<script>
export default {
  name: "notification",
  props: {
    message: String,
    icon: String,
    verticalAlign: {
      type: String,
      default: "top"
    },
    horizontalAlign: {
      type: String,
      default: "center"
    },
    type: {
      type: String,
      default: "info"
    },
    timeout: {
      type: Number,
      default: 4000
    },
    timestamp: {
      type: Date,
      default: () => new Date()
    }
  },
  data() {
    return {
      elmHeight: 0,
      snackbar: true
    };
  },
  computed: {
    hasIcon() {
      return this.icon && this.icon.length > 0;
    },
    alertType() {
      return `alert-${this.type}`;
    },
    customPosition() {
      let initialMargin = 20;
      let alertHeight = this.elmHeight + 10;
      let sameAlertsCount = this.$notifications.state.filter(alert => {
        return (
          alert.horizontalAlign === this.horizontalAlign &&
          alert.verticalAlign === this.verticalAlign &&
          alert.timestamp <= this.timestamp
        );
      }).length;
      let pixels = (sameAlertsCount - 1) * alertHeight + initialMargin;
      let styles = {};
      if (this.verticalAlign === "top") {
        styles.top = `${pixels}px`;
      } else {
        styles.bottom = `${pixels}px`;
      }
      return styles;
    }
  },
  methods: {
    close() {
      this.$emit("on-close", this.timestamp);
    }
  },
  mounted() {
//    this.elmHeight = this.$el.clientHeight;
//    if (this.timeout) {
//      setTimeout(this.close, this.timeout);
//    }
  }
};
</script>
<style lang="scss" scoped>
</style>
