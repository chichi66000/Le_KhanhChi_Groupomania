import { createApp} from 'vue'
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import '../src/assets/custom.scss'

// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
Vue.use(IconsPlugin)

createApp(App).use(store).use(router).mount('#app')

import jQuery from 'jquery'
window.jQuery = window.$ = jQuery
require('bootstrap-sass')
