<template>
  <div class="app-container">
    <el-table v-loading="listLoading" :data="subjectList" border fit>
      <el-table-column label="ID" width="95" prop="id"></el-table-column>
      <el-table-column label="测试类目" width="100" prop="cateName"></el-table-column>
      <el-table-column label="测试项目" width="100" prop="subjectName"></el-table-column>
      <el-table-column label="测试指标" width="100" prop="indexName"></el-table-column>
      <el-table-column label="训练人" width="100" prop="personName"></el-table-column>
      <el-table-column label="成绩" width="100" prop="record"></el-table-column>
      <el-table-column label="教练账号" width="100" prop="creatorAccount"></el-table-column>
      <el-table-column label="测试时间" width="180" prop="time"></el-table-column>
      <el-table-column label="创建时间" width="180" prop="createTime"></el-table-column>
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
import { getRecordList } from '@/api/exam'

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
      listLoading: false,
      subjectList:[],
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      this.listLoading = true
      getRecordList(this.params).then(response => {
        this.subjectList = response.data.listData
        this.total = response.data.totalCount
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
