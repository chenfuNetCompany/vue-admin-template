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
        <el-table-column style="align:center" label="ID" width="95" prop="id"></el-table-column>
        <!-- <el-table-column style="align:center" label="类型" width="95">
          <template slot-scope="scope">{{flowTypeFilter(scope.row.flowType)}}</template>
        </el-table-column> -->
        <el-table-column label="变化数量" width="120" prop="change"></el-table-column>
        <el-table-column style="align:center" label="业务类型" width="95">
          <template slot-scope="scope">{{bizTypeFilter(scope.row.bizType)}}</template>
        </el-table-column>
        <el-table-column style="align:center" label="业务ID" width="95" prop="userId"></el-table-column>
        <el-table-column style="align:center" label="发生时间" width="180" prop="createTime"></el-table-column>
        <el-table-column style="align:center" label="用户ID" width="95" prop="userId"></el-table-column>
        <el-table-column width="200" label="用户账号" style="align:center" prop="userAccount"></el-table-column>
        <el-table-column width="120" label="用户手机" style="align:center" prop="userMobile"></el-table-column>
        <el-table-column width="120" label="资产ID" style="align:center" prop="assetId"></el-table-column>
        <el-table-column width="120" label="资产名称" style="align:center" prop="goodName"></el-table-column>
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
  import { customerlist, customerAssetlist, customerAssetFlowlist } from '@/api/customer'
  import {validObj} from '@/utils/validate'
  
  export default {
    data() {
      return {
        params:{
          userId:0,
          page:1,
          pageSize:10
        },
        list: null,
        listLoading: true,
        total:0,
      }
    },
    created() {

      let params = this.$route.query;
      if (validObj(params) ){
        this.params.userId = params.userId;
        this.params.assetId = params.assetId;
      }else{
        this.$message.error("路径参数缺失")
        return;
      }

      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        customerAssetFlowlist(this.params).then(response => {
          this.list = response.data.listData
          this.total = response.data.totalCount
          this.listLoading = false
          this.list.forEach(element => {
            if (element.flowType === 1){
              element.change = "+" + element.quantity
            }else if (element.flowType === 2){
              element.change = "-" + element.quantity
            }
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

      flowTypeFilter(status) {
        const statusMap = {
          1: '增加',
          2: '减少',
        }
        return statusMap[status]
      },

      bizTypeFilter(status) {
        const statusMap = {
          1: '购买',
          2: '预约课程',
          3: '订单退款',
          4: '订单退款取消',
          5: '预约课程取消',
        }
        return statusMap[status]
      }
    }
  }
  </script>
  