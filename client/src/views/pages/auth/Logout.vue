<template> </template>

<script>


export default {
  data() {
    return {
      userInfo: this.$cookies.get("userInfo")
    };
  },

  mounted() {
    // remove user in socket

    if(this.userInfo){
        this.$socket.emit("removeUser", {
          userId: this.userInfo.id
        });

    }
    // clear user in cookies
    this.$cookies.remove("userToken");
    this.$cookies.remove("userInfo");

    // clear store
    this.$store.dispatch("chats/reset");
    this.$store.dispatch("components/reset");
    this.$store.dispatch("motels/reset");


    this.$router.replace("/auth/login");
  }
};
</script>
