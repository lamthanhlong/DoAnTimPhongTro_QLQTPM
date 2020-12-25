import Vue from "vue";
Vue.filter("toCurrency", function(value) {

  value = parseInt(value)

  if(isNaN(value)){
  	return 0
  }
 
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value)
});
