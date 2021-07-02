/*  获取参数
 **  @name 参数名字，@defaultVal 没有查到时的返回
 */
export function _getQueryString(name, defaultVal) {
    var pattern = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')

    var r = window.location.search.substr(1).match(pattern)

    if (r) {
        return r[2]
    } else {
        return defaultVal
    }
}

export function _getHashAllString(name, defaultVal) {
    var pattern = new RegExp('(^|&)' + name + '=([^&]*)(&|$)')
    var r = ""

    var splits = window.location.hash.split("?")

    if (splits.length > 1) {

        r = splits[1].match(pattern)

        if (r) {
            return r[0]
        } else {
            return defaultVal
        }

    } else {
        return defaultVal
    }

}

export function _dateFormat(val, separe) {
    var split = separe || '-'
    if (val && val !== null) {
        if (typeof val === "string") {
            val = val.replace(/-/g, "/")
        }
        var date = new Date(val)
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        month = month > 9 ? month : '0' + month
        var day = date.getDate()
        day = day > 9 ? day : '0' + day

        return year + split + month + split + day
    } else {
        return ''
    }
}

export function _timeFormat(val, separe) {
    var split = separe || '-'
    if (val) {
        var date = new Date(val)
        var year = date.getFullYear()
        var month = date.getMonth() + 1
        month = month > 9 ? month : '0' + month
        var day = date.getDate()
        day = day > 9 ? day : '0' + day
        var hour = date.getHours()
        hour = hour > 9 ? hour : '0' + hour
        var minute = date.getMinutes()
        minute = minute > 9 ? minute : '0' + minute
        var second = date.getSeconds()
        second = second > 9 ? second : '0' + second

        return year + split + month + split + day + ' ' + hour + ':' + minute + ':' + second
    } else {
        return ''
    }
}

export function _receiptFormat(val, separe) {
    var split = separe || '-'
    if (val) {
        var letter = val.substr(0, 2)
        var num1 = val.substr(2, 4)
        var num2 = val.substr(6, 6)
        var num3 = val.substr(12, 4)
        return letter + split + num1 + split + num2 + split + num3
    } else {
        return 'xx' + split + 'xxxx' + split + 'xxxxxx' + split + 'xxxx'
    }
}
export function _brandFormat(val) {
    var str = val || ''
    var pattern = /\[.*\]/g
    return str.replace(pattern, '')
}