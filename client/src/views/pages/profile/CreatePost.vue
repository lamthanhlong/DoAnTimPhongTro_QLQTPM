<template>
  <v-app id="create_post">
    <v-container>
      <v-row >
        <v-col col="12" lg="8" class="mx-auto">
         <v-card>
          <v-card-title class="headline d-flex pb-4">
            Đăng bài
          </v-card-title>
          <v-card-text class="mt-4">
                 
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="form.title"
                  :rules="[
                    $validation.required(form.title, 'Thông tin')
                  ]"
                  label="Thông tin"
                  required
                ></v-text-field>

                <v-text-field
                  v-model="form.area"
                 :rules="[
                    $validation.required(form.area, 'Diện tích')
                  ]"
                  label="Diện tích"
                  required 
                >

                <template v-slot:append>
                    <p>m<sup>2</sup></p>
                </template>

                </v-text-field>

                <v-text-field
                  v-model.number="form.price" 
                  type="number" 
                  label="Giá"
                >

                <template v-slot:append>
                    <p>triệu VNĐ</p>
                </template>
                </v-text-field>


                <v-text-field
                  v-model="form.address"
                 :rules="[
                    $validation.required(form.price, 'Địa chỉ')
                  ]"
                  label="Địa chỉ"
                  required
                ></v-text-field>


                <m-dropzone
                 :data.sync="form.images"
                 :multiple="true"
                >

                </m-dropzone>

                <v-checkbox
                  v-model="form.is_furniture"
                  label="Có nội thất"
                ></v-checkbox>

                <v-textarea 
                name="descriptions" label="Mô tả"
                class="no-resize"
                >
                  
                </v-textarea>

             </v-form>

          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <btn-save 
              :outlined="true"
              title="Save"
              v-on:action="save()"
              color="blue darken-1"
              type="save"
            >
            </btn-save>
            
            <btn-cancel 
              :outlined="true"
              title="Close"
              v-on:action="close()"
              color="blue darken-1"
              type="close"
            >
            </btn-cancel>
          </v-card-actions>
        </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>


<script>

// components 
import DropZone from "./components/DropZone";

// services


export default {

  components: {
    'm-dropzone': DropZone
  },

  data(){
    return {
       lazy: false,
      valid: true,
      form: {
        title: "",
        address: "",
        price: "",
        images: "",
        area: "",
        description: "",
        is_furniture: null,
      }
    }
  },

  created(){

  },

  methods: {
    async save(){

    }
  }
};


</script>