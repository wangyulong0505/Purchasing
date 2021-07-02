<template>
    <div class="container">
        <div class="sizex header">
            <span>采购推荐单--详细</span>
        </div>
        <div class="sizex split"></div>
        <div class="sizex toolbar">
            <el-button id="new" size="small" icon="el-icon-folder-add" @click="_New">
                <label>新建</label>
            </el-button>
            <el-button id="save" size="small" icon="el-icon-s-order" :disabled="isSave" @click="_SaveBeforeCheck()">
                <label>保存</label>
            </el-button>
            <el-button id="approve" size="small" icon="el-icon-s-check" :disabled="isApprove" @click="_Approve">
                <label>审核</label>
            </el-button>
            <el-button id="delete" size="small" icon="el-icon-delete" @click="_Delete">
                <label>删单</label>
            </el-button>
            <el-button id="item" size="small" icon="el-icon-s-shop" @click="_Items">
                <label>商品</label>
            </el-button>
            <el-button id="print" size="small" icon="el-icon-folder-opened" @click="_Print">
                <label>打印</label>
            </el-button>
            <el-button id="exit" size="small" icon="el-icon-switch-button" @click="Exit">
                <label>退出</label>
            </el-button>
        </div>
        <div class="sizex split"></div>
        <div class="sizex from">
            <div class="master">
                <el-form :inline="true" :model="ruleMaster" size="small" ref="ruleMaster">
                    <el-row>
                        <el-form-item prop="sheet_no" label="单号："><span class="text sheetNo">{{ ruleMaster.sheet_no }}</span></el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item prop="oper_name" label="制单人：">
                            <el-input class="oper" v-model="ruleMaster.oper_name" disabled ></el-input>
                        </el-form-item>
                        <el-form-item prop="confirm_name" label="审核人：">
                            <el-input class="oper" v-model="ruleMaster.confirm_name" disabled></el-input>
                        </el-form-item>
                        <el-form-item prop="memo" label="备注：">
                            <el-input class="memo" v-model="ruleMaster.memo"></el-input>
                        </el-form-item>
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
                    @cell-click="tabClick">
                        <el-table-column prop="id" label="行号" width="55" :resizable="false"></el-table-column>
                        <el-table-column label="货号" width="140" :resizable="false">
                            <template slot-scope="scope">{{ scope.row.item_no }}</template>
                        </el-table-column>
                        <el-table-column label="品名" width="280" :resizable="false">
                            <template slot-scope="scope">{{ scope.row.item_name }}</template>
                        </el-table-column>
                        <el-table-column label="自编码" width="140" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '自编码'">
                                <el-input ref='editInput' v-model="scope.row.itemSubNo" maxlength="15" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.itemSubNo }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="类别" width="140" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '类别'">
                                <el-input v-model="scope.row.itemClsName" maxlength="12" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.itemClsName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="供应商" width="80" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '供应商'">
                                <el-input v-model="scope.row.supcustName" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.supcustName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="经营方式" width="130" :resizable="false">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.saleWay" clearable size="mini">
                                    <el-option v-for="item in saleWays" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="课组" width="140" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '课组'">
                                <el-input v-model="scope.row.deptName" maxlength="12" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.deptName }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="进价" width="110" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '进价'">
                                <el-input-number :precision="4" :controls=false v-model="scope.row.inPrice" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.inPrice }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="零售价" width="110" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '零售价'">
                                <el-input-number :precision="4" :controls=false v-model="scope.row.salePrice" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.salePrice }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品类型" width="130" :resizable="false">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.combineSta" clearable size="mini">
                                    <el-option v-for="item in combineStas" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="管理库存" width="80" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '管理库存'">
                                <el-input v-model="scope.row.itemStock" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <el-select v-model="scope.row.itemStock" clearable size="mini">
                                    <el-option v-for="item in itemStocks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品状态" width="110" :resizable="false">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.itemStatu" clearable size="mini">
                                    <el-option v-for="item in itemStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="品牌" width="140" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '品牌'">
                                <el-input v-model="scope.row.itemBrand" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.itemBrand }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购范围" width="130" :resizable="false">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.itemDirect" clearable size="mini">
                                    <el-option v-for="item in itemDirects" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="计价方式" width="130" :resizable="false">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.measureType" clearable size="mini">
                                    <el-option v-for="item in measureTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="60">
                            <template slot-scope="scope">
                                <el-button @click="deleteRow(scope.$index, ruleDetail.dataList)" type="text" size="small">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-form>
            </div>
        </div>
    </div>
