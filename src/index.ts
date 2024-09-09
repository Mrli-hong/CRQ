import Vue from "vue";
import hui from "h_ui/dist/h_ui.min.js";
import HddmlComponents from "./main";
// import Index from './demo/comment-list.vue'
import Index from './demo/adjustBrokerrelation.vue'
// import Index from './demo/economic-relations-example.vue'

import "h_ui/dist/h_ui.min.css";

// 基础类样式
import './common/styles/baseStyle.scss'

Vue.use(hui);
Vue.use(HddmlComponents);

new Vue({
  el: "#app",
  render(h) {
    return h(Index);
  },
});
