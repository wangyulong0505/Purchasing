<script>
    let shopId = localStorage.getItem("shopId")
    let key = localStorage.getItem("key")
    let region = localStorage.getItem('region')
    let start_date = localStorage.getItem('start_date')
    let isTest = true
    let isOffline = true
    const formateDateTime = str => {
        var date = new Date(str)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        const hour = date.getHours()
        const minute = date.getMinutes()
        const second = date.getSeconds()
        return `${[year, month, day].map(formatNumber).join('-')} ${[hour, minute, second].map(formatNumber).join(':')}`
    }
    const formateDate = str => {
        var date = new Date(str)
        const year = date.getFullYear()
        const month = date.getMonth() + 1
        const day = date.getDate()
        return `${[year, month, day].map(formatNumber).join('-')}`
    }
    const formatNumber = n => {
        n = n.toString()
        return n[1] ? n : `0${n}`
    }
    export default {
        shopId,
        key,
        region,
        start_date,
        isTest,
        isOffline,
        formateDate,
        formateDateTime
    }
</script>