</template>
<script>
import { SaveSheet, DeleteSheet } from '@/common/script/api'
export default {
    data() {
        return {
            // 保存按钮状态
            isSave: true,
            isApprove: true,
            sheetNo: '',
            ruleMaster: {
                sheet_no: '', // 单号
                approve_flag: false, // 审核标识
                oper_id: '', // 制单人id
                oper_name: '', // 制单人
                confirm_man: '', // 审核人id
                confirm_name: '', // 审核人
                memo: '' // 备注
            },
            ruleDetail: {
                dataList: []
            },
            tabClickIndex: null,
            tabClickLabel: '',
            // 计价方式
            measureTypes: [
                { 
                    value: '0',
                    label: '普通'
                }, 
                {
                    value: '1',
                    label: '计重'
                }, 
                {
                    value: '2',
                    label: '计数'
                }
            ],
            // 经营方式
            saleWays: [
                {
                    value: 'A',
                    label: '购销'
                },
                {
                    value: 'B',
                    label: '代销'
                },
                {
                    value: 'C',
                    label: '联营'
                },
                {
                    value: 'D',
                    label: '租赁'
                },
                {
                    value: 'E',
                    label: '自产'
                },
                {
                    value: 'F',
                    label: '扣率代销'
                }
            ],
            // 采购范围
            itemDirects: [
                {
                    value: '0',
                    label: '统配'
                },
                {
                    value: '1',
                    label: '自采'
                },
                {
                    value: '2',
                    label: '不限'
                },
                {
                    value: '3',
                    label: '直配'
                },
                {
                    value: '4',
                    label: '自产'
                }
            ],
            // 商品类型
            combineStas: [
                {
                    value: '0',
                    label: '普通'
                },
                {
                    value: '1',
                    label: '捆绑商品'
                },
                {
                    value: '2',
                    label: '制单拆分'
                },
                {
                    value: '3',
                    label: '制单组合'
                },
                {
                    value: '6',
                    label: '自动转货'
                },
                {
                    value: '7',
                    label: '自动加工'
                }
            ],
            // 商品状态
            itemStatus: [
                {
                    value: '0',
                    label: '建档'
                },
                {
                    value: '1',
                    label: '新品'
                },
                {
                    value: '2',
                    label: '正常'
                },
                {
                    value: '3',
                    label: '停购'
                },
                {
                    value: '4',
                    label: '停售'
                },
                {
                    value: '5',
                    label: '淘汰'
                },
                {
                    value: '6',
                    label: '已删除'
                }
            ],
            // 管理库存
            itemStocks: [
                {
                    value: '0',
                    label: '是'
                },
                {
                    value: '1',
                    label: '否'
                }
            ]
        }
    },
    methods: {
        getSelectList() {
            this.ruleDetail.dataList = this.$route.query.selectList
        },
        _New() {
            // 新建
            if (this.isChange) {
                this.$messagebox.confirm('新增前是否保存本单据？').then((action) => {
                    this._SaveBeforeCheck()
                }, () => { 
                    this._resetForm()
                })
            } else {
                this._resetForm()
            }
        },
        _Print() {
            // 打印
        },
        _SaveBeforeCheck() {
            // 保存前检查
            let list = this.ruleDetail.dataList
            let zero = false
            if (list.length <= 0) {
                this.$toast('单据明细不能为空,请录入单据明细信息!')
                return
            }
            for (let i = 0; i < list.length; i++) {
                if (list[i].itemSubNo === "" || list[i].itemSubNo.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的自编码为空，请补充完整!')
                    return
                }
                if (list[i].itemClsName === "" || list[i].itemClsName.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的类别为空，请补充完整!')
                    return
                }
                if (list[i].supcustName === "" || list[i].supcustName.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的供应商为空，请补充完整!')
                    return
                }
                if (list[i].saleWay === "" || list[i].saleWay.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的经营方式为空，请补充完整!')
                    return
                }
                if (list[i].deptName === "" || list[i].deptName.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的课组为空，请补充完整!')
                    return
                }
                if (list[i].inPrice === null) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的进价为空，请补充完整!')
                    return
                }
                if (list[i].inPrice === 0) { 
                    zero = true 
                }
                if (list[i].salePrice === null) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的零售价为空，请补充完整!')
                    return
                }
                if (list[i].salePrice === 0) { 
                    zero = true 
                }
                if (list[i].combineSta === "" || list[i].combineSta.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的商品类型为空，请补充完整!')
                    return
                }
                if (list[i].itemStock === "" || list[i].itemStock.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的管理库存为空，请补充完整!')
                    return
                }
                if (list[i].itemStatu === "" || list[i].itemStatu.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的商品状态为空，请补充完整!')
                    return
                }
                if (list[i].itemBrand === "" || list[i].itemBrand.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的品牌为空，请补充完整!')
                    return
                }
                if (list[i].itemDirect === "" || list[i].itemDirect.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的采购范围为空，请补充完整!')
                    return
                }
                if (list[i].measureType === "" || list[i].measureType.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的计价方式为空，请补充完整!')
                    return
                }
            }
            if (zero) {
                this.$messagebox.confirm('存在进价或零售价为零的商品，是否继续保存？').then((action) => {
                    this._Save()
                }, () => {})
            } else {
                this._Save()
            }
        },
        _Save() {
            // 保存
            this.$indicator.open('数据处理中')
            return SaveSheet({
                master: this.ruleMaster,
                detail: this.ruleDetail.dataList
            }).then((res) => {
                if (res.success) {
                    this.$toast('保存成功')
                    this.$router.replace({
                        path: '/GenPODetail',
                        query: {
                            sheet_no: res.master.sheet_no
                        }
                    })
                } else {
                    this.$messagebox({
                        title: '提示',
                        message: res.message
                    })
                }
            }).then(() => {
                setTimeout(() => {
                    this.$indicator.close()
                })
            })
        },
        _Approve() {
            // 审核
        },
        _DeleteBeforeCheck() {
            // 删除前检查
            if (this.ruleMaster.sheet_no === "" || this.ruleMaster.sheet_no === null) {
                this.$toast('当前单据未保存，无需删除!')
                return
            }
            if (this.ruleMaster.approve_flag) {
                this.$toast('该单据已审核，不能删除!')
                return
            }
            this.$messagebox.confirm('是否确认删除当前单据?').then((action) => {
                this._Delete()
            }, () => {})
        },
        _Delete() {
            // 删单
            this.$indicator.open('处理中,请稍候')
            DeleteSheet({
                sheetNoList: [this.sheetNo]
            }).then((res) => {
                this.$indicator.close()
                if (res.success) {
                    this.$router.back()
                    this.$toast('删除成功')
                } else {
                    this.$messagebox({
                        title: '提示',
                        message: res.message
                    })
                }
            }).then(() => {
                this.$indicator.close()
            })
        },
        _Items() {
            // 商品
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
        },
        // 重置表单
        _resetForm () {
            // 表头
            this.$refs['ruleMaster'].resetFields()
            // 明细
            let list = []
            this.ruleDetail = {
                dataList: list
            }
        },
        deleteRow (index, rows) {
            rows.splice(index, 1)
        }
    },
    computed: {
        isChange() {
            return this.ruleDetail.dataList.length > 0
        }
    },
    watch: {
        // 监测明细变化
        ruleDetail: {
            handler() {
                this.isSave = false 
            },
            deep: true
        },
        // 监听备注变化
        "ruleMaster.memo"(newVal, oldVal) {
            this.isSave = false
        }
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
    .btnQuery {
        padding: 9px 10px;
        margin-left: 5px;
        float: none;
    }
}
.from {
    background-color: #f2f2f2;
    height: 600px;
    .master {
        height: 14%;
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
            width: 80px;
        }
        .memo {
            width: 270px;
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
        .memo {
            width: 270px;
        }
    }
    .detail {
        height: 63%;
        background-color: white;
    }
}
</style>