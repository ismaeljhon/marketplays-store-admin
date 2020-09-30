import Vue from 'vue'
import App from './App.vue'
import './registerServiceWorker'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify';
import swal from 'sweetalert';

Vue.config.productionTip = false

import UtilMixin from '@/mixins/Utils'
Vue.mixin(UtilMixin)

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
