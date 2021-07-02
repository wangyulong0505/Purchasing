import Vue from 'vue'
import App from './App'
import router from './router/router'
import {
    store
} from './store/store'
import FastClick from 'fastclick'
import global from './Global'
// import print from 'vue-print-nb'
import print from '../static/util/print'
// import VueLazyLoad from 'vue-lazyload'
import {
    DatetimePicker,
    Popup,
    InfiniteScroll,
    Spinner,
    Loadmore,
    Indicator,
    Toast,
    MessageBox,
    Switch,
    Cell
} from 'mint-ui'
import {
    _dateFormat
} from '@/common/script/base'

// import Mint from 'mint-ui'

import '@/common/style/index.scss'
import "@/common/style/reset.scss"
import 'mint-ui/lib/style.css'

// Vue.use(Mint)
Vue.component(Cell.name, Cell)
Vue.component(Popup.name, Popup)
Vue.component(DatetimePicker.name, DatetimePicker)
Vue.component(Spinner.name, Spinner)
Vue.component(Loadmore.name, Loadmore)
Vue.component(Switch.name, Switch)
Vue.use(InfiniteScroll)
Vue.use(print)
Vue.prototype.$toast = Toast
Vue.prototype.$indicator = Indicator
Vue.prototype.$messagebox = MessageBox
Vue.prototype.$global = global

if ('addEventListener' in document) {
    document.addEventListener('DOMContentLoaded', function() {
        FastClick.attach(document.body)
    }, false)
}

// Vue.use(VueLazyLoad, {
//   loading: require('@/common/image/default.png')
// })

Vue.config.productionTip = false
Vue.filter("__dateFormat", (val) => {
    return _dateFormat(val)
})
Vue.filter("__amtFixed2", (val) => {
    val = Number(val) || 0
    return val.toFixed(2)
})
Vue.filter("__amtFixed4", (val) => {
    val = Number(val) || 0
    return val.toFixed(4)
})

Vue.prototype.$filters = Vue.options.filters

/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})