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

import GraphqlMutationsMixin from '@/graphql/mutations'
Vue.mixin(GraphqlMutationsMixin)

require('@/filters')

import { ValidationProvider, ValidationObserver } from 'vee-validate';
Vue.component('ValidationProvider', ValidationProvider);
Vue.component('ValidationObserver', ValidationObserver);
import { extend } from 'vee-validate';
import * as rules from 'vee-validate/dist/rules';

Object.keys(rules).forEach(rule => {
  extend(rule, rules[rule]);
});

// with typescript
for (let [rule, validation] of Object.entries(rules)) {
  extend(rule, {
    ...validation
  });
}

import VueCurrencyFilter from 'vue-currency-filter'
Vue.use(VueCurrencyFilter, {
  symbol : '$',
  thousandsSeparator: ',',
  fractionCount: 2,
  fractionSeparator: '.',
  symbolPosition: 'front',
  symbolSpacing: true,
  avoidEmptyDecimals: undefined,
})

import JsonCSV from 'vue-json-csv'
Vue.component('downloadCsv', JsonCSV)

/** Vue Apollo Config Here */
import ApolloClient from 'apollo-boost'
const apolloClient = new ApolloClient({
  // You should use an absolute URL here
  uri: process.env.VUE_APP_GRAPHQL_URL
})
import VueApollo from 'vue-apollo'
const apolloProvider = new VueApollo({
  defaultClient: apolloClient,
})
Vue.use(VueApollo)

new Vue({
  router,
  store,
  apolloProvider,
  vuetify,
  render: h => h(App)
}).$mount('#app')
