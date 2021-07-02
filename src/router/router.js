import Vue from 'vue'
import Router from 'vue-router'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// const HotIndex = (resolve) => require(['@/pages/HotSell/HotIndex'], resolve)
const recommendList = (resolve) => require(['@/pages/Recommend/RecommendList'], resolve)
const recommendAdd = (resolve) => require(['@/pages/Recommend/RecommendAdd'], resolve)
const recommendDetail = (resolve) => require(['@/pages/Recommend/RecommendDetail'], resolve)
const recommendScheme = (resolve) => require(['@/pages/Recommend/RecommendScheme'], resolve)

Vue.use(Router)
Vue.use(ElementUI)

const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
    return originalPush.call(this, location).catch(err => err)
} 
export default new Router({
    routes: [
        /*
        {
            path: '/',
            redirect: '/List?start_date=202105&region=深圳&username=PR&shopid=90000569&route=list'
        },
        */
        {
            // 采购推荐单--列表
            name: 'List',
            path: '/List',
            component: recommendList
        },
        {
            // 采购推荐单--新增
            name: 'Add',
            path: '/Add',
            component: recommendAdd,
            meta: {
                sheet: "RE"
            }
        },
        {
            // 采购推荐单--详情
            name: 'Detail',
            path: '/Detail',
            component: recommendDetail,
            meta: {
                sheet: "RE"
            }
        },
        {
            // 采购推荐方案
            name: 'Scheme',
            path: '/Scheme',
            component: recommendScheme,
            meta: {
                sheet: "RE"
            }
        }
    ]
})