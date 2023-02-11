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
        <!-- <template slot-scope="scope">
          {{ scope.$index }}
        </template> -->
      </el-table-column>
      
      <el-table-column width="120" label="主图" style="align:center">
          <template slot-scope="scope">
              <img :src="scope.row.image" width="120" height="60"/>
          </template>
      </el-table-column>

      <el-table-column label="位置" width="100" prop="pos"></el-table-column>
      <el-table-column label="跳转模块" width="100" prop="actionInfo"></el-table-column>
      <el-table-column label="跳转参数" width="100" prop="actionInfo"></el-table-column>
      <el-table-column label="状态" width="100" prop="status"></el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="editbyid(scope.row.id)" >编辑</el-button>
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
import { addBanner, getBannerList } from '@/api/banner'

export default {
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'gray',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      params:{
        page:1,
        pageSize:10,
      },
      list: null,
      listLoading: true,
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getBannerList(this.params).then(response => {
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
