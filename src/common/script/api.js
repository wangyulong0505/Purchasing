import axios from 'axios'
// import qs from 'qs'
import {
    baseUrl
} from '@/common/script/config'
import {
    MessageBox,
    Toast,
    Indicator
} from 'mint-ui'
axios.defaults.baseURL = '/api'
axios.defaults.timeout = 30000
axios.defaults.headers.post['Content-Type'] = 'application/json;charset=UTF-8'
// axios.defaults.headers = 'Access-Control-Allow-Origin' '*';
// axios.defaults.headers = 'Access-Control-Allow-Credentials' 'true';
// axios.defaults.headers = 'Access-Control-Allow-Methods' 'GET, POST';

axios.interceptors.request.use((config) => {
    return config
}, (error) => {
    return Promise.reject(error)
})

axios.interceptors.response.use((response) => {
    if (response.status === 200) {
        return Promise.resolve(response)
    } else {
        return Promise.reject(response)
    }
}, (error) => {
    if (error.response) {
        switch (error.response.status) {
            case 404:
                Toast('网络请求不存在')
                break
            case 500:
                break
            default:
                MessageBox({
                    title: '提示',
                    message: error.response.data
                })
                break
        }
    }
    if (error.request) {
        if (error.request.readyState === 4 && error.request.status === 0) {
            return Toast('请求超时')
        }
    }
    if (!window.navigator.onLine) {
        return Toast('网络连接失败')
    }
    return Promise.reject(error.response)
})

function judgeByMsg(res) {
    Indicator.close()
    if (res.data && res.data.message) {
        return MessageBox({
            title: '提示',
            message: res.result.message
        })
    } else {
        return MessageBox({
            title: '提示',
            message: '网络请求失败'
        })
    }
}

/*  获取热销数据
 */
export function GetItemSaleFor(params) {
    return axios.post(`${baseUrl}api/Purchasing/ListPurchasingCompare`, JSON.stringify(params)).then((res) => {
        return Promise.resolve(res.data)
    }, (res) => {
        judgeByMsg(res)
    })
}
/*  保存单据
 */
export function SaveSheet(params) {
    return axios.post(`${baseUrl}api/Purchasing/PurchasingSave`, JSON.stringify(params)).then((res) => {
        return Promise.resolve(res.data)
    }, (res) => {
        judgeByMsg(res)
    })
}
/*  获取单头信息
 */
export function QuerySheetMaster(params) {
    return axios.post(`${baseUrl}api/Purchasing/ListPurchasingQuery`, JSON.stringify(params)).then((res) => {
        return Promise.resolve(res.data)
    }, (res) => {
        judgeByMsg(res)
    })
}
/*  获取单据明细
 */
export function QuerySheetDetails(params) {
    return axios.post(`${baseUrl}api/Purchasing/QueryDetails`, JSON.stringify(params)).then((res) => {
        return Promise.resolve(res.data)
    }, (res) => {
        judgeByMsg(res)
    })
}
/*  审核单据
 */
export function ApproveSheet(params) {
    return axios.post(`${baseUrl}api/Purchasing/PurchasingApprove`, JSON.stringify(params)).then((res) => {
        return Promise.resolve(res.data)
    }, (res) => {
        judgeByMsg(res)
    })
}
/*  删除单据
 */
export function DeleteSheet(params) {
    return axios.post(`${baseUrl}api/Purchasing/PurchasingDelete`, JSON.stringify(params)).then((res) => {
        return Promise.resolve(res.data)
    }, (res) => {
        judgeByMsg(res)
    })
}
/*  获取订单号列表
 */
export function QuerySheetNoList(params) {
    return axios.post(`${baseUrl}api/Purchasing/QuerySheetNoList`, JSON.stringify(params)).then((res) => {
        return Promise.resolve(res.data)
    }, (res) => {
        judgeByMsg(res)
    })
}
/*  获取单号
 */
export function GetSheetNo(params) {
    return axios.post(`${baseUrl}api/Purchasing/GetPurchasingSheetNo`, JSON.stringify(params)).then((res) => {
        return Promise.resolve(res.data)
    }, (res) => {
        judgeByMsg(res)
    })
}
/*  获取主单信息
 */
export function GetSheetMaster(params) {
    return axios.post(`${baseUrl}api/Purchasing/GetPurchasingSheetMaster`, JSON.stringify(params)).then((res) => {
        return Promise.resolve(res.data)
    }, (res) => {
        judgeByMsg(res)
    })
}
/*  获取详细信息
 */
export function ListSheetDetail(params) {
    return axios.post(`${baseUrl}api/Purchasing/ListPurchasingSheetDetail`, JSON.stringify(params)).then((res) => {
        return Promise.resolve(res.data)
    }, (res) => {
        judgeByMsg(res)
    })
}
/*  获取商户数据
 */
export function GetShopInfo(params) {
    return axios.post(`services/app/ShopInfoService/OnlineGetShopInfo`, JSON.stringify(params)).then((res) => {
        return Promise.resolve(res.data)
    }, (res) => {
        judgeByMsg(res)
    })
}