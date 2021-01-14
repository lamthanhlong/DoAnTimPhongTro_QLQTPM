<template>
  <v-layout row justify-center>
    <v-container>
      <v-dialog
        persistent
        max-width="500"
        v-model="showFormRating"
      >
        <v-card
          class="pb-8"
        >
            <v-card-title primary-title style="width:100%;">
              {{ title }}
            </v-card-title>

            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-row>
                  <v-col cols="12">
                      <v-card-subtitle>Vote</v-card-subtitle>
                      <v-rating
                        v-model="form.rating"
                        color="amber"
                        dense
                        half-increments
                        
                        size="20"

                      >
                      </v-rating>
                  </v-col>

                  <v-col cols="12">
                     <v-textarea
                     outlined
                     rows="5"
                     v-model="form.comment"
                     label="Message"
                     class="no-resize"
                     :rules="[
                        $validation.required(form.comment, 'Nội dung')
                      ]"
                     >
                     </v-textarea>
                  </v-col>
                </v-row>
              </v-form>
        
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <btn-save 
                :outlined="true"
                title="Submit"
                v-on:action="save()"
                color="blue darken-1"
                type="save"
              >
              </btn-save>
              
               <btn-cancel
                :outlined="true"
                :title="$lang.CANCEL"
                v-on:action="close()"
              > </btn-cancel>
            </v-card-actions>
        </v-card>
    </v-dialog>
    </v-container>
  </v-layout>
</template>

<script>

import RatingService from "@/services/rating";

export default {

  props: {
    showFormRating: {
      type: Boolean,
      default: false,
    },
    title: String,
    data: [Array, String]
  },


  data() {
    return {
      form: {
        comment: "",
        rating: 1,
      },
      valid: false,
    }
  },


  computed: {
    
  },

  methods: {
    close(){
     this.$emit('update:showFormRating', false) 
    },

    async save(){

      if (this.$refs.form.validate()) {
        const res = await RatingService.store(this.form);

        if(res.data)
        { 

          this.$store.dispatch("motels/updateRatings", res.data);
           toastr.success(
              "<p> Đánh giá thành công <p>",
              "Success",
              { timeOut: false }
            );
           this.$emit('update:showFormRating', false);
        }

        this.$refs.form.reset();
      }
    },
  },
};
</script>
