<template>
    <div id="app">
        <router-view></router-view>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { GetShopInfo } from '@/common/script/api'
// import Cookies from 'js-cookie'
export default {
    name: "App",
    data() {
        return {
            hasLogin: '',
            timeOutPath: '/?start_date=202105&region=深圳&username=PR&shopid=90000569',
            userName: ''
        }
    },
    methods: {
        _getUrlKey(name) {
            try {
                return decodeURIComponent((new RegExp('[?|&]' + name + '=' + '([^&;]+?)(&|#|;|$)').exec(location.href) || [""])[1].replace(/\+/g, '%20')) || null
            } catch (e) {
                return null
            }
            
        },
        _getItems() {
            this.$indicator.open('数据处理中')
            return GetShopInfo({
                shopId: this._getUrlKey('shopid')
            }).then((res) => {
                if (res.success && res.result.success) {
                    localStorage.setItem('shopId', this._getUrlKey('shopid'))
                    localStorage.setItem('key', res.result.security)
                    localStorage.setItem('userName', this._getUrlKey('username'))
                    localStorage.setItem('region', this._getUrlKey('region'))
                    localStorage.setItem('start_date', this._getUrlKey('start_date'))
                    this.$global.shopId = this._getUrlKey('shopid')
                    this.$global.key = res.result.security
                    this.$global.region = this._getUrlKey('region')
                    this.$global.start_date = this._getUrlKey('start_date')
                    if (this._getUrlKey('route') === 'list') {
                        let info = {
                            start_date: this._getUrlKey('start_date'),
                            shopId: this.$global.shopId,
                            region: this._getUrlKey('region'),
                            key: this.$global.key,
                            IsTest: this.$global.isTest,
                            IsOffline: this.$global.isOffline
                        }
                        this.$router.push({
                            path: '/List',
                            query: {
                                info: info,
                                sheet_no: ''
                            }
                        })
                    } else {
                        this.$router.push({
                            path: '/Scheme'
                        })
                    }
                } else {
                    console.log(res.result.message)
                    this.$messagebox({
                        title: '提示4',
                        message: 'GetShopInfo出错，出错原因：' + res.result.message
                    })
                }
            }).then(() => {
                setTimeout(() => {
                    this.$indicator.close()
                })
            })
        },
        // 登录超时控制
        _msgWarn() {
            if (this.$route.path === '/') {
                this.$messagebox({
                    title: '提示',
                    message: '请求超时，请重试!'
                }).then(action => {
                    this.$router.replace({
                        path: this.timeOutPath,
                        query: {}
                    })
                })
            }
        }
    },
    computed: {
        ...mapState({
            
        })
    },
    watch: { },
    created() {
        this._getItems()
    }
}
</script>

<style lang="scss">
@import "~@/common/style/reset.scss";
* {
  box-sizing: border-box;
}
html,
body {
  background: #f1f1f1;
  touch-action: none;
}
#app {
  width: 100%;
}
</style>
