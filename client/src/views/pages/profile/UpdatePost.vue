<template>
  <v-layout row justify-center >
     <v-dialog v-model="editModal" persistent max-width="900" v-if="getMotel">
      <v-card >
          <v-card-title class="headline d-flex pb-4 border-bottom">
            Cập nhật phòng trọ
          </v-card-title>
          <v-card-text class="mt-4">
            
            <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field

                  v-model="getMotel.title"
                  :rules="[
                    $validation.required(getMotel.title, 'Tiêu đề')
                  ]"
                  label="Tiêu đề"
                  required
                ></v-text-field>

                <v-text-field

                  type="number"
                  v-model.number="getMotel.area"
                  :rules="[
                    $validation.required(getMotel.area, 'Diện tích')
                  ]"
                  label="Diện tích"
                  required 
                >

                <template v-slot:append>
                    <p>m<sup>2</sup></p>
                </template>

                </v-text-field>

                <v-text-field
                  :rules="[
                    $validation.required(getMotel.price, 'Giá')
                  ]"
                  v-model.number="getMotel.price" 
                  type="number" 
                  label="Giá"
                >

                <template v-slot:append>
                    <p>triệu VNĐ</p>
                </template>
                </v-text-field>
                <v-text-field
                  v-model="getMotel.address"
                 :rules="[
                    $validation.required(getMotel.address, 'Địa chỉ')
                  ]"
                  label="Địa chỉ"
                  required
                ></v-text-field>


                <m-dropzone
                 :data.sync="listImage"
                 :multiple="true"
                >
                </m-dropzone>
               <v-subheader >Hình ảnh: </v-subheader>
                <v-row>
                  <v-col cols="12" md="6" lg="4" v-for="(item, index) in getMotel.images" :key="index">
                     <v-hover v-slot:default="{ hover }" open-delay="200">
                      <v-card
                        :elevation="hover ? 12 : 2"
                        :class="{ 'on-hover': hover }"
                        max-width="400"
                      >
                        <v-img 
                          :src="item"  
                          :aspect-ratio="16/9"  
                          width="100%"
                          height="auto"
                          contain
                          >
                        </v-img>

                        <v-fade-transition>
                          <v-overlay v-if="hover" absolute color="#036358">
                            <v-btn @click="deleteImage(index)">
                              Xóa
                            </v-btn>
                          </v-overlay>
                        </v-fade-transition>
                      </v-card>
                    </v-hover>

                  </v-col>
                </v-row>

                <v-checkbox
                  v-model="getMotel.has_furniture"
                  label="Có nội thất"
                ></v-checkbox>

                <v-textarea 
                name="descriptions" label="Mô tả"
                class="no-resize"
                 v-model="getMotel.description"
                 :rules="[
                    $validation.required(getMotel.description, 'Mô tả')
                  ]"
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
  </v-dialog>
</v-layout>
</template>


<script>

// components 
import DropZone from "./components/DropZone";
import Menu from './components/Menu.vue';

// services
import MotelService from "@/services/motel";
import CookieService from "@/services/cookie";


//mixins
import IsMobile from "@/mixins/is_mobile";
export default {

  props: {
    motel: {
      type: Object,
      required: true,
    },
    editModal: Boolean,
  },

  components: {
    'm-dropzone': DropZone,
    'm-menu': Menu
  },

  mixins: [IsMobile],

  created(){
    if(this.getMotel.images){
      this.getMotel.images = this.$helper.convertStringToArrayImage(this.getMotel.images);
    
    }
  },

  data(){
    return {
      lazy: false,
      valid: true,
      getMotel: this.motel,
      listImage: [],
    }
  },


  methods: {

    async deleteImage(index){
      this.getMotel.images.splice(index, 1);
    },

    async save()
    {

      if (this.$refs.form.validate()) {

        this.getMotel.images = this.getMotel.images.concat(this.listImage);
        const id = this.getMotel._id;
        const res = await MotelService.update(id, this.getMotel);

        if(res.status === 200)
        {
           toastr.success(
              "<p> Cập nhật thành công <p>",
              "Success",
              { timeOut: false }
            );
            this.$emit("update:editModal", false);
        }else{
          toastr.error("Internal Server Error", "Error", {
              timeOut: 1000
          });
        }
          
      }
    },

    close()
    {
      this.$emit("update:editModal", false);
    }
  }


};


</script>