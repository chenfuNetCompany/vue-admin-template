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
        <el-table-column style="align:center" label="用户ID" width="95" prop="userId"></el-table-column>
        <el-table-column width="200" label="用户账号" style="align:center" prop="userAccount"></el-table-column>
        <el-table-column width="120" label="用户手机" style="align:center" prop="userMobile"></el-table-column>
        <el-table-column width="120" label="资产类别" style="align:center" prop="cateName"></el-table-column>
        <el-table-column width="120" label="资产ID" style="align:center" prop="assetId"></el-table-column>
        <el-table-column width="120" label="资产名称" style="align:center" prop="goodName"></el-table-column>
        <el-table-column label="资产数量" width="120" prop="quantity"></el-table-column>
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
  import { customerlist, customerAssetlist } from '@/api/customer'
  
  export default {
    data() {
      return {
        params:{
          cateId:1,
          page:1,
          pageSize:10
        },
        list: null,
        listLoading: true,
        total:0,
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        customerAssetlist(this.params).then(response => {
          this.list = response.data.listData
          this.total = response.data.totalCount
          this.listLoading = false
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
    }
  }
  </script>
  