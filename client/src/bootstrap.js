import Vue from "vue";
import VueCookies from "vue-cookies";
import colors from "vuetify/lib/util/colors";
import helperCommon from '@/helpers/common';
import helperValidation from '@/helpers/validation'

import VueSocketIO from "vue-socket.io";
import SocketIO from "socket.io-client";
import VueChatScroll from "vue-chat-scroll";
import SocketEvent from '@/config/socket_event'

//plugin
require("@/plugins/directive");
require("@/plugins/filter");


// component
import BreadCrumbs from "@/components/BreadCrumbs";
import Pagination from '@/components/Pagination.vue';
import ProgressHeader from "@/components/progress/ProgressHeader.vue";
import ProgressLoading from "@/components/progress/ProgressLoading.vue";

import ButtonDetail from '@/components/button/ButtonDetail';
import ButtonSave from '@/components/button/ButtonSave';
import ButtonCancel from '@/components/button/ButtonCancel';

import LabelTable from '@/components/label/LabelTable';

import WindowChat from  "@/components/WindowChat.vue";

// config
import constant from '@/config/constant';
import lang from '@/config/lang';



Vue.config.productionTip = false;
Vue.config.devtools = true;

// //handle error component
// Vue.config.errorHandler = function(err, vm, info) {
//   console.log(`Error: ${err.toString()}\nInfo: ${info}`);
// }

// // handle warning component
// Vue.config.warnHandler = function(msg, vm, trace) {
//   console.log(`Warn: ${msg}\nTrace at ${vm.title}: ${trace}` );
// }


global.axios = require("axios");
global.axios.defaults.headers.common = {"X-Requested-With": "XMLHttpRequest"};
global.axios.defaults.baseURL = process.env.VUE_APP_ROOT_API || "http://localhost:3000/api/";

global.toastr = require("toastr");
global.toastr.options.closeButton = true;
global.toastr.options.closeMethod = "fadeOut";
global.toastr.options.closeDuration = 500;
global.toastr.options.closeEasing = "swing";

Vue.component('btn-detail', ButtonDetail);
Vue.component('btn-save', ButtonSave);
Vue.component('btn-cancel', ButtonCancel);


const gauthOption = {
  clientId: process.env.VUE_APP_GOOGLE_CLIENT_ID,
  scope: process.env.VUE_APP_GOOGLE_SCOPE,
  prompt: process.env.VUE_APP_GOOGLE_PROMPT
};


Vue.prototype.$helper = helperCommon;
Vue.prototype.$validation = helperValidation;
Vue.prototype.$constant = constant;
Vue.prototype.$lang = lang;
Vue.prototype.$socketEvent = SocketEvent;
Vue.prototype.$version = parseFloat(process.env.VUE_APP_VERSION);

Vue.component('breadcrumbs', BreadCrumbs);
Vue.component('pagination-custom', Pagination);

Vue.component('progress-header', ProgressHeader);
Vue.component('progress-loading', ProgressLoading);
Vue.component('label-table', LabelTable);
Vue.component('window-chat', WindowChat);

Vue.use(VueChatScroll);
Vue.use(VueCookies);
Vue.use(
  new VueSocketIO({
    debug: true,
    connection: process.env.VUE_APP_ROOT_SOCKET || "http://localhost:3000",
   
    // options: { path: "/my-app/" } //Optional options
  })
);
