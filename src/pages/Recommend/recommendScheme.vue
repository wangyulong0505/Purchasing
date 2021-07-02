<template>
    <div class="container">
        <div class="sizex header">
            <span>采购推荐单--列表</span>
        </div>
        <div class="sizex split"></div>
        <div class="sizex toolbar">
            <el-button id="new" size="small" icon="el-icon-folder-add" @click="_New">
                <label>新建</label>
            </el-button>
            <el-button id="open" size="small" icon="el-icon-folder-checked" @click="_Modify">
                <label>修改</label>
            </el-button>
            <el-button id="delete" size="small" icon="el-icon-delete" :disabled="isApprove" @click="_Delete">
                <label>删单</label>
            </el-button>
            <el-button id="approve" size="small" icon="el-icon-s-check" :disabled="isApprove" @click="_Approve">
                <label>审核</label>
            </el-button>
            <el-button id="print" size="small" icon="el-icon-printer" @click="_Print">
                <label>打印</label>
            </el-button>
            <el-button id="exit" size="small" icon="el-icon-switch-button" @click="Exit">
                <label>退出</label>
            </el-button>
        </div>
        <div class="sizex split"></div>
        <div class="sizex from" ref="print">
            <div class="master">
                <el-form :inline="true" :model="ruleMaster" size="small" ref="ruleMaster">
                    <el-row>
                        <el-form-item prop="beginDate" label="开始时间：">
                            <el-date-picker class="date" v-model="ruleMaster.beginDate" align="right" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                        <el-form-item prop="endDate" label="结束时间：">
                            <el-date-picker class="date" v-model="ruleMaster.endDate" align="right" type="date" placeholder="选择日期" value-format="yyyy-MM-dd" :picker-options="pickerOptions"></el-date-picker>
                        </el-form-item>
                        <el-form-item prop="oper_id" label="制单人：">
                            <label slot="label" style="letter-spacing:3.5px;">制单人：</label>
                            <el-input class="oper_id" v-model="ruleMaster.oper_id"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item prop="approve_flag" label="审核状态：">
                            <el-select v-model="ruleMaster.approve_flag" placeholder="请选择">
                                <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                        <el-form-item prop="confirm_man" label="审核人：">
                            <label slot="label" style="letter-spacing:3.5px;">审核人：</label>
                            <el-input class="oper" v-model="ruleMaster.confirm_man"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item prop="sheet_no" label="单据号：">
                            <label slot="label" style="letter-spacing:3.5px;">单据号：</label>
                            <el-input class="bill" v-model="ruleMaster.sheet_no"></el-input>
                        </el-form-item>
                        <el-button style="margin-top: 6px;" type="primary" size="small" icon="el-icon-search" @click="queryDetailData">查询</el-button>
                    </el-row>
                </el-form>
            </div>
            <div class="split"></div>
            <div class="detail">
                <el-form :inline="true" :model="ruleDetail" size="small" ref="ruleDetail">
                    <el-table 
                    :border="true"
                    stripe 
                    max-height="720"
                    height="516"
                    width="100%"
                    :data="ruleDetail.dataList" 
                    :header-cell-style="headerCellStyle"
                    :cell-style="cellStyle" 
                    :row-class-name="rowClassName" 
                    highlight-current-row
                    @current-change="handleCurrentChange"
                    @cell-click="tabClick">
                        <el-table-column prop="id" label="行号" min-width="5%" :resizable="false"></el-table-column>
                        <el-table-column label="单据号" min-width="20%" :resizable="false">
                            <template slot-scope="scope">{{ scope.row.Sheet_No }}</template>
                        </el-table-column>
                        <el-table-column label="制单日期" min-width="10%" :resizable="false">
                            <template slot-scope="scope">{{ scope.row.Oper_Date }}</template>
                        </el-table-column>
                        <el-table-column label="制单人" min-width="10%" :resizable="false">
                            <template slot-scope="scope">{{ scope.row.Oper_Id }}</template>
                        </el-table-column>
                        <el-table-column label="审核状态" min-width="10%" :resizable="false">
                            <template slot-scope="scope">{{ scope.row.Approve_Flag == '0' ? '未审核' : '已审核'}}</template>
                        </el-table-column>
                        <el-table-column label="审核人" min-width="10%" :resizable="false">
                            <template slot-scope="scope">{{ scope.row.Confirm_Man }}</template>
                        </el-table-column>
                        <el-table-column label="单据商品" min-width="25%" :resizable="false">
                            <template slot-scope="scope">{{ scope.row.Detail }}</template>
                        </el-table-column>
                        <el-table-column label="操作" min-width="10%" :resizable="false">
                            <template slot-scope="scope">
                                <el-button @click="handleClick(scope.row)" type="text" size="small">查看详情</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import { DeleteSheet, QuerySheetMaster, ApproveSheet, GetSheetMaster, ListSheetDetail } from '@/common/script/api'
