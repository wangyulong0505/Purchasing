<template>
    <div>
        <el-dialog class="dlgSheet" title="采购推荐单-单据列表" 
        :visible.sync="visible" @close="$emit('update:show', false)" :show="show" :close-on-click-modal = false>
            <div class="header">
                <span>查询条件</span>
            </div>
            <div class="split"></div>
            <div class="filter">
                <div class="f-row">
                    <span>日期范围：</span>
                    <el-date-picker v-model="queryBDate" size="mini" type="date" placeholder="选择日期" style="width:125px;"/>
                    <span>至</span>
                    <el-date-picker v-model="queryEDate" size="mini" type="date" placeholder="选择日期" style="width:125px;"/>
                    <span style="margin-left: 3px;">制单人：</span>
                    <el-input size="mini" style="width:100px;" v-model="queryOper" clearable></el-input>
                    <span style="margin-left: 3px;">审核人：</span>
                    <el-input size="mini" style="width:100px;" v-model="queryConfirm" clearable></el-input>
                </div>
                <div class="f-row">
                    <span>审核状态：</span>
                    <el-select v-model="queryStatus" size="mini" placeholder="请选择" style="width:90px;" clearable>
                        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"/>
                    </el-select>
                </div>
                <div class="f-row">
                    <span>单&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;号：</span>
                    <el-input class="query" v-model="querySheetNo" size="mini" clearable />
                    <el-button class="btnQuery" type="primary" size="mini" icon="el-icon-search" @click="_searchList()">查询</el-button>
                </div>
            </div>
            <div class="split"></div>
            <div class="sheet-list">
                <!-- 差个表格 -->
            </div>
        </el-dialog>
    </div>
</template>
<script>
import { QuerySheetNoList } from '@/common/script/api'
export default {
    data () {
        return {
            visible: this.show,
            // 日期条件
            queryBDate: '',
            queryEDate: '',
            // 制单人条件
            queryOper: '',
            // 审核状态条件
            queryStatus: '-1',
            // 审核人
            queryConfirm: '',
            // 单号
            querySheetNo: '',
            options: [
                {
                    value: '-1',
                    label: '全部'
                },
                {
                    value: '0',
                    label: '未审核'
                },
                {
                    value: '1',
                    label: '已审核'
                }
            ],
            lists: []
        }
    },
    methods: {
        // 获取订单列表
        _getList(params) {
            this.$indicator.open('数据加载中，请稍后')
            QuerySheetNoList(params).then((res) => {
                if (res.success) {
                this.lists = res.rows
                }
            }).then(() => {
                setTimeout(() => {
                this.$indicator.close()
                }, 1000)
                this.loaded = true
            })
        },
        // 条件查询订单
        _searchList() {
            let params = {
                begin_date: this.queryBDate,
                end_date: this.queryEDate,
                oper_id: this.queryOper,
                confirm_man: this.queryConfirm,
                approve_flag: this.queryStatus === "-1" ? "" : this.queryStatus,
                sheet_no: this.querySheetNo
            }
            this._getList(params)
        }
    },
    props: {
        show: {
            type: Boolean,
            default: false
        }
    },
    watch: {
        show () {
            this.visible = this.show
        }
    },
    created() {
        var now = new Date()
        var year = now.getFullYear()
        var month = now.getMonth()
        var day = now.getDate()
        month = month.toString().padStart(2, "0")
        this.queryBDate = year + '-' + month + '-' + day

        year = now.getFullYear()
        month = now.getMonth() + 1
        day = now.getDate()
        this.queryEDate = year + '-' + month + '-' + day
    }
}
</script>
<style lang="scss" scoped>
.header {
    background-color:#bcbcbc;
    height:30px;
    padding-left:5px;
    display: flex;
    align-items: center;
    font-size: 13px;
    color: white;
}
.split {
    height:2px;
    background-color:white;
}
.filter {
    .f-row {
        margin: 5px 0 0 5px;
    }
    .query {
        width: 76%;
    }
    .btnQuery {
        padding: 9px 10px;
        margin-left: 5px;
    }
}
</style>