<template>
  <v-app id="detail">
    <v-container>
      <v-layout row>
        <v-flex xs8 style="left">
          <v-carousel>
            <v-carousel-item
              v-for="(item, i) in items"
              :key="i"
              :src="item.src"
              reverse-transition="fade-transition"
              transition="fade-transition"
            ></v-carousel-item>
          </v-carousel>
        </v-flex>
        <v-flex xs4>
          <v-card>
            <h1>Hilton Hotel</h1>

            <v-rating
              v-model="rating"
              background-color="yellow lighten-3"
              color="yellow"
              large
            ></v-rating>

            <div>
              <v-icon>mdi-gmail</v-icon>
              <span>nguyentri.7264@gmail.com</span>
            </div>

            <div>
              <v-icon>mdi-cellphone</v-icon>
              <span>0949667264</span>
            </div>

            <div>
              <v-icon dart>mdi-google-maps</v-icon>
              <span>SAN FRANCISCO UNITED STATES</span>
              <hr />
              <span> Price: $100 </span>
            </div>
          </v-card>
        </v-flex>
      </v-layout>

      <v-layout row>
        <v-flex xs8 style="left">
          <v-card>
            <v-toolbar color="cyan" dark flat>
              <template>
                <v-tabs v-model="tab" align-with-title>
                  <v-tab v-for="item in itemsTab" :key="item">
                    {{ item }}
                  </v-tab>
                </v-tabs>
              </template>
            </v-toolbar>

            <v-tabs-items v-model="tab">
              <v-tab-item>
                <v-card flat>
                  <v-card-text>Description</v-card-text>
                </v-card>
              </v-tab-item>

              <v-tab-item>
                <v-card flat>
                  <v-card-text>Reviews</v-card-text>
                </v-card>
              </v-tab-item>

              <v-tab-item>
                <v-card flat>
                  <v-card-text>Write a review</v-card-text>
                </v-card>
              </v-tab-item>
            </v-tabs-items>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>

<style>
.left,
.right {
  display: block;
  position: relative;
  clear: both;
}

.left {
  float: left;
  margin-left: 20px;
}
.right {
  float: right;
  margin-right: 20px;
}
</style>

<script>
export default {
  data() {
    return {
      items: [
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg",
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/sky.jpg",
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/bird.jpg",
        },
        {
          src: "https://cdn.vuetifyjs.com/images/carousel/planet.jpg",
        },
      ],
      tab: null,
      itemsTab: ["DESCRIPTION", "REVIEWS", "WRITE A REVIEW"],
    };
  },
};
</script>
