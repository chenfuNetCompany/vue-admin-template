<template>
    <div class="app-container">
      <el-form ref="form" :model="params" text-align="left" label-position="left" :inline="true" >
        <el-form-item label="教练">
          <el-select v-model="params.coachId" placeholder="请选择" clearable>
            <el-option
              v-for="item in coachList"
              :key="item.id"
              :label="item.name"
              :value="item.id">
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="状态">
          <el-select v-model="params.status" placeholder="请选择" clearable>
            <el-option
              v-for="item in statuOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="用户手机">
          <el-input v-model="params.status">确定</el-input>
        </el-form-item> -->
        <el-form-item>
          <el-button type="primary" @click="fetchData">确定</el-button>
        </el-form-item>
      </el-form>
      <el-table
        v-loading="listLoading"
        :data="list"
        element-loading-text="Loading"
        border
        fit
        highlight-current-row
      >
        <el-table-column style="align:center" label="预约ID" width="80" prop="id"></el-table-column>
        <el-table-column style="align:center" label="用户ID" width="80" prop="userId"></el-table-column>
        <el-table-column width="200" label="用户账号" style="align:center" prop="userAccount"></el-table-column>
        <el-table-column width="120" label="用户手机" style="align:center" prop="userMobile"></el-table-column>
        <el-table-column width="120" label="预约名称" style="align:center" prop="assetName"></el-table-column>
        <el-table-column width="120" label="场地" style="align:center" prop="roomName"></el-table-column>
        <el-table-column width="120" label="教练" style="align:center" prop="coachName"></el-table-column>
        <el-table-column width="120" label="状态" style="align:center">
          <template slot-scope="scope">{{statusFilter(scope.row.status)}}</template>
        </el-table-column>
        <el-table-column width="180" label="开始时间" style="align:center" prop="startAt"></el-table-column>
        <el-table-column width="180" label="结束时间" style="align:center" prop="endAt"></el-table-column>
        <el-table-column width="180" label="创建时间" style="align:center" prop="createTime"></el-table-column>
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
  import { getBookingList } from '@/api/booking'
  import { getCoachList } from '@/api/coach'
import { throwStatement } from '@babel/types'
  
  export default {
    data() {
      return {
        params:{
          coachId:null,
          status:null,
          page:1,
          pageSize:10
        },
        list: null,
        listLoading: true,
        total:0,
        coachList:[],
        statuOptions:[
          {value:0,label:'已预约'},
          {value:1,label:'已核销'},
          {value:2,label:'已取消'}
        ],
      }
    },
    created() {
      this.initData()
      this.fetchData()
    },
    methods: {
      async initData(){
        const coachRes = await getCoachList({page:1,pageSize:100})
        if (coachRes.success === true){
          this.coachList = coachRes.data.listData;
        }else{
          this.$message.error('教练列表请求失败')
        }
      },
      async fetchData() {

        this.listLoading = true
        getBookingList(this.params).then(response => {
          this.list = response.data.listData
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

      statusFilter(status) {
        const statusMap = {
          0: '已预约',
          1: '已核销',
          2: '已取消',
        }
        return statusMap[status]
      }
    }
  }
  </script>
  