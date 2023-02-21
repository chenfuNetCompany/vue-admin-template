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
      <el-table-column align="center" label="ID" width="95" prop="id">
      </el-table-column>
      <el-table-column label="账户名称" width="200" prop="account"></el-table-column>
      <el-table-column label="角色名称" width="95" prop="roleList[0].name"></el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-delete" size="mini" @click="removebyid(scope.row.id)">删除</el-button>
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
import { deleteAccount, getAccountList } from '@/api/account'

export default {
  data() {
    return {
      params:{
        page:1,
        pageSize:10,
      },
      deleteVo: {
        id: 0
      },
      list: null,
      listLoading: true,
      total:0
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getAccountList(this.params).then(response => {
        console.log(JSON.stringify(response))
        this.list = response.data.listData
        this.total = response.data.totalCount
        this.listLoading = false
      })
    },
    removebyid(item) {
      console.log(JSON.stringify(item))
      this.listLoading = true
      this.deleteVo.id = item
      deleteAccount(this.deleteVo).then(response => {
        console.log(JSON.stringify(response))
        if (response.success){
          alert('删除成功')
          this.fetchData()
        }
      }).finally(
        this.listLoading = false
      )
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
