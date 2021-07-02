<template>
  <div class="container">
    <div class="sizex header">
      <span>采购推荐单--列表</span>
    </div>
    <div class="sizex split"></div>
    <div class="sizex filter">
        <span class="queryText">商品货号：</span>
        <el-input v-model="queryKeyCode" size="small" style="width: auto" placeholder="请输入商品货号" prefix-icon="el-icon-search" clearable />
        <el-button class="btnQuery" type="primary" size="small" icon="el-icon-search" @click="btnSearch">查询</el-button>
    </div>
    <div class="sizex split"></div>
    <div class="sizex grid">
      <el-table
        ref="multipleTable"
        :border="true"
        stripe
        max-height="574"
        width="100%"
        :data="tableData"
        :header-cell-style="headerCellStyle"
        :cell-style="cellStyle"
        @selection-change="handleSelectionChange"
        :row-class-name="rowClassName"
        highlight-current-row>
        <el-table-column type="selection" min-width="4%"></el-table-column>
        <el-table-column prop="id" label="行号" min-width="5%" :resizable="false"></el-table-column>
        <el-table-column label="货号" min-width="13%" :resizable="false">
          <template slot-scope="scope">{{ scope.row.Item_No }}</template>
        </el-table-column>
        <el-table-column label="商品名称" min-width="33%" :resizable="false">
          <template slot-scope="scope">{{ scope.row.Item_Name }}</template>
        </el-table-column>
        <el-table-column label="热销排名" min-width="8%" :resizable="false">
            <template slot-scope="scope">
            <span v-if="scope.row.Item_Top == 1" style="color:#FF6600">第1名</span>
            <span v-else-if="scope.row.Item_Top == 2" style="color: #FF9933">第2名</span>
            <span v-else-if="scope.row.Item_Top == 3" style="color: #33CCFF">第3名</span>
            <span v-else style="color: #606266">第{{ scope.row.Item_Top }}名</span>
          </template>
        </el-table-column>
        <el-table-column label="销售量" min-width="12%" :resizable="false">
          <template slot-scope="scope">{{ scope.row.Pos_Qty | __amtFixed2 }}</template>
        </el-table-column>
        <el-table-column label="销售额(元)" min-width="12%" :resizable="false">
          <template slot-scope="scope">{{ scope.row.Pos_Amt | __amtFixed2 }}</template>
        </el-table-column>
        <el-table-column label="当前状态" min-width="13%" :resizable="false">
          <template slot-scope="scope">{{scope.row.Item_Status == '0' ? '未进货' : '已进货'}}</template>
          <template slot-scope="scope">
            <span v-if="scope.row.Item_Status == 0" style="color: red">{{scope.row.Item_Status == '0' ? '未进货' : '已进货'}}</span>
            <span v-else style="color: #606266">{{scope.row.Item_Status == '0' ? '未进货' : '已进货'}}</span>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="sizex split"></div>
    <div class="sizex footer">
      <div class="footer_group">
        <div v-show="!Confirm">
          <el-button class="btnCreate" type="primary" size="small" icon="el-icon-shopping-cart-2" @click="btnOperation('bring')">创建采购推荐单</el-button>
        </div>
        <div v-show="Confirm">
          <el-button class="btnConfirm" type="success" size="small" icon="el-icon-circle-check" @click="btnOperation('')">确定</el-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import { GetItemSaleFor } from "@/common/script/api"
export default {
  data() {
    return {
        item_no: "",
        listData: [],
        multipleSelection: [],
        queryKeyCode: "",
        Confirm: this.$route.query.sheet_no,
        genlist: [],
        ruleMaster: {
            product_no: ''
        }
    }
  },
  methods: {
    // 获取数据
    _queryItemSalesList() {
      this.$indicator.open('数据加载中')
      return GetItemSaleFor({
            start_date: this.$global.start_date,
            shopId: this.$global.shopId,
            region: this.$global.region,
            key: this.$global.key,
            IsTest: this.$global.isTest,
            IsOffline: this.$global.isOffline
        }).then((res) => {
            if (res.Data || res.Data.length > 0) {
                this.listData = res.Data
            }
        })
        .then((res) => {
          setTimeout(() => {
            this.$indicator.close()
          }, 1000)
        })
    },
    rowClassName({ row, rowIndex }) {
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
    headerCellStyle({ row, rowIndex }) {
      if (rowIndex === 0) {
        return "text-align: center;padding: 5px 0"
      }
    },
    cellStyle({ row, column, rowIndex, columnIndex }) {
      if (columnIndex === 5 || columnIndex === 6) {
        return "text-align: right;padding: 5px 0"
      } else {
        return "text-align: center;padding: 5px 0"
      }
    },
    btnOperation(val) {
      // 生成采购推荐单
        if (this.multipleSelection.length <= 0) {
            this.$toast("请选择要生成的商品!")
            return
        }
        if (val === "bring") {
            this.$router.push({
                path: "/Add",
                query: {
                    selectList: this.genlist
                }
            })
        } else {
            this.$router.push({
                path: "/Add",
                query: {
                    selectList: this.genlist,
                    sheet_no: this.$route.query.sheet_no
                }
            })
        }
    },
    btnSearch() {
        if (!this.queryKeyCode) {
            this.$toast("请输入搜索内容!")
        }
    }
  },
  computed: {
    tableData: function () {
        const search = this.queryKeyCode.trim()
        if (search) {
            return this.listData.filter((data) => {
                return data.Item_No === search
            })
        }
        return this.listData
    }
  },
  watch: {
    info(val) {
        this.Confirm = val.sheet_no
    }
  },
  created() {
    this._queryItemSalesList()
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
  background-color: #eeeef5;
}
.sizex {
  width: 80%;
  margin-left: 10%;
}
.header {
  background-color: #bcbcbc;
  height: 30px;
  padding-left: 5px;
  display: flex;
  align-items: center;
  font-size: 13px;
  color: white;
}
.split {
  height: 8px;
  background-color: #f2f2f2;
}
.filter {
  background-color: white;
  height: 40px;
  padding-left: 5px;
  display: flex;
  flex-flow: row nowrap;
  align-items: center;
  justify-content: space-between;
  font-size: 13px;
}
.queryText {
  margin-left: 10px;
}
.el-input {
  height: 32px;
  flex: auto;
}
.btnQuery {
  margin: 0 10px;
}
.grid {
  background-color: white;
  height: 574px;
}
.btnCreate {
  margin-right: 5px;
}
.footer {
  background-color: white;
  height: 40px;
  padding-left: 5px;
  align-items: center;
  font-size: 13px;
  .footer_group {
    float: right;
    margin: 5px 5px;
  }
}
</style>
