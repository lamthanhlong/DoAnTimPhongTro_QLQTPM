<template>
  <v-navigation-drawer
    v-model="initDrawer"
    :mini-variant="initMini"
    width="260"
    app
  >
    <v-list-item class="logo" :to="'/'">
      <v-list-item-avatar class="logo-img">
        <v-img
          src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Vue.png"
        ></v-img>
      </v-list-item-avatar>
      <v-list-item-title>PVH Store</v-list-item-title>
    </v-list-item>
    <v-divider></v-divider>
    <v-list dense nav class="py-0 transparent">
      <v-list-item link @click="itemList($event)" to="/dashboard">
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>Dashboard</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
      
      <v-list-item
        v-for="(item, index) in listMenu"
        :to="item.link"
        @click="itemList($event)"
        :key="item.title"
        v-check-position="item.position"
      >
        <v-list-item-icon>
          <v-icon>{{ item.icon }}</v-icon>
        </v-list-item-icon>

        <v-list-item-content>
          <v-list-item-title>{{ item.title }}</v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<style type="text/css"></style>
<script>
export default {
  props: {
    mini: Boolean,
    drawer: Boolean
  },

  data() {
    return {
      initMini: this.mini,
      initDrawer: this.drawer,

      listMenu: [
        {
          title: "Sales",
          link: "/sales",
          icon: "mdi-point-of-sale",
          permission: null,
          position: 4
        },
        {
          title: "Warehouse",
          link: "/warehouse",
          icon: "mdi-recycle",
          permission: null,
          position: 1
        },
        {
          title: "Orders",
          link: "/orders",
          icon: "mdi-billboard",
          permission: null,
          position: 1
        },
        // {
        //   title: "Setting",
        //   link: "/settings",
        //   icon: "fa fa-cog",
        //   permission: null,
        //   position: 1
        // },
        {
          title: "Chatting",
          link: "/chat",
          icon: "fa fa-comments",
          permission: null,
          position: null
        }
      ],
      check: "admin"
    };
  },

  created() {},

  watch: {
    mini: function() {
      this.initMini = this.mini;
    },
    drawer: function(value) {
      if (this.initDrawer == value) {
        value = true;
      }
      this.initDrawer = value;
    }
  },

  methods: {
    itemList() {
      this.groupMenus.filter(groupMenu => {
        groupMenu.active = false;
      });
    }
  }
};
</script>
