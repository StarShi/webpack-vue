import Vue from 'vue';

// 引入全局脚本
import "@/lib/jquery";

//引入全局初始化样式
import "@/assets/common/css/resets";
import "@/assets/common/css/style.css";

//引入全局公共样式
import "./css/contact";

// 引入组件
import App from '@/views/contact/contact.vue';

Vue.config.productionTip = false ;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
});