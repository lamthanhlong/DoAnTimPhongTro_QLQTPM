<template>
  <v-app>
    <progress-bar></progress-bar>
    <router-view></router-view>
  </v-app>
</template>

<style lang="scss">
@import "@/styles/index";
</style>

<script>
import ProgressBar from "./components/progress/HeaderProgress.vue";


export default {
  components: {
    "progress-bar": ProgressBar
  },



};
</script>
