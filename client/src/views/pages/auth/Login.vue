<template>
  <v-app id="login">
    <v-container fluid fill-height>
      <v-layout align-center justify-center v-resize="onResize">
        <v-flex xs12 sm8 md4>
          <v-card class="elevation-12">
            <v-toolbar color="primary" dark flat>
              <v-toolbar-title class="text-center">
                Sign In
              </v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form ref="form" v-model="valid" :lazy-validation="lazy">
                <v-text-field
                  label="SĐT"
                  prepend-icon="mdi-phone"
                  type="email"
                  v-model="form.phone"
                  :rules="[
                    $validation.required(form.phone, `Số điện thoại`)
                  ]"
                ></v-text-field>

                <v-text-field
                  id="password"
                  label="Mật khảu"
                  prepend-icon="mdi-lock"
                  type="password"
                  :rules="[
                    $validation.required(form.password, `Mật khẩu`)
                  ]"
                  v-model="form.password"
                ></v-text-field>

     
                <v-btn block color="primary" @click="login()">Login</v-btn>

                <hr />

                <v-card-text class="text-center">
                  Don't have account?
                  <v-btn
                    text
                    class="light-blue--text pa-0 caption"
                    @click="redirectRegister()"
                  >
                    Sign up now
                  </v-btn>
                </v-card-text>
              </v-form>
            </v-card-text>
          </v-card>
        </v-flex>
      </v-layout>
    </v-container>
  </v-app>
</template>
<script>
import Auth from "@/services/auth";

//mixin
import IsMobile from "@/mixins/is_mobile";

export default {
  mixins: [IsMobile],

  // beforeRouteEnter(to, from, next) {
  //   // const tokenUser = $cookies.get("accessToken");
  //   // if (!tokenUser) {
  //   //   return next();
  //   // }
  //   // return next({ path: "/motels" });
  // },

  data() {
    return {
      valid: true,
      lazy: false,

      styleBtn: {
        width: '100%',
        marginTop: '10px'
      },

      form: {
        phone: "",
        password: "",
      }
    };
  },

  mounted() {

  },

  methods: {
    redirectRegister() {
      this.$router.push("/auth/register");
    },

    login() {

      if (this.$refs.form.validate()) {
        this.$store.dispatch("components/progressLoading", { option: "show" })

        var dataLogin = {
          phone: this.form.phone,
          password: this.form.password
        };

        Auth.login(dataLogin).then(res => {
      
          if (res.status == 200) {

            this.$cookies.set("userInfo", res.data.user);
            this.$cookies.set("accessToken", res.data.token);
            this.$socket.emit(this.$socketEvent.ADD_USER, res.data.user);
            setTimeout(() => {
                this.$store.dispatch("components/progressLoading", { option: "hide" })
               this.$router.push("/motels");
            }, 1500);

           
          } else {
            setTimeout(() => {
              toastr.error("SĐT hoặc mật khẩu không chính xác", "Error", { timeOut: 1000 });
               this.$store.dispatch("components/progressLoading", { option: "hide" })
            }, 1500);
          }
        });
      }
    },

  },
};
</script>
