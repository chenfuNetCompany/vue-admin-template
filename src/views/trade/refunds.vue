<template>
    <div class="app-container">
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column style="align:center" label="交易订单ID" width="95" prop="orderId"></el-table-column>
        <el-table-column width="120" label="商品主图" style="align:center" prop="goodImage">
          <template slot-scope="scope">
              <img :src="scope.row.goodImage" width="60" height="60"/>
          </template>
        </el-table-column>
        <el-table-column width="120" label="商品标题" style="align:center" prop="goodName"></el-table-column>
        <el-table-column width="120" label="退款金额" prop="amount"></el-table-column>
        <el-table-column width="200" label="买家账号" prop="userAccount"></el-table-column>
        <el-table-column width="120" label="买家手机" prop="userMobile"></el-table-column>
        <el-table-column width="120" label="退款状态" prop="statusText"></el-table-column>
        <el-table-column label="操作" width="130px">
          <template slot-scope="scope">
            <el-button v-show = 'scope.row.status === 1' type="text" icon="el-icon-edit" size="mini" @click="arrpovalbyid(scope.row.id)" >通过</el-button>
            <el-button v-show = 'scope.row.status === 1' type="text" icon="el-icon-edit" size="mini" @click="refusebyid(scope.row.id)" >拒绝</el-button>
            <el-button v-show = 'scope.row.status === 2' type="text" icon="el-icon-edit" size="mini" @click="dorefundbyid(scope.row.id)" >退款</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="params.page"
        :page-size="params.pageSize"
        :page-sizes="[5, 10, 15, 20]"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
    </div>
  </template>
  
  <script>
  import { orderList, refundList, approvalRefund, refuseRefund, doRefund} from '@/api/trade'
  
  export default {
    // filters: {
    //   statusFilter(status) {
    //     const statusMap = {
    //       0: '正常',
    //     }
    //     return statusMap[status]
    //   }
    // },
    data() {
      return {
        params:{
          page:1,
          pageSize:10
        },
        list: null,
        listLoading: true,
        total:0,
        dialogOrderVisible:false,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        refundList(this.params).then(response => {
          this.list = response.data.listData
          this.total = response.data.totalCount
          this.listLoading = false
          this.list.forEach(element => {
              element.statusText = this.statusFilter(element.status)
          });
        })
      },
      
      handleSizeChange(newsize){
        this.params.pageSize=newsize
        this.fetchData()
      },
  
      handleCurrentChange(newpage){
        this.params.page=newpage
        this.fetchData()
      },

      dorefundbyid(id){
        doRefund({refundId:id}).then(response =>{
          if (response.success){
            this.$message.success('操作成功')
            this.fetchData()
          }
        })
      },

      arrpovalbyid(id){
        approvalRefund({refundId:id}).then(response =>{
          if (response.success){
            this.$message.success('操作成功')
            this.fetchData()
          }
        })
      },
      
      refusebyid(id){
        refuseRefund({refundId:id}).then(response =>{
          if (response.success){
            this.$message.success('操作成功')
            this.fetchData()
          }
        })
      },

      statusFilter(status) {
        const statusMap = {
          1: '待审核',
          2: '审核通过',
          3: '退款成功',
          4: '退款失败',
          100: '已拒绝',
          101: '已取消',
        }
        return statusMap[status]
      }
    }
  }
  </script>
  