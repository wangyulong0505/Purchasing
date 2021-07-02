<template>
    <div class="container">
        <div class="sizex header">
            <span>采购推荐单--新增</span>
        </div>
        <div class="sizex split"></div>
        <div class="sizex toolbar">
            <el-button id="new" size="small" icon="el-icon-folder-add" @click="_New">
                <label>新建</label>
            </el-button>
            <el-button id="save" size="small" icon="el-icon-s-order" :disabled="isSave" @click="_SaveBeforeCheck">
                <label>保存</label>
            </el-button>
            <el-button id="approve" size="small" icon="el-icon-s-check" :disabled="isApprove" @click="_Approve">
                <label>审核</label>
            </el-button>
            <el-button id="delete" size="small" icon="el-icon-delete" :disabled="isApprove" @click="_Delete">
                <label>删单</label>
            </el-button>
            <el-button id="production" size="small" icon="el-icon-s-shop" :disabled="isApprove" @click="_Production">
                <label>商品</label>
            </el-button>
            <el-button id="print" size="small" icon="el-icon-printer" @click="_Print">
                <label>打印</label>
            </el-button>
            <el-button id="exit" size="small" icon="el-icon-switch-button" @click="Exit">
                <label>退出</label>
            </el-button>
        </div>
        <div class="sizex split"></div>
        <div id="printTest" ref="print" class="sizex from">
            <div class="master">
                <el-form :inline="true" :model="ruleMaster" size="small" ref="ruleMaster">
                    <el-row>
                        <el-form-item prop="sheet_no" label="单号：">
                            <label slot="label" style="letter-spacing:7px;">单号：</label>
                            <span class="text sheetNo">{{ ruleMaster.sheet_no }}</span>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item prop="oper_name" label="制单人：">
                            <el-input class="oper" v-model="ruleMaster.oper_id" disabled></el-input>
                        </el-form-item>
                        <el-form-item prop="checker_name" label="审核人：">
                            <el-input class="checker" v-model="ruleMaster.checker_name"></el-input>
                        </el-form-item>
                        <el-form-item prop="remark" label="备注：">
                            <el-input class="remark" v-model="ruleMaster.memo"></el-input>
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
                    max-height="721"
                    height="516"
                    width="100%"
                    :data="ruleDetail.dataList" 
                    :header-cell-style="headerCellStyle"
                    :cell-style="cellStyle" 
                    :row-class-name="rowClassName" 
                    highlight-current-row 
                    @cell-click="tabClick">
                        <el-table-column prop="id" label="行号" type="index" width="55" :resizable="false"></el-table-column>
                        <el-table-column label="货号" width="140" :resizable="false">
                            <template slot-scope="scope">{{ scope.row.item_no }}</template>
                        </el-table-column>
                        <el-table-column label="品名" width="280" :resizable="false">
                            <template slot-scope="scope">{{ scope.row.item_name }}</template>
                        </el-table-column>
                        <el-table-column label="自编码" width="140" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '自编码'">
                                <el-input ref='editInput' v-model="scope.row.item_subno" maxlength="15" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.item_subno }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="类别" width="140" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '类别'">
                                <el-input v-model="scope.row.item_clsno" maxlength="12" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.item_clsno }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="供应商" width="80" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '供应商'">
                                <el-input v-model="scope.row.supcust_no" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.supcust_no }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="经营方式" width="130" :resizable="false">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.sale_way" clearable size="mini">
                                    <el-option v-for="item in saleWays" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="课组" width="140" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '课组'">
                                <el-input v-model="scope.row.dept_clsno" maxlength="12" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.dept_clsno }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="进价" width="110" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '进价'">
                                <el-input-number :precision="4" :controls=false v-model="scope.row.price" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.price }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="零售价" width="110" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '零售价'">
                                <el-input-number :precision="4" :controls=false v-model="scope.row.sale_price" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.sale_price }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品类型" width="130" :resizable="false">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.combine_sta" clearable size="mini">
                                    <el-option v-for="item in combineStas" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="管理库存" width="80" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '管理库存'">
                                <el-input v-model="scope.row.item_stock" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <el-select v-model="scope.row.item_stock" clearable size="mini">
                                    <el-option v-for="item in itemStocks" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="商品状态" width="110" :resizable="false">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.status" clearable size="mini">
                                    <el-option v-for="item in itemStatus" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="品牌" width="140" :resizable="false">
                            <template slot-scope="scope">
                                <span v-if="scope.row.id === tabClickIndex && tabClickLabel === '品牌'">
                                <el-input v-model="scope.row.item_brand" size="mini" @blur="inputBlur(scope.row)" />
                                </span>
                                <span v-else>{{ scope.row.item_brand }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column label="采购范围" width="130" :resizable="false">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.direct" clearable size="mini">
                                    <el-option v-for="item in itemDirects" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column label="计价方式" width="130" :resizable="false">
                            <template slot-scope="scope">
                                <el-select v-model="scope.row.pricing" clearable size="mini">
                                    <el-option v-for="item in measureTypes" :key="item.value" :label="item.label" :value="item.value"></el-option>
                                </el-select>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="操作" width="60" v-if="seen">
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
import { SaveSheet, GetSheetNo, ApproveSheet, DeleteSheet } from '@/common/script/api'
import orderDialog from '@/common/components/order-dialog/order-dialog.vue'
export default {
    data() {
        return {
            // 保存按钮状态
            isSave: false,
            isApprove: false,
            seen: true,
            ruleMaster: {
                sheet_no: '',
                oper_id: localStorage.getItem('userName'),
                checker_name: '',
                memo: ''
            },
            ruleDetail: {
                dataList: []
            },
            dialogList: [], // 商品弹窗数据
            ItemTableVisible: false,
            currentRow: null,
            show: false,
            multipleSelection: [],
            genlist: [],
            tabClickIndex: null,
            tabClickLabel: '',
            // 计价方式
            measureTypes: [
                { 
                    value: "0",
                    label: '普通'
                }, 
                {
                    value: "1",
                    label: '计重'
                }, 
                {
                    value: "2",
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
            if (this.ruleDetail.dataList.length > 0) {
                this.canDelete = false
            }
        },
        _generateSheetNo() {
            this.$indicator.open('数据加载中')
            return GetSheetNo({
                shopId: this.$global.shopId,
                key: this.$global.key,
                isTest: this.$global.isTest,
                isOffline: this.$global.isOffline
            }).then((res) => {
                if (res.Code === 1 && res.Data.length > 0) {
                    this.ruleMaster.sheet_no = res.Data
                }
            }).then((res) => {
                setTimeout(() => {
                    this.$indicator.close()
                }, 1000)
            })
        },
        _New() {
            // 新建
            if (!this.isSave && this.ruleDetail.dataList.length > 0) {
                this.$messagebox.confirm('新增前是否保存本单据？').then((action) => {
                    this._SaveBeforeCheck()
                }, () => { 
                    this._resetForm()
                })
            } else {
                this._resetForm()
            }
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
                if (list[i].item_subno === "" || list[i].item_subno.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的自编码为空，请补充完整!')
                    return
                }
                if (list[i].item_clsno === "" || list[i].item_clsno.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的类别为空，请补充完整!')
                    return
                }
                if (list[i].supcust_no === "" || list[i].supcust_no.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的供应商为空，请补充完整!')
                    return
                }
                if (list[i].sale_way === "" || list[i].sale_way.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的经营方式为空，请补充完整!')
                    return
                }
                if (list[i].dept_clsno === "" || list[i].dept_clsno.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的课组为空，请补充完整!')
                    return
                }
                if (list[i].price === null) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的进价为空，请补充完整!')
                    return
                }
                if (list[i].price === 0) { 
                    zero = true 
                }
                if (list[i].sale_price === null) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的零售价为空，请补充完整!')
                    return
                }
                if (list[i].sale_price === 0) { 
                    zero = true 
                }
                if (list[i].combine_sta === "" || list[i].combine_sta.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的商品类型为空，请补充完整!')
                    return
                }
                if (list[i].item_stock === "" || list[i].item_stock.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的管理库存为空，请补充完整!')
                    return
                }
                if (list[i].status === "" || list[i].status.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的商品状态为空，请补充完整!')
                    return
                }
                if (list[i].item_brand === "" || list[i].item_brand.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的品牌为空，请补充完整!')
                    return
                }
                if (list[i].direct === "" || list[i].direct.length < 1) {
                    this.$toast('第[' + (i + 1) + ']行货号[' + list[i].item_no + ']的采购范围为空，请补充完整!')
                    return
                }
                if (list[i].pricing === "" || list[i].pricing.length < 1) {
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
                shopId: this.$global.shopId,
                key: this.$global.key,
                isTest: this.$global.isTest,
                isOffline: this.$global.isOffline,
                master: this.ruleMaster,
                detail: this.ruleDetail.dataList
            }).then((res) => {
                if (res.Data && res.Data.Result === 'Y') {
                    this.$toast('保存成功')
                    this.isSave = true
                    this.ruleMaster.oper_name = localStorage.getItem('userName')
                } else {
                    this.$messagebox({
                        title: '提示',
                        message: 'SaveSheet出错，出错原因：' + res.result.message
                    })
                }
            }).then(() => {
                setTimeout(() => {
                    this.$indicator.close()
                })
            })
        },
        _Production() {
            this.$router.push({
                path: "/List",
                query: {
                    sheet_no: this.ruleMaster.sheet_no
                }
            })
        },
        _Delete() {
            this.$messagebox.confirm('确认删除？').then((action) => {
                this.handlerDelete()
                this._resetForm()
            }, () => { 
            })
        },
        handlerDelete() {
            this.$indicator.open('数据处理中')
            return DeleteSheet({
                shopId: this.$global.shopId,
                key: this.$global.key,
                isTest: this.$global.isTest,
                isOffline: this.$global.isOffline,
                sheet_no: this.ruleMaster.sheet_no
            }).then((res) => {
                if (res.Code === 1 && res.Data.Result === 'Y') {
                    this.$toast('删除成功')
                } else {
                    // this.$toast(res.message)
                }
            }).then(() => {
                setTimeout(() => {
                    this.$indicator.close()
                })
            })
        },
        _Print() {
            this.$print(this.$refs.print)
        },
        Exit() {
            // 退出
        },
        _Approve() {
            if (this.isSave) {
                this.handlerApprove()
            } else {
                this._SaveBeforeCheck().then(val => {
                    this.handlerApprove()
                })
            }
        },
        handlerApprove() {
            this.$indicator.open('数据处理中')
            return ApproveSheet({
                shopId: this.$global.shopId,
                key: this.$global.key,
                isTest: this.$global.isTest,
                isOffline: this.$global.isOffline,
                sheet_no: this.ruleMaster.sheet_no,
                oper_id: this.ruleMaster.oper_id
            }).then((res) => {
                console.log(res)
                if (res.Code === 1 && res.Data) {
                    if (res.Data.Result === 'Y') {
                        this.$toast(res.Data.Message)
                        this.isApprove = true
                        this.seen = false
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
        _OkItems() {
            // 返回选中的商品信息
            if (this.genlist.length > 0) {
                
            }
            this.ItemTableVisible = false
        },
        _OkSheet() {
            // 打开选中的采购推荐单
            this.SheetTableVisible = false
        },
        rowClassName({row, rowIndex}) {
            // 把每一行的索引放进row.id
            row.id = rowIndex + 1
        },
        handleSelectionChange(val) {
            this.multipleSelection = val
            let arr = []
            for (let i = 0; i < val.length; i++) {
                let item = {
                    item_no: val[i].Item_No,
                    item_name: val[i].Item_Name,
                    item_subno: '',
                    item_clsno: '',
                    supcust_no: '',
                    sale_way: '',
                    dept_clsno: '',
                    price: null,
                    sale_price: null,
                    combine_sta: '',
                    item_stock: '',
                    status: '',
                    item_brand: '',
                    direct: '',
                    pricing: ''
                }
                arr.push(item)
            }
            this.genlist = [...arr]
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
            this.isApprove = false
            this._generateSheetNo()
        },
        handleCurrentChange(val) {
            this.currentRow = val
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
    components: {
        orderDialog
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
        if (this.$route.query.master) {
            this.ruleMaster.sheet_no = this.$route.query.master.Sheet_No
            this.ruleMaster.oper_id = this.$route.query.master.Oper_Id
            this.ruleMaster.checker_name = this.$route.query.master.Confirm_Man
            this.ruleMaster.memo = this.$route.query.master.Memo
        } else if (this.$route.query.sheet_no) {
            this.ruleMaster.sheet_no = this.$route.query.sheet_no
        } else {
            this._generateSheetNo()
        }
        
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
            width: 120px;
        }
        .checker {
            width: 120px;
        }
        .remark {
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
.el-dialog__header {
    padding: 5px 5px 5px;
}
.el-dialog__headerbtn {
    top: 10px;
    right: 10px;
}
.el-dialog__body {
    padding: 0px;
}
.el-dialog__footer {
    padding: 10px 15px 10px;
}
</style>