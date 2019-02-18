import Vue from 'vue'
import App from '@/views/index'
import "@/assets/common/css/resets";
import "@/assets/common/css/style.css";
import "../css/index";
import "@/lib/jquery";
// import "@/templete/mynav";

Vue.config.productionTip = false ;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
});