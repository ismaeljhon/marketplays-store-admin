import _capitalize from 'lodash/capitalize';
import _upperCase from 'lodash/upperCase'
import Vue from 'vue'

Vue.filter('capitalize', value => {
    return _capitalize(value)
})
Vue.filter('uppercase', value => {
    return _upperCase(value)
})

Vue.filter('first_of_array', value => {
    return value[0]
})