export default {
    data() {
        return {
            isApprove: false,
            ruleMaster: {
                sheet_no: '',
                approve_flag: '',
                oper_id: '',
                confirm_man: '',
                beginDate: '',
                endDate: ''
            },
            ruleDetail: {
                dataList: []
            },
            options: [{
                value: '',
                label: '全部'
            },
            {
                value: '0',
                label: '未审核'
            }, {
                value: '1',
                label: '已审核'
            }],
            tabClickIndex: null,
            tabClickLabel: '',
            pickerOptions: {
                disabledDate(time) {
                    // return time.getTime() > Date.now()
                },
                shortcuts: [{
                    text: '今天',
                    onClick(picker) {
                        picker.$emit('pick', new Date())
                    }
                }, {
                    text: '昨天',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24)
                        picker.$emit('pick', date)
                    }
                }, {
                    text: '一周前',
                    onClick(picker) {
                        const date = new Date()
                        date.setTime(date.getTime() - 3600 * 1000 * 24 * 7)
                        picker.$emit('pick', date)
                    }
                }]
            },
            currentRow: null,
            genlist: [],
            masterData: null
        }
    },
    methods: {
        handleClick(row) {
            this.$indicator.open('数据加载中')
            GetSheetMaster({
                ShopId: this.$global.shopId,
                Key: this.$global.key,
                IsTest: this.$global.isTest,
                IsOffline: this.$global.isOffline,
                Sheet_No: row.Sheet_No
            }).then((res) => {
                if (res.Data) {
                    this.masterData = res.Data
                    ListSheetDetail({
                        ShopId: this.$global.shopId,
                        Key: this.$global.key,
                        IsTest: this.$global.isTest,
                        IsOffline: this.$global.isOffline,
                        Sheet_No: row.Sheet_No
                    }).then((res) => {
                        if (res.Data && res.Data.length > 0) {
                            let arr = []
                            for (let item of res.Data) {
                                let temp = {
                                    item_no: item.Item_No,
                                    item_name: item.Item_Name,
                                    item_subno: item.Item_SubNo,
                                    item_clsno: item.Item_ClsNo,
                                    supcust_no: item.Supcust_No,
                                    sale_way: item.Sale_Way,
                                    dept_clsno: item.Dept_ClsNo,
                                    price: item.Price,
                                    sale_price: item.Sale_Price,
                                    combine_sta: item.Combine_Sta,
                                    item_stock: item.Item_Stock,
                                    status: item.Status,
                                    item_brand: item.Item_Brand,
                                    direct: item.Direct,
                                    pricing: item.Pricing
                                }
                                arr.push(temp)
                            }
                            this.genlist = [...arr]
                            this.$router.push({
                                path: "/Add",
                                query: {
                                    selectList: this.genlist,
                                    master: this.masterData,
                                    sheet_no: row.Sheet_No
                                }
                            })
                        }
                    })
                }
            }).then((res) => {
                setTimeout(() => {
                    this.$indicator.close()
                }, 1000)
            })
        },
        handleCurrentChange(val) {
            console.log(val)
            this.currentRow = val
            if (this.currentRow.Approve_Flag === "1") {
                this.isApprove = true
            } else {
                this.isApprove = false
            }
        },
        getSelectList() {
            //
        },
        queryDetailData() {
            this.$indicator.open('数据加载中')
            return QuerySheetMaster({
                ShopId: this.$global.shopId,
                Key: this.$global.key,
                IsTest: this.$global.isTest,
                IsOffline: this.$global.isOffline,
                Sheet_No: this.ruleMaster.sheet_no,
                Oper_Id: this.ruleMaster.oper_id,
                Confirm_Man: this.ruleMaster.confirm_name,
                Begin_Date: this.ruleMaster.beginDate,
                End_Date: this.ruleMaster.endDate,
                Approve_Flag: this.ruleMaster.approve_flag === '' ? '%' : this.ruleMaster.approve_flag
            }).then((res) => {
                if (res.Data && res.Data.length > 0) {
                    for (let item of res.Data) {
                        item.Oper_Date = this.$global.formateDate(item.Oper_Date)
                    }
                    this.ruleDetail.dataList = res.Data
                }
            }).then((res) => {
                setTimeout(() => {
                    this.$indicator.close()
                }, 1000)
            })
        },
        _New() {
            this.$router.push({
                path: "/Add",
                query: {
                    selectList: [],
                    info: {},
                    sheet_no: ''
                }
            })
        },
        _Modify() {
            // 获取master和detail的值
            this.$indicator.open('数据加载中')
            GetSheetMaster({
                ShopId: this.$global.shopId,
                Key: this.$global.key,
                IsTest: this.$global.isTest,
                IsOffline: this.$global.isOffline,
                Sheet_No: this.currentRow.Sheet_No
            }).then((res) => {
                if (res.Data) {
                    this.masterData = res.Data
                    ListSheetDetail({
                        ShopId: this.$global.shopId,
                        Key: this.$global.key,
                        IsTest: this.$global.isTest,
                        IsOffline: this.$global.isOffline,
                        Sheet_No: this.currentRow.Sheet_No
                    }).then((res) => {
                        if (res.Data && res.Data.length > 0) {
                            let arr = []
                            for (let item of res.Data) {
                                let temp = {
                                    item_no: item.Item_No,
                                    item_name: item.Item_Name,
                                    item_subno: item.Item_SubNo,
                                    item_clsno: item.Item_ClsNo,
                                    supcust_no: item.Supcust_No,
                                    sale_way: item.Sale_Way,
                                    dept_clsno: item.Dept_ClsNo,
                                    price: item.Price,
                                    sale_price: item.Sale_Price,
                                    combine_sta: item.Combine_Sta,
                                    item_stock: item.Item_Stock,
                                    status: item.Status,
                                    item_brand: item.Item_Brand,
                                    direct: item.Direct,
                                    pricing: item.Pricing
                                }
                                arr.push(temp)
                            }
                            this.genlist = [...arr]
                            this.$router.push({
                                path: "/Add",
                                query: {
                                    selectList: this.genlist,
                                    master: this.masterData,
                                    sheet_no: this.currentRow.Sheet_No
                                }
                            })
                        }
                    })
                }
            }).then((res) => {
                setTimeout(() => {
                    this.$indicator.close()
                }, 1000)
            })
        },
        _Delete() {
            this.$messagebox.confirm('是否确认删除当前单据?').then((action) => {
                this.$indicator.open('处理中,请稍候')
                return DeleteSheet({
                    shopId: this.$global.shopId,
                    key: this.$global.key,
                    isTest: this.$global.isTest,
                    isOffline: this.$global.isOffline,
                    sheet_no: this.currentRow.Sheet_No
                }).then((res) => {
                    if (res.success) {
                        this.$toast('删除成功')
                        this.queryDetailData()
                    } else {
                        this.$messagebox({
                            title: '提示',
                            message: 'DeleteSheet出错，出错原因：' + res.result.message
                        })
                    }
                }).then(() => {
                    this.$indicator.close()
                })
            }, () => {})
        },
        _Approve() {
            this.$indicator.open('数据处理中')
            return ApproveSheet({
                shopId: this.$global.shopId,
                key: this.$global.key,
                isTest: this.$global.isTest,
                isOffline: this.$global.isOffline,
                sheet_no: this.currentRow.Sheet_No,
                oper_id: this.currentRow.Oper_Id
            }).then((res) => {
                if (res.Code === 1 && res.Data) {
                    if (res.Data.Result === 'Y') {
                        this.$toast(res.Data.Message)
                        this.isApprove = true
                    } else {
                        this.$toast(res.Data.Message)
                    }
                } else {
                    console.log(res)
                }
            }).then(() => {
                setTimeout(() => {
                    this.$indicator.close()
                })
            })
        },
        _Print() {
            // printJS('print', 'pdf')
            this.$print(this.$refs.print)
        },
        Exit() {
            // 退出
        },
        rowClassName({row, rowIndex}) {
            // 把每一行的索引放进row.id
            row.id = rowIndex + 1
        },
        // 表头样式
        headerCellStyle({row, rowIndex}) {
            if (rowIndex === 0) {
                return "text-align: center;padding: 2px 0; background-color:#f2f2f2"
            }
        },
        cellStyle({row, column, rowIndex, columnIndex}) {
            if (columnIndex === 8 || columnIndex === 9) {
                return "text-align: right;padding: 2px 0"
            } else {
                return "text-align: center;padding: 2px 0"
            }
        },
        tabClick (row, column, cell, event) {
            switch (column.label) {
                case '行号': 
                case '货号': 
                case '品名':
                case '经营方式':
                case '计价方式':
                    break
                default: 
                    this.tabClickIndex = row.id
                    this.tabClickLabel = column.label
            }
        },
        inputBlur (row) {
            this.tabClickIndex = null
        }
    },
    computed: {
    },
    watch: {   
    },
    created() {
        this.getSelectList()
    }
}
</script>
<style lang="scss" scoped>
.container {
    min-height: 100vh;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-color:#eeeef5;
}
.sizex {
    width:80%;
    margin-left: 10%;
}
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
.toolbar {
    background-color:#f2f2f2;
    height:50px;
    padding: 5px 5px;
    align-items: center;
    font-size: 13px;
    button {
        float: left;
        padding: 5px 15px;
        label {
            display: flex;
            margin-top: 5px;
        }
    }
    #exit {
        float: right;
    }
    #ok {
        float: none;
    }
    .f-row {
        margin: 5px 0 0 5px;
    }
    .query {
        width: 76%;
    }
}
.from {
    background-color: #f2f2f2;
    height: 600px;
    .master {
        height: 22%;
        .text {
            font-size: 14px;
            color: #444;
            flex: 1;
            &.sheetNo {
                color: #333;
                font-weight: bold;
            }
        }
        .el-row {
            margin-left: 25px;
            margin-top: 5px;
        }
        .el-form-item--small,.el-form-item {
            margin-bottom: 0px;
            margin-top: 5px;
        }
        .oper {
            width: 215px;
        }
        .bill {
            width: 836px;
        }
        .oper_id {
            width: 215px;
        }
    }
    .detail {
        height: 86%;
        background-color: white;
    }
}
.sheet {
    width: 75%;
}

</style>
<style lang="scss">
.container {
    min-height: 100vh;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    -o-background-size: cover;
    background-size: cover;
    background-color:#eeeef5;
}
.sizex {
    width:80%;
    margin-left: 10%;
}
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
.toolbar {
    background-color:#f2f2f2;
    height:50px;
    padding: 5px 5px;
    align-items: center;
    font-size: 13px;
    button {
        float: left;
        padding: 5px 15px;
        label {
            display: flex;
            margin-top: 5px;
        }
    }
    #exit {
        float: right;
    }
}
.from {
    background-color: #f2f2f2;
    height: 600px;
    .master {
        height: 12%;
        .text {
            font-size: 14px;
            color: #444;
            flex: 1;
            &.sheetNo {
                color: #333;
                font-weight: bold;
            }
        }
        .el-row {
            margin-left: 32px;
        }
        .el-form-item--small,.el-form-item {
            margin-bottom: 0px;
        }
        .oper {
            width: 80px;
        }
        .oper_id {
            width: 270px;
        }
        .date {
            width: 215px;
        }
    }
    .detail {
        height: 63%;
        background-color: white;
    }
}
</style>