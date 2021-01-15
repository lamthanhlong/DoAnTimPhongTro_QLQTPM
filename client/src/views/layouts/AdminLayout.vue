<template>
  <div id="layout-admin">
    <header-admin v-if="isAdminRoute"></header-admin>
    <toolbar-header v-else></toolbar-header>
    <v-main>
      <div id="page-wrapper">
        <div class="main-content">
          <router-view></router-view>
        </div>
      </div>
    </v-main>
    <m-footer></m-footer>
  </div>
</template>


<script>
import Header from "./partials/Header";
import HeaderAdmin from "./partials/HeaderAdmin";
import Footer from "./partials/Footer";


export default {
  components: { 
    "toolbar-header": Header, 
    "header-admin": HeaderAdmin,
    "m-footer": Footer, 
  },

  data(){
    return {
      isAdminRoute: false,
    }
  },

  mounted(){
    var rootContext = this.$route.matched[0];
    if(rootContext.hasOwnProperty('name')){
      if(rootContext.name === "admin"){
        this.isAdminRoute = true;
      }
    }
  }

};
</script>
