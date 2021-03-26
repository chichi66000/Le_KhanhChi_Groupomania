import { createApp} from 'vue'


import App from './App.vue'
import router from './router'
import store from './store'

import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
import '../src/assets/custom.scss'

createApp(App).use(store).use(router).mount('#app')

import jQuery from 'jquery'
window.jQuery = window.$ = jQuery
require('bootstrap-sass')
