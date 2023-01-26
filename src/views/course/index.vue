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
      
      <el-table-column width="80" label="商品主图" style="align:center">
          <template slot-scope="scope">
              <img :src="scope.row.mainImage" width="60" height="60"/>
          </template>
      </el-table-column>

      <el-table-column label="标题" width="200" prop="title"></el-table-column>
      <el-table-column label="库存" width="95" prop="quantity"></el-table-column>
      <el-table-column label="价格" width="120" prop="title">
        <template slot-scope="scope">
          {{ scope.row.minPrice}} ~ {{ scope.row.maxPrice}}
        </template>
      </el-table-column>
      <el-table-column class-name="status-col" label="Status" width="110" align="center">
        <template slot-scope="scope">
          <el-tag :type="scope.row.status | statusFilter">{{ scope.row.status }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="center" prop="createTime" label="创建时间" width="200">
      </el-table-column>
      <el-table-column label="操作" width="130px">
        <template slot-scope="scope">
          <el-button type="text" icon="el-icon-edit" size="mini" @click="editbyid(scope.row.id)" >编辑</el-button>
          <el-button type="text" icon="el-icon-delete" size="mini" @click="removebyid(scope.row.id)">下架</el-button>
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
import { getCourseList } from '@/api/course'

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
        pageSize:10
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
      getCourseList(this.params).then(response => {
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
