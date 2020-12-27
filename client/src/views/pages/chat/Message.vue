<template>
<v-layout>
   <div class="d-flex window-chat" v-if="windowMessengers.length">
      <div v-for="item, index in windowMessengers">
        <v-card v-show="item.isVisible" >
          <v-toolbar dark color="primary darken-1">
            <v-toolbar-title>{{ item.employee.fullName }}</v-toolbar-title>

            <v-spacer></v-spacer>
                <v-btn 
                  icon  
                  dark
                  @click="closeWindowMessenger(item)" 
                >
                  <v-icon>mdi-close</v-icon>
                </v-btn>
          </v-toolbar>

          <v-card-text
            @v-chat-scroll-top-reached="loadMoreMessenger"
            v-chat-scroll="{ always: false, smooth: true, scrollonremoved: true }"
            class="message pa-0"
          >
            <v-list
              v-for="(messenger, index) in item.listMessengers"
              :key="index"
              class="receive pa-0"
            >
              <div class="block" v-if="messenger.userId !== userInfo.id">
                <v-list-item>
                  <v-list-item-avatar class="logo-img">
                    <v-img :src="$helper.getAvatar(item.avatar)"></v-img>
                  </v-list-item-avatar>
                  <v-list-item-title>
                    <v-chip :ripple="false">{{ messenger.message }}</v-chip>
                  </v-list-item-title>
                </v-list-item>
              </div>

              <div class="block" v-else>
                <v-list-item class="justify-end">
                  <v-chip color="pink" :ripple="false">{{ messenger.message }}</v-chip>
                </v-list-item>
              </div>
            </v-list>
          </v-card-text>

           <v-card-actions>
              <v-spacer></v-spacer>
                <div class="d-flex float-right align-center" style="width: 100%;">
                  <v-text-field
                    v-model="message"
                    solo
                    clearable
                    label="Message"
                    hide-details="auto"
                    @click:clear="clearMessage"
                    class="textfield__message"
                  ></v-text-field>
                  <v-btn
                    fab
                    dark
                    small
                    color="primary"
                    class="ml-2"
                    @click="sendMessenger(item)"
                  >
                    <v-icon dark>send</v-icon>
                  </v-btn>
                </div>
          </v-card-actions>
        </v-card>
       </div>
   </div>
 </v-layout>
</template>

<style lang="scss">

.theme--dark.textfield__message .v-input__slot {
  background: #383838 !important;
}


.v-chip.pink {
  color: #fff;
}

</style>

<script>

// service

export default {

  data(){
    return {

      showMenu: false,
      classActive: "active",
      menuRight: "menu-right",
      btnMenuRight: "btn-menu-right",

      smooth: false,
      statusUserLeave: false,

      windowMessengers: [

      ],

      message: "",
    }
  },

  mounted(){
    this.subscribeSendMessenger();
  },

  methods: {
    loadMoreMessenger() {},

    subscribeSendMessenger(){


      this.sockets.subscribe(this.$socketEvent.USER_SEND_MESSENGER, res => {
        if (res) {
          var windowMessenger = {
            ...res.sender,
            isVisible: true,
            listMessengers: [
              {
                userId: res.sender.id,
                message: res.message,
              }
            ] 
          }

          this.windowMessengers.map(item => {
            item.id !== res.sender.id ? item : {...item, listMessengers: item.listMessengers.push({
              userId: item.id,
              message: res.message
              })
            }
          })
          
        }

        this.$forceUpdate()
      });
    },


    clearMessage() {
      this.message = "";
    },

    sendMessenger(receiver){

      var data = {
        message: this.message,
      }

      this.windowMessengers.map(item => {
        item.id !== receiver.id ? item : {...item, listMessengers: item.listMessengers.push({
          userId: this.userInfo.id,
          message: this.message
        })}
      })


      this.$socket.emit(this.$socketEvent.USER_SEND_MESSENGER, data, receiver);
      this.clearMessage();
    },


    closeWindowMessenger(data){
      var index = this.windowMessengers.indexOf(data);
      this.windowMessengers.splice(index, 1)
    },

  },


}
</script>