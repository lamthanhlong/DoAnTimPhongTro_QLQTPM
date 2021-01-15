<template>
<div>
    <v-card tile>
      <v-img
        height="100%"
        src="https://cdn.vuetifyjs.com/images/cards/server-room.jpg"
      >
        <v-row align="end" class="fill-height">
          <v-col align-self="start" class="pt-0" cols="12">
            <v-avatar class="profile" color="white" tile  width="200" height="250">
              <v-img
                src="https://gamek.mediacdn.vn/133514250583805952/2020/3/7/anh-1-1583592253266481895600.jpg"
              ></v-img>
            </v-avatar>
          </v-col>
          <v-col class="py-0">
            <v-list-item color="rgba(0, 0, 0, .4)" dark>
              <v-list-item-content>
                <v-list-item-title class="title"
                  >{{ getUser.name }}</v-list-item-title
                >
                <v-list-item-subtitle>{{ getUser.phone }}</v-list-item-subtitle
                >
              </v-list-item-content>
            </v-list-item>
          </v-col>
        </v-row>
      </v-img>

    </v-card>
</div>
</template>

<script type="text/javascript">

export default {

  props: {
    getUser: Object
  },

	data(){
		return {
			
		}
	},



}
</script>