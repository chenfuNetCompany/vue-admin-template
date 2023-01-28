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
        <el-table-column style="align:center" label="优惠券ID" width="95" prop="couponId"></el-table-column>
        <el-table-column width="120" label="优惠券名称" style="align:center" prop="couponName"></el-table-column>
        <el-table-column width="120" label="优惠券金额" style="align:center" prop="couponVal"></el-table-column>
        <el-table-column width="200" label="用户账号" prop="userAccount"></el-table-column>
        <el-table-column width="120" label="用户手机" prop="userMobile"></el-table-column>
        <el-table-column width="120" label="状态" prop="statusText"></el-table-column>
        <el-table-column width="120" label="获取时间" prop="createTime"></el-table-column>
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
  import { promotionlist, distCoupon,  couponMemberList} from '@/api/promotion'
  
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
        total:0
      }
    },
    created() {
      this.fetchData()
    },
    methods: {
      fetchData() {
        this.listLoading = true
        couponMemberList(this.params).then(response => {
          this.list = response.data.listData
          this.total = response.data.totalCount
          this.listLoading = false
          this.list.forEach(element => {
            element["statusText"] = this.statusFilter(element.status);
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

      statusFilter(status) {
        const statusMap = {
          1: '可使用',
          2: '已使用',
          3: '已过期',
        }
        return statusMap[status]
      }
    }
  }
  </script>
  